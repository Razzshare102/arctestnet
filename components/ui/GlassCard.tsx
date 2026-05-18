'use client'

/**
 * GlassCard — reusable glassmorphism card component
 */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'blue' | 'purple' | 'pink' | 'none'
  onClick?: () => void
  animate?: boolean
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = 'none',
  onClick,
  animate = true,
}: GlassCardProps) {
  const glowClass = {
    blue: 'hover:shadow-neon-blue hover:border-arc-blue/30',
    purple: 'hover:shadow-neon-purple hover:border-arc-purple/30',
    pink: 'hover:shadow-neon-pink hover:border-arc-pink/30',
    none: '',
  }[glow]

  const Component = animate ? motion.div : 'div'
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }
    : {}

  return (
    <Component
      {...motionProps}
      onClick={onClick}
      className={cn(
        'glass-card',
        hover && `transition-all duration-300 ${glowClass}`,
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  )
}
