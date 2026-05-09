/**
 * The same chunk of Spiral Jetty article body shown beneath every navbar
 * shape, so each prototype is judged in its actual context (a long-form
 * editorial entry) rather than against empty space.
 *
 * `bare` skips the `max-w-3xl mx-auto px-...` container so a parent layout
 * (e.g. the Marginalia variant\u2019s grid, or the Field-Notebook Spine\u2019s
 * left-rail flex) can do its own framing.
 */
interface SampleProps {
  bare?: boolean
}

export function Sample({ bare = false }: SampleProps) {
  const wrap = bare ? '' : 'max-w-3xl mx-auto px-5 sm:px-8'
  return (
    <article className={`${wrap} pt-6 pb-10 font-serif text-ink`}>
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">Spiral Jetty</h1>
      <p className="font-serif italic text-ink-soft text-lg mt-2 leading-snug">
        On entropy, Land art, and the lake.
      </p>
      <div className="mt-6 leading-loose">
        <p>
          <span className="font-display text-twilight float-left text-6xl leading-[0.85] pr-2 pt-1">R</span>
          obert Smithson directed the construction of Spiral Jetty in April 1970 at Rozel Point, on the
          eastern shore of the Great Salt Lake in Utah. He used bulldozers and trucks to move some 6,650
          tons of basalt and earth to form a 1,500-foot-long coil extending into the lake.
        </p>
        <p className="mt-3">
          Smithson was interested in entropy &mdash; the natural tendency toward disorder &mdash; and in how
          art could participate in slow processes of change.
        </p>
      </div>
    </article>
  )
}
