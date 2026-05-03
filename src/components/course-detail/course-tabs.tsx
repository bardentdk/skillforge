'use client'

import { Check, AlertCircle, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/effects/reveal'

interface CourseDescriptionTabProps {
  description?: string | null
  whatYouLearn: string[]
  requirements: string[]
  targetAudience: string[]
}

export function CourseDescriptionTab({
  description,
  whatYouLearn,
  requirements,
  targetAudience,
}: CourseDescriptionTabProps) {
  return (
    <div className="space-y-10">
      {/* What you'll learn */}
      {whatYouLearn.length > 0 && (
        <Reveal>
          <div className="glass-strong rounded-2xl p-6 lg:p-8 border border-emerald-500/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold">Ce que tu vas apprendre</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {whatYouLearn.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="shrink-0 h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-neon-500" strokeWidth={3} />
                  </div>
                  <span className="text-sm leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Description */}
      {description && (
        <Reveal>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold mb-4">Description du cours</h3>
            <div className="prose prose-sm lg:prose-base prose-invert max-w-none text-muted-foreground leading-relaxed">
              {description.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Requirements & Target Audience */}
      <div className="grid md:grid-cols-2 gap-6">
        {requirements.length > 0 && (
          <Reveal>
            <div className="glass rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold">Prérequis</h3>
              </div>
              <ul className="space-y-2">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {targetAudience.length > 0 && (
          <Reveal>
            <div className="glass rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">À qui s'adresse ce cours</h3>
              </div>
              <ul className="space-y-2">
                {targetAudience.map((aud, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {aud}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  )
}