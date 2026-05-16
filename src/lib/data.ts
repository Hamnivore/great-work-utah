import type { Entry, SectorNavigation, Source, Tier, WikiPayload } from './types'
import payload from '../data/generated/all.json'

const data = payload as unknown as WikiPayload

const bySlug = new Map<string, Entry>()
for (const entry of data.entries) {
  bySlug.set(`${entry.source}/${entry.slug}`, entry)
}

export function getAllEntries(): Entry[] {
  return data.entries
}

export function getEntry(source: Source, slug: string): Entry | undefined {
  return bySlug.get(`${source}/${slug}`)
}

export function getCounts(): Record<string, number> {
  return data.counts
}

export function getEntriesBySource(source: Source): Entry[] {
  return data.entries.filter((e) => e.source === source)
}

export function getRelated(entry: Entry, limit = 4): Entry[] {
  const sameDomain = data.entries.filter(
    (e) =>
      e.source === entry.source &&
      e.domainSlug === entry.domainSlug &&
      e.slug !== entry.slug &&
      (e.tier === 'S' || e.tier === 'A' || e.tier === 'B'),
  )
  return sameDomain.slice(0, limit)
}

function byTitle(a: Entry, b: Entry): number {
  return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
}

export function getSectorNavigation(entry: Entry): SectorNavigation {
  const sourceEntries = data.entries.filter((e) => e.source === entry.source)
  const sectorEntries = sourceEntries
    .filter((e) => e.domainSlug === entry.domainSlug)
    .sort(byTitle)
  const currentIndex = Math.max(
    0,
    sectorEntries.findIndex((e) => e.slug === entry.slug),
  )

  const sectorMap = new Map<string, Entry[]>()
  for (const candidate of sourceEntries) {
    const existing = sectorMap.get(candidate.domainSlug)
    if (existing) {
      existing.push(candidate)
    } else {
      sectorMap.set(candidate.domainSlug, [candidate])
    }
  }

  const sectors = Array.from(sectorMap.entries())
    .map(([slug, entries]) => {
      const sortedEntries = [...entries].sort(byTitle)
      return {
        slug,
        name: sortedEntries[0]?.domain ?? slug,
        count: sortedEntries.length,
        firstEntry: sortedEntries[0],
      }
    })
    .filter((sector): sector is {
      slug: string
      name: string
      count: number
      firstEntry: Entry
    } => Boolean(sector.firstEntry))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

  const sectorIndex = sectors.findIndex((sector) => sector.slug === entry.domainSlug)
  const previousSector = sectorIndex > 0 ? sectors[sectorIndex - 1] : undefined
  const nextSector =
    sectorIndex >= 0 && sectorIndex < sectors.length - 1 ? sectors[sectorIndex + 1] : undefined

  return {
    currentIndex: currentIndex + 1,
    totalInSector: sectorEntries.length,
    previousEntry: currentIndex > 0 ? sectorEntries[currentIndex - 1] : undefined,
    nextEntry:
      currentIndex >= 0 && currentIndex < sectorEntries.length - 1
        ? sectorEntries[currentIndex + 1]
        : undefined,
    previousSector: previousSector
      ? {
          name: previousSector.name,
          count: previousSector.count,
          firstEntry: previousSector.firstEntry,
        }
      : undefined,
    nextSector: nextSector
      ? {
          name: nextSector.name,
          count: nextSector.count,
          firstEntry: nextSector.firstEntry,
        }
      : undefined,
  }
}

const TIER_LABELS: Record<Tier, string> = {
  S: 'World-changing. Sets the benchmark others aim for.',
  A: 'Excellent and proven. Strong impact with clear evidence.',
  B: 'Solid and promising. Good impact with room to grow.',
  C: 'Early-stage. Interesting signal, insufficient track record.',
  D: 'Unproven. Weak signal or insufficient evidence.',
  F: 'Not aligned. Harmful, extractive, or counter to our mission.',
  'P-A': 'Speculative — high potential. Worth tracking closely.',
  'P-B': 'Speculative — moderate potential. On the watchlist.',
  'P-C': 'Speculative — low signal. Long shot, but interesting.',
  unknown: 'Tier not yet assigned.',
}

export function tierLabel(tier: Tier): string {
  return TIER_LABELS[tier]
}
