# Great Work Utah Wiki Agent Run Log

## Run: 2026-05-16 MDT - Historical work anchors migration

### Seed Worklist Item

- item: 1. Legacy Research Wikis
- starting status: first_pass
- ending status: first_pass

### Goal

Add the first public `wiki/work/` entries from the legacy `great_work` corpus and create a guide that connects those historical anchors to the current venture map.

### Files Read

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/PLAYBOOK.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/index.md`
- `legacy_wiki/great_work/README.md`
- `legacy_wiki/great_work/computing-and-software/⭐utah-computer-graphics-program.md`
- `legacy_wiki/great_work/medicine-and-biology/⭐capecchi-gene-targeting.md`
- `legacy_wiki/great_work/aerospace-and-propulsion/⭐thiokol-solid-rocket-motors.md`
- `legacy_wiki/great_work/industry-and-infrastructure/⭐golden-spike-transcontinental-railroad.md`
- `legacy_wiki/great_work/culture-and-arts/⭐spiral-jetty.md`

### Files Created

- `wiki/agent_ops/locks/2026-05-16-historical-work-anchors.md`
- `wiki/work/utah-computer-graphics-program.md`
- `wiki/work/capecchi-gene-targeting.md`
- `wiki/work/thiokol-solid-rocket-motors.md`
- `wiki/work/golden-spike-transcontinental-railroad.md`
- `wiki/work/spiral-jetty.md`
- `wiki/guides/utah-deep-tech-map.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/index.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/locks/2026-05-16-historical-work-anchors.md`

### Key Findings

- `wiki/work/` was empty before this pass, even though the legacy `great_work` corpus has strong S-tier historical anchors.
- The first useful public slice is cross-domain rather than exhaustive: computing, biomedical research, aerospace manufacturing, rail infrastructure, and Land art.
- The new deep-tech map is more useful when it pairs historical anchors with current venture pages instead of treating history as a separate museum shelf.

### Decisions Made

- Kept source links directly in each first-pass work page rather than creating a source-record page for every historical link in this run.
- Avoided public references to legacy provenance; provenance is recorded here and in the worklist.
- Left all pages as `Status: Draft` and `Confidence: Medium` because they need a source-record pass and imagery pass before becoming strong public references.

### Validation

- `npm run build:wiki` succeeded after sandbox escalation for `tsx` IPC permissions: 469 entries built into `src/data/generated/all.json`.
- `npm run build` succeeded after sandbox escalation. Vite emitted only the existing large-chunk warning.

### Problems / Uncertainty

- Several unrelated local changes and deletions were present after validation; they were not reverted or coordinated in this run.
- The new work pages still need dedicated source records for the strongest evidence and license-clean hero images.
- Some claims, especially around Utah computer-graphics alumni lineage and Thiokol program lineage, should receive a tighter primary-source pass before promotion.

### Next Best Tasks

- Add source records for Nobel Prize 2007, University of Utah computing history, NPS Golden Spike, Dia/UMFA Spiral Jetty, NASA Shuttle boosters, and Rogers Commission material.
- Continue `work/` migration with Utah FORGE, Browning firearms designs, Fly's Eye / HiRes, Utah Population Database, HELP clinical decision support, and Golden Spike labor-history context.
- Link the deep-tech map into the UI or search affordances if it becomes a demo navigation surface.

## Run: 2026-05-09 13:12 MDT - Bulk Startup State CSV resource ingest

### Seed Worklist Item

- item: 3. GOEO Startup State Brief and Provided Data Packs
- starting status: blocked
- ending status: first_pass

### Goal

Bulk ingest `docs/resouces-list.csv` into the prose-first wiki so Startup State resources are discoverable as `wiki/resources/` pages.

### Files Read

- `wiki/agent_ops/agents.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/index.md`
- `docs/wiki-seed-worklist.md`
- `docs/resouces-list.csv`
- Existing curated Startup State resource/source pages

### Files Created

- `scripts/ingest-resource-csv.mjs`
- `wiki/agent_ops/locks/2026-05-09-bulk-resource-csv-ingest.md`
- 204 imported resource stub pages under `wiki/resources/`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/index.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/locks/2026-05-09-bulk-resource-csv-ingest.md`

### Key Findings

- The CSV parsed into 213 resource records.
- All 213 parsed CSV records are represented after ingest: either by a curated existing resource page or a low-confidence imported stub.
- Near-duplicate CSV titles were mapped to curated pages for SBDC, SBA, SCORE, Startup State, APEX, and USBCI.

### Validation

- Re-ran the importer and confirmed it is idempotent: 0 new pages created on the second pass.
- Validated that all 218 resource pages have H1, `Status`, `Confidence`, and `Updated` header lines.

### Problems / Uncertainty

- The CSV is directory data, not verified source evidence. Imported pages are intentionally `Status: Stub` and `Confidence: Low`.
- Some imported rows appear date-sensitive or event-like and may be stale; these need provider-page verification before recommendations rely on them.
- The map data referenced in the GOEO brief is still not present in the repo.

### Next Best Tasks

- Prioritize the most useful imported resources for editorial verification and promote them to `Draft` or `Useful`.
- Split clear business-service organizations into `helpers/` where the next user action is relational outreach rather than applying to a program.
- Build persona-specific `answers/` pages from the verified subset.

## Run: 2026-05-09 06:05 MDT - Startup State resource-navigation first pass

### Seed Worklist Item

- item: 5. `startup.utah.gov` Resource List and Founder Journeys
- starting status: ready
- ending status: first_pass

### Goal

Turn the official Startup State resource-list idea into a small, sourced wiki slice that helps founders choose practical business-service doors instead of receiving a generic directory.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-schema.md`
- `docs/utah-data-sources.md`
- `docs/startup-state-brief.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`
- Existing lock templates and run-log examples
- Official public pages for Startup State, Startup State resources, Utah SBDC, SBA Utah District Office, SCORE Utah, and Women's Business Center of Utah

### Files Created

- `wiki/agent_ops/locks/2026-05-09-startup-state-resource-list.md`
- `wiki/resources/startup-state-resource-list.md`
- `wiki/resources/utah-sbdc.md`
- `wiki/resources/sba-utah-district-office.md`
- `wiki/resources/score-utah.md`
- `wiki/resources/womens-business-center-of-utah.md`
- `wiki/sources/startup-utah-official-site.md`
- `wiki/sources/startup-utah-resource-list.md`
- `wiki/sources/utah-sbdc-official-site.md`
- `wiki/sources/sba-utah-district-office-page.md`
- `wiki/sources/score-utah-page.md`
- `wiki/sources/womens-business-center-of-utah-page.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/guides/find-business-services.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/locks/2026-05-09-startup-state-resource-list.md`

### Sources Added

- Startup State official site
- Startup State resource filter
- Utah SBDC official site
- SBA Utah District Office page
- SCORE Utah page
- Women's Business Center of Utah official page

### Guides / Matches / Answers Added or Improved

- Improved `guides/find-business-services.md` with Startup State, SBDC, SCORE, SBA, and WBCUtah routing.
- Improved `guides/startup-capital-in-utah.md` with SBA/SBDC debt and capital-readiness navigation.
- Improved `guides/commercialize-research.md` with companion business-formation resources for researchers.

### Key Findings

- Startup State is useful evidence for a resource-filter taxonomy, but the dynamic resource list should be paired with provider source pages before making specific recommendations.
- SBDC, SCORE, SBA Utah District Office, and WBCUtah cover distinct founder needs: practical counseling, mentorship, federal/SBA navigation, and women-founder support.
- The complete GOEO resource spreadsheet referenced in the brief is still not visible in the repo.

### Decisions Made

- Treated Startup State as a resource-navigation layer rather than a single program.
- Used field-guide layouts and no imagery because these pages are reference-shaped and do not need hero photography.
- Preserved unrelated untracked GOEO program pages that appeared in the worktree and only added compatible guide sections.

### Problems / Uncertainty

- `npm run build:wiki` failed in the sandbox because `tsx` could not create its IPC pipe under `/tmp`; the escalation request was blocked by the environment usage limit, so only static checks were completed.
- Several useful GOEO program pages are present as untracked files and should be coordinated before a later cleanup or commit.
- Journey answer pages are still missing because the authoritative spreadsheet/data pack is unavailable.

### Suggested Improvements

- Obtain the official downloadable Startup State resource spreadsheet and use it to build persona-specific answer pages.
- Add saved answers for Marcus, Maria, Jordan, and Dr. Amir using only sourced resource pages.
- Decide whether specific SBDC advisors, SCORE mentors, or WBCUtah advisors should become helper pages when public evidence is strong enough.

### Next Best Tasks

- Create `answers/resources-for-marcus.md` using SBDC, SBA Utah, APEX, and SSBCI once the GOEO program pages are coordinated.
- Create `answers/resources-for-maria.md` using SBDC, WBCUtah, rural-development resources, and capital-readiness resources.
- Re-run `npm run build:wiki` once escalation is available.

### Worklist Update

- status changed: `ready` to `first_pass`
- note appended: yes

### Self-Score

- source quality: 4
- schema compliance: 5
- duplicate avoidance: 4
- usefulness to users: 4
- cost/efficiency: 4

## Run: 2026-05-09 05:00 MDT - Old wiki demo-slice conversion

### Seed Worklist Item

- item: 1. Existing Old Wikis
- starting status: ready
- ending status: first_pass

### Goal

Convert a small, high-signal slice of the legacy parsed wiki into the new thin-header, rich-body schema and connect the fact pages to a useful guide for meaningful-work discovery.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-schema.md`
- `docs/mini-wiki-inventory.md`
- `src/data/generated/all.json`
- Existing legacy-wiki pages under `wiki/places_you_can_work/`
- Official pages for Recursion, Fervo, Fortem, Hexcel, and SDL

### Files Created

- `wiki/ventures/recursion-pharmaceuticals.md`
- `wiki/ventures/fervo-energy.md`
- `wiki/ventures/fortem-technologies.md`
- `wiki/ventures/hexcel.md`
- `wiki/ventures/space-dynamics-laboratory.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/sources/recursion-mission-page.md`
- `wiki/sources/fervo-cape-station-groundbreaking.md`
- `wiki/sources/fortem-official-website.md`
- `wiki/sources/hexcel-official-website.md`
- `wiki/sources/sdl-about-page.md`
- `wiki/sources/old-places-you-can-work-bundle.md`
- `wiki/agent_ops/RUN_LOG.md`

### Files Updated

- `docs/wiki-seed-worklist.md`

### Sources Added

- Recursion mission page
- Fervo Cape Station groundbreaking page
- Fortem official website
- Hexcel official website
- SDL about page
- Local parsed legacy-wiki bundle

### Guides / Matches / Answers Added or Improved

- Added `guides/find-meaningful-work.md` with audience-specific starting points for AI biology, climate infrastructure, defense autonomy, advanced manufacturing, and space systems.

### Key Findings

- The legacy parsed bundle is usable for editorial context, but primary or official sources are still needed for public claims.
- Fervo's status needs special care because its official site showed IPO-related announcements in May 2026.
- The old universal tier system should stay out of entity pages and become guide-level recommendation language instead.

### Decisions Made

- Used field-guide layouts for all five fact pages because license-clean imagery has not been cleared.
- Kept entity pages descriptive and placed recommendations in the meaningful-work guide.
- Treated official company and institutional pages as medium-confidence sources, not neutral proof of impact.

### Problems / Uncertainty

- `wiki/` is a symlink to `/home/swhitlock/coding/research/cool_companies`, outside the writable sandbox, so copying the new pages required elevated permission.
- Several Utah-specific facility and deployment claims need stronger third-party sourcing.
- No image slots were filled because available official imagery needs rights review.

### Suggested Improvements

- Add current hiring and role-fit evidence where public.
- Create source pages for independent articles, government pages, and university pages that validate key claims.
- Add license-clean imagery or explicit media-kit permissions for marquee pages.

### Next Best Tasks

- Convert five historical `work/` pages that explain Utah's credibility in computing, medicine, aerospace, energy, and culture.
- Build `guides/utah-deep-tech-map.md` from the same five current pages plus historical anchors.
- Add business-service provider guide language that maps helpers to the needs surfaced here.

### Worklist Update

- status changed: `ready` to `first_pass`
- note appended: yes

### Self-Score

- source quality: 3
- schema compliance: 5
- duplicate avoidance: 4
- usefulness to users: 4
- cost/efficiency: 4

## Run: 2026-05-09 05:00 MDT - Meaningful-work guide label adjustment

### Seed Worklist Item

- item: human-directed editorial refinement
- starting status: n/a
- ending status: n/a

### Goal

Replace generic `First Call` guide language with discovery-oriented labels that better match the legacy wiki's spirit: hidden gems, rare opportunities, strong fit, and caveated taste.

### Files Read

- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/ventures/*.md`

### Files Created

- none

### Files Updated

- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/ventures/recursion-pharmaceuticals.md`
- `wiki/ventures/fervo-energy.md`
- `wiki/ventures/fortem-technologies.md`
- `wiki/ventures/hexcel.md`
- `wiki/ventures/space-dynamics-laboratory.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- none

### Guides / Matches / Answers Added or Improved

- Revised `guides/find-meaningful-work.md` from `First call` recommendations into a `Meaningful-Work Map` with `Category-Defining Anchors`, `Rare Fits`, `Hidden Gems`, and `Watchlist`.

### Key Findings

- `First Call` language made the guide feel like obvious referral routing rather than a discovery tool.
- The legacy wiki's tier-list spirit is still useful inside guide pages when the audience and criteria are explicit.

### Decisions Made

- Keep entity pages free of universal tiers.
- Encourage guide-level labels that surface hidden gems and unusual person-to-place fit.
- Use `Category-Defining Anchor`, `Hidden Gem`, `Rare Fit`, `Emerging Bet`, `Useful but Caveated`, and `Watchlist` as preferred meaningful-work labels.

### Problems / Uncertainty

- The current guide still has too few obscure organizations to make the `Watchlist` section genuinely useful.

### Suggested Improvements

- Pull A, B, and speculative legacy-wiki entries into future meaningful-work guide passes so the page has more non-obvious opportunities.

### Next Best Tasks

- Build a real hidden-gems section from lesser-known Utah organizations in the legacy wiki.
- Add `guides/utah-deep-tech-map.md` with both anchors and emerging bets.

### Worklist Update

- status changed: no worklist item changed; this was a human-directed refinement.
- note appended: no seed note appended.

### Self-Score

- source quality: n/a
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 4
- cost/efficiency: 5

## Run: 2026-05-09 05:00 MDT - Remove legacy-wiki provenance from public pages

### Seed Worklist Item

- item: human-directed editorial refinement
- starting status: n/a
- ending status: n/a

### Goal

Keep legacy-wiki provenance internal and remove references to it from user-facing wiki pages.

### Files Read

- `wiki/ventures/*.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/sources/*.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`

### Files Created

- none

### Files Updated

- `wiki/ventures/recursion-pharmaceuticals.md`
- `wiki/ventures/fervo-energy.md`
- `wiki/ventures/fortem-technologies.md`
- `wiki/ventures/hexcel.md`
- `wiki/ventures/space-dynamics-laboratory.md`
- `wiki/guides/find-meaningful-work.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- none

### Guides / Matches / Answers Added or Improved

- Cleaned `guides/find-meaningful-work.md` so its evidence standard references public organization pages and public source records, not internal seed provenance.

### Key Findings

- Public venture pages were citing the local parsed bundle as evidence.
- A public source page for the local parsed bundle exposed internal provenance that should only live in operations notes.

### Decisions Made

- Removed the public source page `wiki/sources/old-places-you-can-work-bundle.md`.
- Added prompt and schema guidance that older parsed wikis and local bundles are internal seed material only.

### Problems / Uncertainty

- None for this cleanup. Future source pages should cite public evidence directly.

### Suggested Improvements

- Add independent third-party sources to replace any editorial context that currently rests on agent judgment.

### Next Best Tasks

- Review future public pages for internal provenance leaks before copying into `wiki/`.

### Worklist Update

- status changed: no worklist item changed; this was a human-directed refinement.
- note appended: no seed note appended.

### Self-Score

- source quality: n/a
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 5
- cost/efficiency: 5

## Run: 2026-05-09 05:00 MDT - Nucleus demo match briefs

### Seed Worklist Item

- item: 2. Nucleus Bounty Brief
- starting status: ready
- ending status: first_pass

### Goal

Turn the Nucleus matching brief into demo-ready, explainable artifacts: a source page, a guide, three synthetic match briefs, and an agent playbook for intake and match explanation.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/hackathon-brief.md`
- existing pages in `wiki/guides/`, `wiki/sources/`, `wiki/agent_ops/`, and the relevant venture pages

### Files Created

- `wiki/sources/nucleus-bounty-brief.md`
- `wiki/sources/demo-synthetic-data-note.md`
- `wiki/guides/nucleus-demo-matches.md`
- `wiki/matches/executive-to-fortem-counter-uas.md`
- `wiki/matches/student-to-university-research-spinout.md`
- `wiki/matches/operator-to-fervo-cape-station.md`
- `wiki/agent_ops/PLAYBOOK.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- Nucleus hackathon brief source page
- Synthetic demo profile source note

### Guides / Matches / Answers Added or Improved

- Added `guides/nucleus-demo-matches.md`
- Added three demo match pages covering executive to deep-tech startup, student to research spinout, and operator to scaling company

### Key Findings

- The Nucleus brief rewards explainability, trust, and realistic matching more than rigid CRM integration.
- Synthetic profiles are useful for availability, risk tolerance, and private needs, but must be labeled clearly.
- The strongest current real-venture matches can reuse Fortem and Fervo pages created in the prior run.

### Decisions Made

- Used synthetic people and one synthetic spinout pattern rather than inventing private facts about real individuals.
- Linked real organization context to public fact pages and source pages.
- Added a playbook that converts brief fields into prose intake questions and match explanation sections.

### Problems / Uncertainty

- The student-to-spinout match is intentionally low confidence until replaced with a real public spinout opportunity.
- The demo still needs real helper/business-service pages to fully satisfy the service-provider angle.

### Suggested Improvements

- Add a real university spinout fact page when one can be sourced cleanly.
- Add helper categories and a business-services guide section connected to these matches.
- Add UI routes or cards that surface the match explanations cleanly.

### Next Best Tasks

- Work seed item 11, Business-Service Provider and Helper Categories.
- Or work seed item 4, Nucleus Institute Programs, to add real resource/helper pages connected to this guide.

### Worklist Update

- status changed: `ready` to `first_pass`
- note appended: yes

### Self-Score

- source quality: 3
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 4
- cost/efficiency: 5

## Run: 2026-05-09 05:43 MDT - Promote public wiki root

### Seed Worklist Item

- item: human-directed operating-system refinement
- starting status: n/a
- ending status: n/a

### Goal

Make `wiki/` the canonical public wiki, preserve the prior research corpus at `legacy_wiki/`, and record durable editorial decisions outside the verbose run log.

### Files Read

- `.gitignore`
- `scripts/build-wiki-index.ts`
- `docs/wiki-architecture.md`
- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`

### Files Created

- `wiki/agent_ops/DECISIONS.md`

### Files Updated

- `.gitignore`
- `scripts/build-wiki-index.ts`
- `docs/wiki-architecture.md`
- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- none

### Guides / Matches / Answers Added or Improved

- Cleaned `guides/find-meaningful-work.md` so its evidence standard names public organization pages, press releases, and institutional source records.

### Key Findings

- Keeping the public wiki behind a symlink caused permission friction and made it too easy to mix public pages with internal seed material.
- The existing app's legacy index build still depends on the previous corpus shape, so the build script now reads `legacy_wiki/`.
- `.gitignore` was still ignoring `wiki/`, which would have hidden the new canonical wiki from version control.

### Decisions Made

- `wiki/` is now a repo-owned public wiki directory.
- `legacy_wiki/` is the internal seed corpus symlink.
- `first_pass` replaces `seeded` as the worklist status for useful but incomplete work.
- Durable rules go in `wiki/agent_ops/DECISIONS.md`; the run log remains an audit trail.
- Explicit `field-guide` layout declarations were removed from venture pages; the renderer can auto-pick the reference layout without putting that label in content.

### Problems / Uncertainty

- The current UI/search index still uses the legacy generated bundle; indexing the public wiki is a separate follow-up.
- `npm run build:wiki` required elevated execution because `tsx` could not create its IPC pipe inside the sandbox.

### Suggested Improvements

- Add a public-wiki indexer that reads `wiki/ventures`, `wiki/helpers`, `wiki/resources`, `wiki/work`, `wiki/guides`, `wiki/matches`, and `wiki/answers`.
- Decide whether the UI should show legacy entries, public wiki entries, or both during the transition.

### Next Best Tasks

- Implement a public wiki search index.
- Work the business-services category so helpers become first-class.

### Worklist Update

- status changed: `seeded` language replaced with `first_pass`
- note appended: no seed note appended; this was an operating-system refinement.

### Self-Score

- source quality: n/a
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 5
- cost/efficiency: 4

## Run: 2026-05-09 05:50 MDT - Clarify product north star

### Seed Worklist Item

- item: human-directed vision refinement
- starting status: n/a
- ending status: n/a

### Goal

Make the product vision clearer and more powerful: the wiki is a living map of Utah's rare opportunities, with search-time matching doing the final personalization.

### Files Read

- `docs/vision.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/wiki-architecture.md`
- `wiki/agent_ops/DECISIONS.md`
- `wiki/guides/find-meaningful-work.md`

### Files Created

- none

### Files Updated

- `docs/vision.md`
- `docs/match-wiki-agent-prompt.md`
- `docs/wiki-architecture.md`
- `docs/match-wiki-schema.md`
- `docs/README.md`
- `docs/plan.md`
- `wiki/agent_ops/DECISIONS.md`
- `wiki/agent_ops/layout-exemplars.md`
- `wiki/ventures/hexcel.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- none

### Guides / Matches / Answers Added or Improved

- none

### Key Findings

- The strongest framing is not "AI matching platform" or "field guide." It is a searchable wiki of rare Utah opportunities.
- Static pages should preserve reusable context; the most personal matching should happen at search time.

### Decisions Made

- Added a north-star section to `docs/vision.md`.
- Added the north star to `wiki/agent_ops/DECISIONS.md`.
- Replaced prominent `field guide` wording with `wiki` in public-facing doctrine.
- Kept layout names as renderer internals only.

### Problems / Uncertainty

- The UI/search still needs to index the public wiki directly for this vision to fully work.

### Suggested Improvements

- Build public-wiki search so prompts can reason over the new pages rather than the legacy generated bundle.

### Next Best Tasks

- Implement public wiki indexing.
- Expand hidden-gem and helper coverage so search has richer raw material.

### Worklist Update

- status changed: none
- note appended: no seed note appended; this was a vision refinement.

### Self-Score

- source quality: n/a
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 5
- cost/efficiency: 5

## Run: 2026-05-09 06:03 MDT - Seed Nucleus program routing

### Seed Worklist Item

- item: Nucleus Institute Programs
- starting status: ready
- ending status: first_pass

### Goal

Turn Nucleus's public program pages into useful wiki fact pages and practical guides that help founders and researchers choose the right Nucleus door.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-schema.md`
- `docs/nucleus-overview.md`
- `docs/utah-data-sources.md`
- `wiki/guides/nucleus-demo-matches.md`
- `wiki/agent_ops/layout-exemplars.md`
- official Nucleus pages for the institute site, programs, Grow, MarketEdge, UTIF, events, and Nucleus Fund

### Files Created

- `wiki/helpers/nucleus-institute.md`
- `wiki/resources/nucleus-grow.md`
- `wiki/resources/nucleus-fund.md`
- `wiki/resources/nucleus-marketedge.md`
- `wiki/resources/utif.md`
- `wiki/guides/commercialize-research.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/sources/nucleus-institute-official-site.md`
- `wiki/sources/nucleus-programs-page.md`
- `wiki/sources/nucleus-grow-page.md`
- `wiki/sources/nucleus-fund-website.md`
- `wiki/sources/nucleus-marketedge-page.md`
- `wiki/sources/nucleus-utif-page.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/guides/nucleus-demo-matches.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- Nucleus Institute official site
- Nucleus programs page
- Nucleus Grow page
- Nucleus Fund website
- Nucleus MarketEdge page
- Nucleus UTIF page

### Guides / Matches / Answers Added or Improved

- Added `guides/commercialize-research.md`
- Added `guides/startup-capital-in-utah.md`
- Improved `guides/nucleus-demo-matches.md` with program-routing logic

### Key Findings

- Nucleus should be represented as both an institutional helper and a set of distinct resource doors.
- MarketEdge fits early researcher commercialization readiness.
- Nucleus Grow fits SBIR/STTR and non-dilutive R&D funding support.
- UTIF fits applicants with a specific SBIR/STTR opportunity and timing need.
- Nucleus Fund fits Utah deep-tech ventures ready for equity diligence and strategic support.

### Decisions Made

- Used `field-guide` layout for the new helper and resource pages because they are reference-shaped.
- Kept Nucleus Fund, Grow, MarketEdge, and UTIF as separate resource pages so matching can route by stage and need.
- Left Nucleus ProLab, PolicyLab, Global, Quantum, and portfolio examples for follow-up rather than over-expanding this run.

### Problems / Uncertainty

- Nucleus program pages are changing quickly; application windows, contact paths, and funding details need re-verification before live recommendations.
- `npm run build:wiki` failed inside the sandbox because `tsx` could not create an IPC pipe under `/tmp`; it succeeded when rerun with approved elevated permissions.
- The worktree already contained unrelated modified and untracked files outside this wiki pass; they were left untouched.

### Suggested Improvements

- Add separate pages for ProLab, PolicyLab, Nucleus Global, Nucleus Quantum, and perhaps State of Innovation or Boost if useful for demo flows.
- Add public venture pages for companies that Nucleus Grow or UTIF have helped, using official Nucleus newsroom evidence plus company sources.
- Create a short answer page for "Which Nucleus program should I use?"

### Next Best Tasks

- Work the GOEO/business.utah.gov program catalog into `guides/startup-capital-in-utah.md`.
- Add business-service helpers and service categories for deep-tech founders.
- Build a public-wiki search surface that can use these new pages directly.

### Worklist Update

- status changed: `ready` -> `active` -> `first_pass`
- note appended: yes, with files created, sources added, verification, and follow-up list

### Self-Score

- source quality: 4
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 5
- cost/efficiency: 4

## Run: 2026-05-09 06:06 MDT - GOEO program catalog first pass

### Seed Worklist Item

- item: 6. `business.utah.gov` GOEO Program Catalog
- starting status: ready
- ending status: first_pass

### Goal

Create a small, demo-useful first pass from the official GOEO program catalog, focused on resources that help founders with procurement, regulation, credit access, global talent, and international expansion.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-schema.md`
- `docs/utah-data-sources.md`
- `docs/startup-state-brief.md`
- `wiki/guides/find-business-services.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`
- Official GOEO pages for APEX, Regulatory Relief, USBCI, Utah Center for Global Talent, and International Trade & Diplomacy

### Files Created

- `wiki/resources/apex-accelerator.md`
- `wiki/resources/utah-office-of-regulatory-relief.md`
- `wiki/resources/utah-small-business-credit-initiative.md`
- `wiki/resources/utah-center-for-global-talent.md`
- `wiki/resources/international-trade-and-diplomacy.md`
- `wiki/sources/goeo-apex-accelerator-page.md`
- `wiki/sources/goeo-regulatory-relief-page.md`
- `wiki/sources/goeo-usbci-page.md`
- `wiki/sources/goeo-global-talent-page.md`
- `wiki/sources/goeo-international-trade-diplomacy-page.md`
- `wiki/agent_ops/locks/2026-05-09-goeo-program-catalog.md`

### Files Updated

- `docs/wiki-seed-worklist.md`
- `wiki/guides/find-business-services.md`
- `wiki/guides/startup-capital-in-utah.md`
- `wiki/guides/commercialize-research.md`
- `wiki/agent_ops/locks/2026-05-09-goeo-program-catalog.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- GOEO APEX Accelerator official page
- GOEO Utah Office of Regulatory Relief official page
- GOEO Utah Small Business Credit Initiative official page
- GOEO Utah Center for Global Talent official page
- GOEO International Trade & Diplomacy official page

### Guides / Matches / Answers Added or Improved

- Added GOEO routes to `guides/find-business-services.md` for procurement, regulation, credit access, workforce/global talent, and international expansion.
- Linked USBCI into `guides/startup-capital-in-utah.md`.
- Linked APEX and Regulatory Relief into `guides/commercialize-research.md`.

### Key Findings

- APEX is the strongest official route for companies that need procurement and government-contracting readiness.
- Regulatory Relief is a distinctive Utah-specific path for founders whose bottleneck is a state regulatory barrier, not generic startup advice.
- USBCI should be framed as lender-backed capital, not a grant or venture substitute.
- Utah Center for Global Talent is useful for employer workforce questions, but legal or immigration advice still needs qualified counsel.
- International Trade & Diplomacy is best treated as a state-context and routing page; World Trade Center Utah-specific programs need a later pass.

### Decisions Made

- Used field-guide layout for all resource pages because these are reference-shaped program pages.
- Kept rankings and routing language in the guide, not on entity pages.
- Avoided publishing private contact details or implying endorsement by any individual staff member.

### Problems / Uncertainty

- `npm run build:wiki` failed in the sandbox because `tsx` could not create its IPC pipe under `/tmp`; escalation was unavailable because the environment reported a usage-limit block.
- Source pages are official program pages, so they are strong for service descriptions but should not be treated as neutral impact proof.
- World Trade Center Utah program details need their own source pages before making precise export-grant recommendations.

### Suggested Improvements

- Add resource pages for Center for Rural Development, Opportunity Zones, UPSTART, Business Recruitment & Expansion, and Film Commission.
- Add private helper pages for attorneys, accountants, grant writers, FDA/regulatory consultants, fractional CFOs, recruiters, and immigration counsel once public evidence is available.
- Build persona answers for Marcus, Maria, David, and Priya using these GOEO resources.

### Next Best Tasks

- Create `answers/resources-for-marcus.md` using APEX, SBDC, SBA, USBCI, and veteran/manufacturing context.
- Create `answers/resources-for-david.md` using International Trade, Regulatory Relief if relevant, and medical-device export context.
- Add World Trade Center Utah source/resource pages for export grants and trade missions.

### Worklist Update

- status changed: `ready` to `first_pass`
- note appended: yes

### Self-Score

- source quality: 4
- schema compliance: 5
- duplicate avoidance: 4
- usefulness to users: 4
- cost/efficiency: 4

## Run: 2026-05-09 08:10 MDT — S-tier ventures backfill

### Seed Worklist Item

- item: 1. Legacy Research Wikis
- starting status: first_pass
- ending status: first_pass

### Goal

Bring the new `wiki/ventures/` directory up to parity with the legacy `legacy_wiki/places_you_can_work/` S-tier list. The legacy README named eleven S-tier organizations; only five had been converted in the earlier meaningful-work pass. This run added the missing six (Zanskar Geothermal, Merit Medical, Blackrock Neurotech, SCI Institute, Sundance Institute, FamilySearch) and gave every S-tier venture page a hero image so the magazine layout becomes available.

### Files Read

- `wiki/agent_ops/agents.md`
- `wiki/agent_ops/schema.md`
- `wiki/agent_ops/index.md`
- `wiki/agent_ops/locks/README.md`
- `wiki/agent_ops/locks/TEMPLATE.md`
- `wiki/guides/find-meaningful-work.md`
- All five existing `wiki/ventures/*.md` files
- `legacy_wiki/places_you_can_work/README.md` and `PLAN.md`
- All six legacy S-tier entries that were missing from the new wiki
- Wikipedia and Wikimedia Commons API responses for license-clean photographs

### Files Created

- `wiki/agent_ops/locks/2026-05-09-s-tier-ventures.md`
- `wiki/ventures/zanskar-geothermal.md`
- `wiki/ventures/merit-medical.md`
- `wiki/ventures/blackrock-neurotech.md`
- `wiki/ventures/sci-institute.md`
- `wiki/ventures/sundance-institute.md`
- `wiki/ventures/familysearch.md`
- `wiki/sources/zanskar-mit-technology-review.md`
- `wiki/sources/merit-medical-pentax-cryoballoon-acquisition.md`
- `wiki/sources/blackrock-utah-array-medical-design.md`
- `wiki/sources/sci-institute-official-site.md`
- `wiki/sources/sundance-institute-official-site.md`
- `wiki/sources/familysearch-official-site.md`

### Files Updated

- `wiki/ventures/recursion-pharmaceuticals.md` — added Hero, Pull, refreshed open question.
- `wiki/ventures/fervo-energy.md` — added Hero, Pull, refreshed open question.
- `wiki/ventures/fortem-technologies.md` — added Hero, Pull, refreshed open question.
- `wiki/ventures/hexcel.md` — added Hero, Pull, refreshed open question.
- `wiki/ventures/space-dynamics-laboratory.md` — added real Wikimedia Hero (CC BY-SA 4.0, Jacobkhed), Hero caption, Pull, attribution open question.
- `wiki/guides/find-meaningful-work.md` — extended map with the six new anchors across Category-Defining, Rare Fit, and Hidden Gem labels; added situational guidance for biomedical computing, art, and helpers.
- `wiki/agent_ops/index.md` — added the six new ventures and six new sources, refreshed coverage snapshot counts (`ventures` 5→11, `sources` 24→30), refreshed gaps note to call out remaining placeholder hero imagery.

### Sources Added

- MIT Technology Review (Zanskar blind-system geothermal discovery, December 2025).
- Utah Business republished press release (Merit Medical / Pentax C2 CryoBalloon, October 2025).
- Medical Design & Outsourcing industry coverage (Utah Array, MoveAgain, Neuralace).
- SCI Institute official site (open-source software releases and faculty programs).
- Sundance Institute official site (Artist Labs, Festival, New Frontier, 2027 Boulder relocation).
- FamilySearch official site and Library statistics (collection scale, 1894 GSU origin, free public access).

### Guides / Matches / Answers Added or Improved

- `wiki/guides/find-meaningful-work.md` rewritten end-to-end. Now covers all eleven S-tier ventures with explicit audience labels and adds situations for biomedical/scientific-computing researchers, artist-track contributors, and helpers.

### Key Findings

- Three real, license-clean photographs were available on Wikimedia Commons via the page-image API: Space Dynamics Laboratory (CC BY-SA 4.0, attribution required), the FamilySearch / Family History Library building (CC0, public domain), and the Sundance Film Festival sign on Park City Main Street (CC BY 2.0, Travis Wise).
- For the eight remaining ventures (Recursion, Fervo, Fortem, Hexcel, Merit, Blackrock, SCI, Zanskar), no public-domain or freely licensed company-specific photographs surfaced in the time available. Per `schema.md` they were given deterministic `picsum.photos` placeholders with descriptive seeds, and each `Open Questions` section now flags the need for an approved company image before the page is rendered as a magazine cover.
- The legacy `scientific-infrastructure/sci-institute.md` entry contains an internal contradiction: the parent README and PLAN list it as S, but the file itself opens with `Tier: A`. Treated as S-tier per the README. A tier note belongs in the next run if a coordinator wants to reconcile the legacy file.

### Decisions Made

- Hero images and pull-quote subtitles were added even when the only available image was a picsum placeholder, because schema explicitly endorses placeholders as a fallback and the renderer otherwise silently auto-picks. The placeholder makes the gap visible.
- New entity pages keep `Status: Draft` and `Confidence: Medium` because the prose was largely re-shaped from legacy material rather than freshly verified against primary sources.
- Did not re-write the legacy `scientific-infrastructure/sci-institute.md` file. Public wiki pages do not mention legacy provenance per `agents.md`; reconciliation is a coordinator task.

### Problems / Uncertainty

- Picsum placeholders are deterministic on the seed but not real photographs of the venture; readers familiar with the entries will recognize this. The Open Questions sections call this out for each affected page.
- The Sundance hero is the festival sign, not an Institute Lab. It is the strongest license-clean asset available, but it skews visually toward the festival rather than the year-round Institute work; flagged as an open question.
- The Wikipedia article for Recursion Pharmaceuticals appears to have been removed or moved (404 on `/wiki/Recursion_Pharmaceuticals`), so no infobox image was available; this is a gap to revisit.
- `npm run build:wiki` was not run in this turn; recommend a build verification pass once a coordinator merges parallel claims.

### Suggested Improvements

- Source approved company photographs for Recursion, Fervo, Fortem, Hexcel, Merit Medical, Blackrock Neurotech, SCI Institute, and Zanskar Geothermal.
- Add watchlist entries to `find-meaningful-work.md`: Ripple Neuro, Intan Technologies, Utah Arch Research Group, Strider Technologies, IMSAR, Vector, and recent U of U TLO and BYU TTO spinouts.
- Consider giving SCI Institute, FamilySearch, and Sundance Institute their own `helpers/` or `resources/` companion pages where they offer specific application paths (open-source contribution onboarding, RootsTech registration, New Frontier Lab application).

### Next Best Tasks

- Add a watchlist sweep of A-tier legacy entries to `wiki/ventures/`, prioritizing Ripple Neuro, Intan Technologies, Strider Technologies, IMSAR, Vector, and Energy Fuels White Mesa.
- Reconcile the legacy `sci-institute.md` tier-line discrepancy with a coordinator decision.
- Build verification pass: run `npm run build:wiki` and confirm the new venture pages render at the magazine layout.

### Worklist Update

- status changed: `first_pass` (no change; the legacy-conversion item remains incomplete because A-tier entries are still missing)
- note appended: yes (under item 1)

### Index Update

- entries added: 6 ventures (blackrock-neurotech, familysearch, merit-medical, sci-institute, sundance-institute, zanskar-geothermal); 6 sources (blackrock-utah-array-medical-design, familysearch-official-site, merit-medical-pentax-cryoballoon-acquisition, sci-institute-official-site, sundance-institute-official-site, zanskar-mit-technology-review)
- entries renamed/retired: none
- coverage snapshot refreshed: yes (ventures 5→11, sources 24→30)

### Self-Score

- source quality: 3 (mix of primary official sites and reputable secondary press; some claims still need primary verification)
- schema compliance: 5
- duplicate avoidance: 5 (checked index; no duplicates)
- usefulness to users: 4 (covers all eleven legacy S-tier anchors and reroutes the discovery guide)
- cost/efficiency: 4
