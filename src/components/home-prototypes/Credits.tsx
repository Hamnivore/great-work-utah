import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { AskBar } from '../AskBar'
import { ISSUE, getAllEntriesForCredits } from './_shared'

/**
 * THE CREDITS  (trash heap)
 * Every single entry — all 251 of them — scrolls past the screen like
 * the credits at the end of a film, top to bottom, slow. No images.
 * No tier marks. No domain labels. Just titles, in order of weight.
 * The Ask bar is pinned to the bottom of the screen as the only stable
 * UI element, so the reader can break out of the scroll any time.
 *
 * Why it's dumb:
 * - Nobody reads movie credits. The implied posture (sit and watch
 *   names go by) does not match a website visitor's posture (look
 *   for what I want and click).
 * - It reduces every entry to a name. The wiki's actual value — the
 *   prose, the citations, the calls — is invisible.
 * - On mobile, autoplay scroll fights browser pull-to-refresh and
 *   read-aloud accessibility tools. Pause-on-tap helps but is awkward.
 *
 * Why it might be great:
 * - It is the most honest expression of "we have a lot, and we wrote
 *   each one ourselves." The cumulative effect is staggering at 251
 *   lines drifting past.
 * - The Ask bar at the bottom feels like saying "or just type" while
 *   the room is in motion — exactly the right metaphor.
 * - As an *occasional* state (not the perma-home), this could be a
 *   beautiful "we publish a new issue every Sunday" easter egg.
 */
export function CreditsHome() {
  const entries = getAllEntriesForCredits()
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // CSS animation handles the actual scroll. We just toggle play state.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.style.animationPlayState = paused ? 'paused' : 'running'
  }, [paused])

  return (
    <div className="min-h-screen bg-paper text-ink overflow-hidden flex flex-col">
      {/* Slim masthead — sticky at top */}
      <header className="sticky top-0 z-20 bg-paper/95 backdrop-blur-sm border-b border-sandstone/50">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3 flex items-baseline justify-between gap-4">
          <Link to="/" className="block">
            <p className="font-display italic text-twilight text-lg leading-none">
              Great Work
            </p>
            <p className="smallcaps mt-0.5">Utah, USA</p>
          </Link>
          <div className="flex items-baseline gap-3">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="smallcaps hover:text-twilight transition-colors"
              aria-label={paused ? 'Resume' : 'Pause'}
            >
              {paused ? '▶ Resume' : '❙❙ Pause'}
            </button>
            <span className="smallcaps text-twilight-soft/80">
              {ISSUE.season}
            </span>
          </div>
        </div>
      </header>

      {/* THE SCROLL */}
      <section className="relative flex-1 min-h-[80vh] overflow-hidden">
        {/* Soft top/bottom fade so titles dissolve in & out */}
        <div
          className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-paper) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, var(--color-paper) 0%, rgba(0,0,0,0) 100%)',
          }}
        />

        {/* The scrolling track — animated by CSS keyframes */}
        <div
          ref={trackRef}
          className="absolute inset-x-0 will-change-transform credits-roll"
          style={{
            top: '100%',
          }}
        >
          {entries.map((e) => (
            <p
              key={`${e.source}/${e.slug}`}
              className="text-center font-serif italic text-ink leading-snug py-2 px-4"
            >
              <Link
                to={`/entry/${e.source}/${e.slug}`}
                className="hover:text-orange transition-colors"
              >
                {e.title}
              </Link>
            </p>
          ))}
          {/* The Editors footer slug — a tiny moment of voice at the end of the roll */}
          <p className="text-center smallcaps text-twilight-soft/80 mt-12 mb-24">
            — by the editors —
          </p>
        </div>

        {/* Centered "this is what's playing" overlay */}
        <div className="absolute inset-x-0 top-6 sm:top-10 px-5 text-center z-10">
          <p className="smallcaps">All 251 entries · in order of weight</p>
          <h1
            className="font-display italic text-twilight leading-none mt-1"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)' }}
          >
            The credits
          </h1>
        </div>
      </section>

      {/* Sticky ask bar at the foot of the room */}
      <footer className="sticky bottom-0 z-20 bg-paper/95 backdrop-blur-sm border-t border-sandstone/50">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-3">
          <p className="font-serif italic text-ink-soft text-xs text-center mb-1.5">
            Or just type something.
          </p>
          <AskBar />
        </div>
      </footer>

      {/* Inline keyframes — kept local so the prototype doesn't touch index.css */}
      <style>{`
        @keyframes credits-roll {
          from { transform: translateY(0); }
          to   { transform: translateY(-220%); }
        }
        .credits-roll {
          animation: credits-roll 280s linear infinite;
        }
      `}</style>
    </div>
  )
}
