import {
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { SearchIcon, useSearchOverlay } from '../../SearchOverlay'
import type { Entry } from '../../../lib/types'

interface TopSearchProps {
  /** Italic suggestions shown in the panel under "Try asking". */
  suggestions: string[]
  /** Featured entries shown in the panel under "Or browse". */
  recommendations?: Entry[]
  /**
   * 'photo' — resting bar is drawn over a dark photo (cream, blurred).
   * 'paper' — resting bar lives on cream paper (twilight ink).
   * Affects only the resting state; the panel is always paper.
   */
  tone?: 'photo' | 'paper'
}

/**
 * TopSearch — the search affordance, restated as the primary
 * interaction on the home.
 *
 * Two states:
 *
 *   1. Resting pill: a rounded-full search input with a magnifying-
 *      glass icon, pinned to the top of the cover. On a photo cover
 *      it's a blurred-cream pill; on paper it's a calm pale-sky pill.
 *      Click anywhere on it (or hit ⌘K) to expand.
 *
 *   2. Fullscreen panel: no header chrome at all. The Back affordance
 *      and the search input share a single row, so the working
 *      surface is the input — nothing else competes for attention.
 *      Suggestions render as pill chips (typing is a search posture,
 *      not a reading posture). Featured entries render as bordered
 *      paper cards on the right.
 *
 * Body scroll is locked while the panel is open. Pressing Enter on a
 * suggestion submits it; pressing Enter in the input goes to /ask.
 */
export function TopSearch({
  suggestions: _suggestions,
  recommendations: _recommendations = [],
  tone = 'photo',
}: TopSearchProps) {
  const { openSearch } = useSearchOverlay()

  return (
    <RestingBar tone={tone} onOpen={() => openSearch()} />
  )
}

/* ----------------------------------------------------------------------
 * Resting bar — a rounded-full pill. Looks unmistakably like a search
 * input; behaves like a button until clicked.
 * ---------------------------------------------------------------------- */

function RestingBar({
  tone,
  onOpen,
}: {
  tone: 'photo' | 'paper'
  onOpen: () => void
}) {
  const tokens =
    tone === 'photo'
      ? {
          shell:
            'bg-paper/85 backdrop-blur-sm border border-paper/50 hover:border-paper',
          icon: 'text-twilight-soft',
          placeholder: 'text-twilight/55',
          hint: 'text-twilight-soft/55',
        }
      : {
          shell:
            'bg-pale-sky/60 border border-twilight/15 hover:border-twilight/40',
          icon: 'text-twilight-soft',
          placeholder: 'text-twilight/55',
          hint: 'text-twilight-soft/55',
        }

  return (
    <button
      type="button"
      onClick={onOpen}
      onKeyDown={(e: ReactKeyboardEvent<HTMLButtonElement>) => {
        const isPrintable = e.key.length === 1 && !e.metaKey && !e.ctrlKey
        if (isPrintable || e.key === '/') {
          e.preventDefault()
          onOpen()
        }
      }}
      aria-label="Open search"
      className={`group flex items-center gap-3 w-full rounded-full px-5 py-2.5 italic font-serif text-base transition-colors ${tokens.shell}`}
    >
      <SearchIcon className={`w-4 h-4 shrink-0 ${tokens.icon}`} />
      <span className={`flex-1 text-left ${tokens.placeholder}`}>
        ask the guide anything
      </span>
      <kbd
        className={`smallcaps !text-[0.6rem] !tracking-[0.18em] hidden sm:inline ${tokens.hint}`}
      >
        ⌘K
      </kbd>
    </button>
  )
}
