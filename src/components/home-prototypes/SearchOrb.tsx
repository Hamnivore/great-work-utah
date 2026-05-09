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
import { TierGlyph } from './parts/IssueShared'

/**
 * SEARCH · THE DESERT MOON
 *
 * First-principles question: what does a search bar even *look* like
 * if you forgot how everyone else does it?
 *
 * This iteration trades the photo cover for a quiet desert-twilight
 * sky and replaces the input field with a single object: a glowing
 * moon. The moon is the search affordance. Click it (or any of the
 * orbiting suggestions) and the screen falls into a deeper night —
 * the moon doubles in size and the input writes itself across the
 * face of it.
 *
 * The bet: a wiki of "great work in Utah" should feel a little bit
 * like standing on the salt flats at dusk. The user knows exactly
 * what to do — there's only one bright thing on the page.
 */
export function SearchOrb() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const featured = getFeaturedEntries(6)
  const suggestions = SUGGESTED_QUESTIONS.slice(0, 5)

  useEffect(() => {
    if (!open) return
    const id = window.requestAnimationFrame(() => inputRef.current?.focus())
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      window.cancelAnimationFrame(id)
    }
  }, [open])

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
    <div
      className="min-h-screen text-paper relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #4a6e7e 0%, #2c5364 32%, #1a2f3a 70%, #0e1a22 100%)',
      }}
    >
      <Stars />

      {/* Wordmark — small, on the dark, at the top of the sky */}
      <header className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 flex items-baseline justify-between">
        <Link to="/" className="block">
          <p className="font-display italic text-paper text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps !text-paper/55 mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps !text-paper/40 text-right">
          Vol. I · No. 014<br />Spring 2026
        </p>
      </header>

      {/* The moon */}
      <main className="relative flex flex-col items-center pt-16 sm:pt-20 pb-12">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open search"
          className="relative group transition-transform duration-500 hover:scale-[1.025] active:scale-[0.99]"
        >
          <Moon size={290} placeholder="speak into the moon" />
        </button>

        {/* Caption beneath the moon */}
        <p
          className="font-display italic text-paper/80 text-center leading-snug mt-12 max-w-md px-5"
          style={{ fontSize: 'clamp(1.05rem, 4vw, 1.4rem)' }}
        >
          The wiki has been listening since 1969.
          <br />
          What do you want to know?
        </p>

        {/* Suggestions, orbiting */}
        <ul className="mt-10 flex flex-wrap justify-center gap-2 max-w-2xl px-5">
          {suggestions.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => pickSuggestion(q)}
                className="font-serif italic text-paper/85 hover:text-paper rounded-full border border-paper/20 hover:border-paper/60 hover:bg-paper/5 px-4 py-1.5 text-sm transition-colors"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </main>

      {/* Constellations — featured entries as a quiet list */}
      <section className="relative max-w-3xl mx-auto px-5 sm:px-8 pb-20">
        <p className="smallcaps text-center !text-paper/45 mb-5">
          ⋆ also bright tonight ⋆
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {featured.map((entry) => (
            <li key={`${entry.source}/${entry.slug}`}>
              <Link
                to={`/entry/${entry.source}/${entry.slug}`}
                className="flex items-baseline gap-3 rounded-2xl border border-paper/10 hover:border-paper/35 hover:bg-paper/5 px-4 py-3 transition-colors group"
              >
                <TierGlyph
                  tier={entry.tier}
                  className="text-base !text-paper/85"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display italic text-paper leading-snug truncate group-hover:text-paper transition-colors">
                    {entry.title}
                  </p>
                  <p className="smallcaps !text-[0.6rem] !text-paper/45 mt-0.5">
                    {entry.domain}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* The open panel — the moon doubles in size, input across its face */}
      {open && (
        <OrbPanel
          value={value}
          setValue={setValue}
          inputRef={inputRef}
          onSubmit={submit}
          onClose={() => setOpen(false)}
          onPickSuggestion={pickSuggestion}
          suggestions={SUGGESTED_QUESTIONS.slice(0, 8)}
        />
      )}
    </div>
  )
}

/* ---------- The moon, itself ---------- */

function Moon({
  size = 290,
  placeholder,
  inputProps,
  inputRef,
}: {
  size?: number
  placeholder?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  inputRef?: React.RefObject<HTMLInputElement | null>
}) {
  // Soft, warm body of the moon. We layer a couple of inset shadows
  // and a wide ambient glow so the moon reads as luminous, not just
  // a beige circle.
  const orb = (
    <div
      className="rounded-full relative"
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle at 35% 30%, #fff8e7 0%, #f3dba0 30%, #d2a967 60%, #8d6a3d 92%)',
        boxShadow:
          '0 0 80px rgba(243, 219, 160, 0.40), 0 0 200px rgba(243, 219, 160, 0.16), inset -22px -22px 50px rgba(60, 40, 20, 0.35), inset 14px 14px 36px rgba(255, 248, 231, 0.55)',
      }}
    >
      {/* Subtle craters */}
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: size * 0.13,
          height: size * 0.13,
          left: '24%',
          top: '52%',
          background: 'radial-gradient(circle, rgba(60,40,20,0.18) 0%, transparent 70%)',
        }}
      />
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: size * 0.08,
          height: size * 0.08,
          left: '64%',
          top: '63%',
          background: 'radial-gradient(circle, rgba(60,40,20,0.16) 0%, transparent 70%)',
        }}
      />
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: size * 0.05,
          height: size * 0.05,
          left: '52%',
          top: '34%',
          background: 'radial-gradient(circle, rgba(60,40,20,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Centered text — placeholder when resting, input when open */}
      {inputProps ? (
        <input
          ref={inputRef}
          {...inputProps}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto bg-transparent text-twilight italic font-serif text-center outline-none placeholder:text-twilight/45 px-6"
          style={{
            width: '82%',
            fontSize: `${size * 0.085}px`,
          }}
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center font-display italic text-twilight px-6 text-center leading-tight"
          style={{ fontSize: `${size * 0.082}px` }}
        >
          {placeholder}
        </span>
      )}
    </div>
  )
  return orb
}

/* ---------- The fullscreen "deep night" panel ---------- */

function OrbPanel({
  value,
  setValue,
  inputRef,
  onSubmit,
  onClose,
  onPickSuggestion,
  suggestions,
}: {
  value: string
  setValue: (s: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (e: FormEvent) => void
  onClose: () => void
  onPickSuggestion: (q: string) => void
  suggestions: string[]
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the guide"
      className="fixed inset-0 z-50 text-paper flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse at 50% 45%, #3a5a6c 0%, #182a36 60%, #050a0e 100%)',
        animation: 'orbFadeIn 220ms ease-out both',
      }}
    >
      <style>{`
        @keyframes orbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes orbRise {
          from { transform: translateY(20px) scale(0.92); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      <Stars dim />

      <header className="relative px-5 sm:px-8 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="smallcaps !text-paper/60 hover:!text-paper rounded-full border border-paper/20 hover:border-paper/55 px-4 py-2 transition-colors flex items-center gap-1.5"
        >
          <span aria-hidden>←</span>
          Back to the dark
        </button>
        <p className="smallcaps !text-paper/35 hidden sm:block">esc to close</p>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pt-2">
        <form
          onSubmit={onSubmit}
          style={{ animation: 'orbRise 360ms ease-out both' }}
        >
          <Moon
            size={Math.min(420, typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.72, window.innerHeight * 0.55) : 420)}
            inputRef={inputRef}
            inputProps={{
              type: 'text',
              value,
              onChange: (e) => setValue(e.target.value),
              placeholder: 'ask the moon',
              autoFocus: true,
            }}
          />
          <p className="smallcaps text-center !text-paper/45 mt-6">
            enter to ask
          </p>
        </form>

        <ul className="mt-10 flex flex-wrap justify-center gap-2 max-w-3xl">
          {suggestions.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => onPickSuggestion(q)}
                className="font-serif italic text-paper/80 hover:text-paper rounded-full border border-paper/15 hover:border-paper/55 hover:bg-paper/5 px-4 py-1.5 text-sm transition-colors"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

/* ---------- A handful of stars in the sky (no library, no canvas) ---------- */

const STAR_FIELD: Array<{ x: number; y: number; r: number; o: number }> = [
  { x: 8, y: 14, r: 1.2, o: 0.7 },
  { x: 17, y: 8, r: 0.8, o: 0.55 },
  { x: 26, y: 22, r: 1.4, o: 0.85 },
  { x: 33, y: 11, r: 0.7, o: 0.45 },
  { x: 41, y: 18, r: 1.1, o: 0.7 },
  { x: 49, y: 7, r: 0.9, o: 0.6 },
  { x: 58, y: 14, r: 1.3, o: 0.8 },
  { x: 66, y: 9, r: 0.7, o: 0.5 },
  { x: 73, y: 21, r: 1.0, o: 0.65 },
  { x: 82, y: 13, r: 1.4, o: 0.85 },
  { x: 89, y: 19, r: 0.9, o: 0.55 },
  { x: 12, y: 32, r: 0.8, o: 0.5 },
  { x: 22, y: 44, r: 1.0, o: 0.6 },
  { x: 38, y: 58, r: 0.7, o: 0.4 },
  { x: 53, y: 49, r: 1.1, o: 0.65 },
  { x: 67, y: 36, r: 0.9, o: 0.55 },
  { x: 78, y: 53, r: 1.2, o: 0.7 },
  { x: 90, y: 41, r: 0.8, o: 0.5 },
  { x: 6, y: 62, r: 1.0, o: 0.55 },
  { x: 20, y: 70, r: 0.7, o: 0.45 },
  { x: 36, y: 78, r: 1.3, o: 0.7 },
  { x: 52, y: 82, r: 0.9, o: 0.55 },
  { x: 70, y: 75, r: 1.1, o: 0.65 },
  { x: 86, y: 84, r: 0.8, o: 0.5 },
  { x: 94, y: 68, r: 1.0, o: 0.6 },
]

function Stars({ dim = false }: { dim?: boolean }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      style={{ opacity: dim ? 0.55 : 1 }}
    >
      {STAR_FIELD.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.18}
          fill="#faf1e2"
          opacity={s.o}
        />
      ))}
    </svg>
  )
}
