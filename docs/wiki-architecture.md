# Wiki Architecture

The data layer behind Great Work is a **Karpathy-style LLM Wiki** — a persistent, compounding collection of markdown files that LLM agents read, write, and maintain. The web UI is a beautiful read-view over that wiki.

> Reference: [Andrej Karpathy — `llm-wiki.md`](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

## Ground Truth: We Already Have a Wiki

Sam has been building this for weeks. ~280 entries across two wikis, with consistent page anatomy, a tier system, and validation scripts. See [`mini-wiki-inventory.md`](./mini-wiki-inventory.md) for the inventory.

The architecture below describes **what we layer on top of those wikis**, not a from-scratch design. We treat Sam's content + tier judgments + inclusion philosophy as the source of truth.

### UX Is Greenfield

Critically: **the UX is greenfield.** We do not have to render Sam's wiki *as a wiki.* The markdown files are the data; the LLM is the runtime. We can deconstruct an entry into cards, recompose three entries into a comparison view, summarize a sector's worth of entries into a single page-and-a-half overview, or generate persona-tuned snippets on the fly. The user's experience can look nothing like a wiki — and that's the point.

Modern LLMs are good enough that we can reshape content per-screen at low latency / low cost. So design every screen for the *user*, not the file.

## Core Idea

Most "ecosystem directory" sites are RAG over a CRM. Every search re-derives the answer from raw rows. Nothing accumulates. The site stays as dumb as the day it launched.

Instead: **LLM agents incrementally build and maintain a structured wiki** about Utah's innovation ecosystem. When a new source arrives (a press release, a paper, a hand-raise form, a scrape of `startup.utah.gov`), the agent doesn't just index it. It reads it, extracts entities, updates the relevant pages, refreshes tier judgments, flags contradictions, and appends to the log. Knowledge **compounds**.

Three layers:

1. **Raw sources** (immutable) — scraped pages, uploaded docs, hand-raise submissions, pasted articles.
2. **The wiki** (LLM-owned) — interlinked markdown files. Agents write; humans (and the web app) read.
3. **The schema** (`AGENTS.md` / `agent_ops/PLAN.md`) — the contract that tells any LLM how this wiki is structured and how to maintain it. Sam already has this for the existing wikis; we extend it.

## Repo Layout (Working Plan)

```
great-work/                       # this repo (the app)
  app/                            # React + Vite source
  docs/                           # the docs you're reading
  wiki/                           # symlink → ~/coding/research/cool_companies
    great_work/                   # 165 historical entries (immutable for now)
    places_you_can_work/          # 114 current-org entries (immutable for now)
    people/                       # NEW — hand-raise submissions live here
    articles/                     # NEW — ask answers, filed back as new pages
    sources/                      # NEW — ingested raw sources
    tier-system.md                # NEW — the canonical tier explainer; every tier mark hyperlinks here
    log.md                        # NEW — append-only ingest/query log
    index.md                      # NEW — flat catalog generated from existing READMEs
  scripts/                        # parsers, ingest tooling, lint
```

> Decision: **symlink** to `~/coding/research/cool_companies` for fast local iteration. Sam's edit workflow stays in his existing repo.

## Page Anatomy (Sam's Existing Convention)

Every entry uses this structure. We do **not** rewrite to YAML frontmatter — we write a parser that handles the bold-prefix header format.

```markdown
# Recursion Pharmaceuticals ⭐

**Tier:** S — category-defining; arguably the best place in the world to do this work
**Domain:** Health & longevity — AI-driven drug discovery
**Type:** Company (public, NASDAQ: RXRX)
**Stage:** Clinical stage
**HQ:** Salt Lake City, UT
**Founded:** 2013
**Website:** [recursion.com](https://www.recursion.com)

## Mission
One sentence — what they're trying to do.

## Why it matters
Counterfactual argument — what breaks or stalls without this work?

## The hard problem
What's genuinely unsolved at the core of what they do?

## Mechanism of impact
How does the work change the world?

## What kind of contributor thrives here
Skills, disposition, working style.

## Ownership
Who controls the company? (founder-led, VC-majority, nonprofit, public, government-backed)

## Caveats
Honest concerns about mission drift, viability, hype, contested legacy.

## Learn more
- Papers, talks, interviews, repos.
```

Historical entries (`great_work/`) use slightly different section names (`What it was`, `Why it mattered`, `Lasting impact`, `Key people`) — the parser handles both shapes.

## The Tier System Is the Spine

Every entry carries a tier (`S` / `A` / `B` / `C` / `D` / `F`, plus speculative `P-A` / `P-B` / `P-C`). This isn't just metadata — it's the primary UX dial:

- **Default browse:** show S + A.
- **Tier slider** in the UI lets users widen to B / C / D / F as desired.
- **"Why this is not ⭐"** notes inside entries become the explainability surface ("Why was this only ranked B?" → click → read the paragraph).

The inclusion philosophy: **be generous, let tier signal confidence.** This is *exactly* the philosophical opposite of a job board's "show me only the best 10 results."

## Operations the Agents Run

(Lifted from Karpathy's pattern, adapted to Sam's wiki.)

### Ingest

Triggered by a new source (URL paste, hand-raise submission, scrape result). The agent:

1. Reads the source.
2. Identifies entities: existing wiki entries it relates to, or new entries to create.
3. Drafts edits or new entries in the appropriate folder, following the page anatomy and tier conventions documented in `agent_ops/PLAN.md`.
4. Cross-links: adds backlinks where relevant.
5. Updates the README tables and `index.md`.
6. Appends to `log.md` with the standard prefix `## [YYYY-MM-DD] ingest | <source title>`.

For the hackathon: ingest may be human-triggered ("paste a URL → agent runs"). Full 24/7 ingest is Phase 6.

### Ask

The primary interaction model — *not* a search bar tucked in the corner, *and not a chatbot.* **Ask is article generation.** The user types a question; the guide writes them an article in response. (See [`design-direction.md`](./design-direction.md#the-ask-interface) for the UX treatment.)

Example questions and the kind of articles they produce:

- *"Show me senior ML engineers in Utah who've shipped a production system at scale and raised their hand recently."* → A short essay introducing 3–5 candidates, each with a one-paragraph profile and a hyperlink to their full `people/` page.
- *"Has Ben Whitlock ever worked on regulated medical software?"* → A two-sentence answer citing his page + linked sources. Not a guess.
- *"What did Recursion's first 5 engineers have in common — and who in our wiki looks like that today?"* → A multi-section article with the historical synthesis followed by current matches, all cited.
- *"Utah's most surprising scientific moments"* → A 6-paragraph editorial essay drawing from `great_work/`.

The agent:

1. Reads `index.md` and any per-domain index pages to find candidate sources.
2. Reads the relevant entries (people, organizations, historical work).
3. **Synthesizes an article**, streamed token-by-token to the user, with inline citations linking to the wiki pages it draws from.
4. **Files the article back into the wiki** as a new page in `wiki/articles/` (or `wiki/synthesis/`) — every ask becomes a citable artifact. The next user asking a related question finds it.
5. The article gets a stable URL so users can share it, link to it, and return to it.

Length is responsive to question depth — same article template, different lengths. A one-sentence answer with one citation is still "an article" structurally.

**Filtering is a first-class part of Ask, not a separate "settings" surface.** When Priya asks *"senior eng in Utah who care about climate,"* the agent doesn't paginate a results grid — it returns 3 high-confidence leads embedded in a short essay, with reasoning. She refines by asking another question.

Explainable AI for free: every claim cites its supporting wiki pages, and every wiki page cites its sources.

### Lint

Periodic health check. Sam already has scripts (`check_great_work_totals.py`, `check_great_work_watchlist_links.py`, etc.). Extend with:

- Contradictions between pages
- Stale claims superseded by newer sources
- Orphan pages with no inbound links
- Important concepts mentioned but lacking their own page
- Tier inconsistencies (e.g., entry self-describes as world-changing but is tagged C)

The lint agent files findings as TODOs in `log.md` or directly fixes them.

### Hand-raise

A user submits "I'm available" or "I'm looking for X." The agent:

1. Files the raw submission into `wiki/people/` as a new entry.
2. Tags with availability, skills, intent, sector preferences.
3. Cross-references against `places_you_can_work/` looking for plausible matches.
4. Surfaces matches in the UI / writes to a `matches/` queue.

For v1, no email/notifications — the wiki *is* the notification surface. Helpers see "people who want to talk to you" on their entry; orgs see "people interested in your mission."

### Evolve (the feedback loop)

This is the bit. Every interaction with the app is signal that compounds back into the wiki:

- **Asks become pages.** A founder asks "what did Recursion's first 5 engineers have in common?" — the answer becomes `synthesis/recursion-early-engineering-pattern.md`. The next founder asking a related question starts richer.
- **Filter patterns inform sector pages.** If 80% of founders asking about defense also filter for "loves working on autonomy," the defense sector page surfaces autonomy-relevant entries first.
- **Skip/click signals refine tier and discoverability.** If 40 founders see Ben's profile and 0 reach out, the agent flags this and — privately, with Ben's consent — surfaces "your profile is being seen but not getting traction; here's what's missing." Tier judgments are *never* changed silently by clickstream; the agent proposes, Sam (or the editor) disposes.
- **Hiring outcomes are gold.** When a founder marks a hire as great or wrong-fit six months later, that becomes the highest-signal training data the wiki could ever have. The agent learns "what does a good X-stage Y-sector hire actually look like" from real outcomes.

The mantra: **the wiki at month 12 should be unrecognizably better than month 1, even if Sam writes nothing new.** The agents and the users co-author it.

## Search

Per Karpathy: at moderate scale (~280 entries today, low thousands at most) `index.md` + the LLM is enough. The LLM reads the index to find candidate pages, then drills in.

For the web app's client-side search, fuse.js or flexsearch over a JSON build artifact is plenty. We can add proper BM25 + embeddings later if needed — the file structure won't change.

## The Schema (`AGENTS.md`)

Sam's `agent_ops/PLAN.md` already documents:

- Inclusion bar
- Tier system
- Attribution standards (strong / medium / weak)
- Entry format
- Speculative-entry rules
- Heuristics for "great work"

This *is* the schema Karpathy talks about — the contract that makes an LLM a disciplined wiki maintainer rather than a generic chatbot. We mirror it as `AGENTS.md` at the repo root for any LLM agent that touches the wiki, and extend it with conventions for the new `people/`, `sources/`, and `matches/` folders.

To be authored after the directory layout is locked in.

## Why This Fits the Hackathon Pitch

- **Hiring as the central thesis** — not a job board, but a deep-dive intelligence layer for the most important decision a founder makes. Bezos and Jobs didn't say "use a job board"; they said hire the best, full stop. We're the tool that makes that practical.
- **Explainable AI** — every page cites sources and tier reasoning. "Why was I matched?" → "Because the wiki says so, here are the citations and tier notes."
- **Updatable by non-technical staff** (GOEO requirement) — drop a URL or text into a form, agent ingests it. (Stretch goal for v1.)
- **Compounding knowledge** — the wiki gets richer every day from agents *and* users. The site never goes stale.
- **No traditional database** — markdown files in a git repo. Falls within our "no user accounts, no DB unless trivial" constraint.
- **Demo-ready early** — Sam's mini wiki is already 280 entries. We can build the UI against real content from day one.
- **Tier system is unique** — no job board, no startup directory uses anything like this. It's the most defensible "creativity" beat we have.
