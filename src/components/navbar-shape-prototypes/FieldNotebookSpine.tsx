import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT D — Field-Notebook Spine.
 *
 * Throws away horizontal placement entirely. The navbar lives as a thin
 * vertical spine on the left edge of every page, the way the spine of a
 * Moleskine carries the embossed wordmark. Masthead reads top-to-bottom in
 * vertical type, breadcrumb stacks beneath it the same way, and a small \u201c?\u201d
 * pin sits at the bottom as the persistent Ask affordance.
 *
 * Risky on mobile (chews into already-narrow horizontal space) but absolute
 * on desktop \u2014 the article gets pure horizontal type with a tactile rail
 * beside it.
 */
export function FieldNotebookSpine() {
  return (
    <div className="flex bg-paper min-h-[28rem]">
      <aside className="w-14 sm:w-16 bg-paper-deep border-r border-sandstone/60 flex flex-col items-center justify-between py-6 self-stretch shrink-0 relative">
        <div
          aria-hidden
          className="absolute inset-y-3 right-2 w-px border-r border-dashed border-sandstone/60"
        />
        <div className="[writing-mode:vertical-rl] flex items-center gap-3">
          <p className="font-display italic text-twilight text-base leading-none">Great Work</p>
          <span className="text-twilight-soft/60 leading-none">·</span>
          <p className="smallcaps !text-[0.55rem] !tracking-[0.22em]">Utah, USA</p>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="[writing-mode:vertical-rl] flex items-center gap-2"
        >
          {BREADCRUMB.map((s, i) => (
            <span key={s.key} className="flex items-center gap-2">
              {i > 0 && <span className="text-twilight-soft/50 leading-none">·</span>}
              <span className="smallcaps !tracking-[0.18em]">{s.label}</span>
            </span>
          ))}
        </nav>
        <button
          type="button"
          className="w-8 h-8 rounded-full border border-twilight/50 text-twilight font-display italic text-base flex items-center justify-center hover:bg-paper transition-colors"
          aria-label="Ask the guide"
        >
          ?
        </button>
      </aside>
      <div className="flex-1 min-w-0">
        <Sample />
      </div>
    </div>
  )
}
