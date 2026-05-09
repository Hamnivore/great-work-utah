import { LOREM_ARTICLE } from './_content'

/**
 * CONTENTS
 * The "in this issue" page. Numbered entries, each with a kicker, a
 * Caslon-italic title, an italic blurb, and a folio (page number) that
 * floats far right. Hairline rules between. End ornament.
 *
 * Mobile-first: rows stack with their numbers oversized in the gutter so
 * the eye walks down them like a real contents page.
 */
export function Contents() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      <div className="text-center mb-10">
        <p className="smallcaps">{a.issue}</p>
        <h1
          className="font-display italic text-twilight leading-none mt-2"
          style={{ fontSize: 'clamp(2.4rem, 12vw, 3.2rem)' }}
        >
          In this issue
        </h1>
        <hr className="border-sandstone/50 w-12 mx-auto mt-5" />
      </div>

      <ul className="divide-y divide-sandstone/35">
        {a.contents.map((c) => (
          <li key={c.no} className="py-5 first:pt-0 last:pb-0">
            <div className="flex items-baseline gap-4">
              <span
                className="font-display italic text-twilight leading-none shrink-0"
                style={{ fontSize: 'clamp(2rem, 9vw, 2.5rem)' }}
              >
                {c.no}
              </span>
              <div className="flex-1 min-w-0">
                <p className="smallcaps">{c.kicker}</p>
                <p className="font-display italic text-ink text-2xl leading-tight mt-0.5">
                  {c.title}
                </p>
                <p className="font-serif italic text-ink-soft mt-1.5 leading-snug">
                  {c.blurb}
                </p>
              </div>
              <span className="font-display italic text-twilight text-lg shrink-0">
                p.{c.page}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="ornament mt-12">❦ ❦ ❦</p>

      <p className="font-serif italic text-center text-ink-soft text-sm leading-relaxed">
        Plus dispatches from Bingham Canyon,
        <br />a love letter to the Sun Tunnels,
        <br />and the editors&rsquo; reading list.
      </p>
    </article>
  )
}
