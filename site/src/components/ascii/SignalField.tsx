import { useEffect, useRef } from 'react'
import { BAYER_8, prefersReducedMotion } from '../../lib/dither'
import './SignalField.css'

type Props = {
  intensity?: number
  className?: string
}

/** Low-FPS Bayer signal field for the Experience side panel. */
export function SignalField({ intensity = 0.35, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const intensityRef = useRef(intensity)
  const scrollRef = useRef(0)

  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let visible = true
    let t = 0
    const reduced = prefersReducedMotion()

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0.05 },
    )
    io.observe(wrap)

    const updateScroll = () => {
      const section = document.getElementById('experience')
      if (!section) return
      const rect = section.getBoundingClientRect()
      const view = window.innerHeight || 1
      const start = view * 0.85
      const end = -rect.height + view * 0.25
      const raw = (start - rect.top) / (start - end || 1)
      scrollRef.current = Math.min(1, Math.max(0, raw))
    }
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)

    let last = 0
    const fps = reduced ? 4 : 12

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      if (now - last < 1000 / fps) return
      last = now
      t += 0.04 + scrollRef.current * 0.02

      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const cell = 6
      const cols = Math.ceil(w / cell)
      const rows = Math.ceil(h / cell)
      ctx.clearRect(0, 0, w, h)

      const boost = intensityRef.current
      const drift = scrollRef.current * Math.PI * 2

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave =
            0.5 +
            0.5 *
              Math.sin(x * 0.18 + t + drift) *
              Math.cos(y * 0.14 - t * 0.7 + drift * 0.35)
          const bay = BAYER_8[y % 8][x % 8]
          const v = wave * (0.45 + boost * 0.55)
          if (v < bay * 0.85) continue

          const roll = (x * 17 + y * 31 + Math.floor(t * 3)) % 40
          if (roll === 0) {
            ctx.fillStyle = '#6eb8dc'
          } else if (v > 0.72) {
            ctx.fillStyle = '#1a1a1a'
          } else {
            ctx.fillStyle = '#6e6e6e'
          }
          const gap = 1.2
          ctx.fillRect(x * cell + gap, y * cell + gap, cell - gap * 2, cell - gap * 2)
        }
      }
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`signal-field ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
