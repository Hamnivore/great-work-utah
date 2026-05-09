import { LOREM_ARTICLE } from './_content'

/**
 * PHOTO ESSAY
 * Image-led, text breathes between. Multiple full-width photos, captions in
 * italic, captions occasionally do double duty as pull quotes.
 */
export function PhotoEssay() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink">
      <p className="smallcaps mb-3">A photo essay · Great Salt Lake</p>
      <h1 className="font-display italic text-5xl text-ink leading-tight mb-3">{a.title}</h1>
      <p className="font-serif italic text-ink-soft text-lg mb-6">
        Robert Smithson, 1970 — through the lens.
      </p>

      <figure className="-mx-5 sm:mx-0 mb-3">
        <img src={a.heroImage} alt="" className="w-full aspect-[4/5] object-cover" />
      </figure>
      <p className="font-serif italic text-sm text-ink-soft mb-8">{a.heroCaption}</p>

      <p className="leading-relaxed mb-6">{a.body[0]}</p>

      <figure className="-mx-5 sm:mx-0 mb-3">
        <img src={a.images[0]} alt="" className="w-full aspect-[3/2] object-cover" />
      </figure>
      <p className="font-serif italic text-sm text-ink-soft mb-8">
        Aerial view, looking north, 1970. Photo by N. Holt.
      </p>

      <p className="leading-relaxed mb-8">{a.body[1]}</p>

      <div className="grid grid-cols-2 gap-1.5 -mx-5 sm:mx-0 mb-3">
        <img src={a.images[1]} alt="" className="w-full aspect-square object-cover" />
        <img src={a.images[2]} alt="" className="w-full aspect-square object-cover" />
      </div>
      <p className="font-serif italic text-sm text-ink-soft mb-8">
        Morning light, 1971. <span className="ml-3">Salt encrustation, 1971.</span>
      </p>

      <p className="leading-relaxed mb-8">{a.body[2]}</p>

      <figure className="-mx-5 sm:mx-0 mb-3">
        <img src={a.images[3]} alt="" className="w-full aspect-[3/2] object-cover" />
      </figure>
      <p className="font-display italic text-twilight text-xl leading-snug mb-1">
        “At times the lake rises and the coil disappears. At times it reappears, rimmed with salt.”
      </p>
      <p className="smallcaps text-twilight mb-8">— Caption-as-pull-quote</p>

      <p className="leading-relaxed">{a.body[3]}</p>

      <hr className="border-sandstone/50 my-10" />
      <p className="smallcaps mb-2">Photographs</p>
      <p className="font-serif italic text-sm text-ink-soft">
        All photographs by Nancy Holt, 1970–1971. Courtesy Holt/Smithson Foundation and Utah Museum of Fine Arts.
      </p>
    </article>
  )
}
