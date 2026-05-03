'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextShimmerProps {
  children: string
  className?: string
  duration?: number
}

export function TextShimmer({ children, className, duration = 3 }: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        className
      )}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--shimmer-color, #00674F) 0%, #00FFB2 50%, var(--shimmer-color, #00674F) 100%)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  )
}