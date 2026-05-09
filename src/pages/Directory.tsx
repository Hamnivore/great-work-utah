import { useState } from 'react'
import { Layout } from '../components/Layout'
import { AskBar } from '../components/AskBar'
import { EntryRow } from '../components/EntryRow'
import { getAllEntries } from '../lib/data'
import type { Tier } from '../lib/types'

const VISIBLE_TIERS: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'unknown']

type SourceFilter = 'places_you_can_work' | 'great_work' | 'people' | 'all'

/**
 * /directory — the back-of-the-book.
 *
 * The front page used to live in this layout: a long alphabetised
 * list of every entry. We've moved that off the cover; this is where
 * it lives now. Honest browsing, calm typography, no hero.
 */
export function DirectoryPage() {
  const [source, setSource] = useState<SourceFilter>('places_you_can_work')

  const entries = getAllEntries().filter((e) => {
    if (!VISIBLE_TIERS.includes(e.tier)) return false
    if (source === 'all') return true
    return e.source === source
  })

  return (
    <Layout backLabel="Home" backTo="/">
      <header className="mb-8">
        <p className="smallcaps">{entries.length} entries</p>
        <h1
          className="font-display italic text-twilight leading-[0.95] mt-2"
          style={{ fontSize: 'clamp(2.4rem, 11vw, 3.4rem)' }}
        >
          The directory
        </h1>
        <p className="font-display italic text-ink-soft text-xl leading-snug mt-3 max-w-prose">
          Every entry in the wiki, in alphabetical order. Filter by what
          kind of entry it is.
        </p>
      </header>

      {/* Ask bar — still the primary interaction */}
      <section className="mb-8">
        <AskBar />
      </section>

      {/* Filter chips */}
      <nav aria-label="Filter directory" className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
        {(
          [
            { id: 'places_you_can_work', label: 'Places you can work' },
            { id: 'people', label: 'People' },
            { id: 'great_work', label: 'Historical great work' },
            { id: 'all', label: 'All' },
          ] as Array<{ id: SourceFilter; label: string }>
        ).map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSource(s.id)}
            className={`smallcaps transition-colors ${
              source === s.id ? 'text-twilight' : 'hover:text-twilight'
            }`}
          >
            {source === s.id && '— '}
            {s.label}
          </button>
        ))}
      </nav>

      {/* The list */}
      <section>
        <ul>
          {entries.map((entry) => (
            <EntryRow key={`${entry.source}/${entry.slug}`} entry={entry} />
          ))}
        </ul>
      </section>
    </Layout>
  )
}
