import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  // Local CI may opt out when type packages are unavailable; regular builds type-check.
  typescript: { ignoreBuildErrors: process.env.CODEX_SKIP_TYPES === '1' },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
