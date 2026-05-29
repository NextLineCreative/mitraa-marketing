import Link from 'next/link';
import { EMAILS, LEGAL, SITE } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-20 bg-bg">
      <div className="max-w-site mx-auto px-6 md:px-10 pt-16 pb-10">
        {/* Top: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="inline-flex items-center gap-2.5 font-extrabold text-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt={SITE.brand} width={34} height={34} />
              <span className="gradient-text">{SITE.brand}</span>
            </div>
            <p className="mt-4 text-text-dim text-sm leading-relaxed max-w-xs">
              India&apos;s social calling platform — discover real people, talk
              by the minute, on your terms.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={`mailto:${EMAILS.contact}`}
                className="chip hover:border-brand/40 hover:text-text transition-colors"
              >
                {EMAILS.contact}
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-text font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#features"  className="text-text-dim hover:text-text">Features</Link></li>
              <li><Link href="/#how"       className="text-text-dim hover:text-text">How it works</Link></li>
              <li><Link href="/coins/"     className="text-text-dim hover:text-text">Pricing</Link></li>
              <li><Link href="/#download"  className="text-text-dim hover:text-text">Download</Link></li>
            </ul>
          </div>

          {/* Hosts */}
          <div>
            <h4 className="text-text font-bold text-sm mb-4">Hosts</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#hosts"     className="text-text-dim hover:text-text">Become a host</Link></li>
              <li><Link href="/#payouts"   className="text-text-dim hover:text-text">Payouts</Link></li>
              <li><Link href="/#safety"    className="text-text-dim hover:text-text">Safety</Link></li>
              <li><a href={`mailto:${EMAILS.support}`} className="text-text-dim hover:text-text">Host support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-text font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy/" className="text-text-dim hover:text-text">Privacy</Link></li>
              <li><Link href="/terms/"   className="text-text-dim hover:text-text">Terms</Link></li>
              <li><Link href="/refund/"  className="text-text-dim hover:text-text">Refunds</Link></li>
              <li><Link href="/referral-terms/" className="text-text-dim hover:text-text">Referral Terms</Link></li>
              <li><a href={`mailto:${EMAILS.grievance}`} className="text-text-dim hover:text-text">Grievance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom band */}
        <div className="mt-14 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            &copy; {year} {LEGAL.companyName}. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Made with <span className="text-brand-pink">♥</span> in India · Servers in Mumbai
          </p>
        </div>
      </div>
    </footer>
  );
}
