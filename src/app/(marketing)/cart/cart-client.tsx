'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { removeFromCartAction, createCheckoutSessionAction } from '@/app/cart/actions'

export function CartItemRemoveButton({ cartItemId }: { cartItemId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { decrement } = useCartStore()

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCartAction(cartItemId)
      if (result.success) {
        decrement()
        toast.success('Retiré du panier')
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
      aria-label="Retirer du panier"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Retirer</span>
    </button>
  )
}

export function CartCheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    const result = await createCheckoutSessionAction()
    if (result.success && result.data) {
      window.location.href = result.data.url
    } else {
      toast.error(result.success === false ? result.error : 'Erreur checkout')
      setLoading(false)
    }
  }

  return (
    <Button
      variant="gradient"
      size="lg"
      className="w-full"
      leftIcon={<Sparkles className="h-4 w-4" />}
      rightIcon={<ArrowRight className="h-4 w-4" />}
      onClick={handleCheckout}
      loading={loading}
      glow
    >
      Passer à la caisse
    </Button>
  )
}