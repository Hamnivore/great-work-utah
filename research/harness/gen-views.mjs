// E9: generates views from real page metadata (**Domain:**, **Region:**, **Needs-reviewed:**)
// where present, and measures disagreement between attributed metadata and the
// keyword classifier from gen-hierarchies.mjs. Output: ./views/
import fs from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const WIKI = new URL('../../wiki', import.meta.url).pathname
const OUT = path.join(HERE, 'views')
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

const CATS = ['ventures', 'people', 'helpers', 'resources', 'work']
const meta = (raw, key) => (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1] || ''
const section = (raw, name) => (raw.match(new RegExp(`## ${name}\\s+([\\s\\S]*?)(?=\\n## |$)`)) || [])[1]?.trim() || ''
const clip = (t, n = 150) => { const s = (t || '').replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1) + '…' }

// keyword classifier (same rules as gen-hierarchies.mjs) for comparison
const KW = {
  'energy': /geotherm|energy|solar|nuclear|battery|grid|power|hydrogen|drilling|oil|gas|fuel|storage|electr/i,
}

const pages = []
for (const cat of CATS) {
  const dir = path.join(WIKI, cat)
  if (!fs.existsSync(dir)) continue
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const domainLine = meta(raw, 'Domain')
    pages.push({
      cat, url: `/wiki/${cat}/${f}`,
      title: (raw.match(/^# (.+)$/m) || [, f])[1].trim(),
      focus: meta(raw, 'Focus'),
      region: meta(raw, 'Region'),
      needsReviewed: meta(raw, 'Needs-reviewed'),
      domains: domainLine ? domainLine.split(',').map((s) => s.trim().toLowerCase()) : null, // [0] = primary
      needs: clip(section(raw, 'What They Need Now'), 180),
      summary: clip(section(raw, 'Summary'), 150),
      kwEnergy: KW.energy.test(`${(raw.match(/^# (.+)$/m) || [, f])[1]} ${meta(raw, 'Focus')} ${section(raw, 'Summary')}`),
    })
  }
}

const attributed = pages.filter((p) => p.domains)
console.log(`attributed pages: ${attributed.length}`)

// ---- disagreement: keyword classifier vs attributed metadata (energy) ----
const attrEnergy = attributed.filter((p) => p.domains.includes('energy'))
const attrEnergyPrimary = attributed.filter((p) => p.domains[0] === 'energy')
const kwSaysEnergy = attributed.filter((p) => p.kwEnergy)
const falsePos = attributed.filter((p) => p.kwEnergy && !p.domains.includes('energy'))
const falseNeg = attributed.filter((p) => !p.kwEnergy && p.domains.includes('energy'))
const primaryDisagree = attributed.filter((p) => p.kwEnergy && p.domains.includes('energy') && p.domains[0] !== 'energy')
console.log(`of attributed: metadata says energy(any)=${attrEnergy.length} (primary=${attrEnergyPrimary.length}); keyword says energy=${kwSaysEnergy.length}`)
console.log(`keyword false-positives (kw=yes, metadata=no): ${falsePos.length} → ${falsePos.map((p) => p.title).join(' | ')}`)
console.log(`keyword false-negatives (kw=no, metadata=yes): ${falseNeg.length} → ${falseNeg.map((p) => p.title).join(' | ')}`)
console.log(`kw can't rank: energy-secondary pages kw counts as full members: ${primaryDisagree.length} → ${primaryDisagree.map((p) => p.title).join(' | ')}`)

// ---- energy hub from metadata ----
let hub = `# Energy — sector hub\n\nGenerated from page metadata (\`**Domain:**\` headers). Primary members listed fully; pages whose primary is another sector appear under "Also relevant."\n`
const prim = attrEnergyPrimary
const sec = attrEnergy.filter((p) => p.domains[0] !== 'energy')
for (const [label, sel] of [['Players', prim.filter((p) => p.cat === 'ventures')], ['Proof it can be done here', prim.filter((p) => p.cat === 'work')], ['People', prim.filter((p) => p.cat === 'people')]]) {
  if (!sel.length) continue
  hub += `\n## ${label}\n\n`
  for (const p of sel) hub += `- [${p.title}](${p.url})${p.region ? ` · ${p.region}` : ''} · ${clip(p.focus || p.summary, 100)}\n`
}
hub += `\n## Who they need right now\n\n`
for (const p of prim.filter((x) => x.needs)) hub += `- [${p.title}](${p.url}): ${p.needs}${p.needsReviewed ? ` *(reviewed ${p.needsReviewed})*` : ''}\n`
if (sec.length) {
  hub += `\n## Also relevant (primary domain elsewhere)\n\n`
  for (const p of sec) hub += `- [${p.title}](${p.url}) — primary: ${p.domains[0]}${p.region ? ` · ${p.region}` : ''}\n`
}
fs.writeFileSync(path.join(OUT, 'energy.md'), hub)

// ---- region index from metadata ----
let reg = `# By region (attributed pages)\n\n`
const byRegion = {}
for (const p of attributed) if (p.region) (byRegion[p.region] ||= []).push(p)
for (const [r, sel] of Object.entries(byRegion).sort()) {
  reg += `\n## ${r}\n\n`
  for (const p of sel) reg += `- [${p.title}](${p.url}) · ${p.domains.join(', ')}\n`
}
fs.writeFileSync(path.join(OUT, 'by-region.md'), reg)

console.log(`views written: energy.md (${(fs.statSync(path.join(OUT, 'energy.md')).size / 1024).toFixed(1)}KB), by-region.md`)
