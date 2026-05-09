import { Link } from 'react-router-dom'
import { AskLine } from './parts/AskLine'
import {
  IssueContents,
  IssueTail,
  TierGlyph,
} from './parts/IssueShared'
import {
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
  heroImageFor,
} from './_shared'

/**
 * THE ISSUE — CALLING CARD
 *
 * Same photographic cover. Vol/No gone. The ask is housed in a small
 * cream rectangle with a hairline border that sits low and centered
 * over the photo — sized for the input itself, not padded out into a
 * dialog. Reads like a calling card slipped into the cover, an artifact
 * laid down on top of the photograph rather than a UI surface.
 *
 * The bet: keep the boxed-input familiarity (so the affordance is
 * unmistakable on first sight) while making the box itself feel like
 * an editorial *object* — a printed card, not a dialog. Smaller,
 * tighter, no shadows, no rounding beyond a hairline border.
 */
export function IssueCallingCard() {
  const cover = getCoverEntry()
  const featured = getFeaturedEntries(7)
  const more = featured.slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ========== COVER ========== */}
      <section className="relative isolate text-paper">
        <img
          src={heroImageFor(cover, 1800, 2200)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(20,14,10,0.55) 0%, rgba(20,14,10,0.18) 32%, rgba(20,14,10,0.62) 80%, rgba(20,14,10,0.95) 100%)',
          }}
        />

        {/* Wordmark */}
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

        {/* Lower third */}
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
              <p className="smallcaps !text-paper/70 mt-5 flex items-center gap-2">
                <TierGlyph tier={cover.tier} className="text-base !text-paper/85" />
                Read the entry →
              </p>
            </Link>

            {/* THE CARD — small cream rectangle with a hairline border;
                fits just the input. No shadow, no rounded corners, no
                backdrop blur. Reads like a printed calling card. */}
            <div className="mt-10 max-w-md">
              <div className="bg-paper text-ink border border-paper/60 px-4 py-2.5">
                <AskLine
                  tone="paper"
                  size="body"
                  placeholder="ask the guide anything"
                  withCaret
                />
              </div>
            </div>
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
