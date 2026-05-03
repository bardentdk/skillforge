'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, RotateCcw, Star, Sparkles, Award, Flame, Clock, Filter as FilterIcon } from 'lucide-react'

import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatPrice } from '@/lib/utils'
import type { Category } from '@/types/database'

const LEVELS = [
  { value: 'BEGINNER', label: 'Débutant' },
  { value: 'INTERMEDIATE', label: 'Intermédiaire' },
  { value: 'ADVANCED', label: 'Avancé' },
  { value: 'EXPERT', label: 'Expert' },
]

const RATINGS = [
  { value: 4.5, label: '4.5+' },
  { value: 4, label: '4.0+' },
  { value: 3, label: '3.0+' },
]

const DURATIONS = [
  { value: 'short', label: 'Court (< 2h)' },
  { value: 'medium', label: 'Moyen (2-10h)' },
  { value: 'long', label: 'Long (10h+)' },
]

interface CatalogFiltersProps {
  categories: Category[]
  priceRange: { min: number; max: number }
  hideCategoryFilter?: boolean
}

export function CatalogFilters({ categories, priceRange, hideCategoryFilter }: CatalogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const updateParam = (key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      params.delete(key)
    } else if (Array.isArray(value)) {
      params.set(key, value.join(','))
    } else {
      params.set(key, value)
    }
    params.delete('page')

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  const toggleArrayValue = (paramKey: string, value: string) => {
    const current = searchParams.get(paramKey)?.split(',').filter(Boolean) || []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateParam(paramKey, next)
  }

  const setBoolean = (key: string, isOn: boolean) => {
    updateParam(key, isOn ? 'true' : null)
  }

  const handleReset = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false })
    })
  }

  // Current values
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || []
  const selectedLevels = searchParams.get('levels')?.split(',').filter(Boolean) || []
  const minPrice = Number(searchParams.get('priceMin')) || priceRange.min
  const maxPrice = Number(searchParams.get('priceMax')) || priceRange.max
  const selectedRating = searchParams.get('rating')
  const selectedDuration = searchParams.get('duration')
  const isFree = searchParams.get('free') === 'true'
  const hasCert = searchParams.get('certificate') === 'true'
  const isBestseller = searchParams.get('bestseller') === 'true'
  const isNew = searchParams.get('new') === 'true'

  const hasAnyFilter =
    selectedCategories.length > 0 ||
    selectedLevels.length > 0 ||
    selectedRating !== null ||
    selectedDuration !== null ||
    isFree ||
    hasCert ||
    isBestseller ||
    isNew ||
    searchParams.get('priceMin') !== null ||
    searchParams.get('priceMax') !== null

  return (
    <aside className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <FilterIcon className="h-4 w-4 text-emerald-400" />
          Filtres
        </h3>
        {hasAnyFilter && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-neon-500 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Quick filters (toggles) */}
      <FilterGroup title="Promotion" defaultOpen>
        <div className="space-y-2.5">
          <ToggleFilter
            label="Bestsellers"
            icon={<Flame className="h-3.5 w-3.5" />}
            checked={isBestseller}
            onChange={(c) => setBoolean('bestseller', c)}
          />
          <ToggleFilter
            label="Nouveaux cours"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            checked={isNew}
            onChange={(c) => setBoolean('new', c)}
          />
          <ToggleFilter
            label="Avec certificat"
            icon={<Award className="h-3.5 w-3.5" />}
            checked={hasCert}
            onChange={(c) => setBoolean('certificate', c)}
          />
          <ToggleFilter
            label="Cours gratuits"
            checked={isFree}
            onChange={(c) => setBoolean('free', c)}
          />
        </div>
      </FilterGroup>

      <Separator className="my-3" />

      {/* Categories */}
      {!hideCategoryFilter && (
        <>
          <FilterGroup title="Catégorie" count={selectedCategories.length} defaultOpen>
            <ScrollArea className="max-h-64">
              <div className="space-y-2 pr-3">
                {categories.map((cat) => (
                  <CheckboxRow
                    key={cat.slug}
                    id={`cat-${cat.slug}`}
                    label={cat.name}
                    badge={cat.courses_count > 0 ? cat.courses_count : undefined}
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleArrayValue('categories', cat.slug)}
                  />
                ))}
              </div>
            </ScrollArea>
          </FilterGroup>
          <Separator className="my-3" />
        </>
      )}

      {/* Level */}
      <FilterGroup title="Niveau" count={selectedLevels.length} defaultOpen>
        <div className="space-y-2">
          {LEVELS.map((level) => (
            <CheckboxRow
              key={level.value}
              id={`level-${level.value}`}
              label={level.label}
              checked={selectedLevels.includes(level.value)}
              onChange={() => toggleArrayValue('levels', level.value)}
            />
          ))}
        </div>
      </FilterGroup>

      <Separator className="my-3" />

      {/* Price */}
      <FilterGroup title="Prix" defaultOpen>
        <div className="space-y-4">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={5}
            defaultValue={[minPrice, maxPrice]}
            onValueCommit={([min, max]) => {
              const params = new URLSearchParams(searchParams.toString())
              if (min === priceRange.min) params.delete('priceMin')
              else params.set('priceMin', String(min))
              if (max === priceRange.max) params.delete('priceMax')
              else params.set('priceMax', String(max))
              params.delete('page')
              startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`, { scroll: false })
              })
            }}
            disabled={isFree}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{formatPrice(minPrice)}</span>
            <span className="text-muted-foreground">{formatPrice(maxPrice)}</span>
          </div>
        </div>
      </FilterGroup>

      <Separator className="my-3" />

      {/* Rating */}
      <FilterGroup title="Note">
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              onClick={() => updateParam('rating', selectedRating === String(r.value) ? null : String(r.value))}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors',
                selectedRating === String(r.value)
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i <= Math.round(r.value) ? 'fill-neon-500 text-neon-500' : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <span>{r.label} et plus</span>
            </button>
          ))}
        </div>
      </FilterGroup>

      <Separator className="my-3" />

      {/* Duration */}
      <FilterGroup title="Durée">
        <div className="space-y-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              onClick={() => updateParam('duration', selectedDuration === d.value ? null : d.value)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors text-left',
                selectedDuration === d.value
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {d.label}
            </button>
          ))}
        </div>
      </FilterGroup>
    </aside>
  )
}

// ──────────────────────────────────────────────
function FilterGroup({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 group"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {title}
          {count !== undefined && count > 0 && (
            <Badge variant="primary" size="sm">
              {count}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckboxRow({
  id,
  label,
  badge,
  checked,
  onChange,
}: {
  id: string
  label: string
  badge?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
      {badge !== undefined && (
        <span className="text-xs text-muted-foreground/60">{badge}</span>
      )}
    </label>
  )
}

function ToggleFilter({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string
  icon?: React.ReactNode
  checked: boolean
  onChange: (c: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
        checked
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          : 'border border-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground'
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{label}</span>
      <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
    </button>
  )
}