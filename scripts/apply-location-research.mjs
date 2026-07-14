#!/usr/bin/env node
// Applies reviewed TSV location research to canonical wiki page metadata.
import fs from 'node:fs'
import path from 'node:path'

const replace = process.argv.includes('--replace')
const files = process.argv.slice(2).filter((argument) => argument !== '--replace')
if (!files.length) {
  console.error('Usage: node scripts/apply-location-research.mjs file.tsv [...]')
  process.exit(1)
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const pagesDir = path.join(root, 'wiki', 'pages')
const researched = new Map()
let changed = 0
const sameSite = (left, right) => left.mapLocation.trim().toLowerCase() === right.mapLocation.trim().toLowerCase()
  || (Number(left.latitudeRaw) === Number(right.latitudeRaw) && Number(left.longitudeRaw) === Number(right.longitudeRaw))

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
    const latitude = Number(latitudeRaw)
    const longitude = Number(longitudeRaw)
    if (latitude < 36.99 || latitude > 42.01 || longitude < -114.06 || longitude > -109.04) {
      throw new Error(`${slug}: coordinates fall outside Utah`)
    }
    if (!source.startsWith('https://')) throw new Error(`${slug}: source must use HTTPS`)
    const sites = researched.get(slug) || []
    const candidate = { mapLocation, latitudeRaw, longitudeRaw, source }
    if (sites.some((site) => sameSite(site, candidate))) {
      throw new Error(`${input}:${index + 2}: duplicate site for ${slug}`)
    }
    sites.push(candidate)
    researched.set(slug, sites)
  }
}

for (const [slug, sites] of researched) {
  const pagePath = path.join(pagesDir, `${slug}.md`)
  let raw = fs.readFileSync(pagePath, 'utf8')
  if (/^\*\*Type:\*\* person$/m.test(raw)) throw new Error(`${slug}: person pages cannot receive exact sites`)
  const existing = []
  const existingLabel = raw.match(/^\*\*Map Location:\*\* (.+)$/m)?.[1]?.trim()
  const existingCoordinates = raw.match(/^\*\*Coordinates:\*\* (.+)$/m)?.[1]?.trim()
  const existingPrecision = raw.match(/^\*\*Location Precision:\*\* (.+)$/m)?.[1]?.trim()
  const existingSource = raw.match(/^\*\*Location Source:\*\* (.+)$/m)?.[1]?.trim()
  if (!replace && existingLabel && existingCoordinates && existingPrecision === 'exact' && existingSource) {
    const [latitudeRaw, longitudeRaw] = existingCoordinates.split(',').map((value) => value.trim())
    existing.push({ mapLocation: existingLabel, latitudeRaw, longitudeRaw, source: existingSource })
    for (const match of raw.matchAll(/^\*\*Additional Map Location:\*\* (.+)$/gm)) {
      const [mapLocation, coordinates, precision, source] = match[1].split(' | ').map((value) => value.trim())
      if (precision !== 'exact') continue
      const [latitudeRaw, longitudeRaw] = coordinates.split(',').map((value) => value.trim())
      existing.push({ mapLocation, latitudeRaw, longitudeRaw, source })
    }
  }
  const mergedSites = [...existing]
  for (const site of sites) {
    if (!mergedSites.some((candidate) => sameSite(candidate, site))) {
      mergedSites.push(site)
    }
  }
  for (const key of ['Map Location', 'Coordinates', 'Location Precision', 'Location Source', 'Additional Map Location']) {
    raw = raw.replace(new RegExp(`^\\*\\*${key}:\\*\\*.*\\n`, 'gm'), '')
  }
  const [primary, ...additional] = mergedSites
  const tuple = `**Map Location:** ${primary.mapLocation}\n**Coordinates:** ${primary.latitudeRaw}, ${primary.longitudeRaw}\n**Location Precision:** exact\n**Location Source:** ${primary.source}\n`
    + additional.map((site) => `**Additional Map Location:** ${site.mapLocation} | ${site.latitudeRaw}, ${site.longitudeRaw} | exact | ${site.source}\n`).join('')
  if (!/^\*\*Region:\*\* .+$/m.test(raw)) throw new Error(`${slug}: page has no Region metadata`)
  raw = raw.replace(/^(\*\*Region:\*\* .+\n)/m, `$1${tuple}`)
  raw = raw.replace(/^\*\*Updated:\*\* .+$/m, '**Updated:** 2026-07-14')
  fs.writeFileSync(pagePath, raw)
  changed += 1
}

const siteCount = [...researched.values()].reduce((sum, sites) => sum + sites.length, 0)
console.log(`location research: updated ${changed} pages with ${siteCount} public sites from ${files.length} TSV files`)
