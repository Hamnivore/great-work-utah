# Great Work

> A phenomenal, mobile-first UI for browsing the great work being done in Utah — backed by an LLM-maintained wiki that compounds knowledge over time and lets people raise their hand to get involved.

## Start Here

| Doc | What's in it |
|---|---|
| [`vision.md`](./vision.md) | The product concept, goals, target users, hard constraints |
| [`personas.md`](./personas.md) | Named cast we imagine being while prototyping; priority hierarchy for tradeoffs |
| [`design-direction.md`](./design-direction.md) | Visual North Star — Atlas Obscura / travel-guide soul, Caslon, desert palette, Direction D locked in |
| [`design-direction-renders/`](./design-direction-renders/) | The four explored visual directions; **D-hybrid is chosen** |
| [`wiki-architecture.md`](./wiki-architecture.md) | The Karpathy-style LLM wiki: fact pages plus derivative guides, matches, and answers |
| [`../wiki/agent_ops/agents.md`](../wiki/agent_ops/agents.md) | The single-agent prompt: mission, operating loop, success criteria |
| [`../wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md) | The wiki schema: page types, headers, layouts, parser contract, validation |
| [`../wiki/agent_ops/index.md`](../wiki/agent_ops/index.md) | Inventory of every page currently in the wiki, kept in sync by the agent |
| [`wiki-seed-worklist.md`](./wiki-seed-worklist.md) | Agent-editable backlog of source and category work for the wiki |
| [`mini-wiki-inventory.md`](./mini-wiki-inventory.md) | Sam's existing ~280-entry wiki at `~/coding/research/cool_companies` (seed material and inspiration) |
| [`plan.md`](./plan.md) | Phased build plan with locked-in decisions (both hackathons, React + Vite stack) |

## Background

| Doc | What's in it |
|---|---|
| [`hackathon-brief.md`](./hackathon-brief.md) | Nucleus Bounty brief ($5K) — talent ↔ startup matching |
| [`startup-state-brief.md`](./startup-state-brief.md) | GOEO AI Builder Day brief ($10K) — Founder's Navigator + Utah Startup Map |
| [`nucleus-overview.md`](./nucleus-overview.md) | What the Nucleus Institute does |
| [`utah-data-sources.md`](./utah-data-sources.md) | Sites we plan to scrape and how |

## The Two Hackathons (and Why One Product Can Win Both)

| | Nucleus Bounty | GOEO AI Builder Day |
|---|---|---|
| Prize | **$5,000** | **$10,000** |
| Problem | Match talent ↔ Utah startups | Make state resources & ecosystem findable |
| Judging tilt | UX (40%) > Match quality (30%) > Integration (20%) > Creativity (10%) | UX (30%) ≈ Tech (25%) ≈ Design (25%) > Creativity (20%) |
| Integration constraint | **Loose** — solving the problem matters more than slotting into Squarespace/Affinity | Production-quality enough to potentially go live on `startup.utah.gov` |
| Personas | Executive → deep tech, Student → spinout, Operator → scaling co | 6 named personas (see brief) |

Both judging panels explicitly want **bold, creative, surprising** approaches. Both problems reduce to *"Utah's ecosystem has the goods; the discovery layer is broken."*

Great Work is the same product framed two ways:

- **For Nucleus:** "We rebuilt your connections hub as a beautiful, public-facing showcase of Utah great work, with self-serve hand-raising. Matching is explainable because the wiki *is* the explanation."
- **For GOEO:** "Founder's Navigator and Utah Startup Map, fused. Personalized because the wiki understands each persona. Updatable without a developer because LLM agents maintain it."

> ⚠️ GOEO's brief explicitly warns: *"a complete, polished build of one product will score higher than two rushed ones — depth beats breadth."* So even if the underlying product serves both, we need to decide which entry to optimize the demo for. See [`plan.md`](./plan.md) Phase 0.

## The Architecture, in One Sentence

A **React + Vite** web app that beautifully renders an [LLM-maintained markdown wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) about Utah's innovation ecosystem, with fact pages for entities and derivative guides, matches, and answers that explain what to do next.

No user auth, no traditional database — just markdown files, git, and a few agents doing the bookkeeping. Sam's existing wiki gives us seed material, but the public wiki is prose-first: minimal headers, rich body text, and contextual recommendations instead of universal item scores.
