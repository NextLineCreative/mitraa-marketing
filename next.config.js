/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed on Hostinger's Node.js Web App runtime (it runs `npm run build` +
  // `npm start` on every push). So we want a real Next.js server, not a static
  // export. Leave `output` unset.

  // Keep trailing slashes so URLs match what we already documented and
  // submitted to Firebase brand verification (/privacy/, /coins/, etc.)
  trailingSlash: true,

  reactStrictMode: true,
};

module.exports = nextConfig;
