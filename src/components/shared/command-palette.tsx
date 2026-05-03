'use client'

import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Search, BookOpen, Compass, GraduationCap, Heart, Settings,
  Code2, Smartphone, BrainCircuit, Cloud, ShieldCheck,
  Palette, Target, TrendingUp, Sparkles, ArrowRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUICK_ACTIONS = [
  { icon: Compass, label: 'Explorer le catalogue', href: ROUTES.catalog, group: 'Navigation' },
  { icon: GraduationCap, label: 'Voir les formateurs', href: '/instructors', group: 'Navigation' },
  { icon: BookOpen, label: 'Mes cours', href: ROUTES.dashboard.learning, group: 'Mon espace' },
  { icon: Heart, label: 'Ma wishlist', href: ROUTES.dashboard.wishlist, group: 'Mon espace' },
  { icon: Settings, label: 'Paramètres', href: ROUTES.dashboard.settings, group: 'Mon espace' },
]

const CATEGORIES = [
  { icon: Code2, label: 'Développement Web', slug: 'web-development' },
  { icon: Smartphone, label: 'Développement Mobile', slug: 'mobile-development' },
  { icon: BrainCircuit, label: 'Data Science & IA', slug: 'data-science' },
  { icon: Cloud, label: 'DevOps & Cloud', slug: 'devops-cloud' },
  { icon: ShieldCheck, label: 'Cybersécurité', slug: 'cybersecurity' },
  { icon: Palette, label: 'UI/UX Design', slug: 'ui-ux-design' },
  { icon: Target, label: 'Product Management', slug: 'product-management' },
  { icon: TrendingUp, label: 'Marketing Digital', slug: 'digital-marketing' },
]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const runCommand = (action: () => void) => {
    onOpenChange(false)
    action()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[640px]"
          >
            <Command
              className={cn(
                'glass-strong rounded-2xl border border-emerald-500/20',
                'shadow-2xl shadow-emerald-950/40 overflow-hidden'
              )}
              loop
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <Command.Input
                  placeholder="Rechercher un cours, une catégorie, un formateur..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[400px] overflow-y-auto p-2">
                <Command.Empty className="py-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-3">
                    <Search className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aucun résultat trouvé
                  </p>
                </Command.Empty>

                <Command.Group
                  heading="Navigation rapide"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5"
                >
                  {QUICK_ACTIONS.filter(a => a.group === 'Navigation').map((action) => (
                    <Command.Item
                      key={action.label}
                      onSelect={() => runCommand(() => router.push(action.href))}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm',
                        'data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-emerald-400',
                        'transition-colors'
                      )}
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="flex-1">{action.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-data-[selected=true]:opacity-100" />
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Catégories"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5 mt-2"
                >
                  {CATEGORIES.map((cat) => (
                    <Command.Item
                      key={cat.slug}
                      onSelect={() => runCommand(() => router.push(ROUTES.category(cat.slug)))}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm',
                        'data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-emerald-400',
                        'transition-colors'
                      )}
                    >
                      <cat.icon className="h-4 w-4" />
                      <span className="flex-1">{cat.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Mon espace"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5 mt-2"
                >
                  {QUICK_ACTIONS.filter(a => a.group === 'Mon espace').map((action) => (
                    <Command.Item
                      key={action.label}
                      onSelect={() => runCommand(() => router.push(action.href))}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm',
                        'data-[selected=true]:bg-emerald-500/10 data-[selected=true]:text-emerald-400',
                        'transition-colors'
                      )}
                    >
                      <action.icon className="h-4 w-4" />
                      <span className="flex-1">{action.label}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="px-4 py-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↑↓</kbd>
                    Naviguer
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↵</kbd>
                    Sélectionner
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-neon-500" />
                  <span>Powered by Learnova</span>
                </div>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}