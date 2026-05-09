import type { Entry, Source, Tier, WikiPayload } from './types'
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
