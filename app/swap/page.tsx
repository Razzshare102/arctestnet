'use client'

/**
 * Swap page — ARC App Kit powered same-chain token swap
 * Uses @circle-fin/app-kit (optional) to swap stablecoins on ARC Testnet.
 * Falls back to stub estimates when SDK is not installed.
 */

import { useState, useCallback } from 'react'
import { useAccount, useBalance, useWalletClient } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpDown,
  Settings,
  History,
  ExternalLink,
  Info,
  Loader2,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard } from '@/components/ui/GlassCard'
import { TokenSelect } from '@/components/ui/TokenSelect'
import { TxModal, type TxStatus } from '@/components/ui/TxModal'
import { ConnectPrompt } from '@/components/ui/ConnectPrompt'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  ARC_TOKENS,
  type TokenSymbol,
  estimateSwap,
  executeSwap,
  txUrl,
} from '@/lib/arcKit'
import {
  isValidAmount,
  getSwapHistory,
  saveSwapRecord,
  updateSwapRecord,
  timeAgo,
  type SwapRecord,
} from '@/lib/utils'
import { arcTestnet } from '@/lib/wagmi'

const SLIPPAGE_PRESETS = [
  { label: '0.1%', bps: 10 },
  { label: '0.5%', bps: 50 },
  { label: '1.0%', bps: 100 },
  { label: '2.0%', bps: 200 },
]

export default function SwapPage() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  // ── Token state ──────────────────────────────────────────────────────────
  const [fromToken, setFromToken] = useState<TokenSymbol>('USDC')
  const [toToken, setToToken]     = useState<TokenSymbol>('EURC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount]     = useState('')

  // ── Settings ─────────────────────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false)
  const [slippageBps, setSlippageBps]   = useState(50)
  const [customSlippage, setCustomSlippage] = useState('')

  // ── TX state ─────────────────────────────────────────────────────────────
  const [txStatus, setTxStatus]   = useState<TxStatus>('idle')
  const [txHash, setTxHash]       = useState<string | undefined>()
  const [txModalOpen, setTxModalOpen] = useState(false)
  const [estimating, setEstimating]   = useState(false)
  const [swapping, setSwapping]       = useState(false)
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | undefined>()

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState<SwapRecord[]>(() => getSwapHistory())

  // ── Balance ───────────────────────────────────────────────────────────────
  const { data: fromBalance, isLoading: balanceLoading } = useBalance({
    address,
    chainId: arcTestnet.id,
  })

  // ── Flip direction ────────────────────────────────────────────────────────
  const handleFlip = useCallback(() => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setEstimatedGas(null)
  }, [fromToken, toToken, fromAmount, toAmount])

  // ── Estimate ──────────────────────────────────────────────────────────────
  const handleEstimate = useCallback(async () => {
    if (!isValidAmount(fromAmount) || !address) return
    setEstimating(true)
    setEstimatedGas(null)
    try {
      const estimate = await estimateSwap({
        fromToken,
        toToken,
        amount: fromAmount,
        walletAddress: address,
        slippageBps: customSlippage ? parseInt(customSlippage) * 10 : slippageBps,
      })
      setToAmount(estimate.toAmount)
      setEstimatedGas(estimate.gasFee)
    } catch (err: any) {
      // Silent fallback — stub always succeeds, this path is rarely hit
      console.warn('Estimate error:', err?.message)
    } finally {
      setEstimating(false)
    }
  }, [fromAmount, fromToken, toToken, address, slippageBps, customSlippage])

  // ── Execute swap ──────────────────────────────────────────────────────────
  const handleSwap = useCallback(async () => {
    if (!isConnected || !address || !isValidAmount(fromAmount) || !walletClient) return

    setSwapping(true)
    setTxStatus('pending')
    setTxHash(undefined)
    setTxError(undefined)
    setTxModalOpen(true)

    const recordId = Date.now().toString()
    saveSwapRecord({
      id: recordId,
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      txHash: '',
      timestamp: Date.now(),
      status: 'pending',
    })

    try {
      const result = await executeSwap(
        {
          fromToken,
          toToken,
          amount: fromAmount,
          walletAddress: address,
          slippageBps: customSlippage ? parseInt(customSlippage) * 10 : slippageBps,
        },
        walletClient,
      )

      setTxHash(result.transactionHash)
      setTxStatus('success')
      updateSwapRecord(recordId, { txHash: result.transactionHash, status: 'success' })
      setHistory(getSwapHistory())
      toast.success(`Swapped ${fromAmount} ${fromToken} → ${toToken}!`)
      setFromAmount('')
      setToAmount('')
    } catch (err: any) {
      setTxStatus('error')
      updateSwapRecord(recordId, { status: 'failed' })
      setHistory(getSwapHistory())
      const msg: string = err?.shortMessage ?? err?.message ?? 'Swap failed'
      setTxError(msg.slice(0, 150))
      toast.error(msg.slice(0, 80))
    } finally {
      setSwapping(false)
    }
  }, [isConnected, address, fromAmount, fromToken, toToken, toAmount, slippageBps, customSlippage, walletClient])

  // ── Gate: not connected ───────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <ConnectPrompt
          title="Connect to Swap"
          description="Connect your wallet to swap stablecoins on ARC Testnet using ARC App Kit."
        />
      </div>
    )
  }

  const effectiveSlippageBps = customSlippage
    ? parseInt(customSlippage) * 10
    : slippageBps

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">

        {/* ── Left: swap card ───────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Token Swap</h1>
              <p className="text-arc-muted text-sm mt-0.5">
                Powered by{' '}
                <a
                  href="https://docs.arc.io/app-kit/quickstarts/swap-tokens-same-chain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-arc-blue hover:underline"
                >
                  ARC App Kit
                </a>
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`btn-ghost p-2 rounded-xl ${showSettings ? 'text-arc-blue bg-arc-blue/10' : ''}`}
              title="Slippage settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          {/* Slippage settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard animate={false} className="p-4">
                  <div className="text-sm font-medium text-white mb-3">Slippage Tolerance</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {SLIPPAGE_PRESETS.map((p) => (
                      <button
                        key={p.bps}
                        onClick={() => { setSlippageBps(p.bps); setCustomSlippage('') }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                          slippageBps === p.bps && !customSlippage
                            ? 'bg-arc-blue/10 border-arc-blue/40 text-arc-blue'
                            : 'border-arc-border text-arc-muted hover:border-arc-blue/30 hover:text-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    {/* Custom slippage input */}
                    <div className="flex items-center gap-1.5 border border-arc-border rounded-lg px-2 py-1.5 bg-arc-dark focus-within:border-arc-blue/50">
                      <input
                        value={customSlippage}
                        onChange={(e) => setCustomSlippage(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="Custom"
                        className="w-16 bg-transparent text-sm text-white focus:outline-none"
                      />
                      <span className="text-arc-muted text-sm">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-arc-muted mt-2 flex items-center gap-1">
                    <Info className="h-3 w-3 shrink-0" />
                    Active: {customSlippage ? `${customSlippage}%` : `${slippageBps / 100}%`}
                    {' '}({effectiveSlippageBps} bps)
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main swap card */}
          <GlassCard animate={false} className="p-5">

            {/* FROM */}
            <div className="rounded-xl border border-arc-border bg-arc-dark p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-arc-muted">
                <span>From</span>
                <span>
                  {balanceLoading
                    ? <Skeleton className="h-3 w-24 inline-block" />
                    : fromBalance
                      ? `Balance: ${parseFloat(fromBalance.formatted).toFixed(4)} ${fromBalance.symbol}`
                      : null}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => {
                    setFromAmount(e.target.value)
                    setToAmount('')
                    setEstimatedGas(null)
                  }}
                  onBlur={handleEstimate}
                  placeholder="0.00"
                  min="0"
                  className="flex-1 bg-transparent text-2xl font-semibold text-white focus:outline-none placeholder-arc-muted/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <TokenSelect
                  value={fromToken}
                  onChange={(t) => { setFromToken(t); setToAmount(''); setEstimatedGas(null) }}
                  exclude={toToken}
                />
              </div>
              {/* MAX button */}
              {fromBalance && parseFloat(fromBalance.formatted) > 0 && (
                <button
                  onClick={() => {
                    setFromAmount(parseFloat(fromBalance.formatted).toFixed(4))
                    setToAmount('')
                    setEstimatedGas(null)
                  }}
                  className="text-xs text-arc-blue hover:text-white transition-colors font-medium"
                >
                  MAX
                </button>
              )}
            </div>

            {/* Flip arrow */}
            <div className="flex justify-center my-2">
              <button
                onClick={handleFlip}
                className="swap-arrow-btn h-10 w-10 rounded-xl border border-arc-border bg-arc-dark hover:border-arc-blue/40 hover:bg-arc-blue/5 flex items-center justify-center transition-all duration-200 group"
              >
                <ArrowUpDown className="h-4 w-4 text-arc-muted group-hover:text-arc-blue transition-colors" />
              </button>
            </div>

            {/* TO */}
            <div className="rounded-xl border border-arc-border bg-arc-dark p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-arc-muted">
                <span>To (estimated)</span>
                {estimating && <Loader2 className="h-3 w-3 animate-spin text-arc-blue" />}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-2xl font-semibold">
                  {estimating
                    ? <Skeleton className="h-8 w-32" />
                    : <span className={toAmount ? 'text-white' : 'text-arc-muted/40'}>
                        {toAmount || '0.00'}
                      </span>
                  }
                </div>
                <TokenSelect
                  value={toToken}
                  onChange={(t) => { setToToken(t); setToAmount(''); setEstimatedGas(null) }}
                  exclude={fromToken}
                />
              </div>
            </div>

            {/* Gas + rate row */}
            <AnimatePresence>
              {(estimatedGas || (fromAmount && toAmount && !estimating)) && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 px-1 space-y-1"
                >
                  {estimatedGas && (
                    <div className="flex items-center justify-between text-xs text-arc-muted">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-arc-blue" />
                        Est. gas fee
                      </span>
                      <span className="font-mono text-white">{estimatedGas}</span>
                    </div>
                  )}
                  {fromAmount && toAmount && !estimating && (
                    <div className="flex items-center justify-between text-xs text-arc-muted">
                      <span>Rate</span>
                      <span className="font-mono text-white">
                        1 {fromToken} ≈{' '}
                        {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Swap button */}
            <button
              onClick={handleSwap}
              disabled={swapping || !isValidAmount(fromAmount) || estimating || !walletClient}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {swapping ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Swapping…
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-4 w-4" />
                  Swap {fromToken} → {toToken}
                </>
              )}
            </button>

            <p className="text-center text-xs text-arc-muted mt-2">
              Slippage: {effectiveSlippageBps / 100}% · ARC protocol fee: 0.02%
            </p>
          </GlassCard>
        </div>

        {/* ── Right: history + token list ───────────────────────────────── */}
        <div className="space-y-4">

          {/* Recent swaps */}
          <GlassCard animate={false} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <History className="h-4 w-4 text-arc-blue" />
              Recent Swaps
            </h3>
            {history.length === 0 ? (
              <div className="py-8 text-center">
                <ArrowUpDown className="h-8 w-8 text-arc-muted/20 mx-auto mb-2" />
                <p className="text-sm text-arc-muted">No swaps yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 8).map((swap) => (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-arc-dark border border-arc-border"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {swap.fromAmount} {swap.fromToken}
                        <span className="text-arc-muted"> → </span>
                        {swap.toToken}
                      </div>
                      <div className="text-xs text-arc-muted">{timeAgo(swap.timestamp)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`badge ${
                        swap.status === 'success' ? 'badge-green'
                        : swap.status === 'failed'  ? 'badge-red'
                        : 'badge-blue'
                      }`}>
                        {swap.status}
                      </span>
                      {swap.txHash && (
                        <a
                          href={txUrl(swap.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-arc-muted hover:text-arc-blue transition-colors"
                          title="View on ArcScan"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Supported tokens */}
          <GlassCard animate={false} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Supported Tokens</h3>
            <div className="space-y-2.5">
              {Object.entries(ARC_TOKENS).map(([sym, token]) => (
                <div key={sym} className="flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: token.color + '25', color: token.color }}
                  >
                    {sym.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white leading-none">{sym}</div>
                    <div className="text-xs text-arc-muted">{token.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Transaction progress modal */}
      <TxModal
        isOpen={txModalOpen}
        onClose={() => { setTxModalOpen(false); setTxStatus('idle') }}
        status={txStatus}
        txHash={txHash}
        title="Token Swap"
        description={
          txStatus === 'pending'
            ? `Swapping ${fromAmount} ${fromToken} → ${toToken}…`
            : txStatus === 'success'
            ? `Successfully swapped ${fromAmount} ${fromToken} → ${toToken}`
            : undefined
        }
        errorMessage={txError}
      />
    </div>
  )
}
