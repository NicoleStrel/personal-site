import { useState } from 'react'
import type { ExperienceRow } from '../../data/types'
import { splitExperienceSections } from '../../data/loadCsv'
import { AsciiHeading } from '../ascii/AsciiHeading'
import { SignalField } from '../ascii/SignalField'
import './Experience.css'

type Props = {
  items: ExperienceRow[]
}

export function Experience({ items }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  return (
    <section className="section experience" id="experience">
      <div className="section__inner experience__grid">
        <div className="experience__list">
          <AsciiHeading>Experience</AsciiHeading>
          <ul className="experience__items">
            {items.map((item, i) => {
              const sections = splitExperienceSections(item.description)
              return (
                <li
                  key={`${item.company}-${item.dates}-${i}`}
                  className="experience__item"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                >
                  <div className="experience__meta">
                    <div className="experience__role-row">
                      {item.img ? (
                        <img
                          className="experience__logo"
                          src={`/img/exp/${item.img}`}
                          alt=""
                          width={36}
                          height={36}
                        />
                      ) : null}
                      <div>
                        <h3 className="experience__title">{item.title}</h3>
                        <a
                          className="experience__company scan-link"
                          href={item.link || undefined}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.company}
                        </a>
                      </div>
                    </div>
                    <p className="experience__dates">
                      {item.dates}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                  </div>
                  <div className="experience__body">
                    {sections.map((section, si) => (
                      <div key={`${section.title ?? 'sec'}-${si}`} className="experience__section">
                        {section.title ? (
                          <p className="experience__project">{section.title}</p>
                        ) : null}
                        <ul className="experience__bullets">
                          {section.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="experience__visual">
          <SignalField intensity={hoverIdx === null ? 0.35 : 0.75} />
        </div>
      </div>
    </section>
  )
}
