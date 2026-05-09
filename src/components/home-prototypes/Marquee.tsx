import { Link } from 'react-router-dom'
import { AskBar } from '../AskBar'
import {
  ISSUE,
  TIER_GLYPH_CLASS,
  getCoverEntry,
  getCoverQuote,
  getFeaturedEntries,
} from './_shared'

/**
 * THE MARQUEE
 * The opposite of "stuff the screen with cards." One giant pull-quote
 * — pulled from a real entry's Mission — fills the first viewport, set
 * in display Caslon italic, attributed in tracked smallcaps. Below it,
 * a calm Ask bar. Below that, a quiet contents-rhythm list.
 *
 * The premise: the most magnetic thing on the page should be a real
 * sentence from a real entry. Make the reader want to know who said it.
 *
 * The mistake on purpose: no photograph above the fold at all. The
 * reference is Stripe Press / Are.na, not Conde Nast — let the words
 * do the seducing.
 */
export function MarqueeHome() {
  const cover = getCoverEntry()
  const quote = getCoverQuote(cover)
  const featured = getFeaturedEntries(7).slice(1, 6)

  return (
    <div className="min-h-screen bg-paper text-ink editorial flex flex-col">
      {/* Slim masthead — the only chrome */}
      <header className="max-w-3xl mx-auto w-full px-5 sm:px-8 pt-5 sm:pt-7 flex items-baseline justify-between gap-4">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps text-right leading-tight">
          {ISSUE.season}
          <br />
          {ISSUE.number}
        </p>
      </header>

      {/* MARQUEE — fills the first viewport */}
      <section className="flex-1 flex items-center px-5 sm:px-8">
        <div className="max-w-3xl mx-auto w-full py-16 sm:py-24">
          <p className="smallcaps mb-6">An open quotation</p>
          <Link
            to={`/entry/${cover.source}/${cover.slug}`}
            className="block group"
          >
            <p
              className="font-display italic text-ink leading-[1.04] group-hover:text-twilight transition-colors"
              style={{ fontSize: 'clamp(2rem, 7.6vw, 3.5rem)' }}
            >
              <span className="text-twilight/40 mr-1">“</span>
              {quote}
              <span className="text-twilight/40 ml-1">”</span>
            </p>
            <p className="smallcaps mt-6">
              — {cover.title} · {cover.domain}
              <span
                className={`ml-2 inline-block font-display ${TIER_GLYPH_CLASS[cover.tier] ?? ''}`}
                aria-label={`Tier ${cover.tier}`}
              >
                {cover.tier}
              </span>
            </p>
          </Link>

          {/* Ask bar in the next breath of air */}
          <div className="mt-12 max-w-xl">
            <p className="font-serif italic text-ink-soft mb-2 text-sm">
              Or ask the guide a sharper question —
            </p>
            <AskBar />
          </div>
        </div>
      </section>

      {/* Quiet contents rhythm — below the fold */}
      <section className="max-w-3xl mx-auto w-full px-5 sm:px-8 pb-20">
        <hr className="border-twilight/40" />
        <p className="smallcaps mt-5 mb-4">In this issue</p>
        <ul className="space-y-4">
          {featured.map((entry) => (
            <li key={`${entry.source}/${entry.slug}`}>
              <Link
                to={`/entry/${entry.source}/${entry.slug}`}
                className="flex items-baseline gap-3 group"
              >
                <span className="font-serif italic text-twilight underline decoration-twilight/30 underline-offset-3 group-hover:text-orange transition-colors">
                  {entry.title}
                </span>
                <span className="smallcaps !text-[0.6rem] text-twilight-soft/80 truncate">
                  {entry.domain}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="font-serif italic text-ink-soft mt-8 text-sm leading-snug">
          And{' '}
          <Link to="/directory" className="text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange">
            246 more
          </Link>{' '}
          in the directory.
        </p>
      </section>
    </div>
  )
}
