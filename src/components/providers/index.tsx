'use client'

import { type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { LenisProvider } from './lenis-provider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <LenisProvider>
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(18, 22, 21, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 178, 0.2)',
                color: '#fff',
              },
            }}
          />
        </LenisProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}