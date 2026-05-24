'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/constants';
import { isLoggedIn } from '@/lib/session';

const NAV = [
  { href: '/#how',      label: 'How it works' },
  { href: '/#features', label: 'Features'     },
  { href: '/coins/',    label: 'Pricing'      },
  { href: '/#hosts',    label: 'For Hosts'    },
  { href: '/#faq',      label: 'FAQ'          },
];

export default function Header() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isLoggedIn());
    const onStorage = () => setAuthed(isLoggedIn());
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('storage', onStorage);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (mounted) setAuthed(isLoggedIn());
    setOpen(false); // close menu on route change
  }, [pathname, mounted]);

  return (
    <header
      className={
        'sticky top-0 z-50 transition-all duration-300 ' +
        (scrolled
          ? 'bg-bg/85 backdrop-blur-xl border-b border-border shadow-card'
          : 'bg-transparent border-b border-transparent')
      }
    >
      <div className="max-w-site mx-auto flex items-center justify-between px-5 md:px-8 py-3.5">
        <Link href="/" className="inline-flex items-center gap-2.5 font-extrabold text-[1.15rem] tracking-tight">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt={SITE.brand} width={34} height={34} />
          <span className="gradient-text">{SITE.brand}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[0.92rem] text-text-dim hover:text-text font-medium
                         px-3 py-2 rounded-lg transition-colors hover:bg-bg-elev/50"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (authed ? (
            <Link href="/wallet/" className="chip chip-brand">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="#FACC15" stroke="#FACC15" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
              Wallet
            </Link>
          ) : (
            <Link href="/login/" className="text-[0.92rem] text-text-dim hover:text-text font-medium">
              Sign in
            </Link>
          ))}
          <a
            href="#download"
            className="btn btn-primary !py-2.5 !px-5 text-sm"
          >
            Get the app
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg
                     bg-bg-elev/60 border border-border"
          onClick={() => setOpen((s) => !s)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl animate-fade-up">
          <div className="px-5 py-3 flex flex-col gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-3 rounded-lg text-text font-medium hover:bg-bg-elev"
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {mounted && (authed ? (
              <Link href="/wallet/" className="block px-3 py-3 rounded-lg font-medium text-brand">
                Wallet
              </Link>
            ) : (
              <Link href="/login/" className="block px-3 py-3 rounded-lg font-medium text-text">
                Sign in
              </Link>
            ))}
            <a href="#download" className="btn btn-primary mt-2 justify-center">
              Get the app
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
