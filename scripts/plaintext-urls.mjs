#!/usr/bin/env node
// Stupid-simple: put bare https:// URLs on Evidence / See Also / Relates lines
// in wiki/pages (source of truth). Also set **Website:** from the first linked
// source page that has **URL:**. Idempotent.
import fs from 'node:fs'
import path from 'node:path'

const PAGES = path.join(new URL('../wiki/pages', import.meta.url).pathname)
const SITE = 'https://greatutah.work'
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

// Seeded from live probes — optional, never invent.
const CAREERS = {
  'qualtrics.md': 'https://www.qualtrics.com/careers/us/en',
  'l3harris-salt-lake.md': 'https://careers.l3harris.com/',
  'imsar.md': 'https://imsar.applicantpro.com/jobs/',
  'fortem-technologies.md':
    'https://recruiting.paylocity.com/recruiting/jobs/All/FORTEM-TECHNOLOGIES',
  'adobe.md': 'https://careers.adobe.com/',
  'recursion-pharmaceuticals.md': 'https://www.recursion.com/careers',
  'podium.md': 'https://www.podium.com/careers/',
  'instructure.md': 'https://www.instructure.com/about/careers',
  'merit-medical.md': 'https://www.merit.com/careers/',
  'familysearch.md': 'https://www.familysearch.org/en/careers/',
  'domo.md': 'https://www.domo.com/company/careers',
  'bamboohr.md': 'https://www.bamboohr.com/careers/',
  'lucid-software.md': 'https://lucid.co/careers',
  'hexcel.md': 'https://www.hexcel.com/careers',
}

const sourceUrl = new Map()
for (const f of fs.readdirSync(PAGES)) {
  if (!f.endsWith('.md')) continue
  const raw = fs.readFileSync(path.join(PAGES, f), 'utf8')
  const m = raw.match(/^\*\*URL:\*\* (\S+)/m)
  if (m && /^https?:\/\//i.test(m[1])) sourceUrl.set(f, m[1])
}

function hardenLine(line) {
  if (!line.includes('](')) return line
  return line.replace(LINK_RE, (full, _text, href) => {
    if (/^https?:\/\//i.test(href)) {
      // External markdown link → also bare URL after it
      if (line.includes(href) && line.split(href).length >= 3) return full
      if (new RegExp(`·\\s*${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(line)) return full
      return `${full} · ${href}`
    }
    const slug = href.replace(/^\.\//, '')
    if (!/^[a-z0-9-]+\.md$/i.test(slug)) return full
    const absWiki = `${SITE}/pages/${slug}`
    const extras = []
    if (!line.includes(absWiki)) extras.push(absWiki)
    const ext = sourceUrl.get(slug)
    if (ext && !line.includes(ext)) extras.push(ext)
    if (!extras.length) return full
    // Avoid double-append if this match already hardened on a prior pass
    if (full.includes(' · http')) return full
    return `${full} · ${extras.join(' · ')}`
  })
}

function hardenSections(raw) {
  let out = raw
  for (const heading of ['Evidence', 'See Also']) {
    const re = new RegExp(`(## ${heading}\\n)([\\s\\S]*?)(?=\\n## |$)`)
    out = out.replace(re, (_, head, body) => {
      const lines = body.split('\n').map((line) => {
        if (/\]\([^)]+\)\s*·\s*https?:\/\//.test(line) && /greatutah\.work\/pages\//.test(line)) {
          return line // already fully hardened
        }
        return hardenLine(line)
      })
      return head + lines.join('\n')
    })
  }
  out = out.replace(/^(\*\*Relates:\*\* .+)$/gm, (line) => {
    if (/\]\([^)]+\)\s*·\s*https?:\/\//.test(line)) return line
    return hardenLine(line)
  })
  return out
}

function firstWebsiteFromPage(raw) {
  const urls = []
  for (const m of raw.matchAll(/\]\(([a-z0-9-]+\.md)\)/gi)) {
    const u = sourceUrl.get(m[1])
    if (u) urls.push(u)
  }
  return urls[0] || ''
}

function upsertMeta(raw, key, value) {
  if (!value) return raw
  const re = new RegExp(`^\\*\\*${key}:\\*\\* .+$`, 'm')
  if (re.test(raw)) {
    return raw.replace(re, `**${key}:** ${value}`)
  }
  // Insert after Region if present, else after Utah Location, else after Type block before Updated
  if (/^\*\*Region:\*\* .+$/m.test(raw)) {
    return raw.replace(/^(\*\*Region:\*\* .+)$/m, `$1\n**${key}:** ${value}`)
  }
  if (/^\*\*Updated:\*\* /m.test(raw)) {
    return raw.replace(/^(\*\*Updated:\*\* )/m, `**${key}:** ${value}\n$1`)
  }
  return raw
}

let nFiles = 0
let nWebsite = 0
let nCareers = 0
for (const f of fs.readdirSync(PAGES)) {
  if (!f.endsWith('.md')) continue
  const fp = path.join(PAGES, f)
  let raw = fs.readFileSync(fp, 'utf8')
  const before = raw
  raw = hardenSections(raw)

  const type = (raw.match(/^\*\*Type:\*\* (.+)$/m) || [])[1]
  if (['venture', 'helper', 'resource', 'work'].includes(type)) {
    if (!/^\*\*Website:\*\* /m.test(raw)) {
      const w = firstWebsiteFromPage(raw)
      if (w) {
        raw = upsertMeta(raw, 'Website', w)
        nWebsite++
      }
    }
    if (CAREERS[f] && !/^\*\*Careers:\*\* /m.test(raw)) {
      raw = upsertMeta(raw, 'Careers', CAREERS[f])
      nCareers++
    }
  }

  if (raw !== before) {
    fs.writeFileSync(fp, raw)
    nFiles++
  }
}

console.log(`plaintext-urls: updated ${nFiles} pages; added Website on ${nWebsite}; Careers on ${nCareers}`)
