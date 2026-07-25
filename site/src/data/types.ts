export type ExperienceRow = {
  img: string
  title: string
  company: string
  link: string
  dates: string
  location: string
  description: string
}

export type ProjectRow = {
  title: string
  subheader: string
  date: string
  img: string
  desc: string
  github: string
  link: string
  youtube: string
  devpost: string
}

export type IndieStatus = 'building' | 'live' | 'sunset'

export type IndieRow = {
  slug: string
  title: string
  one_liner: string
  status: IndieStatus
  started: string
  ended: string
  img: string
  description: string
  url: string
  github: string
  tech: string
  highlight: string
}
