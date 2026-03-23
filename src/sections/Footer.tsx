import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiCode, FiMail } from 'react-icons/fi'

const footerLinks = [
  { icon: FiGithub,   href: 'https://github.com/Ritik-gusain',                    label: 'GITHUB' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/ritik-gusain-7640a9334',     label: 'LINKEDIN' },
  { icon: FiTwitter,  href: 'https://x.com',                                      label: 'X_CORP' },
  { icon: FiCode,     href: 'https://leetcode.com/u/munnigusain29684',            label: 'LEETCODE' },
  { icon: FiMail,     href: 'mailto:munnigusain29684@gmail.com',                  label: 'EMAIL' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-24 bg-[#050810] overflow-hidden">
      {/* Top divider - Busted style */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
      <div className="absolute top-0 left-1/4 w-1/2 h-2 bg-[#f0ff00] skew-x-[-45deg] -translate-y-1/2" />

      <div className="relative w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-12">
          
          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#f0ff00] px-8 py-2 skew-x-[-12deg]">
               <span className="text-4xl font-black font-['Space_Grotesk'] text-black italic skew-x-[12deg] inline-block tracking-tighter">
                  VIBE_CODER
               </span>
            </div>
            <div className="absolute -inset-2 border-2 border-[#f0ff00] skew-x-[-12deg] -z-10 animate-pulse" />
          </motion.div>

          {/* Social Row */}
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, color: '#f0ff00' }}
                className="flex items-center gap-2 text-white/40 font-black font-['Space_Mono'] text-xs tracking-widest transition-colors"
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Credits Grid */}
          <div className="w-full grid md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
             <div className="text-center md:text-left space-y-2">
                <p className="text-[10px] font-black font-['Space_Mono'] text-[#f0ff00] uppercase tracking-[0.3em]">_ENGINEERED_BY</p>
                <p className="text-white font-black font-['Space_Grotesk'] italic uppercase tracking-tighter text-xl">RITIK_GUSAIN</p>
             </div>
             
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black font-['Space_Mono'] text-[#ff6b00] uppercase tracking-[0.3em]">_CORE_STACK</p>
                <p className="text-white/60 font-black font-['Space_Mono'] text-[10px] uppercase">REACT // GSAP // FRAMER_MOTION // THREE.JS</p>
             </div>

             <div className="text-center md:text-right space-y-2">
                <p className="text-[10px] font-black font-['Space_Mono'] text-[#ff2a6d] uppercase tracking-[0.3em]">_SYSTEM_REF</p>
                <p className="text-white/60 font-black font-['Space_Mono'] text-[10px] uppercase">© {currentYear} // ALL_RIGHTS_RESERVED</p>
             </div>
          </div>

          {/* Final Message */}
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] font-black font-['Space_Mono'] text-white/10 tracking-[1em] uppercase"
          >
            BE_THE_CHAOS_YOU_WISH_TO_SEE_IN_THE_CODE
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
