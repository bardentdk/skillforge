'use client'

import { CourseCard } from '@/components/shared/course-card'
import type { CourseWithRelations } from '@/types/database'

interface RelatedCoursesProps {
  courses: CourseWithRelations[]
  title?: string
}

export function RelatedCourses({ courses, title = 'Cours similaires' }: RelatedCoursesProps) {
  if (!courses || courses.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Continue ton apprentissage avec ces cours sélectionnés pour toi
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} variant="compact" />
        ))}
      </div>
    </section>
  )
}