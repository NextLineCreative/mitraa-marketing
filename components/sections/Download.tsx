import Link from 'next/link';

export default function Download() {
  return (
    <section id="download" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-mesh-hero opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-bg/30 pointer-events-none" />

      <div className="relative max-w-site mx-auto px-6 md:px-10">
        <div className="relative grad-card p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand-grad opacity-30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-pink/30 blur-3xl" />

          <div className="relative">
            <p className="section-eyebrow">Get started</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold tracking-tight leading-[1.05] mb-5 mt-2">
              Ready to talk to<br />
              <span className="gradient-text">someone real?</span>
            </h2>
            <p className="text-text-dim text-lg max-w-xl mx-auto mb-9">
              Download Mitraa, set up your profile in 30 seconds, and have your
              first call within minutes. Free to download. Free to browse.
              Connect when you&apos;re ready.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              {/* Android */}
              <a
                href="https://mitraa.shop/app/mitraa.apk"
                className="inline-flex items-center gap-3 bg-bg-elev border border-border
                           hover:border-brand/50 transition-all rounded-2xl py-3 px-5 group"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M5.85 18.06c0 .47.38.86.85.86h.7v2.66c0 .59.48 1.07 1.07 1.07s1.07-.48 1.07-1.07v-2.66h1.41v2.66c0 .59.48 1.07 1.07 1.07s1.07-.48 1.07-1.07v-2.66h.7c.47 0 .85-.39.85-.86V8.95H5.85v9.11zM3.05 8.94c-.62 0-1.13.51-1.13 1.13v5.36c0 .62.51 1.13 1.13 1.13s1.13-.51 1.13-1.13v-5.36c0-.62-.5-1.13-1.13-1.13zm17.9 0c-.62 0-1.13.51-1.13 1.13v5.36c0 .62.51 1.13 1.13 1.13s1.13-.51 1.13-1.13v-5.36c0-.62-.51-1.13-1.13-1.13zm-5.05-5.37l.95-1.73c.06-.1.02-.22-.08-.27-.1-.06-.22-.02-.27.08l-.96 1.75c-.79-.32-1.66-.5-2.55-.5s-1.76.18-2.55.5l-.96-1.75c-.05-.1-.17-.14-.27-.08-.1.05-.14.17-.08.27l.95 1.73C8.43 4.54 7 6.32 7 8.41c0 .19.01.37.04.55h9.91c.03-.18.05-.36.05-.55 0-2.09-1.43-3.87-3.1-4.84zM10.27 6.69c-.34 0-.61-.27-.61-.61 0-.34.27-.61.61-.61.34 0 .61.27.61.61 0 .34-.27.61-.61.61zm3.45 0c-.34 0-.61-.27-.61-.61 0-.34.27-.61.61-.61.34 0 .61.27.61.61 0 .34-.27.61-.61.61z" fill="#3DDC84"/>
                </svg>
                <div className="text-left">
                  <div className="text-text-muted text-[10px] uppercase tracking-wider">Get it for</div>
                  <div className="text-white font-bold text-base">Android (APK)</div>
                </div>
              </a>

              {/* iOS coming soon */}
              <div className="inline-flex items-center gap-3 bg-bg-elev/50 border border-border
                              rounded-2xl py-3 px-5 opacity-60 cursor-not-allowed">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-text">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-text-muted text-[10px] uppercase tracking-wider">Coming soon</div>
                  <div className="text-white font-bold text-base">iOS</div>
                </div>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ok">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <span>No credit card to install. Verified by Google Play Protect.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
