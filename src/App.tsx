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

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const mainRef = useRef<HTMLDivElement>(null)

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

  // Check if mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

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
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl font-bold gradient-text font-['Space_Grotesk']"
            >
              RG
            </motion.div>
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-gray-500 text-sm whitespace-nowrap"
            >
              Initializing 3D Environment...
            </motion.p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative nvg8-body-bg min-h-screen"
        >
          {/* Noise Overlay */}
          <div className="noise-overlay" />

          {/* NVG8-style Grid + scanning lines */}
          <div className="nvg8-grid" />
          <div className="nvg8-sentry-lines">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                style={{
                  top: `${(i + 1) * 8}vh`,
                  animationDelay: `${i * 0.65}s`
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
