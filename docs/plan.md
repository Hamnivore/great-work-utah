# Build Plan

A phased plan designed to get a polished hackathon demo quickly, while keeping the wiki architecture honest and maintainable.

## Decisions Locked In

| Decision | Choice |
|---|---|
| Hackathons | **Both**, with demo tilt toward Nucleus matching and GOEO resource/navigation usefulness |
| Tech stack | **React + Vite** |
| Wiki model | **Human-readable markdown wiki**, maintained by agents |
| Page structure | **Thin bold-prefix headers + rich prose sections** |
| Structured data | Keep minimal; no YAML frontmatter and no structured matching profile block |
| Fact vs judgment | Separate `ventures/`, `people/`, `helpers/`, `resources/`, `work/`, `sources/` from `guides/`, `matches/`, `answers/` |
| Rankings | No universal item-level tiers; contextual rankings live in guides, matches, and answers |
| Helpers | First-class pages for advisors, mentors, investors, business-service providers, firms, and programs |
| Primary audience | **Founders building ambitious things**, then researchers, operators, and helpers |
| Ask interaction | **Article generation, not chat**; saved answers can file back into the wiki |
| Visual direction | **Direction D (Hybrid)** — see [`design-direction.md`](./design-direction.md) |
| Navigation | Slim header, persistent Ask, related exits; no bottom tab bar |
| Desktop | In scope; same content with more density and a right rail |

## Recommended Stack

- **React + Vite** — already in place
- **Tailwind CSS** — visual system
- **react-markdown**, **remark-gfm**, **rehype-raw** — markdown rendering
- **Custom parser** — parse bold-prefix headers and `##` sections
- **Fuse.js** or **FlexSearch** — client-side search over generated wiki index
- **Vercel** — easiest demo deploy
- **Trigger.dev** or **Inngest** — simplest post-demo agent runner if we need durable background jobs

## Phase 0 — Lock the Concept

- [x] Capture the vision in [`vision.md`](./vision.md)
- [x] Capture personas in [`personas.md`](./personas.md)
- [x] Capture the wiki pattern in [`wiki-architecture.md`](./wiki-architecture.md)
- [x] Create the new prose-first schema (now lives at [`../wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md))
- [x] Create the single-agent prompt (now lives at [`../wiki/agent_ops/agents.md`](../wiki/agent_ops/agents.md))
- [x] Cross-link with hackathon briefs in [`README.md`](./README.md)

## Phase 1 — Build the New Wiki Skeleton

Goal: create a small, coherent wiki that demonstrates the model.

- [ ] Create directories:
  - `ventures/`
  - `people/`
  - `helpers/`
  - `resources/`
  - `work/`
  - `sources/`
  - `guides/`
  - `matches/`
  - `answers/`
  - `agent_ops/`
- [ ] Create `wiki/README.md` as a map, not a folder dump
- [ ] Create default guides:
  - `guides/nucleus-demo-matches.md`
  - `guides/find-a-cofounder.md`
  - `guides/find-an-advisor.md`
  - `guides/find-business-services.md`
  - `guides/find-meaningful-work.md`
  - `guides/commercialize-research.md`
  - `guides/startup-capital-in-utah.md`
  - `guides/utah-deep-tech-map.md`
- [ ] Create `agent_ops/PROMPT.md`, `RUN_LOG.md`, `LEADS.md`, `DECISIONS.md`, `SUGGESTIONS.md`, and `PLAYBOOK.md`

## Phase 2 — Parser and Index

Goal: the React app can browse the public wiki format.

- [ ] Infer page type from folder
- [ ] Infer slug from filename
- [ ] Parse H1 title
- [ ] Parse bold-prefix header lines until the first `##`
- [ ] Parse sections by `## Heading`
- [ ] Build `src/data/generated/all.json`
- [ ] Index title, type, slug, status, confidence, focus, location, audience, updated, and section headings
- [ ] Validate missing H1s, missing required headers, duplicate inferred IDs, stale pages, and broken links

## Phase 3 — Seed Demo Content

Goal: a few excellent examples, not hundreds of thin pages.

- [ ] 2-3 `ventures/` pages
- [ ] 2-3 `people/` pages
- [ ] 3-5 `helpers/` pages, including business-service providers
- [ ] 3-5 `resources/` pages
- [ ] 2-3 `work/` pages for inspiration and pattern-matching
- [ ] 5-8 `sources/` pages
- [ ] 2-3 `matches/` pages with clear evidence and next steps
- [ ] 1 polished `guides/nucleus-demo-matches.md`
- [ ] 1 polished `guides/find-business-services.md`

The demo content should support:

1. Executive or operator to deep-tech venture.
2. Researcher or first-time founder to commercialization resources.
3. Helper or business-service provider to founder.

## Phase 4 — Design the UI

Goal: a clear, beautiful, mobile-first experience before adding more infrastructure.

Must-have:

- [ ] **Home / Discover** — Ask bar, featured guide, recent matches, useful starting points
- [ ] **Ask interface** — article generation, streaming states, citations, related exits
- [ ] **Entity page** — fact-layer dossier with impact, evidence, open questions
- [ ] **Guide page** — recommendation layer with contextual rankings and criteria
- [ ] **Match page** — "why these people should talk" artifact
- [ ] **Helper page** — business-service provider/advisor page that feels first-class
- [ ] **Hand-raise form** — Seeker / Researcher / Helper variants

Nice-to-have:

- [ ] Visual "Utah deep-tech map" guide
- [ ] About / how it works
- [ ] Live agent activity feed for the demo

## Phase 5 — Walk Through User Flows

Validate with the personas in [`personas.md`](./personas.md).

- [ ] **Priya flow** — asks for senior operators or advisors, reads a match, decides who to contact
- [ ] **Sam flow** — sees her company represented well and discoverable outside her network
- [ ] **Dr. Amir flow** — finds commercialization resources, first-call helpers, and examples of similar work
- [ ] **Marcus flow** — sees an approachable path for a manufacturing founder
- [ ] **Ben flow** — finds meaningful work and raises his hand
- [ ] **Helen flow** — finds a founder worth helping within five minutes

## Phase 6 — Ask and Agent Demo

Goal: show the wiki being built or used in real time.

- [ ] Implement a local/manual "agent run" path for the hackathon
- [ ] Stream an Ask answer into the UI
- [ ] File a saved answer into `answers/`
- [ ] Create or update a guide from a repeated/high-value question
- [ ] Create a match page from an intake submission or seeded demo profile
- [ ] Append to `agent_ops/RUN_LOG.md`

For the hackathon, manual triggers are fine. Sell the always-on version, but demo the core loop.

## Phase 7 — Hand-Raise Surface

The "raise your hand" feature, with no auth and minimal backend.

- [ ] Single-page form with Seeker / Researcher / Helper variants
- [ ] Capture public-safe summary, contact preference, what they offer, what they are looking for, sectors, location, and consent
- [ ] For demo: write or simulate a markdown page in `people/`, `helpers/`, or `sources/`
- [ ] Agent suggests relevant guides or matches

Fallback: Tally/Formspree/email is acceptable if it preserves the story.

## Phase 8 — Scrape and Ingest

Lower priority than polished demo content.

- [ ] Scrape or manually seed `startup.utah.gov` resources
- [ ] Add Nucleus programs
- [ ] Add a few GOEO resources
- [ ] Convert the best sources into `resources/`, `helpers/`, and `guides/`

## Phase 9 — Demo Polish

Pick three moments:

1. **Guide** — "Business Services for Utah Founders" shows helpers are first-class.
2. **Ask** — Priya asks who a hard-tech founder should talk to; answer streams with citations.
3. **Match** — a specific founder/helper match explains evidence, risks, and next step.

Before demo:

- [ ] Pre-stage content so every clicked page is credible
- [ ] Record a fallback video
- [ ] Write the pitch around the living wiki, not a database
- [ ] Emphasize explainability, human-readable maintenance, and contextual recommendations

## Not Building in v1

- User accounts
- Direct messaging
- Full CRM integration
- Fully automated matching in Python
- Embeddings-first search
- Complex permission model
- Multi-tenant anything
- Public claims based on private data

## Open Questions

1. How should the public wiki index coexist with the legacy generated bundle during the transition?
2. Which guide labels best surface hidden gems, rare fits, and caveated opportunities without becoming gimmicky?
3. What is the minimum hand-raise backend that still makes the demo feel real?
