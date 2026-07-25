import { useEffect, useRef, useState } from 'react'
import type { ProjectRow } from '../../data/types'
import { extractMadeWith } from '../../data/loadCsv'
import { AsciiHeading } from '../ascii/AsciiHeading'
import './Projects.css'

type Props = {
  items: ProjectRow[]
}

function ProjectDesc({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      if (expanded) return
      // Overflow means the clamp is hiding content.
      setClamped(el.scrollHeight > el.clientHeight + 1)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [text, expanded])

  if (!text) return null

  return (
    <div className="projects__desc-wrap">
      <p
        ref={ref}
        className={expanded ? 'projects__desc is-expanded' : 'projects__desc'}
      >
        {text}
      </p>
      {clamped || expanded ? (
        <button
          type="button"
          className="projects__more"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      ) : null}
    </div>
  )
}

export function Projects({ items }: Props) {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <section className="section projects" id="projects">
      <div className="section__inner">
        <AsciiHeading>Projects</AsciiHeading>
        <div className="projects__grid">
          {items.map((item, i) => {
            const { body, madeWith } = extractMadeWith(item.desc || '')
            const isHover = hover === i
            return (
              <article
                key={`${item.title}-${i}`}
                className={isHover ? 'projects__card is-hover' : 'projects__card'}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="projects__media">
                  {item.img ? (
                    <img src={`/img/projects/${item.img}`} alt="" loading="lazy" />
                  ) : (
                    <div className="projects__media-placeholder" />
                  )}
                  <div className="projects__scan" aria-hidden="true" />
                </div>
                <div className="projects__body">
                  <p className="projects__date">{item.date}</p>
                  <h3 className="projects__title">{item.title}</h3>
                  {item.subheader ? (
                    <p className="projects__sub">{item.subheader}</p>
                  ) : null}
                  <ProjectDesc text={body} />
                  {madeWith.length ? (
                    <p className="projects__made">{madeWith.join(' · ')}</p>
                  ) : null}
                  <div className="projects__links">
                    {item.github ? (
                      <a className="scan-link" href={item.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    ) : null}
                    {item.link ? (
                      <a className="scan-link" href={item.link} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    ) : null}
                    {item.youtube ? (
                      <a className="scan-link" href={item.youtube} target="_blank" rel="noreferrer">
                        YouTube
                      </a>
                    ) : null}
                    {item.devpost ? (
                      <a className="scan-link" href={item.devpost} target="_blank" rel="noreferrer">
                        Devpost
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
