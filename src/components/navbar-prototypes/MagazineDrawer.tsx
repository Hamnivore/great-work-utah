import { useRef, useState } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'

const TIER_COLOR: Record<string, string> = {
  S: 'text-orange',
  A: 'text-orange',
  B: 'text-twilight',
  C: 'text-twilight-soft',
  D: 'text-twilight-soft',
  F: 'text-ink-soft',
}

/**
 * VARIANT B — Magazine Drawer.
 *
 * The eyebrow looks identical to A, but instead of a tight popover the drop
 * opens as a full-width drawer that pushes the article down. Inside it, the
 * sibling list is laid out as a magazine contents page: a bold eyebrow, then a
 * two-column grid of italic-Caslon entries with tier marks and one-line decks.
 * Click outside, hit Escape, or click the same segment again to collapse.
 */
export function MagazineDrawer() {
  const [open, setOpen] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  const openSegment = BREADCRUMB.find((s) => s.key === open)

  return (
    <div ref={wrapRef}>
      <div className="border-y border-sandstone/60 bg-paper">
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-8 py-2.5 flex items-center justify-center gap-2 flex-wrap"
          aria-label="Breadcrumb"
        >
          {BREADCRUMB.map((segment, i) => {
            const isOpen = open === segment.key
            return (
              <span key={segment.key} className="flex items-center gap-2">
                {i > 0 && <span className="smallcaps !tracking-normal text-twilight-soft/60">·</span>}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : segment.key)}
                  className={`smallcaps hover:text-twilight transition-colors flex items-center gap-1.5 ${
                    isOpen ? 'text-twilight' : ''
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                >
                  {segment.label}
                  <span
                    aria-hidden
                    className={`text-[0.55rem] leading-none transition-transform ${
                      isOpen ? 'rotate-180 text-twilight' : 'text-twilight-soft/60'
                    }`}
                  >
                    ▾
                  </span>
                </button>
              </span>
            )
          })}
        </nav>
      </div>

      {openSegment && (
        <div className="border-b border-sandstone/60 bg-paper-deep/60">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-7">
            <div className="flex items-baseline justify-between mb-5">
              <p className="smallcaps">
                {openSegment.groupLabel ?? openSegment.label}
                <span className="ml-2 text-twilight-soft/70">
                  · {openSegment.siblings.length} entries
                </span>
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="smallcaps hover:text-twilight transition-colors"
                aria-label="Close section navigation"
              >
                Close ✕
              </button>
            </div>

            <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
              {openSegment.siblings.map((s) => (
                <li
                  key={s.label}
                  className="border-b border-sandstone/30 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                >
                  <a href={s.href} className="block py-2.5 group">
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className={`font-display text-lg leading-tight transition-colors ${
                          s.current
                            ? 'text-ink italic'
                            : 'text-ink group-hover:text-twilight'
                        }`}
                      >
                        {s.label}
                      </span>
                      {s.tier && (
                        <span className={`font-display ${TIER_COLOR[s.tier] ?? 'text-twilight'} text-base shrink-0`}>
                          {s.tier}
                        </span>
                      )}
                    </div>
                    {s.summary && (
                      <p className="font-serif italic text-ink-soft text-sm leading-snug mt-0.5">
                        {s.summary}
                      </p>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
