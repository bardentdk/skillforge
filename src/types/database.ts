export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE' | 'LIVE'
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

// ============================================
// ROW TYPES (lecture)
// ============================================
export interface ProfileRow {
  id: string
  email: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  cover_url: string | null
  bio: string | null
  headline: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  role: UserRole
  is_verified: boolean
  is_featured: boolean
  total_students: number
  total_courses: number
  total_revenue: number
  rating: number
  reviews_count: number
  expertise: string[]
  created_at: string
  updated_at: string
}

export interface CategoryRow {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  color: string | null
  parent_id: string | null
  display_order: number
  is_featured: boolean
  courses_count: number
  created_at: string
}

export interface CourseRow {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  thumbnail_url: string | null
  preview_video_url: string | null
  trailer_url: string | null
  instructor_id: string
  category_id: string | null
  level: CourseLevel
  status: CourseStatus
  language: string
  price: number
  original_price: number | null
  currency: string
  duration_minutes: number
  total_lessons: number
  total_modules: number
  what_you_learn: string[]
  requirements: string[]
  target_audience: string[]
  tags: string[]
  rating: number
  reviews_count: number
  students_count: number
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  has_certificate: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ModuleRow {
  id: string
  course_id: string
  title: string
  description: string | null
  display_order: number
  duration_minutes: number
  lessons_count: number
  created_at: string
  updated_at: string
}

export interface LessonRow {
  id: string
  module_id: string
  course_id: string
  title: string
  description: string | null
  type: LessonType
  video_url: string | null
  content: string | null
  duration_minutes: number
  display_order: number
  is_preview: boolean
  resources: Json
  created_at: string
  updated_at: string
}

export interface EnrollmentRow {
  id: string
  user_id: string
  course_id: string
  status: EnrollmentStatus
  progress_percent: number
  completed_lessons: string[]
  current_lesson_id: string | null
  amount_paid: number
  enrolled_at: string
  completed_at: string | null
  certificate_issued_at: string | null
}

export interface ReviewRow {
  id: string
  user_id: string
  course_id: string
  rating: number
  title: string | null
  comment: string | null
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface WishlistRow {
  id: string
  user_id: string
  course_id: string
  created_at: string
}

export interface CartItemRow {
  id: string
  user_id: string
  course_id: string
  added_at: string
}

export interface LessonProgressRow {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  watch_time_seconds: number
  last_position_seconds: number
  completed_at: string | null
  updated_at: string
}

// ============================================
// INSERT TYPES (écriture)
// ============================================
export interface ProfileInsert {
  id: string
  email: string
  username?: string | null
  full_name?: string | null
  avatar_url?: string | null
  cover_url?: string | null
  bio?: string | null
  headline?: string | null
  website?: string | null
  twitter?: string | null
  linkedin?: string | null
  github?: string | null
  role?: UserRole
  is_verified?: boolean
  is_featured?: boolean
  expertise?: string[]
}

export interface CourseInsert {
  slug: string
  title: string
  instructor_id: string
  subtitle?: string | null
  description?: string | null
  thumbnail_url?: string | null
  preview_video_url?: string | null
  trailer_url?: string | null
  category_id?: string | null
  level?: CourseLevel
  status?: CourseStatus
  language?: string
  price?: number
  original_price?: number | null
  currency?: string
  duration_minutes?: number
  total_lessons?: number
  total_modules?: number
  what_you_learn?: string[]
  requirements?: string[]
  target_audience?: string[]
  tags?: string[]
  is_featured?: boolean
  is_bestseller?: boolean
  is_new?: boolean
  has_certificate?: boolean
  published_at?: string | null
}

export interface EnrollmentInsert {
  user_id: string
  course_id: string
  status?: EnrollmentStatus
  amount_paid?: number
}

export interface ReviewInsert {
  user_id: string
  course_id: string
  rating: number
  title?: string | null
  comment?: string | null
}

export interface WishlistInsert {
  user_id: string
  course_id: string
}

export interface CartItemInsert {
  user_id: string
  course_id: string
}

// ============================================
// UPDATE TYPES
// ============================================
export type ProfileUpdate = Partial<ProfileRow>
export type CourseUpdate = Partial<CourseRow>
export type ModuleUpdate = Partial<ModuleRow>
export type LessonUpdate = Partial<LessonRow>
export type EnrollmentUpdate = Partial<EnrollmentRow>
export type ReviewUpdate = Partial<ReviewRow>

// ============================================
// SUPABASE DATABASE TYPE
// ============================================
// ============================================
// ORDERS
// ============================================
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface OrderRow {
  id: string
  user_id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  status: OrderStatus
  total_amount: number
  currency: string
  course_ids: string[]
  metadata: Json
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface OrderInsert {
  user_id: string
  total_amount: number
  course_ids: string[]
  stripe_session_id?: string | null
  stripe_payment_intent_id?: string | null
  status?: OrderStatus
  currency?: string
  metadata?: Json
}

export type OrderUpdate = Partial<OrderRow>

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      orders: {
        Row: OrderRow
        Insert: OrderInsert
        Update: OrderUpdate
      }
      categories: {
        Row: CategoryRow
        Insert: Omit<CategoryRow, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<CategoryRow>
      }
      courses: {
        Row: CourseRow
        Insert: CourseInsert
        Update: CourseUpdate
      }
      modules: {
        Row: ModuleRow
        Insert: Omit<ModuleRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: ModuleUpdate
      }
      lessons: {
        Row: LessonRow
        Insert: Omit<LessonRow, 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: LessonUpdate
      }
      enrollments: {
        Row: EnrollmentRow
        Insert: EnrollmentInsert
        Update: EnrollmentUpdate
      }
      reviews: {
        Row: ReviewRow
        Insert: ReviewInsert
        Update: ReviewUpdate
      }
      wishlists: {
        Row: WishlistRow
        Insert: WishlistInsert
        Update: Partial<WishlistRow>
      }
      cart_items: {
        Row: CartItemRow
        Insert: CartItemInsert
        Update: Partial<CartItemRow>
      }
      lesson_progress: {
        Row: LessonProgressRow
        Insert: Omit<LessonProgressRow, 'id' | 'updated_at'> & { id?: string }
        Update: Partial<LessonProgressRow>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      course_level: CourseLevel
      course_status: CourseStatus
      lesson_type: LessonType
      enrollment_status: EnrollmentStatus
    }
    CompositeTypes: Record<string, never>
  }
}

// ============================================
// HELPER ALIASES (pour les composants)
// ============================================
export type Profile = ProfileRow
export type Order = OrderRow
export type Category = CategoryRow
export type Course = CourseRow
export type Module = ModuleRow
export type Lesson = LessonRow
export type Enrollment = EnrollmentRow
export type Review = ReviewRow
export type Wishlist = WishlistRow
export type CartItem = CartItemRow
export type LessonProgress = LessonProgressRow

// ============================================
// JOINED TYPES (avec relations)
// ============================================
export interface CourseWithRelations extends Course {
  instructor: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'> | null
  category: Pick<Category, 'id' | 'slug' | 'name'> | null
}

export interface CourseWithFullInstructor extends Course {
  instructor: Pick<
    Profile,
    | 'id' | 'username' | 'full_name' | 'avatar_url' | 'is_verified' | 'headline'
    | 'bio' | 'total_students' | 'total_courses' | 'rating' | 'reviews_count'
    | 'expertise' | 'twitter' | 'linkedin' | 'website'
  > | null
  category: Pick<Category, 'id' | 'slug' | 'name' | 'color'> | null
  modules: (Module & { lessons: Lesson[] })[]
}

export interface ReviewWithUser extends Review {
  user: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}