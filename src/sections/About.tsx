import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

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
        const duration = 2000
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


const statCards = [
  { number: 323, label: 'LeetCode Problems', suffix: '', color: '#f0ff00' },
  { number: 39, label: 'Hard Problems', suffix: '', color: '#ff6b00' },
  { number: 100, label: 'Zero-Dispute Trades', suffix: '+', color: '#ff2a6d' },
  { number: 8, label: 'CGPA / 10', suffix: '.49', isDecimal: true, color: '#f0ff00' },
  { number: 1, label: 'IEEE Paper Plagiarism', suffix: '%', color: '#ff6b00' },
]

const traits = [
  { icon: '⚡', label: 'CHAOS BUILDER' },
  { icon: '🌊', label: 'VIBE CODER' },
  { icon: '🔐', label: 'VULNERABILITY HUNTER' },
  { icon: '🤖', label: 'AI DESTROYER' },
  { icon: '📡', label: 'SIGNAL JAMMER' },
  { icon: '📊', label: 'DATA BREACHER' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  const bioText =
    "Final-year BCA student at IITM Delhi. Cyfrin Updraft-certified blockchain developer. 100+ zero-dispute P2P escrow trades. Building at the intersection of AI and Web3. I code for the vibe, I build for the chaos."
  const words = bioText.split(' ')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((word, index) => {
        if (!word) return
        gsap.fromTo(
          word,
          { opacity: 0, x: -20, skewX: 20 },
          {
            opacity: 1, x: 0, skewX: 0,
            duration: 0.4, ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: word,
              start: 'top 95%',
              toggleActions: 'play none none none'
            },
            delay: index * 0.02
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
      className="relative min-h-screen w-full flex items-center py-24 overflow-hidden bg-[#050810]"
    >
      {/* Background accents - more aggressive */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, #ff6b00 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #f0ff00 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // STATUS: IDENTITY_REPORT
          </p>
          <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="CORE_PROFILE">
            CORE_<span className="text-[#f0ff00]">PROFILE</span>
          </h2>
          <div className="mt-4 w-64 h-4 bg-[#f0ff00] skew-x-[-20deg]" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio + Traits */}
          <div className="space-y-12">
            {/* Animated bio text with background box */}
            <div className="p-8 bg-white/5 border-l-8 border-[#f0ff00] skew-x-[-4deg] relative group">
              <div className="absolute top-0 right-0 p-2 text-[10px] font-['Space_Mono'] text-[#f0ff00]/40">LOG_v0.4.2</div>
              <p className="text-xl md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-black leading-none skew-x-[4deg]">
                {words.map((word, index) => (
                  <span
                    key={index}
                    ref={el => { wordsRef.current[index] = el }}
                    className="inline-block mr-[0.3em] opacity-0"
                  >
                    {word}
                  </span>
                ))}
              </p>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-r-4 border-b-4 border-[#ff6b00] -z-10" />
            </div>

            {/* Trait pills - skewed and high contrast */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              {traits.map((t) => (
                <motion.div
                  key={t.label}
                  whileHover={{ scale: 1.1, rotate: 2, backgroundColor: '#f0ff00', color: '#000' }}
                  className={`bg-white text-black px-6 py-2 flex items-center gap-3 font-black font-['Space_Mono'] skew-x-[-12deg] cursor-none transition-colors duration-200 ${t.label === 'VIBE CODER' ? 'bg-[#f0ff00]' : ''}`}
                >
                  <span className="skew-x-[12deg]">{t.icon}</span>
                  <span className="text-sm skew-x-[12deg]">{t.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Info badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-6"
            >
              {[
                { icon: '📍', text: 'DELHI-NCR_GRID', color: '#f0ff00' },
                { icon: '🎓', text: 'BCA@IITM_PROTO', color: '#ff6b00' },
                { icon: '⛓️', text: 'CYFRIN_HARDENED', color: '#ff2a6d' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-3 border-b-4 font-['Space_Mono'] font-black tracking-tighter py-1"
                  style={{ borderColor: b.color, color: b.color }}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-sm uppercase italic">{b.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Busted Stat Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6 relative">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? 5 : -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? 2 : -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  className={`relative p-6 border-4 border-white/10 group overflow-hidden ${index === 4 ? 'col-span-2' : ''}`}
                >
                  {/* Decorative background number */}
                  <div className="absolute -right-4 -bottom-8 text-8xl font-black text-white/5 pointer-events-none select-none italic">
                    {index + 1}
                  </div>
                  
                  <div 
                    className="absolute top-0 left-0 w-full h-1" 
                    style={{ background: stat.color }}
                  />
                  <p className="text-4xl md:text-6xl font-['Space_Grotesk'] font-black italic tracking-tighter" style={{ color: stat.color }}>
                    {stat.isDecimal ? '8.49' : (
                      <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="text-[10px] text-white font-['Space_Mono'] uppercase font-black mt-2 tracking-[0.3em]">{stat.label}</p>
                  
                  {/* Hover effect - background shift */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" 
                    style={{ background: stat.color }}
                  />
                  {/* Glitch lines on card */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.div>
              ))}
            </div>
            {/* Extra decorative element */}
            <div className="absolute -bottom-10 -left-10 w-20 h-20 border-4 border-[#f0ff00] skew-x-[-20deg] opacity-20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
