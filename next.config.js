/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
      { protocol: 'https', hostname: '**.ipfs.io' },
      { protocol: 'https', hostname: 'nftstorage.link' },
    ],
  },

  webpack: (config) => {
    // Polyfill Node built-ins that some Web3 packages reference
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    // Suppress "Critical dependency: the request of a dependency is an expression"
    // warnings that come from optional dynamic imports of @circle-fin/* packages
    config.module = config.module ?? {}
    config.module.exprContextCritical = false

    return config
  },

  // Silence noisy build output
  logging: {
    fetches: { fullUrl: false },
  },
}

module.exports = nextConfig
