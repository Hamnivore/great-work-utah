import { geocodeUtah } from './_geocode.mjs'

type Req = { method?: string; body?: unknown }
type Res = {
  setHeader(name: string, value: string): void
  status(code: number): Res
  json(data: unknown): void
  end(): void
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Allow', 'POST, OPTIONS')
  res.setHeader('Cache-Control', 'private, no-store')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Use POST.' })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const q = body && typeof body === 'object' && 'q' in body ? (body as { q?: unknown }).q : ''
    res.status(200).json({ ok: true, location: await geocodeUtah(q) })
  } catch (error) {
    res.status(400).json({ ok: false, error: { message: error instanceof Error ? error.message : String(error) } })
  }
}
