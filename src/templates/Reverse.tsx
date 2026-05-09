import { LOREM_ARTICLE } from './_content'

/**
 * REVERSE
 * The image lands at the *end*, not the start. The article builds in
 * pure typography — kicker, headline, deck, prose, pull-quote — and only
 * after the last paragraph does the photograph appear, full-bleed, like
 * the back of a record sleeve.
 *
 * The mistake on purpose: there is *no* opening image, no thumbnail, no
 * preview. We make the reader trust the typography first.
 */
export function Reverse() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      {/* Tight typographic top */}
      <p className="smallcaps mb-2">{a.kicker}</p>
      <h1
        className="font-display italic text-ink leading-[0.95] mb-4"
        style={{ fontSize: 'clamp(2.5rem, 12vw, 3.4rem)' }}
      >
        {a.title}
      </h1>
      <p className="font-display italic text-twilight text-2xl leading-snug mb-4">
        {a.deck}
      </p>
      <p className="smallcaps mb-8">
        {a.byline} · {a.readTime}
      </p>

      <hr className="border-sandstone/50 mb-8 w-12" />

      <p className="leading-relaxed text-lg">{a.body[0]}</p>
      <p className="leading-relaxed text-lg mt-5">{a.body[1]}</p>

      <blockquote className="my-10 text-center px-2">
        <p
          className="font-display italic text-twilight leading-[1.05]"
          style={{ fontSize: 'clamp(1.6rem, 7vw, 2.1rem)' }}
        >
          “{a.pullQuote}”
        </p>
        <p className="smallcaps mt-3">— {a.pullQuoteAttr}</p>
      </blockquote>

      <p className="leading-relaxed text-lg">{a.body[2]}</p>
      <p className="leading-relaxed text-lg mt-5">{a.body[3]}</p>
      <p className="leading-relaxed text-lg mt-5">{a.body[6]}</p>

      <p className="ornament mt-10">— ❦ —</p>

      {/* Reveal */}
      <figure className="-mx-5 sm:-mx-12 mt-6">
        <img
          src={a.heroImage}
          alt=""
          className="w-full aspect-[5/3] object-cover"
        />
        <figcaption className="font-serif italic text-sm text-ink-soft mt-3 px-5 sm:px-12 leading-snug">
          {a.heroCaption}
        </figcaption>
      </figure>
    </article>
  )
}
