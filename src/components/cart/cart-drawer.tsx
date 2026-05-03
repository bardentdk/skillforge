'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ShoppingCart, Trash2, ArrowRight, Sparkles, ShoppingBag, Tag,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCartStore } from '@/stores/cart-store'
import { createClient } from '@/lib/supabase/client'
import { ROUTES } from '@/lib/constants'
import { formatPrice, cn } from '@/lib/utils'
import { removeFromCartAction, createCheckoutSessionAction } from '@/app/cart/actions'
import type { CartItem } from '@/lib/queries/cart'

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, setCount } = useCartStore()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [, startTransition] = useTransition()

  // Fetch cart when drawer opens
  useEffect(() => {
    if (!drawerOpen) return

    const fetchCart = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setItems([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('cart_items')
        .select(
          `
          id, course_id, added_at,
          course:courses!cart_items_course_id_fkey (
            id, slug, title, subtitle, thumbnail_url, price, original_price, level, rating, students_count, total_lessons, duration_minutes,
            instructor:profiles!courses_instructor_id_fkey (id, full_name, avatar_url)
          )
        `
        )
        .eq('user_id', user.id)
        .order('added_at', { ascending: false })

      const cartItems = (data ?? []) as unknown as CartItem[]
      setItems(cartItems.filter((i) => i.course))
      setCount(cartItems.length)
      setLoading(false)
    }

    fetchCart()
  }, [drawerOpen, setCount])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleRemove = (cartItemId: string) => {
    startTransition(async () => {
      const optimistic = items.filter((i) => i.id !== cartItemId)
      setItems(optimistic)
      setCount(optimistic.length)

      const result = await removeFromCartAction(cartItemId)
      if (!result.success) {
        toast.error(result.error)
      } else {
        toast.success('Retiré du panier')
      }
    })
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    const result = await createCheckoutSessionAction()
    if (result.success && result.data) {
      window.location.href = result.data.url
    } else {
      toast.error(result.success === false ? result.error : 'Erreur checkout')
      setCheckoutLoading(false)
    }
  }

  const totalPrice = items.reduce((sum, i) => sum + (i.course?.price || 0), 0)
  const totalOriginal = items.reduce((sum, i) => sum + (i.course?.original_price || i.course?.price || 0), 0)
  const savings = Math.max(0, totalOriginal - totalPrice)

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[450px] glass-strong border-l border-emerald-500/10 flex flex-col shadow-2xl shadow-emerald-950/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Mon panier</h2>
                  <p className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? 'cours' : 'cours'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-9 w-9 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyCart onClose={() => setDrawerOpen(false)} />
              ) : (
                <div className="p-5 space-y-3">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item.id)}
                      onClose={() => setDrawerOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4 bg-background/80 backdrop-blur-sm">
                {savings > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-neon-500">
                      <Tag className="h-3.5 w-3.5" />
                      Tu économises
                    </span>
                    <span className="font-semibold text-neon-500">
                      {formatPrice(savings)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <div className="text-right">
                    {savings > 0 && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatPrice(totalOriginal)}
                      </div>
                    )}
                    <div className="text-2xl font-bold text-gradient-emerald">
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={handleCheckout}
                    loading={checkoutLoading}
                    glow
                  >
                    Passer à la caisse
                  </Button>
                  <Link href="/cart" onClick={() => setDrawerOpen(false)}>
                    <Button variant="ghost" size="md" className="w-full">
                      Voir le panier en détail
                    </Button>
                  </Link>
                </div>

                <p className="text-center text-[11px] text-muted-foreground">
                  💳 Paiement 100% sécurisé · 🔒 Garantie 30 jours
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// ────────────────────────────────────────────────────
function CartItemCard({
  item, onRemove, onClose,
}: {
  item: CartItem
  onRemove: () => void
  onClose: () => void
}) {
  const course = item.course
  if (!course) return null

  const discount = course.original_price && course.original_price > course.price
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group glass rounded-xl p-3 border border-border hover:border-emerald-500/30 transition-all"
    >
      <div className="flex gap-3">
        <Link
          href={ROUTES.course(course.slug)}
          onClick={onClose}
          className="relative h-20 w-28 rounded-lg overflow-hidden shrink-0"
        >
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-neon-500/10" />
          )}
          {discount > 0 && (
            <Badge variant="gradient" size="sm" className="absolute top-1 left-1">
              -{discount}%
            </Badge>
          )}
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link
              href={ROUTES.course(course.slug)}
              onClick={onClose}
              className="text-sm font-semibold line-clamp-2 hover:text-emerald-400 transition-colors leading-tight"
            >
              {course.title}
            </Link>
            {course.instructor?.full_name && (
              <p className="text-xs text-muted-foreground mt-1">
                {course.instructor.full_name}
              </p>
            )}
          </div>

          <div className="flex items-end justify-between mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-emerald-400">
                {formatPrice(course.price)}
              </span>
              {course.original_price && course.original_price > course.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(course.original_price)}
                </span>
              )}
            </div>
            <button
              onClick={onRemove}
              className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
              aria-label="Retirer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl glass border border-emerald-500/30 flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-emerald-400" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2">Ton panier est vide</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        Découvre notre catalogue de 500+ cours premium en tech & digital.
      </p>
      <Link href={ROUTES.catalog} onClick={onClose}>
        <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
          Explorer le catalogue
        </Button>
      </Link>
    </div>
  )
}