import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT G — Bottom Band (the rebel).
 *
 * What if there\u2019s no navbar at the top at all? The article gets pure top
 * space \u2014 the H1 is the first thing the eye lands on, the way a book\u2019s
 * chapter opener works. The masthead and breadcrumb live as a thin band
 * pinned to the bottom edge of the screen, like the colophon at the foot of
 * a magazine page.
 *
 * Real cost: the user can\u2019t see \u201cwhere am I\u201d until they look down. The
 * trade is: the article gets dignity, and the chrome stops competing with
 * the title. Worth seeing on a real screen before deciding.
 */
export function BottomBand() {
  return (
    <div className="bg-paper relative min-h-[28rem] flex flex-col">
      <div className="flex-1">
        <Sample />
      </div>
      <header className="border-t border-sandstone/60 bg-paper">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3 flex items-baseline justify-between gap-4">
          <p className="font-display italic text-twilight text-base leading-none">
            Great Work
            <span className="smallcaps !text-[0.55rem] !tracking-[0.22em] ml-2 align-middle">
              Utah, USA
            </span>
          </p>
          <nav aria-label="Breadcrumb">
            <p className="smallcaps">
              {BREADCRUMB.map((s, i) => (
                <span key={s.key}>
                  {i > 0 && <span className="text-twilight-soft/50"> · </span>}
                  <span>{s.label}</span>
                </span>
              ))}
            </p>
          </nav>
        </div>
      </header>
    </div>
  )
}
