import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

import { stripe } from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { CheckoutSuccessConfetti } from './confetti'

export const metadata: Metadata = {
  title: 'Paiement confirmé',
}

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  if (!session_id) redirect('/')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Retrieve session for display (best effort, le webhook fait le vrai boulot)
  let totalAmount = 0
  let coursesCount = 0
  let courseIds: string[] = []

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    totalAmount = session.amount_total ? session.amount_total / 100 : 0
    courseIds = session.metadata?.course_ids?.split(',').filter(Boolean) || []
    coursesCount = courseIds.length
  } catch (err) {
    console.error('[Success page] Stripe retrieve error:', err)
  }

  // Fetch les cours achetés
  let purchasedCourses: Array<{ id: string; slug: string; title: string; thumbnail_url: string | null }> = []
  if (courseIds.length > 0) {
    const { data } = await supabase
      .from('courses')
      .select('id, slug, title, thumbnail_url')
      .in('id', courseIds)

    purchasedCourses = data ?? []
  }

  return (
    <div className="relative min-h-screen">
      <CheckoutSuccessConfetti />

      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-neon-500/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 pt-32 lg:pt-40 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative inline-flex mb-8">
            <div className="absolute inset-0 bg-neon-500/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-neon-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-glow-pulse">
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4" pulse>
            Paiement confirmé
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Bienvenue dans <br />
            <span className="text-gradient-emerald">l&apos;aventure ! 🎉</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10">
            {coursesCount > 0 ? (
              <>
                Tes <span className="text-emerald-400 font-semibold">{coursesCount} cours</span> sont
                maintenant disponibles dans ton dashboard. Prêt·e à apprendre ?
              </>
            ) : (
              "Ton paiement a bien été reçu ! Tes cours sont maintenant disponibles."
            )}
          </p>

          {/* Order summary */}
          {totalAmount > 0 && (
            <div className="glass-strong rounded-2xl p-6 mb-10 border border-emerald-500/10 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">Montant payé</span>
                <span className="text-2xl font-bold text-gradient-emerald">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                <span>📧 Reçu envoyé à</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          )}

          {/* Purchased courses */}
          {purchasedCourses.length > 0 && (
            <div className="space-y-2 mb-10 text-left max-w-md mx-auto">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Tes nouveaux cours
              </h2>
              {purchasedCourses.map((course) => (
                <Link
                  key={course.id}
                  href={ROUTES.course(course.slug)}
                  className="flex items-center gap-3 glass rounded-xl p-3 hover:border-emerald-500/30 border border-border transition-all group"
                >
                  <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">Cliquer pour démarrer</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.dashboard.learning}>
              <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} glow>
                Accéder à mes cours
              </Button>
            </Link>
            <Link href={ROUTES.catalog}>
              <Button variant="glass" size="lg">
                Continuer le shopping
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Une question ? Notre support est dispo 7j/7 → support@learnova.com
          </p>
        </div>
      </div>
    </div>
  )
}