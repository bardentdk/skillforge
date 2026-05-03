'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxProps {
  children: ReactNode
  className?: string
  offset?: number
  direction?: 'vertical' | 'horizontal'
}

export function Parallax({
  children,
  className,
  offset = 50,
  direction = 'vertical',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  const x = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div style={direction === 'vertical' ? { y } : { x }}>
        {children}
      </motion.div>
    </div>
  )
}