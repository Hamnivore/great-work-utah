// Generates: digest.md (title + summary of every page, for prototype F),
// search-index.json (for prototype D), and flat-index.md (for prototype B).
import fs from 'node:fs'
import path from 'node:path'

const WIKI = new URL('../../wiki', import.meta.url).pathname
const OUT = path.dirname(new URL(import.meta.url).pathname)
const CATS = ['ventures', 'people', 'helpers', 'resources', 'work', 'guides', 'matches', 'answers', 'sources']

const pages = []
for (const cat of CATS) {
  const dir = path.join(WIKI, cat)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const title = (raw.match(/^# (.+)$/m) || [, f.replace('.md', '')])[1].trim()
    const meta = {}
    for (const m of raw.matchAll(/^\*\*([A-Za-z ]+):\*\* (.+)$/gm)) meta[m[1].toLowerCase()] = m[2].trim()
    let summary = ''
    const sm = raw.match(/## Summary\s+([\s\S]*?)(?=\n#|\n\*\*|$)/)
    if (sm) summary = sm[1].trim().split(/\n\s*\n/)[0].replace(/\s+/g, ' ')
    if (!summary) {
      const body = raw.replace(/^# .+$/m, '').replace(/^\*\*[^\n]+$/gm, '')
      summary = (body.trim().split(/\n\s*\n/)[0] || '').replace(/\s+/g, ' ').slice(0, 300)
    }
    pages.push({ cat, slug: f.replace('.md', ''), path: `wiki/${cat}/${f}`, title, summary, focus: meta['focus'] || '', status: meta['status'] || '' })
  }
}

let digest = `# Great Utah Work — Full Digest\n\nEvery page in the wiki, summarized. Fetch the listed path for any full page.\n`
let cur = ''
for (const p of pages) {
  if (p.cat !== cur) { cur = p.cat; digest += `\n\n## ${cur} \n` }
  digest += `\n### ${p.title}\n/${p.path}${p.focus ? ` — ${p.focus}` : ''}\n${p.summary}\n`
}
fs.writeFileSync(path.join(OUT, 'digest.md'), digest)

fs.writeFileSync(path.join(OUT, 'search-index.json'), JSON.stringify(pages))

let flat = ''
cur = ''
for (const p of pages) {
  if (p.cat !== cur) { cur = p.cat; flat += `\n## ${cur}\n\n` }
  const desc = (p.focus || p.summary).slice(0, 140)
  flat += `- [${p.title}](/${p.path}) — ${desc}\n`
}
fs.writeFileSync(path.join(OUT, 'flat-index.md'), flat)

console.log(`pages: ${pages.length}, digest: ${(digest.length / 1024).toFixed(0)}KB, flat: ${(flat.length / 1024).toFixed(0)}KB`)
