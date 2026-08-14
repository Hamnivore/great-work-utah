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
  ['/p/best-pages', 'best pages'],
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
  if (m[1] === 'views') return m[2] === 'index' ? '/v' : `/v/${m[2]}`
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
  const html = instance.parse(dropRedundantTwins(md), {
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') {
        token.href = mapHref(token.href, kind, name)
      }
    },
    async: false,
  })
  return kind === 'views' && name === 'tier-list' ? fadeQuietTierEntries(html) : html
}

/** Human-page only. Markdown still says `(active)` in plain text; the HTML twin
 *  classes each row so CSS can recede the ones that are not still happening.
 *  Agents never see this. */
function fadeQuietTierEntries(html) {
  const classified = html.replace(/<li>([\s\S]*?)<\/li>/g, (_, inner) => {
    const quiet = !inner.includes('(active)')
    return `<li class="${quiet ? 'is-quiet' : 'is-active'}">${inner}</li>`
  })
  return classified.replaceAll('(active)', '<span class="active-mark">(active)</span>')
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
  // One footer, two audiences. Humans get HTML routes; agents who landed on the
  // HTML twin get the markdown source and /llms.txt (the two pointers that made
  // HTML a door — research/findings/2026-07-27-html-arrival-probe.md).
  const human = url !== '/about' ? `<a href="/about">How this is made</a>` : ''
  const agent = [
    rawUrl ? `<a href="${esc(rawUrl)}">${esc(BASE + rawUrl)}</a>` : '',
    `<a href="/llms.txt">${BASE}/llms.txt</a>`,
  ]
    .filter(Boolean)
    .join(' · ')
  const footer = [
    human ? `<p>${human}</p>` : '',
    `<p>Agents: ${agent}</p>`,
  ]
    .filter(Boolean)
    .join('\n        ')
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
        ${footer}
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
function existingPages() {
  return new Set(
    fs
      .readdirSync(path.join(WIKI, 'pages'))
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace(/\.md$/, '')),
  )
}

function markWantedLinks(html) {
  const existing = existingPages()
  return html.replace(/<a href="\/p\/([a-z0-9-]+)">/g, (whole, slug) =>
    existing.has(slug)
      ? whole
      : `<a class="wanted" href="/contribute?wanted=${slug}" title="No page yet — this is a gap you could fill">`,
  )
}

const CONF_RANK = { High: 'conf-high', Medium: '', Low: 'conf-low' }

// Activity (wiki/meta/activity.md) is the one attribute about the *subject* rather than the page, so
// it is the one a human needs before reading a word of the prose — "is this a going concern or a
// monument?" It gets a colored badge with its own dot rather than another neutral pill, because
// scanning a list of pages for the live ones is the whole job it was added to do. The value itself
// is then hidden from the metadata table below, where it would just be saying the same thing twice.
const ACTIVITY_RANK = {
  active: 'act-active',
  dormant: 'act-dormant',
  concluded: 'act-concluded',
  unknown: 'act-unknown',
}
const ACTIVITY_TITLE = {
  active: 'Someone found a dated public artifact from the last 18 months showing this work happening',
  dormant: 'Real work, but nothing found in the public record recently. May be alive and quiet',
  concluded: 'The doing is finished — dissolved, ended, or completed. Not a judgment of its worth',
  unknown: 'Checked, and the public record could not settle it',
}
const HIDDEN_META = new Set(['Pull', 'Activity'])

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
  const activity = get('Activity')

  const badges = []
  if (kind === 'pages') {
    if (type) badges.push(`<span class="badge">${esc(type)}</span>`)
    if (ACTIVITY_RANK[activity])
      badges.push(
        `<span class="badge ${ACTIVITY_RANK[activity]}" title="${esc(ACTIVITY_TITLE[activity])}">${esc(activity)}</span>`,
      )
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
  const maintainerNotes = section(bodyNoTitle, 'Maintainer Notes')
  const readerBody = maintainerNotes
    ? bodyNoTitle.replace(/\n?## Maintainer Notes\s+[\s\S]*$/, '').trim()
    : bodyNoTitle

  const articleClass = kind === 'views' && name === 'tier-list' ? ' class="tier-list"' : ''
  const bodyHtml = `        <article${articleClass}>
${pull ? `        <p class="pull">${inline(pull, kind, name)}</p>\n` : ''}        <h1>${esc(title)}</h1>
${badges.length ? `        <p class="trust">${badges.join('\n          ')}</p>\n` : ''}${metaHtml}
        <div class="doc">
${renderMarkdown(readerBody, kind, name)}
        </div>
${maintainerNotes ? `        <aside class="maintainer-notes" aria-labelledby="maintainer-notes-${esc(name)}">
          <h2 id="maintainer-notes-${esc(name)}">Maintainer Notes</h2>
${renderMarkdown(maintainerNotes, kind, name)}
        </aside>
` : ''}        </article>`

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
        <form class="search-form" role="search" onsubmit="return false">
          <label class="skip-link" for="q">Search the wiki</label>
          <input type="search" id="q" name="q" placeholder="geothermal, Ogden, biotech, grants…" autocomplete="off" />
        </form>
        <p class="search-status" id="status" role="status">
          Type to search. If nothing happens, <a href="/v">browse the master index</a>.
        </p>
        <ul class="search-results" id="results"></ul>
        </article>`

  // Inline, dependency-free, and the only page in the prerendered set that runs
  // any JavaScript. Degrades to the note above with scripts disabled.
  // Full-text grep via /api/search — the metadata-only index missed the pages a
  // person actually wants (Rodatherm for "drilling engineers", most of the
  // corpus for "jobs" / "grants"). Matching line is the blurb.
  const script = `
      var statusEl = document.getElementById('status'),
          resultsEl = document.getElementById('results'),
          qEl = document.getElementById('q'),
          timer = null, seq = 0;
      function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
        return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }
      function slugOf(url){
        var m = String(url).match(/\\/pages\\/([a-z0-9-]+)\\.md/);
        return m ? m[1] : '';
      }
      function idle(){
        statusEl.innerHTML = 'Type to search. If nothing happens, <a href="/v">browse the master index</a>.';
        resultsEl.innerHTML = '';
      }
      function renderList(q, data){
        var blurbs = {};
        (data.results || []).forEach(function(r){
          var text = r.text || '';
          if (text.replace(/^#+ /, '') === r.title) return;
          if (!blurbs[r.url]) blurbs[r.url] = text;
        });
        var pages = (data.pages || []).slice(0, 80);
        var n = (data.coverage && data.coverage.pagesMatched) || pages.length;
        statusEl.textContent = n + (n === 1 ? ' page' : ' pages') + ' matching "' + q + '"'
          + (n > pages.length ? ' (first ' + pages.length + ')' : '');
        resultsEl.innerHTML = pages.map(function(p){
          var slug = slugOf(p.url);
          var blurb = blurbs[p.url] || '';
          return '<li><a href="/p/' + esc(slug) + '">' + esc(p.title) + '</a>' +
            '<span class="meta">' + esc(p.type || '') + '</span>' +
            (blurb ? '<p class="blurb">' + esc(blurb) + '</p>' : '') + '</li>';
        }).join('');
      }
      function search(){
        var q = qEl.value.trim();
        var next = new URL(location.href);
        if (q) next.searchParams.set('q', q); else next.searchParams.delete('q');
        history.replaceState(null, '', next);
        if (q.length < 2) { idle(); return; }
        var id = ++seq;
        fetch('/api/search?q=' + encodeURIComponent(q) + '&limit=80&hits_per_page=3')
          .then(function(r){ return r.json().then(function(data){ return { ok: r.ok, data: data }; }); })
          .then(function(res){
            if (id !== seq) return;
            if (!res.ok || !res.data || !res.data.ok) throw new Error('search failed');
            renderList(q, res.data);
          })
          .catch(function(){
            if (id !== seq) return;
            statusEl.innerHTML = 'Could not search. <a href="/v">Browse the master index</a> instead.';
            resultsEl.innerHTML = '';
          });
      }
      qEl.addEventListener('input', function(){
        clearTimeout(timer);
        timer = setTimeout(search, 160);
      });
      if (new URLSearchParams(location.search).get('q')) {
        qEl.value = new URLSearchParams(location.search).get('q');
        search();
      }
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
            <li><a href="/v">Master index</a> — everything, by type</li>
            <li><a href="/v/by-role">Browse by kind of work</a></li>
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
  // Vercel cleanUrls normalizes an index document to its directory URL.
  // Publish that URL directly so the canonical never points at a redirect.
  ['views', (n) => (n === 'index' ? '/v' : `/v/${n}`)],
  ['meta', (n) => META_SLUG(n)],
]

function readDir(dir) {
  return fs
    .readdirSync(path.join(WIKI, dir))
    .filter((f) => f.endsWith('.md'))
    .sort()
}

/** A few facts in About and llms.txt describe the generated corpus and must not
 * be copied by hand. Keeping tokens in the source makes the dependency visible
 * while the published markdown, text, and HTML always carry build-current
 * values. */
export function expandBuildFacts(raw, buildDate = today()) {
  const facts = {
    BUILD_DATE: buildDate,
    PAGE_COUNT: readDir('pages').length,
  }
  return raw.replace(/\{\{(BUILD_DATE|PAGE_COUNT)\}\}/g, (_, key) => String(facts[key]))
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
  const source = fs.readFileSync(file, 'utf8')
  const raw = dir === 'meta' && name === 'about' ? expandBuildFacts(source) : source
  const doc = renderDoc({
    kind: dir,
    name,
    raw,
    rawUrl: `/${dir}/${name}.md`,
    url,
  })
  return markWantedLinks(layout({ url, rawUrl: `/${dir}/${name}.md`, ...doc }))
}

export { searchPage, notFoundPage }

/** Give each JavaScript-only route an honest first response for crawlers,
 * previews, and no-JS clients. React replaces #root when it starts. */
export function spaShellPage(shell, { url, title, description, fallback }) {
  const fullTitle = `${title} — ${SITE}`
  let page = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${BASE}${url}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${BASE}${url}" />`)

  // Vite moves the module script into <head>, so anchor the replacement to
  // </body> instead of assuming a script follows #root. The last closing div
  // before </body> is the root shell's closing tag in both source and output.
  const rootStart = page.indexOf('<div id="root">')
  const bodyEnd = page.lastIndexOf('</body>')
  const rootEnd = page.lastIndexOf('</div>', bodyEnd)
  if (rootStart === -1 || rootEnd === -1 || rootEnd < rootStart) {
    throw new Error(`Cannot find #root shell while generating ${url}`)
  }
  page = `${page.slice(0, rootStart)}<div id="root">${fallback}</div>${page.slice(rootEnd + 6)}`
  return page
}

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
      if (dir === 'meta' && name === 'about') {
        fs.writeFileSync(path.join(DIST, 'meta', file), expandBuildFacts(raw, buildDate))
      }
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

  // The manual ships from public/ and is the first thing an agent reads, so the
  // corpus size it quotes is expanded here rather than maintained by hand.
  const manual = path.join(DIST, 'llms.txt')
  if (!fs.existsSync(manual)) {
    console.error('dist/llms.txt missing — the agent manual did not reach the build output.')
    process.exit(1)
  }
  fs.writeFileSync(manual, expandBuildFacts(fs.readFileSync(manual, 'utf8'), buildDate))

  // /map and /contribute are React SPA routes. With cleanUrls, a rewrite to
  // /index.html 404s (extension stripped at build time); emit real shells so
  // /map and /contribute resolve from the filesystem like /search.
  const spaShell = path.join(DIST, 'index.html')
  if (!fs.existsSync(spaShell)) {
    console.error('dist/index.html missing — cannot emit /map and /contribute shells.')
    process.exit(1)
  }
  const shell = fs.readFileSync(spaShell, 'utf8')
  fs.writeFileSync(
    path.join(DIST, 'map.html'),
    spaShellPage(shell, {
      url: '/map',
      title: 'Map of consequential work across Utah',
      description: 'Explore public sites and regional anchors for consequential companies, labs, programs, people, and projects across Utah.',
      fallback: '<main style="max-width:42rem;margin:4rem auto;padding:0 1.25rem;font-family:Georgia,serif;line-height:1.6"><h1>Work across Utah</h1><p>Loading the interactive map of public sites and regional anchors.</p><p><a href="/views/by-region.md">Browse the location index as Markdown</a>.</p></main>',
    }),
  )
  fs.writeFileSync(
    path.join(DIST, 'contribute.html'),
    spaShellPage(shell, {
      url: '/contribute',
      title: 'Contribute',
      description: 'Report something missing, stale, or wrong in greatutah.work, or propose an edit through its public review process.',
      fallback: '<main style="max-width:42rem;margin:4rem auto;padding:0 1.25rem;font-family:Georgia,serif;line-height:1.6"><h1>Contribute</h1><p>Leave a short note about something missing or wrong, or propose a page edit. The contribution form loads with JavaScript.</p><p><a href="https://github.com/Hamnivore/great-work-utah/issues">Open a GitHub issue instead</a>, or read the <a href="/llms.txt">agent contribution instructions</a>.</p></main>',
    }),
  )

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
