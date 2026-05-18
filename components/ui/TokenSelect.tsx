'use client'

/**
 * TokenSelect — searchable token selector dropdown
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, Check } from 'lucide-react'
import { ARC_TOKENS, type TokenSymbol } from '@/lib/arcKit'
import { cn } from '@/lib/utils'

interface TokenSelectProps {
  value: TokenSymbol
  onChange: (token: TokenSymbol) => void
  exclude?: TokenSymbol
  label?: string
  balance?: string
}

export function TokenSelect({ value, onChange, exclude, label, balance }: TokenSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const tokens = Object.entries(ARC_TOKENS).filter(([sym]) => {
    if (sym === exclude) return false
    if (search) return sym.toLowerCase().includes(search.toLowerCase()) ||
                       ARC_TOKENS[sym as TokenSymbol].name.toLowerCase().includes(search.toLowerCase())
    return true
  }) as [TokenSymbol, typeof ARC_TOKENS[TokenSymbol]][]

  const selected = ARC_TOKENS[value]

  return (
    <div ref={ref} className="relative">
      {label && <div className="text-xs text-arc-muted mb-1.5">{label}</div>}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200',
          'bg-arc-dark border-arc-border hover:border-arc-blue/40',
          open && 'border-arc-blue/50 bg-arc-blue/5'
        )}
      >
        {/* Token color dot */}
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ backgroundColor: selected.color + '30', color: selected.color }}
        >
          {selected.symbol.slice(0, 2)}
        </div>
        <span className="font-semibold text-white text-sm">{selected.symbol}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-arc-muted transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Balance */}
      {balance && (
        <div className="text-xs text-arc-muted mt-1">
          Balance: <span className="text-white">{balance}</span>
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 z-50 glass-card shadow-glass overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-arc-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-arc-muted" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tokens..."
                  className="w-full bg-arc-dark rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-arc-muted border border-arc-border focus:outline-none focus:border-arc-blue/40"
                />
              </div>
            </div>

            {/* Token list */}
            <div className="max-h-52 overflow-y-auto">
              {tokens.length === 0 ? (
                <div className="py-6 text-center text-sm text-arc-muted">
                  No tokens found
                </div>
              ) : (
                tokens.map(([sym, token]) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      onChange(sym)
                      setOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                      'hover:bg-white/5',
                      sym === value && 'bg-arc-blue/5'
                    )}
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: token.color + '25', color: token.color }}
                    >
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-white">{token.symbol}</div>
                      <div className="text-xs text-arc-muted">{token.name}</div>
                    </div>
                    {sym === value && (
                      <Check className="h-3.5 w-3.5 text-arc-blue shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
