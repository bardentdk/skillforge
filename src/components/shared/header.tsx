'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, Heart, Menu, X, ChevronDown,
  Code2, Smartphone, BrainCircuit, Cloud, ShieldCheck,
  Palette, Target, TrendingUp, Sparkles, Command,
} from 'lucide-react'

import { useScroll } from '@/hooks/use-scroll'
import { useUser } from '@/hooks/use-user'
import { useIsMobile } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from './user-menu'
import { CommandPalette } from './command-palette'

import { useCartStore } from '@/stores/cart-store'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_ICONS = {
  'web-development': Code2,
  'mobile-development': Smartphone,
  'data-science': BrainCircuit,
  'devops-cloud': Cloud,
  'cybersecurity': ShieldCheck,
  'ui-ux-design': Palette,
  'product-management': Target,
  'digital-marketing': TrendingUp,
} as const

const MEGA_MENU_CATEGORIES = [
  { slug: 'web-development', name: 'Développement Web', desc: 'React, Next.js, Vue, Angular', count: 124 },
  { slug: 'mobile-development', name: 'Développement Mobile', desc: 'iOS, Android, React Native', count: 67 },
  { slug: 'data-science', name: 'Data Science & IA', desc: 'ML, Deep Learning, LLMs', count: 89 },
  { slug: 'devops-cloud', name: 'DevOps & Cloud', desc: 'AWS, Docker, Kubernetes', count: 45 },
  { slug: 'cybersecurity', name: 'Cybersécurité', desc: 'Pentesting, Sécurité offensive', count: 32 },
  { slug: 'ui-ux-design', name: 'UI/UX Design', desc: 'Figma, Design Systems', count: 56 },
  { slug: 'product-management', name: 'Product Management', desc: 'Stratégie, Discovery, Roadmap', count: 28 },
  { slug: 'digital-marketing', name: 'Marketing Digital', desc: 'SEO, Growth, Content', count: 41 },
]

export function Header() {
  const { isScrolled } = useScroll(20)
  const { isAuthenticated, profile, loading } = useUser()
  const isMobile = useIsMobile()
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])
  const { count: cartCount, setCount: setCartCount, toggleDrawer } = useCartStore()

  // Initial cart count fetch + subscribe to auth changes
  useEffect(() => {
    const supabase = createClient()

    const fetchCount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCartCount(0)
        return
      }
      const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      setCartCount(count ?? 0)
    }

    fetchCount()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCount()
    })

    return () => subscription.unsubscribe()
  }, [setCartCount])
  return (
    <>
      <CartDrawer />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'glass-strong border-b border-emerald-500/10 shadow-lg shadow-emerald-950/20'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-4">

            {/* LEFT: Logo + Nav Desktop */}
            <div className="flex items-center gap-8">
              <Logo />

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {/* Catalogue mega menu */}
                <div
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  className="relative"
                >
                  <button
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium',
                      'text-foreground/80 hover:text-foreground transition-colors',
                      'hover:bg-white/5'
                    )}
                  >
                    Catalogue
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      megaMenuOpen && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {megaMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-3 w-[700px]"
                      >
                        <div className="glass-strong rounded-2xl p-6 shadow-2xl shadow-emerald-950/30 border border-emerald-500/10">
                          <div className="grid grid-cols-2 gap-2">
                            {MEGA_MENU_CATEGORIES.map((cat) => {
                              const Icon = CATEGORY_ICONS[cat.slug as keyof typeof CATEGORY_ICONS]
                              return (
                                <Link
                                  key={cat.slug}
                                  href={ROUTES.category(cat.slug)}
                                  className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-500/5 transition-all duration-200"
                                >
                                  <div className="shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-neon-500/10 flex items-center justify-center group-hover/item:from-emerald-500/30 group-hover/item:to-neon-500/20 transition-colors">
                                    <Icon className="h-5 w-5 text-emerald-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="text-sm font-semibold text-foreground group-hover/item:text-emerald-400 transition-colors">
                                        {cat.name}
                                      </h4>
                                      <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                                        {cat.count}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                      {cat.desc}
                                    </p>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>

                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              <Sparkles className="h-3 w-3 inline-block mr-1 text-neon-500" />
                              Plus de 500+ cours premium
                            </p>
                            <Link
                              href={ROUTES.catalog}
                              className="text-xs font-medium text-emerald-400 hover:text-neon-500 transition-colors"
                            >
                              Voir tout le catalogue →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  href="/instructors"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Formateurs
                </Link>
                <Link
                  href={ROUTES.pricing}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => setCommandOpen(true)}
                className={cn(
                  'hidden md:flex items-center gap-3 h-10 px-3 pr-2 rounded-xl',
                  'glass border border-border hover:border-emerald-500/30',
                  'text-sm text-muted-foreground transition-all duration-200',
                  'min-w-[240px]'
                )}
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4" />
                <span className="flex-1 text-left">Rechercher un cours...</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>

              {/* Mobile search */}
              <button
                onClick={() => setCommandOpen(true)}
                className="md:hidden h-10 w-10 rounded-xl glass flex items-center justify-center hover:border-emerald-500/30 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href={ROUTES.dashboard.wishlist}
                  className="hidden md:flex h-10 w-10 rounded-xl glass items-center justify-center hover:border-emerald-500/30 transition-colors relative"
                  aria-label="Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleDrawer}
                className="hidden md:flex h-10 w-10 rounded-xl glass items-center justify-center hover:border-emerald-500/30 transition-colors relative"
                aria-label="Panier"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge variant="gradient" size="sm" className="absolute -top-1 -right-1 h-4 min-w-4 px-1 justify-center animate-fade-in">
                    {cartCount}
                  </Badge>
                )}
              </button>

              {/* Theme toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Auth state */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                {loading ? (
                  <div className="h-10 w-24 glass rounded-xl animate-pulse" />
                ) : isAuthenticated && profile ? (
                  <UserMenu profile={profile} />
                ) : (
                  <>
                    <Link href={ROUTES.auth.login}>
                      <Button variant="ghost" size="sm">Connexion</Button>
                    </Link>
                    <Link href={ROUTES.auth.register}>
                      <Button variant="gradient" size="sm">
                        Commencer
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-10 w-10 rounded-xl glass flex items-center justify-center hover:border-emerald-500/30 transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-sm glass-strong border-l border-emerald-500/10 lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full p-6 pt-24">
                <nav className="flex flex-col gap-2">
                  <Link
                    href={ROUTES.catalog}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium hover:bg-emerald-500/10 transition-colors"
                  >
                    Catalogue
                  </Link>
                  <Link
                    href="/instructors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium hover:bg-emerald-500/10 transition-colors"
                  >
                    Formateurs
                  </Link>
                  <Link
                    href={ROUTES.pricing}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium hover:bg-emerald-500/10 transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium hover:bg-emerald-500/10 transition-colors"
                  >
                    About
                  </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>

                  {!isAuthenticated && (
                    <>
                      <Link href={ROUTES.auth.login} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="lg" className="w-full">
                          Connexion
                        </Button>
                      </Link>
                      <Link href={ROUTES.auth.register} onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="gradient" size="lg" className="w-full">
                          Commencer gratuitement
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}