import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT E — Cover Strip.
 *
 * The opposite move from Marginalia: the masthead is huge. \u201cGreat Work\u201d in
 * 5xl italic display Caslon dominates the bar, with a tracked subtitle
 * beneath it (\u201cA field guide to Utah\u201d). To the right, a tight stack of issue
 * metadata and the breadcrumb in two tracked smallcaps lines. A magazine
 * cover compressed into a band.
 */
export function CoverStrip() {
  return (
    <div className="bg-paper">
      <header className="border-b border-sandstone/60">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-4 flex items-end justify-between gap-6">
          <div>
            <p className="font-display italic text-twilight text-4xl sm:text-5xl leading-none">
              Great Work
            </p>
            <p className="smallcaps mt-2 !text-[0.6rem] !tracking-[0.22em]">
              A field guide to Utah
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="smallcaps !text-[0.6rem] !tracking-[0.22em] mb-1.5">
              Vol. 1 · Winter 2026
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
        </div>
      </header>
      <Sample />
    </div>
  )
}
