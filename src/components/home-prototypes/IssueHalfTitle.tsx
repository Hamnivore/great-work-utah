import { Link } from 'react-router-dom'
import { AskLine } from './parts/AskLine'
import {
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
 * THE ISSUE — HALF TITLE iteration
 *
 * Even quieter than Frontispiece. No colophon, no ribbon, no ornament.
 * The page opens with nothing but the cover entry's title set
 * generously, attributed in italic to the entry's domain. Then the Ask
 * line. Then the contents list. Three blocks of type, separated by
 * white space and one hair rule each.
 *
 * The bet: the most minimalist a book ever gets is its half-title page
 * — *just the title*, surrounded by paper. If that's enough to make a
 * reader open the book, it's enough to make them stay on the home.
 *
 * The risk: with no editorial framing at the top, the reader can't
 * tell what publication they've landed on until they look up at the
 * tiny wordmark in the corner. Discoverability over invisibility.
 */
export function IssueHalfTitle() {
  const cover = getCoverEntry()
  const quote = getCoverQuote(cover)
  const contents = getFeaturedEntries(7).slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Tiny wordmark — top-left, easily missed (the point) */}
      <header className="max-w-3xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8">
        <Wordmark />
      </header>

      {/* HALF-TITLE PAGE — fills almost the whole first viewport */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 flex flex-col justify-center min-h-[80vh] sm:min-h-[85vh]">
        <Link
          to={`/entry/${cover.source}/${cover.slug}`}
          className="block group"
        >
          <p className="smallcaps mb-6 text-twilight">
            featured this spring
          </p>
          <h1
            className="font-display italic text-ink leading-[0.92] group-hover:text-twilight transition-colors"
            style={{ fontSize: 'clamp(3rem, 13vw, 5rem)' }}
          >
            {cover.title}.
          </h1>
          <p
            className="font-display italic text-twilight/75 leading-snug mt-8 max-w-2xl"
            style={{ fontSize: 'clamp(1.15rem, 4.4vw, 1.55rem)' }}
          >
            {quote}
          </p>
          <p className="font-serif italic text-ink-soft mt-6">
            <TierGlyph tier={cover.tier} className="mr-2 text-base not-italic" />
            <span className="smallcaps !text-[0.65rem] !tracking-[0.18em]">
              {cover.domain} · read the entry →
            </span>
          </p>
        </Link>
      </section>

      {/* ASK — single underlined line, no card, no border, no button-feel */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-4">
        <hr className="border-sandstone/40 mb-10" />
        <AskLine size="display" placeholder="ask the guide anything" />
        <p className="font-serif italic text-ink-soft text-sm mt-3">
          The guide writes you back an article.
        </p>
      </section>

      {/* CONTENTS — bare list, no numbers, no header */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-20">
        <hr className="border-sandstone/40 mb-8" />
        <IssueContents entries={contents} style="bare" heading="More in this issue" />
      </section>

      {/* TAIL */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-16 mb-16">
        <IssueTail />
      </section>
    </div>
  )
}
