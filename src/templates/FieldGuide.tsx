import { LOREM_ARTICLE } from './_content'

/**
 * FIELD GUIDE
 * Structured, info-dense. Numbered sections. Metadata strip. Almost academic.
 * The "look-up reference" template.
 */
export function FieldGuide() {
  const a = LOREM_ARTICLE
  const meta = [
    ['Tier', `${a.tier} ⭐`],
    ['Domain', a.domain],
    ['Era', a.era],
    ['Location', a.location],
  ]
  return (
    <article className="font-serif text-ink">
      <p className="smallcaps mb-1">Field Guide · Entry 014</p>
      <h1 className="font-display italic text-4xl text-ink leading-tight mb-2">{a.title}</h1>
      <p className="font-serif italic text-ink-soft text-base mb-6 leading-snug">{a.deck}</p>

      <dl className="grid grid-cols-2 gap-y-3 gap-x-5 bg-pale-sky/70 rounded-md px-4 py-4 mb-8 text-sm">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="smallcaps">{k}</dt>
            <dd className="font-serif text-ink mt-0.5 leading-snug">{v}</dd>
          </div>
        ))}
      </dl>

      <Section number="01" title="What it is">
        <p className="leading-relaxed mb-3">{a.body[0]}</p>
        <p className="leading-relaxed">{a.body[1]}</p>
      </Section>

      <Section number="02" title="Why it matters">
        <p className="leading-relaxed">{a.body[2]}</p>
        <ul className="mt-3 space-y-1.5 list-disc list-inside text-base">
          <li>Lasting role in the canon of postwar Land art.</li>
          <li>Made Great Salt Lake a permanent site in art history.</li>
          <li>Model problem for stewardship of weather-changing artworks.</li>
        </ul>
      </Section>

      <Section number="03" title="The hard problem">
        <p className="leading-relaxed">{a.body[3]}</p>
      </Section>

      <Section number="04" title="Caveats">
        <p className="leading-relaxed">{a.body[4]}</p>
      </Section>

      <hr className="border-sandstone/50 my-8" />
      <p className="smallcaps mb-2">Sources</p>
      <ul className="space-y-1 font-serif italic text-sm text-twilight">
        {a.citations.map((c) => (
          <li key={c} className="underline underline-offset-3 decoration-twilight/40">
            {c}
          </li>
        ))}
      </ul>
    </article>
  )
}

function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-display italic text-twilight text-xl">{number}</span>
        <h2 className="smallcaps text-ink">{title}</h2>
        <hr className="flex-1 border-sandstone/50" />
      </div>
      {children}
    </section>
  )
}
