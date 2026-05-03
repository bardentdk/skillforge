import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import {
  fetchCourseBySlug, fetchCourseReviews, fetchReviewsBreakdown, fetchRelatedCourses,
} from '@/lib/queries/course-detail'
import { createClient } from '@/lib/supabase/server'
import { CourseHero } from '@/components/course-detail/course-hero'
import { PurchaseCard } from '@/components/course-detail/purchase-card'
import { Curriculum } from '@/components/course-detail/curriculum'
import { InstructorCard } from '@/components/course-detail/instructor-card'
import { ReviewsSection } from '@/components/course-detail/reviews-section'
import { RelatedCourses } from '@/components/course-detail/related-courses'
import { CourseDescriptionTab } from '@/components/course-detail/course-tabs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug)

  if (!course) return { title: 'Cours introuvable' }

  return {
    title: course.title,
    description: course.subtitle || course.description?.slice(0, 160) || `Découvre le cours "${course.title}" sur Learnova.`,
    openGraph: {
      title: course.title,
      description: course.subtitle || '',
      images: course.thumbnail_url ? [{ url: course.thumbnail_url }] : [],
    },
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug)

  if (!course) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = Boolean(user)

  let isEnrolled = false
  let isInWishlist = false
  if (user) {
    const [{ data: enrollment }, { data: wishlist }] = await Promise.all([
      supabase.from('enrollments').select('id').eq('user_id', user.id).eq('course_id', course.id).eq('status', 'ACTIVE').maybeSingle(),
      supabase.from('wishlists').select('id').eq('user_id', user.id).eq('course_id', course.id).maybeSingle(),
    ])
    isEnrolled = Boolean(enrollment)
    isInWishlist = Boolean(wishlist)
  }

  const [reviews, breakdown, relatedCourses] = await Promise.all([
    fetchCourseReviews(course.id),
    fetchReviewsBreakdown(course.id),
    fetchRelatedCourses(course.id, course.category_id, course.instructor_id),
  ])

  return (
    <div className="relative min-h-screen">
      <CourseHero course={course} />

      <div className="container mx-auto px-4 lg:px-6 pb-24">
        <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-12">
          <div className="min-w-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full sm:w-auto overflow-x-auto">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="curriculum">Programme</TabsTrigger>
                <TabsTrigger value="instructor">Formateur</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-12">
                <CourseDescriptionTab
                  description={course.description}
                  whatYouLearn={course.what_you_learn || []}
                  requirements={course.requirements || []}
                  targetAudience={course.target_audience || []}
                />
              </TabsContent>

              <TabsContent value="curriculum">
                <Curriculum
                  modules={course.modules || []}
                  totalLessons={course.total_lessons}
                  totalDuration={course.duration_minutes}
                />
              </TabsContent>

              <TabsContent value="instructor">
                {course.instructor && <InstructorCard instructor={course.instructor} />}
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsSection
                  reviews={reviews}
                  breakdown={breakdown}
                  course={course}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <PurchaseCard
              course={course}
              isAuthenticated={isAuthenticated}
              isEnrolled={isEnrolled}
              isInWishlist={isInWishlist}
            />
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div className="mt-20">
            <RelatedCourses courses={relatedCourses} />
          </div>
        )}
      </div>
    </div>
  )
}