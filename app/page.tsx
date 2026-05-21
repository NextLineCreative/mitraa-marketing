import Link from 'next/link';
import { EMAILS } from '@/lib/constants';

const FEATURES = [
  { title: 'Voice & video calls',     body: 'Real-time, low-latency calls powered by Agora. We never record your conversations.' },
  { title: 'Pay only for what you use', body: 'Buy coins, talk by the minute. No subscriptions, no auto-renewals.' },
  { title: 'Hosts who want to talk',  body: 'Hand-verified hosts with profiles, languages, and rates clearly displayed.' },
  { title: 'Built for India first',   body: 'Pricing in rupees. UPI and cards via Razorpay. Servers in Mumbai. Hindi, English, and more.' },
  { title: 'Safety controls',         body: 'Block, report, and review any time. We take action on every credible report.' },
  { title: 'Your data, on your terms',body: 'Delete your account in two taps. See exactly what we collect in our Privacy Policy.' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_360px] items-center gap-10
                          max-w-site mx-auto px-6 pt-20 pb-14">
        <div className="text-center md:text-left">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-[1.1] mb-4">
            Talk to someone{' '}
            <em className="not-italic bg-brand-grad bg-clip-text text-transparent">new</em>
            .
          </h1>
          <p className="text-[1.15rem] text-text-dim mb-7 max-w-[540px] md:mx-0 mx-auto">
            Mitraa is a social calling app where you discover people who actually want to talk.
            Voice or video, on your terms, by the minute.
          </p>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-3.5">
            <Link href="#features" className="btn btn-primary">How it works</Link>
            <a href={`mailto:${EMAILS.contact}`} className="btn btn-ghost">
              Get notified at launch
            </a>
          </div>
          <p className="text-xs text-text-muted">Coming soon to Android. iOS to follow.</p>
        </div>

        {/* Decorative concentric rings, suggests calling */}
        <div className="relative w-[260px] h-[260px] md:w-[360px] md:h-[360px] mx-auto md:ml-auto" aria-hidden>
          <div className="ring-frame absolute inset-0 opacity-35 animate-pulse-ring" />
          <div className="ring-frame absolute inset-[8%] opacity-35 animate-pulse-ring"
               style={{ animationDelay: '0.6s' }} />
          <div className="ring-frame absolute inset-[20%] opacity-70 animate-pulse-ring"
               style={{ animationDelay: '1.2s' }} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-doc mx-auto px-6 pt-10 pb-16">
        <h2 className="text-[1.75rem] font-bold mb-7">What you can do</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-xl border border-border bg-bg-elev p-5">
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-text-dim text-[0.94rem] m-0">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-doc mx-auto px-6 pt-2 pb-20">
        <h2 className="text-[1.5rem] font-bold mb-3">Get in touch</h2>
        <p className="text-text-dim mb-1">Press, partnerships, or general questions:</p>
        <p className="m-0">
          <a href={`mailto:${EMAILS.contact}`} className="text-brand hover:underline">
            {EMAILS.contact}
          </a>
        </p>
      </section>
    </main>
  );
}
