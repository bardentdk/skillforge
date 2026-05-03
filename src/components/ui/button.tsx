'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // BASE
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none overflow-hidden group',
  {
    variants: {
      variant: {
        // Primary - Émeraude solide avec glow
        primary:
          'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:bg-emerald-400 hover:-translate-y-0.5 active:translate-y-0',

        // Glow - Néon avec border lumineuse
        glow:
          'bg-emerald-500/10 text-neon-500 border border-neon-500/40 backdrop-blur-sm hover:bg-emerald-500/20 hover:border-neon-500/70 hover:shadow-[0_0_30px_rgba(0,255,178,0.4)]',

        // Gradient - Effet wow pour CTA principaux
        gradient:
          'bg-gradient-to-r from-emerald-600 via-emerald-500 to-neon-500 text-white shadow-lg shadow-emerald-500/40 hover:shadow-neon-500/50 bg-[length:200%_100%] hover:bg-[position:100%_0] transition-[background-position,box-shadow,transform] hover:-translate-y-0.5',

        // Outline
        outline:
          'border border-border bg-transparent text-foreground hover:bg-accent hover:border-emerald-500/50 hover:text-foreground',

        // Ghost
        ghost: 'text-foreground hover:bg-accent hover:text-foreground',

        // Glass - Glassmorphism
        glass:
          'glass text-foreground hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,103,79,0.2)]',

        // Destructive
        destructive:
          'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 hover:bg-destructive/90 hover:shadow-destructive/50',

        // Link
        link: 'text-emerald-500 underline-offset-4 hover:underline hover:text-neon-500',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-sm rounded-xl',
        lg: 'h-13 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-base rounded-2xl',
        icon: 'h-11 w-11 rounded-xl',
        'icon-sm': 'h-9 w-9 rounded-lg',
        'icon-lg': 'h-13 w-13 rounded-xl',
      },
      glow: {
        true: 'animate-glow-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      glow: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const content = asChild ? (
      children
    ) : (
      <>
        {/* Shimmer overlay on hover (gradient variant) */}
        {variant === 'gradient' && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
        )}

        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
            {leftIcon}
          </span>
        ) : null}

        <span className="relative z-10">{children}</span>

        {!loading && rightIcon && (
          <span className="inline-flex shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </>
    )

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, glow, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }