import { LOREM_ARTICLE } from './_content'

/**
 * MAGAZINE LONG-READ
 * Editorial muscle. Kicker, byline, hero photo, drop cap, text-wrap thumbnail,
 * centered pull quote with hairline rules, footnotes, related sidebar.
 * The "this is the flagship story this issue" template.
 */
export function Magazine() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <p className="smallcaps mb-3">{a.kicker}</p>

      <h1 className="font-display italic text-ink leading-[0.95] mb-4" style={{ fontSize: '3.25rem' }}>
        {a.title}
      </h1>

      <p className="font-display italic text-twilight text-2xl leading-snug mb-5">{a.deck}</p>

      <p className="smallcaps mb-6">
        {a.byline} · {a.readTime} · {a.tier} {a.starred && '⭐'}
      </p>

      <figure className="-mx-5 sm:mx-0 mb-6">
        <img src={a.heroImage} alt="" className="w-full aspect-[3/2] object-cover" />
        <figcaption className="font-serif italic text-sm text-ink-soft mt-2 px-5 sm:px-0">
          {a.heroCaption}
        </figcaption>
      </figure>

      <p className="leading-relaxed first-letter:font-display first-letter:italic first-letter:text-6xl first-letter:text-twilight first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.9]">
        {a.body[0]}
        <sup className="text-twilight font-sans text-xs ml-0.5">1</sup>
      </p>

      <p className="leading-relaxed mt-4">
        {a.body[1]}
        <sup className="text-twilight font-sans text-xs ml-0.5">2</sup>
      </p>

      <blockquote className="my-10 text-center px-2">
        <hr className="border-twilight/40 w-12 mx-auto mb-5" />
        <p className="font-display italic text-2xl text-ink leading-snug">
          “{a.pullQuote}”
        </p>
        <p className="smallcaps mt-3">— {a.pullQuoteAttr}</p>
        <hr className="border-twilight/40 w-12 mx-auto mt-5" />
      </blockquote>

      {a.body.slice(2, 4).map((p, i) => (
        <p key={i} className="leading-relaxed mt-4">
          {p}
        </p>
      ))}

      <aside className="my-8 bg-pale-sky/80 border border-twilight/15 rounded-md p-5">
        <p className="smallcaps mb-3">Related Work</p>
        <ul className="space-y-2.5 font-serif italic text-twilight">
          <li>Bingham Canyon Mine — open-pit and aftermath</li>
          <li>Sun Tunnels — Nancy Holt, 1973–76</li>
          <li>Double Negative — Michael Heizer</li>
        </ul>
      </aside>

      {a.body.slice(4).map((p, i) => (
        <p key={i} className="leading-relaxed mt-4">
          {p}
        </p>
      ))}

      <hr className="border-sandstone/50 my-10" />
      <p className="smallcaps mb-3">Notes</p>
      <ol className="space-y-2 font-serif text-sm text-ink-soft list-decimal list-inside">
        <li>Lorem ipsum dolor sit amet, Holt/Smithson Foundation, 2019.</li>
        <li>Sed ut perspiciatis unde omnis iste natus error, UMFA Archive 1971.</li>
      </ol>
    </article>
  )
}
