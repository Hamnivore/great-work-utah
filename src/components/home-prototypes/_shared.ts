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
  // Cover stack for the current issue. Three "you've heard of these,"
  // three "you should have heard of these," two "wait, that's Utah?"
  { source: 'places_you_can_work', slug: 'sundance-institute' },
  { source: 'places_you_can_work', slug: 'recursion-pharmaceuticals' },
  { source: 'places_you_can_work', slug: 'fervo-energy' },
  { source: 'places_you_can_work', slug: 'blackrock-neurotech' },
  { source: 'places_you_can_work', slug: 'space-dynamics-laboratory' },
  { source: 'places_you_can_work', slug: 'intactis-bio' },
  { source: 'great_work', slug: 'telescope-array-ultra-high-energy-cosmic-rays' },
  // Next-up rotation when we publish the next issue:
  //   { source: 'places_you_can_work', slug: 'familysearch' },
  //   { source: 'great_work', slug: 'spiral-jetty' },
  //   { source: 'great_work', slug: 'capecchi-gene-targeting' },
  //   { source: 'great_work', slug: 'arpanet-fourth-node' },
  //   { source: 'great_work', slug: 'moxie-solid-oxide-electrolysis-stack' },
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

function optimizedRemoteImage(src: string, w: number, h: number): string {
  const localVariant = src.match(/^(\/img\/heroes\/front\/.+)-\d+\.webp$/)
  if (localVariant) {
    return `${localVariant[1]}-${w}.webp`
  }

  try {
    const url = new URL(src, 'https://great-work.local')

    if (url.hostname === 'picsum.photos') {
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[0] === 'seed' && parts.length >= 4) {
        parts[parts.length - 2] = String(w)
        parts[parts.length - 1] = String(h)
        url.pathname = `/${parts.join('/')}`
        return url.toString()
      }
      return `https://picsum.photos/${w}/${h}`
    }

    if (
      url.hostname === 'upload.wikimedia.org' &&
      url.pathname.startsWith('/wikipedia/commons/') &&
      !url.pathname.startsWith('/wikipedia/commons/thumb/')
    ) {
      const parts = url.pathname.split('/').filter(Boolean)
      const file = parts.at(-1)
      const hash = parts.at(-3)
      const bucket = parts.at(-2)
      if (file && hash && bucket) {
        return `${url.origin}/wikipedia/commons/thumb/${hash}/${bucket}/${file}/${w}px-${file}`
      }
    }
  } catch {
    return src
  }

  return src
}

export function responsiveImageSrcSet(
  src: string,
  widths: number[],
  aspectRatio: number,
): string {
  return widths
    .map((width) => {
      const height = Math.max(1, Math.round(width / aspectRatio))
      return `${optimizedRemoteImage(src, width, height)} ${width}w`
    })
    .join(', ')
}

export function heroImageFor(entry: Entry, w = 1600, h = 1100): string {
  const hero = entry.meta.Hero?.trim()
  if (hero) return optimizedRemoteImage(hero, w, h)
  return optimizedRemoteImage(`https://picsum.photos/seed/gw-${entry.slug}/${w}/${h}`, w, h)
}

export function heroImageSrcSetFor(
  entry: Entry,
  widths: number[],
  aspectRatio: number,
): string {
  const hero = entry.meta.Hero?.trim() || `https://picsum.photos/seed/gw-${entry.slug}/1600/1100`
  return responsiveImageSrcSet(hero, widths, aspectRatio)
}

const HERO_FOCAL_POINTS: Record<string, string> = {
  'blackrock-neurotech': '68% 44%',
  'fervo-energy': '38% 58%',
  'intactis-bio': '34% 67%',
  'recursion-pharmaceuticals': '62% 42%',
  'space-dynamics-laboratory': '58% 66%',
  'sundance-institute': '50% 48%',
  'telescope-array-ultra-high-energy-cosmic-rays': '58% 57%',
}

export function heroObjectPositionFor(entry: Entry | undefined): string {
  if (!entry) return '50% 50%'
  return HERO_FOCAL_POINTS[entry.slug] ?? '50% 50%'
}

/** True when the entry has a real, hand-curated hero (not a picsum seed). */
export function hasRealHero(entry: Entry): boolean {
  const hero = entry.meta.Hero?.trim()
  return !!hero && !hero.includes('picsum.photos')
}

/* ----------------------------------------------------------------------
 * Category-level imagery.
 *
 * `BrowseByCategory` (in SearchSticky.tsx) uses each category's top-tier
 * entry as the visual feature. When that top entry has a real, hand-
 * curated hero photograph, we use it (the entry's image *is* the
 * category's image). When it doesn't — most categories today, since
 * Jarvik-7 and Sundance are the only S-tier entries with real heroes —
 * we fall back to one of these category-level images so the panel
 * doesn't render a deterministic-but-arbitrary picsum landscape.
 *
 * Pick one iconic Utah image per category. Wikimedia Commons / NASA
 * public-domain photographs win when they exist; locally generated
 * editorial images live under /public/img/categories/ for the rest.
 * ---------------------------------------------------------------------- */

export const CATEGORY_IMAGES: Record<string, string> = {
  // NIH archival photograph of the Jarvik-7 (NHLBI image 3559) — public
  // domain via Wikimedia Commons. Same image as the Jarvik-7 venture
  // hero. The Medicine and Biology category is anchored by Utah's
  // medical-device lineage; the Jarvik-7 is its single most iconic
  // artifact. Wikimedia Commons hotlinks reliably; the Smithsonian's
  // IDS service was tried first but rejects browser referrers.
  'Medicine and Biology':
    'https://upload.wikimedia.org/wikipedia/commons/b/ba/Jarvik-7_Artificial_Heart_Image_3559-OT.jpg',
  // Bingham Canyon Mine, Salt Lake County (David Ratledge, CC BY 4.0).
  // The largest open-pit mine in the world, the deepest single industrial
  // hole in Utah's landscape — a one-image summary of the category.
  'Industry and Infrastructure':
    'https://upload.wikimedia.org/wikipedia/commons/0/0e/Bingham_Canyon_Mine_%282%29_-_Salt_Lake_County%2C_Utah_-_May_11%2C_2012.jpg',
  // AI-generated editorial illustration of a reconnaissance drone over
  // the Utah West Desert at golden hour. Synthetic, not a photograph;
  // the PNG carries explicit AI-generation metadata. Replace with a
  // license-clean photograph before production use.
  'Defense and Security': '/img/categories/defense-and-security.png',
  // Bonneville Salt Flats during the seasonal flood, with mountains
  // mirrored in the thin water layer (m01229, CC BY-SA 2.0). The most
  // recognizable Utah landscape photograph that isn't a national park.
  'Environment and Earth':
    'https://upload.wikimedia.org/wikipedia/commons/8/85/Looks_like_a_mirror%21_Bonneville_Salt_Flats%2C_flooded_%2828983556772%29.jpg',
  // The Utah Teapot (Finlay McWalter / POV-Ray render, public domain).
  // Modeled by Martin Newell at the University of Utah in 1975, the
  // single most-referenced object in computer graphics history. Low
  // resolution (300×243) but iconic enough to carry the category card.
  'Computing and Software':
    'https://upload.wikimedia.org/wikipedia/commons/a/ad/Utah_teapot.png',
  // AI-generated editorial illustration of a geothermal-style drilling
  // rig at twilight in a Utah high-desert basin. Synthetic, not a
  // photograph; the PNG carries explicit AI-generation metadata.
  // Replace with a license-clean photograph before production use.
  Energy: '/img/categories/energy.png',
  // SLS Flight Support Booster-2 ground test at Northrop Grumman's
  // Promontory, Utah facility, July 2022 (NASA Marshall, public domain).
  // Direct line of descent from Thiokol shuttle motors to Artemis.
  'Aerospace and Propulsion':
    'https://upload.wikimedia.org/wikipedia/commons/4/44/NASA%2C_Northrop_Grumman_Conduct_Flight_Support_Booster-2_Test_%2820220721_FSB2_1%29.jpeg',
  // Spiral Jetty from above (Retis via Flickr, CC BY 2.0). Robert
  // Smithson's earthwork on the north arm of the Great Salt Lake.
  'Culture and Arts':
    'https://upload.wikimedia.org/wikipedia/commons/a/a1/Robert_Smithson%2C_Spiral_Jetty%2C_1970_%2821237412439%29.jpg',
}

/**
 * Image to render on a category card. Prefers the top entry's real
 * hand-curated hero (so individual editorial decisions still win), then
 * falls back to the category-level image, then to a deterministic
 * picsum so prototypes never break.
 */
export function categoryImageFor(
  categoryName: string,
  feature: Entry | undefined,
  w = 420,
  h = 560,
): string {
  if (feature && hasRealHero(feature)) {
    return heroImageFor(feature, w, h)
  }
  const override = CATEGORY_IMAGES[categoryName]
  if (override) return optimizedRemoteImage(override, w, h)
  return optimizedRemoteImage(
    `https://picsum.photos/seed/gw-cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}/${w}/${h}`,
    w,
    h,
  )
}

export function categoryImageSrcSetFor(
  categoryName: string,
  feature: Entry | undefined,
  widths: number[],
  aspectRatio: number,
): string {
  if (feature && hasRealHero(feature)) {
    return heroImageSrcSetFor(feature, widths, aspectRatio)
  }
  const override =
    CATEGORY_IMAGES[categoryName] ||
    `https://picsum.photos/seed/gw-cat-${categoryName.toLowerCase().replace(/\s+/g, '-')}/420/560`
  return responsiveImageSrcSet(override, widths, aspectRatio)
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
