'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter as FilterIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CatalogFilters } from './catalog-filters'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Category } from '@/types/database'

interface CatalogMobileFiltersProps {
  categories: Category[]
  priceRange: { min: number; max: number }
  hideCategoryFilter?: boolean
  activeCount?: number
}

export function CatalogMobileFilters({
  categories,
  priceRange,
  hideCategoryFilter,
  activeCount,
}: CatalogMobileFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="glass"
        size="md"
        onClick={() => setOpen(true)}
        leftIcon={<FilterIcon className="h-4 w-4" />}
        className="lg:hidden relative"
      >
        Filtres
        {activeCount !== undefined && activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-neon-500 text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[88%] max-w-sm glass-strong border-r border-emerald-500/10 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  <CatalogFilters
                    categories={categories}
                    priceRange={priceRange}
                    hideCategoryFilter={hideCategoryFilter}
                  />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <Button variant="gradient" size="lg" className="w-full" onClick={() => setOpen(false)}>
                  Voir les résultats
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}