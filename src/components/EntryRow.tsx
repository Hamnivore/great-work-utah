import { Link } from 'react-router-dom'
import type { Entry } from '../lib/types'
import { TierMark } from './TierMark'

interface EntryRowProps {
  entry: Entry
}

export function EntryRow({ entry }: EntryRowProps) {
  return (
    <li className="border-b border-sandstone/30 last:border-b-0 group">
      <div className="flex items-start gap-4 py-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/entry/${entry.source}/${entry.slug}`}
            className="block transition-colors"
          >
            <h3 className="font-display text-xl text-ink group-hover:text-twilight transition-colors leading-tight">
              {entry.title}
            </h3>
            {entry.summary && (
              <p className="font-serif italic text-ink-soft mt-1 text-base leading-snug line-clamp-2">
                {entry.summary}
              </p>
            )}
            {entry.meta['Hand raised'] && (
              <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] text-twilight-soft mt-2">
                Hand raised: {entry.meta['Hand raised']}
                {entry.meta.Availability ? ` · ${entry.meta.Availability}` : ''}
              </p>
            )}
          </Link>
        </div>
        <div className="shrink-0 pt-1">
          <TierMark tier={entry.tier} />
        </div>
      </div>
    </li>
  )
}
