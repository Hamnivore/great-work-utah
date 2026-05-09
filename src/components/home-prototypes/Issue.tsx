import { Link } from 'react-router-dom'
import { AskBar } from '../AskBar'
import {
  SUGGESTED_QUESTIONS,
  TIER_GLYPH_CLASS,
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
  heroImageFor,
} from './_shared'

/**
 * THE ISSUE
 * The front page is a magazine issue. A cover, a contents page, a way
 * to ask, and a quiet door to the full directory at the back.
 *
 * The directory list is gone from the front. It moves to /directory
 * (or whatever we want to call it) and the home becomes editorial.
 *
 * Mobile-first: cover image is full-bleed, masthead floats over it. On
 * desktop the cover gets more breathing room and the contents column
 * sits beneath, not beside.
 */
export function IssueHome() {
  const cover = getCoverEntry()
  const featured = getFeaturedEntries(7) // includes cover
  const inThisIssue = featured.slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink editorial">
      {/* ========== COVER ========== */}
      <section className="relative isolate text-paper">
        {/* Hero plate */}
        <img
          src={heroImageFor(cover, 1800, 2200)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Editorial darken */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,14,10,0.6) 0%, rgba(20,14,10,0.25) 32%, rgba(20,14,10,0.55) 78%, rgba(20,14,10,0.92) 100%)',
          }}
        />

        {/* Wordmark — the only chrome. (Vol/No deleted; it didn't earn
            its space.) */}
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8">
          <Link to="/" className="inline-block">
            <p
              className="font-display italic text-paper leading-none"
              style={{ fontSize: 'clamp(1.6rem, 6vw, 2.1rem)' }}
            >
              Great Work
            </p>
            <p className="smallcaps !text-paper/75 mt-1">Utah, USA</p>
          </Link>
        </div>

        {/* Cover content — sits in the lower third */}
        <div
          className="relative max-w-3xl mx-auto px-5 sm:px-8 flex flex-col"
          style={{ minHeight: 'min(720px, 92vh)' }}
        >
          <div className="mt-auto pt-32 pb-10">
            <p className="smallcaps !text-paper/80 mb-3">
              Featured · {cover.domain}
            </p>
            <Link
              to={`/entry/${cover.source}/${cover.slug}`}
              className="block group"
            >
              <h1
                className="font-display italic leading-[0.95] text-paper group-hover:text-orange transition-colors"
                style={{ fontSize: 'clamp(2.6rem, 11vw, 4.2rem)' }}
              >
                {cover.title}.
              </h1>
              <p
                className="font-display italic text-paper/85 leading-snug mt-4 max-w-2xl"
                style={{ fontSize: 'clamp(1.15rem, 4.4vw, 1.55rem)' }}
              >
                “{getCoverQuote(cover)}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`font-display text-base ${TIER_GLYPH_CLASS[cover.tier] ?? ''}`}
                  aria-label={`Tier ${cover.tier}`}
                >
                  {cover.tier}
                </span>
                <span className="smallcaps !text-paper/70">
                  Read the entry →
                </span>
              </div>
            </Link>
          </div>

          {/* Bottom ask bar pinned to the cover floor */}
          <div className="pb-6 sm:pb-8">
            <div className="bg-paper/95 backdrop-blur-sm rounded-md border border-paper/40 p-2.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]">
              <AskBar />
            </div>
            <p className="smallcaps !text-paper/70 mt-3 text-center">
              Ask the guide anything
            </p>
          </div>
        </div>
      </section>

      {/* ========== ALSO WORTH READING ========== */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20">
        <div className="text-center mb-10">
          <h2
            className="font-display italic text-twilight leading-none"
            style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)' }}
          >
            Also worth reading
          </h2>
          <hr className="border-sandstone/50 w-12 mx-auto mt-5" />
        </div>

        <ul className="divide-y divide-sandstone/35">
          {inThisIssue.map((entry, i) => (
            <li key={`${entry.source}/${entry.slug}`} className="py-5 first:pt-0 last:pb-2">
              <Link
                to={`/entry/${entry.source}/${entry.slug}`}
                className="flex items-baseline gap-4 group"
              >
                <span
                  className="font-display italic text-twilight/80 leading-none shrink-0"
                  style={{ fontSize: 'clamp(2rem, 9vw, 2.4rem)' }}
                >
                  {String(i + 2).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="smallcaps">{entry.domain}</p>
                  <p className="font-display italic text-ink text-2xl leading-tight mt-0.5 group-hover:text-twilight transition-colors">
                    {entry.title}
                  </p>
                  {entry.summary && (
                    <p className="font-serif italic text-ink-soft mt-1.5 leading-snug line-clamp-2">
                      {entry.summary}
                    </p>
                  )}
                </div>
                <span
                  className={`font-display text-base sm:text-lg shrink-0 self-start pt-1 ${TIER_GLYPH_CLASS[entry.tier] ?? ''}`}
                  aria-label={`Tier ${entry.tier}`}
                >
                  {entry.tier}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="ornament mt-10">— ❦ —</p>
      </section>

      {/* ========== TRY ASKING ========== */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-6">
        <p className="smallcaps text-center">Or wander by question</p>
        <ul className="mt-5 flex flex-col gap-1.5 max-w-xl mx-auto text-center sm:text-left">
          {SUGGESTED_QUESTIONS.slice(0, 6).map((q) => (
            <li key={q}>
              <a
                href={`/ask?q=${encodeURIComponent(q)}`}
                className="font-serif italic text-twilight hover:text-orange transition-colors underline decoration-twilight/30 underline-offset-3"
              >
                {q}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ========== TAIL ========== */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-20 mb-10">
        <hr className="border-sandstone/50" />
        <div className="flex items-baseline justify-between mt-5 gap-4">
          <p className="font-serif italic text-ink-soft leading-snug">
            Plus 246 more entries — places to work,
            <br />
            history that mattered, and people on the way.
          </p>
          <Link
            to="/directory"
            className="smallcaps text-twilight hover:text-orange transition-colors shrink-0 self-end"
          >
            The full directory →
          </Link>
        </div>
      </section>
    </div>
  )
}
