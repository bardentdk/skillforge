'use client'

import { Star, ThumbsUp, MessageSquareWarning } from 'lucide-react'
import { motion } from 'framer-motion'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/effects/reveal'
import { cn } from '@/lib/utils'
import type { Review, Profile } from '@/types/database'

interface ReviewWithUser extends Review {
  user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

interface ReviewsBreakdown {
  total: number
  average: number
  breakdown: Record<number, number>
}

interface ReviewsSectionProps {
  reviews: ReviewWithUser[]
  breakdown: ReviewsBreakdown
  course: { rating: number; reviews_count: number; title: string }
}

export function ReviewsSection({ reviews, breakdown, course }: ReviewsSectionProps) {
  // Use course aggregates if breakdown is empty (no reviews in DB)
  const displayAverage = breakdown.total > 0 ? breakdown.average : course.rating
  const displayTotal = breakdown.total > 0 ? breakdown.total : course.reviews_count

  return (
    <section>
      <h2 className="text-2xl lg:text-3xl font-bold mb-6">Avis des étudiants</h2>

      <div className="grid md:grid-cols-[300px_1fr] gap-6 lg:gap-10 mb-10">
        {/* Aggregate */}
        <div className="glass-strong rounded-2xl p-6 border border-emerald-500/10 text-center">
          <div className="text-6xl font-bold text-gradient-emerald mb-2">
            {displayAverage.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  'h-5 w-5',
                  i <= Math.round(displayAverage)
                    ? 'fill-neon-500 text-neon-500'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Basé sur <span className="font-semibold text-foreground">{displayTotal}</span> avis
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = breakdown.breakdown[rating] || 0
            const percent = breakdown.total > 0 ? (count / breakdown.total) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-sm font-medium tabular-nums">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-neon-500 text-neon-500" />
                </div>
                <Progress value={percent} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                  {count > 0 ? `${percent.toFixed(0)}%` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} delay={i * 0.05} />
          ))}

          {reviews.length >= 8 && (
            <div className="text-center pt-4">
              <Button variant="glass" size="lg">
                Voir tous les avis ({displayTotal})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
            <MessageSquareWarning className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Aucun avis pour le moment</h3>
          <p className="text-sm text-muted-foreground">
            Sois le premier à partager ton retour sur ce cours !
          </p>
        </div>
      )}
    </section>
  )
}

function ReviewCard({ review, delay = 0 }: { review: ReviewWithUser; delay?: number }) {
  const initials = review.user?.full_name
    ? review.user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const formattedDate = new Date(review.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-2xl p-5 lg:p-6 border border-border hover:border-emerald-500/20 transition-colors"
    >
      <div className="flex items-start gap-4">
        <Avatar size="md" ring="emerald">
          {review.user?.avatar_url && (
            <AvatarImage src={review.user.avatar_url} alt={review.user.full_name || ''} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
            <h4 className="font-semibold text-sm">{review.user?.full_name || 'Utilisateur'}</h4>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i <= review.rating ? 'fill-neon-500 text-neon-500' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>

          {review.title && (
            <h5 className="font-semibold mb-2">{review.title}</h5>
          )}

          {review.comment && (
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          )}

          {review.helpful_count > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-emerald-400 transition-colors">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{review.helpful_count} personnes ont trouvé cet avis utile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}