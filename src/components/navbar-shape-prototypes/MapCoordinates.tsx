import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT B — Map Coordinates.
 *
 * The travel-guide pure read. A tracked smallcaps line of GPS coordinates
 * sits centered above the masthead/breadcrumb pair, anchoring the page to a
 * real place in the world. Reads like the front matter of a Field Notes
 * notebook or the sidebar of a National Geographic spread.
 */
export function MapCoordinates() {
  return (
    <div className="bg-paper">
      <header className="border-b border-sandstone/60">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3.5">
          <p className="smallcaps text-center !text-[0.6rem] !tracking-[0.22em] text-twilight-soft mb-2.5">
            41° 26′ 16″ N · 112° 40′ 11″ W · Rozel Point, Box Elder County
          </p>
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-display italic text-twilight text-base leading-none">Great Work</span>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap justify-end">
              {BREADCRUMB.map((s, i) => (
                <span key={s.key} className="flex items-center gap-2">
                  {i > 0 && <span className="text-twilight-soft/50">·</span>}
                  <span className="smallcaps">{s.label}</span>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <Sample />
    </div>
  )
}
