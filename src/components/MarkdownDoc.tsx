import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Resolve a markdown href relative to the current doc's virtual path
 *  (e.g. "views/index.md") and return an internal route, a raw path,
 *  or null for external/anchor links. */
function resolveHref(href: string, docPath: string): string | null {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('#')) return null
  const resolved = new URL(href, `https://x.invalid/${docPath}`).pathname
  const m = resolved.match(/^\/(pages|views)\/([a-z0-9-]+)\.md$/)
  if (m) return m[1] === 'pages' ? `/p/${m[2]}` : `/v/${m[2]}`
  return resolved // /meta/*.md etc — served as static files
}

function DocLink({
  href,
  docPath,
  children,
}: {
  href?: string
  docPath: string
  children?: ReactNode
}) {
  const target = href ? resolveHref(href, docPath) : null
  if (target && (target.startsWith('/p/') || target.startsWith('/v/'))) {
    return <Link to={target}>{children}</Link>
  }
  const external = href && /^https?:/i.test(href)
  return (
    <a href={target ?? href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {children}
    </a>
  )
}

/** Split leading `**Key:** value` metadata lines out of the markdown body. */
function splitMetadata(raw: string): { meta: [string, string][]; body: string } {
  const lines = raw.split('\n')
  const meta: [string, string][] = []
  const body: string[] = []
  let inHeader = true
  for (const line of lines) {
    if (inHeader) {
      const m = line.match(/^\*\*([A-Za-z][A-Za-z -]*):\*\*\s*(.+)$/)
      if (m) {
        meta.push([m[1], m[2]])
        continue
      }
      // The H1 and blank lines may precede/interleave the header block;
      // any other content line ends it.
      if (line.trim() !== '' && !line.startsWith('# ')) inHeader = false
    }
    body.push(line)
  }
  return { meta, body: body.join('\n') }
}

export function MarkdownDoc({ docPath }: { docPath: string }) {
  // Keyed by docPath so a route change shows "Loading…" without a reset in the effect.
  const [state, setState] = useState<{ docPath: string; raw?: string; error?: string } | null>(
    null,
  )

  useEffect(() => {
    let alive = true
    fetch(`/${docPath}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
        return r.text()
      })
      .then((raw) => {
        // Missing files may return the custom 404 HTML page.
        if (raw.trimStart().startsWith('<!doctype') || raw.trimStart().startsWith('<')) {
          throw new Error('not found')
        }
        if (alive) setState({ docPath, raw })
      })
      .catch((e: Error) => {
        if (alive) setState({ docPath, error: e.message })
      })
    window.scrollTo(0, 0)
    return () => {
      alive = false
    }
  }, [docPath])

  useEffect(() => {
    const current = state && state.docPath === docPath ? state : null
    if (current?.error) {
      document.title = '404 — Great Work — Utah'
      return
    }
    if (!current?.raw) return
    const h1 = current.raw.match(/^# (.+)$/m)?.[1]?.trim()
    document.title = h1 ? `${h1} — Great Work — Utah` : 'Great Work — Utah'
    return () => {
      document.title = 'Great Work — Utah'
    }
  }, [state, docPath])

  const current = state && state.docPath === docPath ? state : null

  if (current?.error) {
    return (
      <div className="font-sans text-sm text-ink-soft">
        <p>
          404 — couldn't load <code>/{docPath}</code>. Don't guess slugs.
        </p>
        <p className="mt-2">
          <a href="/llms.txt" className="text-twilight">
            /llms.txt
          </a>
          {' · '}
          <a href="/views/index.md" className="text-twilight">
            /views/index.md
          </a>
          {' · '}
          <Link to="/" className="text-twilight">
            index
          </Link>
        </p>
      </div>
    )
  }
  if (!current?.raw) return <div className="font-sans text-sm text-ink-soft">Loading…</div>

  const { meta, body } = splitMetadata(current.raw)
  const components = {
    a: (props: { href?: string; children?: ReactNode }) => (
      <DocLink href={props.href} docPath={docPath}>
        {props.children}
      </DocLink>
    ),
  }

  const pull = meta.find(([k]) => k === 'Pull')?.[1]

  return (
    <article>
      {pull && (
        <p className="mb-4 font-display text-lg text-twilight-soft">
          <ReactMarkdown
            components={components}
            allowedElements={['a', 'em', 'strong', 'code']}
            unwrapDisallowed
          >
            {pull}
          </ReactMarkdown>
        </p>
      )}
      {meta.length > 0 && (
        <dl className="doc-meta mb-6 border-y border-sandstone/40 py-3 font-sans text-xs text-ink-soft">
          {meta
            .filter(([k]) => !['Hero', 'Hero caption', 'Pull'].includes(k))
            .map(([k, v]) => (
              <div key={k} className="flex gap-2 py-0.5">
                <dt className="w-28 shrink-0 font-medium text-twilight-soft">{k}</dt>
                <dd className="doc-meta-value min-w-0">
                  <ReactMarkdown
                    components={components}
                    allowedElements={['a', 'em', 'strong', 'code']}
                    unwrapDisallowed
                  >
                    {v}
                  </ReactMarkdown>
                </dd>
              </div>
            ))}
        </dl>
      )}
      <div className="doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {body}
        </ReactMarkdown>
      </div>
    </article>
  )
}
