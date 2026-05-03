'use client'

import Link from 'next/link'
import {
  Code2, Smartphone, BrainCircuit, Cloud,
  ShieldCheck, Palette, Target, TrendingUp, ArrowUpRight,
} from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

import { Reveal, RevealStagger, revealItem } from '@/components/effects/reveal'
import { Spotlight } from '@/components/effects/spotlight'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Category {
  slug: string
  name: string
  description: string
  icon: LucideIcon
  count: number
  gradient: string
  isFeatured?: boolean
}

const CATEGORIES: Category[] = [
  {
    slug: 'web-development',
    name: 'Développement Web',
    description: 'React, Next.js, Vue, Angular, Node.js. Maîtrise le frontend et le backend moderne.',
    icon: Code2,
    count: 124,
    gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    isFeatured: true,
  },
  {
    slug: 'data-science',
    name: 'Data Science & IA',
    description: 'Machine Learning, Deep Learning, LLMs, RAG, Fine-tuning, MLOps.',
    icon: BrainCircuit,
    count: 89,
    gradient: 'from-neon-500/20 via-neon-500/10 to-transparent',
    isFeatured: true,
  },
  {
    slug: 'mobile-development',
    name: 'Développement Mobile',
    description: 'iOS, Android, React Native, Flutter, Swift, Kotlin.',
    icon: Smartphone,
    count: 67,
    gradient: 'from-emerald-400/20 via-emerald-400/10 to-transparent',
  },
  {
    slug: 'devops-cloud',
    name: 'DevOps & Cloud',
    description: 'AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD.',
    icon: Cloud,
    count: 45,
    gradient: 'from-emerald-300/20 via-emerald-300/10 to-transparent',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersécurité',
    description: 'Pentesting, Red/Blue Team, OSINT, Forensics, Bug Bounty.',
    icon: ShieldCheck,
    count: 32,
    gradient: 'from-emerald-600/20 via-emerald-600/10 to-transparent',
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'Figma, Design Systems, Prototypage, User Research, Motion.',
    icon: Palette,
    count: 56,
    gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
  },
  {
    slug: 'product-management',
    name: 'Product Management',
    description: 'Stratégie produit, Discovery, Roadmap, OKRs, Agile.',
    icon: Target,
    count: 28,
    gradient: 'from-emerald-700/20 via-emerald-700/10 to-transparent',
  },
  {
    slug: 'digital-marketing',
    name: 'Marketing Digital',
    description: 'SEO, SEA, Social Ads, Growth Hacking, Content Marketing.',
    icon: TrendingUp,
    count: 41,
    gradient: 'from-emerald-400/20 via-emerald-400/10 to-transparent',
  },
]

export function CategoriesGrid() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mb-16">
            <Badge variant="primary" className="mb-4">
              Domaines de formation
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Explore les{' '}
              <span className="text-gradient-emerald">domaines</span>{' '}
              qui font 2026
            </h2>
            <p className="text-lg text-muted-foreground">
              De la conception au déploiement, du code au design — couvre toute la chaîne tech & digital
              avec des experts de premier plan.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              variants={revealItem}
              className={cn(
                category.isFeatured && 'sm:col-span-2 lg:col-span-2'
              )}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </RevealStagger>
      </div>
    </section>
  )
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon

  return (
    <Link href={ROUTES.category(category.slug)} className="block h-full">
      <Spotlight className="h-full">
        <div
          className={cn(
            'group relative h-full glass rounded-2xl p-6 lg:p-7',
            'border border-border hover:border-emerald-500/30',
            'transition-all duration-500',
            'hover:-translate-y-1',
            category.isFeatured && 'lg:p-8'
          )}
        >
          {/* Gradient bg */}
          <div
            className={cn(
              'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
              'bg-gradient-to-br',
              category.gradient
            )}
          />

          <div className="relative flex flex-col h-full">
            {/* Icon */}
            <div className="flex items-start justify-between mb-6">
              <div
                className={cn(
                  'h-12 w-12 lg:h-14 lg:w-14 rounded-xl',
                  'bg-gradient-to-br from-emerald-500/20 to-neon-500/10',
                  'flex items-center justify-center',
                  'group-hover:from-emerald-500/30 group-hover:to-neon-500/20',
                  'group-hover:shadow-[0_0_30px_rgba(0,255,178,0.25)]',
                  'transition-all duration-500'
                )}
              >
                <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-emerald-400 group-hover:text-neon-500 transition-colors" />
              </div>

              <ArrowUpRight
                className={cn(
                  'h-5 w-5 text-muted-foreground',
                  'group-hover:text-emerald-400 group-hover:rotate-12',
                  'transition-all duration-300'
                )}
              />
            </div>

            {/* Content */}
            <h3 className="text-lg lg:text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
              {category.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-emerald-400">{category.count}</span> cours
              </span>
              {category.isFeatured && (
                <Badge variant="neon" size="sm">
                  Populaire
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Spotlight>
    </Link>
  )
}