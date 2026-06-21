/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed on Hostinger's Node.js Web App runtime (it runs `npm run build` +
  // `npm start` on every push). So we want a real Next.js server, not a static
  // export. Leave `output` unset.

  // Keep trailing slashes so URLs match what we already documented and
  // submitted to Firebase brand verification (/privacy/, /coins/, etc.)
  trailingSlash: true,

  reactStrictMode: true,

  // ── Security headers (MKTG-01) ───────────────────────────────────────────
  // This is a PUBLIC site that serves the authenticated /withdraw bank/UPI PII
  // form, /wallet, and the /login OTP flow. Without these headers the pages are
  // framable (clickjacking on the withdrawal form) and lack a CSP.
  //
  // The CSP keeps 'unsafe-inline' (and 'unsafe-eval') because Next.js, the
  // MSG91 OTP widget, Firebase auth, and Razorpay checkout all need them — the
  // goal here is the directives that don't risk breaking flows: frame-ancestors
  // 'none', object-src 'none', base-uri 'none', plus an allowlist of the exact
  // third-party origins the site actually loads (MSG91, Razorpay, Firebase).
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://verify.msg91.com https://verify.phone91.com https://control.msg91.com https://checkout.razorpay.com https://*.razorpay.com https://*.googleapis.com https://*.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // XHR/fetch/websocket targets: our API + Firebase auth + MSG91 verify + Razorpay
      "connect-src 'self' https://api.mitraa.shop https://*.googleapis.com https://*.firebaseio.com https://verify.msg91.com https://verify.phone91.com https://control.msg91.com https://*.razorpay.com",
      // Embedded iframes: Razorpay checkout, MSG91 widget, Firebase auth handler
      "frame-src 'self' https://*.razorpay.com https://verify.msg91.com https://verify.phone91.com https://mitraa-f3829.firebaseapp.com",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
