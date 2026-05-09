import { LOREM_ARTICLE } from './_content'

/**
 * INVERTED PYRAMID
 * The first paragraph is set huge — display-italic, almost headline size.
 * Each successive paragraph shrinks. By paragraph six the type is at the
 * lower boundary of legible. The article literally fades as it goes,
 * which is a graphic argument that the lede *is* the article.
 *
 * Honest assessment of why this is dumb: every UX heuristic says "set
 * body in 16–18px and don't break that." A reader who skims to
 * paragraph 4 because that's where the news is will be punished.
 *
 * Why we ship it anyway: journalism school *teaches* the inverted
 * pyramid. We're just rendering the structure visually. For a news brief
 * — five facts, decreasing in importance — this is honest in a way that
 * uniform body type is not.
 */
export function InvertedPyramid() {
  const a = LOREM_ARTICLE
  const sizes = [
    'clamp(1.7rem, 7vw, 2.1rem)',
    '1.45rem',
    '1.2rem',
    '1rem',
    '0.85rem',
    '0.72rem',
    '0.62rem',
  ]
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">A news brief · {a.dateline}</p>
      <h1 className="font-display italic text-twilight text-3xl leading-tight mb-6">
        {a.shortTitle}.
      </h1>

      {a.body.slice(0, 7).map((p, i) => (
        <p
          key={i}
          className={
            i === 0
              ? 'font-display italic text-ink leading-tight'
              : 'leading-snug mt-3'
          }
          style={{ fontSize: sizes[i], color: i >= 5 ? 'var(--color-ink-soft)' : undefined }}
        >
          {p}
        </p>
      ))}

      <hr className="border-sandstone/50 mt-8" />
      <p className="smallcaps mt-3" style={{ fontSize: '0.55rem' }}>
        Read whatever you got to.
      </p>
    </article>
  )
}
