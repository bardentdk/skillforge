export const APP_CONFIG = {
  name: 'Learnova',
  tagline: 'Master Tech & Digital. Built for the future.',
  description:
    'La plateforme premium pour apprendre la tech et le digital. Cours immersifs créés par des experts.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/learnova',
    github: 'https://github.com/learnova',
    discord: 'https://discord.gg/learnova',
  },
} as const

export const ROUTES = {
  home: '/',
  catalog: '/catalog',

  course: (slug: string) => `/courses/${slug}`,
  category: (slug: string) => `/categories/${slug}`,

  // Profil public formateur
  instructor: (slug: string) => `/instructors/${slug}`,

  auth: {
    login: '/login',
    register: '/register',
    forgot: '/forgot-password',
  },

  dashboard: {
    student: '/dashboard',
    learning: '/dashboard/learning',
    wishlist: '/dashboard/wishlist',
    settings: '/dashboard/settings',
  },

  // Espace formateur privé
  instructorDashboard: {
    dashboard: '/instructor',
    courses: '/instructor/courses',
    create: '/instructor/courses/new',
    analytics: '/instructor/analytics',
    earnings: '/instructor/earnings',
  },

  admin: '/admin',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
} as const

export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const

export type CourseLevel = (typeof COURSE_LEVELS)[number]

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

export const CATEGORIES = [
  {
    slug: 'web-development',
    name: 'Développement Web',
    icon: 'Code2',
    color: '#00FFB2',
  },
  {
    slug: 'mobile-development',
    name: 'Développement Mobile',
    icon: 'Smartphone',
    color: '#00CC8E',
  },
  {
    slug: 'data-science',
    name: 'Data Science & IA',
    icon: 'BrainCircuit',
    color: '#5CBA96',
  },
  {
    slug: 'devops-cloud',
    name: 'DevOps & Cloud',
    icon: 'Cloud',
    color: '#29A575',
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersécurité',
    icon: 'ShieldCheck',
    color: '#00674F',
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    icon: 'Palette',
    color: '#005440',
  },
  {
    slug: 'product-management',
    name: 'Product Management',
    icon: 'Target',
    color: '#004132',
  },
  {
    slug: 'digital-marketing',
    name: 'Marketing Digital',
    icon: 'TrendingUp',
    color: '#002E23',
  },
] as const

export const NAV_LINKS = [
  { label: 'Catalogue', href: ROUTES.catalog },
  { label: 'Catégories', href: '/categories' },
  { label: 'Formateurs', href: '/instructors' },
  { label: 'Pricing', href: ROUTES.pricing },
] as const