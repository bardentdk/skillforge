'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Users, BookOpen, MessageCircle, Globe, ArrowRight, Unlink } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCompactNumber } from '@/lib/utils'
import type { Profile } from '@/types/database'

interface InstructorCardProps {
  instructor: Pick<
    Profile,
    | 'id'
    | 'username'
    | 'full_name'
    | 'avatar_url'
    | 'headline'
    | 'bio'
    | 'is_verified'
    | 'total_students'
    | 'total_courses'
    | 'rating'
    | 'reviews_count'
    | 'expertise'
    | 'twitter'
    | 'linkedin'
    | 'website'
  >
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <section>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6">À propos du formateur</h2>

      <div className="glass-strong rounded-2xl p-6 lg:p-8 border border-emerald-500/10 relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative grid md:grid-cols-[160px_1fr] gap-6 lg:gap-8">
          {/* Avatar + socials */}
          <div className="flex md:flex-col items-start gap-4">
            <div className="relative">
              <Avatar size="3xl" ring="glow" className="lg:!h-32 lg:!w-32">
                {instructor.avatar_url && (
                  <AvatarImage src={instructor.avatar_url} alt={instructor.full_name || ''} />
                )}
                <AvatarFallback className="text-2xl">
                  {instructor.full_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              {instructor.is_verified && (
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center">
                  <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>

            {/* Socials */}
            <div className="flex md:flex-col flex-row gap-2">
              {instructor.twitter && (
                <a
                  href={instructor.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                  aria-label="Twitter"
                >
                  <Unlink className="h-4 w-4" />
                </a>
              )}
              {instructor.linkedin && (
                <a
                  href={instructor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                  aria-label="LinkedIn"
                >
                  <Unlink className="h-4 w-4" />
                </a>
              )}
              {instructor.website && (
                <a
                  href={instructor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg glass flex items-center justify-center hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <Link
              href={instructor.username ? `/instructors/${instructor.username}` : '#'}
              className="inline-block group"
            >
              <h3 className="text-2xl font-bold flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                {instructor.full_name}
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </h3>
            </Link>
            {instructor.headline && (
              <p className="text-sm text-emerald-400 font-medium mt-1">{instructor.headline}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 py-4 border-y border-border">
              <Stat
                icon={<Star className="h-4 w-4" />}
                value={instructor.rating.toFixed(1)}
                label="Note moyenne"
              />
              <Stat
                icon={<MessageCircle className="h-4 w-4" />}
                value={formatCompactNumber(instructor.reviews_count)}
                label="Avis"
              />
              <Stat
                icon={<Users className="h-4 w-4" />}
                value={formatCompactNumber(instructor.total_students)}
                label="Étudiants"
              />
              <Stat
                icon={<BookOpen className="h-4 w-4" />}
                value={instructor.total_courses.toString()}
                label="Cours"
              />
            </div>

            {/* Expertise */}
            {instructor.expertise && instructor.expertise.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.slice(0, 6).map((tag) => (
                    <Badge key={tag} variant="primary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            {instructor.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">{instructor.bio}</p>
            )}

            {/* CTA */}
            <Link
              href={instructor.username ? `/instructors/${instructor.username}` : '#'}
              className="mt-4 inline-block"
            >
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Voir le profil complet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
        {icon}
        <span className="text-base lg:text-lg font-bold tabular-nums">{value}</span>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}