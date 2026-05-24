'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  type ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { apiFetch, ApiFetchError } from '@/lib/api';
import { setJwt, setUser, type SessionUser } from '@/lib/session';

type Step = 'phone' | 'otp' | 'success';

interface VerifyOtpResponse {
  ok: true;
  token: string;
  user: SessionUser & { isNew: boolean };
}

function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (raw.trim().startsWith('+')) return '+' + digits;
  // Default Indian +91 if the user typed a 10-digit number
  if (digits.length === 10) return '+91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  return '+' + digits;
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

  // Hold the in-flight Firebase confirmation result + the verifier across renders.
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      verifierRef.current?.clear();
      verifierRef.current = null;
    };
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

      setBusy(true);
      try {
        const auth = getFirebaseAuth();

        if (!verifierRef.current) {
          verifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
          });
        }

        const confirmation = await signInWithPhoneNumber(
          auth,
          normalised,
          verifierRef.current,
        );
        confirmationRef.current = confirmation;
        setStep('otp');
      } catch (err) {
        // Reset reCAPTCHA on failure so the next attempt isn't poisoned
        try {
          verifierRef.current?.clear();
        } catch {
          // ignore
        }
        verifierRef.current = null;
        setError(firebaseFriendlyError(err));
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
      if (!confirmationRef.current) {
        setError('Session expired. Please request a new OTP.');
        setStep('phone');
        return;
      }

      setBusy(true);
      try {
        const credential = await confirmationRef.current.confirm(otp);
        const idToken = await credential.user.getIdToken();

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
        setError(firebaseFriendlyError(err));
      } finally {
        setBusy(false);
      }
    },
    [otp, router, next],
  );

  if (step === 'success') {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <p className="m-0">You&apos;re in. Redirecting…</p>
      </div>
    );
  }

  return (
    <>
      <div id="recaptcha-container" />

      {step === 'phone' && (
        <form onSubmit={sendOtp} className="rounded-xl border border-border bg-bg-elev p-6">
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="9000000001"
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

          {error && (
            <p className="text-sm text-red-400 mb-4" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy || phone.trim().length === 0}
            className="btn btn-primary w-full text-center"
          >
            {busy ? 'Sending OTP…' : 'Send OTP'}
          </button>
        </form>
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

function firebaseFriendlyError(err: unknown): string {
  if (err instanceof ApiFetchError) {
    if (err.error.code === 'INVALID_FIREBASE_TOKEN') return 'OTP verification failed. Try again.';
    if (err.error.code === 'USER_BANNED') return 'This account has been suspended. Contact support.';
    return err.message || 'Sign-in failed. Please try again.';
  }
  if (err instanceof Error) {
    // Firebase error codes look like 'auth/invalid-phone-number'
    const code = (err as { code?: string }).code ?? '';
    if (code === 'auth/invalid-phone-number') return 'That phone number doesn\'t look right.';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please try again later.';
    if (code === 'auth/invalid-verification-code') return 'Wrong code. Please re-check the SMS.';
    if (code === 'auth/code-expired') return 'Code expired. Request a new one.';
    if (code === 'auth/captcha-check-failed') return 'reCAPTCHA failed. Refresh the page and try again.';
    if (code === 'auth/quota-exceeded') return 'Daily SMS limit reached. Try again tomorrow.';
    if (code === 'auth/operation-not-allowed')
      return 'Phone sign-in is temporarily unavailable. Please try again in a few minutes.';
    if (code === 'auth/unauthorized-domain')
      return 'This domain is not authorised yet. Please contact support.';
    if (code === 'auth/missing-recaptcha-token' || code === 'auth/network-request-failed')
      return 'Network issue verifying reCAPTCHA. Check your connection and try again.';
    return err.message;
  }
  return 'Sign-in failed. Please try again.';
}
