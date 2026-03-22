import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

// Counter Animation
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
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
          const duration = 2000
          
          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            element.textContent = Math.floor(eased * target) + suffix
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
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])

  const bioText = "Final-year BCA student at IITM Delhi. Cyfrin Updraft-certified blockchain developer. 100+ zero-dispute P2P escrow trades. Building at the intersection of AI and Web3."
  const words = bioText.split(' ')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Animate each word with stagger
      wordsRef.current.forEach((word, index) => {
        if (!word) return
        
        gsap.fromTo(
          word,
          { opacity: 0, y: 30, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power3.out',
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

  const statCards = [
    { number: 323, label: 'LeetCode Problems', suffix: '' },
    { number: 39, label: 'Hard Problems', suffix: '' },
    { number: 100, label: 'Zero-Dispute Trades', suffix: '+' },
    { number: 8.49, label: 'CGPA / 10', suffix: '', isDecimal: true },
    { number: 1, label: 'IEEE Paper Plagiarism', suffix: '%', isIEEE: true },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-500" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Bio Text */}
          <div className="space-y-8">
            <p className="text-2xl md:text-3xl lg:text-4xl font-['Space_Grotesk'] font-medium leading-relaxed">
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

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-cyan-400">📍</span>
                <span className="text-gray-300 text-sm">Delhi-NCR, India</span>
              </div>
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-cyan-400">🎓</span>
                <span className="text-gray-300 text-sm">BCA @ IITM Delhi</span>
              </div>
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-cyan-400">⛓️</span>
                <span className="text-gray-300 text-sm">Cyfrin Certified</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 leading-relaxed"
            >
              This hands-on experience directly translates to my smart contract development approach—building secure, efficient, and battle-tested code. Combined with my AI expertise from the Generative AI Mastermind program, I bring a unique perspective to Web3 development.
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

          {/* Right: Stat Cards — 2+3 grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`glass-card p-5 md:p-7 rounded-2xl text-center hoverable ${index === 4 ? 'col-span-2' : ''}`}
              >
                <p className="stat-number gradient-text mb-2">
                  {stat.isDecimal ? (
                    <span>8.49</span>
                  ) : stat.isIEEE ? (
                    <span>1%</span>
                  ) : (
                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                  )}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
