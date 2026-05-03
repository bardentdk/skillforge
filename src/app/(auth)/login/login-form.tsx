'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { loginAction, googleOAuthAction } from '../actions'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || ROUTES.dashboard.student

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (!result.success) {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors)
      }

      toast.error(result.error || 'Connexion échouée')
      setLoading(false)
      return
    }

    toast.success('Connexion réussie !')
    router.push(redirectTo)
    router.refresh()
  }

  const handleGoogleAuth = async () => {
    setOauthLoading(true)
    await googleOAuthAction()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <Card variant="glow" padding="xl" className="backdrop-blur-2xl">
        <div className="text-center mb-8">
          <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} className="mb-4">
            Bon retour parmi nous
          </Badge>

          <h1 className="text-3xl font-bold mb-2">
            Connexion à <span className="text-gradient-emerald">Learnova</span>
          </h1>

          <p className="text-sm text-muted-foreground">
            Continue ton apprentissage là où tu t&apos;étais arrêté
          </p>
        </div>

        <Button
          type="button"
          variant="glass"
          size="lg"
          className="w-full mb-4"
          onClick={handleGoogleAuth}
          loading={oauthLoading}
          leftIcon={<GoogleIcon />}
        >
          Continuer avec Google
        </Button>

        <div className="relative my-6 flex items-center">
          <Separator className="flex-1" />
          <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">ou</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="ton@email.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.[0]}
            required
            autoComplete="email"
          />

          <div>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Cacher' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.[0]}
              required
              autoComplete="current-password"
            />

            <div className="text-right mt-2">
              <Link
                href={ROUTES.auth.forgot}
                className="text-xs text-emerald-400 hover:text-neon-500 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            loading={loading}
            rightIcon={!loading && <ArrowRight className="h-4 w-4" />}
          >
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Pas encore de compte ?{' '}
          <Link
            href={ROUTES.auth.register}
            className="text-emerald-400 hover:text-neon-500 font-medium transition-colors"
          >
            Crée-en un gratuitement
          </Link>
        </p>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        En continuant, tu acceptes nos{' '}
        <Link href="/legal/terms" className="underline hover:text-foreground transition-colors">
          CGU
        </Link>{' '}
        et notre{' '}
        <Link href="/legal/privacy" className="underline hover:text-foreground transition-colors">
          Politique de confidentialité
        </Link>
      </p>
    </motion.div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}