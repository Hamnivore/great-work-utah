import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllEntries } from '../../lib/data'
import type { Entry } from '../../lib/types'
import { usePageTransition } from '../../lib/page-transitions'
import { useSearchOverlay } from '../searchOverlayContext'
import { TierGlyph } from './parts/IssueShared'
import { WhosReading } from './parts/WhosReading'
import {
  categoryImageFor,
  categoryImageSrcSetFor,
  getCoverQuote,
  getFeaturedEntries,
  heroCaptionFor,
  heroImageFor,
  heroImageSrcSetFor,
  heroObjectPositionFor,
} from './_shared'

/**
 * SEARCH · ABOVE THE FOLD (real masthead band + carousel cover)
 *
 * Iteration on the previous "thin sticky bar" sketch. That version
 * still had a hierarchy problem: the cover entry's title was set at
 * clamp(2.4–3.8rem) while GREAT WORK above it was a 16–18px chip.
 * The masthead lost the ratio fight, so a first-time visitor's eye
 * still answered "what is this site?" with "this site is about
 * Recursion." The all-caps Caslon mitigation helped, but a magazine
 * cover only gets away with a tiny masthead because the reader
 * already knows what they bought; a homepage has no such prior
 * context and has to pull more weight.
 *
 * Two structural moves:
 *
 *   1. The masthead becomes a *real* magazine masthead band — big
 *      tracked-Caslon GREAT WORK, roman tagline beneath, UTAH, USA
 *      smallcaps, and a search pill. It lives on the photograph
 *      (glass treatment), centered, generous, and scrolls away
 *      with the cover. The wordmark is now at parity with the
 *      cover entry's title, so the page identifies *itself* before
 *      it identifies any single subject.
 *
 *   2. A slim sticky chrome takes over once the cover masthead is
 *      out of view (~120px of scroll) — paper-cream background,
 *      compact wordmark on the left, search pill on the right.
 *      Visual continuity: the wordmark is always present in some
 *      form; there is no jarring expand/collapse on a single
 *      element. Two surfaces, one identity.
 *
 * The cover entry's title and pull-quote are also reduced so the
 * masthead and the cover entry sit in conversation, not in a
 * shouting match. Carousel rotation, hover-pause, dots, edge
 * clicks, and touch dragging behave exactly as before.
 */
export function SearchSticky() {
  // Show the full 8-card cover stack on the carousel. The list lives
  // in FEATURED_IDS in `_shared.ts`; bumping this number wider only
  // makes sense once we've curated more entries with real, hand-
  // picked heroes. The carousel auto-rotates with hover-pause, dots,
  // edge clicks, and touch.
  const slides = getFeaturedEntries(8)
  const browseRecs = slides.slice(0, 5)

  return (
    <StickySearchShell
      slides={slides}
    >
      {/* ===== WHO'S READING THIS ===== */}
      <WhosReading recommendations={browseRecs} />

      {/* ===== BROWSE BY CATEGORY ===== */}
      <BrowseByCategory />

      {/* ===== ABOUT THE GUIDE — quiet meta footer ===== */}
      <AboutTheGuide />
    </StickySearchShell>
  )
}

/**
 * AboutTheGuide
 *
 * A small, calm footer band that closes the home page. Three meta
 * links — How it works, The tier system, Raise your hand — set in
 * the same smallcaps vocabulary as the rest of the chrome, plus the
 * standing one-line description we use on inner pages. The home
 * doesn't render <Layout/>, so without this rail a first-time visitor
 * on / can't find these pages.
 */
function AboutTheGuide() {
  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-16 mt-4 border-t border-sandstone/40">
      <p className="smallcaps text-center mb-3">About the guide</p>
      <p className="smallcaps text-center !tracking-[0.18em] flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link to="/how-it-works" className="hover:text-twilight transition-colors">
          How it works
        </Link>
        <span aria-hidden className="text-twilight-soft/45">·</span>
        <Link to="/tier-system" className="hover:text-twilight transition-colors">
          The tier system
        </Link>
        <span aria-hidden className="text-twilight-soft/45">·</span>
        <Link to="/raise-hand" className="hover:text-twilight transition-colors">
          Raise your hand
        </Link>
      </p>
      <p className="font-serif italic text-sm text-ink-soft text-center leading-relaxed mt-5 max-w-xl mx-auto">
        A travel guide to the great work being done in Utah.
        <br />
        Built on an LLM-maintained wiki that compounds knowledge over time.
      </p>
    </section>
  )
}

const CATEGORY_ORDER = [
  'People',
  'Resources',
  'Medicine and Biology',
  'Industry and Infrastructure',
  'Defense and Security',
  'Environment and Earth',
  'Computing and Software',
  'Energy',
  'Aerospace and Propulsion',
  'Culture and Arts',
]

const CATEGORY_DECKS: Record<string, string> = {
  People: 'Operators, researchers, advisors, and hand-raises entering the map.',
  Resources: 'Programs, funds, workspaces, training, and founder support paths.',
  'Medicine and Biology': 'Biotech, devices, health, and the science of living systems.',
  'Industry and Infrastructure': 'Rail, roads, factories, materials, and useful heavy things.',
  'Defense and Security': 'Hard problems in autonomy, sensing, safety, and national defense.',
  'Environment and Earth': 'Geology, climate, water, land, and the systems under our feet.',
  'Computing and Software': 'Software, AI, data, tools, and the institutions around them.',
  Energy: 'Geothermal, batteries, nuclear, and the machinery of power.',
  'Aerospace and Propulsion': 'Spacecraft, rockets, satellites, engines, and high-altitude ambition.',
  'Culture and Arts': 'Institutions, works, and places that make Utah stranger and richer.',
}

function BrowseByCategory() {
  const categories = getCategoryGroups()
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-18 mb-16">
      <header className="max-w-3xl mx-auto px-1 sm:px-2 mb-6 sm:mb-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="smallcaps">Browse the guide</p>
          <h2
            className="font-display text-twilight leading-none mt-2"
            style={{ fontSize: 'clamp(2rem, 9vw, 2.8rem)' }}
          >
            Choose a category
          </h2>
        </div>
        <Link
          to="/directory"
          className="smallcaps text-twilight hover:text-orange transition-colors sm:text-right"
        >
          Full directory →
        </Link>
      </header>

      <div className="bg-paper shadow-[0_1px_0_rgba(42,31,24,0.06),0_24px_60px_-30px_rgba(42,31,24,0.25)] border border-sandstone/50 rounded-md overflow-hidden">
        <div className="border-b border-sandstone/60 bg-pale-sky/30 px-4 sm:px-5 py-3 flex items-baseline justify-between gap-4">
          <div>
            <p className="smallcaps">Field index</p>
            <p className="font-serif italic text-ink-soft text-sm leading-snug mt-1">
              Open a category to see its entries. Use the header search for the guide.
            </p>
          </div>
          <p className="smallcaps !text-[0.6rem] !tracking-[0.2em] text-twilight-soft/75">
            {getAllEntries().length} entries
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          {categories.map((category, i) => (
            <CategoryPanel
              key={category.name}
              category={category}
              index={i}
              open={openCategory === category.name}
              onToggle={() =>
                setOpenCategory((current) =>
                  current === category.name ? null : category.name,
                )
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryPanel({
  category,
  index,
  open,
  onToggle,
}: {
  category: CategoryGroup
  index: number
  open: boolean
  onToggle: () => void
}) {
  const feature = category.entries[0]
  const visibleEntries = open ? category.entries : category.entries.slice(0, 3)

  return (
    <section className="border-b md:odd:border-r border-sandstone/45 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
      <div className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] gap-4 p-4 sm:p-5">
        <div className="aspect-[3/4] bg-sandstone/25 overflow-hidden rounded-sm border border-sandstone/45">
          <img
            src={categoryImageFor(category.name, feature, 420, 560)}
            srcSet={categoryImageSrcSetFor(category.name, feature, [180, 280, 420, 560], 3 / 4)}
            sizes="(min-width: 640px) 7rem, 5.5rem"
            alt=""
            loading="lazy"
            decoding="async"
            style={{ objectPosition: heroObjectPositionFor(feature) }}
            className="w-full h-full object-cover editorial-img"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="smallcaps !text-[0.6rem] !tracking-[0.2em]">
              {String(index + 1).padStart(2, '0')} · {category.count} entries
            </p>
            <TierGlyph tier={feature.tier} className="text-base shrink-0" />
          </div>
          <h3 className="font-display text-ink text-2xl leading-tight mt-1">
            {category.name}
          </h3>
          <p className="font-serif italic text-ink-soft text-sm leading-snug mt-2">
            {CATEGORY_DECKS[category.name] ?? 'A trailhead into this part of the wiki.'}
          </p>

          <ul className="mt-4 divide-y divide-sandstone/30">
            {visibleEntries.map((entry) => (
              <li key={`${entry.source}/${entry.slug}`} className="py-2 first:pt-0 last:pb-0">
                <Link
                  to={`/entry/${entry.source}/${entry.slug}`}
                  className="group flex items-baseline gap-3"
                >
                  <p className="font-display text-ink leading-tight group-hover:text-twilight transition-colors flex-1 min-w-0 truncate">
                    {entry.title}
                  </p>
                  <TierGlyph tier={entry.tier} className="text-sm shrink-0" />
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="smallcaps inline-block mt-4 hover:text-orange transition-colors"
          >
            {open ? 'Show fewer ↑' : `Show all ${category.count} entries ↓`}
          </button>
        </div>
      </div>
    </section>
  )
}

interface CategoryGroup {
  name: string
  count: number
  entries: Entry[]
}

function getCategoryGroups(): CategoryGroup[] {
  const all = getAllEntries()
  const byDomain = new Map<string, Entry[]>()

  for (const entry of all) {
    const domain =
      entry.source === 'people'
        ? 'People'
        : entry.source === 'resources'
          ? 'Resources'
          : entry.domain
    const existing = byDomain.get(domain) ?? []
    existing.push(entry)
    byDomain.set(domain, existing)
  }

  return CATEGORY_ORDER.map((name) => {
    const entries = [...(byDomain.get(name) ?? [])].sort(compareEntriesForCategory)
    return {
      name,
      count: entries.length,
      entries,
    }
  }).filter((category) => category.entries.length > 0)
}

function compareEntriesForCategory(a: Entry, b: Entry): number {
  const tierRank: Record<Entry['tier'], number> = {
    S: 0,
    A: 1,
    B: 2,
    'P-A': 3,
    'P-B': 4,
    'P-C': 5,
    C: 6,
    D: 7,
    F: 8,
    unknown: 9,
  }
  const tierDelta = tierRank[a.tier] - tierRank[b.tier]
  if (tierDelta !== 0) return tierDelta
  if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1
  return a.title.localeCompare(b.title)
}

/* ----------------------------------------------------------------------
 * StickySearchShell
 *
 * The shell wraps a child page with:
 *   - A thin sticky masthead at the top (GREAT WORK + search input).
 *     Glass on photo at rest, paper-cream once scrolled.
 *   - A photo carousel cover that auto-rotates through N slides.
 *
 * Click the bar (or ⌘K) opens the polished fullscreen panel from the
 * Search iteration. Hovering the cover (or opening the panel) pauses
 * rotation.
 * ---------------------------------------------------------------------- */

function StickySearchShell({
  children,
  slides,
}: {
  children: React.ReactNode
  slides: Entry[]
}) {
  const navigate = useNavigate()
  const { markNextNavAs } = usePageTransition()
  const { isOpen: searchOpen, openSearch } = useSearchOverlay()
  const rootRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [coverHover, setCoverHover] = useState(false)
  const [hoverSide, setHoverSide] = useState<
    'left' | 'right' | 'center' | null
  >(null)

  /* Refs that the imperative drag pipeline reads. activeSlide is mirrored
   * because the native touch listeners are attached once and need to read
   * the *current* slide without re-binding on every change. */
  const sectionRef = useRef<HTMLElement | null>(null)
  const stripRef = useRef<HTMLDivElement | null>(null)
  const activeSlideRef = useRef(activeSlide)
  const autoRotateTimerRef = useRef<number | null>(null)
  const justDraggedRef = useRef(false)
  const touchStateRef = useRef<{
    startX: number
    startY: number
    startT: number
    axisLocked: 'horizontal' | 'vertical' | null
    dragging: boolean
  } | null>(null)

  useEffect(() => {
    activeSlideRef.current = activeSlide
  }, [activeSlide])

  /* --------- carousel navigation helpers --------- */
  function goNext() {
    setActiveSlide((i) => (i + 1) % slides.length)
  }
  function goPrev() {
    setActiveSlide((i) => (i - 1 + slides.length) % slides.length)
  }

  /* --------- detect scroll on whatever ancestor scrolls ---------
   * Threshold is tuned so the slim sticky chrome only fades in once
   * the cover masthead band has mostly scrolled out of view. The
   * band is roughly 170px tall at rest; we trigger at 120 so the two
   * surfaces crossfade for ~50px rather than both shouting. */
  useEffect(() => {
    const target = findScrollContainer(rootRef.current)
    function check() {
      const top =
        target instanceof Window ? window.scrollY : target.scrollTop
      setScrolled(top > 120)
    }
    check()
    const el: EventTarget = target instanceof Window ? window : target
    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      el.removeEventListener('scroll', check as EventListener)
      window.removeEventListener('resize', check)
    }
  }, [])

  /* --------- carousel auto-rotation (paused on hover or open) ---------
   * We hold the timer in a ref so the touchstart handler can cancel it
   * imperatively when a drag begins (otherwise the auto-advance could
   * fire mid-drag and clobber the imperatively-set transform). */
  const carouselPaused = searchOpen || coverHover
  useEffect(() => {
    if (carouselPaused || slides.length < 2) return
    autoRotateTimerRef.current = window.setTimeout(() => {
      setActiveSlide((i) => (i + 1) % slides.length)
    }, 7000)
    return () => {
      if (autoRotateTimerRef.current !== null) {
        window.clearTimeout(autoRotateTimerRef.current)
        autoRotateTimerRef.current = null
      }
    }
  }, [activeSlide, carouselPaused, slides.length])

  /* --------- cover interaction handlers (mouse: click zones, hover) ---------
   * The cover has a single horizontal "interaction band" set well
   * below the masthead, around the chevron overlays. Inside the
   * band:
   *   - left third (x < 35%):  go to previous slide
   *   - right third (x > 65%): go to next slide
   *   - middle third:          no-op; the image itself is not a link
   * Outside the band (the photo above the band), bare-photo clicks
   * are also no-ops. The text Link below is the only way to open the
   * active entry from the cover. Confining
   * left/right paging to a band keeps the chevrons from feeling
   * like they belong to the masthead, and avoids the situation
   * where someone reaches up to click "Great Work" and accidentally
   * pages the carousel.
   *
   * Touch is handled via native listeners further down so we can
   * call preventDefault() on touchmove to suppress vertical page
   * scroll while a horizontal drag is in flight; touch swipes work
   * across the whole cover regardless of band. */
  const NAV_BAND_TOP = 0.5
  const NAV_BAND_BOTTOM = 0.78

  function onCoverMouseMove(e: ReactMouseEvent<HTMLElement>) {
    // During a touch drag, browsers may also emit synthetic mousemove —
    // ignore so we don't trigger React re-renders that clobber the
    // imperative transform we're driving on the strip.
    if (touchStateRef.current?.dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const w = rect.width
    const h = rect.height
    const inBand = y >= h * NAV_BAND_TOP && y <= h * NAV_BAND_BOTTOM
    if (!inBand) {
      setHoverSide('center')
      return
    }
    if (x < w * 0.35) setHoverSide('left')
    else if (x > w * 0.65) setHoverSide('right')
    else setHoverSide('center')
  }
  function onCoverMouseLeave() {
    setCoverHover(false)
    setHoverSide(null)
  }
  function onCoverClick(e: ReactMouseEvent<HTMLElement>) {
    // Browsers fire a phantom click ~300ms after touchend on touch devices.
    // Suppress it so a swipe doesn't also trigger the click handler.
    if (justDraggedRef.current) return
    // Defer to anything genuinely interactive: the entry Link, the dots,
    // the chevron buttons. Zone clicks only fire on bare-photo clicks.
    const target = e.target as HTMLElement
    if (target.closest('a, button')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const w = rect.width
    const h = rect.height
    const inBand = y >= h * NAV_BAND_TOP && y <= h * NAV_BAND_BOTTOM
    if (inBand && x < w * 0.35) {
      goPrev()
      return
    }
    if (inBand && x > w * 0.65) {
      goNext()
      return
    }
  }

  /* --------- native touch listeners — live finger tracking ---------
   * React's synthetic touchmove is registered as passive in modern React,
   * which means preventDefault() is a no-op there. We need it non-passive
   * so a horizontal drag doesn't also scroll the page vertically.
   *
   * Strategy:
   *   - touchmove: imperatively set strip.style.transform in pixels with
   *     transition: 'none', so the cover follows the finger 1:1.
   *   - touchend: re-enable the transition, force a reflow, then set
   *     transform to the snap-target's percentage. The forced reflow is
   *     what makes the new transition rule apply *before* the transform
   *     value changes — without it, the browser collapses both style
   *     changes into one frame and the transform jumps without animating.
   *   - At the edges (slide 0 / slide N-1), apply 0.35× rubber-band
   *     resistance to the drag delta so the user feels the wall.
   */
  useEffect(() => {
    const sec = sectionRef.current
    if (!sec) return

    const SNAP_MS = 480
    const SNAP_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
    const SLIDE_PCT = 100 / slides.length

    function getSlideWidth(): number {
      return sec ? sec.clientWidth : window.innerWidth
    }

    function applyDragTransform(deltaPx: number) {
      const strip = stripRef.current
      if (!strip) return
      const slideWidth = getSlideWidth()
      const totalPx = -activeSlideRef.current * slideWidth + deltaPx
      strip.style.transition = 'none'
      strip.style.transform = `translate3d(${totalPx}px, 0, 0)`
    }

    function settleTo(slideIdx: number) {
      const strip = stripRef.current
      if (!strip) return
      // Step 1: re-enable the transition rule.
      strip.style.transition = `transform ${SNAP_MS}ms ${SNAP_EASING}`
      // Step 2: force a reflow so the browser commits the new transition
      // rule before the transform changes. Reading offsetHeight is the
      // canonical way to do this without breaking React.
      void strip.offsetHeight
      // Step 3: set transform to the snap target. We use the same %
      // expression React would render so the next React re-render is a
      // no-op for the visual.
      strip.style.transform = `translate3d(${-slideIdx * SLIDE_PCT}%, 0, 0)`
    }

    function onStart(e: TouchEvent) {
      if (e.touches.length !== 1) return
      const t = e.touches[0]
      touchStateRef.current = {
        startX: t.clientX,
        startY: t.clientY,
        startT: Date.now(),
        axisLocked: null,
        dragging: false,
      }
      // Cancel any in-flight auto-advance so it can't fire mid-drag.
      if (autoRotateTimerRef.current !== null) {
        window.clearTimeout(autoRotateTimerRef.current)
        autoRotateTimerRef.current = null
      }
    }

    function onMove(e: TouchEvent) {
      const ts = touchStateRef.current
      if (!ts) return
      const t = e.touches[0]
      const dx = t.clientX - ts.startX
      const dy = t.clientY - ts.startY

      // Lock axis on first significant move so straight-down scrolls aren't
      // hijacked. 8px deadzone tuned for typical finger tremor.
      if (!ts.axisLocked) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        ts.axisLocked =
          Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical'
        if (ts.axisLocked === 'horizontal') {
          ts.dragging = true
        }
      }

      if (ts.axisLocked !== 'horizontal') return
      // Suppress vertical scroll while a horizontal drag is in flight.
      e.preventDefault()

      // Rubber-band edge resistance: at slide 0 dragging right, or at the
      // last slide dragging left, dampen the delta so the user feels a wall.
      let delta = dx
      const active = activeSlideRef.current
      if (active === 0 && delta > 0) delta = delta * 0.35
      if (active === slides.length - 1 && delta < 0) delta = delta * 0.35

      applyDragTransform(delta)
    }

    function onEnd(e: TouchEvent) {
      const ts = touchStateRef.current
      touchStateRef.current = null
      if (!ts || !ts.dragging) return

      const t = e.changedTouches[0]
      const dx = t.clientX - ts.startX
      const dt = Math.max(Date.now() - ts.startT, 1)
      const velocity = Math.abs(dx) / dt // px / ms

      // Distance threshold: > 20% of slide width.
      // Velocity threshold: a "flick" — release moving > 0.5 px/ms.
      // Either qualifies as a slide change. Edges still respect the wall.
      const slideWidth = getSlideWidth()
      const distanceThreshold = slideWidth * 0.2
      const velocityThreshold = 0.5

      const active = activeSlideRef.current
      let next = active
      if (Math.abs(dx) > distanceThreshold || velocity > velocityThreshold) {
        if (dx < 0 && active < slides.length - 1) next = active + 1
        else if (dx > 0 && active > 0) next = active - 1
      }

      settleTo(next)

      if (next !== active) {
        setActiveSlide(next)
      }

      // Suppress the synthetic click that follows touchend on touch devices
      // (~300ms window). Otherwise a swipe also triggers an edge click.
      justDraggedRef.current = true
      window.setTimeout(() => {
        justDraggedRef.current = false
      }, 320)
    }

    function onCancel() {
      const ts = touchStateRef.current
      touchStateRef.current = null
      if (!ts || !ts.dragging) return
      // Snap back to the current slide — touch was interrupted.
      settleTo(activeSlideRef.current)
    }

    sec.addEventListener('touchstart', onStart, { passive: false })
    sec.addEventListener('touchmove', onMove, { passive: false })
    sec.addEventListener('touchend', onEnd)
    sec.addEventListener('touchcancel', onCancel)
    return () => {
      sec.removeEventListener('touchstart', onStart)
      sec.removeEventListener('touchmove', onMove)
      sec.removeEventListener('touchend', onEnd)
      sec.removeEventListener('touchcancel', onCancel)
    }
  }, [slides.length])

  return (
    <div ref={rootRef} className="min-h-screen bg-paper text-ink">
      {/* ===== Slim sticky chrome =====
          Hidden at rest — the cover masthead band carries the
          above-the-fold identity. Fades in once the cover masthead
          has scrolled out of view (~120px), with paper-cream
          backdrop. */}
      <header
        className={`sticky top-0 z-30 transition-opacity duration-300 ${
          scrolled
            ? 'bg-paper/96 backdrop-blur-md border-b border-sandstone/55 opacity-100'
            : 'bg-transparent border-b border-transparent opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="shrink-0 text-twilight"
            aria-label="Great Work — home"
          >
            <p
              className="font-display uppercase leading-none text-base sm:text-lg"
              style={{ letterSpacing: '0.22em' }}
            >
              Great Work
            </p>
          </Link>

          <button
            type="button"
            onClick={() => openSearch()}
            onKeyDown={(e: ReactKeyboardEvent<HTMLButtonElement>) => {
              const isPrintable =
                e.key.length === 1 && !e.metaKey && !e.ctrlKey
              if (isPrintable || e.key === '/') {
                e.preventDefault()
                openSearch(isPrintable ? e.key : '')
              }
            }}
            aria-label="Open search"
            className="group flex-1 min-w-0 flex items-center gap-2.5 rounded-full px-3.5 py-1.5 italic font-serif text-sm sm:text-base bg-pale-sky/50 border border-twilight/15 hover:border-twilight/45 focus:outline-none focus:border-twilight/45 focus:ring-2 focus:ring-twilight/20 transition-colors"
          >
            <SearchIcon className="w-4 h-4 shrink-0 text-twilight-soft" />
            <span className="flex-1 min-w-0 text-left text-twilight/45 truncate">
              Ask the guide anything
            </span>
            <kbd className="smallcaps !text-[0.55rem] !tracking-[0.18em] hidden sm:inline text-twilight-soft/55">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      {/* ===== Carousel cover =====
          The cover bleeds under the slim sticky chrome so the
          masthead band sits cleanly on the photograph, not on a
          paper gutter above it.

          Click & hover navigation is concentrated in a horizontal
          band below the masthead (see NAV_BAND_TOP/BOTTOM); the
          chevron overlays live in that same band so the visible
          affordance and the live click target stay aligned. Bare
          photo clicks in the center or outside the band are inert;
          the cover text is the entry link.

          Touch is handled via native listeners attached in a
          useEffect (so we can call preventDefault on a non-passive
          touchmove and drive the strip's transform imperatively at
          60Hz without React re-renders). React only owns the
          resting/snap state. */}
      <section
        ref={sectionRef}
        onMouseEnter={() => setCoverHover(true)}
        onMouseLeave={onCoverMouseLeave}
        onMouseMove={onCoverMouseMove}
        onClick={onCoverClick}
        className="relative isolate text-paper -mt-[60px] sm:-mt-[64px] overflow-hidden select-none touch-pan-y"
        style={{
          /* 86vh — *not* 96vh — so the top of "Browse by category" peeks
             above the fold. The peek IS the scroll cue, the same way a
             magazine's cover sits on the page above the contents page —
             readers' eyes get the implication without a chrome chevron
             yelling "scroll!" Capped at 820px so the cover doesn't grow
             beyond its compositional sweet spot on tall monitors. */
          minHeight: 'min(820px, 86vh)',
          cursor: hoverSide === 'left' || hoverSide === 'right' ? 'pointer' : 'default',
        }}
        aria-roledescription="carousel"
        aria-label="Featured entries"
      >
        {/* Horizontal strip — all slides side-by-side, the strip itself
            translates left/right to bring the active slide into view.
            During a touch drag, the touch pipeline overwrites
            transform/transition imperatively; React's render here is the
            resting baseline. */}
        <div
          ref={stripRef}
          className="absolute inset-0 flex h-full"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translate3d(-${activeSlide * (100 / slides.length)}%, 0, 0)`,
            transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {slides.map((slide, i) => {
            const caption = heroCaptionFor(slide)
            return (
              <div
                key={`${slide.source}/${slide.slug}`}
                className="relative shrink-0 h-full"
                style={{ width: `${100 / slides.length}%` }}
                aria-hidden={i !== activeSlide}
              >
                <img
                  src={heroImageFor(slide, i === 0 ? 1600 : 1200, i === 0 ? 2133 : 1600)}
                  srcSet={heroImageSrcSetFor(slide, [800, 1200, 1600], 3 / 4)}
                  sizes="100vw"
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  style={{ objectPosition: heroObjectPositionFor(slide) }}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(20,14,10,0.50) 0%, rgba(20,14,10,0.18) 30%, rgba(20,14,10,0.55) 78%, rgba(20,14,10,0.95) 100%)',
                  }}
                />
                <div
                  className="relative max-w-3xl mx-auto px-5 sm:px-8 flex flex-col h-full"
                  style={{ paddingTop: '11rem' }}
                >
                  <div className="mt-auto pb-24 sm:pb-28">
                    <Link
                      to={`/entry/${slide.source}/${slide.slug}`}
                      className={`inline-block ${
                        hoverSide === 'left' || hoverSide === 'right' ? '' : 'group'
                      }`}
                      tabIndex={i === activeSlide ? 0 : -1}
                      onClick={(e) => {
                        if (hoverSide === 'left') {
                          e.preventDefault()
                          goPrev()
                          return
                        }
                        if (hoverSide === 'right') {
                          e.preventDefault()
                          goNext()
                          return
                        }
                        // Modifier-clicks (cmd/ctrl/shift, middle-click) keep
                        // their default behaviour — open in new tab, etc. —
                        // so we only intercept a plain primary-button click.
                        if (
                          e.metaKey ||
                          e.ctrlKey ||
                          e.shiftKey ||
                          e.altKey ||
                          e.button !== 0
                        ) {
                          return
                        }
                        e.preventDefault()
                        markNextNavAs('next')
                        navigate(`/entry/${slide.source}/${slide.slug}`)
                      }}
                    >
                      <h1
                        className="font-display leading-[1] text-paper group-hover:text-sky transition-colors"
                        style={{ fontSize: 'clamp(1.4rem, 4.6vw, 2.1rem)' }}
                      >
                        {slide.title}.
                      </h1>
                      <p
                        className="font-display italic text-paper/85 leading-snug mt-3 max-w-2xl group-hover:text-sky/85 transition-colors"
                        style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)' }}
                      >
                        “{getCoverQuote(slide)}”
                      </p>
                      <p className="smallcaps !text-paper/70 group-hover:!text-sky/80 mt-5 flex items-center gap-2 transition-colors">
                        <TierGlyph
                          tier={slide.tier}
                          className="text-base !text-paper/85 group-hover:!text-sky transition-colors"
                        />
                        {/* Text + arrow CTA. The arrow is an SVG (not a
                            unicode glyph) because both `→` in Inter and
                            its Caslon fallback sit at the bottom of
                            their em-box, which next to all-caps smallcaps
                            text reads like an underscore. SVG gives us
                            an arrow drawn at the optical center of its
                            box, sized to sit between cap-height and
                            x-height of the surrounding "READ THE ENTRY". */}
                        <span className="inline-flex items-center gap-1.5">
                          <span>Read the entry</span>
                          <svg
                            aria-hidden
                            viewBox="0 0 18 12"
                            className="w-[1.05rem] h-[0.7rem] shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 6h15M11 1l5 5-5 5" />
                          </svg>
                        </span>
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Photo credit — required for the CC BY / CC BY-SA hero
                    photographs carried by `wiki/ventures/`. Tucked
                    behind a tiny "i" badge so the attribution is
                    available without competing with the title or
                    pull-quote. Hover (desktop) or tap (touch)
                    reveals it. */}
                {caption && (
                  <PhotoCredit
                    caption={caption}
                    active={i === activeSlide}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* ===== Cover masthead band =====
            The real magazine masthead. Lives on the photograph
            (glass treatment) at the top of the cover, generous and
            centered. Scrolls away with the cover; the slim sticky
            chrome takes over once it's gone.

            All non-interactive parts of the band are
            pointer-events-none so the section's hover & click
            handlers (carousel edge-nav, hover chevrons) keep
            working on the strip beneath. The wordmark Link and the
            search button explicitly re-enable pointer-events. */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-7 sm:pt-9 pb-4 flex flex-col items-center gap-5 text-paper pointer-events-none">
            <Link
              to="/"
              className="block text-center pointer-events-auto"
              aria-label="Great Work — home"
            >
              <p
                className="font-display uppercase leading-[0.95]"
                style={{
                  fontSize: 'clamp(2rem, 10vw, 4.5rem)',
                  letterSpacing: '0.24em',
                }}
              >
                Great Work
              </p>
              <p
                className="font-display text-paper/85 mt-4 leading-snug"
                style={{ fontSize: 'clamp(0.85rem, 2.4vw, 1.05rem)' }}
              >
                A travel guide to Utah’s great work
                <span className="block">
                  — and the people behind it
                </span>
              </p>
            </Link>

            <button
              type="button"
              onClick={() => openSearch()}
              onKeyDown={(e: ReactKeyboardEvent<HTMLButtonElement>) => {
                const isPrintable =
                  e.key.length === 1 && !e.metaKey && !e.ctrlKey
                if (isPrintable || e.key === '/') {
                  e.preventDefault()
                  openSearch(isPrintable ? e.key : '')
                }
              }}
              aria-label="Open search"
              className="cover-masthead-search pointer-events-auto group w-full max-w-md flex items-center gap-2.5 rounded-full bg-paper/15 backdrop-blur-md border border-paper/30 hover:border-paper focus:outline-none focus:border-paper focus:ring-2 focus:ring-paper/25 px-3.5 py-1.5 italic font-serif text-sm sm:text-base transition-colors"
            >
              <SearchIcon className="w-4 h-4 shrink-0 text-paper/70" />
              <span className="flex-1 min-w-0 text-left text-paper/70 truncate">
                Ask the guide anything
              </span>
              <kbd className="smallcaps !text-[0.55rem] !tracking-[0.18em] hidden sm:inline text-paper/55">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Hover chevrons — soft glass pills that fade in only on the
            side the cursor is on. Centered vertically in the
            interaction band (~64% of the cover) so they sit under
            the masthead and the action lives where the eye expects
            it. pointer-events-none so they don't eat the section's
            click handler. */}
        <span
          aria-hidden
          className="absolute left-3 sm:left-6 z-20 pointer-events-none w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-paper/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 ease-out"
          style={{
            top: '64%',
            opacity: hoverSide === 'left' ? 1 : 0,
            transform: `translateY(-50%) translateX(${hoverSide === 'left' ? '0' : '-6px'})`,
          }}
        >
          <span className="font-display text-paper text-2xl leading-none -mt-1">
            ‹
          </span>
        </span>
        <span
          aria-hidden
          className="absolute right-3 sm:right-6 z-20 pointer-events-none w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-paper/15 backdrop-blur-md flex items-center justify-center transition-all duration-200 ease-out"
          style={{
            top: '64%',
            opacity: hoverSide === 'right' ? 1 : 0,
            transform: `translateY(-50%) translateX(${hoverSide === 'right' ? '0' : '6px'})`,
          }}
        >
          <span className="font-display text-paper text-2xl leading-none -mt-1">
            ›
          </span>
        </span>

        {/* Dots — the ambient indicator that the photo is one of several. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
          style={{ bottom: '1.5rem' }}
          role="tablist"
          aria-label="Cover stories"
        >
          {slides.map((slide, i) => (
            <button
              key={`${slide.source}/${slide.slug}`}
              type="button"
              role="tab"
              aria-selected={i === activeSlide}
              aria-label={`Cover ${i + 1} of ${slides.length}: ${slide.title}`}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? 'w-6 bg-paper'
                  : 'w-1.5 bg-paper/35 hover:bg-paper/70'
              }`}
            />
          ))}
        </div>
      </section>

      {children}

      <style>{`
        @media (max-height: 680px) {
          .cover-masthead-search {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

/* ----------------------------------------------------------------------
 * PhotoCredit
 *
 * A bare italic-Caslon "i" — no circle, no chrome — sitting in the
 * bottom-right of the cover. Reads like a magazine footnote marker
 * rather than a UI button, which is the same editorial register as
 * the masthead and pull-quote above it.
 *
 * The full attribution (photographer + license URL etc.) is tucked
 * into a small glass panel that fades in:
 *   - on pointer hover (desktop)
 *   - on focus (keyboard)
 *   - on tap (touch — clicks toggle, outside-click closes)
 * Screen readers always get the full credit via aria-label on the
 * badge button, regardless of visual state.
 *
 * The panel rises *upward* from the badge, anchored to the badge's
 * right edge. An earlier version popped out to the left and could be
 * clipped by the slide / cover image on narrower viewports; opening
 * upward keeps the whole caption inside the image at every size.
 * ---------------------------------------------------------------------- */

function PhotoCredit({
  caption,
  active,
}: {
  caption: string
  active: boolean
}) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Outside-click closes the panel. Only attach while open so we
  // don't pay for a global listener on every cover render.
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const visible = active && open

  return (
    <div
      ref={wrapperRef}
      className="absolute right-3 sm:right-6 z-10 group"
      style={{ bottom: '3.25rem' }}
    >
      <span
        aria-hidden
        className={`absolute right-0 bottom-full mb-2 max-w-[60vw] sm:max-w-[28rem] whitespace-normal text-right font-serif italic text-paper/90 leading-snug rounded-md bg-ink/55 backdrop-blur-md px-2.5 py-1 transition-opacity duration-200 pointer-events-none ${
          visible
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        }`}
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.02em',
        }}
      >
        {caption}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (!active) return
          setOpen((v) => !v)
        }}
        tabIndex={active ? 0 : -1}
        aria-label={`Photo credit: ${caption}`}
        aria-expanded={visible}
        className="flex items-center justify-center w-7 h-7 -m-1 font-display italic text-paper/65 hover:text-paper focus-visible:text-paper focus-visible:outline-none transition-colors leading-none"
        style={{
          fontSize: '1.05rem',
          textShadow: '0 1px 2px rgba(20, 14, 10, 0.55)',
        }}
      >
        i
      </button>
    </div>
  )
}

/* ----------------------------------------------------------------------
 * findScrollContainer
 *
 * Walks up the DOM looking for the nearest ancestor that actually
 * scrolls. Falls back to window. Lets the sticky bar work both in the
 * full-screen prototype view (window scrolls) and inside the showroom
 * preview (an inner div scrolls).
 * ---------------------------------------------------------------------- */

function findScrollContainer(el: HTMLElement | null): HTMLElement | Window {
  let p = el?.parentElement ?? null
  while (p) {
    const style = getComputedStyle(p)
    if (/(auto|scroll|overlay)/.test(style.overflowY)) return p
    p = p.parentElement
  }
  return window
}

/* ----------------------------------------------------------------------
 * Magnifying glass — inline SVG so we don't pull in an icon library.
 * ---------------------------------------------------------------------- */

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  )
}
