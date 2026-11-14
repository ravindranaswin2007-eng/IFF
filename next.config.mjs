import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.amazonaws.com' }, { protocol: 'https', hostname: '**.cloudfront.net' }],
  },
  experimental: {
    // Resume uploads go through a server action; allow files up to ~5 MB.
    serverActions: { bodySizeLimit: '6mb' },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
