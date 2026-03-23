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
    <span className="typewriter" style={{ color: '#f0ff00', textShadow: '0 0 10px #f0ff0066' }}>
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

  // Particles data - more aggressive colors
  const particles = Array.from({ length: 24 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 20}%`,
    animationDuration: `${2 + Math.random() * 4}s`, // Faster
    animationDelay: `${Math.random() * 2}s`,
    opacity: Math.random() * 0.8 + 0.2,
    width: `${2 + Math.random() * 6}px`,
    height: `${2 + Math.random() * 6}px`,
    background: i % 3 === 0 ? '#ff6b00' : i % 3 === 1 ? '#f0ff00' : '#ff2a6d',
    boxShadow: i % 3 === 0
      ? '0 0 12px #ff6b00'
      : i % 3 === 1
      ? '0 0 12px #f0ff00'
      : '0 0 12px #ff2a6d',
  }))

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050810]"
    >
      {/* Busted Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-20 circle-scanlines" />

      {/* Aurora radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,107,0,0.1) 0%, transparent 70%)'
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
            animationTimingFunction: 'ease-out',
          }}
        />
      ))}

      <div
        ref={contentRef}
        className="w-full px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto"
      >
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-start gap-8 z-30">
          {/* Busted Badge */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="parallax-element flex items-center gap-3 px-6 py-2 bg-[#f0ff00] skew-x-[-12deg]"
          >
            <span className="text-sm font-black text-black font-['Space_Mono'] uppercase italic">System: Overloaded</span>
          </motion.div>

          {/* Name with glitch */}
          <div className="parallax-element">
            <motion.h1
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tighter glitch-text"
              data-text="RITIK"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', damping: 10 }}
            >
              <span className="text-[#f0ff00]">RITIK</span>
            </motion.h1>
            <motion.h1
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tighter glitch-text"
              data-text="GUSAIN"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: 'spring', damping: 10 }}
            >
              <span className="text-white">GUSAIN</span>
            </motion.h1>
          </div>

          {/* Typewriter */}
          <motion.div
            className="parallax-element h-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-black font-['Space_Mono'] italic">
              <Typewriter
                texts={[
                  'VIBE CODER',
                  'ENGINEERING CHAOS',
                  'BREAKING PROTOCOLS',
                  'QUANTUM EXPLOSION',
                  'WEB3 DISRUPTOR',
                  'AI ARCHITECT'
                ]}
              />
            </p>
          </motion.div>

          {/* Stats — neon cards */}
          <motion.div
            className="parallax-element grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { value: <AnimatedCounter target={323} />, label: 'LeetCode', color: '#f0ff00' },
              { value: <AnimatedCounter target={39} />, label: 'Hard', color: '#ff6b00' },
              { value: <><AnimatedCounter target={100} />+</>, label: 'Trades', color: '#ff2a6d' },
              { value: '8.49', label: 'CGPA', color: '#f0ff00' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? 2 : -2 }}
                className="bg-white/5 border-2 border-white/10 p-4 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-current" style={{ color: s.color }} />
                <p className="text-2xl md:text-3xl font-['Space_Grotesk'] font-black" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-[10px] text-white/40 mt-1 font-['Space_Mono'] uppercase tracking-[0.2em]">{s.label}</p>
                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-current opacity-0 group-hover:opacity-10 transition-opacity rotate-45" style={{ color: s.color }} />
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="parallax-element flex flex-wrap gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              onClick={scrollToProjects}
              className="px-8 py-4 bg-[#f0ff00] text-black font-black uppercase tracking-widest hover:bg-white transition-colors skew-x-[-12deg] relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="skew-x-[12deg] inline-block">Ignite Projects</span>
              <div className="absolute inset-0 border-2 border-[#f0ff00] translate-x-2 translate-y-2 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            </motion.button>
            <motion.button
              onClick={scrollToContact}
              className="px-8 py-4 border-2 border-white text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors skew-x-[-12deg]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="skew-x-[12deg] inline-block">Join the Blast</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right Content — Explosion Node */}
        <motion.div
          className="flex-1 flex items-center justify-center parallax-element z-10"
          style={{ minHeight: '440px', height: '55vw', maxHeight: '680px' }}
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
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
        <span className="text-xs text-white/40 uppercase tracking-widest font-['Space_Mono']">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/20 flex items-start justify-center p-2 skew-x-[-12deg]"
        >
          <motion.div
            className="w-1 h-2 bg-[#f0ff00] shadow-[0_0_10px_#f0ff00]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(-100vh) scale(0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
