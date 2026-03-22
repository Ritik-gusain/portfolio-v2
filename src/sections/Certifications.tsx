import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'

const certifications = [
  {
    id: 1,
    title: 'Blockchain Basics',
    issuer: 'Cyfrin Updraft',
    icon: '⛓️',
    details: ['Verified', 'EVM', 'Smart Contracts', 'DeFi', 'Wallets', 'NFTs'],
    color: '#00d9ff'
  },
  {
    id: 2,
    title: 'Generative AI Mastermind',
    issuer: 'Outskill · May 2025',
    icon: '🤖',
    details: ['LLM Architecture', 'Prompt Engineering', 'AI API Integration'],
    color: '#7b2cbf'
  },
  {
    id: 3,
    title: 'Front-End Development',
    issuer: 'DUCAT Institute Delhi · Jul–Aug 2025',
    icon: '💻',
    details: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design'],
    color: '#ff2a6d'
  },
  {
    id: 4,
    title: 'Technology Job Simulation',
    issuer: 'Forage · 2024',
    icon: '🏢',
    details: ['Coding', 'Dev Workflows', 'Professional Delivery'],
    color: '#00d9ff'
  }
]

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="certifications"
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Certifications
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Space_Grotesk'] font-bold">
            Verified <span className="gradient-text">Credentials</span>
          </h3>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
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
                y: -10,
                transition: { duration: 0.2 }
              }}
              className="glass-card p-6 md:p-8 rounded-2xl flex-shrink-0 w-[300px] md:w-[350px] snap-start hoverable"
              style={{
                borderTop: `4px solid ${cert.color}`
              }}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{cert.icon}</span>
                <div>
                  <h4 className="text-lg md:text-xl font-['Space_Grotesk'] font-bold leading-tight">
                    {cert.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">{cert.issuer}</p>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap gap-2">
                {cert.details.map((detail) => (
                  <span
                    key={detail}
                    className="px-3 py-1 text-xs rounded-full glass"
                    style={{ color: cert.color }}
                  >
                    {detail}
                  </span>
                ))}
              </div>

              {/* Award Icon */}
              <motion.div
                className="mt-4 flex justify-end"
                whileHover={{ scale: 1.2, rotate: 10 }}
              >
                <FiAward 
                  className="transition-colors cursor-pointer" 
                  style={{ color: cert.color }}
                  size={20}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-4 md:hidden"
        >
          ← Swipe to see more →
        </motion.p>
      </div>
    </section>
  )
}
