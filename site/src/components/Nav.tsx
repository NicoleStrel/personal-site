import { useEffect, useState } from 'react'
import './Nav.css'

const LINKS = [
  { href: '#experience', label: 'Experience' },
  { href: '#indie', label: 'Indie' },
  { href: '#projects', label: 'Projects' },
  { href: '#past', label: 'Past' },
]

export function Nav() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) {
          setActive(visible.target.id)
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.3, 0.6] },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="site-nav">
      <a className="site-nav__brand" href="#top">
        <img
          className="site-nav__mark"
          src="/favicon.svg"
          alt=""
          width={22}
          height={22}
        />
        <span>Nicole Streltsov</span>
      </a>
      <nav className="site-nav__links" aria-label="Primary">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={
              active === link.href.slice(1) ? 'site-nav__link is-active' : 'site-nav__link'
            }
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
