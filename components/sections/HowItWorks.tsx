const STEPS = [
  {
    num: '01',
    title: 'Download Mitraa',
    body: 'Free on Android. iOS coming soon. Sign up with just your mobile number — no email, no password.',
  },
  {
    num: '02',
    title: 'Buy your first coin pack',
    body: 'Packs from ₹99. Pay with UPI, card, or netbanking via Razorpay. Coins land in your wallet instantly.',
  },
  {
    num: '03',
    title: 'Browse verified hosts',
    body: 'Filter by language, interest, or availability. Open a profile to see rates and reviews.',
  },
  {
    num: '04',
    title: 'Tap to call',
    body: 'One-tap voice or video call. The timer starts only when the host picks up. End anytime.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 bg-bg-elev/30 border-y border-border">
      <div className="max-w-site mx-auto px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-title">
            From <span className="gradient-text">download</span> to your first call
            in under <span className="gradient-text">3 minutes</span>.
          </h2>
          <p className="section-sub">
            No forms, no waitlist, no awkward setup. Just install, recharge, and call.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative">
              {/* Connector line on desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] right-[-20%] h-px
                                bg-gradient-to-r from-brand/40 to-transparent" />
              )}
              <div className="grad-card p-6 h-full relative">
                <div className="text-5xl font-extrabold gradient-text mb-3 leading-none">
                  {s.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-text-dim text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
