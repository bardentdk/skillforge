'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Users, BookOpen, GraduationCap, Star } from 'lucide-react'

import { Reveal } from '@/components/effects/reveal'
import { Badge } from '@/components/ui/badge'

interface Stat {
  icon: typeof Users
  value: number
  suffix: string
  label: string
  description: string
}

const STATS: Stat[] = [
  {
    icon: Users,
    value: 50,
    suffix: 'K+',
    label: 'Étudiants actifs',
    description: 'Apprennent en ce moment',
  },
  {
    icon: BookOpen,
    value: 500,
    suffix: '+',
    label: 'Cours premium',
    description: 'Mis à jour régulièrement',
  },
  {
    icon: GraduationCap,
    value: 12,
    suffix: 'K+',
    label: 'Certificats délivrés',
    description: 'Reconnus par les recruteurs',
  },
  {
    icon: Star,
    value: 4.9,
    suffix: '/5',
    label: 'Satisfaction',
    description: 'Note moyenne sur 25K+ avis',
  },
]

export function Stats() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="glass-strong rounded-3xl p-8 lg:p-16 border border-emerald-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-500/10 rounded-full blur-[100px]" />

          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
              <Badge variant="gradient" className="mb-4">
                En chiffres
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
                Une communauté qui{' '}
                <span className="text-gradient-emerald">grandit</span> chaque jour
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const Icon = stat.icon

  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const display = useTransform(spring, (latest) => {
    if (stat.value < 10) return latest.toFixed(1)
    return Math.round(latest).toLocaleString('fr-FR')
  })

  useEffect(() => {
    if (isInView) {
      motionValue.set(stat.value)
    }
  }, [isInView, motionValue, stat.value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="text-center relative"
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
        <Icon className="h-5 w-5 text-emerald-400" />
      </div>

      <div className="text-4xl lg:text-6xl font-bold mb-1 flex items-baseline justify-center">
        <motion.span className="text-gradient-emerald tabular-nums">{display}</motion.span>
        <span className="text-gradient-emerald">{stat.suffix}</span>
      </div>

      <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
      <div className="text-xs text-muted-foreground">{stat.description}</div>
    </motion.div>
  )
}