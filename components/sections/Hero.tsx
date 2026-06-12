import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background mesh — purple/pink blobs behind the hero */}
      <div className="absolute inset-0 bg-mesh-hero opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-bg/40 pointer-events-none" />

      {/* Floating coin shapes */}
      <div className="hidden md:block absolute -top-10 right-[18%] w-24 h-24 rounded-full
                      bg-brand-grad opacity-40 blur-2xl animate-float" />
      <div className="hidden md:block absolute top-[40%] left-[8%] w-32 h-32 rounded-full
                      bg-brand-pink/40 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-site mx-auto px-6 md:px-10 pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 chip chip-brand mb-6">
              <span className="w-2 h-2 rounded-full bg-live animate-pulse"></span>
              <span>Now in early access</span>
            </div>
            <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold tracking-tight leading-[1.02] mb-5">
              Talk to someone <span className="gradient-text">real</span>.<br />
              <span className="text-text-dim">Real conversations, anytime.</span>
            </h1>
            <p className="text-[1.15rem] text-text-dim mb-8 max-w-[580px] lg:mx-0 mx-auto leading-relaxed">
              Mitraa is India&apos;s social calling app — discover hand-verified
              hosts and connect over voice or video calls.
              No subscriptions. No surprises.
            </p>
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start mb-6">
              <a href="#download" className="btn btn-primary text-base">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
                Get the app
              </a>
              <Link href="#how" className="btn btn-ghost text-base">
                See how it works
              </Link>
            </div>
            <div className="flex items-center gap-6 justify-center lg:justify-start text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ok">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Verified hosts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ok">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>UPI &amp; cards</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ok">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>End-to-end secure</span>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative animate-fade-up" style={{ animationDelay: '0.15s' }}>
      {/* Glow behind phone */}
      <div className="absolute -inset-10 bg-mesh-hero opacity-60 blur-3xl pointer-events-none" />

      {/* Phone frame */}
      <div className="relative w-[280px] md:w-[320px] h-[580px] md:h-[660px]
                      rounded-[44px] border-[10px] border-bg-elev
                      bg-bg shadow-[0_30px_80px_-20px_rgba(139,92,246,0.5)]
                      overflow-hidden">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 rounded-full bg-bg-elev z-20" />

        {/* Screen content - Discover-style preview */}
        <div className="absolute inset-0 bg-bg p-4 pt-12 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={22} height={22} />
              <span className="gradient-text font-extrabold text-base">Mitraa</span>
            </div>
            <div className="chip chip-brand !py-1 !px-2 !text-[10px]">
              <span className="text-coin">⚡</span>
              <span>1,840</span>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mb-3 overflow-hidden">
            <div className="text-[10px] py-1 px-3 rounded-full bg-brand-grad text-white font-bold">All</div>
            <div className="text-[10px] py-1 px-3 rounded-full bg-bg-elev border border-border text-text-dim">Online</div>
            <div className="text-[10px] py-1 px-3 rounded-full bg-bg-elev border border-border text-text-dim">Voice</div>
            <div className="text-[10px] py-1 px-3 rounded-full bg-bg-elev border border-border text-text-dim">Trending</div>
          </div>

          {/* Live strip */}
          <div className="flex gap-3 mb-4">
            {['P', 'A', 'M', 'R'].map((letter, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-grad p-0.5">
                  <div className="w-full h-full rounded-full bg-bg-elev flex items-center justify-center text-white font-bold text-sm">
                    {letter}
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-live rounded text-[7px] font-bold text-white border border-bg">
                  LIVE
                </div>
              </div>
            ))}
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { name: 'Priya', tag: 'Trending', rate: '22', voice: '14' },
              { name: 'Anjali', tag: 'New',      rate: '36', voice: '20' },
              { name: 'Meera',  tag: 'Top',      rate: '28', voice: '16' },
              { name: 'Riya',   tag: 'Verified', rate: '38', voice: '22' },
            ].map((h) => (
              <div key={h.name} className="aspect-[0.78] rounded-xl bg-bg-elev border border-border overflow-hidden relative">
                {/* Avatar bg */}
                <div className="absolute inset-0 bg-brand-grad opacity-30" />
                <div className="absolute top-2 left-2 chip !py-0.5 !px-1.5 !text-[8px] !bg-brand !text-white !border-transparent">
                  {h.tag}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-0.5 chip !py-0.5 !px-1.5 !text-[8px]">
                  <span className="w-1 h-1 rounded-full bg-ok"></span>
                  Online
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-white text-xs font-bold">{h.name}</div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="text-coin text-[9px] font-bold">★ 4.9</div>
                    <div className="text-text-dim text-[8px]">⚡{h.rate}/min</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating ring overlay (calling animation hint) */}
      <div className="absolute -right-4 top-1/3 w-20 h-20 rounded-full border-2 border-brand-pink/50 animate-pulse-ring" />
      <div className="absolute -right-8 top-1/3 -mt-2 w-28 h-28 rounded-full border border-brand/40 animate-pulse-ring"
           style={{ animationDelay: '0.6s' }} />
    </div>
  );
}
