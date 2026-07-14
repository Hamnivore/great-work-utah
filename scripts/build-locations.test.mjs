import assert from 'node:assert/strict'
import test from 'node:test'
import { pageToFeature, pageToFeatures } from './build-locations.mjs'

const page = (extra, type = 'venture') => `# Example\n\n**Type:** ${type}\n**Focus:** energy storage\n**Domain:** energy, materials-mfg\n**Region:** Provo\n${extra}\n`

test('emits GeoJSON longitude first with precision and provenance', () => {
  const feature = pageToFeature(page(`**Map Location:** Public lab, Provo\n**Coordinates:** 40.2518, -111.6493\n**Location Precision:** exact\n**Location Source:** https://example.org/contact`), 'example.md')
  assert.deepEqual(feature.geometry, { type: 'Point', coordinates: [-111.6493, 40.2518] })
  assert.deepEqual(feature.properties, {
    title: 'Example', type: 'venture', url: '/pages/example.md',
    mapLocation: 'Public lab, Provo', precision: 'exact',
    provenance: 'https://example.org/contact',
    anchorKind: 'site',
    siteId: 'example:40.251800,-111.649300', siteIndex: 0, siteCount: 1,
    region: 'Provo', domains: ['energy', 'materials-mfg'], focus: 'energy storage',
  })
})

test('emits every documented public site for a multi-site page', () => {
  const features = pageToFeatures(page(`**Map Location:** Main lab, Provo\n**Coordinates:** 40.2518, -111.6493\n**Location Precision:** exact\n**Location Source:** https://example.org/main\n**Additional Map Location:** Ogden lab, 100 Main St, Ogden, UT | 41.223, -111.9738 | exact | https://example.org/ogden`), 'example.md')
  assert.equal(features.length, 2)
  assert.deepEqual(features.map((feature) => feature.properties.siteId), ['example:40.251800,-111.649300', 'example:41.223000,-111.973800'])
  assert.deepEqual(features.map((feature) => feature.properties.siteCount), [2, 2])
  assert.deepEqual(features[1].geometry.coordinates, [-111.9738, 41.223])
})

test('site IDs remain stable when additional sites are reordered', () => {
  const primary = `**Map Location:** Main lab, Provo\n**Coordinates:** 40.2518, -111.6493\n**Location Precision:** exact\n**Location Source:** https://example.org/main`
  const ogden = `**Additional Map Location:** Ogden lab | 41.223, -111.9738 | exact | https://example.org/ogden`
  const logan = `**Additional Map Location:** Logan lab | 41.736, -111.834 | exact | https://example.org/logan`
  const first = pageToFeatures(page(`${primary}\n${ogden}\n${logan}`), 'example.md').map((feature) => feature.properties.siteId).sort()
  const second = pageToFeatures(page(`${primary}\n${logan}\n${ogden}`), 'example.md').map((feature) => feature.properties.siteId).sort()
  assert.deepEqual(first, second)
})

test('rejects duplicate and orphaned additional sites', () => {
  const duplicate = page(`**Map Location:** Main lab\n**Coordinates:** 40.2518, -111.6493\n**Location Precision:** exact\n**Location Source:** https://example.org/main\n**Additional Map Location:** Duplicate lab | 40.251800, -111.649300 | exact | https://example.org/duplicate`)
  assert.throws(() => pageToFeatures(duplicate, 'duplicate.md'), /duplicate map location/)
  assert.throws(() => pageToFeatures(page(`**Additional Map Location:** Ogden lab | 41.223, -111.9738 | exact | https://example.org/ogden`), 'orphan.md'), /requires a primary/)
})

test('downgrades person coordinates to a coarse regional anchor', () => {
  const feature = pageToFeature(page(`**Coordinates:** 40.2518, -111.6493`, 'person'), 'person.md')
  assert.equal(feature.properties.anchorKind, 'regional')
  assert.equal(feature.properties.precision, 'approximate')
  assert.deepEqual(feature.geometry.coordinates, [-111.6585, 40.2338])
})

test('emits regional anchors for pages without explicit coordinates', () => {
  const feature = pageToFeature(page(''), 'example.md')
  assert.equal(feature.properties.anchorKind, 'regional')
})

test('rejects malformed or incomplete coordinate metadata', () => {
  assert.throws(
    () => pageToFeature(page(`**Map Location:** Provo\n**Coordinates:** 140, -111\n**Location Precision:** city\n**Location Source:** private notes`), 'bad.md'),
    /outside Utah.*exact.*public HTTPS/,
  )
})
