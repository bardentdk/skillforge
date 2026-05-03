import { Suspense } from 'react'

import { Card } from '@/components/ui/card'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginPageSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Card variant="glow" padding="xl" className="backdrop-blur-2xl">
        <div className="animate-pulse space-y-6">
          <div className="mx-auto h-6 w-40 rounded-full bg-muted" />
          <div className="mx-auto h-8 w-64 rounded bg-muted" />
          <div className="mx-auto h-4 w-72 rounded bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
          <div className="h-10 w-full rounded-xl bg-muted" />
          <div className="h-10 w-full rounded-xl bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
        </div>
      </Card>
    </div>
  )
}