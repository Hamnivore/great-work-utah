/**
 * Reads Sam's legacy mini-wiki (symlinked at ./legacy_wiki) and emits a single normalized
 * JSON artifact at src/data/generated/all.json that the React app consumes.
 *
 * Parses the bold-prefix header convention documented in
 * docs/wiki-architecture.md (NOT YAML frontmatter).
 */
import fs from 'node:fs/promises'
import path from 'node:path'

// ---------- Types ----------

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'P-A' | 'P-B' | 'P-C' | 'unknown'
type Source = 'great_work' | 'places_you_can_work'

interface Section {
  heading: string
  body: string
}

interface Entry {
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

// ---------- Constants ----------

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const LEGACY_WIKI_ROOT = path.join(REPO_ROOT, 'legacy_wiki')
const NEW_WIKI_ROOT = path.join(REPO_ROOT, 'wiki')
const OUT_DIR = path.join(REPO_ROOT, 'src/data/generated')
const OUT_FILE = path.join(OUT_DIR, 'all.json')

const SOURCES: Source[] = ['great_work', 'places_you_can_work']

/**
 * Editorial fields the new prose-first wiki at `wiki/` carries that the
 * legacy research wiki does not (yet). When a slug exists in both trees,
 * we copy these onto the legacy entry so the magazine layout can render
 * a real hero image with attribution and a hand-picked pull-quote.
 */
const OVERLAY_FIELDS = ['Hero', 'Hero caption', 'Pull'] as const
const OVERLAY_DIRS = ['ventures', 'work'] as const

// Folders we never read content from
const SKIP_FOLDERS = new Set([
  'agent_ops',
  'editorial_passes',
  '_messy_thoughts',
  'prompts',
  'scripts',
  '.git',
  '.agents',
  '.claude',
  '.codex',
])

// Files we never treat as entries
const SKIP_FILE_PATTERNS = [
  /^README\.md$/i,
  /^_/, // _messy_thoughts.md and friends
  /^EDITORIAL_PLAN\.md$/i,
  /^PLAN\.md$/i,
  /^sams-notes\.md$/i,
]

// ---------- Helpers ----------

function slugify(filename: string): string {
  return filename.replace(/^⭐/, '').replace(/\.md$/i, '')
}

function humanizeDomain(domainSlug: string): string {
  return domainSlug
    .split('-')
    .map((word) => {
      if (word === 'and') return 'and'
      if (word === 'of') return 'of'
      return word[0]?.toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function parseTier(tierLine: string): Tier {
  const trimmed = tierLine.trim()
  const speculative = trimmed.match(/^(P-A|P-B|P-C)\b/i)
  if (speculative) return speculative[1].toUpperCase() as Tier
  const main = trimmed.match(/^([SABCDF])\b/)
  if (main) return main[1] as Tier
  return 'unknown'
}

function firstSentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  const match = cleaned.match(/^.+?[.!?](?:\s|$)/)
  return (match ? match[0] : cleaned).trim()
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (SKIP_FOLDERS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (SKIP_FILE_PATTERNS.some((re) => re.test(entry.name))) continue
      yield full
    }
  }
}

// ---------- Parser ----------

function parseEntry(content: string, opts: { rawPath: string; source: Source; domainSlug: string }): Entry | null {
  const lines = content.split('\n')

  // H1 title
  const h1Index = lines.findIndex((l) => l.startsWith('# '))
  if (h1Index === -1) return null
  const titleRaw = lines[h1Index].slice(2).trim()
  const isStarred = /⭐/.test(titleRaw)
  const title = titleRaw.replace(/⭐/g, '').trim()

  // Bold-prefix metadata until first ## section
  const meta: Record<string, string> = {}
  let cursor = h1Index + 1
  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor]
    if (line.startsWith('## ')) break
    const m = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/)
    if (m) {
      meta[m[1].trim()] = m[2].trim()
    }
  }

  // Sections
  const sections: Section[] = []
  let currentHeading: string | null = null
  let currentBody: string[] = []
  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor]
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

  const tier = parseTier(meta['Tier'] ?? meta['Speculative tier'] ?? '')
  const isWatchlist = tier.startsWith('P-')

  // Summary: first sentence of mission-shaped section, fall back to Domain field
  const missionSection = sections.find((s) => /^(Mission|What it was|Overview)$/i.test(s.heading))
  let summary = ''
  if (missionSection?.body) {
    summary = firstSentence(missionSection.body).replace(/\*\*/g, '')
  } else if (meta['Domain']) {
    summary = meta['Domain']
  }

  const slug = slugify(path.basename(opts.rawPath))
  return {
    slug,
    source: opts.source,
    title,
    tier,
    isStarred,
    isWatchlist,
    domainSlug: opts.domainSlug,
    domain: humanizeDomain(opts.domainSlug),
    summary,
    meta,
    sections,
    rawPath: path.relative(REPO_ROOT, opts.rawPath),
  }
}

// ---------- New-wiki overlay ----------

/**
 * Walk `wiki/{ventures,work}/*.md` and build a `slug -> { Hero, Pull, ... }`
 * map. The new prose-first wiki uses the same bold-prefix header convention
 * as the legacy wiki, so we re-use the same parser shape rather than YAML.
 */
async function loadNewWikiOverlay(): Promise<Map<string, Record<string, string>>> {
  const overlay = new Map<string, Record<string, string>>()
  let exists = true
  try {
    await fs.access(NEW_WIKI_ROOT)
  } catch {
    exists = false
  }
  if (!exists) return overlay

  for (const dir of OVERLAY_DIRS) {
    const root = path.join(NEW_WIKI_ROOT, dir)
    let dirExists = true
    try {
      await fs.access(root)
    } catch {
      dirExists = false
    }
    if (!dirExists) continue

    const entries = await fs.readdir(root, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue
      if (SKIP_FILE_PATTERNS.some((re) => re.test(entry.name))) continue
      const full = path.join(root, entry.name)
      const content = await fs.readFile(full, 'utf8')
      const fields = parseBoldPrefixHeader(content)
      const picked: Record<string, string> = {}
      for (const key of OVERLAY_FIELDS) {
        const v = fields[key]
        if (v) picked[key] = v
      }
      if (Object.keys(picked).length === 0) continue
      const slug = slugify(entry.name)
      overlay.set(slug, picked)
    }
  }
  return overlay
}

function parseBoldPrefixHeader(content: string): Record<string, string> {
  const lines = content.split('\n')
  const h1 = lines.findIndex((l) => l.startsWith('# '))
  if (h1 === -1) return {}
  const out: Record<string, string> = {}
  for (let i = h1 + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('## ')) break
    const m = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/)
    if (m) out[m[1].trim()] = m[2].trim()
  }
  return out
}

// ---------- Build ----------

async function build(): Promise<void> {
  // Verify legacy wiki symlink
  try {
    await fs.access(LEGACY_WIKI_ROOT)
  } catch {
    console.error(
      `legacy_wiki/ not found at ${LEGACY_WIKI_ROOT}. Symlink it first:\n  ln -s ~/coding/research/cool_companies legacy_wiki`,
    )
    process.exit(1)
  }

  const allEntries: Entry[] = []

  for (const source of SOURCES) {
    const sourceRoot = path.join(LEGACY_WIKI_ROOT, source)
    let exists = true
    try {
      await fs.access(sourceRoot)
    } catch {
      exists = false
    }
    if (!exists) {
      console.warn(`skipping ${source} (not present)`)
      continue
    }

    for await (const filePath of walk(sourceRoot)) {
      const rel = path.relative(sourceRoot, filePath)
      const segments = rel.split(path.sep)
      // Domain folder is the first segment under the source root.
      const domainSlug = segments.length > 1 ? segments[0] : 'other'
      const content = await fs.readFile(filePath, 'utf8')
      const entry = parseEntry(content, { rawPath: filePath, source, domainSlug })
      if (entry) allEntries.push(entry)
    }
  }

  // Editorial overlay from the new prose-first wiki at `wiki/`. We merge
  // by slug so an entry like Recursion Pharmaceuticals (which exists in
  // both trees) picks up the hand-edited Hero / Pull from `wiki/ventures/`.
  const overlay = await loadNewWikiOverlay()
  let overlaid = 0
  for (const e of allEntries) {
    const fields = overlay.get(e.slug)
    if (!fields) continue
    for (const [k, v] of Object.entries(fields)) {
      e.meta[k] = v
    }
    overlaid++
  }

  // Sort: tier order, then starred first, then alphabetical
  const tierOrder: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'P-A', 'P-B', 'P-C', 'unknown']
  const tierRank = new Map(tierOrder.map((t, i) => [t, i]))
  allEntries.sort((a, b) => {
    const ta = tierRank.get(a.tier) ?? 99
    const tb = tierRank.get(b.tier) ?? 99
    if (ta !== tb) return ta - tb
    if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  // Tier counts (for the masthead "as of" line, eventually)
  const counts: Record<string, number> = {}
  for (const e of allEntries) {
    counts[e.tier] = (counts[e.tier] ?? 0) + 1
  }

  const payload = {
    builtAt: new Date().toISOString(),
    counts,
    entries: allEntries,
  }

  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8')

  console.log(
    `built ${allEntries.length} entries -> ${path.relative(REPO_ROOT, OUT_FILE)}`,
  )
  console.log(
    `tiers: ${tierOrder
      .filter((t) => counts[t])
      .map((t) => `${t}=${counts[t]}`)
      .join(' · ')}`,
  )
  console.log(`overlaid editorial fields onto ${overlaid} entries from wiki/`)
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
