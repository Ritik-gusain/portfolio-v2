import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Counter Animation Hook
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true)
    }
  }, [startOnView])

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, startOnView])

  useEffect(() => {
    if (!hasStarted) return

    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [hasStarted, target, duration])

  return { count, ref }
}

// Stat Item Component
function StatItem({ value, label, color = '#00d9ff' }: { value: number; label: string; color?: string }) {
  const { count, ref } = useCountUp(value)

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="block text-center">
      <span 
        className="block text-2xl md:text-3xl font-['Space_Grotesk'] font-bold"
        style={{ color }}
      >
        {count}
      </span>
      <span className="block text-xs md:text-sm text-gray-400 mt-1">{label}</span>
    </span>
  )
}

// Badge Component
function Badge({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full glass"
    >
      <span>{icon}</span>
      <span className="text-sm text-gray-300">{label}</span>
    </motion.div>
  )
}

export default function LeetCode() {
  const advancedTopics = [
    { topic: 'DP', count: 41 },
    { topic: 'Backtracking', count: 9 },
    { topic: 'Trie', count: 6 },
    { topic: 'D&C', count: 5 }
  ]

  const coreTopics = [
    { topic: 'Hash Table', count: 78 },
    { topic: 'Math', count: 73 },
    { topic: 'Greedy', count: 35 },
    { topic: 'Binary Search', count: 28 }
  ]

  const { count: totalCount, ref: totalRef } = useCountUp(323)

  return (
    <section
      id="leetcode"
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Problem Solving
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Space_Grotesk'] font-bold">
            LeetCode <span className="gradient-text">Stats</span>
          </h3>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12 rounded-3xl"
        >
          {/* Total Problems */}
          <div ref={totalRef as React.RefObject<HTMLDivElement>} className="text-center mb-12">
            <span className="block text-6xl md:text-8xl font-['Space_Grotesk'] font-extrabold gradient-text">
              {totalCount}
            </span>
            <span className="block text-xl md:text-2xl text-gray-400 mt-2">
              Problems Solved
            </span>
          </div>

          {/* Difficulty Breakdown */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
            <StatItem value={148} label="Easy" color="#00b8a3" />
            <StatItem value={136} label="Medium" color="#ffc01e" />
            <StatItem value={39} label="Hard" color="#ef4743" />
          </div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Badge icon="🏆" label="100 Days Badge 2025" />
            <Badge icon="🔥" label="Max Streak 64 Days" />
          </motion.div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-12" />

          {/* Topic Breakdown */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Advanced Topics */}
            <div>
              <h4 className="text-lg font-['Space_Grotesk'] font-bold mb-4 text-cyan-400">
                Advanced
              </h4>
              <div className="space-y-3">
                {advancedTopics.map((item) => (
                  <div key={item.topic} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.count / 50) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-cyan-400 to-pink-500"
                        />
                      </div>
                      <span className="text-cyan-400 font-mono w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Topics */}
            <div>
              <h4 className="text-lg font-['Space_Grotesk'] font-bold mb-4 text-pink-500">
                Core
              </h4>
              <div className="space-y-3">
                {coreTopics.map((item) => (
                  <div key={item.topic} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.count / 100) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
                        />
                      </div>
                      <span className="text-pink-500 font-mono w-8 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <a
              href="https://leetcode.com/u/munnigusain29684"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-400 hover:underline hoverable"
            >
              View Full Profile
              <span>→</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
