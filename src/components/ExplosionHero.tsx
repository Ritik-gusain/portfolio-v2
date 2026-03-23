import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ExplosionHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: dpr < 1.5,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    })
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050810, 5, 25)

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.set(0, 0, 8)

    // Lights - High intensity for explosion feel
    scene.add(new THREE.AmbientLight(0x101010, 1))
    
    const burstLight = new THREE.PointLight(0xff6b00, 10, 15)
    scene.add(burstLight)

    const topLight = new THREE.DirectionalLight(0xf0ff00, 1.5)
    topLight.position.set(0, 10, 0)
    scene.add(topLight)

    /* ─── MATERIALS ─── */
    const M = {
      core: new THREE.MeshStandardMaterial({ 
        color: 0xff6b00, 
        emissive: 0xff3300, 
        emissiveIntensity: 2,
        metalness: 0.8,
        roughness: 0.2
      }),
      shell: new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        metalness: 1, 
        roughness: 0.1,
        transparent: true,
        opacity: 0.9
      }),
      spike: new THREE.MeshStandardMaterial({ 
        color: 0xf0ff00, 
        emissive: 0xf0ff00, 
        emissiveIntensity: 1 
      }),
      line: new THREE.LineBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.5 }),
    }

    const group = new THREE.Group()
    scene.add(group)

    // Parts for explosion
    const parts: { mesh: THREE.Mesh | THREE.LineSegments, originalPos: THREE.Vector3, velocity: THREE.Vector3, axis: THREE.Vector3 }[] = []

    // Create a shattered sphere effect
    const geo = new THREE.IcosahedronGeometry(2, 1)
    const posAttr = geo.getAttribute('position')
    
    for (let i = 0; i < posAttr.count; i += 3) {
      const v1 = new THREE.Vector3().fromBufferAttribute(posAttr, i)
      const v2 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1)
      const v3 = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2)
      
      const triangleGeo = new THREE.BufferGeometry().setFromPoints([v1, v2, v3])
      triangleGeo.computeVertexNormals()
      
      const mesh = new THREE.Mesh(triangleGeo, M.shell.clone())
      const center = new THREE.Vector3().add(v1).add(v2).add(v3).divideScalar(3)
      
      mesh.position.copy(center)
      triangleGeo.translate(-center.x, -center.y, -center.z)
      
      const velocity = center.clone().normalize().multiplyScalar(Math.random() * 5 + 2)
      const axis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      
      group.add(mesh)
      parts.push({ mesh, originalPos: center.clone(), velocity, axis })

      // Add edge lines
      const edges = new THREE.EdgesGeometry(triangleGeo)
      const line = new THREE.LineSegments(edges, M.line)
      mesh.add(line)
    }

    // Central core
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), M.core)
    group.add(core)

    // Particles
    const pCount = 500
    const pPos = new Float32Array(pCount * 3)
    const pVel = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3] = (Math.random() - 0.5) * 10
      pPos[i*3+1] = (Math.random() - 0.5) * 10
      pPos[i*3+2] = (Math.random() - 0.5) * 10
      pVel[i*3] = pPos[i*3] * 0.1
      pVel[i*3+1] = pPos[i*3+1] * 0.1
      pVel[i*3+2] = pPos[i*3+2] * 0.1
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xff6b00, size: 0.05, transparent: true, blending: THREE.AdditiveBlending })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    let mouseX = 0, mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    const startTime = performance.now()
    const CYCLE = 4 // Much faster cycle
    
    function animate() {
      const elapsed = (performance.now() - startTime) * 0.001
      const t = (elapsed % CYCLE) / CYCLE

      // Animation logic: 0-0.1: Charge, 0.1-0.2: BURST, 0.2-0.8: Drift, 0.8-1.0: Snap back
      let intensity = 0
      let explosionFactor = 0

      if (t < 0.1) {
        // Charging
        intensity = t * 10
        explosionFactor = -t * 2
        core.scale.setScalar(1 + t * 5)
      } else if (t < 0.2) {
        // BURST
        const bt = (t - 0.1) * 10
        intensity = 10 * (1 - bt)
        explosionFactor = bt * 10
        core.scale.setScalar(1.5 - bt * 0.5)
        burstLight.intensity = 20 * (1 - bt)
      } else if (t < 0.8) {
        // Drift
        const dt = (t - 0.2) / 0.6
        explosionFactor = 10 * (1 - dt * 0.5)
        intensity = 0.5
        core.rotation.y += 0.05
      } else {
        // Snap back
        const st = (t - 0.8) * 5
        explosionFactor = 5 * (1 - st)
        intensity = st * 2
      }

      parts.forEach((p, _i) => {
        const targetPos = p.originalPos.clone().add(p.velocity.clone().multiplyScalar(explosionFactor * 0.2))
        p.mesh.position.lerp(targetPos, 0.1)
        p.mesh.rotateOnAxis(p.axis, 0.05 * explosionFactor)
        
        // Color shift based on explosion
        const mat = p.mesh.material as THREE.MeshStandardMaterial
        mat.emissive.setHSL(0.05, 1, 0.5 * (explosionFactor / 10))
        mat.emissiveIntensity = explosionFactor * 0.5
      })

      // Update particles
      const positions = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < pCount; i++) {
        if (t < 0.2 && t > 0.1) {
           // Reset particles on burst
           positions[i*3] = 0
           positions[i*3+1] = 0
           positions[i*3+2] = 0
        }
        positions[i*3] += pVel[i*3] * (explosionFactor + 1) * 0.1
        positions[i*3+1] += pVel[i*3+1] * (explosionFactor + 1) * 0.1
        positions[i*3+2] += pVel[i*3+2] * (explosionFactor + 1) * 0.1

        // Wrap around
        if (Math.abs(positions[i*3]) > 20) positions[i*3] = 0
        if (Math.abs(positions[i*3+1]) > 20) positions[i*3+1] = 0
        if (Math.abs(positions[i*3+2]) > 20) positions[i*3+2] = 0
      }
      pGeo.attributes.position.needsUpdate = true

      // Camera shake
      camera.position.x = Math.sin(elapsed * 50) * intensity * 0.05 + mouseX * 2
      camera.position.y = Math.cos(elapsed * 50) * intensity * 0.05 + mouseY * 2
      camera.lookAt(0, 0, 0)

      group.rotation.y += 0.005
      group.rotation.x += 0.002

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObs = new ResizeObserver(onResize)
    resizeObs.observe(canvas.parentElement!)

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('mousemove', onMouseMove)
      resizeObs.disconnect()
      renderer.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
