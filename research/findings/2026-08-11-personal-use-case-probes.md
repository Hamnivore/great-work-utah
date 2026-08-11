# Personal-use-case probes — physical building, sponsorship, equipment, and ML work

**Date:** 2026-08-11  
**Result:** four reproduced failures fixed; post-fix probes pass  
**Privacy:** use cases were abstracted from a private local operating wiki. No personal facts, page contents, identities, constraints, or provenance-specific details were copied into great-work.

## Method

Two subagents independently read the private wiki under its own privacy instructions and extracted only generic intents that a Utah resident or builder could plausibly ask. They then tested the public great-work corpus through the same surfaces a visiting agent receives: `public/llms.txt`, generated views, `api/search.ts`, and individual pages.

The parent agent reproduced each reported failure against `api/_search-corpus.mjs`. Convergent failures were prioritized over one-agent findings. Fixes were required to stand on public primary sources and to be useful without knowing anything about the private user.

## Reproduced failures

1. **ML/CV talent disappeared from the role view.** Several venture pages explicitly asked for machine-learning, perception, or computer-vision work, but their `**Roles:**` metadata omitted `data-science`. Exact text search could find some pages; the generated data-science directory could not.
2. **Fiscal sponsorship was not an answer.** `fiscal sponsorship` returned no page. `fiscal sponsor` returned only an unrelated page whose Open Questions happened to contain the phrase.
3. **Public surplus equipment was absent.** `surplus property`, `institutional surplus`, and equipment-auction variants returned no actionable Utah resource.
4. **Utah County physical-space knowledge was fragmented.** Useful facilities existed as isolated pages under different vocabulary—incubator, maker space, R&D coworking, innovation academy—but there was no comparison by actual task, and common compound probes returned nothing useful.

## Fixes

- Added `data-science` role attribution to Techcyte, Autonomous Solutions, Trace AQ, and Vivint Smart Home, based on their existing needs prose.
- Added `utah-film-center-fiscal-sponsorship.md`, including application sequence, verified fees, boundaries, and conflicting official review-time claims.
- Added `utah-state-surplus-property.md`, distinguishing state public sales from the restricted federal-surplus program and documenting auction risks.
- Added `orem-library-makerspace.md` as a low-commitment public-equipment route.
- Added `find-prototyping-space-in-utah-county.md`, routing by the work to be done rather than by organization name.
- Replaced imported category-style Focus values on iHub and Make Utah with user-language discovery terms.
- Added a physical-space/equipment procedure to `public/llms.txt` so a cold agent has a first hop without already knowing a facility name.

## Post-fix checks

The generated corpus now resolves:

- `fiscal sponsorship` → Utah Film Center Fiscal Sponsorship
- `surplus property` → Utah State Surplus Property
- `makerspace in Utah County` → Find Prototyping and Project Space in Utah County
- `prototype space` → the guide plus iHub and Make Utah

The generated `role-data-science.md` now includes all four corrected ventures. Wiki lint reports zero errors and zero warnings; all 46 automated tests pass; the production build completes and prerenders the expanded corpus.

## Remaining gaps

- No verified general-purpose Utah County facility is documented for unusually large, loud, long-running, or public-facing installations.
- Public facility pages still rarely publish machine-level availability, training, storage, insurance, or complete fee schedules. The guide therefore routes agents to confirm these rather than guessing.
- The broader role-metadata corpus may contain other semantic mismatches that are not expressible with a small keyword audit. Repeat the text-versus-role comparison when a real user query reveals one.
