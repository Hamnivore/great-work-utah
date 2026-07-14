import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { distanceMiles, searchLocations } from '../api/_location-search.mjs'

const locations = JSON.parse(fs.readFileSync(new URL('../public/locations.geojson', import.meta.url)))

test('distance uses miles and is symmetric', () => {
  const slc = [-111.891, 40.7608]
  const provo = [-111.6585, 40.2338]
  assert.ok(Math.abs(distanceMiles(slc, provo) - 38.3) < 1)
  assert.equal(distanceMiles(slc, provo), distanceMiles(provo, slc))
})

test('proximity results are ordered and radius-filtered', () => {
  const result = searchLocations(locations, { lat: '41.223', lon: '-111.9738', radius_miles: '35' })
  assert.ok(result.results.some((item) => item.title === 'Startup Ogden'))
  assert.ok(result.results[0].location.distanceMiles <= result.results.at(-1).location.distanceMiles)
  assert.ok(result.results.every((item) => item.location.distanceMiles <= 35))
})

test('near resolves common Utah place names without external geocoding', () => {
  const result = searchLocations(locations, { near: 'Milford, Utah', radius_miles: '20', type: 'venture,work' })
  assert.equal(result.query.near, 'milford')
  assert.equal(result.results[0].title, 'Utah FORGE')
  assert.ok(result.results[0].location.distanceMiles > 9)
})

test('text, type, and domain filters compose', () => {
  const result = searchLocations(locations, { q: 'geothermal', type: 'work', domain: 'energy' })
  assert.deepEqual(result.results.map((item) => item.title), ['Utah FORGE'])
})

test('invalid parameters return actionable errors', () => {
  assert.throws(() => searchLocations(locations, { lat: '40' }), /provided together/)
  assert.throws(() => searchLocations(locations, { lat: '0', lon: '-111' }), /lat.*36.99.*42.01/)
  assert.doesNotThrow(() => searchLocations(locations, { type: 'venture,person' }))
  assert.throws(() => searchLocations(locations, { type: 'guide' }), /unknown value.*Allowed/)
  assert.throws(() => searchLocations(locations, { lng: '-111' }), /Unknown parameter/)
  assert.throws(() => searchLocations(locations, { radius_miles: '10' }), /requires/)
  assert.throws(() => searchLocations(locations, { near: 'Atlantis' }), /Unknown.*Available anchors/)
})

test('catalog response exposes sparse coverage and truncation', () => {
  const result = searchLocations(locations, { limit: '2' }, { baseUrl: 'https://greatutah.work' })
  assert.equal(result.results.length, 2)
  assert.equal(result.coverage.comprehensive, false)
  assert.equal(result.coverage.truncated, true)
  assert.match(result.results[0].page, /^https:\/\/greatutah\.work\/pages\//)
})

test('multi-site pages return distinct results without inflating page coverage', () => {
  const properties = {
    title: 'Campus Program', type: 'resource', url: '/pages/campus-program.md',
    mapLocation: 'Campus', precision: 'exact', provenance: 'https://example.org',
    anchorKind: 'site', region: 'statewide', domains: [], focus: 'founders', siteCount: 2,
  }
  const collection = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-111.65, 40.25] }, properties: { ...properties, siteId: 'campus-program:40.250000,-111.650000', siteIndex: 0 } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-111.97, 41.22] }, properties: { ...properties, siteId: 'campus-program:41.220000,-111.970000', siteIndex: 1 } },
    ],
  }
  const result = searchLocations(collection, { limit: '10' })
  assert.deepEqual(result.results.map((item) => item.id), ['campus-program:40.250000,-111.650000', 'campus-program:41.220000,-111.970000'])
  assert.equal(result.coverage.publishedPoints, 2)
  assert.equal(result.coverage.publishedPages, 1)
  assert.equal(result.coverage.sitePages, 1)
})
