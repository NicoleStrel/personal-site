import { AsciiHeading } from '../ascii/AsciiHeading'
import './PastSites.css'

export function PastSites() {
  return (
    <section className="section past" id="past">
      <div className="section__inner">
        <AsciiHeading>Past personal sites</AsciiHeading>
        <p className="past__note">
          Earlier versions of this site, kept for the record.
        </p>
        <div className="past__row">
          <span className="past__year">2022</span>
          <a
            className="past__button"
            href="/past/2022/index.html"
            target="_blank"
            rel="noreferrer"
          >
            View 2022 site
          </a>
        </div>
      </div>
    </section>
  )
}
