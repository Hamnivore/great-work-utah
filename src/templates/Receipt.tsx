import { LOREM_ARTICLE } from './_content'

/**
 * RECEIPT
 * The article is rendered as a thermal receipt. Monospace, narrow
 * column, dotted lines for separators, line-items for the article's
 * sections, "TOTAL" at the bottom. The page is a small white slip
 * shaded gently against the cream paper.
 *
 * Honest assessment of why this is dumb: monospace at body length is
 * exhausting. The "joke" is one-note — funny once, painful for 800 words.
 * Caslon is what we promised the reader; this template breaks that
 * promise loudly.
 *
 * Why we ship it anyway: an Atlas Obscura entry for, say, a hot dog
 * stand could open as the actual receipt. The form *is* the content. A
 * single template like this in a hundred-template family adds personality.
 */
export function Receipt() {
  const a = LOREM_ARTICLE
  return (
    <article
      className="text-ink"
      style={{
        fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace',
        fontSize: '13px',
        lineHeight: 1.55,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 280,
          background: '#FBF7EF',
          padding: '24px 18px',
          boxShadow:
            '0 1px 0 rgba(42,31,24,0.08), 0 18px 32px -16px rgba(42,31,24,0.18)',
        }}
      >
        <div className="text-center">
          <p style={{ fontWeight: 700, letterSpacing: '0.18em' }}>
            THE GREAT WORK
          </p>
          <p>* * * * RECEIPT * * * *</p>
          <p>{a.location}</p>
          <p>{a.dateline}</p>
        </div>

        <p className="my-3">- - - - - - - - - - - - - - - - - - - - - -</p>

        <div className="space-y-1">
          <Row label="Kicker" value={a.kicker} />
          <Row label="Headline" value={a.shortTitle} />
          <Row label="Deck" value="see below" />
          <Row label="Byline" value={a.byline} />
          <Row label="Read time" value={a.readTime} />
          <Row label="Tier" value={`${a.tier} (starred)`} />
        </div>

        <p className="my-3">- - - - - - - - - - - - - - - - - - - - - -</p>

        <p style={{ whiteSpace: 'pre-wrap' }}>{a.deck}</p>

        <p className="my-3">- - - - - - - - - - - - - - - - - - - - - -</p>

        <div className="space-y-1">
          <Row label="Body para 01" value="lorem ipsum" qty="1" />
          <Row label="Body para 02" value="lorem ipsum" qty="1" />
          <Row label="Pull-quote" value="Smithson, 1972" qty="1" />
          <Row label="Body para 03" value="lorem ipsum" qty="1" />
          <Row label="Citations" value="see foot" qty="4" />
        </div>

        <p className="my-3">============================================</p>

        <Row label="TOTAL" value="one (1) article" />
        <Row label="WORDS" value="≈ 1,200" />

        <p className="my-3">============================================</p>

        <p className="text-center" style={{ marginTop: 14 }}>thank you for reading</p>
        <p className="text-center">come back soon</p>
        <p className="text-center" style={{ marginTop: 12 }}>
          # # # # # # # # # # #
        </p>
        <p className="text-center" style={{ fontSize: 10, opacity: 0.7, marginTop: 6 }}>
          {a.citations[0]}
        </p>
      </div>
    </article>
  )
}

function Row({ label, value, qty }: { label: string; value: string; qty?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <span>
        {qty && <span style={{ opacity: 0.6 }}>{qty}× </span>}
        {label}
      </span>
      <span style={{ textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}
