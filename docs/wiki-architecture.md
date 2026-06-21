# Wiki Architecture

The data layer behind Great Work is a **Karpathy-style LLM wiki**: a persistent, compounding collection of markdown files that agents read, write, and maintain. The web UI is a beautiful read-view over that wiki.

> Reference: [Andrej Karpathy — `llm-wiki.md`](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
>
> See also [wiki-skill-v0.2.0-addendum.md](wiki-skill-v0.2.0-addendum.md): which Great Work conventions to keep as product extensions, and which gaps to migrate onto the shared wiki skill v0.2.0 (size caps, index sharding, BM25 search, relational matching graph).

## Core Idea

Most ecosystem tools are directories or CRMs. They store rows, then ask AI to rediscover meaning every time someone searches.

Great Work should work differently. The agents maintain a readable wiki that compounds:

1. A new source arrives.
2. The agent reads it.
3. The agent updates durable fact pages.
4. The agent creates or improves guides, matches, or answers when judgment is useful.
5. The next user starts from a richer map.

The wiki is not a database pretending to be markdown. It is a public memory system for Utah's rare opportunities: readable by humans, indexable by scripts, and rich enough for agents to reason over at search time.

The product bet is simple: better source material makes better matches. If the wiki captures evidence, needs, offers, caveats, and local context, then search can do the final personalization without forcing every page into a rigid profile.

## Ground Truth

The public Great Work Utah wiki lives in `wiki/`. Sam's existing mini-wiki remains a huge internal seed asset at `legacy_wiki/`: hundreds of entries, a strong inclusion philosophy, and useful examples of bold-prefix markdown headers.

The public schema borrows the human-readable page anatomy, but changes the ontology:

- no YAML frontmatter
- no structured matching profile blocks
- no universal tier on entity pages
- guides replace hubs and separate tier lists
- fact pages and derivative judgment pages stay separate

See [`../wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md) for the schema and [`../wiki/agent_ops/agents.md`](../wiki/agent_ops/agents.md) for the agent contract.

## Layers

### 1. Sources

Raw or summarized evidence:

- official websites
- public profiles
- government records
- university pages
- press releases
- interviews
- articles
- raw intake submissions
- CRM exports
- videos or podcasts

Sources live in `wiki/sources/`. Press releases are useful leads, not neutral proof.

### 2. Fact Pages

Durable dossiers:

```txt
wiki/ventures/
wiki/people/
wiki/helpers/
wiki/resources/
wiki/work/
wiki/sources/
```

Fact pages describe what is known, what matters, what the subject needs or offers, and what remains uncertain.

They do not contain universal rankings.

### 3. Judgment Pages

Derivative and contextual pages:

```txt
wiki/guides/
wiki/matches/
wiki/answers/
```

Judgment pages recommend, rank, synthesize, and explain. They cite fact pages and sources.

The rule:

> Entity pages describe. Guide, match, and answer pages recommend.

## Repo Layout

Working target:

```txt
great-work/
  docs/
  scripts/
  src/
  wiki/
    ventures/
    people/
    helpers/
    resources/
    work/
    sources/
    guides/
    matches/
    answers/
    agent_ops/
      PROMPT.md
      RUN_LOG.md
      LEADS.md
      DECISIONS.md
      SUGGESTIONS.md
      PLAYBOOK.md
```

`wiki/` is the canonical public wiki and should be a repo-owned directory. `legacy_wiki/` may be a symlink to existing research content and is agent-only seed material. Do not cite or link legacy provenance from public pages.

## Page Anatomy

Every page is ordinary markdown with a small bold-prefix header:

```markdown
# Example Biotech

**Status:** Draft
**Confidence:** Medium
**Focus:** life sciences, AI, medical devices
**Stage:** Pre-seed
**Location:** Salt Lake City, UT
**Updated:** 2026-05-09

## Summary

## Impact

## What They Are Building

## What They Need Now

## Who Could Help

## Evidence

## See Also

## Open Questions
```

Python scripts parse:

1. folder -> type
2. filename -> slug
3. H1 -> title
4. bold-prefix header lines -> minimal index fields
5. `##` sections -> body structure

Agents read the prose for meaning. Scripts should not need to understand matching logic.

## Size Discipline

Pages should stay focused enough for humans, agents, and renderers to read cheaply.

- One page should cover one concept: one venture, one person, one helper, one resource, one work, one source, one guide question, one match, or one saved answer.
- Soft cap: 400 lines. When a page crosses this, summarize, split subtopics into their own pages, and link them from `## See Also`.
- Hard cap: 800 lines. Do not let public pages grow past this; split before adding more evidence or long-running commentary.
- Long source trails belong in `wiki/sources/`; fact and judgment pages should carry the claim, the synthesis, and the link to evidence.

Splits should preserve continuity: leave a concise summary on the original page, move the detailed subtopic into a new page with a clear H1, and add reciprocal relative links in `## See Also`.

## Links and Relations

Cross-links are part of the data model, not decorative prose. Use ordinary relative markdown links in a `## See Also` section when a reader should navigate between pages:

```markdown
## See Also

- [Nucleus Grow](../resources/nucleus-grow.md)
- [Business Services for Utah Founders](../guides/find-business-services.md)
```

Use `**Relates:**` bold-prefix header lines when the relationship should be harvested as a graph edge. Keep the Great Work header convention; do not switch to blockquote metadata.

```markdown
**Relates:** helps [Example Biotech](../ventures/example-biotech.md)
**Relates:** cites [Official Website: Example Biotech](../sources/example-biotech-official-site.md)
```

Allowed relation verbs for now are `helps`, `suited-for`, `recommends`, and `cites`. The relation target must be a relative markdown link into `wiki/`. `## See Also` is for navigable context; `**Relates:**` is for explainable matching and graph extraction. Use both when both are true.

## Layout

Every entry is rendered through one of a small set of named layouts (`cover-story`, `caption-only`, `magazine`, `field-guide`, `marginalia`, `postcard`, `manifesto`, `erasure`). The agent picks one with a single bold-prefix line:

```markdown
**Layout:** cover-story
**Hero:** /assets/spiral-jetty-portrait.jpg
**Pull:** *At times the lake rises and the coil disappears.* — Smithson, 1972
```

If no `**Layout:**` is declared, the renderer auto-picks based on the shape of the entry — captions present, hero image, short body, lots of sections. The agent should declare a layout only when it has an opinion about how the entry should feel.

Live demos for every layout (with the original markdown) live in [`docs/wiki-layout-demos/`](./wiki-layout-demos/) and render at `/templates/from-markdown` in the web app. See [`../wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md#layouts-and-imagery) for picking guidance and imagery rules.

## No Universal Entity Tiers

Universal item-level tiers are the wrong primitive for this product.

Different users need different rankings:

- best first calls for university spinouts
- best places for senior ML engineers
- most useful helpers for medical-device founders
- most important historical Utah work
- highest-confidence Nucleus demo matches

Put evidence and impact on the entity page. Put ranking and taste in `guides/`, `matches/`, and `answers/`.

Guide pages can still contain contextual tier lists, but the audience and criteria must be explicit.

## Operations the Agents Run

### Ingest

Triggered by a new source, URL paste, intake submission, or scrape result.

The agent:

1. Reads the source.
2. Identifies existing pages it affects.
3. Updates or creates fact-layer pages.
4. Adds source records where useful.
5. Creates or updates a guide, match, or answer only if there is a real recommendation or synthesis to preserve.
6. Appends to `wiki/agent_ops/RUN_LOG.md`.

### Ask

Ask is article generation, not chat. The user asks a question; the guide writes an answer with citations.

The agent:

1. Reads the index and candidate pages.
2. Reads relevant fact pages and sources.
3. Streams a concise article to the UI.
4. Files durable answers into `wiki/answers/` when they are worth preserving.
5. Promotes broadly useful syntheses into `wiki/guides/` over time.

Example questions:

- "Who should a first-time medical-device founder talk to first?"
- "Which helpers are useful for university spinouts?"
- "What Utah resources should Dr. Amir use before forming a company?"
- "Which senior operators seem suited for a hard-tech team?"

### Match

The matching agent makes judgment calls from prose, not from a rigid matching profile.

It reads needs, offers, caveats, evidence, and context from fact pages, then writes a `matches/` page when a specific recommendation is worth preserving.

A match page explains:

- what each side appears to need or offer
- why the match makes sense
- risks and unknowns
- suggested next step
- evidence

### Lint

Python scripts and/or agents check:

- missing H1s
- missing required header lines
- stale `Updated` dates
- duplicate inferred IDs
- broken wiki links
- orphan fact pages
- derivative pages without cited sources or fact pages
- pages above the 400-line soft cap or 800-line hard cap
- malformed `**Relates:**` links or unknown relation verbs
- accidental private contact information

### Evolve

Every interaction can improve the wiki:

- Ask answers become `answers/`.
- Repeated questions suggest new `guides/`.
- Hand-raises become fact pages or source records.
- Useful recommendations become `matches/`.
- Uncertainty becomes explicit open questions.

The mantra: **the wiki at month 12 should be unrecognizably better than month 1, even if no one manually rewrites the whole thing.**

## Search

At hackathon scale, a generated JSON index is enough. It should include title, inferred type, slug, status, confidence, focus, location, audience, updated date, and section headings.

For client-side search, Fuse.js or FlexSearch is plenty. Proper embeddings can come later without changing the file format.

## Why This Fits the Hackathon Pitch

- **Explainable matching** — recommendations cite fact pages and sources.
- **Human-readable maintenance** — non-technical people can edit markdown without touching YAML or a database.
- **Helpers are first-class** — mentors, advisors, investors, and business-service providers get real pages and guide placement.
- **Contextual rankings** — different audiences get different recommendations instead of one universal score.
- **Compounding knowledge** — sources, facts, guides, matches, and answers all accumulate.
- **Demo-ready** — a few strong pages can show a living system without pretending every workflow is automated yet.
