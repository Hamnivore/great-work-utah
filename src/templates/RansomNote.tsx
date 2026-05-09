import { LOREM_ARTICLE } from './_content'

/**
 * RANSOM NOTE
 * Punk xerox zine. Each word in the title is a different font, weight,
 * size, case, and rotation, like words snipped out of a magazine and
 * glued down. The hero photo is run through a heavy halftone filter
 * (high contrast + grayscale + slight rotation), then taped over the
 * page with a single black strip. The body is set in monospace, raw.
 *
 * The failure on purpose: this is, on its face, ugly. The Caslon
 * discipline of the rest of the system is abandoned. We're using the
 * orange (reserved!) and pure black (forbidden!) and a grid that isn't.
 */
export function RansomNote() {
  const a = LOREM_ARTICLE
  const titleWords = [
    { text: 'A', size: 4.5, italic: false, weight: 900, rotate: -4, color: 'ink', bg: 'orange' },
    { text: 'coil', size: 2.4, italic: true, weight: 400, rotate: 1.5, color: 'twilight', bg: 'paper-deep' },
    { text: 'OF', size: 1.4, italic: false, weight: 700, rotate: -1.5, color: 'paper', bg: 'ink' },
    { text: 'basalt,', size: 3.2, italic: true, weight: 400, rotate: 2.5, color: 'orange', bg: 'pale-sky' },
    { text: 'set', size: 1.6, italic: false, weight: 600, rotate: -3, color: 'ink', bg: 'paper-deep' },
    { text: 'against', size: 2, italic: true, weight: 400, rotate: 0.5, color: 'twilight', bg: 'sky' },
    { text: 'THE', size: 1, italic: false, weight: 800, rotate: -2, color: 'ink', bg: 'orange' },
    { text: 'pale', size: 2.6, italic: false, weight: 400, rotate: 4, color: 'paper', bg: 'twilight' },
    { text: 'brine', size: 3.4, italic: true, weight: 400, rotate: -1, color: 'ink', bg: 'paper-deep' },
  ]

  return (
    <article
      className="font-serif text-ink"
      style={{ background: 'var(--color-paper-deep)' }}
    >
      {/* Stamped header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p
          className="smallcaps"
          style={{
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
            padding: '4px 8px',
            transform: 'rotate(-2deg)',
          }}
        >
          ※ exclusive · do not reproduce
        </p>
        <p
          className="font-display italic"
          style={{
            color: 'var(--color-orange)',
            fontSize: '2rem',
            transform: 'rotate(8deg)',
            lineHeight: 0.9,
          }}
        >
          A
        </p>
      </div>

      {/* Title — words glued down */}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 mb-5">
        {titleWords.map((w, i) => (
          <span
            key={i}
            style={{
              fontSize: `${w.size}rem`,
              fontFamily: w.italic ? 'var(--font-serif)' : 'var(--font-display)',
              fontStyle: w.italic ? 'italic' : 'normal',
              fontWeight: w.weight,
              color: `var(--color-${w.color})`,
              background: `var(--color-${w.bg})`,
              padding: '0 6px',
              transform: `rotate(${w.rotate}deg)`,
              lineHeight: 0.95,
              textTransform: w.text === w.text.toUpperCase() && w.size < 2 ? 'uppercase' : 'none',
              boxShadow: '0 1px 0 0 rgba(0,0,0,0.1)',
            }}
          >
            {w.text}
          </span>
        ))}
      </div>

      {/* Halftone hero — pasted on, taped over */}
      <div className="relative my-5">
        <img
          src={a.heroImage}
          alt=""
          className="w-full aspect-[4/3] object-cover"
          style={{
            filter: 'grayscale(1) contrast(1.6) brightness(1.05)',
            transform: 'rotate(-1.4deg)',
            border: '5px solid var(--color-paper)',
            boxShadow: '0 14px 30px -16px rgba(0,0,0,0.5)',
          }}
        />
        {/* the masking tape */}
        <div
          className="absolute"
          style={{
            top: -8,
            left: '20%',
            width: 80,
            height: 22,
            background: 'rgba(255, 230, 170, 0.5)',
            border: '1px dashed rgba(120, 90, 40, 0.4)',
            transform: 'rotate(-12deg)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: -10,
            right: '12%',
            width: 110,
            height: 18,
            background: 'rgba(220, 220, 220, 0.6)',
            transform: 'rotate(6deg)',
          }}
        />
      </div>

      {/* Caption scrawl */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          color: 'var(--color-orange)',
          transform: 'rotate(-1deg)',
          fontSize: '1.05rem',
          marginBottom: '1rem',
        }}
      >
        ↑↑ they said no photographs ↑↑
      </p>

      {/* Body — typewriter */}
      <div
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Consolas, "Courier New", monospace',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          color: 'var(--color-ink)',
          padding: '12px 14px',
          background: 'var(--color-paper)',
          border: '1px solid var(--color-ink)',
          transform: 'rotate(0.4deg)',
        }}
      >
        <p>{a.body[0]}</p>
        <p style={{ marginTop: '0.6rem' }}>{a.body[1]}</p>
        <p
          style={{
            marginTop: '0.8rem',
            color: 'var(--color-orange)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          [redacted by the editors]
        </p>
        <p style={{ marginTop: '0.6rem' }}>{a.body[6]}</p>
      </div>

      {/* Hand-stamped pull */}
      <div
        className="my-6 mx-auto text-center"
        style={{
          border: '3px solid var(--color-orange)',
          padding: '16px 12px',
          transform: 'rotate(-0.6deg)',
          background: 'var(--color-paper)',
        }}
      >
        <p
          className="font-display italic leading-tight"
          style={{ color: 'var(--color-ink)', fontSize: '1.4rem' }}
        >
          {a.pullQuote}
        </p>
        <p
          className="smallcaps mt-2"
          style={{ color: 'var(--color-orange)' }}
        >
          — said the man — supposedly
        </p>
      </div>

      <p className="font-display italic text-center text-twilight" style={{ fontSize: '0.95rem' }}>
        more on page 22 if they let us print it
      </p>
    </article>
  )
}
