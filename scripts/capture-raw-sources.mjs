#!/usr/bin/env node
// Captures source documents into raw/ and records the path on the page as **Raw:**.
//
// A capture contains none of our content: extracted document text, and a sidecar of
// fetch facts. The filename carries the content hash, so captures are immutable by
// construction — an edited capture is a different file, and revising one in place is not
// something the layout permits. See wiki/meta/attributes.md, "Raw captures".
//
//   node scripts/capture-raw-sources.mjs --stem myriad-genetics-official-website
//   node scripts/capture-raw-sources.mjs --all --limit 20
//   node scripts/capture-raw-sources.mjs --all --write
//
// Without --write it fetches and reports without touching anything.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { isMandatedHost } from './lib/hosts.mjs'
import { extractPdfText, looksLikePdf } from './lib/pdf-text.mjs'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const RAW = path.join(ROOT, 'raw')
// SEC's automated-access policy asks for a declared bot with a reachable contact, and it
// answers 403 to a User-Agent that carries none. Other mandated hosts are less strict but
// none object. The address is not hardcoded because it is an outbound identity claim about
// whoever runs the capture: set CAPTURE_CONTACT to a real inbox.
const UA = [
  'greatutah.work raw-source capture (+https://greatutah.work)',
  process.env.CAPTURE_CONTACT,
]
  .filter(Boolean)
  .join(' ')

const args = process.argv.slice(2)
const write = args.includes('--write')
const all = args.includes('--all')
const stem = argValue('--stem')
const limit = Number(argValue('--limit') || 0)

function argValue(flag) {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : null
}

// Tiers whose publisher is under no obligation to keep the document. Primary-tier pages
// pointing at a mandated host are deliberately skipped: EDGAR keeps the 10-K, and a copy
// here would be a second, staler copy of something already permanent.
const CAPTURE_TIERS = new Set(['official-page', 'press-release', 'news', 'reference', 'preprint', 'testimony'])

function meta(raw, key) {
  return (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || null
}

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '\u2013',
  mdash: '\u2014',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  hellip: '\u2026',
  eacute: '\u00e9',
  amp_: '&',
}

// Numeric references in 0x80-0x9F are the single most common defect in legacy markup, and
// SEC filings are full of them: `&#147;` is meant as a curly quote but names a C1 control
// character, which has no glyph. Decoding it literally puts an invisible control code in the
// capture, and then a quote copied from the rendered page can never be a substring of it —
// the verbatim check fails on a correct quote. The HTML standard's replacement table is the
// fix, and it is the same one every browser applies.
const C1_REPLACEMENTS = {
  0x80: '\u20ac', 0x82: '\u201a', 0x83: '\u0192', 0x84: '\u201e', 0x85: '\u2026',
  0x86: '\u2020', 0x87: '\u2021', 0x88: '\u02c6', 0x89: '\u2030', 0x8a: '\u0160',
  0x8b: '\u2039', 0x8c: '\u0152', 0x8e: '\u017d', 0x91: '\u2018', 0x92: '\u2019',
  0x93: '\u201c', 0x94: '\u201d', 0x95: '\u2022', 0x96: '\u2013', 0x97: '\u2014',
  0x98: '\u02dc', 0x99: '\u2122', 0x9a: '\u0161', 0x9b: '\u203a', 0x9c: '\u0153',
  0x9e: '\u017e', 0x9f: '\u0178',
}

function codePointToText(code) {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return ''
  if (C1_REPLACEMENTS[code]) return C1_REPLACEMENTS[code]
  return String.fromCodePoint(code)
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => codePointToText(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => codePointToText(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
}

// Text extraction, not rendering. Block-level tags become newlines so that headings and
// list items stay separated; everything else collapses. The point is a faithful, greppable
// record of the words, which is what a claim rests on.
function extractText(html) {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(br|hr)\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|section|article|h[1-6]|li|tr|td|th|ul|ol|table|header|footer|nav|main|figcaption|blockquote)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t\u00a0]+/g, ' ')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n')
}

async function fetchDoc(url) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,application/pdf,*/*' },
    signal: AbortSignal.timeout(45000),
  })
  // Read bytes, not text: `res.text()` decodes as UTF-8 and silently mangles a PDF into
  // replacement characters, which is how a binary body used to arrive looking like a short,
  // markup-free string. Markup still gets the same UTF-8 decode it always did, so extraction
  // is unchanged.
  const buf = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') || ''
  return {
    ok: res.ok,
    status: res.status,
    finalUrl: res.url,
    contentType,
    bytes: buf,
    body: buf.toString('utf8'),
    // Hashed here, before anything reads the buffer: the PDF extractor hands its typed array
    // to pdf.js, which takes ownership and detaches it, so a hash computed after extraction is
    // the hash of an empty buffer — and the empty-string digest looks like a real hash.
    bytesSha256: sha256(buf),
  }
}

// Two extractors, one contract: produce a faithful, greppable record of the words, or refuse.
// A capture nothing can be honestly quoted from is worse than no capture, because the quote
// checker would then be validating against garbage.
const READABLE_TYPE_RE = /(text\/html|application\/xhtml|text\/plain|\/xml|\+xml|application\/json)/i
const PDF_TYPE_RE = /application\/pdf/i

function isPdf(contentType, res) {
  return PDF_TYPE_RE.test(contentType || '') || looksLikePdf(res.bytes)
}

function unreadableReason(contentType, body) {
  if (contentType && !READABLE_TYPE_RE.test(contentType)) {
    return `content-type ${contentType.split(';')[0]} needs a dedicated extractor (not markup)`
  }
  // Markup-shaped check: real pages have tags. A body with none, at length, is binary.
  if (body.length > 4000 && !/<\/?[a-z][\s\S]{0,80}>/i.test(body.slice(0, 4000))) {
    return 'body has no markup and is probably binary'
  }
  return null
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex')
}

const pages = fs
  .readdirSync(PAGES)
  .filter((f) => f.endsWith('.md'))
  .map((f) => ({ file: f, slug: f.replace(/\.md$/, ''), raw: fs.readFileSync(path.join(PAGES, f), 'utf8') }))
  .filter((p) => /^\*\*Type:\*\* source$/m.test(p.raw))

let targets = pages.filter((p) => {
  if (stem) return p.slug === stem
  const type = meta(p.raw, 'Source Type')
  const url = meta(p.raw, 'URL')
  if (!type) return false
  // Capture when nobody must keep it: fragile tier, or primary tier behind a mirror.
  const fragileTier = CAPTURE_TIERS.has(type)
  const fragileUrl = url ? !isMandatedHost(url.split(/[;,]\s*/)[0]) : false
  return fragileTier || fragileUrl
})
if (!stem && !all) targets = targets.filter((p) => /^## Verbatim/m.test(p.raw))
if (limit > 0) targets = targets.slice(0, limit)

const results = []
for (const p of targets) {
  const live = meta(p.raw, 'URL')?.split(/[;,]\s*/)[0] || null
  const archive = meta(p.raw, 'Archive')
  // Live first, archive as the fallback: the current document is what a reader would see,
  // and the snapshot is what survives. A page whose live URL is gone captures the snapshot,
  // which is the only honest record available.
  const attempts = [live, archive].filter(Boolean)
  let captured = null
  let errors = []
  for (const url of attempts) {
    try {
      const res = await fetchDoc(url)
      if (!res.ok) {
        errors.push(`${url} -> HTTP ${res.status}`)
        continue
      }
      let text
      let pdfPages = null
      if (isPdf(res.contentType, res)) {
        try {
          const extracted = await extractPdfText(res.bytes)
          text = extracted.text
          pdfPages = extracted.pages
        } catch (e) {
          // A PDF that will not parse, or a scan with no text layer, has to fail loudly. The
          // alternative — an empty or garbled capture — would quietly break every quote made
          // against it.
          errors.push(`${url} -> PDF text extraction failed: ${String(e.message || e).slice(0, 80)}`)
          continue
        }
      } else {
        const unreadable = unreadableReason(res.contentType, res.body)
        if (unreadable) {
          errors.push(`${url} -> ${unreadable}`)
          continue
        }
        text = extractText(res.body)
      }
      if (text.length < 200) {
        // For a PDF this usually means a scanned image with no text layer. Say so, because the
        // remedy is OCR or a different copy of the document, not a retry.
        const why = pdfPages
          ? `PDF has ${pdfPages} page(s) but only ${text.length} chars of extractable text (likely a scan without a text layer)`
          : `only ${text.length} chars of text`
        errors.push(`${url} -> ${why}`)
        continue
      }
      captured = { url, res, text, pdfPages, viaArchive: url === archive && url !== live }
      break
    } catch (e) {
      errors.push(`${url} -> ${String(e.message || e).slice(0, 100)}`)
    }
  }

  if (!captured) {
    results.push({ file: p.file, ok: false, why: errors.join('; ') || 'no URL to fetch' })
    continue
  }

  const textHash = sha256(captured.text)
  const date = new Date().toISOString().slice(0, 10)
  const base = `${date}-${textHash.slice(0, 12)}`
  const rel = `raw/${p.slug}/${base}.txt`
  const absDir = path.join(RAW, p.slug)
  const exists = fs.existsSync(path.join(ROOT, rel))

  if (write) {
    fs.mkdirSync(absDir, { recursive: true })
    // Never overwrite: an identical hash means an identical document, so re-running is a
    // no-op, and a different document lands under a different name beside the old one.
    if (!exists) {
      fs.writeFileSync(path.join(absDir, `${base}.txt`), captured.text + '\n')
      fs.writeFileSync(
        path.join(absDir, `${base}.json`),
        JSON.stringify(
          {
            source_page: p.file,
            requested_url: captured.url,
            final_url: captured.res.finalUrl,
            via_archive: captured.viaArchive,
            fetched_at: new Date().toISOString(),
            http_status: captured.res.status,
            content_type: captured.res.contentType,
            // The bytes as served, so the extraction can be audited against a Wayback copy of
            // the same document. Hashing the UTF-8 *decode* instead is identical for a
            // well-formed UTF-8 body and wrong for everything else — a PDF or a windows-1252
            // page decodes lossily, and the recorded hash then matches no file anybody can
            // fetch, which is the one thing this field exists to make possible.
            bytes_sha256: captured.res.bytesSha256,
            text_sha256: textHash,
            text_chars: captured.text.length,
            extractor: 'scripts/capture-raw-sources.mjs',
            ...(captured.pdfPages
              ? { document_format: 'pdf', pdf_pages: captured.pdfPages, text_extractor: 'scripts/lib/pdf-text.mjs' }
              : {}),
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

  results.push({
    file: p.file,
    ok: true,
    rel,
    chars: captured.text.length,
    viaArchive: captured.viaArchive,
    unchanged: exists,
  })
}

const good = results.filter((r) => r.ok)
const bad = results.filter((r) => !r.ok)
console.log(`targets: ${targets.length} · captured: ${good.length} · failed: ${bad.length}${write ? '' : ' (dry run)'}`)
for (const r of good) {
  console.log(`  ${r.file} -> ${r.rel} (${r.chars} chars${r.viaArchive ? ', via archive' : ''}${r.unchanged ? ', unchanged' : ''})`)
}
for (const r of bad) console.log(`  FAILED ${r.file} — ${r.why}`)
if (!write) console.log('dry run — re-run with --write to save captures and set **Raw:**')
