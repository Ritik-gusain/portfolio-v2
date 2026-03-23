import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function QuantumHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* ─── RENDERER — performance-first ─── */
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
    renderer.toneMappingExposure = 1.3
    renderer.sortObjects = false

    /* ─── SCENE / CAMERA ─── */
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x050810, 8, 28)

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 60)
    camera.position.set(0, 2, 7)
    camera.lookAt(0, 0, 0)

    /* ─── LIGHTS ─── */
    scene.add(new THREE.AmbientLight(0x080a18, 2.5))

    const sun = new THREE.DirectionalLight(0xffffff, 1.5)
    sun.position.set(6, 10, 5)
    scene.add(sun)

    const fill = new THREE.DirectionalLight(0xf0ff00, 0.8)
    fill.position.set(-6, 2, -4)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xff6b00, 1.0)
    rim.position.set(0, -6, -6)
    scene.add(rim)

    // Point lights — essential for the core pulse effect
    const corePt = new THREE.PointLight(0xf0ff00, 4, 12)
    scene.add(corePt)

    const blastPt = new THREE.PointLight(0xff2a6d, 2.5, 10)
    blastPt.position.set(3, 3, 2)
    scene.add(blastPt)

    /* ─── MATERIALS ─── */
    const M = {
      frame: new THREE.MeshStandardMaterial({ color: 0x1a1d23, metalness: 0.96, roughness: 0.04, emissive: 0x0a0c10, emissiveIntensity: 0.3 }),
      core:  new THREE.MeshStandardMaterial({ color: 0xf0ff00, metalness: 0.2,  roughness: 0.15, emissive: 0xf0ff00, emissiveIntensity: 1.2 }),
      board: new THREE.MeshStandardMaterial({ color: 0x050810, metalness: 0.8,  roughness: 0.2,  emissive: 0x101520, emissiveIntensity: 0.2 }),
      chip:  new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.95, roughness: 0.05, emissive: 0xf0ff00, emissiveIntensity: 0.15 }),
      mem:   new THREE.MeshStandardMaterial({ color: 0x1a0a00, metalness: 0.9,  roughness: 0.1,  emissive: 0xff6b00, emissiveIntensity: 0.5 }),
      gold:  new THREE.MeshStandardMaterial({ color: 0xff6b00, metalness: 0.95, roughness: 0.05, emissive: 0xff6b00, emissiveIntensity: 0.4 }),
      glass: new THREE.MeshStandardMaterial({ color: 0xf0ff00, metalness: 0.0,  roughness: 0.0,  transparent: true, opacity: 0.2, emissive: 0xf0ff00, emissiveIntensity: 0.2 }),
      edgeYellow: new THREE.LineBasicMaterial({ color: 0xf0ff00, transparent: true, opacity: 0.6 }),
      edgeOrange: new THREE.LineBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.6 }),
      edgeRed:    new THREE.LineBasicMaterial({ color: 0xff2a6d, transparent: true, opacity: 0.8 }),
      edgeWhite:  new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }),
    }

    /* ─── EDGE LINE HELPER ─── */
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
      mesh.frustumCulled = false

      const el = document.createElement('div')
      el.style.cssText = [
        'position:absolute',
        "font-family:'Space Mono',monospace",
        'font-size:9px',
        'font-weight:900',
        'letter-spacing:2.5px',
        'text-transform:uppercase',
        'color:#f0ff00',
        'opacity:0',
        'will-change:transform,opacity',
        'transition:opacity 0.4s ease',
        'white-space:nowrap',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'text-shadow:0 0 16px rgba(240,255,0,0.8)',
        'pointer-events:none',
        'transform:translate(0,0)',
      ].join(';')
      el.innerHTML = `<span style="display:block;width:18px;height:1px;background:linear-gradient(to right,transparent,#f0ff00)"></span>${label}`
      labelsEl.appendChild(el)

      productGroup.add(mesh)
      parts.push({ mesh, asmPos, asmRot, expPos, expRot, delay, labelEl: el, ...extra } as Part)
      return mesh
    }

    const PI2 = Math.PI / 2

    // 1. Outer ring
    const ring = makePart(
      new THREE.TorusGeometry(1.52, 0.07, 8, 6),
      M.frame.clone(), V(0,0,0), E(PI2,0,0),
      V(0,3.2,0), E(PI2,0.6,0), 'VIBE_FRAME', 0
    )
    ring.add(edgeLine(ring.geometry, M.edgeYellow))

    // 2. Top glass plate
    const topP = makePart(
      new THREE.CylinderGeometry(1.32, 1.32, 0.028, 6),
      M.glass.clone(), V(0,0.22,0), E(0,0,0),
      V(0,2.1,0), E(0.25,0,0), 'CHAOS_SHIELD', 0.07
    )
    topP.add(edgeLine(topP.geometry, M.edgeYellow))

    // 3. Core Crystal — stays center, glows
    const coreM = makePart(
      new THREE.OctahedronGeometry(0.54, 0),
      M.core.clone(), V(0,0,0), E(0,0,0),
      V(0,0,0), E(0.5,1.2,0.2), 'VIBE_CORE', 0.04, { isCore: true }
    )
    coreM.add(edgeLine(coreM.geometry, M.edgeWhite))

    // 4. Circuit board
    const board = makePart(
      new THREE.BoxGeometry(2.5, 0.055, 2.5),
      M.board.clone(), V(0,-0.28,0), E(0,0,0),
      V(0,-2.0,0), E(0,0.35,0), 'ANARCHY_SUBSTRATE', 0.12
    )
    board.add(edgeLine(board.geometry, M.edgeOrange))

    // 5. Four chips
    const chipDefs = [
      { x:0.62, z:0.62, ex:2.8, ez:2.8, ey:1.1, label:'SOL_BREACH', d:0.17 },
      { x:-0.62, z:0.62, ex:-2.8, ez:2.8, ey:1.1, label:'PY_CHAOS', d:0.21 },
      { x:0.62, z:-0.62, ex:2.8, ez:-2.8, ey:1.1, label:'WEB3_VOID', d:0.25 },
      { x:-0.62, z:-0.62, ex:-2.8, ez:-2.8, ey:1.1, label:'DEFI_EXPLOT', d:0.29 },
    ]
    chipDefs.forEach((c, i) => {
      const ch = makePart(
        new THREE.BoxGeometry(0.33, 0.11, 0.33),
        M.chip.clone(), V(c.x,-0.20,c.z), E(0,0,0),
        V(c.ex,c.ey,c.ez), E(0, Math.PI/3*i, 0), c.label, c.d
      )
      ch.add(edgeLine(ch.geometry, M.edgeYellow))
    })

    // 6. Memory blocks
    const memGeo = new THREE.BoxGeometry(0.18, 0.64, 0.48)
    const memL = makePart(memGeo.clone(), M.mem.clone(), V(-1.05,0,0), E(0,0,0), V(-3.2,1.1,0), E(0,-0.5,0), 'AI_MOD_v0.5', 0.22)
    memL.add(edgeLine(memL.geometry, M.edgeOrange))
    const memR = makePart(memGeo.clone(), M.mem.clone(), V(1.05,0,0), E(0,0,0), V(3.2,1.1,0), E(0,0.5,0), 'SMART_CONTRACT', 0.26)
    memR.add(edgeLine(memR.geometry, M.edgeOrange))

    // 7. Connectors
    const connGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.48, 8)
    makePart(connGeo.clone(), M.gold.clone(), V(0,0,1.05), E(PI2,0,0), V(0,-0.6,3.2), E(PI2,0.35,0), 'API_UPLINK', 0.30)
    makePart(connGeo.clone(), M.gold.clone(), V(0,0,-1.05), E(PI2,0,0), V(0,-0.6,-3.2), E(PI2,-0.35,0), 'DATA_LEAK', 0.34)

    // 8. Base
    const base = makePart(
      new THREE.CylinderGeometry(1.25,1.32,0.07,6),
      M.frame.clone(), V(0,-0.38,0), E(0,0,0),
      V(0,-3.2,0), E(0,1.0,0), 'PROTO_GRID', 0.38
    )
    base.add(edgeLine(base.geometry, M.edgeYellow))

    /* ─── PARTICLES ─── */
    const pCount = 150
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5)*20
      pPos[i*3+1] = (Math.random()-0.5)*20
      pPos[i*3+2] = (Math.random()-0.5)*20
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0xf0ff00, size: 0.025, transparent: true, opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    }))
    pMesh.frustumCulled = false
    scene.add(pMesh)

    /* ─── EASING ─── */
    const eioC = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
    const eoBack = (t: number) => { const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(t-1,3) + c1*Math.pow(t-1,2) }
    const lerp = (a: number, b: number, t: number) => a + (b-a)*t

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
    const CYCLE = 12 // Faster cycle
    const PHASES = {
      ASM_IN:    { start: 0,   end: 1.5 },
      EXPLODE:   { start: 1.5, end: 5.0 },
      EXPLODED:  { start: 5.0, end: 8.5 },
      REASSEM:   { start: 8.5, end: 10.5 },
      ASM_PAUSE: { start: 10.5, end: 12 },
    }

    let camX = 0, camY = 2, camZ = 7
    let mouseX = 0, mouseY = 0
    const labelVisible = new Array(parts.length).fill(false)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      mouseY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const startTime = performance.now()

    function animate() {
      const elapsed = (performance.now() - startTime) * 0.001
      const ct = elapsed % CYCLE

      let phase = 'ASM_IN'
      if      (ct >= PHASES.ASM_PAUSE.start) phase = 'ASM_PAUSE'
      else if (ct >= PHASES.REASSEM.start)   phase = 'REASSEM'
      else if (ct >= PHASES.EXPLODED.start)  phase = 'EXPLODED'
      else if (ct >= PHASES.EXPLODE.start)   phase = 'EXPLODE'

      let tX = 0, tY = 2, tZ = 7
      if (phase === 'ASM_IN')     { tZ = 5.5; tY = 1.6 + mouseY*0.25; tX = mouseX*0.25 }
      else if (phase === 'EXPLODE')  { tZ = 8.0; tY = 2.4 }
      else if (phase === 'EXPLODED') { tZ = 9.0; tY = 2.2 + mouseY*0.35; tX = mouseX*0.7 }
      else if (phase === 'REASSEM')  { tZ = 6.2; tY = 1.8 }
      else                           { tZ = 5.5; tY = 1.6 + mouseY*0.15; tX = mouseX*0.15 }

      camX += (tX - camX) * 0.02
      camY += (tY - camY) * 0.02
      camZ += (tZ - camZ) * 0.02
      camera.position.set(camX, camY, camZ)
      camera.lookAt(0, 0, 0)

      const rotSpeed = phase === 'EXPLODED' ? 0.001
        : (phase === 'EXPLODE' || phase === 'REASSEM') ? 0.0015
        : 0.003
      productGroup.rotation.y += rotSpeed

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
          const ps = d * 0.5
          const pp = Math.max(0, Math.min(1, (prog - ps) / Math.max(1 - ps*0.5 + 0.01, 0.01)))
          const ev = eioC(pp)
          lerpVec3(p.mesh, ap.x, ap.y, ap.z, ep.x, ep.y, ep.z, ev)
          p.mesh.rotation.x = lerp(ar.x, er.x, ev)
          p.mesh.rotation.y = lerp(ar.y, er.y, ev)
          p.mesh.rotation.z = lerp(ar.z, er.z, ev)
          wantLabel = pp > 0.8

        } else if (phase === 'EXPLODED') {
          const bob = Math.sin(elapsed*1.2 + i*0.8) * 0.1
          p.mesh.position.set(ep.x, ep.y + bob, ep.z)
          p.mesh.rotation.x = er.x
          p.mesh.rotation.y = er.y + elapsed*0.06
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
          wantLabel = pp < 0.3
        }

        if (wantLabel) {
          p.mesh.getWorldPosition(_wp)
          _wp.project(camera)
          const sx = (_wp.x * 0.5 + 0.5) * lastW
          const sy = (-_wp.y * 0.5 + 0.5) * lastH
          if (_wp.z < 1 && sx > 0 && sx < lastW && sy > 40 && sy < lastH - 40) {
            p.labelEl.style.transform = `translate(${(sx + 15) | 0}px,${((sy - 10)|0)}px)`
            if (!labelVisible[i]) { p.labelEl.style.opacity = '1'; labelVisible[i] = true }
          } else if (labelVisible[i]) { p.labelEl.style.opacity = '0'; labelVisible[i] = false }
        } else if (labelVisible[i]) {
          p.labelEl.style.opacity = '0'
          labelVisible[i] = false
        }
      })

      const corePart = parts.find(p => p.isCore)
      if (corePart) {
        ;(corePart.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          1.0 + Math.sin(elapsed * 4) * 0.5
      }

      corePt.intensity = 3.5 + Math.sin(elapsed * 3) * 1.5
      pMesh.rotation.y += 0.0005
      pMesh.rotation.x += 0.0002

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

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

    return () => {
      renderer.setAnimationLoop(null)
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
    <div className="relative w-full h-full" style={{ minHeight: '440px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          background: 'transparent',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
