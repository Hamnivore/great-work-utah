import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT C — Postage Stamp.
 *
 * The masthead is set inside a stamp-shaped block (twilight border with a
 * dashed inner edge suggesting perforations) and a faint postmark of
 * cancellation lines crosses it diagonally. The breadcrumb stacks neatly to
 * the right like an address. Tactile, hand-stamped, mailed-from-Utah energy.
 */
export function PostageStamp() {
  return (
    <div className="bg-paper">
      <header className="border-b border-sandstone/60">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-5 flex items-start justify-between gap-6">
          <div className="relative inline-block shrink-0">
            <div className="bg-paper-deep border border-twilight/70 rounded-sm p-[3px]">
              <div className="border border-dashed border-twilight/40 rounded-[1px] px-4 py-3">
                <p className="font-display italic text-twilight text-xl leading-none">Great Work</p>
                <p className="smallcaps mt-1.5 !text-[0.55rem] !tracking-[0.22em]">
                  Utah · Vol. 1 · 2026
                </p>
              </div>
            </div>
            <svg
              aria-hidden
              viewBox="0 0 100 30"
              className="absolute -right-5 top-2 w-24 h-7 text-twilight-soft/50 -rotate-12 pointer-events-none"
            >
              <path d="M0,5 Q50,2 100,8" stroke="currentColor" strokeWidth="0.6" fill="none" />
              <path d="M0,12 Q50,9 100,15" stroke="currentColor" strokeWidth="0.6" fill="none" />
              <path d="M0,19 Q50,16 100,22" stroke="currentColor" strokeWidth="0.6" fill="none" />
            </svg>
          </div>
          <nav aria-label="Breadcrumb" className="text-right pt-2">
            <p className="smallcaps !tracking-[0.18em] leading-relaxed">
              {BREADCRUMB.map((s, i) => (
                <span key={s.key}>
                  {i > 0 && <span className="text-twilight-soft/50"> · </span>}
                  <span>{s.label}</span>
                </span>
              ))}
            </p>
            <p className="smallcaps !text-[0.55rem] !tracking-[0.22em] text-twilight-soft mt-1.5">
              Posted from Rozel Point
            </p>
          </nav>
        </div>
      </header>
      <Sample />
    </div>
  )
}
