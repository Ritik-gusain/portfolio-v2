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
function StatItem({ value, label, color = '#f0ff00' }: { value: number; label: string; color?: string }) {
  const { count, ref } = useCountUp(value)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="relative p-4 border-2 border-white/10 skew-x-[-12deg] overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-current" style={{ color }} />
      <span className="block text-3xl md:text-5xl font-['Space_Grotesk'] font-black italic skew-x-[12deg]" style={{ color }}>
        {count}
      </span>
      <span className="block text-[10px] text-white/40 font-['Space_Mono'] uppercase font-black mt-1 skew-x-[12deg] tracking-widest">{label}</span>
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity" style={{ color }} />
    </div>
  )
}

// Badge Component
function Badge({ icon, label }: { icon: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 2 }}
      className="flex items-center gap-3 px-6 py-2 bg-white/5 border-2 border-white/10 skew-x-[-12deg] group"
    >
      <span className="text-xl skew-x-[12deg]">{icon}</span>
      <span className="text-xs font-black font-['Space_Mono'] text-white/80 uppercase skew-x-[12deg] group-hover:text-[#f0ff00] transition-colors">{label}</span>
    </motion.div>
  )
}

export default function LeetCode() {
  const sectionRef = useRef<HTMLElement>(null)
  const advancedTopics = [
    { topic: 'DP', count: 41, color: '#f0ff00' },
    { topic: 'Backtracking', count: 9, color: '#ff6b00' },
    { topic: 'Trie', count: 6, color: '#ff2a6d' },
    { topic: 'D&C', count: 5, color: '#f0ff00' }
  ]

  const coreTopics = [
    { topic: 'Hash Table', count: 78, color: '#ff2a6d' },
    { topic: 'Math', count: 73, color: '#ff6b00' },
    { topic: 'Greedy', count: 35, color: '#f0ff00' },
    { topic: 'Binary Search', count: 28, color: '#ff2a6d' }
  ]

  const { count: totalCount, ref: totalRef } = useCountUp(323)

  return (
    <section
      id="leetcode"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-24 bg-[#050810] overflow-hidden"
    >
      {/* Background sweep */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-tr from-[#f0ff00] to-transparent" />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // DATA: ALGORITHMIC_CONQUEST
          </p>
          <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="LEETCODE_STATS">
            LEETCODE_<span className="text-[#f0ff00]">STATS</span>
          </h2>
          <div className="mt-4 w-64 h-4 bg-[#f0ff00] skew-x-[-20deg]" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Main Stats */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 bg-white/5 border-l-8 border-[#f0ff00] skew-x-[-4deg] relative group"
            >
               <div ref={totalRef as React.RefObject<HTMLDivElement>} className="skew-x-[4deg]">
                  <span className="block text-8xl md:text-9xl font-['Space_Grotesk'] font-black italic tracking-tighter text-[#f0ff00] leading-none">
                    {totalCount}
                  </span>
                  <span className="block text-xl md:text-2xl font-black font-['Space_Mono'] text-white uppercase mt-4 tracking-widest italic">
                    PROBLEMS_SOLVED
                  </span>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-8 border-b-8 border-[#ff6b00] -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
            </motion.div>

            {/* Difficulty Grid */}
            <div className="grid grid-cols-3 gap-6">
               <StatItem value={148} label="EASY" color="#00ffcc" />
               <StatItem value={136} label="MEDIUM" color="#ffcc00" />
               <StatItem value={39} label="HARD" color="#ff3366" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4">
               <Badge icon="🏆" label="100 DAYS BADGE 2025" />
               <Badge icon="🔥" label="MAX STREAK 64 DAYS" />
            </div>
          </div>

          {/* Right: Topic Breakdown */}
          <div className="space-y-8 p-8 bg-white/5 border-2 border-white/10 skew-x-[2deg]">
             <div className="skew-x-[-2deg]">
                <h4 className="text-xl font-black font-['Space_Grotesk'] italic text-[#f0ff00] uppercase mb-8 border-b-2 border-[#f0ff00] pb-2 inline-block">
                  TOPIC_MASTERY
                </h4>
                
                <div className="space-y-10">
                   {/* Advanced */}
                   <div className="space-y-6">
                      <p className="text-[10px] font-black font-['Space_Mono'] text-white/40 tracking-[0.5em] uppercase">// ADVANCED_MODULES</p>
                      <div className="grid gap-6">
                        {advancedTopics.map((item) => (
                          <div key={item.topic} className="space-y-2">
                             <div className="flex justify-between items-center font-['Space_Mono'] font-black">
                                <span className="text-sm text-white uppercase italic">{item.topic}</span>
                                <span className="text-sm" style={{ color: item.color }}>{item.count}</span>
                             </div>
                             <div className="w-full h-3 bg-white/5 skew-x-[-20deg] relative overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${(item.count / 50) * 100}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="h-full"
                                  style={{ background: item.color }}
                                />
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Core */
                   <div className="space-y-6">
                      <p className="text-[10px] font-black font-['Space_Mono'] text-white/40 tracking-[0.5em] uppercase">// CORE_PROTOCOLS</p>
                      <div className="grid gap-6">
                        {coreTopics.map((item) => (
                          <div key={item.topic} className="space-y-2">
                             <div className="flex justify-between items-center font-['Space_Mono'] font-black">
                                <span className="text-sm text-white uppercase italic">{item.topic}</span>
                                <span className="text-sm" style={{ color: item.color }}>{item.count}</span>
                             </div>
                             <div className="w-full h-3 bg-white/5 skew-x-[-20deg] relative overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${(item.count / 100) * 100}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="h-full"
                                  style={{ background: item.color }}
                                />
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>

                <motion.div
                  className="mt-12 text-center lg:text-left"
                  whileHover={{ x: 10 }}
                >
                  <a
                    href="https://leetcode.com/u/munnigusain29684"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-[#f0ff00] text-black px-8 py-3 font-black font-['Space_Mono'] uppercase italic skew-x-[-12deg] group"
                  >
                    <span className="skew-x-[12deg]">BREACH_FULL_PROFILE</span>
                    <span className="skew-x-[12deg] group-hover:translate-x-2 transition-transform">→</span>
                  </a>
                </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
