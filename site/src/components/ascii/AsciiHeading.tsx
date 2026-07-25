import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../../lib/dither'
import './AsciiHeading.css'

const CHARSET = '░▒▓█/<>-_\\[]{}—=+*^?#________'

type Props = {
  children: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

export function AsciiHeading({ children, as: Tag = 'h2', className = '' }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [display, setDisplay] = useState(children)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      setDisplay(children)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        const target = children
        const len = target.length
        let frame = 0
        const total = 18 + len

        const id = window.setInterval(() => {
          frame++
          const revealed = Math.floor((frame / total) * len)
          let out = ''
          for (let i = 0; i < len; i++) {
            if (target[i] === ' ') {
              out += ' '
            } else if (i < revealed) {
              out += target[i]
            } else {
              out += CHARSET[Math.floor(Math.random() * CHARSET.length)]
            }
          }
          setDisplay(out)
          if (frame >= total) {
            setDisplay(target)
            clearInterval(id)
          }
        }, 28)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [children])

  return (
    <Tag ref={ref} className={`ascii-heading ${className}`.trim()}>
      {display}
    </Tag>
  )
}
