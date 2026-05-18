'use client'

/**
 * Portfolio page — wallet asset overview, token balances, NFTs, transactions
 */

import { useAccount, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  Image,
  Activity,
  Copy,
  ExternalLink,
  RefreshCw,
  DollarSign,
  Coins,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCard } from '@/components/ui/StatCard'
import { ConnectPrompt } from '@/components/ui/ConnectPrompt'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { ARC_TOKENS, type TokenSymbol, addressUrl } from '@/lib/arcKit'
import { shortenAddress, formatUSD, formatNumber, copyToClipboard, getSwapHistory } from '@/lib/utils'
import { arcTestnet } from '@/lib/wagmi'

// ── Mock token portfolio (in production: read from contract) ──────────────────
const MOCK_PORTFOLIO = [
  { symbol: 'USDC', name: 'USD Coin',     balance: '1,250.00', valueUSD: 1250.00, change: 0.0   },
  { symbol: 'EURC', name: 'Euro Coin',    balance: '500.000',  valueUSD: 542.50,  change: 0.42  },
  { symbol: 'USDT', name: 'Tether USD',   balance: '320.000',  valueUSD: 320.00,  change: -0.01 },
  { symbol: 'USDe', name: 'Ethena USDe',  balance: '100.000',  valueUSD: 100.05,  change: 0.05  },
]

export default function PortfolioPage() {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading: balanceLoading, refetch } = useBalance({
    address,
    chainId: arcTestnet.id,
  })

  const history = getSwapHistory()
  const totalUSD = MOCK_PORTFOLIO.reduce((sum, t) => sum + t.valueUSD, 0)

  const handleCopyAddress = async () => {
    if (!address) return
    await copyToClipboard(address)
    toast.success('Address copied!')
  }

  if (!isConnected) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <ConnectPrompt
          title="Connect to View Portfolio"
          description="Connect your wallet to see your token balances, NFTs, and transaction history."
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-arc-muted text-sm mt-1">Your ARC Testnet wallet overview</p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* ── Wallet identity card ─────────────────────────────────────────── */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-arc-blue to-arc-purple flex items-center justify-center text-xl font-bold text-arc-darker shrink-0">
            {address?.slice(2, 4).toUpperCase()}
          </div>

          {/* Address */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm sm:text-base font-medium text-white">
                {shortenAddress(address!, 8)}
              </span>
              <button
                onClick={handleCopyAddress}
                className="text-arc-muted hover:text-arc-blue transition-colors"
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </button>
              <a
                href={addressUrl(address!)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-arc-muted hover:text-arc-blue transition-colors"
                title="View on ArcScan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="text-xs text-arc-muted mt-0.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Connected to ARC Testnet
            </div>
          </div>

          {/* Native balance */}
          <div className="text-right">
            {balanceLoading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <>
                <div className="text-2xl font-bold text-white">
                  {balance ? formatNumber(parseFloat(balance.formatted), 4) : '0.0000'}
                </div>
                <div className="text-sm text-arc-muted">{balance?.symbol ?? 'USDC'}</div>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Value"
          value={formatUSD(totalUSD)}
          icon={DollarSign}
          iconColor="text-arc-blue"
          trend={{ value: 1.2, label: '24h' }}
          delay={0}
        />
        <StatCard
          title="Tokens Held"
          value={MOCK_PORTFOLIO.length.toString()}
          icon={Coins}
          iconColor="text-arc-purple"
          delay={0.1}
        />
        <StatCard
          title="NFTs Owned"
          value="2"
          icon={Image}
          iconColor="text-arc-pink"
          delay={0.2}
        />
        <StatCard
          title="Total Swaps"
          value={history.length.toString()}
          icon={Activity}
          iconColor="text-yellow-400"
          delay={0.3}
        />
      </div>

      {/* ── Token balances ────────────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-arc-border flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Coins className="h-4 w-4 text-arc-blue" />
            Token Balances
          </h2>
          <span className="badge-blue">{MOCK_PORTFOLIO.length} tokens</span>
        </div>

        <div className="divide-y divide-arc-border/50">
          {MOCK_PORTFOLIO.map((token, i) => {
            const meta = ARC_TOKENS[token.symbol as TokenSymbol]
            const changePositive = token.change >= 0
            return (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
              >
                {/* Token icon */}
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    backgroundColor: meta?.color + '25' || '#ffffff10',
                    color: meta?.color || '#ffffff',
                  }}
                >
                  {token.symbol.slice(0, 2)}
                </div>

                {/* Token info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{token.symbol}</div>
                  <div className="text-xs text-arc-muted">{token.name}</div>
                </div>

                {/* Balance */}
                <div className="text-right">
                  <div className="font-mono text-sm font-medium text-white">{token.balance}</div>
                  <div className="text-xs text-arc-muted">{formatUSD(token.valueUSD)}</div>
                </div>

                {/* 24h change */}
                <div className={`text-xs font-medium w-14 text-right ${
                  changePositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {changePositive ? '+' : ''}{token.change.toFixed(2)}%
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Total row */}
        <div className="px-5 py-4 border-t border-arc-border bg-arc-dark/30 flex items-center justify-between">
          <span className="text-sm font-medium text-arc-muted">Total Portfolio Value</span>
          <span className="text-lg font-bold gradient-text">{formatUSD(totalUSD)}</span>
        </div>
      </GlassCard>

      {/* ── Recent Swaps ──────────────────────────────────────────────────── */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-arc-border flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-arc-purple" />
            Recent Activity
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center text-arc-muted text-sm">
            No recent activity. Make your first swap!
          </div>
        ) : (
          <div className="divide-y divide-arc-border/50">
            {history.slice(0, 5).map((swap) => (
              <div key={swap.id} className="flex items-center gap-4 px-5 py-3">
                <div className="h-8 w-8 rounded-lg bg-arc-blue/10 border border-arc-blue/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4 text-arc-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">
                    {swap.fromAmount} {swap.fromToken} → {swap.toToken}
                  </div>
                  <div className="text-xs text-arc-muted">
                    {new Date(swap.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    swap.status === 'success' ? 'badge-green' :
                    swap.status === 'failed' ? 'badge-red' : 'badge-blue'
                  }`}>
                    {swap.status}
                  </span>
                  {swap.txHash && (
                    <a href={`https://testnet.arcscan.net/tx/${swap.txHash}`} target="_blank" rel="noopener noreferrer" className="text-arc-muted hover:text-arc-blue transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

    </div>
  )
}
