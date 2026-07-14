#!/usr/bin/env node
// Recover or classify broken official URLs found on wiki pages.
// Strategy (in order): known aliases → HTTP probe → optional headless Chrome →
// Wayback CDX → fuzzy match against Startup State live catalog / wiki titles.
//
// Usage:
//   node scripts/recover-broken-links.mjs                  # scan all **Website:** fields
//   node scripts/recover-broken-links.mjs --stem foo       # one page
//   node scripts/recover-broken-links.mjs --url https://…  # one URL
//   node scripts/recover-broken-links.mjs --browser        # use headless Chrome when fetch fails
//   node scripts/recover-broken-links.mjs --write-report   # research/link-recovery/latest-report.md
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const OUT_DIR = path.join(ROOT, 'research', 'link-recovery')
const ALIAS_PATH = path.join(OUT_DIR, 'url-aliases.json')
const CATALOG_PATH = path.join(ROOT, 'research', 'startup-state', 'live-catalog.json')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const args = process.argv.slice(2)
const wantBrowser = args.includes('--browser')
const writeReport = args.includes('--write-report')
const stemArg = argValue('--stem')
const urlArg = argValue('--url')

function argValue(flag) {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : null
}

function normalizeUrl(u) {
  try {
    const url = new URL(String(u || '').trim())
    url.hash = ''
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.toString().replace(/\/$/, '')
  } catch {
    return String(u || '')
      .trim()
      .replace(/\/$/, '')
  }
}

function loadAliases() {
  const raw = JSON.parse(fs.readFileSync(ALIAS_PATH, 'utf8'))
  const map = new Map()
  for (const [k, v] of Object.entries(raw.aliases || {})) map.set(normalizeUrl(k), v)
  return { map, notes: raw.notes || {}, waybackPreferred: raw.wayback_preferred || {} }
}

function collectTargets() {
  if (urlArg) return [{ stem: '(cli)', title: '', website: urlArg }]
  const out = []
  for (const f of fs.readdirSync(PAGES)) {
    if (!f.endsWith('.md')) continue
    const stem = f.replace(/\.md$/, '')
    if (stemArg && stem !== stemArg) continue
    const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
    const title = (raw.match(/^# (.+)$/m) || [, stem])[1].trim()
    const website = (raw.match(/^\*\*Website:\*\* (.+)$/m) || [])[1]?.trim()
    if (!website || !/^https?:\/\//i.test(website)) continue
    out.push({ stem, title, website })
  }
  return out
}

async function fetchProbe(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html', Referer: 'https://www.google.com/' },
      signal: AbortSignal.timeout(15000),
    })
    const text = (await res.text()).slice(0, 12000)
    const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120)
    const lower = text.toLowerCase()
    const parked = /godaddy|domain is for sale|buy this domain|related searches|afternic|sedo\.com|parked free/.test(
      lower,
    )
    const challenge = /just a moment|cf-browser|attention required|checking your browser|access denied/.test(
      lower + title.toLowerCase(),
    )
    return {
      ok: res.ok && !parked,
      status: res.status,
      finalUrl: res.url,
      title,
      parked,
      challenge,
      textLen: text.length,
      error: null,
    }
  } catch (e) {
    return {
      ok: false,
      status: null,
      finalUrl: url,
      title: '',
      parked: false,
      challenge: false,
      textLen: 0,
      error: String(e.message || e).slice(0, 160),
    }
  }
}

async function browserProbe(url) {
  try {
    const { chromium } = await import('playwright').catch(() => ({ chromium: null }))
    if (!chromium) return { skipped: true, reason: 'playwright not installed (npm i -D playwright)' }
    const browser = await chromium.launch({
      headless: true,
      channel: process.env.PLAYWRIGHT_CHROME_CHANNEL || 'chrome',
    })
    try {
      const page = await browser.newPage({
        userAgent: UA,
        ignoreHTTPSErrors: true,
      })
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 })
      await page.waitForTimeout(2500)
      const title = await page.title()
      const text = await page.evaluate(() =>
        (document.body?.innerText || '').replace(/\s+/g, ' ').trim(),
      )
      const lower = (title + ' ' + text).toLowerCase()
      return {
        skipped: false,
        ok: (resp?.ok() ?? false) && text.length > 200 && !/domain is for sale|parked free|related searches/.test(lower),
        status: resp?.status() ?? null,
        finalUrl: page.url(),
        title: title.slice(0, 120),
        textLen: text.length,
        parked: /godaddy|parked free|domain is for sale|related searches/.test(lower),
        challenge: /just a moment|attention required|access denied|403 - forbidden/.test(lower),
        sample: text.slice(0, 240),
        error: null,
      }
    } finally {
      await browser.close()
    }
  } catch (e) {
    return { skipped: false, ok: false, error: String(e.message || e).slice(0, 200) }
  }
}

async function waybackNearest(url) {
  const preferred = loadAliases().waybackPreferred[normalizeUrl(url)]
  if (preferred) return { url: preferred, source: 'alias-preferred' }
  if (preferred === null) return { url: null, source: 'alias-none' }
  try {
    const q = new URL('https://web.archive.org/cdx/search/cdx')
    q.searchParams.set('url', url)
    q.searchParams.set('output', 'json')
    q.searchParams.set('filter', 'statuscode:200')
    q.searchParams.set('fl', 'timestamp,original,statuscode')
    q.searchParams.set('limit', '-5')
    const res = await fetch(q, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) })
    if (!res.ok) return { url: null, source: 'cdx-fail', error: String(res.status) }
    const rows = await res.json()
    if (!Array.isArray(rows) || rows.length < 2) return { url: null, source: 'cdx-empty' }
    // last row is newest when limit is negative
    const [, ts, original] = rows[rows.length - 1]
    return {
      url: `https://web.archive.org/web/${ts}/${original}`,
      source: 'cdx',
      timestamp: ts,
    }
  } catch (e) {
    return { url: null, source: 'cdx-error', error: String(e.message || e).slice(0, 120) }
  }
}

function tokenize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

function jaccard(a, b) {
  const A = new Set(tokenize(a))
  const B = new Set(tokenize(b))
  if (!A.size || !B.size) return 0
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  return inter / (A.size + B.size - inter)
}

function fuzzyCatalog(title) {
  if (!fs.existsSync(CATALOG_PATH)) return []
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'))
  return catalog
    .map((r) => ({
      score: Math.max(jaccard(title, r.title), jaccard(title, r.slug?.replace(/-/g, ' '))),
      title: r.title,
      website: r.website,
      startup_url: r.startup_url,
      slug: r.slug,
    }))
    .filter((r) => r.score >= 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function fuzzyWiki(title, selfStem) {
  const hits = []
  for (const f of fs.readdirSync(PAGES)) {
    if (!f.endsWith('.md')) continue
    const stem = f.replace(/\.md$/, '')
    if (stem === selfStem) continue
    const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
    const t = (raw.match(/^# (.+)$/m) || [, ''])[1]
    const score = Math.max(jaccard(title, t), jaccard(title, stem.replace(/-/g, ' ')))
    if (score >= 0.5) {
      const website = (raw.match(/^\*\*Website:\*\* (.+)$/m) || [])[1] || ''
      hits.push({ score, stem, title: t, website })
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 3)
}

function classify(probe, browser) {
  const p = browser && !browser.skipped ? browser : probe
  if (p.parked) return 'DEAD_PARKED'
  if (p.ok) return 'LIVE'
  if (p.challenge) return 'BOT_OR_WAF'
  if (p.status === 404) return 'DEAD_404'
  if (p.status >= 500) return 'BROKEN_5XX'
  if (p.error && /ENOTFOUND|getaddrinfo|Name or service not known|ERR_NAME_NOT_RESOLVED/i.test(p.error))
    return 'DEAD_DNS'
  if (p.error && /SSL|CERT|TLS|ERR_SSL/i.test(p.error)) return 'BROKEN_TLS'
  if (p.error && /AUTH_CREDENTIALS|401/i.test(p.error)) return 'AUTH_GATED'
  if (p.status === 403) return 'FORBIDDEN'
  return 'UNREACHABLE'
}

async function recoverOne(target, aliases) {
  const norm = normalizeUrl(target.website)
  const aliasHit = aliases.map.get(norm)
  const note = aliases.notes[norm] || aliases.notes[new URL(target.website).origin] || ''
  const probe = await fetchProbe(target.website)
  let browser = null
  if (wantBrowser && !probe.ok) browser = await browserProbe(target.website)
  const verdict = classify(probe, browser)
  const suggestions = []
  if (aliasHit) suggestions.push({ kind: 'alias', url: aliasHit, why: 'Known moved/typo correction' })
  if (verdict !== 'LIVE') {
    const wb = await waybackNearest(target.website)
    if (wb.url) suggestions.push({ kind: 'wayback', url: wb.url, why: `Archive (${wb.source})` })
    for (const hit of fuzzyCatalog(target.title)) {
      if (hit.website && normalizeUrl(hit.website) !== norm) {
        suggestions.push({
          kind: 'startup-state-catalog',
          url: hit.website,
          why: `Catalog title match ${(hit.score * 100).toFixed(0)}% → ${hit.title}`,
        })
      }
    }
    for (const hit of fuzzyWiki(target.title, target.stem)) {
      if (hit.website && normalizeUrl(hit.website) !== norm) {
        suggestions.push({
          kind: 'wiki-sibling',
          url: hit.website,
          why: `Similar wiki page ${hit.stem} (${(hit.score * 100).toFixed(0)}%)`,
        })
      }
    }
  }
  return {
    stem: target.stem,
    title: target.title,
    website: target.website,
    verdict,
    note,
    probe: {
      status: probe.status,
      finalUrl: probe.finalUrl,
      title: probe.title,
      error: probe.error,
      parked: probe.parked,
      challenge: probe.challenge,
    },
    browser: browser && !browser.skipped
      ? {
          status: browser.status,
          finalUrl: browser.finalUrl,
          title: browser.title,
          textLen: browser.textLen,
          parked: browser.parked,
          challenge: browser.challenge,
          sample: browser.sample,
          error: browser.error,
        }
      : browser?.skipped
        ? { skipped: true, reason: browser.reason }
        : null,
    suggestions,
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const aliases = loadAliases()
  const targets = collectTargets()
  const results = []
  for (const t of targets) {
    process.stderr.write(`… ${t.stem}\n`)
    results.push(await recoverOne(t, aliases))
  }

  const bad = results.filter((r) => r.verdict !== 'LIVE')
  let md = `# Link recovery report\n\nGenerated: ${new Date().toISOString()}\n\n`
  md += `Scanned ${results.length} Website fields · **${bad.length} not clearly live**\n\n`
  md += `Re-run: \`node scripts/recover-broken-links.mjs --write-report\` (add \`--browser\` for headless Chrome).\n\n`
  for (const r of bad) {
    md += `## ${r.title} (\`${r.stem}\`)\n\n`
    md += `- Website: ${r.website}\n`
    md += `- Verdict: **${r.verdict}**`
    if (r.probe.status != null) md += ` (HTTP ${r.probe.status})`
    if (r.probe.error) md += ` · ${r.probe.error}`
    md += `\n`
    if (r.note) md += `- Note: ${r.note}\n`
    if (r.suggestions.length) {
      md += `- Suggestions:\n`
      for (const s of r.suggestions) md += `  - **${s.kind}:** ${s.url} — ${s.why}\n`
    } else md += `- Suggestions: _(none — search manually / Startup State / staff contact)_\n`
    md += `\n`
  }

  console.log(md)
  if (writeReport) {
    fs.writeFileSync(path.join(OUT_DIR, 'latest-report.md'), md)
    fs.writeFileSync(path.join(OUT_DIR, 'latest-report.json'), JSON.stringify(results, null, 2))
    console.error(`Wrote ${path.join(OUT_DIR, 'latest-report.md')}`)
  }
  if (bad.length && args.includes('--strict')) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
