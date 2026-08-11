// Generates wiki/views/ from wiki/pages/ metadata. Views are compiled, never
// hand-edited (conventions P4). Run after any page change: node scripts/build-views.mjs
import fs from 'node:fs'
import path from 'node:path'

const CHECK = process.argv.includes('--check') // verify committed views are fresh, don't write
const BASE = 'https://greatutah.work' // copyable URLs must be absolute: some fetchers (claude.ai web_fetch) only follow URLs seen verbatim in the conversation
// Override only for isolated fixture tests; production always uses ../wiki.
const WIKI = process.env.GREAT_WORK_WIKI || new URL('../wiki', import.meta.url).pathname
const PAGES = path.join(WIKI, 'pages')
const VIEWS = CHECK ? fs.mkdtempSync('/tmp/views-check-') : path.join(WIKI, 'views')
if (!CHECK) fs.rmSync(VIEWS, { recursive: true, force: true })
fs.mkdirSync(VIEWS, { recursive: true })

const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''
const section = (raw, name) => (raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`)) || [])[1]?.trim() || ''
const clip = (t, n = 150) => { const s = (t || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1) + '…' }

const pages = []
const ROLES = [
  ['software-engineering', 'Programmers / software engineers'],
  ['data-science', 'Data scientists'],
  ['biology-life-sciences', 'Biologists / life scientists'],
  ['physical-sciences', 'Physical scientists'],
  ['hardware-engineering', 'Hardware engineers'],
  ['manufacturing-operations', 'Manufacturing / operations'],
  ['clinical-regulatory', 'Clinical / regulatory'],
  ['product-design', 'Product designers'],
  ['sales-business-development', 'Sales / business development'],
  ['marketing-communications', 'Marketing / communications'],
  ['finance-accounting', 'Finance / accounting'],
  ['legal-policy', 'Legal / policy'],
  ['program-project-management', 'Program / project managers'],
  ['field-skilled-trades', 'Field workers / skilled trades'],
  ['people-operations', 'People operations'],
]
const ROLE_TAGS = new Set(ROLES.map(([tag]) => tag))
for (const f of fs.readdirSync(PAGES).sort()) {
  if (!f.endsWith('.md')) continue
  const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
  const domain = meta(raw, 'Domain')
  pages.push({
    // Root-absolute hrefs so naive joiners and unnormalized `../` fetches work.
    // Full URL repeated in backticks for HTML-sanitizing fetchers that drop hrefs
    // and conversation-whitelist fetchers that can't expand relative paths.
    file: f, url: `/pages/${f}`, path: `${BASE}/pages/${f}`,
    title: (raw.match(/^# (.+)$/m) || [, f])[1].trim(),
    type: meta(raw, 'Type'),
    focus: meta(raw, 'Focus'),
    conf: (meta(raw, 'Confidence') || '?')[0],
    region: meta(raw, 'Region'),
    website: meta(raw, 'Website'),
    careers: meta(raw, 'Careers'),
    roles: meta(raw, 'Roles').split(',').map((s) => s.trim()).filter((s) => ROLE_TAGS.has(s)),
    domains: domain ? domain.split(',').map((s) => s.trim().toLowerCase().replace(/\s*\(.*\)$/, '')) : [],
    needs: clip(section(raw, 'What They Need Now'), 400),
    needsReviewed: meta(raw, 'Needs-reviewed'),
    summary: clip(section(raw, 'Summary'), 150),
    stage: meta(raw, 'Stage'),
    era: meta(raw, 'Era'),
    audience: meta(raw, 'Audience'),
    evidence: section(raw, 'Evidence'),
  })
}

// Stage and Era were written as free prose — 131 distinct values across 135 pages — so nothing
// could group them. Rather than rewrite every page to a vocabulary chosen after the fact, the
// grouping key is derived here and the author's own words are printed beside it, which keeps the
// judgment visible and the derivation reversible. Same shape as Region deriving from Utah Location.
const STAGES = [
  ['defunct-or-unknown', /\b(defunct|dissolved|wound down|ceased|status unverified|unknown)\b/i],
  ['acquired', /\b(acquired|acquisition|subsidiary|owned by|[a-z]-owned)\b/i],
  ['public', /\b(publicly traded|public (company|industrial)|NASDAQ|NYSE|IPO)\b/i],
  ['university-research', /\b(university research|research (institute|lab|group)|academic (lab|center))\b/i],
  ['government-or-nonprofit', /\b(government|federal|state agency|nonprofit|non-profit|501\(c\)|university (program|center|institute))\b/i],
  ['clinical-or-preclinical', /\b(clinical-stage|preclinical|pre-clinical|Phase [I1-3]|IND-track|FDA)\b/i],
  ['early-stage', /\b(early|seed|pre-revenue|spinout|stealth|Series A|STTR|SBIR|Y Combinator|venture-backed|founded 202[3-9])\b/i],
  ['growth', /\b(growth|Series [B-Z]|scaling|expansion|expanding|commercializing)\b/i],
  ['established', /\b(established|mature|profitable|operational|commercial|private)\b/i],
]
const stageKey = (s) => (STAGES.find(([, re]) => re.test(s)) || ['unclassified'])[0]

const ERAS = [
  ['pre-1900', (y) => y < 1900],
  ['1900–1949', (y) => y < 1950],
  ['1950–1979', (y) => y < 1980],
  ['1980–1999', (y) => y < 2000],
  ['2000–2019', (y) => y < 2020],
  ['2020–present', () => true],
]
const eraKey = (s) => {
  const y = Number((s.match(/\b(1[6-9]\d{2}|20\d{2})\b/) || [])[1])
  return y ? ERAS.find(([, f]) => f(y))[0] : 'undated'
}

const line = (p, extra = '') => `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.focus || p.summary, 120)} · conf:${p.conf}${extra}\n`
const write = (name, content) => fs.writeFileSync(path.join(VIEWS, name), content)

// ---- type indexes ----
const TYPES = { venture: 'Companies, labs, spinouts, and initiatives doing serious work', resource: 'Grants, accelerators, facilities, capital paths, programs', work: 'Historical and current proofs of great Utah work', person: 'Founders, researchers, operators', helper: 'Paid advisors and service providers (counsel, CFO, IP). Free mentors like SCORE/SBDC are Type: resource — see find-an-advisor', guide: 'Opinionated maps, playbooks, and durable Q&A', source: 'Public evidence records cited by other pages' }
const PLURAL = { venture: 'ventures', resource: 'resources', work: 'work', person: 'people', helper: 'helpers', guide: 'guides', source: 'sources' }
for (const [t, desc] of Object.entries(TYPES)) {
  const sel = pages.filter((p) => p.type === t)
  let out = `# ${t} — ${sel.length} pages\n\n${desc}. One line per page; fetch the page for detail and evidence.\n`
  if (t === 'helper') out += `\nFor free mentorship and the full routing map, start at [find-an-advisor](/pages/find-an-advisor.md) · \`${BASE}/pages/find-an-advisor.md\` — this list is mostly paid specialists, not SCORE/SBDC.\n`
  out += `\n`
  // A guide's `**Audience:**` is who it was written for, which is the one thing a reader needs
  // to decide whether to open it — and it was previously written on the page and shown nowhere.
  for (const p of sel) {
    if (t === 'venture' && p.needs) out += `${line(p).trimEnd()}\n  needs: ${clip(p.needs, 280)}\n`
    else if (t === 'guide' && p.audience) out += `${line(p).trimEnd()}\n  for: ${clip(p.audience, 200)}\n`
    else out += line(p)
  }
  write(`${PLURAL[t]}.md`, out)
}

// ---- needs board ----
const needers = pages.filter((p) => p.needs)
let needs = `# Who might need people\n\nEvery page's "What They Need Now," one line each — perfect recall over stated needs. These are inferred assessments from public information, not confirmed job openings; verify directly with the company before treating one as a lead. Needs unreviewed for 6+ months are flagged.\n\nBrowse by [kind of work](by-role.md) · \`${BASE}/views/by-role.md\`, or by [Utah location](by-region.md) · \`${BASE}/views/by-region.md\`.\n\nLines include region when set so you can Ctrl+F a city. When present, bare \`Careers:\` / \`Website:\` URLs are the apply next step (no markdown links — survives HTML-sanitizing fetchers). Role wording varies (e.g. "data scientist" vs "applied scientist") — skim synonyms.\n\n`
const STALE = Date.now() - 183 * 24 * 3600 * 1000
for (const p of needers) {
  const stale = p.needsReviewed && new Date(p.needsReviewed).getTime() < STALE
  const where = p.region ? ` · ${p.region}` : ''
  const apply = p.careers
    ? ` · Careers: ${p.careers}`
    : p.website
      ? ` · Website: ${p.website}`
      : ''
  needs += `- **[${p.title}](${p.url})** · \`${p.path}\`${where}${apply} — ${p.needs}${p.needsReviewed ? ` *(reviewed ${p.needsReviewed}${stale ? ' — may be stale' : ''})*` : ''}\n`
}
write('needs.md', needs)

// ---- by kind of work (populated roles only) ----
const roleGroups = ROLES
  .map(([tag, label]) => [tag, label, pages.filter((p) => p.needs && p.roles.includes(tag))])
  .filter(([, , selected]) => selected.length)
let byRole = `# By kind of work

Generated from \`**Roles:**\` metadata on pages with current-needs assessments. These are leads, not confirmed openings; verify directly before applying. For the complete ungrouped list, use [needs](needs.md) · \`${BASE}/views/needs.md\`.

`
for (const [tag, label, selected] of roleGroups) {
  byRole += `- [${label}](role-${tag}.md) · \`${BASE}/views/role-${tag}.md\` — ${selected.length} ${selected.length === 1 ? 'organization' : 'organizations'}\n`

  let role = `# ${label}

Organizations whose current-needs assessments include **${tag}**. These are inferred from public information, not confirmed job openings; verify directly. Needs unreviewed for 6+ months are flagged.

[All kinds of work](by-role.md) · \`${BASE}/views/by-role.md\` · [All stated needs](needs.md) · \`${BASE}/views/needs.md\`

`
  for (const p of selected) {
    const stale = p.needsReviewed && new Date(p.needsReviewed).getTime() < STALE
    const where = p.region ? ` · ${p.region}` : ''
    const apply = p.careers
      ? ` · Careers: ${p.careers}`
      : p.website
        ? ` · Website: ${p.website}`
        : ''
    const reviewed = p.needsReviewed
      ? ` *(reviewed ${p.needsReviewed}${stale ? ' — may be stale' : ''})*`
      : ' *(not yet reviewed)*'
    role += `- **[${p.title}](${p.url})** · \`${p.path}\`${where}${apply} — ${p.needs}${reviewed}\n`
  }
  write(`role-${tag}.md`, role)
}
write('by-role.md', byRole)

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

// ---- by stage and by era ----
// Both carry the same caveat, stated on the view itself rather than in a doc nobody fetches:
// these attributes are asserted in metadata and cited by nothing. A reader who wants to act on
// "this company is public" has to go to the page and find out whether anything supports it.
const UNSOURCED = (field, n) =>
  `\n> **These groupings are not yet evidence.** \`**${field}:**\` is asserted in page metadata and no\n> source page backs it, so a line here is a claim the wiki has not checked — unlike Domain or\n> Region, which describe placement rather than fact. ${n} pages carry it. Treat this view as an\n> index to verify from, not a finding. The author's own wording is printed beside each entry.\n`

const staged = pages.filter((p) => p.stage)
if (staged.length) {
  let out = `# By stage\n\nGenerated from \`**Stage:**\` metadata (${staged.length} pages). The grouping key is derived from the free-text value at build time; the original text follows each entry.\n${UNSOURCED('Stage', staged.length)}`
  const by = {}
  for (const p of staged) (by[stageKey(p.stage)] ||= []).push(p)
  for (const [k, sel] of Object.entries(by).sort()) {
    out += `\n## ${k} (${sel.length})\n\n`
    for (const p of sel) out += `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.stage, 110)}\n`
  }
  write('by-stage.md', out)
}

const dated = pages.filter((p) => p.era)
if (dated.length) {
  let out = `# By era\n\nGenerated from \`**Era:**\` metadata (${dated.length} pages), grouped by the earliest year the value names. Mostly historical work, so periods overlap — a page appears once, under its beginning.\n${UNSOURCED('Era', dated.length)}`
  const by = {}
  for (const p of dated) (by[eraKey(p.era)] ||= []).push(p)
  const order = [...ERAS.map(([k]) => k), 'undated']
  for (const k of order.filter((k) => by[k])) {
    out += `\n## ${k} (${by[k].length})\n\n`
    for (const p of by[k]) out += `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.era, 110)}\n`
  }
  write('by-era.md', out)
}

// ---- evidence graph ----
// The inverse of every Evidence section: which pages rest on each source. This is what the
// hand-written `**Relates:**` field was approximating one page at a time — and because it is
// derived from the citations themselves it cannot drift out of agreement with them. The orphan
// list is the part no page can show you: a source nothing cites is either a page whose work was
// never finished, or evidence collected for a claim that did not survive.
const sourcePages = pages.filter((p) => p.type === 'source')
const citedBy = new Map(sourcePages.map((p) => [p.file, []]))
for (const p of pages) {
  if (p.type === 'source') continue
  for (const m of p.evidence.matchAll(/\]\(([a-z0-9-]+\.md)\)/g)) citedBy.get(m[1])?.push(p)
}
const rested = sourcePages.filter((p) => citedBy.get(p.file).length)
const orphans = sourcePages.filter((p) => !citedBy.get(p.file).length)
let graph = `# Evidence graph\n\nEvery \`Type: source\` page and what rests on it, inverted from the \`## Evidence\` sections of the corpus (${sourcePages.length} sources, ${rested.length} cited). Generated from the citations themselves, so it cannot disagree with them.\n\n## Sources and what they support\n\n`
for (const p of rested.sort((a, b) => citedBy.get(b.file).length - citedBy.get(a.file).length || a.title.localeCompare(b.title))) {
  graph += `- [${p.title}](${p.url}) · \`${p.path}\` — ${citedBy.get(p.file).map((c) => `[${c.title}](${c.url})`).join(', ')}\n`
}
graph += `\n## Cited by nothing (${orphans.length})\n\nA source page nothing cites is unfinished work, not a finding: either the page it was gathered for was never written, or the claim it was gathered for did not survive. Cite it or say on the page why it stands alone.\n\n`
for (const p of orphans) graph += `- [${p.title}](${p.url}) · \`${p.path}\`\n`
write('evidence.md', graph)

// ---- master index ----
const count = (t) => pages.filter((p) => p.type === t).length
write('index.md', `# greatutah.work — master index

**Looking for work?** Start at [by kind of work](by-role.md) or [needs](needs.md) — who needs people now — then [ventures](ventures.md) or a [sector hub](#derived).
**Founding or growing?** Start at [guides](guides.md) (capital + advisors), then [resources](resources.md) and [helpers](helpers.md).

All pages live flat at \`${BASE}/pages/{slug}.md\`; every view below is generated from page metadata and always current. Each listing repeats its full URL in backticks so HTML-sanitizing fetchers still expose fetchable URLs, and so conversation-whitelist fetchers (like claude.ai web_fetch) can follow it. Conventions: ${BASE}/meta/conventions.md · attributes: ${BASE}/meta/attributes.md · what "great work" means here: ${BASE}/meta/charter.md

## By type

- [ventures](ventures.md) · \`${BASE}/views/ventures.md\` — ${count('venture')} companies, labs, initiatives (with needs inline)
- [resources](resources.md) · \`${BASE}/views/resources.md\` — ${count('resource')} grants, accelerators, facilities, capital paths
- [people](people.md) · \`${BASE}/views/people.md\` — ${count('person')} founders, researchers, operators
- [helpers](helpers.md) · \`${BASE}/views/helpers.md\` — ${count('helper')} advisors, funds, service providers
- [work](work.md) · \`${BASE}/views/work.md\` — ${count('work')} historical proofs of what Utah has built
- [guides](guides.md) · \`${BASE}/views/guides.md\` — ${count('guide')} opinionated maps and playbooks
- [sources](sources.md) · \`${BASE}/views/sources.md\` — ${count('source')} public evidence records

## Derived

- [needs](needs.md) · \`${BASE}/views/needs.md\` — every stated "what they need now," one line each: the hiring view
- [by kind of work](by-role.md) · \`${BASE}/views/by-role.md\` — organizations grouped by the people they need
- [by-region](by-region.md) · \`${BASE}/views/by-region.md\` — attributed pages by Utah location
- [evidence](evidence.md) · \`${BASE}/views/evidence.md\` — every source and what rests on it, inverted from the Evidence sections; includes the sources nothing cites
- [by-era](by-era.md) · \`${BASE}/views/by-era.md\` — ${dated.length} pages by when the work happened *(metadata assertion, not yet sourced)*
- [by-stage](by-stage.md) · \`${BASE}/views/by-stage.md\` — ${staged.length} ventures by maturity and ownership *(metadata assertion, not yet sourced)*
- Sector hubs (attribution rollout in progress): ${DOMAINS.filter((d) => fs.existsSync(path.join(VIEWS, `domain-${d}.md`))).map((d) => `[${d}](domain-${d}.md) \`${BASE}/views/domain-${d}.md\``).join(' · ')}
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
  // The sitemap is emitted by scripts/prerender.mjs, which is the only step that
  // knows every URL that actually ships (pages, views, meta docs, /search, /about).
  console.log(`views: ${fs.readdirSync(VIEWS).length} files from ${pages.length} pages (${attributed.length} attributed)`)
}
