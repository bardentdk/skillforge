'use client'

import { motion } from 'framer-motion'
import { Reveal } from '@/components/effects/reveal'

const TECH_STACK = [
  'React', 'Next.js', 'TypeScript', 'Python', 'TensorFlow',
  'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'GraphQL',
  'Tailwind', 'Figma', 'Node.js', 'Rust', 'Go',
]

export function LogoCloud() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden border-y border-border">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

      <Reveal>
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
          Maîtrise les technologies utilisées par les leaders du marché
        </p>
      </Reveal>

      <div className="relative flex overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-12 lg:gap-20 shrink-0 pr-12 lg:pr-20"
        >
          {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
            <div
              key={i}
              className="text-2xl lg:text-4xl font-bold text-muted-foreground/40 hover:text-emerald-400 transition-colors duration-300 whitespace-nowrap"
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}