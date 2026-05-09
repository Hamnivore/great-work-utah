import { useRef, useState } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'

/**
 * VARIANT A — Slim Stripe.
 *
 * The most faithful reading of the Stripe Press eyebrow in the reference: a
 * single hairline-bounded line of tracked smallcaps with middle dots. Each
 * segment is a button; clicking opens a tight dropdown anchored beneath the
 * segment, with sibling links set in italic Caslon and divided by hairlines.
 *
 * The chrome around the dropdown is deliberately almost invisible \u2014 it should
 * feel like another line of the same article, not a UI surface.
 */
export function SlimStripe() {
  const [open, setOpen] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  return (
    <div className="relative" ref={wrapRef}>
      <div className="border-y border-sandstone/60">
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-8 py-2.5 flex items-center justify-center gap-2 flex-wrap"
          aria-label="Breadcrumb"
        >
          {BREADCRUMB.map((segment, i) => {
            const isOpen = open === segment.key
            return (
              <span key={segment.key} className="relative flex items-center gap-2">
                {i > 0 && <span className="smallcaps !tracking-normal text-twilight-soft/60">·</span>}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : segment.key)}
                  className={`smallcaps hover:text-twilight transition-colors flex items-center gap-1.5 ${
                    isOpen ? 'text-twilight' : ''
                  }`}
                  aria-haspopup="menu"
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

                {isOpen && (
                  <div
                    role="menu"
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 min-w-[14rem] bg-paper border border-sandstone/70 shadow-[0_2px_24px_-12px_rgba(42,31,24,0.35)] rounded-sm"
                  >
                    <p className="smallcaps px-4 pt-3 pb-2 border-b border-sandstone/40">
                      {segment.groupLabel ?? segment.label}
                    </p>
                    <ul className="py-1">
                      {segment.siblings.map((s) => (
                        <li key={s.label} className="border-b border-sandstone/20 last:border-b-0">
                          <a
                            href={s.href}
                            role="menuitem"
                            className={`block px-4 py-2 font-serif italic text-base leading-snug transition-colors ${
                              s.current
                                ? 'text-ink'
                                : 'text-twilight hover:text-orange'
                            }`}
                          >
                            {s.label}
                            {s.current && (
                              <span className="smallcaps ml-2 !text-[0.6rem] !tracking-[0.2em] text-ink-soft">
                                you are here
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </span>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
