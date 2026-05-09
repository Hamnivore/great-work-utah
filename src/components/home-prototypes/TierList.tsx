import { Link } from 'react-router-dom'
import { AskBar } from '../AskBar'
import { ISSUE } from './_shared'
import { getAllEntries } from '../../lib/data'
import type { Entry, Tier } from '../../lib/types'

/**
 * THE TIER LIST  (trash heap)
 * The home is a Smash Bros tier list. Every entry is a tile, sorted by
 * tier into S/A/B rows. Loud, opinionated, immediate. Reading the page
 * means glancing at the rankings before reading a single sentence.
 *
 * Why it's dumb: design-direction.md is explicit that universal tiers
 * shouldn't be stamped on the front page — rankings live in *guides*,
 * not as a global judgment. This violates that intentionally to see
 * whether immediacy is worth the cost.
 *
 * Why it might be great: the wiki actually does rank confidently. A
 * front page that names the rankings instead of hiding them treats
 * the reader like an adult. Atlas Obscura with a tier list ON the
 * cover would be a fight people would want to read. Smash Bros energy.
 */

const ROW_TIERS: Tier[] = ['S', 'A', 'B']

const ROW_COLOR: Record<Tier, string> = {
  S: 'bg-orange/85 text-paper',
  A: 'bg-orange/55 text-paper',
  B: 'bg-twilight/70 text-paper',
  C: 'bg-twilight-soft/60 text-paper',
  D: 'bg-sandstone text-ink',
  F: 'bg-ink/80 text-paper',
  'P-A': 'bg-twilight text-paper',
  'P-B': 'bg-twilight text-paper',
  'P-C': 'bg-twilight text-paper',
  unknown: 'bg-sandstone text-ink',
}

export function TierListHome() {
  const all = getAllEntries()
  const byTier: Record<Tier, Entry[]> = {} as Record<Tier, Entry[]>
  for (const t of ROW_TIERS) {
    byTier[t] = all
      .filter((e) => e.tier === t)
      .sort((a, b) => Number(b.isStarred) - Number(a.isStarred) || a.title.localeCompare(b.title))
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Slim masthead + chrome */}
      <header className="max-w-7xl mx-auto px-5 sm:px-8 pt-5 sm:pt-7 flex items-baseline justify-between gap-4">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps text-right">
          The board · {ISSUE.season}
        </p>
      </header>

      {/* The provocation */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-8 sm:mt-10">
        <p className="smallcaps">A tier list of all 251 entries</p>
        <h1
          className="font-display italic text-ink leading-[0.95] mt-2"
          style={{ fontSize: 'clamp(2.4rem, 10vw, 3.4rem)' }}
        >
          We&rsquo;ll just say it.
        </h1>
        <p className="font-display italic text-twilight text-xl leading-snug mt-3 max-w-prose">
          The wiki has opinions about who&rsquo;s doing the world&rsquo;s great work in Utah. Here are the opinions, ranked.
        </p>
        <p className="font-serif italic text-ink-soft text-sm leading-snug mt-3 max-w-prose">
          Click any name to read the entry that backs the call. Disagree?{' '}
          <Link to="/raise-hand" className="text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange">
            Raise your hand
          </Link>{' '}
          — we publish the case both ways.
        </p>

        {/* Search nudge */}
        <div className="mt-7">
          <AskBar />
        </div>
      </section>

      {/* THE BOARD */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 mt-10 mb-10 space-y-2">
        {ROW_TIERS.map((tier) => (
          <TierRow key={tier} tier={tier} entries={byTier[tier]} />
        ))}
      </section>

      {/* Tail */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 mt-8 mb-16">
        <hr className="border-sandstone/50" />
        <div className="flex items-baseline justify-between mt-5 gap-4">
          <p className="font-serif italic text-ink-soft text-sm leading-snug">
            C through F, and the speculative P-tiers,
            <br />
            live in{' '}
            <Link to="/tier-system" className="text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange">
              the tier system
            </Link>
            .
          </p>
          <Link
            to="/directory"
            className="smallcaps text-twilight hover:text-orange transition-colors"
          >
            The full directory →
          </Link>
        </div>
      </section>
    </div>
  )
}

function TierRow({ tier, entries }: { tier: Tier; entries: Entry[] }) {
  return (
    <div className="flex items-stretch gap-2 min-h-[110px]">
      {/* Tier sash */}
      <div
        className={`shrink-0 w-16 sm:w-20 flex items-center justify-center font-display italic ${ROW_COLOR[tier]}`}
        style={{ fontSize: 'clamp(2.2rem, 7vw, 3rem)' }}
      >
        {tier}
      </div>
      {/* Tile bed */}
      <div className="flex-1 bg-paper-deep/60 border border-sandstone/40 p-2 flex flex-wrap gap-1.5 content-start">
        {entries.map((e) => (
          <Tile key={`${e.source}/${e.slug}`} entry={e} />
        ))}
      </div>
    </div>
  )
}

function Tile({ entry }: { entry: Entry }) {
  return (
    <Link
      to={`/entry/${entry.source}/${entry.slug}`}
      className="bg-paper border border-sandstone/60 hover:border-twilight/60 transition-colors px-2 py-1 max-w-[200px] group"
      title={entry.summary}
    >
      <p className="font-serif italic text-ink text-sm leading-tight line-clamp-2 group-hover:text-twilight transition-colors">
        {entry.isStarred && <span className="text-orange">⭐ </span>}
        {entry.title}
      </p>
      <p className="smallcaps !text-[0.55rem] !tracking-[0.2em] mt-0.5 truncate">
        {entry.domain}
      </p>
    </Link>
  )
}
