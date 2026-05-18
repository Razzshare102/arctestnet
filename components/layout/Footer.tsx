/**
 * Footer — brand info, links, and community section
 */

import Link from 'next/link'
import { Twitter, ExternalLink, Zap, Github } from 'lucide-react'

const footerLinks = [
  { href: '/swap',      label: 'Swap' },
  { href: '/nft',       label: 'NFT Mint' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/community', label: 'Community' },
]

export function Footer() {
  return (
    <footer className="border-t border-arc-border bg-arc-darker/60 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-arc-blue to-arc-purple">
              <Zap className="h-3.5 w-3.5 text-arc-darker" />
            </div>
            <span className="text-sm font-semibold gradient-text">ShareSwap</span>
            <span className="text-arc-muted text-xs">on ARC Testnet</span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-4 text-xs text-arc-muted">
            {footerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <a
              href="https://testnet.arcscan.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              ArcScan <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </nav>

          {/* Social + credit */}
          <div className="flex items-center gap-3 text-xs text-arc-muted">
            <span>Built by</span>
            <a
              href="https://x.com/Razzshares"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-arc-blue hover:text-white transition-colors font-medium"
            >
              <Twitter className="h-3.5 w-3.5" />
              RazzShares
            </a>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div className="mt-4 pt-4 border-t border-arc-border/50 text-center text-[11px] text-arc-muted">
          ShareSwap is a demo application on ARC Testnet. Not financial advice.
          Swap powered by{' '}
          <a href="https://docs.arc.io" target="_blank" rel="noopener noreferrer" className="text-arc-blue hover:underline">
            ARC App Kit
          </a>.
        </div>
      </div>
    </footer>
  )
}
