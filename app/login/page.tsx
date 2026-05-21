import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Mitraa account on the web.',
};

/**
 * Web login placeholder. Phase 9 plan:
 *   1. Add Firebase Web SDK init in app/firebase-web.ts
 *   2. Add an OtpForm client component here with verifyPhoneNumber + signInWithCredential
 *   3. POST the Firebase idToken to /api/auth/verify-otp (backend), store the app JWT
 *      in sessionStorage, redirect to /wallet
 */
export default function LoginPage() {
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-20">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Sign in</h1>
      <p className="text-text-dim mb-7">
        Web sign-in is part of the upcoming web-checkout release. For now, please use
        the Mitraa mobile app to sign in with your phone number.
      </p>
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <h2 className="text-base font-semibold mb-2">Coming soon</h2>
        <p className="text-text-dim text-sm m-0">
          You&apos;ll enter your phone number, receive a one-time password by SMS,
          and your wallet will be ready on the web. The same account works in the
          app and on this site.
        </p>
      </div>
      <p className="mt-8 text-text-muted text-sm">
        Already signed in on the app? Your balance is always visible there.
        Need help? Email{' '}
        <Link href="/refund/" className="text-brand hover:underline">support</Link>.
      </p>
    </main>
  );
}
