import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Layout } from '../components/Layout'
import { TierMark } from '../components/TierMark'
import { AskBar } from '../components/AskBar'
import { getEntry, getRelated } from '../lib/data'
import type { Source, Section } from '../lib/types'

const PULL_QUOTE_HEADINGS = ['Why it matters', 'Why it mattered', 'Mission', 'What it was']

function pickPullQuote(sections: Section[]): { heading: string; body: string } | undefined {
  for (const heading of PULL_QUOTE_HEADINGS) {
    const found = sections.find((s) => s.heading.toLowerCase() === heading.toLowerCase())
    if (found?.body) return found
  }
  return undefined
}

const META_DISPLAY_KEYS = [
  'Tier',
  'Domain',
  'Type',
  'Stage',
  'Era',
  'HQ',
  'Location',
  'Founded',
  'Website',
] as const

export function EntryPage() {
  const params = useParams<{ source: Source; slug: string }>()
  const source = params.source
  const slug = params.slug
  if (!source || !slug) return <Navigate to="/" replace />

  const entry = getEntry(source, slug)
  if (!entry) {
    return (
      <Layout backLabel="Home" backTo="/">
        <div className="py-16 text-center">
          <h1 className="font-display text-3xl text-twilight">Not in the guide yet</h1>
          <p className="font-serif italic text-ink-soft mt-3">
            We don&rsquo;t have an entry for that one.{' '}
            <Link to="/" className="text-twilight underline italic">
              Browse the guide
            </Link>
            .
          </p>
        </div>
      </Layout>
    )
  }

  const pullQuote = pickPullQuote(entry.sections)
  const otherSections = entry.sections.filter((s) => s !== pullQuote)
  const related = getRelated(entry)

  return (
    <Layout backLabel="Back" backTo="/">
      <article className="prose-editorial">
        {/* Title block */}
        <header className="mb-6">
          <p className="smallcaps">
            {entry.domain}
            {entry.source === 'great_work' ? ' · history' : ''}
          </p>
          <div className="flex items-start justify-between gap-6 mt-2">
            <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
              {entry.title}
              {entry.isStarred && <span className="text-orange"> ⭐</span>}
            </h1>
            <div className="shrink-0 pt-2">
              <TierMark tier={entry.tier} size="lg" />
            </div>
          </div>
        </header>

        {/* Metadata strip — sits in a cool inset block */}
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm bg-pale-sky/70 rounded-md px-5 py-4 mb-10">
          {META_DISPLAY_KEYS.filter((k) => entry.meta[k]).map((key) => (
            <div key={key}>
              <dt className="smallcaps">{key}</dt>
              <dd className="font-serif text-ink mt-0.5 leading-snug">
                <ReactMarkdown>{entry.meta[key]}</ReactMarkdown>
              </dd>
            </div>
          ))}
        </dl>

        {/* Pull quote (Why it matters) — saturated cool inset */}
        {pullQuote && (
          <blockquote className="my-10 bg-sky/60 border-l-4 border-twilight rounded-r-md px-6 py-5">
            <p className="smallcaps mb-2">{pullQuote.heading}</p>
            <p className="font-display italic text-2xl sm:text-3xl text-twilight leading-snug">
              {firstSentence(pullQuote.body)}
            </p>
            {restOfBody(pullQuote.body) && (
              <div className="font-serif text-ink mt-4 prose-editorial [&_p]:mb-2 last:[&_p]:mb-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{restOfBody(pullQuote.body)!}</ReactMarkdown>
              </div>
            )}
          </blockquote>
        )}

        {/* Remaining sections */}
        {otherSections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-2xl text-twilight mb-3">{section.heading}</h2>
            <div className="prose-editorial">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
            </div>
          </section>
        ))}
      </article>

      {/* Ask refinement */}
      <section className="mt-16 pt-8 border-t border-sandstone/40">
        <p className="smallcaps mb-3">Ask the guide</p>
        <AskBar />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <p className="smallcaps mb-3">You might also wander into</p>
          <ul>
            {related.map((r) => (
              <li key={`${r.source}/${r.slug}`} className="border-b border-sandstone/30 last:border-b-0 group">
                <Link to={`/entry/${r.source}/${r.slug}`} className="block py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-lg text-ink group-hover:text-twilight transition-colors">
                      {r.title}
                    </span>
                    <TierMark tier={r.tier} size="sm" />
                  </div>
                  {r.summary && (
                    <p className="font-serif italic text-ink-soft text-sm mt-0.5">{r.summary}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  )
}

function firstSentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^.+?[.!?](?:\s|$)/)
  return (m ? m[0] : cleaned).trim()
}

function restOfBody(text: string): string | null {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^.+?[.!?](?:\s|$)/)
  if (!m) return null
  const rest = cleaned.slice(m[0].length).trim()
  return rest.length > 0 ? rest : null
}
