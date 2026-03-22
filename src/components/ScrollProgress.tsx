import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScrollProgressProps {
  progress?: number
}

export default function ScrollProgress({ progress: externalProgress }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress)
      return
    }

    let rafId: number | null = null

    const handleScroll = () => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
        setProgress(scrollPercent)
        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [externalProgress])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed top-0 left-0 w-full h-1 z-[9999]"
      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
    >
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #00d9ff 0%, #ff2a6d 100%)',
          boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
        }}
      />
    </motion.div>
  )
}
