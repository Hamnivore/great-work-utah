import { useState } from 'react'

type Draft = {
  kind?: string
  path?: string
  type?: string
  content?: string
  reason?: string
}

function decodeFragment(hash: string): Draft | null {
  const frag = hash.replace(/^#/, '')
  if (!frag) return null
  try {
    const b64 = frag.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed: unknown = JSON.parse(json)
    if (parsed && typeof parsed === 'object') return parsed as Draft
  } catch {
    // fall through — show the paste-in fallback
  }
  return null
}

export function ContributePage() {
  const [draft, setDraft] = useState<Draft | null>(() => decodeFragment(window.location.hash))
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
      // Maybe they pasted a whole handoff URL or just the fragment.
      const hashIdx = pasted.indexOf('#')
      const fromFrag = decodeFragment(hashIdx >= 0 ? pasted.slice(hashIdx) : `#${pasted.trim()}`)
      if (fromFrag) {
        setDraft(fromFrag)
        setStatus({ state: 'idle' })
      } else {
        setPasteError('Could not parse that — paste the JSON body or the full handoff link.')
      }
    }
  }

  const submit = async () => {
    if (!draft) return
    setStatus({ state: 'sending' })
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string }
      if (res.ok && data.ok) {
        setStatus({ state: 'done', ok: true, message: 'Sent — thank you.', url: data.url })
      } else {
        setStatus({ state: 'done', ok: false, message: data.error || `Request failed (${res.status})` })
      }
    } catch (e) {
      setStatus({ state: 'done', ok: false, message: String(e) })
    }
  }

  return (
    <div className="font-sans">
      <h1 className="font-display text-2xl text-twilight">Contribute</h1>
      <p className="mt-2 text-sm text-ink-soft">
        An agent (or you) drafted a contribution to the wiki. Review it below and send it yourself —
        notes become entries on a public queue, pages become pull requests a human reviews. Nothing
        publishes without review.
      </p>

      {draft ? (
        <div className="mt-6 border border-sandstone/60 bg-paper-deep/60 p-4 text-sm">
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
            onClick={submit}
            disabled={status.state === 'sending'}
            className="mt-4 cursor-pointer border border-twilight bg-twilight px-4 py-1.5 text-sm text-paper hover:opacity-90 disabled:opacity-50"
          >
            {status.state === 'sending' ? 'Sending…' : 'Submit'}
          </button>
          {status.state === 'done' && (
            <p className={`mt-3 text-sm ${status.ok ? 'text-twilight' : 'text-orange'}`}>
              {status.message}{' '}
              {status.url && (
                <a href={status.url} target="_blank" rel="noreferrer" className="underline">
                  View it here.
                </a>
              )}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-soft">No draft found in the link.</p>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-medium text-twilight">Or paste a draft</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Paste the JSON body ({'{'} "kind", "path", "type", "content", "reason" {'}'}) or the full
          handoff link your agent gave you.
        </p>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          rows={6}
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
