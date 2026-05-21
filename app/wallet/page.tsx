import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wallet',
  description: 'Your Mitraa coin balance and recent transactions.',
};

/**
 * Web wallet placeholder. Phase 9 plan:
 *   - On load, check for app JWT in sessionStorage; redirect to /login if absent
 *   - Fetch GET /api/wallet from backend, render balance + last 20 transactions
 *   - Buy more button -> /coins
 */
export default function WalletPage() {
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-20">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Your wallet</h1>
      <p className="text-text-dim mb-7">
        Once web sign-in is live, your coin balance and transaction history will
        appear here. The same wallet powers calls inside the Mitraa app.
      </p>
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <h2 className="text-base font-semibold mb-2">Coming soon</h2>
        <p className="text-text-dim text-sm m-0">
          For now, open the Mitraa app and tap the wallet icon to see your balance.
        </p>
      </div>
      <p className="mt-8 text-text-muted text-sm">
        Want to top up?{' '}
        <Link href="/coins/" className="text-brand hover:underline">See coin packs &rarr;</Link>
      </p>
    </main>
  );
}
