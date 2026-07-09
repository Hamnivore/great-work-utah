// Mock greatutah.work — 6 prototype variants on ports 8801-8806, v2 hybrid on 8807.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const PROTO = path.dirname(new URL(import.meta.url).pathname)
const WIKI = new URL('../../wiki', import.meta.url).pathname
const INDEX = JSON.parse(fs.readFileSync(path.join(PROTO, 'search-index.json'), 'utf8'))
const LOG = path.join(PROTO, 'contributions.log')

const md = (res, file) => {
  res.writeHead(200, { 'content-type': 'text/markdown; charset=utf-8' })
  res.end(fs.readFileSync(file))
}
const notFound = (res) => { res.writeHead(404, { 'content-type': 'text/plain' }); res.end('404 not found') }

function serveWiki(res, urlPath) {
  const rel = urlPath.replace(/^\/wiki\//, '')
  const file = path.join(WIKI, rel)
  if (!file.startsWith(WIKI) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return notFound(res)
  return md(res, file)
}

const NOTES = path.join(PROTO, 'notes.json')
const loadNotes = () => fs.existsSync(NOTES) ? JSON.parse(fs.readFileSync(NOTES, 'utf8')) : []

function contribute(req, res, variant) {
  let body = ''
  req.on('data', (c) => { body += c })
  req.on('end', () => {
    let parsed = null
    try { parsed = JSON.parse(body) } catch { /* keep raw */ }
    fs.appendFileSync(LOG, JSON.stringify({ variant, at: new Date().toISOString(), body: parsed ?? body.slice(0, 4000) }) + '\n')
    const pathOk = parsed && typeof parsed.path === 'string' && /^wiki\/(ventures|people|helpers|resources|work|guides|matches|answers|sources)\/[a-z0-9-]+\.md$/.test(parsed.path)
    const kind = parsed?.kind === 'note' ? 'note' : 'page'
    const contentOk = typeof parsed?.content === 'string' && parsed.content.length > (kind === 'note' ? 15 : 50)
    if (!pathOk || !contentOk) {
      res.writeHead(400, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'body must be JSON: { kind: "note"|"page", path: "wiki/<category>/<slug>.md", content: "<note text or markdown page>", reason: "<line>" }' }))
      return
    }
    if (kind === 'note') {
      const notes = loadNotes()
      notes.push({ at: new Date().toISOString().slice(0, 10), path: parsed.path, note: parsed.content, reason: parsed.reason || '' })
      fs.writeFileSync(NOTES, JSON.stringify(notes, null, 1))
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, kind: 'note', wanted: '/wanted.md' }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, kind: 'page', pr: `https://github.com/greatutah/work/pull/${Math.floor(Math.random() * 900) + 100}` }))
  })
}

function wantedPage(res) {
  const notes = loadNotes()
  let out = `# Wanted — flags and requested pages\n\nLeft by visiting agents via POST /api/contribute (kind: note). Claim one by contributing a stub or page to the same path.\n\n`
  out += `- (2026-07-07) \`wiki/resources/utah-nasa-space-grant-consortium.md\` — no page for the state's NASA Space Grant program; students keep asking.\n`
  for (const n of notes) out += `- (${n.at}) \`${n.path}\` — ${n.note.replace(/\s+/g, ' ').slice(0, 300)}\n`
  res.writeHead(200, { 'content-type': 'text/markdown; charset=utf-8' })
  res.end(out)
}

function search(res, q) {
  const terms = (q || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  const scored = INDEX.map((p) => {
    const hay = `${p.title} ${p.focus} ${p.summary}`.toLowerCase()
    const title = `${p.title} ${p.focus}`.toLowerCase()
    let score = 0
    for (const t of terms) { if (title.includes(t)) score += 3; else if (hay.includes(t)) score += 1 }
    return { path: '/' + p.path, title: p.title, focus: p.focus, summary: p.summary.slice(0, 200), score }
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 20)
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(scored, null, 1))
}

const variants = {
  8801: { name: 'A-llmstxt', routes: {
    '/': (res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(fs.readFileSync(path.join(PROTO, 'prototypes/a-index.html'))) },
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/a-llms.txt')),
    '/contribute.md': (res) => md(res, path.join(PROTO, 'prototypes/a-contribute.md')),
    '/llms-full.txt': (res) => md(res, path.join(PROTO, 'digest.md')),
  } },
  8802: { name: 'B-manual', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/b-manual.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/b-manual.md')),
    '/llms-full.txt': (res) => md(res, path.join(PROTO, 'digest.md')),
  } },
  8803: { name: 'C-skill', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/c-root.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/c-root.md')),
    '/skill.md': (res) => md(res, path.join(PROTO, 'prototypes/c-skill.md')),
  } },
  8804: { name: 'D-api', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/d-api.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/d-api.md')),
    '/api/index': (res) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(INDEX.map((p) => ({ path: '/' + p.path, title: p.title, cat: p.cat, focus: p.focus })))) },
  } },
  8805: { name: 'E-commons', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/e-commons.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/e-commons.md')),
    '/wanted.md': (res) => md(res, path.join(PROTO, 'prototypes/e-wanted.md')),
  } },
  8806: { name: 'F-onefile', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/f-onefile.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/f-onefile.md')),
    '/everything.md': (res) => md(res, path.join(PROTO, 'digest.md')),
  } },
  8807: { name: 'V2-hybrid', routes: {
    '/': (res) => md(res, path.join(PROTO, 'prototypes/v2-hybrid.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'prototypes/v2-hybrid.md')),
    '/everything.md': (res) => md(res, path.join(PROTO, 'digest.md')),
  } },
  8808: { name: 'V3-hierarchy', routes: {
    '/': (res) => md(res, path.join(PROTO, 'v3/root.md')),
    '/llms.txt': (res) => md(res, path.join(PROTO, 'v3/root.md')),
    '/everything.md': (res) => md(res, path.join(PROTO, 'digest.md')),
    '/wanted.md': (res) => wantedPage(res),
    // reorganized document layer overlaid on the same wiki — no files moved
    '/wiki/index.md': (res) => md(res, path.join(PROTO, 'v3/generated/index.md')),
    '/wiki/indexes/ventures.md': (res) => md(res, path.join(PROTO, 'v3/generated/ventures.md')),
    '/wiki/indexes/needs.md': (res) => md(res, path.join(PROTO, 'v3/generated/needs.md')),
  } },
}
const SEARCH_PORTS = new Set([8804, 8807])

for (const [port, cfg] of Object.entries(variants)) {
  http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x')
    fs.appendFileSync(path.join(PROTO, 'access.log'), `${cfg.name} ${req.method} ${u.pathname}${u.search}\n`)
    if (req.method === 'POST' && u.pathname === '/api/contribute') return contribute(req, res, cfg.name)
    if (u.pathname === '/api/search' && SEARCH_PORTS.has(Number(port))) return search(res, u.searchParams.get('q'))
    const h = cfg.routes[u.pathname]
    if (h) return h(res)
    if (u.pathname.startsWith('/wiki/')) return serveWiki(res, u.pathname)
    return notFound(res)
  }).listen(Number(port), () => console.log(`${cfg.name} on :${port}`))
}
