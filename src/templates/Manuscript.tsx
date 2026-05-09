import { LOREM_ARTICLE } from './_content'

/**
 * MANUSCRIPT
 * Classical book chapter. Justified body, big drop cap, single inset pull quote.
 * The "I am sitting in a quiet library" template.
 */
export function Manuscript() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <p className="smallcaps text-center mb-1">Chapter Fourteen</p>
      <hr className="border-sandstone/50 mb-6 mx-auto w-12" />

      <h1 className="font-display italic text-5xl text-center text-ink leading-tight mb-3">
        {a.title}
      </h1>
      <p className="font-serif italic text-lg text-center text-ink-soft mb-10 leading-snug">
        {a.deck}
      </p>

      <p className="text-justify hyphens-auto leading-loose first-letter:font-display first-letter:italic first-letter:text-7xl first-letter:text-twilight first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:leading-[0.85]">
        {a.body[0]}
      </p>

      {a.body.slice(1, 3).map((p, i) => (
        <p key={i} className="text-justify hyphens-auto leading-loose mt-4 indent-6">
          {p}
        </p>
      ))}

      <blockquote className="my-8 bg-sky/55 border-l-4 border-twilight px-5 py-4 rounded-r-md">
        <p className="font-display italic text-twilight text-2xl leading-snug">
          “{a.pullQuote}”
        </p>
        <p className="smallcaps mt-3 text-twilight">— {a.pullQuoteAttr}</p>
      </blockquote>

      {a.body.slice(3).map((p, i) => (
        <p key={i} className="text-justify hyphens-auto leading-loose mt-4 indent-6">
          {p}
        </p>
      ))}

      <hr className="border-sandstone/50 my-10 mx-auto w-12" />
      <p className="smallcaps mb-3">Citations</p>
      <ul className="space-y-1.5">
        {a.citations.map((c) => (
          <li key={c} className="font-serif italic text-twilight underline underline-offset-3 decoration-twilight/40">
            {c}
          </li>
        ))}
      </ul>
    </article>
  )
}
