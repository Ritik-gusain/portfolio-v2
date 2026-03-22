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
    <span className="typewriter text-cyan-400">
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = Date.now()
          const duration = 2500
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(eased * target))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

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
      // Parallax effect on scroll
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

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 217, 255, 0.1) 0%, transparent 60%)'
        }}
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
            className="parallax-element flex items-center gap-3 px-5 py-2.5 rounded-full glass"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-400">Available for opportunities</span>
          </motion.div>

          {/* Name */}
          <div className="parallax-element">
            <motion.h1 
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="gradient-text">RITIK</span>
            </motion.h1>
            <motion.h1 
              className="font-['Space_Grotesk'] font-extrabold leading-[0.85] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="gradient-text">GUSAIN</span>
            </motion.h1>
          </div>

          {/* Typewriter */}
          <motion.div 
            className="parallax-element h-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-medium">
              <Typewriter 
                texts={[
                  'Blockchain Developer',
                  'AI Engineer',
                  'Smart Contract Security'
                ]} 
              />
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="parallax-element grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="text-center md:text-left">
              <p className="stat-number gradient-text">
                <AnimatedCounter target={323} />
              </p>
              <p className="text-sm text-gray-400 mt-1">LeetCode</p>
            </div>
            <div className="text-center md:text-left">
              <p className="stat-number gradient-text">
                <AnimatedCounter target={39} />
              </p>
              <p className="text-sm text-gray-400 mt-1">Hard</p>
            </div>
            <div className="text-center md:text-left">
              <p className="stat-number gradient-text">
                <AnimatedCounter target={100} suffix="+" />
              </p>
              <p className="text-sm text-gray-400 mt-1">Trades</p>
            </div>
            <div className="text-center md:text-left">
              <p className="stat-number gradient-text">8.49</p>
              <p className="text-sm text-gray-400 mt-1">CGPA</p>
            </div>
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
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 217, 255, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
              <span>→</span>
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
        </div>

        {/* Right Content — Cinematic Quantum Node (Three.js) */}
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
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border border-gray-600 flex items-start justify-center p-2"
        >
          <motion.div 
            className="w-1 h-2 bg-cyan-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
