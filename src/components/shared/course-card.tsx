'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Star, Users, Clock, ArrowRight, Flame, Sparkles, Award,
  BarChart3, BookOpen,
} from 'lucide-react'

import { Spotlight } from '@/components/effects/spotlight'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants'
import { formatPrice, formatCompactNumber, formatDuration, cn } from '@/lib/utils'
import type { CourseWithRelations } from '@/types/database'

interface CourseCardProps {
  course: CourseWithRelations
  variant?: 'default' | 'compact' | 'horizontal'
  className?: string
}

const LEVEL_LABELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
} as const

const LEVEL_COLORS = {
  BEGINNER: 'text-emerald-300',
  INTERMEDIATE: 'text-emerald-400',
  ADVANCED: 'text-neon-400',
  EXPERT: 'text-neon-500',
} as const

type CardBadge = {
  label: string
  icon: typeof Flame
  variant: 'gradient' | 'neon' | 'glow'
} | null

function getBadge(course: CourseWithRelations): CardBadge {
  if (course.is_bestseller) return { label: 'Bestseller', icon: Flame, variant: 'gradient' }
  if (course.is_new) return { label: 'Nouveau', icon: Sparkles, variant: 'neon' }
  if (course.is_featured) return { label: 'Featured', icon: Award, variant: 'glow' }
  return null
}

export function CourseCard({ course, variant = 'default', className }: CourseCardProps) {
  const badge = getBadge(course)

  if (variant === 'horizontal') {
    return <CourseCardHorizontal course={course} badge={badge} className={className} />
  }

  const isCompact = variant === 'compact'

  return (
    <Link href={ROUTES.course(course.slug)} className={cn('block h-full group', className)}>
      <Spotlight className="h-full rounded-2xl">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative h-full glass rounded-2xl overflow-hidden flex flex-col',
            'border border-border hover:border-emerald-500/30 transition-all duration-500'
          )}
        >
          <div className={cn('relative overflow-hidden', isCompact ? 'h-32' : 'h-44')}>
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-700/10 to-neon-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
              {badge && (
                <Badge variant={badge.variant} icon={<badge.icon className="h-3 w-3" />}>
                  {badge.label}
                </Badge>
              )}
              {course.original_price && course.original_price > course.price && (
                <Badge variant="neon" size="sm" className="ml-auto">
                  -{Math.round(((course.original_price - course.price) / course.original_price) * 100)}%
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 left-3">
              <span className={cn('text-xs font-medium uppercase tracking-wider flex items-center gap-1', LEVEL_COLORS[course.level])}>
                <BarChart3 className="h-3 w-3" />
                {LEVEL_LABELS[course.level]}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-5">
            {course.category?.name && (
              <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-2">
                {course.category.name}
              </p>
            )}

            <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
              {course.title}
            </h3>

            {!isCompact && course.subtitle && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {course.subtitle}
              </p>
            )}

            {course.instructor && (
              <div className="flex items-center gap-2 mb-3">
                <Avatar size="xs">
                  {course.instructor.avatar_url && (
                    <AvatarImage src={course.instructor.avatar_url} alt={course.instructor.full_name || ''} />
                  )}
                  <AvatarFallback className="text-[10px]">
                    {course.instructor.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {course.instructor.full_name}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-neon-500 text-neon-500" />
                <span className="font-semibold text-foreground">{course.rating.toFixed(1)}</span>
                <span>({formatCompactNumber(course.reviews_count)})</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatCompactNumber(course.students_count)}
              </span>
              {course.duration_minutes > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(course.duration_minutes)}
                </span>
              )}
            </div>

            <div className="mt-auto flex items-baseline justify-between pt-3 border-t border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-400">
                  {formatPrice(course.price)}
                </span>
                {course.original_price && course.original_price > course.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(course.original_price)}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </motion.div>
      </Spotlight>
    </Link>
  )
}

function CourseCardHorizontal({
  course, badge, className,
}: {
  course: CourseWithRelations
  badge: CardBadge
  className?: string
}) {
  return (
    <Link href={ROUTES.course(course.slug)} className={cn('block group', className)}>
      <Spotlight className="rounded-2xl">
        <div className="flex gap-4 glass rounded-2xl p-3 overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-300">
          <div className="relative h-24 w-32 sm:h-28 sm:w-40 rounded-xl overflow-hidden shrink-0">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="160px"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-neon-500/10" />
            )}
            {badge && (
              <Badge variant={badge.variant} size="sm" className="absolute top-2 left-2">
                {badge.label}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              {course.category?.name && (
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
                  {course.category.name}
                </p>
              )}
              <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {course.title}
              </h3>
              {course.instructor?.full_name && (
                <p className="text-xs text-muted-foreground mt-1">
                  par {course.instructor.full_name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-neon-500 text-neon-500" />
                  {course.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {course.total_lessons}
                </span>
              </div>
              <span className="text-base font-bold text-emerald-400">
                {formatPrice(course.price)}
              </span>
            </div>
          </div>
        </div>
      </Spotlight>
    </Link>
  )
}

export function CourseCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  return (
    <div className="h-full glass rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className={cn('bg-muted', variant === 'compact' ? 'h-32' : 'h-44')} />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="flex gap-3">
          <div className="h-6 w-6 rounded-full bg-muted" />
          <div className="h-3 w-1/2 bg-muted rounded my-auto" />
        </div>
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="h-6 w-6 bg-muted rounded" />
        </div>
      </div>
    </div>
  )
}