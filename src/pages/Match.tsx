import { useParams, Link, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Layout } from '../components/Layout'
import { AskBar } from '../components/AskBar'
import {
  getAllMatches,
  getMatch,
  formatParties,
  rewriteWikiLinks,
  type MatchDoc,
} from '../lib/matches'

/**
 * /match/:slug — render a match brief from `wiki/matches/*.md`.
 *
 * Match pages are the single best Nucleus artifact in the wiki —
 * the one that says "here's why we'd put these two people in a room
 * together" with evidence, risks, and a real next step. They live
 * outside the existing /entry/:source/:slug routing because they
 * aren't part of the bundled wiki index (no tier, no domain).
 *
 * We render the markdown through ReactMarkdown and rewrite the
 * wiki's relative `.md` links so a click on a venture name lands on
 * its app entry instead of dead-ending.
 */

const META_DISPLAY_KEYS = [
  'Strength',
  'Confidence',
  'Status',
  'Updated',
] as const

export function MatchPage() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return <Navigate to="/" replace />

  const doc = getMatch(slug)
  if (!doc) {
    return (
      <Layout backLabel="Home" backTo="/">
        <div className="py-16 text-center">
          <h1 className="font-display text-3xl text-twilight">No such match</h1>
          <p className="font-serif italic text-ink-soft mt-3">
            We don&rsquo;t have that match brief.{' '}
            <Link to="/" className="text-twilight underline italic">
              Browse the guide
            </Link>
            .
          </p>
        </div>
      </Layout>
    )
  }

  return <MatchView doc={doc} />
}

/* The actual rendering, with the non-null match. Split out so the hooks
   don't sit after a conditional return in the route component. */
function MatchView({ doc }: { doc: MatchDoc }) {
  const parties = useMemo(() => formatParties(doc.meta.Parties), [doc.meta.Parties])
  const bodyWithRoutedLinks = useMemo(() => rewriteWikiLinks(doc.body), [doc.body])

  return (
    <Layout backLabel="Back" backTo="/">
      <article className="prose-editorial">
        <header className="mb-6">
          <p className="smallcaps">A match brief</p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-2">
            {doc.title}
          </h1>
          {parties && (
            <p className="font-display italic text-2xl text-twilight leading-snug mt-3">
              {parties}
            </p>
          )}
        </header>

        {/* Metadata strip — same shape as Entry.tsx for visual continuity */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6 text-sm bg-pale-sky/70 rounded-md px-5 py-4 mb-10">
          {META_DISPLAY_KEYS.filter((k) => doc.meta[k]).map((key) => (
            <div key={key}>
              <dt className="smallcaps">{key}</dt>
              <dd className="font-serif text-ink mt-0.5 leading-snug">
                {doc.meta[key]}
              </dd>
            </div>
          ))}
        </dl>

        {/* Why we surface this — the editorial framing the match-page
            schema is the product, not just a one-off card. */}
        <blockquote className="my-10 bg-sky/60 border-l-4 border-twilight rounded-r-md px-6 py-5">
          <p className="smallcaps mb-2">Why we surface this</p>
          <p className="font-serif italic text-ink leading-snug">
            A match is a small, public artifact:{' '}
            <em>
              what each side appears to need, why the fit makes sense,
              what&rsquo;s uncertain, and the single small next step worth
              taking.
            </em>{' '}
            The structure is the product. Other matches in the guide use
            the same one.
          </p>
        </blockquote>

        {/* Body — markdown with wiki-link rewriting */}
        <div className="prose-editorial">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...rest }) => {
                if (href && href.startsWith('/')) {
                  return (
                    <Link to={href} {...(rest as object)}>
                      {children}
                    </Link>
                  )
                }
                return (
                  <a href={href} {...rest}>
                    {children}
                  </a>
                )
              },
              h2: ({ children }) => (
                <h2 className="font-display text-2xl text-twilight mt-10 mb-3">
                  {children}
                </h2>
              ),
            }}
          >
            {bodyWithRoutedLinks}
          </ReactMarkdown>
        </div>
      </article>

      {/* Ask refinement — same pattern as Entry */}
      <section className="mt-16 pt-8 border-t border-sandstone/40">
        <p className="smallcaps mb-3">Ask the guide</p>
        <AskBar />
      </section>

      {/* Other matches — manual cross-links since matches aren't in the
          bundled directory index. */}
      <section className="mt-12">
        <p className="smallcaps mb-3">Other matches in the guide</p>
        <ul>
          {getAllMatches()
            .filter((other) => other.slug !== doc.slug)
            .map((other) => {
              const otherParties = formatParties(other.meta.Parties)
              return (
                <li
                  key={other.slug}
                  className="border-b border-sandstone/30 last:border-b-0 group"
                >
                  <Link to={`/match/${other.slug}`} className="block py-3">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-lg text-ink group-hover:text-twilight transition-colors">
                        {other.title}
                      </span>
                      <span className="smallcaps shrink-0">
                        {other.meta.Strength ?? ''}
                      </span>
                    </div>
                    {otherParties && (
                      <p className="font-serif italic text-ink-soft text-sm mt-0.5">
                        {otherParties}
                      </p>
                    )}
                  </Link>
                </li>
              )
            })}
        </ul>
      </section>
    </Layout>
  )
}
