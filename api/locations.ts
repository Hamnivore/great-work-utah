import locations from './_locations-data.mjs'
import { searchLocations } from './_location-search.mjs'

type Req = {
  method?: string
  query?: Record<string, string | string[] | undefined>
  headers?: { host?: string; 'x-forwarded-proto'?: string }
}
type Res = {
  setHeader(name: string, value: string): void
  status(code: number): Res
  json(data: unknown): void
  end(): void
}

export default function handler(req: Req, res: Res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Allow', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Use GET. See /llms.txt for examples.' })
    return
  }
  try {
    const protocol = req.headers?.['x-forwarded-proto'] || 'https'
    const host = req.headers?.host || 'greatutah.work'
    res.status(200).json({ ok: true, ...searchLocations(locations, req.query, { baseUrl: `${protocol}://${host}` }) })
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: { code: 'INVALID_QUERY', message: error instanceof Error ? error.message : String(error) },
      example: '/api/locations?lat=40.7608&lon=-111.8910&radius_miles=50&type=resource',
    })
  }
}
