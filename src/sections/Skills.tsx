import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    name: 'Blockchain',
    skills: ['Solidity', 'Hardhat', 'Remix IDE', 'MetaMask', 'Web3.js', 'Ethers.js', 'EVM'],
    color: '#00d9ff',
    icon: '⛓️',
    back: 'Building decentralized, trustless applications on the EVM — from token contracts to full DeFi protocol design.'
  },
  {
    name: 'AI & Data',
    skills: ['Python', 'OpenAI API', 'Streamlit', 'Pandas', 'NumPy', 'Prompt Engineering'],
    color: '#7b2cbf',
    icon: '🤖',
    back: 'Engineering AI pipelines with LLMs, automation flows, and data analysis tools for real-world products.'
  },
  {
    name: 'Languages',
    skills: ['Python', 'JavaScript ES6+', 'Solidity', 'C++', 'Java'],
    color: '#ff2a6d',
    icon: '💻',
    back: 'Fluent in 5+ languages. DSA problem-solver with 323 LeetCode solutions including 39 Hards.'
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST API', 'MVC', 'Jest'],
    color: '#00d9ff',
    icon: '⚙️',
    back: 'REST API design, testing-first back-end development with Node.js and MVC architecture patterns.'
  },
  {
    name: 'Frontend',
    skills: ['React.js', 'HTML5', 'CSS3', 'Responsive Design', 'Tailwind CSS'],
    color: '#ff2a6d',
    icon: '🎨',
    back: 'Building responsive, animated interfaces with React, GSAP, and Framer Motion — like this very portfolio.'
  },
  {
    name: 'Tools',
    skills: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Linux CLI'],
    color: '#ffffff',
    icon: '🛠️',
    back: 'Full DevOps workflow: version control, CI-friendly deployments, and efficient CLI-driven development.'
  }
]

const proficiencyGroups = [
  {
    label: 'Blockchain',
    color: '#00d9ff',
    items: [
      { name: 'Solidity / EVM', level: 90 },
      { name: 'Hardhat / Foundry', level: 80 },
      { name: 'DeFi Architecture', level: 75 },
      { name: 'Smart Contract Sec', level: 70 },
      { name: 'Web3.js / Ethers.js', level: 85 },
    ]
  },
  {
    label: 'AI Engineering',
    color: '#7b2cbf',
    items: [
      { name: 'Python / ML Pipelines', level: 82 },
      { name: 'LLM Engineering', level: 78 },
      { name: 'AI Automation', level: 88 },
      { name: 'Make.com / n8n', level: 90 },
      { name: 'Gemini / Claude API', level: 80 },
    ]
  },
  {
    label: 'Systems & Dev',
    color: '#ff2a6d',
    items: [
      { name: 'ESP32 / IoT / LiFi', level: 78 },
      { name: 'Flutter / Dart', level: 70 },
      { name: 'React / Next.js', level: 72 },
      { name: 'C++ / DSA', level: 82 },
      { name: 'Git / Vercel / DevOps', level: 76 },
    ]
  }
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      barsRef.current.forEach((group) => {
        if (!group) return
        group.querySelectorAll<HTMLDivElement>('[data-bar-width]').forEach((bar) => {
          const width = bar.getAttribute('data-bar-width')
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: width + '%',
              duration: 1.6,
              ease: 'power2.out',
              scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none none' }
            }
          )
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center py-24 overflow-hidden"
    >
      {/* BG accents */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(123,44,191,0.08), transparent 60%)',
          filter: 'blur(80px)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(0,217,255,0.07), transparent 60%)',
          filter: 'blur(80px)'
        }}
      />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-['Space_Mono'] text-cyan-400 tracking-[0.3em] uppercase mb-3">
            // 03. WHAT I USE
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-['Space_Grotesk'] font-extrabold">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-['Space_Mono'] text-sm">
            Hover the cards to flip &amp; see the story behind each stack.
          </p>
          <div className="mt-6 w-24 h-[2px] mx-auto bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
        </motion.div>

        {/* 3D Flip Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flip-card h-52"
              style={{ minHeight: '210px' }}
            >
              <div className="flip-card-inner rounded-2xl" style={{ height: '210px' }}>
                {/* Front */}
                <div
                  className="flip-card-front glass-card rounded-2xl p-6 md:p-8 hoverable flex flex-col justify-between"
                  style={{ borderLeft: `3px solid ${category.color}` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{category.icon}</span>
                    <h4
                      className="text-xl md:text-2xl font-['Space_Grotesk'] font-bold"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, si) => (
                      <span
                        key={skill}
                        className="skill-badge text-xs"
                        style={{
                          borderColor: `${category.color}40`,
                          color: category.color,
                          animationDelay: `${si * 0.1}s`
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}18, rgba(5,8,16,0.95))`,
                    border: `1px solid ${category.color}50`,
                    boxShadow: `0 0 40px ${category.color}20`
                  }}
                >
                  <span className="text-5xl">{category.icon}</span>
                  <p
                    className="text-sm leading-relaxed font-['Space_Mono']"
                    style={{ color: category.color === '#ffffff' ? '#d1d5db' : category.color }}
                  >
                    {category.back}
                  </p>
                  <div
                    className="w-8 h-[2px] rounded-full"
                    style={{ background: category.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proficiency Bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold">
            Proficiency <span className="gradient-text">Levels</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {proficiencyGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              ref={el => { barsRef.current[gi] = el }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.12 }}
              className="glass-card p-6 rounded-2xl neon-border"
              style={{ borderTop: `2px solid ${group.color}` }}
            >
              <h4
                className="font-['Space_Mono'] text-xs tracking-widest uppercase mb-6"
                style={{ color: group.color }}
              >
                {group.label}
              </h4>
              <div className="space-y-5">
                {group.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-['Space_Mono']">{item.name}</span>
                      <span className="text-xs font-['Space_Mono'] font-bold" style={{ color: group.color }}>
                        {item.level}%
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="w-full h-[3px] bg-white/5 relative overflow-hidden rounded-full">
                      <div
                        data-bar-width={item.level}
                        style={{
                          width: '0%',
                          height: '3px',
                          background: `linear-gradient(to right, ${group.color}, #7b2cbf)`,
                          position: 'absolute', top: 0, left: 0,
                          boxShadow: `0 0 8px ${group.color}`,
                          borderRadius: '9999px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
