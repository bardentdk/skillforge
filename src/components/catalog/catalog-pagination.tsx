'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function CatalogPagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) params.delete('page')
    else params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages = generatePageNumbers(currentPage, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'h-10 w-10 rounded-xl glass flex items-center justify-center',
          'hover:border-emerald-500/30 transition-all',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border'
        )}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <div key={`ellipsis-${i}`} className="h-10 w-10 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={cn(
              'h-10 min-w-10 px-3 rounded-xl flex items-center justify-center text-sm font-medium transition-all',
              p === currentPage
                ? 'bg-gradient-to-br from-emerald-500 to-neon-500 text-white shadow-lg shadow-emerald-500/30'
                : 'glass hover:border-emerald-500/30 hover:text-emerald-400'
            )}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'h-10 w-10 rounded-xl glass flex items-center justify-center',
          'hover:border-emerald-500/30 transition-all',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border'
        )}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const result: (number | '...')[] = [1]

  if (current > 3) result.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) result.push(i)

  if (current < total - 2) result.push('...')

  result.push(total)
  return result
}