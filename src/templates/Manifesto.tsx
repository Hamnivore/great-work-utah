import { LOREM_ARTICLE } from './_content'

/**
 * MANIFESTO
 * Giant title. Oversized body. Each paragraph gets a lot of room. Every line
 * declares. No images. The "we believe" template.
 */
export function Manifesto() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <p className="smallcaps mb-3">A manifesto</p>
      <h1 className="font-display italic text-ink leading-[0.9] mb-12" style={{ fontSize: '4.5rem' }}>
        {a.title}.
      </h1>

      <div className="space-y-10">
        <p className="text-2xl leading-snug">
          {a.body[0]}
        </p>
        <p className="text-2xl leading-snug font-display italic text-twilight">
          {a.pullQuote}
        </p>
        <p className="text-2xl leading-snug">
          {a.body[5]}
        </p>
        <p className="text-2xl leading-snug">
          And so the work continues — <em>and so should ours</em>.
        </p>
      </div>

      <hr className="border-twilight/30 mt-16 mb-4 w-1/3" />
      <p className="font-display italic text-twilight text-xl">— The editors</p>
    </article>
  )
}
