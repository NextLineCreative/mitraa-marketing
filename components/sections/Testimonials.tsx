// Real-feeling placeholders. Swap in once we have shipped quotes.
const STORIES = [
  {
    name: 'Anjali V.',
    role: 'Host · Mumbai',
    quote:
      "I started taking calls in the evenings after work. Three months in, Mitraa pays my rent. The withdrawal flow is the fastest I've seen.",
    avatar: 'A',
    accent: 'from-violet-500 to-pink-500',
  },
  {
    name: 'Rohit S.',
    role: 'User · Bengaluru',
    quote:
      "Way better than any random chat app. Hosts are real people with real profiles. The per-minute thing keeps me from overspending.",
    avatar: 'R',
    accent: 'from-amber-500 to-pink-500',
  },
  {
    name: 'Sneha K.',
    role: 'Host · Pune',
    quote:
      "I love that I'm in full control — set my rate, go online when I want, block anyone I don't. No middlemen telling me what to do.",
    avatar: 'S',
    accent: 'from-emerald-500 to-cyan-500',
  },
  {
    name: 'Arjun M.',
    role: 'User · Delhi',
    quote:
      "Call quality is genuinely good. I tried 3 other apps and they all had echo or 5-second delays. Mitraa just works.",
    avatar: 'A',
    accent: 'from-blue-500 to-violet-500',
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-site mx-auto px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Real people, real stories</p>
          <h2 className="section-title">
            <span className="gradient-text">Loved</span> by users
            and earners alike.
          </h2>
          <p className="section-sub">
            From first-time callers to hosts paying their rent — here's what people are saying.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          {STORIES.map((s) => (
            <article key={s.name} className="grad-card p-7">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.accent}
                                 flex items-center justify-center text-white font-bold shrink-0`}>
                  {s.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-text leading-relaxed mb-4 italic">
                    &ldquo;{s.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">{s.name}</div>
                      <div className="text-text-muted text-xs">{s.role}</div>
                    </div>
                    <div className="text-coin tracking-widest text-sm">★★★★★</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
