import Link from 'next/link'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Paiement annulé',
}

export default function CheckoutCancelPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 py-20 text-center max-w-xl">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
          <div className="relative h-20 w-20 rounded-2xl glass border border-orange-500/30 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-orange-400" />
          </div>
        </div>

        <Badge variant="outline" className="mb-4 border-orange-500/30 text-orange-400">
          Paiement annulé
        </Badge>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Tu as <span className="text-orange-400">annulé</span> le paiement
        </h1>
        <p className="text-muted-foreground mb-8">
          Pas de souci, ton panier est sauvegardé. Tu peux reprendre quand tu veux.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/cart">
            <Button variant="gradient" size="lg" leftIcon={<ShoppingCart className="h-4 w-4" />}>
              Retour au panier
            </Button>
          </Link>
          <Link href={ROUTES.catalog}>
            <Button variant="glass" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Continuer le shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}