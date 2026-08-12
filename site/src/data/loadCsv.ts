import Papa from 'papaparse'
import type { ExperienceRow, IndieRow, ProjectRow } from './types'

function parseCsvText<T extends object>(text: string): T[] {
  const result = Papa.parse<T>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (value) => value.trim(),
  })
  return (result.data ?? []).filter((row) =>
    Object.values(row).some((v) => String(v ?? '').length > 0),
  )
}

async function fetchCsv<T extends object>(path: string): Promise<T[]> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`)
  }
  const text = await res.text()
  return parseCsvText<T>(text)
}

export function loadExperience(): Promise<ExperienceRow[]> {
  return fetchCsv<ExperienceRow>('/data/experience.csv')
}

export function loadProjects(): Promise<ProjectRow[]> {
  return fetchCsv<ProjectRow>('/data/projects.csv')
}

export function loadIndieHacking(): Promise<IndieRow[]> {
  return fetchCsv<IndieRow>('/data/indiehacking.csv')
}

export function splitBullets(description: string): string[] {
  if (!description) return []
  return description
    .split('--')
    .map((s) => s.replace(/:+$/, '').trim())
    .filter(Boolean)
}

/** Parse experience descriptions that use `Label:bullets--bullets:Label2:…` sections. */
export type ExpSection = {
  title?: string
  bullets: string[]
}

export function splitExperienceSections(description: string): ExpSection[] {
  if (!description) return []

  // Match "Project N (…):" style headings used in the CSV.
  const headingRe = /(Project\s+\d+\s*\([^)]*\))\s*:/gi
  const parts = description.split(headingRe).map((s) => s.trim()).filter(Boolean)

  if (parts.length === 1) {
    return [{ bullets: splitBullets(parts[0]) }]
  }

  const sections: ExpSection[] = []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (/^Project\s+\d+/i.test(part)) {
      const bullets = splitBullets(parts[i + 1] ?? '')
      sections.push({ title: part, bullets })
      i += 1
    } else {
      sections.push({ bullets: splitBullets(part) })
    }
  }
  return sections.filter((s) => s.bullets.length > 0 || s.title)
}

export function splitTech(tech: string): string[] {
  if (!tech) return []
  return tech
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function formatMonthYear(value: string): string | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return null
  const month = MONTH_NAMES[Number(match[2]) - 1]
  if (!month) return null
  return `${month} ${match[1]}`
}

export function formatIndieDates(started: string, ended: string): string | null {
  const start = formatMonthYear(started)
  if (!start) return null
  const end = ended ? formatMonthYear(ended) : 'Present'
  if (!end) return null
  return `${start} - ${end}`
}

export function splitImgs(img: string): string[] {
  if (!img) return []
  return img
    .split(/[|;]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function extractMadeWith(desc: string): { body: string; madeWith: string[] } {
  const marker = 'Made with:'
  const idx = desc.indexOf(marker)
  if (idx === -1) {
    return { body: desc.trim(), madeWith: [] }
  }
  const body = desc.slice(0, idx).trim()
  const madeWith = desc
    .slice(idx + marker.length)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return { body, madeWith }
}
