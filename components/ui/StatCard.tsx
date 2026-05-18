'use client'

/**
 * StatCard — animated metric card for dashboard
 */

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  sub?: string
  icon: LucideIcon
  iconColor?: string
  trend?: { value: number; label: string }
  delay?: number
  className?: string
}

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  iconColor = 'text-arc-blue',
  trend,
  delay = 0,
  className,
}: StatCardProps) {
  const trendPositive = trend && trend.value >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={cn('glass-card-hover p-5', className)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          'bg-arc-dark border border-arc-border'
        )}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        {trend && (
          <span className={cn(
            'badge text-xs',
            trendPositive ? 'badge-green' : 'badge-red'
          )}>
            {trendPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white leading-none mb-1">{value}</div>
      <div className="text-sm text-arc-muted">{title}</div>
      {sub && <div className="text-xs text-arc-muted/70 mt-0.5">{sub}</div>}
    </motion.div>
  )
}
