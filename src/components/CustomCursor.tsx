import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out'
      })
      
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'none'
      })
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    // Handle hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hoverable')
      ) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hoverable')
      ) {
        setIsHovering(false)
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isVisible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Busted cursor - Square design with glitch */}
      <div
        ref={cursorRef}
        className={`custom-cursor fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovering ? '60px' : '30px',
          height: isHovering ? '60px' : '30px',
          border: '3px solid #f0ff00',
          borderRadius: '0', // Square
          transform: `translate(-50%, -50%) rotate(${isHovering ? '45deg' : '0deg'})`,
          boxShadow: '0 0 20px #f0ff0066',
          mixBlendMode: 'normal',
        }}
      >
        {/* Inner crosshair lines */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#f0ff00] -translate-y-1/2 opacity-30" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[#f0ff00] -translate-x-1/2 opacity-30" />
      </div>
      
      {/* Center dot - more intense */}
      <div
        ref={cursorDotRef}
        className={`custom-cursor fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#ff6b00',
          borderRadius: '0',
          boxShadow: '0 0 15px #ff6b00',
        }}
      />
    </>
  )
}
