import Link from 'next/link';

const PACKS = [
  { title: 'Starter', coins: 100,   bonus: 0,    price: 99,   badge: null            },
  { title: 'Popular', coins: 1200,  bonus: 100,  price: 999,  badge: 'Most Popular'  },
  { title: 'Power',   coins: 2500,  bonus: 300,  price: 1999, badge: 'Great Value'   },
  { title: 'Ultra',   coins: 12000, bonus: 2000, price: 7999, badge: 'Best Value'    },
];

export default function PricingTeaser() {
  return (
    <section className="relative py-24 md:py-32 bg-bg-elev/30 border-y border-border">
      <div className="max-w-site mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="section-title">
            Simple coin packs.<br />
            <span className="gradient-text">No subscriptions, ever.</span>
          </h2>
          <p className="section-sub mx-auto">
            Recharge once, talk for months. Coins never expire. Pay with UPI,
            cards, or netbanking via Razorpay.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PACKS.map((p) => (
            <div
              key={p.title}
              className={
                'relative grad-card p-7 text-center transition-transform hover:translate-y-[-4px] ' +
                (p.badge === 'Most Popular' ? 'lg:scale-105 lg:-mt-2' : '')
              }
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-grad
                                text-white text-[10px] font-extrabold uppercase tracking-wider
                                py-1 px-3 rounded-full shadow-brand">
                  {p.badge}
                </div>
              )}
              <h3 className="text-text font-bold text-sm uppercase tracking-wider mb-3 mt-2">
                {p.title}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-coin text-2xl">⚡</span>
                <span className="text-4xl font-extrabold tracking-tight">
                  {p.coins.toLocaleString('en-IN')}
                </span>
              </div>
              {p.bonus > 0 && (
                <div className="text-ok text-xs font-bold mb-4">
                  +{p.bonus} bonus coins
                </div>
              )}
              {p.bonus === 0 && <div className="h-4 mb-4" />}
              <div className="text-text-dim text-xs mb-4">
                {(p.coins + p.bonus).toLocaleString('en-IN')} total
              </div>
              <div className="text-2xl font-extrabold mb-5">
                ₹{p.price.toLocaleString('en-IN')}
              </div>
              <Link
                href="/coins/"
                className={
                  'w-full inline-block py-3 rounded-full font-bold text-sm transition-all ' +
                  (p.badge
                    ? 'bg-brand-grad text-white shadow-brand'
                    : 'bg-bg-elev border border-border text-text hover:border-brand/50')
                }
              >
                Buy now
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-text-muted text-sm">
          Every host sets their own per-minute rate. Voice from ₹5/min, video from ₹15/min.
        </p>
      </div>
    </section>
  );
}
