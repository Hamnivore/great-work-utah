import test from 'node:test'
import assert from 'node:assert/strict'
import { hardenMarkdown } from './lib/harden-md.mjs'

test('hardenMarkdown appends backtick paths and source URLs', () => {
  const src = new Map([['imsar-official-website.md', 'https://www.imsar.com/']])
  const raw = `# IMSAR

**Relates:** cites [Official Website: IMSAR](imsar-official-website.md)

## Evidence

- [Official Website: IMSAR](imsar-official-website.md)

## Open Questions

- leave me alone
`
  const out = hardenMarkdown(raw, src)
  assert.match(out, /imsar-official-website\.md\) · `\/pages\/imsar-official-website\.md` · https:\/\/www\.imsar\.com\//)
  // idempotent
  const out2 = hardenMarkdown(out, src)
  assert.equal(out2, out)
})

test('hardenMarkdown leaves non-link lines alone', () => {
  const raw = '## Evidence\n\nNo links here.\n'
  assert.equal(hardenMarkdown(raw, new Map()), raw)
})
