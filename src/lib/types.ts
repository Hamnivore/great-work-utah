export type Tier =
  | 'S'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'F'
  | 'P-A'
  | 'P-B'
  | 'P-C'
  | 'unknown'

export type Source = 'great_work' | 'places_you_can_work'

export interface Section {
  heading: string
  body: string
}

export interface Entry {
  slug: string
  source: Source
  title: string
  tier: Tier
  isStarred: boolean
  isWatchlist: boolean
  domainSlug: string
  domain: string
  summary: string
  meta: Record<string, string>
  sections: Section[]
  rawPath: string
}

export interface WikiPayload {
  builtAt: string
  counts: Record<string, number>
  entries: Entry[]
}
