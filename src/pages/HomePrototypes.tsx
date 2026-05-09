import { Link } from 'react-router-dom'
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

interface HomePrototype {
  id: string
  name: string
  blurb: string
  move: string
  trash?: boolean
  whyDumb?: string
  Component: ComponentType
}

/* ============================================================
 * SECTION ONE — Workshopping the ask on the photo cover.
 * The user kept the photo and the cover; the workshop is on
 * the ask widget and on stripping the magazine furniture.
 * ============================================================ */
const ASK_ITERATIONS: HomePrototype[] = [
  {
    id: 'issue',
    name: 'The Issue · current home',
    blurb:
      'Same photographic cover. Vol/No corner gone. Kicker rewritten to "Featured · {domain}". Boxed Ask bar still pinned to the cover floor in a cream card.',
    move:
      'The starting point of this workshop. Magazine furniture is out; the boxed ask was the thing the user said felt clunky.',
    Component: IssueHome,
  },
  {
    id: 'issue-inscription',
    name: 'The Issue · Inscription',
    blurb:
      'No box at all. The Ask is rendered as cream Caslon italic over the photo, grounded by a single hairline rule and a quiet \u2192 caret. Reads as another sentence the editor wrote on the cover.',
    move:
      'The cover invites; the ask doesn\u2019t need its own surface, just another italic line in the same voice.',
    Component: IssueInscription,
  },
  {
    id: 'issue-lower-strip',
    name: 'The Issue · Lower Strip',
    blurb:
      'The ask lives in a thin cream paper band that runs full-width along the bottom of the cover photo, like the captioning strip beneath a magazine cover or the white border of a Polaroid.',
    move:
      'Make the ask part of the cover frame, not a popup over it.',
    Component: IssueLowerStrip,
  },
  {
    id: 'issue-calling-card',
    name: 'The Issue · Calling Card',
    blurb:
      'Keeps the boxed-input familiarity but rebuilds it as an editorial *object*: a small cream rectangle with a hairline border, fits just the input, no shadow, no rounded corners, no backdrop blur.',
    move:
      'Smaller, tighter, less ceremonial than the original card. The box is allowed if it stops looking like a dialog.',
    Component: IssueCallingCard,
  },
]

/* ============================================================
 * SECTION 1.5 — The search workshop.
 * The user said "we should just call it search btw" and asked
 * for several iterations. Section 1 was the ask-on-the-cover
 * conversation; this section is the search affordance pulled
 * out as its own object that grew legs.
 *
 * Five iterations, ordered shipped \u2192 wacky:
 *   1. search-sticky    LIVE AT / (sticky masthead + carousel cover)
 *   2. search           alternate polished panel (no carousel)
 *   3. search-conv.     editor's note + reply pinned at bottom
 *   4. search-typewr.   the home is a typewritten request form
 *   5. search-orb       quiet desert sky + a glowing moon
 * ============================================================ */
const SEARCH_WORKSHOP: HomePrototype[] = [
  {
    id: 'search-sticky',
    name: 'Search · Above the Fold',
    blurb:
      'Live at /. A thin sticky masthead pinned to the top of the page. \u201cGREAT WORK\u201d in tracked all-caps Caslon Display reads as a newspaper masthead, not as an italic flourish on someone else\u2019s photo. Below it, the cover is a slow-rotating carousel of five featured entries: the whole cover physically slides between slides, hover to pause, dots at the bottom to jump. Click the outer 35% on either side to advance/go-back, or swipe on touch. The bar\u2019s placeholder (\u201clook around\u201d) is calm and static; it doesn\u2019t nag.',
    move:
      'Brand louder, cover variety louder, search quieter. The bar earns its sticky place by getting out of the way; the carousel does the work of saying \u201cwe cover lots of things, not just Recursion.\u201d',
    Component: SearchSticky,
  },
  {
    id: 'issue-search',
    name: 'Search · polished panel',
    blurb:
      'Earlier iteration without the carousel or the masthead. Resting bar is a rounded-full pill on a blurred-cream pad over a single cover photo. Open the panel and the header chrome is gone entirely \u2014 a back pill sits on the same baseline as the input. Suggestions render as italic chip pills; \u201cor browse\u201d picks render as paper cards.',
    move:
      'The first read of the user\u2019s notes \u2014 no header in the search view, back-button on the same level as search, more rounded vocabulary throughout. Kept as the alternate "single cover" version.',
    Component: IssueSearch,
  },
  {
    id: 'search-conversation',
    name: 'Search · Editor\u2019s Note',
    blurb:
      'No magazine cover, no chatbot bubbles. The home is a hand-written note from the editor: \u201cHi. I\u2019m the editor of Great Work\u2026 tell me what you\u2019re after and I\u2019ll point at things.\u201d Quick-reply chips below it. The search input is rendered as your *reply* \u2014 a rounded-full \u201cwrite back\u201d pill with a quote-mark for a glyph.',
    move:
      'Reframe search as conversation, but as letter, not chat. Editorial voice, single working surface, the reader\u2019s reply is the search.',
    Component: SearchConversation,
  },
  {
    id: 'search-typewriter',
    name: 'Search · Typewriter',
    blurb:
      'The home is a single sheet of mono-spaced paper. Masthead, double rule, then a \u201cFIND:\u201d field with a blinking block cursor. Below: six pre-typed prior requests, struck through, that copy up to the input on click. Below that: a typewritten table of three featured entries with tier marks in the right column. Sign-off \u201c\u2014ED.\u201d at the foot.',
    move:
      'What does asking a wiki for help look like if the only office equipment was a typewriter and a request form? The form *is* the page.',
    Component: SearchTypewriter,
  },
  {
    id: 'search-orb',
    name: 'Search · Desert Moon',
    blurb:
      'No photo, no paper. A twilight gradient sky with a handful of stars, and a single glowing moon dead-center. The moon is the search: click it (or any of the orbiting suggestion chips) and the whole screen falls into deeper night while the moon doubles in size and the input writes itself across its face.',
    move:
      'First-principles: what does a search bar look like if you forgot how everyone else does it? There is one bright thing on the page; the user knows what to do.',
    Component: SearchOrb,
  },
]

/* ============================================================
 * SECTION TWO — Type-only experiments.
 * From the previous round, before the user clarified that
 * the photo should stay. Kept for record + designer reference.
 * ============================================================ */
const TYPE_EXPERIMENTS: HomePrototype[] = [
  {
    id: 'issue-frontispiece',
    name: 'The Issue · Frontispiece',
    blurb:
      'No photograph. Opens with a small italic colophon, then a delicate ribbon, then the cover entry as a book\u2019s title page \u2014 generously spaced, italic Caslon, single-sentence pull quote. Then a single underlined Ask line. Then a numbered contents list.',
    move:
      'Trade the magazine cover for an art-monograph title page. Pure type.',
    Component: IssueFrontispiece,
  },
  {
    id: 'issue-half-title',
    name: 'The Issue · Half Title',
    blurb:
      'Even quieter. Just the cover entry\u2019s title, set very large, italic, with one Mission sentence. The whole first viewport is mostly paper. Below: a single hairline rule, the Ask line, then a bare contents list.',
    move:
      'Half-title pages are the quietest type a book ever sets.',
    Component: IssueHalfTitle,
  },
  {
    id: 'issue-reading-room',
    name: 'The Issue · Reading Room',
    blurb:
      'No separate cover at all. The cover entry is just the first item in the contents list, set noticeably bigger than the rest, with its quote visible. Ask line sits above the list, like a chapter heading.',
    move:
      'The home is a contents page from the first pixel. Stripe-Press energy applied to a magazine TOC.',
    Component: IssueReadingRoom,
  },
  {
    id: 'issue-library',
    name: 'The Issue · Library',
    blurb:
      'Each entry is a vintage library catalog card: typewriter call number, italic Caslon title, italic annotation, tier mark stamped in the bottom-right. The Ask line lives in its own "REQ" card, in the same vocabulary.',
    move:
      'Bookish, but not quiet. A catalog drawer pulled open on the desk.',
    Component: IssueLibrary,
  },
]

/* ============================================================
 * SECTION THREE — Other front-page shapes (kept for comparison)
 * ============================================================ */
const OTHER_SHAPES: HomePrototype[] = [
  {
    id: 'marquee',
    name: 'The Marquee',
    blurb:
      'No photograph above the fold. One enormous pull-quote, set in display Caslon italic, attributed to a real entry. The Ask bar in the next breath. A quiet contents list below.',
    move:
      'The most magnetic thing on the page is a real sentence from a real entry.',
    Component: MarqueeHome,
  },
  {
    id: 'dispatch',
    name: 'The Dispatch',
    blurb:
      'The home is today\u2019s editorial column \u2014 a short essay by the Editors with five real entries threaded through it as inline links, plus an open question for the reader to answer.',
    move:
      'Treat the home as an article, not a list.',
    Component: DispatchHome,
  },
  {
    id: 'atlas',
    name: 'The Atlas',
    blurb:
      'A constellation map of the wiki\u2019s brightest entries, hand-arranged like a planetarium poster. Hand-drawn lines suggest the relationships. Hover to read, click to wander.',
    move: 'The wiki is a place. Show it as a map before showing it as a list.',
    Component: AtlasHome,
  },
]

/* ============================================================
 * SECTION FOUR — Trash heap
 * ============================================================ */
const TRASH: HomePrototype[] = [
  {
    id: 'tier-list',
    name: 'The Tier List',
    blurb:
      'A Smash Bros tier list of the top 147 entries (S, A, B), as actual rows of tiles, in tier order.',
    move:
      'Universal tiers go on the front. The wiki ranks; the home shouts the rankings.',
    trash: true,
    whyDumb:
      'design-direction.md says rankings live in *guides*, not on every entity page \u2014 and definitely not as a global verdict on the home.',
    Component: TierListHome,
  },
  {
    id: 'question-cloud',
    name: 'The Question Cloud',
    blurb:
      'No directory, no contents, no list. One enormous Ask bar floating in the middle of the page, surrounded by italic questions arranged like a tag cloud.',
    move: 'Make Ask the entire home.',
    trash: true,
    whyDumb:
      'A first-time visitor sees no actual content, so they have no reason to trust that the wiki has anything in it.',
    Component: QuestionCloudHome,
  },
  {
    id: 'credits',
    name: 'The Credits',
    blurb:
      'All 251 entries scroll past the screen, top to bottom, slowly, like film credits. The Ask bar is pinned to the bottom as the only stable UI.',
    move: 'Make the cumulative weight of the wiki the headline image.',
    trash: true,
    whyDumb:
      'Nobody reads movie credits. Every entry is reduced to a name; the wiki\u2019s actual value is invisible.',
    Component: CreditsHome,
  },
]

const ALL: HomePrototype[] = [
  ...ASK_ITERATIONS,
  ...SEARCH_WORKSHOP,
  ...TYPE_EXPERIMENTS,
  ...OTHER_SHAPES,
  ...TRASH,
]

export function HomePrototypesPage() {
  return (
    <div className="min-h-screen bg-paper-deep/40 text-ink pb-24">
      {/* Showroom header */}
      <header className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
        <p className="smallcaps">
          <Link to="/" className="hover:text-twilight">
            ← Great Work
          </Link>
          <span className="text-twilight-soft/60"> · </span>
          <span>Prototypes</span>
          <span className="text-twilight-soft/60"> · </span>
          <span>Front page</span>
        </p>
        <h1 className="font-display italic text-twilight text-5xl leading-[0.95] mt-3">
          Front-page studies
        </h1>
        <p className="font-serif italic text-ink-soft mt-3 max-w-prose leading-snug">
          The home is The Issue: a photographic cover plus an "also worth
          reading" contents page. The current shipped front page is
          {' '}
          <Link
            to="/prototypes/home/search-sticky"
            className="text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange"
          >
            Search · Above the Fold
          </Link>
          {' '}
          (sticky masthead + carousel cover). Section 1 below is the older
          ask-widget-on-the-cover thread; section 1.5 is search as its own
          object, ordered shipped \u2192 wacky.
        </p>
        <p className="font-serif italic text-ink-soft mt-3 text-sm leading-snug">
          See also{' '}
          <Link
            to="/templates"
            className="text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange"
          >
            article templates
          </Link>{' '}
          and{' '}
          <Link
            to="/prototypes/navbar"
            className="text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange"
          >
            navbar studies
          </Link>
          .
        </p>

        {/* Jump-to */}
        <nav className="mt-8">
          <p className="smallcaps mb-2">Jump to</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
            {ALL.map((p) => (
              <li key={p.id}>
                <a
                  href={`#${p.id}`}
                  className="font-serif italic text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange transition-colors"
                >
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* SECTION ONE — Workshopping the ask on the photo cover */}
      <SectionHeader
        kicker="Section one · the older workshop"
        title="The ask, four ways."
        body="Same photo cover. Same contents page. The only thing that changes is how the ask sits on the cover. The first one (issue) was the / before search got pulled out as its own object \u2014 now it lives here as a receipt."
      />
      <ul className="space-y-20">
        {ASK_ITERATIONS.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <PrototypeBlock
              proto={p}
              index={i + 1}
              total={ASK_ITERATIONS.length}
              indexLabel={p.id === 'issue' ? 'previous /' : 'iteration'}
            />
          </li>
        ))}
      </ul>

      {/* SECTION 1.5 — Search, as its own object */}
      <div className="my-20">
        <hr className="border-twilight/60" />
      </div>
      <SectionHeader
        kicker="Section 1.5 · the search workshop"
        title="Search, as its own object."
        body={
          'Pulled out of the cover and given its own thread. First entry is what currently lives at /; the next four are first-principles \u2014 what does a search bar look like if you forgot how everyone else does it? Order: shipped \u2192 wacky.'
        }
      />
      <ul className="space-y-20">
        {SEARCH_WORKSHOP.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <PrototypeBlock
              proto={p}
              index={i + 1}
              total={SEARCH_WORKSHOP.length}
              indexLabel={
                p.id === 'search-sticky'
                  ? 'live at /'
                  : p.id === 'issue-search'
                    ? 'alternate'
                    : 'experiment'
              }
            />
          </li>
        ))}
      </ul>

      {/* SECTION TWO — Type-only experiments */}
      <div className="my-20">
        <hr className="border-twilight/60" />
      </div>
      <SectionHeader
        kicker="Section two · type-only experiments"
        title="The Issue, with the photograph removed."
        body="From the previous round, before the photo earned its keep. Kept here as designer reference \u2014 not where we\u2019re heading."
      />
      <ul className="space-y-20">
        {TYPE_EXPERIMENTS.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <PrototypeBlock
              proto={p}
              index={i + 1}
              total={TYPE_EXPERIMENTS.length}
            />
          </li>
        ))}
      </ul>

      {/* SECTION THREE — Other shapes */}
      <div className="my-20">
        <hr className="border-twilight/60" />
      </div>
      <SectionHeader
        kicker="Section three · other shapes"
        title="The other front pages we considered."
        body="Same brief, different bones. Kept here as receipts of the path not taken."
      />
      <ul className="space-y-20">
        {OTHER_SHAPES.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <PrototypeBlock proto={p} index={i + 1} total={OTHER_SHAPES.length} />
          </li>
        ))}
      </ul>

      {/* SECTION FOUR — Trash heap */}
      <div className="my-20">
        <hr className="border-twilight" />
        <hr className="border-twilight mt-1" />
      </div>
      <SectionHeader
        kicker="Section four · the trash heap"
        title="Front pages people don&rsquo;t do, usually for good reason."
        body="First-principles experiments. Most are bad on purpose. A few might be great."
      />
      <ul className="space-y-20">
        {TRASH.map((p, i) => (
          <li key={p.id} id={p.id} className="scroll-mt-20">
            <PrototypeBlock proto={p} index={i + 1} total={TRASH.length} trash />
          </li>
        ))}
      </ul>

      <p className="ornament mt-24">— ❦ —</p>
      <p className="font-serif italic text-center text-ink-soft leading-relaxed">
        Great work is non-consensus.
        <br />
        Most non-consensus is trash.
        <br />
        That is the deal.
      </p>
    </div>
  )
}

function SectionHeader({
  kicker,
  title,
  body,
}: {
  kicker: string
  title: string
  body: string
}) {
  return (
    <header className="max-w-4xl mx-auto px-5 sm:px-8 mb-10">
      <p className="smallcaps">{kicker}</p>
      <h2
        className="font-display italic text-ink leading-[0.95] mt-2"
        style={{ fontSize: 'clamp(2rem, 9vw, 2.7rem)' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className="font-serif italic text-twilight text-lg leading-snug mt-3 max-w-prose">
        {body}
      </p>
      <hr className="border-twilight/40 mt-6" />
    </header>
  )
}

function PrototypeBlock({
  proto,
  index,
  total,
  trash = false,
  indexLabel,
}: {
  proto: HomePrototype
  index: number
  total: number
  trash?: boolean
  indexLabel?: string
}) {
  const { name, blurb, move, whyDumb, Component, id } = proto
  const labelLeft =
    indexLabel ?? (trash ? 'Experiment' : '\u2116')
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-6">
      <div className="px-2 mb-5">
        <div className="flex items-baseline justify-between gap-4 mb-1">
          <p className="smallcaps">
            {labelLeft}
            {' '}
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <p className="smallcaps text-twilight">— {id}</p>
        </div>
        <h2
          className="font-display italic text-ink leading-[1] mb-2"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)' }}
        >
          {name}
        </h2>
        <p className="font-serif italic text-ink-soft leading-snug max-w-prose">
          {blurb}
        </p>
        <p className="font-serif italic text-twilight leading-snug mt-1 max-w-prose">
          <span className="smallcaps not-italic mr-2">The move</span>
          {move}
        </p>
        {whyDumb && (
          <p className="font-serif italic text-orange/90 leading-snug mt-1 max-w-prose">
            <span className="smallcaps not-italic mr-2 text-orange">
              Why it&rsquo;s dumb
            </span>
            {whyDumb}
          </p>
        )}
      </div>

      {/* Live preview */}
      <div className="bg-paper shadow-[0_1px_0_rgba(42,31,24,0.06),0_24px_60px_-30px_rgba(42,31,24,0.25)] border border-sandstone/50 rounded-md overflow-hidden">
        <div
          className="overflow-hidden"
          style={{ height: '720px', overflowY: 'auto' }}
        >
          <Component />
        </div>
      </div>

      <p className="px-2 mt-3 font-serif italic text-ink-soft text-xs leading-snug">
        Preview is scrollable. Open{' '}
        <Link
          to={`/prototypes/home/${id}`}
          className="text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange"
        >
          full-screen →
        </Link>
      </p>
    </section>
  )
}
