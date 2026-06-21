import type { IncomingMessage, ServerResponse } from 'node:http'
import { auth } from '@trigger.dev/sdk'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405)
    res.end()
    return
  }
  try {
    const token = await auth.createTriggerPublicToken('search-agent')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ token }))
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: String(err) }))
  }
}
