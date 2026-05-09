import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useRealtimeTaskTrigger } from '@trigger.dev/react-hooks'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { getAllEntries } from '../../../lib/data'
import type { Entry } from '../../../lib/types'
import type { searchAgent } from '../../../trigger/search-agent'
import { heroImageFor } from '../_shared'

type HandChoice = 'public' | 'private'

interface ProfileMatch {
  entry: Entry
  reason: string
}

async function fetchTriggerToken(): Promise<string> {
  const res = await fetch('/api/trigger-token', { method: 'POST' })
  const data = await res.json()
  if (!data.token) throw new Error(data.error ?? 'No token returned')
  return data.token
}

const EXAMPLE_PROSE = `I’m Samuel Whitlock, a data scientist looking for deep-tech work where ML advances science.`

const PLACEHOLDER_PROSE = `Hi, I’m —
I’m looking for —
I can offer —`

const PROMPT_HINTS = [
  'what you want',
  'what you can offer',
  'previous work',
  'links',
]

export function WhosReading({
  recommendations,
}: {
  recommendations: Entry[]
}) {
  const [prose, setProse] = useState('')
  const [hand, setHand] = useState<HandChoice>('private')
  const [email, setEmail] = useState('')
  const [notifyDomain, setNotifyDomain] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [tokenState, setTokenState] = useState<{
    profile: string
    token: string
  } | null>(null)

  function submitProfile(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTokenState(null)
    fetchTriggerToken()
      .then((token) => setTokenState({ profile: prose.trim(), token }))
      .catch(console.error)
  }

  function startOver() {
    setProse('')
    setHand('private')
    setEmail('')
    setNotifyDomain(true)
    setSubmitted(false)
    setTokenState(null)
  }

  return (
    <section className="bg-paper-deep border-y border-sandstone/40 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <header className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr] sm:items-end mb-6">
          <div>
            <p className="smallcaps">Get matched</p>
            <h2
              className="font-display italic text-twilight leading-none mt-2"
              style={{ fontSize: 'clamp(1.9rem, 8vw, 2.6rem)' }}
            >
              What are you looking for?
            </h2>
          </div>
          <p className="font-display italic text-ink-soft leading-snug sm:text-right">
            Write a short note. We’ll search now and send future matches.
          </p>
        </header>

        <div className="animate-profile-in">
          {submitted ? (
            <FiledStage
              prose={prose}
              hand={hand}
              email={email}
              recommendations={recommendations}
              agentToken={
                tokenState?.profile === prose.trim() ? tokenState.token : null
              }
              onStartOver={startOver}
            />
          ) : (
            <ProfileForm
              prose={prose}
              setProse={setProse}
              hand={hand}
              setHand={setHand}
              email={email}
              setEmail={setEmail}
              notifyDomain={notifyDomain}
              setNotifyDomain={setNotifyDomain}
              onSubmit={submitProfile}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes whosReadingIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-profile-in {
          animation: whosReadingIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </section>
  )
}

function ProfileForm({
  prose,
  setProse,
  hand,
  setHand,
  email,
  setEmail,
  notifyDomain,
  setNotifyDomain,
  onSubmit,
}: {
  prose: string
  setProse: (v: string) => void
  hand: HandChoice
  setHand: (h: HandChoice) => void
  email: string
  setEmail: (v: string) => void
  notifyDomain: boolean
  setNotifyDomain: (v: boolean) => void
  onSubmit: (e: FormEvent) => void
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)]"
    >
      <div>
        <div className="relative">
          <textarea
            aria-label="What are you looking for?"
            value={prose}
            onChange={(e) => setProse(e.target.value)}
            placeholder={PLACEHOLDER_PROSE}
            rows={6}
            className="w-full bg-paper border border-sandstone/55 rounded-md px-4 py-3 font-serif text-ink leading-relaxed focus:outline-none focus:border-twilight focus:ring-1 focus:ring-twilight/30 resize-y placeholder:italic placeholder:text-ink-soft/55 transition-colors"
            style={{ fontSize: '1rem', minHeight: '9.5rem' }}
            onKeyDown={(e) => {
              if (
                (e.metaKey || e.ctrlKey) &&
                e.key === 'Enter'
              ) {
                e.preventDefault()
                onSubmit(e as unknown as FormEvent)
              }
            }}
          />
          {prose.length === 0 && (
            <button
              type="button"
              onClick={() => setProse(EXAMPLE_PROSE)}
              className="absolute right-3 bottom-2 italic font-serif text-sm text-twilight-soft hover:text-twilight transition-colors"
            >
              Use example
            </button>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="smallcaps !text-twilight-soft/80">Include</p>
          {PROMPT_HINTS.map((p, i) => (
            <span
              key={p}
              className="font-serif italic text-ink-soft text-sm"
            >
              {p}
              {i < PROMPT_HINTS.length - 1 && (
                <span className="text-twilight-soft/40 mx-1.5">·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-paper/70 border border-sandstone/55 rounded-md p-4 sm:p-5">
        <fieldset>
          <legend className="smallcaps mb-3">Visibility</legend>
          <div className="grid grid-cols-2 gap-2">
            <ChoiceButton
              selected={hand === 'public'}
              onClick={() => setHand('public')}
              title="Raise my hand"
              description="Make me findable."
            />
            <ChoiceButton
              selected={hand === 'private'}
              onClick={() => setHand('private')}
              title="Keep private"
              description="Only email me."
            />
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="whos-reading-email" className="smallcaps mb-1 block">
            Email
          </label>
          <input
            id="whos-reading-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="optional"
            className="w-full bg-paper border border-sandstone/55 rounded-md px-3 py-2 font-serif text-ink focus:outline-none focus:border-twilight focus:ring-1 focus:ring-twilight/30 placeholder:italic placeholder:text-ink-soft/45 transition-colors"
          />
        </div>

        <label className="flex items-center gap-2.5 mt-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={notifyDomain}
            onChange={(e) => setNotifyDomain(e.target.checked)}
            className="w-4 h-4 accent-twilight cursor-pointer"
          />
          <span className="font-serif italic text-ink-soft text-sm leading-snug group-hover:text-ink transition-colors">
            Email matches to me.
          </span>
        </label>

        <button
          type="submit"
          className="mt-5 w-full px-5 py-2.5 bg-orange text-paper font-serif italic rounded-md hover:bg-ink transition-colors"
        >
          Search matches
        </button>
      </div>
    </form>
  )
}

function ChoiceButton({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean
  onClick: () => void
  title: string
  description: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left rounded-md border px-3 py-2 transition-colors ${
        selected
          ? 'bg-twilight text-paper border-twilight'
          : 'bg-paper border-sandstone/55 text-ink hover:border-twilight/60'
      }`}
    >
      <span className="block font-serif italic text-[15px] leading-tight">
        {title}
      </span>
      <span
        className={`block font-sans text-[0.65rem] leading-tight mt-1 ${
          selected ? 'text-paper/75' : 'text-ink-soft'
        }`}
      >
        {description}
      </span>
    </button>
  )
}

function FiledStage({
  prose,
  hand,
  email,
  recommendations,
  agentToken,
  onStartOver,
}: {
  prose: string
  hand: HandChoice
  email: string
  recommendations: Entry[]
  agentToken: string | null
  onStartOver: () => void
}) {
  const name = extractFirstName(prose)
  const matches = useMemo(() => findProfileMatches(prose), [prose])
  const fallbackCards = recommendations.slice(0, 2)

  return (
    <div className="bg-paper/75 border border-sandstone/55 rounded-md p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-[1fr_0.9fr] sm:items-start">
        <div>
          <p className="smallcaps">Received</p>
          <h3 className="font-display italic text-twilight text-3xl leading-tight mt-2">
            Got it, {name}.
          </h3>
          <p className="font-serif italic text-ink-soft mt-3 leading-snug">
            {hand === 'public'
              ? `We’ll make you findable and send matches to ${email || 'you'}.`
              : `We’ll keep you private and send matches to ${email || 'you'}.`}
          </p>
          <p className="font-serif italic text-ink mt-4 leading-snug">
            We searched the wiki just now. Closest leads:
          </p>
          <button
            type="button"
            onClick={onStartOver}
            className="smallcaps !text-twilight-soft hover:!text-twilight transition-colors mt-5"
          >
            Edit note
          </button>
        </div>

        {matches.length > 0 ? (
          <div>
            <p className="smallcaps mb-3">Closest leads</p>
            <div className="grid gap-3">
              {matches.map(({ entry, reason }) => (
                <Link
                  key={`${entry.source}/${entry.slug}`}
                  to={`/entry/${entry.source}/${entry.slug}`}
                  className="group grid grid-cols-[4.25rem_1fr] gap-3 items-center"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-sandstone/30">
                    <img
                      src={heroImageFor(entry, 200, 200)}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] editorial-img"
                    />
                  </div>
                  <div>
                    <p className="font-display italic text-ink leading-tight group-hover:text-twilight transition-colors">
                      {entry.title}
                    </p>
                    <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1">
                      {reason}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : fallbackCards.length > 0 && (
          <div>
            <p className="smallcaps mb-3">Nothing close yet</p>
            <div className="grid gap-3">
              {fallbackCards.map((entry) => (
                <Link
                  key={`${entry.source}/${entry.slug}`}
                  to={`/entry/${entry.source}/${entry.slug}`}
                  className="group grid grid-cols-[4.25rem_1fr] gap-3 items-center"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-sandstone/30">
                    <img
                      src={heroImageFor(entry, 200, 200)}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] editorial-img"
                    />
                  </div>
                  <p className="font-display italic text-ink leading-tight group-hover:text-twilight transition-colors">
                    {entry.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-paper shadow-[0_1px_0_rgba(42,31,24,0.06),0_24px_60px_-30px_rgba(42,31,24,0.25)] border border-sandstone/50 rounded-md overflow-hidden">
        <div className="border-b border-sandstone/60 bg-pale-sky/30 px-4 py-3 flex items-baseline justify-between gap-4">
          <div>
            <p className="smallcaps">Guide note</p>
            <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1">
              A slower read from the wiki agent.
            </p>
          </div>
          <p className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-twilight-soft/80 shrink-0">
            Live
          </p>
        </div>
        {agentToken ? (
          <ProfileAgentResult
            profile={prose}
            matches={matches}
            accessToken={agentToken}
          />
        ) : (
          <p className="font-serif italic text-ink-soft animate-pulse px-4 py-4">
            Starting the guide…
          </p>
        )}
      </div>
    </div>
  )
}

function ProfileAgentResult({
  profile,
  matches,
  accessToken,
}: {
  profile: string
  matches: ProfileMatch[]
  accessToken: string
}) {
  const query = useMemo(
    () => buildProfileAgentQuery(profile, matches),
    [profile, matches],
  )
  const { submit, run } = useRealtimeTaskTrigger<typeof searchAgent>('search-agent', {
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
  const isRunning =
    run?.status === 'EXECUTING' ||
    run?.status === 'QUEUED' ||
    run?.status === 'DEQUEUED'

  return (
    <div className="px-4 py-4">
      {!response && (
        <div className="flex items-start gap-3">
          <span className="mt-2 block w-2 h-2 rounded-full bg-twilight animate-pulse shrink-0" />
          <div>
            <p className="font-display italic text-ink text-xl leading-tight">
              Reading the wiki…
            </p>
            <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1">
              Looking for better matches than the instant pass can see.
            </p>
          </div>
        </div>
      )}

      {response && (
        <div className="prose-editorial text-[0.98rem] leading-relaxed [&_h2]:!mt-5 [&_h2:first-child]:!mt-0 [&_h3]:!mt-4 [&_p]:!mb-3 [&_ul]:!mb-3 [&_img]:rounded-md [&_img]:border [&_img]:border-sandstone/45 [&_img]:max-h-52 [&_img]:w-full [&_img]:object-cover">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
          {isRunning && (
            <span className="inline-block w-1.5 h-4 bg-twilight ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      )}

      {thinking && !response && (
        <div className="mt-4 border-t border-sandstone/40 pt-3">
          <p className="smallcaps !text-[0.6rem] !tracking-[0.2em] mb-1">
            Agent trace
          </p>
          <p className="font-sans text-xs text-ink-soft/70 line-clamp-3">
            {thinking}
          </p>
        </div>
      )}
    </div>
  )
}

function buildProfileAgentQuery(profile: string, matches: ProfileMatch[]): string {
  const matchContext =
    matches.length > 0
      ? [
          'The instant local matcher found these candidates. Use them as starting points, and include a markdown image when you discuss one if the image URL is useful:',
          '',
          ...matches.map(({ entry, reason }) =>
            [
              `- Title: ${entry.title}`,
              `  Entry path: /entry/${entry.source}/${entry.slug}`,
              `  Domain: ${entry.domain}`,
              `  Why local search picked it: ${reason}`,
              `  Image: ${heroImageFor(entry, 900, 520)}`,
              `  Summary: ${entry.summary}`,
            ].join('\n'),
          ),
          '',
        ].join('\n')
      : 'The instant local matcher did not find a close candidate, so search broadly and include images only if you find a relevant entry image.\n\n'

  return [
    'A reader just submitted this profile on Great Work:',
    '',
    profile || '(They did not write a note yet.)',
    '',
    matchContext,
    '',
    'Search the wiki for the best places, people, resources, or next reads for them.',
    'Return a concise match brief: 2-3 strongest matches, why each fits, and one practical next step.',
    'If you have a relevant image URL from the candidate context, include it with markdown image syntax near that match.',
  ].join('\n')
}

function findProfileMatches(prose: string): ProfileMatch[] {
  const tokens = tokenize(prose)
  if (tokens.length === 0) return []

  return getAllEntries()
    .filter((entry) => entry.source === 'places_you_can_work')
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, tokens, prose),
      reason: matchReason(entry, tokens),
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ entry, reason }) => ({ entry, reason }))
}

function scoreEntry(entry: Entry, tokens: string[], prose: string): number {
  const haystack = entrySearchText(entry)
  const title = entry.title.toLowerCase()
  const domain = entry.domain.toLowerCase()
  let score = 0

  for (const token of tokens) {
    if (title.includes(token)) score += 8
    if (domain.includes(token)) score += 5
    if (haystack.includes(token)) score += 2
  }

  const lowerProse = prose.toLowerCase()
  if (/\b(data scientist|machine learning|ml|ai|genomic|biotech)\b/.test(lowerProse)) {
    score += countMatches(haystack, [
      'machine learning',
      'artificial intelligence',
      'biology',
      'biotech',
      'pharmaceutical',
      'genomics',
      'software',
      'data',
    ]) * 6
  }
  if (/\b(deep tech|hard tech|science|research)\b/.test(lowerProse)) {
    score += countMatches(haystack, [
      'research',
      'science',
      'engineering',
      'energy',
      'aerospace',
      'medical',
      'neurotech',
      'geothermal',
    ]) * 4
  }

  if (entry.tier === 'S') score += 6
  if (entry.tier === 'A') score += 4
  if (entry.tier === 'B' || entry.tier === 'P-A') score += 2

  return score
}

function matchReason(entry: Entry, tokens: string[]): string {
  const shared = tokens.filter((token) => entrySearchText(entry).includes(token))
  if (shared.length > 0) {
    return `Matches ${shared.slice(0, 2).join(' + ')} in the wiki.`
  }
  if (entry.domain) return `Strong adjacent fit in ${entry.domain}.`
  return 'Worth reading as a nearby lead.'
}

function entrySearchText(entry: Entry): string {
  return [
    entry.title,
    entry.domain,
    entry.summary,
    ...entry.sections.map((section) => `${section.heading} ${section.body}`),
  ]
    .join(' ')
    .toLowerCase()
}

function tokenize(text: string): string[] {
  const stop = new Set([
    'about',
    'after',
    'also',
    'and',
    'are',
    'back',
    'can',
    'for',
    'from',
    'have',
    'into',
    'looking',
    'name',
    'places',
    'that',
    'the',
    'this',
    'want',
    'where',
    'with',
    'work',
  ])

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((token) => token.length > 2 && !stop.has(token)),
    ),
  )
}

function countMatches(text: string, phrases: string[]): number {
  return phrases.reduce((count, phrase) => {
    return text.includes(phrase) ? count + 1 : count
  }, 0)
}

function extractFirstName(prose: string): string {
  const m = prose.match(/(?:my name is|i['’]m|i am)\s+([A-Z][\p{L}\-']+)/u)
  return m?.[1] ?? 'reader'
}
