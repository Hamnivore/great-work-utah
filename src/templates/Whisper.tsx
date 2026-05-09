import { LOREM_ARTICLE } from './_content'

/**
 * WHISPER
 * The title is enormous. The body is set in 11px ink-soft, just shy of
 * unreadable on a phone. The visual hierarchy is inverted to violence:
 * the headline screams, the article whispers. Lean in to read it.
 *
 * Honest assessment of why this is dumb: 11px on mobile fails WCAG, fails
 * older eyes, and most readers will simply zoom or bounce. Browser-default
 * 16px exists for good reasons.
 *
 * Why we ship it anyway: a thing the rest of the internet does — shouting
 * at you with the body too — is not a law. There's a class of essay (a
 * postscript, an argument the author isn't sure of, a confession) that
 * earns being literally hard to read.
 */
export function Whisper() {
  const a = LOREM_ARTICLE
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">A whisper · postscript</p>
      <h1
        className="font-display italic text-ink leading-[0.9] mb-12"
        style={{ fontSize: 'clamp(3rem, 16vw, 4.5rem)' }}
      >
        {a.title}.
      </h1>

      {/* The body, in 11px */}
      <div
        className="text-ink-soft"
        style={{ fontSize: '11px', lineHeight: 1.65, maxWidth: '32ch' }}
      >
        <p>{a.body[0]}</p>
        <p style={{ marginTop: '0.9em' }}>{a.body[1]}</p>
        <p style={{ marginTop: '0.9em' }}>{a.body[2]}</p>
        <p style={{ marginTop: '0.9em' }}>{a.body[3]}</p>
        <p style={{ marginTop: '0.9em' }}>{a.body[5]}</p>
        <p style={{ marginTop: '0.9em' }}>{a.body[6]}</p>
      </div>

      {/* The pull-quote, also tiny — but italic, so the eye finds it */}
      <p
        className="font-display italic text-twilight mt-10"
        style={{ fontSize: '14px', lineHeight: 1.4, maxWidth: '24ch' }}
      >
        “{a.pullQuote}”
        <br />
        <span className="smallcaps not-italic">— {a.pullQuoteAttr}</span>
      </p>
    </article>
  )
}
