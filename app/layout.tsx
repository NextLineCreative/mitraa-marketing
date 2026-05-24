import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/constants';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand} — ${SITE.tagline}`,
    template: `%s — ${SITE.brand}`,
  },
  description: SITE.description,
  keywords: [
    'social calling app India',
    'voice call host',
    'video call platform',
    'pay per minute calls',
    'meet new people India',
    'live host chat',
    'Mitraa',
  ],
  authors: [{ name: SITE.brand }],
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.brand} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.brand,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.brand} — ${SITE.tagline}`,
    description: SITE.description,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#07060F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body data-grid="on" className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
