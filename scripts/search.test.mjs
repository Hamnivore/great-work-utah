import assert from 'node:assert/strict'
import test from 'node:test'
import corpus from '../api/_search-corpus.mjs'
import { searchCorpus } from '../api/search.ts'
import { buildBrowseIndex, buildCorpus, renderBrowseIndex, renderCorpusModule, sectionNames } from './build-search-index.mjs'

const page = (slug, text) => ({ file: `${slug}.md`, slug, raw: text })
const fixture = [
  page('alpha', '# Alpha\n\n**Type:** venture\n**Focus:** drilling, heat\n\n## Summary\n\nAlpha drills deep holes.\n\n## What They Need Now\n\nDrilling engineers and reservoir engineers.\n'),
  page('beta', '# Beta\n\n**Type:** resource\n**Focus:** capital, drilling\n\n## Summary\n\nBeta funds drilling engineers indirectly.\n\n## How To Access It\n\nApply online. Drilling engineers welcome.\n'),
]
const fixtureCorpus = buildCorpus(fixture)

// ---- build script ----

test('browse index carries metadata only, never page bodies', () => {
  const index = buildBrowseIndex(fixture)
  assert.deepEqual(Object.keys(index[0]).sort(), ['confidence', 'domain', 'domains', 'focus', 'region', 'slug', 'summary', 'title', 'type'])
  assert.equal(index[0].summary, 'Alpha drills deep holes.')
  assert.ok(!renderBrowseIndex(index).includes('Drilling engineers and reservoir engineers'))
})

test('build output is deterministic and slug-sorted', () => {
  assert.deepEqual(buildBrowseIndex(fixture).map((entry) => entry.slug), ['alpha', 'beta'])
  assert.equal(renderCorpusModule(fixtureCorpus), renderCorpusModule(buildCorpus(fixture)))
  assert.equal(renderBrowseIndex(buildBrowseIndex(fixture)), renderBrowseIndex(buildBrowseIndex(fixture)))
})

test('section vocabulary tolerates the doubled headings in the corpus', () => {
  assert.deepEqual(sectionNames('## Evidence## Evidence\n\n## Open Questions\n\n### Not A Section\n'), ['Evidence', 'Open Questions'])
  assert.equal(fixtureCorpus.sections[0].name, 'Summary')
  assert.ok(corpus.sections.some((entry) => entry.name === 'What They Need Now'))
})

test('committed corpus module carries every page, whole', () => {
  assert.ok(corpus.pages.length > 500)
  const paths = corpus.pages.map((entry) => entry.path)
  assert.deepEqual([...paths].sort(), paths) // stable order → rebuilds produce no spurious diff
  assert.ok(corpus.pages.every((entry) => entry.path === `/pages/${entry.slug}.md` && entry.text.startsWith('# ')))
})

// ---- search engine ----

test('matches exact phrases over full page text, not just summaries', () => {
  const result = searchCorpus(fixtureCorpus, { q: 'reservoir engineers' })
  assert.equal(result.coverage.pagesMatched, 1)
  assert.equal(result.results[0].section, 'What They Need Now')
  assert.equal(result.results[0].text, 'Drilling engineers and reservoir engineers.')
  assert.equal(result.results[0].url, 'https://greatutah.work/pages/alpha.md')
  assert.equal(result.results[0].line, 12)
})

test('matching is case-insensitive and whitespace-normalized', () => {
  const upper = searchCorpus(fixtureCorpus, { q: '  DRILLING   Engineers ' })
  assert.equal(upper.query.q, 'DRILLING Engineers')
  assert.equal(upper.coverage.pagesMatched, 2)
})

test('section filter restricts matching to one heading', () => {
  const all = searchCorpus(fixtureCorpus, { q: 'drilling engineers' })
  const scoped = searchCorpus(fixtureCorpus, { q: 'drilling engineers', section: 'what-they-need-now' })
  assert.equal(all.coverage.matchingLines, 3)
  assert.deepEqual(scoped.pages.map((item) => item.title), ['Alpha'])
  assert.equal(scoped.query.section, 'What They Need Now')
})

test('type filter accepts a comma list and rejects unknown values', () => {
  assert.deepEqual(searchCorpus(fixtureCorpus, { q: 'drilling', type: 'resource' }).pages.map((item) => item.title), ['Beta'])
  assert.equal(searchCorpus(fixtureCorpus, { q: 'drilling', type: 'venture,resource' }).coverage.pagesMatched, 2)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'drilling', type: 'company' }), /unknown value\(s\): company.*Allowed: venture/s)
})

test('limit and hits_per_page cap output without hiding recall', () => {
  const result = searchCorpus(fixtureCorpus, { q: 'drilling', limit: '1', hits_per_page: '1' })
  assert.equal(result.results.length, 1)
  assert.equal(result.coverage.truncated, true)
  assert.equal(result.pages.length, 2) // every matching page still listed
  assert.equal(result.coverage.matchingLines, 5)
})

test('ordering is stable: matching-line count, then slug', () => {
  const order = () => searchCorpus(fixtureCorpus, { q: 'drilling' }).pages.map((item) => `${item.title}:${item.matchingLines}`)
  assert.deepEqual(order(), ['Beta:3', 'Alpha:2'])
  assert.deepEqual(order(), order())
})

test('zero hits explain the literal-matching contract and how to recover', () => {
  const result = searchCorpus(fixtureCorpus, { q: 'mechanical engineer test engineer drilling medical device' })
  assert.equal(result.coverage.pagesMatched, 0)
  assert.match(result.coverage.note, /literal/)
  assert.match(result.coverage.note, /split this into narrow probes such as "mechanical engineer"/)
  assert.match(result.coverage.note, /views\/index\.md/)
})

test('every error names the problem and shows a working example, in one pass', () => {
  assert.throws(() => searchCorpus(fixtureCorpus, {}), /"q" is required.*Working example: https:\/\/greatutah\.work\/api\/search\?q=/s)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'x' }), /at least 2 characters/)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'a'.repeat(201) }), /at most 200 characters.*narrow probes/s)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'drilling', query: 'oops' }), /Unknown parameter\(s\): query\. Allowed: q, section, type, limit, hits_per_page\./)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'drilling', limit: '0' }), /"limit" must be an integer from 1 to 200/)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'drilling', hits_per_page: '2.5' }), /"hits_per_page" must be an integer from 1 to 50/)
  assert.throws(() => searchCorpus(fixtureCorpus, { q: 'drilling', section: 'Needs' }), /Unknown "section": "Needs".*section=what-they-need-now works/s)
  // three problems, one response
  assert.throws(() => searchCorpus(fixtureCorpus, { section: 'Nope', limit: '9999' }), /"q" is required.*Unknown "section".*"limit" must be an integer.*Working example/s)
})

test('baseUrl follows the request host so links stay fetchable', () => {
  const result = searchCorpus(fixtureCorpus, { q: 'reservoir' }, { baseUrl: 'http://localhost:3000' })
  assert.equal(result.results[0].url, 'http://localhost:3000/pages/alpha.md')
})

// ---- the real corpus: the cases research/findings/2026-07-09-search-vs-grep.md is about ----

test('section-scoped probe finds the gem scored search missed', () => {
  const result = searchCorpus(corpus, { q: 'drilling engineers', section: 'What They Need Now' })
  assert.deepEqual(result.pages.map((item) => item.title), ['Rodatherm Energy'])
  assert.match(result.results[0].text, /Petroleum engineers, drilling engineers/)
})

test('exact phrase probes reach pages summary search cannot see', () => {
  const result = searchCorpus(corpus, { q: 'enhanced geothermal' })
  const titles = result.pages.map((item) => item.title)
  assert.ok(titles.includes('Fervo Energy') && titles.includes('Utah FORGE'))
  assert.ok(result.results.every((hit) => hit.text.toLowerCase().includes('enhanced geothermal')))
})

test('a common word reports full page recall even when lines are truncated', () => {
  const result = searchCorpus(corpus, { q: 'utah', limit: '5' })
  assert.equal(result.results.length, 5)
  assert.ok(result.coverage.pagesMatched > 500)
  assert.equal(result.coverage.truncated, true)
})
