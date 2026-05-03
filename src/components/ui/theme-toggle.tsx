'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-11 w-11 rounded-xl glass" />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative h-11 w-11 rounded-xl glass overflow-hidden',
        'transition-all duration-300 cursor-pointer',
        'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(0,255,178,0.2)]',
        'flex items-center justify-center'
      )}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-emerald-400" />
          ) : (
            <Sun className="h-5 w-5 text-emerald-600" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Glow on hover */}
      <span
        className={cn(
          'absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300',
          'bg-gradient-radial from-emerald-500/20 to-transparent'
        )}
      />
    </button>
  )
}