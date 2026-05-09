import { Link } from 'react-router-dom'
import type { Entry } from '../../../lib/types'
import { TIER_GLYPH_CLASS } from '../_shared'

/* ----------------------------------------------------------------------
 * Reusable building blocks for the Issue family of home prototypes.
 *
 * Every Issue iteration has the same skeleton — title, contents, ask,
 * tail — but varies the typography of the cover. Extracting the parts
 * keeps each iteration focused on the *one move* it's making.
 * ---------------------------------------------------------------------- */

export function Wordmark({
  variant = 'twilight',
  align = 'left',
}: {
  variant?: 'twilight' | 'ink'
  align?: 'left' | 'center'
}) {
  const color = variant === 'ink' ? 'text-ink' : 'text-twilight'
  return (
    <Link to="/" className={`block ${align === 'center' ? 'text-center' : ''}`}>
      <p className={`font-display italic ${color} text-xl leading-none`}>
        Great Work
      </p>
      <p className="smallcaps mt-1">Utah, USA</p>
    </Link>
  )
}

/**
 * Quiet horizontal divider. Three weights:
 * - 'hair'    — a single 1px sandstone rule
 * - 'ornament'— three centered diamonds, italic Caslon, calm
 * - 'ribbon'  — a short centered rule, like the indent that ends a
 *                book chapter
 */
export function Divider({
  kind = 'hair',
  className = '',
}: {
  kind?: 'hair' | 'ornament' | 'ribbon'
  className?: string
}) {
  if (kind === 'ornament') {
    return (
      <p className={`text-center text-twilight/55 font-display italic tracking-[0.6em] my-8 ${className}`}>
        ◆ ◆ ◆
      </p>
    )
  }
  if (kind === 'ribbon') {
    return <hr className={`border-sandstone/60 w-12 mx-auto my-8 ${className}`} />
  }
  return <hr className={`border-sandstone/40 ${className}`} />
}

/**
 * Tiny, no-link tier glyph used inside parent Links. Keeps the rule
 * "no <a> inside <a>" intact (TierMark itself is a Link to /tier-system).
 */
export function TierGlyph({
  tier,
  className = '',
}: {
  tier: Entry['tier']
  className?: string
}) {
  return (
    <span
      className={`font-display ${TIER_GLYPH_CLASS[tier] ?? ''} ${className}`}
      aria-label={`Tier ${tier}`}
    >
      {tier}
    </span>
  )
}

/* ---------------------------------------------------------------------- */

interface IssueContentsProps {
  entries: Entry[]
  /**
   * 'numbered' — book contents page, "01" in the gutter
   * 'bare'     — no numbers, just the row
   * 'leader'   — leader dots between title and tier (academic / library)
   */
  style?: 'numbered' | 'bare' | 'leader'
  /** Optional smallcaps heading rendered above the list. */
  heading?: string
}

export function IssueContents({
  entries,
  style = 'numbered',
  heading,
}: IssueContentsProps) {
  return (
    <div>
      {heading && <p className="smallcaps mb-4">{heading}</p>}
      <ul className="divide-y divide-sandstone/30">
        {entries.map((entry, i) => (
          <li
            key={`${entry.source}/${entry.slug}`}
            className="py-4 first:pt-0 last:pb-0"
          >
            <Link
              to={`/entry/${entry.source}/${entry.slug}`}
              className="flex items-baseline gap-4 group"
            >
              {style === 'numbered' && (
                <span
                  className="font-serif italic text-twilight/55 leading-none shrink-0 tabular-nums w-7 sm:w-9"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display italic text-ink text-xl leading-tight group-hover:text-twilight transition-colors">
                  {entry.title}
                </p>
                {entry.summary && (
                  <p className="font-serif italic text-ink-soft mt-1 text-sm leading-snug line-clamp-1">
                    {entry.summary}
                  </p>
                )}
              </div>
              {style === 'leader' && (
                <span
                  className="hidden sm:block flex-1 border-b border-dotted border-twilight/30 mb-1.5 mx-1 max-w-[40%]"
                  aria-hidden
                />
              )}
              <TierGlyph
                tier={entry.tier}
                className="text-base shrink-0 self-center"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------------------- */

export function IssueTail({
  hint = 'Plus 246 more entries — places to work, history that mattered, and people on the way.',
}: {
  hint?: string
}) {
  return (
    <div>
      <Divider kind="hair" />
      <div className="flex items-baseline justify-between mt-5 gap-4">
        <p className="font-serif italic text-ink-soft text-sm leading-snug max-w-md">
          {hint}
        </p>
        <Link
          to="/directory"
          className="smallcaps text-twilight hover:text-orange transition-colors shrink-0 self-end"
        >
          The full directory →
        </Link>
      </div>
    </div>
  )
}
