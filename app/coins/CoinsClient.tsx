'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CoinCard from '@/components/CoinCard';
import { apiFetch, ApiFetchError } from '@/lib/api';
import {
  COIN_PACKAGES as FALLBACK_PACKAGES,
  type CoinPackage,
} from '@/lib/coinPackages';
import { COIN_PURCHASE_ENABLED } from '@/lib/constants';
import { getJwt, getUser } from '@/lib/session';

/** Shape returned by GET /api/coin-packages. */
interface ApiCoinPackage {
  id: string;
  title: string;
  coins: number;
  bonusCoins: number;
  priceInr: number;
  badge: string | null;
  sortOrder: number;
}
type CoinPackagesResponse = { ok: true; packages: ApiCoinPackage[] };

interface CreateOrderResponse {
  ok: true;
  order: {
    orderId: string;
    keyId: string;
    amount: number; // paise
    currency: string;
    packageId: string;
    coins: number;
    bonusCoins: number;
    totalCoins: number;
    transactionId: string;
  };
}

interface VerifyResponse {
  ok: true;
  coinsCredited: number;
  newBalance: string;
  transactionId: string;
  alreadyProcessed: boolean;
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/** Lazy-load Razorpay's checkout.js, idempotent. */
function ensureRazorpayLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    // @ts-expect-error checkout.js sets window.Razorpay
    if (typeof window !== 'undefined' && window.Razorpay) return resolve();
    if (typeof document === 'undefined') return reject(new Error('document unavailable'));
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('checkout.js failed to load')), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = RAZORPAY_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('checkout.js failed to load'));
    document.body.appendChild(s);
  });
}

export default function CoinsClient() {
  const router = useRouter();
  const [packs, setPacks] = useState<CoinPackage[]>(FALLBACK_PACKAGES);
  const [loaded, setLoaded] = useState(false);
  const [busyPackId, setBusyPackId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch live catalog from the backend so prices and IDs stay in sync.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch<CoinPackagesResponse>('/api/coin-packages', {
          authed: false,
        });
        if (cancelled) return;
        setPacks(
          res.packages.map((p) => ({
            id: p.id,
            title: p.title,
            coins: p.coins,
            bonusCoins: p.bonusCoins,
            priceInr: p.priceInr,
            badge: p.badge ?? undefined,
            sortOrder: p.sortOrder,
          })),
        );
      } catch {
        // Fall back to the static catalog if the API is unreachable - prices may drift but the page still renders.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBuy = useCallback(
    async (pack: CoinPackage) => {
      if (!COIN_PURCHASE_ENABLED) return;
      setError(null);
      setSuccess(null);

      if (!getJwt()) {
        router.push('/login/?next=/coins/');
        return;
      }

      setBusyPackId(pack.id);
      try {
        await ensureRazorpayLoaded();

        // 1) Create the order on our backend
        const created = await apiFetch<CreateOrderResponse>('/api/orders/create', {
          method: 'POST',
          body: { packageId: pack.id },
        });

        const user = getUser();

        // 2) Open Razorpay modal
        await new Promise<void>((resolve, reject) => {
          // @ts-expect-error window.Razorpay is provided by checkout.js
          const rzp = new window.Razorpay({
            key: created.order.keyId,
            order_id: created.order.orderId,
            amount: created.order.amount,
            currency: created.order.currency,
            name: 'Mitraa',
            description: pack.title,
            prefill: user
              ? {
                  contact: user.phone,
                  name: user.displayName ?? undefined,
                }
              : undefined,
            theme: { color: '#c084fc' },
            modal: {
              ondismiss: () => reject(new Error('cancelled')),
              confirm_close: true,
              escape: true,
            },
            handler: async (response: {
              razorpay_payment_id: string;
              razorpay_order_id: string;
              razorpay_signature: string;
            }) => {
              try {
                const verified = await apiFetch<VerifyResponse>('/api/orders/verify', {
                  method: 'POST',
                  body: response,
                });
                setSuccess(
                  verified.alreadyProcessed
                    ? 'Already credited. New balance: ' +
                      Number(verified.newBalance).toLocaleString('en-IN') +
                      ' coins.'
                    : `Payment successful — ${verified.coinsCredited.toLocaleString('en-IN')} coins added. New balance: ${Number(verified.newBalance).toLocaleString('en-IN')}.`,
                );
                setTimeout(() => router.push('/wallet/'), 1500);
                resolve();
              } catch (err) {
                reject(err);
              }
            },
          });
          rzp.open();
        });
      } catch (err) {
        if (err instanceof Error && err.message === 'cancelled') {
          // User closed the modal - not an error, no toast
        } else if (err instanceof ApiFetchError) {
          if (err.status === 401) {
            router.push('/login/?next=/coins/');
            return;
          }
          // Do not echo raw server error text on this payment surface (MKTG-04).
          setError('Payment could not be completed. Please try again.');
        } else if (err instanceof Error) {
          setError('Payment could not be completed. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } finally {
        setBusyPackId(null);
      }
    },
    [router],
  );

  return (
    <>
      {!COIN_PURCHASE_ENABLED && (
        <div className="rounded-xl border border-border p-5 mb-8
                        bg-[linear-gradient(135deg,rgba(192,132,252,0.10),rgba(251,146,60,0.10))]">
          <h2 className="m-0 mb-1.5 text-base text-brand">Web checkout coming soon</h2>
          <p className="m-0 text-text-dim text-[0.94rem]">
            Our online payment gateway is in final integration. Until then, please buy
            coins inside the Mitraa app via Google Play. The prices and packs you see
            here will match the in-app catalog exactly.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 mb-4">
          <p className="m-0 text-sm text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 mb-4">
          <p className="m-0 text-sm text-emerald-300">{success}</p>
          <p className="m-0 mt-2 text-xs text-emerald-400/70">
            Taking you to your <Link href="/wallet/" className="underline">wallet</Link>…
          </p>
        </div>
      )}

      {!loaded && (
        <p className="text-text-muted text-xs mb-4">Fetching latest prices…</p>
      )}

      <section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
        {packs.map((p) => (
          <CoinCard
            key={p.id}
            pack={p}
            onBuy={busyPackId === p.id ? undefined : handleBuy}
          />
        ))}
      </section>
    </>
  );
}
