import { createClient } from '@/lib/supabase/server'
import type { CourseWithRelations } from '@/types/database'

export interface CartItem {
  id: string
  course_id: string
  added_at: string
  course: CourseWithRelations
}

export interface CartData {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  totalOriginalPrice: number
  totalSavings: number
}

export async function fetchCart(userId: string): Promise<CartData> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
      id,
      course_id,
      added_at,
      course:courses!cart_items_course_id_fkey (
        *,
        instructor:profiles!courses_instructor_id_fkey (id, username, full_name, avatar_url),
        category:categories!courses_category_id_fkey (id, slug, name)
      )
    `
    )
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error || !data) {
    return { items: [], totalItems: 0, totalPrice: 0, totalOriginalPrice: 0, totalSavings: 0 }
  }

  const items = (data as unknown as CartItem[]).filter((item) => item.course)

  const totalPrice = items.reduce((sum, item) => sum + item.course.price, 0)
  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + (item.course.original_price || item.course.price),
    0
  )

  return {
    items,
    totalItems: items.length,
    totalPrice,
    totalOriginalPrice,
    totalSavings: Math.max(0, totalOriginalPrice - totalPrice),
  }
}

export async function fetchCartCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return count ?? 0
}