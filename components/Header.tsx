'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SITE } from '@/lib/constants';
import { isLoggedIn } from '@/lib/session';

const NAV = [
  { href: '/coins/',   label: 'Coins'    },
  { href: '/privacy/', label: 'Privacy'  },
  { href: '/terms/',   label: 'Terms'    },
  { href: '/refund/',  label: 'Refunds'  },
];

export default function Header() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Read sessionStorage only after mount so SSR + client render the same first frame.
  useEffect(() => {
    setMounted(true);
    setAuthed(isLoggedIn());

    const onStorage = () => setAuthed(isLoggedIn());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Re-check on every route change too - sessionStorage doesn't fire 'storage' from the same tab.
  useEffect(() => {
    if (mounted) setAuthed(isLoggedIn());
  }, [pathname, mounted]);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between
                       px-6 py-4 border-b border-border
                       bg-[rgba(11,15,23,0.85)] backdrop-blur-md">
      <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-[1.15rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt={SITE.brand} width={40} height={40} />
        <span>{SITE.brand}</span>
      </Link>

      <nav className="flex gap-5 items-center">
        {NAV.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                'text-[0.94rem] pb-1 border-b-2 transition-colors ' +
                (isActive
                  ? 'text-brand border-brand'
                  : 'text-text-dim border-transparent hover:text-text')
              }
            >
              {label}
            </Link>
          );
        })}
        {mounted && (
          authed ? (
            <Link
              href="/wallet/"
              className={
                'text-[0.94rem] pb-1 border-b-2 transition-colors ' +
                (pathname === '/wallet/'
                  ? 'text-brand border-brand'
                  : 'text-text border-transparent hover:text-brand')
              }
            >
              Wallet
            </Link>
          ) : (
            <Link
              href="/login/"
              className="text-[0.94rem] btn-primary rounded-full px-4 py-1.5 bg-brand-grad text-[#0b0f17] font-semibold"
            >
              Sign in
            </Link>
          )
        )}
      </nav>
    </header>
  );
}
