import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { ExternalLink, LocateFixed, MapPin, RotateCcw } from 'lucide-react'
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

const PLACES = ['All Utah', 'Salt Lake City', 'Provo', 'Ogden', 'St. George', 'Logan', 'Lehi', 'Park City', 'Moab', 'Cedar City', 'Milford']
const TYPE_LABELS: Record<string, string> = { all: 'All', venture: 'Ventures', person: 'People', resource: 'Resources', helper: 'Helpers', work: 'Work' }
const escapeAttribute = (value: string) => value.replace(/[&"<>]/g, (character) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[character] || character)

function FitResults({ results }: { results: LocationResult[] }) {
  const map = useMap()
  useEffect(() => {
    if (!results.length) return
    if (results.length === 1) {
      map.setView([results[0].location.latitude, results[0].location.longitude], 11)
      return
    }
    map.fitBounds(results.map((result) => [result.location.latitude, result.location.longitude]), { padding: [32, 32], maxZoom: 11 })
  }, [map, results])
  return null
}

export function MapPage() {
  const [response, setResponse] = useState<LocationResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('all')
  const [precision, setPrecision] = useState('all')
  const [place, setPlace] = useState('All Utah')
  const [radius, setRadius] = useState('50')
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
    if (precision !== 'all' && result.location.precision !== precision) return false
    return true
  }), [response, type, precision])

  const searchPlace = () => {
    if (place === 'All Utah') return load()
    load(`&near=${encodeURIComponent(place)}&radius_miles=${radius}`)
  }

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Location access is not available in this browser.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => load(`&lat=${coords.latitude}&lon=${coords.longitude}&radius_miles=${radius}`),
      () => {
        setLoading(false)
        setError('Location access was unavailable. Choose a Utah place instead.')
      },
      { enableHighAccuracy: false, timeout: 8000 },
    )
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

      <div className="map-toolbar mb-4 flex flex-wrap items-end gap-3 border-y border-sandstone/40 py-3">
        <label className="grid gap-1 text-xs font-medium text-twilight-soft">
          Near
          <select value={place} onChange={(event) => setPlace(event.target.value)}>
            {PLACES.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-twilight-soft">
          Radius
          <select value={radius} onChange={(event) => setRadius(event.target.value)} disabled={place === 'All Utah'}>
            <option value="15">15 miles</option>
            <option value="35">35 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </label>
        <button type="button" className="map-command" onClick={searchPlace}>
          <MapPin size={16} /> Show
        </button>
        <button type="button" className="map-icon-button" onClick={useMyLocation} title="Use my location" aria-label="Use my location">
          <LocateFixed size={17} />
        </button>
        <button type="button" className="map-icon-button" onClick={() => { setPlace('All Utah'); setType('all'); setPrecision('all'); load() }} title="Reset map" aria-label="Reset map">
          <RotateCcw size={17} />
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="map-segments" aria-label="Filter by type">
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={type === value} onClick={() => setType(value)}>{label}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-ink-soft">
          Precision
          <select value={precision} onChange={(event) => setPrecision(event.target.value)}>
            <option value="all">All points</option>
            <option value="exact">Exact sites</option>
            <option value="approximate">Approximate anchors</option>
          </select>
        </label>
      </div>

      {error && <p className="mb-4 border-l-2 border-orange pl-3 text-sm text-ink-soft">{error}</p>}

      <div className="map-layout">
        <div className="map-canvas" aria-label="Map of verified public sites in Utah">
          <MapContainer center={[39.45, -111.8]} zoom={6} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitResults results={results} />
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
                  <a href={result.page}>Open page</a>
                </Popup>
              </Marker>
              )
            })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        <div className="map-results" aria-live="polite">
          <div className="mb-3 flex items-center justify-between text-xs text-ink-soft">
            <span>{loading ? 'Loading sites...' : `${results.length} shown`}</span>
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
                <a href={result.page} className="inline-flex items-center gap-1 text-twilight">Read page <ExternalLink size={12} /></a>
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
