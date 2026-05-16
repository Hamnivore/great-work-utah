import { getAllEntries } from './data'
import type { Entry } from './types'

const STOP_WORDS = new Set([
  'about',
  'after',
  'also',
  'and',
  'are',
  'can',
  'does',
  'for',
  'from',
  'give',
  'have',
  'how',
  'into',
  'like',
  'near',
  'show',
  'that',
  'the',
  'this',
  'utah',
  'what',
  'where',
  'which',
  'who',
  'why',
  'with',
  'work',
])

const TIER_WEIGHT: Record<Entry['tier'], number> = {
  S: 7,
  A: 5,
  B: 3,
  C: 1,
  D: 0,
  F: -2,
  'P-A': 4,
  'P-B': 2,
  'P-C': 1,
  unknown: 0,
}

export interface LocalSearchResult {
  entry: Entry
  score: number
  matchedTerms: string[]
}

export function localSearch(query: string, limit = 8): LocalSearchResult[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  return getAllEntries()
    .map((entry) => scoreEntry(entry, tokens))
    .filter((result): result is LocalSearchResult => result !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function localSearchMarkdown(query: string): string {
  const results = localSearch(query, 8)

  if (results.length === 0) {
    return [
      '**The live agent is unavailable, so this is the local wiki search fallback.**',
      '',
      `I could not find strong local matches for "${query}". Try a more specific company, sector, person, technology, county, or program name.`,
      '',
      '[Browse the full directory](/directory)',
    ].join('\n')
  }

  return [
    '**The live agent is unavailable, so this is the local wiki search fallback.**',
    '',
    'Here are the closest entries from the built-in wiki index:',
    '',
    ...results.map(({ entry, matchedTerms }) => {
      const terms =
        matchedTerms.length > 0 ? ` Match: ${matchedTerms.slice(0, 3).join(', ')}.` : ''
      const summary = entry.summary ? ` ${entry.summary}` : ''
      return `- [${entry.title}](/entry/${entry.source}/${entry.slug}) - ${entry.domain}.${summary}${terms}`
    }),
    '',
    '[Browse the full directory](/directory)',
  ].join('\n')
}

function scoreEntry(entry: Entry, tokens: string[]): LocalSearchResult | null {
  const title = entry.title.toLowerCase()
  const domain = entry.domain.toLowerCase()
  const summary = entry.summary.toLowerCase()
  const body = entrySearchText(entry)
  const matchedTerms: string[] = []
  let score = TIER_WEIGHT[entry.tier]

  for (const token of tokens) {
    let tokenScore = 0
    if (title.includes(token)) tokenScore += 15
    if (domain.includes(token)) tokenScore += 8
    if (summary.includes(token)) tokenScore += 5
    if (body.includes(token)) tokenScore += 2
    if (tokenScore > 0) {
      score += tokenScore
      matchedTerms.push(token)
    }
  }

  if (matchedTerms.length === 0) return null
  if (entry.isStarred) score += 3
  if (entry.isWatchlist) score += 1

  return { entry, score, matchedTerms }
}

function entrySearchText(entry: Entry): string {
  return [
    entry.title,
    entry.domain,
    entry.summary,
    Object.values(entry.meta).join(' '),
    ...entry.sections.map((section) => `${section.heading} ${section.body}`),
  ]
    .join(' ')
    .toLowerCase()
}

function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
    ),
  )
}
