'use client'

/**
 * Sidebar — persistent left navigation (hidden on mobile, md:flex on desktop)
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  ArrowLeftRight,
  Image,
  BarChart2,
  Activity,
  Users,
  Zap,
  ExternalLink,
  Twitter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/',           icon: Home,           label: 'Home' },
  { href: '/swap',       icon: ArrowLeftRight, label: 'Swap' },
  { href: '/nft',        icon: Image,          label: 'NFT Mint' },
  { href: '/portfolio',  icon: BarChart2,      label: 'Portfolio' },
  { href: '/activity',   icon: Activity,       label: 'Activity' },
  { href: '/community',  icon: Users,          label: 'Community' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-arc-border bg-arc-darker/60 backdrop-blur-xl shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-arc-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-arc-blue to-arc-purple shadow-neon-blue">
          <Zap className="h-4 w-4 text-arc-darker" />
        </div>
        <div>
          <div className="text-base font-bold gradient-text leading-none">ShareSwap</div>
          <div className="text-[10px] text-arc-muted mt-0.5">ARC Testnet</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-arc-blue/10 text-arc-blue'
                  : 'text-arc-muted hover:bg-white/5 hover:text-white'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-arc-blue shadow-neon-blue"
                />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        {/* Network status */}
        <div className="glass-card p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-arc-muted">Network</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 font-medium">Live</span>
            </span>
          </div>
          <div className="font-medium text-white">ARC Testnet</div>
          <div className="text-arc-muted font-mono">Chain ID: 5042002</div>
        </div>

        {/* Social */}
        <div className="flex items-center gap-2 px-1">
          <a
            href="https://x.com/Razzshares"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-arc-muted hover:text-arc-blue transition-colors"
          >
            <Twitter className="h-3.5 w-3.5" />
            <span>@Razzshares</span>
          </a>
        </div>

        {/* Explorer link */}
        <a
          href="https://testnet.arcscan.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-arc-muted hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          ArcScan Explorer
        </a>
      </div>
    </aside>
  )
}
