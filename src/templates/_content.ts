/**
 * Shared lorem-ipsum content for the template showroom.
 *
 * Anchored loosely to the Spiral Jetty (Robert Smithson, Rozel Point, 1970) —
 * a real Utah subject so the templates feel like editorial pieces, not Figma
 * placeholders. Body copy is lorem ipsum so the typography does the work.
 */

const seed = (name: string, w: number, h: number) =>
  `https://picsum.photos/seed/${name}/${w}/${h}`

export const LOREM_ARTICLE = {
  // -------- masthead furniture --------
  kicker: 'Dispatches · No. 014',
  issue: 'Vol. I · Winter 2026',
  dateline: 'ROZEL POINT, UTAH — JULY 12',
  domain: 'Land Art',
  era: 'Postwar',
  location: 'Rozel Point, Great Salt Lake',

  // -------- headline stack --------
  title: 'A coil of basalt set against the pale brine',
  shortTitle: 'A coil of basalt',
  deck: 'Fifty-five years on, a 1,500-foot earthwork keeps changing its mind about being seen — and the people who keep going back keep changing too.',
  byline: 'By the Editors',
  readTime: '8 min read',

  // -------- ranking --------
  tier: 'A',
  starred: true,

  // -------- imagery --------
  // Picsum placeholders, seeded for stability. Templates may apply their own
  // crop / filter; the editorial-img class in index.css gives them a unified
  // warm cast that reads like a real magazine plate.
  heroImage: seed('spiral-jetty-hero', 1600, 1100),
  heroCaption:
    'The Jetty at low water, photographed from a low pass over the lake. — N. Holt, 1970.',
  portraitImage: seed('rozel-portrait', 1100, 1500),
  portraitCaption: 'Smithson on the causeway, the morning of the pour.',
  images: [
    seed('jetty-aerial', 1400, 1000),
    seed('salt-encrust', 900, 900),
    seed('morning-rozel', 900, 900),
    seed('lake-distance', 1400, 900),
    seed('basalt-edge', 1100, 1400),
    seed('rozel-foot', 1200, 800),
  ],

  // -------- body --------
  body: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.',
    'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
    'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Nam libero tempore cumque soluta nobis est eligendi optio.',
    'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
    'On still mornings the spiral comes apart at the edges — salt blooms along the basalt like a slow fire. The water decides whether the work exists today, and the work decides nothing back.',
  ],

  // -------- pull --------
  pullQuote:
    'At times the lake rises and the coil disappears. At times it reappears, rimmed with salt.',
  pullQuoteAttr: 'Robert Smithson, 1972',

  // -------- citations --------
  citations: [
    'Holt/Smithson Foundation, "Spiral Jetty: A Reading," 2019.',
    'Utah Museum of Fine Arts, Smithson Archive 1971–1973.',
    'Dia Art Foundation, conservation notes 2002–2018.',
    'Aperture Magazine, Issue 219, "Land Held in Time."',
  ],

  // -------- table of contents (used by Contents template) --------
  contents: [
    {
      no: '01',
      kicker: 'Dispatch',
      title: 'A coil of basalt',
      blurb: 'Why we keep going back to a thing that may not even be there.',
      page: 14,
    },
    {
      no: '02',
      kicker: 'Field notes',
      title: 'How the lake decides',
      blurb: 'Brine cycles, salt blooms, and the slow logic of disappearance.',
      page: 22,
    },
    {
      no: '03',
      kicker: 'Portrait',
      title: 'Nancy Holt at the wheel',
      blurb: 'A photographer who watched a thing be made and then watched it leave.',
      page: 34,
    },
    {
      no: '04',
      kicker: 'Argument',
      title: 'A case for confident tiers',
      blurb: 'Why public ranking is a love letter, not a verdict.',
      page: 41,
    },
  ],

  // -------- marginalia (used by Marginalia template) --------
  margins: [
    {
      figure: seed('marg-aerial', 600, 600),
      caption:
        'fig. 1 — looking north from the causeway, the coil reads counter-clockwise.',
    },
    {
      figure: seed('marg-salt', 600, 600),
      caption:
        'fig. 2 — at parts-per-thousand high enough, the brine begins to crystallize on the basalt itself.',
    },
    {
      note: 'A Smithson note from Spring 1970, reading: "the site selects the work."',
    },
    {
      note: 'See also: Sun Tunnels, Lucin, 1973–76 — Holt\'s reply, of a kind.',
    },
  ],

  // -------- related --------
  related: [
    { title: 'Sun Tunnels', author: 'Nancy Holt, 1973–76', readTime: '6 min' },
    { title: 'Double Negative', author: 'Michael Heizer, 1969', readTime: '5 min' },
    {
      title: 'Bingham Canyon Mine',
      author: 'Open-pit and aftermath',
      readTime: '11 min',
    },
  ],

  // -------- weather strip (FrontPage template) --------
  weather: 'Salt-flat haze · brine 27% · wind W 8mph · 91°F at noon',
} as const

export type LoremArticle = typeof LOREM_ARTICLE
