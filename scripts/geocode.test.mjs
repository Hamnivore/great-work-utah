import assert from 'node:assert/strict'
import test from 'node:test'
import { geocodeUtah } from '../api/_geocode.mjs'

const response = (candidates, ok = true) => ({ ok, json: async () => ({ candidates }) })

test('geocodes a Utah address without retaining it', async () => {
  let requested = ''
  const location = await geocodeUtah('  84101  ', async (url) => {
    requested = url
    return response([{ address: '84101, Salt Lake City, Utah', score: 100, location: { x: -111.8975, y: 40.7584 } }])
  })
  assert.deepEqual(location, { label: '84101, Salt Lake City, Utah', latitude: 40.7584, longitude: -111.8975 })
  assert.match(requested, /SingleLine=84101/)
  assert.match(requested, /forStorage=false/)
})

test('rejects weak or out-of-state matches', async () => {
  await assert.rejects(() => geocodeUtah('Denver', async () => response([
    { address: 'Denver, Colorado', score: 100, location: { x: -104.99, y: 39.74 } },
  ])), /not found in Utah/)
  await assert.rejects(() => geocodeUtah('xy', async () => response([])), /address, city, or ZIP/)
})
