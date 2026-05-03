'use client'

import Link from 'next/link'
import { Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei'
import { ArrowRight, Sparkles, Zap, Star, Users, BookOpen } from 'lucide-react'
import * as THREE from 'three'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Magnetic } from '@/components/effects/magnetic'
import { ROUTES } from '@/lib/constants'

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.15
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.2
    // Subtle mouse parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 0.3, 0.05)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 0.3, 0.05)
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.4, 128, 128]}>
        <MeshDistortMaterial
          color="#00674F"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0.1}
          metalness={0.85}
          emissive="#00FFB2"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </Float>
  )
}

function OrbitParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const radius = 2.8 + (i % 3) * 0.3
        const y = Math.sin(i * 0.5) * 0.5
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color="#00FFB2"
              emissive="#00FFB2"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#00FFB2" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#00674F" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#ffffff" />

      <AnimatedSphere />
      <OrbitParticles />

      <Stars
        radius={50}
        depth={50}
        count={1500}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center pt-20 lg:pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] animate-aurora pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-500/10 rounded-full blur-[150px] animate-aurora pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />

      <div className="relative container mx-auto px-4 lg:px-6 grid lg:grid-cols-2 gap-12 items-center py-12 lg:py-0">
        {/* LEFT: Content */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="glass"
              icon={<Sparkles className="h-3 w-3 text-neon-500" />}
              className="mb-6"
              pulse
            >
              La plateforme e-learning nouvelle génération
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
          >
            <span className="block">Master</span>
            <span className="block text-gradient-emerald">Tech & Digital</span>
            <span className="block text-foreground/90">Built for 2026.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg lg:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed"
          >
            Apprends auprès des meilleurs experts. Cours immersifs, projets concrets,
            certifications reconnues.{' '}
            <span className="text-emerald-400 font-medium">Lance ta carrière tech.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Magnetic strength={0.2}>
              <Link href={ROUTES.catalog}>
                <Button
                  variant="gradient"
                  size="xl"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Explorer le catalogue
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
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 lg:gap-8 text-sm"
          >
            <div className="flex items-center gap-2">
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
              <div>
                <div className="font-semibold text-foreground">50K+</div>
                <div className="text-xs text-muted-foreground">étudiants</div>
              </div>
            </div>

            <div className="h-10 w-px bg-border" />

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-neon-500 text-neon-500" />
                ))}
              </div>
              <div>
                <div className="font-semibold text-foreground">4.9/5</div>
                <div className="text-xs text-muted-foreground">de satisfaction</div>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold text-foreground">500+</div>
                <div className="text-xs text-muted-foreground">cours premium</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: 3D Scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative order-1 lg:order-2 h-[400px] lg:h-[600px]"
        >
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
          </div>

          {/* Floating cards (decorative) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-12 left-4 lg:left-0 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
          >
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Live now</div>
              <div className="text-sm font-semibold">1,247 students</div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-16 right-4 lg:right-0 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
          >
            <div className="h-8 w-8 rounded-lg bg-neon-500/20 flex items-center justify-center">
              <Star className="h-4 w-4 fill-neon-500 text-neon-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">New course</div>
              <div className="text-sm font-semibold">Next.js 15 Mastery</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-xs text-muted-foreground"
      >
        <span className="uppercase tracking-widest">Scroll</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-emerald-500 to-transparent">
          <motion.div
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-[1px] bg-neon-500"
          />
        </div>
      </motion.div>
    </section>
  )
}