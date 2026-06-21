import { Link } from 'react-router-dom'
import { AskLine } from './parts/AskLine'
import { TierGlyph, Wordmark } from './parts/IssueShared'
import {
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
} from './_shared'
import type { Entry } from '../../lib/types'

/**
 * THE ISSUE — LIBRARY iteration
 *
 * The bookish-but-playful alternative. Each entry on the home is
 * rendered as a vintage library catalog card: a small typewriter-feel
 * monospace metadata strip ("CALL NUMBER") above an italic Caslon
 * title, then a one-line annotation, then a rubber-stamp tier mark in
 * the bottom-right. The cover entry's card is enlarged. Cards stack
 * down the page like a card-catalog drawer pulled out on the desk.
 *
 * The Ask line is rendered inside its own catalog card — labelled "REQ"
 * — so the search affordance reads as an integral part of the same
 * vocabulary, not a UI form pasted on top.
 *
 * The bet: book typography doesn't have to be quiet. A library catalog
 * is *intensely* typographic, full of metadata, but never reads as
 * "newspaper." It reads as institutional, careful, opinionated about
 * what counts as a real reference.
 *
 * The risk: the bordered-card aesthetic is denser than the rest of
 * this family. If we ship it, every other surface (entry pages, Ask
 * answers) needs to feel related. A one-page novelty is exhausting
 * across a whole product.
 */
export function IssueLibrary() {
  const cover = getCoverEntry()
  const quote = getCoverQuote(cover)
  const rest = getFeaturedEntries(7).slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Wordmark */}
      <header className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-9">
        <Wordmark />
      </header>

      {/* Subhead — sets the metaphor */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-6">
        <p className="font-serif italic text-ink-soft leading-snug max-w-prose">
          The card catalog of great work being done in Utah.
          Pull a card to read the full entry.
        </p>
      </section>

      {/* REQ card — the Ask affordance, in the same card vocabulary */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-8">
        <CatalogCard kind="req" />
      </section>

      {/* COVER CARD — enlarged */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-8">
        <CatalogCard kind="cover" entry={cover} quote={quote} />
      </section>

      {/* THE STACK */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-6 space-y-4">
        {rest.map((entry, i) => (
          <CatalogCard
            key={`${entry.source}/${entry.slug}`}
            kind="row"
            entry={entry}
            seq={i + 2}
          />
        ))}
      </section>

      {/* Tail card — links to directory in the same vocabulary */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-6 mb-16">
        <Link
          to="/directory"
          className="block border border-sandstone/70 hover:border-twilight/50 transition-colors bg-paper p-5 group"
        >
          <p className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-soft uppercase">
            ref · 246 more
          </p>
          <p className="font-display italic text-ink text-xl mt-1 group-hover:text-twilight transition-colors">
            The full catalog →
          </p>
        </Link>
      </section>
    </div>
  )
}

/* ---------------------------------------------------------------------- */

interface CardProps {
  kind: 'cover' | 'row' | 'req'
  entry?: Entry
  quote?: string
  seq?: number
}

function CatalogCard({ kind, entry, quote, seq }: CardProps) {
  if (kind === 'req') {
    return (
      <div className="border border-twilight/40 bg-paper-deep/30 p-5 sm:p-6 relative">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <p className="font-mono text-[0.7rem] tracking-[0.14em] text-twilight uppercase">
            req · ask the guide
          </p>
          <p className="font-mono text-[0.65rem] tracking-[0.08em] text-twilight-soft/70 uppercase">
            patron use only
          </p>
        </div>
        <AskLine size="display" placeholder="ask the guide anything" withCaret />
        <p className="font-mono text-[0.65rem] tracking-[0.1em] text-ink-soft mt-3 uppercase">
          The guide writes you back an article.
        </p>
      </div>
    )
  }

  if (!entry) return null

  const isCover = kind === 'cover'
  const callNumber = makeCallNumber(entry, seq)

  return (
    <Link
      to={`/entry/${entry.source}/${entry.slug}`}
      className={`block border border-sandstone/70 hover:border-twilight/50 transition-colors bg-paper relative group ${
        isCover ? 'p-6 sm:p-8' : 'p-5'
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[0.7rem] tracking-[0.12em] text-ink-soft uppercase">
          {callNumber}
        </p>
        <p className="font-mono text-[0.65rem] tracking-[0.08em] text-twilight-soft/70 uppercase">
          {entry.source === 'work' ? 'historical' : 'active'}
        </p>
      </div>

      <h3
        className={`font-display italic text-ink leading-[1] mt-3 group-hover:text-twilight transition-colors ${
          isCover ? '' : ''
        }`}
        style={{
          fontSize: isCover
            ? 'clamp(1.8rem, 7vw, 2.6rem)'
            : 'clamp(1.2rem, 5vw, 1.5rem)',
        }}
      >
        {entry.title}
      </h3>

      <p
        className={`font-serif italic text-ink-soft leading-snug mt-3 ${
          isCover ? 'text-base sm:text-lg' : 'text-sm line-clamp-2'
        }`}
      >
        {isCover ? quote : entry.summary}
      </p>

      {/* Bottom strip — domain + tier "stamp" */}
      <div className="flex items-baseline justify-between gap-3 mt-4 border-t border-sandstone/40 pt-2">
        <p className="font-mono text-[0.65rem] tracking-[0.1em] text-twilight uppercase">
          {entry.domain}
        </p>
        <span
          className={`font-display border border-current px-1.5 py-0.5 leading-none ${
            isCover ? 'text-base' : 'text-xs'
          }`}
          aria-label={`Tier ${entry.tier}`}
        >
          <TierGlyph tier={entry.tier} className="text-current" />
        </span>
      </div>
    </Link>
  )
}

/**
 * Fake but stable "call number" generated from the slug. Library-card
 * vibes only — not a real classification scheme.
 */
function makeCallNumber(entry: Entry, seq?: number): string {
  const prefix = entry.source === 'work' ? 'GW' : entry.source.slice(0, 3).toUpperCase()
  const code = entry.domain
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
  const num = seq != null ? String(seq).padStart(3, '0') : entry.slug.length.toString().padStart(3, '0')
  return `${prefix}.${code}.${num} · ${entry.slug.slice(0, 18)}`
}
