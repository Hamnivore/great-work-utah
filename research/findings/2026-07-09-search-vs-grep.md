# Findings: why local grep finds gems the site search misses

**Date:** 2026-07-09 · **Experiment:** `research/harness/nav-experiment.mjs` · **Trigger:** in the round-2 prototype test, the agent that used `/api/search` missed Rodatherm Energy — the ground-truth best match — which agents that read the category index found easily.

## The question

When a capable agent searches this wiki *locally* with its native tools (ripgrep over files), does it surface gems the website's tools miss? Yes. Measurably. Here's why.

## Measurement 1: the search index sees 13% of the wiki

The prototype `/api/search` (and any summary-based index) matches against title + focus tags + summary: **290KB of a 2,173KB corpus — 13.3% of the text**. The other 87% — including precisely the sections that answer real questions — is invisible.

The wiki's venture pages are strongly structured (117 pages):

| Section | Pages that have it |
|---|---|
| `## Summary` | 117 |
| `## Utah Context` | 117 |
| `## Open Questions` | 117 |
| `## Evidence` | 117 |
| `## Impact` | 114 |
| `## What They Need Now` | 113 |
| `## Who Could Help` | 109 |
| `## What They Are Building` | 108 |

For the canonical use case ("what jobs should I apply to?"), the signal lives in `## What They Need Now` — 100% invisible to summary search. Rodatherm's page says, in that section: *"Petroleum engineers, drilling engineers, and reservoir engineers… Mechanical engineers for power-generation hardware."* Its focus tags and summary say none of that. A summary index can never rank it for a hiring query.

## Measurement 2: full-text scoring alone does not fix it

We re-ran the exact queries the failing agent used, against (a) the summary index and (b) identical bag-of-words scoring over full page text:

| Query (verbatim from the failed run) | Rodatherm rank, summary search | Rodatherm rank, full-text |
|---|---|---|
| `mechanical engineer test engineer drilling medical device` | miss | **miss** |
| `drilling downhole geothermal field operations` | 6 | 7 |
| `surgical stapler medical device test engineer design for manufacturing` | miss | **miss** |
| `hiring drilling engineers` | 11 | 18 |
| `seismic sensors geothermal exploration` | 7 | **3** |

Full text helps some queries (seismic: 7→3) and, across the five queries, surfaces 3–11 top-20 results per query that summary search misses entirely — including the *Find Meaningful Work in Utah* guide, the wiki's own judgment layer, which summary search never returned for "hiring drilling engineers." But the term-soup queries still miss, because bag-of-words scoring rewards pages matching *many* terms weakly (medtech pages matching "medical device test engineer") over pages matching the *decisive* term exactly ("drilling engineers" in a needs section).

## Why grep wins

When a capable agent (or I) search this wiki locally, none of the above happens, because grep is a different *interaction pattern*, not a better ranking function:

1. **Full text, always.** Nothing is invisible.
2. **Exact phrases, not term soup.** A local search is `"drilling engineer"`, then `"test rig"`, then `"downhole"` — three precise probes, not one 8-word query averaged into mush.
3. **The matching line is the result.** Grep returns the sentence containing the match — the agent judges relevance from evidence, instead of trusting an opaque score.
4. **Iteration is cheap**, so the agent naturally does many narrow searches and unions the results — recall comes from the agent's loop, not the engine's cleverness.
5. **Structure-aware probes are possible** — search only within `## What They Need Now` across every page, which is exactly the "who is hiring what" question.

The platonic navigation target is therefore: **give visiting agents the same affordances a local agent has** — plus derived indexes that exploit the wiki's structure so common questions don't need search at all.

## Design consequences (feed into `design/interface-v3.md`)

1. **Replace scored search with a grep endpoint.** `GET /api/grep?q=<phrase>&section=<name>` → matching line + a line of context + page path, exact/phrase matching, documented as "make several narrow probes." This mirrors ripgrep, which is what agents already know how to drive well.
2. **Derived reverse indexes, generated from structure.** The killer example: `indexes/needs.md` — every venture's `## What They Need Now` distilled to one line each. One ~15KB fetch answers "who needs people like X right now" with *perfect* recall over 113 pages; Rodatherm becomes unmissable. Same recipe: `indexes/open-questions.md`, a focus-tag index (`tag → pages`). Derived indexes are rebuilt by script, so restructuring cost stays near zero.
3. **The wiki's section schema is now load-bearing.** Structured sections are what make derived indexes and section-scoped grep possible. Lint for them; keep them rigorously consistent. (Restructuring the wiki to strengthen the schema is explicitly worth it — maintainer directive.)
4. **Keep category indexes and the digest**; demote or delete scored search. "Index first, grep to refine" replaces "index first, search to refine."
5. **Gems need an editorial surface too.** Recall machinery surfaces what matches; it can't say what's *underrated*. That's what guides/matches pages are for — and the entry document should send agents there ("check how a well-argued match cites evidence"), which round-1 agents actually did when told to.

## Proposed next experiment (E3)

Regenerate the mock with `indexes/needs.md` + `/api/grep`, rerun the round-2 job task cold, and check: does Rodatherm surface even for an agent that never opens the ventures index? Predicted: yes, via either affordance.
