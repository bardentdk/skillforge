import { createClient } from '@/lib/supabase/server'
import type { Category, Course, CourseLevel, Profile } from '@/types/database'

type SupabaseAnyClient = {
  from: (table: string) => any
}

export interface CourseWithRelations extends Course {
  instructor?: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'> | null
  category?: Pick<Category, 'id' | 'slug' | 'name'> | null
}

export interface CourseFiltersInput {
  search?: string
  categories?: string[]
  levels?: CourseLevel[]
  priceMin?: number
  priceMax?: number
  rating?: number
  isFree?: boolean
  hasCertificate?: boolean
  isBestseller?: boolean
  isNew?: boolean
  duration?: 'short' | 'medium' | 'long'
  sort?: 'popular' | 'newest' | 'rating' | 'price-asc' | 'price-desc'
  page?: number
  perPage?: number
}

export interface CourseQueryResult {
  courses: CourseWithRelations[]
  total: number
  totalPages: number
  page: number
  perPage: number
}

export async function fetchCourses(filters: CourseFiltersInput = {}): Promise<CourseQueryResult> {
  const supabase = (await createClient()) as SupabaseAnyClient

  const {
    search,
    categories,
    levels,
    priceMin,
    priceMax,
    rating,
    isFree,
    hasCertificate,
    isBestseller,
    isNew,
    duration,
    sort = 'popular',
    page = 1,
    perPage = 12,
  } = filters

  // Resolve category slugs to IDs
  let categoryIds: string[] | null = null

  if (categories?.length) {
    const { data: catsData, error: catsError } = await supabase
      .from('categories')
      .select('id')
      .in('slug', categories)

    if (catsError) {
      console.error('[fetchCourses] categories error:', catsError)
      categoryIds = []
    } else {
      const cats = (catsData ?? []) as Array<Pick<Category, 'id'>>
      categoryIds = cats.map((category) => category.id)
    }
  }

  let query = supabase
    .from('courses')
    .select(
      `
        *,
        instructor:profiles!courses_instructor_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        ),
        category:categories!courses_category_id_fkey (
          id,
          slug,
          name
        )
      `,
      { count: 'exact' }
    )
    .eq('status', 'PUBLISHED')

  if (search) {
    const escapedSearch = search.replaceAll('%', '\\%').replaceAll('_', '\\_')

    query = query.or(
      `title.ilike.%${escapedSearch}%,subtitle.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`
    )
  }

  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category_id', categoryIds)
  }

  if (levels?.length) {
    query = query.in('level', levels)
  }

  if (isFree) {
    query = query.eq('price', 0)
  } else {
    if (priceMin !== undefined) {
      query = query.gte('price', priceMin)
    }

    if (priceMax !== undefined) {
      query = query.lte('price', priceMax)
    }
  }

  if (rating !== undefined) {
    query = query.gte('rating', rating)
  }

  if (hasCertificate) {
    query = query.eq('has_certificate', true)
  }

  if (isBestseller) {
    query = query.eq('is_bestseller', true)
  }

  if (isNew) {
    query = query.eq('is_new', true)
  }

  if (duration === 'short') {
    query = query.lt('duration_minutes', 120)
  } else if (duration === 'medium') {
    query = query.gte('duration_minutes', 120).lt('duration_minutes', 600)
  } else if (duration === 'long') {
    query = query.gte('duration_minutes', 600)
  }

  switch (sort) {
    case 'newest':
      query = query.order('published_at', {
        ascending: false,
        nullsFirst: false,
      })
      break

    case 'rating':
      query = query
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false })
      break

    case 'price-asc':
      query = query.order('price', { ascending: true })
      break

    case 'price-desc':
      query = query.order('price', { ascending: false })
      break

    case 'popular':
    default:
      query = query
        .order('students_count', { ascending: false })
        .order('rating', { ascending: false })
      break
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('[fetchCourses] error:', error)

    return {
      courses: [],
      total: 0,
      totalPages: 0,
      page,
      perPage,
    }
  }

  const courses = (data ?? []) as CourseWithRelations[]
  const total = count ?? 0
  const totalPages = Math.ceil(total / perPage)

  return {
    courses,
    total,
    totalPages,
    page,
    perPage,
  }
}

export async function fetchAllCategories(): Promise<Category[]> {
  const supabase = (await createClient()) as SupabaseAnyClient

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('[fetchAllCategories] error:', error)
    return []
  }

  return (data ?? []) as Category[]
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = (await createClient()) as SupabaseAnyClient

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('[fetchCategoryBySlug] error:', error)
    return null
  }

  return (data ?? null) as Category | null
}

export async function fetchPriceRange(): Promise<{ min: number; max: number }> {
  const supabase = (await createClient()) as SupabaseAnyClient

  const { data, error } = await supabase
    .from('courses')
    .select('price')
    .eq('status', 'PUBLISHED')
    .order('price', { ascending: true })

  if (error) {
    console.error('[fetchPriceRange] error:', error)
    return { min: 0, max: 200 }
  }

  const rows = (data ?? []) as Array<Pick<Course, 'price'>>

  if (rows.length === 0) {
    return { min: 0, max: 200 }
  }

  const prices = rows
    .map((row) => Number(row.price))
    .filter((price) => Number.isFinite(price))

  if (prices.length === 0) {
    return { min: 0, max: 200 }
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}