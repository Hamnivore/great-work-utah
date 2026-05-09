import { LOREM_ARTICLE } from './_content'

/**
 * WOOD TYPE
 * 1880s circus broadside. The title is shattered across six lines,
 * each line a different size and weight, separated by hairlines and
 * dingbats. The type is the show; the body is an afterthought crammed
 * along the bottom edge.
 *
 * The failure on purpose: hierarchy is illegible. You can't tell which
 * word is "the title" because they're all fighting for it. That's the
 * point — like a nineteenth-century broadside, you read it slowly,
 * line by line, the way the typesetter pasted it up.
 */
export function WoodType() {
  // Each line is a "block" of wood type — different size, sometimes italic,
  // sometimes tracked, sometimes condensed-feeling.
  const lines: Array<{
    text: string
    style: React.CSSProperties
    rule?: 'thin' | 'thick' | 'double' | 'none'
  }> = [
    {
      text: 'A coil',
      style: {
        fontSize: 'clamp(2.6rem, 13vw, 3.6rem)',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        lineHeight: 0.9,
        textAlign: 'center',
        color: 'var(--color-twilight)',
      },
      rule: 'thick',
    },
    {
      text: 'OF',
      style: {
        fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.7em',
        textTransform: 'uppercase',
        textAlign: 'center',
        color: 'var(--color-ink)',
      },
      rule: 'thin',
    },
    {
      text: 'BASALT',
      style: {
        fontSize: 'clamp(3rem, 18vw, 5rem)',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.04em',
        lineHeight: 0.85,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: 'var(--color-ink)',
      },
      rule: 'double',
    },
    {
      text: 'set against the',
      style: {
        fontSize: 'clamp(0.95rem, 4vw, 1.2rem)',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        textAlign: 'center',
        color: 'var(--color-ink-soft)',
      },
      rule: 'thin',
    },
    {
      text: 'PALE BRINE',
      style: {
        fontSize: 'clamp(2.2rem, 11vw, 3.2rem)',
        fontFamily: 'var(--font-display)',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        lineHeight: 0.9,
        textAlign: 'center',
        color: 'var(--color-orange)',
      },
      rule: 'thick',
    },
    {
      text: '— and what we make of it now —',
      style: {
        fontSize: 'clamp(0.85rem, 3.6vw, 1rem)',
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        textAlign: 'center',
        color: 'var(--color-twilight)',
      },
      rule: 'none',
    },
  ]

  return (
    <article className="font-serif text-ink">
      <div className="text-center">
        <p className="smallcaps mb-1">Issued at the office of the editors</p>
        <p className="smallcaps text-twilight">Vol I · No. 014 · Winter</p>
      </div>

      <div className="rule-double-top mt-3 mb-3" />

      {lines.map((line, i) => (
        <div key={i}>
          <div style={line.style} className="px-1">
            {line.text}
          </div>
          {line.rule === 'thick' && (
            <hr className="border-twilight border-t-2 my-2" />
          )}
          {line.rule === 'thin' && (
            <hr className="border-ink/40 border-t my-2" />
          )}
          {line.rule === 'double' && (
            <>
              <hr className="border-twilight border-t-2 mt-2" />
              <hr className="border-twilight border-t my-1" />
            </>
          )}
        </div>
      ))}

      <p className="text-center my-4 text-twilight tracking-[0.6em]">❦ ❦ ❦</p>

      {/* The body, crammed at the bottom — the way a broadside works */}
      <div className="border-y border-twilight/60 py-3 mt-2 columns-2 gap-4 text-[0.78rem] leading-snug text-ink/90 text-justify hyphens-auto">
        <p>{LOREM_ARTICLE.body[0]}</p>
        <p className="mt-2">{LOREM_ARTICLE.body[1]}</p>
        <p className="mt-2">{LOREM_ARTICLE.body[6]}</p>
      </div>

      <p className="smallcaps text-center mt-3">
        Printed at Rozel Pt. — distribution gratis
      </p>
    </article>
  )
}
