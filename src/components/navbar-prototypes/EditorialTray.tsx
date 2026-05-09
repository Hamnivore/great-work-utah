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
 * VARIANT E — Editorial Tray.
 *
 * The bar looks like the others, but its dropdown is a full-width tray that
 * slides down beneath the navbar and shows siblings as a horizontally
 * scrolling row of editorial mini-cards (display Caslon title, italic Caslon
 * one-line deck, optional tier mark in orange). Feels like browsing the
 * \u201croadside attractions nearby\u201d strip in an Atlas Obscura entry.
 */
export function EditorialTray() {
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
        <div className="border-b border-sandstone/60 bg-pale-sky/40">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5">
            <div className="flex items-baseline justify-between mb-3">
              <p className="smallcaps">
                {openSegment.groupLabel ?? openSegment.label}
              </p>
              <p className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-ink-soft">
                Scroll →
              </p>
            </div>
            <ul className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
              {openSegment.siblings.map((s) => (
                <li key={s.label} className="shrink-0 w-56">
                  <a
                    href={s.href}
                    className={`block h-full bg-paper border rounded-sm p-3.5 transition-colors group ${
                      s.current
                        ? 'border-twilight/60'
                        : 'border-sandstone/50 hover:border-twilight/40'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      {s.tier ? (
                        <span className={`font-display ${TIER_COLOR[s.tier] ?? 'text-twilight'} text-base leading-none`}>
                          {s.tier}
                        </span>
                      ) : (
                        <span className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-twilight-soft">
                          Section
                        </span>
                      )}
                      {s.current && (
                        <span className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-ink-soft">
                          here
                        </span>
                      )}
                    </div>
                    <p className="font-display text-lg text-ink leading-tight group-hover:text-twilight transition-colors">
                      {s.label}
                    </p>
                    {s.summary && (
                      <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1.5 line-clamp-3">
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
