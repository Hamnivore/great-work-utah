import { useEffect, useState } from 'react'

type Draft = {
  kind?: string
  path?: string
  type?: string
  content?: string
  reason?: string
}

function decodeFragment(hash: string): { draft: Draft | null; error?: string } {
  const frag = hash.replace(/^#/, '')
  if (!frag) return { draft: null }
  try {
    const b64 = frag.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4))
    const bin = atob(b64 + pad)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed: unknown = JSON.parse(json)
    if (parsed && typeof parsed === 'object') return { draft: parsed as Draft }
    return { draft: null, error: 'Link draft was not a JSON object.' }
  } catch {
    return { draft: null, error: 'Could not decode the draft in this link (bad or truncated hash).' }
  }
}

async function postDraft(draft: Draft) {
  const res = await fetch('/api/contribute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  })
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string }
  if (res.ok && data.ok) return { ok: true as const, message: 'Sent — thank you.', url: data.url }
  return { ok: false as const, message: data.error || `Request failed (${res.status})` }
}

export function ContributePage() {
  useEffect(() => {
    document.title = 'Contribute — Great Work — Utah'
    return () => {
      document.title = 'Great Work — Utah'
    }
  }, [])

  const decoded = decodeFragment(window.location.hash)
  const [draft, setDraft] = useState<Draft | null>(() => decoded.draft)
  const [hashError] = useState(decoded.error ?? '')
  const [notePath, setNotePath] = useState('pages/')
  const [noteText, setNoteText] = useState('')
  const [pasted, setPasted] = useState('')
  const [pasteError, setPasteError] = useState('')
  const [status, setStatus] = useState<
    { state: 'idle' } | { state: 'sending' } | { state: 'done'; ok: boolean; message: string; url?: string }
  >({ state: 'idle' })

  const parsePasted = () => {
    setPasteError('')
    try {
      const parsed: unknown = JSON.parse(pasted)
      if (!parsed || typeof parsed !== 'object') throw new Error('not an object')
      setDraft(parsed as Draft)
      setStatus({ state: 'idle' })
    } catch {
      const hashIdx = pasted.indexOf('#')
      const fromFrag = decodeFragment(hashIdx >= 0 ? pasted.slice(hashIdx) : `#${pasted.trim()}`)
      if (fromFrag.draft) {
        setDraft(fromFrag.draft)
        setStatus({ state: 'idle' })
      } else {
        setPasteError(fromFrag.error || 'Could not parse that — paste the JSON body or the full handoff link.')
      }
    }
  }

  const submit = async (body: Draft) => {
    setStatus({ state: 'sending' })
    try {
      const result = await postDraft(body)
      setStatus({ state: 'done', ...result })
    } catch (e) {
      setStatus({ state: 'done', ok: false, message: String(e) })
    }
  }

  const submitNote = () => {
    const path = notePath.trim()
    const content = noteText.trim()
    void submit({ kind: 'note', path, content, reason: 'human note via /contribute' })
  }

  const statusLine =
    status.state === 'done' ? (
      <p className={`mt-3 text-sm ${status.ok ? 'text-twilight' : 'text-orange'}`}>
        {status.message}{' '}
        {status.url && (
          <a href={status.url} target="_blank" rel="noreferrer" className="underline">
            View it here.
          </a>
        )}
      </p>
    ) : null

  return (
    <div className="font-sans">
      <h1 className="font-display text-2xl text-twilight">Contribute</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Leave a short note about something missing or wrong, or edit pages on GitHub. Notes go to a
        public queue; page changes become review-gated pull requests.
      </p>

      <h2 className="mt-6 text-sm font-medium text-twilight">Leave a note</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Path should look like <code>pages/example.md</code> (the page it is about, or should be).
        Notes need 15–2000 characters.
      </p>
      <label className="mt-3 block text-xs font-medium text-twilight-soft">
        Path
        <input
          value={notePath}
          onChange={(e) => setNotePath(e.target.value)}
          className="mt-1 w-full border border-sandstone/60 bg-paper px-2 py-1.5 font-mono text-xs"
          placeholder="pages/example.md"
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-twilight-soft">
        Note
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={4}
          className="mt-1 w-full border border-sandstone/60 bg-paper p-2 text-sm"
          placeholder="What's missing, stale, or wrong?"
        />
      </label>
      <button
        onClick={submitNote}
        disabled={status.state === 'sending' || noteText.trim().length < 15}
        className="mt-3 cursor-pointer border border-twilight bg-twilight px-4 py-1.5 text-sm text-paper hover:opacity-90 disabled:opacity-50"
      >
        {status.state === 'sending' ? 'Sending…' : 'Submit note'}
      </button>
      {statusLine}

      <a
        href="https://github.com/Hamnivore/great-work-utah/tree/main/wiki/pages"
        target="_blank"
        rel="noreferrer"
        className="mt-8 flex items-center gap-3 border border-twilight bg-twilight px-4 py-3 text-paper hover:opacity-90"
      >
        <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        <span>
          <span className="block text-sm font-medium">Browse & edit the wiki on GitHub</span>
          <span className="block text-xs opacity-90">
            Open any page, click the pencil icon, save — GitHub opens the pull request for you.
          </span>
        </span>
      </a>

      <hr className="mt-8 border-sandstone/40" />

      <h2 className="mt-6 text-sm font-medium text-twilight">Agent handoff draft</h2>
      <p className="mt-1 text-xs text-ink-soft">
        If an agent sent you here with a draft in the link, review and submit it below.
      </p>
      {hashError && !draft && <p className="mt-3 text-sm text-orange">{hashError}</p>}

      {draft ? (
        <div className="mt-4 border border-sandstone/60 bg-paper-deep/60 p-4 text-sm">
          <div className="grid grid-cols-[6rem_1fr] gap-y-1">
            <span className="font-medium text-twilight-soft">Kind</span>
            <span>{draft.kind ?? '—'}</span>
            <span className="font-medium text-twilight-soft">Path</span>
            <span className="break-all">{draft.path ?? '—'}</span>
            {draft.type && (
              <>
                <span className="font-medium text-twilight-soft">Type</span>
                <span>{draft.type}</span>
              </>
            )}
            {draft.reason && (
              <>
                <span className="font-medium text-twilight-soft">Reason</span>
                <span>{draft.reason}</span>
              </>
            )}
          </div>
          <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap border-t border-sandstone/40 pt-3 font-mono text-xs">
            {draft.content ?? ''}
          </pre>
          <button
            onClick={() => void submit(draft)}
            disabled={status.state === 'sending'}
            className="mt-4 cursor-pointer border border-twilight bg-twilight px-4 py-1.5 text-sm text-paper hover:opacity-90 disabled:opacity-50"
          >
            {status.state === 'sending' ? 'Sending…' : 'Submit draft'}
          </button>
        </div>
      ) : (
        !hashError && <p className="mt-3 text-sm text-ink-soft">No agent draft in this link.</p>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-medium text-twilight">Or paste a draft</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Paste the JSON body or the full handoff link your agent gave you.
        </p>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={5}
          className="mt-2 w-full border border-sandstone/60 bg-paper p-2 font-mono text-xs"
          placeholder='{"kind":"note","path":"pages/example.md","content":"...","reason":"..."}'
        />
        <button
          onClick={parsePasted}
          className="mt-2 cursor-pointer border border-twilight-soft px-3 py-1 text-xs text-twilight hover:bg-paper-deep"
        >
          Load draft
        </button>
        {pasteError && <p className="mt-2 text-xs text-orange">{pasteError}</p>}
      </div>
    </div>
  )
}
