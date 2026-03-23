import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { id: 'about',      label: 'About',      num: '01' },
  { id: 'skills',     label: 'Skills',     num: '02' },
  { id: 'projects',   label: 'Projects',   num: '03' },
  { id: 'experience', label: 'Experience', num: '04' },
  { id: 'contact',    label: 'Contact',    num: '05' },
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
            ? 'py-3 border-b border-white/5'
            : 'py-5 bg-transparent'
        }`}
        style={isScrolled ? {
          background: 'rgba(5,8,16,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,217,255,0.06)'
        } : {}}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between max-w-[1600px] mx-auto">

          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative group"
          >
            <span
              className="text-2xl font-extrabold font-['Space_Grotesk'] gradient-text hoverable"
              style={{ letterSpacing: '-0.03em' }}
            >
              RG
            </span>
            {/* Underline sweep */}
            <span
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
              style={{ width: activeSection === '' || activeSection === 'hero' ? '100%' : '0%' }}
            />
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.id
              return (
                <motion.button
                  key={link.id}
                  onClick={() => go(link.id)}
                  whileHover={{ y: -1 }}
                  className="relative px-4 py-2 rounded-lg group hoverable transition-colors duration-200"
                  style={{ color: isActive ? '#ffffff' : 'rgba(180,180,200,0.7)' }}
                >
                  {/* Active pill */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.18)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    <span className="text-[10px] font-['Space_Mono'] opacity-40">{link.num}</span>
                    <span className="text-sm font-['Space_Grotesk'] font-medium">{link.label}</span>
                  </span>
                  {/* Hover underline */}
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-[2px] rounded-full bg-cyan-400 transition-all duration-200"
                    style={{ opacity: isActive ? 0 : 1 }}
                  />
                </motion.button>
              )
            })}
          </div>

          {/* Hire Me CTA */}
          <motion.button
            onClick={() => go('contact')}
            className="hidden md:flex items-center gap-2.5 px-5 py-2 rounded-full font-semibold text-sm hoverable overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #00d9ff 0%, #0099cc 100%)',
              color: '#050810',
              fontFamily: "'Space Grotesk', sans-serif"
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,217,255,0.5)' }}
            whileTap={{ scale: 0.96 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Hire Me
          </motion.button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenu(!isMobileMenuOpen)}
            className="md:hidden p-2 hoverable z-50 flex flex-col gap-1.5"
            aria-label="Menu"
          >
            {[false, true, false].map((middle, i) => (
              <motion.span
                key={i}
                animate={
                  isMobileMenuOpen
                    ? middle
                      ? { opacity: 0, scaleX: 0 }
                      : i === 0
                      ? { rotate: 45, y: 8 }
                      : { rotate: -45, y: -8 }
                    : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                }
                className="w-6 h-0.5 bg-white block rounded-full origin-center"
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,8,16,0.96)' }}
          >
            {/* Top gradient streak */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <div className="flex flex-col items-center gap-6 w-full px-12">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  onClick={() => go(link.id)}
                  className="flex items-center gap-4 w-full group"
                >
                  <span className="text-xs font-['Space_Mono'] text-cyan-400">{link.num}</span>
                  <span
                    className="text-4xl font-extrabold font-['Space_Grotesk'] transition-colors duration-200 group-hover:text-cyan-400"
                    style={{ color: activeSection === link.id ? '#00d9ff' : '#ffffff' }}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.45 }}
                onClick={() => go('contact')}
                className="mt-6 w-full py-4 rounded-2xl text-[#050810] font-bold font-['Space_Grotesk'] text-lg"
                style={{ background: 'linear-gradient(135deg, #00d9ff, #0099cc)' }}
              >
                Hire Me →
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
