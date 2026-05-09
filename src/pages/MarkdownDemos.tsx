import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { parseEntryMarkdown, type ParsedEntry } from '../lib/parseEntryMarkdown'
import {
  MarkdownLayout,
  autoPickLayout,
} from '../templates/markdown/MarkdownLayouts'

/**
 * /templates/from-markdown — Live demonstration of the wiki layout
 * convention.
 *
 * Each `.md` file in `docs/wiki-layout-demos/` is loaded as raw text by
 * Vite (`?raw`), parsed by `parseEntryMarkdown`, and rendered through
 * the layout the markdown declares with `**Layout:**` (or auto-picked if
 * absent).
 *
 * The point: the agent writes plain markdown. The renderer does the rest.
 * Same content + different `**Layout:**` value = different feeling article.
 */

// Vite glob imports — pulled in at build time as raw strings.
const RAW_FILES = import.meta.glob<string>('/docs/wiki-layout-demos/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

interface Demo {
  filename: string
  entry: ParsedEntry
  /** Was the layout explicitly declared in markdown, or auto-picked? */
  source: 'declared' | 'auto-picked'
  resolvedLayout: string
}

function loadDemos(): Demo[] {
  const out: Demo[] = []
  for (const [path, raw] of Object.entries(RAW_FILES)) {
    const filename = path.split('/').pop() ?? path
    const entry = parseEntryMarkdown(raw)
    if (!entry) continue
    const declared = entry.layout
    const resolved = declared ?? autoPickLayout(entry)
    out.push({
      filename,
      entry,
      source: declared ? 'declared' : 'auto-picked',
      resolvedLayout: resolved,
    })
  }
  // Stable order: declared layouts in the order they were declared
  // (alphabetized by filename), then auto-picked at the end.
  out.sort((a, b) => {
    if (a.source !== b.source) return a.source === 'declared' ? -1 : 1
    return a.filename.localeCompare(b.filename)
  })
  return out
}

export function MarkdownDemosPage() {
  const demos = loadDemos()
  return (
    <Layout backLabel="Templates" backTo="/templates">
      <header className="mb-12">
        <p className="smallcaps">A live demo · {demos.length} markdown files</p>
        <h1
          className="font-display italic text-twilight leading-[0.95] mt-2"
          style={{ fontSize: 'clamp(2.4rem, 11vw, 3.4rem)' }}
        >
          Layouts driven by the markdown.
        </h1>
        <p className="font-display italic text-ink-soft text-xl leading-snug mt-3 max-w-prose">
          Each card below is a real <code className="font-mono text-twilight">.md</code> file from
          {' '}<code className="font-mono text-twilight">docs/wiki-layout-demos/</code>, parsed and
          rendered by the layout the markdown declares.
        </p>
      </header>

      {/* The convention */}
      <section className="mb-14 p-5 bg-pale-sky/60 border border-twilight/15 rounded-md">
        <p className="smallcaps mb-3">The convention</p>
        <p className="font-serif italic text-ink leading-relaxed">
          The agent writes ordinary markdown with one extra bold-prefix field.
          The renderer maps the layout id to a template and feeds it the
          entry&rsquo;s sections. If <code className="font-mono">**Layout:**</code> is
          omitted, an auto-pick heuristic chooses based on the shape of the
          entry (captions present? hero image? short body? lots of sections?).
        </p>

        <pre className="mt-4 text-xs font-mono leading-relaxed bg-paper-deep/60 rounded p-4 overflow-x-auto">
{`# Spiral Jetty

**Status:** Draft
**Confidence:** High
**Focus:** Land Art
**Location:** Rozel Point, UT
**Updated:** 2026-05-09
**Layout:** cover-story
**Portrait:** /assets/jetty-portrait.jpg
**Pull:** *At times the lake rises and the coil disappears.* — Smithson, 1972

## Summary
...`}
        </pre>

        <p className="font-serif italic text-ink-soft text-sm leading-relaxed mt-4">
          Available layouts:{' '}
          <span className="text-twilight">cover-story</span>,{' '}
          <span className="text-twilight">caption-only</span>,{' '}
          <span className="text-twilight">magazine</span>,{' '}
          <span className="text-twilight">field-guide</span>,{' '}
          <span className="text-twilight">marginalia</span>,{' '}
          <span className="text-twilight">postcard</span>,{' '}
          <span className="text-twilight">manifesto</span>,{' '}
          <span className="text-twilight">erasure</span>. See{' '}
          <Link to="/templates" className="underline">all templates</Link> for
          their typographic ancestors.
        </p>
      </section>

      {/* Demos */}
      <ul className="space-y-20">
        {demos.map((d) => (
          <li
            key={d.filename}
            id={d.filename.replace(/\.md$/, '')}
            className="scroll-mt-20"
          >
            <DemoBlock demo={d} />
          </li>
        ))}
      </ul>

      <p className="ornament mt-24">— ❦ —</p>
      <p className="font-serif italic text-center text-ink-soft leading-relaxed">
        These eight files are exemplars.
        <br />
        The agent&rsquo;s job is to know which one each entry should be.
      </p>
    </Layout>
  )
}

function DemoBlock({ demo }: { demo: Demo }) {
  const { entry, filename, source, resolvedLayout } = demo
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <p className="smallcaps">
          <code className="font-mono normal-case tracking-normal">
            {filename}
          </code>
        </p>
        <p className="smallcaps text-twilight">— {resolvedLayout}</p>
      </div>
      <h2
        className="font-display italic text-ink leading-[1] mb-2"
        style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)' }}
      >
        {entry.title}
      </h2>
      <p className="font-serif italic text-ink-soft leading-snug">
        <span className="smallcaps not-italic mr-2">Layout</span>
        <code className="font-mono text-twilight">{resolvedLayout}</code>{' '}
        <span className="text-ink-soft">
          ({source === 'declared' ? 'declared in markdown' : 'auto-picked from content shape'})
        </span>
      </p>
      {entry.meta['Focus'] && (
        <p className="font-serif italic text-twilight leading-snug mt-1">
          <span className="smallcaps not-italic mr-2">Focus</span>
          {entry.meta['Focus']}
        </p>
      )}
      <hr className="border-sandstone/40 mt-5 mb-7" />

      <div className="flex justify-center">
        <div className="phone-frame">
          <div className="phone-scroll editorial">
            <MarkdownLayout entry={entry} />
          </div>
        </div>
      </div>
    </section>
  )
}
