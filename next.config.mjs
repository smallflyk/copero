/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  // Local CI may opt out when type packages are unavailable; regular builds type-check.
  typescript: { ignoreBuildErrors: process.env.CODEX_SKIP_TYPES === '1' },
}

export default nextConfig
