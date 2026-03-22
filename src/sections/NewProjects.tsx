import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink } from 'react-icons/fi'

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
    glowClass: 'cyan-glow'
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
    glowClass: 'purple-glow'
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
    glowClass: 'red-glow'
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
    glowClass: 'cyan-glow'
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
    glowClass: 'purple-glow'
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
    glowClass: 'red-glow'
  }
]

const projectIcons = ['⛓️', '🤖', '🌐', '📡', '⚡', '💡']

// Canvas frame animation constants
const totalFrames = 40
const framePrefix = 'ezgif-frame-'
const frameExtension = 'jpg'

function ProjectSVG({ color, index }: { color: string; index: number }) {
  const icon = projectIcons[index % projectIcons.length]
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ fontSize: '64px', filter: `drop-shadow(0 0 24px ${color})` }}
    >
      <span role="img" aria-label="project icon">{icon}</span>
    </div>
  )
}


export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const projectsContainerRef = useRef<HTMLDivElement>(null)
  // Store pre-baked OffscreenCanvas frames instead of raw HTMLImageElements
  const offscreenFrames = useRef<OffscreenCanvas[]>([])
  const [isPreloading, setIsPreloading] = useState(true)
  const [preloadProgress, setPreloadProgress] = useState(0)

  // Preload + pre-bake frames at 720p to avoid canvas resize on scroll
  useEffect(() => {
    const loadImages = async () => {
      // Determine target render size (720p max width for smooth scrub)
      const targetW = Math.min(window.innerWidth, 1280)
      const targetH = Math.round(targetW * (9 / 16))

      const frames: OffscreenCanvas[] = []

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image()
        img.src = `/frames/${framePrefix}${String(i).padStart(3, '0')}.${frameExtension}`
        await new Promise<void>(resolve => { img.onload = () => resolve() })

        // Pre-bake to OffscreenCanvas at display resolution
        // drawImage on scroll now just blits a pre-scaled bitmap — zero resize overhead
        const oc = new OffscreenCanvas(targetW, targetH)
        const octx = oc.getContext('2d')!
        octx.drawImage(img, 0, 0, targetW, targetH)
        frames.push(oc)

        setPreloadProgress((i / totalFrames) * 100)
      }

      offscreenFrames.current = frames

      // Size canvas once — never again during scroll
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width  = targetW
        canvas.height = targetH
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(frames[0], 0, 0)
      }

      setIsPreloading(false)
    }
    loadImages()
  }, [])

  // GSAP scroll animation
  useEffect(() => {
    if (isPreloading || offscreenFrames.current.length === 0) return

    const section = sectionRef.current
    const canvas = canvasRef.current
    const projectsContainer = projectsContainerRef.current
    if (!section || !canvas || !projectsContainer) return

    const ctx = canvas.getContext('2d')!
    const frames = offscreenFrames.current
    let lastFrameIndex = -1

    // Render function — only blits a pre-baked OffscreenCanvas, no resize
    const render = (index: number) => {
      if (index === lastFrameIndex) return   // skip if frame didn't change
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
        scrub: 1,              // scrub:1 instead of 0.5 — coarser but smoother feel
        onUpdate: self => {
          const frameIndex = Math.floor(self.progress * (totalFrames - 1))
          render(frameIndex)
        }
      }
    })

    tl.to(projectsContainer, {
      x: () => -(projectsContainer.scrollWidth - window.innerWidth),
      ease: 'none'
    }, 0)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isPreloading])

  return (
    <section id="projects" ref={sectionRef} className="relative h-screen w-full overflow-hidden">
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
            <p className="text-gray-400 mt-2">
              {Math.round(preloadProgress)}%
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <canvas ref={canvasRef} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute inset-0 w-full h-full flex items-center z-10" style={{ top: '15%' }}>
        <div ref={projectsContainerRef} className="flex gap-8 px-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`project-card glass-card rounded-3xl overflow-hidden w-[350px] md:w-[450px] flex-shrink-0 border-2 ${project.borderColor} ${project.glowClass}`}
              whileHover={{ y: -15, scale: 1.02 }}
            >
              <div
                className="h-48 md:h-56 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${project.color}15 0%, transparent 100%)` }}
              >
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <ProjectSVG color={project.color} index={index} />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h4 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold mb-1">
                  {project.title}
                </h4>
                <p className="text-gray-400 text-sm mb-4">{project.subtitle}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full glass"
                      style={{ color: project.color }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hoverable transition-colors"
                      style={{ color: project.color }}
                    >
                      <FiExternalLink />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors hoverable"
                    >
                      <FiGithub />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}