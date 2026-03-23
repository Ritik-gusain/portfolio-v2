import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: 1,
    title: 'ESCROW_OPERATIVE',
    subtitle: 'TRUSTED_MIDDLEMAN_PROTOCOL',
    company: 'DISCORD_TRADING_GRID',
    period: '2023 – 2025 · REMOTE_ACCESS',
    points: [
      'SECURED 100+ P2P TRADES. ZERO DISPUTES. ZERO LOSSES.',
      'MIRRORED DEFI SMART CONTRACT MECHANICS IN LIVE MARKETS.',
      'NEUTRALIZING FRAUD THROUGH DEEP-GRID DUE DILIGENCE.'
    ],
    color: '#f0ff00'
  },
  {
    id: 2,
    title: 'COMMUNITY_WIZARD',
    subtitle: 'WEB3_MODERATION_MODULE',
    company: 'MULTI-SERVER_ARRAY · 5,000+ NODES',
    period: '2023 – 2025 · REMOTE_ACCESS',
    points: [
      'MODERATING 5,000+ COMBINED NODES ACROSS THE GRID.',
      'LIVE DATA RESOURCE: WALLETS, DEFI protocols, NFT BREACHES.',
      'COORDINATING COMMUNITY SYSTEM ROLLOUTS.'
    ],
    color: '#ff6b00'
  }
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const line = lineRef.current
    if (!section || !line) return

    const ctx = gsap.context(() => {
      // Animate timeline line - Busted style
      gsap.fromTo(
        line,
        { scaleY: 0, backgroundColor: '#f0ff00' },
        {
          scaleY: 1,
          backgroundColor: '#ff2a6d',
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-24 bg-[#050810] overflow-hidden"
    >
      {/* Background sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-[#f0ff00] to-transparent" />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title - Busted style */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center md:text-left"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // STATUS: EXPERIENCE_LOG
          </p>
          <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="TIMELINE_BREACH">
            TIMELINE_<span className="text-[#f0ff00]">BREACH</span>
          </h2>
          <div className="mt-4 w-64 h-2 bg-[#f0ff00] skew-x-[-20deg] mx-auto md:ml-0" />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line - Heavy & Animated */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-2 origin-top transform md:-translate-x-1/2 skew-x-[-20deg] opacity-20"
          />

          {/* Experience Entries */}
          <div className="space-y-32">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, scale: 0.8, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Box - Skewed */}
                <motion.div
                  className="absolute left-4 md:left-1/2 top-0 w-12 h-12 bg-white text-black flex items-center justify-center transform -translate-x-1/2 z-10 skew-x-[-12deg] font-black italic"
                  style={{ backgroundColor: exp.color, boxShadow: `0 0 30px ${exp.color}66` }}
                  initial={{ rotate: -45, scale: 0 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="skew-x-[12deg]">{exp.id}</span>
                </motion.div>

                {/* Content Card - Aggressive design */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? -1 : 1 }}
                    className="bg-white/5 border-l-8 p-8 md:p-10 skew-x-[-4deg] group relative overflow-hidden"
                    style={{ borderColor: exp.color }}
                  >
                    {/* Header */}
                    <div className={`flex flex-col mb-6 skew-x-[4deg] ${
                      index % 2 === 0 ? 'md:items-end' : 'md:items-start'
                    }`}>
                      <h4 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-black italic tracking-tighter uppercase" style={{ color: exp.color }}>
                        {exp.title}
                      </h4>
                      <p className="text-white font-black font-['Space_Mono'] uppercase tracking-widest text-xs opacity-60">
                        {exp.subtitle}
                      </p>
                    </div>

                    <div className={`mb-6 skew-x-[4deg] ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      <p className="text-white/40 text-xs font-black font-['Space_Mono'] uppercase tracking-widest">{exp.company}</p>
                      <p className="text-white/20 text-[10px] font-black font-['Space_Mono'] mt-1">{exp.period}</p>
                    </div>

                    {/* Points - Busted style */}
                    <ul className={`space-y-4 skew-x-[4deg] ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.points.map((point, pointIndex) => (
                        <motion.li
                          key={pointIndex}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + pointIndex * 0.05 }}
                          className={`flex items-start gap-4 font-black font-['Space_Mono'] italic text-sm ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <span className="w-2 h-2 bg-white mt-1.5 flex-shrink-0 skew-x-[-20deg]" style={{ backgroundColor: exp.color }} />
                          <span className="text-white/80 leading-tight uppercase">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
