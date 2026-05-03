export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
export type LessonType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'EXERCISE' | 'LIVE'
export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string
          email: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      categories: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Row']>
      }
      courses: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['courses']['Row']> & {
          slug: string
          title: string
          instructor_id: string
        }
        Update: Partial<Database['public']['Tables']['courses']['Row']>
      }
      modules: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['modules']['Row']> & {
          course_id: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['modules']['Row']>
      }
      lessons: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['lessons']['Row']> & {
          module_id: string
          course_id: string
          title: string
        }
        Update: Partial<Database['public']['Tables']['lessons']['Row']>
      }
      enrollments: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['enrollments']['Row']> & {
          user_id: string
          course_id: string
        }
        Update: Partial<Database['public']['Tables']['enrollments']['Row']>
      }
      reviews: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['reviews']['Row']> & {
          user_id: string
          course_id: string
          rating: number
        }
        Update: Partial<Database['public']['Tables']['reviews']['Row']>
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          course_id: string
          created_at: string
        }
        Insert: { user_id: string; course_id: string; id?: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['wishlists']['Row']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          course_id: string
          added_at: string
        }
        Insert: { user_id: string; course_id: string; id?: string; added_at?: string }
        Update: Partial<Database['public']['Tables']['cart_items']['Row']>
      }
      lesson_progress: {
        Row: {
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
        Insert: Partial<Database['public']['Tables']['lesson_progress']['Row']> & {
          user_id: string
          lesson_id: string
          course_id: string
        }
        Update: Partial<Database['public']['Tables']['lesson_progress']['Row']>
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
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

// Joined types (with relations)
export type CourseWithInstructor = Course & {
  instructor: Profile
  category: Category | null
}

export type CourseWithDetails = CourseWithInstructor & {
  modules: (Module & { lessons: Lesson[] })[]
  reviews: (Review & { user: Profile })[]
}