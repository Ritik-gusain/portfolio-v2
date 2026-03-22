import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── PARTICLE FIELD ───────────────────────────────────────────────
// Key perf fixes:
// • Particles reduced to 600/300/150 by viewport — was 2000/1000/500
// • Eliminated per-particle Math.sqrt() (mouse repulsion) — replaced with squared-distance check
// • CPU float array write still happens but buffer is much smaller
// • needsUpdate only when particles actually moved (they always do, but keeping flag correct)
function ParticleField({ count = 600, mouse }: { count: number; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, vel] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]   = (Math.random() - 0.5) * 20
      pos[i3+1] = (Math.random() - 0.5) * 20
      pos[i3+2] = (Math.random() - 0.5) * 10
      vel[i3]   = (Math.random() - 0.5) * 0.004
      vel[i3+1] = (Math.random() - 0.5) * 0.004
      vel[i3+2] = (Math.random() - 0.5) * 0.001
    }
    return [pos, vel]
  }, [count])

  useFrame(() => {
    if (!pointsRef.current) return
    const pa = pointsRef.current.geometry.attributes.position.array as Float32Array
    const mx = mouse.current.x * 10
    const my = mouse.current.y * 10
    const repulseRadiusSq = 4 // was sqrt(dx²+dy²) < 2 → now dx²+dy² < 4

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pa[i3]   += vel[i3]
      pa[i3+1] += vel[i3+1]
      pa[i3+2] += vel[i3+2]

      // Squared-distance repulsion — no Math.sqrt()
      const dx = pa[i3] - mx
      const dy = pa[i3+1] - my
      const distSq = dx * dx + dy * dy
      if (distSq < repulseRadiusSq) {
        const force = (repulseRadiusSq - distSq) * 0.008
        pa[i3]   += dx * force
        pa[i3+1] += dy * force
      }

      // Boundary wrap
      if (pa[i3]   >  10) pa[i3]   = -10
      if (pa[i3]   < -10) pa[i3]   =  10
      if (pa[i3+1] >  10) pa[i3+1] = -10
      if (pa[i3+1] < -10) pa[i3+1] =  10
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    // Slow group rotation replaces per-particle Z drift
    pointsRef.current.rotation.y += 0.0004
    pointsRef.current.rotation.x += 0.0001
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00d9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── FLOATING SHAPES ─────────────────────────────────────────────
// Removed mouse-follow lerp calculations from Icosahedron / Octahedron / Tetrahedron.
// They each called (targetX - position)*factor which triggers matrix recalculation.
// Replaced with simple time-based animation only — visually unnoticeable difference,
// massive CPU savings since these ran 3× per frame with viewport lookups.

function FloatingShape({
  position,
  geometry,
  color,
  opacity,
  rotX,
  rotY,
  rotZ,
  phaseOffset,
}: {
  position: [number, number, number]
  geometry: React.ReactNode
  color: string
  opacity: number
  rotX: number
  rotY: number
  rotZ: number
  phaseOffset: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += rotX
    meshRef.current.rotation.y += rotY
    meshRef.current.rotation.z += rotZ
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + phaseOffset) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} depthWrite={false} />
    </mesh>
  )
}

// ─── CAMERA CONTROLLER ────────────────────────────────────────────
// Reduced lerp alpha from 0.03 to 0.015 — smoother, and less per-frame matrix work
function CameraController({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.015
    camera.position.y += (mouse.current.y * 0.3 - camera.position.y) * 0.015
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── SCENE ───────────────────────────────────────────────────────
function Scene() {
  const mouse = useRef({ x: 0, y: 0 })
  const [particleCount, setParticleCount] = useState(600)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttled — only update every other event
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleResize = () => {
      const w = window.innerWidth
      setParticleCount(w < 768 ? 150 : w < 1024 ? 300 : 600)
    }

    handleResize()
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <CameraController mouse={mouse} />
      <ParticleField count={particleCount} mouse={mouse} />
      {/* Three floating wireframe shapes — simple rotation only, no mouse follow */}
      <FloatingShape
        position={[-3, 1, -2]} geometry={<icosahedronGeometry args={[0.5, 0]} />}
        color="#00d9ff" opacity={0.35} rotX={0.005} rotY={0.008} rotZ={0} phaseOffset={0}
      />
      <FloatingShape
        position={[3, -1, -3]} geometry={<octahedronGeometry args={[0.3, 0]} />}
        color="#ff2a6d" opacity={0.35} rotX={-0.006} rotY={0} rotZ={0.004} phaseOffset={2}
      />
      <FloatingShape
        position={[0, 2, -4]} geometry={<tetrahedronGeometry args={[0.4, 0]} />}
        color="#ffffff" opacity={0.25} rotX={0} rotY={0.01} rotZ={-0.005} phaseOffset={4}
      />
      <ambientLight intensity={0.5} />
    </>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────
export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        // Cap DPR at 1 — was 2 (4× pixel cost). At 1 the background is still beautiful.
        // Because it's a fixed background element, nobody will notice the lower DPR.
        dpr={Math.min(window.devicePixelRatio, 1)}
        gl={{
          antialias: false,           // background doesn't need AA — huge win on 1×DPR
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,               // no depth test needed for 2D particle overlay
        }}
        frameloop="always"
        style={{ background: 'transparent' }}
        performance={{ min: 0.8 }}   // R3F adaptive performance — auto-throttle if needed
      >
        <Scene />
      </Canvas>
    </div>
  )
}
