'use client'

/**
 * ConnectPrompt — shown when wallet is not connected
 */

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'

interface ConnectPromptProps {
  title?: string
  description?: string
}

export function ConnectPrompt({
  title = 'Connect Your Wallet',
  description = 'Connect your wallet to get started on ARC Testnet.',
}: ConnectPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="h-20 w-20 rounded-full bg-arc-blue/10 border border-arc-blue/20 flex items-center justify-center mb-5 animate-pulse">
        <Wallet className="h-9 w-9 text-arc-blue" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-arc-muted text-sm mb-6 max-w-xs">{description}</p>
      <ConnectButton label="Connect Wallet" />
    </motion.div>
  )
}
