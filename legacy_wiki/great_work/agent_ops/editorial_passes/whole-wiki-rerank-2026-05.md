# Whole-Wiki Rerank and Refresh Pass - 2026-05

Goal: iteratively audit the whole `great_work` wiki for tier consistency, freshness, Utah attribution, source quality, and builder usefulness.

This pass does not need to proceed in README order. Agents should choose high-leverage or time-sensitive entries, record what they did, and leave a handoff precise enough for the next agent to continue.

## Pass Rules

- A work unit can be one article. Hard articles deserve full sessions.
- Prefer depth over pretending to cover many entries.
- Mark entries as `audited` even if the conclusion is "no change."
- Mark entries as `blocked` with a concrete missing source or unresolved judgment.
- If you change tiers, titles, paths, or watchlist status, update `great_work/README.md`.
- If you make a durable ranking judgment, also update `great_work/agent_ops/EDITORIAL_PLAN.md`.
- Use canonical entry paths like `great_work/domain/article.md` so the coverage script can track them.

## Current Work Queue

Add rows here when an entry or cluster should be picked up soon. Remove or mark done when resolved.

| Priority | Work unit | Why now | Suggested scope | Status |
|---|---|---|---|---|
| High | Main historical S/A boundary | S and A are the most reputation-sensitive tiers. | Audit 1-3 current S/A entries per session for counterfactual impact and source strength. | queued |
| High | Speculative P-A entries | P-A can quietly become hype if upgrade triggers are not checked. | Audit 1-3 P-A rows; check whether triggers have been met, weakened, or need rewriting. | queued |
| High | Recent 2025-2026 operating claims | These are most likely to be stale or overranked. | Audit one recent project deeply, with current primary sources. | queued |
| Medium | Weak Utah attribution cases | Weak attribution can be valid but must be explicit. | Find entries lacking attribution notes and add caveats where needed. | queued |
| Medium | Press-heavy older entries | Older pages may have been written from fast sources. | Replace or supplement weak sources in 1-3 entries. | queued |

## Article Audit Ledger

Append one row per article audited. If an article takes a whole session, that is a good row, not a failure.

| Date | Agent/session | Entry path | Pass focus | Starting tier | Recommended tier | Status | Handoff |
|---|---|---|---|---|---|---|---|
| 2026-05-06 | Codex | `great_work/culture-and-arts/⭐spiral-jetty.md` | Tier calibration | A | S | edited | Promoted as textbook-defining Land art; future checks should focus on source enrichment and stewardship/current access, not relitigating tier absent new evidence. |
| 2026-05-06 | Codex | `great_work/industry-and-infrastructure/bingham-canyon-mine.md` | Tier calibration | B | A | edited | Promoted for global low-grade porphyry copper mass-mining impact; later pass should improve primary/archival sources. |
| 2026-05-06 | Codex | `great_work/industry-and-infrastructure/electric-traffic-signal.md` | Tier calibration | A | B | edited | Demoted because Utah claim is real but direct global lineage is weaker than later standardized systems. |
| 2026-05-06 | Codex | `great_work/industry-and-infrastructure/mariana-minerals-copper-one.md` | Freshness / speculative boundary | B | P-B | edited | Moved to watchlist; revisit after 12-24 months of independent production, safety, uptime, cost, and replication evidence. |
| 2026-05-07 | Codex | `great_work/medicine-and-biology/injectable-disc-cell-therapy.md` | P-A freshness / source quality | P-A | P-A | edited | P-A still fits: Phase 1/2 signal is peer-reviewed and sponsor-led, and Phase 3 DGX-A02 appears active/recruiting with no Phase 3 results or FDA approval yet. Added Utah attribution, ClinicalTrials/PMC sources, and sharper caveats. |
| 2026-05-07 | Codex | `great_work/medicine-and-biology/noninvasive-deep-brain-ultrasound-neuromodulation.md` | P-A freshness / source quality | P-A | P-A | edited | P-A still fits: Utah-led DIADEM human pilot studies are peer-reviewed and sham-controlled, but remain small/single-center with no pivotal, multicenter, clearance, or approval evidence. Added completed pain-trial status, registry caveat, and PMC sources. |

## Domain Coverage Notes

Use this section for brief handoffs that do not fit a single article row.

- No full domain has been completed in this pass yet.
- The initial editorial pass touched culture/arts and industry/infrastructure only.
- Medicine and speculative watchlist entries likely need the most freshness checking; the first two P-A medicine freshness checks left Injectable Disc Cell Therapy and Noninvasive Deep-Brain Ultrasound Neuromodulation in P-A pending pivotal/regulatory evidence.
