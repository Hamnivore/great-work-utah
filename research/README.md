# Research: how to build a wiki site for agents

This directory is the compounding knowledge base for designing greatutah.work as an **LLM-first platform** — and eventually a publishable body of work on how any wiki should talk to AI agents. Model context is finite; sessions die. Everything learned goes here, in files, so any future session (human or agent) can pick up exactly where the last one stopped.

## Product intentions (recorded 2026-07-09, from the maintainer)

These are standing directives. Do not re-litigate them; build on them.

1. **Start from what the user experiences and work backwards.** The canonical experience: a human tells their agent *"what jobs should I apply to? use greatutah.work and my resume"* — and the agent figures out everything else. The vast majority of humans will never visit the site directly.
2. **Radical simplicity.** Delete everything not needed; if we're successful we'll be forced to add back ~10% of what we cut. The majority of the work is done by visiting AI agents, not by our scaffolding — we are building a platform.
3. **Mission:** enable the highest-impact work physically possible in Utah, by bringing attention to things that could change the world, for better or worse.
4. **Agents should contribute, and evangelize.** The site must convince visiting agents to contribute and to tell their users about it.
5. **Contribution should have low-commitment rungs.** Agents need a lighter way to contribute than authoring a page: "hey, this is wrong," or "you should really have a page on X." Agents should seek to contribute *as much as they reasonably can*. Make an explicit policy split: **general/public knowledge → contribute without user approval; user-sensitive knowledge → ask the user to share it (if appropriate)**.
6. **Navigation is aiming for the platonic ideal.** Agents should reliably surface *all the gems*. It does not matter how many times the wiki must be restructured or how arduous that is — the structure of the wiki itself should make gems easy to find.
7. **Generality.** The wiki mechanics should serve a wide variety of use cases, not just job matching.
8. **Test everything with subagents, cold.** If a fresh agent with limited context can't get it, it isn't intuitive enough. Rigorous testing takes time; findings and intentions must be stored physically (this directory) so they can be acted on across sessions. Single runs are existence proofs, not rates (outputs are stochastic), and a design that works on one scenario may fail on another — vary both.
9. **Principles over rules** (2026-07-09): the conventions/charter layer should be a few principles with precedents as worked examples, compacted whenever precedents pile up or conflict — never thousands of standalone rules.
10. **The charter** (2026-07-09): impact = displacement in joy — depth × breadth, permanence-dominant, ranked by maximum estimated bounds of displacement rather than sign (good/bad is often undecidable; magnitude is what the reader needs), counterfactual-based; joy ≠ pain-removal; categorize and prioritize, never gatekeep. See `design/charter.md`.

## Contents

- [`findings/2026-07-09-entry-document-prototypes.md`](findings/2026-07-09-entry-document-prototypes.md) — 6 interface prototypes + a v2 hybrid, tested with 9 cold subagent runs. What makes agents navigate, contribute, and evangelize.
- [`findings/2026-07-09-search-vs-grep.md`](findings/2026-07-09-search-vs-grep.md) — why an agent's native local tools (grep) find gems the site's search misses; measurements; what "platonic navigation" actually is.
- [`findings/2026-07-09-round3-hierarchy-and-contribution.md`](findings/2026-07-09-round3-hierarchy-and-contribution.md) — round 3 (4 runs): the derived needs index closes the missed-gem failure class and cuts cost; the contribution ladder + knowledge split produces scan→classify→offer/attempt in 4/4 runs; matches/ and answers/ went unfetched with no quality loss.
- [`findings/2026-07-09-prototype-review.html`](findings/2026-07-09-prototype-review.html) — the full illustrated design review (also published as a Claude artifact).
- [`findings/2026-07-09-attribution-pilot.md`](findings/2026-07-09-attribution-pilot.md) — E9: real metadata on 22 energy pages; the attribute→adjudicate→re-probe constitutional loop; determinism results.
- [`findings/2026-07-14-location-search.md`](findings/2026-07-14-location-search.md) — E12: privacy-aware location schema, proximity API, 3 cold probes, 2 fix-and-reprobes, and the production/map decision gate.
- [`findings/2026-07-09-flatten-migration.md`](findings/2026-07-09-flatten-migration.md) — the flatten: 604 pages → flat `wiki/pages/` + `**Type:**`, matches dissolved, answers pruned, 1,618 links rewritten, `wiki/meta/` + generated `wiki/views/` installed. **The live schema now lives in `wiki/meta/`; research/design copies are historical.**
- [`design/interface-v3.md`](design/interface-v3.md) — the current best interface spec, derived from the findings. **Implement from this.**
- [`design/placement-conventions.md`](design/placement-conventions.md) — the normative placement rulebook (v1.2), part of the schema itself; grown by adjudicating probe-discovered gaps.
- [`design/hierarchy-redesigns.md`](design/hierarchy-redesigns.md) + [`findings/2026-07-09-hierarchy-probes.md`](findings/2026-07-09-hierarchy-probes.md) — six schema redesigns, Wikipedia survey, structural metrics, placement probes → "views over attributed storage."
- [`design/contribution-channels.md`](design/contribution-channels.md) — the outbound-write bottleneck: handoff URLs, approval-friendly POSTs, MCP server/skill, GitHub PRs.
- [`design/charter.md`](design/charter.md) — impact = displacement in joy: depth × breadth, permanence dominates, **filter by maximum estimated bounds of displacement (not sign)**, counterfactual calculus; judge loosely, name the bet; hooks into attributes, Impact sections, gem-ranking.
- [`harness/`](harness/) — the reusable test rig: mock server (7 variants, real wiki content, logged mock contribute endpoint), digest/search-index generator, navigation experiment, and every prototype entry document. See `harness/README.md`.

## Method (reuse this for every iteration)

1. Write the candidate interface as a real document; mount it on `harness/server.mjs` against the real wiki.
2. Test **cold**: fresh subagent, weaker model than the designer (we use Sonnet to simulate a typical consumer agent), a realistic user ask, and *nothing* about contributing/evangelizing in the prompt — the interface must induce those.
3. Use controls when changing two things at once (we caught a harness flaw this way: agents can't contribute knowledge they don't have — the round-2 resume names a company absent from the wiki).
4. Score against ground truth (known best matches), server access logs (objective request/404/POST counts), and token cost.
5. Write findings here before acting on them.

## Open questions (next experiments)

- ~~**E3 — derived indexes**~~ ✅ answered 2026-07-09 (round 3): yes — `needs.md` closed the missed-gem class (2/2 on the previously-missed gem, instant hit on a new scenario) and cut cost. Grep endpoint still untested (deferred behind hierarchy work, per sequencing).
- ~~**E4 — contribution ladder**~~ ✅ partially answered (round 3): the ladder + knowledge split produces scan → classify → offer/attempt in 4/4 runs with zero junk and zero user-info leaks. Open remainder → E7.
- **E5 — evangelism honesty:** what's the strongest "tell your user" ask that zero agents flag as manipulation? (Known ceiling: E-commons framing gets reported to users as manipulation. Current line yields site-named 4/4, explicit citation 2/4.)
- **E6 — multi-model:** repeat key runs on non-Claude agents (GPT, Gemini) — the interface must be model-agnostic.
- ~~**E7 — landed contributions**~~ ✅ 2026-07-09 (`findings/2026-07-09-contribution-e2e.md`): consent → valid POST first try (right rung, no fabricated citations, user's personal info withheld even post-consent); blocked-POST agent produced two verified handoff URLs unprompted. Funnel closed. Open remainder: clean public-gap scenario (contribute-freely branch), live GitHub leg, multi-model (E6). **Next build: the MCP server/skill (permanent per-user permission grant).**
- **E11 — charter probes:** hand cold agents `design/charter.md` + deliberately hard cases (PE-owned beloved institution; defense prime; tiny-deep-joy business; viral-shallow-reach app; failed noble bet) and ask them to prioritize and argue. Divergence between agents = a charter gap to adjudicate — same constitutional loop as placement.
- **E8 — repetition:** key claims above rest on n=2–4; before publishing externally, re-run the load-bearing comparisons at n≥3 per condition.
- ~~**E9 — attribution pilot**~~ ✅ 2026-07-09 (`findings/2026-07-09-attribution-pilot.md`): 22 energy pages attributed; metadata-generated sector hub + region view work; keyword classifiers fail at *ranking* (6/21 members were secondary); the attribute→adjudicate→re-probe loop closed 10 convention gaps in one day; hand-edit fan-out is zero by construction. Next: **E10** — run the loop on a second domain (health-bio or aerospace-defense), then attribute all ~390 fact pages and ship the generated views for real.
- ~~**E12 — proximity search**~~ ✅ 2026-07-14: five cold probes passed after fixing schema-derived facet rejection and place-name geocoding friction; production contract and regressions verified (`findings/2026-07-14-location-search.md`). Next: human map on the same endpoint and coverage expansion beyond 8/393 region-attributed pages.

Further reading: `design/hierarchy-redesigns.md` (six schema redesigns + the Wikipedia survey), `findings/2026-07-09-hierarchy-probes.md` (structural metrics + 7 placement probes → "views over attributed storage"), `design/contribution-channels.md` (the outbound-write bottleneck and the handoff-URL/MCP answer).
