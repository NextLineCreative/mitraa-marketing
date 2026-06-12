'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'How do coins work?',
    a: 'Coins are Mitraa\'s in-app currency. Buy a pack once, then spend coins by the minute on calls and chats. Each host sets their own rate. Coins never expire.',
  },
  {
    q: 'Is Mitraa free to download?',
    a: 'Yes, the app is free. You only pay when you spend coins on calls, chats, or gifts. The first coin pack starts at ₹99.',
  },
  {
    q: 'How much do hosts earn?',
    a: 'Hosts keep ₹0.25 per coin earned (75% of what callers spend). Withdrawals start at 1,000 coins (₹250) and clear within 24 hours of approval.',
  },
  {
    q: 'Are my conversations private?',
    a: 'Yes. Voice and video calls are end-to-end transported via Agora and are never recorded by us. Chat messages are stored encrypted at rest.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'In the Android app, coin purchases go through Google Play (UPI, cards, and every method Play supports). On the website, payments are processed by Razorpay (UPI, debit/credit cards, netbanking, wallets).',
  },
  {
    q: 'Can I get a refund?',
    a: 'Coin purchases are generally final once credited. Refunds are considered for duplicate charges, failed coin delivery, or unauthorised transactions — and app purchases are also covered by Google Play’s refund policy. See our Refund Policy for full terms.',
  },
  {
    q: 'How do you verify hosts?',
    a: 'Every host completes a profile review with our team. We check photo, ID, and a short intro before they go live. Bad actors are removed permanently.',
  },
  {
    q: 'Is the app available on iOS?',
    a: 'Android is live today (early access). iOS is in development — sign up for launch notifications at contact@mitraa.shop.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24 md:py-32 bg-bg-elev/30 border-y border-border">
      <div className="max-w-doc mx-auto px-6 md:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="section-eyebrow">FAQ</p>
          <h2 className="section-title">Questions, answered.</h2>
          <p className="section-sub mx-auto">
            Still curious? Email{' '}
            <a href="mailto:contact@mitraa.shop" className="text-brand hover:underline">
              contact@mitraa.shop
            </a>
            {' '}— we reply within a business day.
          </p>
        </div>

        <div className="mt-14 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="grad-card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left
                           hover:bg-bg-soft/40 transition-colors"
              >
                <span className="font-bold text-base md:text-lg pr-4">{f.q}</span>
                <span
                  className={
                    'shrink-0 w-7 h-7 rounded-full border border-border bg-bg-elev ' +
                    'flex items-center justify-center transition-transform ' +
                    (open === i ? 'rotate-45 bg-brand-grad border-transparent' : '')
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={open === i ? 'text-white' : 'text-text-dim'}>
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </span>
              </button>
              {open === i && (
                <div className="px-5 md:px-6 pb-5 md:pb-6 text-text-dim leading-relaxed text-[0.95rem] animate-fade-up">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
