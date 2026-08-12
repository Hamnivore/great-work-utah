#!/usr/bin/env node
// Probe a list of company leads against the promotion bar: a live site is necessary and not
// sufficient — a lead only becomes a page with **at least one corroborating public record
// independent of the company's own site**.
//
// This script establishes the two mechanical halves of that test and nothing else. It re-probes
// each site, and it searches SEC EDGAR for a registrant matching the name, which catches the
// Form D filings a funded startup leaves behind. Everything softer — press, App Store traction,
// named customers — is a judgment call and stays with the human reading the report.
//
// It deliberately knows nothing about where the leads came from. Input is a TSV of
// `host<TAB>name`, so the provenance of the list never reaches this file or its output.
//
//   node scripts/probe-venture-leads.mjs --in leads.tsv --out report.md

import fs from 'node:fs'

const args = process.argv.slice(2)
const argValue = (flag) => {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : null
}
const inFile = argValue('--in')
const outFile = argValue('--out') || 'lead-probe-report.md'
const limit = Number(argValue('--limit') || 0)

if (!inFile) {
  console.error('usage: node scripts/probe-venture-leads.mjs --in <tsv> [--out <md>] [--limit N]')
  process.exit(1)
}

const UA = 'greatutah.work research (wiki source verification)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Parking pages and deploy errors return 200 with real bytes, so status alone does not separate a
// live company from an expired domain.
const PARKED = /domain (is )?for sale|buy this domain|parked (free )?courtesy|godaddy|namecheap|deploy(ment)? (not found|failed)|404: not_found|this site can.t be reached|coming soon/i

async function fetchText(url, { timeout = 20000 } = {}) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeout),
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*' },
    })
    const body = await res.text()
    return { status: res.status, url: res.url, body }
  } catch (e) {
    return { status: 0, url, body: '', error: String(e.message || e) }
  }
}

function visibleText(html) {
  return html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function probeSite(host) {
  for (const scheme of ['https://', 'http://']) {
    const r = await fetchText(scheme + host)
    if (r.status === 0) continue
    const text = visibleText(r.body)
    if (r.status >= 400) return { verdict: 'DEAD', detail: `HTTP ${r.status}`, finalUrl: r.url, chars: text.length }
    if (PARKED.test(text.slice(0, 4000))) return { verdict: 'PARKED', detail: 'parking/deploy-error markers', finalUrl: r.url, chars: text.length }
    if (text.length < 300) return { verdict: 'THIN', detail: `${text.length} chars of text`, finalUrl: r.url, chars: text.length }
    return { verdict: 'LIVE', detail: `${text.length} chars`, finalUrl: r.url, chars: text.length, title: (r.body.match(/<title[^>]*>([^<]{0,120})/i) || [, ''])[1].trim() }
  }
  return { verdict: 'DEAD', detail: 'no response on https or http', finalUrl: null, chars: 0 }
}

const decodeHtml = (s) =>
  s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')

// A registrant search, not a full-text one. Full-text matches any document that happens to contain
// the word, which for names like "Finch", "Ember", or "Horizon" is noise; a registrant match at
// least names an entity, and EDGAR gives its state so the reader can judge whether it is the same
// company or a bigger one wearing the same word.
async function edgarRegistrants(name) {
  const url = `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(name)}&type=&dateb=&owner=include&count=40`
  const r = await fetchText(url)
  if (!r.body) return []
  const rows = [...r.body.matchAll(/CIK=(\d{10})&amp;[^"]*"[^>]*>\d+<\/a><\/td>\s*<td scope="row">([^<]+)<\/td>\s*<td scope="row">([^<]*)<\/td>/g)]
  if (rows.length) return rows.map((m) => ({ cik: m[1], name: decodeHtml(m[2]), state: m[3].trim() || null }))
  const one = r.body.match(/CIK=(\d{10})/)
  const named = r.body.match(/<span class="companyName">([^<]+)/)
  if (one && named) return [{ cik: one[1], name: decodeHtml(named[1]).replace(/\s*CIK.*$/, '').trim(), state: null }]
  return []
}

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\b(inc|llc|l\.l\.c|corp|corporation|co|ltd|holdings|technologies|technology|labs|software|the)\b/g, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const leads = fs
  .readFileSync(inFile, 'utf8')
  .trim()
  .split('\n')
  .map((l) => l.split('\t'))
  .filter((c) => c.length >= 2 && c[0] && !c[0].startsWith('#'))
  .map(([host, name]) => ({ host: host.trim(), name: name.trim() }))

const targets = limit ? leads.slice(0, limit) : leads
console.error(`probing ${targets.length} lead(s)`)

const results = []
for (const [i, lead] of targets.entries()) {
  const site = await probeSite(lead.host)
  let registrants = []
  if (site.verdict === 'LIVE') {
    registrants = await edgarRegistrants(lead.name)
    await sleep(250) // SEC asks for <= 10 requests/second
  }
  const want = norm(lead.name)
  const exact = registrants.filter((r) => norm(r.name) === want)
  results.push({ ...lead, site, registrants, exact })
  if ((i + 1) % 10 === 0) process.stderr.write(`  ${i + 1}/${targets.length}\n`)
}

const live = results.filter((r) => r.site.verdict === 'LIVE')
const withRegistrant = live.filter((r) => r.exact.length)

const lines = []
lines.push('# Lead probe report', '')
lines.push(`Generated by \`scripts/probe-venture-leads.mjs\` from \`${inFile}\`.`, '')
lines.push('**A live site is necessary and not sufficient.** Promotion to a wiki page requires a live')
lines.push('site *plus* at least one corroborating public record independent of the company itself. This')
lines.push('report establishes the live half mechanically and searches SEC EDGAR for a matching')
lines.push('registrant; everything else — press, App Store traction, named customers, state')
lines.push('registration — is a judgment call left to the reader.', '')
lines.push(`Probed **${results.length}**: ${live.length} live · ${results.filter((r) => r.site.verdict === 'THIN').length} thin · ${results.filter((r) => r.site.verdict === 'PARKED').length} parked · ${results.filter((r) => r.site.verdict === 'DEAD').length} dead.`)
lines.push(`Of the live ones, **${withRegistrant.length}** have an exact-name SEC registrant.`, '')

lines.push('## Live, with an exact-name SEC registrant', '')
lines.push('These clear the bar on the mechanical half. Check the state and the filing before writing:')
lines.push('a common name can match a much larger company.', '')
for (const r of withRegistrant) {
  for (const e of r.exact) {
    lines.push(`- **${r.name}** (\`${r.host}\`) — SEC registrant **${e.name}** (CIK ${e.cik}${e.state ? `, ${e.state}` : ''}) · https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${e.cik}&type=D`)
  }
}
lines.push('')

lines.push('## Live, no exact-name SEC registrant', '')
lines.push('A live site only. Needs an independent record from somewhere else — press, an App Store or')
lines.push('Product Hunt listing with real traction, a state registration, or named customers — before it')
lines.push('can become a page. Near-miss registrant names are listed where EDGAR returned any.', '')
for (const r of live.filter((x) => !x.exact.length)) {
  const near = r.registrants.slice(0, 3).map((x) => `${x.name}${x.state ? ` (${x.state})` : ''}`).join('; ')
  lines.push(`- **${r.name}** (\`${r.host}\`) — ${r.site.chars} chars${r.site.title ? ` · "${r.site.title}"` : ''}${near ? ` · near: ${near}` : ''}`)
}
lines.push('')

lines.push('## Not live', '')
for (const r of results.filter((x) => x.site.verdict !== 'LIVE')) {
  lines.push(`- **${r.name}** (\`${r.host}\`) — ${r.site.verdict}: ${r.site.detail}`)
}
lines.push('')

fs.writeFileSync(outFile, lines.join('\n'))
console.error(`\n${results.length} probed · ${live.length} live · ${withRegistrant.length} with SEC registrant`)
console.error(`report: ${outFile}`)
