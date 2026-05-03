'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { Category } from '@/types/database'

const LEVEL_LABELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

const DURATION_LABELS = {
  short: 'Court (<2h)',
  medium: 'Moyen (2-10h)',
  long: 'Long (10h+)',
}

interface ActiveFiltersProps {
  categories: Category[]
}

export function CatalogActiveFilters({ categories }: ActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const search = searchParams.get('q')
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || []
  const selectedLevels = searchParams.get('levels')?.split(',').filter(Boolean) || []
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  const rating = searchParams.get('rating')
  const duration = searchParams.get('duration')
  const isFree = searchParams.get('free') === 'true'
  const hasCert = searchParams.get('certificate') === 'true'
  const isBestseller = searchParams.get('bestseller') === 'true'
  const isNew = searchParams.get('new') === 'true'

  const removeParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value !== undefined) {
      const current = params.get(key)?.split(',').filter(Boolean) || []
      const next = current.filter((v) => v !== value)
      if (next.length === 0) params.delete(key)
      else params.set(key, next.join(','))
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const chips: { key: string; label: string; onRemove: () => void }[] = []

  if (search) chips.push({ key: 'search', label: `"${search}"`, onRemove: () => removeParam('q') })
  if (isBestseller) chips.push({ key: 'bs', label: 'Bestsellers', onRemove: () => removeParam('bestseller') })
  if (isNew) chips.push({ key: 'new', label: 'Nouveaux', onRemove: () => removeParam('new') })
  if (hasCert) chips.push({ key: 'cert', label: 'Avec certificat', onRemove: () => removeParam('certificate') })
  if (isFree) chips.push({ key: 'free', label: 'Gratuits', onRemove: () => removeParam('free') })

  selectedCategories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug)
    chips.push({
      key: `cat-${slug}`,
      label: cat?.name || slug,
      onRemove: () => removeParam('categories', slug),
    })
  })

  selectedLevels.forEach((level) => {
    chips.push({
      key: `lvl-${level}`,
      label: LEVEL_LABELS[level as keyof typeof LEVEL_LABELS] || level,
      onRemove: () => removeParam('levels', level),
    })
  })

  if (priceMin || priceMax) {
    const min = priceMin ? formatPrice(Number(priceMin)) : '0 €'
    const max = priceMax ? formatPrice(Number(priceMax)) : '∞'
    chips.push({
      key: 'price',
      label: `${min} - ${max}`,
      onRemove: () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('priceMin')
        params.delete('priceMax')
        params.delete('page')
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        })
      },
    })
  }

  if (rating) chips.push({ key: 'rating', label: `${rating}+ ★`, onRemove: () => removeParam('rating') })
  if (duration) chips.push({
    key: 'dur',
    label: DURATION_LABELS[duration as keyof typeof DURATION_LABELS] || duration,
    onRemove: () => removeParam('duration'),
  })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-medium text-muted-foreground">Filtres actifs :</span>
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.button
            key={chip.key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={chip.onRemove}
            className="group"
          >
            <Badge
              variant="primary"
              size="md"
              className="cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all gap-2"
            >
              {chip.label}
              <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
            </Badge>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}