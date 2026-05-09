import { LOREM_ARTICLE } from './_content'

/**
 * ALL PULL-QUOTES
 * There is no body type at all. Every paragraph is rendered as a giant
 * Caslon-italic pull-quote, centered, with hairline rules between them.
 * The article becomes a deck of declarations. You scroll through it like
 * a slide show without slides.
 *
 * Honest assessment of why this is dumb: pull-quotes work *because* they
 * stand against body type. With no body, every line is the loudest line.
 * Hierarchy collapses. The eye has nowhere to rest.
 *
 * Why we ship it anyway: a manifesto-shaped piece (or a personal essay
 * stripped to its skeleton) might survive this — every sentence already
 * earns a pull-quote, so why not commit?
 */
export function AllPullQuotes() {
  const a = LOREM_ARTICLE
  const declarations = [
    a.body[0].split('. ').slice(0, 2).join('. ') + '.',
    a.body[1].split('. ').slice(0, 1).join('. ') + '.',
    a.pullQuote,
    a.body[6],
    a.body[2].split('. ').slice(0, 1).join('. ') + '.',
    'And the salt does what it always does.',
  ]
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps text-center mb-8">All pull-quote, no body</p>
      <hr className="border-twilight/60 w-12 mx-auto mb-10" />

      {declarations.map((line, i) => (
        <div key={i}>
          <p
            className="font-display italic text-ink text-center leading-[1.1]"
            style={{ fontSize: 'clamp(1.5rem, 6.5vw, 1.95rem)' }}
          >
            {i === 2 ? `“${line}”` : line}
          </p>
          {i < declarations.length - 1 && (
            <hr className="border-sandstone/40 w-8 mx-auto my-8" />
          )}
        </div>
      ))}

      <hr className="border-twilight/60 w-12 mx-auto mt-12" />
      <p className="smallcaps text-center mt-4">— The editors</p>
    </article>
  )
}
