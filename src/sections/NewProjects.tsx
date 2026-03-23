import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'INDENTRON_v2',
    subtitle: 'CODE_FORMATTER_PROTOCOL',
    liveUrl: 'https://indentron.vercel.app',
    githubUrl: 'https://github.com/Ritik-gusain/indentron',
    stack: ['Node.js', 'Express.js', 'REST API', 'MVC', 'Jest', 'Vercel'],
    description: 'BENDING CODE TO MY WILL. FULL-STACK WEB APP FORMATTING 12+ LANGUAGES WITH VS CODE DARK UI.',
    color: '#f0ff00',
    borderColor: 'border-[#f0ff00]',
    glowClass: 'cyan-glow',
    icon: '⛓️'
  },
  {
    id: 2,
    title: 'AI_CHAT_CHAOS',
    subtitle: 'OPENAI_BREACH',
    liveUrl: null,
    githubUrl: 'https://github.com/Ritik-gusain/chatbot',
    stack: ['Python', 'OpenAI API', 'Streamlit', 'Prompt Engineering'],
    description: 'CONVERSATIONAL ANARCHY. OPENAI API + STREAMLIT INTERFACE WITH AGGRESSIVE PROMPT ENGINEERING.',
    color: '#ff6b00',
    borderColor: 'border-[#ff6b00]',
    glowClass: 'purple-glow',
    icon: '🤖'
  },
  {
    id: 3,
    title: 'VIBE_PORTFOLIO',
    subtitle: 'CURRENT_INTERFACE',
    liveUrl: 'https://ritikg-portfolio.vercel.app',
    githubUrl: null,
    stack: ['React', 'Three.js', 'GSAP', 'Framer Motion', 'Supabase'],
    description: 'THIS VERY EXPLOSION. 3D INTERACTIVE SITE WITH CINEMATIC BUSTED HERO AND ANALYTICS BREACH.',
    color: '#ff2a6d',
    borderColor: 'border-[#ff2a6d]',
    glowClass: 'red-glow',
    icon: '🌐'
  },
  {
    id: 4,
    title: 'DISTOF_IOT',
    subtitle: 'IEEE_SIGNAL_JAMMER',
    liveUrl: null,
    githubUrl: null,
    stack: ['IoT', 'ESP8266', 'VL53L0X', 'Flutter', 'WebSocket'],
    description: 'IEEE FINAL-YEAR CONQUEST. VL53L0X TOF SENSOR WITH KALMAN FILTERING AND WEBSOCKET OVERLOAD.',
    color: '#f0ff00',
    borderColor: 'border-[#f0ff00]',
    glowClass: 'cyan-glow',
    icon: '📡'
  },
  {
    id: 5,
    title: 'CONTENT_ENGINE',
    subtitle: 'AUTOMATED_X_WARFARE',
    liveUrl: null,
    githubUrl: null,
    stack: ['Make.com', 'Gemini 2.5', 'Pollinations.ai', 'Buffer', 'RSS'],
    description: 'X/TWITTER CONTENT PIPELINE. GEMINI 2.5 FLASH + AI IMAGE GEN + BUFFER. RSS-TRIGGERED DOMINATION.',
    color: '#ff6b00',
    borderColor: 'border-[#ff6b00]',
    glowClass: 'purple-glow',
    icon: '⚡'
  },
  {
    id: 6,
    title: 'LIFI_NODE_X',
    subtitle: 'OPTICAL_SIGNAL_BREACH',
    liveUrl: null,
    githubUrl: null,
    stack: ['ESP32-C3', 'LiFi', 'C++', 'Hardware', 'Wireless'],
    description: 'ESP32-C3 OPTICAL DATA TRANSMISSION via MODULATED LED LIGHT. HARDWARE-LEVEL NETWORK WARFARE.',
    color: '#ff2a6d',
    borderColor: 'border-[#ff2a6d]',
    glowClass: 'red-glow',
    icon: '💡'
  }
]

// Canvas frame animation constants
const totalFrames = 40
const framePrefix = 'ezgif-frame-'
const frameExtension = 'jpg'

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([])
  const [isPreloading, setIsPreloading] = useState(true)
  const [preloadProgress, setPreloadProgress] = useState(0)

  // Sliding window state
  const [activeIndex, setActiveIndex] = useState(0)
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHovering = useRef(false)

  // Preload + pre-bake frames
  useEffect(() => {
    const loadImages = async () => {
      const targetSize = 600
      const loadedFrames: HTMLCanvasElement[] = []

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image()
        // Ensure path is correct relative to public folder
        img.src = `/frames/${framePrefix}${String(i).padStart(3, '0')}.${frameExtension}`
        
        await new Promise<void>(resolve => {
          img.onload = () => {
            const oc = document.createElement('canvas')
            oc.width = targetSize
            oc.height = targetSize
            const octx = oc.getContext('2d')!
            
            const scale = Math.max(targetSize / img.width, targetSize / img.height)
            const x = (targetSize / 2) - (img.width / 2) * scale
            const y = (targetSize / 2) - (img.height / 2) * scale
            octx.drawImage(img, x, y, img.width * scale, img.height * scale)
            
            loadedFrames.push(oc)
            setPreloadProgress((i / totalFrames) * 100)
            resolve()
          }
          img.onerror = () => {
            console.error(`Failed to load frame ${i}`)
            resolve() 
          }
        })
      }

      setFrames(loadedFrames)

      const canvas = canvasRef.current
      if (canvas && loadedFrames.length > 0) {
        canvas.width = targetSize
        canvas.height = targetSize
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(loadedFrames[0], 0, 0)
      }

      setIsPreloading(false)
    }
    loadImages()
  }, [])

  // GSAP scroll-scrub for frame animation
  useEffect(() => {
    if (isPreloading || frames.length === 0) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')!
    let lastFrameIndex = -1

    const render = (index: number) => {
      if (index === lastFrameIndex) return
      lastFrameIndex = index
      if (!frames[index]) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(frames[index], 0, 0)
    }

    render(0)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * 2}`,
        pin: true,
        scrub: 1,
        onUpdate: self => {
          const frameIndex = Math.floor(self.progress * (totalFrames - 1))
          render(frameIndex)
        }
      }
    })

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: `+=${window.innerHeight * 2}`,
      onUpdate: self => {
        const idx = Math.floor(self.progress * (projects.length - 1))
        setActiveIndex(Math.min(idx, projects.length - 1))
      }
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isPreloading, frames])

  // Auto-slide when not driven by scroll
  useEffect(() => {
    slideIntervalRef.current = setInterval(() => {
      if (!isHovering.current) {
        setActiveIndex(prev => (prev + 1) % projects.length)
      }
    }, 3000)
    return () => {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current)
    }
  }, [])

  const goTo = (idx: number) => {
    setActiveIndex((idx + projects.length) % projects.length)
  }

  const prev = () => goTo(activeIndex - 1)
  const next = () => goTo(activeIndex + 1)

  const project = projects[activeIndex]

  return (
    <section id="projects" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#050810]">
      {/* Loading overlay - Busted style */}
      {isPreloading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050810] z-20">
          <div className="text-center">
            <div className="text-6xl font-black text-[#f0ff00] mb-8 font-['Space_Grotesk'] italic glitch-text" data-text="BREACHING_DATA">
              BREACHING_DATA
            </div>
            <div className="w-96 h-4 bg-white/5 border-2 border-white/10 skew-x-[-20deg] overflow-hidden">
              <div
                className="h-full bg-[#f0ff00] transition-all duration-300"
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
            <p className="text-[#f0ff00] mt-4 font-['Space_Mono'] font-black uppercase tracking-widest">{Math.round(preloadProgress)}% COMPLETE</p>
          </div>
        </div>
      )}

      {/* Section title - Busted style */}
      <div className="absolute top-12 left-0 right-0 flex justify-center z-10">
        <h2 className="text-5xl md:text-8xl font-['Space_Grotesk'] font-black glitch-text uppercase italic tracking-tighter" data-text="PROJECT_TERMINAL">
          PROJECT_<span className="text-[#f0ff00]">TERMINAL</span>
        </h2>
      </div>

      {/* Main split layout */}
      <div className="absolute inset-0 flex items-center justify-center pt-24 z-10">
        {/* LEFT — Circular frame display */}
        <div className="w-1/2 flex items-center justify-center relative">
          
          {/* Outer glowing rings */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'min(45vw, 460px)',
              height: 'min(45vw, 460px)',
              background: `conic-gradient(from 0deg, #f0ff00, #ff6b00, #ff2a6d, #f0ff00)`,
              filter: 'blur(10px)',
              opacity: 0.3,
              animation: 'spin 12s linear infinite'
            }}
          />
          
          {/* Canvas clipped to circle */}
          <div
            className="relative overflow-hidden rounded-full border-8 border-white/10"
            style={{
              width: 'min(40vw, 420px)',
              height: 'min(40vw, 420px)',
              boxShadow: `0 0 100px -10px ${project.color}66`
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full block object-cover"
              style={{
                filter: 'contrast(1.1) brightness(1.1)'
              }}
            />
            {/* Scanlines on canvas */}
            <div className="absolute inset-0 pointer-events-none opacity-30 circle-scanlines" />
            <div className="absolute inset-0 bg-current opacity-5 pointer-events-none transition-colors duration-500" style={{ color: project.color }} />
          </div>

          {/* Orbit indicators — Sliding window indicators */}
          {projects.map((p, i) => {
            const angle = (i / projects.length) * 2 * Math.PI - Math.PI / 2
            // Distance from center
            const orbitDist = Math.min(window.innerWidth * 0.23, 240)
            const x = Math.cos(angle) * orbitDist
            const y = Math.sin(angle) * orbitDist
            const isActive = i === activeIndex

            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: isActive ? '64px' : '44px',
                  height: isActive ? '64px' : '44px',
                  borderRadius: '50%',
                  background: isActive ? p.color : 'rgba(255,255,255,0.05)',
                  border: `3px solid ${isActive ? '#fff' : p.color + '44'}`,
                  boxShadow: isActive ? `0 0 40px ${p.color}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isActive ? '28px' : '20px',
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 30
                }}
              >
                <span className={isActive ? 'animate-pulse' : ''}>{p.icon}</span>
              </button>
            )
          })}
        </div>

        {/* RIGHT — Busted project card */}
        <div
          className="w-1/2 flex items-center justify-center"
          onMouseEnter={() => { isHovering.current = true }}
          onMouseLeave={() => { isHovering.current = false }}
        >
          <div className="relative w-full max-w-[520px] px-8">
            {/* Card */}
            <div
              key={project.id}
              className="bg-white/5 border-l-8 p-10 skew-x-[-4deg] relative overflow-hidden group"
              style={{ borderColor: project.color }}
            >
               {/* Decorative background ID */}
               <div className="absolute -right-8 -top-8 text-[12rem] font-black text-white/[0.03] pointer-events-none select-none italic">
                {project.id}
              </div>

              {/* Top Meta */}
              <div className="flex justify-between items-start mb-8 skew-x-[4deg]">
                <div>
                   <p className="text-[10px] font-['Space_Mono'] font-black uppercase tracking-[0.4em] opacity-40 mb-2">PROJECT_STATUS: ACTIVE</p>
                   <h4 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-black italic tracking-tighter uppercase" style={{ color: project.color }}>
                    {project.title}
                  </h4>
                  <p className="text-white/40 text-xs font-black font-['Space_Mono'] mt-1 uppercase tracking-widest">{project.subtitle}</p>
                </div>
                
                <div className="flex gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 hover:bg-[#f0ff00] text-white hover:text-black transition-colors skew-x-[-12deg]"
                    >
                      <FiExternalLink size={20} className="skew-x-[12deg]" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 hover:bg-[#f0ff00] text-white hover:text-black transition-colors skew-x-[-12deg]"
                    >
                      <FiGithub size={20} className="skew-x-[12deg]" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="skew-x-[4deg] mb-8">
                <p className="text-white/80 font-black font-['Space_Mono'] leading-tight italic uppercase text-lg">
                  {project.description}
                </p>
              </div>

              {/* Stack */}
              <div className="flex flex-wrap gap-3 skew-x-[4deg]">
                {project.stack.map(tech => (
                  <span
                    key={tech}
                    className="px-4 py-1 text-[10px] font-black font-['Space_Mono'] border-2 uppercase tracking-tighter"
                    style={{ color: project.color, borderColor: `${project.color}33` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Hover highlight overlay */}
              <div className="absolute inset-0 bg-[#f0ff00]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Navigation row - Skewed buttons */}
            <div className="flex items-center justify-between mt-8 px-1">
              <button
                onClick={prev}
                className="p-4 bg-white/5 border-2 border-white/10 hover:bg-white hover:text-black transition-all skew-x-[-12deg]"
              >
                <FiChevronLeft size={24} className="skew-x-[12deg]" />
              </button>

              {/* Custom indicators */}
              <div className="flex gap-3">
                {projects.map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-2 skew-x-[-20deg] transition-all duration-300"
                    style={{
                      backgroundColor: i === activeIndex ? project.color : 'rgba(255,255,255,0.1)',
                      boxShadow: i === activeIndex ? `0 0 15px ${project.color}` : 'none'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-4 bg-white/5 border-2 border-white/10 hover:bg-white hover:text-black transition-all skew-x-[-12deg]"
              >
                <FiChevronRight size={24} className="skew-x-[12deg]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)  scale(1); }
        }
      `}</style>
    </section>
  )
}
