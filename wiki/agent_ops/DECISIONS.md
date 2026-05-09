# Editorial Decisions

**Status:** Useful
**Confidence:** Medium
**Updated:** 2026-05-09

## Wiki Root

`wiki/` is the canonical public Great Work Utah wiki.

`legacy_wiki/` is the internal seed corpus. Agents may use it to discover leads, preserve editorial context, and compare coverage, but public pages should cite public evidence instead.

## Product North Star

The wiki is a living map of Utah's rare opportunities.

It should help people discover:

- what is unusually worth paying attention to
- who might be a rare fit
- which helpers or resources matter in context
- why a recommendation is credible
- what evidence supports it
- what still needs to be verified

The goal is not to make static pages predict every match. The goal is to make the wiki rich enough that search-time matching can reason well.

## Public Evidence

Public pages should not cite internal seed files, local parsed bundles, or agent provenance as evidence.

Prefer public source records:

- official websites for self-description
- university and government pages for institutional facts
- public filings and records for legal or financial claims
- independent reporting for third-party context
- press releases for announcements, treated as leads rather than neutral proof

## Guide Taste

Entity pages describe. Guides, matches, and answers recommend.

Meaningful-work guides should help users discover non-obvious opportunities. Preferred guide labels include:

- Category-Defining Anchor
- Hidden Gem
- Rare Fit
- Emerging Bet
- Useful but Caveated
- Watchlist

Avoid generic referral language when the page is meant to reveal hidden fit.

## Search-Time Matching

Many of the best matches will be generated at search time from a user's actual situation. Wiki pages should provide rich evidence, needs, offers, caveats, and context so the search agent has strong material to reason over.

Do not overfit static pages to every possible persona. Preserve reusable facts and clear guide criteria.

## Worklist Status

Use `first_pass` instead of `seeded`. A first pass means the category is useful enough for the demo but not complete.

Prefer category work over source-pile work. The most useful categories right now are:

- meaningful work
- Nucleus demo matches
- business services
- commercialization
- startup capital
- Utah deep tech map
- persona answers

## Parallel Agent Coordination

Use `wiki/agent_ops/locks/` for social locks when multiple agents run at once.

Agents should claim a category and owned files before editing. The claim is advisory, not technical enforcement, but agents should treat active claims as real boundaries unless the human says otherwise.

Shared coordination files should usually be merged by one coordinator:

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/DECISIONS.md`
- `docs/match-wiki-agent-prompt.md`
