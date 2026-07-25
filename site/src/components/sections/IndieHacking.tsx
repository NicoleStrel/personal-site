import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { IndieRow } from '../../data/types'
import { splitBullets, splitImgs, splitTech } from '../../data/loadCsv'
import { AsciiHeading } from '../ascii/AsciiHeading'
import { prefersReducedMotion } from '../../lib/dither'
import './IndieHacking.css'

type Props = {
  items: IndieRow[]
}

const MOSAIC_LAYOUT = [
  { w: 48, h: 42, x: 8, y: 12 },
  { w: 36, h: 34, x: 52, y: 8 },
  { w: 40, h: 38, x: 42, y: 48 },
  { w: 32, h: 30, x: 10, y: 58 },
  { w: 28, h: 26, x: 68, y: 62 },
]

function visitLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Visit site'
  }
}

function isLogoImg(src: string) {
  return /icon|logo/i.test(src)
}

type MosaicTile = {
  key: string
  src: string
  projectIndex: number
  label: string
}

function buildMosaicTiles(items: IndieRow[]): MosaicTile[] {
  const tiles: MosaicTile[] = []
  items.forEach((item, projectIndex) => {
    const imgs = splitImgs(item.img)
    if (!imgs.length) {
      tiles.push({
        key: `${item.slug || item.title}-empty`,
        src: '',
        projectIndex,
        label: item.title,
      })
      return
    }
    imgs.forEach((src) => {
      tiles.push({
        key: `${item.slug || item.title}-${src}`,
        src,
        projectIndex,
        label: item.title,
      })
    })
  })
  return tiles.slice(0, MOSAIC_LAYOUT.length)
}

export function IndieHacking({ items }: Props) {
  const [active, setActive] = useState(0)
  const [activeTile, setActiveTile] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  const current = items[active] ?? items[0]
  const mosaicTiles = useMemo(() => buildMosaicTiles(items), [items])
  const expandedTile = expanded !== null ? mosaicTiles[expanded] : null

  useEffect(() => {
    if (!items.length) return
    setActive(0)
    setActiveTile(0)
    setExpanded(null)
  }, [items])

  useEffect(() => {
    if (expanded === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(null)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [expanded])

  if (!items.length) {
    return (
      <section className="section indie" id="indie">
        <div className="section__inner">
          <AsciiHeading>Indie Hacking</AsciiHeading>
          <p className="indie__empty">Add entries in shared/data/indiehacking.csv</p>
        </div>
      </section>
    )
  }

  const bullets = splitBullets(current.description)
  const tech = splitTech(current.tech)

  return (
    <section className="section indie" id="indie">
      <div className="section__inner indie__grid">
        <div className="indie__mosaic">
          {mosaicTiles.map((tile, i) => {
            const layout = MOSAIC_LAYOUT[i]
            const isActive = i === activeTile
            const logo = tile.src ? isLogoImg(tile.src) : false
            return (
              <motion.button
                type="button"
                key={tile.key}
                className={[
                  'indie__tile',
                  isActive ? 'is-active' : '',
                  logo ? 'indie__tile--logo' : 'indie__tile--shot',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  width: `${layout.w}%`,
                  height: `${layout.h}%`,
                  left: `${layout.x}%`,
                  top: `${layout.y}%`,
                  zIndex: isActive ? 5 : 1 + i,
                }}
                initial={reduced ? false : { opacity: 0, x: -24 + i * 8, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                onClick={() => {
                  setActiveTile(i)
                  setActive(tile.projectIndex)
                  if (tile.src) setExpanded(i)
                }}
                aria-label={`Expand ${tile.label} image`}
                aria-expanded={expanded === i}
              >
                {tile.src ? (
                  <motion.img
                    layoutId={
                      reduced || expanded === i ? undefined : `indie-img-${tile.key}`
                    }
                    src={`/img/indiehacking/${tile.src}`}
                    alt=""
                    style={expanded === i ? { opacity: 0 } : undefined}
                  />
                ) : (
                  <span className="indie__tile-label">{tile.label.slice(0, 2)}</span>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="indie__detail">
          <AsciiHeading>Indie Hacking</AsciiHeading>
          <div className="indie__status-row">
            <span className={`indie__status indie__status--${current.status}`}>
              {current.status}
            </span>
            {current.highlight ? (
              <span className="indie__highlight">{current.highlight}</span>
            ) : null}
          </div>
          <h3 className="indie__title">
            {current.url ? (
              <a href={current.url} target="_blank" rel="noreferrer">
                {current.title}
              </a>
            ) : (
              current.title
            )}
          </h3>
          <p className="indie__one-liner">{current.one_liner}</p>
          <ul className="indie__bullets">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {tech.length ? (
            <ul className="indie__tech">
              {tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}
          <div className="indie__links">
            {current.url ? (
              <a className="indie__visit" href={current.url} target="_blank" rel="noreferrer">
                {visitLabel(current.url)} →
              </a>
            ) : null}
            {current.github ? (
              <a className="scan-link" href={current.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
          </div>
          {items.length > 1 ? (
            <div className="indie__picker" role="tablist" aria-label="Indie projects">
              {items.map((item, i) => (
                <button
                  key={item.slug || item.title}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={i === active ? 'is-active' : undefined}
                  onClick={() => {
                    setActive(i)
                    const firstTile = mosaicTiles.findIndex((t) => t.projectIndex === i)
                    if (firstTile >= 0) setActiveTile(firstTile)
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {expandedTile?.src ? (
          <motion.div
            className="indie__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${expandedTile.label} preview`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={() => setExpanded(null)}
          >
            <button
              type="button"
              className="indie__lightbox-close"
              onClick={() => setExpanded(null)}
              aria-label="Close preview"
            >
              Close
            </button>
            <motion.div
              className={[
                'indie__lightbox-frame',
                isLogoImg(expandedTile.src) ? 'is-logo' : 'is-shot',
              ].join(' ')}
              initial={reduced ? false : { scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduced ? undefined : { scale: 0.96, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                layoutId={reduced ? undefined : `indie-img-${expandedTile.key}`}
                src={`/img/indiehacking/${expandedTile.src}`}
                alt={`${expandedTile.label} screenshot`}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
