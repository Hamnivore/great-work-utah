# Future Site Wishlist

This is a holding pen for ideas that might belong in a future version of the site. None of these are commitments. The bar is: does this make greatutah.work more useful to visiting agents while preserving radical simplicity?

## Agent Experience

- **MCP server / skill for contributions.** Give returning agents a durable, permissioned way to submit notes, page drafts, corrections, and review metadata without re-learning the contribution interface every visit.
- **Task-shaped entrypoints.** Add compact prompts or views for common user asks: find work, find collaborators, find fundable companies, understand a sector, compare organizations, or identify overlooked gems.
- **Answerable graph queries.** Let agents ask structured questions like "Who needs RF engineers near Salt Lake City?" or "Which energy ventures have field operations and hiring needs?" without hand-scanning every page.
- **Better citation surfaces.** Make it easier for agents to quote exactly why they recommended a person, company, or opportunity, including source confidence and last-reviewed dates.
- **Agent self-checks.** Provide lightweight checklists for visiting agents before they report back to users: did you scan needs, ventures, helpers, and resources; did you consider impact magnitude; did you note uncertainty?



## Contribution Ladder

- **Low-friction public gap reports.** A tiny contribution path for "missing page," "stale fact," "bad link," "misplaced page," or "important but uncertain" reports.
- **Review queues by confidence.** Separate easy mechanical fixes from high-judgment additions so maintainers can batch-review without losing subtle contributions.
- **Attribution-assist workflows.** Tools that help an agent add metadata to existing pages by proposing values, showing precedents, and flagging low-confidence choices for human review.
- **Source freshness nudges.** Views that surface pages with old source dates, weak citations, or strong claims that deserve periodic re-checking.



## Navigation And Views

- **Regional overlays (in progress, 2026-07-14).** The privacy/provenance schema, correction/removal path, generated `/locations.geojson` feed, and initial verified public sites are implemented. Omit residences, private workplaces, and individuals; use approximate anchors only for safe public areas/sites where exactness is unnecessary or unsupported. Remaining: ship and cold-test the agent-first proximity endpoint in production, expand beyond the initial 8/393 region-attributed pages, then build the human map only after the endpoint establishes a stable contract.
- **Generated opportunity boards.** Views that synthesize talent needs, open problems, capital needs, and collaboration opportunities across pages.
- **User-intent maps.** Generated pages organized around why someone arrived, not around taxonomy: "I want to work on climate," "I want to fund ambitious Utah companies," "I want to find deep-tech collaborators."
- **Comparison pages.** Agent-readable views that compare similar ventures, labs, or programs by domain, impact bet, stage, geography, and needs.
- **Gem surfacing.** Explicit rankings or callouts for high-upside, under-attended work, with the reasoning exposed rather than hidden in a score.

## Human Interface

- **A quiet browse mode.** A human-readable interface that still respects the agent-first premise: fast lists, source previews, filters, and copyable links instead of a heavy portal.
- **Contribution handoff pages.** Polished pages for humans who arrive through an agent: review the proposed contribution, approve sensitive details, and submit.
- **Maintainer dashboard.** A minimal private workflow for triaging issues, PRs, stale pages, missing citations, and attribution gaps.
- **Readable impact explanations.** Human-facing summaries of the charter's impact logic so contributors understand why magnitude, uncertainty, and counterfactuals matter.



## Research Harness

- **Multi-model regression runs.** Repeat the cold-agent tests across GPT, Claude, Gemini, and smaller models whenever the interface changes.
- **Scenario library.** A growing set of realistic user asks with known good matches and expected contribution behavior.
- **Navigation cost metrics.** Track fetched files, tokens, missed gems, false positives, citations used, and whether agents attempted appropriate contributions.
- **Contribution safety probes.** Tests that check whether agents correctly distinguish public knowledge from user-sensitive information before submitting.



## Data And Schema

- **Full-page attribution.** Extend the attribution loop beyond the pilot domain until all fact pages carry useful typed metadata.
- **Schema drift reports.** Detect pages whose metadata no longer matches conventions, whose sections are incomplete, or whose placement has become ambiguous.
- **Impact-bet fields.** More explicit metadata for the page's core impact claim, uncertainty, upside bound, downside bound, and counterfactual theory.
- **Relationship metadata.** First-class links for investors, founders, acquirers, spinouts, suppliers, customers, collaborators, competitors, and talent pipelines.



## Publishing And Portability

- **Reusable LLM-first wiki kit.** Extract the mechanics into a template other regions or domains can reuse once greatutah.work proves them.
- **Public methodology essays.** Publish the research findings as a coherent guide to designing websites for agents.
- **Static data bundle.** Offer a versioned archive of pages, views, metadata, and conventions for offline or local-agent use.
- **Change feeds.** Agent-readable feeds for new pages, changed pages, stale pages, and requested contributions.



## Anti-Wishlist

These are tempting but should remain suspect unless a cold-agent test proves they help.

- Heavy personalization that requires accounts before value is visible.
- Search boxes that hide the structure instead of improving traversal.
- Rich visual polish that slows agents down or makes the human site feel more important than the corpus.
- Complex taxonomies maintained by hand.
- Scores without exposed reasoning.
- Contribution flows that require users or agents to commit to a full page before offering useful partial knowledge.
