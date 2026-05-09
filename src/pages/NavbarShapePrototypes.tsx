import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { WasatchHorizon } from '../components/navbar-shape-prototypes/WasatchHorizon'
import { MapCoordinates } from '../components/navbar-shape-prototypes/MapCoordinates'
import { PostageStamp } from '../components/navbar-shape-prototypes/PostageStamp'
import { FieldNotebookSpine } from '../components/navbar-shape-prototypes/FieldNotebookSpine'
import { CoverStrip } from '../components/navbar-shape-prototypes/CoverStrip'
import { Marginalia } from '../components/navbar-shape-prototypes/Marginalia'
import { BottomBand } from '../components/navbar-shape-prototypes/BottomBand'

interface SlotProps {
  letter: string
  name: string
  blurb: string
  risk: string
  children: ReactNode
}

function Slot({ letter, name, blurb, risk, children }: SlotProps) {
  return (
    <section className="mt-16 first:mt-0">
      <header className="max-w-3xl mx-auto px-5 sm:px-8 mb-5">
        <p className="smallcaps">Variant {letter}</p>
        <h2 className="font-display italic text-twilight text-3xl leading-tight mt-1">
          {name}
        </h2>
        <p className="font-serif italic text-ink-soft mt-2 leading-snug">{blurb}</p>
      </header>

      <div className="bg-paper shadow-[0_1px_0_rgba(42,31,24,0.06),0_24px_60px_-30px_rgba(42,31,24,0.25)] border border-sandstone/50 rounded-md overflow-hidden">
        {children}
      </div>

      <p className="max-w-3xl mx-auto px-5 sm:px-8 mt-3 font-serif italic text-ink-soft text-sm leading-snug">
        <span className="smallcaps mr-2 !text-[0.6rem] !tracking-[0.22em]">The risk</span>
        {risk}
      </p>
    </section>
  )
}

export function NavbarShapePrototypesPage() {
  return (
    <div className="min-h-screen bg-paper-deep/40 text-ink pb-24">
      <header className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
        <p className="smallcaps">
          <Link to="/" className="hover:text-twilight">← Great Work</Link>
          <span className="text-twilight-soft/60"> · </span>
          <span>Prototypes</span>
          <span className="text-twilight-soft/60"> · </span>
          <span>Navbar shapes</span>
        </p>
        <h1 className="font-display italic text-twilight text-5xl leading-none mt-3">
          The navbar in seven shapes
        </h1>
        <p className="font-serif italic text-ink-soft mt-3 max-w-prose leading-snug">
          Same masthead, same breadcrumb, same article underneath. Seven different reads on what the
          persistent navbar wants to be when it grows up. A few are the safe travel-magazine moves; a
          few are deliberate breakages, included because the brief was “try to fail and come up with
          something cool.” No interaction yet — all clicks are no-ops.
        </p>
        <p className="font-serif italic text-ink-soft mt-3 text-sm leading-snug">
          Looking for the dropdown experiments instead?{' '}
          <Link
            to="/prototypes/navbar"
            className="text-twilight underline decoration-twilight/40 underline-offset-3 hover:text-orange"
          >
            They’re here.
          </Link>
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-2">
        <Slot
          letter="A"
          name="Wasatch Horizon"
          blurb="Standard masthead-left / breadcrumb-right pairing, but the hairline beneath becomes a hand-drawn mountain silhouette. The bottom edge of the navbar IS the Wasatch Range. The article begins on the other side of the mountains."
          risk="Cute the first time, possibly cloying the hundredth. Test by reading three articles in a row — if the mountains stop disappearing, kill them."
        >
          <WasatchHorizon />
        </Slot>

        <Slot
          letter="B"
          name="Map Coordinates"
          blurb="A tracked smallcaps line of GPS coordinates centered above the masthead/breadcrumb pair, anchoring the page to a real place on Earth. Reads like the front matter of a Field Notes journal."
          risk="Coordinates lie when the entry isn’t about a place — a person’s page, a tier explainer, the Ask interface. Either every entry needs a defensible coordinate, or this only works on geographic entries."
        >
          <MapCoordinates />
        </Slot>

        <Slot
          letter="C"
          name="Postage Stamp"
          blurb="The masthead is set inside an actual stamp — twilight border, dashed inner edge for perforations, faint cancellation lines crossing it diagonally. The breadcrumb is set to the right like an address, posted from Rozel Point."
          risk="The most overtly ornamental of the bunch. Charming on a marketing page, potentially exhausting at the top of every article. Probably want a quieter version for non-hero pages."
        >
          <PostageStamp />
        </Slot>

        <Slot
          letter="D"
          name="Field-Notebook Spine"
          blurb="Throws horizontal placement out entirely. The navbar is a thin vertical spine on the left edge — masthead reads top-to-bottom in vertical type, breadcrumb stacks beneath, a single ?-pin sits at the bottom as the persistent Ask affordance. The article gets the rest."
          risk="Mobile is the obvious problem — a fixed left spine eats already-scarce horizontal space. Either we accept the spine collapses to a top bar under ~600px, or this is desktop-only. Also: rotated type is annoying to read on every screen."
        >
          <FieldNotebookSpine />
        </Slot>

        <Slot
          letter="E"
          name="Cover Strip"
          blurb="The opposite move from Marginalia: “Great Work” set huge in italic display Caslon dominates the bar, with a tracked subtitle beneath it. To the right, a tight stack of issue metadata and the breadcrumb."
          risk="Asserts “this is a magazine” on every single screen, which can crowd the article it’s introducing. Best when the navbar appears once at the top of a long entry, worse when the page is itself short."
        >
          <CoverStrip />
        </Slot>

        <Slot
          letter="F"
          name="Marginalia"
          blurb="The most editorial. Almost no top navbar — just a tiny italic wordmark and an Ask link. The breadcrumb “you are here” marker doesn’t live in any bar at all; it sits in the left gutter as marginalia, vertically aligned with the article’s H1, the way a printed book’s running head sits in the outer margin."
          risk="Discoverability. A first-time visitor may genuinely miss that there’s navigation. Also: the gutter goes away on narrow screens, so we have to design a fallback that doesn’t betray the concept."
        >
          <Marginalia />
        </Slot>

        <Slot
          letter="G"
          name="Bottom Band (the rebel)"
          blurb="What if there’s no navbar at the top at all? The article gets pure top space — the H1 is the first thing the eye lands on, the way a book’s chapter opener works. The masthead and breadcrumb live as a thin band pinned to the bottom of the screen, like a colophon."
          risk="The user can’t see “where am I” until they look down. Probably wrong. Included as a reminder that we don’t have to put the chrome at the top — sometimes naming the trade is more useful than respecting it."
        >
          <BottomBand />
        </Slot>
      </div>
    </div>
  )
}
