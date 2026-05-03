import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground border border-border',
        primary: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        neon: 'bg-neon-500/10 text-neon-400 border border-neon-500/40',
        gradient: 'bg-gradient-to-r from-emerald-500/20 to-neon-500/20 text-neon-400 border border-emerald-500/30',
        glow: 'bg-emerald-500/10 text-neon-400 border border-neon-500/40 shadow-[0_0_15px_rgba(0,255,178,0.2)]',
        outline: 'border border-border text-foreground',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/30',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        glass: 'glass text-foreground',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  pulse?: boolean
}

function Badge({ className, variant, size, icon, pulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }