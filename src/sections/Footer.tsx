import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiCode, FiMail } from 'react-icons/fi'

const footerLinks = [
  { icon: FiGithub,   href: 'https://github.com/Ritik-gusain',                    label: 'GitHub' },
  { icon: FiLinkedin, href: 'https://linkedin.com/in/ritik-gusain-7640a9334',     label: 'LinkedIn' },
  { icon: FiTwitter,  href: 'https://x.com',                                      label: 'X' },
  { icon: FiCode,     href: 'https://leetcode.com/u/munnigusain29684',            label: 'LeetCode' },
  { icon: FiMail,     href: 'mailto:munnigusain29684@gmail.com',                  label: 'Email' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full py-12 overflow-hidden">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      {/* Subtle glow behind */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(0,217,255,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      <div className="relative w-full px-6 lg:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo mark */}
          <div className="text-3xl font-extrabold gradient-text font-['Space_Grotesk']" style={{ letterSpacing: '-0.04em' }}>
            RG
          </div>

          {/* Social icons row */}
          <div className="flex items-center gap-5">
            {footerLinks.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.15 }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors duration-200 hoverable"
                style={{ borderColor: 'rgba(0,217,255,0.1)' }}
              >
                <l.icon size={16} />
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-cyan-400/30 via-white/10 to-pink-500/30" />

          {/* Caption */}
          <p className="text-xs text-gray-600 font-['Space_Mono'] text-center leading-loose">
            crafted by{' '}
            <span className="text-gray-400">Ritik Gusain</span>
            {' '}·{' '}React × Three.js × GSAP × Framer Motion{' '}
            <span className="text-pink-500">♥</span>
            {' '}· {currentYear}
          </p>

          <p className="text-[10px] text-gray-700 font-['Space_Mono'] tracking-widest uppercase">
            ∞ built different
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
