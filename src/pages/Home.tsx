import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'

const STARTER_PROMPT = 'Use greatutah.work to help answer my question:\n\n'

const assistants = [
  { name: 'ChatGPT', href: 'https://chatgpt.com/' },
  { name: 'Claude', href: 'https://claude.ai/new' },
  { name: 'Gemini', href: 'https://gemini.google.com/app' },
  { name: 'Perplexity', href: 'https://www.perplexity.ai/' },
]

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

  const openAssistant = (href: string) => {
    // Open immediately so browsers do not treat the new tab as an unsolicited popup.
    window.open(href, '_blank', 'noopener,noreferrer')
    void copyPrompt()
  }

  return (
    <main className="home-page">
      <div className="home-wordmark">greatutah.work</div>

      <section className="home-intro" aria-labelledby="home-title">
        <p className="home-eyebrow">A wiki for your AI</p>
        <h1 id="home-title">Ask better questions about Utah.</h1>
        <p className="home-lede">
          Tell your assistant what you need. It can search hundreds of pages about high-impact
          work, people, programs, and opportunities across the state.
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

        <button type="button" className="copy-prompt" onClick={() => void copyPrompt()}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </section>

      <section className="assistant-picker" aria-labelledby="assistant-title">
        <p id="assistant-title">Copy it and open your assistant</p>
        <div className="assistant-grid">
          {assistants.map((assistant) => (
            <button
              type="button"
              key={assistant.name}
              onClick={() => openAssistant(assistant.href)}
              className="assistant-link"
              aria-label={`Copy prompt and open ${assistant.name} in a new tab`}
            >
              <span>{assistant.name}</span>
              <ExternalLink size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="assistant-note" aria-live="polite">
          {copied
            ? 'Prompt copied — paste it into the assistant.'
            : 'We’ll copy your prompt before opening a new tab.'}
        </p>
      </section>

      <nav className="home-secondary" aria-label="More ways to explore greatutah.work">
        <a href="/v/index">Browse the wiki</a>
        <a href="/map">View the map</a>
        <a href="/contribute">Contribute</a>
        <a href="/llms.txt">For AI agents</a>
      </nav>
    </main>
  )
}
