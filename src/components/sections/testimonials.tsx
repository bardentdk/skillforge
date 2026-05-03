'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

import { Reveal } from '@/components/effects/reveal'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Thomas Lefèvre',
    role: 'Frontend Dev @ Doctolib',
    content: 'J\'ai décroché mon job de rêve grâce à Learnova. Les cours sont à des années-lumière d\'Udemy, vraiment qualitatifs et à jour.',
    rating: 5,
  },
  {
    name: 'Amina Khalil',
    role: 'ML Engineer @ Mistral AI',
    content: 'Le cours sur les LLMs en production est une pépite. Du contenu directement applicable, pas de fluff. Je recommande à 100%.',
    rating: 5,
  },
  {
    name: 'Lucas Bernard',
    role: 'Product Designer @ Alan',
    content: 'Le cours Figma Design Systems m\'a fait gagner 6 mois d\'apprentissage. La pédagogie est exceptionnelle.',
    rating: 5,
  },
  {
    name: 'Sophie Tran',
    role: 'DevOps Engineer @ OVHcloud',
    content: 'Plateforme premium, expérience UX au top, formateurs vraiment experts. C\'est la nouvelle référence en e-learning.',
    rating: 5,
  },
  {
    name: 'Karim Benali',
    role: 'Fullstack Dev @ Qonto',
    content: 'Reconversion réussie en 8 mois. Le suivi communautaire et les projets concrets font toute la différence.',
    rating: 5,
  },
  {
    name: 'Emma Rossi',
    role: 'Tech Lead @ BlaBlaCar',
    content: 'J\'ai formé toute mon équipe sur Learnova. Les certificats sont reconnus et la qualité est constante.',
    rating: 5,
  },
  {
    name: 'Hugo Martin',
    role: 'Cloud Architect @ Datadog',
    content: 'Les cours AWS sont à jour avec les dernières features, ce qui est rare. Et le formateur connaît son sujet à fond.',
    rating: 5,
  },
  {
    name: 'Julie Moreau',
    role: 'Pentester @ Synacktiv',
    content: 'Pour la cybersécurité offensive, c\'est top niveau. Labs interactifs, CTF, mentors disponibles. Game changer.',
    rating: 5,
  },
]

export function Testimonials() {
  // Split testimonials in 2 rows for marquees
  const row1 = TESTIMONIALS.slice(0, 4)
  const row2 = TESTIMONIALS.slice(4, 8)

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative">
        <Reveal>
          <div className="container mx-auto px-4 lg:px-6 text-center max-w-3xl mb-16">
            <Badge variant="primary" className="mb-4">
              Témoignages
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ce qu'en disent nos{' '}
              <span className="text-gradient-emerald">étudiants</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              50,000+ étudiants nous font confiance. Voici leurs retours.
            </p>
          </div>
        </Reveal>

        {/* Marquee Rows */}
        <div className="space-y-6">
          <MarqueeRow testimonials={row1} direction="left" duration={50} />
          <MarqueeRow testimonials={row2} direction="right" duration={60} />
        </div>

        {/* Side fades */}
        <div className="absolute inset-y-0 left-0 w-32 lg:w-64 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-32 lg:w-64 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}

function MarqueeRow({
  testimonials,
  direction,
  duration,
}: {
  testimonials: Testimonial[]
  direction: 'left' | 'right'
  duration: number
}) {
  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex gap-4 lg:gap-6 shrink-0 pr-4 lg:pr-6"
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </motion.div>
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name.split(' ').map(n => n[0]).join('')

  return (
    <div
      className={cn(
        'relative shrink-0 w-[340px] lg:w-[400px] glass rounded-2xl p-6',
        'border border-border hover:border-emerald-500/30 transition-all duration-300',
        'hover:-translate-y-1'
      )}
    >
      <Quote className="absolute top-4 right-4 h-8 w-8 text-emerald-500/20" />

      <div className="flex gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-neon-500 text-neon-500" />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-foreground/90 mb-6 line-clamp-4">
        "{testimonial.content}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Avatar size="md" ring="emerald">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-semibold">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </div>
  )
}