import { Hero } from '@/components/sections/hero'
import { LogoCloud } from '@/components/sections/logo-cloud'
import { CategoriesGrid } from '@/components/sections/categories-grid'
import { BentoCatalog } from '@/components/sections/bento-catalog'
import { FeaturedInstructors } from '@/components/sections/featured-instructors'
import { Stats } from '@/components/sections/stats'
import { Testimonials } from '@/components/sections/testimonials'
import { CTAFinal } from '@/components/sections/cta-final'

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <CategoriesGrid />
      <BentoCatalog />
      <FeaturedInstructors />
      <Stats />
      <Testimonials />
      <CTAFinal />
    </>
  )
}