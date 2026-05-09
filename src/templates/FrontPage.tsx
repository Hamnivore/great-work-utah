import { LOREM_ARTICLE } from './_content'

/**
 * FRONT PAGE
 * Top of the broadsheet. Tracked nameplate, dateline strip with weather
 * and folio, kicker → headline → deck → byline stack, hero with hanging
 * caption, body broken by hairline rules. The "above the fold" template.
 *
 * Mobile-first: the nameplate is sized to fit a 390px column without
 * cropping; weather wraps to a second line gracefully.
 */
export function FrontPage() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      {/* Nameplate */}
      <div className="text-center">
        <p
          className="font-display text-twilight tracked-display"
          style={{ fontSize: 'clamp(1.6rem, 9vw, 2.5rem)' }}
        >
          The Great Work
        </p>
        <p className="smallcaps mt-1">A weekly · Utah, USA</p>
      </div>

      {/* Dateline strip */}
      <div className="rule-double-top mt-3" />
      <div className="flex items-center justify-between gap-3 py-2 text-[0.7rem] tracking-[0.15em] uppercase font-sans text-ink-soft">
        <span>{a.issue}</span>
        <span className="text-twilight">No. 014</span>
        <span>$0 · free</span>
      </div>
      <div className="rule-double-bottom mb-4" />

      {/* Weather / folio */}
      <p className="text-center font-serif italic text-ink-soft text-sm leading-snug mb-7">
        {a.weather}
      </p>

      {/* Lead story */}
      <p className="smallcaps mb-2">{a.kicker}</p>
      <h1
        className="font-display italic text-ink leading-[0.95] mb-3"
        style={{ fontSize: 'clamp(2.4rem, 11vw, 3.4rem)' }}
      >
        {a.title}.
      </h1>
      <p className="font-serif italic text-twilight text-xl leading-snug mb-3">
        {a.deck}
      </p>
      <p className="smallcaps mb-6">
        {a.byline} · {a.readTime} · {a.dateline}
      </p>

      <figure className="-mx-5 sm:mx-0 mb-2">
        <img src={a.heroImage} alt="" className="w-full aspect-[5/3] object-cover" />
      </figure>
      <p className="font-serif italic text-sm text-ink-soft px-5 sm:px-0 mb-8 leading-snug">
        {a.heroCaption}
      </p>

      {/* Body — hairline rules between scenes */}
      <p className="leading-relaxed first-letter:font-display first-letter:italic first-letter:text-6xl first-letter:text-twilight first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.85]">
        {a.body[0]}
      </p>

      <hr className="border-sandstone/40 my-6 w-1/4" />

      <p className="leading-relaxed">{a.body[1]}</p>
      <p className="leading-relaxed mt-4">{a.body[2]}</p>

      {/* Pull-quote — dropped into the column, not boxed */}
      <p className="font-display italic text-twilight text-2xl leading-snug my-8 pl-3 border-l-2 border-twilight/50">
        “{a.pullQuote}”
        <span className="block smallcaps mt-2 not-italic font-sans">— {a.pullQuoteAttr}</span>
      </p>

      <p className="leading-relaxed">{a.body[3]}</p>
      <p className="leading-relaxed mt-4">{a.body[6]}</p>

      <div className="rule-double-top mt-10" />
      <p className="smallcaps text-center mt-3">Continued on page 22</p>
    </article>
  )
}
