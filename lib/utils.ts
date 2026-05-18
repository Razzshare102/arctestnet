/**
 * Utility helpers for ShareSwap
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Tailwind class merger ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Address formatting ────────────────────────────────────────────────────────
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

// ── Number formatting ─────────────────────────────────────────────────────────
export function formatUSD(amount: number | string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

export function formatNumber(n: number | string, decimals = 4): string {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ── Copy to clipboard ─────────────────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// ── Validation ────────────────────────────────────────────────────────────────
export function isValidAmount(value: string): boolean {
  const num = parseFloat(value)
  return !isNaN(num) && num > 0
}

export function isEthAddress(value: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(value)
}

// ── Local storage swap history ────────────────────────────────────────────────
export interface SwapRecord {
  id: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  txHash: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
}

const SWAP_HISTORY_KEY = 'shareswap_history'

export function getSwapHistory(): SwapRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SWAP_HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSwapRecord(record: SwapRecord): void {
  if (typeof window === 'undefined') return
  const history = getSwapHistory()
  const updated = [record, ...history].slice(0, 50) // keep last 50
  localStorage.setItem(SWAP_HISTORY_KEY, JSON.stringify(updated))
}

export function updateSwapRecord(id: string, updates: Partial<SwapRecord>): void {
  if (typeof window === 'undefined') return
  const history = getSwapHistory()
  const updated = history.map((r) => (r.id === id ? { ...r, ...updates } : r))
  localStorage.setItem(SWAP_HISTORY_KEY, JSON.stringify(updated))
}
