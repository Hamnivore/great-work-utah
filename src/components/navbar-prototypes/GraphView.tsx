import { useMemo, useRef, useState } from 'react'
import { BREADCRUMB, useDismissOnOutside } from './_shared'
import { EDGES, NODES, SEGMENT_FOCUS, neighborsOf, type GraphNode, type Tier } from './_graph'

const TIER_COLOR: Record<Tier, string> = {
  S: 'text-orange',
  A: 'text-orange',
  B: 'text-twilight',
  C: 'text-twilight-soft',
  D: 'text-twilight-soft',
  F: 'text-ink-soft',
}

const VIEW_W = 800
const VIEW_H = 360
const CENTER_X = VIEW_W / 2
const CENTER_Y = VIEW_H / 2
const RX = 290
const RY = 120

interface NodePosition {
  x: number
  y: number
  /** Angle from center, in radians. -π/2 = directly above center. */
  angle: number
}

function getPositions(centerId: string): Record<string, NodePosition> {
  const ns = neighborsOf(centerId)
  const positions: Record<string, NodePosition> = {
    [centerId]: { x: CENTER_X, y: CENTER_Y, angle: 0 },
  }
  ns.forEach((id, i) => {
    const angle = (i / ns.length) * Math.PI * 2 - Math.PI / 2
    positions[id] = {
      x: CENTER_X + Math.cos(angle) * RX,
      y: CENTER_Y + Math.sin(angle) * RY,
      angle,
    }
  })
  return positions
}

function visibleEdges(visible: Set<string>) {
  return EDGES.filter(([a, b]) => visible.has(a) && visible.has(b))
}

/**
 * VARIANT F — Graph view.
 *
 * Same Stripe-Press eyebrow as the others, but clicking a segment opens a
 * graph drawer instead of a list dropdown:
 *   1. Search bar at the top of the drawer (filters/highlights matching nodes).
 *   2. A radial graph of the segment’s neighborhood — center node + its direct
 *      connections, with the cross-edges between neighbors also drawn.
 *   3. An abstract panel beneath that updates with whatever node is currently
 *      focused. Clicking any sibling node smoothly re-centers the graph on it.
 *
 * The point: a navigable, browsable map that rewards wandering — closer in
 * spirit to the Atlas Obscura "see this thing? where? tell me more" feeling
 * than a list of siblings can be.
 */
export function GraphView() {
  const [open, setOpen] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string>(SEGMENT_FOCUS.entry)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismissOnOutside(wrapRef, () => setOpen(null), open !== null)

  function openSegment(key: string) {
    if (open === key) {
      setOpen(null)
      return
    }
    setOpen(key)
    if (SEGMENT_FOCUS[key]) setFocusId(SEGMENT_FOCUS[key])
    setQuery('')
  }

  const positions = useMemo(() => getPositions(focusId), [focusId])
  const visibleIds = useMemo(() => new Set(Object.keys(positions)), [positions])
  const edges = useMemo(() => visibleEdges(visibleIds), [visibleIds])
  const center = NODES[focusId]
  const q = query.trim().toLowerCase()
  const isMatch = (id: string) => !q || NODES[id]?.label.toLowerCase().includes(q)

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

      {open && center && (
        <div className="border-b border-sandstone/60 bg-pale-sky/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
            {/* Search bar */}
            <div className="mb-5 flex items-center gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this neighborhood…"
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

            {/* Graph */}
            <div
              className="relative w-full overflow-visible"
              style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
            >
              <svg
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                className="absolute inset-0 w-full h-full overflow-visible"
                aria-hidden="true"
              >
                {edges.map(([a, b]) => {
                  const pa = positions[a]
                  const pb = positions[b]
                  if (!pa || !pb) return null
                  const both = isMatch(a) && isMatch(b)
                  const touchesCenter = a === focusId || b === focusId
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={pa.x}
                      y1={pa.y}
                      x2={pb.x}
                      y2={pb.y}
                      stroke="var(--color-twilight)"
                      strokeWidth={touchesCenter ? 1 : 0.6}
                      opacity={both ? (touchesCenter ? 0.35 : 0.18) : 0.06}
                      style={{ transition: 'opacity 400ms ease' }}
                    />
                  )
                })}
              </svg>

              <div className="absolute inset-0">
                {Object.entries(positions).map(([id, pos]) => {
                  const node = NODES[id]
                  if (!node) return null
                  const isCenter = id === focusId
                  const matches = isMatch(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFocusId(id)}
                      title={node.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out outline-none"
                      style={{
                        left: `${(pos.x / VIEW_W) * 100}%`,
                        top: `${(pos.y / VIEW_H) * 100}%`,
                        opacity: matches ? 1 : 0.25,
                        zIndex: isCenter ? 2 : 1,
                      }}
                    >
                      <NodeChip node={node} angle={pos.angle} isCenter={isCenter} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Abstract panel */}
            <div className="mt-7 max-w-2xl mx-auto text-center">
              <p className="smallcaps mb-2">{center.context}</p>
              <h3 className="font-display text-3xl text-ink leading-tight">
                {center.label}
                {center.tier && (
                  <span className={`font-display ml-3 text-2xl ${TIER_COLOR[center.tier]}`}>
                    {center.tier}
                  </span>
                )}
              </h3>
              <p className="font-serif italic text-ink-soft text-base leading-snug mt-3">
                {center.abstract}
              </p>
              <p className="mt-4 smallcaps">
                <a href="#" className="hover:text-twilight">
                  {center.type === 'entry' ? 'Read the full entry →' : 'Browse the section →'}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface NodeChipProps {
  node: GraphNode
  angle: number
  isCenter: boolean
}

function NodeChip({ node, angle, isCenter }: NodeChipProps) {
  if (isCenter) {
    return (
      <div className="bg-paper border border-twilight/40 rounded-md px-4 py-2 shadow-[0_4px_24px_-12px_rgba(42,31,24,0.4)] flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-xl text-ink leading-none">{node.label}</span>
        {node.tier && (
          <span className={`font-display text-base leading-none ${TIER_COLOR[node.tier]}`}>
            {node.tier}
          </span>
        )}
      </div>
    )
  }

  // Place the label so it doesn't overlap the center: text grows away from
  // the center, dot sits next to the line connecting node to center.
  const cosA = Math.cos(angle)
  const isVertical = Math.abs(cosA) < 0.3
  // For nodes on the right side of the graph, label sits to the left of the dot.
  const layoutClass = isVertical
    ? 'flex flex-col items-center gap-1.5'
    : cosA > 0
      ? 'flex flex-row-reverse items-center gap-2'
      : 'flex flex-row items-center gap-2'

  return (
    <div className={`${layoutClass} group`}>
      <NodeDot node={node} />
      <span className="font-serif italic text-base text-twilight group-hover:text-orange transition-colors leading-tight whitespace-nowrap flex items-baseline gap-1.5">
        {node.label}
        {node.tier && (
          <span className={`font-display text-xs leading-none ${TIER_COLOR[node.tier]}`}>
            {node.tier}
          </span>
        )}
      </span>
    </div>
  )
}

/** Per-type marker. Shape suggests kind — entry / person / place / concept / org / domain. */
function NodeDot({ node }: { node: GraphNode }) {
  switch (node.type) {
    case 'entry':
      return <span className="block w-2.5 h-2.5 rounded-full bg-twilight" />
    case 'domain':
    case 'source':
      return <span className="block w-2.5 h-2.5 rotate-45 bg-twilight" />
    case 'person':
      return <span className="block w-2.5 h-2.5 rounded-full bg-ink" />
    case 'place':
      return <span className="block w-2.5 h-2.5 rounded-full border border-twilight bg-paper" />
    case 'concept':
      return <span className="block w-2 h-2 rounded-full bg-twilight-soft" />
    case 'org':
      return <span className="block w-2.5 h-2.5 border border-twilight bg-paper" />
  }
}
