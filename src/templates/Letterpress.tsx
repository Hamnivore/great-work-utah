import { LOREM_ARTICLE } from './_content'

/**
 * LETTERPRESS / BROADSIDE
 * Tracked all-caps title. Central ornaments and rules. Justified body.
 * Old-style. The "this should be printed on heavy paper" template.
 */
export function Letterpress() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink text-center">
      <p className="smallcaps mb-2">Broadside · No. 014</p>

      <hr className="border-twilight border-t-2 border-b-1 border-double mt-2 mb-2" />
      <p
        className="font-display text-twilight"
        style={{
          fontVariant: 'small-caps',
          letterSpacing: '0.18em',
          fontSize: '2.5rem',
          lineHeight: 1,
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        {a.title}
      </p>
      <hr className="border-twilight border-t-1 border-b-2 border-double mt-2 mb-6" />

      <p className="font-display italic text-twilight text-xl leading-snug mb-1">
        {a.deck}
      </p>

      <p className="text-center my-5 text-twilight tracking-widest">— ❦ —</p>

      <div className="text-left">
        <p className="text-justify hyphens-auto leading-loose first-letter:font-display first-letter:italic first-letter:text-5xl first-letter:text-twilight first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.9]">
          {a.body[0]}
        </p>
        {a.body.slice(1, 4).map((p, i) => (
          <p key={i} className="text-justify hyphens-auto leading-loose mt-4 indent-6">
            {p}
          </p>
        ))}
      </div>

      <p className="text-center my-6 text-twilight tracking-widest">— ❦ —</p>

      <p className="font-display italic text-twilight text-2xl leading-snug px-3">
        {a.pullQuote}
      </p>
      <p className="smallcaps mt-3">— {a.pullQuoteAttr}</p>

      <p className="text-center my-6 text-twilight tracking-widest">— ❦ —</p>

      <div className="text-left">
        {a.body.slice(4).map((p, i) => (
          <p key={i} className="text-justify hyphens-auto leading-loose mt-4 indent-6">
            {p}
          </p>
        ))}
      </div>

      <hr className="border-twilight border-t-2 border-b-1 border-double mt-10 mb-2" />
      <p className="smallcaps mb-2">Printed at the office of the editors</p>
      <hr className="border-twilight border-t-1 border-b-2 border-double mt-2" />
    </article>
  )
}
