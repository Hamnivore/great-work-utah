import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT A — Wasatch Horizon.
 *
 * Standard horizontal navbar (masthead left, breadcrumb right) but the
 * conventional hairline rule beneath is replaced with a hand-drawn mountain
 * silhouette \u2014 the bottom edge of the bar IS the Wasatch Range. The article
 * begins on the other side of the mountains. Place-rooted, place-shaped.
 */
export function WasatchHorizon() {
  return (
    <div className="bg-paper">
      <header className="bg-paper">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-4 pb-2 flex items-baseline justify-between gap-4">
          <div>
            <p className="font-display italic text-twilight text-xl leading-none">Great Work</p>
            <p className="smallcaps mt-1 !text-[0.6rem] !tracking-[0.2em]">Utah, USA</p>
          </div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            {BREADCRUMB.map((s, i) => (
              <span key={s.key} className="flex items-center gap-2">
                {i > 0 && <span className="text-twilight-soft/50">·</span>}
                <span className="smallcaps">{s.label}</span>
              </span>
            ))}
          </nav>
        </div>
        <svg
          aria-hidden
          viewBox="0 0 1000 24"
          preserveAspectRatio="none"
          className="block w-full h-3 text-sandstone/70"
        >
          <path
            d="M0,24 L0,18 L40,8 L90,16 L140,4 L190,12 L240,5 L290,18 L340,9 L390,2 L440,14 L490,6 L540,20 L600,11 L660,4 L720,16 L780,8 L840,18 L900,7 L960,20 L1000,12 L1000,24 Z"
            fill="currentColor"
          />
        </svg>
      </header>
      <Sample />
    </div>
  )
}
