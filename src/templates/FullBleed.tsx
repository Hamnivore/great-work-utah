import { LOREM_ARTICLE } from './_content'

/**
 * FULL BLEED
 * Field Mag energy. A cinematic full-bleed hero plate fills the top of
 * the screen; the title is overlaid at the bottom-left over a soft
 * gradient. Body opens cleanly below. No drop cap — the photograph is
 * the drop cap.
 *
 * The mistake on purpose: the title is set lowercase, full italic, and
 * runs longer than the photograph height it sits on. We let it.
 */
export function FullBleed() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial -mx-5 sm:mx-0">
      {/* Cinematic top */}
      <div className="relative isolate">
        <img
          src={a.heroImage}
          alt=""
          className="w-full aspect-[3/4] sm:aspect-[4/5] object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(20,14,10,0.55) 80%, rgba(20,14,10,0.85) 100%)',
          }}
        />
        <div className="absolute inset-x-5 sm:inset-x-7 bottom-5 sm:bottom-7 text-paper">
          <p
            className="text-paper/80 mb-2"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {a.kicker}
          </p>
          <h1
            className="font-display italic leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 9.5vw, 2.8rem)' }}
          >
            {a.title.toLowerCase()}.
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-0 pt-8">
        <p className="font-display italic text-twilight text-2xl leading-snug mb-6">
          {a.deck}
        </p>
        <p className="smallcaps mb-6">
          {a.byline} · {a.readTime} · {a.location}
        </p>

        <p className="leading-relaxed">{a.body[0]}</p>
        <p className="leading-relaxed mt-4">{a.body[1]}</p>
        <p className="leading-relaxed mt-4">{a.body[2]}</p>

        {/* Pull-quote floats wide, breaks the column */}
        <blockquote
          className="my-10 -mx-5 sm:mx-0 px-5 sm:px-0 py-5 border-y border-sandstone/50"
        >
          <p
            className="font-display italic text-twilight leading-[1.05]"
            style={{ fontSize: 'clamp(1.6rem, 7vw, 2.1rem)' }}
          >
            {a.pullQuote}
          </p>
          <p className="smallcaps mt-3">— {a.pullQuoteAttr}</p>
        </blockquote>

        <p className="leading-relaxed">{a.body[3]}</p>
        <p className="leading-relaxed mt-4">{a.body[6]}</p>
      </div>
    </article>
  )
}
