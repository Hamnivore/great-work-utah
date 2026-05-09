import { LOREM_ARTICLE } from './_content'

/**
 * POSTCARD
 * Small, intimate, signed. A photo at top, a short letter beneath, a stamp.
 * The "wish you were here" template — for short or unfinished entries.
 */
export function Postcard() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <div className="border border-sandstone/60 rounded-md bg-paper-deep/40 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="smallcaps">From Rozel Point, Utah</p>
          <div className="border border-sandstone/60 rounded-sm px-2 py-1 text-center bg-paper">
            <p className="font-display italic text-orange text-lg leading-none">{a.tier}</p>
            <p className="text-[8px] tracking-widest text-ink-soft mt-0.5">TIER</p>
          </div>
        </div>

        <figure className="-mx-5 mb-4">
          <img src={a.heroImage} alt="" className="w-full aspect-[5/3] object-cover" />
        </figure>

        <h1 className="font-display italic text-3xl text-twilight leading-tight mb-2">{a.title}</h1>
        <p className="font-serif italic text-ink-soft mb-4 leading-snug">{a.deck}</p>

        <p className="leading-relaxed mb-3">{a.body[0]}</p>
        <p className="leading-relaxed mb-5">{a.body[5]}</p>

        <p className="font-display italic text-xl text-twilight">— Wish you were here.</p>
        <p className="smallcaps mt-2">The editors · Vol. 1 · Winter 2026</p>
      </div>
    </article>
  )
}
