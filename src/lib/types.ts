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

export const PUBLIC_WIKI_SOURCES = [
  'ventures',
  'people',
  'helpers',
  'resources',
  'work',
  'guides',
  'matches',
  'answers',
  'sources',
] as const

export type PublicWikiSource = (typeof PUBLIC_WIKI_SOURCES)[number]
export type LegacySourceAlias = 'great_work' | 'places_you_can_work'
export type Source = PublicWikiSource | LegacySourceAlias

export interface Section {
  heading: string
  body: string
}

export interface Entry {
  slug: string
  source: PublicWikiSource
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

export interface SectorNavigation {
  currentIndex: number
  totalInSector: number
  previousEntry?: Entry
  nextEntry?: Entry
  previousSector?: {
    name: string
    count: number
    firstEntry: Entry
  }
  nextSector?: {
    name: string
    count: number
    firstEntry: Entry
  }
}

export interface WikiPayload {
  builtAt: string
  counts: Record<string, number>
  sourceCounts: Partial<Record<PublicWikiSource, number>>
  entries: Entry[]
}
