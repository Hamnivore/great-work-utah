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
 * SEARCH · THE EDITOR'S NOTE
 *
 * First-principles question: what if the home page wasn't a magazine
 * cover at all — what if it was a personal note from the editor of
 * the wiki, asking the reader what they came for, and the search bar
 * was simply where the reader writes their reply?
 *
 * The page reads like a paper letter, not a chat:
 *
 *   GREAT WORK · UTAH
 *
 *   Hi. I'm the editor of Great Work, a quietly opinionated wiki
 *   of meaningful work happening in Utah. Tell me what you're
 *   after and I'll point at things.
 *
 *      [ Find a person ]   [ Surprise me ]
 *      [ Hard tech in Utah ]   [ Who's making things in the desert? ]
 *
 *   ─────────────────────────────────────────────────────────
 *
 *   ▌ Your reply ─ press ⏎ to send
 *
 *   ─── or browse three the editor likes ───
 *     ◇ Recursion Pharmaceuticals
 *     ◇ Spiral Jetty
 *     ◇ Capecchi gene targeting
 *
 * The bet: nobody else opens a wiki with "hi." The whole page is one
 * working surface, the search is the most natural thing on it (the
 * input is literally how you reply to a note), and the quick-reply
 * chips give the reader an out if they don't have a question yet.
 */
export function SearchConversation() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  const quickReplies = SUGGESTED_QUESTIONS.slice(0, 6)
  const featured = getFeaturedEntries(3)

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

  function pickReply(q: string) {
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen bg-paper text-ink relative flex flex-col">
      {/* Wordmark — small, top-left, no chrome */}
      <header className="max-w-2xl w-full mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-lg leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah · a quiet wiki</p>
        </Link>
      </header>

      {/* The note + reply */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16">
        {/* The editor's note */}
        <p className="smallcaps mb-3">A note from the editor</p>
        <p
          className="font-display italic text-ink leading-[1.25]"
          style={{ fontSize: 'clamp(1.5rem, 5.5vw, 2rem)' }}
        >
          Hi. I&rsquo;m the editor of Great Work, a quietly opinionated
          wiki of meaningful work happening in Utah. Tell me what
          you&rsquo;re after and I&rsquo;ll point at things.
        </p>
        <p className="font-serif italic text-ink-soft mt-4 text-base leading-snug">
          &mdash; written from the salt flats, May 2026.
        </p>

        {/* Quick replies — like a letter that pre-types your possible answers */}
        <p className="smallcaps mt-12 mb-3">Quick replies</p>
        <ul className="flex flex-wrap gap-2">
          {quickReplies.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => pickReply(q)}
                className="font-serif italic text-twilight hover:text-orange hover:border-orange/45 hover:bg-paper-deep/50 transition-colors rounded-full border border-twilight/20 px-4 py-2 text-base leading-snug text-left"
              >
                {q}
              </button>
            </li>
          ))}
        </ul>

        <hr className="border-sandstone/55 mt-12" />

        {/* The reply input — pinned just below the chips, like the gap on a letter */}
        <form onSubmit={submit} className="mt-8 sm:mt-10">
          <p className="smallcaps mb-3">Your reply</p>
          <div className="flex items-center gap-3 rounded-full bg-pale-sky/55 border border-twilight/20 focus-within:border-twilight/55 focus-within:bg-pale-sky/85 px-5 py-3.5 transition-colors">
            <span
              className="font-display italic text-twilight/45 text-lg shrink-0"
              aria-hidden
            >
              &rdquo;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="write back to the editor"
              className="flex-1 min-w-0 bg-transparent border-0 outline-none italic font-serif text-twilight placeholder:text-twilight/40 placeholder:italic px-0 py-0 text-lg"
            />
            <button
              type="submit"
              aria-label="Send reply"
              className="shrink-0 italic font-serif text-twilight/55 hover:text-orange transition-colors text-xl"
            >
              ⏎
            </button>
          </div>
          <p className="smallcaps mt-3 text-twilight-soft/70 ml-1">
            enter to send · the editor reads everything
          </p>
        </form>

        {/* A tiny "or browse" — the editor's three picks */}
        <section className="mt-14">
          <p className="smallcaps mb-3">Or three the editor liked this week</p>
          <ul className="space-y-2">
            {featured.map((entry) => (
              <li key={`${entry.source}/${entry.slug}`}>
                <Link
                  to={`/entry/${entry.source}/${entry.slug}`}
                  className="flex items-baseline gap-3 group"
                >
                  <span aria-hidden className="text-twilight/55 select-none">
                    ◇
                  </span>
                  <span className="font-display italic text-ink group-hover:text-twilight transition-colors leading-snug">
                    {entry.title}
                  </span>
                  <TierGlyph
                    tier={entry.tier}
                    className="text-sm !text-twilight-soft/70"
                  />
                  <span className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft/70 ml-auto">
                    {entry.domain}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Sign-off — the editor's "monogram" at the bottom of the page */}
      <footer className="max-w-2xl w-full mx-auto px-5 sm:px-8 pb-12 sm:pb-16">
        <p className="ornament">— ❦ —</p>
        <p className="smallcaps text-center">Vol. I · No. 014 · Spring 2026</p>
      </footer>
    </div>
  )
}
