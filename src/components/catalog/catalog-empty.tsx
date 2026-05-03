'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CatalogEmpty() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
        <div className="relative h-20 w-20 rounded-2xl glass border border-emerald-500/30 flex items-center justify-center">
          <Search className="h-8 w-8 text-emerald-400" />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">Aucun cours trouvé</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        Essaye de modifier tes filtres ou ta recherche. Notre catalogue contient 500+ cours,
        on devrait pouvoir trouver ton bonheur.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="gradient"
          size="lg"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={() => router.replace(pathname, { scroll: false })}
        >
          Réinitialiser les filtres
        </Button>
        <Link href="/categories">
          <Button variant="glass" size="lg">
            Parcourir les catégories
          </Button>
        </Link>
      </div>
    </div>
  )
}