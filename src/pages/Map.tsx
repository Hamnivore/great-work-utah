import { useEffect, useMemo, useState, type FormEvent } from 'react'
import L from 'leaflet'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { ExternalLink, LocateFixed, Search, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'

type LocationResult = {
  id: string
  title: string
  type: string
  page: string
  focus: string
  region: string
  domains: string[]
  location: {
    label: string
    latitude: number
    longitude: number
    precision: 'exact' | 'approximate'
    distanceMiles: number | null
    provenance: string
    anchorKind: 'site' | 'regional'
    siteIndex: number
    siteCount: number
  }
}

type LocationResponse = {
  ok: boolean
  coverage: {
    publishedPoints: number
    publishedPages: number
    sitePoints: number
    sitePages: number
    regionalPoints: number
    regionalPages: number
    matchedPoints: number
    comprehensive: boolean
    note: string
  }
  results: LocationResult[]
}

type Origin = { label: string; latitude: number; longitude: number }

const TYPE_LABELS: Record<string, string> = { all: 'All', venture: 'Ventures', person: 'People', resource: 'Resources', helper: 'Helpers', work: 'Work' }
const escapeAttribute = (value: string) => value.replace(/[&"<>]/g, (character) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[character] || character)
const humanPageUrl = (page: string) => page.replace(/^(https?:\/\/[^/]+)?\/pages\/([a-z0-9-]+)\.md$/, '$1/p/$2')

function FitResults({ results, origin }: { results: LocationResult[]; origin: Origin | null }) {
  const map = useMap()
  useEffect(() => {
    if (!results.length && origin) {
      map.setView([origin.latitude, origin.longitude], 10)
      return
    }
    if (!results.length) return
    if (results.length === 1) {
      map.setView([results[0].location.latitude, results[0].location.longitude], 11)
      return
    }
    const points = results.map((result) => [result.location.latitude, result.location.longitude] as [number, number])
    if (origin) points.push([origin.latitude, origin.longitude])
    map.fitBounds(points, { padding: [32, 32], maxZoom: 11 })
  }, [map, origin, results])
  return null
}

export function MapPage() {
  const [response, setResponse] = useState<LocationResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [type, setType] = useState('all')
  const [locationQuery, setLocationQuery] = useState('')
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [radius, setRadius] = useState(35)
  const [selected, setSelected] = useState<string | null>(null)

  const load = (query = '') => {
    setLoading(true)
    setError('')
    fetch(`/api/locations?limit=1000${query}`)
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error?.message || `${res.status} ${res.statusText}`)
        return body as LocationResponse
      })
      .then(setResponse)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    fetch('/api/locations?limit=1000')
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error?.message || `${res.status} ${res.statusText}`)
        return body as LocationResponse
      })
      .then((body) => { if (active) setResponse(body) })
      .catch((reason: Error) => { if (active) setError(reason.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const results = useMemo(() => (response?.results || []).filter((result) => {
    if (type !== 'all' && result.type !== type) return false
    if (origin && result.location.distanceMiles != null && result.location.distanceMiles > radius) return false
    return true
  }), [origin, radius, response, type])

  const applyOrigin = (next: Origin) => {
    setOrigin(next)
    setLocationQuery(next.label)
    load(`&lat=${next.latitude}&lon=${next.longitude}`)
  }

  const searchLocation = async (event: FormEvent) => {
    event.preventDefault()
    const q = locationQuery.trim()
    if (!q) {
      setError('Enter a Utah address, city, or ZIP code.')
      return
    }
    setLocating(true)
    setError('')
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || 'Location lookup failed.')
      applyOrigin(body.location as Origin)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setLocating(false)
    }
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        applyOrigin({ label: 'Your location', latitude: coords.latitude, longitude: coords.longitude })
        setLocating(false)
      },
      () => {
        setLocating(false)
        setError('Location access was unavailable. Enter an address, city, or ZIP code instead.')
      },
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }

  const clearOrigin = () => {
    setOrigin(null)
    setLocationQuery('')
    setRadius(35)
    setSelected(null)
    load()
  }

  return (
    <div className="map-page font-sans">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-twilight">Work across Utah</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {response ? `${response.coverage.publishedPages} mapped pages · ${response.coverage.sitePoints} public sites · ${response.coverage.regionalPages} regional anchors` : 'Public sites and regional anchors'}
          </p>
        </div>
        <a href="/contribute" className="text-xs text-twilight underline decoration-twilight/30 underline-offset-2">
          Correct or remove a location
        </a>
      </div>

      <div className="map-toolbar mb-4 border-y border-sandstone/40 py-3">
        <form className="map-location-search" onSubmit={searchLocation}>
          <label htmlFor="map-origin">Distance from</label>
          <div className="map-location-field">
            <Search size={17} aria-hidden="true" />
            <input id="map-origin" value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} placeholder="Address, city, or ZIP code" autoComplete="postal-code" />
            {origin && <button type="button" onClick={clearOrigin} title="Clear location" aria-label="Clear location"><X size={16} /></button>}
          </div>
          <button type="submit" className="map-command" disabled={locating}>{locating ? 'Finding…' : 'Find'}</button>
          <button type="button" className="map-command map-locate" onClick={useMyLocation} disabled={locating}>
            <LocateFixed size={16} /> Use my location
          </button>
        </form>
        {origin && (
          <div className="map-radius">
            <label htmlFor="map-radius">Within <strong>{radius} miles</strong></label>
            <input id="map-radius" type="range" min="5" max="150" step="5" value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
            <span>5</span><span>150 mi</span>
          </div>
        )}
        <p className="map-location-note">Your search is sent to Esri to find a point; greatutah.work does not save it.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="map-segments" aria-label="Filter by type">
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{label}</button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 border-l-2 border-orange pl-3 text-sm text-ink-soft">{error}</p>}

      <div className="map-layout">
        <div className="map-canvas" aria-label="Map of verified public sites in Utah">
          <MapContainer center={[39.45, -111.8]} zoom={6} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitResults results={results} origin={origin} />
            {origin && (
              <CircleMarker center={[origin.latitude, origin.longitude]} radius={8} pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#27231f', fillOpacity: 1 }}>
                <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>{origin.label}</Tooltip>
              </CircleMarker>
            )}
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={46}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom
              iconCreateFunction={(cluster: { getChildCount(): number; getAllChildMarkers(): Array<{ options: { title?: string } }> }) => {
                const count = cluster.getChildCount()
                const size = count >= 100 ? 44 : count >= 10 ? 38 : 32
                const names = cluster.getAllChildMarkers().map((marker) => marker.options.title).filter(Boolean).slice(0, 4)
                const title = `${count} map points${names.length ? ` including ${names.join(', ')}` : ''}; click to expand`
                return L.divIcon({
                  html: `<span title="${escapeAttribute(title)}">${count}</span>`,
                  className: 'location-cluster',
                  iconSize: L.point(size, size),
                })
              }}
            >
            {results.map((result) => {
              const regional = result.location.anchorKind === 'regional'
              const icon = L.divIcon({
                html: '<span></span>',
                className: `location-marker ${regional ? 'regional' : 'site'}${selected === result.id ? ' selected' : ''}`,
                iconSize: L.point(18, 18),
                iconAnchor: L.point(9, 9),
              })
              return (
              <Marker
                key={result.id}
                position={[result.location.latitude, result.location.longitude]}
                icon={icon}
                title={result.title}
                eventHandlers={{ click: () => setSelected(result.id) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
                  <strong>{result.title}</strong><br />
                  <span>{result.location.label}</span>
                </Tooltip>
                <Popup>
                  <strong>{result.title}</strong><br />
                  {result.location.label}<br />
                  <a href={humanPageUrl(result.page)}>Open page</a>
                </Popup>
              </Marker>
              )
            })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        <div className="map-results" aria-live="polite">
          <div className="mb-3 flex items-center justify-between text-xs text-ink-soft">
            <span>{loading ? 'Loading sites...' : origin ? `${results.length} within ${radius} miles` : `${results.length} statewide`}</span>
            <span><i className="map-dot exact" /> public site <i className="map-dot approximate ml-2" /> regional</span>
          </div>
          {!loading && results.map((result) => (
            <article key={result.id} className={`map-result ${selected === result.id ? 'selected' : ''}`} onMouseEnter={() => setSelected(result.id)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase text-twilight-soft">{result.type} · {result.region}</p>
                  <h2 className="mt-1 font-display text-lg leading-tight text-twilight">{result.title}</h2>
                </div>
                {result.location.distanceMiles != null && <strong className="whitespace-nowrap text-xs text-ink-soft">{result.location.distanceMiles} mi</strong>}
              </div>
              <p className="mt-2 text-sm leading-snug text-ink-soft">{result.focus}</p>
              <p className="mt-2 text-xs leading-snug text-ink-soft">{result.location.label}</p>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <a href={humanPageUrl(result.page)} className="inline-flex items-center gap-1 text-twilight">Read page <ExternalLink size={12} /></a>
                <a href={result.location.provenance} target="_blank" rel="noreferrer" className="text-twilight-soft">Location source</a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {response && <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink-soft">{response.coverage.note}</p>}
    </div>
  )
}
