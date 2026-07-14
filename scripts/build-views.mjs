// Generates wiki/views/ from wiki/pages/ metadata. Views are compiled, never
// hand-edited (conventions P4). Run after any page change: node scripts/build-views.mjs
import fs from 'node:fs'
import path from 'node:path'

const CHECK = process.argv.includes('--check') // verify committed views are fresh, don't write
const WIKI = new URL('../wiki', import.meta.url).pathname
const PAGES = path.join(WIKI, 'pages')
const VIEWS = CHECK ? fs.mkdtempSync('/tmp/views-check-') : path.join(WIKI, 'views')
if (!CHECK) fs.rmSync(VIEWS, { recursive: true, force: true })
fs.mkdirSync(VIEWS, { recursive: true })

const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''
const section = (raw, name) => (raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`)) || [])[1]?.trim() || ''
const clip = (t, n = 150) => { const s = (t || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1) + '…' }

const pages = []
for (const f of fs.readdirSync(PAGES).sort()) {
  if (!f.endsWith('.md')) continue
  const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
  const domain = meta(raw, 'Domain')
  pages.push({
    // Root-absolute hrefs so naive joiners and unnormalized `../` fetches work.
    // Path is also repeated in backticks for HTML-sanitizing fetchers that drop hrefs.
    file: f, url: `/pages/${f}`, path: `/pages/${f}`,
    title: (raw.match(/^# (.+)$/m) || [, f])[1].trim(),
    type: meta(raw, 'Type'),
    focus: meta(raw, 'Focus'),
    conf: (meta(raw, 'Confidence') || '?')[0],
    region: meta(raw, 'Region'),
    domains: domain ? domain.split(',').map((s) => s.trim().toLowerCase().replace(/\s*\(.*\)$/, '')) : [],
    needs: clip(section(raw, 'What They Need Now'), 400),
    needsReviewed: meta(raw, 'Needs-reviewed'),
    summary: clip(section(raw, 'Summary'), 150),
  })
}

const line = (p, extra = '') => `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.focus || p.summary, 120)} · conf:${p.conf}${extra}\n`
const write = (name, content) => fs.writeFileSync(path.join(VIEWS, name), content)

// ---- type indexes ----
const TYPES = { venture: 'Companies, labs, spinouts, and initiatives doing serious work', resource: 'Grants, accelerators, facilities, capital paths, programs', work: 'Historical and current proofs of great Utah work', person: 'Founders, researchers, operators', helper: 'Advisors, funds, service providers', guide: 'Opinionated maps, playbooks, and durable Q&A', source: 'Public evidence records cited by other pages' }
const PLURAL = { venture: 'ventures', resource: 'resources', work: 'work', person: 'people', helper: 'helpers', guide: 'guides', source: 'sources' }
for (const [t, desc] of Object.entries(TYPES)) {
  const sel = pages.filter((p) => p.type === t)
  let out = `# ${t} — ${sel.length} pages\n\n${desc}. One line per page; fetch the page for detail and evidence.\n\n`
  for (const p of sel) out += t === 'venture' && p.needs ? `${line(p).trimEnd()}\n  needs: ${clip(p.needs, 280)}\n` : line(p)
  write(`${PLURAL[t]}.md`, out)
}

// ---- needs board ----
const needers = pages.filter((p) => p.needs)
let needs = `# Who might need people\n\nEvery page's "What They Need Now," one line each — perfect recall over stated needs. These are inferred assessments from public information, not confirmed job openings; verify directly with the company before treating one as a lead. Needs unreviewed for 6+ months are flagged.\n\n`
const STALE = Date.now() - 183 * 24 * 3600 * 1000
for (const p of needers) {
  const stale = p.needsReviewed && new Date(p.needsReviewed).getTime() < STALE
  needs += `- **[${p.title}](${p.url})** · \`${p.path}\` — ${p.needs}${p.needsReviewed ? ` *(reviewed ${p.needsReviewed}${stale ? ' — may be stale' : ''})*` : ''}\n`
}
write('needs.md', needs)

// ---- domain hubs (attributed pages only; grows with attribution rollout) ----
const DOMAINS = ['energy', 'health-bio', 'aerospace-defense', 'computing', 'materials-mfg', 'space-science', 'capital-programs', 'culture-place']
const attributed = pages.filter((p) => p.domains.length)
for (const d of DOMAINS) {
  const prim = attributed.filter((p) => p.domains[0] === d)
  const sec = attributed.filter((p) => p.domains.includes(d) && p.domains[0] !== d)
  let hub = `# ${d} — sector hub\n\nGenerated from \`**Domain:**\` metadata (${attributed.length}/${pages.length} pages attributed so far — coverage grows with the attribution rollout).\n`
  if (!prim.length && !sec.length) {
    hub += `\nNo pages attributed to **${d}** yet. Until attribution catches up, use [/views/ventures.md](/views/ventures.md), [/views/resources.md](/views/resources.md), and [/views/work.md](/views/work.md), or skim Focus lines — don't treat an empty hub as "nothing in this sector."\n`
    write(`domain-${d}.md`, hub)
    continue
  }
  for (const [label, filt] of [['Players', (p) => p.type === 'venture'], ['Proof it can be done here', (p) => p.type === 'work'], ['People', (p) => p.type === 'person'], ['Money & programs', (p) => p.type === 'resource' || p.type === 'helper']]) {
    const s = prim.filter(filt)
    if (!s.length) continue
    hub += `\n## ${label}\n\n`
    for (const p of s) hub += `- [${p.title}](${p.url}) · \`${p.path}\`${p.region ? ` · ${p.region}` : ''} · ${clip(p.focus || p.summary, 100)}\n`
  }
  const withNeeds = prim.filter((p) => p.needs)
  if (withNeeds.length) {
    hub += `\n## Who they need right now\n\n`
    for (const p of withNeeds) hub += `- [${p.title}](${p.url}) · \`${p.path}\`: ${p.needs}${p.needsReviewed ? ` *(reviewed ${p.needsReviewed})*` : ''}\n`
  }
  if (sec.length) {
    hub += `\n## Also relevant (primary elsewhere)\n\n`
    for (const p of sec) hub += `- [${p.title}](${p.url}) · \`${p.path}\` — primary: ${p.domains[0]}\n`
  }
  write(`domain-${d}.md`, hub)
}

// ---- by Utah location (any page with Region — not only Domain-attributed) ----
const regional = pages.filter((p) => p.region)
if (regional.length) {
  let reg = `# By Utah location\n\nGenerated from \`**Region:**\` metadata (${regional.length} pages with a region). Sector hubs still require \`**Domain:**\`; geography does not.\n`
  const byR = {}
  for (const p of regional) (byR[p.region] ||= []).push(p)
  for (const [r, sel] of Object.entries(byR).sort()) {
    reg += `\n## ${r}\n\n`
    for (const p of sel) {
      const domains = p.domains.length ? p.domains.join(', ') : (p.type || 'page')
      reg += `- [${p.title}](${p.url}) · \`${p.path}\` · ${domains}\n`
    }
  }
  write('by-region.md', reg)
}

// ---- master index ----
const count = (t) => pages.filter((p) => p.type === t).length
write('index.md', `# greatutah.work — master index

**Looking for work?** Start at [needs](needs.md) — who needs people now — then [ventures](ventures.md) or a [sector hub](#derived).
**Founding or growing?** Start at [guides](guides.md) (capital + advisors), then [resources](resources.md) and [helpers](helpers.md).

All pages live flat at \`/pages/{slug}.md\`; every view below is generated from page metadata and always current. Each listing repeats its path in backticks so HTML-sanitizing fetchers still expose fetchable URLs. Conventions: [/meta/conventions.md](/meta/conventions.md) · attributes: [/meta/attributes.md](/meta/attributes.md) · what "great work" means here: [/meta/charter.md](/meta/charter.md)

## By type

- [ventures](ventures.md) — ${count('venture')} companies, labs, initiatives (with needs inline)
- [resources](resources.md) — ${count('resource')} grants, accelerators, facilities, capital paths
- [people](people.md) — ${count('person')} founders, researchers, operators
- [helpers](helpers.md) — ${count('helper')} advisors, funds, service providers
- [work](work.md) — ${count('work')} historical proofs of what Utah has built
- [guides](guides.md) — ${count('guide')} opinionated maps and playbooks
- [sources](sources.md) — ${count('source')} public evidence records

## Derived

- [needs](needs.md) — every stated "what they need now," one line each: the hiring view
- [by-region](by-region.md) — attributed pages by Utah location
- Sector hubs (attribution rollout in progress): ${DOMAINS.filter((d) => fs.existsSync(path.join(VIEWS, `domain-${d}.md`))).map((d) => `[${d}](domain-${d}.md)`).join(' · ')}
`)

if (CHECK) {
  const real = path.join(WIKI, 'views')
  let stale = 0
  const names = new Set([...fs.readdirSync(VIEWS), ...(fs.existsSync(real) ? fs.readdirSync(real) : [])])
  for (const n of names) {
    const a = fs.existsSync(path.join(VIEWS, n)) ? fs.readFileSync(path.join(VIEWS, n), 'utf8') : null
    const b = fs.existsSync(path.join(real, n)) ? fs.readFileSync(path.join(real, n), 'utf8') : null
    if (a !== b) { console.log(`stale view: ${n}`); stale++ }
  }
  fs.rmSync(VIEWS, { recursive: true, force: true })
  console.log(stale ? `views are STALE (${stale}) — run: node scripts/build-views.mjs` : 'views are fresh')
  process.exitCode = stale ? 1 : 0
} else {
  // sitemap for crawlers (human pages + raw markdown), written alongside the app's static assets
  const BASE = 'https://greatutah.work'
  const urls = [
    `${BASE}/`, `${BASE}/llms.txt`,
    ...fs.readdirSync(VIEWS).map((f) => `${BASE}/views/${f}`),
    ...pages.flatMap((p) => [`${BASE}/p/${p.file.replace('.md', '')}`, `${BASE}/pages/${p.file}`]),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`
  fs.writeFileSync(new URL('../public/sitemap.xml', import.meta.url).pathname, xml)
  console.log(`views: ${fs.readdirSync(VIEWS).length} files from ${pages.length} pages (${attributed.length} attributed); sitemap: ${urls.length} urls`)
}
