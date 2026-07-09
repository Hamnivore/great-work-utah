// Compares the prototype /api/search (title+focus+summary index) against
// full-text search over the same wiki, for the queries the round-2 agent ran.
import fs from 'node:fs'
import path from 'node:path'

const PROTO = path.dirname(new URL(import.meta.url).pathname)
const WIKI = new URL('../../wiki', import.meta.url).pathname
const INDEX = JSON.parse(fs.readFileSync(path.join(PROTO, 'search-index.json'), 'utf8'))

// identical scoring to server.mjs /api/search
function siteSearch(q) {
  const terms = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  return INDEX.map((p) => {
    const hay = `${p.title} ${p.focus} ${p.summary}`.toLowerCase()
    const title = `${p.title} ${p.focus}`.toLowerCase()
    let score = 0
    for (const t of terms) { if (title.includes(t)) score += 3; else if (hay.includes(t)) score += 1 }
    return { path: p.path, title: p.title, score }
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 20)
}

// full-text: same scoring but over the entire page body
function fullSearch(q) {
  const terms = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  return INDEX.map((p) => {
    const body = fs.readFileSync(path.join(WIKI, p.path.replace(/^wiki\//, '')), 'utf8').toLowerCase()
    const title = `${p.title} ${p.focus}`.toLowerCase()
    let score = 0
    for (const t of terms) { if (title.includes(t)) score += 3; else if (body.includes(t)) score += 1 }
    return { path: p.path, title: p.title, score }
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 20)
}

const queries = [
  'mechanical engineer test engineer drilling medical device',
  'drilling downhole geothermal field operations',
  'surgical stapler medical device test engineer design for manufacturing',
  'hiring drilling engineers',
  'seismic sensors geothermal exploration',
]

for (const q of queries) {
  const s = siteSearch(q)
  const f = fullSearch(q)
  const sSet = new Set(s.map((r) => r.path))
  const onlyFull = f.filter((r) => !sSet.has(r.path))
  console.log(`\nQUERY: ${q}`)
  console.log(`  site top5:  ${s.slice(0, 5).map((r) => r.title).join(' | ')}`)
  console.log(`  full top5:  ${f.slice(0, 5).map((r) => r.title).join(' | ')}`)
  console.log(`  in full-text top20 but MISSING from site top20 (${onlyFull.length}): ${onlyFull.slice(0, 8).map((r) => r.title).join(' | ')}`)
  const rodaS = s.findIndex((r) => r.path.includes('rodatherm'))
  const rodaF = f.findIndex((r) => r.path.includes('rodatherm'))
  console.log(`  rodatherm rank: site=${rodaS < 0 ? 'MISS' : rodaS + 1}, fulltext=${rodaF < 0 ? 'MISS' : rodaF + 1}`)
}

// How much of the corpus is invisible to the summary index?
let idxChars = 0, bodyChars = 0
for (const p of INDEX) {
  idxChars += (p.title + ' ' + p.focus + ' ' + p.summary).length
  bodyChars += fs.readFileSync(path.join(WIKI, p.path.replace(/^wiki\//, '')), 'utf8').length
}
console.log(`\nsummary-index coverage: ${(idxChars / 1024).toFixed(0)}KB of ${(bodyChars / 1024).toFixed(0)}KB corpus = ${(100 * idxChars / bodyChars).toFixed(1)}% of text searchable`)
