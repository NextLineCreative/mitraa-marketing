import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your Mitraa account on the web.',
};

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-6 pt-14 pb-20">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Sign in</h1>
      <p className="text-text-dim mb-7">
        We use your phone number — the same one you use in the Mitraa app. No
        passwords to remember.
      </p>
      <Suspense
        fallback={
          <div className="rounded-xl border border-border bg-bg-elev p-6 text-text-dim">
            Loading…
          </div>
        }
      >
        <LoginClient />
      </Suspense>
      <p className="mt-8 text-text-muted text-xs">
        By signing in you agree to our{' '}
        <a href="/terms/" className="text-text-dim hover:text-text underline-offset-2 hover:underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy/" className="text-text-dim hover:text-text underline-offset-2 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </main>
  );
}
