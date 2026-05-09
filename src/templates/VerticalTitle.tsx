import { LOREM_ARTICLE } from './_content'

/**
 * VERTICAL TITLE
 * The title is set sideways, running down the left edge of the screen
 * like the spine of a book. The body lives to its right in a column
 * that's now uncomfortably narrow on mobile — maybe 220px of text
 * column on a 390px phone. Reading the title requires you to tilt the
 * phone or your head.
 *
 * Honest assessment of why this is dumb: thumbs hit the title accidentally,
 * the column is too narrow for a comfortable measure (well below the 45–75
 * char target), and screen readers will announce it letter-by-letter.
 *
 * Why we ship it anyway: when the title becomes a tactile object — a
 * spine — the article starts to feel like a physical thing. Atlas Obscura
 * could probably get away with this on a single feature.
 */
export function VerticalTitle() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      <div className="flex items-stretch gap-4">
        {/* The spine */}
        <div
          className="shrink-0 flex justify-center"
          style={{ width: 56 }}
        >
          <h1
            className="font-display italic text-twilight leading-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontSize: 'clamp(2rem, 9vw, 2.6rem)',
              letterSpacing: '0.02em',
              textOrientation: 'mixed',
            }}
          >
            {a.title}
          </h1>
        </div>

        {/* The page */}
        <div className="flex-1 min-w-0">
          <p className="smallcaps mb-2">{a.kicker}</p>
          <p className="font-serif italic text-twilight-soft leading-snug mb-5 text-sm">
            {a.deck}
          </p>

          <p className="leading-relaxed text-sm">{a.body[0]}</p>
          <p className="leading-relaxed text-sm mt-3">{a.body[1]}</p>
          <p className="leading-relaxed text-sm mt-3">{a.body[2]}</p>
          <p className="leading-relaxed text-sm mt-3">{a.body[6]}</p>
        </div>
      </div>

      <hr className="border-sandstone/50 mt-8 mb-3" />
      <p className="smallcaps text-center">An experiment · not a product</p>
    </article>
  )
}
