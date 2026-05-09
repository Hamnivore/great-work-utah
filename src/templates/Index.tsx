import { LOREM_ARTICLE } from './_content'

/**
 * INDEX
 * The article is presented as the index from the back of a book — an
 * A-through-Z concordance, with page pointers, sub-entries, and italic
 * cross-references. There is no prose. The reader is expected to read
 * the index and somehow feel the article through its named objects.
 *
 * Honest assessment of why this is dumb: nobody reads an index for fun.
 * It's a navigation aid for a book, not a substitute for the book. New
 * readers will have no idea what any of these terms refer to.
 *
 * Why we ship it anyway: an index is a very specific kind of poem — it
 * implies a whole world by listing its furniture. Borges did versions of
 * this. As an *entry point* to a longer wiki, an index-as-front-page
 * might actually work for some entries (a person, a place, a concept).
 */
export function Index() {
  const a = LOREM_ARTICLE
  const entries: Array<{ letter: string; items: string[] }> = [
    {
      letter: 'B',
      items: [
        'Basalt, sourced locally — see *causeway*; *Rozel Point*',
        'Bingham Canyon — pp. 41, 67 (compared)',
        'Brine — see *salt content*',
      ],
    },
    {
      letter: 'C',
      items: [
        'Causeway, Rozel — pp. 12, 14, 18–22',
        'Coil — see *Spiral Jetty*',
        'Conservation — pp. 64–69; cf. *Holt/Smithson Foundation*',
      ],
    },
    {
      letter: 'H',
      items: [
        'Holt, Nancy — pp. 4, 12, 34, 41, *passim*',
        '— at the wheel — pp. 12–14',
        '— *Sun Tunnels*, 1973–76 — p. 88',
      ],
    },
    {
      letter: 'J',
      items: [
        '**Jetty, Spiral** — pp. 1–142',
        '— construction — pp. 12–18',
        '— first reappearance, 2002 — p. 64',
        '— second submersion, 1999 — p. 41',
      ],
    },
    {
      letter: 'L',
      items: [
        'Lake, Great Salt — *passim*',
        '— elevation, 1970 — p. 14',
        '— elevation, 2024 — p. 132',
      ],
    },
    {
      letter: 'S',
      items: [
        'Salt content, parts per thousand — pp. 7, 22, 64',
        'Smithson, Robert — pp. *passim*',
        '— death, 1973 — p. 71',
        '— note, "the site selects the work" — p. 18',
      ],
    },
  ]
  return (
    <article className="font-serif text-ink editorial">
      <p className="smallcaps mb-1">The article as index · No. 014</p>
      <h1 className="font-display italic text-twilight text-4xl leading-tight mb-2">
        {a.title}
      </h1>
      <p className="font-serif italic text-ink-soft mb-9 leading-snug">
        Read the things; imagine the article.
      </p>

      <hr className="border-twilight/60" />

      {entries.map((group) => (
        <section key={group.letter} className="mt-6">
          <h2
            className="font-display italic text-orange leading-none"
            style={{ fontSize: '2.4rem' }}
          >
            {group.letter}
          </h2>
          <ul className="mt-2 space-y-1.5 font-serif text-base leading-snug">
            {group.items.map((it, i) => (
              <li
                key={i}
                className={i === 0 ? '' : 'pl-4'}
                dangerouslySetInnerHTML={{
                  __html: it
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(
                      /\*(.+?)\*/g,
                      '<em class="text-twilight">$1</em>',
                    ),
                }}
              />
            ))}
          </ul>
        </section>
      ))}

      <hr className="border-twilight/60 mt-10" />
      <p className="smallcaps mt-3 text-right">— prepared by the editors</p>
    </article>
  )
}
