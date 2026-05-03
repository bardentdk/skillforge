import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'shimmer'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-muted',
        variant === 'default' && 'animate-pulse',
        variant === 'glow' && 'animate-pulse bg-gradient-to-r from-muted via-emerald-950/30 to-muted bg-[length:200%_100%] animate-gradient',
        variant === 'shimmer' && 'shimmer',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }