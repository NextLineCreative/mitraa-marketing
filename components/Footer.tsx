import Link from 'next/link';
import { LEGAL } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6 text-center text-sm text-text-muted">
      <p className="my-1">
        &copy; {new Date().getFullYear()} {LEGAL.companyName}. All rights reserved.
      </p>
      <p className="my-1">
        <Link href="/privacy/" className="text-text-dim hover:text-text">Privacy</Link>
        {' · '}
        <Link href="/terms/" className="text-text-dim hover:text-text">Terms</Link>
        {' · '}
        <Link href="/refund/" className="text-text-dim hover:text-text">Refunds</Link>
      </p>
    </footer>
  );
}
