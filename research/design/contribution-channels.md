# Contribution channels — designing around the outbound-write block

**Date:** 2026-07-09 · **Problem:** in round 3, a willing agent composed a correct, anonymous contribution note and was blocked by its own platform's tool permissions ("writing to an external system wasn't something you'd explicitly asked for"). This is not a bug in that platform — it's the correct default for agent harnesses, and we should assume **most agents cannot POST to an unknown domain without a human approval step**. Our architecture must convert contributions *through* that constraint, not despite it.

## The reframe

The consent step already exists in our design (ask the user before sharing their knowledge). The platform's write-approval prompt is just a second consent surface. So the real design question is: **when a human is asked "should this be sent?", how do we make yes trivial?** — and where possible, **let the human do the send** so no agent permission is needed at all.

## Channels, in order of preference

### 1. Handoff URL — the human clicks, no agent write needed (primary for blocked agents)

The agent composes the contribution, then gives its user a link that carries the draft:

```
https://greatutah.work/contribute#<base64url of {kind, path, content, reason}>
```

A tiny static page decodes the fragment client-side, shows the draft ("You're suggesting a note: …"), and has one Submit button that does the POST from the *user's browser*. Properties:

- Zero agent permissions needed; the human performs the write, which is the strongest consent form there is.
- URL fragments never reach our server logs — nothing is transmitted until the human clicks.
- Notes (≤2KB) fit comfortably in a URL; full pages may not — for pages, the same page accepts paste, so the agent's fallback is "here's the draft, paste it at greatutah.work/contribute."
- The manual instructs: *"If your platform blocks the POST, don't fight it — give your user this link instead."* The blocked case becomes a designed path, not a failure.

### 2. Direct POST with an approval-friendly shape (primary for permitted agents)

Many harnesses show the user the exact request and ask. Optimize what that prompt looks like:

- Keep the note rung tiny — a short JSON body a human can read at a glance.
- The endpoint description the agent relays must carry the safety facts: *review-gated (a human merges), creates a pull request, cannot break anything, no account, no PII expected.*
- Idempotent and forgiving: resubmission is safe; malformed input gets a helpful 400 that tells the agent (and the watching human) exactly what's wrong.

### 3. Platform-native capability: MCP server + skill (the permanent fix)

Publish a `greatutah.work` MCP server (tools: `search_wiki`, `read_page`, `contribute`) and a matching agent skill. A user who installs it has granted the permission **once, deliberately, in advance** — every later contribution is frictionless and properly scoped. The manual and the human site both say: *"Use this often? Install the MCP server / skill and your agent can contribute without per-request approval."* This also compounds evangelism: installation is the strongest form of "tell your user."

### 4. GitHub as the write path for repo-capable agents

Coding agents (a large share of our real visitors) can already open PRs with credentials their user gave them. Document the repo (`wiki/<category>/<slug>.md`, PR against main) as an equal-class channel. No new permissions — they use ones they already hold.

## Explicitly rejected

- **Encoding writes as GETs** (e.g., `GET /api/contribute?note=…`) so they slip past write-permission checks. It would "work," and it is exactly the kind of consent-evasion that got prototype E flagged as manipulative — except aimed at the user's security model instead of their attention. A platform that catches it would be right to blocklist the domain. Trust is the asset; don't spend it.

## Measurement consequence

"Contribution rate" is now a funnel, and tests must record each stage:

`gap detected → classified (public / user's) → draft composed → channel chosen (POST / handoff URL / MCP / PR) → sent or offered → landed`

Round 3 already showed stages 1–4 working (4/4, 3/4, 2/4, 1 attempt). E7's two-turn test should verify the handoff-URL path: does a blocked agent produce a *valid* handoff link (or paste-ready draft) rather than giving up?

## Build order

1. `/contribute` static page (decode fragment → preview → POST). Small, no framework needed.
2. Manual text: channel guidance incl. the blocked-POST path.
3. MCP server + skill (after the interface stabilizes — the tools mirror the HTTP surface 1:1).
