# Great Work Utah Wiki Agent Playbook

**Status:** Draft
**Confidence:** Medium
**Updated:** 2026-05-09

## Intake Questions For Talent

Ask for prose, not just fields:

- What kind of work would make the next two years feel worthwhile?
- Which domains do you understand from the inside?
- What stages can you tolerate: lab, pre-seed, seed, growth, public company, government program?
- How much risk can you take: full-time, fractional, advisory, internship, volunteer mentor?
- What do you never want to do again?
- What proof of work should a founder trust?

## Intake Questions For Startups

Ask what would change the company's next 90 days:

- What are you building, in plain language?
- What is the immediate bottleneck: customer discovery, product, regulatory, capital, hiring, operations, sales, manufacturing, or partnerships?
- What kind of person has succeeded in this environment before?
- What kind of helper would create negative value?
- What is public, what is private, and what can be shown to a potential match?

## Match Explanation Pattern

Every match should answer:

- why this match is being recommended
- what each side appears to need or offer
- what evidence supports the claim
- what could make the match wrong
- what the next low-risk step should be

## Synthetic Data Rule

Synthetic people and private needs are allowed in demo artifacts, but they must be labeled clearly. Real organizations, resources, and public claims should cite public source pages.

## Editorial Guardrails

Do not imply willingness, availability, endorsement, or an existing relationship unless the evidence explicitly supports it.

Do not expose internal seed provenance in public pages. Keep that in operations notes.

## Parallel Agent Work Claims

When multiple agents are running, use `wiki/agent_ops/locks/` as a social lock system.

Before editing, each agent should create a claim file from `wiki/agent_ops/locks/TEMPLATE.md` that names:

- the goal
- owned files or folders
- read-only context
- files it must not edit

This is not a real lock. It is a visible coordination note. Agents should avoid editing files claimed by another active agent unless the user explicitly asks them to take over.

At the end of the run, update the claim with:

- status: `done`, `paused`, or `blocked`
- files changed
- unresolved issues
- next best task

When many agents are active, avoid editing shared coordination files directly. Leave notes in the claim file and let a coordinator merge `docs/wiki-seed-worklist.md`, `wiki/agent_ops/RUN_LOG.md`, and `wiki/agent_ops/DECISIONS.md`.
