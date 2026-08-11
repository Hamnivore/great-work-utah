// Tests for the verbatim-quote check that backs every quoted claim in the corpus.
//
// The cases that matter most are the ones where it must FAIL. A quote checker that always
// passes is worse than none, because it makes fabrication look audited.
import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeForQuoteCheck, verbatimQuotes, verbatimNotInRaw } from './lib/verbatim.mjs'

const CAPTURE = [
  'Fervo Energy - Next-Generation Geothermal Projects',
  'Delivering 24/7 carbon-free geothermal energy .',
  'Fervo Energy (\u201cFervo\u201d), the leader in next-generation geothermal technology, today held a groundbreaking ceremony to mark the start of its exploration drilling campaign at Cape Station.',
  'Located in Beaver County, Utah, Cape Station will provide roughly 6,600 jobs during construction and 160 full-time jobs throughout its operations, generating more than $437 million in earned wages.',
  '\u201cBeaver County, Utah is the perfect place to deploy our next-generation geothermal technology,\u201d said Tim Latimer, Fervo Energy CEO and Co-Founder .',
].join('\n')

function verbatim(...blocks) {
  return blocks.join('\n\n')
}

test('a quote that matches the document passes', () => {
  const section = verbatim(
    '> "Located in Beaver County, Utah, Cape Station will provide roughly 6,600 jobs during construction and\n> 160 full-time jobs throughout its operations, generating more than $437 million in earned wages."\n> — Body',
  )
  assert.deepEqual(verbatimNotInRaw(section, CAPTURE), [])
})

test('a changed number fails, which is the whole point', () => {
  const section = verbatim(
    '> "Located in Beaver County, Utah, Cape Station will provide roughly 9,900 jobs during construction and\n> 160 full-time jobs throughout its operations."\n> — Body',
  )
  assert.equal(verbatimNotInRaw(section, CAPTURE).length, 1)
})

test('a plausible paraphrase fails even when it reads like a quote', () => {
  const section = verbatim(
    '> "Cape Station is expected to provide approximately 6,600 construction jobs and 160 permanent positions."\n> — Body',
  )
  assert.equal(verbatimNotInRaw(section, CAPTURE).length, 1)
})

test('typographic differences do not fail: curly quotes, wrapping, space before punctuation', () => {
  // The document has curly double quotes around "Fervo"; an excerpt nested inside a
  // double-quoted blockquote has to use single quotes. The document also renders its
  // closing period in a separate element, which extraction turns into "Co-Founder .".
  const section = verbatim(
    '> "Fervo Energy (\'Fervo\'), the leader in next-generation geothermal technology, today held a\n> groundbreaking ceremony to mark the start of its exploration drilling campaign at Cape Station."\n> — Opening paragraph',
    '> "\'Beaver County, Utah is the perfect place to deploy our next-generation geothermal technology,\'\n> said Tim Latimer, Fervo Energy CEO and Co-Founder."\n> — Quoted statement',
    '> "Delivering 24/7 carbon-free geothermal energy."\n> — Hero',
  )
  assert.deepEqual(verbatimNotInRaw(section, CAPTURE), [])
})

test('markdown-escaped quotes are escaping, not content', () => {
  // A document that itself contains a quotation leaves the excerpt with quotes to nest, and
  // `\"` is a legitimate way to write them. The backslash is an instruction to the renderer;
  // treating it as a character the document lacked failed real, correct excerpts.
  const capture = 'In 2009, Intermountain Health was identified as a healthcare model by President Barack Obama , "We have long known that some places, like the Intermountain Healthcare in Utah..., offer high-quality care at a cost below average."'
  const section =
    '> "In 2009, Intermountain Health was identified as a healthcare model by President Barack Obama , \\"We have long known that some places, like the Intermountain Healthcare in Utah..., offer high-quality care at a cost below average.\\""\n> — Article, history'
  assert.deepEqual(verbatimNotInRaw(section, capture), [])

  // Escaping still does not launder a changed word.
  const altered = section.replace('high-quality care at a cost below average', 'high-quality care at a cost far below average')
  assert.equal(verbatimNotInRaw(altered, capture).length, 1)
})

test('an ellipsis may elide, but every surviving fragment must still be in the document', () => {
  const honest = verbatim(
    '> "Located in Beaver County, Utah, Cape Station will provide roughly 6,600 jobs during construction … generating more than $437 million in earned wages."\n> — Body',
  )
  assert.deepEqual(verbatimNotInRaw(honest, CAPTURE), [])

  // Eliding is not a licence to rewrite the parts that remain.
  const dishonest = verbatim(
    '> "Located in Beaver County, Utah, Cape Station will provide roughly 6,600 jobs during construction … generating more than $999 million in shareholder value."\n> — Body',
  )
  assert.equal(verbatimNotInRaw(dishonest, CAPTURE).length, 1)
})

test('locator lines are ours, not the document\u2019s, and are never checked', () => {
  const quotes = verbatimQuotes(
    '> "Delivering 24/7 carbon-free geothermal energy."\n> — Home page, "Hero" (fetched 2026-08-11)',
  )
  assert.equal(quotes.length, 1)
  assert.ok(!quotes[0].includes('fetched'))
})

test('fenced machine output is not treated as a quote to substring-match', () => {
  const section = '```\n["business,btac)/","20250325062537","https://www.btac.business/","text/html","200"]\n```'
  assert.deepEqual(verbatimQuotes(section), [])
  assert.deepEqual(verbatimNotInRaw(section, CAPTURE), [])
})

test('an empty capture reports nothing rather than failing every quote', () => {
  // A missing or unreadable capture is a different defect (missing-raw-file); this
  // function must not double-report it as a corpus full of bad quotes.
  const section = '> "Delivering 24/7 carbon-free geothermal energy."\n> — Hero'
  assert.deepEqual(verbatimNotInRaw(section, ''), [])
})

test('normalization folds punctuation and case without merging distinct words', () => {
  assert.equal(normalizeForQuoteCheck('  Foo \u2014 \u201cBar\u201d ,  baz .'), "foo - 'bar', baz.")
  assert.notEqual(normalizeForQuoteCheck('160 full-time'), normalizeForQuoteCheck('150 full-time'))
})
