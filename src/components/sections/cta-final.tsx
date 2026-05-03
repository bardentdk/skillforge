'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

import { Reveal } from '@/components/effects/reveal'
import { Magnetic } from '@/components/effects/magnetic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'

export function CTAFinal() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative glass-strong rounded-3xl p-8 lg:p-16 overflow-hidden border border-emerald-500/20">
          {/* Animated background */}
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(0,103,79,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,255,178,0.2) 0%, transparent 50%)',
              backgroundSize: '200% 200%',
            }}
          />

          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-12 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/30 to-neon-500/20 blur-2xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-12 h-40 w-40 rounded-full bg-gradient-to-br from-neon-500/20 to-emerald-500/30 blur-2xl pointer-events-none"
          />

          <div className="relative text-center max-w-3xl mx-auto">
            <Reveal>
              <Badge
                variant="gradient"
                icon={<Sparkles className="h-3 w-3" />}
                pulse
                className="mb-6"
              >
                Prêt à passer au niveau supérieur ?
              </Badge>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Lance ta carrière{' '}
                <span className="text-gradient-emerald">tech</span>
                <br />
                dès <span className="text-gradient-emerald">aujourd'hui</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Inscription gratuite, aucune carte bancaire requise.
                Accède à 500+ cours premium, une communauté active et des certifications reconnues.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.2}>
                  <Link href={ROUTES.auth.register}>
                    <Button
                      variant="gradient"
                      size="xl"
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                      glow
                    >
                      Commencer gratuitement
                    </Button>
                  </Link>
                </Magnetic>

                <Magnetic strength={0.2}>
                  <Link href="/teach">
                    <Button
                      variant="glass"
                      size="xl"
                      leftIcon={<Zap className="h-5 w-5 text-neon-500" />}
                    >
                      Devenir formateur
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="mt-8 text-xs text-muted-foreground">
                ✓ 7 jours d'essai gratuit · ✓ Annulation à tout moment · ✓ Garantie satisfait ou remboursé 30 jours
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}