'use client'

/**
 * Navbar — top navigation bar with wallet connect button
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import {
  Menu,
  X,
  Zap,
  ExternalLink,
  Twitter,
} from 'lucide-react'
import { cn, shortenAddress, formatNumber } from '@/lib/utils'
import { arcTestnet } from '@/lib/wagmi'

const mobileNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/swap', label: 'Swap' },
  { href: '/nft', label: 'NFT Mint' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/activity', label: 'Activity' },
  { href: '/community', label: 'Community' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address,
    chainId: arcTestnet.id,
  })

  return (
    <header className="sticky top-0 z-40 w-full border-b border-arc-border bg-arc-darker/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-arc-blue to-arc-purple shadow-neon-blue">
            <Zap className="h-4 w-4 text-arc-darker" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">ShareSwap</span>
        </Link>

        {/* Desktop — breadcrumb/page title */}
        <div className="hidden md:block">
          <span className="text-sm text-arc-muted">
            ARC Testnet •{' '}
            <span className="text-arc-blue">Chain ID 5042002</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Balance chip (when connected) */}
          {isConnected && balance && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-arc-border bg-arc-card px-3 py-1.5 text-sm">
              <span className="text-arc-muted">Balance:</span>
              <span className="font-mono font-medium text-white">
                {formatNumber(balance.formatted, 2)} {balance.symbol}
              </span>
            </div>
          )}

          {/* RainbowKit connect button */}
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />

          {/* Twitter/X link */}
          <a
            href="https://x.com/Razzshares"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg border border-arc-border bg-arc-card text-arc-muted hover:text-arc-blue hover:border-arc-blue/40 transition-colors"
            title="Follow @Razzshares on X"
          >
            <Twitter className="h-4 w-4" />
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-arc-border bg-arc-card text-arc-muted hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-arc-border bg-arc-darker px-4 py-4"
        >
          <nav className="flex flex-col gap-1">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-arc-blue/10 text-arc-blue'
                    : 'text-arc-muted hover:bg-white/5 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
