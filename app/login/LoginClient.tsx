'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, ApiFetchError } from '@/lib/api';
import { setJwt, setUser, type SessionUser } from '@/lib/session';

// MSG91 OTP widget (same widget as the mobile app). Client-side values — they
// live in the page by design, like the Firebase web config did.
const WIDGET_ID = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID ?? '';
const TOKEN_AUTH = process.env.NEXT_PUBLIC_MSG91_WIDGET_TOKEN ?? '';

declare global {
  interface Window {
    initSendOTP?: (config: Record<string, unknown>) => void;
    sendOtp?: (
      identifier: string,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
    verifyOtp?: (
      otp: string,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
    retryOtp?: (
      channel: unknown,
      success: (data: unknown) => void,
      failure: (error: unknown) => void,
    ) => void;
  }
}

type Step = 'phone' | 'otp' | 'success';

interface VerifyOtpResponse {
  ok: true;
  token: string;
  user: SessionUser & { isNew: boolean };
}

function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (raw.trim().startsWith('+')) return '+' + digits;
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  return '+' + digits;
}

/** Pull the access-token / message string out of an MSG91 callback payload. */
function msgValue(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const m = data as Record<string, unknown>;
    const v = m.message ?? m['access-token'] ?? m.accessToken ?? m.token;
    return v != null ? String(v) : null;
  }
  return null;
}

function msgError(err: unknown): string {
  if (err instanceof ApiFetchError) {
    if (err.error.code === 'OTP_TOKEN_INVALID') return 'OTP verification failed. Try again.';
    if (err.error.code === 'USER_BANNED') return 'This account has been suspended. Contact support.';
    return err.message || 'Sign-in failed. Please try again.';
  }
  if (typeof err === 'string' && err.trim()) return err;
  if (err && typeof err === 'object') {
    const m = err as Record<string, unknown>;
    const msg = m.message ?? m.error ?? m.type;
    if (msg != null) return String(msg);
  }
  return 'Something went wrong. Please try again.';
}

function googleError(err: unknown): string {
  const code = (err as { code?: string } | null)?.code;
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request')
    return 'Google sign-in was cancelled.';
  if (code === 'auth/popup-blocked')
    return 'Your browser blocked the sign-in popup. Allow popups for this site and try again.';
  if (code === 'auth/unauthorized-domain')
    return 'This site is not authorised for Google sign-in yet. Please use phone login or contact support.';
  return msgError(err);
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/wallet/';

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const widgetReady = useRef(false);

  // Load the MSG91 OTP widget script once + initialise it with exposeMethods so
  // we can drive send/verify from our own UI.
  useEffect(() => {
    if (!WIDGET_ID || !TOKEN_AUTH) {
      setError('Login is temporarily unavailable. Please try again later.');
      return;
    }
    const init = () => {
      if (window.initSendOTP && !widgetReady.current) {
        window.initSendOTP({
          widgetId: WIDGET_ID,
          tokenAuth: TOKEN_AUTH,
          exposeMethods: true,
          success: () => {},
          failure: () => {},
        });
        widgetReady.current = true;
      }
    };
    // Already loaded (e.g. client-side nav back to /login) — just init.
    if (window.initSendOTP) {
      init();
      return;
    }
    if (document.getElementById('msg91-otp-provider')) return;
    // MSG91's recommended loader: try the primary CDN, fall back to phone91.
    const urls = [
      'https://verify.msg91.com/otp-provider.js',
      'https://verify.phone91.com/otp-provider.js',
    ];
    let idx = 0;
    const attempt = () => {
      const s = document.createElement('script');
      s.id = 'msg91-otp-provider';
      s.src = urls[idx];
      s.async = true;
      s.onload = init;
      s.onerror = () => {
        s.remove();
        idx += 1;
        if (idx < urls.length) attempt();
        else setError('Could not load the OTP service. Please refresh and try again.');
      };
      document.head.appendChild(s);
    };
    attempt();
  }, []);

  const sendOtp = useCallback(
    async (evt: React.FormEvent) => {
      evt.preventDefault();
      setError(null);
      const normalised = normalisePhone(phone);
      if (!/^\+\d{10,15}$/.test(normalised)) {
        setError('Please enter a valid phone number (10 digits for India).');
        return;
      }
      if (!window.sendOtp) {
        setError('OTP service is still loading. Please wait a moment and retry.');
        return;
      }
      setBusy(true);
      try {
        // MSG91 wants country code + number, no leading +.
        const mobile = normalised.replace(/\D/g, '');
        await new Promise<void>((resolve, reject) => {
          window.sendOtp!(mobile, () => resolve(), (e) => reject(e));
        });
        setStep('otp');
      } catch (err) {
        setError(msgError(err));
      } finally {
        setBusy(false);
      }
    },
    [phone],
  );

  const verifyOtp = useCallback(
    async (evt: React.FormEvent) => {
      evt.preventDefault();
      setError(null);
      if (!/^\d{4,8}$/.test(otp)) {
        setError('Enter the 6-digit code we sent you.');
        return;
      }
      if (!window.verifyOtp) {
        setError('Session expired. Please request a new OTP.');
        setStep('phone');
        return;
      }
      setBusy(true);
      try {
        const accessToken = await new Promise<string>((resolve, reject) => {
          window.verifyOtp!(
            otp,
            (data) => {
              const token = msgValue(data);
              if (token) resolve(token);
              else reject(new Error('Verification returned no token.'));
            },
            (e) => reject(e),
          );
        });

        // Backend re-verifies the token with MSG91 + issues our JWT (same
        // endpoint the mobile app uses).
        const result = await apiFetch<VerifyOtpResponse>(
          '/api/auth/otp/msg91/verify-token',
          { method: 'POST', body: { accessToken }, authed: false },
        );

        setJwt(result.token);
        setUser(result.user);
        setStep('success');
        router.replace(next);
      } catch (err) {
        setError(msgError(err));
      } finally {
        setBusy(false);
      }
    },
    [otp, router, next],
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      // Lazy-load Firebase only when Google is actually used (keeps it out of
      // the main login bundle, which is MSG91-only).
      const [{ GoogleAuthProvider, signInWithPopup }, { getFirebaseAuth }] =
        await Promise.all([import('firebase/auth'), import('@/lib/firebase')]);
      const cred = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      const idToken = await cred.user.getIdToken();
      // Same backend endpoint the mobile Google sign-in uses: it verifies the
      // Firebase ID token and issues our app JWT.
      const result = await apiFetch<VerifyOtpResponse>('/api/auth/verify-otp', {
        method: 'POST',
        body: { idToken },
        authed: false,
      });
      setJwt(result.token);
      setUser(result.user);
      setStep('success');
      router.replace(next);
    } catch (err) {
      setError(googleError(err));
    } finally {
      setBusy(false);
    }
  }, [router, next]);

  if (step === 'success') {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <p className="m-0">You&apos;re in. Redirecting…</p>
      </div>
    );
  }

  return (
    <>
      {step === 'phone' && (
        <div className="rounded-xl border border-border bg-bg-elev p-6">
          <form onSubmit={sendOtp}>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={busy}
              required
              className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text
                         placeholder:text-text-muted focus:outline-none focus:border-brand
                         disabled:opacity-60"
            />
            <p className="text-xs text-text-muted mt-2 mb-5">
              We&apos;ll send you a one-time code by SMS. Indian numbers don&apos;t need the +91 prefix.
            </p>
            <button
              type="submit"
              disabled={busy || phone.trim().length === 0}
              className="btn btn-primary w-full text-center"
            >
              {busy ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
                       border border-border bg-bg text-text font-medium
                       hover:border-text-muted disabled:opacity-60 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
              <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
            </svg>
            Continue with Google
          </button>

          {error && (
            <p className="text-sm text-red-400 mt-4" role="alert">{error}</p>
          )}
        </div>
      )}

      {step === 'otp' && (
        <form onSubmit={verifyOtp} className="rounded-xl border border-border bg-bg-elev p-6">
          <label htmlFor="otp" className="block text-sm font-medium mb-2">
            Enter the 6-digit code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            disabled={busy}
            required
            maxLength={8}
            className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text
                       text-center text-xl tracking-[0.4em] placeholder:text-text-muted
                       focus:outline-none focus:border-brand disabled:opacity-60"
          />
          <p className="text-xs text-text-muted mt-2 mb-5">
            Sent to <strong className="text-text">{normalisePhone(phone)}</strong>.{' '}
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError(null);
              }}
              className="text-brand underline-offset-2 hover:underline"
            >
              Change number
            </button>
          </p>

          {error && (
            <p className="text-sm text-red-400 mb-4" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy || otp.length < 4}
            className="btn btn-primary w-full text-center"
          >
            {busy ? 'Verifying…' : 'Verify and sign in'}
          </button>
        </form>
      )}
    </>
  );
}
