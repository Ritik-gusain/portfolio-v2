import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: 1,
    title: 'Trusted Middleman',
    subtitle: 'Escrow Agent',
    company: 'Dedicated Discord Trading Server',
    period: '2023 – 2025 · Remote',
    points: [
      'Facilitated 100+ P2P trades, zero disputes, zero losses',
      'Secured assets and verified dual-side delivery — mirrors DeFi smart contract escrow mechanics',
      'Pre-trade due diligence: reputation checks, fraud detection'
    ]
  },
  {
    id: 2,
    title: 'Community Moderator',
    subtitle: 'Web3 & Gaming',
    company: 'Multi-Server Discord · 5,000+ Members',
    period: '2023 – 2025 · Remote',
    points: [
      'Moderated 5 servers, 5,000+ combined members',
      'Live Web3 knowledge resource: wallets, DeFi, NFTs',
      'Coordinated policy rollouts and community events'
    ]
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
      // Animate timeline line
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
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
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Experience
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Space_Grotesk'] font-bold">
            Work <span className="gradient-text">History</span>
          </h3>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 origin-top transform md:-translate-x-1/2"
            style={{ transform: 'scaleY(0)' }}
          />

          {/* Experience Entries */}
          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full bg-cyan-400 transform -translate-x-1/2 z-10"
                  style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3, type: 'spring' }}
                />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 md:p-8 rounded-2xl hoverable"
                  >
                    {/* Header */}
                    <div className={`flex flex-col mb-4 ${
                      index % 2 === 0 ? 'md:items-end' : 'md:items-start'
                    }`}>
                      <h4 className="text-xl md:text-2xl font-['Space_Grotesk'] font-bold">
                        {exp.title}
                      </h4>
                      <p className="text-cyan-400 font-medium">
                        {exp.subtitle}
                      </p>
                    </div>

                    <div className={`mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      <p className="text-gray-400 text-sm">{exp.company}</p>
                      <p className="text-gray-500 text-xs">{exp.period}</p>
                    </div>

                    {/* Points */}
                    <ul className={`space-y-3 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.points.map((point, pointIndex) => (
                        <motion.li
                          key={pointIndex}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + pointIndex * 0.1 }}
                          className={`flex items-start gap-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                          <span className="text-gray-300 leading-relaxed text-sm">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
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
