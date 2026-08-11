// Tests for the claims-vs-capture check.
//
// This check exists because three adversarial audits found the same defect class on 24 pages:
// dates and figures in `## Useful Claims` that appear nowhere in the captured document. The
// tests that matter are the ones where it must FIRE (a year the document never gives) and the
// ones where it must STAY QUIET (the document gives the same figure in a different notation).
// Get the second wrong and the check gets switched off; get the first wrong and it is decoration.
import test from 'node:test'
import assert from 'node:assert/strict'
import { unsupportedClaimAnchors, claimBullets } from './lib/claims.mjs'

const CAPTURE = [
  'US Magnesium declared bankruptcy in September, court records show.',
  'On Sept. 15, days after it filed, the company proposed an auction of substantially all assets.',
  'The Rowley plant has hauled 379 million tons of material since operations began.',
  'Kennecott has been mining the rich ore body of the Bingham Canyon Mine since 1903.',
  'Our platform serves 100M+ individual users worldwide.',
].join('\n')

function claims(...bullets) {
  return bullets.map((b) => `- ${b}`).join('\n')
}

test('a year the document never states is reported', () => {
  const found = unsupportedClaimAnchors(claims('The company began production in 1972.'), CAPTURE)
  assert.deepEqual(found.map((f) => f.text), ['1972'])
  assert.equal(found[0].kind, 'year')
})

test('a year the document does state is not reported', () => {
  assert.deepEqual(unsupportedClaimAnchors(claims('Mining at Bingham Canyon dates to 1903.'), CAPTURE), [])
})

test('a precise date is reported when the document gives only the month', () => {
  // The real case: the capture says "declared bankruptcy in September" and the page asserted
  // "filed Chapter 11 on September 10, 2025". The day is the fabricated part.
  const found = unsupportedClaimAnchors(claims('It filed Chapter 11 on September 10, 2025.'), CAPTURE)
  assert.equal(found.length, 1)
  assert.equal(found[0].kind, 'date')
  assert.equal(found[0].text, 'september 10, 2025')
})

test('one assertion produces one finding, not a date plus its own year', () => {
  // "September 10, 2025" is a single claim. Reporting the date and then "2025" separately
  // double-counts it, and a check that inflates its own findings gets switched off.
  const found = unsupportedClaimAnchors(claims('It filed on September 10, 2025 in Delaware.'), CAPTURE)
  assert.deepEqual(found.map((f) => f.kind), ['date'])
})

test('an abbreviated month in the document satisfies a spelled-out claim', () => {
  // The capture says "On Sept. 15"; a page writing "September 15" is citing it correctly, and
  // being told otherwise would teach writers to distrust the check.
  assert.deepEqual(unsupportedClaimAnchors(claims('The auction was proposed on September 15, 2025.'), CAPTURE), [])
})

test('a spelled-out magnitude in the document satisfies an abbreviated claim', () => {
  // "379 million tons" in the document, "379M tons" on the page: same figure.
  assert.deepEqual(unsupportedClaimAnchors(claims('The site has hauled 379M tons.'), CAPTURE), [])
})

test('a magnitude the document does not contain is reported', () => {
  // The Lucid case: the page carried a stale "70M+ users" while the capture said "100M+".
  // Reported as written, "+" included, so the message names what is actually on the page.
  const found = unsupportedClaimAnchors(claims('The product has 70M+ users.'), CAPTURE)
  assert.deepEqual(found.map((f) => f.text), ['70m+'])
})

test('comma grouping is not a difference', () => {
  const capture = 'Cape Station will provide roughly 6,600 jobs during construction.'
  assert.deepEqual(unsupportedClaimAnchors(claims('It will provide roughly 6600 jobs.'), capture), [])
  assert.deepEqual(unsupportedClaimAnchors(claims('It will provide roughly 6,600 jobs.'), capture), [])
})

test('a bullet that hands the claim to another page is that page\u2019s responsibility', () => {
  const bullet = 'Incorporated in 1889 per the [Utah corporate registry](utah-corporate-registry.md).'
  assert.deepEqual(unsupportedClaimAnchors(claims(bullet), CAPTURE), [])
})

test('a bullet about the capture\u2019s silence is a disclosure, not a violation', () => {
  // Pages that honestly record what the document lacks must not be punished for naming the
  // figure they are disclaiming — that is the behaviour we want more of.
  for (const bullet of [
    'The 2012 acquisition of Denison Mines does not appear in this capture.',
    'A founding date of 2008 is not stated in this capture.',
    'The page previously asserted 18 global manufacturing sites; that figure could not be reconfirmed.',
    'The 1972 production start was superseded by a later filing.',
  ]) {
    assert.deepEqual(unsupportedClaimAnchors(claims(bullet), CAPTURE), [], bullet)
  }
})

test('a disclaimer that is false is itself reported', () => {
  // The Spire case: the page said "those figures are absent from this capture" while the capture
  // carried them as `100M+` in a statistics band. Hedged language must not be a way to say
  // something untrue about our own evidence.
  const found = unsupportedClaimAnchors(
    claims('The page previously cited 100M users; that figure does not appear in this capture.'),
    CAPTURE
  )
  assert.deepEqual(found.map((f) => f.kind), ['disclaimed-but-present'])
})

test('a truthful disclaimer about a magnitude stays quiet', () => {
  assert.deepEqual(
    unsupportedClaimAnchors(claims('A figure of 70M users does not appear in this capture.'), CAPTURE),
    []
  )
})

test('a bare year in a disclaiming bullet is not second-guessed', () => {
  // Years recur for unrelated reasons — copyright lines, nav, other events — so checking the
  // disclaimer direction on them would flag honest notes. 1903 is in the capture; a bullet
  // disclaiming it is left alone rather than accused of lying.
  assert.deepEqual(
    unsupportedClaimAnchors(claims('A 1903 founding date is not stated in this capture.'), CAPTURE),
    []
  )
})

test('a bare negation does not buy an exemption', () => {
  // The exemption requires language about the document. Otherwise any sentence containing
  // "not" or "no" would smuggle an unsourced year through, which is most sentences.
  const found = unsupportedClaimAnchors(
    claims('The company did not begin production until 1972 and has no other facilities.'),
    CAPTURE
  )
  assert.deepEqual(found.map((f) => f.text), ['1972'])
})

test('an empty capture reports nothing rather than every anchor', () => {
  // A missing capture is a different, separately reported defect.
  assert.deepEqual(unsupportedClaimAnchors(claims('Production began in 1972.'), ''), [])
})

test('the same anchor repeated across bullets is reported once', () => {
  const found = unsupportedClaimAnchors(claims('Founded in 1972.', 'Its 1972 charter is public.'), CAPTURE)
  assert.equal(found.length, 1)
})

test('prose is split into sentences so a summary gets the same scrutiny as a bullet list', () => {
  // A stale figure in ## Summary is read by more people than one in a bullet, because the summary
  // is what views and search results surface. Lucid's summary kept "70M+ users" for months after
  // the claims had been corrected to the captured 100M+.
  const prose = 'Lucid is headquartered in Utah. The company reports 70M+ users worldwide.'
  assert.equal(claimBullets(prose).length, 2)
  assert.deepEqual(unsupportedClaimAnchors(prose, CAPTURE).map((f) => f.text), ['70m+'])
})

test('a sentence-scoped disclaimer does not exempt the rest of the paragraph', () => {
  const prose = 'The page does not give a founding date. It reports 70M+ users worldwide.'
  assert.deepEqual(unsupportedClaimAnchors(prose, CAPTURE).map((f) => f.text), ['70m+'])
})

test('wrapped bullets are read whole, so an exemption at the end still applies', () => {
  const wrapped = '- The company was founded in 1972, a date that\n  does not appear in this capture.'
  assert.equal(claimBullets(wrapped).length, 1)
  assert.deepEqual(unsupportedClaimAnchors(wrapped, CAPTURE), [])
})
