// Generates six hierarchy overlays (H2..H7) from the existing wiki content,
// plus structural metrics for each. Output: ./hierarchies/h2..h7/ + metrics table.
// These are mechanical approximations of curated schemas — classifier ambiguity
// is itself a measurement (see design/hierarchy-redesigns.md).
import fs from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const WIKI = new URL('../../wiki', import.meta.url).pathname
const OUT = path.join(HERE, 'hierarchies')
fs.rmSync(OUT, { recursive: true, force: true })

const CATS = ['ventures', 'people', 'helpers', 'resources', 'work', 'guides', 'sources']
const section = (raw, name) => (raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`)) || [])[1]?.trim() || ''
const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''
const clip = (t, n = 160) => { const s = (t || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1) + '…' }

// ---------- load ----------
const pages = []
for (const cat of CATS) {
  const dir = path.join(WIKI, cat)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    pages.push({
      cat, slug: f.replace('.md', ''), url: `/wiki/${cat}/${f}`,
      title: (raw.match(/^# (.+)$/m) || [, f])[1].trim(),
      focus: meta(raw, 'Focus'), location: meta(raw, 'Location'),
      summary: clip(section(raw, 'Summary'), 200),
      needs: clip(section(raw, 'What They Need Now') || section(raw, 'What They Need'), 200),
      raw,
    })
  }
}
const facts = pages.filter((p) => p.cat !== 'sources' && p.cat !== 'guides')

// ---------- domain classifier (keyword rules over focus+title) ----------
const DOMAINS = {
  'energy': /geotherm|energy|solar|nuclear|battery|grid|power|hydrogen|drilling|oil|gas|fuel|storage|electr/i,
  'health-bio': /bio|medic|health|pharma|clinical|device.*fda|diagnostic|therap|neuro|genom|drug|surg|cancer|protein|dna/i,
  'aerospace-defense': /aerospace|defense|rocket|missile|satellite|uas|drone|military|air force|space force|munition|radar|composite/i,
  'computing': /software|saas|ai|machine learning|data|comput|cloud|cyber|semiconductor|graphics|internet|app|platform/i,
  'materials-mfg': /manufactur|materials|mining|steel|chemical|composite|3d print|industrial|construction|supply chain/i,
  'space-science': /space|astro|nasa|telescope|planetary|physics|research(?!.*market)|university|laboratory|science/i,
  'capital-programs': /grant|fund|accelerator|incubator|capital|invest|loan|sbir|program|economic development|chamber|tax|entrepreneur/i,
  'culture-place': /art|film|culture|outdoor|community|heritage|history museum|recreation|nonprofit(?!.*tech)/i,
}
function classify(p) {
  const hay = `${p.title} ${p.focus} ${p.summary}`
  const hits = Object.keys(DOMAINS).filter((d) => DOMAINS[d].test(hay))
  return hits
}
for (const p of facts) p.domains = classify(p)
const ambiguous = facts.filter((p) => p.domains.length >= 2)
const orphandom = facts.filter((p) => p.domains.length === 0)
for (const p of facts) if (!p.domains.length) p.domains = ['unclassified']

// role keywords for needs-based grouping (H2 by-need, H4 find-work, H6 board)
const ROLES = {
  'mechanical-hardware': /mechanical|hardware|test rig|rotating|thermal|tool design/i,
  'software-data': /software|ml |machine learning|data|embedded|devsecops|signal.processing|controls/i,
  'drilling-subsurface': /drilling|reservoir|petroleum|subsurface|geoscien|geophys/i,
  'manufacturing-quality': /manufactur|quality|ndi|ndt|process engineer|production|assembly/i,
  'bio-clinical': /biolog|clinical|regulatory|chemist|biomed|pharma/i,
  'business-ops': /business development|sales|operat|program manager|finance|marketing|founder/i,
  'science-research': /scientist|research|phd|postdoc|faculty/i,
}
const needers = facts.filter((p) => p.cat === 'ventures' && p.needs)
const roleOf = (p) => Object.keys(ROLES).filter((r) => ROLES[r].test(p.needs))

const w = (schema, file, content) => {
  const fp = path.join(OUT, schema, file)
  fs.mkdirSync(path.dirname(fp), { recursive: true })
  fs.writeFileSync(fp, content)
}
const line = (p, extra = '') => `- [${p.title}](${p.url}) · ${clip(p.focus || p.summary, 110)}${extra}\n`

// ---------- H2: facet lattice ----------
{
  const facetDocs = {}
  const add = (facet, val, p, extra = '') => {
    const k = `by-${facet}/${val}.md`
    facetDocs[k] = (facetDocs[k] || `# ${facet}: ${val}\n\n`) + line(p, extra)
  }
  for (const p of facts) {
    add('type', p.cat, p)
    for (const d of p.domains) add('domain', d, p)
    for (const r of roleOf(p)) add('need', r, p, p.needs ? `\n  needs: ${clip(p.needs, 120)}` : '')
  }
  for (const [k, v] of Object.entries(facetDocs)) w('h2-facets', k, v)
  let root = `# greatutah.work — faceted\n\nEvery page has facets; pick any axis. All indexes are generated and current.\n\n## Facets\n`
  const groups = {}
  for (const k of Object.keys(facetDocs).sort()) { const [g, f] = k.split('/'); (groups[g] ||= []).push(f.replace('.md', '')) }
  for (const [g, vals] of Object.entries(groups)) root += `\n**${g}**: ${vals.map((v) => `[${v}](/${g}/${v}.md)`).join(' · ')}\n`
  w('h2-facets', 'root.md', root)
}

// ---------- H3: domain tree ----------
{
  const doms = [...new Set(facts.flatMap((p) => p.domains))].sort()
  let root = `# greatutah.work — by domain\n\nUtah's work, one hub per sector. Each hub is the whole sector on one page: players, needs, money, history.\n\n`
  for (const d of doms) {
    const ps = facts.filter((p) => p.domains.includes(d))
    let hub = `# ${d} — sector hub\n`
    for (const [label, filt] of [['Players', (p) => p.cat === 'ventures'], ['Who they need', (p) => p.cat === 'ventures' && p.needs], ['Money & programs', (p) => p.cat === 'resources' || p.cat === 'helpers'], ['People', (p) => p.cat === 'people'], ['Proof it can be done here', (p) => p.cat === 'work']]) {
      const sel = ps.filter(filt)
      if (!sel.length) continue
      hub += `\n## ${label}\n\n`
      for (const p of sel) hub += label === 'Who they need' ? `- [${p.title}](${p.url}): ${clip(p.needs, 140)}\n` : line(p)
    }
    w('h3-domains', `${d}.md`, hub)
    root += `- [${d}](/${d}.md) — ${ps.length} pages\n`
  }
  w('h3-domains', 'root.md', root)
}

// ---------- H4: journey tree ----------
{
  let fw = `# Find work worth doing\n\nGrouped by what you bring. Each line: who needs it, right now.\n`
  for (const [r, rx] of Object.entries(ROLES)) {
    const sel = needers.filter((p) => rx.test(p.needs))
    if (!sel.length) continue
    fw += `\n## You bring: ${r.replace('-', ' / ')}\n\n`
    for (const p of sel) fw += `- [${p.title}](${p.url}): ${clip(p.needs, 140)}\n`
  }
  w('h4-journeys', 'find-work.md', fw)
  const res = facts.filter((p) => p.cat === 'resources')
  const buckets = { 'grants-and-non-dilutive': /grant|sbir|utif|micro|voucher|competition/i, 'accelerators-and-programs': /accelerator|incubator|program|bootcamp|course|institute/i, 'capital': /fund|angel|venture|capital|invest|loan|credit/i, 'facilities-and-infrastructure': /lab|facility|makerspace|coworking|campus|center/i }
  let fund = `# Fund or grow a company\n\nCheapest and least-dilutive first.\n`
  for (const [b, rx] of Object.entries(buckets)) {
    const sel = res.filter((p) => rx.test(`${p.title} ${p.focus}`))
    if (sel.length) { fund += `\n## ${b}\n\n`; for (const p of sel) fund += line(p) }
  }
  w('h4-journeys', 'fund-a-company.md', fund)
  let help = `# Find help\n\n`
  for (const p of facts.filter((p) => p.cat === 'helpers')) help += line(p)
  w('h4-journeys', 'find-help.md', help)
  let learn = `# Learn what is possible here\n\n`
  for (const p of facts.filter((p) => p.cat === 'work')) learn += line(p)
  w('h4-journeys', 'learn-what-is-possible.md', learn)
  w('h4-journeys', 'root.md', `# greatutah.work — what do you need?\n\n- [Find work worth doing](/find-work.md)\n- [Fund or grow a company](/fund-a-company.md)\n- [Find help — advisors, services](/find-help.md)\n- [Learn what is possible here](/learn-what-is-possible.md)\n\nFacts behind every recommendation live at stable /wiki/ URLs with cited sources.\n`)
}

// ---------- H5: MOC graph ----------
{
  const mocs = []
  for (const d of [...new Set(facts.flatMap((p) => p.domains))].sort()) {
    const ps = facts.filter((p) => p.domains.includes(d) && (p.cat === 'ventures' || p.cat === 'work'))
    if (ps.length < 3) continue
    let m = `# The ${d} map\n\nCurated trailheads; follow Relates/See Also links from any page onward.\n\n`
    for (const p of ps) m += line(p, p.needs ? ` → needs: ${clip(p.needs, 90)}` : '')
    m += `\nAdjacent maps: [money](/the-money-map.md), [talent-needs](/the-talent-needs-map.md), [history](/the-history-map.md)\n`
    w('h5-mocs', `the-${d}-map.md`, m)
    mocs.push(`the-${d}-map`)
  }
  let money = `# The money map\n\n`
  for (const p of facts.filter((p) => p.cat === 'resources' || p.cat === 'helpers')) money += line(p)
  w('h5-mocs', 'the-money-map.md', money); mocs.push('the-money-map')
  let tal = `# The talent-needs map\n\n`
  for (const p of needers) tal += `- [${p.title}](${p.url}): ${clip(p.needs, 140)}\n`
  w('h5-mocs', 'the-talent-needs-map.md', tal); mocs.push('the-talent-needs-map')
  let hist = `# The history map\n\n`
  for (const p of facts.filter((p) => p.cat === 'work')) hist += line(p)
  w('h5-mocs', 'the-history-map.md', hist); mocs.push('the-history-map')
  w('h5-mocs', 'root.md', `# greatutah.work — maps of content\n\nNo categories. Pick a map, then follow links; every page links onward.\n\n${mocs.map((m) => `- [${m.replace(/-/g, ' ')}](/${m}.md)`).join('\n')}\n`)
}

// ---------- H6: opportunity ledger ----------
{
  let board = `# The opportunity board\n\nEvery actionable opening this wiki knows about, grouped by what you bring. Each links to the org card with evidence.\n`
  for (const [r, rx] of Object.entries(ROLES)) {
    const sel = needers.filter((p) => rx.test(p.needs))
    if (!sel.length) continue
    board += `\n## For ${r.replace('-', ' / ')} people\n\n`
    for (const p of sel) board += `- **${clip(p.needs, 120)}** — [${p.title}](${p.url})\n`
  }
  board += `\n## Capital windows\n\n`
  for (const p of facts.filter((p) => p.cat === 'resources' && /grant|sbir|fund|competition|challenge/i.test(p.title + p.focus)).slice(0, 40)) board += line(p)
  w('h6-opportunities', 'board.md', board)
  w('h6-opportunities', 'root.md', `# greatutah.work — opportunities\n\nThe atom here is the opening, not the organization.\n\n- [The opportunity board](/board.md) — every known opening, by what you bring\n- Org cards, proofs, and evidence live at stable /wiki/ URLs.\n`)
}

// ---------- H7: codex ----------
{
  const doms = [...new Set(facts.flatMap((p) => p.domains))].sort()
  let root = `# greatutah.work — the codex\n\nOne document per domain; fetch it and you hold the whole sector.\n\n`
  for (const d of doms) {
    const ps = facts.filter((p) => p.domains.includes(d))
    let cx = `# Codex: ${d}\n\nEverything this wiki knows about ${d} in Utah. Full pages with evidence at the listed URLs.\n`
    for (const cat of ['ventures', 'work', 'people', 'helpers', 'resources']) {
      const sel = ps.filter((p) => p.cat === cat)
      if (!sel.length) continue
      cx += `\n\n## ${cat}\n`
      for (const p of sel) cx += `\n### ${p.title}\n${p.url}${p.focus ? ` · ${p.focus}` : ''}\n${p.summary}${p.needs ? `\nNeeds: ${p.needs}` : ''}\n`
    }
    w('h7-codex', `codex-${d}.md`, cx)
    root += `- [${d}](/codex-${d}.md) — ${ps.length} pages, ${(Buffer.byteLength(cx) / 1024).toFixed(0)}KB\n`
  }
  w('h7-codex', 'root.md', root)
}

// ---------- structural metrics ----------
const gems = ['/wiki/ventures/rodatherm-energy.md', '/wiki/ventures/act-aerospace.md', '/wiki/resources/nucleus-grow.md', '/wiki/work/utah-forge.md']
console.log('\nschema        navdocs  navKB  coverage  gems-linked  notes')
for (const schema of fs.readdirSync(OUT).sort()) {
  const files = []
  const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) f.isDirectory() ? walk(path.join(d, f.name)) : files.push(path.join(d, f.name)) }
  walk(path.join(OUT, schema))
  const all = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
  const kb = (Buffer.byteLength(all) / 1024).toFixed(0)
  const covered = facts.filter((p) => all.includes(`](${p.url})`) || all.includes(`\n${p.url}`)).length
  const gemHits = gems.filter((g) => all.includes(g)).length
  console.log(`${schema.padEnd(14)}${String(files.length).padEnd(9)}${String(kb).padEnd(7)}${covered}/${facts.length}   ${gemHits}/4`)
}
console.log(`\nclassifier: ${ambiguous.length} ambiguous (2+ domains), ${orphandom.length} unclassifiable of ${facts.length} fact pages`)
console.log('ambiguous sample:', ambiguous.slice(0, 8).map((p) => p.slug).join(', '))
console.log('unclassified sample:', orphandom.slice(0, 8).map((p) => p.slug).join(', '))
