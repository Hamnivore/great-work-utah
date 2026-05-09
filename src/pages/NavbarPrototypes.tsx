import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { SlimStripe } from '../components/navbar-prototypes/SlimStripe'
import { MagazineDrawer } from '../components/navbar-prototypes/MagazineDrawer'
import { IndexCard } from '../components/navbar-prototypes/IndexCard'
import { InlineReveal } from '../components/navbar-prototypes/InlineReveal'
import { EditorialTray } from '../components/navbar-prototypes/EditorialTray'
import { GraphView } from '../components/navbar-prototypes/GraphView'
import { BubbleGraph } from '../components/navbar-prototypes/BubbleGraph'

interface PrototypeSlotProps {
  letter: string
  name: string
  blurb: string
  notes: string
  children: ReactNode
}

function PrototypeSlot({ letter, name, blurb, notes, children }: PrototypeSlotProps) {
  return (
    <section className="mt-16 first:mt-0">
      <header className="max-w-3xl mx-auto px-5 sm:px-8 mb-5">
        <p className="smallcaps">
          Variant {letter}
        </p>
        <h2 className="font-display italic text-twilight text-3xl leading-tight mt-1">
          {name}
        </h2>
        <p className="font-serif italic text-ink-soft mt-2 leading-snug">{blurb}</p>
      </header>

      <div className="bg-paper shadow-[0_1px_0_rgba(42,31,24,0.06),0_24px_60px_-30px_rgba(42,31,24,0.25)] border border-sandstone/50 rounded-md overflow-hidden">
        {children}
        <ArticleSample />
      </div>

      <p className="max-w-3xl mx-auto px-5 sm:px-8 mt-3 font-serif italic text-ink-soft text-sm leading-snug">
        {notes}
      </p>
    </section>
  )
}

/**
 * The same chunk of article body shown beneath every navbar so the
 * prototypes are evaluated in their actual context (a Stripe-Press style
 * long-form entry), not in isolation.
 */
function ArticleSample() {
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 pb-10">
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight">Spiral Jetty</h1>
      <p className="font-serif italic text-ink-soft text-lg mt-2 leading-snug">
        On entropy, Land art, and the lake.
      </p>
      <div className="mt-6 font-serif text-ink leading-loose">
        <p>
          <span className="font-display text-twilight float-left text-6xl leading-[0.85] pr-2 pt-1">R</span>
          obert Smithson directed the construction of Spiral Jetty in April 1970 at Rozel Point, on the
          eastern shore of the Great Salt Lake in Utah. He used bulldozers and trucks to move some 6,650
          tons of basalt and earth to form a 1,500-foot-long coil extending into the lake.
        </p>
        <p className="mt-3">
          Smithson was interested in entropy &mdash; the natural tendency toward disorder &mdash; and in how
          art could participate in slow processes of change.
        </p>
      </div>
    </article>
  )
}

export function NavbarPrototypesPage() {
  return (
    <div className="min-h-screen bg-paper-deep/40 text-ink pb-24">
      <header className="max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-10">
        <p className="smallcaps">
          <Link to="/" className="hover:text-twilight">← Great Work</Link>
          <span className="text-twilight-soft/60"> · </span>
          <span>Prototypes</span>
        </p>
        <h1 className="font-display italic text-twilight text-5xl leading-none mt-3">
          Navbar studies
        </h1>
        <p className="font-serif italic text-ink-soft mt-3 max-w-prose leading-snug">
          The Stripe-Press eyebrow from panel #4 of the design study, read seven different ways.
          The current direction (Variant G, below) puts the connected wiki into bubbles that
          float, expand, and collapse as you click them. Earlier iterations are kept for
          comparison.
        </p>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <header className="max-w-3xl mx-auto px-5 sm:px-8 mb-3">
          <p className="smallcaps !text-orange">Current direction</p>
        </header>
        <PrototypeSlot
          letter="G"
          name="Bubble graph (pannable map)"
          blurb="Same eyebrow bar; clicking a segment opens the wiki as a spread-out map of bubbles. Drag to pan, scroll or pinch to zoom. Click any bubble to expand it inline (Caslon abstract appears in place); click again to collapse. The whole world keeps simmering underneath — bubbles drift out of each other’s way so nothing’s ever hidden."
          notes="Most exploratory yet. Treats the wiki as a place rather than a list: zoom out to see the shape of a section, zoom in to read individual entries. Drag to wander. The physics handles legibility wherever you are; pinch-to-zoom on touch and wheel-to-zoom on desktop both anchor on the cursor / midpoint, the way a real map does. Drag-to-pin individual bubbles is the obvious next move."
        >
          <BubbleGraph />
        </PrototypeSlot>

        <header className="max-w-3xl mx-auto px-5 sm:px-8 mt-20 mb-3 pt-8 border-t border-sandstone/40">
          <p className="smallcaps">Previous iteration — fixed-radius graph</p>
          <p className="font-serif italic text-ink-soft text-sm mt-1 leading-snug">
            The first take on the graph direction: a deterministic radial layout with click-to-recenter and a separate abstract panel beneath.
          </p>
        </header>
        <PrototypeSlot
          letter="F"
          name="Graph view (radial)"
          blurb="Same eyebrow bar; clicking a segment opens a search-led graph. The clicked segment becomes the center node; sibling nodes radiate around it on a fixed ellipse. Click any node to re-center; abstract beneath updates."
          notes="Cleaner, calmer than the bubble version — the layout never moves unless you click. The trade-off: only one node is in focus at a time, and you have to recenter to read another abstract. Best when readers want a guided tour rather than a sandbox."
        >
          <GraphView />
        </PrototypeSlot>

        <header className="max-w-3xl mx-auto px-5 sm:px-8 mt-20 mb-3 pt-8 border-t border-sandstone/40">
          <p className="smallcaps">Earlier studies — list-style dropdowns</p>
          <p className="font-serif italic text-ink-soft text-sm mt-1 leading-snug">
            Kept here as a comparison reference for the original five reads.
          </p>
        </header>
        <PrototypeSlot
          letter="A"
          name="Slim Stripe"
          blurb="The faithful read. A tracked-smallcaps eyebrow with hairline rules, exactly as drawn. Tight popover anchored beneath each segment, italic Caslon list divided by hairlines."
          notes="Closest to the Stripe Press reference. Lowest-effort to ship. Best when the dropdown content is short and homogeneous."
        >
          <SlimStripe />
        </PrototypeSlot>

        <PrototypeSlot
          letter="B"
          name="Magazine Drawer"
          blurb="The dropdown opens as a full-width drawer that pushes the article down. Sibling list lays out as a magazine contents page: italic Caslon entries, tier marks on the right, one-line decks beneath."
          notes="Most editorial. Reads like turning to the table of contents page. Costs vertical space when open, which is a feature on long-form entries and a problem on short ones."
        >
          <MagazineDrawer />
        </PrototypeSlot>

        <PrototypeSlot
          letter="C"
          name="Index Card"
          blurb="The leaf segment is set in italic Caslon (the way you’d read a chapter title in body type), parents stay in smallcaps. Clicking opens a bordered card with a caret nub — feels like sliding a card out of a library catalog."
          notes="Best feel of being a piece of *furniture* on the page rather than a UI surface. The caret + border read warmer than A but stays smaller than B."
        >
          <IndexCard />
        </PrototypeSlot>

        <PrototypeSlot
          letter="D"
          name="Inline Reveal"
          blurb="No popover at all. Clicking a segment causes the bar itself to transform: that segment’s siblings spill out to its right on the same hairline-bounded line, separated by middle dots. A small × returns to rest."
          notes="Most editorial restraint. The bar never sprouts a second surface. Works well on desktop; on narrow mobile the horizontal scroll inside the bar is the trade-off."
        >
          <InlineReveal />
        </PrototypeSlot>

        <PrototypeSlot
          letter="E"
          name="Editorial Tray"
          blurb="Bar looks like the others; the dropdown opens as a horizontally scrolling tray of mini-cards (display Caslon title, italic deck, tier mark in orange). Like the “roadside attractions nearby” strip on an Atlas Obscura entry."
          notes="Most discovery-forward. Useful for the sibling-entry segment specifically, where each option is a real article worth previewing. Heavier than necessary for the section/domain segments."
        >
          <EditorialTray />
        </PrototypeSlot>
      </div>
    </div>
  )
}
