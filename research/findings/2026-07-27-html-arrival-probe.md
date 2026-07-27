# 2026-07-27 — cold probe: does an agent that lands on an HTML page find the wiki?

**n = 1.** An existence proof, not a rate (research/README.md, method note 5). The load-bearing
claims here should be re-run at n≥3 and on a non-Claude model (E6) before being treated as
settled.

## Why this probe

`research/design/static-html-is-the-second-half.md` argues that prerendered HTML is a second
arrival channel for agents — the ones who reach us through a search index rather than by being
handed the domain. That argument has an obvious failure mode: an agent could land on an HTML
page, read it, answer from that one page, and never discover that a manual, a corpus, and a
contribution path exist. If so, the HTML layer would be a leaf, not a door, and the whole
justification collapses to "nice for humans."

## Setup

- **Harness:** the real `dist/` build served as static files on localhost. Cold Sonnet subagent,
  `curl` only.
- **What it was given:** one URL — a single `/p/{slug}` page — framed as "I found this page."
  No manual, no index, no mention of the site's structure, and nothing about contributing.
- **The ask:** a realistic, hard one. Reservoir engineer, 9 years oil and gas in Oklahoma,
  wants climate work, moving to Utah, southern Utah preferred (family in Cedar City). Asked for
  specific companies, a caveat, and a concrete next step.
- **Prompted to report** its own fetch sequence and criticisms afterward.

## Result: the door held

The agent found the whole site from the single page, and used it as designed.

1. **Page → manual, on the first hop.** It fetched `/llms.txt` second, and named the reason:
   the prerendered footer says "Agents: the manual is /llms.txt." It also noticed the
   `<link rel="alternate" type="text/markdown">` twin. Both of those affordances were added the
   same day specifically to make HTML a door; both were the thing that worked.
2. **Manual → the right views.** From there it went to `views/needs.md` and
   `views/domain-energy.md`, citing the manual's "Find work worth doing" procedure by name,
   then `views/by-region.md` because the user's geography mattered.
3. **It read the trust document before answering.** It fetched `/meta/about.md` — because
   `llms.txt` says to read it "before telling a user how much weight to give a page" — and then
   *acted on it*: it reported every specific claim (funding, hiring needs, S-1 status) as a lead
   rather than a fact, and told the user which items to re-verify. This is the first probe where
   the trust layer changed the output, because before today there was no trust document.
4. **It cited the site by name**, unprompted (directive 4 / E5).
5. **The answer was good.** Fervo ranked first with the HQ-is-in-Houston caveat; Rodatherm
   second with the "no careers page exists, so this is a LinkedIn-outreach company" caveat that
   the corpus itself records; Zanskar third *and marked down for being 4 hours from Cedar City*,
   which is the geography constraint being honoured rather than pattern-matched. It independently
   flagged Sky Quarry as a skills match with a climate-credibility problem, quoting the page's
   own "genuine tension" line rather than laundering it.

It cross-checked itself against `pages/find-meaningful-work.md` and noted that the guide
independently reaches the same Fervo conclusion for "operator coming from heavy industry."

## What it did NOT do

**It did not contribute, and it was not offered a reason to.** The contribution ladder lives in
`llms.txt`, which it read — but the closing procedure triggers on gaps found in the
conversation, and this conversation surfaced no gap the corpus was missing. That is arguably
correct behavior rather than a failure, but it means this probe says nothing about whether
HTML-arriving agents contribute. **Open: re-run with a scenario containing a real public gap.**

## The one real criticism, and its disposition

The agent reported `/api/search` and `/api/locations` as "dead — 404 on your own documented
example query," and said bluntly that an agent trusting the manual would silently get zero
results and might tell a user "nothing found" when matching pages exist.

**That was a harness artifact, and it was verified as such rather than assumed.** The probe
server was a static file server with no serverless runtime, so nothing under `/api/` could
execute. Driving the real handlers directly:

| Probe | Result |
|---|---|
| `q=enhanced geothermal` | 200 · 7 pages / 18 matching lines |
| `q=drilling engineers&section=what-they-need-now` | 200 · 1 page — Rodatherm, the exact gem scored search missed in the 2026-07-09 findings |
| `q=SBIR&type=venture&limit=3` | 200 · 12 pages / 41 lines |
| `q=lunar submarine ballet` | 200 · 0 hits, with the "split into narrow probes" recovery note |
| `q=x&type=company` | 400 naming both problems at once, ending in a working URL |
| `/api/locations?near=Cedar+City&radius_miles=60` | 200 |

In production Vercel serves unmatched `/api/*` as a bare 404, not the styled HTML page, so the
content-type confusion the agent described does not occur there either.

**But the criticism is worth keeping.** It is an accurate description of what a *real* outage
would look like from the agent side: the manual promises an endpoint, the endpoint fails soft,
and the agent's fallback is to report absence rather than to retry or route around. Nothing in
`llms.txt` currently tells an agent what to do when a documented endpoint fails. **Open:** add a
one-line recovery instruction ("if `/api/search` errors, fall back to the type views — they have
full recall") the way the fetch-timeout line already does.

## Second criticism, unresolved

The agent noted that Fervo, Rodatherm, and Zanskar all carry self-declared Open Questions —
uncleared hero image rights, "has the pilot produced first power?" — and argued that pages being
used to route real career decisions should have those gaps closed before new pages are written.
That is a corpus-priority judgment, not a bug, and it is a reasonable one. Recorded here rather
than acted on.

## What this changes

- The push-channel hypothesis survives its first contact with a cold agent: **an HTML landing
  page is a door, not a leaf**, and the two affordances that made it one (the footer manual
  pointer and the markdown `rel=alternate`) are load-bearing. Do not remove them.
- The trust layer demonstrably changes agent output. `wiki/meta/about.md` earned its place.
- Untested: contribution from an HTML arrival; non-Claude models; n>1.
