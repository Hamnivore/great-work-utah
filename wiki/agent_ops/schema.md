# Wiki Schema

**Status:** Draft
**Confidence:** Medium
**Updated:** 2026-05-09

How the wiki is organized, what each page should look like, and what the agent should write where. This is the format reference. The companion files are:

- `wiki/agent_ops/PLAYBOOK.md` — editorial guardrails, intake patterns, parallel work
- `wiki/agent_ops/index.md` — inventory of every page currently in the wiki
- `wiki/agent_ops/layout-exemplars.md` — strongest real entry per layout
- `wiki/agent_ops/agents.md` — the agent's mission and operating loop

The principle: **thin header, rich body**. Scripts parse what they need for indexing and stale-page checks. The agent does the real work in the prose.

Do not turn pages into structured matching profiles. Do not create YAML frontmatter. The wiki is a wiki, not a CRM.

## Two Layers

The wiki is split by epistemic role:

```txt
wiki/
  ventures/    fact layer
  people/      fact layer
  helpers/     fact layer
  resources/   fact layer
  work/        fact layer
  sources/     fact layer

  guides/      judgment layer
  matches/     judgment layer
  answers/     judgment layer

  agent_ops/   operations
```

The rule:

> Entity pages describe. Guide, match, and answer pages recommend.

### Fact layer

Durable descriptions of real things.

```txt
ventures/   startups, labs, spinouts, companies, nonprofits, serious initiatives
people/     founders, operators, researchers, students, executives, candidates
helpers/    advisors, mentors, investors, service providers, firms, programs
resources/  grants, accelerators, capital, labs, facilities, state programs, courses
work/       examples of great Utah work, historical or current
sources/    source records and raw intake notes
```

Entity pages should answer: what is known, what is useful, what is uncertain, and what evidence supports it. They must not contain universal rankings.

#### People vs. Helpers vs. Resources

These three folders overlap in practice, so use this rule:

- **`people/`** — a single named **human**. The page is a biography: who they are, what they're working on, what they offer, what they're looking for. One name on the page. If the same human shows up on five different helper pages, they still get one `people/` page that those helper pages link to.
- **`helpers/`** — an **organization, firm, fund, or institution** whose primary public role is to deliver hands-on, relational help. You'd reach out to them and they would help you specifically — a law firm, a venture fund's investment team, a fractional-CFO firm, a connector institute. The page describes who they are, how they help, who they fit best, and what to watch out for.
- **`resources/`** — a **path, program, or facility** you'd apply to, qualify for, or use. Often standardized, application-based, or self-service — a grant program, a regulatory sandbox, an accelerator cohort, a course, a fellowship, a dataset, a state credit initiative. The page describes what it provides, who it helps, how to access it, and at what cost.

A useful test:

> If a reader's next action is "I should talk to **them**," the page is a helper.
> If the next action is "I should apply to / sign up for / use **it**," the page is a resource.
> If the next action is "I should reach out to **this specific person**," the page is a person.

Edge cases:

- A nonprofit that does both mentoring and runs a program (SBDC, SCORE, WBC) can sit in either `helpers/` or `resources/`. Pick the framing that matches its strongest public identity, and link from the other folder if useful. Don't duplicate.
- A venture fund: the **fund** is a resource (a capital path); the **firm and its partners** are helpers and people. A single page is fine for small funds; bigger funds may earn one page per layer.
- A specific named investor or advisor is always a person, not a helper. The firm is the helper.
- Business-service providers (lawyers, accountants, fractional CFOs, recruiters) are **first-class helpers**. Do not bury them in `resources/`.

### Judgment layer

Recommendations, rankings, and synthesis.

```txt
guides/     durable maps, playbooks, contextual rankings, journey pages
matches/    specific "these people should talk" recommendation artifacts
answers/    saved Ask articles and one-off syntheses
```

Derivative pages must cite the fact layer and make their audience explicit.

## Identity

Identity is inferred from folder + filename. No `id:` field, no frontmatter.

```txt
ventures/example-biotech.md          -> venture:example-biotech
helpers/helen-park.md                -> helper:helen-park
guides/find-business-services.md     -> guide:find-business-services
```

Filenames must be lowercase kebab-case. Avoid suffixes like `-profile`, `-page`, `-new`, `-2`. If a subject has multiple roles, place it where it best serves the product *now* — a law firm that mainly helps founders belongs in `helpers/`, not `ventures/`.

`wiki/` is the canonical public wiki. `legacy_wiki/` is internal seed material. Do not mention legacy provenance on public pages; record it in `wiki/agent_ops/` or the worklist.

## Page Header

Every page starts with an H1 and a small set of bold-prefix lines. No YAML.

```markdown
# Page Title

**Status:** Draft
**Confidence:** Medium
**Focus:** life sciences, AI, medical devices
**Location:** Salt Lake City, UT
**Updated:** 2026-05-09
**Layout:** magazine
**Hero:** /assets/page-hero.jpg
**Pull:** *A sentence the layout will use as a pull-quote subtitle.*
```

### Required lines

```txt
Status
Confidence
Updated
```

### Optional lines

Use only when they genuinely help.

```txt
Focus           comma-separated topics
Location        city, region, or "Utah"
Audience        guides/matches/answers — who the page is written for
Stage           ventures — pre-seed, seed, growth, public, etc.
Era             work pages — historical period
Derived From    answers — wiki IDs the synthesis draws on
Parties         matches — wiki IDs of the two sides
Strength        matches — see allowed values below
Source Type     sources — Press Release, Official Website, etc.
URL             sources — link to the original
Publisher       sources — who published it
Accessed        sources — when the agent read it
Layout          render layout (see below)
Hero            landscape image for the layout
Hero caption    optional caption for the hero
Portrait        tall image for cover-story
Pull            italicized pull-quote subtitle
```

Headers are for navigation and maintenance. **Judgment belongs in the prose.**

### Allowed values

```txt
Status:     Stub | Draft | Useful | Strong | Needs Review | Deprecated
Confidence: Low | Medium | High
Strength:   Weak | Plausible | Strong | Exceptional | Unknown
```

Use ordinary comma-separated text for `Focus`, `Location`, and `Audience`. Don't force controlled vocabularies until a real validation need emerges.

## Layouts and Imagery

Every entry is rendered through one of a small set of named layouts. Pick a layout that **matches the shape of the content**, then provide the imagery the layout needs. Declare it with one line:

```markdown
**Layout:** cover-story
```

If the line is omitted the renderer auto-picks based on the entry's shape (captions present? hero image? short body? lots of sections?). Auto-pick is fine. **Only declare a layout when you have a real opinion about how the entry should feel.**

Live demos for every layout, with their original markdown, live in [`docs/wiki-layout-demos/`](../../docs/wiki-layout-demos/) and render at `/templates/from-markdown` in the web app. Read those before writing layouts at scale. Track strong real-world exemplars in `wiki/agent_ops/layout-exemplars.md`.

### When to pick what

| Layout | When to pick it | What the markdown needs |
|---|---|---|
| `cover-story` | A single human or single landmark deserves a magazine cover. | `**Portrait:**` (or `**Hero:**`) and a `**Pull:**` line. |
| `caption-only` | The story is fundamentally photographic. The pictures are the article. | A `## Captions` section with image+italic-caption pairs. |
| `magazine` | A flagship long-read with a hero photograph and a clear "why it matters" beat. | `**Hero:**`, optional `**Hero caption:**`, optional `**Pull:**`. A `## Why It Matters` (or `## Impact`) section becomes the inset pull-quote. |
| `field-guide` | Reference-shaped pages — helpers, resources, ventures with structured info that benefits from numbered sections. | Just the normal section structure. |
| `marginalia` | Long-form arguments and guides where side-notes earn the space. | Inline `:::margin\n*note body*\n:::` directives. |
| `postcard` | Short, intimate pages — a person, a single resource, a not-yet-fleshed-out venture. ~250 words or less. | `**Hero:**` (small photo), `## Summary`. |
| `manifesto` | A page that *is itself an argument*. Each section is one declaration. | One sentence per section is enough. |
| `erasure` | A page about a redacted source, a missing record, or an archive gap. | Normal sections; the renderer redacts ~80% deterministically. |

When in doubt, **omit `**Layout:**` and let auto-pick handle it.**

### Imagery hierarchy

For any fact-layer page, *try* to find a primary photograph or portrait. In priority order:

1. **A real, license-clean photograph** linked from the entry's own evidence — official press photo, Wikimedia Commons, CC-licensed Unsplash. Prefer this when available.
2. **A photograph the agent can confidently attribute** even if rights need to be cleared later. Note the attribution work in `## Open Questions`.
3. **A picsum.photos placeholder** seeded by a memorable string when no licensed image is available yet:

   ```
   **Hero:** https://picsum.photos/seed/recursion-lab-1/1600/1100
   ```

   Picsum is deterministic on the seed. Use a seed specific to the entry. When real imagery arrives, swap the URL; the seed naming becomes a record of what the slot wanted.

**Never** use a photograph in a way that implies a relationship that doesn't exist — no founder portrait we don't have permission for, no helper headshot we haven't sourced.

### What each layout needs to sing

- **`cover-story`** — one tall portrait (3:4) and one sentence to use as the subtitle.
- **`magazine`** — one landscape hero (3:2) and one "why it matters" beat in the body.
- **`caption-only`** — five photographs and five sentences. Order matters; let the captions read as a sequence.
- **`postcard`** — one wide hero (5:3) and ~150 words of summary.
- **`marginalia`** — body prose plus one or two `:::margin` notes per major section.
- **`field-guide`** — no imagery required. Numbered sections do the work.
- **`manifesto`** — no imagery. One declarative sentence per section.
- **`erasure`** — no imagery. The redaction is the point.

If the entry doesn't have what a layout needs, **pick a different layout**.

### Retiring the demos

The demos in `docs/wiki-layout-demos/` are training-data scaffolding. They age out as the wiki becomes self-referencing:

1. Produce a strong real entry that uses a layout well? Append it to `wiki/agent_ops/layout-exemplars.md` under that layout's heading with a one-line note.
2. The next agent reads `layout-exemplars.md` *before* the demos folder.
3. When every layout has at least two real exemplars, the demos folder can be deleted. Mention this in the end-of-run log.

The mantra: **the wiki should be the textbook for the wiki.**

## No Universal Entity Tiers

Do not put a universal tier on entity pages. An entity can be excellent for one founder and irrelevant for another. Put evidence and impact on the entity page. Put rankings and taste in guides, matches, and answers.

If you create a ranked list, **state the audience and criteria**.

### Meaningful-work labels

For `guides/find-meaningful-work.md` and similar discovery surfaces, prefer contextual labels over generic routing language like "First Call":

```txt
Category-Defining Anchor
Hidden Gem
Rare Fit
Emerging Bet
Useful but Caveated
Watchlist
```

These labels are allowed only in guide, match, and answer pages — never as universal tiers on entity pages. Always state audience and criteria before ranking or grouping.

## Fact Page Templates

### Venture

Startups, labs, spinouts, companies, nonprofits, serious initiatives.

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
## Utah Context
## Evidence
## Open Questions
```

### Person

Founders, operators, researchers, students, executives, candidates, contributors.

```markdown
# Helen Park

**Status:** Draft
**Confidence:** Medium
**Focus:** engineering leadership, regulated software, hard tech
**Location:** Park City, UT
**Updated:** 2026-05-09

## Summary
## Impact
## What They Offer
## What They Are Looking For
## Proof of Work
## Good Fits
## Public Connection Path
## Evidence
## Open Questions
```

Do not include private contact details in public pages.

### Helper

Mentors, advisors, fractional executives, angel investors, venture funds, attorneys, accountants, recruiters, grant writers, commercialization experts, regulatory consultants, and service providers.

```markdown
# Example IP Firm

**Status:** Draft
**Confidence:** Low
**Focus:** IP, patents, university spinouts, medical devices
**Location:** Salt Lake City, UT
**Updated:** 2026-05-09

## Summary
## Impact
## How They Help
## Best-Fit Founders
## Cost / Engagement Model
## Proof Points
## Good Matches
## Cautions
## Evidence
## Open Questions
```

Useful helper categories to mention in prose:

```txt
legal, IP, patents, accounting, tax, fractional CFO, fundraising, grants,
government contracting, defense procurement, FDA, clinical trials, quality systems,
cybersecurity compliance, GTM, sales, marketing, product, design, AI, software,
manufacturing, supply chain, hardware, international trade, recruiting, executive
coaching, board governance, mentorship, capital, customer introductions,
university commercialization
```

### Resource

Reusable support paths: grants, accelerators, state programs, labs, facilities, capital sources, courses, datasets, fellowships, competitions.

```markdown
# Nucleus Grow

**Status:** Draft
**Confidence:** Medium
**Focus:** non-dilutive capital, research-backed ventures, commercialization
**Location:** Utah
**Updated:** 2026-05-09

## Summary
## Impact
## Who It Helps
## What It Provides
## How To Access It
## Cost / Eligibility
## Best Fits
## Evidence
## Open Questions
```

### Work

Examples of great Utah work, historical or current.

```markdown
# Utah Computer Graphics Program

**Status:** Useful
**Confidence:** High
**Focus:** computing, graphics, research, university innovation
**Location:** Salt Lake City, UT
**Updated:** 2026-05-09

## Summary
## Impact
## What Was Created
## Why It Mattered
## Utah Context
## People and Institutions
## Lessons for Builders
## Evidence
## Open Questions
```

### Source

Source records and raw intake notes.

```markdown
# Official Website: Example Biotech

**Status:** Useful
**Confidence:** Medium
**Source Type:** Official Website
**URL:** https://example.com
**Publisher:** Example Biotech
**Accessed:** 2026-05-09
**Updated:** 2026-05-09

## Summary
## Useful Claims
## Reliability Notes
## Related Pages
```

Source pages use `Confidence` to describe source reliability, not the truth of every claim inside.

## Judgment Page Templates

### Guide

Maps, playbooks, contextual tier lists, journey pages.

```markdown
# Business Services for Utah Founders

**Status:** Draft
**Confidence:** Medium
**Audience:** founders, researchers, first-time CEOs
**Focus:** legal, accounting, regulatory, grants, GTM
**Updated:** 2026-05-09

## Overview
## Start Here
## By Need
### IP and Patents
### FDA / Regulatory
### Fundraising and Finance
## Contextual Ranking: Best First Calls for Medical-Device Founders
### First Call
### Strong Fit
### Useful But Situational
## Caveats
## Sources
## Open Questions
```

Use tiers inside guides only when the criteria are stated. Global S/A/B tiers are still forbidden on entity pages.

Default guides to maintain:

```txt
guides/nucleus-demo-matches.md
guides/find-a-cofounder.md
guides/find-an-advisor.md
guides/find-business-services.md
guides/find-meaningful-work.md
guides/commercialize-research.md
guides/startup-capital-in-utah.md
guides/utah-deep-tech-map.md
```

### Match

Specific recommendation artifacts.

```markdown
# Example Biotech <-> Example IP Firm

**Status:** Draft
**Confidence:** Medium
**Audience:** first-time medical-device founder
**Focus:** medical devices, IP, university spinout
**Parties:** venture:example-biotech, helper:example-ip-firm
**Strength:** Plausible
**Updated:** 2026-05-09

## Recommendation
## Why This Match Makes Sense
## What Example Biotech Needs
## What Example IP Firm Appears To Offer
## Risks and Unknowns
## Suggested Next Step
## Evidence
```

Never imply private willingness, availability, endorsement, or a relationship unless it is sourced or came from an explicit intake submission.

### Answer

Saved Ask articles and one-off syntheses.

```markdown
# Who should a first-time university spinout founder talk to first?

**Status:** Draft
**Confidence:** Medium
**Audience:** first-time founder, university researcher
**Focus:** commercialization, advisors, capital
**Derived From:** resource:nucleus-grow, helper:example-ip-firm, work:utah-computer-graphics-program
**Updated:** 2026-05-09

## Short Answer
## Why
## Recommended First Calls
## What To Read Next
## Caveats
## Sources
```

If an answer is durable and broadly useful, later promote or summarize it into a guide.

## Sources and Citations

Important claims need a source page.

Create or update source pages for:

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

Use inline wiki IDs when useful:

```markdown
The program appears designed for research-backed ventures moving toward commercialization. [source:nucleus-grow-page]
```

Use cautious language when source quality is weak:

- "According to..."
- "The available evidence suggests..."
- "This appears relevant because..."
- "We believe..."

**Press releases are leads, not neutral evidence.**

## Page Quality

Prefer:

- concise summaries
- readable prose
- specific needs and offers
- source trails
- open questions
- practical next steps
- a layout that matches the shape of the content
- at least one licensed or clearly-attributed photograph for marquee fact pages

Avoid:

- vague praise
- unsourced importance claims
- fake certainty
- private contact information
- duplicate pages
- generic directory descriptions
- long pages that do not improve decisions
- structured fields humans will hate maintaining
- forcing a layout onto an entry that doesn't have what the layout needs
- photographs the team has not cleared rights for, used in a way that implies a relationship

## Parser Contract

Scripts that read the wiki should stay intentionally simple:

1. Infer **type** from the folder.
2. Infer **slug** from the filename.
3. Read **title** from the first `#` line.
4. Parse **bold-prefix header lines** until the first `##`.
5. Parse **body sections** by `## Heading`.
6. Build an index from title, type, slug, status, confidence, focus, location, audience, updated, and section headings.

Do not require scripts to understand matching logic. Agents read the prose.

## Validation Rules

Minimum validation:

- every public markdown file has an H1
- every public page has `Status`, `Confidence`, and `Updated`
- page type is inferable from folder
- filename is kebab-case
- no duplicate inferred IDs
- derivative pages cite or name their source pages in `Derived From`, `Parties`, `Evidence`, or body text
- source pages include either `URL` or a clear explanation of the source origin
- private contact information is not present in public pages
