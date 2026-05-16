import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRealtimeTaskTrigger } from '@trigger.dev/react-hooks'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Layout } from '../components/Layout'
import { AskBar } from '../components/AskBar'
import { localSearchMarkdown } from '../lib/localSearch'
import type { searchAgent } from '../trigger/search-agent'

async function fetchTriggerToken(): Promise<string> {
  const res = await fetch('/api/trigger-token', { method: 'POST' })
  const data = await res.json()
  if (!data.token) throw new Error(data.error ?? 'No token returned')
  return data.token
}

// Separate component so the hook only mounts when we have a valid token.
// key={query} on this component ensures it remounts (fresh hook state) on new queries.
function SearchResult({ query, accessToken }: { query: string; accessToken: string }) {
  const { submit, run, error } = useRealtimeTaskTrigger<typeof searchAgent>('search-agent', {
    accessToken,
  })

  const submitted = useRef(false)
  useEffect(() => {
    if (submitted.current) return
    submitted.current = true
    submit({ query })
  }, [submit, query])

  const streamingResponse = (run?.metadata?.response as string | undefined) ?? ''
  const finalResponse = (run?.output as { response?: string } | undefined)?.response ?? ''
  const response = finalResponse || streamingResponse
  const thinking = (run?.metadata?.thinking as string | undefined) ?? ''
  const isRunning = run?.status === 'EXECUTING' || run?.status === 'QUEUED' || run?.status === 'DEQUEUED'
  const isDone = run?.status === 'COMPLETED'
  const failed =
    Boolean(error) ||
    run?.status === 'FAILED' ||
    run?.status === 'CRASHED' ||
    run?.status === 'SYSTEM_FAILURE' ||
    run?.status === 'TIMED_OUT' ||
    run?.status === 'CANCELED'
  const fallbackResponse = failed && !response ? localSearchMarkdown(query) : ''
  const displayedResponse = response || fallbackResponse

  return (
    <>
      {/* Thinking panel — visible while running, collapsible when done */}
      {thinking && (
        <details open={!isDone} className="mb-6">
          <summary className="smallcaps cursor-pointer select-none text-ink-soft hover:text-ink transition-colors">
            {isRunning ? 'Reasoning…' : 'Reasoning'}
          </summary>
          <pre className="mt-2 text-xs font-mono text-ink-soft bg-pale-sky border border-twilight/10 rounded-md p-4 whitespace-pre-wrap overflow-auto max-h-64">
            {thinking}
            {isRunning && !response && (
              <span className="inline-block w-1.5 h-3 bg-twilight/50 ml-0.5 animate-pulse rounded-sm" />
            )}
          </pre>
        </details>
      )}

      {!thinking && !displayedResponse && (
        <p className="font-serif italic text-ink-soft animate-pulse">
          The guide is sharpening her pen…
        </p>
      )}

      {displayedResponse && (
        <div className="prose prose-stone max-w-none font-serif">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedResponse}</ReactMarkdown>
          {isRunning && (
            <span className="inline-block w-1.5 h-4 bg-twilight ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      )}
    </>
  )
}

export function AskPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''

  const [tokenState, setTokenState] = useState<{ query: string; token: string } | null>(null)
  const [tokenErrorQuery, setTokenErrorQuery] = useState<string>('')
  const fetchingRef = useRef<string>('')

  useEffect(() => {
    if (!q || fetchingRef.current === q) return
    fetchingRef.current = q
    setTokenState(null)
    setTokenErrorQuery('')

    fetchTriggerToken()
      .then((token) => setTokenState({ query: q, token }))
      .catch((err) => {
        console.error(err)
        setTokenErrorQuery(q)
      })
  }, [q])

  return (
    <Layout backLabel="Back" backTo="/">
      <section className="mb-8">
        <AskBar initialValue={q} autoFocus={!q} />
      </section>

      {q ? (
        <article className="prose-editorial">
          <p className="smallcaps">a dispatch from the guide</p>
          <h1 className="font-display text-4xl sm:text-5xl text-twilight mt-2 mb-6 leading-tight">
            {q}
          </h1>
          {tokenState?.query === q ? (
            <SearchResult key={q} query={q} accessToken={tokenState.token} />
          ) : tokenErrorQuery === q ? (
            <div className="prose prose-stone max-w-none font-serif">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {localSearchMarkdown(q)}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="font-serif italic text-ink-soft animate-pulse">
              The guide is sharpening her pen…
            </p>
          )}
        </article>
      ) : (
        <article className="prose-editorial">
          <h1 className="font-display text-3xl text-ink">Ask the guide</h1>
          <p className="font-serif italic text-ink-soft">
            Type a question above and the guide will write you an article in response.
          </p>
        </article>
      )}
    </Layout>
  )
}
