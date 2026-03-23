import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiAward } from 'react-icons/fi'

const certifications = [
  {
    id: 1,
    title: 'BLOCKCHAIN_BASICS',
    issuer: 'CYFRIN_UPDRAFT',
    icon: '⛓️',
    details: ['VERIFIED', 'EVM', 'SMART_CONTRACTS', 'DEFI', 'WALLETS', 'NFTS'],
    color: '#f0ff00'
  },
  {
    id: 2,
    title: 'GEN_AI_MASTERMIND',
    issuer: 'OUTSKILL · MAY_2025',
    icon: '🤖',
    details: ['LLM_ARCH', 'PROMPT_ENG', 'AI_API_BREACH'],
    color: '#ff6b00'
  },
  {
    id: 3,
    title: 'FRONT-END_DEV',
    issuer: 'DUCAT_INST_DELHI · JUL–AUG_2025',
    icon: '💻',
    details: ['HTML5', 'CSS3', 'JS_ES6+', 'RESPONSIVE_DESIGN'],
    color: '#ff2a6d'
  },
  {
    id: 4,
    title: 'TECH_JOB_SIM',
    issuer: 'FORAGE · 2024',
    icon: '🏢',
    details: ['CODING', 'DEV_WORKFLOWS', 'PROFESSIONAL_DELIVERY'],
    color: '#f0ff00'
  }
]

export default function Certifications() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="certifications"
      className="relative min-h-screen w-full flex items-center py-24 bg-[#050810] overflow-hidden"
    >
      {/* Background sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-r from-[#ff6b00] to-transparent" />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title - Busted style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // STATUS: VERIFIED_BREACHES
          </p>
          <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="CREDENTIALS">
            VERIFIED_<span className="text-[#f0ff00]">BREACHES</span>
          </h2>
          <div className="mt-6 w-48 h-2 mx-auto bg-[#f0ff00] skew-x-[-20deg]" />
        </motion.div>

        {/* Horizontal Scroll Container - Busted cards */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, x: 50, rotate: index % 2 === 0 ? 2 : -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05,
                rotate: index % 2 === 0 ? -2 : 2,
                transition: { duration: 0.2 }
              }}
              className="bg-white/5 border-l-8 p-8 md:p-10 skew-x-[-4deg] flex-shrink-0 w-[300px] md:w-[400px] snap-start group relative overflow-hidden"
              style={{
                borderColor: cert.color
              }}
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-6 mb-8 skew-x-[4deg]">
                <span className="text-5xl">{cert.icon}</span>
                <div>
                  <h4 className="text-xl md:text-2xl font-['Space_Grotesk'] font-black italic tracking-tighter uppercase leading-tight" style={{ color: cert.color }}>
                    {cert.title}
                  </h4>
                  <p className="text-white/40 text-[10px] font-black font-['Space_Mono'] uppercase tracking-widest mt-1">{cert.issuer}</p>
                </div>
              </div>

              {/* Details - Skewed tags */}
              <div className="flex flex-wrap gap-2 skew-x-[4deg]">
                {cert.details.map((detail) => (
                  <span
                    key={detail}
                    className="px-3 py-1 text-[10px] font-black font-['Space_Mono'] border-2 uppercase tracking-tighter"
                    style={{ color: cert.color, borderColor: `${cert.color}33` }}
                  >
                    {detail}
                  </span>
                ))}
              </div>

              {/* Award Icon - Busted version */}
              <motion.div
                className="mt-8 flex justify-end skew-x-[4deg]"
                whileHover={{ scale: 1.2, rotate: 20 }}
              >
                <div 
                   className="w-10 h-10 flex items-center justify-center border-2" 
                   style={{ borderColor: cert.color, color: cert.color }}
                >
                   <FiAward size={20} />
                </div>
              </motion.div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
