'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/constants';

const NAV = [
  { href: '/coins/',   label: 'Coins'    },
  { href: '/privacy/', label: 'Privacy'  },
  { href: '/terms/',   label: 'Terms'    },
  { href: '/refund/',  label: 'Refunds'  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between
                       px-6 py-4 border-b border-border
                       bg-[rgba(11,15,23,0.85)] backdrop-blur-md">
      <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-[1.15rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt={SITE.brand} width={40} height={40} />
        <span>{SITE.brand}</span>
      </Link>

      <nav className="flex gap-5">
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
      </nav>
    </header>
  );
}
