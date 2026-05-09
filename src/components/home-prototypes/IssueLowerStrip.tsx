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
 * THE ISSUE — LOWER STRIP
 *
 * Same photographic cover. Vol/No gone. The ask is housed in a thin
 * cream paper strip pinned to the cover floor — a single horizontal
 * band that runs the full width and holds nothing but the AskLine and
 * a small label. It looks like the captioning strip beneath a magazine
 * cover photo, or the white border of a Polaroid.
 *
 * The bet: if the ask lives in *one* paper rectangle that's framing
 * the photo (rather than floating on top of it), it stops feeling
 * pasted on. The strip is part of the cover composition — like a
 * frame, not a popup.
 */
export function IssueLowerStrip() {
  const cover = getCoverEntry()
  const featured = getFeaturedEntries(7)
  const more = featured.slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ========== COVER + STRIP ========== */}
      <section className="relative isolate text-paper">
        {/* The photo gets a fixed height; the strip floats below it.
            Rough proportion: 88vh photo, then strip beneath. */}
        <div className="relative" style={{ height: 'min(88vh, 920px)' }}>
          <img
            src={heroImageFor(cover, 1800, 2200)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(20,14,10,0.55) 0%, rgba(20,14,10,0.18) 32%, rgba(20,14,10,0.7) 88%, rgba(20,14,10,0.95) 100%)',
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

          {/* Lower-third title block */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-10">
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
            </div>
          </div>
        </div>

        {/* THE STRIP — single cream band beneath the photo, the ask
            sits inside it. Reads as the white border of a Polaroid,
            not as a UI element pasted over the picture. */}
        <div className="relative bg-paper text-ink border-t border-sandstone/40">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-5 sm:py-6 flex items-center gap-5">
            <p className="smallcaps shrink-0 hidden sm:block">Ask</p>
            <div className="flex-1">
              <AskLine
                tone="paper"
                size="display"
                placeholder="ask the guide anything"
                withCaret
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== ALSO WORTH READING ========== */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20">
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
