import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const startTime = Date.now()
        const duration = 2000
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 4)
          element.textContent = Math.floor(eased * target) + suffix
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

const statCards = [
  { number: 323, label: 'LeetCode Problems', suffix: '', color: '#00d9ff' },
  { number: 39, label: 'Hard Problems', suffix: '', color: '#ff2a6d' },
  { number: 100, label: 'Zero-Dispute Trades', suffix: '+', color: '#7b2cbf' },
  { number: 8, label: 'CGPA / 10', suffix: '.49', isDecimal: true, color: '#00d9ff' },
  { number: 1, label: 'IEEE Paper Plagiarism', suffix: '%', color: '#ff2a6d' },
]

const traits = [
  { icon: '⚡', label: 'Builder' },
  { icon: '🔐', label: 'Security Focused' },
  { icon: '🤖', label: 'AI Enthusiast' },
  { icon: '📡', label: 'IoT Hacker' },
  { icon: '📊', label: 'DSA Solver' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  const bioText =
    "Final-year BCA student at IITM Delhi. Cyfrin Updraft-certified blockchain developer. 100+ zero-dispute P2P escrow trades. Building at the intersection of AI and Web3."
  const words = bioText.split(' ')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((word, index) => {
        if (!word) return
        gsap.fromTo(
          word,
          { opacity: 0, y: 30, rotateX: -90 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 90%',
              toggleActions: 'play none none none'
            },
            delay: index * 0.03
          }
        )
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-24 overflow-hidden"
    >
      {/* Background accents */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div
        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(123,44,191,0.07) 0%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-['Space_Mono'] text-cyan-400 tracking-[0.3em] uppercase mb-3">
            // 01. WHO I AM
          </p>
          <h2 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-extrabold">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="mt-4 w-32 h-[2px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio + Traits */}
          <div className="space-y-8">
            {/* Animated bio text */}
            <p className="text-xl md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium leading-relaxed">
              {words.map((word, index) => (
                <span
                  key={index}
                  ref={el => { wordsRef.current[index] = el }}
                  className="inline-block mr-[0.3em] opacity-0"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Trait pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {traits.map((t) => (
                <motion.div
                  key={t.label}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="shimmer glass px-4 py-2 rounded-full flex items-center gap-2 neon-border cursor-default"
                >
                  <span>{t.icon}</span>
                  <span className="text-sm font-['Space_Mono'] text-gray-300">{t.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Info badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: '📍', text: 'Delhi-NCR, India', color: '#00d9ff' },
                { icon: '🎓', text: 'BCA @ IITM Delhi', color: '#7b2cbf' },
                { icon: '⛓️', text: 'Cyfrin Certified', color: '#ff2a6d' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="glass px-4 py-2 rounded-full flex items-center gap-2"
                  style={{ borderColor: `${b.color}33` }}
                >
                  <span>{b.icon}</span>
                  <span className="text-gray-300 text-sm">{b.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Bio paragraphs */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 leading-relaxed"
            >
              This hands-on experience directly translates to my smart contract development — building secure, efficient, and battle-tested code. Combined with AI expertise from the Generative AI Mastermind program, I bring a unique perspective to Web3.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 leading-relaxed"
            >
              When I'm not coding, you'll find me solving algorithmic challenges (64-day max streak on LeetCode!) or exploring the latest in DeFi protocols.
            </motion.p>
          </div>

          {/* Right: Holographic Stat Cards */}
          <div className="relative">
            {/* Glowing backdrop */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0,217,255,0.05), transparent 70%)',
                filter: 'blur(30px)'
              }}
            />
            <div className="grid grid-cols-2 gap-4 md:gap-5 relative">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.06, y: -5 }}
                  className={`holo-card p-5 md:p-7 rounded-2xl text-center hoverable ${index === 4 ? 'col-span-2' : ''}`}
                  style={{
                    borderTop: `2px solid ${stat.color}66`,
                    boxShadow: `0 0 20px ${stat.color}15`
                  }}
                >
                  {/* Accent top line */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-12 rounded-full"
                    style={{ background: stat.color, boxShadow: `0 0 10px ${stat.color}` }}
                  />
                  <p className="stat-number mb-2" style={{ color: stat.color }}>
                    {stat.isDecimal ? '8.49' : (
                      <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="text-xs text-gray-500 font-['Space_Mono'] uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
