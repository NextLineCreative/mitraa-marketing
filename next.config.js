/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the build output deploys cleanly to GitHub Pages.
  // When we later migrate to Vercel for server-side features, just remove this line.
  output: 'export',

  // GH Pages serves with trailing slashes and the static export plays nicer
  // when each route lives in its own folder (e.g. /privacy/index.html).
  trailingSlash: true,

  // No Next.js image optimisation on static export.
  images: { unoptimized: true },

  // Used by Next/Vercel - we don't strictly need it for static export.
  reactStrictMode: true,
};

module.exports = nextConfig;
