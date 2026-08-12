#!/usr/bin/env node
// Resolves **Identifiers:** against public registries — the join key that turns "find a primary
// source for this company" from a research task into a fetch. See meta/attributes.md
// ("Identifiers") and research/design/raw-source-capture.md, Phase 1.
//
// The governing rule is that a wrong key is worse than no key, because every later harvest
// inherits it silently and nothing downstream can tell a corroborated CIK from a guessed one. So
// this proposes, and writes only what it can corroborate by name against the registry's own
// record. Ambiguity is a legal outcome and lands in the report for a human or a subagent.
//
//   node scripts/resolve-identifiers.mjs                 # dry run -> report
//   node scripts/resolve-identifiers.mjs --write         # apply confident matches only
//   node scripts/resolve-identifiers.mjs --stem fervo-energy
//   node scripts/resolve-identifiers.mjs --key ein --limit 40
import fs from 'node:fs'
import path from 'node:path'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const PAGES = path.join(REPO, 'wiki/pages')
const REPORT = path.join(REPO, 'research/raw-data/identifier-resolution.md')
// SEC asks for a descriptive agent with contact info and no more than 10 requests a second.
const UA = 'greatutah.work identifier resolution (+https://greatutah.work)'

const args = process.argv.slice(2)
const write = args.includes('--write')
const argValue = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null }
const stem = argValue('--stem')
const onlyKey = argValue('--key')
const limit = Number(argValue('--limit') || 0)
// Re-derives identifiers the corpus already carries and compares. Precision is the only number
// that matters for this script — a resolver that finds a lot and is sometimes wrong is worse than
// no resolver, because its output looks identical to hand-verified work.
const audit = args.includes('--audit')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || ''

// Registry names carry corporate furniture the page title does not ("Fervo Energy Co" for
// [Fervo Energy]), and matching has to see through it without seeing through the actual name.
// Only trailing suffixes are stripped, so "Nucleus Holding, Inc." stays distinct from "Nucleus".
const SUFFIXES = /\b(incorporated|inc|llc|l\.l\.c|corporation|corp|company|co|limited|ltd|lp|llp|plc|holdings?|the)\b/g
function norm(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(SUFFIXES, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 404 is a real answer from these registries ("no organization by that name"), not a failure, and
// conflating the two turned four correct empty results into errors in the first audit. Throttling
// and 5xx are genuinely transient and worth waiting out — a dropped request reads as "no
// identifier exists", which is the expensive kind of wrong here.
async function fetchWithRetry(url, accept) {
  for (let attempt = 0; ; attempt += 1) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, ...(accept ? { Accept: accept } : {}) }, signal: AbortSignal.timeout(30000) })
    if (res.status === 404) return null
    if (res.ok) return res
    if ((res.status === 429 || res.status >= 500) && attempt < 3) { await sleep(1200 * (attempt + 1)); continue }
    throw new Error(`http ${res.status}`)
  }
}

async function getJson(url) {
  const res = await fetchWithRetry(url, 'application/json')
  return res ? res.json() : null
}

async function getText(url) {
  const res = await fetchWithRetry(url)
  return res ? res.text() : null
}

// -- registries -------------------------------------------------------------
// Each returns candidates as { id, name, state, note }, unranked. Scoring is shared below so one
// rule governs every registry rather than each inventing its own idea of "close enough".

async function searchEin(name) {
  // ProPublica indexes the IRS exempt-organization data. Unstated but load-bearing: a for-profit
  // returns nothing here, so this doubles as a nonprofit test and needs no pre-filtering.
  const d = await getJson(`https://projects.propublica.org/nonprofits/api/v2/search.json?q=${encodeURIComponent(name)}`)
  return (d?.organizations || []).map((o) => ({
    id: o.strein,
    name: o.name,
    state: o.state,
    note: [o.city, o.state].filter(Boolean).join(', ') + (o.subseccd ? ` · 501(c)(${o.subseccd})` : ''),
  }))
}

// EDGAR has begun answering some company searches with a JavaScript landing page that carries no
// results at all — "Myriad Genetics" is one, and it looked exactly like "this company does not
// exist". The published ticker file is the durable answer for anything with a ticker, so it runs
// first and the scraped search only has to cover private Form D filers.
let tickerCache = null
async function tickerCandidates(name) {
  if (!tickerCache) {
    const d = await getJson('https://www.sec.gov/files/company_tickers.json')
    tickerCache = Object.values(d || {}).map((c) => ({
      id: String(c.cik_str).padStart(10, '0'),
      name: c.title,
      state: null,
      note: `${c.ticker} · SEC ticker registry`,
    }))
  }
  const want = norm(name)
  return tickerCache.filter((c) => norm(c.name) === want)
}

async function searchCik(name) {
  const byTicker = await tickerCandidates(name)
  if (byTicker.length) return byTicker
  // The atom form of this endpoint serializes company names as "ARRAY(0x...)" when more than one
  // company matches — a real EDGAR bug — so the HTML table is the only view that carries names
  // and CIKs together. Single-match responses redirect into a filing list with no table at all,
  // which is why the company-info fallback exists.
  const html = await getText(`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(name)}&type=&dateb=&owner=include&count=40`)
  if (!html) return []
  const rows = [...html.matchAll(/CIK=(\d{10})&amp;[^"]*"[^>]*>\d+<\/a><\/td>\s*<td scope="row">([^<]+)<\/td>\s*<td scope="row">([^<]*)<\/td>/g)]
  if (rows.length) return rows.map((m) => ({ id: m[1], name: decodeHtml(m[2]), state: m[3].trim() || null, note: m[3].trim() || 'no state' }))
  const one = html.match(/CIK=(\d{10})/)
  const named = html.match(/<span class="companyName">([^<]+)/)
  if (one && named) return [{ id: one[1], name: decodeHtml(named[1]).replace(/\s*CIK.*$/, '').trim(), state: null, note: 'sole match' }]
  return []
}

// A registrant's own EDGAR submissions record carries its IRS number, so once the CIK is
// corroborated the EIN comes from the same primary record rather than from a second name match —
// which is exactly the standard meta/attributes.md sets ("another primary record links them").
// This is the only place an identifier is accepted without its own name match, and it is why
// for-profit EINs are reachable at all: ProPublica indexes exempt organizations only.
async function einFromCik(cik) {
  const d = await getJson(`https://data.sec.gov/submissions/CIK${cik}.json`)
  const raw = String(d?.ein || '').replace(/\D/g, '')
  // EDGAR returns all zeros for a registrant that never disclosed an IRS number, and that placeholder
  // reads downstream as a real EIN — three pages were about to record 00-0000000.
  if (raw.length !== 9 || /^0+$/.test(raw)) return null
  return `${raw.slice(0, 2)}-${raw.slice(2)}`
}

async function searchRor(name) {
  const d = await getJson(`https://api.ror.org/organizations?query=${encodeURIComponent(name)}`)
  return (d?.items || []).slice(0, 10).map((o) => {
    const label = (o.names || []).find((n) => n.types?.includes('ror_display')) || (o.names || []).find((n) => n.types?.includes('label')) || (o.names || [])[0]
    const loc = (o.locations || [])[0]?.geonames_details || {}
    return {
      id: String(o.id).replace('https://ror.org/', ''),
      name: label?.value || '',
      state: loc.country_subdivision_code || null,
      note: [loc.name, loc.country_subdivision_code].filter(Boolean).join(', '),
    }
  })
}

function decodeHtml(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

// -- scoring ----------------------------------------------------------------
// How much a matching name is worth depends entirely on which registry answered, and getting this
// wrong in both directions is what the first full run demonstrated.
//
// For SEC, a state mismatch is normal and must not disqualify: Fervo files from Houston and drills
// in Beaver County, Northrop's Promontory plant answers to Virginia. A CIK is also unique to a
// registrant, so an exact name match is already decisive.
//
// For the IRS exempt-organization data the opposite holds. Organization names are *regional by
// construction* and collide constantly across states — the first run confidently matched Utah's
// Davis Chamber of Commerce to one in Davis, Oklahoma, Carbon County's economic development office
// to Carbon County, Wyoming, and Ancestry to an unrelated Michigan charity. Every one had a
// flawless name match. So EIN demands name *and* place, which is what attributes.md asked for all
// along; only SEC gets the exemption, and only because a CIK cannot be ambiguous.
//
// Near-matches are never enough for EIN either: "Cotopaxi Foundation" is a different legal entity
// from Cotopaxi, and a grant-making foundation's finances are not the company's.
function score(pageName, pageState, candidates, { requirePlace = false } = {}) {
  const want = norm(pageName)
  if (!want) return { verdict: 'none', why: 'page has no usable name' }
  const scored = candidates.map((c) => {
    const got = norm(c.name)
    const exact = got === want
    const prefix = !exact && (got.startsWith(`${want} `) || want.startsWith(`${got} `))
    return { ...c, exact, prefix, samePlace: Boolean(pageState) && c.state === pageState }
  })
  const exacts = scored.filter((c) => c.exact)
  const eligible = requirePlace ? exacts.filter((c) => c.samePlace) : exacts
  if (eligible.length === 1) {
    return {
      verdict: 'confident',
      pick: eligible[0],
      why: requirePlace ? `name and ${pageState} address both match the page` : 'registry name matches the page name exactly',
    }
  }
  if (eligible.length > 1) return { verdict: 'review', candidates: eligible, why: `${eligible.length} registry entries share this exact name` }
  if (requirePlace && exacts.length) {
    return { verdict: 'review', candidates: exacts.slice(0, 6), why: `name matches but no candidate is in ${pageState || 'the page\'s state'} — same-name organizations in other states are a different entity` }
  }
  const prefixes = scored.filter((c) => c.prefix)
  if (!requirePlace && prefixes.length === 1 && prefixes[0].samePlace) {
    return { verdict: 'confident', pick: prefixes[0], why: `sole near-name match, and the registry address is in ${pageState}` }
  }
  if (prefixes.length) return { verdict: 'review', candidates: prefixes.slice(0, 6), why: 'name is close but not exact' }
  if (scored.length) return { verdict: 'review', candidates: scored.slice(0, 6), why: 'no name match among returned candidates' }
  return { verdict: 'none', why: 'registry returned nothing for this name' }
}

// -- page selection ---------------------------------------------------------
// Never person pages: meta/attributes.md forbids recording a key that identifies a private
// individual, and every registry here is keyed to organizations.
const TARGET_TYPES = new Set(['venture', 'helper', 'resource', 'work'])
const RESEARCH_HINT = /\b(university|college|institute|laborator|research|school|academy|hospital|center for)\b/i

const pages = []
for (const f of fs.readdirSync(PAGES).sort()) {
  if (!f.endsWith('.md')) continue
  if (stem && f !== `${stem}.md`) continue
  const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
  const type = meta(raw, 'Type')
  if (!TARGET_TYPES.has(type)) continue
  const have = Object.fromEntries(
    meta(raw, 'Identifiers').split(',').map((p) => p.split('=').map((s) => s.trim())).filter((p) => p.length === 2)
  )
  if (audit && !Object.keys(have).length) continue
  const title = (raw.match(/^# (.+)$/m) || [, f])[1].trim()
  const where = meta(raw, 'Primary Location') || meta(raw, 'Utah Location')
  pages.push({
    file: f, raw, type, title, have,
    // Two-letter state for place corroboration. Utah pages are the overwhelming majority, but a
    // page HQ'd elsewhere ("Adobe · San Jose, CA") must be checked against its own state, not ours.
    state: /\butah\b/i.test(where) ? 'UT' : (where.match(/,\s*([A-Z]{2})\b/) || [])[1] || null,
    // Only the title, not Focus: a venture page whose Focus mentions "research" is not a research
    // organization, and ROR will happily return the university it collaborates with.
    research: RESEARCH_HINT.test(title),
  })
}

const REGISTRIES = [
  { key: 'ein', label: 'IRS exempt organizations (via ProPublica)', search: searchEin, wait: 350, when: () => true, requirePlace: true },
  { key: 'cik', label: 'SEC EDGAR company search', search: searchCik, wait: 250, when: () => true, requirePlace: false },
  { key: 'ror', label: 'Research Organization Registry', search: searchRor, wait: 250, when: (p) => p.research, requirePlace: true },
].filter((r) => !onlyKey || r.key === onlyKey)

const results = []
let queried = 0
for (const p of pages) {
  if (limit && queried >= limit) break
  const found = []
  for (const reg of REGISTRIES) {
    if (audit ? !p.have[reg.key] : p.have[reg.key] || !reg.when(p)) continue
    let outcome
    try {
      outcome = score(p.title, p.state, await reg.search(p.title), { requirePlace: reg.requirePlace })
    } catch (e) {
      outcome = { verdict: 'error', why: String(e.message || e).slice(0, 80) }
    }
    found.push({ key: reg.key, label: reg.label, ...outcome })
    await sleep(reg.wait)
    if (reg.key === 'cik' && outcome.verdict === 'confident' && (audit || !p.have.ein) && !found.some((f) => f.key === 'ein' && f.verdict === 'confident')) {
      try {
        const ein = await einFromCik(outcome.pick.id)
        if (ein) {
          const already = found.findIndex((f) => f.key === 'ein')
          const entry = { key: 'ein', label: 'SEC EDGAR registrant record', verdict: 'confident', pick: { id: ein, name: outcome.pick.name, note: `IRS number on CIK ${outcome.pick.id}` }, why: 'same registrant record as the corroborated CIK' }
          if (already >= 0) found[already] = entry
          else found.push(entry)
        }
      } catch { /* the CIK still stands on its own */ }
      await sleep(reg.wait)
    }
  }
  if (found.length) { results.push({ page: p, found }); queried += 1 }
  // stderr, because Node buffers stdout when it is a file and a run this long needs to show
  // progress while it happens rather than all at once when it ends.
  if (found.length && queried % 20 === 0) {
    const hits = results.flatMap((r) => r.found).filter((f) => f.verdict === 'confident').length
    process.stderr.write(`  ${queried}/${pages.length} queried · ${hits} confident so far\n`)
  }
}

if (audit) {
  let agree = 0, wrong = 0, missed = 0
  console.log('\nAudit — proposals vs. identifiers the corpus already carries:\n')
  for (const { page, found } of results) {
    for (const f of found) {
      const known = page.have[f.key]
      if (f.verdict === 'confident' && f.pick.id === known) { agree += 1; console.log(`  ok       ${page.file} ${f.key}=${known}`) }
      // A disagreement is not automatically the resolver's fault: the page may be recording a
      // parent or successor entity on purpose. Read the page before believing either side.
      else if (f.verdict === 'confident') { wrong += 1; console.log(`  DIFFERS  ${page.file} ${f.key}: registry says ${f.pick.id} (${f.pick.name}), page says ${known}`) }
      else { missed += 1; console.log(`  missed   ${page.file} ${f.key}=${known} — ${f.verdict}: ${f.why}`) }
    }
  }
  const decided = agree + wrong
  console.log(`\nagreement: ${decided ? ((agree / decided) * 100).toFixed(0) : '—'}% (${agree} match, ${wrong} differ of ${decided} confident) · reach: ${((agree / (agree + wrong + missed)) * 100).toFixed(0)}% (${missed} left for adjudication)`)
}

// -- apply ------------------------------------------------------------------
// Identifiers sit on one line in a fixed key order so the field reads the same on every page.
const KEY_ORDER = ['cik', 'ein', 'uei', 'lei', 'ror', 'orcid', 'utah-entity', 'wikidata']
let written = 0
if (write) {
  for (const { page, found } of results) {
    const wins = found.filter((f) => f.verdict === 'confident')
    if (!wins.length) continue
    const merged = { ...page.have }
    for (const w of wins) merged[w.key] = w.pick.id
    const line = `**Identifiers:** ${KEY_ORDER.filter((k) => merged[k]).map((k) => `${k}=${merged[k]}`).join(', ')}`
    let out = page.raw
    out = page.have && /^\*\*Identifiers:\*\* .+$/m.test(out)
      ? out.replace(/^\*\*Identifiers:\*\* .+$/m, line)
      // Placed after Focus, which every non-source page carries, so the block keeps one order.
      : out.replace(/^(\*\*Focus:\*\* .+)$/m, `$1\n${line}`)
    if (out !== page.raw) { fs.writeFileSync(path.join(PAGES, page.file), out); written += 1 }
  }
}

// -- report -----------------------------------------------------------------
const confident = results.flatMap((r) => r.found.filter((f) => f.verdict === 'confident').map((f) => ({ ...f, page: r.page })))
const review = results.flatMap((r) => r.found.filter((f) => f.verdict === 'review').map((f) => ({ ...f, page: r.page })))
const errors = results.flatMap((r) => r.found.filter((f) => f.verdict === 'error').map((f) => ({ ...f, page: r.page })))

let md = `# Identifier resolution\n\nGenerated by \`scripts/resolve-identifiers.mjs\` — not in Git. ${pages.length} pages considered, ${queried} queried.\n\n`
md += `A wrong key is worse than no key: every later harvest inherits it and nothing downstream can tell a corroborated identifier from a guessed one. Only exact registry-name matches (and sole near-matches whose registry address is in Utah) are written; everything else is below for adjudication.\n\n`
md += `## Confident (${confident.length})${write ? ` — written to ${written} page(s)` : ' — dry run, nothing written'}\n\n`
for (const c of confident) md += `- \`${c.page.file}\` **${c.key}=${c.pick.id}** — ${c.pick.name} (${c.pick.note}) · ${c.why}\n`
md += `\n## Needs adjudication (${review.length})\n\nPick one and add it by hand, or record nothing and say why in the page's \`## Open Questions\` — an unresolved identifier with a stated reason is a finished page.\n\n`
for (const r of review) {
  md += `- \`${r.page.file}\` (${r.key}) — ${r.why}\n`
  for (const c of r.candidates || []) md += `  - \`${c.id}\` ${c.name} — ${c.note}\n`
}
if (errors.length) {
  md += `\n## Registry errors (${errors.length})\n\n`
  for (const e of errors) md += `- \`${e.page.file}\` (${e.key}) — ${e.why}\n`
}
fs.mkdirSync(path.dirname(REPORT), { recursive: true })
fs.writeFileSync(REPORT, md)

console.log(`considered: ${pages.length} · queried: ${queried} · confident: ${confident.length} · review: ${review.length} · errors: ${errors.length}`)
if (write) console.log(`wrote identifiers to ${written} page(s)`)
else console.log('dry run — pass --write to apply confident matches')
console.log(`report: ${path.relative(REPO, REPORT)}`)
