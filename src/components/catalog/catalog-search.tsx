'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CatalogSearchProps {
  placeholder?: string
}

export function CatalogSearch({ placeholder = 'Rechercher un cours...' }: CatalogSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [value, setValue] = useState(searchParams.get('q') || '')

  // Debounced URL update
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const current = params.get('q') || ''

      if (value === current) return

      if (value) params.set('q', value)
      else params.delete('q')

      params.delete('page') // Reset pagination on search

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    }, 400)

    return () => clearTimeout(handler)
  }, [value, pathname, router, searchParams])

  return (
    <div className="relative w-full">
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        variant="glass"
        sizeVariant="lg"
        leftIcon={<Search className={cn('h-4 w-4', isPending && 'animate-pulse')} />}
        rightIcon={
          isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          ) : value ? (
            <button
              type="button"
              onClick={() => setValue('')}
              className="hover:text-foreground transition-colors"
              aria-label="Effacer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null
        }
        autoComplete="off"
      />
    </div>
  )
}