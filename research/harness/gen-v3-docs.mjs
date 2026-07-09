// Generates the v3 reorganized document layer (no page moves): a needs index,
// an enriched ventures index, and a layered master index. Output: ./v3/generated/
import fs from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const WIKI = new URL('../../wiki', import.meta.url).pathname
const OUT = path.join(HERE, 'v3/generated')
fs.mkdirSync(OUT, { recursive: true })

const read = (p) => fs.readFileSync(p, 'utf8')
const section = (raw, name) => {
  const m = raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`))
  return m ? m[1].trim() : ''
}
const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''
const firstClause = (text, max = 170) => {
  const s = text.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  return cut.slice(0, Math.max(cut.lastIndexOf('. '), cut.lastIndexOf(', '), max - 30) + 1).trim() + '…'
}

const ventures = fs.readdirSync(path.join(WIKI, 'ventures')).filter((f) => f.endsWith('.md')).sort()

// ---- needs.md: who needs whom, right now ----
let needs = `# Who needs people right now\n\nEvery venture's "What They Need Now", one line each — generated from the venture pages; fetch the page for detail and evidence. If a person's skills match a line here, that page is worth reading.\n\n`
let needCount = 0
for (const f of ventures) {
  const raw = read(path.join(WIKI, 'ventures', f))
  const need = section(raw, 'What They Need Now') || section(raw, 'What They Need')
  if (!need) continue
  const title = (raw.match(/^# (.+)$/m) || [, f])[1]
  needs += `- **[${title}](/wiki/ventures/${f})** — ${firstClause(need, 220)}\n`
  needCount++
}
fs.writeFileSync(path.join(OUT, 'needs.md'), needs)

// ---- enriched ventures index: focus + needs + confidence in one line ----
let vidx = `# Ventures — ${ventures.length} companies, labs, and initiatives\n\nOne line per venture: what they do, what they need, how confident this wiki is. Shortlist here, then fetch pages. For a pure hiring view, see [needs](/wiki/indexes/needs.md).\n\n`
for (const f of ventures) {
  const raw = read(path.join(WIKI, 'ventures', f))
  const title = (raw.match(/^# (.+)$/m) || [, f])[1]
  const focus = meta(raw, 'Focus')
  const conf = (meta(raw, 'Confidence') || '?')[0]
  const need = section(raw, 'What They Need Now') || ''
  const summary = firstClause(section(raw, 'Summary'), 150)
  vidx += `- [${title}](/wiki/ventures/${f}) · ${focus || summary} · conf:${conf}${need ? `\n  needs: ${firstClause(need, 150)}` : ''}\n`
}
fs.writeFileSync(path.join(OUT, 'ventures.md'), vidx)

// ---- layered master index (matches/answers demoted to internal) ----
const count = (dir) => fs.existsSync(path.join(WIKI, dir)) ? fs.readdirSync(path.join(WIKI, dir)).filter((f) => f.endsWith('.md')).length : 0
fs.writeFileSync(path.join(OUT, 'index.md'), `# greatutah.work — master index

Three layers. Facts describe; judgment recommends; derived indexes are generated from the fact pages and are always current.

## Fact layer

- [ventures](/wiki/indexes/ventures.md) — ${count('ventures')} companies, labs, initiatives (enriched: focus + needs + confidence per line)
- [resources](/wiki/indexes/resources.md) — ${count('resources')} grants, accelerators, facilities, capital paths
- [people](/wiki/indexes/people.md) — ${count('people')} founders, researchers, operators
- [helpers](/wiki/indexes/helpers.md) — ${count('helpers')} advisors, funds, service providers
- [work](/wiki/indexes/work.md) — ${count('work')} historical proofs of what Utah has built
- [sources](/wiki/indexes/sources.md) — ${count('sources')} public evidence records

## Judgment layer

- [guides](/wiki/indexes/guides.md) — ${count('guides')} opinionated maps and playbooks; start with [find-meaningful-work](/wiki/guides/find-meaningful-work.md) to see how this wiki argues a recommendation

## Derived indexes (generated)

- [needs](/wiki/indexes/needs.md) — every venture's "what they need now", one line each: the hiring view
- [everything](/everything.md) — all pages summarized in one 322KB file
`)

console.log(`needs: ${needCount} ventures, enriched index: ${ventures.length} lines, out: ${OUT}`)
