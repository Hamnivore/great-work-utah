import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

const STARTER_PROMPT = 'Use greatutah.work to help answer my question:\n\n'

export function HomePage() {
  const [prompt, setPrompt] = useState(STARTER_PROMPT)
  const [copied, setCopied] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    textarea.current?.focus()
    textarea.current?.setSelectionRange(STARTER_PROMPT.length, STARTER_PROMPT.length)
  }, [])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
      return true
    } catch {
      textarea.current?.focus()
      textarea.current?.select()
      return false
    }
  }

  return (
    <main className="home-page">
      <section className="home-intro" aria-labelledby="home-title">
        <p className="home-eyebrow">A wiki for your AI</p>
        <h1 id="home-title">Ask better questions about Utah.</h1>
        <p className="home-lede">
          A wiki of consequential companies, labs, projects, people, and opportunities in Utah.
          Tell your assistant what you need; it can search the whole thing.
        </p>
      </section>

      <section className="prompt-card" aria-label="Prompt your AI assistant">
        <label htmlFor="handoff-prompt">Your prompt</label>
        <textarea
          ref={textarea}
          id="handoff-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={6}
          spellCheck
        />

        <button type="button" className="copy-prompt" onClick={() => void copyPrompt()} aria-live="polite">
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
        <p className="compatibility-note">
          Works with paid versions of ChatGPT and Claude, and with any AI coding environment.
        </p>
      </section>

      <p className="home-aside">
        Reading it yourself?{' '}
        <a href="/v/tier-list">Start with the tier list</a> — everything in the wiki ranked by how
        far it could move the world.
      </p>
    </main>
  )
}
