'use client'

/**
 * Home page — hero, feature highlights, stats
 */

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  Image,
  BarChart2,
  Activity,
  Users,
  Zap,
  Shield,
  Cpu,
  ChevronRight,
  Twitter,
  ExternalLink,
  Star,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const features = [
  {
    icon: ArrowLeftRight,
    title: 'Stablecoin Swap',
    description:
      'Swap USDC, EURC, USDT, USDe, DAI, and PYUSD on ARC Testnet using the official ARC App Kit SDK.',
    href: '/swap',
    color: '#00D4FF',
    badge: 'Live',
  },
  {
    icon: Image,
    title: 'NFT Mint',
    description:
      'Upload your artwork, add metadata, and mint ERC-721 NFTs directly to your wallet on ARC Testnet.',
    href: '/nft',
    color: '#8B5CF6',
    badge: 'New',
  },
  {
    icon: BarChart2,
    title: 'Portfolio Dashboard',
    description:
      'View all your token balances, NFT holdings, and transaction history in one unified dashboard.',
    href: '/portfolio',
    color: '#EC4899',
    badge: null,
  },
  {
    icon: Activity,
    title: 'Activity Feed',
    description:
      'Track all your on-chain actions — swaps, mints, transfers — with explorer links and timestamps.',
    href: '/activity',
    color: '#F59E0B',
    badge: null,
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Join the ShareSwap community, follow @Razzshares on X, and share your swap activity.',
    href: '/community',
    color: '#10B981',
    badge: null,
  },
]

const stats = [
  { label: 'Network', value: 'ARC Testnet' },
  { label: 'Chain ID', value: '5042002' },
  { label: 'Gas Token', value: 'USDC' },
  { label: 'Swap Fee', value: '0.02%' },
]

const techStack = ['Next.js 14', 'TypeScript', 'Wagmi v2', 'RainbowKit', 'ARC App Kit', 'Viem', 'Framer Motion', 'TailwindCSS']

export default function HomePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 space-y-16">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative text-center pt-8 pb-4">
        {/* Glow backdrop */}
        <div className="absolute inset-0 -z-10 bg-hero-glow pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-arc-blue/20 bg-arc-blue/5 px-4 py-1.5 text-sm text-arc-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-arc-blue animate-pulse" />
            Built on ARC Testnet · Chain ID 5042002
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="gradient-text">ShareSwap</span>
            <br />
            <span className="text-white/80 text-3xl sm:text-4xl lg:text-5xl font-semibold">
              DeFi for the ARC Ecosystem
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-arc-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Swap stablecoins instantly, mint NFTs, and manage your crypto portfolio —
            all powered by the official <span className="text-arc-blue">ARC App Kit SDK</span> and
            built by <a href="https://x.com/Razzshares" target="_blank" rel="noopener noreferrer" className="text-arc-purple hover:text-white transition-colors">@Razzshares</a>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <ConnectButton label="🚀 Connect Wallet" />
            <Link href="/swap" className="btn-secondary flex items-center gap-2">
              Start Swapping <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-4 text-sm text-arc-muted pt-2">
            <a
              href="https://x.com/Razzshares"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-arc-blue transition-colors"
            >
              <Twitter className="h-4 w-4" />
              Follow @Razzshares
            </a>
            <span>•</span>
            <a
              href="https://testnet.arcscan.net"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-arc-blue transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              ArcScan Explorer
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Network stats bar ────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className="text-lg font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-arc-muted mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────────── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Everything you need</h2>
          <p className="text-arc-muted">A complete DeFi experience on ARC Testnet</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div
              key={feat.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={feat.href}>
                <GlassCard
                  hover
                  glow="blue"
                  animate={false}
                  className="p-6 h-full group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: feat.color + '18', border: `1px solid ${feat.color}30` }}
                    >
                      <feat.icon className="h-6 w-6" style={{ color: feat.color }} />
                    </div>
                    {feat.badge && (
                      <span className="badge-blue text-xs">{feat.badge}</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-arc-blue transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-arc-muted leading-relaxed">{feat.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs font-medium" style={{ color: feat.color }}>
                    Explore <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why ARC section ──────────────────────────────────────────────── */}
      <section>
        <GlassCard className="p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-arc-blue/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="badge-blue mb-3">Why ARC?</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Built on Circle's Economic OS
              </h2>
              <p className="text-arc-muted leading-relaxed mb-4">
                ARC (formerly USDC Kit) is Circle's blockchain, using USDC as native gas.
                That means low, predictable, dollar-denominated fees — perfect for DeFi.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: 'USDC as native gas — predictable fees' },
                  { icon: Zap, text: 'Same-chain swaps in milliseconds' },
                  { icon: Cpu, text: 'EVM-compatible — use familiar tools' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-arc-blue shrink-0" />
                    <span className="text-arc-muted">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-medium text-arc-muted mb-2">Tech Stack</div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="badge-blue text-xs">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* ── Builder card ─────────────────────────────────────────────────── */}
      <section>
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-arc-blue/5 via-arc-purple/5 to-arc-pink/5 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-arc-blue to-arc-purple flex items-center justify-center text-2xl font-bold text-arc-darker shrink-0">
              R
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <span className="font-bold text-white text-lg">RazzShares</span>
                <Star className="h-4 w-4 text-arc-blue fill-arc-blue" />
              </div>
              <p className="text-arc-muted text-sm">
                Builder · Web3 developer · ARC ecosystem contributor
              </p>
              <p className="text-arc-muted text-xs mt-1">
                Follow for the latest ARC testnet builds and DeFi experiments
              </p>
            </div>
            <a
              href="https://x.com/Razzshares"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 shrink-0"
            >
              <Twitter className="h-4 w-4" />
              Follow on X
            </a>
          </div>
        </GlassCard>
      </section>

    </div>
  )
}
