import Link from 'next/link';

const HOST_PERKS = [
  {
    icon: '₹',
    title: 'Set your own rate',
    body: 'You decide what every minute is worth. Voice from ₹5/min, video from ₹15/min.',
  },
  {
    icon: '⚡',
    title: 'Withdraw to UPI',
    body: 'Cashout starts at 1,000 coins. Money in your bank within 24 hours of approval.',
  },
  {
    icon: '🛡',
    title: 'Block & report controls',
    body: 'Block anyone instantly. Every report reviewed by humans within a day.',
  },
];

export default function HostShowcase() {
  return (
    <section id="hosts" className="relative py-24 md:py-32">
      <div className="max-w-site mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="section-eyebrow">For creators</p>
            <h2 className="section-title">
              Make Mitraa your<br />
              <span className="gradient-text">side income.</span>
            </h2>
            <p className="section-sub">
              Mitraa pays hosts ₹0.25 per coin earned. Top creators are clearing
              ₹40,000-60,000 a month, talking on their own schedule, from home.
            </p>

            <div className="mt-8 space-y-5">
              {HOST_PERKS.map((p) => (
                <div key={p.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-grad flex items-center justify-center text-lg font-bold text-white shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">{p.title}</h3>
                    <p className="text-text-dim text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#download" className="btn btn-primary">
                Become a host
              </Link>
              <a href="mailto:hosts@mitraa.shop" className="btn btn-ghost">
                Talk to our team
              </a>
            </div>
          </div>

          {/* Earnings dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-10 bg-mesh-hero opacity-50 blur-3xl pointer-events-none" />
            <div className="relative grad-card p-7 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="section-eyebrow">YOUR EARNINGS</div>
                  <div className="text-text-dim text-sm mt-1">This month</div>
                </div>
                <div className="chip chip-brand">
                  <span className="w-1.5 h-1.5 rounded-full bg-ok"></span>
                  Online now
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-coin text-3xl">⚡</span>
                <span className="text-4xl font-extrabold tracking-tight">1,28,400</span>
                <span className="text-text-dim text-sm font-semibold">coins</span>
              </div>
              <div className="text-text-dim text-sm mb-6">
                ≈ <span className="text-text font-bold">₹32,100</span> withdrawable
              </div>

              {/* Sparkline-ish chart */}
              <div className="h-24 flex items-end gap-2 mb-6">
                {[40, 55, 35, 70, 55, 85, 65, 90, 75, 95, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-brand-grad opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              {/* Recent calls list */}
              <div className="space-y-2.5">
                {[
                  { name: 'Priya R.',  type: 'Video', mins: '8m 22s', earn: '+304' },
                  { name: 'Anjali V.', type: 'Voice', mins: '4m 10s', earn: '+88'  },
                  { name: 'Meera N.',  type: 'Voice', mins: '12m 04s', earn: '+264' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-9 h-9 rounded-full bg-brand-grad flex items-center justify-center text-white text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{c.name}</div>
                      <div className="text-text-muted text-xs">{c.type} · {c.mins}</div>
                    </div>
                    <div className="text-ok text-sm font-bold">{c.earn} ⚡</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
