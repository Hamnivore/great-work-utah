#!/usr/bin/env node
// Migrates `Type: source` pages onto the closed Source Type vocabulary and replaces
// hand-typed `Accessed:` with script-written `Retrieved:`.
//
// There is no "legacy" tier and no grace period: after this runs, every source page is
// judged by the same rules, because a vocabulary that tolerates 49 values cannot enforce
// anything. See wiki/meta/attributes.md "Source Type and tiers".
//
//   node scripts/migrate-source-metadata.mjs            # dry run, prints the plan
//   node scripts/migrate-source-metadata.mjs --write     # rewrite Source Type, drop Accessed
//   node scripts/migrate-source-metadata.mjs --write --probe   # ...and fetch URLs for Retrieved
//
// Mapping is an explicit table, never fuzzy matching: a wrong tier is worse than no tier,
// and a reviewer has to be able to check every decision. Anything absent from the table is
// refused and reported rather than guessed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isAuthWalledHost } from './lib/hosts.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const REPORT = path.join(ROOT, 'research', 'raw-data', 'source-type-migration.md')
const UA = 'greatutah.work source-metadata migration (+https://greatutah.work)'

const args = process.argv.slice(2)
const write = args.includes('--write')
const probe = args.includes('--probe')
const CONCURRENCY = 8

// Legacy value -> closed vocabulary. Unambiguous regardless of which page carries it.
//
// The recurring judgement: an institution's *page about itself* is self-reported however
// official it looks, while a record it *created under a duty* is primary. That is why
// "Official Federal Agency Page" and "Government Science Portal" land on official-page.
const VALUE_MAP = {
  'Official Website': 'official-page',
  'Official website': 'official-page',
  'Company Website': 'official-page',
  'Official Program Page': 'official-page',
  'Official Program Website': 'official-page',
  'Official Nonprofit Program Website': 'official-page',
  'Official Fund Website': 'official-page',
  'Official Resource Partner Page': 'official-page',
  'Official Federal Agency Page': 'official-page',
  'Official Government Portal': 'official-page',
  'Government Science Portal': 'official-page',
  'Official Fact Sheet': 'official-page',
  'Official Collection Record': 'official-page',
  'Official mission page': 'official-page',
  'Official mission update': 'official-page',
  'University Page': 'official-page',
  'Professional Society Record': 'official-page',
  'Engineering Landmark': 'official-page',
  'Incubator Portfolio Listing': 'official-page',
  'Certification Database': 'official-page',
  'Official Website Access Attempt': 'official-page',
  // A program's own landing page is not a queried award record; the award record is a
  // separate, primary artifact that this page does not contain.
  'Grant Database': 'official-page',

  'Press Release': 'press-release',
  'University Press Release': 'press-release',
  'University News Release': 'press-release',
  'Official University Article': 'press-release',
  'Official agency article': 'press-release',
  'Government/Agency Announcement': 'press-release',
  'Investor announcement': 'press-release',

  'News Article': 'news',
  'University news article': 'news',
  'Technology Press': 'news',
  'Industry Press': 'news',
  'Court Records / News Coverage': 'news',

  'Peer-Reviewed Paper': 'peer-reviewed',
  'Peer-Reviewed Journal Article': 'peer-reviewed',

  'Supreme Court Opinion': 'government-record',

  'Reference / Encyclopedia': 'reference',
  'Mixed Secondary Sources': 'reference',
  'Mixed Secondary Sources and Official Product Site': 'reference',
  'Specialist History and Secondary Sources': 'reference',
  'Archive Record; Historical Website': 'reference',
  'FDA Label and Biomedical Reference Sources': 'reference',

  'Firsthand Participant Report': 'testimony',
}

// Page-specific, because the legacy value spans tiers and only the document decides.
// "Government Record" was the worst offender: of eleven pages carrying it, four were
// agency news articles or history essays that would have been promoted to primary tier.
const PAGE_OVERRIDES = {
  // Records created under a duty -> primary.
  'omniture-adobe-sec-14d9-2009.md': 'filing',
  'iomega-sec-10k-1995.md': 'filing',
  'conotoxins-dailymed-prialt.md': 'government-record',
  'nasa-thiokol-solid-rocket-boosters.md': 'government-record', // Rogers Commission report
  // Published *by* a government, but history writing and announcements, not records.
  'utah-history-to-go-harvey-fletcher.md': 'reference',
  'farnsworth-census-bureau-history.md': 'reference',
  'army-srr-tranche2-article.md': 'press-release',
  'mastercontrol-edtif-expansion.md': 'press-release',
  // "Academic Article" spanned a society wiki and a trade magazine.
  'ethw-stokowski-bell-labs-stereo.md': 'reference',
  'cen-first-diamond-synthesis.md': 'news',
}

// The closed vocabulary itself, so re-running is a no-op on pages already migrated —
// idempotence is the acceptance test for every script that touches the corpus.
const VOCAB = new Set([
  'filing',
  'government-record',
  'dataset',
  'peer-reviewed',
  'patent',
  'preprint',
  'news',
  'reference',
  'testimony',
  'official-page',
  'press-release',
])

// Pages that bundle documents of different types. One Source Type cannot describe them,
// so they are split by hand; the script refuses them until the split has happened.
// flys-eye-hires-cosmic-rays-source.md was split on 2026-08-11 into that page (the
// university explainer, official-page) and hires-gzk-suppression-prl-2008.md (peer-reviewed).
const AWAITING_SPLIT = new Set()

function readPages() {
  return fs
    .readdirSync(PAGES)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ file: f, raw: fs.readFileSync(path.join(PAGES, f), 'utf8') }))
    .filter((p) => /^\*\*Type:\*\* source$/m.test(p.raw))
}

function metaValue(raw, key) {
  return (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || null
}

// Retrieved sits with the other machine-written provenance fields, after Publisher and
// before Updated, matching the pages already in the new format.
function setRetrieved(raw, date) {
  const re = /^\*\*Retrieved:\*\* .+$/m
  if (re.test(raw)) return raw.replace(re, `**Retrieved:** ${date}`)
  if (/^\*\*Publisher:\*\* .+$/m.test(raw)) {
    return raw.replace(/^(\*\*Publisher:\*\* .+)$/m, `$1\n**Retrieved:** ${date}`)
  }
  if (/^\*\*Updated:\*\* /m.test(raw)) {
    return raw.replace(/^(\*\*Updated:\*\* )/m, `**Retrieved:** ${date}\n$1`)
  }
  return raw
}

function dropAccessed(raw) {
  return raw.replace(/^\*\*Accessed:\*\* .+\n/m, '')
}

async function probeUrl(url) {
  // An auth-walled host answers 200 with a sign-in shell, which no heuristic below can tell
  // from the document. Never probe it: there is nothing to retrieve without credentials.
  if (isAuthWalledHost(url)) {
    return { ok: false, status: null, parked: false, challenge: false, authWalled: true, error: 'auth wall — no signed-out fetch possible' }
  }
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,*/*' },
      signal: AbortSignal.timeout(20000),
    })
    const body = (await res.text()).slice(0, 4000)
    const lower = body.toLowerCase()
    // A 200 that is a parking page or a bot wall is not a retrieval. Recording one as
    // Retrieved would be the same lie as a hand-typed date.
    const parked = /domain is for sale|buy this domain|godaddy|afternic|sedo\.com/.test(lower)
    const challenge = /just a moment|checking your browser|attention required|access denied/.test(lower)
    return { ok: res.ok && !parked && !challenge, status: res.status, parked, challenge, error: null }
  } catch (e) {
    return { ok: false, status: null, parked: false, challenge: false, error: String(e.message || e).slice(0, 120) }
  }
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++
        out[idx] = await fn(items[idx])
      }
    }),
  )
  return out
}

const today = new Date().toISOString().slice(0, 10)
const pages = readPages()
const plan = []
const refused = []

for (const { file, raw } of pages) {
  const current = metaValue(raw, 'Source Type')
  const target = PAGE_OVERRIDES[file] || VALUE_MAP[current] || (VOCAB.has(current) ? current : null)
  const entry = {
    file,
    current,
    target,
    hadAccessed: /^\*\*Accessed:\*\* /m.test(raw),
    url: metaValue(raw, 'URL'),
    overridden: Boolean(PAGE_OVERRIDES[file]),
  }
  if (AWAITING_SPLIT.has(file)) {
    refused.push({ ...entry, reason: 'bundles documents of different types — split it first' })
    continue
  }
  if (!current) {
    refused.push({ ...entry, reason: 'no **Source Type:** at all' })
    continue
  }
  if (!target) {
    refused.push({ ...entry, reason: `no mapping for "${current}" — add it to VALUE_MAP or PAGE_OVERRIDES` })
    continue
  }
  plan.push(entry)
}

const changing = plan.filter((p) => p.current !== p.target || p.hadAccessed)

let probes = new Map()
if (probe) {
  const targets = plan.filter((p) => p.url && /^https?:\/\//i.test(p.url.split(/[;,]\s*/)[0]))
  process.stderr.write(`probing ${targets.length} URLs...\n`)
  const results = await mapLimit(targets, CONCURRENCY, async (p) => {
    const first = p.url.split(/[;,]\s*/)[0]
    return [p.file, await probeUrl(first)]
  })
  probes = new Map(results)
}

if (write) {
  for (const p of plan) {
    const file = path.join(PAGES, p.file)
    let raw = fs.readFileSync(file, 'utf8')
    if (p.current !== p.target) {
      raw = raw.replace(/^\*\*Source Type:\*\* .+$/m, `**Source Type:** ${p.target}`)
    }
    raw = dropAccessed(raw)
    const pr = probes.get(p.file)
    if (pr?.ok) raw = setRetrieved(raw, today)
    fs.writeFileSync(file, raw)
  }
}

const byTarget = {}
for (const p of plan) byTarget[p.target] = (byTarget[p.target] || 0) + 1
const dead = [...probes.entries()].filter(([, r]) => !r.ok)

const lines = [
  '# Source Type migration',
  '',
  `Generated ${today} by \`scripts/migrate-source-metadata.mjs\`${write ? ' (--write)' : ' (dry run)'}.`,
  'Regenerate rather than edit.',
  '',
  `- source pages: ${pages.length}`,
  `- mapped: ${plan.length} (${changing.length} needed a change)`,
  `- refused: ${refused.length}`,
  probe ? `- probed: ${probes.size}, unreachable: ${dead.length}` : '- not probed (run with --probe)',
  '',
  '## Resulting distribution',
  '',
  '| Source Type | Pages |',
  '|---|---:|',
  ...Object.entries(byTarget)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `| \`${k}\` | ${v} |`),
  '',
]

if (refused.length) {
  lines.push('## Refused — needs a human', '')
  for (const r of refused) lines.push(`- \`${r.file}\` — ${r.reason}`)
  lines.push('')
}

const overridden = plan.filter((p) => p.overridden)
if (overridden.length) {
  lines.push(
    '## Page-specific calls',
    '',
    'These carried a legacy value that spanned tiers, so the document decided, not the label.',
    '',
  )
  for (const p of overridden) lines.push(`- \`${p.file}\` — "${p.current}" → \`${p.target}\``)
  lines.push('')
}

if (dead.length) {
  lines.push(
    '## Unreachable URLs — no Retrieved written',
    '',
    'Absence of `Retrieved:` is the signal. These need an archive snapshot and a raw capture,',
    'or a corrected URL via `npm run links:recover`.',
    '',
  )
  for (const [file, r] of dead) {
    const why = r.error ? `error: ${r.error}` : r.parked ? 'parked domain' : r.challenge ? 'bot wall' : `HTTP ${r.status}`
    lines.push(`- \`${file}\` — ${why}`)
  }
  lines.push('')
}

fs.mkdirSync(path.dirname(REPORT), { recursive: true })
fs.writeFileSync(REPORT, lines.join('\n'))

console.log(`source pages: ${pages.length}`)
console.log(`mapped: ${plan.length} (${changing.length} changing)`)
console.log(`refused: ${refused.length}`)
if (probe) console.log(`probed: ${probes.size}, unreachable: ${dead.length}`)
console.log(`distribution: ${Object.entries(byTarget).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`)
if (refused.length) {
  console.log('\nrefused:')
  for (const r of refused) console.log(`  ${r.file} — ${r.reason}`)
}
console.log(`\nreport: ${path.relative(ROOT, REPORT)}`)
if (!write) console.log('dry run — re-run with --write to apply')
