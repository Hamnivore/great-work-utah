// Text extraction from PDF bytes, for `scripts/capture-raw-sources.mjs`.
//
// This exists because the sources this wiki most wants are the ones the HTML extractor refuses.
// Government primary records — Inspector General audits, Form 990s, court filings, agency reports —
// are overwhelmingly PDFs, so "no PDF support" meant the doctrine's primary tier was partly
// unreachable in practice: a page could name ED-OIG/A05M0009 as the document that settles its
// central claim and still not be able to cite it.
//
// The standard here is the same as the markup extractor's: a faithful, greppable record of the
// words, in reading order, such that a `## Verbatim` quote copied from the rendered document is a
// literal substring of the capture. It is explicitly *not* layout reconstruction.
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// The legacy build is the one that runs under plain Node without a DOM. Loaded lazily so that
// capture runs which never touch a PDF do not pay for it.
let pdfjsPromise = null
function loadPdfjs() {
  if (!pdfjsPromise) pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs')
  return pdfjsPromise
}

export function looksLikePdf(bytes) {
  if (!bytes || bytes.length < 5) return false
  const head = Buffer.from(bytes.buffer ? bytes : Buffer.from(bytes)).subarray(0, 5).toString('latin1')
  return head === '%PDF-'
}

// PDF text is a bag of positioned runs, not lines: the format records where each glyph sits, and
// nothing marks where a sentence ends. Two joins therefore have to be inferred, and getting them
// wrong is what turns a capture into something no quote can match.
//
//   - A new line, when the baseline moves. pdf.js sets `hasEOL` on items that end a line; it is
//     right often enough to trust first, with a baseline-shift fallback for producers that don't
//     set it.
//   - A word space, when two runs sit on the same baseline with a visible gap between them.
//     Without this, "regular and substantive" arrives as "regularandsubstantive" in documents that
//     emit per-word runs — which reads fine to a human skimming and fails every substring check.
export function itemsToText(items) {
  const out = []
  let line = ''
  let prevEndX = null
  let prevY = null
  let prevHeight = 10

  const flush = () => {
    const trimmed = line.replace(/[ \t\u00a0]+/g, ' ').trim()
    if (trimmed) out.push(trimmed)
    line = ''
    prevEndX = null
  }

  for (const item of items) {
    if (typeof item.str !== 'string') continue
    const t = item.transform || [1, 0, 0, 1, 0, 0]
    const x = t[4]
    const y = t[5]
    const height = Math.abs(t[3]) || prevHeight || 10
    const width = item.width || 0

    if (prevY !== null) {
      // Judge the shift against the taller of the two runs. A superscript or footnote marker is
      // set in a smaller face, so measuring against *its* height would read the ordinary rise off
      // the baseline as a line break and shatter the sentence it annotates.
      const scale = Math.max(height, prevHeight)
      // A baseline shift larger than a third of a line is a new line. Smaller shifts are
      // superscripts, subscripts, and the ordinary jitter of justified text.
      const movedLine = Math.abs(y - prevY) > scale * 0.33
      if (movedLine) {
        flush()
        // A gap of more than about one and a half lines is a paragraph or column break. Recording
        // it as a blank line keeps headings and table rows from fusing into their neighbours.
        if (Math.abs(y - prevY) > scale * 1.8) out.push('')
      } else if (prevEndX !== null) {
        const gap = x - prevEndX
        const needsSpace = gap > height * 0.18
        if (needsSpace && line && !/\s$/.test(line) && !item.str.startsWith(' ')) line += ' '
      }
    }

    line += item.str
    prevEndX = x + width
    prevY = y
    prevHeight = height
    if (item.hasEOL) {
      flush()
      prevY = y
    }
  }
  flush()

  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/^\n+|\n+$/g, '')
}

// Returns { text, pages }. Throws if the bytes are not a readable PDF — the caller reports that
// as a failed capture rather than writing a file nothing can be quoted from, which is the same
// contract the markup path has.
export async function extractPdfText(bytes) {
  const pdfjs = await loadPdfjs()
  // pdf.js refuses a Node `Buffer` by name even though it subclasses Uint8Array, so always hand
  // it a plain view over the same memory.
  const data = Buffer.isBuffer(bytes)
    ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    : bytes instanceof Uint8Array
      ? bytes
      : new Uint8Array(bytes)
  const loadingTask = pdfjs.getDocument({
    data,
    // A capture must never depend on the network or on a font server; an extraction that varies by
    // environment is not a record.
    disableFontFace: true,
    useSystemFonts: false,
    isEvalSupported: false,
    verbosity: 0,
  })
  const doc = await loadingTask.promise
  const pages = doc.numPages

  const pageTexts = []
  try {
    for (let i = 1; i <= pages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      pageTexts.push(itemsToText(content.items))
      page.cleanup()
    }
  } finally {
    await loadingTask.destroy()
  }

  return { text: pageTexts.filter(Boolean).join('\n\n'), pages }
}
