/**
 * Parse a wiki entry's markdown into a structured object.
 *
 * Mirrors the logic in `scripts/build-wiki-index.ts` but adds the
 * layout-specific fields agents can declare:
 *
 *   **Layout:** cover-story
 *   **Hero:** /assets/spiral-jetty.jpg
 *   **Hero caption:** Looking north from the causeway, 1970.
 *   **Portrait:** /assets/holt-portrait.jpg
 *   **Pull:** *At times the lake rises and the coil disappears.* — Smithson, 1972
 *
 * Plus the inline `:::margin` directive blocks that some templates consume:
 *
 *   :::margin
 *   *A Smithson note: the site selects the work.*
 *   :::
 *
 * The parser is intentionally tolerant — agents writing markdown shouldn't
 * have to think about edge cases. Anything we can't classify falls back
 * into `sections` and the layout decides whether it cares.
 */

export type EntryMeta = Record<string, string>

export interface EntrySection {
  heading: string
  body: string
}

export interface EntryCaption {
  src: string
  alt?: string
  text: string
}

export interface EntryMarginNote {
  /** Index of the section this note attaches to (0-based, within `sections`) */
  sectionIndex: number
  /** Where in the section the note appeared (sequence order) */
  order: number
  body: string
}

export interface ParsedEntry {
  title: string
  isStarred: boolean
  meta: EntryMeta
  sections: EntrySection[]

  // Layout-specific fields hoisted from `meta` for convenience.
  layout?: string
  hero?: string
  heroCaption?: string
  portrait?: string
  pull?: string

  // Layout-specific structures parsed out of sections.
  /** Image + italic-caption pairs from a `## Captions` section. */
  captions?: EntryCaption[]
  /** Inline `:::margin ... :::` blocks, stripped from section bodies. */
  marginNotes?: EntryMarginNote[]

  /** Full original source, kept around so renderers can fall back. */
  raw: string
}

const HOISTED_KEYS = new Set([
  'Layout',
  'Hero',
  'Hero caption',
  'Portrait',
  'Pull',
])

/**
 * Strip `**X:**` bold-prefix metadata until the first `## section` heading.
 * Returns the metadata map and the index where sections begin.
 */
function parseMeta(lines: string[], startIndex: number): {
  meta: EntryMeta
  endIndex: number
} {
  const meta: EntryMeta = {}
  let cursor = startIndex
  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor]
    if (line.startsWith('## ')) break
    const m = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/)
    if (m) {
      meta[m[1].trim()] = m[2].trim()
    }
  }
  return { meta, endIndex: cursor }
}

/**
 * Walk the section bodies and split out `:::margin ... :::` blocks.
 * Returns the cleaned sections and the captured notes. Notes are tracked
 * by `sectionIndex` so the marginalia template can attach them to the
 * right section without needing a positional placeholder in the body.
 */
function extractMarginNotes(sections: EntrySection[]): {
  sections: EntrySection[]
  marginNotes: EntryMarginNote[]
} {
  const marginNotes: EntryMarginNote[] = []
  const cleaned = sections.map((section, sectionIndex) => {
    let order = 0
    const body = section.body.replace(
      /:::margin\s*\n([\s\S]*?)\n:::/g,
      (_, inner: string) => {
        marginNotes.push({
          sectionIndex,
          order: order++,
          body: inner.trim(),
        })
        // Collapse the directive to a paragraph break — the surrounding
        // prose stays correctly delimited and nothing leaks into render.
        return '\n\n'
      },
    )
    return { ...section, body: body.trim() }
  })
  return { sections: cleaned, marginNotes }
}

/**
 * Parse a `## Captions` section into image+italic-caption pairs.
 * Tolerates plain `![alt](src)` or `![](src)` followed by an italic line.
 */
function extractCaptions(sections: EntrySection[]): EntryCaption[] | undefined {
  const captionsSection = sections.find(
    (s) => s.heading.toLowerCase() === 'captions',
  )
  if (!captionsSection) return undefined

  const captions: EntryCaption[] = []
  const lines = captionsSection.body.split('\n')
  let pendingImg: { src: string; alt: string } | null = null

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      continue
    }
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (img) {
      // If we had a pending image with no caption, push it caption-less.
      if (pendingImg) {
        captions.push({ src: pendingImg.src, alt: pendingImg.alt, text: '' })
      }
      pendingImg = { alt: img[1], src: img[2] }
      continue
    }
    // Italic caption — anything between `*...*` (single asterisks).
    const italic = line.match(/^\*(.+)\*\s*$/)
    if (italic && pendingImg) {
      captions.push({
        src: pendingImg.src,
        alt: pendingImg.alt,
        text: italic[1].trim(),
      })
      pendingImg = null
      continue
    }
    // Plain prose acts as a caption too if there's a pending image.
    if (pendingImg) {
      captions.push({
        src: pendingImg.src,
        alt: pendingImg.alt,
        text: line,
      })
      pendingImg = null
    }
  }
  if (pendingImg) {
    captions.push({ src: pendingImg.src, alt: pendingImg.alt, text: '' })
  }
  return captions
}

export function parseEntryMarkdown(raw: string): ParsedEntry | null {
  const lines = raw.split('\n')

  const h1Index = lines.findIndex((l) => l.startsWith('# '))
  if (h1Index === -1) return null

  const titleRaw = lines[h1Index].slice(2).trim()
  const isStarred = /⭐/.test(titleRaw)
  const title = titleRaw.replace(/⭐/g, '').trim()

  const { meta, endIndex } = parseMeta(lines, h1Index + 1)

  // Walk sections.
  const sections: EntrySection[] = []
  let currentHeading: string | null = null
  let currentBody: string[] = []
  for (let i = endIndex; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('## ')) {
      if (currentHeading !== null) {
        sections.push({ heading: currentHeading, body: currentBody.join('\n').trim() })
      }
      currentHeading = line.slice(3).trim()
      currentBody = []
    } else if (currentHeading !== null) {
      currentBody.push(line)
    }
  }
  if (currentHeading !== null) {
    sections.push({ heading: currentHeading, body: currentBody.join('\n').trim() })
  }

  // Pull margin notes out of section bodies (they're rendered separately).
  const { sections: cleanedSections, marginNotes } = extractMarginNotes(sections)

  // Pull caption pairs out of a `## Captions` section if present.
  const captions = extractCaptions(cleanedSections)

  // Hoist convenience fields.
  const layout = meta['Layout'] || undefined
  const hero = meta['Hero'] || undefined
  const heroCaption = meta['Hero caption'] || undefined
  const portrait = meta['Portrait'] || undefined
  const pull = meta['Pull'] || undefined

  // Drop the hoisted keys from the rest of the meta so renderers don't
  // accidentally show them in a metadata strip.
  const restMeta: EntryMeta = {}
  for (const [k, v] of Object.entries(meta)) {
    if (!HOISTED_KEYS.has(k)) restMeta[k] = v
  }

  return {
    title,
    isStarred,
    meta: restMeta,
    sections: cleanedSections,
    layout,
    hero,
    heroCaption,
    portrait,
    pull,
    captions,
    marginNotes,
    raw,
  }
}

/**
 * Tiny formatter for metadata strips: returns the keys we'd actually want
 * shown, in a stable display order, ignoring layout-control keys.
 */
export const META_DISPLAY_ORDER = [
  'Status',
  'Confidence',
  'Focus',
  'Stage',
  'Era',
  'Audience',
  'Location',
  'Updated',
] as const
