import { useRef, useState } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'

/**
 * VARIANT D — Inline Reveal.
 *
 * No popover, no drawer, no card. Clicking a segment causes the navbar itself
 * to transform: that segment\u2019s siblings spill out to the right of it on the
 * same hairline-bounded line, set in italic Caslon and separated by middle
 * dots, scrolling horizontally if they overflow. The other segments dim. A
 * small \u00d7 returns the bar to its rest state. Maximum editorial restraint \u2014
 * the bar never gains a second surface.
 */
export function InlineReveal() {
  const [open, setOpen] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  return (
    <div ref={wrapRef}>
      <div className="border-y border-sandstone/60 bg-paper">
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-8 py-2.5"
          aria-label="Breadcrumb"
        >
          {open === null ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {BREADCRUMB.map((segment, i) => (
                <span key={segment.key} className="flex items-center gap-2">
                  {i > 0 && <span className="smallcaps !tracking-normal text-twilight-soft/60">·</span>}
                  <button
                    type="button"
                    onClick={() => setOpen(segment.key)}
                    className="smallcaps hover:text-twilight transition-colors"
                    aria-haspopup="true"
                    aria-expanded={false}
                  >
                    {segment.label}
                  </button>
                </span>
              ))}
            </div>
          ) : (
            (() => {
              const segment = BREADCRUMB.find((s) => s.key === open)!
              return (
                <div className="flex items-center gap-3">
                  <p className="smallcaps text-twilight shrink-0">
                    {segment.label}
                    <span className="ml-2 text-twilight-soft/70">·</span>
                  </p>
                  <ul className="flex items-center gap-3 flex-1 overflow-x-auto whitespace-nowrap scrollbar-none">
                    {segment.siblings
                      .filter((s) => !s.current)
                      .map((s, i) => (
                        <li key={s.label} className="flex items-center gap-3 shrink-0">
                          {i > 0 && (
                            <span className="text-twilight-soft/50 leading-none">·</span>
                          )}
                          <a
                            href={s.href}
                            className="font-serif italic text-twilight hover:text-orange transition-colors text-base leading-none"
                          >
                            {s.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    className="smallcaps hover:text-twilight transition-colors shrink-0"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              )
            })()
          )}
        </nav>
      </div>
    </div>
  )
}
