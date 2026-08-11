// Prerenders every wiki document to a static HTML file in dist/.
//
// Why this exists: until now every /p/<slug> and /v/<view> URL returned the same
// 1.8KB React shell — identical <title>, identical meta description, zero content.
// 616 sitemap URLs, one document. That is invisible to crawlers, to link previews,
// to no-JS clients, and — the reason it matters for an agents-first wiki — to every
// AI agent that arrives through a search index rather than through /llms.txt.
// See research/design/static-html-is-the-second-half.md.
//
// Output is pure HTML + one stylesheet. No JavaScript on a content page.
// Runs after `vite build`, writing into dist/ alongside the app's assets.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const BASE = 'https://greatutah.work'
const SITE = 'Great Work — Utah'
const OG_IMAGE = `${BASE}/og.png`
const ROOT = new URL('..', import.meta.url).pathname
const WIKI = path.join(ROOT, 'wiki')
const DIST = path.join(ROOT, 'dist')

// Meta docs get short top-level URLs (/about, /charter). Everything else in
// wiki/meta/ still gets a page; this map only controls the human-facing slug.
const META_SLUG = (doc) => `/${doc}`

// Type → type-index view slug (matches scripts/build-views.mjs PLURAL).
const TYPE_PLURAL = {
  venture: 'ventures',
  resource: 'resources',
  work: 'work',
  person: 'people',
  helper: 'helpers',
  guide: 'guides',
  source: 'sources',
}

const NAV = [
  ['/search', 'search'],
  ['/v/needs', 'looking for work'],
  ['/v/by-region', 'by place'],
  ['/map', 'map'],
  ['/v/guides', 'founding'],
  ['/about', 'about'],
  ['/contribute', 'contribute'],
]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const today = () => new Date().toISOString().slice(0, 10)

// ---------- helpers ----------

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''

const section = (raw, name) =>
  (raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`)) || [])[1]?.trim() || ''

/** Strip markdown decoration down to plain text, for <title>/<meta>/JSON-LD. */
const plain = (s = '') =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/[\s,;.]+$/, '')}…`)

/** Resolve a markdown href against the document it appeared in, and map wiki
 *  markdown paths onto their human HTML routes. Mirrors resolveHref() in the
 *  React app so both layers link the same way. */
function mapHref(href, kind, name) {
  if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#') || href.startsWith('//')) {
    return href
  }
  const resolved = new URL(href, `https://x.invalid/${kind}/${name}.md`).pathname
  const m = resolved.match(/^\/(pages|views|meta)\/([a-z0-9-]+)\.md$/)
  if (!m) return resolved
  if (m[1] === 'pages') return `/p/${m[2]}`
  if (m[1] === 'views') return `/v/${m[2]}`
  return META_SLUG(m[2])
}

/** The corpus repeats every internal link as a bare absolute .md URL so that
 *  HTML-sanitizing and whitelist-only fetchers still see something fetchable
 *  (build-views.mjs explains why). For a human reading rendered HTML the href is
 *  already there, so the twin is pure noise — drop it, but only when the same
 *  line already links to that exact target. External evidence URLs are never
 *  touched: those are the citation. */
function dropRedundantTwins(md) {
  return md
    .split('\n')
    .map((line) => {
      if (!line.includes(`${BASE}/`)) return line
      return line.replace(
        /(?:\s*·)?\s*`?https:\/\/greatutah\.work\/(pages|views|meta)\/([a-z0-9-]+\.md)`?/g,
        (whole, dir, file) => {
          const slug = file.replace(/\.md$/, '')
          const linked =
            line.includes(`](${file})`) ||
            line.includes(`](/${dir}/${file})`) ||
            line.includes(`](${dir}/${file})`)
          return linked ? '' : whole
        },
      )
    })
    .join('\n')
}

/** Split the leading `**Key:** value` block off the body, as the React app does. */
function splitMetadata(raw) {
  const rows = []
  const body = []
  let inHeader = true
  for (const line of raw.split('\n')) {
    if (inHeader) {
      const m = line.match(/^\*\*([A-Za-z][A-Za-z -]*):\*\*\s*(.+)$/)
      if (m) {
        rows.push([m[1], m[2]])
        continue
      }
      if (line.trim() !== '' && !line.startsWith('# ')) inHeader = false
    }
    body.push(line)
  }
  return { rows, body: body.join('\n') }
}

function renderMarkdown(md, kind, name) {
  const instance = marked.setOptions({ gfm: true, breaks: false })
  return instance.parse(dropRedundantTwins(md), {
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') {
        token.href = mapHref(token.href, kind, name)
      }
    },
    async: false,
  })
}

const inline = (md, kind, name) =>
  marked.parseInline(dropRedundantTwins(md), {
    walkTokens(token) {
      if (token.type === 'link') token.href = mapHref(token.href, kind, name)
    },
    async: false,
  })

// ---------- page template ----------

function layout({
  url,
  title,
  description,
  bodyHtml,
  jsonLd,
  canonical,
  rawUrl,
  robots,
  ogType = 'article',
}) {
  const full = title === SITE ? SITE : `${title} — ${SITE}`
  const canon = canonical || BASE + url
  const nav = NAV.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join('\n          ')
  const jsonLdBlocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(full)}</title>
    <meta name="description" content="${esc(description)}" />
${robots ? `    <meta name="robots" content="${esc(robots)}" />\n` : ''}    <link rel="canonical" href="${esc(canon)}" />
${rawUrl ? `    <link rel="alternate" type="text/markdown" href="${esc(BASE + rawUrl)}" title="Raw markdown source" />\n` : ''}    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#fbfaf6" />
    <meta property="og:type" content="${esc(ogType)}" />
    <meta property="og:site_name" content="${esc(SITE)}" />
    <meta property="og:title" content="${esc(full)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canon)}" />
    <meta property="og:image" content="${esc(OG_IMAGE)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${esc(OG_IMAGE)}" />
    <link rel="stylesheet" href="/doc.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap"
      rel="stylesheet"
    />
${jsonLdBlocks.map((block) => `    <script type="application/ld+json">${JSON.stringify(block)}</script>`).join('\n')}${jsonLdBlocks.length ? '\n' : ''}  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="shell">
      <header class="site-header">
        <a class="wordmark" href="/">${esc(SITE)}</a>
        <nav aria-label="Main">
          ${nav}
        </nav>
      </header>
      <main id="content">
${bodyHtml}
      </main>
      <footer class="site-footer">
        <p>
          A wiki of high-impact work in Utah — written and maintained mostly by AI agents,
          reviewed by a human before anything publishes.
          <a href="/about">How this is made, and how to correct it</a>.
        </p>
        <p>Agents: the manual is <a href="/llms.txt">/llms.txt</a>. Every page is also raw markdown.</p>
      </footer>
    </div>
  </body>
</html>
`
}

// ---------- document rendering ----------

/** Slugs that actually have a page. The corpus deliberately links to pages that
 *  *should* exist — lint feeds those to the wanted queue (AGENTS.md). Rendering
 *  them as plain links would ship real 404s, so they become red links instead:
 *  same text, routed to /contribute, marked as a gap. A dead end turns into the
 *  lowest rung of the contribution ladder. */
const EXISTING = new Set(
  fs
    .readdirSync(path.join(WIKI, 'pages'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '')),
)

function markWantedLinks(html) {
  return html.replace(/<a href="\/p\/([a-z0-9-]+)">/g, (whole, slug) =>
    EXISTING.has(slug)
      ? whole
      : `<a class="wanted" href="/contribute?wanted=${slug}" title="No page yet — this is a gap you could fill">`,
  )
}

const CONF_RANK = { High: 'conf-high', Medium: '', Low: 'conf-low' }
const HIDDEN_META = new Set(['Pull'])

/** Each of the three document kinds has a different claim to authority: a corpus
 *  page is an AI-written draft you should verify, a view is compiled from the
 *  corpus and is always current, a meta doc is the schema itself. */
const PROVENANCE = {
  pages: (updated) =>
    `Written by an AI agent and merged by a human reviewer. Facts can be wrong or stale —
            check the Evidence section against its primary sources${updated ? `, and note this page was last updated ${updated}` : ''}.`,
  views: () =>
    `This index is generated from page metadata on every build and is never hand-edited, so it
            is always current with the corpus. The pages it lists are AI-written — verify those
            individually.`,
  meta: () =>
    `This is one of the wiki's schema and policy documents, not an entry about the world. It
            defines how the pages are written, graded, and placed.`,
}

function renderDoc({ kind, name, raw, rawUrl, url }) {
  const title = (raw.match(/^# (.+)$/m) || [, name])[1].trim()
  const { rows, body } = splitMetadata(raw)
  const get = (k) => rows.find(([key]) => key === k)?.[1] || ''

  const pull = get('Pull')
  const summary = section(raw, 'Summary')
  const firstPara = body.replace(/^#.*$/gm, '').trim().split('\n\n')[0] || ''
  const description = clip(plain(pull || summary || firstPara) || `${title} on ${SITE}.`, 175)

  const confidence = get('Confidence')
  const updated = get('Updated')
  const status = get('Status')
  const type = get('Type')

  // Trust badges are a corpus-page affordance. Generated views and schema docs
  // carry a Status too, but it means something different there, so don't imply
  // it is a claim about evidence.
  const badges = []
  if (kind === 'pages') {
    if (type) badges.push(`<span class="badge">${esc(type)}</span>`)
    if (confidence)
      badges.push(
        `<span class="badge${CONF_RANK[confidence] ? ` ${CONF_RANK[confidence]}` : ''}">confidence: ${esc(confidence)}</span>`,
      )
    if (status) badges.push(`<span class="badge">status: ${esc(status)}</span>`)
    if (updated) badges.push(`<span class="badge">updated ${esc(updated)}</span>`)
  }

  const metaRows = rows.filter(([k]) => !HIDDEN_META.has(k))
  const metaHtml = metaRows.length
    ? `        <dl class="doc-meta">
${metaRows
  .map(
    ([k, v]) =>
      `          <div><dt>${esc(k)}</dt><dd>${inline(v, kind, name)}</dd></div>`,
  )
  .join('\n')}
        </dl>`
    : ''

  // The H1 is emitted by the template, not by marked, so the trust badges and
  // metadata can sit between the title and the prose.
  const bodyNoTitle = body.replace(/^# .+$/m, '').trim()

  const bodyHtml = `        <article>
${pull ? `        <p class="pull">${inline(pull, kind, name)}</p>\n` : ''}        <h1>${esc(title)}</h1>
${badges.length ? `        <p class="trust">${badges.join('\n          ')}</p>\n` : ''}${metaHtml}
        <div class="doc">
${renderMarkdown(bodyNoTitle, kind, name)}
        </div>
        <div class="provenance">
          <p>
            Raw markdown for agents and citation:
            <a href="${esc(rawUrl)}">${esc(BASE + rawUrl)}</a>
          </p>
          <p>${PROVENANCE[kind](updated)}
            <a href="/about">Methodology and corrections</a> ·
            <a href="/contribute">Report a problem</a>
          </p>
        </div>
        </article>`

  // Views are indexes; meta docs are schema/policy; corpus pages are articles.
  // Source pages stay fetchable for citations but are noindex'd — they are thin
  // near-duplicates that dilute crawl assessment of the rest of the domain
  // (research/design/seo-plan.md P1.4, Option A).
  const schemaType = kind === 'views' ? 'CollectionPage' : kind === 'meta' ? 'WebPage' : 'Article'
  const ogType = kind === 'pages' ? 'article' : 'website'
  const robots = kind === 'pages' && type === 'source' ? 'noindex, follow' : undefined

  const pageLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    ...(schemaType === 'Article' ? { headline: title } : { name: title }),
    description,
    url: BASE + url,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE, url: `${BASE}/` },
    publisher: { '@type': 'Organization', name: 'greatutah.work', url: `${BASE}/` },
    image: OG_IMAGE,
    ...(updated && ISO_DATE.test(updated) ? { dateModified: updated } : {}),
    ...(get('Website')
      ? { about: { '@type': 'Organization', name: title, url: get('Website') } }
      : {}),
  }

  const jsonLd = [pageLd]
  if (kind === 'pages') {
    const typeView = TYPE_PLURAL[type]
    const crumbs = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      ...(typeView
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: typeView,
              item: `${BASE}/v/${typeView}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: typeView ? 3 : 2,
        name: title,
        item: BASE + url,
      },
    ]
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs,
    })
  }

  return { title, description, bodyHtml, jsonLd, robots, ogType, type, updated }
}

// ---------- search page ----------

function searchPage() {
  const body = `        <article>
        <h1>Search</h1>
        <p class="trust"><span class="badge">titles, focus lines, and summaries</span></p>
        <form class="search-form" role="search" onsubmit="return false">
          <label class="skip-link" for="q">Search the wiki</label>
          <input type="search" id="q" name="q" placeholder="geothermal, Ogden, biotech, grants…" autocomplete="off" />
          <select id="type" aria-label="Filter by type">
            <option value="">every type</option>
            <option value="venture">ventures</option>
            <option value="resource">resources</option>
            <option value="person">people</option>
            <option value="helper">helpers</option>
            <option value="work">work</option>
            <option value="guide">guides</option>
            <option value="source">sources</option>
          </select>
        </form>
        <p class="search-status" id="status" role="status">Loading the index…</p>
        <ul class="search-results" id="results"></ul>
        <div class="provenance">
          <p>
            This searches titles, focus lines, and summaries. For exact phrase matching over the
            full text of every page, agents should use
            <a href="/llms.txt">the search endpoint documented in /llms.txt</a>, or browse
            <a href="/v/index">the master index</a>.
          </p>
        </div>
        </article>`

  // Inline, dependency-free, and the only page in the prerendered set that runs
  // any JavaScript. Degrades to the note above with scripts disabled.
  const script = `
      var idx = [], statusEl = document.getElementById('status'),
          resultsEl = document.getElementById('results'),
          qEl = document.getElementById('q'), typeEl = document.getElementById('type');
      function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }
      function render(){
        var q = qEl.value.trim().toLowerCase(), t = typeEl.value;
        var terms = q ? q.split(/\\s+/) : [];
        var hits = idx.filter(function(p){
          if (t && p.type !== t) return false;
          if (!terms.length) return false;
          var hay = (p.title + ' ' + (p.focus||'') + ' ' + (p.summary||'') + ' ' +
                     (p.region||'') + ' ' + (p.domain||'') + ' ' + p.slug).toLowerCase();
          return terms.every(function(term){ return hay.indexOf(term) !== -1; });
        });
        if (!terms.length) { statusEl.textContent = idx.length + ' pages indexed. Type to search.';
          resultsEl.innerHTML = ''; return; }
        statusEl.textContent = hits.length + (hits.length === 1 ? ' page' : ' pages') + ' matching "' + q + '"';
        resultsEl.innerHTML = hits.slice(0, 80).map(function(p){
          return '<li><a href="/p/' + esc(p.slug) + '">' + esc(p.title) + '</a>' +
            '<span class="meta">' + esc([p.type, p.region, p.domain].filter(Boolean).join(' · ')) + '</span>' +
            '<p class="blurb">' + esc(p.focus || p.summary || '') + '</p></li>';
        }).join('');
      }
      fetch('/search-index.json').then(function(r){ return r.json(); }).then(function(data){
        idx = Array.isArray(data) ? data : (data.pages || []);
        var params = new URLSearchParams(location.search);
        if (params.get('q')) qEl.value = params.get('q');
        if (params.get('type')) typeEl.value = params.get('type');
        render();
      }).catch(function(){
        statusEl.textContent = 'Could not load the search index. Browse the master index instead.';
      });
      qEl.addEventListener('input', render);
      typeEl.addEventListener('change', render);
`
  const html = layout({
    url: '/search',
    title: 'Search',
    description: `Search ${SITE} — high-impact ventures, people, programs, and history across Utah.`,
    bodyHtml: body,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE,
      url: `${BASE}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  })
  return html.replace('</body>', `    <script>\n${script}    </script>\n  </body>`)
}

// ---------- 404 ----------

function notFoundPage() {
  const body = `        <article>
        <h1>Not found</h1>
        <p class="trust"><span class="badge">404</span></p>
        <div class="doc">
          <p>That page does not exist. Slugs are not guessable — start from an index.</p>
          <h2>Humans</h2>
          <ul>
            <li><a href="/search">Search the wiki</a></li>
            <li><a href="/v/index">Master index</a> — everything, by type</li>
            <li><a href="/v/needs">Who needs people right now</a></li>
            <li><a href="/v/guides">Founding and growing</a></li>
            <li><a href="/about">What this is and who makes it</a></li>
          </ul>
          <h2>Agents</h2>
          <ul>
            <li><a href="/llms.txt">${BASE}/llms.txt</a> — the manual, read this first</li>
            <li><a href="/views/index.md">${BASE}/views/index.md</a></li>
            <li><a href="/views/needs.md">${BASE}/views/needs.md</a></li>
          </ul>
          <p>
            If a page <em>should</em> exist here, that is worth telling us:
            <a href="/contribute">leave a note</a>.
          </p>
        </div>
        </article>`
  return layout({
    url: '/404',
    canonical: `${BASE}/404`,
    title: 'Not found',
    description: 'That page does not exist on greatutah.work. Start from an index or search.',
    bodyHtml: body,
    ogType: 'website',
    robots: 'noindex',
  })
}

// ---------- the document set ----------

/** dir → the human route each document in it is published at. */
export const DOC_DIRS = [
  ['pages', (n) => `/p/${n}`],
  ['views', (n) => `/v/${n}`],
  ['meta', (n) => META_SLUG(n)],
]

function readDir(dir) {
  return fs
    .readdirSync(path.join(WIKI, dir))
    .filter((f) => f.endsWith('.md'))
    .sort()
}

/** Render one wiki document to a complete HTML page. Exported so `npm run dev`
 *  serves exactly what the build ships — one renderer, no second implementation
 *  to drift. Returns null when the document does not exist. */
export function renderDocument(dir, name) {
  const file = path.join(WIKI, dir, `${name}.md`)
  if (!fs.existsSync(file)) return null
  const route = DOC_DIRS.find(([d]) => d === dir)?.[1]
  if (!route) return null
  const url = route(name)
  const doc = renderDoc({
    kind: dir,
    name,
    raw: fs.readFileSync(file, 'utf8'),
    rawUrl: `/${dir}/${name}.md`,
    url,
  })
  return markWantedLinks(layout({ url, rawUrl: `/${dir}/${name}.md`, ...doc }))
}

export { searchPage, notFoundPage }

// ---------- CLI ----------

function sitemapEntry({ loc, lastmod }) {
  const mod =
    lastmod && ISO_DATE.test(lastmod) ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return `  <url>\n    <loc>${loc}</loc>${mod}\n  </url>`
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist/ does not exist — run the vite build first.')
    process.exit(1)
  }

  const write = (rel, html) => {
    const file = path.join(DIST, rel)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, html)
  }

  const buildDate = today()
  // HTML twins only — markdown paths stay fetchable for agents but are not
  // submitted as a second indexable URL (seo-plan P0.1). Source pages are
  // rendered (and noindex'd) but omitted from the sitemap (P1.4).
  const urls = [
    { loc: `${BASE}/`, lastmod: buildDate },
    { loc: `${BASE}/search`, lastmod: buildDate },
    { loc: `${BASE}/contribute`, lastmod: buildDate },
    { loc: `${BASE}/map`, lastmod: buildDate },
    { loc: `${BASE}/llms.txt` },
  ]
  let count = 0
  let skippedSitemap = 0

  for (const [dir, route] of DOC_DIRS) {
    for (const file of readDir(dir)) {
      const name = file.replace(/\.md$/, '')
      const url = route(name)
      const raw = fs.readFileSync(path.join(WIKI, dir, file), 'utf8')
      const type = meta(raw, 'Type')
      const updated = meta(raw, 'Updated')
      write(`${url.replace(/^\//, '')}.html`, renderDocument(dir, name))
      count++

      const noindexSource = dir === 'pages' && type === 'source'
      if (noindexSource) {
        skippedSitemap++
        continue
      }
      const lastmod =
        dir === 'views' ? buildDate : ISO_DATE.test(updated) ? updated : undefined
      urls.push({ loc: `${BASE}${url}`, lastmod })
    }
  }

  write('search.html', searchPage())
  write('404.html', notFoundPage())

  // /map and /contribute are React SPA routes. With cleanUrls, a rewrite to
  // /index.html 404s (extension stripped at build time); emit real shells so
  // /map and /contribute resolve from the filesystem like /search.
  const spaShell = path.join(DIST, 'index.html')
  if (!fs.existsSync(spaShell)) {
    console.error('dist/index.html missing — cannot emit /map and /contribute shells.')
    process.exit(1)
  }
  fs.copyFileSync(spaShell, path.join(DIST, 'map.html'))
  fs.copyFileSync(spaShell, path.join(DIST, 'contribute.html'))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(sitemapEntry)
    .join('\n')}\n</urlset>\n`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)

  console.log(
    `prerender: ${count} documents + search + 404 + spa shells; sitemap: ${urls.length} urls` +
      (skippedSitemap ? ` (${skippedSitemap} source pages noindex, omitted)` : ''),
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
