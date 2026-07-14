// POST /api/contribute — the wiki's single write endpoint.
// kind=note → GitHub issue (public queue); kind=page → branch + commit + PR.
// Review-gated: nothing publishes without a human merge. No SDK deps, plain fetch.

const REPO = 'Hamnivore/great-work-utah'
const API = 'https://api.github.com'
const VALID_TYPES = ['venture', 'person', 'helper', 'resource', 'work', 'guide', 'source']
const PAGE_PATH_RE = /^pages\/[a-z0-9-]+\.md$/
const NOTE_PATH_RE = /^(pages|views|meta)\/[a-z0-9-]+\.md$/

type Body = {
  kind?: unknown
  path?: unknown
  type?: unknown
  content?: unknown
  reason?: unknown
}

// Minimal request/response shapes for a Vercel Node function (no @vercel/node dep).
type Req = { method?: string; body?: unknown }
type Res = {
  setHeader(name: string, value: string): void
  status(code: number): Res
  json(data: unknown): void
  end(): void
}

// Reports every problem in one pass so a confused agent converges in one round trip.
function validate(body: Body): { error?: string; kind?: 'note' | 'page' } {
  const { kind, path, type, content } = body
  const errors: string[] = []
  if (kind !== 'note' && kind !== 'page') {
    errors.push('"kind" must be "note" or "page".')
  }
  if (kind === 'page') {
    if (typeof path !== 'string' || !PAGE_PATH_RE.test(path)) {
      errors.push('"path" must match pages/{slug}.md (lowercase letters, digits, hyphens).')
    }
  } else if (kind === 'note') {
    if (typeof path !== 'string' || !NOTE_PATH_RE.test(path)) {
      errors.push(
        '"path" for notes must match pages/{slug}.md, views/{name}.md, or meta/{doc}.md (lowercase letters, digits, hyphens).',
      )
    }
  } else if (typeof path !== 'string') {
    errors.push('"path" must be a string.')
  }
  if (typeof content !== 'string') {
    errors.push('"content" must be a string.')
  } else if (kind === 'note') {
    if (content.length < 15 || content.length > 2000) {
      errors.push(`Note content must be 15–2000 characters (got ${content.length}).`)
    }
  } else if (kind === 'page') {
    if (content.length <= 200) {
      errors.push(`Page content must be over 200 characters (got ${content.length}) — send a full page, or send a note instead.`)
    }
  }
  if (kind === 'page' && (typeof type !== 'string' || !VALID_TYPES.includes(type))) {
    errors.push(`"type" must be one of: ${VALID_TYPES.join(', ')} (required for pages; ignored for notes).`)
  }
  if (errors.length) return { error: errors.join(' ') }
  return { kind: kind as 'note' | 'page' }
}

async function gh(token: string, method: string, url: string, payload?: unknown) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'greatutah-work-contribute',
    },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  })
  const data: unknown = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data: data as Record<string, unknown> }
}

async function createNote(token: string, path: string, content: string, reason: string) {
  const payload = {
    title: `note: ${path}`,
    body: `${content}\n\n---\n**Reason:** ${reason || '(none given)'}\n*Submitted via /api/contribute*`,
  }
  // Try with the label; if the label doesn't exist or can't be set, retry without.
  let res = await gh(token, 'POST', `/repos/${REPO}/issues`, { ...payload, labels: ['wiki-note'] })
  if (!res.ok) {
    res = await gh(token, 'POST', `/repos/${REPO}/issues`, payload)
  }
  if (!res.ok) throw new Error(`GitHub issue creation failed (${res.status}).`)
  return res.data.html_url as string
}

async function createPagePR(
  token: string,
  path: string,
  type: string,
  content: string,
  reason: string,
) {
  const slug = path.replace(/^pages\//, '').replace(/\.md$/, '')
  const branch = `contrib/${slug}-${Date.now()}`

  const ref = await gh(token, 'GET', `/repos/${REPO}/git/ref/heads/main`)
  if (!ref.ok) throw new Error(`Could not read main branch (${ref.status}).`)
  const sha = (ref.data.object as { sha: string }).sha

  const mkBranch = await gh(token, 'POST', `/repos/${REPO}/git/refs`, {
    ref: `refs/heads/${branch}`,
    sha,
  })
  if (!mkBranch.ok) throw new Error(`Could not create branch (${mkBranch.status}).`)

  // URL path is pages/<slug>.md; the repo path is wiki/pages/<slug>.md.
  const commit = await gh(token, 'PUT', `/repos/${REPO}/contents/wiki/${path}`, {
    message: `contrib: ${path} (${type})`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch,
  })
  if (!commit.ok) throw new Error(`Could not commit file (${commit.status}).`)

  const pr = await gh(token, 'POST', `/repos/${REPO}/pulls`, {
    title: `contrib: ${path}`,
    head: branch,
    base: 'main',
    body: `**Type:** ${type}\n**Reason:** ${reason || '(none given)'}\n\nSubmitted via /api/contribute — review before merge.`,
  })
  if (!pr.ok) throw new Error(`Could not open pull request (${pr.status}).`)
  return pr.data.html_url as string
}

export default async function handler(req: Req, res: Res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Use POST with a JSON body.' })
    return
  }

  // req.body is a getter that throws before we run if the JSON is malformed —
  // access it inside try/catch so agents get a real error body, not an empty 400.
  const jsonShape =
    'Send Content-Type: application/json with a body like {"kind":"note","path":"pages/example.md","content":"at least 15 chars"} (notes may also target views/{name}.md or meta/{doc}.md)'
  let raw: unknown
  try {
    raw = req.body
  } catch {
    res.status(400).json({ ok: false, error: `Body must be valid JSON. ${jsonShape}` })
    return
  }
  let body: Body
  if (typeof raw === 'string') {
    if (!raw.trim()) {
      res.status(400).json({
        ok: false,
        error: `Empty body — set Content-Type: application/json and send a JSON object. ${jsonShape}`,
      })
      return
    }
    try {
      body = JSON.parse(raw) as Body
    } catch {
      res.status(400).json({ ok: false, error: `Body must be valid JSON. ${jsonShape}` })
      return
    }
  } else if (raw && typeof raw === 'object') {
    body = raw as Body
  } else {
    res.status(400).json({
      ok: false,
      error: `Body missing or not a JSON object — set Content-Type: application/json. ${jsonShape}`,
    })
    return
  }

  const { error, kind } = validate(body)
  if (error) {
    res.status(400).json({ ok: false, error })
    return
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    res.status(503).json({
      ok: false,
      error:
        'Contribution intake is temporarily offline (server is missing its GitHub credential). Your draft was valid — please retry later.',
    })
    return
  }

  const path = body.path as string
  const content = body.content as string
  const reason = typeof body.reason === 'string' ? body.reason : ''

  try {
    const url =
      kind === 'note'
        ? await createNote(token, path, content, reason)
        : await createPagePR(token, path, body.type as string, content, reason)
    res.status(200).json({ ok: true, url })
  } catch (e) {
    res.status(502).json({ ok: false, error: e instanceof Error ? e.message : String(e) })
  }
}
