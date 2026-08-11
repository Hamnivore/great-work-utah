// Smoke checks for the SEO cleanup in scripts/prerender.mjs
// (research/design/seo-plan.md P0.1, P1.1–P1.4).

import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PRERENDER = path.join(ROOT, 'scripts', 'prerender.mjs')

test('prerender SEO: schema types, breadcrumbs, source noindex, og:image', async () => {
  const { renderDocument, searchPage } = await import(PRERENDER)

  const venture = renderDocument('pages', 'fervo-energy')
  assert.ok(venture)
  assert.match(venture, /og:image" content="https:\/\/greatutah\.work\/og\.png"/)
  assert.match(venture, /"@type":"Article"/)
  assert.match(venture, /"@type":"BreadcrumbList"/)
  assert.match(venture, /"item":"https:\/\/greatutah\.work\/v\/ventures"/)
  assert.doesNotMatch(venture, /name="robots"/)

  const source = renderDocument('pages', 'fervo-energy-official-website')
  assert.ok(source)
  assert.match(source, /name="robots" content="noindex, follow"/)

  const view = renderDocument('views', 'ventures')
  assert.ok(view)
  assert.match(view, /"@type":"CollectionPage"/)
  assert.doesNotMatch(view, /"@type":"Article"/)
  assert.match(view, /href="\/v\/by-role">looking for work<\/a>/)
  assert.doesNotMatch(view, /href="\/v\/needs">looking for work<\/a>/)
  assert.match(view, /href="\/map">location<\/a>/)
  assert.doesNotMatch(view, /href="\/v\/by-region">by place<\/a>/)

  const metaDoc = renderDocument('meta', 'about')
  assert.ok(metaDoc)
  assert.match(metaDoc, /"@type":"WebPage"/)

  assert.match(searchPage(), /og:image" content="https:\/\/greatutah\.work\/og\.png"/)
})

test('prerender SEO: sitemap drops markdown twins and source pages', async (t) => {
  if (!fs.existsSync(path.join(ROOT, 'dist'))) {
    t.skip('dist/ missing — run npm run build first')
    return
  }

  const rebuilt = spawnSync(process.execPath, [PRERENDER], {
    cwd: ROOT,
    encoding: 'utf8',
  })
  assert.equal(rebuilt.status, 0, rebuilt.stderr || rebuilt.stdout)

  const xml = fs.readFileSync(path.join(ROOT, 'dist', 'sitemap.xml'), 'utf8')
  assert.doesNotMatch(xml, /\/pages\/[^<]+\.md/)
  assert.doesNotMatch(xml, /\/views\/[^<]+\.md/)
  assert.doesNotMatch(xml, /\/meta\/[^<]+\.md/)
  assert.match(xml, /<loc>https:\/\/greatutah\.work\/p\/fervo-energy<\/loc>/)
  assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
  assert.doesNotMatch(xml, /\/p\/fervo-energy-official-website/)
  assert.match(rebuilt.stdout, /source pages noindex/)

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  assert.ok(urls.length < 700, `expected ~643 HTML urls, got ${urls.length}`)
  assert.ok(urls.length > 400, `expected ~643 HTML urls, got ${urls.length}`)

  // cleanUrls serves these as /map and /contribute; without them those routes 404.
  assert.ok(fs.existsSync(path.join(ROOT, 'dist', 'map.html')))
  assert.ok(fs.existsSync(path.join(ROOT, 'dist', 'contribute.html')))
  assert.match(rebuilt.stdout, /spa shells/)
})
