#!/usr/bin/env node
// Apply confirmed Startup State (GOEO) listing data onto matching wiki pages:
// fix Website, replace stub Summary with live description, set Focus from topics,
// refresh Imported Coverage. Does not invent Careers. Idempotent-ish.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const CATALOG = path.join(ROOT, 'research', 'startup-state', 'live-catalog.json')

const ALIASES = {
  score: 'score-utah',
  'small-business-development-center-sbdc': 'utah-sbdc',
  'small-business-administration-sba': 'sba-utah-district-office',
  'startup-state': 'startup-state-resource-list',
  'five-county-association-of-governments-2': 'five-county-association-of-governments',
  'bear-river-association-of-governments-2': 'bear-river-association-of-governments',
  'utah-league-of-cities-towns-ulct': 'utah-league-of-cities-and-towns-ulct',
  'edc-utah-economic-development-corporation-of-utah':
    'edcutah-economic-development-corporation-of-utah',
  'utah-governors-office-of-economic-opportunity':
    'utah-governor-s-office-of-economic-opportunity',
  'wasatch-womens-business-alliance': 'wasatch-women-s-business-alliance',
  'whats-up-down-south-economic-summit': 'event-what-s-up-down-south-economic-summit',
  'silicon-slopes-tech-summit': 'event-silicon-slopes-tech-summit',
  'one-utah-summit': 'event-one-utah-summit',
  'business-forward': 'event-business-forward',
  'mountain-west-capital-network': 'event-mountain-west-capital-network',
  'utah-tech-week': 'event-utah-tech-week',
  'sillicon-slopes': 'silicon-slopes',
  'utahs-own-local-food-production': 'utah-s-own-local-food-production',
  'utah-department-of-agriculture-food': 'utah-department-of-agriculture-and-food',
  '47g-utah-aerospace-defense-association': '47g-utah-aerospace-and-defense-association',
  'southern-utah-university-cedar-city-business-innovation-center':
    'southern-utah-university-cedar-city-business-and-innovation-center',
  'southern-utah-university-suu-larry-h-gail-miller-center-for-entrepreneurship':
    'southern-utah-university-suu-larry-h-and-gail-miller-center-for-entrepreneurship',
}

function ensureCatalog() {
  if (!fs.existsSync(CATALOG)) {
    execFileSync('node', [path.join(ROOT, 'scripts', 'check-startup-state-resources.mjs')], {
      stdio: 'inherit',
    })
  }
}

function upsertMeta(raw, key, value) {
  if (!value) return raw
  const re = new RegExp(`^\\*\\*${key}:\\*\\* .+$`, 'm')
  if (re.test(raw)) return raw.replace(re, `**${key}:** ${value}`)
  if (/^\*\*Region:\*\* .+$/m.test(raw)) {
    return raw.replace(/^(\*\*Region:\*\* .+)$/m, `$1\n**${key}:** ${value}`)
  }
  if (/^\*\*Updated:\*\* /m.test(raw)) {
    return raw.replace(/^(\*\*Updated:\*\* )/m, `**${key}:** ${value}\n$1`)
  }
  return raw
}

function replaceSectionBody(raw, heading, body) {
  const re = new RegExp(`(## ${heading}\\n\\n)([\\s\\S]*?)(?=\\n## |$)`)
  if (!re.test(raw)) return raw
  return raw.replace(re, `$1${body.trim()}\n\n`)
}

function findWikiFile(live, byCsvId, byStem) {
  if (byCsvId.has(live.id)) return byCsvId.get(live.id)
  if (byStem.has(live.slug)) return byStem.get(live.slug)
  const alias = ALIASES[live.slug]
  if (alias && byStem.has(alias)) return byStem.get(alias)
  return null
}

ensureCatalog()
const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'))
const byStem = new Map()
const byCsvId = new Map()
for (const f of fs.readdirSync(PAGES)) {
  if (!f.endsWith('.md')) continue
  const fp = path.join(PAGES, f)
  const raw = fs.readFileSync(fp, 'utf8')
  const stem = f.replace(/\.md$/, '')
  byStem.set(stem, fp)
  const m = raw.match(/Startup State CSV ID: (\d+)/)
  if (m) byCsvId.set(Number(m[1]), fp)
}

const today = new Date().toISOString().slice(0, 10)
let updated = 0
for (const live of catalog) {
  const fp = findWikiFile(live, byCsvId, byStem)
  if (!fp) continue
  let raw = fs.readFileSync(fp, 'utf8')
  const before = raw
  const isStub = /bulk-imported from the Startup State/i.test(raw)

  if (live.website) {
    raw = upsertMeta(raw, 'Website', live.website)
  }

  // Prefer topic tags for Focus (not polluted industry laundry list)
  if (live.topics?.length) {
    raw = upsertMeta(raw, 'Focus', live.topics.join(', '))
  }

  if (isStub && live.description && live.description.length > 40) {
    const summary = `${live.description}

This page was originally bulk-imported from the Startup State resource CSV. Summary text above was refreshed from the live Startup State listing (${today}); verify details on the provider's official site before strong recommendations.`
    raw = replaceSectionBody(raw, 'Summary', summary)
    raw = upsertMeta(raw, 'Status', 'Draft')
    raw = upsertMeta(raw, 'Confidence', 'Medium')
  }

  if (live.email || live.website) {
    const accessBits = []
    if (live.website) accessBits.push(`- [Official website](${live.website}) · ${live.website}`)
    if (live.email) accessBits.push(`- Email: [${live.email}](mailto:${live.email})`)
    accessBits.push(
      `- Startup State listing: ${live.startup_url}`,
    )
    const access = `Start with the official website, then confirm current programs before recommending.

${accessBits.join('\n')}`
    raw = replaceSectionBody(raw, 'How To Access It', access)
  }

  if (raw.includes('## Imported Coverage')) {
    const cov = `- Startup State ID: ${live.id} (slug \`${live.slug}\`)
- Topics: ${live.topics?.join(', ') || '—'}
- Stages: ${live.stages?.join(', ') || '—'}
- Communities: ${live.communities?.join(', ') || '—'}
- Industries: ${live.industries?.join(', ') || '—'}
- Locations: ${live.locations?.join(', ') || '—'}
- Listing modified: ${live.modified || '—'}`
    raw = replaceSectionBody(raw, 'Imported Coverage', cov)
  }

  raw = upsertMeta(raw, 'Updated', today)

  if (raw !== before) {
    fs.writeFileSync(fp, raw)
    updated++
  }
}

console.log(`sync-startup-state: updated ${updated} pages from live catalog`)
