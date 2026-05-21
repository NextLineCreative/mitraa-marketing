import type { Metadata } from 'next';
import CoinsClient from './CoinsClient';

export const metadata: Metadata = {
  title: 'Buy Coins',
  description: 'Top up your Mitraa wallet to keep the conversation going.',
};

export default function CoinsPage() {
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
