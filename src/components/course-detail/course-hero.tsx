'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Play, Star, Users, Clock, BarChart3, Calendar,
  Globe, Award, ChevronRight,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ROUTES } from '@/lib/constants'
import { formatCompactNumber, formatDuration, cn } from '@/lib/utils'
import type { Course, Profile, Category } from '@/types/database'
import type { CourseWithFullInstructor } from '@/types/database'


const LEVEL_LABELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
} as const

type CourseHeroData = Course & {
  instructor: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'is_verified' | 'headline'> | null
  category: Pick<Category, 'id' | 'slug' | 'name'> | null
}

// interface CourseHeroProps {
//   course: CourseHeroData
// }
interface CourseHeroProps {
  course: CourseWithFullInstructor
}

export function CourseHero({ course }: CourseHeroProps) {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div className="relative pt-28 lg:pt-36 pb-12 lg:pb-16 overflow-hidden">
      {/* Background hero image with overlay */}
      <div className="absolute inset-0">
        {course.thumbnail_url && (
          <Image
            src={course.thumbnail_url}
            alt=""
            fill
            className="object-cover opacity-30 blur-2xl scale-110"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs text-muted-foreground mb-6"
        >
          <Link href={ROUTES.catalog} className="hover:text-emerald-400 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          {course.category && (
            <>
              <Link
                href={ROUTES.category(course.category.slug)}
                className="hover:text-emerald-400 transition-colors"
              >
                {course.category.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-foreground/80 line-clamp-1">{course.title}</span>
        </motion.nav>

        {/* Hero content */}
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-12">
          {/* LEFT: Course info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              {course.is_bestseller && (
                <Badge variant="gradient" pulse>🔥 Bestseller</Badge>
              )}
              {course.is_new && (
                <Badge variant="neon">✨ Nouveau</Badge>
              )}
              {course.is_featured && !course.is_bestseller && !course.is_new && (
                <Badge variant="glow">⭐ Featured</Badge>
              )}
              {course.category && (
                <Badge variant="glass">{course.category.name}</Badge>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight mb-4"
            >
              {course.title}
            </motion.h1>

            {course.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground mb-6 max-w-3xl leading-relaxed"
              >
                {course.subtitle}
              </motion.p>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i <= Math.round(course.rating) ? 'fill-neon-500 text-neon-500' : 'text-muted-foreground/30'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">
                  {course.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({formatCompactNumber(course.reviews_count)} avis)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="font-semibold text-foreground">{formatCompactNumber(course.students_count)}</span>
                étudiants
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{course.language === 'fr' ? 'Français' : course.language}</span>
              </div>

              {course.published_at && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Mis à jour {new Date(course.published_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
              )}
            </motion.div>

            {/* Instructor compact */}
            {course.instructor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link
                  href={course.instructor.username ? `/instructors/${course.instructor.username}` : '#'}
                  className="inline-flex items-center gap-3 group"
                >
                  <Avatar size="md" ring="emerald">
                    {course.instructor.avatar_url && (
                      <AvatarImage src={course.instructor.avatar_url} alt={course.instructor.full_name || ''} />
                    )}
                    <AvatarFallback>
                      {course.instructor.full_name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xs text-muted-foreground">Créé par</div>
                    <div className="text-sm font-semibold flex items-center gap-1.5 group-hover:text-emerald-400 transition-colors">
                      {course.instructor.full_name}
                      {course.instructor.is_verified && (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {course.instructor.headline && (
                      <div className="text-xs text-emerald-400 mt-0.5 line-clamp-1">{course.instructor.headline}</div>
                    )}
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Quick badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 mt-8"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-border">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-sm">{formatDuration(course.duration_minutes)} de contenu</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-border">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm">{LEVEL_LABELS[course.level]}</span>
              </div>
              {course.has_certificate && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-border">
                  <Award className="h-4 w-4 text-neon-500" />
                  <span className="text-sm">Certificat inclus</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT: Video preview (mobile only - desktop has sticky purchase card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:hidden"
          >
            <CoursePreviewVideo
              thumbnailUrl={course.thumbnail_url}
              previewUrl={course.preview_video_url}
              title={course.title}
              isOpen={previewOpen}
              onOpenChange={setPreviewOpen}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Preview Video ──────────────────────────────────
export function CoursePreviewVideo({
  thumbnailUrl,
  previewUrl,
  title,
  isOpen,
  onOpenChange,
}: {
  thumbnailUrl?: string | null
  previewUrl?: string | null
  title: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="group relative w-full aspect-video rounded-2xl overflow-hidden glass border border-border hover:border-emerald-500/30 transition-all">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(min-width: 1024px) 440px, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-neon-500/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full animate-pulse" />
              <div className="relative h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-emerald-500 to-neon-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 lg:h-10 lg:w-10 text-emerald-950 ml-1 fill-emerald-950" />
              </div>
            </div>
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs uppercase tracking-wider text-white/80 mb-1">Aperçu gratuit</div>
            <div className="text-sm font-semibold text-white line-clamp-1">{title}</div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <div className="aspect-video bg-black relative">
          {previewUrl ? (
            <video src={previewUrl} controls autoPlay className="absolute inset-0 w-full h-full" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-950 to-black">
              <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Play className="h-8 w-8 text-emerald-400 ml-1" />
              </div>
              <p className="text-white/80 text-sm">Bande-annonce du cours bientôt disponible</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}