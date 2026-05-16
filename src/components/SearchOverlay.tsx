import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Entry } from '../lib/types'
import { getFeaturedEntries, SUGGESTED_QUESTIONS } from './home-prototypes/_shared'
import { logQuery } from '../lib/supabase'
import { localSearch, type LocalSearchResult } from '../lib/localSearch'
import { SearchOverlayContext } from './searchOverlayContext'

export function SearchOverlayProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const recommendations = getFeaturedEntries(5)
  const suggestions = SUGGESTED_QUESTIONS.slice(0, 8)

  function openSearch(initialValue = '') {
    setValue(initialValue)
    setOpen(true)
  }

  function closeSearch() {
    setOpen(false)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (k) {
        e.preventDefault()
        openSearch()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

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
    logQuery(q)
    const topMatch = localSearch(q, 1)[0]?.entry
    if (topMatch) {
      navigate(`/entry/${topMatch.source}/${topMatch.slug}`)
    } else {
      navigate(`/ask?q=${encodeURIComponent(q)}`)
    }
  }

  function pickSuggestion(q: string) {
    setOpen(false)
    logQuery(q)
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  return (
    <SearchOverlayContext.Provider
      value={{ isOpen: open, openSearch, closeSearch }}
    >
      {children}
      {open && (
        <LargeSearchPanel
          value={value}
          setValue={setValue}
          inputRef={inputRef}
          onSubmit={submit}
          onClose={closeSearch}
          onPickSuggestion={pickSuggestion}
          suggestions={suggestions}
          recommendations={recommendations}
          searchResults={localSearch(value, 8)}
        />
      )}
    </SearchOverlayContext.Provider>
  )
}

function LargeSearchPanel({
  value,
  setValue,
  inputRef,
  onSubmit,
  onClose,
  onPickSuggestion,
  suggestions,
  recommendations,
  searchResults,
}: {
  value: string
  setValue: (s: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onSubmit: (e: FormEvent) => void
  onClose: () => void
  onPickSuggestion: (q: string) => void
  suggestions: string[]
  recommendations: Entry[]
  searchResults: LocalSearchResult[]
}) {
  const hasQuery = value.trim().length > 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the guide"
      className="fixed inset-0 z-50 bg-paper text-ink flex flex-col"
      style={{ animation: 'searchOverlayFadeIn 140ms ease-out both' }}
    >
      <style>{`
        @keyframes searchOverlayFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
          {hasQuery && searchResults.length > 0
            ? 'enter to open top match · esc to close'
            : 'enter to ask · esc to close'}
        </p>
      </section>

      <section className="flex-1 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-x-10 gap-y-10">
          <div>
            {hasQuery ? (
              <>
                <p className="smallcaps mb-4">Matching articles</p>
                {searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map(({ entry, matchedTerms }, index) => (
                      <li key={`${entry.source}/${entry.slug}`}>
                        <Link
                          to={`/entry/${entry.source}/${entry.slug}`}
                          onClick={onClose}
                          className={`block group rounded-md border px-4 py-3 transition-colors ${
                            index === 0
                              ? 'border-twilight/35 bg-pale-sky/45 hover:border-orange/45'
                              : 'border-sandstone/45 hover:border-twilight/40 hover:bg-paper-deep/40'
                          }`}
                        >
                          <p className="font-display text-ink leading-snug group-hover:text-twilight transition-colors">
                            {entry.title}
                          </p>
                          {entry.summary && (
                            <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1 line-clamp-2">
                              {entry.summary}
                            </p>
                          )}
                          <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft/80 mt-2">
                            {entry.domain}
                            {matchedTerms.length > 0
                              ? ` · ${matchedTerms.slice(0, 3).join(' · ')}`
                              : ''}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-md border border-sandstone/45 bg-paper-deep/35 px-4 py-3">
                    <p className="font-serif italic text-ink-soft leading-snug">
                      No article matches yet. Press enter to ask the guide.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div>
            {recommendations.length > 0 && (
              <>
                <p className="smallcaps mb-4">Or browse</p>
                <ul className="space-y-2">
                  {recommendations.map((entry) => (
                    <li key={`${entry.source}/${entry.slug}`}>
                      <Link
                        to={`/entry/${entry.source}/${entry.slug}`}
                        onClick={onClose}
                        className="block group rounded-2xl border border-sandstone/40 hover:border-twilight/40 hover:bg-paper-deep/40 px-4 py-3 transition-colors"
                      >
                        <p className="font-display text-ink leading-snug group-hover:text-twilight transition-colors">
                          {entry.title}
                        </p>
                        <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft/80 mt-0.5">
                          {entry.domain}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div
              className={
                recommendations.length > 0
                  ? 'mt-7 pt-5 border-t border-sandstone/40'
                  : ''
              }
            >
              <p className="smallcaps mb-3">About the guide</p>
              <ul className="space-y-1.5">
                {[
                  {
                    to: '/how-it-works',
                    title: 'How it works',
                    blurb: 'The wiki, the agent, the AI approach.',
                  },
                  {
                    to: '/tier-system',
                    title: 'The tier system',
                    blurb: 'How we rank great work — in public.',
                  },
                  {
                    to: '/raise-hand',
                    title: 'Raise your hand',
                    blurb: 'Tell the guide who you are.',
                  },
                ].map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      className="block group rounded-2xl px-4 py-2.5 hover:bg-paper-deep/40 transition-colors"
                    >
                      <p className="font-display italic text-ink leading-snug group-hover:text-twilight transition-colors">
                        {item.title}
                      </p>
                      <p className="font-serif italic text-ink-soft text-sm leading-snug mt-0.5">
                        {item.blurb}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function SearchIcon({ className = '' }: { className?: string }) {
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
