import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/dither'
import './CursorWake.css'

type Particle = {
  x: number
  y: number
  life: number
  size: number
  color: string
}

const COLORS = ['#1a1a1a', '#6e6e6e', '#7eb8d4']

export function CursorWake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let raf = 0
    let lastX = 0
    let lastY = 0
    let active = true

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (Math.hypot(dx, dy) < 6) return
      lastX = e.clientX
      lastY = e.clientY
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          life: 1,
          size: 2 + Math.random() * 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
      if (particles.length > 80) particles = particles.slice(-80)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const tick = () => {
      if (!active) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter((p) => p.life > 0.02)
      for (const p of particles) {
        p.life *= 0.92
        ctx.globalAlpha = p.life * 0.55
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      active = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="cursor-wake" aria-hidden="true" />
}
