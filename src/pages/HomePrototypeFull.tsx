import { Link, useParams } from 'react-router-dom'
import type { ComponentType } from 'react'
import { IssueHome } from '../components/home-prototypes/Issue'
import { IssueSearch } from '../components/home-prototypes/IssueSearch'
import { SearchSticky } from '../components/home-prototypes/SearchSticky'
import { SearchOrb } from '../components/home-prototypes/SearchOrb'
import { SearchTypewriter } from '../components/home-prototypes/SearchTypewriter'
import { SearchConversation } from '../components/home-prototypes/SearchConversation'
import { IssueInscription } from '../components/home-prototypes/IssueInscription'
import { IssueLowerStrip } from '../components/home-prototypes/IssueLowerStrip'
import { IssueCallingCard } from '../components/home-prototypes/IssueCallingCard'
import { IssueFrontispiece } from '../components/home-prototypes/IssueFrontispiece'
import { IssueHalfTitle } from '../components/home-prototypes/IssueHalfTitle'
import { IssueReadingRoom } from '../components/home-prototypes/IssueReadingRoom'
import { IssueLibrary } from '../components/home-prototypes/IssueLibrary'
import { MarqueeHome } from '../components/home-prototypes/Marquee'
import { DispatchHome } from '../components/home-prototypes/Dispatch'
import { AtlasHome } from '../components/home-prototypes/Atlas'
import { TierListHome } from '../components/home-prototypes/TierList'
import { QuestionCloudHome } from '../components/home-prototypes/QuestionCloud'
import { CreditsHome } from '../components/home-prototypes/Credits'

const REGISTRY: Record<string, { name: string; Component: ComponentType }> = {
  issue: { name: 'The Issue · current home', Component: IssueHome },
  // Search workshop — the user said "just call it search btw"; the
  // legacy `issue-search` slug is kept as an alias so older URLs still
  // work, and `search` is the canonical id from here on.
  search: { name: 'Search · polished', Component: IssueSearch },
  'issue-search': { name: 'Search · polished', Component: IssueSearch },
  'search-sticky': { name: 'Search · Above the Fold (sticky)', Component: SearchSticky },
  'search-orb': { name: 'Search · Desert Moon', Component: SearchOrb },
  'search-typewriter': { name: 'Search · Typewriter', Component: SearchTypewriter },
  'search-conversation': { name: 'Search · Editor\u2019s Note', Component: SearchConversation },
  'issue-inscription': { name: 'The Issue · Inscription', Component: IssueInscription },
  'issue-lower-strip': { name: 'The Issue · Lower Strip', Component: IssueLowerStrip },
  'issue-calling-card': { name: 'The Issue · Calling Card', Component: IssueCallingCard },
  'issue-frontispiece': { name: 'The Issue · Frontispiece', Component: IssueFrontispiece },
  'issue-half-title': { name: 'The Issue · Half Title', Component: IssueHalfTitle },
  'issue-reading-room': { name: 'The Issue · Reading Room', Component: IssueReadingRoom },
  'issue-library': { name: 'The Issue · Library', Component: IssueLibrary },
  marquee: { name: 'The Marquee', Component: MarqueeHome },
  dispatch: { name: 'The Dispatch', Component: DispatchHome },
  atlas: { name: 'The Atlas', Component: AtlasHome },
  'tier-list': { name: 'The Tier List', Component: TierListHome },
  'question-cloud': { name: 'The Question Cloud', Component: QuestionCloudHome },
  credits: { name: 'The Credits', Component: CreditsHome },
}

/**
 * /prototypes/home/:id — render a single home prototype full-screen, so
 * the variant can be evaluated as a real first-load experience without
 * the showroom chrome around it.
 *
 * A tiny floating "back to showroom" pill is added in the corner so the
 * user can escape — but otherwise the prototype owns the viewport.
 */
export function HomePrototypeFullPage() {
  const { id = '' } = useParams<{ id: string }>()
  const entry = REGISTRY[id]

  if (!entry) {
    return (
      <div className="min-h-screen bg-paper text-ink p-10">
        <p className="font-serif italic">
          No such prototype. Try one of these:{' '}
          {Object.entries(REGISTRY).map(([k, v], i) => (
            <span key={k}>
              {i > 0 && ', '}
              <Link
                to={`/prototypes/home/${k}`}
                className="text-twilight underline italic"
              >
                {v.name}
              </Link>
            </span>
          ))}
          .
        </p>
      </div>
    )
  }

  const { Component, name } = entry

  return (
    <div className="relative">
      <Component />
      {/* Floating exit pill — bottom-right so it doesn't fight any masthead */}
      <Link
        to="/prototypes/home"
        className="fixed bottom-4 right-4 z-50 smallcaps bg-paper/95 backdrop-blur-sm border border-sandstone/60 rounded-full px-3 py-1.5 hover:text-twilight hover:border-twilight/40 transition-colors shadow-[0_8px_24px_-12px_rgba(42,31,24,0.4)]"
        title={`Previewing: ${name}`}
      >
        ← Back to the showroom
      </Link>
    </div>
  )
}
