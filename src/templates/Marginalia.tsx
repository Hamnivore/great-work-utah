import { LOREM_ARTICLE } from './_content'

/**
 * MARGINALIA
 * Tufte-flavored. Body in a generous central column. Figures and notes
 * live in the right "margin" — on desktop, literally to the right; on
 * mobile, inline as italic asides flanked by hairline rules so they
 * still read like *notes*, not body.
 *
 * The mistake on purpose: a fig. caption is given full italic display
 * weight equal to the body — captions earn the same dignity as text.
 */
export function Marginalia() {
  const a = LOREM_ARTICLE
  const [fig1, fig2, note1, note2] = a.margins
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">Field notes · §03</p>
      <h1 className="font-display italic text-twilight text-4xl leading-tight mb-3">
        {a.title}
      </h1>
      <p className="font-serif italic text-ink-soft text-lg mb-8 leading-snug">
        {a.deck}
      </p>

      <p className="leading-relaxed">{a.body[0]}</p>

      {/* Figure 1 — inline aside on mobile */}
      {'figure' in fig1 && (
        <aside className="my-7 border-y border-sandstone/40 py-4">
          <figure>
            <img src={fig1.figure} alt="" className="w-full aspect-[5/3] object-cover" />
            <figcaption className="font-display italic text-twilight text-lg leading-snug mt-3">
              {fig1.caption}
            </figcaption>
          </figure>
        </aside>
      )}

      <p className="leading-relaxed mt-4">{a.body[1]}</p>
      <p className="leading-relaxed mt-4">{a.body[2]}</p>

      {/* Note 1 — pure typographic margin */}
      {'note' in note1 && (
        <aside className="my-6 pl-4 border-l border-twilight/40">
          <p className="smallcaps mb-1">Note</p>
          <p className="font-serif italic text-twilight leading-snug">{note1.note}</p>
        </aside>
      )}

      <p className="leading-relaxed mt-4">{a.body[3]}</p>

      {/* Figure 2 */}
      {'figure' in fig2 && (
        <aside className="my-7 border-y border-sandstone/40 py-4">
          <figure>
            <img src={fig2.figure} alt="" className="w-full aspect-square object-cover" />
            <figcaption className="font-display italic text-twilight text-lg leading-snug mt-3">
              {fig2.caption}
            </figcaption>
          </figure>
        </aside>
      )}

      <p className="leading-relaxed mt-4">{a.body[4]}</p>

      {/* Note 2 */}
      {'note' in note2 && (
        <aside className="my-6 pl-4 border-l border-twilight/40">
          <p className="smallcaps mb-1">See also</p>
          <p className="font-serif italic text-twilight leading-snug">{note2.note}</p>
        </aside>
      )}

      <p className="leading-relaxed mt-4">{a.body[6]}</p>

      <hr className="border-sandstone/50 my-10" />
      <p className="smallcaps mb-3">Citations</p>
      <ol className="font-serif italic text-twilight space-y-1 text-sm leading-relaxed list-decimal list-inside">
        {a.citations.map((c) => (
          <li key={c} className="underline underline-offset-3 decoration-twilight/40">
            {c}
          </li>
        ))}
      </ol>
    </article>
  )
}
