import type { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
  title: 'System Status',
  description:
    'Live operational status for the Mitraa app, website, and API. Check here during maintenance.',
  // Status is real-time; don't let crawlers cache a stale snapshot.
  robots: { index: true, follow: true },
};

// Always render fresh — the live state comes from client-side polling, but we
// also avoid any static caching of the shell.
export const dynamic = 'force-dynamic';

export default function StatusPage() {
  return <StatusClient />;
}
