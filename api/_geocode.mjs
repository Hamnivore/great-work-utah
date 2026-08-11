const ENDPOINT = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'
const UTAH_BOUNDS = { south: 36.99, north: 42.01, west: -114.06, east: -109.04 }

export async function geocodeUtah(query, fetchImpl = fetch) {
  const value = String(query || '').trim().replace(/\s+/g, ' ')
  if (value.length < 3 || value.length > 200) throw new Error('Enter a Utah address, city, or ZIP code.')

  const params = new URLSearchParams({
    SingleLine: value,
    f: 'json',
    outSR: '4326',
    maxLocations: '5',
    forStorage: 'false',
    sourceCountry: 'USA',
    searchExtent: `${UTAH_BOUNDS.west},${UTAH_BOUNDS.south},${UTAH_BOUNDS.east},${UTAH_BOUNDS.north}`,
  })
  const response = await fetchImpl(`${ENDPOINT}?${params}`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('Location lookup is temporarily unavailable.')
  const body = await response.json()
  const match = (body.candidates || []).find(({ location, score }) =>
    score >= 70
    && location?.y >= UTAH_BOUNDS.south && location.y <= UTAH_BOUNDS.north
    && location?.x >= UTAH_BOUNDS.west && location.x <= UTAH_BOUNDS.east)
  if (!match) throw new Error('That location was not found in Utah. Try a full address, city, or 5-digit ZIP code.')
  return { label: match.address, latitude: match.location.y, longitude: match.location.x }
}
