import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import QuantumHero from '../components/QuantumHero'

gsap.registerPlugin(ScrollTrigger)

// Typewriter Component
function Typewriter({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 40 : 100)
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, texts])

  return (
    <span className="typewriter" style={{ color: '#00d9ff' }}>
      {displayText}
    </span>
  )
}

// Animated Counter
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const startTime = Date.now()
        const duration = 2500
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return
    const ctx = gsap.context(() => {
      gsap.to(content.querySelectorAll('.parallax-element'), {
        y: (i) => (i + 1) * -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  // Particles data
  const particles = Array.from({ length: 18 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 20}%`,
    animationDuration: `${6 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 8}s`,
    opacity: Math.random() * 0.6 + 0.3,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    background: i % 3 === 0 ? '#ff2a6d' : i % 3 === 1 ? '#7b2cbf' : '#00d9ff',
    boxShadow: i % 3 === 0
      ? '0 0 8px #ff2a6d'
      : i % 3 === 1
      ? '0 0 8px #7b2cbf'
      : '0 0 8px #00d9ff',
  }))

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Aurora radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,217,255,0.13) 0%, transparent 60%)'
        }}
      />

      {/* Floating mini particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.width,
            height: p.height,
            background: p.background,
            boxShadow: p.boxShadow,
            opacity: p.opacity,
            animationName: 'float-up',
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}

      {/* Horizontal accent lines */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '30%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,217,255,0.08), transparent)' }}
      />
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{ top: '70%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,42,109,0.06), transparent)' }}
      />

      <div
        ref={contentRef}
        className="w-full px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto"
      >
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start gap-8 z-10">
          {/* Open to Work Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="parallax-element shimmer flex items-center gap-3 px-5 py-2.5 rounded-full glass"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-400 font-['Space_Mono']">Available for opportunities</span>
          </motion.div>

          {/* Name with letter glow */}
          <div className="parallax-element">
            <motion.h1
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="gradient-text" style={{ textShadow: '0 0 80px rgba(0,217,255,0.25)' }}>RITIK</span>
            </motion.h1>
            <motion.h1
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="gradient-text" style={{ textShadow: '0 0 80px rgba(255,42,109,0.2)' }}>GUSAIN</span>
            </motion.h1>
          </div>

          {/* Typewriter */}
          <motion.div
            className="parallax-element h-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-medium font-['Space_Mono']">
              <Typewriter
                texts={[
                  'Blockchain Developer',
                  'AI Engineer',
                  'Smart Contract Security',
                  'IoT Hacker',
                  'Open Source Builder'
                ]}
              />
            </p>
          </motion.div>

          {/* Stats — neon cards */}
          <motion.div
            className="parallax-element grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {[
              { value: <AnimatedCounter target={323} />, label: 'LeetCode', color: '#00d9ff' },
              { value: <AnimatedCounter target={39} />, label: 'Hard', color: '#ff2a6d' },
              { value: <><AnimatedCounter target={100} />+</>, label: 'Trades', color: '#7b2cbf' },
              { value: '8.49', label: 'CGPA', color: '#00d9ff' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass rounded-2xl p-4 text-center neon-border"
                style={{ borderLeft: `2px solid ${s.color}44` }}
              >
                <p className="text-2xl md:text-3xl font-['Space_Grotesk'] font-extrabold" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-['Space_Mono'] uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="parallax-element flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <motion.button
              onClick={scrollToProjects}
              className="btn-primary flex items-center gap-2 hoverable"
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0, 217, 255, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
              <span style={{ fontSize: '1.1em' }}>→</span>
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              className="btn-outline hoverable"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.button>
          </motion.div>

          {/* Tech strip */}
          <motion.div
            className="parallax-element flex gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            {['Solidity', 'React', 'Python', 'Web3', 'GSAP', 'ESP32'].map((t) => (
              <span
                key={t}
                className="text-xs font-['Space_Mono'] text-gray-500 uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Content — Quantum Node */}
        <motion.div
          className="flex-1 flex items-center justify-center parallax-element"
          style={{ minHeight: '440px', height: '55vw', maxHeight: '680px' }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <QuantumHero />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 uppercase tracking-widest font-['Space_Mono']">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border border-gray-700 flex items-start justify-center p-2"
        >
          <motion.div
            className="w-1 h-2 bg-cyan-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
