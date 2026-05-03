'use client'

import { useRef, useEffect, type RefObject } from 'react'

interface MagneticOptions {
  strength?: number
  ease?: number
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  options: MagneticOptions = {}
): RefObject<T | null> {
  const ref = useRef<T>(null)
  const { strength = 0.3 } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      element.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)'
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return ref
}