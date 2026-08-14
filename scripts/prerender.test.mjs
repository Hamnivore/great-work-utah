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
  assert.equal([...venture.matchAll(/class="site-footer"/g)].length, 1)
  assert.doesNotMatch(venture, /class="provenance"/)
  assert.match(
    venture,
    /<footer class="site-footer">\s*<p><a href="\/about">How this is made<\/a><\/p>\s*<p>Agents: <a href="\/pages\/fervo-energy\.md">https:\/\/greatutah\.work\/pages\/fervo-energy\.md<\/a> · <a href="\/llms\.txt">https:\/\/greatutah\.work\/llms\.txt<\/a><\/p>/,
  )
  assert.doesNotMatch(venture, /Methodology and corrections/)
  assert.doesNotMatch(venture, /written and maintained mostly by AI/)
  assert.doesNotMatch(venture, /Written by an AI agent/)

  const source = renderDocument('pages', 'fervo-energy-official-website')
  assert.ok(source)
  assert.match(source, /name="robots" content="noindex, follow"/)

  const view = renderDocument('views', 'ventures')
  assert.ok(view)
  assert.match(view, /"@type":"CollectionPage"/)
  assert.doesNotMatch(view, /"@type":"Article"/)
  assert.match(view, /href="\/search">search<\/a>/)
  assert.match(view, /href="\/p\/best-pages">best pages<\/a>/)
  assert.match(view, /href="\/about">about<\/a>/)
  assert.match(view, /href="\/contribute">contribute<\/a>/)
  assert.doesNotMatch(view, /<nav aria-label="Main">[\s\S]*?href="\/v\/by-role"/)
  assert.doesNotMatch(view, /<nav aria-label="Main">[\s\S]*?href="\/map"/)
  assert.doesNotMatch(view, /<nav aria-label="Main">[\s\S]*?href="\/v\/guides"/)
  assert.doesNotMatch(view, /<nav aria-label="Main">[\s\S]*?href="\/v\/tier-list"/)

  const best = renderDocument('pages', 'best-pages')
  assert.ok(best)
  assert.match(best, /"@type":"Article"/)
  assert.match(best, /href="\/v\/by-role"/)
  assert.match(best, /href="\/map"/)
  assert.match(best, /href="\/v\/guides"/)
  assert.match(best, /href="\/v\/tier-list"/)

  const metaDoc = renderDocument('meta', 'about')
  assert.ok(metaDoc)
  assert.match(metaDoc, /"@type":"WebPage"/)
  assert.doesNotMatch(metaDoc, /\{\{[A-Z_]+\}\}/)
  assert.match(metaDoc, /\d+ pages covering ventures/)
  // Markdown keeps same-directory .md links plus fetcher-safe twins; HTML maps
  // those onto the short human routes and drops the twins as noise.
  assert.match(metaDoc, /href="\/charter">Charter<\/a>/)
  assert.match(metaDoc, /href="\/tiers">The impact ladder<\/a>/)
  assert.match(metaDoc, /href="\/activity">Activity<\/a>/)
  assert.match(metaDoc, /href="\/founder-tiers">Founder tiers<\/a>/)
  assert.match(metaDoc, /href="\/attributes">Attributes<\/a>/)
  assert.match(metaDoc, /href="\/conventions">Conventions<\/a>/)
  assert.match(metaDoc, /href="https:\/\/greatutah\.work\/llms\.txt">The agent manual<\/a>/)
  assert.doesNotMatch(metaDoc, /https:\/\/greatutah\.work\/meta\/charter\.md/)
  assert.doesNotMatch(metaDoc, /https:\/\/greatutah\.work\/meta\/tiers\.md/)
  assert.doesNotMatch(metaDoc, /<footer class="site-footer">[\s\S]*href="\/about"/)
  assert.match(
    metaDoc,
    /<footer class="site-footer">\s*<p>Agents: <a href="\/meta\/about\.md">https:\/\/greatutah\.work\/meta\/about\.md<\/a> · <a href="\/llms\.txt">https:\/\/greatutah\.work\/llms\.txt<\/a><\/p>/,
  )

  const tiers = renderDocument('meta', 'tiers')
  assert.ok(tiers)
  assert.match(tiers, /rel="canonical" href="https:\/\/greatutah\.work\/tiers"/)

  const tierList = renderDocument('views', 'tier-list')
  assert.match(tierList, /href="\/tiers">How this is ranked<\/a>/)
  assert.match(tierList, /<article class="tier-list">/)
  assert.match(tierList, /<li class="is-active"><strong><a href="\/p\/bingham-canyon-mine">/)
  assert.match(tierList, /<li class="is-quiet"><strong><a href="\/p\/golden-spike-transcontinental-railroad">/)
  assert.match(tierList, /<span class="active-mark">\(active\)<\/span>/)
  assert.doesNotMatch(tierList, /<li class="is-quiet"><strong><a href="\/p\/bingham-canyon-mine">/)

  const master = renderDocument('views', 'index')
  assert.match(master, /rel="canonical" href="https:\/\/greatutah\.work\/v"/)

  const maintained = renderDocument('pages', 'arpanet-fourth-node')
  assert.match(maintained, /<aside class="maintainer-notes"/)
  assert.match(maintained, /<h2[^>]*>Maintainer Notes<\/h2>/)
  assert.match(maintained, /before promoting this page beyond Draft/)

  const search = searchPage()
  assert.match(search, /og:image" content="https:\/\/greatutah\.work\/og\.png"/)
  assert.match(search, /Type to search/)
  assert.match(search, /href="\/v">browse the master index<\/a>/)
  assert.match(search, /\/api\/search\?q=/)
  assert.doesNotMatch(search, /search-index\.json/)
  assert.doesNotMatch(search, /titles, focus lines, and summaries/)
  assert.doesNotMatch(search, /<select/)
  assert.doesNotMatch(search, /Loading the index/)
  assert.doesNotMatch(search, /class="provenance"/)
  assert.match(
    search,
    /<footer class="site-footer">\s*<p><a href="\/about">How this is made<\/a><\/p>\s*<p>Agents: <a href="\/llms\.txt">https:\/\/greatutah\.work\/llms\.txt<\/a><\/p>/,
  )
})

test('SPA shells have route-specific metadata and useful no-JS fallbacks', async () => {
  const { spaShellPage } = await import(PRERENDER)
  const shell = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  const map = spaShellPage(shell, {
    url: '/map',
    title: 'Map',
    description: 'Map description',
    fallback: '<main><h1>Work across Utah</h1></main>',
  })
  assert.match(map, /<title>Map — Great Work — Utah<\/title>/)
  assert.match(map, /rel="canonical" href="https:\/\/greatutah\.work\/map"/)
  assert.match(map, /property="og:url" content="https:\/\/greatutah\.work\/map"/)
  assert.match(map, /<h1>Work across Utah<\/h1>/)
  assert.doesNotMatch(map, /<h1>Ask better questions about Utah\.<\/h1>/)
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
  assert.match(fs.readFileSync(path.join(ROOT, 'dist', 'map.html'), 'utf8'), /greatutah\.work\/map/)
  assert.match(fs.readFileSync(path.join(ROOT, 'dist', 'contribute.html'), 'utf8'), /<h1>Contribute<\/h1>/)
  const aboutMarkdown = fs.readFileSync(path.join(ROOT, 'dist', 'meta', 'about.md'), 'utf8')
  assert.doesNotMatch(aboutMarkdown, /\{\{[A-Z_]+\}\}/)

  // The first sentence an agent reads states the corpus size; it is generated,
  // so it can never drift from the corpus the way a hand-written count did.
  const manual = fs.readFileSync(path.join(ROOT, 'dist', 'llms.txt'), 'utf8')
  const pageCount = fs
    .readdirSync(path.join(ROOT, 'wiki', 'pages'))
    .filter((f) => f.endsWith('.md')).length
  assert.doesNotMatch(manual, /\{\{[A-Z_]+\}\}/)
  assert.match(manual, new RegExp(`${pageCount} pages, written and maintained`))

  // The master index is published at bare /v, so /v/index must not be the only
  // way in: vercel.json redirects it and carries the matching canonical.
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'))
  assert.ok(
    vercelConfig.redirects.some((r) => r.source === '/v/index' && r.destination === '/v'),
    '/v/index must redirect to /v — it was a live URL before the index moved',
  )
  assert.ok(
    vercelConfig.redirects.some(
      (r) =>
        r.source === '/pages/utah-direct-selling-industry.md' &&
        r.destination === '/pages/utah-multi-level-marketing-industry.md',
    ),
    'old direct-selling slug must 308 to the MLM name',
  )
  assert.ok(
    vercelConfig.redirects.some(
      (r) =>
        r.source === '/p/utah-direct-selling-industry' &&
        r.destination === '/p/utah-multi-level-marketing-industry',
    ),
  )
  assert.ok(
    vercelConfig.routes.some(
      (r) => r.src === '^/views/index\\.md$' && r.headers.Link.includes('/v>'),
    ),
    '/views/index.md must advertise /v as its canonical, not /v/index',
  )

  assert.match(rebuilt.stdout, /spa shells/)
})
