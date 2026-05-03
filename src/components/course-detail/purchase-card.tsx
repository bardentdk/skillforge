'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Heart, Share2, Clock, BookOpen, Download,
  Award, Smartphone, Users, ShieldCheck, ShoppingCart, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { formatPrice, formatDuration, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Course } from '@/types/database'

import { useCartStore } from '@/stores/cart-store'
import { createCheckoutSessionAction, addToCartAction } from '@/app/cart/actions'

interface PurchaseCardProps {
  course: Course
  isAuthenticated: boolean
  isEnrolled?: boolean
  isInWishlist?: boolean
}

export function PurchaseCard({ course, isAuthenticated, isEnrolled, isInWishlist }: PurchaseCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [inWishlist, setInWishlist] = useState(isInWishlist || false)
  const [cartLoading, setCartLoading] = useState(false)

  const discount = course.original_price && course.original_price > course.price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 0

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour ajouter à ta wishlist')
      return
    }
    setWishlistLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setWishlistLoading(false)
      return
    }

    if (inWishlist) {
      const { error } = await supabase.from('wishlists').delete().match({ user_id: user.id, course_id: course.id })
      if (!error) {
        setInWishlist(false)
        toast.success('Retiré de la wishlist')
      }
    } else {
      const { error } = await supabase
        .from('wishlists')
        // @ts-expect-error - Supabase ssr typing limitation with insert
        .insert({ user_id: user.id, course_id: course.id })
      if (!error) {
        setInWishlist(true)
        toast.success('Ajouté à ta wishlist 💚')
      }
    }
    setWishlistLoading(false)
  }

  const { increment } = useCartStore()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour ajouter au panier')
      return
    }
    setCartLoading(true)
    const result = await addToCartAction(course.id)
    if (result.success) {
      increment()
      toast.success('Ajouté au panier 🎉')
    } else {
      toast.error(result.success === false ? result.error : 'Erreur')
    }
    setCartLoading(false)
  }
  const [buyLoading, setBuyLoading] = useState(false)

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Connecte-toi pour acheter')
      return
    }
    setBuyLoading(true)
    const result = await createCheckoutSessionAction(course.id)
    if (result.success && result.data) {
      window.location.href = result.data.url
    } else {
      toast.error(result.success === false ? result.error : 'Erreur checkout')
      setBuyLoading(false)
    }
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.subtitle || '',
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papier')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="lg:sticky lg:top-24"
    >
      <div className="glass-strong rounded-2xl overflow-hidden border border-emerald-500/10 shadow-2xl shadow-emerald-950/30">
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogTrigger asChild>
            <button className="group relative w-full aspect-video overflow-hidden">
              {course.thumbnail_url ? (
                <Image
                  src={course.thumbnail_url}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 440px, 100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-neon-500/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/40 blur-2xl rounded-full animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-neon-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-emerald-950 ml-0.5 fill-emerald-950" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-white/90">Aperçu gratuit</div>
                {discount > 0 && (
                  <Badge variant="gradient" pulse>-{discount}%</Badge>
                )}
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div className="aspect-video bg-black relative">
              {course.preview_video_url ? (
                <video src={course.preview_video_url} controls autoPlay className="absolute inset-0 w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-950 to-black">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Play className="h-8 w-8 text-emerald-400 ml-1" />
                  </div>
                  <p className="text-white/80 text-sm">Bande-annonce bientôt disponible</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gradient-emerald">
                {formatPrice(course.price)}
              </span>
              {course.original_price && course.original_price > course.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(course.original_price)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="neon" size="sm">-{discount}%</Badge>
              )}
            </div>
            {discount > 0 && (
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-500" />
                </span>
                <span className="text-neon-500 font-medium">Promo limitée — Offre se termine bientôt</span>
              </div>
            )}
          </div>

          {isEnrolled ? (
            <div className="space-y-3">
              <Link href={ROUTES.dashboard.learning}>
                <Button variant="gradient" size="lg" className="w-full" leftIcon={<Play className="h-4 w-4" />}>
                  Continuer le cours
                </Button>
              </Link>
              <p className="text-xs text-center text-emerald-400">
                ✓ Tu es inscrit·e à ce cours
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={handleBuyNow}
                loading={buyLoading}
                glow
              >
                Acheter maintenant
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="w-full"
                leftIcon={<ShoppingCart className="h-4 w-4" />}
                onClick={handleAddToCart}
                loading={cartLoading}
              >
                Ajouter au panier
              </Button>
            </div>
          )}

          {!isEnrolled && (
            <div className="flex items-center gap-2 mb-6">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleWishlist}
                      disabled={wishlistLoading}
                      className={cn(
                        'flex-1 h-11 rounded-xl glass border border-border flex items-center justify-center gap-2 transition-all',
                        'hover:border-emerald-500/30',
                        inWishlist && 'border-neon-500/40 text-neon-500 bg-neon-500/5'
                      )}
                    >
                      <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
                      <span className="text-sm font-medium hidden sm:inline">
                        {inWishlist ? 'Sauvegardé' : 'Wishlist'}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {inWishlist ? 'Retirer' : 'Ajouter à la wishlist'}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleShare}
                      className="h-11 w-11 rounded-xl glass border border-border flex items-center justify-center hover:border-emerald-500/30 transition-all"
                      aria-label="Partager"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Partager</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Ce cours inclut
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{formatDuration(course.duration_minutes)} de vidéos</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{course.total_lessons} leçons en {course.total_modules} modules</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Download className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Ressources téléchargeables</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Smartphone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Accès mobile et TV</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Users className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Accès communauté Discord</span>
              </li>
              {course.has_certificate && (
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Award className="h-4 w-4 text-neon-500 shrink-0" />
                  <span className="text-foreground">Certificat de réussite</span>
                </li>
              )}
              <li className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Garantie 30 jours satisfait ou remboursé</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              💳 Paiement sécurisé · Visa, Mastercard, PayPal
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}