// Flattens the wiki: wiki/<category>/<slug>.md → wiki/pages/<slug>.md with a
// **Type:** attribute; dissolves matches/, prunes answers/; rewrites all internal
// links; removes links to deleted pages. Run with --apply to execute (default: dry run).
// Backup exists at wiki-backup-preflatten.tar.gz. See research/design/hierarchy-v1.md
// and research/findings/2026-07-09-hierarchy-probes.md for the rationale.
import fs from 'node:fs'
import path from 'node:path'

const APPLY = process.argv.includes('--apply')
const WIKI = new URL('../wiki', import.meta.url).pathname
const PAGES = path.join(WIKI, 'pages')

const TYPE_OF = { ventures: 'venture', people: 'person', helpers: 'helper', resources: 'resource', work: 'work', guides: 'guide', sources: 'source' }
const ANSWER_KEEPERS = new Set(['where-to-find-sbir-help-in-utah.md', 'who-helps-with-government-contracting-in-utah.md'])
// slug renames to resolve collisions (old cat-qualified path → new flat slug)
const RENAME = {
  'sources/flys-eye-hires-cosmic-rays.md': 'flys-eye-hires-cosmic-rays-source.md',
  'sources/nucleus-grow.md': 'nucleus-grow-source.md',
  'sources/nucleus-marketedge.md': 'nucleus-marketedge-source.md',
  'sources/sba-utah-district-office.md': 'sba-utah-district-office-source.md',
  'sources/score-utah.md': 'score-utah-source.md',
  'sources/womens-business-center-of-utah.md': 'womens-business-center-of-utah-source.md',
}
// pages deleted outright; links to them get remapped (value) or unlinked (null)
const DELETED_REMAP = { 'ventures/jarvik-7-artificial-heart.md': 'jarvik-7-artificial-heart.md' }

// ---------- plan the moves ----------
const moves = new Map() // old cat-relative path -> new flat filename (or null = delete)
for (const [cat, type] of Object.entries(TYPE_OF)) {
  const dir = path.join(WIKI, cat)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    const key = `${cat}/${f}`
    if (key in DELETED_REMAP) { moves.set(key, null); continue }
    moves.set(key, RENAME[key] || f)
  }
}
for (const f of fs.readdirSync(path.join(WIKI, 'matches'))) if (f.endsWith('.md')) moves.set(`matches/${f}`, null)
for (const f of fs.readdirSync(path.join(WIKI, 'answers'))) if (f.endsWith('.md')) moves.set(`answers/${f}`, ANSWER_KEEPERS.has(f) ? f : null)

// duplicate-target check
const targets = [...moves.values()].filter(Boolean)
const dupes = targets.filter((t, i) => targets.indexOf(t) !== i)
if (dupes.length) { console.error('DUPLICATE TARGETS:', dupes); process.exit(1) }

// link-target resolution: any old-style reference → new flat name, or null if deleted
function resolveRef(ref) {
  // normalize: strip leading ../, ./, /wiki/
  const norm = ref.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '').replace(/^\/wiki\//, '')
  if (norm in DELETED_REMAP) return DELETED_REMAP[norm]
  if (moves.has(norm)) return moves.get(norm)
  // bare same-dir link like "foo.md" — try every category
  if (!norm.includes('/')) {
    for (const cat of Object.keys(TYPE_OF).concat(['matches', 'answers'])) {
      const key = `${cat}/${norm}`
      if (key in DELETED_REMAP) return DELETED_REMAP[key]
      if (moves.has(key)) return moves.get(key)
    }
  }
  return undefined // external or non-wiki link — leave untouched
}

const LINK_RE = /\[([^\]]*)\]\(([^)\s]+\.md)(#[^)]*)?\)/g

let stats = { moved: 0, deleted: 0, typed: 0, rewritten: 0, unlinked: 0, droppedLines: 0 }
const report = []

for (const [old, target] of moves) {
  const [cat, fname] = old.split('/')
  const srcPath = path.join(WIKI, cat, fname)
  if (target === null) {
    stats.deleted++
    if (APPLY) fs.rmSync(srcPath)
    continue
  }
  let raw = fs.readFileSync(srcPath, 'utf8')
  const type = cat === 'answers' ? 'guide' : TYPE_OF[cat]

  // insert **Type:** as first metadata line after the H1
  if (!/^\*\*Type:\*\*/m.test(raw)) {
    raw = raw.replace(/^(# .+\n\n?)/, `$1**Type:** ${type}\n`)
    stats.typed++
  }

  // rewrite links line-by-line so deleted-link lines can be dropped whole
  const lines = raw.split('\n')
  const out = []
  for (let line of lines) {
    let dropLine = false
    line = line.replace(LINK_RE, (m, text, ref, anchor = '') => {
      const res = resolveRef(ref)
      if (res === undefined) return m // external/unknown — untouched
      if (res === null) {
        // link target deleted: drop Relates/list lines that exist only for the link; unlink elsewhere
        const bare = line.trim()
        if (/^(\*\*Relates:\*\*|[-*] )/.test(bare)) { dropLine = true; return m }
        stats.unlinked++
        return text
      }
      stats.rewritten++
      return `[${text}](${res}${anchor})`
    })
    if (dropLine) { stats.droppedLines++; continue }
    out.push(line)
  }
  raw = out.join('\n')

  stats.moved++
  if (APPLY) {
    fs.mkdirSync(PAGES, { recursive: true })
    fs.writeFileSync(path.join(PAGES, target), raw)
    fs.rmSync(srcPath)
  }
  if (target !== fname) report.push(`renamed: ${old} → pages/${target}`)
}

if (APPLY) {
  // remove now-empty category dirs, old index layer
  for (const cat of Object.keys(TYPE_OF).concat(['matches', 'answers'])) {
    const dir = path.join(WIKI, cat)
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir)
  }
  fs.rmSync(path.join(WIKI, 'indexes'), { recursive: true, force: true })
  fs.rmSync(path.join(WIKI, 'index.md'), { force: true })
}

console.log(`${APPLY ? 'APPLIED' : 'DRY RUN'}:`, JSON.stringify(stats))
for (const r of report) console.log(r)
// leftover dirs check
for (const d of fs.readdirSync(WIKI)) console.log('remains in wiki/:', d)
