import { Suspense } from 'react'
import type { Metadata } from 'next'

import { fetchCourses, fetchAllCategories, fetchPriceRange } from '@/lib/queries/courses'
import { parseFilters, type SearchParams } from '@/lib/url-state'

import { CourseCard, CourseCardSkeleton } from '@/components/shared/course-card'

import { CatalogSearch } from '@/components/catalog/catalog-search'
import { CatalogSort } from '@/components/catalog/catalog-sort'
import { CatalogFilters } from '@/components/catalog/catalog-filters'
import { CatalogActiveFilters } from '@/components/catalog/catalog-active-filters'
import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { CatalogMobileFilters } from '@/components/catalog/catalog-mobile-filters'
import { CatalogEmpty } from '@/components/catalog/catalog-empty'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import { Reveal } from '@/components/effects/reveal'
import { CourseWithRelations } from '@/types/database'

export const metadata: Metadata = {
  title: 'Catalogue de cours',
  description:
    "Découvre 500+ cours premium en tech & digital. Du débutant à l'expert, trouve la formation qui te fera passer au niveau supérieur.",
}

interface CatalogPageProps {
  searchParams: Promise<SearchParams>
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const filters = parseFilters(params)

  const [{ courses, total, totalPages, page }, categories, priceRange] = await Promise.all([
    fetchCourses(filters),
    fetchAllCategories(),
    fetchPriceRange(),
  ])

  const catalogCourses = courses as CourseWithRelations[]

  return (
    <div className="relative min-h-screen">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 pt-32 lg:pt-40 pb-16">
        {/* Hero header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4">
              Catalogue complet
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Trouve ton <span className="text-gradient-emerald">prochain cours</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              {total > 0 ? (
                <>
                  <span className="text-emerald-400 font-semibold">{total} cours</span> en tech &
                  digital, par les meilleurs experts du marché.
                </>
              ) : (
                'Découvre 500+ cours en tech & digital.'
              )}
            </p>
          </div>
        </Reveal>

        {/* Search bar */}
        <Reveal delay={0.1}>
          <div className="max-w-2xl mx-auto mb-12">
            <CatalogSearch />
          </div>
        </Reveal>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters - desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CatalogFilters categories={categories} priceRange={priceRange} />
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CatalogMobileFilters categories={categories} priceRange={priceRange} />

                <p className="text-sm text-muted-foreground hidden sm:block">
                  <span className="font-semibold text-foreground">{total}</span>{' '}
                  {total === 1 ? 'cours' : 'cours'} trouvés
                </p>
              </div>

              <CatalogSort />
            </div>

            {/* Active filters */}
            <CatalogActiveFilters categories={categories} />

            {/* Results */}
            {catalogCourses.length === 0 ? (
              <CatalogEmpty />
            ) : (
              <Suspense fallback={<CatalogGridSkeleton />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {catalogCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </Suspense>
            )}

            {/* Pagination */}
            <CatalogPagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CatalogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  )
}