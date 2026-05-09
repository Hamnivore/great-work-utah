import { LOREM_ARTICLE } from './_content'

/**
 * TITLE FIRST
 * The title fills the entire first viewport — 100vh on mobile, with the
 * headline set massive and italic, no deck, no kicker, no "scroll for
 * more" affordance. The reader has to scroll past the title before the
 * article will admit it exists.
 *
 * Honest assessment of why this is dumb: the entire SaaS-onboarding
 * literature says "above the fold or it didn't happen." If the reader
 * doesn't scroll, the article reads as an empty room. Bounce rate goes
 * up.
 *
 * Why we ship it anyway: a title set this big *is* the article for some
 * stories. A book chapter heading commits a whole page to itself; we
 * commit a whole screen. The article underneath is a reward for trust.
 */
export function TitleFirst() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      {/* The whole-screen title */}
      <div
        className="flex flex-col justify-end"
        style={{ minHeight: '85vh' }}
      >
        <h1
          className="font-display italic text-ink leading-[0.92]"
          style={{ fontSize: 'clamp(3.5rem, 18vw, 5.5rem)' }}
        >
          {a.title}.
        </h1>
        <p className="smallcaps mt-6 text-twilight">↓</p>
      </div>

      {/* And then, finally, the article */}
      <div className="pt-16">
        <p className="smallcaps mb-3">{a.kicker}</p>
        <p className="font-display italic text-twilight text-2xl leading-snug mb-8">
          {a.deck}
        </p>

        <p className="leading-relaxed">{a.body[0]}</p>
        <p className="leading-relaxed mt-4">{a.body[1]}</p>
        <p className="leading-relaxed mt-4">{a.body[6]}</p>
      </div>
    </article>
  )
}
