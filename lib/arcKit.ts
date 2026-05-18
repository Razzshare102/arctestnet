/**
 * ARC App Kit integration — runtime-safe wrapper
 *
 * @circle-fin/app-kit is an OPTIONAL dependency. When it is not installed
 * (e.g. during a cold Vercel build before the developer adds it), this module
 * falls back to a lightweight stub that:
 *   - returns plausible rate estimates (so the UI renders correctly)
 *   - throws a clear error on actual swap execution (prompting the user to
 *     add their Circle Console API key and install the real SDK)
 *
 * Once the developer installs @circle-fin/app-kit the real SDK is used
 * automatically — no code changes needed.
 *
 * Docs: https://docs.arc.io/app-kit/quickstarts/swap-tokens-same-chain
 */

// ── Supported tokens on ARC Testnet ──────────────────────────────────────────
export const ARC_TOKENS = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000001' as `0x${string}`,
    color: '#2775CA',
  },
  EURC: {
    symbol: 'EURC',
    name: 'Euro Coin',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000002' as `0x${string}`,
    color: '#1A56DB',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000003' as `0x${string}`,
    color: '#26A17B',
  },
  USDe: {
    symbol: 'USDe',
    name: 'Ethena USDe',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000004' as `0x${string}`,
    color: '#6366F1',
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000005' as `0x${string}`,
    color: '#F5AC37',
  },
  PYUSD: {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000006' as `0x${string}`,
    color: '#003087',
  },
} as const

export type TokenSymbol = keyof typeof ARC_TOKENS

// ── Stub rate table (from → to) ───────────────────────────────────────────────
// Used when the real SDK is not available. Rates are illustrative only.
const STUB_RATES: Record<string, number> = {
  'USDC-EURC': 0.9195,
  'EURC-USDC': 1.0876,
  'USDC-USDT': 0.9998,
  'USDT-USDC': 1.0002,
  'USDC-USDe': 0.9990,
  'USDe-USDC': 1.001,
  'USDC-DAI':  0.9985,
  'DAI-USDC':  1.0015,
  'USDC-PYUSD': 0.9997,
  'PYUSD-USDC': 1.0003,
}

function getStubRate(from: TokenSymbol, to: TokenSymbol): number {
  return STUB_RATES[`${from}-${to}`] ?? 1.0
}

// ── Shared parameter shape ────────────────────────────────────────────────────
export interface ArcSwapParams {
  fromToken: TokenSymbol
  toToken: TokenSymbol
  amount: string          // human-readable, e.g. "100.00"
  walletAddress: string
  slippageBps?: number    // basis points, e.g. 50 = 0.5 %
}

export interface ArcSwapEstimate {
  toAmount: string        // human-readable output amount
  rate: string            // 1 FROM = X TO
  gasFee: string          // e.g. "~0.001 USDC"
  slippageBps: number
}

export interface ArcSwapResult {
  transactionHash: string
  fromAmount: string
  toAmount: string
  fromToken: TokenSymbol
  toToken: TokenSymbol
}

// ── SDK loader — tries to import real SDK, falls back to stub ─────────────────
let _sdkAvailable: boolean | null = null

async function isSdkAvailable(): Promise<boolean> {
  if (_sdkAvailable !== null) return _sdkAvailable
  try {
    await import('@circle-fin/app-kit')
    _sdkAvailable = true
  } catch {
    _sdkAvailable = false
  }
  return _sdkAvailable
}

// ── estimateSwap ──────────────────────────────────────────────────────────────
/**
 * Returns an estimated output amount and gas fee before executing the swap.
 * Uses the real ARC App Kit when available, otherwise returns a stub estimate.
 */
export async function estimateSwap(params: ArcSwapParams): Promise<ArcSwapEstimate> {
  const sdkOk = await isSdkAvailable()
  const slippageBps = params.slippageBps ?? 50

  if (sdkOk) {
    try {
      const { AppKit } = await import('@circle-fin/app-kit')
      const kit = new AppKit({
        apiKey: process.env.NEXT_PUBLIC_ARC_KIT_KEY ?? '',
      } as any)

      const from = ARC_TOKENS[params.fromToken]
      const to   = ARC_TOKENS[params.toToken]

      const result = await (kit as any).estimateSwap({
        sourceToken:      from.address,
        destinationToken: to.address,
        amount:           params.amount,
        walletAddress:    params.walletAddress,
        chainId:          5042002,
        slippageTolerance: slippageBps,
      })

      const destAmount: string =
        result?.destinationAmount ?? result?.toAmount ?? String(
          parseFloat(params.amount) * getStubRate(params.fromToken, params.toToken)
        )

      const rate = (parseFloat(destAmount) / parseFloat(params.amount)).toFixed(6)

      return {
        toAmount: parseFloat(destAmount).toFixed(6),
        rate,
        gasFee: result?.gasFee ?? result?.estimatedGas ?? '~0.001 USDC',
        slippageBps,
      }
    } catch (err: any) {
      // SDK present but API call failed (e.g. bad key) → fall through to stub
      console.warn('[ArcKit] estimateSwap SDK error, using stub:', err?.message)
    }
  }

  // ── Stub estimate ─────────────────────────────────────────────────────────
  const rate = getStubRate(params.fromToken, params.toToken)
  const toAmount = (parseFloat(params.amount) * rate).toFixed(6)

  return {
    toAmount,
    rate: rate.toFixed(6),
    gasFee: '~0.001 USDC',
    slippageBps,
  }
}

// ── executeSwap ───────────────────────────────────────────────────────────────
/**
 * Executes the swap via ARC App Kit.
 * Requires the real SDK + a valid Circle Console API key.
 * Without them, throws a descriptive error so the user knows exactly what to do.
 */
export async function executeSwap(
  params: ArcSwapParams,
  walletClient: any,   // viem WalletClient passed from the component
): Promise<ArcSwapResult> {
  const sdkOk = await isSdkAvailable()

  if (!sdkOk) {
    throw new Error(
      'ARC App Kit is not installed. ' +
      'Run: npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 ' +
      'and add NEXT_PUBLIC_ARC_KIT_KEY to your .env.local'
    )
  }

  if (!process.env.NEXT_PUBLIC_ARC_KIT_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_ARC_KIT_KEY. ' +
      'Get a free key at https://console.circle.com and add it to .env.local'
    )
  }

  const { AppKit } = await import('@circle-fin/app-kit')
  const { createViemAdapterFromWalletClient } = await import('@circle-fin/adapter-viem-v2') as any

  const kit = new AppKit({
    apiKey: process.env.NEXT_PUBLIC_ARC_KIT_KEY,
  } as any)

  const from = ARC_TOKENS[params.fromToken]
  const to   = ARC_TOKENS[params.toToken]

  // Build adapter from the connected wagmi WalletClient
  const adapter = createViemAdapterFromWalletClient
    ? createViemAdapterFromWalletClient(walletClient)
    : walletClient

  const result = await (kit as any).swap({
    sourceToken:      from.address,
    destinationToken: to.address,
    amount:           params.amount,
    walletAddress:    params.walletAddress,
    chainId:          5042002,
    ...(params.slippageBps !== undefined && { slippageTolerance: params.slippageBps }),
    adapter,
  })

  const hash: string =
    result?.transactionHash ??
    result?.txHash ??
    result?.hash ??
    (() => { throw new Error('Swap completed but no transaction hash returned') })()

  const destAmount: string =
    result?.destinationAmount ??
    result?.toAmount ??
    (parseFloat(params.amount) * getStubRate(params.fromToken, params.toToken)).toFixed(6)

  return {
    transactionHash: hash,
    fromAmount: params.amount,
    toAmount: parseFloat(destAmount).toFixed(6),
    fromToken: params.fromToken,
    toToken: params.toToken,
  }
}

// ── Explorer helpers ──────────────────────────────────────────────────────────
export const EXPLORER_BASE =
  process.env.NEXT_PUBLIC_EXPLORER_URL ?? 'https://testnet.arcscan.net'

export const txUrl      = (hash: string) => `${EXPLORER_BASE}/tx/${hash}`
export const addressUrl = (addr: string) => `${EXPLORER_BASE}/address/${addr}`
