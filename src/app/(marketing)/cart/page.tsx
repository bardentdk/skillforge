import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Tag, Trash2, Star, Users, Clock } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { fetchCart, type CartItem } from '@/lib/queries/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants'
import { formatPrice, formatCompactNumber, formatDuration } from '@/lib/utils'
import { Reveal } from '@/components/effects/reveal'
import { CartCheckoutButton, CartItemRemoveButton } from './cart-client'

export const metadata: Metadata = {
  title: 'Mon panier',
}

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/cart`)
  }

  const cart = await fetchCart(user.id)

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 pt-32 lg:pt-40 pb-20">
        <Reveal>
          <div className="mb-10">
            <Badge variant="gradient" icon={<ShoppingBag className="h-3 w-3" />} className="mb-4">
              Mon panier
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
              Prêt à <span className="text-gradient-emerald">apprendre</span> ?
            </h1>
            <p className="text-muted-foreground">
              {cart.totalItems > 0
                ? `${cart.totalItems} ${cart.totalItems === 1 ? 'cours' : 'cours'} dans ton panier`
                : 'Ton panier est vide'}
            </p>
          </div>
        </Reveal>

        {cart.totalItems === 0 ? (
          <EmptyCartFull />
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Items */}
            <div className="space-y-4">
              {cart.items.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.05}>
                  <CartLineItem item={item} />
                </Reveal>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <CartSummary
                totalItems={cart.totalItems}
                totalPrice={cart.totalPrice}
                totalOriginalPrice={cart.totalOriginalPrice}
                totalSavings={cart.totalSavings}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────
function CartLineItem({ item }: { item: CartItem }) {
  const course = item.course
  if (!course) return null

  const discount = course.original_price && course.original_price > course.price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 0

  return (
    <div className="glass rounded-2xl p-4 lg:p-5 border border-border hover:border-emerald-500/30 transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={ROUTES.course(course.slug)}
          className="relative h-40 sm:h-32 w-full sm:w-48 rounded-xl overflow-hidden shrink-0 group"
        >
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(min-width: 640px) 192px, 100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-neon-500/10" />
          )}
          {discount > 0 && (
            <Badge variant="gradient" size="sm" className="absolute top-2 left-2" pulse>
              -{discount}%
            </Badge>
          )}
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1">
            {course.category?.name && (
              <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
                {course.category.name}
              </p>
            )}
            <Link
              href={ROUTES.course(course.slug)}
              className="block hover:text-emerald-400 transition-colors"
            >
              <h3 className="text-base lg:text-lg font-bold mb-2 line-clamp-2">
                {course.title}
              </h3>
            </Link>

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
                <span className="text-xs text-muted-foreground">
                  {course.instructor.full_name}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-neon-500 text-neon-500" />
                {course.rating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatCompactNumber(course.students_count)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(course.duration_minutes)}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-xl lg:text-2xl font-bold text-emerald-400">
                {formatPrice(course.price)}
              </span>
              {course.original_price && course.original_price > course.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(course.original_price)}
                </span>
              )}
            </div>

            <CartItemRemoveButton cartItemId={item.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CartSummary({
  totalItems, totalPrice, totalOriginalPrice, totalSavings,
}: {
  totalItems: number
  totalPrice: number
  totalOriginalPrice: number
  totalSavings: number
}) {
  return (
    <div className="glass-strong rounded-2xl p-6 border border-emerald-500/10 space-y-5">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-emerald-400" />
        Récapitulatif
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{totalItems} {totalItems === 1 ? 'cours' : 'cours'}</span>
          <span className="font-semibold">{formatPrice(totalOriginalPrice)}</span>
        </div>

        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-neon-500">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Réduction
            </span>
            <span className="font-semibold">-{formatPrice(totalSavings)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-base font-semibold">Total</span>
          <span className="text-3xl font-bold text-gradient-emerald">
            {formatPrice(totalPrice)}
          </span>
        </div>
        {totalSavings > 0 && (
          <p className="text-xs text-neon-500 text-right">
            Tu économises {formatPrice(totalSavings)} 🎉
          </p>
        )}
      </div>

      <CartCheckoutButton />

      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Paiement 100% sécurisé via Stripe
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Garantie 30 jours satisfait ou remboursé
        </p>
      </div>
    </div>
  )
}

function EmptyCartFull() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="relative h-32 w-32 rounded-3xl glass border border-emerald-500/30 flex items-center justify-center">
          <ShoppingBag className="h-14 w-14 text-emerald-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-3">Ton panier est vide</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Découvre notre catalogue de 500+ cours premium en tech & digital.
        De quoi monter en compétences sérieusement !
      </p>
      <Link href={ROUTES.catalog}>
        <Button variant="gradient" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />} glow>
          Explorer le catalogue
        </Button>
      </Link>
    </div>
  )
}