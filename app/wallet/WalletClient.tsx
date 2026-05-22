'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, ApiFetchError } from '@/lib/api';
import { clearSession, getJwt, getUser } from '@/lib/session';

interface WalletResponse {
  ok: true;
  wallet: {
    balanceCoins: string;
    lifetimeRechargedCoins: string;
    lifetimeSpentCoins: string;
    hostEarnedCoins: string;
    hostWithdrawableCoins: string;
  };
  transactions: Array<{
    id: string;
    type: string;
    direction: 'credit' | 'debit';
    amountCoins: string;
    balanceAfter: string;
    status: string;
    referenceType: string | null;
    referenceId: string | null;
    createdAt: string;
  }>;
}

const TYPE_LABEL: Record<string, string> = {
  recharge: 'Recharge',
  call_charge: 'Call charge',
  gift_sent: 'Gift sent',
  gift_received: 'Gift received',
  host_earning: 'Host earning',
  withdrawal: 'Withdrawal',
  refund: 'Refund',
  admin_adjustment: 'Adjustment',
};

const STATUS_TONE: Record<string, string> = {
  success: 'text-emerald-400',
  pending: 'text-amber-400',
  failed: 'text-red-400',
  refunded: 'text-text-dim',
};

export default function WalletClient() {
  const router = useRouter();
  const [data, setData] = useState<WalletResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getJwt()) {
      router.replace('/login/?next=/wallet/');
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const w = await apiFetch<WalletResponse>('/api/wallet');
        if (!cancelled) setData(w);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiFetchError && err.status === 401) {
          router.replace('/login/?next=/wallet/');
          return;
        }
        setError(err instanceof Error ? err.message : 'Could not load wallet');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const user = getUser();

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-8 text-text-dim">
        Loading your wallet…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <p className="m-0 text-red-400">{error}</p>
        <button
          onClick={() => location.reload()}
          className="btn btn-ghost mt-4"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!data) return null;

  return (
    <>
      <section className="rounded-xl border border-border bg-bg-elev p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-text-muted mb-1">
              Wallet balance
            </div>
            <div className="text-[2.4rem] font-bold tracking-tight leading-none mb-1">
              {Number(data.wallet.balanceCoins).toLocaleString('en-IN')}
              <span className="text-text-dim text-base font-semibold ml-2">coins</span>
            </div>
            {user?.phone && (
              <p className="text-sm text-text-muted m-0">Signed in as {user.phone}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/coins/" className="btn btn-primary">Top up</Link>
            <button
              onClick={() => {
                clearSession();
                router.replace('/');
              }}
              className="btn btn-ghost"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-sm">
          <Stat label="Total recharged" value={data.wallet.lifetimeRechargedCoins} />
          <Stat label="Total spent"     value={data.wallet.lifetimeSpentCoins} />
          {Number(data.wallet.hostEarnedCoins) > 0 && (
            <>
              <Stat label="Host earned"      value={data.wallet.hostEarnedCoins} />
              <Stat label="Withdrawable"     value={data.wallet.hostWithdrawableCoins} />
            </>
          )}
        </div>
      </section>

      <h2 className="text-lg font-semibold mb-3">Recent activity</h2>
      {data.transactions.length === 0 ? (
        <p className="text-text-muted text-sm">
          No transactions yet.{' '}
          <Link href="/coins/" className="text-brand hover:underline">Buy your first coin pack</Link>.
        </p>
      ) : (
        <ul className="rounded-xl border border-border divide-y divide-border overflow-hidden">
          {data.transactions.map((t) => (
            <li key={t.id} className="bg-bg-elev px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-sm">{TYPE_LABEL[t.type] ?? t.type}</div>
                <div className="text-xs text-text-muted">
                  {new Date(t.createdAt).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {t.status !== 'success' && (
                    <span className={`ml-2 ${STATUS_TONE[t.status] ?? 'text-text-dim'}`}>
                      · {t.status}
                    </span>
                  )}
                </div>
              </div>
              <div className={`font-semibold ${t.direction === 'credit' ? 'text-emerald-400' : 'text-text'}`}>
                {t.direction === 'credit' ? '+' : '−'}
                {Number(t.amountCoins).toLocaleString('en-IN')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <div className="text-[0.7rem] uppercase tracking-wide text-text-muted">{label}</div>
      <div className="text-base font-semibold">{Number(value).toLocaleString('en-IN')}</div>
    </div>
  );
}
