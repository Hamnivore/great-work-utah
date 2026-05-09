/**
 * Match-brief loader.
 *
 * Bundles `wiki/matches/*.md` into a slug-indexed map at build time
 * via Vite's `import.meta.glob` (?raw + eager). Both the home rail
 * and the /match/:slug page consume this so there's a single source
 * of truth for match data.
 *
 * Matches don't go through `scripts/build-wiki-index.ts` — they live
 * outside the entry-routing world (no tier, no domain). Instead we
 * parse the bold-prefix header inline so the app can show structured
 * fields (Strength, Confidence, Parties, Updated) on the rail and
 * the brief page.
 */

export interface MatchDoc {
  slug: string
  title: string
  meta: Record<string, string>
  body: string
}

const RAW_MATCHES = import.meta.glob('../../wiki/matches/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const PARSED = new Map<string, MatchDoc>()
for (const [filePath, content] of Object.entries(RAW_MATCHES)) {
  const filename = filePath.split('/').pop() ?? ''
  const slug = filename.replace(/\.md$/, '')
  const doc = parseMatchMarkdown(content, slug)
  if (doc) PARSED.set(slug, doc)
}

export function getMatch(slug: string): MatchDoc | undefined {
  return PARSED.get(slug)
}

export function getAllMatches(): MatchDoc[] {
  return Array.from(PARSED.values())
}

/**
 * Parse a wiki match file. Title from H1, bold-prefix metadata up to
 * the first `## ` section, body is everything after.
 */
function parseMatchMarkdown(content: string, slug: string): MatchDoc | null {
  const lines = content.split('\n')
  const h1Index = lines.findIndex((l) => l.startsWith('# '))
  if (h1Index === -1) return null
  const title = lines[h1Index].slice(2).trim()

  const meta: Record<string, string> = {}
  let cursor = h1Index + 1
  for (; cursor < lines.length; cursor++) {
    const line = lines[cursor]
    if (line.startsWith('## ')) break
    const m = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/)
    if (m) meta[m[1].trim()] = m[2].trim()
  }

  const body = lines.slice(cursor).join('\n').trim()
  return { slug, title, meta, body }
}

/**
 * Rewrite wiki-internal relative links (`../ventures/foo.md`,
 * `../people/foo.md`) into the app's React-router routes.
 *
 * Other targets (sources, helpers, guides, resources) exist in the
 * wiki but aren't routable in the app. We strip those links and keep
 * the visible label rather than emit a dead .md href.
 */
export function rewriteWikiLinks(markdown: string): string {
  return markdown.replace(
    /\[([^\]]+)\]\(\.\.\/([^)]+)\.md\)/g,
    (_match, label: string, target: string) => {
      const [folder, name] = target.split('/')
      if (folder === 'ventures') {
        return `[${label}](/entry/places_you_can_work/${name})`
      }
      if (folder === 'people') {
        return `[${label}](/entry/people/${name})`
      }
      return label
    },
  )
}

/**
 * Turn the `Parties:` line into a display string. The convention is
 * comma-separated, with venture refs spelled `venture:slug`.
 */
export function formatParties(raw: string | undefined): string {
  if (!raw) return ''
  return raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^venture:(.+)$/)
      if (m) return humanizeSlug(m[1])
      return p
    })
    .join(' \u00b7 ')
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w.length <= 3 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}
