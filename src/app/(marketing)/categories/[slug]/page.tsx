import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'

import {
  fetchCourses, fetchAllCategories, fetchCategoryBySlug, fetchPriceRange,
} from '@/lib/queries/courses'
import { parseFilters, type SearchParams } from '@/lib/url-state'

import { CourseCard } from '@/components/shared/course-card'
import { CatalogSearch } from '@/components/catalog/catalog-search'
import { CatalogSort } from '@/components/catalog/catalog-sort'
import { CatalogFilters } from '@/components/catalog/catalog-filters'
import { CatalogActiveFilters } from '@/components/catalog/catalog-active-filters'
import { CatalogPagination } from '@/components/catalog/catalog-pagination'
import { CatalogMobileFilters } from '@/components/catalog/catalog-mobile-filters'
import { CatalogEmpty } from '@/components/catalog/catalog-empty'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/effects/reveal'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await fetchCategoryBySlug(slug)

  if (!category) return { title: 'Catégorie introuvable' }

  return {
    title: `${category.name}`,
    description: category.description || `Découvre tous les cours en ${category.name}.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const category = await fetchCategoryBySlug(slug)
  if (!category) notFound()

  const filters = parseFilters(sp)
  filters.categories = [slug]  // Force la catégorie

  const [{ courses, total, totalPages, page }, categories, priceRange] = await Promise.all([
    fetchCourses(filters),
    fetchAllCategories(),
    fetchPriceRange(),
  ])

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6 pt-32 lg:pt-40 pb-16">
        {/* Breadcrumb */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Toutes les catégories
        </Link>

        {/* Header */}
        <Reveal>
          <div className="max-w-3xl mb-10">
            <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4">
              {category.is_featured ? 'Catégorie populaire' : 'Catégorie'}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-gradient-emerald">{category.name}</span>
            </h1>
            {category.description && (
              <p className="text-lg text-muted-foreground mb-2">
                {category.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              <span className="text-emerald-400 font-semibold">{total} cours</span>{' '}
              disponibles dans cette catégorie
            </p>
          </div>
        </Reveal>

        {/* Search */}
        <div className="max-w-2xl mb-10">
          <CatalogSearch placeholder={`Rechercher dans ${category.name}...`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CatalogFilters categories={categories} priceRange={priceRange} hideCategoryFilter />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <CatalogMobileFilters
                  categories={categories}
                  priceRange={priceRange}
                  hideCategoryFilter
                />
                <p className="text-sm text-muted-foreground hidden sm:block">
                  <span className="font-semibold text-foreground">{total}</span> cours
                </p>
              </div>
              <CatalogSort />
            </div>

            <CatalogActiveFilters categories={categories} />

            {courses.length === 0 ? (
              <CatalogEmpty />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course as never} />
                ))}
              </div>
            )}

            <CatalogPagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  )
}