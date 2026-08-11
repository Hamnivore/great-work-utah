#!/usr/bin/env node
// Fills **Archive:** / **Archived:** on source pages that owe capture, from the Internet
// Archive's CDX index. Deterministic work: an agent should never be choosing a snapshot
// URL by hand, and a hand-copied timestamp is a transcription error waiting to happen.
//
//   node scripts/resolve-archive-snapshots.mjs                 # dry run
//   node scripts/resolve-archive-snapshots.mjs --write
//   node scripts/resolve-archive-snapshots.mjs --write --limit 50
//
// This only *finds existing* snapshots. Creating new ones needs Save Page Now S3 keys,
// which is a maintainer prerequisite — a page with no snapshot in the index is reported,
// not invented.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isMandatedHost } from './lib/hosts.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const REPORT = path.join(ROOT, 'research', 'raw-data', 'archive-resolution.md')
const UA = 'greatutah.work archive resolution (+https://greatutah.work)'

const args = process.argv.slice(2)
const write = args.includes('--write')
const limit = Number(argValue('--limit') || 0)
const stem = argValue('--stem')

function argValue(flag) {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : null
}

const CAPTURE_TIERS = new Set(['official-page', 'press-release', 'news', 'reference', 'preprint', 'testimony'])

function meta(raw, key) {
  return (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// CDX is the right index rather than /wayback/available: it can filter to statuscode 200
// and return several candidates, so a snapshot that captured an error page is skipped
// instead of being recorded as evidence.
async function cdxNewest(url, attempt = 0) {
  const q = new URL('https://web.archive.org/cdx/search/cdx')
  q.searchParams.set('url', url)
  q.searchParams.set('output', 'json')
  q.searchParams.set('filter', 'statuscode:200')
  q.searchParams.set('fl', 'timestamp,original,statuscode,length')
  q.searchParams.set('limit', '-5')
  try {
    const res = await fetch(q, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) })
    if (res.status === 429 && attempt < 3) {
      await sleep(4000 * (attempt + 1))
      return cdxNewest(url, attempt + 1)
    }
    if (!res.ok) return { ok: false, why: `CDX HTTP ${res.status}` }
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length < 2) return { ok: false, why: 'no 200-status snapshot in the index' }
    const body = rows.slice(1)
    // Prefer the newest snapshot that is not a stub. A tiny capture is usually an error
    // or consent page, and quoting one would preserve the wrong bytes forever.
    const substantial = body.filter((r) => Number(r[3] || 0) > 3000)
    const chosen = (substantial.length ? substantial : body)[(substantial.length ? substantial : body).length - 1]
    const [ts, original] = chosen
    return {
      ok: true,
      url: `https://web.archive.org/web/${ts}/${original}`,
      date: `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`,
      bytes: Number(chosen[3] || 0),
      stub: !substantial.length,
    }
  } catch (e) {
    if (attempt < 2) {
      await sleep(3000)
      return cdxNewest(url, attempt + 1)
    }
    return { ok: false, why: String(e.message || e).slice(0, 120) }
  }
}

// The snapshot has to insure the document we actually quoted, and that is not always the
// URL the page cites: `bestfriends.org/about` now serves `/who-we-are`, and WGU moved its
// `/about/*` pages under `/student-experience/*`. Asking CDX about the pre-redirect address
// either finds nothing — reported as "no snapshot exists", which is false and reads as
// ephemerality we cannot fix — or finds an *older* snapshot of a page that predates the move
// and cannot contain the quotes. The capture sidecar already records where the bytes came
// from, so prefer that and fall back to the cited URL.
function capturedUrl(raw) {
  const rawPath = meta(raw, 'Raw')
  if (!rawPath) return null
  const sidecar = path.join(ROOT, rawPath.replace(/\.txt$/, '.json'))
  if (!fs.existsSync(sidecar)) return null
  try {
    return JSON.parse(fs.readFileSync(sidecar, 'utf8')).final_url || null
  } catch {
    return null
  }
}

function upsertArchive(raw, url, date) {
  let out = raw
  if (/^\*\*Archive:\*\* .+$/m.test(out)) out = out.replace(/^\*\*Archive:\*\* .+$/m, `**Archive:** ${url}`)
  else if (/^\*\*URL:\*\* .+$/m.test(out)) out = out.replace(/^(\*\*URL:\*\* .+)$/m, `$1\n**Archive:** ${url}`)
  else out = out.replace(/^(\*\*Updated:\*\* )/m, `**Archive:** ${url}\n$1`)
  if (/^\*\*Archived:\*\* .+$/m.test(out)) out = out.replace(/^\*\*Archived:\*\* .+$/m, `**Archived:** ${date}`)
  else out = out.replace(/^(\*\*Archive:\*\* .+)$/m, `$1\n**Archived:** ${date}`)
  return out
}

let targets = fs
  .readdirSync(PAGES)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ file: f, slug: f.replace(/\.md$/, ''), raw: fs.readFileSync(path.join(PAGES, f), 'utf8') }))
  .filter((p) => /^\*\*Type:\*\* source$/m.test(p.raw))
  .filter((p) => {
    if (stem) return p.slug === stem
    if (meta(p.raw, 'Archive')) return false // already resolved; idempotent
    const type = meta(p.raw, 'Source Type')
    const url = meta(p.raw, 'URL')
    if (!type || !url) return false
    return CAPTURE_TIERS.has(type) || !isMandatedHost(url.split(/[;,]\s*/)[0])
  })
if (limit > 0) targets = targets.slice(0, limit)

const resolved = []
const failed = []
for (const p of targets) {
  const url = meta(p.raw, 'URL').split(/[;,]\s*/)[0]
  const captured = capturedUrl(p.raw)
  const candidates = [...new Set([captured, url].filter(Boolean))]
  let snap = { ok: false, why: 'no candidate URL' }
  let usedUrl = url
  for (const candidate of candidates) {
    snap = await cdxNewest(candidate)
    usedUrl = candidate
    if (snap.ok) break
    await sleep(350)
  }
  if (!snap.ok) {
    failed.push({ file: p.file, url: candidates.join(' | '), why: snap.why })
  } else if (snap.stub) {
    // A snapshot exists but preserves nothing: the index has only sub-3KB rows, which in
    // practice are consent walls, error pages, or JS shells whose body never rendered. It is
    // tempting to record it anyway — a URL in **Archive:** makes the coverage number go up —
    // and that is exactly why not to. The field's job is ephemerality insurance, and a
    // snapshot with no readable text does not pay out. Four of these were recorded on an
    // earlier run and each preserved roughly 700 characters, nearly all of it the Wayback
    // banner's own markup. Reported as unresolved, which is the truth.
    failed.push({
      file: p.file,
      url: candidates.join(' | '),
      why: `only a stub snapshot exists (${snap.bytes} bytes, ${snap.date}) — preserves no readable content`,
    })
  } else {
    resolved.push({ file: p.file, url: usedUrl, redirected: usedUrl !== url, ...snap })
    if (write) {
      fs.writeFileSync(path.join(PAGES, p.file), upsertArchive(p.raw, snap.url, snap.date))
    }
  }
  await sleep(350) // be a good citizen; CDX 429s readily
}

const lines = [
  '# Archive snapshot resolution',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} by \`scripts/resolve-archive-snapshots.mjs\`${write ? ' (--write)' : ' (dry run)'}.`,
  'Regenerate rather than edit.',
  '',
  `- considered: ${targets.length}`,
  `- resolved: ${resolved.length}`,
  `- unresolved: ${failed.length}`,
  '',
]
const redirected = resolved.filter((r) => r.redirected)
if (redirected.length) {
  lines.push(
    '## Resolved via the captured URL, not the cited one',
    '',
    'The page\'s `**URL:**` redirects, and the snapshot was found under the destination — which is',
    'the document the quotes actually came from. Consider pointing `**URL:**` at the destination.',
    '',
    ...redirected.map((r) => `- \`${r.file}\` — ${r.url}`),
    '',
  )
}
const stubs = failed.filter((r) => /only a stub snapshot exists/.test(r.why))
if (failed.length) {
  lines.push(
    '## Unresolved — no usable snapshot exists',
    '',
    'These need a new capture via Save Page Now (maintainer S3 keys) or a corrected URL.',
    'Until then their claims rest on a live URL alone and cannot survive it.',
    '',
    ...failed.map((r) => `- \`${r.file}\` — ${r.why} (${r.url})`),
    '',
  )
}
fs.mkdirSync(path.dirname(REPORT), { recursive: true })
fs.writeFileSync(REPORT, lines.join('\n'))

console.log(`considered: ${targets.length} · resolved: ${resolved.length} · unresolved: ${failed.length}${write ? '' : ' (dry run)'}`)
if (stubs.length) console.log(`  ${stubs.length} had only a stub snapshot (<3 KB) — left unresolved rather than recorded as insurance`)
console.log(`report: ${path.relative(ROOT, REPORT)}`)
