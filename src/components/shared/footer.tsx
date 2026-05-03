'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Mail, ArrowRight, Sparkles, Heart } from 'lucide-react'
import { toast } from 'sonner'

import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants'

const FOOTER_LINKS = {
  Plateforme: [
    { label: 'Catalogue', href: ROUTES.catalog },
    { label: 'Catégories', href: '/categories' },
    { label: 'Formateurs', href: '/instructors' },
    { label: 'Pricing', href: ROUTES.pricing },
    { label: 'Entreprises', href: '/business' },
  ],
  Apprendre: [
    { label: 'Devenir formateur', href: '/teach' },
    { label: 'Centre d\'aide', href: '/help' },
    { label: 'Blog', href: '/blog' },
    { label: 'Communauté', href: '/community' },
    { label: 'Événements', href: '/events' },
  ],
  Entreprise: [
    { label: 'À propos', href: '/about' },
    { label: 'Carrières', href: '/careers' },
    { label: 'Presse', href: '/press' },
    { label: 'Partenaires', href: '/partners' },
    { label: 'Contact', href: '/contact' },
  ],
  Légal: [
    { label: 'CGU', href: '/legal/terms' },
    { label: 'Confidentialité', href: '/legal/privacy' },
    { label: 'Cookies', href: '/legal/cookies' },
    { label: 'RGPD', href: '/legal/gdpr' },
    { label: 'Accessibilité', href: '/legal/accessibility' },
  ],
}

const SOCIAL_LINKS = [
  { icon: ExternalLink, href: 'https://twitter.com/learnova', label: 'Twitter' },
  { icon: ExternalLink, href: 'https://github.com/learnova', label: 'GitHub' },
  { icon: ExternalLink, href: 'https://linkedin.com/company/learnova', label: 'LinkedIn' },
  { icon: ExternalLink, href: 'https://youtube.com/@learnova', label: 'YouTube' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    // TODO: Wire to Supabase / external service
    await new Promise((r) => setTimeout(r, 800))
    toast.success('🎉 Inscription réussie ! Check ta boîte mail.')
    setEmail('')
    setLoading(false)
  }

  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[400px] h-[400px] bg-neon-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-4 lg:px-6">
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="py-16 lg:py-20"
        >
          <div className="glass-strong rounded-3xl p-8 lg:p-12 border border-emerald-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-500/10 rounded-full blur-[80px]" />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="gradient" icon={<Sparkles className="h-3 w-3" />} pulse>
                  Newsletter
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-3">
                  Reste{' '}
                  <span className="text-gradient-emerald">à la page</span>
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Nouveautés cours, conseils experts, tendances tech.
                  Une newsletter, zéro spam, désabonnement en 1 clic.
                </p>
              </div>

              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="glass"
                  sizeVariant="lg"
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  loading={loading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  S'inscrire
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        <Separator variant="gradient" />

        {/* Main footer */}
        <div className="py-12 lg:py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              La plateforme premium pour apprendre la tech & le digital.
              Cours immersifs créés par des experts.
            </p>

            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:border-emerald-500/40 hover:text-emerald-400 transition-all hover:-translate-y-0.5"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Learnova. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Built with{' '}
            <Heart className="h-3.5 w-3.5 text-neon-500 fill-neon-500 animate-pulse" />
            {' '}by passionate devs
          </p>
        </div>
      </div>
    </footer>
  )
}