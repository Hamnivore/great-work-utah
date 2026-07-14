const EARTH_RADIUS_MILES = 3958.7613
const MAX_RADIUS_MILES = 500
const MAX_LIMIT = 50
import UTAH_PLACES from './_utah-places.mjs'

const ALLOWED_PARAMS = new Set(['q', 'near', 'lat', 'lon', 'radius_miles', 'limit', 'type', 'domain', 'precision'])
const PAGE_TYPES = new Set(['venture', 'helper', 'resource', 'work'])
const DOMAINS = new Set(['energy', 'health-bio', 'aerospace-defense', 'computing', 'materials-mfg', 'space-science', 'capital-programs', 'culture-place'])

const radians = (degrees) => degrees * Math.PI / 180
const single = (value) => Array.isArray(value) ? value[0] : value

export function distanceMiles([longitudeA, latitudeA], [longitudeB, latitudeB]) {
  const latitudeDelta = radians(latitudeB - latitudeA)
  const longitudeDelta = radians(longitudeB - longitudeA)
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(radians(latitudeA)) * Math.cos(radians(latitudeB))
    * Math.sin(longitudeDelta / 2) ** 2
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function numberParam(query, name, { min, max, fallback, integer = false }) {
  const raw = single(query[name])
  if (raw == null || raw === '') return fallback
  const value = Number(raw)
  if (!Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) {
    throw new Error(`"${name}" must be ${integer ? 'an integer' : 'a number'} from ${min} to ${max}.`)
  }
  return value
}

function facet(raw, allowed, name) {
  const values = String(single(raw) || '').split(',').map((value) => value.trim().toLowerCase()).filter(Boolean)
  const invalid = values.filter((value) => !allowed.has(value))
  if (invalid.length) throw new Error(`"${name}" contains unknown value(s): ${invalid.join(', ')}. Allowed: ${[...allowed].sort().join(', ')}.`)
  return values
}

export function searchLocations(collection, rawQuery = {}, { baseUrl = '' } = {}) {
  const unknown = Object.keys(rawQuery).filter((name) => !ALLOWED_PARAMS.has(name))
  if (unknown.length) throw new Error(`Unknown parameter(s): ${unknown.join(', ')}. Allowed: ${[...ALLOWED_PARAMS].join(', ')}.`)

  const q = String(single(rawQuery.q) || '').trim().toLowerCase().replace(/\s+/g, ' ')
  const qTokens = q.split(' ').filter(Boolean)
  const near = String(single(rawQuery.near) || '').trim().toLowerCase().replace(/,?\s+ut(?:ah)?$/i, '').trim()
  const latitudeRaw = single(rawQuery.lat)
  const longitudeRaw = single(rawQuery.lon)
  if (near && latitudeRaw != null) throw new Error('Use either "near" or "lat"/"lon", not both.')
  if ((latitudeRaw == null) !== (longitudeRaw == null)) throw new Error('"lat" and "lon" must be provided together.')
  if (single(rawQuery.radius_miles) != null && latitudeRaw == null && !near) throw new Error('"radius_miles" requires "near" or "lat" and "lon".')
  const placeCoordinates = near ? UTAH_PLACES[near] : null
  if (near && !placeCoordinates) {
    throw new Error(`Unknown "near" place: ${single(rawQuery.near)}. Available anchors: ${[...new Set(Object.keys(UTAH_PLACES).filter((name) => !name.includes('.')))].sort().join(', ')}. Use lat/lon for other Utah places.`)
  }

  const origin = placeCoordinates ? [placeCoordinates[1], placeCoordinates[0]] : latitudeRaw == null ? null : [
    numberParam(rawQuery, 'lon', { min: -114.06, max: -109.04 }),
    numberParam(rawQuery, 'lat', { min: 36.99, max: 42.01 }),
  ]
  const radius = numberParam(rawQuery, 'radius_miles', { min: 0.1, max: MAX_RADIUS_MILES, fallback: null })
  const limit = numberParam(rawQuery, 'limit', { min: 1, max: MAX_LIMIT, fallback: 10, integer: true })
  const types = facet(rawQuery.type, PAGE_TYPES, 'type')
  const domains = facet(rawQuery.domain, DOMAINS, 'domain')
  const precision = facet(rawQuery.precision, new Set(['exact', 'approximate']), 'precision')

  const results = collection.features.flatMap((feature) => {
    const { properties, geometry } = feature
    if (types.length && !types.includes(properties.type)) return []
    if (domains.length && !domains.some((value) => properties.domains.includes(value))) return []
    if (precision.length && !precision.includes(properties.precision)) return []
    const haystack = [properties.title, properties.url, properties.mapLocation, properties.region, properties.focus, properties.type, ...properties.domains]
      .join(' ').toLowerCase().replace(/\s+/g, ' ')
    if (qTokens.some((token) => !haystack.includes(token))) return []
    const fullDistance = origin ? distanceMiles(origin, geometry.coordinates) : null
    if (fullDistance != null && radius != null && fullDistance > radius) return []
    return [{
      title: properties.title,
      type: properties.type,
      page: `${baseUrl}${properties.url}`,
      focus: properties.focus,
      region: properties.region,
      domains: properties.domains,
      location: {
        label: properties.mapLocation,
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
        precision: properties.precision,
        distanceMiles: fullDistance == null ? null : Math.round(fullDistance * 100) / 100,
        provenance: properties.provenance,
      },
      _distance: fullDistance,
    }]
  })

  results.sort((a, b) => origin
    ? a._distance - b._distance || a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    : a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
  const returned = results.slice(0, limit).map(({ _distance, ...result }) => result)
  const hasApproximate = returned.some((result) => result.location.precision === 'approximate')

  return {
    query: {
      q: q || null,
      near: near || null,
      latitude: origin?.[1] ?? null,
      longitude: origin?.[0] ?? null,
      radiusMiles: radius,
      types,
      domains,
      precision,
      limit,
      originPrecision: near ? 'approximate civic-center anchor' : origin ? 'user-supplied coordinates' : null,
    },
    coverage: {
      publishedPoints: collection.features.length,
      matchedPoints: results.length,
      returnedPoints: returned.length,
      truncated: results.length > returned.length,
      comprehensive: false,
      note: `Sparse, curated public-site coverage only. Absence does not mean an organization or service is absent nearby. People, residences, private workplaces, statewide-only services, ambiguous addresses, and unverified locations are omitted.${hasApproximate ? ' Distances to approximate points are distances to area anchors, not buildings.' : ''}`,
    },
    results: returned,
  }
}
