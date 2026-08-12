// Imported explicitly: Vercel type-checks functions without the repo's tsconfig
// `node` types, so the bare globals resolve locally but not in the deploy build.
import { Buffer } from 'node:buffer'
import process from 'node:process'

// POST /api/contribute — the wiki's single write endpoint.
// kind=note → GitHub issue (public queue); kind=page → branch + commit + PR.
// Review-gated: nothing publishes without a human merge. No SDK deps, plain fetch.
//
// Abuse guards (size cap, per-instance rate limit, duplicate suppression, cheap
// content heuristics) live in ./_contribute-guard.mjs, which documents why each
// limit sits where it does. They are tuned to stop scripts without ever blocking
// a well-behaved agent's single note or page.

import {
  MAX_NOTE_CONTENT_CHARS,
  MAX_PAGE_CONTENT_CHARS,
  MIN_NOTE_CONTENT_CHARS,
  MIN_PAGE_CONTENT_CHARS,
  RECENT_SUBMISSIONS,
  REQUEST_LIMIT,
  WRITE_LIMIT,
  clientIp,
  contentIssues,
  fingerprint,
  oversizeError,
  rateLimitError,
} from './_contribute-guard.mjs'

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
  body?: unknown
  note?: unknown
  message?: unknown
  text?: unknown
}

/** Agents (and experiment briefs) often send type/body instead of kind/content — accept both. */
function normalizeContribute(raw: Body): Body {
  const b: Body = { ...raw }

  // { "type": "note"|"page" } used as kind (page "type" field is venture|person|…)
  if (b.kind == null && (b.type === 'note' || b.type === 'page')) {
    b.kind = b.type
    delete b.type
  }

  // content aliases
  if (typeof b.content !== 'string') {
    for (const key of ['body', 'note', 'message', 'text'] as const) {
      if (typeof b[key] === 'string') {
        b.content = b[key]
        break
      }
    }
  }

  // path: allow pages/foo or /pages/foo.md
  if (typeof b.path === 'string') {
    let p = b.path.trim().replace(/^\/+/, '')
    if (p.startsWith('wiki/')) p = p.slice(5)
    if (/^(pages|views|meta)\/[a-z0-9-]+$/i.test(p)) p = `${p}.md`
    b.path = p.toLowerCase()
  }

  return b
}

// Minimal request/response shapes for a Vercel Node function (no @vercel/node dep).
type Req = {
  method?: string
  body?: unknown
  headers?: Record<string, string | string[] | undefined>
}
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
    errors.push(
      '"kind" must be "note" or "page" (also accepted: "type":"note"|"page" as an alias for kind).',
    )
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
    errors.push(
      '"content" must be a string (also accepted: "body", "note", "message", or "text").',
    )
  } else {
    if (kind === 'note') {
      if (content.length < MIN_NOTE_CONTENT_CHARS || content.length > MAX_NOTE_CONTENT_CHARS) {
        errors.push(
          `Note content must be ${MIN_NOTE_CONTENT_CHARS}–${MAX_NOTE_CONTENT_CHARS} characters (got ${content.length}).`,
        )
      }
    } else if (kind === 'page') {
      if (content.length < MIN_PAGE_CONTENT_CHARS) {
        errors.push(`Page content must be over 200 characters (got ${content.length}) — send a full page, or send a note instead.`)
      } else if (content.length > MAX_PAGE_CONTENT_CHARS) {
        errors.push(
          `Page content must be at most ${MAX_PAGE_CONTENT_CHARS} characters (got ${content.length}) — no page in this wiki comes close to that. Split it, or trim to the house format in /meta/conventions.md.`,
        )
      }
    }
    // Structural spam checks join the same error list, so an agent still gets
    // every problem in one response instead of discovering them one at a time.
    errors.push(...contentIssues(content))
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
  // Wildcard CORS is INTENTIONAL and load-bearing: agents post to this endpoint
  // cross-origin from any host, and there is nothing to protect — the endpoint is
  // unauthenticated by design and everything it writes is review-gated. Do not
  // "fix" this to an origin allowlist; it would silently break the funnel.
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

  // Best-effort, per-instance throttle (see _contribute-guard.mjs). Charged
  // before anything else so oversized and malformed floods count too. This tier
  // is deliberately loose: it only catches floods, so an agent iterating toward a
  // valid body is never punished for it.
  const ip = clientIp(req.headers)
  const allowed = REQUEST_LIMIT.take(ip)
  if (!allowed.ok) {
    res.setHeader('Retry-After', String(allowed.retryAfterSeconds))
    res.status(429).json({
      ok: false,
      retryAfterSeconds: allowed.retryAfterSeconds,
      error: rateLimitError(allowed.retryAfterSeconds),
    })
    return
  }

  // Size gate on the Content-Length header alone — this runs before we touch
  // req.body, which is a lazy getter that would parse the whole payload.
  const tooBig = oversizeError(req.headers?.['content-length'])
  if (tooBig) {
    res.status(413).json({ ok: false, error: tooBig.error })
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

  body = normalizeContribute(body)
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
  // Truncated rather than rejected: "reason" is an optional one-liner, so a bloated
  // one is not worth costing someone a real contribution over.
  const reason = typeof body.reason === 'string' ? body.reason.slice(0, 500) : ''

  // Duplicate suppression: an identical (kind + path + content) resubmission gets
  // the original link back instead of opening a second identical issue/PR. The
  // manual promises "resubmission is safe" — this makes that cheap as well as safe.
  const fp = fingerprint(kind as string, path, content)
  const seen = RECENT_SUBMISSIONS.lookup(fp)
  if (seen) {
    res.status(200).json(
      seen.status === 'done'
        ? {
            ok: true,
            duplicate: true,
            url: seen.url,
            message:
              'Identical submission already accepted — returning the original link instead of opening a second one. Nothing further to do.',
          }
        : {
            ok: true,
            duplicate: true,
            status: 'processing',
            message:
              'An identical submission is already being processed. Nothing further to do; the issue or pull request will appear on the repo shortly.',
          },
    )
    return
  }

  // Only submissions that will actually create a GitHub object are charged
  // against the tighter write budget.
  const writeAllowed = WRITE_LIMIT.take(ip)
  if (!writeAllowed.ok) {
    res.setHeader('Retry-After', String(writeAllowed.retryAfterSeconds))
    res.status(429).json({
      ok: false,
      retryAfterSeconds: writeAllowed.retryAfterSeconds,
      error: rateLimitError(writeAllowed.retryAfterSeconds, { write: true }),
    })
    return
  }

  RECENT_SUBMISSIONS.begin(fp)
  try {
    const url =
      kind === 'note'
        ? await createNote(token, path, content, reason)
        : await createPagePR(token, path, body.type as string, content, reason)
    RECENT_SUBMISSIONS.complete(fp, url)
    res.status(200).json({ ok: true, url })
  } catch (e) {
    // Forget failures so a retry after a GitHub outage is not mistaken for a
    // duplicate — "resubmission is safe" has to stay literally true.
    RECENT_SUBMISSIONS.forget(fp)
    res.status(502).json({ ok: false, error: e instanceof Error ? e.message : String(e) })
  }
}
