# Build Plan

A phased plan, in order, designed to get to a demoable thing fast and only add depth where it pays off.

## Decisions Locked In

| Decision | Choice |
|---|---|
| Hackathons | **Both** — building one product that serves the market well; tilts slightly toward Nucleus's "matching" framing but takes inspiration from both |
| Tech stack | **React + Vite** + (recommended additions below) |
| Mini-wiki location | `~/coding/research/cool_companies` — see [`mini-wiki-inventory.md`](./mini-wiki-inventory.md) |
| Wiki wiring | **Symlink** `~/coding/research/cool_companies` into `wiki/` for fast local dev |
| Content source of truth | Sam's wiki content + tier judgments + inclusion philosophy |
| **UX is greenfield** | We do **not** have to render Sam's wiki as a wiki. LLMs can reshape, deconstruct, and recompose entries on the fly to fit any UX surface we design. |
| Tier judgments | **Public.** Show all tiers (S → F + speculative). The fact that we publicly tier organizations is part of the bit. |
| Primary audience | **Founders building world-changing things.** When in doubt, serve them. See [`personas.md`](./personas.md). |
| Domain name | Deferred — doesn't matter to our users at this stage |
| Visual direction | **Direction D (Hybrid)** — see [`design-direction.md`](./design-direction.md) and renders in [`design-direction-renders/`](./design-direction-renders/) |
| Ask interaction | **Article generation, not chat.** Streaming, browser-back is history, every answer has a URL, articles file back into the wiki. |
| Tier explainer | **A wiki page** at `wiki/tier-system.md`. Every tier mark in the app hyperlinks to it. |
| Navigation | **Slim header, no tab bar.** Back chevron only when relevant. "Related" exit ramps at bottom of articles. |
| Tier slider | **Deferred** to v1.5 — show all tiers by default, let the explainer carry the explanation |
| Desktop | **In scope.** Same content; more density per screen; right rail for citations / related / suggestions. |

### Recommended Stack on Top of React + Vite

These are starting suggestions; pick what fits as we go.

- **Tailwind CSS** + **shadcn/ui** — battle-tested for fast, beautiful, accessible UI; copy-paste components mean no library lock-in
- **Framer Motion** — page transitions and micro-interactions (the "feels alive" beat)
- **TanStack Router** *or* React Router — TanStack is more modern; either works
- **react-markdown** + **remark-gfm** + **rehype-raw** — render Sam's markdown
- **gray-matter** *(node-side at build time)* — parse the bold-prefix headers into JSON
- **fuse.js** *or* **flexsearch** — client-side fuzzy search over the wiki index
- **Vercel** for deployment — zero config, instant preview URLs for demos

## Phase 0 — Lock the Concept ✅

- [x] Capture the vision in [`vision.md`](./vision.md)
- [x] Capture the wiki pattern in [`wiki-architecture.md`](./wiki-architecture.md)
- [x] Cross-link with hackathon briefs in [`README.md`](./README.md)
- [x] Inventory the existing mini-wiki ([`mini-wiki-inventory.md`](./mini-wiki-inventory.md))
- [x] Decisions locked (see table above)

## Phase 1 — Wire the Wiki Into the Repo

Goal: the React app can read Sam's existing 280 entries.

- [x] Decision: **symlink** `~/coding/research/cool_companies` → `wiki/`
- [ ] Create the symlink
- [ ] Write a parser for the bold-prefix header format → JSON
- [ ] Build a `wiki/index.json` artifact at build time (one row per entry: title, tier, domain, slug, summary, path)
- [ ] Smoke-test: render one entry as a stub React page

## Phase 2 — Design the UI (no production code yet)

Goal: a clear picture of what the user sees before we commit to a frontend implementation.

> **Run every prototype through the persona test in [`personas.md`](./personas.md).** Priya, Sam, Dr. Amir first; everyone else second.

### Must-have for the demo

- [ ] **Home / Discover** — masthead + ask bar + suggestions + featured spread + directory with tier-keyed rows. The wow + the front door.
- [ ] **Ask interface (the hero)** — article generation, streaming. Empty state, mid-stream state, completed-article state with citations + related exits. *This is the demo moment.*
- [ ] **Entry page (photographic spread)** — Spiral Jetty as the canonical example. Confirms the photographic treatment.
- [ ] **Entry page (typographic spread)** — Recursion as the canonical example. Confirms the same template works without a photo.
- [ ] **Person page** — Ben Whitlock. Rich enough that Priya can answer hard questions about him without scheduling a call.
- [ ] **Tier explainer** — `wiki/tier-system.md` rendered in the same template as any entry. Linked from every tier mark.
- [ ] **Hand-raise form** — single page, three flavors (Seeker / Researcher / Helper). Captures enough depth that the resulting `people/` entry is askable.

### Nice-to-have

- [ ] **Sector page** — "Energy in Utah," tier-ranked grid (the Direction C middle phone)
- [ ] **About / how it works** — the LLM-wiki story; an editor's note in the same Caslon as everything else

### Process

- [ ] Sketch each in low-fidelity (paper, Figma, or generated mockups)
- [ ] **Hero screen is the Ask interface.** That's the demo moment for both judging panels.

## Phase 3 — Walk Through User Flows

For each archetype from `vision.md`, write the literal click-by-click flow:

- [ ] **Seeker flow** — lands → browses by sector → sorts by tier → finds a company that excites them → reads "what kind of contributor thrives here" → raises hand to that company
- [ ] **Researcher flow** — lands → finds executors in their sector → posts an opportunity (creates a `places_you_can_work/` entry?) → raises hand asking for an operator
- [ ] **Helper flow** — lands → "I want to help" → quick form → wiki ingests them as a `people/` entry tagged `available: true`
- [ ] **Investor / outsider flow** — opens it on a phone after seeing it on a screen → "wow, Utah is really doing this stuff"
- [ ] **GOEO test personas** — run the 6 named personas (Jordan, Maria, Marcus, Priya, David, Dr. Amir) through the flow; the result should be meaningfully different for each

## Phase 4 — Build the Beautiful UI

- [ ] Mobile-first layouts (thumbs before mouse), with desktop in scope from day one
- [ ] Visual identity per [`design-direction.md`](./design-direction.md) — Caslon, desert palette, magazine layout grammar
- [ ] Render entry pages with rich visuals (hero photo when earned; typographic spread when not; "why it matters" pull-quote; tier mark hyperlinked to explainer)
- [ ] Implement Ask article generation with streaming
- [ ] Implement persistent search bar + suggestions
- [ ] "Related" exit ramps at the bottom of every article and entry
- [ ] Page transitions, loading states, accessibility pass

## Phase 5 — Real Data Polish

- [ ] Fix any parser edge cases discovered when rendering the full 280-entry wiki
- [ ] Pull `agent_ops/PLAN.md` into our schema understanding; mirror as repo-root `AGENTS.md`
- [ ] Cross-link work between the two wikis where it makes sense (e.g., a `great_work/` historical entry → a `places_you_can_work/` modern descendant)
- [ ] (Optional) Pull faces / logos / hero images per entry — even a few high-quality ones lift the whole feel

## Phase 6 — Hand-Raise Surface

The "raise your hand" feature, with no auth, no DB.

- [ ] Single-page form: Seeker / Researcher / Helper variants, common fields (name, contact, what they're looking for, what they offer, sector interests)
- [ ] On submit: write a markdown file to `wiki/hand-raises/YYYY-MM-DD-slug.md` (via a tiny serverless function — e.g., a Vercel API route that commits to git, or a Formspree-style hosted form for v1)
- [ ] Display recent hand-raises on a public "available now" page (with consent toggle)

> Trade-off: a true "writes back to the repo" flow needs a small server. If that's too much for the demo, fall back to a Formspree / Tally form that just emails Sam — and he files the entry by hand. Either way, the *story* is the same.

## Phase 7 — Scrape & Ingest (Optional Polish)

(See [`utah-data-sources.md`](./utah-data-sources.md).)

Lower priority now that we have 280 entries already. Use only if time allows or if a specific demo moment needs it.

- [ ] Quick scraper for `startup.utah.gov` Resource List (this is the GOEO data ask — could land us additional credibility points)
- [ ] Quick scraper for `business.utah.gov` programs
- [ ] Quick scraper for `nucleusutah.org` programs + newsroom
- [ ] One-shot agent run to integrate scraped sources into the wiki

## Phase 8 — The 24/7 Agents

The "magic" the demo will sell hardest. These are the agents that make the wiki feel alive.

- [ ] **Ingest agent** — accepts new sources (URL paste, hand-raise submission, scraped batch) and integrates them per `wiki-architecture.md`
- [ ] **Lint agent** — extends Sam's existing scripts; flags contradictions, stale claims, orphans, missing pages
- [ ] **Hand-raise matchmaker** — when a new person is added, scans the wiki for plausible matches and writes them to a `matches/` markdown queue
- [ ] **Suggestion agent** — surfaces "questions worth asking" and "sources worth adding" to keep the wiki growing
- [ ] Decide on hosting: do they actually run 24/7, or do we fake it for the demo with manual triggers? **For hackathon: probably manual triggers + a story about what the always-on version looks like.**

## Phase 9 — Demo Polish

- [ ] Pick the **3 demo moments** that sell the story:
  1. **Browse** — investor moment: open it, scroll, "look at all of this." Featured spread, tier-keyed directory.
  2. **Ask** — Priya types *"Senior engineers who'd join a hard-tech team in Utah,"* the article streams in with three cited candidates, she clicks one and dives into Ben's page. *This is the creativity + utility beat.*
  3. **Hand-raise → article** — submit a hand-raise, watch it land in the wiki, ask the guide about the new person, get an article that includes them.
- [ ] Pre-stage the wiki so those moments shine
- [ ] Record a fallback video in case live demo fails
- [ ] Write the pitch — emphasize the *compounding wiki*, the *Ask = article paradigm*, the *tier system*, and *explainability* — not just the UI

## What We're Explicitly NOT Building (v1)

- User accounts / auth
- A real database (markdown + git is the database)
- Direct messaging / inbox
- CRM integration (Affinity, etc.) — Nucleus told us this is optional
- Complex permission models
- Multi-tenant anything
- Editing the wiki from the web UI (read-only for v1; agents write, Sam edits via Obsidian)

If any of these turns out to be \<2 hours of work and meaningfully strengthens the demo, revisit. Otherwise, skip.

## Open Questions

1. **Hand-raise submission backend** — Formspree (zero infra) vs. Vercel function that commits to git (cooler story)? (Phase 6)
2. **Hosting** — Vercel is the default; any reason not to?
