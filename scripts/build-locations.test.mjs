import assert from 'node:assert/strict'
import test from 'node:test'
import { pageToFeature } from './build-locations.mjs'

const page = (extra, type = 'venture') => `# Example\n\n**Type:** ${type}\n**Focus:** energy storage\n**Domain:** energy, materials-mfg\n**Region:** Provo\n${extra}\n`

test('emits GeoJSON longitude first with precision and provenance', () => {
  const feature = pageToFeature(page(`**Map Location:** Public lab, Provo\n**Coordinates:** 40.2518, -111.6493\n**Location Precision:** exact\n**Location Source:** https://example.org/contact`), 'example.md')
  assert.deepEqual(feature.geometry, { type: 'Point', coordinates: [-111.6493, 40.2518] })
  assert.deepEqual(feature.properties, {
    title: 'Example', type: 'venture', url: '/pages/example.md',
    mapLocation: 'Public lab, Provo', precision: 'exact',
    provenance: 'https://example.org/contact',
    region: 'Provo', domains: ['energy', 'materials-mfg'], focus: 'energy storage',
  })
})

test('does not emit person points', () => {
  const feature = pageToFeature(page(`**Coordinates:** 40, -111`, 'person'), 'person.md')
  assert.equal(feature, null)
})

test('ignores pages without explicit coordinates', () => {
  assert.equal(pageToFeature(page('**Region:** Provo'), 'example.md'), null)
})

test('rejects malformed or incomplete coordinate metadata', () => {
  assert.throws(
    () => pageToFeature(page(`**Map Location:** Provo\n**Coordinates:** 140, -111\n**Location Precision:** city\n**Location Source:** private notes`), 'bad.md'),
    /outside Utah.*exact.*public HTTPS/,
  )
})
