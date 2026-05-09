import { getAllEntries, getEntry } from '../../lib/data'
import type { Entry, Source } from '../../lib/types'

/* ----------------------------------------------------------------------
 * Featured entries — the editor's picks each prototype draws from.
 *
 * The new front page is a magazine *issue*, not a phonebook. An issue
 * has a cover, a contents page, and a few featured stories. Everything
 * else is filed under "browse the directory."
 *
 * Order matters: the carousel uses this list top-down, so the entries
 * with real, license-clean hero photographs lead. Once more real
 * photos land in `wiki/ventures/`, promote them up the list and drop
 * the picsum-thematic placeholders below.
 *
 * These IDs are real entries from the wiki. If an entry is missing
 * from the build, the helpers below silently drop it and pick a
 * sensible fallback so prototypes never crash.
 * ---------------------------------------------------------------------- */

const FEATURED_IDS: Array<{ source: Source; slug: string }> = [
  // Real Wikimedia photographs (CC0 / CC BY 2.0 / CC BY-SA 4.0).
  { source: 'places_you_can_work', slug: 'familysearch' },
  { source: 'places_you_can_work', slug: 'sundance-institute' },
  { source: 'places_you_can_work', slug: 'space-dynamics-laboratory' },
  // Picsum-thematic placeholders, kept so the carousel still feels like
  // an issue rather than a triptych. Drop these as real photos arrive.
  { source: 'places_you_can_work', slug: 'recursion-pharmaceuticals' },
  { source: 'places_you_can_work', slug: 'fervo-energy' },
  { source: 'places_you_can_work', slug: 'blackrock-neurotech' },
  { source: 'great_work', slug: 'spiral-jetty' },
  { source: 'great_work', slug: 'capecchi-gene-targeting' },
]

/** Resolve the editor's picks to real entries, falling back to top S-tier. */
export function getFeaturedEntries(limit = 6): Entry[] {
  const out: Entry[] = []
  const seen = new Set<string>()

  for (const id of FEATURED_IDS) {
    const e = getEntry(id.source, id.slug)
    if (e) {
      out.push(e)
      seen.add(`${e.source}/${e.slug}`)
    }
    if (out.length >= limit) break
  }

  if (out.length < limit) {
    for (const e of getAllEntries()) {
      if (e.tier !== 'S' && e.tier !== 'A') continue
      const key = `${e.source}/${e.slug}`
      if (seen.has(key)) continue
      out.push(e)
      seen.add(key)
      if (out.length >= limit) break
    }
  }

  return out
}

/** The cover story for the issue — first featured entry. */
export function getCoverEntry(): Entry {
  const featured = getFeaturedEntries(1)
  return featured[0]
}

/* ----------------------------------------------------------------------
 * Pull-quote / mission extraction.
 * ---------------------------------------------------------------------- */

const QUOTE_HEADINGS = ['Mission', 'Why it matters', 'Why it mattered', 'What it was']

/**
 * Pull a single sentence we can blow up on a magazine cover. Prefers
 * the editorial `Pull:` line carried by the new prose-first wiki at
 * `wiki/ventures/`, then the Mission section (typically a single
 * declarative sentence), then the entry's summary. The Pull line is
 * already hand-tuned for cover use, so it wins when present.
 */
export function getCoverQuote(entry: Entry): string {
  const editorial = stripEditorialItalics(entry.meta.Pull)
  if (editorial) return editorial
  for (const h of QUOTE_HEADINGS) {
    const s = entry.sections.find(
      (sec) => sec.heading.toLowerCase() === h.toLowerCase(),
    )
    if (s?.body) return firstSentence(s.body)
  }
  return firstSentence(entry.summary || '')
}

/** `**Pull:**` lines in the wiki are wrapped in `*…*`; strip the asterisks. */
function stripEditorialItalics(s: string | undefined): string {
  if (!s) return ''
  return s.trim().replace(/^\*+|\*+$/g, '').trim()
}

/**
 * Editorial credit for the cover photograph, when one exists. Used to
 * satisfy CC BY / CC BY-SA attribution on real Wikimedia photos. The
 * `**Hero caption:**` line in `wiki/ventures/` already includes the
 * photographer + license; we just strip the surrounding italics.
 */
export function heroCaptionFor(entry: Entry): string {
  return stripEditorialItalics(entry.meta['Hero caption'])
}

export function firstSentence(text: string): string {
  const cleaned = (text || '').trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^.+?[.!?](?:\s|$)/)
  return (m ? m[0] : cleaned).trim()
}

/* ----------------------------------------------------------------------
 * Hero imagery — prefer the real, hand-edited photograph carried in the
 * new prose-first wiki at `wiki/ventures/<slug>.md` (the build script
 * overlays its `**Hero:**` line into `entry.meta.Hero`). Fall back to a
 * deterministic Picsum placeholder seeded by slug so prototypes never
 * crash and every entry has a stable image during the demo.
 *
 * The width/height args only apply to the picsum fallback; real photos
 * are served at their natural size and constrained by the layout.
 * ---------------------------------------------------------------------- */

export function heroImageFor(entry: Entry, w = 1600, h = 1100): string {
  const hero = entry.meta.Hero?.trim()
  if (hero) return hero
  return `https://picsum.photos/seed/gw-${entry.slug}/${w}/${h}`
}

/** True when the entry has a real, hand-curated hero (not a picsum seed). */
export function hasRealHero(entry: Entry): boolean {
  const hero = entry.meta.Hero?.trim()
  return !!hero && !hero.includes('picsum.photos')
}

/* ----------------------------------------------------------------------
 * Suggested questions — same set the old home used, plus a few sharper
 * ones that show the wiki has personality.
 * ---------------------------------------------------------------------- */

export const SUGGESTED_QUESTIONS: string[] = [
  "Senior engineers who'd join a hard-tech team in Utah",
  'Fractional CFOs available right now',
  'Investors who back deep tech in Utah',
  "Who's raised their hand this week?",
  "Utah's most surprising scientific moments",
  "What's the next Recursion?",
  "Who's making things in the desert?",
  "Show me a labyrinth I could fall into for an afternoon",
  "What was Utah doing in 1969 that mattered?",
  "Where would Capecchi work today?",
  "I'm a chemist. Where could I land softly?",
  "Geothermal, but explain it to me like I'm new",
]

/* ----------------------------------------------------------------------
 * "This issue" framing — the masthead furniture used by Issue / Marquee /
 * Dispatch. Editing one constant is enough to "publish a new issue."
 * ---------------------------------------------------------------------- */

export const ISSUE = {
  vol: 'Vol. I',
  number: 'No. 014',
  season: 'Spring 2026',
  dateline: 'SALT LAKE CITY · MAY 2026',
} as const

/* ----------------------------------------------------------------------
 * Non-link tier glyph.
 *
 * The shared `TierMark` is a `<Link>` to /tier-system, which means it
 * can't be nested inside another `<Link>` (an `<a>` inside an `<a>` is
 * an HTML hydration error). The home prototypes wrap entire cover blocks
 * in a single `<Link>`, so we use this tiny non-link visual instead.
 * ---------------------------------------------------------------------- */

export const TIER_GLYPH_CLASS: Record<string, string> = {
  S: 'text-orange',
  A: 'text-orange',
  B: 'text-twilight',
  C: 'text-twilight-soft',
  D: 'text-twilight-soft',
  F: 'text-ink-soft',
  'P-A': 'text-twilight',
  'P-B': 'text-twilight-soft',
  'P-C': 'text-twilight-soft',
  unknown: 'text-twilight-soft',
}

/** Used by the Credits prototype — every entry, in order of tier weight. */
export function getAllEntriesForCredits(): Entry[] {
  const tierOrder: Record<string, number> = {
    S: 0, A: 1, B: 2, 'P-A': 3, 'P-B': 4, 'P-C': 5, C: 6, D: 7, F: 8, unknown: 9,
  }
  return [...getAllEntries()].sort((a, b) => {
    const ta = tierOrder[a.tier] ?? 99
    const tb = tierOrder[b.tier] ?? 99
    if (ta !== tb) return ta - tb
    return a.title.localeCompare(b.title)
  })
}
