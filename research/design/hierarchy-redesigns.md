# Six hierarchy redesigns

**Date:** 2026-07-09 · **Status:** probed — see `findings/2026-07-09-hierarchy-probes.md` for structural metrics, 7 placement probes, and the synthesis. Outcome: none of the six wins as a *storage* schema; most win as *generated views* over flat, richly-attributed storage ("views over attributed storage"). Successor design work: placement-conventions doc + page-metadata spec + one-domain attribution pilot.

## How the reference wikis do it

**Wikipedia** stores articles in a **flat namespace** — there is no hierarchy in where an article lives. All structure is *overlaid navigation*, several systems at once:

- **Categories** — a poly-hierarchical DAG (not a tree): every article sits in several categories; categories nest but multiple parents are normal. Effectively a curated tag lattice.
- **Navboxes & infoboxes** — hand-curated link tables stamped onto every page of a domain ("Companies of Utah"); the highest-signal linked navigation, maintained once, appears everywhere.
- **See also / inline links** — associative navigation; the thing LLMs are naturally best at following.
- **Lists & portals** — editorial hub pages ("List of…", topic portals) that act as curated entry points.
- **Redirects** — synonyms resolve to canonical pages, which quietly fixes most "wrong name" navigation failures.

The lesson: Wikipedia *separates storage from navigation* and runs **multiple navigation systems simultaneously**, most of them curated overlays that are cheap to regenerate or restamp. Hierarchy is a view, not a location.

**Other traditions:** DokuWiki/Confluence use real folder trees (works until a page belongs in two places — then it decays); Wikibooks uses hierarchical subpages for linear material (books); TiddlyWiki atomizes everything and navigates purely by tags + transclusion; **Zettelkasten / digital gardens** reject categories entirely — dense links plus a handful of curated **Maps of Content (MOCs)** as entry hubs; Gwern-style sites use *few giant documents* with deep tables of contents; faceted classification (library science) says: classify along several independent axes and let the reader pick the axis, because no single tree fits all queries.

Our current schema is a **type tree** (ventures/, people/, resources/…). Type is the *least* query-shaped axis we have — nobody asks "show me ventures"; they ask by domain ("climate"), by intent ("fund me"), or by fit ("needs someone like me"). That mismatch is exactly what the derived `needs.md` papered over in round 3.

## The six schemas

Each is a complete reorganization principle. All keep: flat stable page URLs (Wikipedia's lesson — moving files breaks the web; views should change instead), the section schema inside pages, sources as the evidence layer, and a root manual. They differ in **what the primary navigation axis is** and **what the atom is**.

### H2 — Facet lattice ("Wikipedia flat")
Pages live in one flat namespace; every page declares facets (`type`, `domain`, `region`, `stage`, `needs`). Navigation = one generated index per facet value (`by-domain/energy.md`, `by-region/ogden.md`, `by-need/mechanical-engineers.md`, `by-type/ventures.md`…) plus a facet directory at root. No page has one home; every axis is first-class.
*Bet:* no single tree fits all queries, so ship every tree.
*Predicted failure mode:* index explosion (dozens of docs), and facet quality becomes the whole game — garbage tags, garbage navigation.

### H3 — Domain tree ("the encyclopedia")
Top level = sectors: `energy/`, `health-bio/`, `aerospace-defense/`, `computing/`, `materials-mfg/`, `space-science/`, `capital-programs/`, `culture-place/`. Each domain has a **hub page** (Wikipedia portal/navbox: the players, the money, the history, the needs of that sector, curated in one screen) and contains all entity kinds for that domain.
*Bet:* queries are domain-shaped ("climate/energy work"), so locality wins — one hub fetch loads the whole relevant world.
*Predicted failure mode:* cross-domain entities (a defense-and-energy company; a university lab feeding every sector) get misfiled or duplicated; boundary disputes are permanent.

### H4 — Journey tree ("intent-first")
Top level = the user's question: `find-work/`, `fund-a-company/`, `build-here/`, `learn-what-is-possible/`, `find-help/`. Each contains curated hubs ordered by stage; facts live in a flat `entities/` store the hubs link into. The judgment layer *is* the hierarchy.
*Bet:* navigation should mirror intent — the agent lands, picks its user's question, and every hop from there is on-task.
*Predicted failure mode:* N journeys × M entities means every new page must be woven into several journeys or it's invisible; unanticipated intents have no home at all.

### H5 — MOC graph ("Zettelkasten")
No categories anywhere. Flat pages, dense typed links, and ~8 hand-curated **Maps of Content**: The Energy Map, The Money Map, The Talent-Needs Map, The History Map, The People Map… Rule (lint-enforced): every page reachable within 2 link-hops of some MOC. Root lists the MOCs.
*Bet:* link-following is the single thing LLMs do best; curation beats classification; the graph is the structure.
*Predicted failure mode:* MOC curation is a standing human/agent editorial burden; a stale map silently orphans pages; recall depends on curators noticing everything.

### H6 — Opportunity ledger ("the marketplace")
Change the atom. Primary content = `opportunities/` — one page per *actionable opening* (a need, a gap, an open problem, a funding window), each with evidence and an expiry/review date, linking to orgs. `orgs/` become reference cards; `capital/`, `proofs/` (history), `people/` support. Root navigation = the live opportunity board, grouped by what-you-bring.
*Bet:* the product is opportunity discovery; organize the wiki around what someone can *do*, not what exists. Also the natural shape for contribution ("I know an opening" is a smaller atom than "here is a company profile").
*Predicted failure mode:* opportunities go stale fast (freshness burden dwarfs org pages); background/context knowledge has no obvious home; risks becoming the job board we swore we weren't.

### H7 — Codex ("few big files")
~10 compendium documents, one per domain: `codex/energy.md` (~everything about energy in Utah: players, needs, money, history, open questions — 50–150KB each, deep internal ToC), plus a 1-screen root. Entity pages remain as the editable source of truth; codexes are **generated concatenations** ordered for reading.
*Bet:* LLM-native economics — one fetch = full domain context, no navigation at all inside a domain; big coherent documents are how models read best.
*Predicted failure mode:* cross-domain queries need 2–3 big files (expensive); files outgrow context windows as the wiki grows; humans hate editing giants (mitigated: generated, not edited).

*(H1, the improved type tree with derived indexes, already exists and tested well in round 3 — it stays as the control.)*

## Testing philosophy (maintainer directive)

Tests here **surface why a design fails**, they don't crown winners — especially because 650 existing pages were written *for* the type tree, which handicaps every alternative (facets must be inferred from focus tags; MOCs and journey hubs are generated approximations of what a curator would write; misfilings in the domain tree are partly classifier artifacts). A schema that stumbles on generated scaffolding may still be right after real curation — what we're listening for is the *kind* of stumble: ambiguity, orphaning, staleness, fan-out, cost.

Two test layers:

**Structural metrics (deterministic, no agents):** for each generated overlay — navigation-layer size (bytes to read before any page), page coverage (fraction of the 650 reachable from nav docs), depth (fetches from root to an arbitrary page), gem path length (fetches to each ground-truth gem), and classification ambiguity (pages the domain classifier couldn't place, or placed in 2+ domains — a real signal about H3/H7 boundaries, not just tooling noise).

**Placement probes (1 cheap agent per schema):** give a cold agent the schema's root doc plus three new fact bundles — (a) a clean single-domain venture, (b) a cross-cutting entity (defense *and* energy), (c) a historical achievement — and ask *where does each go, what navigation must update, and what was ambiguous?* This measures the schema as a **writing target** (the compaction/contribution question): a schema agents can't place into deterministically will decay no matter how well it reads. The agent's stated ambiguities are the deliverable.

Navigation probes (the expensive kind, à la rounds 1–3) come later, on the 2–3 schemas that survive structural + placement analysis — with the H1 control, same scenarios, n≥2.

## Prior expectations (so the tests can surprise us)

On logic alone: H3/H7 fit query shape best but pay a permanent boundary tax; H2 is the most future-proof reader but the weakest writer (facet discipline); H4 is the best first-fetch experience and the worst maintenance bargain; H5 matches LLM strengths but bets everything on curation; H6 is the boldest product statement and the biggest freshness liability. The likely end state is **hybrid, Wikipedia-style: flat storage + several generated overlays** (domain hubs + facet indexes + needs board), which is H2/H3/H6 as *views* over H5-style flat storage. The probes should tell us which views earn their maintenance cost.
