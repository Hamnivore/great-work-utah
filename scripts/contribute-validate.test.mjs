// Guards for POST /api/contribute. The load-bearing test is the last one: every
// real page in the corpus must pass the spam heuristics untouched. A false
// positive here costs a real contribution.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {
  MAX_BODY_BYTES,
  clientIp,
  contentIssues,
  createDedupeCache,
  createRateLimiter,
  fingerprint,
  oversizeError,
  rateLimitError,
} from '../api/_contribute-guard.mjs'

const PAGES_DIR = new URL('../wiki/pages/', import.meta.url)

test('size cap rejects oversized bodies and names the limit', () => {
  assert.equal(oversizeError(String(MAX_BODY_BYTES)), null)
  assert.equal(oversizeError('1234'), null)
  assert.equal(oversizeError(undefined), null, 'missing Content-Length is not an error')
  assert.equal(oversizeError('not-a-number'), null)

  const over = oversizeError(String(MAX_BODY_BYTES + 1))
  assert.ok(over)
  assert.equal(over.bytes, MAX_BODY_BYTES + 1)
  assert.match(over.error, new RegExp(String(MAX_BODY_BYTES)))
  assert.match(over.error, /too large/i)
  assert.match(over.error, /note/i, 'tells the agent what to do instead')
})

test('client key takes the first x-forwarded-for entry', () => {
  assert.equal(clientIp({ 'x-forwarded-for': '203.0.113.7, 70.41.3.18, 150.172.238.178' }), '203.0.113.7')
  assert.equal(clientIp({ 'x-forwarded-for': ' 203.0.113.7 ' }), '203.0.113.7')
  assert.equal(clientIp({ 'x-forwarded-for': ['203.0.113.7', '198.51.100.1'] }), '203.0.113.7')
  assert.equal(clientIp({}), 'unknown')
  assert.equal(clientIp(), 'unknown')
})

test('token bucket allows a burst, then throttles with an accurate retry time', () => {
  const limiter = createRateLimiter({ capacity: 3, refillMs: 10_000 })
  const t0 = 1_000_000

  for (let i = 0; i < 3; i++) assert.equal(limiter.take('ip-a', t0).ok, true, `burst request ${i}`)

  const blocked = limiter.take('ip-a', t0)
  assert.equal(blocked.ok, false)
  assert.equal(blocked.retryAfterSeconds, 10)

  // Partially refilled: 4s in, 6s of wait left.
  assert.equal(limiter.take('ip-a', t0 + 4000).retryAfterSeconds, 6)
  // Fully refilled one token.
  assert.equal(limiter.take('ip-a', t0 + 10_000).ok, true)

  // Buckets are per key.
  assert.equal(limiter.take('ip-b', t0).ok, true)
})

test('token bucket never regenerates past capacity', () => {
  const limiter = createRateLimiter({ capacity: 2, refillMs: 1000 })
  limiter.take('ip', 0)
  limiter.take('ip', 0)
  // A week idle should still only buy `capacity` back-to-back requests.
  assert.equal(limiter.take('ip', 7 * 24 * 3600 * 1000).ok, true)
  assert.equal(limiter.take('ip', 7 * 24 * 3600 * 1000).ok, true)
  assert.equal(limiter.take('ip', 7 * 24 * 3600 * 1000).ok, false)
})

test('rate limiter memory is bounded under a spray of distinct IPs', () => {
  const limiter = createRateLimiter({ capacity: 5, refillMs: 1000, maxKeys: 50 })
  for (let i = 0; i < 5000; i++) limiter.take(`10.0.0.${i}`, i)
  assert.ok(limiter.size() <= 50, `bounded, got ${limiter.size()}`)
})

test('429 message tells an agent exactly when and how to retry', () => {
  const message = rateLimitError(42)
  assert.match(message, /42 seconds/)
  assert.match(message, /nothing was submitted/i)
  assert.match(rateLimitError(9, { write: true }), /resubmission is safe/i)
})

test('fingerprint is stable, ignores reason, and separates kind/path/content', () => {
  const a = fingerprint('page', 'pages/example.md', 'hello world')
  assert.equal(a, fingerprint('page', 'pages/example.md', 'hello world'))
  assert.notEqual(a, fingerprint('note', 'pages/example.md', 'hello world'))
  assert.notEqual(a, fingerprint('page', 'pages/other.md', 'hello world'))
  assert.notEqual(a, fingerprint('page', 'pages/example.md', 'hello world!'))
})

test('duplicate suppression short-circuits identical resubmissions', () => {
  const cache = createDedupeCache({ ttlMs: 1000, maxEntries: 10 })
  const fp = fingerprint('note', 'pages/example.md', 'a stale fact')

  assert.equal(cache.lookup(fp, 0), null)
  cache.begin(fp, 0)
  assert.deepEqual(cache.lookup(fp, 1), { status: 'pending', url: undefined })
  cache.complete(fp, 'https://github.com/x/y/issues/1', 2)
  assert.deepEqual(cache.lookup(fp, 3), { status: 'done', url: 'https://github.com/x/y/issues/1' })

  // Different content is not a duplicate.
  assert.equal(cache.lookup(fingerprint('note', 'pages/example.md', 'other'), 3), null)
  // Entries expire, so a legitimate re-report later still lands.
  assert.equal(cache.lookup(fp, 5000), null)
})

test('a failed submission is forgotten so retrying still works', () => {
  const cache = createDedupeCache()
  const fp = fingerprint('page', 'pages/example.md', 'x'.repeat(300))
  cache.begin(fp)
  cache.forget(fp)
  assert.equal(cache.lookup(fp), null)
})

test('dedupe cache memory is bounded', () => {
  const cache = createDedupeCache({ ttlMs: 60_000, maxEntries: 25 })
  for (let i = 0; i < 2000; i++) cache.complete(fingerprint('note', `pages/p${i}.md`, 'x'), 'u', i)
  assert.ok(cache.size() <= 25, `bounded, got ${cache.size()}`)
})

test('spam heuristics catch link farms, padding, and repeated lines', () => {
  const linkFarm = Array.from({ length: 40 }, (_, i) => `https://spam${i}.example.com`).join(' ')
  const [linkIssue] = contentIssues(linkFarm)
  assert.match(linkIssue, /link dump/i)
  assert.match(linkIssue, /Evidence/, 'says how to fix it')

  const [padIssue] = contentIssues(`A real sentence about a Utah venture. ${'a'.repeat(500)}`)
  assert.match(padIssue, /in a row/)
  assert.match(padIssue, /Remove the padding/)

  const [repeatIssue] = contentIssues(Array.from({ length: 60 }, () => 'buy cheap watches now').join('\n'))
  assert.match(repeatIssue, /repeats the same line/)

  // Every problem is reported at once — the one-round-trip error contract.
  const both = contentIssues(`${'z'.repeat(400)}\n${Array.from({ length: 40 }, () => 'buy cheap watches now').join('\n')}`)
  assert.equal(both.length, 2)
})

test('spam heuristics stay quiet on ordinary contributions', () => {
  assert.deepEqual(contentIssues('Fervo Energy moved its HQ; the page still says Houston.'), [])
  assert.deepEqual(contentIssues(''), [])
  assert.deepEqual(contentIssues(undefined), [])
  // A markdown rule and a table separator are not padding.
  assert.deepEqual(contentIssues('# Title\n\n---\n\n| a | b |\n|---|---|\n| 1 | 2 |\n'), [])
  // A short note that is mostly one citation is fine.
  assert.deepEqual(contentIssues('Source: https://startup.utah.gov/resources/ — this program ended.'), [])
})

test('no real wiki page trips the spam heuristics or the size cap', () => {
  const files = fs.readdirSync(PAGES_DIR).filter((name) => name.endsWith('.md'))
  assert.ok(files.length > 100, 'corpus present')
  const tripped = []
  for (const name of files) {
    const content = fs.readFileSync(new URL(name, PAGES_DIR), 'utf8')
    const issues = contentIssues(content)
    if (issues.length) tripped.push(`${name}: ${issues.join(' ')}`)
    // Resubmitting any existing page verbatim must fit inside the body cap.
    const body = JSON.stringify({ kind: 'page', type: 'venture', path: `pages/${path.basename(name)}`, content })
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) tripped.push(`${name}: body ${Buffer.byteLength(body)} bytes`)
  }
  assert.deepEqual(tripped, [])
})
