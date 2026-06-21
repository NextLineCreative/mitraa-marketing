'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, ApiFetchError } from '@/lib/api';
import { clearSession, getJwt, getUser } from '@/lib/session';

// ─── API shapes ─────────────────────────────────────────────────────────────

interface WalletResp {
  ok: true;
  wallet: {
    hostWithdrawableCoins: string;
    hostEarnedCoins: string;
  };
}

interface Withdrawal {
  id: string;
  coinsRequested: number;
  amountInr: number;
  method: 'upi' | 'bank_transfer';
  upiId: string | null;
  bankAccountNumber: string | null;
  bankIfsc: string | null;
  bankHolderName: string | null;
  status: 'pending' | 'processing' | 'paid' | 'rejected';
  rejectionReason: string | null;
  transactionReference: string | null;
  createdAt: string;
  processedAt: string | null;
}

interface WithdrawalsResp {
  ok: true;
  items: Withdrawal[];
  minCoins: number;
}

interface RequestResp {
  ok: true;
  withdrawalId: string;
  coinsRequested: number;
  amountInr: number;
  status: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<Withdrawal['status'], string> = {
  pending: 'Under review',
  processing: 'Processing',
  paid: 'Paid',
  rejected: 'Rejected',
};

const STATUS_COLOR: Record<Withdrawal['status'], string> = {
  pending: 'text-amber-400',
  processing: 'text-sky-400',
  paid: 'text-emerald-400',
  rejected: 'text-red-400',
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtCoins(n: number) {
  return n.toLocaleString('en-IN');
}

// Mask a UPI handle for the history list so the full payout identifier is not
// shown in plaintext (MKTG-03). e.g. 'rahul123@oksbi' -> 'ra···@oksbi'.
function maskUpi(upi: string | null): string {
  if (!upi) return '';
  const at = upi.lastIndexOf('@');
  if (at <= 0) {
    // No recognisable @bank suffix — keep only the first two chars.
    return upi.length <= 2 ? '··' : `${upi.slice(0, 2)}···`;
  }
  const local = upi.slice(0, at);
  const suffix = upi.slice(at); // includes the '@'
  const prefix = local.length <= 2 ? local : local.slice(0, 2);
  return `${prefix}···${suffix}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WithdrawClient() {
  const router = useRouter();

  // Wallet
  const [wallet, setWallet] = useState<WalletResp['wallet'] | null>(null);
  const [minCoins, setMinCoins] = useState(1000);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form
  const [method, setMethod] = useState<'upi' | 'bank_transfer'>('upi');
  const [coins, setCoins] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAcc, setBankAcc] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [formErr, setFormErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [w, d] = await Promise.all([
        apiFetch<WalletResp>('/api/wallet'),
        apiFetch<WithdrawalsResp>('/api/withdrawals/me'),
      ]);
      setWallet(w.wallet);
      setMinCoins(d.minCoins);
      setHistory(d.items);
    } catch (err) {
      if (err instanceof ApiFetchError && err.status === 401) {
        router.replace('/login/?next=/withdraw/');
        return;
      }
      if (err instanceof ApiFetchError && err.status === 403) {
        setLoadErr('This page is for approved Mitraa hosts only. Open the app and apply to become a host.');
        return;
      }
      // Do not echo raw server error text on this financial surface (MKTG-04).
      setLoadErr('Could not load your wallet. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!getJwt()) {
      router.replace('/login/?next=/withdraw/');
      return;
    }
    load();
  }, [router, load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(null);
    setSuccess(null);

    const coinsNum = parseInt(coins, 10);
    if (!coinsNum || coinsNum < minCoins) {
      setFormErr(`Minimum withdrawal is ${fmtCoins(minCoins)} coins.`);
      return;
    }
    const withdrawable = parseInt(wallet?.hostWithdrawableCoins ?? '0', 10);
    if (coinsNum > withdrawable) {
      setFormErr(`You only have ${fmtCoins(withdrawable)} withdrawable coins.`);
      return;
    }

    if (method === 'upi') {
      if (!upiId.trim()) { setFormErr('UPI ID is required.'); return; }
      if (!/^[a-zA-Z0-9.\-_+]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim())) {
        setFormErr('Enter a valid UPI ID (e.g. name@upi).');
        return;
      }
    } else {
      if (!bankAcc.trim()) { setFormErr('Account number is required.'); return; }
      if (!bankIfsc.trim()) { setFormErr('IFSC code is required.'); return; }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIfsc.trim().toUpperCase())) {
        setFormErr('Enter a valid 11-character IFSC code (e.g. HDFC0001234).');
        return;
      }
      if (!bankName.trim()) { setFormErr('Account holder name is required.'); return; }
    }

    setSubmitting(true);
    try {
      const body =
        method === 'upi'
          ? { method: 'upi' as const, coins: coinsNum, upiId: upiId.trim() }
          : {
              method: 'bank_transfer' as const,
              coins: coinsNum,
              bankAccountNumber: bankAcc.trim(),
              bankIfsc: bankIfsc.trim().toUpperCase(),
              bankHolderName: bankName.trim(),
            };
      const r = await apiFetch<RequestResp>('/api/withdrawals/request', { method: 'POST', body });
      setSuccess(
        `Withdrawal of ${fmtCoins(r.coinsRequested)} coins (₹${r.amountInr.toLocaleString('en-IN')}) submitted. We'll process it within 3–5 working days.`,
      );
      setCoins('');
      setUpiId('');
      setBankAcc('');
      setBankIfsc('');
      setBankName('');
      load();
    } catch (err) {
      if (err instanceof ApiFetchError) {
        if (err.error.code === 'INSUFFICIENT_WITHDRAWABLE')
          setFormErr('Not enough withdrawable balance for this amount.');
        else if (err.error.code === 'HOST_NOT_APPROVED')
          setFormErr('Your host account is pending approval. You can withdraw once approved.');
        else
          // Do not echo raw server error text for unmapped codes (MKTG-04).
          setFormErr('Withdrawal request failed. Please try again.');
      } else {
        setFormErr('Withdrawal request failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const user = getUser();

  // ─── Loading / error states ──────────────────────────────────────────────

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-8 text-text-dim">
        Loading your earnings…
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="rounded-xl border border-border bg-bg-elev p-6">
        <p className="m-0 text-red-400">{loadErr}</p>
        <Link href="/" className="btn btn-ghost mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  if (!wallet) return null;

  const withdrawable = parseInt(wallet.hostWithdrawableCoins, 10);
  const earned = parseInt(wallet.hostEarnedCoins, 10);
  const canWithdraw = withdrawable >= minCoins;

  return (
    <>
      {/* ── Balance summary ─────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border bg-bg-elev p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs uppercase tracking-wide text-text-muted mb-1">
              Withdrawable balance
            </div>
            <div className="text-[2.4rem] font-bold tracking-tight leading-none mb-1">
              ₹{withdrawable.toLocaleString('en-IN')}
              <span className="text-text-dim text-base font-semibold ml-2">
                ({fmtCoins(withdrawable)} coins)
              </span>
            </div>
            {user?.phone && (
              <p className="text-sm text-text-muted m-0">Signed in as {user.phone}</p>
            )}
          </div>
          <button
            onClick={() => { clearSession(); router.replace('/'); }}
            className="btn btn-ghost"
          >
            Sign out
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          <Stat label="Total earned" value={`${fmtCoins(earned)} coins`} />
          <Stat label="Min. withdrawal" value={`${fmtCoins(minCoins)} coins (₹${minCoins.toLocaleString('en-IN')})`} />
        </div>

        {!canWithdraw && (
          <p className="mt-4 text-sm text-amber-400 bg-amber-400/10 rounded-lg px-4 py-3">
            You need at least {fmtCoins(minCoins)} coins to make a withdrawal request.
            Keep earning through calls and gifts!
          </p>
        )}
      </section>

      {/* ── Withdrawal form ─────────────────────────────────────────────── */}
      {canWithdraw && (
        <section className="rounded-xl border border-border bg-bg-elev p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">New withdrawal request</h2>

          {success && (
            <div className="mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Coins amount */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="coins">
                Coins to withdraw
              </label>
              <input
                id="coins"
                type="number"
                inputMode="numeric"
                min={minCoins}
                max={withdrawable}
                step={1}
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                placeholder={`${minCoins}–${withdrawable}`}
                className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-60"
              />
              {coins && !isNaN(Number(coins)) && Number(coins) >= minCoins && (
                <p className="text-xs text-text-muted mt-1">
                  ≈ ₹{Number(coins).toLocaleString('en-IN')} gross (platform fee deducted at processing)
                </p>
              )}
            </div>

            {/* Method tabs */}
            <div>
              <label className="block text-sm font-medium mb-2">Payout method</label>
              <div className="flex gap-2">
                <MethodTab label="UPI" active={method === 'upi'} onClick={() => { setMethod('upi'); setFormErr(null); }} />
                <MethodTab label="Bank transfer" active={method === 'bank_transfer'} onClick={() => { setMethod('bank_transfer'); setFormErr(null); }} />
              </div>
            </div>

            {method === 'upi' ? (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="upi">
                  UPI ID
                </label>
                <input
                  id="upi"
                  type="text"
                  autoComplete="off"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-60"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="acc">
                    Account number
                  </label>
                  <input
                    id="acc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0123456789"
                    value={bankAcc}
                    onChange={(e) => setBankAcc(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="ifsc">
                    IFSC code
                  </label>
                  <input
                    id="ifsc"
                    type="text"
                    autoComplete="off"
                    placeholder="HDFC0001234"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="holder">
                    Account holder name
                  </label>
                  <input
                    id="holder"
                    type="text"
                    autoComplete="off"
                    placeholder="As on your bank passbook"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:border-brand disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            {formErr && (
              <p className="text-sm text-red-400" role="alert">{formErr}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full text-center"
            >
              {submitting ? 'Submitting…' : 'Request withdrawal'}
            </button>
          </form>

          <p className="text-xs text-text-muted mt-4">
            By submitting you confirm these are your own bank / UPI details.
            Payouts are subject to a platform fee and 1% TDS as per Indian tax rules.
          </p>
        </section>
      )}

      {/* ── Withdrawal history ───────────────────────────────────────────── */}
      <h2 className="text-lg font-semibold mb-3">Withdrawal history</h2>
      {history.length === 0 ? (
        <p className="text-text-muted text-sm">No withdrawals yet.</p>
      ) : (
        <ul className="rounded-xl border border-border divide-y divide-border overflow-hidden">
          {history.map((w) => (
            <li key={w.id} className="bg-bg-elev px-4 py-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="font-semibold">
                    {fmtCoins(w.coinsRequested)} coins
                    <span className="ml-2 text-text-dim font-normal text-sm">
                      ≈ ₹{w.amountInr.toLocaleString('en-IN')} gross
                    </span>
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {w.method === 'upi'
                      ? `UPI · ${maskUpi(w.upiId)}`
                      : `Bank · ${w.bankHolderName} · ···${(w.bankAccountNumber ?? '').slice(-4)}`}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">{fmtDate(w.createdAt)}</div>
                  {w.rejectionReason && (
                    <div className="mt-1 text-xs text-red-400">Reason: {w.rejectionReason}</div>
                  )}
                  {w.transactionReference && (
                    <div className="mt-1 text-xs text-emerald-400">Ref: {w.transactionReference}</div>
                  )}
                </div>
                <span className={`text-sm font-semibold shrink-0 ${STATUS_COLOR[w.status]}`}>
                  {STATUS_LABEL[w.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <div className="text-[0.7rem] uppercase tracking-wide text-text-muted">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function MethodTab({
  label, active, onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
        active
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-border bg-bg text-text-muted hover:border-text-muted'
      }`}
    >
      {label}
    </button>
  );
}
