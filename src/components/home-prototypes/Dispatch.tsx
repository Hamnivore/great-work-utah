import { Link } from 'react-router-dom'
import { AskBar } from '../AskBar'
import { TierMark } from '../TierMark'
import {
  ISSUE,
  SUGGESTED_QUESTIONS,
  getCoverEntry,
  getFeaturedEntries,
} from './_shared'

/**
 * THE DISPATCH
 * The front page is today's editorial column — written by the Editors,
 * full of inline links into the wiki. The reader doesn't see a list of
 * cards; they read a short essay that mentions five things and tells
 * them which one to click first.
 *
 * The bet: a paragraph of warm prose with five real entries threaded
 * through it is a better hook than a card grid for a reader who has
 * never been here before.
 *
 * The mistake on purpose: editorial copy hard-coded into a React file.
 * In production this comes from the LLM-maintained wiki — but we can
 * write a humans-first first draft and let the agent improve it later.
 */
export function DispatchHome() {
  const cover = getCoverEntry()
  const featured = getFeaturedEntries(7)
  const [, e2, e3, , , e6] = featured
  const linkClass =
    'font-serif italic text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange transition-colors'

  return (
    <div className="min-h-screen bg-paper text-ink editorial">
      {/* Slim masthead */}
      <header className="max-w-2xl mx-auto px-5 sm:px-8 pt-7 sm:pt-9 flex items-baseline justify-between gap-4">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps text-right leading-tight">
          {ISSUE.dateline}
        </p>
      </header>

      {/* The dispatch */}
      <article className="max-w-2xl mx-auto px-5 sm:px-8 mt-12 prose-editorial">
        <p className="smallcaps">A letter from the editors · {ISSUE.season}</p>
        <h1
          className="font-display italic text-ink leading-[0.98] mt-2"
          style={{ fontSize: 'clamp(2.4rem, 10vw, 3.4rem)' }}
        >
          What we&rsquo;re paying attention to in Utah this week.
        </h1>

        <p className="font-display italic text-twilight text-xl leading-snug mt-5">
          Five entries to wander into, and one open question we don&rsquo;t yet have an answer to.
        </p>

        <p className="smallcaps mt-3">By the editors · 4 min read · {ISSUE.dateline}</p>

        {/* Divider */}
        <hr className="border-sandstone/50 my-8 w-1/3" />

        {/* Body — Caslon, drop cap, real entries threaded inline */}
        <div className="font-serif text-ink leading-loose text-[1.05rem]">
          <p className="first-letter:font-display first-letter:italic first-letter:text-7xl first-letter:text-twilight first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.85]">
            Most of the great work happening in Utah is invisible from the coasts. The cover this issue is{' '}
            <Link to={`/entry/${cover.source}/${cover.slug}`} className={linkClass}>
              {cover.title}
            </Link>{' '}
            <TierMark tier={cover.tier} size="sm" />, which is trying to do something that until very recently nobody could do.{' '}
            {firstSentenceish(cover.summary)} If you only click on one thing this week, click on that one.
          </p>

          <p className="mt-5">
            From there, the obvious wandering: into the energy entries, where{' '}
            <Link to={`/entry/${e2.source}/${e2.slug}`} className={linkClass}>
              {e2.title}
            </Link>{' '}
            is doing something that ought to be impossible at the prices it&rsquo;s doing it for; and into the BCI corner of the wiki, where{' '}
            <Link to={`/entry/${e3.source}/${e3.slug}`} className={linkClass}>
              {e3.title}
            </Link>{' '}
            has been quietly making the most-implanted neural interface in history for two decades, fifteen minutes from Temple Square.
          </p>

          <p className="mt-5">
            For the historians: nobody has yet matched what{' '}
            <Link to={`/entry/${e6.source}/${e6.slug}`} className={linkClass}>
              {e6.title}
            </Link>{' '}
            did out at Rozel Point in 1970. We have a piece arguing it&rsquo;s the best land artwork ever made, and a guide to driving out there if you want to disagree in person.
          </p>

          {/* Pull quote */}
          <blockquote className="my-9 pl-5 border-l-4 border-twilight/60">
            <p className="font-display italic text-twilight text-2xl leading-snug">
              We are an Atlas Obscura for ambition. We rank confidently, we cite generously, we update weekly.
            </p>
            <p className="smallcaps mt-2 not-italic">— The editors</p>
          </blockquote>

          <p>
            For the rolodex problem (&ldquo;who in Utah does X?&rdquo;), the right move is the search bar below — the guide will write you back an article in response. Try one of the questions, or type your own. Browser-back is the conversation history.
          </p>
        </div>

        {/* Inline ask bar */}
        <div className="mt-10">
          <AskBar />
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i, arr) => (
              <li key={q} className="flex items-baseline gap-3">
                <a
                  href={`/ask?q=${encodeURIComponent(q)}`}
                  className="font-serif italic text-twilight hover:text-orange transition-colors text-sm"
                >
                  {q}
                </a>
                {i < arr.length - 1 && <span className="text-twilight-soft/40">·</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Open question */}
        <hr className="border-sandstone/50 my-10" />
        <p className="smallcaps">An open question</p>
        <p className="font-display italic text-ink text-2xl leading-snug mt-3">
          What other companies in Utah deserve a featured cover this year?
        </p>
        <p className="font-serif italic text-ink-soft text-sm mt-3">
          We make our nominations public.{' '}
          <Link to="/raise-hand" className="text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange">
            Raise your hand →
          </Link>
        </p>

        {/* Tail */}
        <hr className="border-sandstone/50 my-10" />
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-serif italic text-ink-soft text-sm leading-snug">
            Filed in {ISSUE.season}. Returns weekly.
          </p>
          <Link
            to="/directory"
            className="smallcaps text-twilight hover:text-orange transition-colors"
          >
            The full directory →
          </Link>
        </div>
      </article>
      <div className="h-16" />
    </div>
  )
}

function firstSentenceish(text: string): string {
  const cleaned = (text || '').trim().replace(/\s+/g, ' ')
  const m = cleaned.match(/^.+?[.!?](?:\s|$)/)
  return (m ? m[0] : cleaned).trim()
}
