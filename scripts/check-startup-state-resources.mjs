#!/usr/bin/env node
// Compare https://startup.utah.gov/resources/ (WP CPT business-resource)
// against wiki/pages Startup State imports. Writes a report under
// research/startup-state/ and exits 1 if new live resources are missing.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'wiki', 'pages')
const OUT_DIR = path.join(ROOT, 'research', 'startup-state')
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** Known slug aliases: live Startup State slug → wiki page stem */
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

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'application/json',
      Referer: 'https://startup.utah.gov/resources/',
    },
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

async function fetchAll(endpoint) {
  const out = []
  for (let page = 1; page <= 30; page++) {
    const chunk = await fetchJson(
      `https://startup.utah.gov/wp-json/wp/v2/${endpoint}?per_page=100&page=${page}`,
    )
    if (!Array.isArray(chunk) || !chunk.length) break
    out.push(...chunk)
    if (chunk.length < 100) break
  }
  return out
}

function stripHtml(s) {
  return String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function wikiIndex() {
  const bySlug = new Map()
  const byCsvId = new Map()
  const stubs = []
  for (const f of fs.readdirSync(PAGES)) {
    if (!f.endsWith('.md')) continue
    const stem = f.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
    const title = (raw.match(/^# (.+)$/m) || [, stem])[1].trim()
    const website = (raw.match(/^\*\*Website:\*\* (.+)$/m) || [])[1] || ''
    const csv =
      (raw.match(/Startup State CSV ID: (\d+)/) || [])[1] ||
      (raw.match(/\*\*Startup State ID:\*\* (\d+)/) || [])[1] ||
      (raw.match(/Startup State ID: (\d+)/) || [])[1]
    const isStub =
      /bulk-imported from the Startup State/i.test(raw) ||
      /Imported Coverage/i.test(raw) ||
      Boolean(csv)
    const rec = { stem, title, website, csvId: csv ? Number(csv) : null, isStub, file: f }
    bySlug.set(stem, rec)
    if (csv) byCsvId.set(Number(csv), rec)
    if (isStub) stubs.push(rec)
  }
  return { bySlug, byCsvId, stubs }
}

function resolveWiki(live, index) {
  if (index.byCsvId.has(live.id)) return index.byCsvId.get(live.id)
  if (index.bySlug.has(live.slug)) return index.bySlug.get(live.slug)
  const alias = ALIASES[live.slug]
  if (alias && index.bySlug.has(alias)) return index.bySlug.get(alias)
  return null
}

/** Normalize for compare: scheme, www, trailing slash, empty query noise */
function normalizeUrl(u) {
  try {
    const url = new URL(String(u || '').trim())
    url.protocol = 'https:'
    url.hostname = url.hostname.replace(/^www\./, '')
    url.hash = ''
    // Drop empty / tracking-ish query noise Startup State sometimes appends
    if (url.search === '?&v=latest' || url.search === '?') url.search = ''
    let s = url.toString().replace(/\/$/, '')
    return s
  } catch {
    return String(u || '')
      .trim()
      .replace(/^http:\/\//i, 'https://')
      .replace(/\/$/, '')
  }
}

function isWebsiteMismatch(wikiWebsite, liveWebsite) {
  if (!wikiWebsite) return true
  if (/startup\.utah\.gov\/resources\/?$/i.test(wikiWebsite)) return true
  return normalizeUrl(wikiWebsite) !== normalizeUrl(liveWebsite)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const [resources, ...taxLists] = await Promise.all([
    fetchAll('business-resource'),
    fetchAll('topic'),
    fetchAll('stage'),
    fetchAll('community'),
    fetchAll('industry'),
    fetchAll('location'),
  ])
  const taxNames = {}
  for (const [name, list] of [
    ['topic', taxLists[0]],
    ['stage', taxLists[1]],
    ['community', taxLists[2]],
    ['industry', taxLists[3]],
    ['location', taxLists[4]],
  ]) {
    taxNames[name] = Object.fromEntries(list.map((t) => [t.id, t.name]))
  }

  const catalog = resources.map((r) => {
    const acf = r.acf || {}
    const mapIds = (ids, tax) => (ids || []).map((id) => taxNames[tax][id] || String(id))
    return {
      id: r.id,
      slug: r.slug,
      title: stripHtml(r.title?.rendered),
      startup_url: r.link,
      website: String(acf.link || '').trim(),
      email: String(acf.email || '').trim(),
      description: stripHtml(acf.description || ''),
      topics: mapIds(acf.topics, 'topic'),
      communities: mapIds(acf.communities, 'community'),
      industries: mapIds(acf.industries, 'industry'),
      locations: mapIds(acf.resource_locations, 'location'),
      stages: mapIds(acf.stages, 'stage'),
      modified: r.modified,
    }
  })

  fs.writeFileSync(path.join(OUT_DIR, 'live-catalog.json'), JSON.stringify(catalog, null, 2))
  fs.writeFileSync(path.join(OUT_DIR, 'taxonomies.json'), JSON.stringify(taxNames, null, 2))

  const index = wikiIndex()
  const missing = []
  const matched = []
  const websiteWrong = []
  for (const live of catalog) {
    const wiki = resolveWiki(live, index)
    if (!wiki) {
      missing.push(live)
      continue
    }
    matched.push({ live, wiki })
    if (live.website && isWebsiteMismatch(wiki.website, live.website)) {
      websiteWrong.push({ stem: wiki.stem, wikiWebsite: wiki.website, liveWebsite: live.website })
    }
  }

  const liveIds = new Set(catalog.map((c) => c.id))
  const liveSlugs = new Set(catalog.map((c) => c.slug))
  const matchedStems = new Set(matched.map((m) => m.wiki.stem))
  const orphanStubs = index.stubs.filter((s) => {
    if (matchedStems.has(s.stem)) return false
    if (s.csvId && liveIds.has(s.csvId)) return false
    if (liveSlugs.has(s.stem)) return false
    return true
  })

  const report = {
    checked_at: new Date().toISOString(),
    live_count: catalog.length,
    wiki_stubs: index.stubs.length,
    matched: matched.length,
    missing_on_wiki: missing.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      website: m.website,
      startup_url: m.startup_url,
    })),
    orphan_wiki_stubs: orphanStubs.map((s) => ({
      stem: s.stem,
      csvId: s.csvId,
      title: s.title,
    })),
    website_mismatches: websiteWrong.length,
    website_mismatch_sample: websiteWrong.slice(0, 25),
  }

  fs.writeFileSync(path.join(OUT_DIR, 'coverage-report.json'), JSON.stringify(report, null, 2))

  let md = `# Startup State resource coverage\n\n`
  md += `Checked: ${report.checked_at}\n\n`
  md += `| | count |\n|---|---:|\n`
  md += `| Live on startup.utah.gov | ${report.live_count} |\n`
  md += `| Wiki Startup State stubs | ${report.wiki_stubs} |\n`
  md += `| Matched | ${report.matched} |\n`
  md += `| **Missing on wiki** | **${missing.length}** |\n`
  md += `| Wiki stubs not on live list | ${orphanStubs.length} |\n`
  md += `| Website field mismatches / placeholders | ${websiteWrong.length} |\n\n`

  if (missing.length) {
    md += `## Missing on wiki (add these)\n\n`
    for (const m of missing) {
      md += `- **${m.title}** · live slug \`${m.slug}\` · id ${m.id}\n`
      md += `  - Startup State: ${m.startup_url}\n`
      if (m.website) md += `  - Website: ${m.website}\n`
    }
    md += `\n`
  }
  if (orphanStubs.length) {
    md += `## Wiki stubs not on current live list\n\n`
    for (const s of orphanStubs) {
      md += `- \`${s.stem}.md\` (CSV ID ${s.csvId ?? '?'}) — ${s.title}\n`
    }
    md += `\n`
  }
  md += `Catalog: \`research/startup-state/live-catalog.json\`\n`
  md += `Re-run: \`node scripts/check-startup-state-resources.mjs\`\n`
  fs.writeFileSync(path.join(OUT_DIR, 'coverage-report.md'), md)

  console.log(md)
  if (missing.length && process.argv.includes('--strict')) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
