import { LOREM_ARTICLE } from './_content'

/**
 * RANSOM
 * Every word in the body is randomly sized, weighted, and slightly
 * rotated, like words cut out of magazines for a kidnapper's note. We
 * mix Caslon, italics, sans, smallcaps, and ink/twilight/orange
 * uncontrollably. Hierarchy is destroyed.
 *
 * Honest assessment of why this is dumb: it's actively unreadable. Every
 * typography teacher in the world would mark it failed. There is no
 * argument that this serves the reader better than uniform body type.
 *
 * Why we ship it anyway: when the *content* of an article is itself a
 * collage — a list of fragments, an annotated bibliography, a found-poem
 * — the form should match the content. Most articles aren't this. A few
 * could be.
 */
export function Ransom() {
  const a = LOREM_ARTICLE
  const para = a.body[0] + ' ' + a.body[5]
  const words = para.split(/\s+/)

  // Deterministic pseudo-random based on word index — avoids hydration
  // jitter and lets the same article render the same way every time.
  const styleFor = (i: number): React.CSSProperties => {
    const r = (n: number) => {
      const x = Math.sin((i + 1) * 999.6 + n * 13.37) * 10000
      return x - Math.floor(x)
    }
    const sizes = [12, 14, 16, 18, 22, 28, 32]
    const fonts = ['var(--font-serif)', 'var(--font-display)', 'var(--font-sans)']
    const colors = [
      'var(--color-ink)',
      'var(--color-twilight)',
      'var(--color-orange)',
      'var(--color-ink-soft)',
      'var(--color-twilight-soft)',
    ]
    const weights = [400, 500, 700]
    return {
      fontFamily: fonts[Math.floor(r(1) * fonts.length)],
      fontSize: sizes[Math.floor(r(2) * sizes.length)],
      color: colors[Math.floor(r(3) * colors.length)],
      fontWeight: weights[Math.floor(r(4) * weights.length)],
      fontStyle: r(5) > 0.55 ? 'italic' : 'normal',
      textTransform: r(6) > 0.85 ? 'uppercase' : 'none',
      letterSpacing: r(6) > 0.85 ? '0.1em' : 'normal',
      display: 'inline-block',
      transform: `rotate(${(r(7) - 0.5) * 6}deg)`,
      margin: '0 4px 4px 0',
      verticalAlign: 'baseline',
      lineHeight: 1.5,
      opacity: 0.85 + r(8) * 0.15,
      // never let a word overlap by more than visually pleasant
      backgroundColor: r(9) > 0.92 ? 'var(--color-pale-sky)' : 'transparent',
      padding: r(9) > 0.92 ? '0 4px' : 0,
    }
  }

  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-2">A note · pasted up</p>
      <h1
        className="text-ink mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(2rem, 9vw, 2.6rem)',
          lineHeight: 0.95,
        }}
      >
        {a.title}
      </h1>

      <p className="leading-relaxed">
        {words.map((w, i) => (
          <span key={`${i}-${w}`} style={styleFor(i)}>
            {w}
          </span>
        ))}
      </p>

      <hr className="border-sandstone/50 mt-10" />
      <p className="smallcaps mt-3">— A failure, mostly</p>
    </article>
  )
}
