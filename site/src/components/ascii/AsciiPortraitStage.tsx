import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import sketchUrl from '../../assets/sketch.png'
import { SOCIALS } from '../../data/socials'
import {
  TONE_COLORS,
  isMobileViewport,
  prefersReducedMotion,
  sampleImageToCells,
  type DitherCell,
  type DitherTone,
} from '../../lib/dither'
import './AsciiPortraitStage.css'

type BurstParticle = {
  ox: number
  oy: number
  tx: number
  ty: number
  tone: DitherTone
}

function centerFaceOffset(wrap: HTMLElement, face: HTMLElement) {
  const inner = wrap.querySelector('.portrait-stage__inner') as HTMLElement | null
  if (!inner) return 0
  return Math.max(0, Math.round(inner.clientWidth / 2 - face.offsetWidth / 2 - 12))
}

/** Origins at the viewport/section corners & edges (pixel space). */
function assignScreenOrigins(count: number, w: number, h: number) {
  const pad = Math.max(w, h) * 0.15
  return Array.from({ length: count }, () => {
    const edge = Math.floor(Math.random() * 8)
    switch (edge) {
      case 0:
        return { ox: Math.random() * w, oy: -pad - Math.random() * pad }
      case 1:
        return { ox: Math.random() * w, oy: h + pad + Math.random() * pad }
      case 2:
        return { ox: -pad - Math.random() * pad, oy: Math.random() * h }
      case 3:
        return { ox: w + pad + Math.random() * pad, oy: Math.random() * h }
      case 4:
        return { ox: -pad - Math.random() * pad * 0.5, oy: -pad - Math.random() * pad * 0.5 }
      case 5:
        return { ox: w + pad + Math.random() * pad * 0.5, oy: -pad - Math.random() * pad * 0.5 }
      case 6:
        return { ox: -pad - Math.random() * pad * 0.5, oy: h + pad + Math.random() * pad * 0.5 }
      default:
        return { ox: w + pad + Math.random() * pad * 0.5, oy: h + pad + Math.random() * pad * 0.5 }
    }
  })
}

export function AsciiPortraitStage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const burstRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const faceRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<DitherCell[]>([])
  const particlesRef = useRef<BurstParticle[]>([])
  const progressRef = useRef(0)
  const dimsRef = useRef({ cols: 0, rows: 0, cellPx: 4 })
  const rafRef = useRef(0)
  const slideTlRef = useRef<gsap.core.Timeline | null>(null)
  const [bursting, setBursting] = useState(true)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const face = faceRef.current
    const copy = copyRef.current
    if (!wrap || !face || !copy) return
    if (prefersReducedMotion()) {
      gsap.set(copy, { autoAlpha: 1, y: 0 })
      setBursting(false)
      return
    }
    gsap.set(copy, { autoAlpha: 0, y: 20 })
  }, [])

  useEffect(() => {
    let cancelled = false
    const wrap = wrapRef.current
    const face = faceRef.current
    const copy = copyRef.current
    const canvas = canvasRef.current
    const burst = burstRef.current
    if (!wrap || !face || !copy || !canvas) return

    const reduced = prefersReducedMotion()
    const mobile = isMobileViewport()

    const paintFaceCanvas = () => {
      const { cols, rows, cellPx: s } = dimsRef.current
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const cssW = cols * s
      const cssH = rows * s
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      face.style.width = `${cssW}px`

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, cssW, cssH)
      const cells = cellsRef.current
      const gap = Math.max(1, Math.round(s * 0.12))
      const size = Math.max(1, s - gap)
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        ctx.fillStyle = TONE_COLORS[cell.tone]
        ctx.fillRect(
          cell.tx * s + Math.floor(gap / 2),
          cell.ty * s + Math.floor(gap / 2),
          size,
          size,
        )
      }
    }

    const slideIn = () => {
      if (reduced) {
        gsap.set(face, { x: 0, clearProps: 'transform' })
        gsap.set(copy, { autoAlpha: 1, y: 0 })
        return
      }

      // Mobile is a stacked layout — skip the desktop center→left slide.
      if (mobile) {
        gsap.set(face, { x: 0, clearProps: 'transform' })
        slideTlRef.current?.kill()
        const tl = gsap.timeline()
        slideTlRef.current = tl
        tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        return
      }

      slideTlRef.current?.kill()
      const tl = gsap.timeline()
      slideTlRef.current = tl
      tl.to(face, {
        x: 0,
        duration: 1,
        ease: 'power2.inOut',
        force3D: false,
        modifiers: {
          x: (v) => `${Math.round(parseFloat(v))}px`,
        },
      }).to(
        copy,
        { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.45',
      )
    }

    const img = new Image()
    img.src = sketchUrl
    img.onload = () => {
      if (cancelled) return

      const cols = mobile ? 80 : 128
      const { cells, cols: c, rows } = sampleImageToCells(img, {
        cols,
        invert: false,
        threshold: 0.16,
        accentChance: 0.14,
        dense: true,
      })
      cellsRef.current = cells

      const maxW = mobile
        ? Math.min(300, window.innerWidth * 0.78)
        : Math.min(420, window.innerWidth * 0.44)
      const cellPx = Math.max(3, Math.floor(maxW / c))
      dimsRef.current = { cols: c, rows, cellPx }

      const cssW = c * cellPx
      const cssH = rows * cellPx
      face.style.width = `${cssW}px`
      face.style.height = `${cssH}px`

      if (reduced || !burst) {
        paintFaceCanvas()
        setBursting(false)
        if (!reduced && !mobile) {
          gsap.set(face, { x: centerFaceOffset(wrap, face), force3D: false })
        }
        slideIn()
        return
      }

      // Desktop: park face in the center before measuring targets.
      // Mobile: face stays centered in the stacked layout.
      const shift = mobile ? 0 : centerFaceOffset(wrap, face)
      gsap.set(face, { x: shift, force3D: false })
      gsap.set(copy, { autoAlpha: 0, y: 20 })

      // Force layout so face targets match the final slot.
      void face.offsetWidth

      const wrapRect = wrap.getBoundingClientRect()
      const faceRect = face.getBoundingClientRect()
      const faceLeft = faceRect.left - wrapRect.left
      const faceTop = faceRect.top - wrapRect.top
      const stageW = wrap.clientWidth
      const stageH = wrap.clientHeight

      const origins = assignScreenOrigins(cells.length, stageW, stageH)
      particlesRef.current = cells.map((cell, i) => ({
        ox: origins[i].ox,
        oy: origins[i].oy,
        tx: faceLeft + cell.tx * cellPx,
        ty: faceTop + cell.ty * cellPx,
        tone: cell.tone,
      }))

      const dpr = Math.min(2, window.devicePixelRatio || 1)
      burst.width = Math.round(stageW * dpr)
      burst.height = Math.round(stageH * dpr)
      burst.style.width = `${stageW}px`
      burst.style.height = `${stageH}px`

      // Hide the small face canvas while particles fly across the stage.
      canvas.style.opacity = '0'

      const drawBurst = () => {
        const ctx = burst.getContext('2d')
        if (!ctx) return
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, stageW, stageH)
        const ease = 1 - Math.pow(1 - progressRef.current, 3)
        const gap = Math.max(1, Math.round(cellPx * 0.12))
        const size = Math.max(1, cellPx - gap)
        const particles = particlesRef.current

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const x = Math.round(p.ox + (p.tx - p.ox) * ease)
          const y = Math.round(p.oy + (p.ty - p.oy) * ease)
          ctx.fillStyle = TONE_COLORS[p.tone]
          ctx.fillRect(x + Math.floor(gap / 2), y + Math.floor(gap / 2), size, size)
        }
      }

      const start = performance.now()
      const duration = mobile ? 1400 : 1700

      const tick = (now: number) => {
        if (cancelled) return
        progressRef.current = Math.min(1, (now - start) / duration)
        drawBurst()
        if (progressRef.current < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          progressRef.current = 1
          drawBurst()
          paintFaceCanvas()
          canvas.style.opacity = '1'
          setBursting(false)
          slideIn()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      slideTlRef.current?.kill()
    }
  }, [])

  return (
    <section className="portrait-stage" ref={wrapRef} id="top" aria-label="Introduction">
      <canvas
        ref={burstRef}
        className="portrait-stage__burst"
        aria-hidden="true"
        hidden={!bursting}
      />
      <div className="portrait-stage__inner">
        <div className="portrait-stage__face" ref={faceRef}>
          <canvas
            ref={canvasRef}
            className="portrait-stage__canvas"
            aria-hidden="true"
          />
          <img
            src={sketchUrl}
            alt="Line portrait of Nicole Streltsov"
            className="portrait-stage__fallback"
            width={280}
            height={420}
          />
        </div>
        <div className="portrait-stage__copy" ref={copyRef}>
          <p className="portrait-stage__eyebrow">Software engineer · Toronto</p>
          <h1 className="portrait-stage__name">Nicole Streltsov</h1>
          <p className="portrait-stage__tagline">
            Building distributed systems by day, shipping indie experiments by night.
          </p>
          <ul className="portrait-stage__socials">
            {SOCIALS.map((s) => (
              <li key={s.href}>
                <a className="scan-link" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
