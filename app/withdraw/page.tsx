import type { Metadata } from 'next';
import WithdrawClient from './WithdrawClient';

export const metadata: Metadata = {
  title: 'Withdraw Earnings',
  description: 'Request a payout of your Mitraa host earnings via UPI or bank transfer.',
};

export default function WithdrawPage() {
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-20">
      <h1 className="text-[2rem] font-bold tracking-tight mb-2">Withdraw earnings</h1>
      <p className="text-text-dim mb-7">
        Cash out your host earnings via UPI or bank transfer. Minimum ₹1,000 per
        request (1,000 coins). Payouts are reviewed and processed within 3–5 working
        days.
      </p>
      <WithdrawClient />
    </main>
  );
}
