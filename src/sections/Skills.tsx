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
    icon: '⛓️'
  },
  {
    name: 'AI & Data',
    skills: ['Python', 'OpenAI API', 'Streamlit', 'Pandas', 'NumPy', 'Prompt Engineering'],
    color: '#7b2cbf',
    icon: '🤖'
  },
  {
    name: 'Languages',
    skills: ['Python', 'JavaScript ES6+', 'Solidity', 'C++', 'Java'],
    color: '#ff2a6d',
    icon: '💻'
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST API', 'MVC', 'Jest'],
    color: '#00d9ff',
    icon: '⚙️'
  },
  {
    name: 'Frontend',
    skills: ['React.js', 'HTML5', 'CSS3', 'Responsive Design', 'Tailwind CSS'],
    color: '#ff2a6d',
    icon: '🎨'
  },
  {
    name: 'Tools',
    skills: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Linux CLI'],
    color: '#ffffff',
    icon: '🛠️'
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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Animate category cards with stagger
      cardsRef.current.forEach((card, index) => {
        if (!card) return
        gsap.fromTo(
          card,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0, rotateY: index % 2 === 0 ? -15 : 15 },
          {
            x: 0, opacity: 1, rotateY: 0,
            duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
          }
        )
      })

      // Animate proficiency bar sections
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
      className="relative min-h-screen w-full flex items-center py-24"
    >
      <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-4 font-['Space_Grotesk']">
            Skills
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-['Space_Grotesk'] font-bold">
            Tech <span className="gradient-text">Stack</span>
          </h3>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Technologies I work with to build scalable, secure, and innovative solutions
          </p>
        </motion.div>

        {/* Skills Badge Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {skillCategories.map((category, index) => (
            <div
              key={category.name}
              ref={el => { cardsRef.current[index] = el }}
              className="glass-card p-6 md:p-8 rounded-2xl hoverable"
              style={{ perspective: '1000px', borderLeft: `4px solid ${category.color}` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h4 className="text-xl md:text-2xl font-['Space_Grotesk'] font-bold" style={{ color: category.color }}>
                  {category.name}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: skillIndex * 0.05 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="skill-badge"
                    style={{ borderColor: `${category.color}40`, color: category.color }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
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
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="glass-card p-6 rounded-2xl"
              style={{ borderTop: `2px solid ${group.color}` }}
            >
              <h4
                className="font-['Space_Mono'] text-xs tracking-widest uppercase mb-6"
                style={{ color: group.color }}
              >
                {group.label}
              </h4>
              <div className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 font-['Space_Mono']">{item.name}</span>
                      <span className="text-xs font-['Space_Mono']" style={{ color: group.color }}>{item.level}%</span>
                    </div>
                    <div className="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
                      <div
                        data-bar-width={item.level}
                        style={{
                          width: '0%',
                          height: '1px',
                          background: `linear-gradient(to right, ${group.color}, #7b2cbf)`,
                          position: 'absolute', top: 0, left: 0
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
