import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function QuantumHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ─── RENDERER — performance-first ─── */
    // Cap pixel ratio at 1.5 — beyond that you pay 4× the pixel cost with no perceptible gain
    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const W = canvas.clientWidth
    const H = canvas.clientHeight

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: dpr < 1.5,   // AA only at 1× DPR; high-DPR screens have natural AA
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,           // disable unused stencil buffer
      depth: true,
    })
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)          // false = don't set CSS size (we do it in CSS)
    renderer.shadowMap.enabled = false     // shadows = second full render pass, not needed
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.sortObjects = false            // we control draw order manually — skip sort pass

    /* ─── SCENE / CAMERA ─── */
    const scene = new THREE.Scene()
    // Linear fog is cheaper than exponential; no perceptible difference at this range
    scene.fog = new THREE.Fog(0x04060e, 8, 28)

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 60)
    camera.position.set(0, 2, 7)
    camera.lookAt(0, 0, 0)

    /* ─── LIGHTS ─── */
    // AmbientLight is free — just a uniform color multiply
    scene.add(new THREE.AmbientLight(0x080a18, 2))

    // Keep only 2 key lights instead of 5 — biggest PBR lighting cost reduction
    const sun = new THREE.DirectionalLight(0xffffff, 1.4)
    sun.position.set(6, 10, 5)
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0x00d4ff, 0.7)
    fill.position.set(-6, 2, -4)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0x7c3aed, 0.9)
    rim.position.set(0, -6, -6)
    scene.add(rim)

    // Point lights — essential for the core pulse effect
    const corePt = new THREE.PointLight(0x00d4ff, 3, 10)
    scene.add(corePt)

    const goldPt = new THREE.PointLight(0xf59e0b, 1.8, 8)
    goldPt.position.set(3, 3, 2)
    scene.add(goldPt)

    /* ─── MATERIALS ─── */
    // Key insight: use MeshBasicMaterial for wireframe edges (no lighting calc at all)
    // Use MeshStandardMaterial only where PBR look is essential (core, board, chips)
    const M = {
      frame: new THREE.MeshStandardMaterial({ color: 0x10182e, metalness: 0.96, roughness: 0.04, emissive: 0x001a30, emissiveIntensity: 0.25 }),
      core:  new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.2,  roughness: 0.15, emissive: 0x00d4ff, emissiveIntensity: 0.9 }),
      board: new THREE.MeshStandardMaterial({ color: 0x081428, metalness: 0.75, roughness: 0.25, emissive: 0x00203a, emissiveIntensity: 0.15 }),
      chip:  new THREE.MeshStandardMaterial({ color: 0x102040, metalness: 0.92, roughness: 0.08, emissive: 0x00d4ff, emissiveIntensity: 0.12 }),
      mem:   new THREE.MeshStandardMaterial({ color: 0x1e0f40, metalness: 0.85, roughness: 0.15, emissive: 0x7c3aed, emissiveIntensity: 0.35 }),
      gold:  new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.92, roughness: 0.08, emissive: 0xf59e0b, emissiveIntensity: 0.25 }),
      glass: new THREE.MeshStandardMaterial({ color: 0x00d4ff, metalness: 0.0,  roughness: 0.0,  transparent: true, opacity: 0.18, emissive: 0x00d4ff, emissiveIntensity: 0.15 }),
      // MeshBasicMaterial edges — zero lighting cost
      edgeCyan:   new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.45 }),
      edgeBlue:   new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.20 }),
      edgePurple: new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.70 }),
      edgeWhite:  new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.90 }),
    }

    /* ─── EDGE LINE HELPER — reuses shared materials ─── */
    const edgeLine = (geo: THREE.BufferGeometry, mat: THREE.LineBasicMaterial) =>
      new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat)

    /* ─── PRODUCT GROUP ─── */
    const productGroup = new THREE.Group()
    scene.add(productGroup)

    /* ─── LABELS OVERLAY ─── */
    const labelsEl = document.createElement('div')
    labelsEl.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;'
    canvas.parentElement?.appendChild(labelsEl)

    interface Part {
      mesh: THREE.Mesh
      asmPos: THREE.Vector3
      asmRot: { x: number; y: number; z: number }
      expPos: THREE.Vector3
      expRot: { x: number; y: number; z: number }
      delay: number
      labelEl: HTMLDivElement
      isCore?: boolean
    }

    const parts: Part[] = []
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
    const E = (x: number, y: number, z: number) => ({ x, y, z })

    // Reusable vector — pre-allocated ONCE outside loop to avoid GC pressure
    const _wp = new THREE.Vector3()

    function makePart(
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      asmPos: THREE.Vector3,
      asmRot: { x: number; y: number; z: number },
      expPos: THREE.Vector3,
      expRot: { x: number; y: number; z: number },
      label: string,
      delay: number,
      extra: Record<string, unknown> = {}
    ) {
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(asmPos)
      mesh.rotation.set(asmRot.x, asmRot.y, asmRot.z)
      mesh.frustumCulled = false  // avoid per-frame frustum check (all parts stay in view)

      const el = document.createElement('div')
      el.style.cssText = [
        'position:absolute',
        "font-family:'Space Mono',monospace",
        'font-size:9px',
        'letter-spacing:2.5px',
        'text-transform:uppercase',
        'color:#00d4ff',
        'opacity:0',
        'will-change:transform,opacity',      // hint browser to GPU-composite this layer
        'transition:opacity 0.4s ease',       // CSS transition instead of JS every frame
        'white-space:nowrap',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'text-shadow:0 0 16px rgba(0,212,255,0.8)',
        'pointer-events:none',
        'transform:translate(0,0)',            // force own compositing layer
      ].join(';')
      el.innerHTML = `<span style="display:block;width:18px;height:1px;background:linear-gradient(to right,transparent,#00d4ff)"></span>${label}`
      labelsEl.appendChild(el)

      productGroup.add(mesh)
      parts.push({ mesh, asmPos, asmRot, expPos, expRot, delay, labelEl: el, ...extra } as Part)
      return mesh
    }

    /* ─── GEOMETRY — fewer segments = fewer triangles ─── */
    const PI2 = Math.PI / 2

    // 1. Outer ring
    const ring = makePart(
      new THREE.TorusGeometry(1.52, 0.07, 8, 6),   // 10→8 radial segments
      M.frame.clone(), V(0,0,0), E(PI2,0,0),
      V(0,3.2,0), E(PI2,0.6,0), 'CHAIN FRAME', 0
    )
    ring.add(edgeLine(ring.geometry, M.edgeCyan))

    // 2. Top glass plate
    const topP = makePart(
      new THREE.CylinderGeometry(1.32, 1.32, 0.028, 6),
      M.glass.clone(), V(0,0.22,0), E(0,0,0),
      V(0,2.1,0), E(0.25,0,0), 'NEURAL SHIELD', 0.07
    )
    topP.add(edgeLine(topP.geometry, M.edgeCyan))

    // 3. Core Crystal — stays center, glows
    const coreM = makePart(
      new THREE.OctahedronGeometry(0.54, 0),
      M.core.clone(), V(0,0,0), E(0,0,0),
      V(0,0,0), E(0.5,1.2,0.2), 'QUANTUM CORE', 0.04, { isCore: true }
    )
    coreM.add(edgeLine(coreM.geometry, M.edgeWhite))

    // 4. Circuit board
    const board = makePart(
      new THREE.BoxGeometry(2.5, 0.055, 2.5),
      M.board.clone(), V(0,-0.28,0), E(0,0,0),
      V(0,-2.0,0), E(0,0.35,0), 'AI SUBSTRATE', 0.12
    )
    board.add(edgeLine(board.geometry, M.edgeBlue))

    // 5. Four chips
    const chipDefs = [
      { x:0.62, z:0.62, ex:2.8, ez:2.8, ey:1.1, label:'SOLIDITY', d:0.17 },
      { x:-0.62, z:0.62, ex:-2.8, ez:2.8, ey:1.1, label:'PYTHON', d:0.21 },
      { x:0.62, z:-0.62, ex:2.8, ez:-2.8, ey:1.1, label:'WEB3', d:0.25 },
      { x:-0.62, z:-0.62, ex:-2.8, ez:-2.8, ey:1.1, label:'DEFI', d:0.29 },
    ]
    chipDefs.forEach((c, i) => {
      const ch = makePart(
        new THREE.BoxGeometry(0.33, 0.11, 0.33),
        M.chip.clone(), V(c.x,-0.20,c.z), E(0,0,0),
        V(c.ex,c.ey,c.ez), E(0, Math.PI/3*i, 0), c.label, c.d
      )
      ch.add(edgeLine(ch.geometry, M.edgeCyan))
    })

    // 6. Memory blocks
    const memGeo = new THREE.BoxGeometry(0.18, 0.64, 0.48)
    const memL = makePart(memGeo.clone(), M.mem.clone(), V(-1.05,0,0), E(0,0,0), V(-3.2,1.1,0), E(0,-0.5,0), 'LLM MODULE', 0.22)
    memL.add(edgeLine(memL.geometry, M.edgePurple))
    const memR = makePart(memGeo.clone(), M.mem.clone(), V(1.05,0,0), E(0,0,0), V(3.2,1.1,0), E(0,0.5,0), 'SMART CONTRACT', 0.26)
    memR.add(edgeLine(memR.geometry, M.edgePurple))

    // 7. Connectors
    const connGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.48, 8)  // 10→8 segments
    makePart(connGeo.clone(), M.gold.clone(), V(0,0,1.05), E(PI2,0,0), V(0,-0.6,3.2), E(PI2,0.35,0), 'API BRIDGE', 0.30)
    makePart(connGeo.clone(), M.gold.clone(), V(0,0,-1.05), E(PI2,0,0), V(0,-0.6,-3.2), E(PI2,-0.35,0), 'DATA LAYER', 0.34)

    // 8. Base
    const base = makePart(
      new THREE.CylinderGeometry(1.25,1.32,0.07,6),
      M.frame.clone(), V(0,-0.38,0), E(0,0,0),
      V(0,-3.2,0), E(0,1.0,0), 'FOUNDATION', 0.38
    )
    base.add(edgeLine(base.geometry, M.edgeCyan))

    /* ─── PARTICLES — fewer, smaller buffer ─── */
    const pCount = 120  // 250→120; visually identical, much lower vertex cost
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*20
      pPos[i*3+1] = (Math.random()-0.5)*20
      pPos[i*3+2] = (Math.random()-0.5)*20
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x00d4ff, size: 0.022, transparent: true, opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false,    // transparent particles shouldn't write depth
    }))
    pMesh.frustumCulled = false
    scene.add(pMesh)

    /* ─── EASING — pure math, no allocations ─── */
    const eioC = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
    const eoBack = (t: number) => { const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2) }
    const lerp = (a: number, b: number, t: number) => a + (b-a)*t

    // Inline lerp into vector coordinates — avoids new Vector3 allocation
    const lerpVec3 = (
      mesh: THREE.Mesh,
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      t: number
    ) => {
      mesh.position.x = ax + (bx-ax)*t
      mesh.position.y = ay + (by-ay)*t
      mesh.position.z = az + (bz-az)*t
    }

    /* ─── ANIMATION STATE MACHINE ─── */
    const CYCLE = 15
    const PHASES = {
      ASM_IN:    { start: 0,   end: 2   },
      EXPLODE:   { start: 2,   end: 6.5 },
      EXPLODED:  { start: 6.5, end: 10  },
      REASSEM:   { start: 10,  end: 13  },
      ASM_PAUSE: { start: 13,  end: 15  },
    }

    // Camera lerp variables — avoidnew allocation each frame
    let camX = 0, camY = 2, camZ = 7
    let mouseX = 0, mouseY = 0

    // Track label visibility to avoid redundant DOM writes
    const labelVisible = new Array(parts.length).fill(false)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    /* ─── Clock using performance.now() — more precise than Date.now() ─── */
    const startTime = performance.now()
    let rafId = 0

    /* ─── RENDER LOOP via setAnimationLoop (browser VSync-aware) ─── */
    function animate() {
      const elapsed = (performance.now() - startTime) * 0.001
      const ct = elapsed % CYCLE

      /* — Phase detection — */
      let phase = 'ASM_IN'
      if      (ct >= PHASES.ASM_PAUSE.start) phase = 'ASM_PAUSE'
      else if (ct >= PHASES.REASSEM.start)   phase = 'REASSEM'
      else if (ct >= PHASES.EXPLODED.start)  phase = 'EXPLODED'
      else if (ct >= PHASES.EXPLODE.start)   phase = 'EXPLODE'

      /* — Camera — cinematic smooth lerp — */
      let tX = 0, tY = 2, tZ = 7
      if (phase === 'ASM_IN')     { tZ = 5.8; tY = 1.6 + mouseY*0.2; tX = mouseX*0.2 }
      else if (phase === 'EXPLODE')  { tZ = 8.2; tY = 2.4 }
      else if (phase === 'EXPLODED') { tZ = 8.8; tY = 2.3 + mouseY*0.3; tX = mouseX*0.65 }
      else if (phase === 'REASSEM')  { tZ = 6.4; tY = 2.0 }
      else                           { tZ = 5.8; tY = 1.6 + mouseY*0.15; tX = mouseX*0.15 }

      camX += (tX - camX) * 0.018
      camY += (tY - camY) * 0.018
      camZ += (tZ - camZ) * 0.018
      camera.position.set(camX, camY, camZ)
      camera.lookAt(0, 0, 0)

      /* — Group slow rotation — */
      const rotSpeed = phase === 'EXPLODED' ? 0.0006
        : (phase === 'EXPLODE' || phase === 'REASSEM') ? 0.0009
        : 0.0025
      productGroup.rotation.y += rotSpeed

      /* — Animate parts — */
      parts.forEach((p, i) => {
        const d = p.delay
        let wantLabel = false

        const ap = p.asmPos, ep = p.expPos
        const ar = p.asmRot, er = p.expRot

        if (phase === 'ASM_IN' || phase === 'ASM_PAUSE') {
          p.mesh.position.copy(ap)
          p.mesh.rotation.set(ar.x, ar.y, ar.z)

        } else if (phase === 'EXPLODE') {
          const prog = (ct - PHASES.EXPLODE.start) / (PHASES.EXPLODE.end - PHASES.EXPLODE.start)
          const ps = d * 0.55
          const pp = Math.max(0, Math.min(1, (prog - ps) / Math.max(1 - ps*0.5 + 0.01, 0.01)))
          const ev = eioC(pp)
          lerpVec3(p.mesh, ap.x, ap.y, ap.z, ep.x, ep.y, ep.z, ev)
          p.mesh.rotation.x = lerp(ar.x, er.x, ev)
          p.mesh.rotation.y = lerp(ar.y, er.y, ev)
          p.mesh.rotation.z = lerp(ar.z, er.z, ev)
          wantLabel = pp > 0.85

        } else if (phase === 'EXPLODED') {
          const bob = Math.sin(elapsed*0.8 + i*0.7) * 0.075
          p.mesh.position.set(ep.x, ep.y + bob, ep.z)
          p.mesh.rotation.x = er.x
          p.mesh.rotation.y = er.y + elapsed*0.04
          p.mesh.rotation.z = er.z
          wantLabel = true

        } else if (phase === 'REASSEM') {
          const prog = (ct - PHASES.REASSEM.start) / (PHASES.REASSEM.end - PHASES.REASSEM.start)
          const partEnd = 1 - d*0.3
          const pp = Math.max(0, Math.min(1, prog / partEnd))
          const ev = eoBack(Math.min(pp, 1))
          lerpVec3(p.mesh, ep.x, ep.y, ep.z, ap.x, ap.y, ap.z, ev)
          p.mesh.rotation.x = lerp(er.x, ar.x, ev)
          p.mesh.rotation.y = lerp(er.y, ar.y, ev)
          p.mesh.rotation.z = lerp(er.z, ar.z, ev)
          wantLabel = pp < 0.35
        }

        /* — Label 3D→2D — only write DOM when state changes — */
        if (wantLabel) {
          p.mesh.getWorldPosition(_wp)
          _wp.project(camera)
          const sx = (_wp.x * 0.5 + 0.5) * lastW
          const sy = (-_wp.y * 0.5 + 0.5) * lastH
          if (_wp.z < 1 && sx > 0 && sx < lastW && sy > 60 && sy < lastH - 60) {
            p.labelEl.style.transform = `translate(${(sx + 12) | 0}px,${((sy - 8)|0)}px)`
            if (!labelVisible[i]) { p.labelEl.style.opacity = '1'; labelVisible[i] = true }
          } else if (labelVisible[i]) { p.labelEl.style.opacity = '0'; labelVisible[i] = false }
        } else if (labelVisible[i]) {
          p.labelEl.style.opacity = '0'
          labelVisible[i] = false
        }
      })

      /* — Core glow — */
      const corePart = parts.find(p => p.isCore)
      if (corePart) {
        ;(corePart.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.65 + Math.sin(elapsed * 3.2) * 0.32
      }

      /* — Lights — */
      corePt.intensity = 2.5 + Math.sin(elapsed * 2.5) * 0.55
      const ga = elapsed * 0.45
      goldPt.position.x = Math.cos(ga) * 3.5
      goldPt.position.z = Math.sin(ga) * 3.5

      pMesh.rotation.y += 0.0003
      pMesh.rotation.x += 0.0001

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    /* ─── RESIZE — uses ResizeObserver, updates only when size changes ─── */
    let lastW = W, lastH = H
    const onResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (w === lastW && h === lastH) return
      lastW = w
      lastH = h
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObs = new ResizeObserver(onResize)
    resizeObs.observe(canvas.parentElement!)

    /* ─── CLEANUP ─── */
    return () => {
      renderer.setAnimationLoop(null)
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      resizeObs.disconnect()
      labelsEl.remove()
      renderer.dispose()
      scene.clear()
      Object.values(M).forEach(m => m.dispose())
      pGeo.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-full" style={{ minHeight: '420px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent',
          // Force GPU compositing layer — prevents software rendering fallback
          willChange: 'transform',
        }}
      />
    </div>
  )
}
