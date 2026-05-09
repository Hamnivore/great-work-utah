import { LOREM_ARTICLE } from './_content'

/**
 * DISPATCH
 * A letter from the field. Dateline anchored at top-left, postcard stamp
 * tilted in the top-right corner, "Dear reader," opening, body in
 * letter-style ragged-right columns, italic sign-off. A small postmark
 * stamps the bottom.
 *
 * The mistake on purpose: the postcard stamp is rotated and slightly
 * larger than it should be — like a real stamp licked on by a hand.
 */
export function Dispatch() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      {/* Top strip: dateline + tilted stamp */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <p className="smallcaps">From the field</p>
          <p className="font-serif italic text-twilight text-base leading-snug mt-0.5">
            {a.dateline}
          </p>
        </div>
        <div
          className="scrap-tilt-right border border-twilight/60 bg-paper-deep px-2 py-1.5 text-center shrink-0"
          style={{ width: 64 }}
        >
          <p className="smallcaps text-[0.55rem] tracking-[0.2em]">Utah</p>
          <p className="font-display italic text-orange text-2xl leading-none mt-0.5">
            {a.tier}
          </p>
          <p className="smallcaps text-[0.55rem] tracking-[0.2em] mt-0.5">post</p>
        </div>
      </div>

      <hr className="border-sandstone/50 mb-6" />

      {/* Greeting */}
      <p className="font-display italic text-twilight text-3xl leading-tight mb-1">
        Dear reader,
      </p>
      <p className="font-serif italic text-ink-soft mb-6 leading-snug">
        a few notes from the causeway, before the light goes.
      </p>

      {/* Body, ragged-right, hand-letter feel */}
      <p className="leading-loose">{a.body[0]}</p>
      <p className="leading-loose mt-4">{a.body[5]}</p>

      {/* A small inline scrap of imagery — taped in */}
      <figure className="my-7 scrap-tilt-left">
        <img
          src={a.images[2]}
          alt=""
          className="w-full aspect-[4/3] object-cover border-4 border-paper-deep"
          style={{
            boxShadow:
              '0 1px 0 0 rgba(42,31,24,0.06), 0 18px 28px -16px rgba(42,31,24,0.4)',
          }}
        />
        <figcaption className="font-serif italic text-sm text-ink-soft mt-3">
          The Jetty, before the wind picked up. — Polaroid taped here.
        </figcaption>
      </figure>

      <p className="leading-loose">{a.body[2]}</p>
      <p className="leading-loose mt-4">{a.body[6]}</p>

      {/* Sign-off */}
      <div className="mt-10">
        <p className="font-display italic text-twilight text-2xl leading-tight">
          Yours, from the salt,
        </p>
        <p className="font-display italic text-twilight text-3xl leading-tight mt-2">
          — the editors
        </p>
      </div>

      {/* Postmark */}
      <div className="mt-10 flex justify-end">
        <div
          className="scrap-tilt-left border-2 border-twilight/60 rounded-full px-3 py-2 text-center"
          style={{ borderStyle: 'dashed' }}
        >
          <p className="smallcaps text-[0.55rem] tracking-[0.22em] text-twilight">
            Posted
          </p>
          <p className="font-display italic text-twilight text-sm leading-none mt-0.5">
            Rozel Pt.
          </p>
          <p className="smallcaps text-[0.55rem] tracking-[0.22em] text-twilight mt-0.5">
            Jul 12
          </p>
        </div>
      </div>
    </article>
  )
}
