'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star, Users, Clock, PlayCircle, ArrowRight, Flame,
  Sparkles, Award, TrendingUp,
} from 'lucide-react'

import { Reveal } from '@/components/effects/reveal'
import { Tilt } from '@/components/effects/tilt'
import { Spotlight } from '@/components/effects/spotlight'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { formatPrice, formatCompactNumber } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface FeaturedCourse {
  slug: string
  title: string
  subtitle: string
  thumbnail: string
  instructor: { name: string; avatar?: string }
  rating: number
  reviewsCount: number
  studentsCount: number
  durationHours: number
  price: number
  originalPrice?: number
  level: string
  category: string
  badge?: 'bestseller' | 'new' | 'trending' | 'featured'
  size: 'lg' | 'md' | 'sm'
}

const FEATURED_COURSES: FeaturedCourse[] = [
  {
    slug: 'nextjs-15-mastery',
    title: 'Next.js 15 Mastery',
    subtitle: 'Construis des apps full-stack performantes avec App Router, Server Components et Server Actions',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    instructor: { name: 'Sarah Martinez' },
    rating: 4.9,
    reviewsCount: 2840,
    studentsCount: 18420,
    durationHours: 32,
    price: 49.99,
    originalPrice: 199.99,
    level: 'Avancé',
    category: 'Web Development',
    badge: 'bestseller',
    size: 'lg',
  },
  {
    slug: 'llm-rag-production',
    title: 'LLMs & RAG en Production',
    subtitle: 'Maîtrise les LLMs, le RAG et le fine-tuning',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    instructor: { name: 'David Chen' },
    rating: 4.8,
    reviewsCount: 1240,
    studentsCount: 8920,
    durationHours: 28,
    price: 79.99,
    originalPrice: 249.99,
    level: 'Expert',
    category: 'Data Science',
    badge: 'trending',
    size: 'md',
  },
  {
    slug: 'figma-design-systems',
    title: 'Figma Design Systems',
    subtitle: 'De zéro à pro',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800',
    instructor: { name: 'Léa Dubois' },
    rating: 4.9,
    reviewsCount: 980,
    studentsCount: 6450,
    durationHours: 22,
    price: 39.99,
    originalPrice: 149.99,
    level: 'Intermédiaire',
    category: 'UI/UX Design',
    badge: 'new',
    size: 'sm',
  },
  {
    slug: 'aws-solutions-architect',
    title: 'AWS Solutions Architect',
    subtitle: 'Certification complète',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    instructor: { name: 'Marcus Johnson' },
    rating: 4.7,
    reviewsCount: 1820,
    studentsCount: 12300,
    durationHours: 45,
    price: 89.99,
    originalPrice: 299.99,
    level: 'Avancé',
    category: 'DevOps & Cloud',
    badge: 'featured',
    size: 'sm',
  },
  {
    slug: 'cybersecurity-fundamentals',
    title: 'Cybersécurité offensive',
    subtitle: 'Pentesting & Red Team',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    instructor: { name: 'Alex Rodriguez' },
    rating: 4.8,
    reviewsCount: 920,
    studentsCount: 5680,
    durationHours: 38,
    price: 69.99,
    originalPrice: 229.99,
    level: 'Avancé',
    category: 'Cybersécurité',
    size: 'md',
  },
]

const BADGE_CONFIG = {
  bestseller: { label: 'Bestseller', icon: Flame, variant: 'gradient' as const },
  new: { label: 'Nouveau', icon: Sparkles, variant: 'neon' as const },
  trending: { label: 'Tendance', icon: TrendingUp, variant: 'glow' as const },
  featured: { label: 'Featured', icon: Award, variant: 'primary' as const },
}

export function BentoCatalog() {
  const lgCourse = FEATURED_COURSES.find(c => c.size === 'lg')!
  const mdCourses = FEATURED_COURSES.filter(c => c.size === 'md')
  const smCourses = FEATURED_COURSES.filter(c => c.size === 'sm')

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-neon-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
            <div className="max-w-2xl">
              <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4">
                Catalogue featured
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Les cours qui{' '}
                <span className="text-gradient-emerald">cartonnent</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Sélectionnés par notre équipe, plébiscités par 50K+ étudiants.
                Du débutant à l'expert.
              </p>
            </div>

            <Link href={ROUTES.catalog}>
              <Button variant="glass" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Voir tout le catalogue
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Large featured card (spans 2 cols, 2 rows on lg) */}
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <CourseCardLarge course={lgCourse} />
          </div>

          {/* Medium cards */}
          {mdCourses.map((course) => (
            <div key={course.slug}>
              <CourseCardMedium course={course} />
            </div>
          ))}

          {/* Small cards */}
          {smCourses.map((course) => (
            <div key={course.slug} className="md:col-span-1">
              <CourseCardSmall course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── LARGE CARD ──────────────────────────────────────
function CourseCardLarge({ course }: { course: FeaturedCourse }) {
  const badgeConfig = course.badge ? BADGE_CONFIG[course.badge] : null

  return (
    <Link href={ROUTES.course(course.slug)} className="block h-full">
      <Tilt intensity={6} scale={1.01} glare={false}>
        <div className="group relative h-full min-h-[500px] lg:min-h-[600px] rounded-3xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-500">
          {/* Bg Image */}
          <div className="absolute inset-0">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-emerald-950/40" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-neon-500/0 group-hover:from-emerald-500/20 group-hover:to-neon-500/10 transition-all duration-500" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 lg:p-10 z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {badgeConfig && (
                  <Badge variant={badgeConfig.variant} icon={<badgeConfig.icon className="h-3 w-3" />} pulse>
                    {badgeConfig.label}
                  </Badge>
                )}
                <Badge variant="glass" size="sm">
                  {course.category}
                </Badge>
                <Badge variant="outline" size="sm">
                  {course.level}
                </Badge>
              </div>

              <button
                aria-label="Preview"
                className="hidden lg:flex h-14 w-14 rounded-full glass-strong items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group/play"
              >
                <PlayCircle className="h-6 w-6 text-white group-hover/play:text-neon-500 transition-colors" />
              </button>
            </div>

            <div>
              <h3 className="text-3xl lg:text-5xl font-bold mb-3 lg:mb-4 text-white leading-tight">
                {course.title}
              </h3>
              <p className="text-base lg:text-lg text-white/80 mb-6 max-w-2xl line-clamp-2">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Avatar size="sm" ring="emerald">
                    {course.instructor.avatar && <AvatarImage src={course.instructor.avatar} />}
                    <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/90 font-medium">{course.instructor.name}</span>
                </div>

                <div className="h-4 w-px bg-white/20" />

                <div className="flex items-center gap-1.5 text-sm text-white/90">
                  <Star className="h-4 w-4 fill-neon-500 text-neon-500" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-white/60">({formatCompactNumber(course.reviewsCount)})</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-white/90">
                  <Users className="h-4 w-4" />
                  <span>{formatCompactNumber(course.studentsCount)}</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-white/90">
                  <Clock className="h-4 w-4" />
                  <span>{course.durationHours}h</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl lg:text-4xl font-bold text-white">
                    {formatPrice(course.price)}
                  </span>
                  {course.originalPrice && (
                    <span className="text-lg text-white/50 line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                  )}
                </div>

                <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Découvrir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </Link>
  )
}

// ─── MEDIUM CARD ─────────────────────────────────────
function CourseCardMedium({ course }: { course: FeaturedCourse }) {
  const badgeConfig = course.badge ? BADGE_CONFIG[course.badge] : null

  return (
    <Link href={ROUTES.course(course.slug)} className="block h-full">
      <Spotlight className="h-full rounded-2xl">
        <div className="group relative h-full min-h-[280px] glass rounded-2xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="relative h-40 overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

            {badgeConfig && (
              <Badge
                variant={badgeConfig.variant}
                icon={<badgeConfig.icon className="h-3 w-3" />}
                className="absolute top-3 left-3"
              >
                {badgeConfig.label}
              </Badge>
            )}
          </div>

          <div className="p-5">
            <Badge variant="outline" size="sm" className="mb-3">{course.category}</Badge>
            <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
              {course.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-neon-500 text-neon-500" />
                {course.rating}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatCompactNumber(course.studentsCount)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.durationHours}h
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-400">
                  {formatPrice(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Spotlight>
    </Link>
  )
}

// ─── SMALL CARD ──────────────────────────────────────
function CourseCardSmall({ course }: { course: FeaturedCourse }) {
  const badgeConfig = course.badge ? BADGE_CONFIG[course.badge] : null

  return (
    <Link href={ROUTES.course(course.slug)} className="block h-full">
      <Spotlight className="h-full rounded-2xl">
        <div className="group relative h-full glass rounded-2xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="flex sm:flex-col h-full">
            <div className="relative w-32 sm:w-full h-full sm:h-32 overflow-hidden shrink-0">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(min-width: 768px) 33vw, 33vw"
              />
              {badgeConfig && (
                <Badge
                  variant={badgeConfig.variant}
                  size="sm"
                  className="absolute top-2 left-2"
                >
                  {badgeConfig.label}
                </Badge>
              )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1.5">
                  {course.category}
                </p>
                <h3 className="text-sm font-semibold line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
                  {course.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3 w-3 fill-neon-500 text-neon-500" />
                  {course.rating}
                </span>
                <span className="font-bold text-emerald-400">
                  {formatPrice(course.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Spotlight>
    </Link>
  )
}