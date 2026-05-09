import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  SUGGESTED_QUESTIONS,
  getFeaturedEntries,
} from './_shared'

/**
 * SEARCH · THE TYPEWRITER FORM
 *
 * First-principles question: what does it look like to ask a wiki for
 * help, if the only office equipment we had was a typewriter and a
 * carbon-copy request form?
 *
 * This iteration is the home as a single sheet of mono-spaced paper:
 *
 *   GREAT WORK · UTAH ─────────────────────────  REQ. NO. 014
 *   ════════════════════════════════════════════════════════
 *
 *   FIND ▌
 *
 *   Pre-typed below are five lines other readers struck through.
 *   Pick one (it copies up to FIND), or type your own. Hit ⏎ to
 *   send your request to The Editor.
 *
 *     ▢  FIND: senior engineers who'd join a hard-tech team
 *     ▢  FIND: who's making things in the desert
 *     ▢  FIND: …
 *
 *   ─── REC. ────────────────────────────────────────────────
 *
 *     ■ Recursion Pharmaceuticals    place      S
 *     ■ Spiral Jetty                  great work S
 *     ■ Capecchi gene targeting       great work S
 *     …
 *
 *                                                         —ED.
 *
 * The bet: there's exactly one place to type, the page tells you
 * what to do in plain English, and every working surface is set in
 * the same mono ink so nothing looks "form-like" — the form *is* the
 * page.
 */
export function SearchTypewriter() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  const suggestions = SUGGESTED_QUESTIONS.slice(0, 6)
  const featured = getFeaturedEntries(6)

  // Focus the input on mount — the home IS the search.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(id)
  }, [])

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  function pickSuggestion(q: string) {
    setValue(q)
    inputRef.current?.focus()
  }

  return (
    <div
      className="min-h-screen bg-paper text-ink relative"
      style={{
        // Faint horizontal rules every 28px, like ruled typewriter paper.
        backgroundImage:
          'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(42,31,24,0.05) 27px, rgba(42,31,24,0.05) 28px)',
      }}
    >
      <style>{`
        @keyframes typewriter-cursor {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="max-w-2xl mx-auto px-5 sm:px-10 pt-12 sm:pt-16 pb-16 font-mono text-[15px] leading-[28px] text-ink">

        {/* ===== MASTHEAD ===== */}
        <header className="flex items-baseline justify-between gap-4">
          <Link to="/" className="block">
            <p className="font-mono uppercase tracking-[0.18em] text-ink">
              Great Work · Utah
            </p>
          </Link>
          <p className="text-twilight-soft tracking-[0.18em] uppercase text-xs sm:text-sm">
            Req. No. 014 / Vol. I
          </p>
        </header>

        {/* Double rule — typewritten with === */}
        <div className="mt-1 mb-8">
          <div className="border-t border-ink" />
          <div className="border-t border-ink mt-[2px]" />
        </div>

        {/* ===== FIND ===== */}
        <form onSubmit={submit} className="mb-10">
          <label
            htmlFor="typewriter-find"
            className="block uppercase tracking-[0.16em] text-twilight-soft text-xs mb-2"
          >
            Find ─ what would you like the editor to find for you?
          </label>
          <div className="flex items-center gap-2 border-b border-dashed border-ink/55 focus-within:border-ink pb-1">
            <span className="font-mono text-twilight uppercase tracking-[0.14em] text-[13px]">
              Find:
            </span>
            <input
              ref={inputRef}
              id="typewriter-find"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="type your request"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none font-mono text-ink placeholder:text-ink/35 text-[15px] sm:text-[16px] py-1"
              spellCheck
            />
            <span
              aria-hidden
              className="inline-block w-[10px] h-[18px] bg-ink translate-y-[1px]"
              style={{ animation: 'typewriter-cursor 1.05s step-end infinite' }}
            />
            <button
              type="submit"
              className="ml-2 font-mono uppercase tracking-[0.14em] text-[12px] text-twilight-soft hover:text-twilight border border-ink/30 hover:border-twilight px-2 py-1 rounded-sm transition-colors"
              aria-label="Submit request"
            >
              ⏎ send
            </button>
          </div>

          <p className="mt-3 italic font-serif text-ink-soft text-[15px] leading-snug">
            Pre-typed below are six lines other readers struck through this
            week. Pick one (it copies up to <span className="font-mono uppercase">find</span>),
            or just keep typing your own.
          </p>
        </form>

        {/* ===== STRIKETHROUGHS — pre-typed prior requests ===== */}
        <ul className="space-y-1 mb-12">
          {suggestions.map((q, i) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => pickSuggestion(q)}
                className="group flex items-baseline gap-3 w-full text-left hover:bg-paper-deep/60 px-1 -mx-1 transition-colors"
              >
                <span
                  className="font-mono uppercase tracking-[0.14em] text-[11px] text-twilight-soft/70 w-8 shrink-0 select-none"
                  aria-hidden
                >
                  R.{String(i + 1).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  className="text-ink/40 select-none group-hover:text-orange transition-colors"
                >
                  ▢
                </span>
                <span className="font-mono uppercase tracking-[0.14em] text-[11px] text-twilight w-12 shrink-0 select-none">
                  Find:
                </span>
                <span className="font-mono text-[14px] text-ink line-through decoration-ink/30 group-hover:decoration-orange/60 group-hover:text-twilight transition-colors">
                  {q}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* ===== REC. — featured entries as a typewritten table ===== */}
        <section className="mb-10">
          <p className="uppercase tracking-[0.18em] text-twilight-soft text-xs mb-2">
            ─── Rec. ─ also approved by the editor ────────────────────
          </p>
          <ul className="divide-y divide-ink/15 border-y border-ink/20">
            {featured.map((entry) => (
              <li key={`${entry.source}/${entry.slug}`}>
                <Link
                  to={`/entry/${entry.source}/${entry.slug}`}
                  className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-baseline px-1 py-1.5 hover:bg-paper-deep/60 transition-colors"
                >
                  <span aria-hidden className="text-ink/55 select-none">
                    ■
                  </span>
                  <span className="font-mono text-[14px] text-ink hover:text-twilight transition-colors truncate">
                    {entry.title}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-twilight-soft/85 hidden sm:inline">
                    {entry.domain}
                  </span>
                  <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-orange w-5 text-right">
                    {entry.tier}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ===== Sign-off ===== */}
        <footer className="mt-10 flex items-baseline justify-between text-twilight-soft text-xs uppercase tracking-[0.16em]">
          <p>Filed at the salt flats · May 2026</p>
          <p>—Ed.</p>
        </footer>

      </div>
    </div>
  )
}
