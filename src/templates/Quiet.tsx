import { LOREM_ARTICLE } from './_content'

/**
 * QUIET ESSAY
 * No masthead, no drop cap, no images. Just title, deck, prose, one centered
 * pull quote with hairline rules. The "trust the writing" template.
 */
export function Quiet() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <hr className="border-sandstone/50 mb-8 w-12" />
      <p className="smallcaps mb-1">An essay</p>
      <h1 className="font-display italic text-4xl text-ink leading-tight mb-3">{a.title}</h1>
      <p className="font-serif italic text-ink-soft text-lg mb-10 leading-snug">{a.deck}</p>

      {a.body.slice(0, 3).map((p, i) => (
        <p key={i} className="leading-loose mt-5 first:mt-0 text-lg">
          {p}
        </p>
      ))}

      <blockquote className="my-12 text-center max-w-md mx-auto">
        <hr className="border-ink/30 w-8 mx-auto mb-5" />
        <p className="font-display italic text-2xl text-ink leading-snug">
          {a.pullQuote}
        </p>
        <hr className="border-ink/30 w-8 mx-auto mt-5" />
      </blockquote>

      {a.body.slice(3).map((p, i) => (
        <p key={i} className="leading-loose mt-5 text-lg">
          {p}
        </p>
      ))}

      <hr className="border-sandstone/50 my-12 w-12" />
      <p className="smallcaps mb-2">Sources</p>
      <p className="font-serif italic text-sm text-ink-soft leading-relaxed">
        {a.citations.map((c, i) => (
          <span key={c}>
            <span className="text-twilight underline underline-offset-3 decoration-twilight/40">{c}</span>
            {i < a.citations.length - 1 && ' · '}
          </span>
        ))}
      </p>
    </article>
  )
}
