'use client';

import type { CoinPackage } from '@/lib/coinPackages';
import { COIN_PURCHASE_ENABLED } from '@/lib/constants';

interface CoinCardProps {
  pack: CoinPackage;
  onBuy?: (pack: CoinPackage) => void;
}

/**
 * One coin pack card. Renders a disabled "Coming soon" CTA until Razorpay
 * is wired (COIN_PURCHASE_ENABLED becomes true once NEXT_PUBLIC_RAZORPAY_KEY_ID
 * is set in the build env), then becomes a real Buy button that calls onBuy().
 */
export default function CoinCard({ pack, onBuy }: CoinCardProps) {
  return (
    <article className="relative flex flex-col gap-2.5 rounded-xl border border-border bg-bg-elev p-5">
      {pack.badge && (
        <span className="absolute top-3 right-3 rounded-full bg-brand-grad px-2 py-0.5
                         text-[0.72rem] font-bold text-[#0b0f17]">
          {pack.badge}
        </span>
      )}

      <div className="text-[1.4rem] font-bold tracking-tight">
        {pack.coins.toLocaleString('en-IN')} coins
      </div>

      {pack.bonusCoins > 0 && (
        <div className="text-sm font-semibold text-brand">
          + {pack.bonusCoins.toLocaleString('en-IN')} bonus
        </div>
      )}

      <div className="mt-auto text-sm text-text-dim">
        <strong className="text-base text-text mr-1">
          &#8377;{pack.priceInr.toLocaleString('en-IN')}
        </strong>
        one-time
      </div>

      {COIN_PURCHASE_ENABLED && onBuy ? (
        <button
          type="button"
          onClick={() => onBuy(pack)}
          className="btn btn-primary w-full text-center mt-2.5"
        >
          Buy now
        </button>
      ) : (
        <span
          role="button"
          aria-disabled="true"
          className="btn btn-disabled w-full text-center mt-2.5"
        >
          Coming soon
        </span>
      )}
    </article>
  );
}
