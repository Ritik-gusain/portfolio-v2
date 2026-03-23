import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { id: 'about',      label: 'ABOUT',      num: '01' },
  { id: 'skills',     label: 'SKILLS',     num: '02' },
  { id: 'projects',   label: 'PROJECTS',   num: '03' },
  { id: 'experience', label: 'EXPERIENCE', num: '04' },
  { id: 'contact',    label: 'CONTACT',    num: '05' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled]         = useState(false)
  const [isMobileMenuOpen, setMobileMenu]   = useState(false)
  const [activeSection, setActiveSection]   = useState('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  /* ── scroll detection ───────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── active section via IntersectionObserver ────────────────────── */
  useEffect(() => {
    const ids = ['hero', ...navLinks.map(l => l.id)]
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenu(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 border-b-2 border-[#f0ff00]/20 bg-[#050810]/80 backdrop-blur-xl'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between max-w-[1600px] mx-auto">

          {/* Logo - Vibe Coder Branding */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-[#f0ff00] px-4 py-1 skew-x-[-12deg] group"
          >
            <span
              className="text-xl font-black font-['Space_Grotesk'] text-black italic skew-x-[12deg] inline-block tracking-tighter"
            >
              VIBE_CODER
            </span>
            <div className="absolute inset-0 border-2 border-[#f0ff00] translate-x-1 translate-y-1 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => {
              const isActive = activeSection === link.id
              return (
                <motion.button
                  key={link.id}
                  onClick={() => go(link.id)}
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="relative group font-black font-['Space_Mono'] uppercase italic tracking-tighter"
                  style={{ color: isActive ? '#f0ff00' : '#ffffff' }}
                >
                  <span className="relative flex items-center gap-2">
                    <span className="text-[10px] opacity-40 font-black">{link.num}</span>
                    <span className="text-sm tracking-widest">{link.label}</span>
                  </span>
                  {/* Underline pulse */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-current transition-all duration-300 ${isActive ? 'w-full shadow-[0_0_10px_currentColor]' : 'w-0 group-hover:w-full'}`}
                  />
                </motion.button>
              )
            })}
          </div>

          {/* Hire Me CTA - Breach Protocol */}
          <motion.button
            onClick={() => go('contact')}
            className="hidden md:flex items-center gap-3 px-6 py-2 bg-white text-black font-black text-sm skew-x-[-12deg] relative group"
            whileHover={{ scale: 1.05, backgroundColor: '#f0ff00' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative flex h-2 w-2 skew-x-[12deg]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
            <span className="skew-x-[12deg] tracking-widest">BREACH_PROTOCOL</span>
            <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 -z-10 group-hover:border-[#f0ff00] transition-colors" />
          </motion.button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenu(!isMobileMenuOpen)}
            className="md:hidden p-2 z-50 flex flex-col gap-1.5"
            aria-label="Menu"
          >
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-8 h-1 bg-[#f0ff00] block skew-x-[-12deg]"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-8 h-1 bg-white block skew-x-[-12deg]"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-8 h-1 bg-[#ff2a6d] block skew-x-[-12deg]"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center p-12"
            style={{ background: '#050810' }}
          >
            {/* BG Grid decoration */}
            <div className="absolute inset-0 opacity-10 nvg8-grid pointer-events-none" />
            
            <div className="flex flex-col items-center gap-8 w-full relative z-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => go(link.id)}
                  className="flex flex-col items-center group"
                >
                  <span className="text-xs font-['Space_Mono'] text-[#f0ff00] font-black tracking-[0.5em] mb-2">{link.num}</span>
                  <span
                    className="text-5xl font-black font-['Space_Grotesk'] italic transition-colors duration-200 group-hover:text-[#f0ff00] tracking-tighter"
                    style={{ color: activeSection === link.id ? '#f0ff00' : '#ffffff' }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => go('contact')}
                className="mt-12 w-full py-5 bg-[#f0ff00] text-black font-black font-['Space_Grotesk'] text-2xl italic skew-x-[-12deg] relative group"
              >
                <span className="skew-x-[12deg] inline-block">BREACH_PROTOCOL</span>
                <div className="absolute inset-0 border-2 border-[#f0ff00] translate-x-2 translate-y-2 -z-10" />
              </motion.button>
            </div>

            {/* Scanning line decoration */}
            <div className="absolute top-1/4 left-0 w-full h-[1px] bg-[#f0ff00] opacity-20 animate-pulse" />
            <div className="absolute top-3/4 left-0 w-full h-[1px] bg-[#ff2a6d] opacity-20 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
