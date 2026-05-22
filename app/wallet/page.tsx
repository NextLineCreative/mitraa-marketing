import type { Metadata } from 'next';
import WalletClient from './WalletClient';

export const metadata: Metadata = {
  title: 'Wallet',
  description: 'Your Mitraa coin balance and recent transactions.',
};

export default function WalletPage() {
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-20">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Your wallet</h1>
      <p className="text-text-dim mb-7">
        Top up here on the web — the balance is the same one you see inside the
        Mitraa app.
      </p>
      <WalletClient />
    </main>
  );
}
