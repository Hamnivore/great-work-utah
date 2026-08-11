#!/usr/bin/env node
// Captures community-channel testimony into raw/ from the scraper's authenticated capture,
// and verifies every quoted line against it on the way through.
//
// A Slack permalink cannot be fetched signed-out — the workspace answers 200 with a login
// shell (see scripts/lib/hosts.mjs). But the messages are not lost to us: the scraper already
// pulled them with a real session into `<scrapers>/slack/data/<workspace>.messages.jsonl`,
// carrying full text, author, channel, ISO date, and permalink. That file is the capture. This
// script copies the cited messages into `raw/<slug>/` so `verbatim-not-in-raw` can do its job,
// which is the whole point: without it, a fabricated Slack quote lands undetected, because
// there is nothing to check the quote against.
//
// How a page's messages are identified: not by a list someone maintains, but by the quotes
// themselves. Each `## Verbatim` blockquote is matched against the message corpus, and the
// messages that carry them are what gets written. A quote matching no message is reported and
// nothing is written for that page — so this script is also the fabrication check, run at
// capture time rather than at lint time.
//
//   node scripts/capture-slack-sources.mjs --stem nunug-2026-meeting-announcements
//   node scripts/capture-slack-sources.mjs --all --write
//
// Without --write it matches and reports without touching anything.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { verbatimQuotes, normalizeForQuoteCheck } from './lib/verbatim.mjs'
import { isAuthWalledHost } from './lib/hosts.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const RAW = path.join(ROOT, 'raw')

const args = process.argv.slice(2)
const write = args.includes('--write')
const all = args.includes('--all')
const stem = argValue('--stem')
// The scraper lives outside this repo and its data/ is gitignored, so the path is an input
// rather than an assumption. Override when the checkout is somewhere else.
const SLACK_DATA =
  argValue('--slack-data') || path.join(ROOT, '..', 'scrapers', 'slack', 'data')

function argValue(flag) {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : null
}

function meta(raw, key) {
  return (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || null
}

// Line-walked rather than matched. The obvious regex for this wants `\Z` to anchor the end of
// input, and JavaScript has no `\Z` — it reads as a literal "Z", so the section silently ends
// at the first capital Z in the body. That truncated this page's Verbatim at "Nate Zaugg" and
// captured two of its four quotes while reporting success.
function sectionBody(raw, heading) {
  const lines = raw.split('\n')
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`)
  if (start < 0) return ''
  let end = lines.length
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^## /.test(lines[i])) {
      end = i
      break
    }
  }
  return lines.slice(start + 1, end).join('\n').trim()
}

if (!fs.existsSync(SLACK_DATA)) {
  console.error(`no scraper data at ${SLACK_DATA}`)
  console.error('pass --slack-data <dir> pointing at the scraper\'s slack/data directory.')
  process.exit(1)
}

// The corpus, loaded once. Public channels only — the scraper never collects DMs.
const messages = []
for (const f of fs.readdirSync(SLACK_DATA).filter((f) => f.endsWith('.messages.jsonl'))) {
  for (const line of fs.readFileSync(path.join(SLACK_DATA, f), 'utf8').split('\n')) {
    if (!line.trim()) continue
    try {
      const m = JSON.parse(line)
      if (m.text) messages.push({ ...m, _norm: normalizeForQuoteCheck(m.text) })
    } catch {
      /* a truncated final line is not worth failing over */
    }
  }
}
console.log(`corpus: ${messages.length} messages from ${SLACK_DATA}`)

// One capture file per page, holding the cited messages and nothing of ours: the fields a
// reader needs to know who said it, where, and when, in a stable order. This text is what the
// verbatim check substring-matches against, so it must contain the message text unaltered.
function renderCapture(msgs) {
  return msgs
    .map((m) =>
      [
        `workspace: ${m.workspace} (${m.workspace_domain})`,
        `channel: #${m.channel}`,
        `author: ${m.author}${m.author_title ? ` — ${m.author_title}` : ''}`,
        `date: ${m.date}`,
        `permalink: ${m.permalink}`,
        '',
        m.text,
      ].join('\n'),
    )
    .join('\n\n----\n\n')
}

const pages = fs
  .readdirSync(PAGES)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ file: f, slug: f.replace(/\.md$/, ''), raw: fs.readFileSync(path.join(PAGES, f), 'utf8') }))
  .filter((p) => /^\*\*Type:\*\* source$/m.test(p.raw))
  .filter((p) => isAuthWalledHost(meta(p.raw, 'URL')))

let targets = stem ? pages.filter((p) => p.slug === stem) : pages
if (!stem && !all) targets = targets.filter((p) => !meta(p.raw, 'Raw'))

let ok = 0
let failed = 0
for (const p of targets) {
  const quotes = verbatimQuotes(sectionBody(p.raw, 'Verbatim'))
  if (!quotes.length) {
    console.log(`  ${p.file}: no ## Verbatim quotes — nothing to capture`)
    continue
  }

  const matched = new Map()
  const missing = []
  for (const q of quotes) {
    // A quote may elide with an ellipsis; each surviving fragment must still be literal,
    // and all fragments must come from the same message.
    const frags = normalizeForQuoteCheck(q)
      .split(/\s*(?:…|\.\.\.|\[\.\.\.\])\s*/)
      .map((f) => f.replace(/^['"]|['"]$/g, '').trim())
      .filter((f) => f.length > 25)
    if (!frags.length) continue
    const hit = messages.find((m) => frags.every((f) => m._norm.includes(f)))
    if (hit) matched.set(hit.permalink, hit)
    else missing.push(q)
  }

  if (missing.length) {
    failed += 1
    console.log(`  ${p.file}: ${missing.length}/${quotes.length} quote(s) MATCH NO MESSAGE — not captured`)
    for (const q of missing) console.log(`      "${q.slice(0, 100)}${q.length > 100 ? '…' : ''}"`)
    continue
  }

  const msgs = [...matched.values()].sort((a, b) => String(a.date).localeCompare(String(b.date)))
  const text = renderCapture(msgs)
  const hash = crypto.createHash('sha256').update(text).digest('hex')
  const date = new Date().toISOString().slice(0, 10)
  const base = `${date}-${hash.slice(0, 12)}`
  const rel = `raw/${p.slug}/${base}.txt`
  ok += 1
  console.log(`  ${p.file}: ${quotes.length} quote(s) → ${msgs.length} message(s) → ${rel}`)

  if (!write) continue
  const dir = path.join(RAW, p.slug)
  fs.mkdirSync(dir, { recursive: true })
  // Captures are immutable: the hash is in the name, so a re-run with identical content is a
  // no-op and changed content lands beside the old file rather than over it.
  if (!fs.existsSync(path.join(ROOT, rel))) {
    fs.writeFileSync(path.join(dir, `${base}.txt`), text + '\n')
    fs.writeFileSync(
      path.join(dir, `${base}.json`),
      JSON.stringify(
        {
          source_page: p.file,
          origin: 'authenticated scraper capture (public channels only; DMs are never collected)',
          scraper_data: 'authenticated Slack export supplied at capture time',
          messages: msgs.map((m) => ({
            permalink: m.permalink,
            workspace: m.workspace_domain,
            channel: m.channel,
            author: m.author,
            date: m.date,
            ts: m.ts,
          })),
          captured_at: new Date().toISOString(),
          text_sha256: hash,
          text_chars: text.length,
          extractor: 'scripts/capture-slack-sources.mjs',
        },
        null,
        2,
      ) + '\n',
    )
  }
  let raw = fs.readFileSync(path.join(PAGES, p.file), 'utf8')
  if (/^\*\*Raw:\*\* .+$/m.test(raw)) raw = raw.replace(/^\*\*Raw:\*\* .+$/m, `**Raw:** ${rel}`)
  else if (/^\*\*Publisher:\*\* .+$/m.test(raw)) raw = raw.replace(/^(\*\*Publisher:\*\* .+)$/m, `$1\n**Raw:** ${rel}`)
  else raw = raw.replace(/^(\*\*Updated:\*\* )/m, `**Raw:** ${rel}\n$1`)
  fs.writeFileSync(path.join(PAGES, p.file), raw)
}

console.log(`captured: ${ok} · quote mismatches: ${failed}`)
if (failed) process.exitCode = 1
