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

  // Silence TS errors in optional-dependency code paths during build.
  // Remove once @circle-fin/* packages are installed and typed.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Also silence ESLint during build so warnings don't block deploy.
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    // ── Node built-ins not available in the browser ───────────────────────────
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }

    // ── Stub out native / React-Native packages that MetaMask SDK references
    //    but never actually exercises in a browser environment.
    config.resolve.alias = {
      ...config.resolve.alias,
      // MetaMask SDK pulls in React-Native async storage — not needed in web
      '@react-native-async-storage/async-storage': false,
      // WalletConnect logger pulls in pino-pretty — not needed in production
      'pino-pretty': false,
    }

    // Suppress "Critical dependency" warnings from dynamic optional imports
    config.module = config.module ?? {}
    config.module.exprContextCritical = false

    return config
  },
}

module.exports = nextConfig
