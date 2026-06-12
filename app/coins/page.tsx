import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CoinsClient from './CoinsClient';

export const metadata: Metadata = {
  title: 'Buy Coins',
  description: 'Top up your Mitraa wallet to keep the conversation going.',
};

// Always evaluate the admin kill-switch per request (no static caching).
export const dynamic = 'force-dynamic';

/** Admin kill-switch: the feature_flags.webCoinsPage toggle (Admin → Config →
 *  Feature flags) removes this page in one click — it redirects home within
 *  seconds of the toggle. Fails OPEN (page shows) on any API hiccup. */
async function coinsPageEnabled(): Promise<boolean> {
  try {
    const r = await fetch('https://api.mitraa.shop/api/app/status', {
      cache: 'no-store',
    });
    if (!r.ok) return true;
    const j = (await r.json()) as {
      config?: { feature_flags?: Record<string, boolean> };
    };
    return j.config?.feature_flags?.webCoinsPage !== false;
  } catch {
    return true;
  }
}

export default async function CoinsPage() {
  if (!(await coinsPageEnabled())) redirect('/');
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-16">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Buy Mitraa coins</h1>
      <p className="text-text-dim mb-7">
        Top up your wallet on the web — they&apos;ll appear instantly in the app once
        you&apos;re signed in with the same phone number.
      </p>

      <CoinsClient />

      <p className="text-text-muted text-xs mt-8">
        Prices include applicable taxes. Coins are non-refundable except under our{' '}
        <a href="/refund/" className="text-brand hover:underline">refund policy</a>.
        Web purchases are processed by Razorpay once enabled; in-app purchases are
        processed by Google Play Billing.
      </p>
    </main>
  );
}
