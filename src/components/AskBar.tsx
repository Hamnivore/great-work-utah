import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/ask?q=${encodeURIComponent(q)}`)
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
          placeholder="Ask the guide anything"
          autoFocus={autoFocus}
          aria-label="Ask the guide anything"
          className={inputClass}
        />
      </div>
    </form>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
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
