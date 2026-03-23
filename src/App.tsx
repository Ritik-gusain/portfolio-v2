import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import ThreeBackground from './components/ThreeBackground'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import NewProjects from './sections/NewProjects'
import Experience from './sections/Experience'
import Certifications from './sections/Certifications'
import LeetCode from './sections/LeetCode'
import Education from './sections/Education'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

import { useIsMobile } from './hooks/use-mobile'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Refresh ScrollTrigger after content loads
      ScrollTrigger.refresh()
    }
  }, [isLoading])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050810]"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.5, 0.8, 1.2, 1],
                opacity: [0.5, 1, 0.2, 1, 0.5],
                skewX: [0, 20, -20, 0]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-6xl font-black text-[#f0ff00] font-['Space_Grotesk'] italic tracking-tighter"
              style={{ textShadow: '0 0 20px #f0ff00' }}
            >
              RG_OS_v0.5
            </motion.div>
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-2 bg-[#f0ff00]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0.5, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[#f0ff00] text-[10px] font-['Space_Mono'] whitespace-nowrap uppercase font-black"
            >
              BREACHING PROTOCOLS... [OK]
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative nvg8-body-bg min-h-screen"
        >
          {/* Global Busted Overlay */}
          <div className="fixed inset-0 z-[10000] pointer-events-none opacity-[0.03] noise-overlay" />
          <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05] circle-scanlines" />
          <div className="fixed inset-0 z-[9998] pointer-events-none animate-flicker bg-[#f0ff00]/[0.01]" />

          {/* NVG8-style Grid + scanning lines */}
          <div className="nvg8-grid opacity-10" />
          <div className="nvg8-sentry-lines">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                style={{
                  top: `${(i + 1) * 8}vh`,
                  animationDelay: `${i * 0.65}s`,
                  background: 'linear-gradient(90deg, #f0ff00, #ff6b00)'
                }}
              />
            ))}
          </div>
          
          {/* Three.js Background */}
          <ThreeBackground />
          
          {/* Custom Cursor (desktop only) */}
          {!isMobile && <CustomCursor />}
          
          {/* Scroll Progress Bar */}
          <ScrollProgress />
          
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main ref={mainRef} className="relative z-10">
            {/* Hero Section */}
            <Hero />
            
            {/* About Section */}
            <About />
            
            {/* Skills Section */}
            <Skills />
            
            {/* Projects Section */}
            <NewProjects />
            
            {/* Experience Section */}
            <Experience />
            
            {/* Certifications Section */}
            <Certifications />
            
            {/* LeetCode Section */}
            <LeetCode />
            
            {/* Education Section */}
            <Education />
            
            {/* Contact Section */}
            <Contact />
            
            {/* Footer */}
            <Footer />
          </main>
          
          <style>{`
            @keyframes flicker {
              0% { opacity: 0.1; }
              5% { opacity: 0.2; }
              10% { opacity: 0.1; }
              15% { opacity: 0.3; }
              20% { opacity: 0.1; }
              100% { opacity: 0.1; }
            }
            .animate-flicker {
              animation: flicker 0.1s infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
