import { useState, type FormEvent } from 'react'
import { SearchIcon } from './SearchOverlay'
import { useSearchOverlay } from './searchOverlayContext'

interface AskBarProps {
  initialValue?: string
  autoFocus?: boolean
  variant?: 'default' | 'slim'
}

export function AskBar({
  initialValue = '',
  autoFocus = false,
  variant = 'default',
}: AskBarProps) {
  const { openSearch } = useSearchOverlay()
  const [value, setValue] = useState(initialValue)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    openSearch(value.trim())
  }

  const wrapClass =
    variant === 'slim'
      ? 'flex items-center gap-2.5 bg-pale-sky/50 border border-twilight/15 rounded-full px-3.5 py-1.5 focus-within:border-twilight/45 focus-within:ring-2 focus-within:ring-twilight/20 transition-colors'
      : 'flex items-center gap-2.5 bg-pale-sky border border-twilight/15 rounded-full px-4 py-2.5 focus-within:border-twilight focus-within:ring-2 focus-within:ring-twilight/25 transition-colors'

  const inputClass =
    variant === 'slim'
      ? 'flex-1 min-w-0 bg-transparent border-0 outline-none italic text-twilight placeholder:text-twilight/45 placeholder:italic font-serif text-sm sm:text-base px-0 py-0'
      : 'flex-1 min-w-0 bg-transparent border-0 outline-none italic text-twilight placeholder:text-twilight-soft placeholder:italic font-serif px-0 py-0'

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={wrapClass}>
        <SearchIcon className="w-4 h-4 shrink-0 text-twilight-soft" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => openSearch(value)}
          onClick={() => openSearch(value)}
          placeholder="Ask the guide anything"
          autoFocus={autoFocus}
          aria-label="Ask the guide anything"
          className={inputClass}
        />
      </div>
    </form>
  )
}
