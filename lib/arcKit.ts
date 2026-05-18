/**
 * ARC App Kit integration
 * Wraps @circle-fin/app-kit for use in the ShareSwap UI
 * Docs: https://docs.arc.io/app-kit/quickstarts/swap-tokens-same-chain
 */

import { AppKit, type SwapParams } from '@circle-fin/app-kit'

// ── Supported tokens on ARC Testnet ──────────────────────────────────────────
export const ARC_TOKENS = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    // Native token on ARC — used as gas currency
    address: '0x0000000000000000000000000000000000000001',
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
    color: '#2775CA',
  },
  EURC: {
    symbol: 'EURC',
    name: 'Euro Coin',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000002',
    logoUrl: 'https://cryptologos.cc/logos/euro-coin-eurc-logo.svg',
    color: '#1A56DB',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000003',
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
    color: '#26A17B',
  },
  USDe: {
    symbol: 'USDe',
    name: 'Ethena USDe',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000004',
    logoUrl: 'https://cryptologos.cc/logos/ethena-usde-usde-logo.svg',
    color: '#6366F1',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000005',
    logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg',
    color: '#F5AC37',
  },
  PYUSD: {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000006',
    logoUrl: 'https://cryptologos.cc/logos/paypal-usd-pyusd-logo.svg',
    color: '#003087',
  },
} as const

export type TokenSymbol = keyof typeof ARC_TOKENS

// ── ARC App Kit singleton factory ─────────────────────────────────────────────
let _appKit: AppKit | null = null

export function getAppKit(): AppKit {
  if (!_appKit) {
    _appKit = new AppKit({
      // Circle Console API key — required for swap
      apiKey: process.env.NEXT_PUBLIC_ARC_KIT_KEY || '',
    } as Parameters<typeof AppKit.prototype.constructor>[0])
  }
  return _appKit
}

// ── Swap parameter builder ────────────────────────────────────────────────────
export interface BuildSwapParams {
  fromToken: TokenSymbol
  toToken: TokenSymbol
  amount: string          // Human-readable amount (e.g. "100")
  walletAddress: string
  slippageBps?: number    // Basis points, e.g. 100 = 1%
}

export function buildSwapParams(p: BuildSwapParams): SwapParams {
  const from = ARC_TOKENS[p.fromToken]
  const to = ARC_TOKENS[p.toToken]

  return {
    sourceToken: from.address,
    destinationToken: to.address,
    amount: p.amount,
    walletAddress: p.walletAddress,
    chainId: 5042002,
    ...(p.slippageBps !== undefined && { slippageTolerance: p.slippageBps }),
  } as SwapParams
}

// ── Token amount formatter helpers ───────────────────────────────────────────
export function formatTokenAmount(raw: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals)
  const whole = raw / divisor
  const remainder = raw % divisor
  const decimal = remainder.toString().padStart(decimals, '0').slice(0, 4)
  return `${whole}.${decimal}`
}

export function parseTokenAmount(human: string, decimals: number): bigint {
  const [whole, frac = ''] = human.split('.')
  const fracPadded = frac.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fracPadded || '0')
}

// ── Explorer URL helpers ──────────────────────────────────────────────────────
export const EXPLORER_BASE = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://testnet.arcscan.net'

export const txUrl = (hash: string) => `${EXPLORER_BASE}/tx/${hash}`
export const addressUrl = (addr: string) => `${EXPLORER_BASE}/address/${addr}`
