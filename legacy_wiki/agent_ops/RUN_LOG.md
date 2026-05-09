# Great Work Utah Wiki Agent Run Log

## Run: 2026-05-09 05:00 MDT - Old wiki demo-slice conversion

### Seed Worklist Item

- item: 1. Existing Old Wikis
- starting status: not_started
- ending status: seeded

### Goal

Convert a small, high-signal slice of the old parsed wiki into the new thin-header, rich-body schema and connect the fact pages to a useful guide for meaningful-work discovery.

### Files Read

- `docs/wiki-seed-worklist.md`
- `docs/match-wiki-schema.md`
- `docs/mini-wiki-inventory.md`
- `src/data/generated/all.json`
- Existing old-wiki pages under `wiki/places_you_can_work/`
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
- Local parsed old-wiki bundle

### Guides / Matches / Answers Added or Improved

- Added `guides/find-meaningful-work.md` with audience-specific starting points for AI biology, climate infrastructure, defense autonomy, advanced manufacturing, and space systems.

### Key Findings

- The old parsed bundle is usable for editorial context, but primary or official sources are still needed for public claims.
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

- status changed: `not_started` to `seeded`
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

Replace generic `First Call` guide language with discovery-oriented labels that better match the old wiki's spirit: hidden gems, rare opportunities, strong fit, and caveated taste.

### Files Read

- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`

### Files Created

- none

### Files Updated

- `docs/match-wiki-agent-prompt.md`
- `docs/match-wiki-schema.md`
- `wiki/guides/find-meaningful-work.md`
- `wiki/agent_ops/RUN_LOG.md`

### Sources Added

- none

### Guides / Matches / Answers Added or Improved

- Revised `guides/find-meaningful-work.md` from `First call` recommendations into a `Meaningful-Work Map` with `Category-Defining Anchors`, `Rare Fits`, `Hidden Gems`, and `Watchlist`.

### Key Findings

- `First Call` language made the guide feel like obvious referral routing rather than a discovery tool.
- The old wiki's tier-list spirit is still useful inside guide pages when the audience and criteria are explicit.

### Decisions Made

- Keep entity pages free of universal tiers.
- Encourage guide-level labels that surface hidden gems and unusual person-to-place fit.
- Use `Category-Defining Anchor`, `Hidden Gem`, `Rare Fit`, `Emerging Bet`, `Useful but Caveated`, and `Watchlist` as preferred meaningful-work labels.

### Problems / Uncertainty

- The current guide still has too few obscure organizations to make the `Watchlist` section genuinely useful.

### Suggested Improvements

- Pull A, B, and speculative old-wiki entries into future meaningful-work guide passes so the page has more non-obvious opportunities.

### Next Best Tasks

- Build a real hidden-gems section from lesser-known Utah organizations in the old wiki.
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

## Run: 2026-05-09 05:00 MDT - Remove old-wiki provenance from public pages

### Seed Worklist Item

- item: human-directed editorial refinement
- starting status: n/a
- ending status: n/a

### Goal

Keep old-wiki provenance internal and remove references to it from user-facing wiki pages.

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

- Cleaned `guides/find-meaningful-work.md` so its evidence standard references public organization pages and agent-curated source notes, not internal seed provenance.

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
- starting status: not_started
- ending status: seeded

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

- status changed: `not_started` to `seeded`
- note appended: yes

### Self-Score

- source quality: 3
- schema compliance: 5
- duplicate avoidance: 5
- usefulness to users: 4
- cost/efficiency: 5
