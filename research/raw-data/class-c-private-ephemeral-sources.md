# Class C: ephemeral community channels

**Status:** 2026-08-11. **Ruled on by the maintainer the same day — see [The ruling](#the-ruling).**
Community Slacks are citable; the open question that remains is narrower and purely mechanical.

Read alongside [`../design/raw-source-capture.md`](../design/raw-source-capture.md), whose Class A /
Class B split this note argues is incomplete.

---

## The gap

`raw-source-capture.md` splits sources two ways:

- **Class A** — durable, queryable registries. Capture the *identifier*; the data is re-derivable
  forever.
- **Class B** — fragile, non-canonical, public web pages. Capture the *bytes*: verbatim excerpt,
  archive snapshot, content hash.

A source scraped from a **community Slack workspace** is neither, and every capture mechanism the plan
specifies fails on it by construction:

| Mechanism | Why it fails |
|---|---|
| `**Retrieved:**` (script-written) | The permalink resolves only for signed-in workspace members; no script can fetch it |
| `**Archive:**` / `**Archived:**` | The Internet Archive cannot crawl behind a workspace sign-in, so no snapshot can exist |
| `**Raw:**` (`raw/<slug>/…`, script-written) | `capture-raw-sources.mjs` fetches URLs; it cannot fetch this one |
| `verbatim-not-in-raw` lint check | With no raw capture, the corpus's anti-fabrication check cannot run |

So a Slack-sourced page owes `missing-archive`, `missing-verbatim`, and `missing-raw` forever, and its
quotes are unverifiable by the one mechanism that makes quotes trustworthy here. `attributes.md`
already lists `testimony` in the closed `Source Type` vocabulary and assigns it the secondary tier —
which *requires* archive + raw + verbatim. **For channel testimony that requirement is
unsatisfiable.** The vocabulary admits the source type; the capture contract forbids it.

**Note the distinction that survives the ruling below: this is a durability problem, not a privacy
problem.** The two were conflated when this note was first written, and separating them is most of the
work.

## The ruling

**2026-08-11, from the maintainer, in response to this note:**

> The Forge Utah, JustBuild, and NUNUG slacks are public, so the information within them can be
> treated as public too. Try not to post private-ish conversations/threads, but in general, anything
> on there can be treated similarly to, say, a reddit post.

This settles the citation question and is consistent with the rule already recorded in
`~/coding/scrapers/README.md` under "Sourcing rules":

> - **Slack is citable** when no other source exists. But Slack is ephemeral, so every captured
>   message is a *self-contained citation*: full text, author, channel, workspace, ISO date,
>   permalink. A wiki claim sourced from Slack must carry enough content to stand on its own
>   after the message is gone.
> - **Sandbox is not citable.** Treat it as leads only.
> - DMs hold nothing for the wiki and are not collected.

### What this means in practice

1. **Forge Utah, JustBuild, and NUNUG Slack content is public-tier material** — treat it as one would
   a public forum post. It may be quoted and cited.
2. **The Sandbox workspace (`sandboxu.slack.com`) remains leads-only** and must never be cited. That
   part of the maintainer's rule is unchanged.
3. **Editorial restraint still applies.** "Try not to post private-ish conversations/threads." An
   announcement written to be spread is the easy case. A member working through a personal decision in
   `#random` is not, even in a public channel. Prefer announcements, public claims about public
   things, and statements people made in their professional capacity. Never reproduce a résumé, a
   phone number, a personal email, or a job-search-in-progress.
4. **`testimony` remains the right `Source Type`** — but the reason is durability, not secrecy. The
   permalink still requires sign-in, so it still cannot be fetched or snapshotted, and the message
   will still age out of Slack retention. The self-contained quote is the durability mechanism.
5. **The absent fields are the honest signal.** A channel-testimony page carries no `**Retrieved:**`,
   no `**Archive:**`, and no `**Raw:**`, and their absence tells a reader exactly what kind of source
   this is.

## Why this matters rather than being a curiosity

The ingest that produced this note found two cases where the community channel is *load-bearing* —
where it is better evidence than the public web page:

1. **NUNUG (Northern Utah .NET Users Group).** `nunug.org` has a news feed stopping in 2020 and a
   next-meeting slot reading TBA. From the website alone the group looks dead. It is not: its
   organizer announced meetings monthly from March to July 2026 in the Forge Utah Slack, each with a
   named presenter and topic, and called the March meeting a "comeback meeting". **The website is the
   misleading source and the ephemeral one is correct.**
2. **Kids Code Camp 2026.** The published event page shows 1 August 2026 as though it were always the
   date. The camp was originally 20 June and was rescheduled; the organizer also said publicly that
   the event was "critically short of help" four days before the original date. The event page erases
   both facts. Only the Slack record preserves them.

In both cases the durable public artifact is *less* accurate about the present than the ephemeral one.
That is exactly the situation the "Slack is citable" rule exists for. Both are now cited on
[`nunug-2026-meeting-announcements.md`](https://greatutah.work/pages/nunug-2026-meeting-announcements.md)
and
[`utah-kids-code-camp-2026-announcements.md`](https://greatutah.work/pages/utah-kids-code-camp-2026-announcements.md).

## What is still open: the capture mechanism

The citation question is settled. The **verification** question is not, and it is the more interesting
one, because it is the corpus's anti-fabrication device that is switched off:

> A `## Verbatim` blockquote on a source page must be a literal substring of the captured document in
> `raw/`. This is the one check that stands between the corpus and a confidently invented quote.

On a channel-testimony page that check silently passes because there is nothing to check against. A
fabricated Slack quote would currently land undetected — which is precisely the failure mode
`raw-source-capture.md` exists to prevent, and it is worse now that these sources are blessed for
citation.

**Recommended fix, unchanged by the ruling and now more clearly worth doing.** The scrape is already a
script, and `~/coding/scrapers/slack/data/*.messages.jsonl` is a durable local record carrying full
text, author, channel, ISO date, and permalink for every message. The only obstacle is that it lives
in a different repo and is gitignored, so a `raw/`-relative `**Raw:**` path cannot point at it.

Copying the cited messages into `raw/<slug>/` under the existing immutable `<date>-<hash>` scheme would
make `verbatim-not-in-raw` work normally, with no exemption and no new schema:

- one capture file per source page, holding the message text and metadata as extracted, nothing of ours;
- written by a script — a sibling of `capture-raw-sources.mjs` reading the scraper's JSONL rather than
  fetching a URL — so `**Raw:**` stays script-written as `attributes.md` requires;
- `**Retrieved:**` still absent, because nothing was re-fetched from a live URL, and
  `**Archive:**` still absent, because there is still nothing for the Internet Archive to crawl.

Until that exists, lint should stop accruing `missing-archive` / `missing-verbatim` / `missing-raw`
debt against `testimony` pages whose URL host is a chat workspace — the debt can never be paid and it
inflates a backlog counter that is supposed to mean something. **Neither change has been made; both
need a maintainer decision on scope, and the capture tooling currently has another owner.**

## Also worth recording: a concurrent-agent collision

While this ingest ran, a second agent working the same tree deleted both testimony pages above and
stripped their citations from the corresponding fact pages. Its policy — *only cite what was captured
and can be re-verified* — is precisely the discipline `raw-source-capture.md` installs, and it was
applied in good faith without knowledge of the maintainer's Slack rule. Both pages have since been
restored under the ruling above.

The same pass also stripped two `**Identifiers:**` values resolved from the IRS exempt-organizations
Business Master File — a Class A primary record, unrelated to the Slack question:

- `utah-geek-events.md` — `ein=27-4128529` (UTAH GEEK EVENTS, Cottonwood Heights UT, subsection 03,
  ruling 2012-05). The page was rewritten to say the evidence "does not establish the organization's
  legal form", which the BMF row does establish. **Restored.**
- `utah-kids-code-camp.md` — lost its link to the operator's registration by the same edit. **Restored.**

Dropping a corroborated federal identifier is a straightforward regression against Phase 1, whose
stated exit criterion is ≥90% of helper/resource nonprofits carrying an EIN; coverage stood at 9/455
after this ingest. **The generalizable lesson for multi-agent work on this corpus: an agent that
cannot re-derive a citation should flag it, not delete it.** Deletion is indistinguishable from
cleanup in a diff, and it silently destroys primary-record work that cost real effort to resolve.
