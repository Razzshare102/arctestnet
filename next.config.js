/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pbs.twimg.com',        // Twitter/X profile images
      'avatars.githubusercontent.com',
      'ipfs.io',
      'gateway.pinata.cloud',
      'nftstorage.link',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      },
    ],
  },
  // Transpile ESM packages that need it
  transpilePackages: ['@circle-fin/app-kit', '@circle-fin/adapter-viem-v2'],
  webpack: (config) => {
    // Required for Wagmi / Viem in Next.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig
