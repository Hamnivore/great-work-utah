import { LOREM_ARTICLE } from './_content'

/**
 * COVER STORY
 * Obscura magazine-cover energy: a giant masthead at top, a single quiet
 * subtitle, a full-bleed portrait, and the title as a pull-quote-sized
 * caption beneath. The "this is the issue" template.
 *
 * The mistake on purpose: the title is set lowercase and italic — most
 * magazine covers shout in caps; we whisper.
 */
export function CoverStory() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial -mx-5 sm:mx-0">
      {/* Masthead */}
      <div className="px-5 sm:px-0 pt-2">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className="font-display italic text-twilight leading-none"
            style={{ fontSize: 'clamp(2.6rem, 14vw, 3.8rem)' }}
          >
            Obscura
          </p>
          <p className="smallcaps text-right">
            Vol I<br />
            No. 014
          </p>
        </div>
        <p className="smallcaps mt-2 tracking-[0.32em]">
          Voices of the contemporary · Winter 2026
        </p>
        <hr className="border-twilight/60 mt-3" />
      </div>

      {/* Portrait — fills the visual field */}
      <figure className="mt-4">
        <img
          src={a.portraitImage}
          alt=""
          className="w-full aspect-[3/4] object-cover"
        />
      </figure>

      {/* Pull-quote subtitle, lower third */}
      <div className="px-5 sm:px-0 mt-6">
        <p className="smallcaps mb-3">{a.kicker}</p>
        <p
          className="font-display italic text-ink leading-[1.05]"
          style={{ fontSize: 'clamp(1.7rem, 7.5vw, 2.2rem)' }}
        >
          “{a.pullQuote}”
        </p>
        <p className="smallcaps mt-3">— {a.pullQuoteAttr}</p>
      </div>

      {/* Bottom rule with issue colophon */}
      <div className="px-5 sm:px-0 mt-10">
        <hr className="border-twilight/60" />
        <div className="flex items-center justify-between text-[0.7rem] tracking-[0.18em] uppercase font-sans text-twilight-soft pt-2">
          <span>The Great Work</span>
          <span>{a.location}</span>
        </div>
      </div>
    </article>
  )
}
