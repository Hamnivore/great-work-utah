import { Link } from 'react-router-dom'
import { AskLine } from './parts/AskLine'
import {
  Divider,
  IssueContents,
  IssueTail,
  TierGlyph,
  Wordmark,
} from './parts/IssueShared'
import {
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
} from './_shared'

/**
 * THE ISSUE — FRONTISPIECE iteration
 *
 * Brief from the user:
 * - Original Issue's cover image / kicker / Vol-No reads "newspaper".
 *   Try minimalist book typography instead.
 * - The boxed Ask bar reads "form widget". Try one that reads "writing
 *   on the page".
 *
 * The move: open like an art monograph. A small italic colophon names
 * the publication; a delicate ribbon turns the page; then the cover
 * entry's title is set as a *book's title page*: just type, generously
 * spaced, italic Caslon, with a single Mission-sentence pull-quote and
 * a quiet read-on link beneath. The Ask line follows as a single
 * underlined sentence. Contents is a numbered list, no headers shouting.
 *
 * No photographs. No mastheads-with-issue-numbers. No section dividers
 * named after newspaper furniture (no "kicker", no "deck", no "above
 * the fold"). The only chrome is the wordmark in the top-left.
 */
export function IssueFrontispiece() {
  const cover = getCoverEntry()
  const quote = getCoverQuote(cover)
  const contents = getFeaturedEntries(7).slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Wordmark — the only thing the page asserts before the cover */}
      <header className="max-w-2xl mx-auto px-6 sm:px-10 pt-8 sm:pt-12">
        <Wordmark />
      </header>

      {/* Colophon — names the *publication* in two lines, like the
          imprint page of a book. Italic, small, generous letter-space. */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24">
        <p className="font-serif italic text-ink-soft text-base sm:text-lg leading-relaxed text-center">
          A guide, in spring,
          <br />
          to the great work being done in Utah —
          <br />
          and the people doing it.
        </p>
        <Divider kind="ribbon" />
      </section>

      {/* TITLE PAGE — the cover entry, set as a book's half-title */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-8 sm:mt-12 text-center">
        <Link
          to={`/entry/${cover.source}/${cover.slug}`}
          className="block group"
        >
          <h1
            className="font-display italic text-ink leading-[0.95] group-hover:text-twilight transition-colors"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 3.6rem)' }}
          >
            {cover.title}
          </h1>
          <p
            className="font-display italic text-twilight/75 leading-snug mt-6 mx-auto max-w-prose"
            style={{ fontSize: 'clamp(1.05rem, 3.6vw, 1.3rem)' }}
          >
            {quote}
          </p>
          <p className="smallcaps mt-6">
            <TierGlyph tier={cover.tier} className="mr-2 text-base" />
            {cover.domain} · read on →
          </p>
        </Link>
      </section>

      {/* ASK — set as a single sentence on the page */}
      <section className="max-w-xl mx-auto px-6 sm:px-10 mt-20 sm:mt-28">
        <AskLine size="display" placeholder="ask the guide anything" />
      </section>

      {/* CONTENTS — quiet, numbered, no header shouting */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-16 sm:mt-20">
        <Divider kind="ornament" />
        <p className="smallcaps text-center mb-6">Also in this volume</p>
        <IssueContents entries={contents} style="numbered" />
      </section>

      {/* TAIL */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-16 mb-16">
        <IssueTail />
      </section>
    </div>
  )
}
