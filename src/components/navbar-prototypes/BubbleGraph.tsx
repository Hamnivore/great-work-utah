import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'
import { EDGES, NODES, SEGMENT_FOCUS, type GraphNode, type Tier } from './_graph'

const TIER_COLOR: Record<Tier, string> = {
  S: 'text-orange',
  A: 'text-orange',
  B: 'text-twilight',
  C: 'text-twilight-soft',
  D: 'text-twilight-soft',
  F: 'text-ink-soft',
}

/* ---------- World geometry ----------
 *
 * The graph lives in a generous "world" coordinate system that's much larger
 * than the visible viewport, so bubbles spread out with proper editorial
 * breathing room. The viewport is the on-screen window onto that world,
 * which the user pans and zooms.
 */
const WORLD_W = 1800
const WORLD_H = 1100

const VIEWPORT_ASPECT = '880 / 540'

const COMPACT_W = 150
const COMPACT_H = 36
const EXPANDED_W = 300
const EXPANDED_H = 180

const SIZE_LERP = 0.18

/* ---------- Pan / zoom ---------- */
const MIN_SCALE = 0.35
const MAX_SCALE = 2.4
const INITIAL_SCALE = 0.7
const WHEEL_ZOOM_RATE = 0.0015

/* ---------- Physics tuning, sized for the larger world ---------- */
const REPULSION = 0.22
const LONG_RANGE = 12000
const SPRING_K = 0.04
const EDGE_REST = 50
const GRAVITY = 0.005
const DAMPING = 0.84
const WALL_K = 0.45
const MAX_V = 60

interface BubbleState {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  width: number
  height: number
  targetWidth: number
  targetHeight: number
  expanded: boolean
}

interface ViewTransform {
  x: number
  y: number
  scale: number
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

/** Loose Fermat-spiral seed so the simulation has a sane starting layout. */
function seedPositions(focusId: string): Record<string, BubbleState> {
  const ids = Object.keys(NODES)
  const out: Record<string, BubbleState> = {}
  ids.forEach((id, i) => {
    const isFocus = id === focusId
    const t = i * 2.4 // golden-angle-ish
    const r = isFocus ? 0 : 120 + i * 22
    const w = isFocus ? EXPANDED_W : COMPACT_W
    const h = isFocus ? EXPANDED_H : COMPACT_H
    out[id] = {
      id,
      x: WORLD_W / 2 + Math.cos(t) * r,
      y: WORLD_H / 2 + Math.sin(t) * r,
      vx: 0,
      vy: 0,
      width: w,
      height: h,
      targetWidth: w,
      targetHeight: h,
      expanded: isFocus,
    }
  })
  return out
}

function physicsStep(
  states: Record<string, BubbleState>,
  edges: ReadonlyArray<readonly [string, string]>,
): void {
  const ids = Object.keys(states)
  const fx: Record<string, number> = {}
  const fy: Record<string, number> = {}

  for (const id of ids) {
    fx[id] = 0
    fy[id] = 0
    const n = states[id]
    n.width += (n.targetWidth - n.width) * SIZE_LERP
    n.height += (n.targetHeight - n.height) * SIZE_LERP
  }

  // Pairwise repulsion. Hard rectangle-aware push when overlapping; otherwise
  // a soft inverse-square push for spread.
  for (let i = 0; i < ids.length; i++) {
    const a = states[ids[i]]
    for (let j = i + 1; j < ids.length; j++) {
      const b = states[ids[j]]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const minDx = (a.width + b.width) / 2 + 14
      const minDy = (a.height + b.height) / 2 + 10
      const overlapX = minDx - Math.abs(dx)
      const overlapY = minDy - Math.abs(dy)
      if (overlapX > 0 && overlapY > 0) {
        if (overlapX < overlapY) {
          const dir = dx === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(dx)
          const f = overlapX * REPULSION
          fx[ids[i]] -= f * dir
          fx[ids[j]] += f * dir
        } else {
          const dir = dy === 0 ? (Math.random() < 0.5 ? -1 : 1) : Math.sign(dy)
          const f = overlapY * REPULSION
          fy[ids[i]] -= f * dir
          fy[ids[j]] += f * dir
        }
      } else {
        const dist2 = dx * dx + dy * dy + 1
        const dist = Math.sqrt(dist2)
        const f = LONG_RANGE / dist2
        fx[ids[i]] -= (dx / dist) * f
        fy[ids[i]] -= (dy / dist) * f
        fx[ids[j]] += (dx / dist) * f
        fy[ids[j]] += (dy / dist) * f
      }
    }
  }

  // Edge springs.
  for (const [aId, bId] of edges) {
    const a = states[aId]
    const b = states[bId]
    if (!a || !b) continue
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001
    const target = (a.width + b.width) / 2 + EDGE_REST
    const f = (dist - target) * SPRING_K
    fx[aId] += (dx / dist) * f
    fy[aId] += (dy / dist) * f
    fx[bId] -= (dx / dist) * f
    fy[bId] -= (dy / dist) * f
  }

  // Center gravity (very weak, just to keep the system from drifting).
  for (const id of ids) {
    const n = states[id]
    fx[id] += (WORLD_W / 2 - n.x) * GRAVITY
    fy[id] += (WORLD_H / 2 - n.y) * GRAVITY
  }

  // Soft world walls.
  for (const id of ids) {
    const n = states[id]
    const halfW = n.width / 2
    const halfH = n.height / 2
    const pad = 12
    if (n.x - halfW < pad) fx[id] += (pad - (n.x - halfW)) * WALL_K
    if (n.x + halfW > WORLD_W - pad) fx[id] -= (n.x + halfW - (WORLD_W - pad)) * WALL_K
    if (n.y - halfH < pad) fy[id] += (pad - (n.y - halfH)) * WALL_K
    if (n.y + halfH > WORLD_H - pad) fy[id] -= (n.y + halfH - (WORLD_H - pad)) * WALL_K
  }

  // Integrate.
  for (const id of ids) {
    const n = states[id]
    n.vx = (n.vx + fx[id]) * DAMPING
    n.vy = (n.vy + fy[id]) * DAMPING
    const v2 = n.vx * n.vx + n.vy * n.vy
    if (v2 > MAX_V * MAX_V) {
      const v = Math.sqrt(v2)
      n.vx = (n.vx / v) * MAX_V
      n.vy = (n.vy / v) * MAX_V
    }
    n.x += n.vx
    n.y += n.vy
  }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

/**
 * VARIANT G — Bubble graph (force-directed, pannable / zoomable map).
 *
 * Same Stripe-Press eyebrow bar; clicking a segment opens the wiki as a
 * spread-out map. All entities live in a world ~2× the visible viewport;
 * pinch / wheel zooms, drag pans. Bubbles still expand inline on click and
 * collapse on a second click; the simulation keeps re-organizing the layout
 * underneath so nothing ever ends up hidden behind anything else.
 */
export function BubbleGraph() {
  const [open, setOpen] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string>(SEGMENT_FOCUS.entry)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  const viewportRef = useRef<HTMLDivElement>(null)
  const statesRef = useRef<Record<string, BubbleState>>({})
  const transformRef = useRef<ViewTransform>({ x: 0, y: 0, scale: INITIAL_SCALE })
  const [, forceRender] = useState(0)

  // Pointer tracking for pan + pinch (multi-touch).
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const lastGestureRef = useRef<{ mid: { x: number; y: number }; dist: number } | null>(null)

  /** Place the world at INITIAL_SCALE, world center at viewport center. */
  function resetView() {
    const vp = viewportRef.current
    if (!vp) return
    const rect = vp.getBoundingClientRect()
    transformRef.current = {
      x: rect.width / 2 - (WORLD_W / 2) * INITIAL_SCALE,
      y: rect.height / 2 - (WORLD_H / 2) * INITIAL_SCALE,
      scale: INITIAL_SCALE,
    }
    forceRender((t) => t + 1)
  }

  // (Re)seed positions, reset view, and run the physics loop while drawer open.
  useEffect(() => {
    if (!open) return
    statesRef.current = seedPositions(focusId)
    resetView()

    let rafId = 0
    let stopped = false
    function loop() {
      if (stopped) return
      physicsStep(statesRef.current, EDGES)
      forceRender((t) => t + 1)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => {
      stopped = true
      cancelAnimationFrame(rafId)
    }
  }, [open, focusId])

  // Non-passive wheel listener (React's onWheel is passive in some setups,
  // which silently ignores preventDefault and lets the page scroll).
  useEffect(() => {
    if (!open) return
    const el = viewportRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const t = transformRef.current
      const factor = Math.exp(-e.deltaY * WHEEL_ZOOM_RATE)
      const newScale = clamp(t.scale * factor, MIN_SCALE, MAX_SCALE)
      const rect = el!.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const worldX = (cx - t.x) / t.scale
      const worldY = (cy - t.y) / t.scale
      transformRef.current = {
        x: cx - worldX * newScale,
        y: cy - worldY * newScale,
        scale: newScale,
      }
      forceRender((tt) => tt + 1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [open])

  function openSegment(key: string) {
    if (open === key) {
      setOpen(null)
      return
    }
    setOpen(key)
    if (SEGMENT_FOCUS[key]) setFocusId(SEGMENT_FOCUS[key])
    setQuery('')
  }

  function toggleBubble(id: string) {
    const states = statesRef.current
    const n = states[id]
    if (!n) return
    n.expanded = !n.expanded
    n.targetWidth = n.expanded ? EXPANDED_W : COMPACT_W
    n.targetHeight = n.expanded ? EXPANDED_H : COMPACT_H
    const kick = n.expanded ? 4 : 2
    for (const otherId of Object.keys(states)) {
      const o = states[otherId]
      if (o === n) continue
      const dx = o.x - n.x
      const dy = o.y - n.y
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      if (d < 240) {
        o.vx += (dx / d) * kick
        o.vy += (dy / d) * kick
      }
    }
  }

  /* ---------- Pan / pinch handlers ---------- */

  function recordGesture() {
    const pts = Array.from(pointersRef.current.values())
    if (pts.length === 0) lastGestureRef.current = null
    else if (pts.length === 1) lastGestureRef.current = { mid: pts[0], dist: 0 }
    else lastGestureRef.current = { mid: midpoint(pts[0], pts[1]), dist: dist(pts[0], pts[1]) }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture(e.pointerId)
    recordGesture()
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(e.pointerId)) return
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const last = lastGestureRef.current
    if (!last) return

    const t = transformRef.current
    const pts = Array.from(pointersRef.current.values())

    if (pts.length === 1) {
      // Single-pointer pan.
      const dx = pts[0].x - last.mid.x
      const dy = pts[0].y - last.mid.y
      transformRef.current = { ...t, x: t.x + dx, y: t.y + dy }
    } else if (pts.length >= 2) {
      // Pinch + pan: midpoint translation + distance-ratio zoom.
      const mid = midpoint(pts[0], pts[1])
      const d = dist(pts[0], pts[1])
      const dx = mid.x - last.mid.x
      const dy = mid.y - last.mid.y
      const factor = last.dist > 0 ? d / last.dist : 1
      const newScale = clamp(t.scale * factor, MIN_SCALE, MAX_SCALE)
      const rect = viewportRef.current!.getBoundingClientRect()
      const anchorX = mid.x - rect.left
      const anchorY = mid.y - rect.top
      // Pre-scale translation
      let nx = t.x + dx
      let ny = t.y + dy
      // Zoom anchored at midpoint
      const worldX = (anchorX - nx) / t.scale
      const worldY = (anchorY - ny) / t.scale
      nx = anchorX - worldX * newScale
      ny = anchorY - worldY * newScale
      transformRef.current = { x: nx, y: ny, scale: newScale }
    }

    recordGesture()
    forceRender((tt) => tt + 1)
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(e.pointerId)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    recordGesture()
  }

  const q = query.trim().toLowerCase()
  const isMatch = (id: string) => !q || NODES[id]?.label.toLowerCase().includes(q)
  const t = transformRef.current

  return (
    <div ref={wrapRef}>
      <div className="border-y border-sandstone/60 bg-paper">
        <nav
          className="max-w-3xl mx-auto px-5 sm:px-8 py-2.5 flex items-center justify-center gap-2 flex-wrap"
          aria-label="Breadcrumb"
        >
          {BREADCRUMB.map((segment, i) => {
            const isOpen = open === segment.key
            return (
              <span key={segment.key} className="flex items-center gap-2">
                {i > 0 && <span className="smallcaps !tracking-normal text-twilight-soft/60">·</span>}
                <button
                  type="button"
                  onClick={() => openSegment(segment.key)}
                  className={`smallcaps hover:text-twilight transition-colors flex items-center gap-1.5 ${
                    isOpen ? 'text-twilight' : ''
                  }`}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                >
                  {segment.label}
                  <span
                    aria-hidden
                    className={`text-[0.55rem] leading-none transition-transform ${
                      isOpen ? 'rotate-180 text-twilight' : 'text-twilight-soft/60'
                    }`}
                  >
                    ▾
                  </span>
                </button>
              </span>
            )
          })}
        </nav>
      </div>

      {open && (
        <div className="border-b border-sandstone/60 bg-pale-sky/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
            <div className="mb-4 flex items-center gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this map…"
                aria-label="Search the graph"
                className="flex-1 bg-paper border border-twilight/15 rounded-md px-4 py-2 italic text-twilight placeholder:text-twilight-soft placeholder:italic focus:outline-none focus:border-twilight focus:ring-2 focus:ring-twilight/25 transition-colors font-serif"
              />
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="smallcaps hover:text-twilight transition-colors shrink-0"
                aria-label="Close graph"
              >
                Close ✕
              </button>
            </div>

            <div
              ref={viewportRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative w-full bg-paper/60 rounded-lg border border-sandstone/40 overflow-hidden cursor-grab active:cursor-grabbing select-none"
              style={{ aspectRatio: VIEWPORT_ASPECT, touchAction: 'none' }}
            >
              {/* The "world" — physics positions are in this coordinate space.
                  We translate + scale this whole subtree to pan/zoom. */}
              <div
                className="absolute top-0 left-0"
                style={{
                  width: WORLD_W,
                  height: WORLD_H,
                  transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
                  transformOrigin: '0 0',
                  willChange: 'transform',
                }}
              >
                <svg
                  width={WORLD_W}
                  height={WORLD_H}
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                >
                  {EDGES.map(([a, b]) => {
                    const sa = statesRef.current[a]
                    const sb = statesRef.current[b]
                    if (!sa || !sb) return null
                    const both = isMatch(a) && isMatch(b)
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={sa.x}
                        y1={sa.y}
                        x2={sb.x}
                        y2={sb.y}
                        stroke="var(--color-twilight)"
                        strokeWidth={1.2 / t.scale}
                        opacity={both ? 0.22 : 0.06}
                      />
                    )
                  })}
                </svg>

                <div className="absolute inset-0">
                  {Object.values(statesRef.current).map((state) => {
                    const node = NODES[state.id]
                    if (!node) return null
                    return (
                      <Bubble
                        key={state.id}
                        state={state}
                        node={node}
                        matches={isMatch(state.id)}
                        onToggle={() => toggleBubble(state.id)}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Map controls — float above the world. */}
              <button
                type="button"
                onClick={resetView}
                className="absolute top-3 right-3 smallcaps bg-paper/85 backdrop-blur-sm border border-sandstone/60 rounded-sm px-3 py-1.5 hover:text-twilight hover:border-twilight/40 transition-colors"
                aria-label="Reset map view"
              >
                ↺ Reset view
              </button>

              <p className="absolute bottom-3 left-3 smallcaps !text-[0.6rem] !tracking-[0.2em] text-twilight-soft/70 bg-paper/70 backdrop-blur-sm rounded-sm px-2 py-1 pointer-events-none">
                Drag to pan · Scroll or pinch to zoom · {Math.round(t.scale * 100)}%
              </p>
            </div>

            <p className="mt-4 text-center font-serif italic text-ink-soft text-sm">
              Click any bubble to open or close it. Type above to highlight a name.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Bubble subcomponents ---------- */

interface BubbleProps {
  state: BubbleState
  node: GraphNode
  matches: boolean
  onToggle: () => void
}

function Bubble({ state, node, matches, onToggle }: BubbleProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      // Stop pointerdown from bubbling so the viewport's pan handler doesn't
      // fire when the user is starting a click on a bubble.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 bg-paper hover:border-twilight/60 transition-colors duration-200 cursor-pointer overflow-hidden ${
        state.expanded
          ? 'border border-twilight/40 shadow-[0_8px_30px_-12px_rgba(42,31,24,0.4)]'
          : 'border border-twilight/30 shadow-[0_2px_10px_-4px_rgba(42,31,24,0.2)]'
      }`}
      style={{
        left: `${state.x}px`,
        top: `${state.y}px`,
        width: `${state.width}px`,
        height: `${state.height}px`,
        opacity: matches ? 1 : 0.3,
        zIndex: state.expanded ? 2 : 1,
        borderRadius: state.expanded ? '20px' : '9999px',
        transition: 'border-radius 280ms ease, opacity 200ms ease',
      }}
      title={node.label}
    >
      {state.expanded ? <ExpandedContent node={node} /> : <CompactContent node={node} />}
    </div>
  )
}

function CompactContent({ node }: { node: GraphNode }) {
  return (
    <div className="h-full flex items-center justify-center gap-2 px-3 whitespace-nowrap">
      <NodeMarker node={node} />
      <span className="font-serif italic text-sm text-ink leading-none truncate">
        {node.label}
      </span>
      {node.tier && (
        <span className={`font-display text-xs leading-none ${TIER_COLOR[node.tier]}`}>
          {node.tier}
        </span>
      )}
    </div>
  )
}

function ExpandedContent({ node }: { node: GraphNode }) {
  return (
    <div className="h-full px-4 py-3 flex flex-col">
      <p className="smallcaps !text-[0.6rem] !tracking-[0.18em] mb-1">{node.context}</p>
      <h4 className="font-display text-lg text-ink leading-tight flex items-baseline gap-2">
        {node.label}
        {node.tier && (
          <span className={`font-display text-base ${TIER_COLOR[node.tier]}`}>{node.tier}</span>
        )}
      </h4>
      <p className="font-serif italic text-ink-soft text-xs leading-snug mt-1.5 flex-1 overflow-hidden">
        {node.abstract}
      </p>
    </div>
  )
}

function NodeMarker({ node }: { node: GraphNode }) {
  switch (node.type) {
    case 'entry':
      return <span className="block w-2 h-2 rounded-full bg-twilight shrink-0" />
    case 'domain':
    case 'source':
      return <span className="block w-2 h-2 rotate-45 bg-twilight shrink-0" />
    case 'person':
      return <span className="block w-2 h-2 rounded-full bg-ink shrink-0" />
    case 'place':
      return <span className="block w-2 h-2 rounded-full border border-twilight bg-paper shrink-0" />
    case 'concept':
      return <span className="block w-1.5 h-1.5 rounded-full bg-twilight-soft shrink-0" />
    case 'org':
      return <span className="block w-2 h-2 border border-twilight bg-paper shrink-0" />
  }
}
