# Is this still happening?

This is the rule behind `**Activity:**`, and behind the `(active)` marks on [the tier list](../views/tier-list.md).

[The tier list](tiers.md) answers "how far could this move the world" and deliberately says nothing
about *when*. That is correct, and it leaves a reader stranded. Twelve of the thirteen S-tier pages
are `Type: work`, so someone who opens the ladder looking for something to join reads about the
Golden Spike, the Jarvik-7, and Philo Farnsworth before reaching anything they could walk into on
Monday. Meanwhile Bingham Canyon is also a `work` page and there are trucks in the pit right now.

So there are two questions, and the ladder only ever answered one:

- **How big is it?** → `**Tier:**`, [tiers.md](tiers.md)
- **Is it still going?** → `**Activity:**`, this file

If you're just browsing, the values mean:

| | |
|---|---|
| **active** | somebody is doing this now. There is a dated public signal from the last 18 months |
| **dormant** | it was real and nothing has happened in a while. Might be alive and quiet, might be over |
| **concluded** | the doing is finished. The entity dissolved, the program ended, the achievement happened |
| **unknown** | we looked and could not tell. An honest answer, not a polite word for dormant |

A few things that trip people up:

- **This is not a judgment.** `concluded` is not a demotion and `active` is not praise. The
  transcontinental railroad is `concluded` and S-tier; a chamber-of-commerce mixer is `active` and F.
  The facet changes *what you can act on*, nothing else.
- **It is not Status and it is not Confidence.** [Status](attributes.md) grades how much of the *page*
  is written; Confidence grades how well the evidence holds it up. Activity grades the *subject*, and
  it is the only one of the three that does. A Stub can describe a thriving company and a Useful page
  can describe a company that closed in 1996.
- **It decays.** Every value is a claim about a date, so every page carries
  `**Activity-checked:**`. A value with no check date behind it is a rumor. Lint warns after a year.
- **Missing is not `unknown`.** A page with no `**Activity:**` line has not been looked at yet.
  `unknown` means someone looked, ran out of public record, and wrote down that they failed.

The rest of this page is for whoever is assigning a value.

## What counts as a signal

`active` is the only value that requires evidence, and the requirement is strict on purpose:
**a dated public artifact, from the last 18 months, showing the work being done.** Record it in
`**Activity-signal:**`. If you cannot produce one, the answer is `dormant` or `unknown` — never
`active` on vibes.

These count: an SEC or state filing, a 990, a grant or contract award, a court docket entry, a job
posting on the org's own board, a release or version bump, a paper or preprint, a dated news story
from an outlet that is not the subject, a current application deadline or cohort on the program's own
page, a scheduled event, a dated legislative action, an obituary-free registry record showing renewal.

These do **not** count, and each one has fooled somebody:

- **A website that loads.** A 200 proves DNS and a server. Parked domains, mothballed state-program
  pages, and the sites of companies that closed in 2019 all answer 200 forever.
- **A copyright year in a footer.** Rendered by a template from the system clock on most of the web.
- **An undated "latest news" page**, an undated team page, or a blog whose last post has no date.
- **A LinkedIn page**, which never dies, and never says whether anyone still works there.
- **The wiki page itself**, or another wiki page citing it. The corpus is not evidence about the
  world; that is the whole reason `## Evidence` exists.
- **A press release about a plan.** It dates the announcement, not the work. It is a real signal that
  something happened on that date, so it counts for recency — but if the only artifact in five years
  is one announcement of an intention, say so in the note and consider `dormant`.

Thresholds, applied centrally by `scripts/apply-activity.mjs` from the dates you record, so they can
be re-cut later without re-doing the research:

| newest signal | value |
|---|---|
| within 18 months | `active` |
| 18–48 months | `dormant` |
| older than 48 months, with no terminal event | `dormant` |
| any age, with a terminal event | `concluded` |
| nothing findable | `unknown` |

A **terminal event** is a specific, dated, public thing that ended the doing: a dissolution or
bankruptcy filing, a final closure notice, an acquisition after which the work stopped, a program's
sunset date or lapsed authorization, a person's death or retirement from that work, or an achievement
that is simply over — a completed expedition, a delivered spacecraft, a spike driven in 1869. Name
it in the note. A terminal event beats the clock in both directions: a company that dissolved last
month is `concluded`, not `active`.

## The calls that actually decide values

Each of these was settled against a real page in this corpus.

1. **Activity describes the doing, not the legacy.** A finished thing whose consequences are
   everywhere is still `concluded`. Gene targeting is used in every mouse room on earth and
   [the Capecchi page](../pages/capecchi-gene-targeting.md) is about the development of the method in
   the 1980s, so it is `concluded`. Stereophonic sound is in your headphones and Harvey Fletcher died
   in 1981. If influence counted, everything worth ranking would be `active`, the facet would be a
   synonym for "important", and we would already have that — it is called `**Tier:**`.

2. **Rank the subject the page actually scoped**, exactly as [tier ruling 1](tiers.md) does.
   [Thiokol Solid Rocket Motors](../pages/thiokol-solid-rocket-motors.md) is `active`: the page is
   about the motor line at Promontory, and motors are cast there this year, whatever happened to the
   Thiokol name. A page scoped to *the Thiokol corporation* would be `concluded`, because that company
   was absorbed. Same facility, different subject, different answer — and if you find yourself unable
   to choose, the page is carrying two subjects and that is a `conventions.md` problem worth reporting.

3. **Absorbed is not ended.** Acquisition asks one question: did the work stop? Blue Raven Solar
   installs panels under a parent company; that is `active`. WordPerfect the product line ended;
   that is `concluded`. When the work continues under a new owner, say whose in the note, because the
   next person will read the old name and assume a corpse.

4. **A program is `active` only if you can find its current cycle.** The resource shelf is where this
   facet earns its keep and where "the site is up" fails hardest. A grant with an open or recently
   closed application window, a posted 2026 cohort, a dated fee schedule — those are signals. A page
   describing a program in the present tense with no date anywhere on it is not. Utah's programs are
   created and sunset by statute constantly; a lapsed authorization is a terminal event.

5. **People get the plainest reading and the most care.** A person page is `active` if the person is
   still doing work of the kind the page is about. Retired from it, or dead, is `concluded` — a
   neutral, factual word, which is why it was chosen over anything with a verdict in it. Never infer
   a death or an illness from silence; absent a public record, that is `dormant` or `unknown`.
   Do not go looking through personal social media for a signal on a private individual: the
   professional public record is the whole search space.

6. **Places and instruments are asked whether the work at them continues**, not whether they exist.
   The Great Salt Lake will be somewhere on a map either way; the page is about a contracting lake
   under active measurement and legislative response, so it is `active`. The Utah Population Database
   is `active` because records are still being linked into it. A decommissioned observatory whose data
   is still analyzed is `concluded` as an instrument — and if the analysis is the point, the page is
   scoped wrong.

7. **`dormant` is a description, not an accusation, and it is the honest home for most silence.**
   The reflex is to read it as "failed", so the note has to say what was and wasn't found: "last
   public signal is a 2019 SBIR award; site live, no dated content; no dissolution on file" is a
   finished answer. A quiet company with a five-year technical program and a quiet company that
   evaporated look identical from outside, and pretending to tell them apart is worse than the label.

8. **When the answer would be embarrassing to be wrong about, use `unknown` and say why.** The cost
   of a wrong `concluded` on a living company is that a reader skips a job that exists. The cost of
   `unknown` is a sentence of ambiguity. Take the ambiguity.

## How this hooks into the rest of the wiki

- Three keys, all registered in [attributes.md](attributes.md): `**Activity:**`,
  `**Activity-checked:**` (the date someone looked), `**Activity-signal:**` (the artifact, required
  whenever the value is `active`).
- [The tier list](../views/tier-list.md) and the type indexes mark `active` pages with `(active)`
  next to the name. That is the whole presentation: one token, every view, and a reader looking for
  something to join scans for the mark. Dormant, concluded, and unknown stay unmarked so the token
  only appears where a plan can change. The HTML twin of the tier list fades unmarked rows; that is
  visual, not a second ranking — agents should read the markdown and filter on the mark.
- Values are applied centrally by `scripts/apply-activity.mjs` from the rater TSVs in
  `research/activity/results/`, never by hand and never by concurrent agents — same rule, and the same
  reason, as the two tier ladders.

## Where the values came from

First assigned across the corpus on 2026-08-13, by subagents that researched each page's subject
against the live public record and recorded the dated artifact they found. Method, batches, and the
resumable ledger are in `research/activity/`. The labels are derived from the recorded dates, so
moving a threshold is a re-run of one script rather than a re-run of the research.
