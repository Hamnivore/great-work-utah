# Wiki Worklist

This is the working backlog for improving the prose-first Great Work Utah wiki.

Agents should use this file part by part. When you work on a seed source, update its status and append a dated note under `Progress / Notes`.

## How To Use This File

Status values:

```txt
ready
active
first_pass
needs_sources
blocked
done
rejected
```

Status meanings:

- `ready`: useful, unblocked, and not yet worked in the current wiki.
- `active`: currently being worked by an agent.
- `first_pass`: useful in the demo, but not complete.
- `needs_sources`: draft exists, but public evidence is too thin.
- `blocked`: cannot proceed until a specific missing input appears.
- `done`: complete enough that future work should come from a new category or explicit request.
- `rejected`: not worth converting.

When an agent starts an item:

1. Change `Status` to `active`.
2. Read the listed source docs.
3. Create or update the target wiki pages.
4. Add source pages for important evidence.
5. Append a dated progress note.
6. If blocked, say exactly what is missing.

Prefer working by demo category, not by source pile. Useful categories include meaningful work, demo matches, business services, commercialization, startup capital, Utah deep tech map, and persona answers. A source item can stay `first_pass` across many runs if only one category has been improved.

The wiki should follow [`wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md): thin bold-prefix headers, rich prose, fact pages separated from derivative `guides/`, `matches/`, and `answers/`.

## Priority Map

Highest-value seed sources for the hackathon demo:

1. Legacy research wiki content.
2. Nucleus bounty brief and demo scenarios.
3. GOEO Startup State brief and provided data packs.
4. Nucleus programs and current Connections Hub workflow.
5. `startup.utah.gov` resources and founder journeys.
6. `business.utah.gov` GOEO programs.
7. Our internal personas and GOEO test personas.

## 1. Legacy Research Wikis

**Status:** first_pass  
**Priority:** high  
**Source status:** local, already parsed into `src/data/generated/all.json`; raw source via `legacy_wiki/` symlink  
**Source docs:** [`mini-wiki-inventory.md`](./mini-wiki-inventory.md), [`src/data/generated/all.json`](../src/data/generated/all.json)

**Why This Is Useful**

This is the biggest immediate content asset. It has current organizations, historical work, sections like "why it matters," caveats, and source links. It should seed `ventures/`, `work/`, `resources/`, and guide recommendations.

**Best Target Pages**

- `ventures/` for current organizations from `places_you_can_work/`
- `work/` for historical entries from `great_work/`
- `sources/` from each entry's "Learn more" links
- `guides/find-meaningful-work.md`
- `guides/utah-deep-tech-map.md`
- `guides/commercialize-research.md`

**First Agent Pass**

- Pick 5 high-signal entries across Nucleus sectors: life sciences, AI, defense/aerospace, energy, advanced manufacturing.
- Convert each to the new prose-first format.
- Remove universal item-level tiers; preserve impact and caveats in prose.
- Extract source links into source pages only where needed for the demo.
- Create one guide section that uses these entries as recommended starting points.

**Progress / Notes**

- 2026-05-09: Created backlog item. No conversion started yet.
- 2026-05-09: Completed a first pass on meaningful-work anchors. Created venture pages for Recursion Pharmaceuticals, Fervo Energy, Fortem Technologies, Hexcel Corporation, and Space Dynamics Laboratory; created `guides/find-meaningful-work.md`; added public source-record pages for the five organizations. Follow-up: add `guides/utah-deep-tech-map.md` and convert five historical `work/` pages that explain Utah's long-running technical credibility.
- 2026-05-09: Completed S-tier backfill so the new wiki matches the legacy README's eleven category-defining entries. Added venture pages for Zanskar Geothermal, Merit Medical Systems, Blackrock Neurotech, SCI Institute, Sundance Institute, and FamilySearch; added a Hero image (real Wikimedia Commons photo where available, otherwise a deterministic `picsum.photos` placeholder) and a Pull subtitle to every S-tier venture page so the magazine layout becomes available; added six matching source records; rewrote `guides/find-meaningful-work.md` to map all eleven anchors. Open follow-ups: source approved company photographs for the eight ventures still on placeholders; sweep A-tier legacy entries (Ripple Neuro, Intan Technologies, Strider Technologies, IMSAR, Vector, Energy Fuels White Mesa); reconcile the legacy `sci-institute.md` tier-line discrepancy.

## 2. Nucleus Bounty Brief

**Status:** first_pass  
**Priority:** high  
**Source status:** local summary of competition-provided brief  
**Source docs:** [`hackathon-brief.md`](./hackathon-brief.md)

**Why This Is Useful**

This is the clearest judge-facing source for the matching problem. It gives the required talent profile dimensions, startup profile dimensions, core sectors, desired explainability, and required example match scenarios.

**Best Target Pages**

- `guides/nucleus-demo-matches.md`
- `guides/find-a-cofounder.md`
- `guides/find-an-advisor.md`
- `guides/find-business-services.md`
- `answers/why-this-is-better-than-linkedin.md`
- `matches/` for the three required demo scenarios
- `agent_ops/PLAYBOOK.md`

**First Agent Pass**

- Create a source page for the Nucleus brief.
- Turn the required demo scenarios into three match-page briefs:
  - Executive to deep-tech startup.
  - Student to research spinout.
  - Operator to scaling company.
- Convert the Nucleus talent/startup profile fields into prose prompts for intake and agent evaluation.
- Add a short section to `guides/nucleus-demo-matches.md` explaining why each match is transparent.

**Progress / Notes**

- 2026-05-09: Created backlog item from local competition brief. No wiki pages created yet.
- 2026-05-09: Created `sources/nucleus-bounty-brief.md` and `sources/demo-synthetic-data-note.md`; added `guides/nucleus-demo-matches.md`; added three clearly labeled synthetic demo match pages for executive-to-Fortem, student-to-university-research-spinout, and operator-to-Fervo; added `agent_ops/PLAYBOOK.md` with intake and explanation patterns. No blockers. Next best follow-up: connect these demo matches to the UI and add real helper/business-service categories for the Nucleus workflow.

## 3. GOEO Startup State Brief and Provided Data Packs

**Status:** first_pass  
**Priority:** high  
**Source status:** brief is local; `docs/resouces-list.csv` is now available and bulk-ingested; map data still not found in this repo  
**Source docs:** [`startup-state-brief.md`](./startup-state-brief.md)

**Why This Is Useful**

The GOEO brief says a complete spreadsheet of every state resource and map data are provided. Those are likely the best seeds for `resources/`, `ventures/`, and founder-persona guides.

**Best Target Pages**

- `resources/` pages for state resources
- `ventures/` pages from map data
- `guides/startup-capital-in-utah.md`
- `guides/commercialize-research.md`
- `guides/utah-deep-tech-map.md`
- `answers/resources-for-jordan.md`
- `answers/resources-for-maria.md`
- `answers/resources-for-marcus.md`
- `answers/resources-for-priya.md`
- `answers/resources-for-david.md`
- `answers/resources-for-dr-amir.md`

**First Agent Pass**

- Locate the provided spreadsheet and map data.
- If unavailable, mark blocked and seed from `startup.utah.gov` / `business.utah.gov` summaries instead.
- Convert the top 10 highest-demo-value resources into `resources/`.
- Create one answer page per GOEO test persona showing personalized recommendations.

**Progress / Notes**

- 2026-05-09: Marked blocked because the brief references provided data packs, but they are not visible in the repo.
- 2026-05-09: Bulk-ingested `docs/resouces-list.csv` into `wiki/resources/`. The CSV contains 213 parsed resource records; all are now represented either by existing curated pages or imported stub pages. Resource pages still need provider-by-provider source verification and stronger fit language before they should drive high-confidence recommendations. Map data remains missing.

## 4. Nucleus Institute Programs

**Status:** first_pass  
**Priority:** high  
**Source status:** local summary, public site target for verification  
**Source docs:** [`nucleus-overview.md`](./nucleus-overview.md), [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

Nucleus is one of the judging audiences. Its programs map directly to the wiki's `resources/`, `helpers/`, and `guides/`: Talent Hub, Commercialization, Capital, Solutions, Place, Nucleus Fund, Nucleus Grow, PolicyLab, MarketEdge, UTIF, Convergence Hall, State of Innovation, and Boost.

**Best Target Pages**

- `resources/nucleus-fund.md`
- `resources/nucleus-grow.md`
- `resources/utif.md`
- `resources/marketedge.md`
- `resources/policylab.md`
- `helpers/nucleus-institute.md`
- `guides/commercialize-research.md`
- `guides/startup-capital-in-utah.md`
- `guides/nucleus-demo-matches.md`

**First Agent Pass**

- Verify each Nucleus program from official pages if web access is available.
- Create `resources/nucleus-grow.md` and `resources/nucleus-fund.md` first.
- Create `helpers/nucleus-institute.md` as the institutional helper page.
- Link Nucleus programs into commercialization and startup-capital guides.

**Progress / Notes**

- 2026-05-09: Created backlog item from `nucleus-overview.md`.
- 2026-05-09: Completed a first pass on Nucleus program routing. Created `helpers/nucleus-institute.md`; created resource pages for `resources/nucleus-grow.md`, `resources/nucleus-fund.md`, `resources/nucleus-marketedge.md`, and `resources/utif.md`; created source records for the official Nucleus site, programs page, Grow page, Fund website, MarketEdge page, and UTIF page; created `guides/commercialize-research.md` and `guides/startup-capital-in-utah.md`; updated `guides/nucleus-demo-matches.md` with Nucleus program routing. Verified official pages with web access and ran `npm run build:wiki` successfully after sandbox escalation for `tsx` IPC permissions. No blockers. Next best follow-up: add ProLab, PolicyLab, Nucleus Global, Nucleus Quantum, and public examples of companies helped by Grow/Fund/UTIF.

## 5. `startup.utah.gov` Resource List and Founder Journeys

**Status:** first_pass  
**Priority:** high  
**Source status:** public scrape target summarized locally  
**Source docs:** [`utah-data-sources.md`](./utah-data-sources.md), [`startup-state-brief.md`](./startup-state-brief.md)

**Why This Is Useful**

The Startup State site is the official resource portal GOEO wants improved. Its Resource List and journey framing are perfect seeds for `resources/` and guide navigation.

**Best Target Pages**

- `resources/` pages for each high-value program
- `guides/startup-capital-in-utah.md`
- `guides/commercialize-research.md`
- `guides/find-business-services.md`
- `answers/i-am-thinking-of-starting-my-business.md`
- `answers/start-my-business.md`
- `answers/grow-my-business.md`
- `answers/close-or-sell-my-business.md`

**First Agent Pass**

- Scrape or manually capture the Resource List.
- Preserve categories, descriptions, links, eligibility, and access path in prose.
- Create journey answer pages from the four Startup State journeys.
- Connect resources to GOEO test personas.

**Progress / Notes**

- 2026-05-09: Created backlog item from local scrape-target notes.
- 2026-05-09: Completed a scoped first pass on Startup State resource navigation. Created public source records for the official Startup State site, Startup State resource filter, Utah SBDC, SBA Utah District Office, SCORE Utah, and Women's Business Center of Utah. Created resource pages for the Startup State Resource Filter, Utah SBDC, SBA Utah District Office, SCORE Utah, and Women's Business Center of Utah. Updated `guides/find-business-services.md`, `guides/startup-capital-in-utah.md`, and `guides/commercialize-research.md` with founder-routing guidance. Blocker: the complete official resource spreadsheet referenced in the GOEO brief is still not in the repo, so journey answer pages remain a next pass.

## 6. `business.utah.gov` GOEO Program Catalog

**Status:** first_pass  
**Priority:** high  
**Source status:** public scrape target summarized locally  
**Source docs:** [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

GOEO's broader program catalog is deeper than the Startup State portal alone. It includes several programs that map cleanly to founder needs.

**Candidate Pages**

- `resources/apex-accelerator.md`
- `resources/center-for-rural-development.md`
- `resources/international-trade-and-diplomacy.md`
- `resources/opportunity-zones-utah.md`
- `resources/upstart.md`
- `resources/utah-center-for-global-talent.md`
- `resources/utah-film-commission.md`
- `resources/utah-office-of-regulatory-relief.md`
- `resources/utah-small-business-credit-initiative.md`
- `guides/startup-capital-in-utah.md`
- `guides/find-business-services.md`

**First Agent Pass**

- Verify official GOEO program pages.
- Seed 5 resources with highest relevance to the demo: APEX, Regulatory Relief, SSBCI, Global Talent, International Trade.
- Add "best fit" prose for each resource.
- Link them into persona answers and guides.

**Progress / Notes**

- 2026-05-09: Created backlog item from `utah-data-sources.md`.
- 2026-05-09: Completed a scoped first pass on the GOEO program catalog. Verified official pages for APEX Accelerator, Utah Office of Regulatory Relief, Utah Small Business Credit Initiative, Utah Center for Global Talent, and International Trade & Diplomacy. Added first-pass resource/source pages for all five and linked them into `find-business-services.md`, `startup-capital-in-utah.md`, and `commercialize-research.md`. Build verification is still outstanding because `npm run build:wiki` hit the sandbox `tsx` IPC issue and escalation was blocked by usage limits; required-header checks passed. Next best follow-up: add Opportunity Zones, Center for Rural Development, UPSTART, Business Recruitment & Expansion, and World Trade Center Utah-specific export grant resources.

## 7. Nucleus Current Connections Hub Workflow

**Status:** ready  
**Priority:** medium  
**Source status:** local brief summary; public contact page target  
**Source docs:** [`hackathon-brief.md`](./hackathon-brief.md), [`nucleus-overview.md`](./nucleus-overview.md), [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

The current Nucleus workflow is Squarespace -> Typeform -> Affinity. We do not need to integrate deeply, but showing that the wiki can ingest intake and produce explainable matches addresses the integration criterion.

**Best Target Pages**

- `answers/how-great-work-plugs-into-nucleus.md`
- `guides/nucleus-demo-matches.md`
- `sources/nucleus-current-connections-hub.md`
- `agent_ops/PLAYBOOK.md`

**First Agent Pass**

- Create a source page describing the current workflow.
- Draft a short answer explaining how a Typeform or Affinity export becomes source pages, people/helper pages, and match pages.
- Keep it demo-level; do not build real CRM integration unless requested.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 8. Startup Map Data and Pampam Reference

**Status:** blocked  
**Priority:** medium  
**Source status:** map data referenced by GOEO brief but not found in repo; Pampam is a reference, not source data  
**Source docs:** [`startup-state-brief.md`](./startup-state-brief.md), [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

The Startup Map requirement includes fields like name, website, employees, sector, year founded, LinkedIn, description, address, hiring status, job postings, and photo gallery. These are useful for `ventures/` page headers and bodies, even if we do not build a full map.

**Best Target Pages**

- `ventures/` pages from map data
- `guides/utah-deep-tech-map.md`
- `answers/investor-view-of-utah-startups.md`

**First Agent Pass**

- Locate the GOEO map data.
- If unavailable, use existing legacy-wiki current organizations as temporary map leads.
- Do not scrape Pampam as authoritative data; use it only for UX inspiration.

**Progress / Notes**

- 2026-05-09: Marked blocked until map data is located.

## 9. GOEO Test Personas

**Status:** ready  
**Priority:** high  
**Source status:** local competition brief  
**Source docs:** [`startup-state-brief.md`](./startup-state-brief.md)

**Why This Is Useful**

These are literal judging test cases. The wiki should be able to give meaningfully different recommendations for Jordan, Maria, Marcus, Priya, David, and Dr. Amir.

**Best Target Pages**

- `answers/resources-for-jordan.md`
- `answers/resources-for-maria.md`
- `answers/resources-for-marcus.md`
- `answers/resources-for-priya.md`
- `answers/resources-for-david.md`
- `answers/resources-for-dr-amir.md`
- `guides/commercialize-research.md`
- `guides/startup-capital-in-utah.md`
- `guides/find-business-services.md`

**First Agent Pass**

- Create a short saved answer for Dr. Amir first, because he overlaps both hackathons.
- Create a short saved answer for Marcus second, because he tests approachability and rural/veteran/manufacturing relevance.
- Use only resources that have source pages or explicit source notes.

**Progress / Notes**

- 2026-05-09: Created backlog item from GOEO brief.

## 10. Internal Great Work Personas

**Status:** ready  
**Priority:** high  
**Source status:** local product doc; synthetic personas  
**Source docs:** [`personas.md`](./personas.md), [`vision.md`](./vision.md)

**Why This Is Useful**

These personas are our product test harness: Priya, Sam, Dr. Amir, Marcus, Ben, and Helen. They can seed demo answers, guides, and synthetic hand-raise examples, as long as synthetic status is clear.

**Best Target Pages**

- `answers/what-priya-needs-in-sixty-seconds.md`
- `answers/what-dr-amir-should-do-next.md`
- `answers/why-ben-might-care-about-utah-hard-tech.md`
- `guides/find-meaningful-work.md`
- `guides/find-an-advisor.md`
- `guides/find-business-services.md`
- `matches/` for clearly labeled synthetic demo matches

**First Agent Pass**

- Do not create public factual `people/` pages for synthetic personas unless they are explicitly labeled demo/synthetic.
- Use personas to test guide usefulness and answer shape.
- Create one answer for Priya and one answer for Dr. Amir.

**Progress / Notes**

- 2026-05-09: Created backlog item. Synthetic caution noted.

## 11. Business-Service Provider and Helper Categories

**Status:** ready  
**Priority:** high  
**Source status:** derived from Nucleus brief, vision doc, and schema discussion  
**Source docs:** [`hackathon-brief.md`](./hackathon-brief.md), [`vision.md`](./vision.md), [`../wiki/agent_ops/schema.md`](../wiki/agent_ops/schema.md)

**Why This Is Useful**

Business-service providers may be especially interesting to judges. The wiki should show that attorneys, accountants, fractional CFOs, recruiters, grant writers, FDA consultants, and GTM advisors are first-class helpers.

**Best Target Pages**

- `guides/find-business-services.md`
- `helpers/` pages for any real providers we can source
- `answers/which-business-services-does-a-founder-need-first.md`
- `matches/` helper-to-founder examples

**First Agent Pass**

- Draft `guides/find-business-services.md` with categories, not fake provider claims.
- Add real helper pages only when there is public evidence.
- Use synthetic helper examples only in clearly labeled demo matches.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 12. Constitution and Editorial Heuristics

**Status:** ready  
**Priority:** medium  
**Source status:** local internal doctrine  
**Source docs:** [`constitution.md`](./constitution.md), [`../wiki/agent_ops/agents.md`](../wiki/agent_ops/agents.md)

**Why This Is Useful**

The constitution gives the editorial test for impact: how many people are affected, how deeply, for how long. It also clarifies geographic scope and citation standards.

**Best Target Pages**

- `agent_ops/PLAYBOOK.md`
- `agent_ops/DECISIONS.md`
- `answers/how-we-decide-what-counts-as-great-work.md`

**First Agent Pass**

- Convert the constitution into an agent-facing editorial playbook.
- Add rules for cautious language, source quality, and Utah scope.
- Do not render internal editorial doctrine as a public claim unless needed.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 13. Design Direction and Template Content

**Status:** ready  
**Priority:** low  
**Source status:** local design references; mostly presentation seed, not factual seed  
**Source docs:** [`design-direction.md`](./design-direction.md), [`src/templates/_content.ts`](../src/templates/_content.ts), `docs/design-direction-renders/`

**Why This Is Useful**

This is not a source of factual entity data, but it is useful for how wiki pages should feel in the UI: travel-guide voice, article-shaped Ask answers, citations, related exits, and guide ranking presentation.

**Best Target Pages**

- `answers/` page templates
- `guides/` visual/content examples
- UI fixture content for development

**First Agent Pass**

- Do not convert lorem ipsum template content into factual wiki content.
- Use real legacy-wiki entries like Spiral Jetty if a visual example is needed.
- Keep design notes in docs unless they directly affect public copy.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 14. Nucleus Newsroom and Events

**Status:** ready  
**Priority:** medium  
**Source status:** public scrape target identified locally  
**Source docs:** [`nucleus-overview.md`](./nucleus-overview.md), [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

Newsroom and events can reveal active ventures, current programs, and people already moving through the ecosystem. This can seed leads without relying on proprietary data.

**Best Target Pages**

- `sources/` for event/news pages
- `ventures/` for featured companies
- `helpers/` for speakers, mentors, or partner organizations
- `guides/nucleus-demo-matches.md`
- `agent_ops/LEADS.md`

**First Agent Pass**

- Pull recent Nucleus newsroom items.
- Extract only public, sourced claims.
- Add leads before creating full pages unless the evidence is strong.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 15. GOEO News, Accolades, and Community Data

**Status:** ready  
**Priority:** medium  
**Source status:** public scrape target identified locally  
**Source docs:** [`utah-data-sources.md`](./utah-data-sources.md)

**Why This Is Useful**

GOEO news, accolades, community profiles, targeted industries, and statewide economic development contacts can help the wiki explain Utah context rather than just list entities.

**Best Target Pages**

- `answers/why-utah-for-builders.md`
- `guides/utah-deep-tech-map.md`
- `guides/find-business-services.md`
- `resources/` for state/local contacts
- `sources/` for rankings and profiles

**First Agent Pass**

- Capture rankings and context as sources, not hype.
- Use community profiles to improve location-aware answers.
- Add caveats where rankings come from third-party listicles or PR material.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 16. Synthetic Dataset Permission

**Status:** ready  
**Priority:** medium  
**Source status:** explicitly permitted by Nucleus brief  
**Source docs:** [`hackathon-brief.md`](./hackathon-brief.md)

**Why This Is Useful**

The Nucleus brief allows synthetic datasets. For the demo, synthetic people/helpers can fill gaps where public data would be unsafe or too slow to verify, especially around private availability and willingness to connect.

**Best Target Pages**

- `sources/demo-synthetic-data-note.md`
- `matches/` clearly labeled synthetic demo matches
- `answers/how-demo-data-is-labeled.md`

**First Agent Pass**

- Create a source/note page explaining which demo data is synthetic.
- Keep synthetic pages out of public-factual areas unless clearly labeled.
- Use synthetic data for availability, risk tolerance, and private needs; use real sources for organizations/resources where possible.

**Progress / Notes**

- 2026-05-09: Created backlog item.

## 17. Legacy Wiki Working Notes and Agent Ops

**Status:** ready  
**Priority:** low  
**Source status:** local in `legacy_wiki/`, not yet inspected in this task  
**Source docs:** [`mini-wiki-inventory.md`](./mini-wiki-inventory.md)

**Why This Is Useful**

The legacy wiki reportedly contains `_messy_thoughts.md` files and `agent_ops/PLAN.md` with editorial conventions, attribution standards, speculative-entry rules, and heuristics.

**Best Target Pages**

- `agent_ops/PLAYBOOK.md`
- `agent_ops/LEADS.md`
- `agent_ops/DECISIONS.md`

**First Agent Pass**

- Inspect legacy `agent_ops/PLAN.md`.
- Extract only reusable editorial rules, not stale implementation details.
- Inspect `_messy_thoughts.md` for leads, then move public-safe items into `agent_ops/LEADS.md`.

**Progress / Notes**

- 2026-05-09: Created backlog item.
