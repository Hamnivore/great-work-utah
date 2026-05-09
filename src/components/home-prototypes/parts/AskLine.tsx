import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface AskLineProps {
  /** Visible italic prompt that sits over the input until the user types. */
  placeholder?: string
  /** Optional label rendered above the line as smallcaps (e.g. "Ask"). */
  label?: string
  /** Visual size — display goes in cover treatments, body in contents. */
  size?: 'body' | 'display'
  /** When true, render the trailing → as a Caslon italic submit affordance. */
  withCaret?: boolean
  autoFocus?: boolean
  initialValue?: string
  /**
   * 'paper' — twilight ink on cream paper (default).
   * 'photo' — cream type drawn over a dark photographic background.
   *           Used by the Inscription and Lower Strip cover treatments.
   */
  tone?: 'paper' | 'photo'
}

/**
 * AskLine
 *
 * The boxed AskBar reads like a UI widget. AskLine is the same input
 * but stripped to typography: a borderless field that sits flush above
 * a single hairline rule. The placeholder sits in italic Caslon at the
 * left; what the user types continues in italic Caslon. Submit on
 * enter; an optional → caret on the right does the same job a button
 * would do, set in the same Caslon as the prose.
 *
 * The bet: the input should look like *writing on the page*, not like a
 * form. A search bar in a magazine doesn't look like a search bar.
 */
export function AskLine({
  placeholder = 'ask the guide anything',
  label,
  size = 'body',
  withCaret = true,
  autoFocus = false,
  initialValue = '',
  tone = 'paper',
}: AskLineProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/ask?q=${encodeURIComponent(q)}`)
  }

  const inputClass =
    size === 'display'
      ? 'text-2xl sm:text-3xl py-3'
      : 'text-lg py-2'

  // Tone tokens — kept inline so the component is self-contained and a
  // designer reading this file sees both reads of it at once.
  const toneTokens =
    tone === 'photo'
      ? {
          rule: 'border-paper/55 focus-within:border-paper',
          input: 'text-paper placeholder:text-paper/55',
          caret: 'text-paper/65 hover:text-orange',
          label: 'text-paper/70',
        }
      : {
          rule: 'border-twilight/40 focus-within:border-twilight',
          input: 'text-twilight placeholder:text-twilight/45',
          caret: 'text-twilight/55 hover:text-orange',
          label: 'text-twilight-soft',
        }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {label && (
        <p className={`smallcaps mb-2 ${toneTokens.label}`}>{label}</p>
      )}
      <div
        className={`flex items-baseline gap-3 border-b transition-colors ${toneTokens.rule}`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label={label ? `${label}. ${placeholder}` : placeholder}
          className={`flex-1 min-w-0 bg-transparent border-0 outline-none italic font-serif px-0 ${inputClass} ${toneTokens.input} placeholder:italic`}
        />
        {withCaret && (
          <button
            type="submit"
            aria-label="Ask"
            className={`shrink-0 italic font-serif transition-colors ${toneTokens.caret} ${
              size === 'display' ? 'text-2xl sm:text-3xl' : 'text-lg'
            }`}
          >
            →
          </button>
        )}
      </div>
    </form>
  )
}
