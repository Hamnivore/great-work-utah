import { useState, type FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { logRaiseHand } from '../lib/supabase'

type Flavor = 'Seeker' | 'Researcher' | 'Helper'

const FLAVOR_DESCRIPTIONS: Record<Flavor, string> = {
  Seeker: "I'm looking for meaningful, mission-driven work in Utah.",
  Researcher: "I have research that's ready for an executor — help me find one.",
  Helper: "I want to help founders by mentoring, advising, or investing.",
}

export function RaiseHandPage() {
  const [flavor, setFlavor] = useState<Flavor>('Seeker')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    try {
      await logRaiseHand({
        flavor,
        name: data.name ?? '',
        email: data.email ?? '',
        want: data.want ?? '',
        offer: data.offer ?? '',
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <Layout backLabel="Back" backTo="/">
      <article>
        <p className="smallcaps">Get on the map</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 leading-tight">
          Raise your hand
        </h1>
        <p className="font-display italic text-xl text-twilight mt-3 mb-8 leading-snug">
          Tell the guide who you are. The wiki will hold a page for you, citably and quietly.
        </p>

        {submitted ? (
          <div className="bg-sky/60 border-l-4 border-twilight rounded-r-md px-5 py-4">
            <p className="font-display text-2xl text-twilight mb-2">Got it.</p>
            <p className="font-serif italic text-ink">
              In the next slice, your submission would be filed into{' '}
              <code className="font-sans not-italic text-sm bg-paper-deep px-1.5 py-0.5 rounded">
                wiki/people/
              </code>{' '}
              as a new markdown entry, and the matchmaker agent would scan for plausible matches
              against current places to do great work.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <p className="smallcaps mb-2">I am a</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FLAVOR_DESCRIPTIONS) as Flavor[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFlavor(f)}
                    className={`px-4 py-1.5 rounded-full font-serif italic transition-colors border ${
                      f === flavor
                        ? 'bg-twilight text-paper border-twilight'
                        : 'border-sandstone/60 text-ink hover:border-twilight hover:text-twilight'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="font-serif italic text-ink-soft text-sm mt-2">
                {FLAVOR_DESCRIPTIONS[flavor]}
              </p>
            </div>

            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="What you're looking for" name="want" multiline />
            <Field label="What you offer" name="offer" multiline />

            {error && (
              <p className="font-serif text-sm text-orange">{error}</p>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-twilight text-paper font-serif italic rounded-md hover:bg-ink transition-colors"
            >
              Send it in
            </button>
          </form>
        )}
      </article>
    </Layout>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  multiline,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  multiline?: boolean
}) {
  const baseClass =
    'w-full bg-pale-sky/60 border border-sandstone/60 rounded-md px-3 py-2 font-serif text-ink focus:outline-none focus:border-twilight focus:ring-2 focus:ring-twilight/25 transition-colors'
  return (
    <div>
      <label className="smallcaps mb-1 block" htmlFor={name}>
        {label}
        {required && <span className="text-orange ml-1">*</span>}
      </label>
      {multiline ? (
        <textarea id={name} name={name} required={required} rows={3} className={baseClass} />
      ) : (
        <input id={name} name={name} type={type} required={required} className={baseClass} />
      )}
    </div>
  )
}
