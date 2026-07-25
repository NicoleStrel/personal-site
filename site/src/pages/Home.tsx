import { useEffect, useState } from 'react'
import { loadExperience, loadIndieHacking, loadProjects } from '../data/loadCsv'
import type { ExperienceRow, IndieRow, ProjectRow } from '../data/types'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { CursorWake } from '../components/ascii/CursorWake'
import { AsciiPortraitStage } from '../components/ascii/AsciiPortraitStage'
import { Experience } from '../components/sections/Experience'
import { IndieHacking } from '../components/sections/IndieHacking'
import { Projects } from '../components/sections/Projects'
import { PastSites } from '../components/sections/PastSites'

export function Home() {
  const [experience, setExperience] = useState<ExperienceRow[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [indie, setIndie] = useState<IndieRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([loadExperience(), loadProjects(), loadIndieHacking()])
      .then(([exp, proj, ind]) => {
        if (cancelled) return
        setExperience(exp)
        setProjects(proj)
        setIndie(ind)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <CursorWake />
      <Nav />
      <main>
        <AsciiPortraitStage />
        {loading ? (
          <div className="loading-screen" role="status">
            Loading data…
          </div>
        ) : error ? (
          <div className="loading-screen" role="alert">
            {error}
          </div>
        ) : (
          <>
            <Experience items={experience} />
            <IndieHacking items={indie} />
            <Projects items={projects} />
            <PastSites />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
