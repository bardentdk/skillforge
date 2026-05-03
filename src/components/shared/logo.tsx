'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  href?: string | null
}

export function Logo({ className, showText = true, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-base' },
    md: { icon: 'h-9 w-9', text: 'text-lg' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
  }

  const content = (
    <div className={cn('flex items-center gap-2.5 group', className)}>
      {/* Animated logo mark */}
      <div className={cn('relative shrink-0', sizes[size].icon)}>
        <motion.svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFB2" />
              <stop offset="50%" stopColor="#00CC8E" />
              <stop offset="100%" stopColor="#00674F" />
            </linearGradient>
            <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer hexagonal frame */}
          <path
            d="M20 2L34 10V30L20 38L6 30V10L20 2Z"
            stroke="url(#logo-gradient)"
            strokeWidth="2"
            filter="url(#logo-glow)"
            className="opacity-80"
          />

          {/* Inner L mark */}
          <path
            d="M14 12V28H26"
            stroke="url(#logo-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#logo-glow)"
          />

          {/* Spark dot */}
          <circle cx="26" cy="14" r="2" fill="#00FFB2" filter="url(#logo-glow)">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </motion.svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <span className={cn(
          'font-bold tracking-tight',
          'bg-gradient-to-r from-foreground via-emerald-400 to-neon-500 bg-clip-text text-transparent',
          'group-hover:from-neon-500 group-hover:to-emerald-400 transition-all duration-500',
          sizes[size].text
        )}>
          Learnova
        </span>
      )}
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} className="inline-flex" aria-label="Learnova - Home">
      {content}
    </Link>
  )
}