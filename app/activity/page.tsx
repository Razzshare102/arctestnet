'use client'

/**
 * Activity page — full on-chain transaction history with explorer links
 */

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Image,
  Send,
  Filter,
  ExternalLink,
  Copy,
  RefreshCw,
  Activity as ActivityIcon,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard } from '@/components/ui/GlassCard'
import { ConnectPrompt } from '@/components/ui/ConnectPrompt'
import { txUrl } from '@/lib/arcKit'
import { shortenAddress, timeAgo, copyToClipboard, getSwapHistory } from '@/lib/utils'

type TxType = 'all' | 'swap' | 'mint' | 'transfer'

// ── Mock full activity feed ───────────────────────────────────────────────────
const MOCK_ACTIVITY = [
  {
    id: 'a1',
    type: 'swap' as const,
    description: 'Swapped 100 USDC → EURC',
    txHash: '0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1',
    timestamp: Date.now() - 1000 * 60 * 5,
    status: 'success' as const,
    value: '$100.00',
  },
  {
    id: 'a2',
    type: 'mint' as const,
    description: 'Minted "ARC Genesis #001"',
    txHash: '0xdef456abc123def456abc123def456abc123def456abc123def456abc123def4',
    timestamp: Date.now() - 1000 * 60 * 30,
    status: 'success' as const,
    value: 'Free',
  },
  {
    id: 'a3',
    type: 'swap' as const,
    description: 'Swapped 50 EURC → USDT',
    txHash: '0xghi789jkl012ghi789jkl012ghi789jkl012ghi789jkl012ghi789jkl012gh',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    status: 'success' as const,
    value: '$54.25',
  },
  {
    id: 'a4',
    type: 'transfer' as const,
    description: 'Received 500 USDC',
    txHash: '0xjkl012mno345jkl012mno345jkl012mno345jkl012mno345jkl012mno345jk',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    status: 'success' as const,
    value: '$500.00',
  },
  {
    id: 'a5',
    type: 'swap' as const,
    description: 'Swapped 200 USDC → USDe',
    txHash: '0xmno345pqr678mno345pqr678mno345pqr678mno345pqr678mno345pqr678mn',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    status: 'failed' as const,
    value: '$200.00',
  },
]

const TYPE_ICONS = {
  swap: ArrowLeftRight,
  mint: Image,
  transfer: Send,
}

const TYPE_COLORS = {
  swap: 'text-arc-blue',
  mint: 'text-arc-purple',
  transfer: 'text-green-400',
}

const TYPE_BG = {
  swap: 'bg-arc-blue/10 border-arc-blue/20',
  mint: 'bg-arc-purple/10 border-arc-purple/20',
  transfer: 'bg-green-500/10 border-green-500/20',
}

export default function ActivityPage() {
  const { isConnected } = useAccount()
  const [filter, setFilter] = useState<TxType>('all')

  // Merge local swap history with mock data
  const swapHistory = getSwapHistory().map((s) => ({
    id: s.id,
    type: 'swap' as const,
    description: `Swapped ${s.fromAmount} ${s.fromToken} → ${s.toToken}`,
    txHash: s.txHash || '0xpending',
    timestamp: s.timestamp,
    status: s.status,
    value: `${s.fromAmount} ${s.fromToken}`,
  }))

  const allActivity = [...swapHistory, ...MOCK_ACTIVITY].sort(
    (a, b) => b.timestamp - a.timestamp
  )

  const filtered = filter === 'all' ? allActivity : allActivity.filter((a) => a.type === filter)

  if (!isConnected) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <ConnectPrompt
          title="Connect to View Activity"
          description="Connect your wallet to see your full on-chain transaction history."
        />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity</h1>
          <p className="text-arc-muted text-sm mt-1">Your full on-chain transaction history</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Txs',    value: allActivity.length.toString(),                    color: 'text-white' },
          { label: 'Successful',   value: allActivity.filter(a => a.status === 'success').length.toString(), color: 'text-green-400' },
          { label: 'Failed',       value: allActivity.filter(a => a.status === 'failed').length.toString(),  color: 'text-red-400' },
        ].map((s) => (
          <GlassCard key={s.label} className="p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-arc-muted mt-0.5">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-arc-muted" />
        {(['all', 'swap', 'mint', 'transfer'] as TxType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all capitalize ${
              filter === t
                ? 'bg-arc-blue/10 border-arc-blue/40 text-arc-blue'
                : 'border-arc-border text-arc-muted hover:border-arc-blue/30 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <GlassCard animate={false} className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ActivityIcon className="h-10 w-10 text-arc-muted/30 mx-auto mb-3" />
            <p className="text-arc-muted">No transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-arc-border/50">
            {filtered.map((tx, i) => {
              const Icon = TYPE_ICONS[tx.type]
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
                >
                  {/* Icon */}
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${TYPE_BG[tx.type]}`}>
                    <Icon className={`h-4 w-4 ${TYPE_COLORS[tx.type]}`} />
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{tx.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-arc-muted">{timeAgo(tx.timestamp)}</span>
                      <span className="text-arc-border">·</span>
                      <button
                        onClick={async () => {
                          await copyToClipboard(tx.txHash)
                          toast.success('Hash copied!')
                        }}
                        className="text-xs text-arc-muted hover:text-white transition-colors font-mono"
                      >
                        {shortenAddress(tx.txHash, 4)}
                      </button>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-sm font-medium text-white text-right">
                    {tx.value}
                  </div>

                  {/* Status */}
                  <span className={`badge ${
                    tx.status === 'success' ? 'badge-green' :
                    tx.status === 'failed' ? 'badge-red' : 'badge-blue'
                  }`}>
                    {tx.status}
                  </span>

                  {/* Explorer */}
                  <a
                    href={txUrl(tx.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-muted hover:text-arc-blue transition-colors shrink-0"
                    title="View on ArcScan"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </motion.div>
              )
            })}
          </div>
        )}
      </GlassCard>

    </div>
  )
}
