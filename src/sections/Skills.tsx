import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    name: 'BLOCKCHAIN_VOID',
    skills: ['Solidity', 'Hardhat', 'Remix IDE', 'MetaMask', 'Web3.js', 'Ethers.js', 'EVM'],
    color: '#f0ff00',
    icon: '⛓️',
    back: 'ENGINEERING TRUSTLESS ANARCHY ON THE EVM. FROM DEFI EXPLOITS TO SECURE PROTOCOL DESIGN.'
  },
  {
    name: 'AI_CHAOS',
    skills: ['Python', 'OpenAI API', 'Streamlit', 'Pandas', 'NumPy', 'Prompt Engineering'],
    color: '#ff6b00',
    icon: '🤖',
    back: 'BENDING LLMS TO MY WILL. AUTOMATING THE FUTURE WITH AGGRESSIVE PIPELINES.'
  },
  {
    name: 'CORE_LANGS',
    skills: ['Python', 'JavaScript ES6+', 'Solidity', 'C++', 'Java'],
    color: '#ff2a6d',
    icon: '💻',
    back: 'FLUENT IN 5+ DIALECTS OF POWER. 323 LEETCODE CONQUESTS AND COUNTING.'
  },
  {
    name: 'BACKEND_SKELETON',
    skills: ['Node.js', 'Express.js', 'REST API', 'MVC', 'Jest'],
    color: '#f0ff00',
    icon: '⚙️',
    back: 'FORGING THE BONE-STRUCTURE OF APPLICATIONS. TEST-DRIVEN DESTRUCTION.'
  },
  {
    name: 'FRONTEND_GLITCH',
    skills: ['React.js', 'HTML5', 'CSS3', 'Responsive Design', 'Tailwind CSS'],
    color: '#ff2a6d',
    icon: '🎨',
    back: 'CRAFTING VISUAL EXPLOSIONS. REACT, GSAP, AND CHAOTIC UI DESIGN.'
  },
  {
    name: 'GEAR_MODULES',
    skills: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Linux CLI'],
    color: '#ffffff',
    icon: '🛠️',
    back: 'FULL DEVOPS DOMINATION. CI/CD WARFARE AND CLI MASTERY.'
  }
]

const proficiencyGroups = [
  {
    label: 'BLOCKCHAIN_STRENGTH',
    color: '#f0ff00',
    items: [
      { name: 'Solidity / EVM', level: 90 },
      { name: 'Hardhat / Foundry', level: 80 },
      { name: 'DeFi Architecture', level: 75 },
      { name: 'Smart Contract Sec', level: 70 },
      { name: 'Web3.js / Ethers.js', level: 85 },
    ]
  },
  {
    label: 'AI_DOMINATION',
    color: '#ff6b00',
    items: [
      { name: 'Python / ML Pipelines', level: 82 },
      { name: 'LLM Engineering', level: 78 },
      { name: 'AI Automation', level: 88 },
      { name: 'Make.com / n8n', level: 90 },
      { name: 'Gemini / Claude API', level: 80 },
    ]
  },
  {
    label: 'SYSTEM_HARDENING',
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
            { width: '0%', backgroundColor: '#ffffff' },
            {
              width: width + '%',
              backgroundColor: 'inherit',
              duration: 1,
              ease: 'power4.inOut',
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
      className="relative min-h-screen w-full flex items-center py-24 overflow-hidden bg-[#050810]"
    >
      {/* BG accents */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #ff2a6d 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />

      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-['Space_Mono'] text-[#f0ff00] tracking-[0.5em] uppercase mb-3 font-black">
            // DATA: ARSENAL_LOADOUT
          </p>
          <h2 className="text-4xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="TECH_STACK">
            TECH_<span className="text-[#f0ff00]">STACK</span>
          </h2>
          <div className="mt-6 w-48 h-2 mx-auto bg-[#f0ff00] skew-x-[-20deg]" />
        </motion.div>

        {/* 3D Flip Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flip-card h-64 group"
            >
              <div className="flip-card-inner rounded-none group-hover:rotate-y-180 transition-transform duration-700">
                {/* Front */}
                <div
                  className="flip-card-front bg-white/5 border-4 border-white/10 p-8 flex flex-col justify-between skew-x-[-4deg]"
                  style={{ borderLeft: `8px solid ${category.color}` }}
                >
                  <div className="flex items-center gap-4 mb-4 skew-x-[4deg]">
                    <span className="text-4xl">{category.icon}</span>
                    <h4
                      className="text-xl font-black font-['Space_Grotesk'] italic tracking-tighter"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 skew-x-[4deg]">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white/10 text-white text-[10px] font-black font-['Space_Mono'] px-3 py-1 uppercase tracking-tighter"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back bg-white text-black flex flex-col items-center justify-center gap-4 p-8 text-center skew-x-[-4deg]"
                  style={{ background: category.color }}
                >
                  <div className="skew-x-[4deg]">
                    <p className="text-sm font-black font-['Space_Mono'] uppercase leading-tight italic">
                      {category.back}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proficiency Bars */}
        <div className="grid md:grid-cols-3 gap-12">
          {proficiencyGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              ref={el => { barsRef.current[gi] = el }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: gi * 0.1 }}
              className="relative p-8 bg-white/5 border-2 border-white/10"
            >
              <h4
                className="font-['Space_Mono'] text-sm font-black tracking-widest uppercase mb-8 italic"
                style={{ color: group.color }}
              >
                {group.label}
              </h4>
              <div className="space-y-8">
                {group.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-white/60 font-black font-['Space_Mono'] uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-black font-['Space_Mono'] italic" style={{ color: group.color }}>
                        {item.level}%
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="w-full h-4 bg-white/5 relative overflow-hidden skew-x-[-20deg]">
                      <div
                        data-bar-width={item.level}
                        className="absolute top-0 left-0 h-full"
                        style={{
                          width: '0%',
                          background: group.color,
                          boxShadow: `0 0 20px ${group.color}44`,
                        }}
                      />
                      {/* Dashing overlay */}
                      <div className="absolute inset-0 dashing-line opacity-30" />
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
