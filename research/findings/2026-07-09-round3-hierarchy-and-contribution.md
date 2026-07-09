# Findings: round 3 — reorganized document layer + contribution ladder

**Date:** 2026-07-09 · **Variant:** V3-hierarchy (port 8808) · **Runs:** 4 cold Sonnet agents — 2× job/Vanguard (repetition), 1× job/composites (scenario variance), 1× founder/funding (use-case variance). Baselines: 9 prior runs (rounds 1–2).

Method notes applied this round (maintainer feedback): repetitions because outputs are stochastic; a *different* job profile because a design can work on one scenario and fail on another; single runs hereafter count as existence proofs, not rates.

## What changed in v3

1. **Reorganized document layer, no files moved** (mock overlay): a layered master index (facts / judgment / derived; matches+answers not listed), an enriched ventures index (title · focus · needs-clause · confidence per entry), and `indexes/needs.md` — every venture's "What They Need Now" in one 30KB file.
2. **Contribution ladder**: note (no bar) / stub (≥1 public source) / page, via `kind:` on one endpoint; notes feed a public `/wanted.md`.
3. **Knowledge split** stated in the manual: public knowledge → contribute freely; the user's knowledge → ask the user, with suggested phrasing; unsourceable user-adjacent gap → anonymous note.
4. No scored search (per sequencing: hierarchy first, search parity later).

## Navigation results

| Run | Requests | 404s | Tokens | needs.md used | Ground-truth gems |
|---|---|---|---|---|---|
| job/Vanguard #1 | 14 | 2 (both deliberate gap-checks) | 80K | 2nd fetch | Rodatherm ✓ (+Merit, Fervo, Torus, Zanskar correctly tiered) |
| job/Vanguard #2 | 14 | 0 | 60K | 2nd fetch | Rodatherm ✓ #1, "Utah-HQ'd, not just Utah-projected" |
| job/composites | 11 | 1 (deliberate) | 53K | 2nd fetch | ACT ✓ ("single best match in the whole wiki") but correctly demoted for location; Northrop Promontory ✓ #1; Hexcel ✓ |
| founder/funding | 24 | 0 | 71K | 4th fetch | Correct stage sequencing; added a customers-before-capital insight (FORGE/Fervo/Zanskar as pilot customers) the round-2 run lacked |

- **The needs index worked exactly as predicted.** 4/4 agents fetched it immediately; **Rodatherm surfaced 2/2** on the scenario where the v2 search-first agent missed it. On the new scenario, the agent quoted needs lines verbatim as evidence.
- **The Rodatherm failure class is closed** — but note the general lesson: the fix was *moving decisive facts into a derived index*, not better search.
- **Cost fell.** Job runs: 53–60K tokens (2 of 3) vs. 62–85K in all prior rounds. The composites run (11 requests, 53K) is the cheapest competent run of 13 to date.
- **matches/ and answers/ were never fetched** (they're off the master index) — and nothing degraded; agents used `guides/` instead in all 4 runs (find-meaningful-work 3×, startup-capital-in-utah 1× — as *first* fetch in the founder run). Prior rounds wasted fetches on matches pages. **Supports dissolving matches/ and pruning answers/** (see `design/hierarchy-v1.md`).
- Judgment-layer navigation is real: agents used guides to *check their own shortlists* against the wiki's editorial view, and relayed stub/low-confidence warnings to users unprompted (founder run).

## Contribution results

Across 4 runs (13 total historical):

- **4/4 executed the close-the-loop scan** (checked employers/companies from the conversation against the wiki; 3 deliberate 404 probes + everything.md greps). Old interfaces with material available: 0/1 (round-2 control scanned nothing).
- **3/4 made a consent-offer to the user** for user-adjacent gaps, with correct reasoning ("your company's information to share, not mine — want me to draft a page or note?"). The 4th (composites) correctly found *no* legitimate gap — Janicki is out of the wiki's Utah scope — and filed nothing: **zero junk contributions**.
- **1/4 attempted an actual POST** — the founder agent composed a public, user-anonymous note (missing seismic-instrumentation coverage), picked the right rung, anonymized correctly… and was **blocked by its own platform's tool permissions** ("writing to an external system wasn't something you'd explicitly asked for"). It reported the block honestly and did not work around it.
- One run explicitly acknowledged reading the site's instructions as untrusted content and *still* performed the read-only loop and consent-offer — the with-the-grain design working as intended.

**Interpretation.** The ladder + split produces the intended behavior chain: scan → classify (public vs. user's) → offer or attempt. Two structural realities cap conversion to landed contributions, and neither is fixable by our copy alone:

1. **Consent is a second turn.** The offer ("want me to add it?") converts only when the user replies. In production this is fine — it's exactly the maintainer's intent ("ask their users for permission") — but tests that end after one turn will systematically undercount contributions. Future tests should measure **attempted + offered**, or simulate the user's "yes" and observe follow-through.
2. **Agent platforms gate outbound writes.** Even a willing agent may need its user to approve a POST at the harness level. Mitigations on our side: make the endpoint legible (idempotent, review-gated, documented as "creates a reviewed pull request — cannot break anything"), so the approval prompt the *user* sees is easy to say yes to; and keep the note rung tiny so the request is transparently harmless.

## Scoreboard vs. objectives (13 runs total)

| Objective | Status |
|---|---|
| Navigate + answer well | Solved since round 1; v3 is now also the cheapest |
| Surface the gems reliably | needs.md: 2/2 on the previously-missed gem + instant hit on new scenario; repetition n is still small — keep watching |
| Contribute | Behavior chain works (4/4 scan, 3/4 offer, 1/4 attempt); landed-contribution measurement needs two-turn tests |
| Evangelize | Site named in 4/4 answers; explicit cite-line in 2/4 — adequate, not yet strong |
| Don't spam / don't leak | 0 junk contributions, 0 user-info leaks in 13 runs |

## Next

- **Round 4 (contribution):** two-turn test — user says "yes, add it"; does the agent submit a well-formed stub? Plus one scenario with a clean *public* gap unrelated to the user (tests the "contribute freely, no permission needed" branch, which no scenario has isolated yet).
- **Hierarchy:** promote the derived layer from mock overlay to the real build (generate `wiki/indexes/needs.md` + enriched indexes + layered master index); then the expensive rebuild (dissolve matches/, prune answers/ — link repair measured at ~40 pages).
- **Then** search parity (grep endpoint), per sequencing.
