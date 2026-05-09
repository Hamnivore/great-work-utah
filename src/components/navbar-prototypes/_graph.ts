/**
 * Graph data for the GraphView prototype.
 *
 * A small, hand-authored slice of the wiki, dense enough to show what the
 * "click a navbar segment, get the connected graph" interaction feels like.
 * Centered on Spiral Jetty and the Culture & Arts neighborhood, with enough
 * cross-domain connections (people, places, concepts, orgs) that re-centering
 * on any node still produces an interesting next view.
 */

export type NodeType =
  | 'source'
  | 'domain'
  | 'entry'
  | 'person'
  | 'place'
  | 'concept'
  | 'org'

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  tier?: Tier
  /** Tracked-smallcaps line shown above the title in the abstract panel. */
  context: string
  /** A 1–3 sentence editorial abstract, set in italic Caslon. */
  abstract: string
}

const RAW_NODES: GraphNode[] = [
  // Source + its domains
  {
    id: 'great-work',
    label: 'Great Work',
    type: 'source',
    context: 'Section · 251 entries',
    abstract:
      'A travel guide to the great work being done in Utah and the people who do it. Written like Atlas Obscura, ranked like Smash Bros, set in Caslon.',
  },
  {
    id: 'culture-arts',
    label: 'Culture & Arts',
    type: 'domain',
    context: 'Domain · 27 entries · Great Work',
    abstract:
      'Land art, festivals, museums, and the salt lake itself. The aesthetic life of the state — the part outsiders are surprised to find.',
  },
  {
    id: 'biotech',
    label: 'Biotech',
    type: 'domain',
    context: 'Domain · 14 entries · Great Work',
    abstract:
      'Drug discovery, diagnostics, and the long shadow of Recursion. The reason VCs fly to Salt Lake without telling anyone.',
  },
  {
    id: 'climate',
    label: 'Climate',
    type: 'domain',
    context: 'Domain · 9 entries · Great Work',
    abstract:
      'Energy, water, dust, smoke. The atmospheric conditions of building anything in this basin.',
  },
  {
    id: 'history',
    label: 'History',
    type: 'domain',
    context: 'Domain · 31 entries · Great Work',
    abstract: 'Old roads, old names, old reasons. Why Utah looks the way it looks.',
  },
  {
    id: 'people',
    label: 'People',
    type: 'domain',
    context: 'Domain · 56 entries · Great Work',
    abstract: 'The Utahns, past and present, who built or are building the work.',
  },
  {
    id: 'science',
    label: 'Science',
    type: 'domain',
    context: 'Domain · 18 entries · Great Work',
    abstract: 'Labs, papers, telescopes, discoveries. The university towns at work.',
  },
  {
    id: 'government',
    label: 'Government',
    type: 'domain',
    context: 'Domain · 11 entries · Great Work',
    abstract: 'How Utah governs the building of things — for better and worse.',
  },

  // Entries
  {
    id: 'spiral-jetty',
    label: 'Spiral Jetty',
    type: 'entry',
    tier: 'S',
    context: 'Entry · Culture & Arts · 1970',
    abstract:
      'Robert Smithson directed the construction of Spiral Jetty in April 1970 at Rozel Point, on the eastern shore of the Great Salt Lake. A 1,500-foot coil of basalt and earth — and a textbook-defining work of Land art.',
  },
  {
    id: 'sundance',
    label: 'Sundance Film Festival',
    type: 'entry',
    tier: 'S',
    context: 'Entry · Culture & Arts · 1978',
    abstract:
      'Park City’s annual indie-film mecca. The single most important showcase for American independent cinema since the early 1990s.',
  },
  {
    id: 'bonneville',
    label: 'Bonneville Salt Flats',
    type: 'entry',
    tier: 'A',
    context: 'Entry · Culture & Arts · Geological',
    abstract:
      'A 30,000-acre dry lake bed where land speed records are set and where Smithson found the white horizon he had been looking for.',
  },
  {
    id: 'utah-symphony',
    label: 'Utah Symphony',
    type: 'entry',
    tier: 'B',
    context: 'Entry · Culture & Arts · 1940',
    abstract:
      'A full-scale orchestra in the desert since 1940. Punches above its civic weight; a regular touring outfit at Carnegie Hall.',
  },
  {
    id: 'mormon-battalion',
    label: 'Mormon Battalion',
    type: 'entry',
    tier: 'B',
    context: 'Entry · History · 1846',
    abstract:
      'The longest infantry march in U.S. military history — 2,000 miles from Iowa to San Diego over 1846–1847.',
  },
  {
    id: 'topaz',
    label: 'Topaz War Relocation Center',
    type: 'entry',
    tier: 'A',
    context: 'Entry · History · 1942',
    abstract:
      'The high-desert internment camp west of Delta — and what its memory has taught the state about civil rights and the politics of fear.',
  },
  {
    id: 'browning',
    label: 'John M. Browning',
    type: 'entry',
    tier: 'A',
    context: 'Entry · People · 1855–1926',
    abstract:
      'The Ogden gunsmith whose designs still arm half the world. The most prolific firearms inventor in history, working out of a single Main Street shop.',
  },

  // People / places / concepts / orgs in Spiral Jetty's neighborhood
  {
    id: 'smithson',
    label: 'Robert Smithson',
    type: 'person',
    context: 'Person · 1938–1973',
    abstract:
      'American artist whose 1970 essay-and-earthwork practice helped define Land art. Died at 35 in a plane crash surveying his Amarillo Ramp.',
  },
  {
    id: 'holt',
    label: 'Nancy Holt',
    type: 'person',
    context: 'Person · 1938–2014',
    abstract:
      'Smithson’s spouse and collaborator; her own Sun Tunnels (1976) sit in Utah’s Great Basin, a four-tube concrete sculpture aligned to the solstices.',
  },
  {
    id: 'land-art',
    label: 'Land art',
    type: 'concept',
    context: 'Concept · Movement',
    abstract:
      'A late-1960s movement situating sculpture in landscape, often at scales no gallery could hold. Spiral Jetty, Sun Tunnels, and Double Negative are the canonical works.',
  },
  {
    id: 'entropy',
    label: 'Entropy',
    type: 'concept',
    context: 'Concept · Physics / aesthetics',
    abstract:
      'The tendency toward disorder. Smithson’s organizing obsession — and the explicit subject of Spiral Jetty, which is now sometimes submerged, sometimes salt-crusted.',
  },
  {
    id: 'great-salt-lake',
    label: 'Great Salt Lake',
    type: 'place',
    context: 'Place · 1,700 sq mi · Endorheic',
    abstract:
      'The largest salt-water lake in the Western Hemisphere. Its receding shoreline is now a slow-motion environmental story Spiral Jetty narrates from the inside.',
  },
  {
    id: 'rozel-point',
    label: 'Rozel Point',
    type: 'place',
    context: 'Place · Box Elder County',
    abstract:
      'The remote north-shore promontory where Smithson sited Spiral Jetty in 1970. A two-hour drive from Salt Lake City on dirt roads.',
  },
  {
    id: 'park-city',
    label: 'Park City',
    type: 'place',
    context: 'Place · Summit County · pop. 8,500',
    abstract:
      'The mountain town that hosts Sundance and most of Utah’s ski economy. Two former silver mines are now black-diamond runs.',
  },
  {
    id: 'holt-smithson-foundation',
    label: 'Holt/Smithson Foundation',
    type: 'org',
    context: 'Organization · Santa Fe',
    abstract:
      'The estate that stewards both artists’ legacies. Co-administers Spiral Jetty in partnership with Dia.',
  },
  {
    id: 'dia',
    label: 'Dia Art Foundation',
    type: 'org',
    context: 'Organization · New York',
    abstract:
      'The New York foundation that holds title to Spiral Jetty and maintains it for public visit. Acquired the work in 1999.',
  },
]

export const NODES: Record<string, GraphNode> = Object.fromEntries(
  RAW_NODES.map((n) => [n.id, n] as const),
)

/**
 * Edges are undirected. Author them in either order.
 */
export const EDGES: Array<readonly [string, string]> = [
  // Source → its domains
  ['great-work', 'culture-arts'],
  ['great-work', 'biotech'],
  ['great-work', 'climate'],
  ['great-work', 'history'],
  ['great-work', 'people'],
  ['great-work', 'science'],
  ['great-work', 'government'],

  // Culture & Arts → its entries
  ['culture-arts', 'spiral-jetty'],
  ['culture-arts', 'sundance'],
  ['culture-arts', 'bonneville'],
  ['culture-arts', 'utah-symphony'],
  ['culture-arts', 'land-art'],

  // History → its entries
  ['history', 'mormon-battalion'],
  ['history', 'topaz'],

  // People → its entries
  ['people', 'browning'],
  ['people', 'smithson'],
  ['people', 'holt'],

  // Spiral Jetty's neighborhood
  ['spiral-jetty', 'smithson'],
  ['spiral-jetty', 'holt'],
  ['spiral-jetty', 'land-art'],
  ['spiral-jetty', 'entropy'],
  ['spiral-jetty', 'great-salt-lake'],
  ['spiral-jetty', 'rozel-point'],
  ['spiral-jetty', 'bonneville'],
  ['spiral-jetty', 'holt-smithson-foundation'],
  ['spiral-jetty', 'dia'],

  // Cross-links among the orbit
  ['smithson', 'holt'],
  ['smithson', 'land-art'],
  ['smithson', 'holt-smithson-foundation'],
  ['holt', 'holt-smithson-foundation'],
  ['holt', 'land-art'],
  ['land-art', 'entropy'],
  ['great-salt-lake', 'rozel-point'],
  ['great-salt-lake', 'bonneville'],
  ['sundance', 'park-city'],
  ['holt-smithson-foundation', 'dia'],
]

export function neighborsOf(id: string): string[] {
  const out: string[] = []
  for (const [a, b] of EDGES) {
    if (a === id) out.push(b)
    else if (b === id) out.push(a)
  }
  return out
}

/** Which graph node each navbar segment opens into. */
export const SEGMENT_FOCUS: Record<string, string> = {
  source: 'great-work',
  domain: 'culture-arts',
  entry: 'spiral-jetty',
}
