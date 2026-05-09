import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Entry } from '../../../lib/types'

interface TopSearchProps {
  /** Italic suggestions shown in the panel under "Try asking". */
  suggestions: string[]
  /** Featured entries shown in the panel under "Or browse". */
  recommendations?: Entry[]
  /**
   * 'photo' — resting bar is drawn over a dark photo (cream, blurred).
   * 'paper' — resting bar lives on cream paper (twilight ink).
   * Affects only the resting state; the panel is always paper.
   */
  tone?: 'photo' | 'paper'
}

/**
 * TopSearch — the search affordance, restated as the primary
 * interaction on the home.
 *
 * Two states:
 *
 *   1. Resting pill: a rounded-full search input with a magnifying-
 *      glass icon, pinned to the top of the cover. On a photo cover
 *      it's a blurred-cream pill; on paper it's a calm pale-sky pill.
 *      Click anywhere on it (or hit ⌘K) to expand.
 *
 *   2. Fullscreen panel: no header chrome at all. The Back affordance
 *      and the search input share a single row, so the working
 *      surface is the input — nothing else competes for attention.
 *      Suggestions render as pill chips (typing is a search posture,
 *      not a reading posture). Featured entries render as bordered
 *      paper cards on the right.
 *
 * Body scroll is locked while the panel is open. Pressing Enter on a
 * suggestion submits it; pressing Enter in the input goes to /ask.
 */
export function TopSearch({
  suggestions,
  recommendations = [],
  tone = 'photo',
}: TopSearchProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const expandedInputRef = useRef<HTMLInputElement>(null)

  // Body scroll lock + Esc-to-close + autofocus the panel input.
  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const id = window.requestAnimationFrame(() => {
      expandedInputRef.current?.focus()
    })

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.cancelAnimationFrame(id)
    }
  }, [open])

  // ⌘K / Ctrl+K — global open shortcut.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (k) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    setOpen(false)
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  function pickSuggestion(q: string) {
    setOpen(false)
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <RestingBar tone={tone} onOpen={() => setOpen(true)} />

      {open && (
        <SearchPanel
          value={value}
          setValue={setValue}
          inputRef={expandedInputRef}
          onSubmit={submit}
          onClose={() => setOpen(false)}
          onPickSuggestion={pickSuggestion}
          suggestions={suggestions}
          recommendations={recommendations}
        />
      )}
    </>
  )
}

/* ----------------------------------------------------------------------
 * Resting bar — a rounded-full pill. Looks unmistakably like a search
 * input; behaves like a button until clicked.
 * ---------------------------------------------------------------------- */

function RestingBar({
  tone,
  onOpen,
}: {
  tone: 'photo' | 'paper'
  onOpen: () => void
}) {
  const tokens =
    tone === 'photo'
      ? {
          shell:
            'bg-paper/85 backdrop-blur-sm border border-paper/50 hover:border-paper',
          icon: 'text-twilight-soft',
          placeholder: 'text-twilight/55',
          hint: 'text-twilight-soft/55',
        }
      : {
          shell:
            'bg-pale-sky/60 border border-twilight/15 hover:border-twilight/40',
          icon: 'text-twilight-soft',
          placeholder: 'text-twilight/55',
          hint: 'text-twilight-soft/55',
        }

  return (
    <button
      type="button"
      onClick={onOpen}
      onKeyDown={(e: ReactKeyboardEvent<HTMLButtonElement>) => {
        const isPrintable = e.key.length === 1 && !e.metaKey && !e.ctrlKey
        if (isPrintable || e.key === '/') {
          e.preventDefault()
          onOpen()
        }
      }}
      aria-label="Open search"
      className={`group flex items-center gap-3 w-full rounded-full px-5 py-2.5 italic font-serif text-base transition-colors ${tokens.shell}`}
    >
      <SearchIcon className={`w-4 h-4 shrink-0 ${tokens.icon}`} />
      <span className={`flex-1 text-left ${tokens.placeholder}`}>
        ask the guide anything
      </span>
      <kbd
        className={`smallcaps !text-[0.6rem] !tracking-[0.18em] hidden sm:inline ${tokens.hint}`}
      >
        ⌘K
      </kbd>
    </button>
  )
}

/* ----------------------------------------------------------------------
 * Fullscreen panel — no header. Back button shares the input's row.
 * ---------------------------------------------------------------------- */

function SearchPanel({
  value,
  setValue,
  inputRef,
  onSubmit,
  onClose,
  onPickSuggestion,
  suggestions,
  recommendations,
}: {
  value: string
  setValue: (s: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (e: FormEvent) => void
  onClose: () => void
  onPickSuggestion: (q: string) => void
  suggestions: string[]
  recommendations: Entry[]
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the guide"
      className="fixed inset-0 z-50 bg-paper text-ink flex flex-col"
      style={{ animation: 'fadeIn 140ms ease-out both' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top row: Back + Search input — same baseline, no header chrome */}
      <section className="max-w-3xl w-full mx-auto px-5 sm:px-8 pt-6 sm:pt-8">
        <div className="flex items-stretch gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 smallcaps !text-twilight-soft hover:!text-twilight rounded-full border border-sandstone/60 hover:border-twilight/40 px-4 transition-colors flex items-center gap-1.5"
          >
            <span aria-hidden className="text-base leading-none">←</span>
            <span className="hidden sm:inline">Back</span>
          </button>

          <form onSubmit={onSubmit} className="flex-1 min-w-0">
            <div className="flex items-center gap-3 rounded-full bg-pale-sky/50 border border-twilight/15 focus-within:border-twilight/45 focus-within:bg-pale-sky/80 px-5 py-3 transition-colors">
              <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6 text-twilight-soft shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="ask the guide anything"
                className="flex-1 min-w-0 bg-transparent border-0 outline-none italic font-serif text-twilight placeholder:text-twilight/40 placeholder:italic px-0 py-0 text-lg sm:text-xl"
              />
              <button
                type="submit"
                aria-label="Ask"
                className="shrink-0 italic font-serif text-twilight/55 hover:text-orange transition-colors text-xl sm:text-2xl"
              >
                →
              </button>
            </div>
          </form>
        </div>
        <p className="smallcaps mt-3 ml-1 text-twilight-soft/70">
          enter to ask · esc to close
        </p>
      </section>

      {/* Suggestions + recommendations — scrolls inside the panel */}
      <section className="flex-1 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-x-10 gap-y-10">
          {/* Try asking — pill chips */}
          <div>
            <p className="smallcaps mb-4">Try asking</p>
            <ul className="flex flex-wrap gap-2">
              {suggestions.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => onPickSuggestion(q)}
                    className="font-serif italic text-twilight hover:text-orange hover:border-orange/40 hover:bg-paper-deep/50 transition-colors text-left text-base leading-snug rounded-full border border-twilight/15 px-4 py-2"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Or browse — rounded paper cards */}
          {recommendations.length > 0 && (
            <div>
              <p className="smallcaps mb-4">Or browse</p>
              <ul className="space-y-2">
                {recommendations.map((entry) => (
                  <li key={`${entry.source}/${entry.slug}`}>
                    <Link
                      to={`/entry/${entry.source}/${entry.slug}`}
                      onClick={onClose}
                      className="block group rounded-2xl border border-sandstone/40 hover:border-twilight/40 hover:bg-paper-deep/40 px-4 py-3 transition-colors"
                    >
                      <p className="font-display italic text-ink leading-snug group-hover:text-twilight transition-colors">
                        {entry.title}
                      </p>
                      <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft/80 mt-0.5">
                        {entry.domain}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ----------------------------------------------------------------------
 * Magnifying glass — inline SVG so we don't pull in an icon library
 * for a prototype. Stroke uses currentColor so it tones with the text.
 * ---------------------------------------------------------------------- */

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  )
}
