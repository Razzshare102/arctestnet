/**
 * Wagmi + RainbowKit configuration
 * Configures ARC Testnet as the primary chain with multi-wallet support
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  rabbyWallet,
  zerionWallet,
  walletConnectWallet,
  injectedWallet,
  rainbowWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { defineChain } from 'viem'

// ── ARC Testnet chain definition ──────────────────────────────────────────────
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'ARC Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.quicknode.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://testnet.arcscan.net',
    },
  },
  testnet: true,
})

// ── Wagmi config ──────────────────────────────────────────────────────────────
export const wagmiConfig = getDefaultConfig({
  appName: 'ShareSwap',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'shareswap_demo_id',
  chains: [arcTestnet],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rabbyWallet, zerionWallet],
    },
    {
      groupName: 'WalletConnect',
      wallets: [walletConnectWallet, rainbowWallet],
    },
    {
      groupName: 'Other',
      wallets: [coinbaseWallet, injectedWallet],
    },
  ],
  ssr: true, // Next.js SSR support
})
