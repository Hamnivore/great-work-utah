import { LOREM_ARTICLE } from './_content'

/**
 * GUTTER
 * The image lives in the gutter — literally between paragraphs. On
 * mobile, that means a full-bleed plate splits the column in half, with
 * its caption running across the lower edge of the image like a film
 * still. On desktop, a tall portrait floats centered with body wrapping
 * narrowly around it.
 *
 * The mistake on purpose: caption set in display italic at twice the
 * size of the body. The image and its caption are the loudest objects
 * on the page; the prose can afford to be quiet.
 */
export function Gutter() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-2">A reading · The Jetty</p>
      <h1 className="font-display italic text-ink text-4xl leading-tight mb-3">
        {a.title}
      </h1>
      <p className="font-serif italic text-twilight-soft mb-7 leading-snug">{a.deck}</p>

      <p className="leading-relaxed">{a.body[0]}</p>
      <p className="leading-relaxed mt-4">{a.body[1]}</p>

      {/* The gutter — full bleed, tall, caption hangs over the lower edge */}
      <figure className="-mx-5 sm:-mx-12 my-10 relative">
        <img
          src={a.images[4]}
          alt=""
          className="w-full aspect-[3/4] sm:aspect-[4/3] object-cover"
        />
        <figcaption
          className="font-display italic text-paper leading-snug absolute left-5 right-5 bottom-5 sm:left-10 sm:right-10 sm:bottom-7"
          style={{
            fontSize: 'clamp(1.05rem, 4.5vw, 1.4rem)',
            textShadow: '0 1px 12px rgba(20, 14, 10, 0.6)',
          }}
        >
          The lake decides whether the work exists today, and the work decides nothing back.
        </figcaption>
      </figure>

      <p className="leading-relaxed">{a.body[2]}</p>
      <p className="leading-relaxed mt-4">{a.body[3]}</p>

      {/* A second image, this time set inside the column with a long caption */}
      <figure className="my-8">
        <img
          src={a.images[5]}
          alt=""
          className="w-full aspect-[3/2] object-cover"
        />
        <figcaption className="font-serif italic text-ink-soft text-sm mt-2 leading-relaxed">
          The basalt at the foot of the spiral, photographed at midday — at this
          angle the curve disappears entirely and the work refuses to be itself.
        </figcaption>
      </figure>

      <p className="leading-relaxed">{a.body[6]}</p>

      <p className="ornament mt-10">— ❦ —</p>

      <p className="smallcaps mb-2">Photographed by</p>
      <p className="font-serif italic text-twilight">Nancy Holt, July 1970.</p>
    </article>
  )
}
