/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  // Lint is run explicitly via the flat TypeScript + React Hooks config.
  eslint: { ignoreDuringBuilds: true },
}
export default nextConfig
