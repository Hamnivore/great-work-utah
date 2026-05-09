import { Layout } from '../components/Layout'
import { tierLabel, getCounts } from '../lib/data'
import type { Tier } from '../lib/types'

const ORDER: Tier[] = ['S', 'A', 'B', 'C', 'D', 'F', 'P-A', 'P-B', 'P-C']

export function TierSystemPage() {
  const counts = getCounts()
  return (
    <Layout backLabel="Back" backTo="/">
      <article className="prose-editorial">
        <p className="smallcaps">A note from the editors</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 mb-3 leading-tight">
          The tier system
        </h1>
        <p className="font-display italic text-2xl text-twilight leading-snug mb-8">
          How we rank great work — in public.
        </p>

        <p>
          We rank organizations and historical work in public, the way you&rsquo;d argue about a
          tier list with a friend. The point isn&rsquo;t to be the final word; it&rsquo;s to be{' '}
          <em>opinionated and legible</em>. Our claim: a guide that won&rsquo;t take a position
          isn&rsquo;t a guide.
        </p>

        <p>
          Inclusion is generous. Tier is the visibility control — anything plausible goes in;
          the tier tells you how seriously to take it.
        </p>

        <h2>The ladder</h2>
        <div className="not-prose">
          <ul className="border-y border-sandstone/40 divide-y divide-sandstone/30">
            {ORDER.map((tier) => (
              <li key={tier} className="py-4 flex items-baseline gap-5">
                <span className="font-display text-3xl text-orange w-12 shrink-0">{tier}</span>
                <div className="flex-1">
                  <p className="font-serif italic text-ink leading-snug">{tierLabel(tier)}</p>
                </div>
                <span className="smallcaps shrink-0">
                  {counts[tier] ? `${counts[tier]} entries` : '—'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <h2>Why &ldquo;Why this is not ⭐&rdquo;</h2>
        <p>
          Many entries include a <em>Why this is not ⭐</em> note — the conditions under which
          the tier would upgrade. It&rsquo;s the most useful kind of feedback we can give: not a
          ranking, but a roadmap.
        </p>

        <h2>What about the speculative tiers?</h2>
        <p>
          P-A through P-C are the watchlist — work that&rsquo;s promising but unproven. They
          live separately from the main ladder so you can choose to dial them in.
        </p>
      </article>
    </Layout>
  )
}
