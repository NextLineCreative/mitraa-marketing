import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/constants';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — ${SITE.tagline}`,
    template: `%s — ${SITE.brand}`,
  },
  description: SITE.description,
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.brand} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
