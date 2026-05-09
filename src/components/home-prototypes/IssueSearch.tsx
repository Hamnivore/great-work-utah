import { Link } from 'react-router-dom'
import { TopSearch } from './parts/TopSearch'
import { IssueContents, IssueTail, TierGlyph } from './parts/IssueShared'
import {
  SUGGESTED_QUESTIONS,
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
  heroImageFor,
} from './_shared'

/**
 * THE ISSUE — SEARCH (search-as-primary)
 *
 * The brief: "make it more searchy." Search moves to the top, gets a
 * magnifying-glass icon, click-to-expand opens a Google/Linear-style
 * fullscreen panel with recommendations and a back button.
 *
 * Layout:
 *   - Top bar (over the photo): wordmark left, blurred-cream search
 *     bar right. ⌘K opens the panel from anywhere on the page.
 *   - Photo breathes in the middle of the cover.
 *   - Cover copy (kicker, big italic title, quote, read-the-entry
 *     link) is moved DOWN to the bottom of the photo. The cover stops
 *     being a typographic spread; it's now a film-poster credit.
 *   - "Also worth reading" + tail follow as before.
 *
 * The bet: typing in a real-looking search bar is everyone's
 * universal Internet muscle. By being unambiguously a search bar (not
 * a typographic flourish), the affordance disappears as a question.
 * The cover's job changes too: it's no longer "the page" — it's the
 * gorgeous frontispiece *behind* the working surface.
 */
export function IssueSearch() {
  const cover = getCoverEntry()
  const featured = getFeaturedEntries(7)
  const more = featured.slice(1, 6)
  const browseRecs = featured.slice(0, 5)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ========== COVER ========== */}
      <section className="relative isolate text-paper">
        <img
          src={heroImageFor(cover, 1800, 2400)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              // A taller darker bottom band — copy lives there now.
              'linear-gradient(to bottom, rgba(20,14,10,0.55) 0%, rgba(20,14,10,0.12) 28%, rgba(20,14,10,0.55) 78%, rgba(20,14,10,0.95) 100%)',
          }}
        />

        {/* TOP BAR — wordmark + search */}
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-5 sm:pt-7">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="block shrink-0">
              <p
                className="font-display italic text-paper leading-none"
                style={{ fontSize: 'clamp(1.3rem, 4.5vw, 1.7rem)' }}
              >
                Great Work
              </p>
              <p className="smallcaps !text-paper/75 mt-0.5">Utah, USA</p>
            </Link>
            <div className="flex-1 min-w-0">
              <TopSearch
                tone="photo"
                suggestions={SUGGESTED_QUESTIONS.slice(0, 8)}
                recommendations={browseRecs}
              />
            </div>
          </div>
        </div>

        {/* COVER COPY — pushed to the bottom, lighter than before */}
        <div
          className="relative max-w-3xl mx-auto px-5 sm:px-8 flex flex-col"
          style={{ minHeight: 'min(720px, 92vh)' }}
        >
          <div className="mt-auto pt-32 pb-8 sm:pb-10">
            <p className="smallcaps !text-paper/80 mb-3">
              Featured · {cover.domain}
            </p>
            <Link
              to={`/entry/${cover.source}/${cover.slug}`}
              className="block group"
            >
              <h1
                className="font-display italic leading-[0.95] text-paper group-hover:text-orange transition-colors"
                style={{ fontSize: 'clamp(2.4rem, 10vw, 3.8rem)' }}
              >
                {cover.title}.
              </h1>
              <p
                className="font-display italic text-paper/85 leading-snug mt-4 max-w-2xl"
                style={{ fontSize: 'clamp(1.05rem, 4vw, 1.4rem)' }}
              >
                “{getCoverQuote(cover)}”
              </p>
              <p className="smallcaps !text-paper/70 mt-5 flex items-center gap-2">
                <TierGlyph tier={cover.tier} className="text-base !text-paper/85" />
                Read the entry →
              </p>
            </Link>
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

        <IssueContents entries={more} style="numbered" />
      </section>

      {/* ========== TAIL ========== */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-16 mb-16">
        <IssueTail />
      </section>
    </div>
  )
}
