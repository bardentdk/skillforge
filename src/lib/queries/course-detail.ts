import { createClient } from '@/lib/supabase/server'
import type {
  CourseWithFullInstructor, CourseWithRelations, ReviewWithUser, Review,
} from '@/types/database'

export async function fetchCourseBySlug(slug: string): Promise<CourseWithFullInstructor | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('courses')
    .select(
      `
      *,
      instructor:profiles!courses_instructor_id_fkey (
        id, username, full_name, avatar_url, headline, bio,
        is_verified, total_students, total_courses, rating,
        reviews_count, expertise, twitter, linkedin, website
      ),
      category:categories!courses_category_id_fkey (id, slug, name, color),
      modules (
        id, course_id, title, description, display_order, duration_minutes, lessons_count, created_at, updated_at,
        lessons (
          id, module_id, course_id, title, description, type, video_url, content,
          duration_minutes, display_order, is_preview, resources, created_at, updated_at
        )
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'PUBLISHED')
    .single()

  if (error || !data) {
    console.error('[fetchCourseBySlug] error:', error?.message)
    return null
  }

  const course = data as unknown as CourseWithFullInstructor

  if (course.modules) {
    course.modules.sort((a, b) => a.display_order - b.display_order)
    course.modules.forEach((m) => {
      if (m.lessons) {
        m.lessons.sort((a, b) => a.display_order - b.display_order)
      }
    })
  }

  return course
}

export async function fetchCourseReviews(courseId: string, limit = 8): Promise<ReviewWithUser[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('reviews')
    .select(
      `
      *,
      user:profiles!reviews_user_id_fkey (id, full_name, avatar_url)
    `
    )
    .eq('course_id', courseId)
    .order('helpful_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as unknown as ReviewWithUser[]
}

export interface ReviewsBreakdown {
  total: number
  average: number
  breakdown: Record<number, number>
}

export async function fetchReviewsBreakdown(courseId: string): Promise<ReviewsBreakdown> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('course_id', courseId)

  const typedData = (data ?? []) as Pick<Review, 'rating'>[]

  if (typedData.length === 0) {
    return { total: 0, average: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }
  }

  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let sum = 0
  typedData.forEach((r) => {
    breakdown[r.rating] = (breakdown[r.rating] || 0) + 1
    sum += r.rating
  })

  return {
    total: typedData.length,
    average: sum / typedData.length,
    breakdown,
  }
}

export async function fetchRelatedCourses(
  courseId: string,
  categoryId: string | null,
  instructorId: string,
  limit = 4
): Promise<CourseWithRelations[]> {
  const supabase = await createClient()

  if (categoryId) {
    const { data: byCategory } = await supabase
      .from('courses')
      .select(
        `
        *,
        instructor:profiles!courses_instructor_id_fkey (id, username, full_name, avatar_url),
        category:categories!courses_category_id_fkey (id, slug, name)
      `
      )
      .eq('status', 'PUBLISHED')
      .eq('category_id', categoryId)
      .neq('id', courseId)
      .order('rating', { ascending: false })
      .limit(limit)

    if (byCategory && byCategory.length >= 2) {
      return byCategory as unknown as CourseWithRelations[]
    }
  }

  const { data: byInstructor } = await supabase
    .from('courses')
    .select(
      `
      *,
      instructor:profiles!courses_instructor_id_fkey (id, username, full_name, avatar_url),
      category:categories!courses_category_id_fkey (id, slug, name)
    `
    )
    .eq('status', 'PUBLISHED')
    .eq('instructor_id', instructorId)
    .neq('id', courseId)
    .order('rating', { ascending: false })
    .limit(limit)

  return (byInstructor ?? []) as unknown as CourseWithRelations[]
}