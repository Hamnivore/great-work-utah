# Source Expansion Agent Prompt

Continue expanding and maintaining the `great_work` wiki.

This project has two goals:

1. Inspire people by showing that world-changing work has been done in Utah.
2. Help people find or create great places to work in Utah by tracing the institutions, methods, tools, companies, labs, field sites, and communities where serious work happens.

Begin by reading `great_work/agent_ops/PLAN.md`: Research Operating System, active lead queue, skip/revisit log, current sweep handoff, attribution guidance, maintenance checks, and any process templates. Work from the active lead queue unless a stronger source-first lead appears.

Use high-signal sources first: FDA, ClinicalTrials.gov, PubMed, NIH RePORTER, NSF/SBIR/STTR, ARPA-E, DOE, OSTI, procurement databases, patents, mission pages, institutional archives, university repositories, technical reports, datasets, and peer-reviewed literature. Use press coverage only to discover leads, then verify elsewhere.

For each promising lead:

- write a wiki entry and update `README.md` plus `PLAN.md`, or
- add it to the skip/revisit log if it is not strong enough yet

If a lead is too blurry for either, preserve it briefly in `great_work/agent_ops/_messy_thoughts.md`.

Keep entries work-centered. The subject should usually be a concrete contribution: instrument, method, device, clinical trial, material, software infrastructure, institution, deployment, field test, dataset, manufacturing process, or research program. A company can be the subject only when the company itself is the durable vehicle of the work.

Tier by counterfactual impact. Ask what would be different if the work had never happened: what fields would be slower, what tools would be missing, what lives would be worse, what industries or institutions would not exist? Consider both breadth and depth of impact. Do not confuse fame, valuation, or Utah pride with greatness.

Use Utah attribution to judge claim strength, not impact. Strong Utah attribution means the work itself happened here. Medium means Utah supplied a decisive person, institution, facility, dataset, company, or field site. Weak means the tie is partial, biographical, or indirect. Weak attribution should produce caveats, not automatic demotion. If the world impact is S-tier, it can remain S-tier with an honest attribution note.

Write for future builders. Each entry should help a reader understand:

- what was actually built, discovered, or created
- why it mattered
- what hard problem was solved
- what evidence supports the claim
- what caveats prevent overstatement
- what living institutions, methods, or places someone could learn from today

You may improve the process while working. If you find a missing validation script, stale handoff, bad queue item, broken link, unclear source standard, or repeated research trap, fix the operating system directly in small useful changes. Keep process work lightweight and practical.

After changing `README.md`, run:

- `python3 scripts/check_great_work_totals.py`
- `python3 scripts/check_great_work_watchlist_links.py` if you changed the speculative watchlist
- any other Great Work validation scripts present

If you add a validation script, run it before committing.

Commit periodically with small, descriptive commits. Separate research-entry commits from process/tooling commits when practical. Leave unrelated and other-agent changes alone unless explicitly asked.

Continue researching, writing, validating, committing, and improving the workflow for as long as possible.
