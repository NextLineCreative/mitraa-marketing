'use client';

import { useCallback } from 'react';
import CoinCard from '@/components/CoinCard';
import { COIN_PACKAGES, type CoinPackage } from '@/lib/coinPackages';
import { API, COIN_PURCHASE_ENABLED } from '@/lib/constants';

/**
 * Client-side interactive piece of /coins. Mounted by the server page wrapper
 * so the HTML <title> + metadata stay accurate while the buy logic stays
 * client-only.
 */
export default function CoinsClient() {
  const handleBuy = useCallback(async (pack: CoinPackage) => {
    if (!COIN_PURCHASE_ENABLED) return;
    try {
      const orderRes = await fetch(`${API.baseUrl}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pack.id }),
      });
      if (!orderRes.ok) throw new Error(`order_create_failed ${orderRes.status}`);
      const order = (await orderRes.json()) as {
        orderId: string;
        keyId: string;
        amount: number;
        currency: string;
      };

      // @ts-expect-error Razorpay added by checkout.js script tag (Phase 9)
      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'Mitraa',
        description: pack.title,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch(`${API.baseUrl}/api/orders/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            alert('Payment successful — coins added to your wallet.');
          } else {
            alert('Payment verification failed. Contact support.');
          }
        },
      });
      rzp.open();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Could not start payment. Please try again.');
    }
  }, []);

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

      <section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3.5">
        {COIN_PACKAGES.map((p) => (
          <CoinCard key={p.id} pack={p} onBuy={handleBuy} />
        ))}
      </section>
    </>
  );
}
