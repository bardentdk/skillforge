'use client'

import { useState } from 'react'
import { Play, FileText, HelpCircle, Code, Lock, Eye, Clock } from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDuration, cn } from '@/lib/utils'
import type { Module, Lesson, LessonType } from '@/types/database'

interface CurriculumProps {
  modules: (Module & { lessons: Lesson[] })[]
  totalLessons: number
  totalDuration: number
}

const LESSON_ICONS: Record<LessonType, typeof Play> = {
  VIDEO: Play,
  TEXT: FileText,
  QUIZ: HelpCircle,
  EXERCISE: Code,
  LIVE: Play,
}

export function Curriculum({ modules, totalLessons, totalDuration }: CurriculumProps) {
  const [allOpen, setAllOpen] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>(modules[0]?.id ? [modules[0].id] : [])

  const toggleAll = () => {
    if (allOpen) {
      setOpenItems([])
      setAllOpen(false)
    } else {
      setOpenItems(modules.map((m) => m.id))
      setAllOpen(true)
    }
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-muted-foreground">Le programme est en cours de préparation.</p>
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Programme du cours</h2>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{modules.length} modules</span> ·{' '}
            <span className="font-semibold text-foreground">{totalLessons} leçons</span> ·{' '}
            <span className="font-semibold text-foreground">{formatDuration(totalDuration)}</span> de contenu
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleAll}>
          {allOpen ? 'Tout réduire' : 'Tout déplier'}
        </Button>
      </div>

      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setOpenItems}
        className="space-y-3"
      >
        {modules.map((module, index) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-neon-500/10 flex items-center justify-center font-bold text-emerald-400 text-sm">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-base lg:text-lg font-semibold line-clamp-1">{module.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {module.lessons_count} leçons · {formatDuration(module.duration_minutes)}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="!pt-0 !px-0">
              <div className="border-t border-border">
                {module.lessons.map((lesson, idx) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    isLast={idx === module.lessons.length - 1}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function LessonRow({ lesson, index, isLast }: { lesson: Lesson; index: number; isLast: boolean }) {
  const Icon = LESSON_ICONS[lesson.type]
  const isPreview = lesson.is_preview

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-5 py-3 transition-colors group',
        !isLast && 'border-b border-border',
        isPreview ? 'hover:bg-emerald-500/5 cursor-pointer' : 'opacity-60'
      )}
    >
      <div className="shrink-0 w-7 text-xs text-muted-foreground text-center font-mono">
        {(index + 1).toString().padStart(2, '0')}
      </div>

      <div
        className={cn(
          'shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
          isPreview
            ? 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              'text-sm font-medium line-clamp-1 transition-colors',
              isPreview && 'group-hover:text-emerald-400'
            )}
          >
            {lesson.title}
          </h4>
          {isPreview && (
            <Badge variant="primary" size="sm" icon={<Eye className="h-2.5 w-2.5" />}>
              Aperçu
            </Badge>
          )}
        </div>
        {lesson.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lesson.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span className="tabular-nums">{formatDuration(lesson.duration_minutes)}</span>
      </div>

      {!isPreview && <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
    </div>
  )
}