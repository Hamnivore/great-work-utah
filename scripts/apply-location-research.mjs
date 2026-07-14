#!/usr/bin/env node
// Applies reviewed TSV location research to canonical wiki page metadata.
import fs from 'node:fs'
import path from 'node:path'

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Usage: node scripts/apply-location-research.mjs file.tsv [...]')
  process.exit(1)
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const pagesDir = path.join(root, 'wiki', 'pages')
const seen = new Set()
let changed = 0

for (const input of files) {
  const lines = fs.readFileSync(input, 'utf8').trim().split(/\r?\n/)
  const header = lines.shift().split('\t')
  const expected = ['slug', 'map_location', 'latitude', 'longitude', 'source_url', 'rationale']
  if (header.length !== expected.length || header.some((value, index) => value !== expected[index])) {
    throw new Error(`${input}: expected TSV header ${expected.join(', ')}`)
  }
  for (const [index, line] of lines.entries()) {
    const [slug, mapLocation, latitudeRaw, longitudeRaw, source] = line.split('\t')
    if (!slug || !mapLocation || !latitudeRaw || !longitudeRaw || !source || line.split('\t').length !== 6) {
      throw new Error(`${input}:${index + 2}: incomplete or malformed row`)
    }
    if (seen.has(slug)) throw new Error(`duplicate researched slug: ${slug}`)
    seen.add(slug)
    const latitude = Number(latitudeRaw)
    const longitude = Number(longitudeRaw)
    if (latitude < 36.99 || latitude > 42.01 || longitude < -114.06 || longitude > -109.04) {
      throw new Error(`${slug}: coordinates fall outside Utah`)
    }
    if (!source.startsWith('https://')) throw new Error(`${slug}: source must use HTTPS`)
    const pagePath = path.join(pagesDir, `${slug}.md`)
    let raw = fs.readFileSync(pagePath, 'utf8')
    if (/^\*\*Type:\*\* person$/m.test(raw)) throw new Error(`${slug}: person pages cannot receive exact sites`)
    for (const key of ['Map Location', 'Coordinates', 'Location Precision', 'Location Source']) {
      raw = raw.replace(new RegExp(`^\\*\\*${key}:\\*\\*.*\\n`, 'm'), '')
    }
    const tuple = `**Map Location:** ${mapLocation}\n**Coordinates:** ${latitudeRaw}, ${longitudeRaw}\n**Location Precision:** exact\n**Location Source:** ${source}\n`
    if (!/^\*\*Region:\*\* .+$/m.test(raw)) throw new Error(`${slug}: page has no Region metadata`)
    raw = raw.replace(/^(\*\*Region:\*\* .+\n)/m, `$1${tuple}`)
    raw = raw.replace(/^\*\*Updated:\*\* .+$/m, '**Updated:** 2026-07-14')
    fs.writeFileSync(pagePath, raw)
    changed += 1
  }
}

console.log(`location research: updated ${changed} pages from ${files.length} TSV files`)
