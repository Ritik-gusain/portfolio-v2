import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'Indentron',
    subtitle: 'Smart Code Formatter',
    liveUrl: 'https://indentron.vercel.app',
    githubUrl: 'https://github.com/Ritik-gusain/indentron',
    stack: ['Node.js', 'Express.js', 'REST API', 'MVC', 'Jest', 'Vercel'],
    description: 'Full-stack web app formatting 12+ languages with VS Code dark UI, 6+ REST endpoints, file upload, code sharing, analytics.',
    color: '#00d9ff',
    borderColor: 'border-cyan-400',
    glowClass: 'cyan-glow',
    icon: '⛓️'
  },
  {
    id: 2,
    title: 'AI Chatbot',
    subtitle: 'OpenAI Powered',
    liveUrl: null,
    githubUrl: 'https://github.com/Ritik-gusain/chatbot',
    stack: ['Python', 'OpenAI API', 'Streamlit', 'Prompt Engineering'],
    description: 'Conversational AI chatbot with OpenAI API + Streamlit interface, applied prompt engineering for response quality control.',
    color: '#7b2cbf',
    borderColor: 'border-purple-500',
    glowClass: 'purple-glow',
    icon: '🤖'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    subtitle: 'This Site',
    liveUrl: 'https://ritikg-portfolio.vercel.app',
    githubUrl: null,
    stack: ['React', 'Three.js', 'GSAP', 'Framer Motion', 'Supabase'],
    description: 'This portfolio — 3D interactive site with cinematic Quantum Node hero, real-time visitor analytics, and full animation pipeline.',
    color: '#ff2a6d',
    borderColor: 'border-pink-500',
    glowClass: 'red-glow',
    icon: '🌐'
  },
  {
    id: 4,
    title: 'DisTof',
    subtitle: 'IEEE-Grade IoT Project',
    liveUrl: null,
    githubUrl: null,
    stack: ['IoT', 'ESP8266', 'VL53L0X', 'Flutter', 'WebSocket'],
    description: 'IEEE final-year project. VL53L0X ToF sensor with Kalman filtering, dual-threshold outlier rejection, and a Flutter app over WebSocket.',
    color: '#00d9ff',
    borderColor: 'border-cyan-400',
    glowClass: 'cyan-glow',
    icon: '📡'
  },
  {
    id: 5,
    title: 'AI Content Engine',
    subtitle: 'Fully Automated Pipeline',
    liveUrl: null,
    githubUrl: null,
    stack: ['Make.com', 'Gemini 2.5', 'Pollinations.ai', 'Buffer', 'RSS'],
    description: 'Automated X/Twitter content pipeline: Gemini 2.5 Flash + AI image gen + Buffer. RSS-triggered trend-hijack automation.',
    color: '#7b2cbf',
    borderColor: 'border-purple-500',
    glowClass: 'purple-glow',
    icon: '⚡'
  },
  {
    id: 6,
    title: 'LiFi Node',
    subtitle: 'Optical Data Transmission',
    liveUrl: null,
    githubUrl: null,
    stack: ['ESP32-C3', 'LiFi', 'C++', 'Hardware', 'Wireless'],
    description: 'ESP32-C3 optical data transmission via modulated LED light. Hardware-level networking on the bleeding edge of wireless comms.',
    color: '#ff2a6d',
    borderColor: 'border-pink-500',
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
  const offscreenFrames = useRef<OffscreenCanvas[]>([])
  const [isPreloading, setIsPreloading] = useState(true)
  const [preloadProgress, setPreloadProgress] = useState(0)

  // Sliding window state
  const [activeIndex, setActiveIndex] = useState(0)
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHovering = useRef(false)

  // Preload + pre-bake frames
  useEffect(() => {
    const loadImages = async () => {
      const targetW = Math.min(window.innerWidth / 2, 720)
      const targetH = Math.round(targetW * (9 / 16))

      const frames: OffscreenCanvas[] = []

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image()
        img.src = `/frames/${framePrefix}${String(i).padStart(3, '0')}.${frameExtension}`
        await new Promise<void>(resolve => { img.onload = () => resolve(); img.onerror = () => resolve() })

        const oc = new OffscreenCanvas(targetW, targetH)
        const octx = oc.getContext('2d')!
        octx.drawImage(img, 0, 0, targetW, targetH)
        frames.push(oc)

        setPreloadProgress((i / totalFrames) * 100)
      }

      offscreenFrames.current = frames

      const canvas = canvasRef.current
      if (canvas && frames.length > 0) {
        canvas.width = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(frames[0], 0, 0)
      }

      setIsPreloading(false)
    }
    loadImages()
  }, [])

  // GSAP scroll-scrub for frame animation
  useEffect(() => {
    if (isPreloading || offscreenFrames.current.length === 0) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d')!
    const frames = offscreenFrames.current
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

    // Sync card sliding with scroll progress
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
  }, [isPreloading])

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
      {/* Loading overlay */}
      {isPreloading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050810] z-20">
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-4 font-['Space_Grotesk']">
              Loading Projects
            </div>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300"
                style={{ width: `${preloadProgress}%` }}
              />
            </div>
            <p className="text-gray-400 mt-2">{Math.round(preloadProgress)}%</p>
          </div>
        </div>
      )}

      {/* Section title */}
      <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
        <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold gradient-text">
          Projects
        </h2>
      </div>

      {/* Main split layout */}
      <div className="absolute inset-0 flex items-center justify-center pt-16 z-10">
        {/* LEFT — Circle frame display */}
        <div className="w-1/2 flex items-center justify-center relative">
          {/* Outer glowing ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'min(45vw, 460px)',
              height: 'min(45vw, 460px)',
              background: `conic-gradient(from 0deg, #00d9ff, #7b2cbf, #ff2a6d, #00d9ff)`,
              filter: 'blur(2px)',
              opacity: 0.35,
              animation: 'spin 8s linear infinite'
            }}
          />
          {/* Inner ring border */}
          <div
            className="absolute rounded-full border-2 border-white/10"
            style={{
              width: 'min(43vw, 450px)',
              height: 'min(43vw, 450px)',
            }}
          />
          {/* Canvas clipped to circle */}
          <div
            className="relative overflow-hidden rounded-full shadow-2xl"
            style={{
              width: 'min(40vw, 420px)',
              height: 'min(40vw, 420px)',
              boxShadow: `0 0 60px 10px ${project.color}55`
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'box-shadow 0.5s ease'
              }}
            />
            {/* Overlay tint matching active project */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, transparent 40%, ${project.color}22 100%)`,
                transition: 'background 0.5s ease'
              }}
            />
          </div>

          {/* Orbit dots — 6 project indicators */}
          {projects.map((p, i) => {
            const angle = (i / projects.length) * 2 * Math.PI - Math.PI / 2
            const radius = 'min(23vw, 240px)'
            // Use inline style with calc
            const size = 230 // half of 460px approx
            const x = Math.cos(angle) * size
            const y = Math.sin(angle) * size
            return (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                title={p.title}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  width: i === activeIndex ? '44px' : '32px',
                  height: i === activeIndex ? '44px' : '32px',
                  borderRadius: '50%',
                  background: i === activeIndex ? p.color : 'rgba(255,255,255,0.08)',
                  border: `2px solid ${p.color}`,
                  boxShadow: i === activeIndex ? `0 0 18px 4px ${p.color}88` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: i === activeIndex ? '18px' : '14px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                  zIndex: 5
                }}
              >
                {p.icon}
              </button>
            )
          })}
        </div>

        {/* RIGHT — Sliding project card */}
        <div
          className="w-1/2 flex items-center justify-center"
          onMouseEnter={() => { isHovering.current = true }}
          onMouseLeave={() => { isHovering.current = false }}
        >
          <div className="relative w-full max-w-[480px] px-6">
            {/* Card */}
            <div
              key={project.id}
              className={`glass-card rounded-3xl overflow-hidden border-2 ${project.borderColor} ${project.glowClass}`}
              style={{
                animation: 'slideInRight 0.45s cubic-bezier(0.34,1.56,0.64,1)'
              }}
            >
              {/* Icon banner */}
              <div
                className="h-36 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${project.color}22 0%, transparent 100%)` }}
              >
                <span style={{ fontSize: '72px', filter: `drop-shadow(0 0 24px ${project.color})` }}>
                  {project.icon}
                </span>
                <div className="absolute top-4 right-4 flex gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full glass border border-white/10 hover:border-white/30 transition-all"
                      style={{ color: project.color }}
                    >
                      <FiExternalLink size={16} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full glass border border-white/10 hover:border-white/30 transition-all text-gray-300"
                    >
                      <FiGithub size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h4 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold mb-1" style={{ color: project.color }}>
                  {project.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4">{project.subtitle}</p>
                <p className="text-gray-300 mb-5 leading-relaxed text-sm md:text-base">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map(tech => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full glass"
                      style={{ color: project.color, border: `1px solid ${project.color}44` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation row */}
            <div className="flex items-center justify-between mt-5 px-1">
              <button
                onClick={prev}
                className="p-3 rounded-full glass border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
              >
                <FiChevronLeft size={20} />
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? '24px' : '8px',
                      height: '8px',
                      background: i === activeIndex ? project.color : 'rgba(255,255,255,0.2)',
                      boxShadow: i === activeIndex ? `0 0 8px 2px ${project.color}88` : 'none'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-3 rounded-full glass border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
              >
                <FiChevronRight size={20} />
              </button>
            </div>

            {/* Project counter */}
            <p className="text-center text-gray-500 text-xs mt-3">
              {activeIndex + 1} / {projects.length}
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
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