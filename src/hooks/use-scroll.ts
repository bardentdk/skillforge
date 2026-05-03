'use client'

import { useEffect, useState } from 'react'

interface ScrollState {
  scrollY: number
  scrollDirection: 'up' | 'down' | null
  isScrolled: boolean
  isAtTop: boolean
}

export function useScroll(threshold = 10): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolled: false,
    isAtTop: true,
  })

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setState({
            scrollY: currentScrollY,
            scrollDirection: currentScrollY > lastScrollY ? 'down' : 'up',
            isScrolled: currentScrollY > threshold,
            isAtTop: currentScrollY <= 0,
          })
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return state
}