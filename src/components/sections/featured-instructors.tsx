'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, BookOpen, ArrowRight, Globe } from 'lucide-react'

import { Reveal } from '@/components/effects/reveal'
import { Spotlight } from '@/components/effects/spotlight'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatCompactNumber, cn } from '@/lib/utils'

interface Instructor {
  slug: string
  name: string
  headline: string
  bio: string
  avatar?: string
  expertise: string[]
  rating: number
  studentsCount: number
  coursesCount: number
  socials: { twitter?: string; linkedin?: string; website?: string }
}

const INSTRUCTORS: Instructor[] = [
  {
    slug: 'sarah-martinez',
    name: 'Sarah Martinez',
    headline: 'Senior Frontend Engineer @ Vercel',
    bio: 'Ex-Meta. Spécialiste React, Next.js et Performance Web. 10+ ans d\'XP.',
    expertise: ['React', 'Next.js', 'TypeScript', 'Performance'],
    rating: 4.9,
    studentsCount: 28420,
    coursesCount: 8,
    socials: { twitter: '#', linkedin: '#', website: '#' },
  },
  {
    slug: 'david-chen',
    name: 'David Chen',
    headline: 'AI Research Engineer @ OpenAI',
    bio: 'PhD Stanford. Spécialiste LLMs, RAG, MLOps. Auteur de 3 papers cités.',
    expertise: ['LLMs', 'RAG', 'PyTorch', 'MLOps'],
    rating: 4.8,
    studentsCount: 18920,
    coursesCount: 5,
    socials: { twitter: '#', linkedin: '#' },
  },
  {
    slug: 'lea-dubois',
    name: 'Léa Dubois',
    headline: 'Lead Designer @ Stripe',
    bio: 'Ex-Figma. Spécialiste Design Systems et motion design. Speakeuse.',
    expertise: ['Figma', 'Design Systems', 'Motion'],
    rating: 4.9,
    studentsCount: 12450,
    coursesCount: 6,
    socials: { twitter: '#', linkedin: '#', website: '#' },
  },
  {
    slug: 'marcus-johnson',
    name: 'Marcus Johnson',
    headline: 'Principal Cloud Architect @ AWS',
    bio: '15+ certifs AWS. Architecte de plateformes traitant des Po de data.',
    expertise: ['AWS', 'Kubernetes', 'Terraform'],
    rating: 4.7,
    studentsCount: 22300,
    coursesCount: 12,
    socials: { linkedin: '#', website: '#' },
  },
]

export function FeaturedInstructors() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-4">
              Formateurs vedettes
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Apprends auprès des{' '}
              <span className="text-gradient-emerald">meilleurs</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ingénieurs senior, designers leads, architects cloud — tous nos formateurs
              sont des praticiens reconnus dans leur domaine.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {INSTRUCTORS.map((instructor, i) => (
            <motion.div
              key={instructor.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link href={`/instructors/${instructor.slug}`}>
                <Spotlight className="h-full rounded-2xl">
                  <div
                    className={cn(
                      'group relative h-full glass rounded-2xl p-6',
                      'border border-border hover:border-emerald-500/30',
                      'transition-all duration-500 hover:-translate-y-1',
                      'flex flex-col'
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <Avatar size="2xl" ring={hoveredIndex === i ? 'glow' : 'emerald'}>
                        <AvatarFallback className="text-xl">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Verified */}
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                      {instructor.name}
                    </h3>
                    <p className="text-xs text-emerald-400 mb-3">{instructor.headline}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {instructor.bio}
                    </p>

                    {/* Expertise tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {instructor.expertise.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-sm font-semibold">{instructor.rating}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">Note</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-emerald-400">
                          {formatCompactNumber(instructor.studentsCount)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Étudiants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-emerald-400">
                          {instructor.coursesCount}
                        </div>
                        <div className="text-[10px] text-muted-foreground">Cours</div>
                      </div>
                    </div>
                  </div>
                </Spotlight>
              </Link>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="text-center mt-12">
            <Link href="/instructors">
              <Button variant="glass" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Découvrir tous les formateurs
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}