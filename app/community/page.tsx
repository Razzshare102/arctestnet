'use client'

/**
 * Community page — social profile, links, share activity
 */

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import {
  Twitter,
  ExternalLink,
  Star,
  Users,
  Share2,
  Copy,
  Globe,
  Code2,
  Zap,
  CheckCircle2,
  Heart,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GlassCard } from '@/components/ui/GlassCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getSwapHistory, copyToClipboard } from '@/lib/utils'

// ── Community members (demo) ──────────────────────────────────────────────────
const COMMUNITY_MEMBERS = [
  { handle: '@Razzshares', role: 'Builder', joined: 'May 2026', badge: '⭐ Creator' },
  { handle: '@ArcDev',     role: 'Contributor', joined: 'Apr 2026', badge: null },
  { handle: '@DeFiWizard', role: 'Trader', joined: 'May 2026', badge: null },
  { handle: '@StableKing', role: 'Liquidity Provider', joined: 'May 2026', badge: null },
]

// ── Ecosystem links ───────────────────────────────────────────────────────────
const ECOSYSTEM_LINKS = [
  { label: 'ARC Docs',     href: 'https://docs.arc.io',                   icon: Code2,    color: '#00D4FF' },
  { label: 'ArcScan',      href: 'https://testnet.arcscan.net',            icon: ExternalLink, color: '#8B5CF6' },
  { label: 'ARC Network',  href: 'https://arc.network',                   icon: Globe,    color: '#EC4899' },
  { label: 'Circle Faucet',href: 'https://faucet.circle.com',             icon: Zap,      color: '#F59E0B' },
]

export default function CommunityPage() {
  const { isConnected } = useAccount()
  const history = getSwapHistory()
  const [shared, setShared] = useState(false)

  const handleShareActivity = async () => {
    const swapCount = history.filter((h) => h.status === 'success').length
    const text = `🚀 I've made ${swapCount} swaps on ShareSwap — the ARC Testnet DeFi app!

Built with @circle_fin App Kit • ARC Testnet (Chain ID: 5042002)
Try it out → shareswap.vercel.app

Built by @Razzshares #ARC #DeFi #Web3`

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(tweetUrl, '_blank')
    setShared(true)
    toast.success('Sharing your activity!')
  }

  const handleCopyInvite = async () => {
    await copyToClipboard('https://shareswap.vercel.app')
    toast.success('Invite link copied!')
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="text-arc-muted text-sm mt-1">
          Join the ShareSwap community and explore the ARC ecosystem
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">

        {/* ── Left column ───────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Creator profile card — RazzShares */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard animate={false} className="p-6 relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-arc-blue/5 via-arc-purple/5 to-arc-pink/5 pointer-events-none" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-arc-blue/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-arc-blue to-arc-purple flex items-center justify-center text-3xl font-extrabold text-arc-darker">
                    R
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-arc-blue flex items-center justify-center border-2 border-arc-darker">
                    <CheckCircle2 className="h-3.5 w-3.5 text-arc-darker" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xl font-bold text-white">RazzShares</span>
                    <span className="badge-blue text-xs">⭐ Creator</span>
                    <span className="badge-purple text-xs">Builder</span>
                  </div>
                  <p className="text-arc-muted text-sm leading-relaxed mb-3">
                    Web3 developer building on the ARC ecosystem. Exploring DeFi, stablecoins, and NFTs on ARC Testnet.
                    Follow along for the latest builds and experiments.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href="https://x.com/Razzshares"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 text-sm px-4 py-2"
                    >
                      <Twitter className="h-4 w-4" />
                      Follow @Razzshares
                    </a>
                    <a
                      href="https://x.com/Razzshares"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-2 text-sm px-4 py-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Profile
                    </a>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="relative mt-5 pt-5 border-t border-arc-border grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Projects',  value: '5+' },
                  { label: 'Network',   value: 'ARC' },
                  { label: 'Since',     value: '2026' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-lg font-bold gradient-text">{s.value}</div>
                    <div className="text-xs text-arc-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Share activity */}
          <GlassCard animate={false} className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-arc-blue/10 border border-arc-blue/20 flex items-center justify-center shrink-0">
                <Share2 className="h-5 w-5 text-arc-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">Share Your Activity</h3>
                <p className="text-sm text-arc-muted mb-3">
                  Show off your swaps and NFT mints to the ARC community on X/Twitter.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleShareActivity}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    {shared ? (
                      <><CheckCircle2 className="h-4 w-4" /> Shared!</>
                    ) : (
                      <><Twitter className="h-4 w-4" /> Share on X</>
                    )}
                  </button>
                  <button
                    onClick={handleCopyInvite}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Invite
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Community members */}
          <GlassCard animate={false} className="overflow-hidden">
            <div className="px-5 py-4 border-b border-arc-border flex items-center gap-2">
              <Users className="h-4 w-4 text-arc-purple" />
              <h3 className="font-semibold text-white">Community Members</h3>
            </div>
            <div className="divide-y divide-arc-border/50">
              {COMMUNITY_MEMBERS.map((member, i) => (
                <motion.div
                  key={member.handle}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/2 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-arc-blue/30 to-arc-purple/30 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {member.handle[1].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      {member.handle}
                      {member.badge && (
                        <span className="badge-blue text-[10px]">{member.badge}</span>
                      )}
                    </div>
                    <div className="text-xs text-arc-muted">{member.role} · Joined {member.joined}</div>
                  </div>
                  <a
                    href={`https://x.com/${member.handle.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-muted hover:text-arc-blue transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Ecosystem links */}
          <GlassCard animate={false} className="p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-arc-blue" />
              ARC Ecosystem
            </h3>
            <div className="space-y-2">
              {ECOSYSTEM_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-arc-border hover:border-arc-blue/30 hover:bg-white/2 transition-all group"
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: link.color + '20' }}
                  >
                    <link.icon className="h-4 w-4" style={{ color: link.color }} />
                  </div>
                  <span className="text-sm font-medium text-arc-muted group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-arc-muted/40 ml-auto group-hover:text-arc-muted transition-colors" />
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Network info */}
          <GlassCard animate={false} className="p-5 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-arc-blue" />
              Network Info
            </h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Network', value: 'ARC Testnet' },
                { label: 'Chain ID', value: '5042002' },
                { label: 'Gas Token', value: 'USDC' },
                { label: 'RPC',    value: 'rpc.testnet.arc.network' },
                { label: 'Explorer', value: 'testnet.arcscan.net' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-arc-muted">{label}</span>
                  <span className="font-mono text-white text-xs">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Wallet CTA */}
          {!isConnected && (
            <GlassCard animate={false} className="p-5 text-center">
              <Heart className="h-8 w-8 text-arc-pink mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Join ShareSwap</h3>
              <p className="text-sm text-arc-muted mb-4">
                Connect your wallet to start trading and become part of the community.
              </p>
              <ConnectButton />
            </GlassCard>
          )}

          {/* Built by card */}
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-arc-muted">
              Built with ❤️ by{' '}
              <a
                href="https://x.com/Razzshares"
                target="_blank"
                rel="noopener noreferrer"
                className="text-arc-blue hover:underline font-medium"
              >
                @Razzshares
              </a>
              {' '}· Powered by{' '}
              <a
                href="https://docs.arc.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-arc-purple hover:underline font-medium"
              >
                ARC App Kit
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
