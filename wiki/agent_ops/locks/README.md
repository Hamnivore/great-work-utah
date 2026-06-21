# Agent Work Claims

**Status:** Useful
**Confidence:** Medium
**Updated:** 2026-05-09

## Purpose

This folder is a lightweight social lock system for parallel wiki agents.

It is not a real lock. It is a visible "hey, I am working on this" claim so agents can avoid stepping on each other during hackathon-speed parallel work.

## How To Claim Work

Before editing wiki pages, create a file in this folder. Timestamped filenames are preferred for crowded runs, but older date-only claims are valid history:

```txt
wiki/agent_ops/locks/YYYY-MM-DD-HHMM-agent-slug.md
```

Use a short slug like:

- `business-services`
- `commercialization`
- `capital`
- `deep-tech-map`
- `meaningful-work`
- `public-wiki-index`

Copy the template from `TEMPLATE.md`.

## How To Use Claims

At the start of a run:

1. Read active lock files in this folder.
2. Pick work that does not overlap, if possible.
3. If overlap is unavoidable, narrow your owned files and say so in your claim.
4. Do not edit files claimed by another active agent unless the user explicitly tells you to.

At the end of a run:

1. Update your claim status to `done`, `paused`, `blocked`, or `superseded`.
2. List files changed and files that still need attention.
3. Leave the file in place as a handoff note.

## Active Versus Stale

A claim with `Status: done`, `Status: complete`, `Status: completed`, or `Status: superseded` is historical. Prefer `done` for finished claims and `superseded` when a later boss completed or replaced the slice.

A claim is probably stale if:

- it is more than 4 hours old,
- it has no recent update,
- and the agent is not actively running.

If a file has contradictory statuses, read its handoff before treating it as active. If you take over stale work, create a new claim and mention the old claim you are superseding. Do not leave broad active claims open after narrower bosses finish the work; mark the old broad claim `superseded` or `paused`.

## Shared Files

Treat these as coordinator-owned when multiple agents are active:

- `docs/wiki-seed-worklist.md`
- `wiki/agent_ops/RUN_LOG.md`
- `wiki/agent_ops/DECISIONS.md`
- `wiki/agent_ops/agents.md`

Agents may read them freely. Prefer not to edit them in parallel. Instead, record completion notes in your lock file and let a coordinator merge them.
