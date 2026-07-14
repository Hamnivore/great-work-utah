// Compiles explicitly supplied page coordinates into the public map/proximity feed.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { REGION_ANCHORS, REGION_SOURCE } from './region-anchors.mjs'

const meta = (raw, key) =>
  (raw.match(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'm')) || [])[1]?.trim() || ''

const additionalSites = (raw) => [...raw.matchAll(/^\*\*Additional Map Location:\*\* (.+)$/gm)].map((match) => {
  const [label, coordinates, precision, source] = match[1].split(' | ').map((part) => part.trim())
  return { label, coordinates, precision, source }
})

function siteToFeature({ label, coordinates, precision, source }, context, siteIndex, siteCount) {
  const { file, title, type, region, domains, focus, useRegionalAnchor } = context
  const problems = []
  const parts = coordinates.split(',').map((part) => part.trim())
  const latitude = Number(parts[0])
  const longitude = Number(parts[1])
  if (parts.length !== 2 || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    problems.push('Coordinates must be `latitude, longitude` numbers')
  } else if (latitude < 36.99 || latitude > 42.01 || longitude < -114.06 || longitude > -109.04) {
    problems.push('Coordinates are outside Utah bounds')
  }
  if (!label) problems.push('Map Location is required with Coordinates')
  if (!['exact', 'approximate'].includes(precision)) {
    problems.push('Location Precision must be `exact` or `approximate`')
  }
  try {
    const url = new URL(source)
    if (url.protocol !== 'https:') throw new Error()
  } catch {
    problems.push('Location Source must be a public HTTPS URL')
  }
  if (problems.length) throw new Error(`${file}: ${problems.join('; ')}`)

  const slug = file.replace(/\.md$/, '')
  const coordinateId = `${latitude.toFixed(6)},${longitude.toFixed(6)}`
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [longitude, latitude] },
    properties: {
      title,
      type,
      url: `/pages/${file}`,
      siteId: `${slug}:${coordinateId}`,
      siteIndex,
      siteCount,
      mapLocation: label,
      precision,
      provenance: source,
      anchorKind: useRegionalAnchor ? 'regional' : 'site',
      region,
      domains,
      focus,
    },
  }
}

export function pageToFeatures(raw, file) {
  const type = meta(raw, 'Type')
  if (!['venture', 'person', 'helper', 'resource', 'work'].includes(type)) return []

  const coordinates = meta(raw, 'Coordinates')
  const extras = additionalSites(raw)
  const region = meta(raw, 'Region')
  const regionalAnchor = REGION_ANCHORS[region]
  const useRegionalAnchor = type === 'person' || !coordinates
  if (extras.length && type === 'person') throw new Error(`${file}: person pages cannot publish additional map locations`)
  if (extras.length && !coordinates) throw new Error(`${file}: Additional Map Location requires a primary map tuple`)
  if (useRegionalAnchor && !regionalAnchor) return []

  const title = (raw.match(/^# (.+)$/m) || [, file])[1].trim()
  const label = useRegionalAnchor ? `${region} regional anchor (not a street address)` : meta(raw, 'Map Location')
  const precision = useRegionalAnchor ? 'approximate' : meta(raw, 'Location Precision')
  const source = useRegionalAnchor ? REGION_SOURCE : meta(raw, 'Location Source')
  const focus = meta(raw, 'Focus')
  const domains = meta(raw, 'Domain').split(',').map((value) => value.trim()).filter(Boolean)
  const primary = { label, coordinates: useRegionalAnchor ? regionalAnchor.join(', ') : coordinates, precision, source }
  const sites = [primary, ...extras]
  const labels = new Set()
  const coordinatePairs = new Set()
  for (const site of sites) {
    const labelKey = site.label.trim().toLowerCase().replace(/\s+/g, ' ')
    const [latitude, longitude] = site.coordinates.split(',').map(Number)
    const coordinateKey = `${latitude},${longitude}`
    if (labels.has(labelKey) || coordinatePairs.has(coordinateKey)) {
      throw new Error(`${file}: duplicate map location: ${site.label}`)
    }
    labels.add(labelKey)
    coordinatePairs.add(coordinateKey)
  }
  const context = { file, title, type, region, domains, focus, useRegionalAnchor }
  return sites.map((site, siteIndex) => siteToFeature(site, context, siteIndex, sites.length))
}

export function pageToFeature(raw, file) {
  return pageToFeatures(raw, file)[0] || null
}

export function buildLocations(pagesDirectory) {
  const features = []
  const errors = []
  for (const file of fs.readdirSync(pagesDirectory).sort()) {
    if (!file.endsWith('.md')) continue
    const raw = fs.readFileSync(path.join(pagesDirectory, file), 'utf8')
    try {
      features.push(...pageToFeatures(raw, file))
    } catch (error) {
      errors.push(error.message)
    }
  }
  if (errors.length) throw new Error(`Invalid location metadata:\n- ${errors.join('\n- ')}`)
  return { type: 'FeatureCollection', features }
}

export function run({ pagesDirectory, outputFile, moduleOutputFile, check = false }) {
  const content = `${JSON.stringify(buildLocations(pagesDirectory), null, 2)}\n`
  const moduleContent = `// Generated by scripts/build-locations.mjs; do not edit.\nexport default ${content}`
  if (check) {
    if (!fs.existsSync(outputFile) || fs.readFileSync(outputFile, 'utf8') !== content) {
      throw new Error(`locations are STALE - run: node scripts/build-locations.mjs`)
    }
    if (moduleOutputFile && (!fs.existsSync(moduleOutputFile) || fs.readFileSync(moduleOutputFile, 'utf8') !== moduleContent)) {
      throw new Error(`location API data are STALE - run: node scripts/build-locations.mjs`)
    }
    console.log('locations are fresh')
    return
  }
  fs.writeFileSync(outputFile, content)
  if (moduleOutputFile) fs.writeFileSync(moduleOutputFile, moduleContent)
  console.log(`locations: ${JSON.parse(content).features.length} points -> ${outputFile}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
  try {
    run({
      pagesDirectory: path.join(root, 'wiki', 'pages'),
      outputFile: path.join(root, 'public', 'locations.geojson'),
      moduleOutputFile: path.join(root, 'api', '_locations-data.mjs'),
      check: process.argv.includes('--check'),
    })
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
