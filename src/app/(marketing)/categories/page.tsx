import Link from 'next/link'
import {
  Code2, Smartphone, BrainCircuit, Cloud, ShieldCheck,
  Palette, Target, TrendingUp, ArrowRight, Sparkles,
} from 'lucide-react'
import type { Metadata } from 'next'

import { fetchAllCategories } from '@/lib/queries/courses'
import { Badge } from '@/components/ui/badge'
import { Reveal, RevealStagger, revealItem } from '@/components/effects/reveal'
import { Spotlight } from '@/components/effects/spotlight'
import { Tilt } from '@/components/effects/tilt'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Toutes les catégories',
  description: 'Explore toutes les catégories de cours en tech & digital.',
}

const ICON_MAP = {
  Code2, Smartphone, BrainCircuit, Cloud, ShieldCheck, Palette, Target, TrendingUp,
} as const

export default async function CategoriesPage() {
  const categories = await fetchAllCategories()

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 pt-32 lg:pt-40 pb-20">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4">
              Toutes les catégories
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Explore les{' '}
              <span className="text-gradient-emerald">domaines</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              De la conception au déploiement, du code au design. {categories.length} catégories
              couvrent tout le spectre tech & digital.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP] || Sparkles
            return (
              <motion.div key={cat.slug} variants={revealItem}>
                <Link href={ROUTES.category(cat.slug)} className="block h-full">
                  <Tilt intensity={6} scale={1.02}>
                    <Spotlight className="h-full rounded-2xl">
                      <div className="group relative h-full glass rounded-2xl p-6 lg:p-7 border border-border hover:border-emerald-500/30 transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-neon-500/10 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-neon-500/20 group-hover:shadow-[0_0_30px_rgba(0,255,178,0.25)] transition-all duration-500">
                            <Icon className="h-7 w-7 text-emerald-400 group-hover:text-neon-500 transition-colors" />
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </div>

                        <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                          {cat.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            <span className="font-semibold text-emerald-400">{cat.courses_count}</span> cours
                          </span>
                          {cat.is_featured && (
                            <Badge variant="neon" size="sm">Populaire</Badge>
                          )}
                        </div>
                      </div>
                    </Spotlight>
                  </Tilt>
                </Link>
              </motion.div>
            )
          })}
        </RevealStagger>
      </div>
    </div>
  )
}