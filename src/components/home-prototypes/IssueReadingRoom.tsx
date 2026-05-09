import { Link } from 'react-router-dom'
import { AskLine } from './parts/AskLine'
import { IssueTail, TierGlyph, Wordmark } from './parts/IssueShared'
import {
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
} from './_shared'

/**
 * THE ISSUE — READING ROOM iteration
 *
 * The most radical of the iterations: the cover entry stops being a
 * *separate* cover treatment at all. It's just the first item in the
 * contents list, set noticeably bigger than the rest with its quote
 * visible. Everything else in the list is small, italic, library-card
 * quiet.
 *
 * The bet: the home is a contents page from the first pixel. There is
 * no "above the fold." A reader who skims sees a list; a reader who
 * reads sees the editor's pick at the top of the list, slightly louder
 * than its neighbours, with the Ask line tucked above as a quiet
 * sentence. Stripe-Press energy applied to a magazine TOC.
 *
 * The risk: without a clear hero, a first-time visitor may not feel
 * recommended *to* — they have to read down the list to find what's
 * worth their time. Trades drama for trust.
 */
export function IssueReadingRoom() {
  const cover = getCoverEntry()
  const rest = getFeaturedEntries(7).slice(1, 6)
  const quote = getCoverQuote(cover)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Wordmark + a single italic intro sentence — no masthead furniture */}
      <header className="max-w-2xl mx-auto px-6 sm:px-10 pt-8 sm:pt-12">
        <Wordmark />
        <p className="font-serif italic text-ink-soft mt-6 leading-snug max-w-prose">
          A guide to the great work being done in Utah, and the people
          doing it. Updated weekly.
        </p>
      </header>

      {/* ASK — sits above the contents like a chapter heading */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-10">
        <AskLine placeholder="ask the guide anything" />
      </section>

      {/* CONTENTS — cover entry leads, set bigger; rest fall in line */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-12">
        <ul className="divide-y divide-sandstone/30">
          {/* The lead row — only louder thing on the page */}
          <li className="py-7 first:pt-0">
            <Link
              to={`/entry/${cover.source}/${cover.slug}`}
              className="block group"
            >
              <p className="smallcaps mb-1.5 text-twilight">
                Featured · {cover.domain}
              </p>
              <h1
                className="font-display italic text-ink leading-[0.98] group-hover:text-twilight transition-colors"
                style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)' }}
              >
                {cover.title}
              </h1>
              <p
                className="font-display italic text-twilight/80 leading-snug mt-3 max-w-prose"
                style={{ fontSize: 'clamp(1.05rem, 3.6vw, 1.25rem)' }}
              >
                {quote}
              </p>
              <p className="smallcaps mt-3">
                <TierGlyph tier={cover.tier} className="mr-2 text-base" />
                Read the entry →
              </p>
            </Link>
          </li>

          {/* The rest — small, italic, calm */}
          {rest.map((entry) => (
            <li
              key={`${entry.source}/${entry.slug}`}
              className="py-4 first:pt-0"
            >
              <Link
                to={`/entry/${entry.source}/${entry.slug}`}
                className="flex items-baseline gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display italic text-ink text-lg leading-snug group-hover:text-twilight transition-colors">
                    {entry.title}
                  </p>
                  <p className="font-serif italic text-ink-soft text-sm leading-snug line-clamp-1">
                    {entry.summary}
                  </p>
                </div>
                <span className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft/80 truncate hidden sm:inline">
                  {entry.domain}
                </span>
                <TierGlyph tier={entry.tier} className="text-base shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* TAIL */}
      <section className="max-w-2xl mx-auto px-6 sm:px-10 mt-12 mb-16">
        <IssueTail />
      </section>
    </div>
  )
}
