import { LOREM_ARTICLE } from './_content'

/**
 * ERASURE
 * Most of the body is redacted with solid ink-black bars. Only a few
 * phrases are visible, leaving an erasure poem of the original article.
 * The reader gets the shape of the paragraphs and a handful of words —
 * the rest is for them to imagine.
 *
 * Honest assessment of why this is dumb: an article with 80% of its
 * words redacted is no longer an article. SEO is dead. Accessibility is
 * dead — screen readers will read either the bars or skip them. New
 * readers learn nothing.
 *
 * Why we ship it anyway: an erasure poem is a real literary form, and
 * the visual rhythm of redacted blocks against legible phrases is
 * genuinely beautiful. For an article *about* censorship, archive
 * recovery, or the gaps in a historical record — this template *is* the
 * argument.
 */
export function Erasure() {
  const a = LOREM_ARTICLE

  // For each paragraph, decide which words to keep visible. Deterministic
  // by paragraph index so the redaction is the same across re-renders.
  function redactParagraph(text: string, seed: number) {
    const words = text.split(/\s+/)
    const visible = new Set<number>()
    // keep ~18% of words, biased toward short evocative ones
    const r = (n: number) => {
      const x = Math.sin(seed * 91.13 + n * 13.7) * 10000
      return x - Math.floor(x)
    }
    words.forEach((w, i) => {
      const len = w.replace(/[^A-Za-z]/g, '').length
      const odds = len <= 4 ? 0.32 : len <= 7 ? 0.18 : 0.1
      if (r(i) < odds) visible.add(i)
    })
    // Always keep the first word and the last visible-or-not for shape.
    visible.add(0)

    // Group consecutive redactions into single bars so the rhythm reads
    // as paragraphs of redaction, not word-shaped boxes.
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

  const paragraphs = a.body.slice(0, 4)

  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-2">An erasure · 2026</p>
      <h1
        className="font-display italic text-twilight leading-tight mb-2"
        style={{ fontSize: 'clamp(2rem, 9vw, 2.6rem)' }}
      >
        {a.title}
      </h1>
      <p className="font-serif italic text-ink-soft mb-8 leading-snug">
        from a longer text. the rest is for you.
      </p>

      <div className="space-y-5 leading-loose">
        {paragraphs.map((p, pi) => (
          <p key={pi}>
            {redactParagraph(p, pi).map((run, i) =>
              run.kind === 'word' ? (
                <span key={i}>
                  {i === 0 ? '' : ' '}
                  {run.content}
                </span>
              ) : (
                <span
                  key={i}
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
        Redacted from the editors&rsquo; transcript, 2026.
      </p>
    </article>
  )
}
