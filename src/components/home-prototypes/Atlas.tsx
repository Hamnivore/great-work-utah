import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AskBar } from '../AskBar'
import { ISSUE, getFeaturedEntries } from './_shared'

/**
 * THE ATLAS
 * The home is a constellation map. The wiki's brightest entries are
 * arranged like stars, with hand-drawn connecting lines that suggest
 * the relationships between them (geothermal next to neurotech because
 * both are deep tech; Spiral Jetty next to Sundance because both are
 * culture). Hover a star, see its name; click, go to the entry. The
 * Ask bar pins to the top — search is the other primary affordance.
 *
 * The bet: a wiki is a place. A landing page that reads like a map
 * tells the reader "you are wandering" before they read a single word.
 *
 * This prototype is intentionally STATIC — no physics, no pan/zoom,
 * no auto-layout. The pannable bubble version lives in the navbar
 * prototypes; this one is a planetarium poster.
 */

interface Star {
  id: string
  /** Real entry slug:source pair to link to. */
  source: 'places_you_can_work' | 'great_work'
  slug: string
  label: string
  /** Hand-placed coordinates in the [0..100] viewBox. */
  cx: number
  cy: number
  /** Visual weight — bigger stars = bigger names. */
  mag: 1 | 2 | 3
  context: string
}

const STARS: Star[] = [
  // Center cluster — the gravitational well of the issue
  { id: 'recursion', source: 'places_you_can_work', slug: 'recursion-pharmaceuticals', label: 'Recursion Pharmaceuticals', cx: 50, cy: 48, mag: 3, context: 'Drug discovery, industrialised' },
  { id: 'fervo', source: 'places_you_can_work', slug: 'fervo-energy', label: 'Fervo Energy', cx: 32, cy: 38, mag: 3, context: 'Geothermal, 24/7' },
  { id: 'blackrock', source: 'places_you_can_work', slug: 'blackrock-neurotech', label: 'Blackrock Neurotech', cx: 68, cy: 36, mag: 3, context: 'BCI · the Utah Array' },

  // Inner constellation — A-tier neighbours
  { id: 'familysearch', source: 'places_you_can_work', slug: 'familysearch', label: 'FamilySearch', cx: 78, cy: 58, mag: 2, context: 'Every person, every family' },
  { id: 'sdl', source: 'places_you_can_work', slug: 'space-dynamics-laboratory', label: 'Space Dynamics Lab', cx: 22, cy: 60, mag: 2, context: 'Sensors looking at things' },
  { id: 'sundance', source: 'places_you_can_work', slug: 'sundance-institute', label: 'Sundance Institute', cx: 84, cy: 22, mag: 2, context: 'Independent storytellers' },
  { id: 'jetty', source: 'great_work', slug: 'spiral-jetty', label: 'Spiral Jetty', cx: 16, cy: 22, mag: 2, context: 'Smithson, Rozel Point, 1970' },

  // Outer ring — historical context, P-tier rumblings
  { id: 'capecchi', source: 'great_work', slug: 'capecchi-gene-targeting', label: 'Capecchi · Knockout Mouse', cx: 48, cy: 14, mag: 1, context: 'Gene targeting' },
  { id: 'browning', source: 'great_work', slug: 'browning-firearms-designs', label: 'John M. Browning', cx: 12, cy: 50, mag: 1, context: 'Ogden, 1855–1926' },
  { id: 'arpanet', source: 'great_work', slug: 'arpanet-fourth-node', label: 'ARPANET · 4th node', cx: 88, cy: 78, mag: 1, context: 'Salt Lake City, 1969' },
  { id: 'thiokol', source: 'great_work', slug: 'thiokol-solid-rocket-motors', label: 'Thiokol Rocket Motors', cx: 38, cy: 82, mag: 1, context: 'Promontory · 1956–' },
  { id: 'jarvik', source: 'great_work', slug: 'jarvik-7-artificial-heart', label: 'Jarvik-7 Artificial Heart', cx: 60, cy: 84, mag: 1, context: 'U of U, 1982' },
  { id: 'bonneville', source: 'great_work', slug: 'bonneville-salt-flats', label: 'Bonneville Salt Flats', cx: 28, cy: 14, mag: 1, context: 'A white horizon' },
  { id: 'goldenspike', source: 'great_work', slug: 'golden-spike-transcontinental-railroad', label: 'Golden Spike', cx: 88, cy: 50, mag: 1, context: 'Promontory, 1869' },
]

/** Edges drawn by hand to imply story, not engineered for completeness. */
const EDGES: Array<[string, string]> = [
  ['recursion', 'fervo'],
  ['recursion', 'blackrock'],
  ['recursion', 'familysearch'],
  ['fervo', 'sdl'],
  ['fervo', 'jetty'],
  ['blackrock', 'capecchi'],
  ['blackrock', 'familysearch'],
  ['blackrock', 'jarvik'],
  ['sundance', 'jetty'],
  ['sundance', 'bonneville'],
  ['jetty', 'bonneville'],
  ['sdl', 'thiokol'],
  ['sdl', 'browning'],
  ['arpanet', 'familysearch'],
  ['goldenspike', 'thiokol'],
  ['goldenspike', 'browning'],
  ['capecchi', 'jarvik'],
]

const MAG_RADIUS: Record<1 | 2 | 3, number> = { 1: 0.55, 2: 0.85, 3: 1.2 }

export function AtlasHome() {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const featured = getFeaturedEntries(6)

  const hovered = STARS.find((s) => s.id === hoverId)

  return (
    <div className="min-h-screen bg-paper text-ink editorial">
      {/* Slim masthead */}
      <header className="max-w-6xl mx-auto px-5 sm:px-8 pt-5 sm:pt-7 flex items-baseline justify-between gap-4">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps text-right leading-tight">
          The atlas · {ISSUE.season}
        </p>
      </header>

      {/* Ask bar — the other primary affordance */}
      <div className="max-w-2xl mx-auto px-5 sm:px-8 mt-5">
        <AskBar />
      </div>

      {/* THE MAP */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 mt-6">
        <div
          className="relative w-full bg-paper-deep/40 rounded-md border border-sandstone/60 overflow-hidden"
          style={{ aspectRatio: '5 / 4' }}
        >
          {/* Faint grid like a sky chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            <defs>
              <pattern id="gridDots" width="5" height="5" patternUnits="userSpaceOnUse">
                <circle cx="2.5" cy="2.5" r="0.18" fill="var(--color-twilight)" opacity="0.22" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#gridDots)" />

            {/* Edges drawn behind the stars */}
            {EDGES.map(([a, b]) => {
              const sa = STARS.find((s) => s.id === a)
              const sb = STARS.find((s) => s.id === b)
              if (!sa || !sb) return null
              const isHot = hoverId && (a === hoverId || b === hoverId)
              return (
                <line
                  key={`${a}-${b}`}
                  x1={sa.cx}
                  y1={sa.cy}
                  x2={sb.cx}
                  y2={sb.cy}
                  stroke="var(--color-twilight)"
                  strokeWidth={isHot ? 0.35 : 0.18}
                  opacity={isHot ? 0.65 : 0.32}
                />
              )
            })}

            {/* Star halos */}
            {STARS.map((star) => (
              <circle
                key={`${star.id}-halo`}
                cx={star.cx}
                cy={star.cy}
                r={MAG_RADIUS[star.mag] + 0.6}
                fill="var(--color-orange)"
                opacity={hoverId === star.id ? 0.35 : 0.12}
              />
            ))}
            {STARS.map((star) => (
              <circle
                key={`${star.id}-dot`}
                cx={star.cx}
                cy={star.cy}
                r={MAG_RADIUS[star.mag]}
                fill={star.mag === 3 ? 'var(--color-orange)' : 'var(--color-twilight)'}
              />
            ))}
          </svg>

          {/* HTML labels — easier to style than SVG text */}
          {STARS.map((star) => (
            <Link
              key={star.id}
              to={`/entry/${star.source}/${star.slug}`}
              onMouseEnter={() => setHoverId(star.id)}
              onMouseLeave={() => setHoverId((h) => (h === star.id ? null : h))}
              onFocus={() => setHoverId(star.id)}
              onBlur={() => setHoverId((h) => (h === star.id ? null : h))}
              className="absolute -translate-x-1/2 transform group cursor-pointer"
              style={{ left: `${star.cx}%`, top: `${star.cy}%` }}
            >
              {/* invisible hit target around the star */}
              <span
                className="absolute -translate-x-1/2 -translate-y-1/2 left-0 top-0 block rounded-full"
                style={{
                  width: `${(MAG_RADIUS[star.mag] + 1.4) * 8}px`,
                  height: `${(MAG_RADIUS[star.mag] + 1.4) * 8}px`,
                }}
              />
              <span
                className={`block font-serif italic leading-snug whitespace-nowrap mt-2 transition-colors ${
                  star.mag === 3
                    ? 'text-base sm:text-lg text-ink group-hover:text-orange'
                    : star.mag === 2
                      ? 'text-sm sm:text-base text-ink group-hover:text-twilight'
                      : 'text-xs sm:text-sm text-ink-soft group-hover:text-twilight'
                }`}
                style={{ transform: 'translateX(-50%)' }}
              >
                {star.label}
              </span>
            </Link>
          ))}

          {/* Compass legend */}
          <div className="absolute top-3 left-3 smallcaps !text-[0.6rem] !tracking-[0.2em] text-twilight-soft/80 bg-paper/80 backdrop-blur-sm rounded-sm px-2 py-1">
            ⬣ The atlas — hover to see, click to wander
          </div>
          {hovered && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md font-serif italic text-ink bg-paper/95 backdrop-blur-sm rounded-sm border border-sandstone/60 px-3 py-2 text-sm leading-snug">
              <span className="smallcaps !text-[0.6rem] block">{hovered.context}</span>
              {hovered.label}
            </div>
          )}
        </div>
      </section>

      {/* Below the map: a quiet contents-rhythm fallback for text-readers */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-12 mb-16">
        <p className="smallcaps text-center">
          If maps aren&rsquo;t your thing — read down the list
        </p>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {featured.map((entry) => (
            <li key={`${entry.source}/${entry.slug}`}>
              <Link
                to={`/entry/${entry.source}/${entry.slug}`}
                className="font-serif italic text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange transition-colors"
              >
                {entry.title}
              </Link>
              <span className="ml-2 smallcaps !text-[0.6rem] text-twilight-soft/80">
                {entry.domain}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
