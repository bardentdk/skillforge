'use client'

import { useEffect } from 'react'

export function CheckoutSuccessConfetti() {
  useEffect(() => {
    // Simple confetti animation via DOM
    const colors = ['#00FFB2', '#00CC8E', '#00674F', '#5CBA96']
    const confettiCount = 80
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.inset = '0'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '9999'
    container.style.overflow = 'hidden'
    document.body.appendChild(container)

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.style.position = 'absolute'
      confetti.style.width = '8px'
      confetti.style.height = '8px'
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = `${Math.random() * 100}%`
      confetti.style.top = '-20px'
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
      confetti.style.opacity = '0.9'
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`

      const duration = 3 + Math.random() * 2
      const delay = Math.random() * 1.5

      confetti.animate(
        [
          { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(120vh) rotate(${720 + Math.random() * 360}deg)`, opacity: 0 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
          fill: 'forwards',
        }
      )

      container.appendChild(confetti)
    }

    const cleanup = setTimeout(() => {
      container.remove()
    }, 6000)

    return () => {
      clearTimeout(cleanup)
      container.remove()
    }
  }, [])

  return null
}