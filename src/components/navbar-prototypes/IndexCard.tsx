import { useRef, useState } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'

/**
 * VARIANT C — Index Card.
 *
 * The active-leaf segment is set in italic Caslon (the way you\u2019d see a chapter
 * title rendered in the body of a book), while parent segments stay in tracked
 * smallcaps. Clicking any segment opens an index-card popover \u2014 a deeper paper
 * surface with a real border, a redwood arrow nub pointing up at the parent,
 * and italic Caslon links separated by hairlines. The card itself feels like a
 * library catalog drawer slid out from the page.
 */
export function IndexCard() {
  const [open, setOpen] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  const lastIndex = BREADCRUMB.length - 1

  return (
    <div className="relative" ref={wrapRef}>
      <div className="border-y border-sandstone/60 bg-paper">
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-8 py-2.5 flex items-center justify-center gap-2 flex-wrap"
          aria-label="Breadcrumb"
        >
          {BREADCRUMB.map((segment, i) => {
            const isOpen = open === segment.key
            const isLeaf = i === lastIndex
            return (
              <span key={segment.key} className="relative flex items-center gap-2">
                {i > 0 && <span className="smallcaps !tracking-normal text-twilight-soft/60">·</span>}
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : segment.key)}
                  className={
                    isLeaf
                      ? `font-serif italic text-base leading-none transition-colors ${
                          isOpen ? 'text-twilight' : 'text-ink hover:text-twilight'
                        }`
                      : `smallcaps hover:text-twilight transition-colors ${isOpen ? 'text-twilight' : ''}`
                  }
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                >
                  {segment.label}
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-30 min-w-[18rem]"
                  >
                    {/* Caret nub */}
                    <div
                      aria-hidden
                      className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-paper-deep border-l border-t border-twilight/60"
                    />
                    <div className="relative bg-paper-deep border border-twilight/60 rounded-sm shadow-[0_8px_30px_-12px_rgba(42,31,24,0.45)]">
                      <div className="px-4 pt-3 pb-2 border-b border-twilight/30 flex items-baseline justify-between gap-4">
                        <p className="smallcaps !text-twilight">
                          {segment.groupLabel ?? segment.label}
                        </p>
                        <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-ink-soft">
                          {segment.siblings.length} cards
                        </p>
                      </div>
                      <ul>
                        {segment.siblings.map((s) => (
                          <li
                            key={s.label}
                            className="border-b border-sandstone/40 last:border-b-0"
                          >
                            <a
                              href={s.href}
                              role="menuitem"
                              className={`block px-4 py-2.5 transition-colors ${
                                s.current ? '' : 'hover:bg-paper'
                              }`}
                            >
                              <div className="flex items-baseline justify-between gap-3">
                                <span
                                  className={`font-serif italic text-base leading-snug ${
                                    s.current ? 'text-ink' : 'text-twilight'
                                  }`}
                                >
                                  {s.label}
                                </span>
                                {s.current && (
                                  <span className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-ink-soft shrink-0">
                                    you are here
                                  </span>
                                )}
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
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
