/**
 * Reads the public markdown wiki at ./wiki and emits a single normalized
 * JSON artifact at src/data/generated/all.json that the React app consumes.
 *
 * Parses the bold-prefix header convention documented in
 * WIKI.md (NOT YAML frontmatter).
 */
import fs from 'node:fs/promises'
import path from 'node:path'

// ---------- Types ----------

type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'P-A' | 'P-B' | 'P-C' | 'unknown'
type Source =
  | 'ventures'
  | 'people'
  | 'helpers'
  | 'resources'
  | 'work'
  | 'guides'
  | 'matches'
  | 'answers'
  | 'sources'

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
const NEW_WIKI_ROOT = path.join(REPO_ROOT, 'wiki')
const OUT_DIR = path.join(REPO_ROOT, 'src/data/generated')
const OUT_FILE = path.join(OUT_DIR, 'all.json')

const PUBLIC_SOURCE_DIRS: Source[] = [
  'ventures',
  'people',
  'helpers',
  'resources',
  'work',
  'guides',
  'matches',
  'answers',
  'sources',
]

const SOURCE_DOMAIN_LABELS: Record<Source, string> = {
  ventures: 'Ventures',
  people: 'People',
  helpers: 'Helpers',
  resources: 'Resources',
  work: 'Historical Work',
  guides: 'Guides',
  matches: 'Matches',
  answers: 'Answers',
  sources: 'Sources',
}

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
  if (domainSlug === 'talent') return 'Talent'
  return domainSlug
    .split('-')
    .map((word) => {
      if (word === 'and') return 'and'
      if (word === 'of') return 'of'
      return word[0]?.toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function domainSlugFor(source: Source, meta: Record<string, string>): string {
  const candidate =
    meta.Focus ??
    meta.Domain ??
    meta['Source Type'] ??
    meta.Type ??
    SOURCE_DOMAIN_LABELS[source]
  return slugifyLabel(candidate)
}

function domainFor(source: Source, meta: Record<string, string>): string {
  return (
    meta.Focus ??
    meta.Domain ??
    meta['Source Type'] ??
    meta.Type ??
    SOURCE_DOMAIN_LABELS[source]
  )
}

function slugifyLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/\[[^\]]+\]\([^)]+\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72) || 'other'
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
  const missionSection = sections.find((s) =>
    /^(Summary|Mission|What it was|Overview|Description|Evidence|Why it matters)$/i.test(s.heading),
  )
  let summary = ''
  if (missionSection?.body) {
    summary = firstSentence(missionSection.body).replace(/\*\*/g, '')
  } else if (meta.Focus || meta.Domain || meta['Source Type']) {
    summary = meta.Focus ?? meta.Domain ?? meta['Source Type'] ?? ''
  }

  const slug = slugify(path.basename(opts.rawPath))
  const domainSlug = opts.domainSlug || domainSlugFor(opts.source, meta)
  return {
    slug,
    source: opts.source,
    title,
    tier,
    isStarred,
    isWatchlist,
    domainSlug,
    domain: opts.domainSlug ? humanizeDomain(opts.domainSlug) : domainFor(opts.source, meta),
    summary,
    meta,
    sections,
    rawPath: path.relative(REPO_ROOT, opts.rawPath),
  }
}

// ---------- Build ----------

async function build(): Promise<void> {
  try {
    await fs.access(NEW_WIKI_ROOT)
  } catch {
    console.error(`wiki/ not found at ${NEW_WIKI_ROOT}`)
    process.exit(1)
  }

  const allEntries: Entry[] = []

  for (const source of PUBLIC_SOURCE_DIRS) {
    const sourceRoot = path.join(NEW_WIKI_ROOT, source)
    let exists = true
    try {
      await fs.access(sourceRoot)
    } catch {
      exists = false
    }
    if (!exists) continue

    for await (const filePath of walk(sourceRoot)) {
      const content = await fs.readFile(filePath, 'utf8')
      const entry = parseEntry(content, {
        rawPath: filePath,
        source,
        domainSlug: '',
      })
      if (entry) allEntries.push(entry)
    }
  }

  // Sort: tier order, then source order, then starred first, then alphabetical.
  const tierOrder: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'P-A', 'P-B', 'P-C', 'unknown']
  const tierRank = new Map(tierOrder.map((t, i) => [t, i]))
  const sourceRank = new Map(PUBLIC_SOURCE_DIRS.map((s, i) => [s, i]))
  allEntries.sort((a, b) => {
    const ta = tierRank.get(a.tier) ?? 99
    const tb = tierRank.get(b.tier) ?? 99
    if (ta !== tb) return ta - tb
    const sa = sourceRank.get(a.source) ?? 99
    const sb = sourceRank.get(b.source) ?? 99
    if (sa !== sb) return sa - sb
    if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1
    return a.title.localeCompare(b.title)
  })

  const counts: Record<string, number> = {}
  const sourceCounts: Partial<Record<Source, number>> = {}
  for (const e of allEntries) {
    counts[e.tier] = (counts[e.tier] ?? 0) + 1
    sourceCounts[e.source] = (sourceCounts[e.source] ?? 0) + 1
  }

  const payload = {
    builtAt: new Date().toISOString(),
    counts,
    sourceCounts,
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
  console.log(
    `sources: ${PUBLIC_SOURCE_DIRS.filter((s) => sourceCounts[s])
      .map((s) => `${s}=${sourceCounts[s]}`)
      .join(' · ')}`,
  )
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
