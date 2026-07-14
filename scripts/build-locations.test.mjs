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
    anchorKind: 'site',
    region: 'Provo', domains: ['energy', 'materials-mfg'], focus: 'energy storage',
  })
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
