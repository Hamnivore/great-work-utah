import { Layout } from '../components/Layout'
import { TEMPLATES, type TemplateMeta } from '../templates'

/**
 * /templates — A showroom for the article templates.
 *
 * The page is split in two: a "Designer newspaper" section of templates
 * we'd actually ship, and a "Trash heap" section of non-consensus
 * experiments that are mostly bad on purpose. The premise: great work
 * is non-consensus, and the only way to find it is to put out a lot of
 * trash too.
 *
 * Mobile-first: each template renders inside a phone-frame so designers
 * see a true mobile preview while sitting at desktop. On a phone, the
 * frame loses its bezel and the templates read as articles.
 */
export function TemplatesPage() {
  const ship = TEMPLATES.filter((t) => !t.experimental)
  const trash = TEMPLATES.filter((t) => t.experimental)

  return (
    <Layout backLabel="Home" backTo="/">
      <header className="mb-10">
        <p className="smallcaps">A showroom · {TEMPLATES.length} templates</p>
        <h1
          className="font-display italic text-twilight leading-[0.95] mt-2"
          style={{ fontSize: 'clamp(2.4rem, 11vw, 3.4rem)' }}
        >
          Mobile-first reads, designer newspaper.
        </h1>
        <p className="font-display italic text-ink-soft text-xl leading-snug mt-3">
          Same lorem ipsum, {TEMPLATES.length} ways — {ship.length} we&rsquo;d
          ship, {trash.length} from the trash heap.
        </p>
      </header>

      {/* Jump-to index */}
      <nav className="mb-14">
        <p className="smallcaps mb-3">Jump to · the ones we&rsquo;d ship</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
          {ship.map((t) => (
            <JumpLink key={t.id} t={t} />
          ))}
        </ul>
        <p className="smallcaps mb-3">Jump to · the trash heap</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {trash.map((t) => (
            <JumpLink key={t.id} t={t} />
          ))}
        </ul>
      </nav>

      {/* SECTION 1 — what we'd ship */}
      <SectionHeader
        kicker="Section one"
        title="Templates we&rsquo;d ship."
        body="Editorial moves with one mistake on purpose. Each one would survive a magazine art director."
      />
      <ul className="space-y-20">
        {ship.map((t, i) => (
          <li key={t.id} id={t.id} className="scroll-mt-20">
            <TemplateBlock meta={t} index={i + 1} total={ship.length} />
          </li>
        ))}
      </ul>

      {/* SECTION 2 — the trash heap */}
      <div className="my-20">
        <hr className="border-twilight" />
        <hr className="border-twilight mt-1" />
      </div>
      <SectionHeader
        kicker="Section two · the trash heap"
        title="Things people don&rsquo;t do, usually for good reason."
        body="First-principles experiments. Most of these are bad. A few might be great. The only way to find the great one is to ship the pile and look at it."
      />

      <ul className="space-y-20">
        {trash.map((t, i) => (
          <li key={t.id} id={t.id} className="scroll-mt-20">
            <TemplateBlock meta={t} index={i + 1} total={trash.length} trash />
          </li>
        ))}
      </ul>

      <p className="ornament mt-24">— ❦ —</p>
      <p className="font-serif italic text-center text-ink-soft leading-relaxed">
        Great work is non-consensus.
        <br />
        Most non-consensus is trash.
        <br />
        That is the deal.
      </p>
    </Layout>
  )
}

function JumpLink({ t }: { t: TemplateMeta }) {
  return (
    <li>
      <a
        href={`#${t.id}`}
        className="font-serif italic text-twilight underline decoration-twilight/30 underline-offset-4 hover:text-orange transition-colors"
      >
        {t.name}
      </a>
    </li>
  )
}

function SectionHeader({
  kicker,
  title,
  body,
}: {
  kicker: string
  title: string
  body: string
}) {
  return (
    <header className="mb-12">
      <p className="smallcaps">{kicker}</p>
      <h2
        className="font-display italic text-ink leading-[0.95] mt-2"
        style={{ fontSize: 'clamp(2rem, 9vw, 2.7rem)' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="font-serif italic text-twilight text-lg leading-snug mt-3 max-w-prose">
        {body}
      </p>
      <hr className="border-twilight/40 mt-6" />
    </header>
  )
}

function TemplateBlock({
  meta,
  index,
  total,
  trash = false,
}: {
  meta: TemplateMeta
  index: number
  total: number
  trash?: boolean
}) {
  const { name, blurb, move, whyDumb, Component } = meta
  return (
    <section>
      {/* Caption */}
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <p className="smallcaps">
          {trash ? 'Experiment' : '№'} {String(index).padStart(2, '0')} /{' '}
          {String(total).padStart(2, '0')}
        </p>
        <p className="smallcaps text-twilight">— {meta.id}</p>
      </div>
      <h2
        className="font-display italic text-ink leading-[1] mb-2"
        style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)' }}
      >
        {name}
      </h2>
      <p className="font-serif italic text-ink-soft leading-snug">{blurb}</p>
      <p className="font-serif italic text-twilight leading-snug mt-1">
        <span className="smallcaps not-italic mr-2">The move</span>
        {move}
      </p>
      {whyDumb && (
        <p className="font-serif italic text-orange/90 leading-snug mt-1">
          <span className="smallcaps not-italic mr-2 text-orange">Why it&rsquo;s dumb</span>
          {whyDumb}
        </p>
      )}
      <hr className="border-sandstone/40 mt-5 mb-7" />

      {/* Phone frame */}
      <div className="flex justify-center">
        <div className="phone-frame">
          <div className="phone-scroll editorial">
            <Component />
          </div>
        </div>
      </div>
    </section>
  )
}
