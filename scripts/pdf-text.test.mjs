// Tests for PDF text extraction.
//
// PDF stores positioned glyph runs, not lines or words, so the extractor has to *infer* both.
// Everything worth testing is in that inference: get it wrong and the capture still looks like a
// document to a human skimming it, while `verbatim-not-in-raw` rejects quotes that are genuinely
// in the source. These cases pin the two joins that matter.
import test from 'node:test'
import assert from 'node:assert/strict'
import { itemsToText, looksLikePdf } from './lib/pdf-text.mjs'

// pdf.js items carry `transform` as [scaleX, skewX, skewY, scaleY, x, y].
const item = (str, x, y, width, { height = 10, hasEOL = false } = {}) => ({
  str,
  width,
  hasEOL,
  transform: [height, 0, 0, height, x, y],
})

test('runs on one baseline join into a single line', () => {
  const text = itemsToText([item('Western Governors', 72, 700, 100), item('University', 176, 700, 60)])
  assert.equal(text, 'Western Governors University')
})

test('a gap between runs on the same baseline becomes a word space', () => {
  // The failure this guards against: documents that emit one run per word arriving as
  // "regularandsubstantive", which no copied quote can ever match.
  const text = itemsToText([
    item('regular', 72, 700, 40),
    item('and', 118, 700, 20),
    item('substantive', 142, 700, 60),
  ])
  assert.equal(text, 'regular and substantive')
})

test('runs that abut without a gap are not split by a space', () => {
  // Kerning and style changes split a word into runs mid-word; inserting a space there would
  // corrupt the word just as badly as omitting one between words.
  const text = itemsToText([item('inter', 72, 700, 25), item('action', 97, 700, 30)])
  assert.equal(text, 'interaction')
})

test('a baseline shift starts a new line', () => {
  const text = itemsToText([item('FINAL AUDIT REPORT', 72, 700, 120), item('ED-OIG/A05M0009', 72, 686, 100)])
  assert.equal(text, 'FINAL AUDIT REPORT\nED-OIG/A05M0009')
})

test('small baseline jitter does not split a line', () => {
  // Superscripts and footnote markers sit slightly off the baseline. Treating them as line
  // breaks would shatter sentences that quotes are taken from.
  const text = itemsToText([item('Title IV', 72, 700, 40), item('3', 114, 703, 5, { height: 6 })])
  assert.equal(text, 'Title IV 3')
})

test('hasEOL ends a line even when the baseline is unchanged', () => {
  const text = itemsToText([item('first line', 72, 700, 60, { hasEOL: true }), item('second line', 72, 700, 70)])
  assert.equal(text, 'first line\nsecond line')
})

test('a large vertical gap becomes a blank line', () => {
  const text = itemsToText([item('Heading', 72, 700, 50), item('Body text', 72, 660, 60)])
  assert.equal(text, 'Heading\n\nBody text')
})

test('empty and whitespace-only runs do not produce empty lines', () => {
  const text = itemsToText([item('  ', 72, 700, 4), item('Real content', 72, 686, 80), item('', 72, 672, 0)])
  assert.equal(text, 'Real content')
})

test('extracted text is greppable for a quotable sentence spanning runs and lines', () => {
  // The end-to-end property the whole module exists for: a sentence a reader would copy out of
  // the rendered PDF must be a literal substring of the capture on a single line.
  const text = itemsToText([
    item('None of these 69 courses could reasonably be', 72, 700, 250, { hasEOL: true }),
    item('considered', 72, 686, 55),
    item('as', 130, 686, 12),
    item('providing', 145, 686, 48),
    item('regular', 196, 686, 38),
    item('and', 237, 686, 20),
    item('substantive', 260, 686, 58),
    item('interaction', 321, 686, 55),
  ])
  assert.match(text, /^None of these 69 courses could reasonably be$/m)
  assert.match(text, /^considered as providing regular and substantive interaction$/m)
})

test('looksLikePdf recognizes the magic bytes and rejects markup', () => {
  assert.equal(looksLikePdf(Buffer.from('%PDF-1.7\n...')), true)
  assert.equal(looksLikePdf(Buffer.from('<!doctype html><html>')), false)
  assert.equal(looksLikePdf(Buffer.from('')), false)
  assert.equal(looksLikePdf(null), false)
})
