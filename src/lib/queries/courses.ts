import { createClient } from '@/lib/supabase/server'
import type { CourseLevel, CourseWithRelations, Category, Course } from '@/types/database'

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

export interface CoursesQueryResult {
  courses: CourseWithRelations[]
  total: number
  totalPages: number
  page: number
  perPage: number
}

export async function fetchCourses(filters: CourseFiltersInput = {}): Promise<CoursesQueryResult> {
  const supabase = await createClient()

  const {
    search, categories, levels, priceMin, priceMax, rating,
    isFree, hasCertificate, isBestseller, isNew, duration,
    sort = 'popular', page = 1, perPage = 12,
  } = filters

  let categoryIds: string[] | null = null
  if (categories?.length) {
    const { data: cats } = await supabase
      .from('categories')
      .select('id')
      .in('slug', categories)

    const typedCats = (cats ?? []) as Pick<Category, 'id'>[]
    categoryIds = typedCats.map((c) => c.id)
  }

  let query = supabase
    .from('courses')
    .select(
      `
      *,
      instructor:profiles!courses_instructor_id_fkey (id, username, full_name, avatar_url),
      category:categories!courses_category_id_fkey (id, slug, name)
    `,
      { count: 'exact' }
    )
    .eq('status', 'PUBLISHED')

  if (search) {
    query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%,description.ilike.%${search}%`)
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
    if (priceMin !== undefined) query = query.gte('price', priceMin)
    if (priceMax !== undefined) query = query.lte('price', priceMax)
  }
  if (rating !== undefined) query = query.gte('rating', rating)
  if (hasCertificate) query = query.eq('has_certificate', true)
  if (isBestseller) query = query.eq('is_bestseller', true)
  if (isNew) query = query.eq('is_new', true)

  if (duration === 'short') query = query.lt('duration_minutes', 120)
  else if (duration === 'medium') query = query.gte('duration_minutes', 120).lt('duration_minutes', 600)
  else if (duration === 'long') query = query.gte('duration_minutes', 600)

  switch (sort) {
    case 'newest':
      query = query.order('published_at', { ascending: false, nullsFirst: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false }).order('reviews_count', { ascending: false })
      break
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
    default:
      query = query.order('students_count', { ascending: false }).order('rating', { ascending: false })
      break
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('[fetchCourses] error:', error)
    return { courses: [], total: 0, totalPages: 0, page, perPage }
  }

  const total = count ?? 0
  const totalPages = Math.ceil(total / perPage)

  return {
    courses: (data ?? []) as unknown as CourseWithRelations[],
    total,
    totalPages,
    page,
    perPage,
  }
}

export async function fetchAllCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  return (data ?? []) as unknown as Category[]
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return (data ?? null) as unknown as Category | null
}

export async function fetchPriceRange(): Promise<{ min: number; max: number }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('price')
    .eq('status', 'PUBLISHED')
    .order('price', { ascending: true })

  const typedData = (data ?? []) as Pick<Course, 'price'>[]

  if (typedData.length === 0) return { min: 0, max: 200 }

  const prices = typedData.map((d) => d.price)
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}