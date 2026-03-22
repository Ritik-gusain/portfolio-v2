import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const totalFrames = 28

export default function AnimatedBackground() {
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Preload images
    const preloadImages = async () => {
      const promises = []
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image()
        img.src = `/gear5_frame_${String(i).padStart(3, '0')}.jpg`
        promises.push(
          new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        )
      }
      await Promise.all(promises)
      setIsLoaded(true)
    }

    preloadImages()
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    // Animate through frames
    intervalRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev % totalFrames) + 1)
    }, 150) // Change frame every 150ms for smooth animation

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isLoaded])

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-0 bg-[#050810]">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-pink-900/20" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Animated Frame Background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentFrame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/gear5_frame_${String(currentFrame).padStart(3, '0')}.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(5, 8, 16, 0.7) 0%, rgba(5, 8, 16, 0.85) 50%, rgba(5, 8, 16, 0.95) 100%)'
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255, 42, 109, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(123, 44, 191, 0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  )
}
