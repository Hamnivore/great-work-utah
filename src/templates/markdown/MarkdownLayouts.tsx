/**
 * Markdown-driven layout renderers.
 *
 * Each function takes a `ParsedEntry` (the result of `parseEntryMarkdown`)
 * and returns JSX. The agent declares a `**Layout:** id` field in the
 * markdown; this file maps `id` to the matching renderer.
 *
 * These are *parallel* to the lorem-ipsum templates in `src/templates/`.
 * The lorem versions exist to design the typography in isolation; these
 * versions consume real wiki data. Same visual language, different inputs.
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  META_DISPLAY_ORDER,
  type ParsedEntry,
} from '../../lib/parseEntryMarkdown'

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Get a section by case-insensitive heading match. */
function section(entry: ParsedEntry, ...names: string[]): string | undefined {
  for (const name of names) {
    const found = entry.sections.find(
      (s) => s.heading.toLowerCase() === name.toLowerCase(),
    )
    if (found?.body) return found.body
  }
  return undefined
}

/** First sentence of a body of prose. */
function firstSentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^.+?[.!?](?:\s|$)/)
  return (m ? m[0] : cleaned).trim()
}

/** Render a small bold-prefix metadata strip from the entry's meta. */
function MetaStrip({ entry }: { entry: ParsedEntry }) {
  const visible = META_DISPLAY_ORDER.filter((k) => entry.meta[k])
  if (!visible.length) return null
  return (
    <dl className="grid grid-cols-2 gap-y-3 gap-x-5 bg-pale-sky/70 rounded-md px-4 py-4 mb-8 text-sm">
      {visible.map((k) => (
        <div key={k}>
          <dt className="smallcaps">{k}</dt>
          <dd className="font-serif text-ink mt-0.5 leading-snug">
            {entry.meta[k]}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Renders a single section's body as markdown prose. */
function Body({ markdown }: { markdown: string }) {
  return (
    <div className="prose-editorial leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}

// ----------------------------------------------------------------------
// 1. cover-story
// ----------------------------------------------------------------------

function CoverStory({ entry }: { entry: ParsedEntry }) {
  const focus = entry.meta['Focus']
  return (
    <article className="font-serif text-ink editorial -mx-5 sm:mx-0">
      <div className="px-5 sm:px-0 pt-2">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className="font-display italic text-twilight leading-none"
            style={{ fontSize: 'clamp(2.6rem, 14vw, 3.8rem)' }}
          >
            Obscura
          </p>
          <p className="smallcaps text-right">
            {entry.meta['Era'] ?? entry.meta['Stage'] ?? ''}
          </p>
        </div>
        <p className="smallcaps mt-2 tracking-[0.32em]">
          {focus ? `${focus} · ` : ''}Great Work · Utah
        </p>
        <hr className="border-twilight/60 mt-3" />
      </div>

      {(entry.portrait || entry.hero) && (
        <figure className="mt-4">
          <img
            src={entry.portrait ?? entry.hero}
            alt=""
            className="w-full aspect-[3/4] object-cover"
          />
        </figure>
      )}

      <div className="px-5 sm:px-0 mt-6">
        <p className="smallcaps mb-3">{entry.meta['Status'] ?? 'A profile'}</p>
        <p
          className="font-display italic text-ink leading-[1.05]"
          style={{ fontSize: 'clamp(1.7rem, 7.5vw, 2.2rem)' }}
        >
          {entry.pull ? entry.pull : `“${entry.title}.”`}
        </p>
        <p className="smallcaps mt-3">— {entry.title}</p>
      </div>

      <div className="px-5 sm:px-0 mt-10">
        <hr className="border-twilight/60" />
        <div className="flex items-center justify-between text-[0.7rem] tracking-[0.18em] uppercase font-sans text-twilight-soft pt-2">
          <span>The Great Work</span>
          <span>{entry.meta['Location'] ?? 'Utah'}</span>
        </div>
      </div>
    </article>
  )
}

// ----------------------------------------------------------------------
// 2. caption-only
// ----------------------------------------------------------------------

function CaptionOnlyMd({ entry }: { entry: ParsedEntry }) {
  const captions = entry.captions ?? []
  return (
    <article className="font-serif text-ink editorial -mx-5 sm:mx-0">
      <div className="px-5 sm:px-0 mb-6">
        <p className="smallcaps">A story in {captions.length} captions</p>
        <p className="font-display italic text-twilight text-2xl leading-snug mt-2">
          {entry.title}
        </p>
      </div>

      {captions.length === 0 && (
        <p className="px-5 sm:px-0 font-serif italic text-ink-soft">
          The agent picked caption-only but didn&rsquo;t include a `## Captions`
          section. Falling back to the entry&rsquo;s text.
        </p>
      )}

      {captions.map((c, i) => (
        <div key={i} className={i === 0 ? '' : 'mt-8'}>
          <img
            src={c.src}
            alt={c.alt ?? ''}
            className={`w-full object-cover ${
              i === 0 ? 'aspect-[4/3]' : i % 2 === 0 ? 'aspect-square' : 'aspect-[3/2]'
            }`}
          />
          <p
            className="font-display italic text-ink leading-snug mt-3 px-5 sm:px-0"
            style={{ fontSize: 'clamp(1.05rem, 4.6vw, 1.35rem)' }}
          >
            {c.text}
          </p>
        </div>
      ))}

      <div className="px-5 sm:px-0 mt-10">
        <hr className="border-sandstone/50" />
        <p className="smallcaps mt-3">— That is the article.</p>
      </div>
    </article>
  )
}

// ----------------------------------------------------------------------
// 3. magazine
// ----------------------------------------------------------------------

function Magazine({ entry }: { entry: ParsedEntry }) {
  const summary = section(entry, 'Summary', 'Overview')
  const why = section(entry, 'Why It Matters', 'Why It Mattered', 'Impact')
  const others = entry.sections.filter(
    (s) =>
      !/^(summary|overview|why it matters|why it mattered|impact|captions)$/i.test(
        s.heading,
      ),
  )
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-3">{entry.meta['Focus'] ?? 'Long read'}</p>
      <h1
        className="font-display italic text-ink leading-[0.95] mb-4"
        style={{ fontSize: '3.25rem' }}
      >
        {entry.title}
      </h1>
      {entry.pull && (
        <p className="font-display italic text-twilight text-2xl leading-snug mb-5">
          {entry.pull}
        </p>
      )}
      <p className="smallcaps mb-6">
        {entry.meta['Status'] ?? 'Draft'} · {entry.meta['Updated'] ?? ''}{' '}
        {entry.meta['Location'] ? `· ${entry.meta['Location']}` : ''}
      </p>

      {entry.hero && (
        <figure className="-mx-5 sm:mx-0 mb-6">
          <img
            src={entry.hero}
            alt=""
            className="w-full aspect-[3/2] object-cover"
          />
          {entry.heroCaption && (
            <figcaption className="font-serif italic text-sm text-ink-soft mt-2 px-5 sm:px-0">
              {entry.heroCaption}
            </figcaption>
          )}
        </figure>
      )}

      {summary && (
        <div className="leading-relaxed first-letter:font-display first-letter:italic first-letter:text-6xl first-letter:text-twilight first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.9]">
          <Body markdown={summary} />
        </div>
      )}

      {why && (
        <blockquote className="my-10 bg-sky/60 border-l-4 border-twilight rounded-r-md px-6 py-5">
          <p className="smallcaps mb-2">Why it matters</p>
          <p className="font-display italic text-2xl sm:text-3xl text-twilight leading-snug">
            {firstSentence(why)}
          </p>
        </blockquote>
      )}

      {others.map((s) => (
        <section key={s.heading} className="mt-8">
          <h2 className="font-display text-2xl text-twilight mb-3">{s.heading}</h2>
          <Body markdown={s.body} />
        </section>
      ))}
    </article>
  )
}

// ----------------------------------------------------------------------
// 4. field-guide
// ----------------------------------------------------------------------

function FieldGuideMd({ entry }: { entry: ParsedEntry }) {
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">Field Guide</p>
      <h1 className="font-display italic text-4xl text-ink leading-tight mb-2">
        {entry.title}
      </h1>
      {entry.meta['Focus'] && (
        <p className="font-serif italic text-ink-soft mb-6 leading-snug">
          {entry.meta['Focus']}
        </p>
      )}
      <MetaStrip entry={entry} />

      {entry.sections.map((s, i) => (
        <section key={s.heading} className="mt-8">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-display italic text-twilight text-xl">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="smallcaps text-ink">{s.heading}</h2>
            <hr className="flex-1 border-sandstone/50" />
          </div>
          <Body markdown={s.body} />
        </section>
      ))}
    </article>
  )
}

// ----------------------------------------------------------------------
// 5. marginalia
// ----------------------------------------------------------------------

function MarginaliaMd({ entry }: { entry: ParsedEntry }) {
  const notes = entry.marginNotes ?? []
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">Field notes</p>
      <h1 className="font-display italic text-twilight text-4xl leading-tight mb-3">
        {entry.title}
      </h1>
      {entry.meta['Audience'] && (
        <p className="font-serif italic text-ink-soft text-lg mb-8 leading-snug">
          For {entry.meta['Audience'].toLowerCase()}.
        </p>
      )}

      {entry.sections.map((s, idx) => {
        const sectionNotes = notes.filter((n) => n.sectionIndex === idx)
        return (
          <section key={s.heading} className="mt-8">
            <h2 className="font-display text-2xl text-twilight mb-3">
              {s.heading}
            </h2>
            <Body markdown={s.body} />
            {sectionNotes.map((n, i) => (
              <aside
                key={i}
                className="my-6 pl-4 border-l border-twilight/40"
              >
                <p className="smallcaps mb-1">Note</p>
                <div className="font-serif italic text-twilight leading-snug">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {n.body}
                  </ReactMarkdown>
                </div>
              </aside>
            ))}
          </section>
        )
      })}
    </article>
  )
}

// ----------------------------------------------------------------------
// 6. postcard
// ----------------------------------------------------------------------

function PostcardMd({ entry }: { entry: ParsedEntry }) {
  const summary = section(entry, 'Summary', 'Overview')
  return (
    <article className="font-serif text-ink editorial">
      <div className="border border-sandstone/60 rounded-md bg-paper-deep/40 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="smallcaps">
            From {entry.meta['Location'] ?? 'Utah'}
          </p>
          <p className="smallcaps">
            {entry.meta['Updated'] ?? ''}
          </p>
        </div>

        {entry.hero && (
          <figure className="-mx-5 mb-4">
            <img
              src={entry.hero}
              alt=""
              className="w-full aspect-[5/3] object-cover"
            />
          </figure>
        )}

        <h1 className="font-display italic text-3xl text-twilight leading-tight mb-3">
          {entry.title}
        </h1>

        {summary && (
          <div className="leading-relaxed">
            <Body markdown={summary} />
          </div>
        )}

        <p className="font-display italic text-xl text-twilight mt-5">
          — Wish you were here.
        </p>
      </div>
    </article>
  )
}

// ----------------------------------------------------------------------
// 7. manifesto
// ----------------------------------------------------------------------

function ManifestoMd({ entry }: { entry: ParsedEntry }) {
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-3">A manifesto</p>
      <h1
        className="font-display italic text-ink leading-[0.9] mb-12"
        style={{ fontSize: 'clamp(2.6rem, 13vw, 4.5rem)' }}
      >
        {entry.title}.
      </h1>

      <div className="space-y-10">
        {entry.sections.map((s, i) => (
          <div key={s.heading}>
            <p
              className={`leading-snug ${
                i % 2 === 1
                  ? 'font-display italic text-twilight'
                  : 'text-ink'
              }`}
              style={{ fontSize: 'clamp(1.25rem, 5vw, 1.6rem)' }}
            >
              {firstSentence(s.body)}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-twilight/30 mt-16 mb-4 w-1/3" />
      <p className="font-display italic text-twilight text-xl">— The editors</p>
    </article>
  )
}

// ----------------------------------------------------------------------
// 8. erasure
// ----------------------------------------------------------------------

function redactParagraph(text: string, seed: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const visible = new Set<number>()
  const r = (n: number) => {
    const x = Math.sin(seed * 91.13 + n * 13.7) * 10000
    return x - Math.floor(x)
  }
  words.forEach((w, i) => {
    const len = w.replace(/[^A-Za-z]/g, '').length
    const odds = len <= 4 ? 0.32 : len <= 7 ? 0.18 : 0.1
    if (r(i) < odds) visible.add(i)
  })
  visible.add(0)
  const runs: Array<{ kind: 'word' | 'bar'; content: string }> = []
  let bar = ''
  for (let i = 0; i < words.length; i++) {
    if (visible.has(i)) {
      if (bar) {
        runs.push({ kind: 'bar', content: bar })
        bar = ''
      }
      runs.push({ kind: 'word', content: words[i] })
    } else {
      bar += (bar ? ' ' : '') + words[i]
    }
  }
  if (bar) runs.push({ kind: 'bar', content: bar })
  return runs
}

function ErasureMd({ entry }: { entry: ParsedEntry }) {
  // Flatten all section bodies into ordered paragraphs.
  const paragraphs: Array<{ heading: string; text: string; seed: number }> = []
  let seed = 0
  for (const s of entry.sections) {
    const paras = s.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    paras.forEach((p) => {
      paragraphs.push({ heading: s.heading, text: p, seed: seed++ })
    })
  }

  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-2">An erasure · {entry.meta['Updated'] ?? ''}</p>
      <h1
        className="font-display italic text-twilight leading-tight mb-2"
        style={{ fontSize: 'clamp(2rem, 9vw, 2.6rem)' }}
      >
        {entry.title}
      </h1>
      <p className="font-serif italic text-ink-soft mb-8 leading-snug">
        from a longer source. the rest is for you.
      </p>

      <div className="space-y-5 leading-loose">
        {paragraphs.slice(0, 6).map((p, i) => (
          <p key={i}>
            {redactParagraph(p.text, p.seed).map((run, j) =>
              run.kind === 'word' ? (
                <span key={j}>
                  {j === 0 ? '' : ' '}
                  {run.content}
                </span>
              ) : (
                <span
                  key={j}
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    background: 'var(--color-ink)',
                    color: 'var(--color-ink)',
                    margin: '0 3px',
                    padding: '0 4px',
                    borderRadius: 1,
                    userSelect: 'none',
                    transform: 'translateY(2px)',
                  }}
                >
                  {run.content}
                </span>
              ),
            )}
          </p>
        ))}
      </div>

      <hr className="border-sandstone/50 mt-10" />
      <p className="smallcaps mt-3">
        Redacted from {entry.meta['Focus'] ?? 'the original source'}, {entry.meta['Updated'] ?? ''}.
      </p>
    </article>
  )
}

// ----------------------------------------------------------------------
// Default — used when no Layout declared, or as auto-pick fallback.
// ----------------------------------------------------------------------

function DefaultLongRead({ entry }: { entry: ParsedEntry }) {
  return (
    <article className="font-serif text-ink editorial prose-editorial">
      <p className="smallcaps">{entry.meta['Focus'] ?? entry.meta['Status'] ?? ''}</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mt-1 mb-6">
        {entry.title}
      </h1>
      <MetaStrip entry={entry} />
      {entry.sections.map((s) => (
        <section key={s.heading} className="mt-8">
          <h2 className="font-display text-2xl text-twilight mb-3">
            {s.heading}
          </h2>
          <Body markdown={s.body} />
        </section>
      ))}
    </article>
  )
}

// ----------------------------------------------------------------------
// Auto-pick: if the agent didn't declare a layout, sniff the entry shape.
// ----------------------------------------------------------------------

export function autoPickLayout(entry: ParsedEntry): string {
  if (entry.captions && entry.captions.length >= 3) return 'caption-only'
  if (entry.marginNotes && entry.marginNotes.length > 0) return 'marginalia'
  const totalWords = entry.sections.reduce(
    (n, s) => n + s.body.split(/\s+/).length,
    0,
  )
  if (totalWords < 250 && entry.hero) return 'postcard'
  if (entry.hero && (entry.pull || section(entry, 'Why It Matters', 'Why It Mattered', 'Impact'))) return 'magazine'
  if (entry.sections.length >= 5) return 'field-guide'
  return 'default'
}

// ----------------------------------------------------------------------
// Public registry
// ----------------------------------------------------------------------

export const MARKDOWN_LAYOUTS: Record<
  string,
  React.ComponentType<{ entry: ParsedEntry }>
> = {
  'cover-story': CoverStory,
  'caption-only': CaptionOnlyMd,
  magazine: Magazine,
  'field-guide': FieldGuideMd,
  marginalia: MarginaliaMd,
  postcard: PostcardMd,
  manifesto: ManifestoMd,
  erasure: ErasureMd,
  default: DefaultLongRead,
}

export function MarkdownLayout({ entry }: { entry: ParsedEntry }) {
  const id = entry.layout ?? autoPickLayout(entry)
  const Component = MARKDOWN_LAYOUTS[id] ?? MARKDOWN_LAYOUTS.default
  return <Component entry={entry} />
}
