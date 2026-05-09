import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface AskBarProps {
  initialValue?: string
  autoFocus?: boolean
}

export function AskBar({ initialValue = '', autoFocus = false }: AskBarProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask the guide anything"
        autoFocus={autoFocus}
        aria-label="Ask the guide anything"
        className="w-full bg-pale-sky border border-twilight/15 rounded-md px-4 py-2.5 italic text-twilight placeholder:text-twilight-soft placeholder:italic focus:outline-none focus:border-twilight focus:ring-2 focus:ring-twilight/25 transition-colors font-serif"
      />
    </form>
  )
}
