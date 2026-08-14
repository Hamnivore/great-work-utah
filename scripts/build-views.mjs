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
const firstSentence = (text) => (String(text || '').replace(/\s+/g, ' ').trim().match(/^.*?[.!?](?=\s|$)/) || [String(text || '').replace(/\s+/g, ' ').trim()])[0]
// Page prose is authored relative to wiki/pages/. When snippets are copied into a
// generated view, preserve that origin so the same citation does not become /views/<slug>.
const rebasePageLinks = (text) => String(text || '').replace(
  /\]\(([a-z0-9-]+\.md(?:#[^)]+)?)\)/g,
  '](/pages/$1)',
)

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
    tier: meta(raw, 'Tier'),
    founderTier: meta(raw, 'Founder-tier'),
    activity: meta(raw, 'Activity'),
    activityChecked: meta(raw, 'Activity-checked'),
    provides: rebasePageLinks(section(raw, 'What It Provides') || section(raw, 'Who They Help')),
    region: meta(raw, 'Region'),
    website: meta(raw, 'Website'),
    careers: meta(raw, 'Careers'),
    roles: meta(raw, 'Roles').split(',').map((s) => s.trim()).filter((s) => ROLE_TAGS.has(s)),
    domains: domain ? domain.split(',').map((s) => s.trim().toLowerCase().replace(/\s*\(.*\)$/, '')) : [],
    needs: clip(rebasePageLinks(section(raw, 'What They Need Now')), 400),
    needsReviewed: meta(raw, 'Needs-reviewed'),
    summary: rebasePageLinks(section(raw, 'Summary')),
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

// Activity is printed only when it is *not* `active` (wiki/meta/activity.md). Marking the majority
// case would put a token on nearly every line in the corpus to say "normal"; marking the exceptions
// puts it exactly where a reader's plan has to change. Every fact page carries the attribute, so an
// unmarked line means active — which is only true as long as the rollout stays complete, and lint is
// what keeps it complete.
const ACTIVITY_MARK = { dormant: 'dormant', concluded: 'concluded', unknown: 'activity unknown' }
const activityMark = (p) => (ACTIVITY_MARK[p.activity] ? ` · ${ACTIVITY_MARK[p.activity]}` : '')

// Tier leads the trust markers because it is the one a reader shortlists on; conf says how much to
// believe the page behind it. Absent on source/guide pages, which take no tier.
const line = (p, extra = '') => `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.focus || p.summary, 120)}${p.tier ? ` · tier:${p.tier}` : ''} · conf:${p.conf}${activityMark(p)}${extra}\n`
const write = (name, content) => fs.writeFileSync(path.join(VIEWS, name), content)

// ---- type indexes ----
const TYPES = { venture: 'Companies, labs, spinouts, and initiatives doing serious work', resource: 'Grants, accelerators, facilities, capital paths, programs', work: 'Historical and current proofs of great Utah work', person: 'Founders, researchers, operators', helper: 'Paid advisors and service providers (counsel, CFO, IP). Free mentors like SCORE/SBDC are Type: resource — see find-an-advisor', guide: 'Opinionated maps, playbooks, and durable Q&A', source: 'Public evidence records cited by other pages' }
const PLURAL = { venture: 'ventures', resource: 'resources', work: 'work', person: 'people', helper: 'helpers', guide: 'guides', source: 'sources' }
for (const [t, desc] of Object.entries(TYPES)) {
  const sel = pages.filter((p) => p.type === t)
  let out = `# ${t} — ${sel.length} pages\n\n${desc}. One line per page; fetch the page for detail and evidence.\n`
  // This index is alphabetical and undifferentiated, which is the right shape for exhaustive access
  // and the wrong one for "which of these is worth my week." Point at the ladder that answers that.
  if (t === 'resource' || t === 'helper') out += `\nThis list is alphabetical and does not rank. To read the good ones first, use [the founder-resource tier list](founder-resource-tier-list.md) · \`${BASE}/views/founder-resource-tier-list.md\`, which ranks every resource and helper page by what it actually hands a founder.\n`
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
graph += `\n## Cited by nothing (${orphans.length})\n\nA source page nothing cites is unfinished work, not a finding: either the page it was gathered for was never written, or the claim it was gathered for did not survive. Cite it or say on the page why it stands alone.\n${orphans.length ? '\n' : ''}`
for (const p of orphans) graph += `- [${p.title}](${p.url}) · \`${p.path}\`\n`
write('evidence.md', graph)

// ---- the tier list ----
// The corpus ranked on one ladder by argued impact (wiki/meta/tiers.md). This is what makes "surface
// all the gems" mechanical instead of a matter of the reading agent's taste: gems are S and A, and
// they are 5% of the corpus, so an agent with a narrow budget knows exactly where to spend it.
const TIER_RANK = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5, unranked: 6 }
const TIER_LABEL = {
  S: 'world-historic',
  A: 'field-defining',
  B: 'structurally significant',
  C: 'substantive and replaceable',
  D: 'local',
  F: 'inert',
  unranked: 'not rankable',
}
const tiered = pages.filter((p) => p.tier && TIER_RANK[p.tier.replace('*', '')] !== undefined)
const tierBase = (p) => p.tier.replace('*', '')
const gems = tiered.filter((p) => ['S', 'A'].includes(tierBase(p)))

// The ladder deliberately says nothing about *when*, which strands a reader looking for something to
// join: twelve of the thirteen S pages are historical. `**Activity:**` (wiki/meta/activity.md) is the
// other axis, and it gets an entry in the line rather than a separate ladder, because the two
// questions compose — "big and still happening" is one filter over one list, not a second ranking.
const isActive = (p) => p.activity === 'active'
const activeTiered = tiered.filter(isActive)
const activityChecked = tiered.filter((p) => p.activity)
const tierEntry = (p) => {
  const bump = p.tier.endsWith('*') ? ' \\*' : ''
  const mark = ACTIVITY_MARK[p.activity] ? ` — **${ACTIVITY_MARK[p.activity]}**` : ''
  return `- **[${p.title}](${p.url})** · \`${p.path}\`${bump}${mark}\n  ${p.summary.replace(/\s+/g, ' ').trim()}\n`
}

let tierList = `# The tier list

Utah work ranked by how far it could move the world. ${gems.length} pages in S and A. [How this is ranked](../meta/tiers.md) · \`${BASE}/meta/tiers.md\`.

**${activeTiered.length} of these ${tiered.length} pages are things still being done today.** If that is what you came for, [the active list](tier-list-active.md) · \`${BASE}/views/tier-list-active.md\` is this same ladder filtered to them. On this page, anything not currently being done is marked **dormant**, **concluded**, or **activity unknown** on its own line — an unmarked entry is active. What those words mean, and what evidence each one needs, is in [activity.md](../meta/activity.md) · \`${BASE}/meta/activity.md\`.${activityChecked.length < tiered.length ? `\n\n${tiered.length - activityChecked.length} pages have not been checked yet and are unmarked; treat an unmarked line as "active or unchecked" until that number reaches zero.` : ''}

Ranked here by how far it could move the world, not by how useful it is to you. Grants, accelerators, chambers, and programs sit at D and F almost without exception, because an enabler displaces very little however much passes through it — so if you are a founder deciding where to spend a week, use [the founder-resource tier list](founder-resource-tier-list.md) · \`${BASE}/views/founder-resource-tier-list.md\` instead, which ranks the same resource shelf by what it hands you.

`
for (const t of ['S', 'A', 'B', 'C', 'D', 'F', 'unranked']) {
  const sel = tiered
    .filter((p) => tierBase(p) === t)
    .sort((a, b) => a.title.localeCompare(b.title))
  if (!sel.length) continue
  const gloss = TIER_LABEL[t]
  tierList += `## ${t} — ${gloss} (${sel.length})\n\n`
  for (const p of sel) tierList += tierEntry(p)
  tierList += `\n`
}
write('tier-list.md', tierList)

// ---- the tier list, filtered to what is still happening ----
// Same ladder, same order, one filter. This is the view for "what could I join, fund, or use this
// year", and it is the reason the Activity facet exists at all.
const activeGems = activeTiered.filter((p) => ['S', 'A'].includes(tierBase(p)))
let activeList = `# The tier list — active only

The same ladder as [the tier list](tier-list.md) · \`${BASE}/views/tier-list.md\`, filtered to the ${activeTiered.length} pages whose subject is **still being done**: ${activeGems.length} of them in S and A.

"Active" means someone found a dated public artifact from the last 18 months showing the work happening — a filing, an award, a job posting, a release, a paper, an open application cycle — and recorded it on the page as \`**Activity-signal:**\`. A website that merely loads does not count. The rubric and the eight rulings behind these calls are in [activity.md](../meta/activity.md) · \`${BASE}/meta/activity.md\`.

**What this list leaves out is not lesser work.** ${tiered.length - activeTiered.length} pages are missing from it, including most of the S tier — the transcontinental railroad, the first electronic television, the Jarvik-7. They are the reason the state has what it has. They are simply not things you can join. Read [the full ladder](tier-list.md) · \`${BASE}/views/tier-list.md\` for those, or [historical and current work](work.md) · \`${BASE}/views/work.md\`.

`
for (const t of ['S', 'A', 'B', 'C', 'D', 'F', 'unranked']) {
  const sel = activeTiered
    .filter((p) => tierBase(p) === t)
    .sort((a, b) => a.title.localeCompare(b.title))
  if (!sel.length) continue
  activeList += `## ${t} — ${TIER_LABEL[t]} (${sel.length})\n\n`
  for (const p of sel) activeList += tierEntry(p)
  activeList += `\n`
}
write('tier-list-active.md', activeList)

// ---- the founder-resource tier list ----
// A second ladder over the same corpus, asking a different question (wiki/meta/founder-tiers.md).
// The impact ladder is right to crush the resource shelf — an enabler displaces almost nothing — but
// that leaves 262 resource and helper pages heaped at D and F, which tells a founder nothing about
// which of them is worth a week. This ranks the same pages on what they hand you instead.
const FOUNDER_RANK = { S: 0, A: 1, B: 2, C: 3, D: 4, F: 5, unranked: 6, 'n/a': 7 }
const FOUNDER_LABEL = {
  S: 'changes what can be built here',
  A: 'no second one',
  B: 'worth a quarter',
  C: 'worth a morning',
  D: 'worth an email',
  F: 'a listing',
  unranked: 'too thin to say',
  'n/a': 'not a founder resource',
}
const founderTiered = pages.filter((p) => FOUNDER_RANK[p.founderTier] !== undefined)
const founderRanked = founderTiered.filter((p) => p.founderTier !== 'n/a')
const founderTop = founderRanked.filter((p) => ['S', 'A', 'B'].includes(p.founderTier))
let founderList = `# The founder-resource tier list

Utah's ${founderRanked.length} founder resources ranked by what they actually hand you. ${founderTop.length} pages in S, A, and B. [How this is ranked](../meta/founder-tiers.md) · \`${BASE}/meta/founder-tiers.md\`.

This is a **second ladder**, not a correction of the first. [The impact tier list](tier-list.md) · \`${BASE}/views/tier-list.md\` asks how far something could move the world, and it is right to put nearly every resource at D or F — an accelerator or a chamber displaces very little. That answer is useless to a founder choosing where to spend a week, so this list asks the other question: **what does this hand you that you could not get by asking around for an afternoon?** The two disagree in both directions, on purpose.

Money, bench time, a certification, a legal waiver, a specific professional's hours — those are handed to you. "Connections, mentorship, and resources" is convened, and convening is nearly free. Each entry prints what the page itself claims to provide, so you can check the letter against the claim.

`
for (const t of ['S', 'A', 'B', 'C', 'D', 'F', 'unranked']) {
  const sel = founderTiered
    .filter((p) => p.founderTier === t)
    .sort((a, b) => a.title.localeCompare(b.title))
  if (!sel.length) continue
  founderList += `## ${t} — ${FOUNDER_LABEL[t]} (${sel.length})\n\n`
  for (const p of sel) {
    founderList += `- **[${p.title}](${p.url})** · \`${p.path}\`\n`
    const identity = firstSentence(p.summary)
    if (identity) founderList += `  ${identity}\n`
    if (p.provides) founderList += `  *Hands you:* ${clip(p.provides, 260)}\n`
  }
  founderList += `\n`
}
const notForFounders = founderTiered.filter((p) => p.founderTier === 'n/a').sort((a, b) => a.title.localeCompare(b.title))
if (notForFounders.length) {
  founderList += `## Not founder resources (${notForFounders.length})

\`Type: resource\` in this wiki means grants, facilities, and programs — not "things for founders." These serve a different audience entirely, so they are excluded from the ladder rather than ranked at the bottom of it. Ranking a children's hospital on whether it helps you raise a seed round would be a category error, and marking it F would be a slander.

`
  for (const p of notForFounders) founderList += `- [${p.title}](${p.url}) · \`${p.path}\` · ${clip(p.focus || p.summary, 110)}\n`
}
write('founder-resource-tier-list.md', founderList)

// ---- master index ----
const count = (t) => pages.filter((p) => p.type === t).length
const pct = (n, total) => total ? Math.round((n / total) * 100) : 0
const domainViews = DOMAINS.filter((d) => fs.existsSync(path.join(VIEWS, `domain-${d}.md`)))
const domainLabel = (d) => ({
  energy: 'Energy',
  'health-bio': 'Health and biology',
  'aerospace-defense': 'Aerospace and defense',
  computing: 'Computing',
  'materials-mfg': 'Materials and manufacturing',
  'space-science': 'Space and science',
  'capital-programs': 'Capital and programs',
  'culture-place': 'Culture and place',
})[d]
write('index.md', `# greatutah.work — master index

This is the router for ${pages.length} pages about high-impact work in Utah. Pick the path that matches the question; use the complete type indexes when no narrower path fits. **Index first; search to refine.**

## Start by goal

- **Read the best of it first:** [the tier list](tier-list.md) · \`${BASE}/views/tier-list.md\` ranks all ${tiered.length} fact pages on one impact ladder. The ${gems.length} pages in **S** and **A** are the gems. The letter is how far a thing could move the world, not a vote that it's good — the top of the list includes weapons, surveillance, and mines.
- **Find meaningful work:** [by kind of work](by-role.md) · \`${BASE}/views/by-role.md\` (${roleGroups.length} role families), then [all stated needs](needs.md) · \`${BASE}/views/needs.md\` (${needers.length} organizations) and [Find Meaningful Work in Utah](/pages/find-meaningful-work.md) · \`${BASE}/pages/find-meaningful-work.md\`. These are leads derived from page assessments, not confirmed openings; verify with the organization.
- **Start or fund a high-growth company:** [the founder-resource tier list](founder-resource-tier-list.md) · \`${BASE}/views/founder-resource-tier-list.md\` ranks all ${founderRanked.length} of Utah's resource and helper pages by what they hand a founder; the ${founderTop.length} in **S**, **A**, and **B** are where a week is worth spending. Then [Startup Capital in Utah](/pages/startup-capital-in-utah.md) · \`${BASE}/pages/startup-capital-in-utah.md\` · [Find an Advisor](/pages/find-an-advisor.md) · \`${BASE}/pages/find-an-advisor.md\`
- **Grow a Main Street or rural business without venture capital:** [Find Business Services](/pages/find-business-services.md) · \`${BASE}/pages/find-business-services.md\` routes formation, lending, procurement, regulation, and workforce help; combine it with [resources](resources.md) · \`${BASE}/views/resources.md\` and [by Utah location](by-region.md) · \`${BASE}/views/by-region.md\`.
- **Commercialize research or find technical space:** [Commercialize Research in Utah](/pages/commercialize-research.md) · \`${BASE}/pages/commercialize-research.md\` · [Find Prototyping Space](/pages/find-prototyping-space-in-utah-county.md) · \`${BASE}/pages/find-prototyping-space-in-utah-county.md\`
- **Explore a field:** use a [sector hub](#sectors), then open the full pages behind the promising lines. If the hub is sparse, search synonyms and check the complete type indexes—the Domain rollout is incomplete.
- **Find nearby work or resources:** [browse by Utah location](by-region.md) · \`${BASE}/views/by-region.md\`, use the [map](${BASE}/map), or query \`${BASE}/api/locations?near=Salt+Lake+City&radius_miles=35\`. Proximity results include only mapped public sites and coarse regional anchors, so also check the Region view.
- **See what Utah has built:** [historical and current work](work.md) · \`${BASE}/views/work.md\`, optionally grouped [by era](by-era.md) · \`${BASE}/views/by-era.md\`.
- **Investigate a claim:** find and open the subject page first, follow its Evidence links, then use the [evidence graph](evidence.md) · \`${BASE}/views/evidence.md\` to see every page that relies on each source.
- **Search for something specific:** \`${BASE}/api/search?q=enhanced+geothermal\` is exact-phrase, full-text search. Make several narrow synonym probes (for example \`climate\`, \`energy\`, \`geothermal\`); it is not fuzzy or relevance-ranked.

## Sectors

Sector hubs separate primary players, historical proof, people, programs, current needs, and pages where the sector is secondary. Domain attribution currently covers ${attributed.length}/${pages.length} pages (${pct(attributed.length, pages.length)}%); an absent result may mean the rollout is incomplete, not that Utah has no work in that field.

${domainViews.map((d) => `- [${domainLabel(d)}](domain-${d}.md) · \`${BASE}/views/domain-${d}.md\` — ${attributed.filter((p) => p.domains.includes(d)).length} attributed pages`).join('\n')}

## Browse by another facet

- [By impact tier](tier-list.md) · \`${BASE}/views/tier-list.md\` — ${tiered.length} fact pages ranked S through F on one ladder; ${gems.length} gems in S and A
- [By founder usefulness](founder-resource-tier-list.md) · \`${BASE}/views/founder-resource-tier-list.md\` — a second ladder over the ${founderRanked.length} resource and helper pages, ranked by what they hand a founder rather than by world impact; ${founderTop.length} in S, A, and B
- [By kind of work](by-role.md) · \`${BASE}/views/by-role.md\` — ${roleGroups.length} populated role families derived only from pages with stated-needs assessments; use search and sector hubs for other plausible employers
- [By Utah location](by-region.md) · \`${BASE}/views/by-region.md\` — ${regional.length}/${pages.length} pages carry Region metadata (${pct(regional.length, pages.length)}% coverage)
- [By venture stage](by-stage.md) · \`${BASE}/views/by-stage.md\` — ${staged.length} pages; metadata assertions, not yet sourced
- [By historical era](by-era.md) · \`${BASE}/views/by-era.md\` — ${dated.length} pages; metadata assertions, not yet sourced

## Browse the complete corpus by type

These lists provide exhaustive access by page type. Each line in a type view includes a short description and a full page URL.

- [ventures](ventures.md) · \`${BASE}/views/ventures.md\` — ${count('venture')} companies, labs, initiatives (with needs inline)
- [resources](resources.md) · \`${BASE}/views/resources.md\` — ${count('resource')} grants, accelerators, facilities, capital paths
- [people](people.md) · \`${BASE}/views/people.md\` — ${count('person')} founders, researchers, operators
- [helpers](helpers.md) · \`${BASE}/views/helpers.md\` — ${count('helper')} advisors, funds, service providers
- [work](work.md) · \`${BASE}/views/work.md\` — ${count('work')} historical proofs of what Utah has built
- [guides](guides.md) · \`${BASE}/views/guides.md\` — ${count('guide')} opinionated maps and playbooks
- [sources](sources.md) · \`${BASE}/views/sources.md\` — ${count('source')} public evidence records

## Trust, standards, and contribution

- Page claims carry Confidence grades; use the [evidence graph](evidence.md) · \`${BASE}/views/evidence.md\` to see what rests on what and which sources nothing cites.
- What qualifies as great work: ${BASE}/meta/charter.md · placement and page format: ${BASE}/meta/conventions.md · metadata registry: ${BASE}/meta/attributes.md
- All pages live flat at \`${BASE}/pages/{slug}.md\`; every view here is generated from page metadata. Full URLs are repeated so restricted fetchers can follow them.
- To report a gap or contribute a sourced page, follow the review-gated procedure in ${BASE}/llms.txt or open ${BASE}/contribute.
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
