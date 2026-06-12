const FEATURES = [
  {
    icon: 'call',
    title: 'Crystal-clear voice & video',
    body: 'Real-time, low-latency calls powered by Agora WebRTC with India PoPs. Never recorded.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    icon: 'coin',
    title: 'No subscriptions',
    body: 'Buy coins once and use them whenever you like. No monthly fees, no auto-renew traps.',
    accent: 'from-amber-400 to-pink-500',
  },
  {
    icon: 'verified',
    title: 'Hand-verified hosts',
    body: 'Every host is reviewed by our team. Rates, languages, and interests are upfront.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: 'india',
    title: 'Built for India first',
    body: 'Pricing in rupees. UPI + cards via Razorpay. Servers in Mumbai. Hindi, English, and more.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: 'shield',
    title: 'Safety controls',
    body: 'Block, report, and review any time. Every report reviewed by a human within 24 hours.',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    icon: 'lock',
    title: 'Your data, your call',
    body: 'Delete your account in two taps. See exactly what we store in our Privacy Policy.',
    accent: 'from-indigo-500 to-purple-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-site mx-auto px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="section-eyebrow">What you get</p>
          <h2 className="section-title">Built for real conversations,<br />not for endless scrolling.</h2>
          <p className="section-sub">
            Every feature in Mitraa exists to remove friction between you and someone interesting.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <article
              key={f.title}
              className="grad-card p-6 hover:translate-y-[-4px] transition-transform duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent}
                              flex items-center justify-center text-white mb-4`}>
                <FeatureIcon name={f.icon} />
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-text-dim text-sm leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ name }: { name: string }) {
  switch (name) {
    case 'call':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'coin':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
      );
    case 'verified':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z" />
          <path d="M3 12v5c0 1.66 4 3 9 3s9-1.34 9-3v-5" />
        </svg>
      );
    case 'india':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3"/>
          <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/>
        </svg>
      );
    case 'shield':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      );
    case 'lock':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      );
    default:
      return null;
  }
}
