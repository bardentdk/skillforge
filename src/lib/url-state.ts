import type { CourseFiltersInput } from '@/lib/queries/courses'
import type { CourseLevel } from '@/types/database'

const ALLOWED_LEVELS: CourseLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
const ALLOWED_SORTS = ['popular', 'newest', 'rating', 'price-asc', 'price-desc'] as const
const ALLOWED_DURATIONS = ['short', 'medium', 'long'] as const

export type SearchParams = Record<string, string | string[] | undefined>

export function parseFilters(searchParams: SearchParams): CourseFiltersInput {
  const get = (key: string) => {
    const v = searchParams[key]
    return Array.isArray(v) ? v[0] : v
  }

  const getArray = (key: string): string[] => {
    const v = searchParams[key]
    if (!v) return []
    if (Array.isArray(v)) return v.flatMap((x) => x.split(','))
    return v.split(',').filter(Boolean)
  }

  const sortRaw = get('sort')
  const sort = ALLOWED_SORTS.includes(sortRaw as typeof ALLOWED_SORTS[number])
    ? (sortRaw as CourseFiltersInput['sort'])
    : 'popular'

  const durationRaw = get('duration')
  const duration = ALLOWED_DURATIONS.includes(durationRaw as typeof ALLOWED_DURATIONS[number])
    ? (durationRaw as CourseFiltersInput['duration'])
    : undefined

  const levels = getArray('levels').filter((l): l is CourseLevel =>
    ALLOWED_LEVELS.includes(l as CourseLevel)
  )

  const priceMin = get('priceMin') ? Number(get('priceMin')) : undefined
  const priceMax = get('priceMax') ? Number(get('priceMax')) : undefined
  const rating = get('rating') ? Number(get('rating')) : undefined
  const page = get('page') ? Math.max(1, Number(get('page'))) : 1

  return {
    search: get('q') || undefined,
    categories: getArray('categories'),
    levels: levels.length ? levels : undefined,
    priceMin: !Number.isNaN(priceMin) ? priceMin : undefined,
    priceMax: !Number.isNaN(priceMax) ? priceMax : undefined,
    rating: !Number.isNaN(rating) ? rating : undefined,
    isFree: get('free') === 'true',
    hasCertificate: get('certificate') === 'true',
    isBestseller: get('bestseller') === 'true',
    isNew: get('new') === 'true',
    duration,
    sort,
    page,
    perPage: 12,
  }
}

export function buildSearchString(filters: Partial<CourseFiltersInput>): string {
  const params = new URLSearchParams()

  if (filters.search) params.set('q', filters.search)
  if (filters.categories?.length) params.set('categories', filters.categories.join(','))
  if (filters.levels?.length) params.set('levels', filters.levels.join(','))
  if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax))
  if (filters.rating !== undefined) params.set('rating', String(filters.rating))
  if (filters.isFree) params.set('free', 'true')
  if (filters.hasCertificate) params.set('certificate', 'true')
  if (filters.isBestseller) params.set('bestseller', 'true')
  if (filters.isNew) params.set('new', 'true')
  if (filters.duration) params.set('duration', filters.duration)
  if (filters.sort && filters.sort !== 'popular') params.set('sort', filters.sort)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))

  const str = params.toString()
  return str ? `?${str}` : ''
}