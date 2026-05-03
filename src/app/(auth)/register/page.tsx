'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { registerAction, googleOAuthAction } from '../actions'

const BENEFITS = [
  'Accès à 500+ cours premium',
  'Certificats de réussite',
  'Communauté active',
  'Support 7j/7',
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const result = await registerAction(formData)

    if (!result.success) {
      if (result.fieldErrors) setErrors(result.fieldErrors)
      toast.error(result.error || 'Inscription échouée')
      setLoading(false)
      return
    }

    setSuccess(true)
    toast.success('🎉 Compte créé ! Vérifie ton email pour confirmer.')
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    setOauthLoading(true)
    await googleOAuthAction()
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <Card variant="glow" padding="xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mb-6 animate-glow-pulse">
            <Check className="h-8 w-8 text-neon-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">
            Vérifie ton <span className="text-gradient-emerald">email</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            On t'a envoyé un lien de confirmation. Clique dessus pour activer ton compte.
          </p>
          <Link href={ROUTES.auth.login}>
            <Button variant="glass" size="lg" className="w-full">
              Retour à la connexion
            </Button>
          </Link>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-5xl grid lg:grid-cols-5 gap-8 items-center"
    >
      {/* LEFT: Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:block lg:col-span-2 space-y-6"
      >
        <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} pulse>
          Inscription gratuite
        </Badge>

        <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
          Lance ta carrière{' '}
          <span className="text-gradient-emerald">tech</span>
        </h2>

        <p className="text-muted-foreground text-lg">
          Rejoins 50K+ étudiants qui apprennent auprès des meilleurs experts.
          Cours immersifs, projets concrets, communauté active.
        </p>

        <ul className="space-y-3">
          {BENEFITS.map((benefit, i) => (
            <motion.li
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="h-3.5 w-3.5 text-neon-500" />
              </div>
              <span className="text-sm">{benefit}</span>
            </motion.li>
          ))}
        </ul>

        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-neon-500 border-2 border-background flex items-center justify-center text-xs font-bold text-emerald-950"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-400 font-semibold">+ 50K étudiants</span>{' '}
            apprennent déjà sur Learnova
          </p>
        </div>
      </motion.div>

      {/* RIGHT: Form */}
      <Card variant="glow" padding="xl" className="backdrop-blur-2xl lg:col-span-3 w-full max-w-md mx-auto lg:max-w-none">
        <div className="text-center mb-6 lg:hidden">
          <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />}>
            Inscription gratuite
          </Badge>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-1 text-center lg:text-left">
          Crée ton compte
        </h1>
        <p className="text-sm text-muted-foreground mb-6 text-center lg:text-left">
          Commence gratuitement, aucune carte bancaire requise
        </p>

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

        <div className="relative my-5 flex items-center">
          <Separator className="flex-1" />
          <span className="px-3 text-xs text-muted-foreground uppercase tracking-wider">ou</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="fullName"
            label="Nom complet"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.fullName?.[0]}
            required
            autoComplete="name"
          />

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

          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.[0]}
            hint="Min 8 caractères, 1 majuscule, 1 chiffre"
            required
            autoComplete="new-password"
          />

          <Input
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            label="Confirme le mot de passe"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.[0]}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full mt-6"
            loading={loading}
            rightIcon={!loading && <ArrowRight className="h-4 w-4" />}
          >
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Tu as déjà un compte ?{' '}
          <Link
            href={ROUTES.auth.login}
            className="text-emerald-400 hover:text-neon-500 font-medium transition-colors"
          >
            Connecte-toi
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}