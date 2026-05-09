# Vision — Great Work

## The One-Liner

**A beautiful, searchable wiki of Utah's rare opportunities — maintained by agents, grounded in evidence, and built to help the right people find the right work, helpers, resources, and next steps.**

## The North Star

Great Work should feel like opening a living map of Utah's hidden possibility.

Not a job board. Not a CRM. Not a resource directory with better styling.

The wiki should help a founder, researcher, operator, student, or helper see what is unusually worth paying attention to, why it matters, who might fit, what evidence supports the claim, and what still needs to be verified.

The taste lives in the wiki. The precision happens at search time.

Static pages should not try to predict every user's path. They should preserve rich facts, needs, offers, caveats, and context so that when someone asks, "Where could I matter?", the search agent has something real to reason from.

## Why This Exists

Both hackathon briefs are saying the same thing: *Utah has world-class talent, research, and resources — but the discovery layer is broken.* Founders can't find resources. Researchers can't find executors. Operators can't find meaningful work. Nucleus matches by hand. `startup.utah.gov` reads like a library card catalog.

The problem isn't a missing database. It's a missing **map with taste** — something that turns the scattered ecosystem into a navigable, inspiring picture of what's actually being built here, where the hidden leverage is, and why a specific person might be a rare fit.

## Goals

1. **Inspire the next generation of builders and creators.** Make Utah's deep tech, startups, and research feel alive, not bureaucratic.
2. **Help people find great connections in Utah.** Surface the right person, project, or program at the right moment.
3. **Make recommendations explainable.** Every strong match should show its evidence, caveats, and next step.
4. **Preserve discovery.** The wiki should reveal hidden gems and rare-fit opportunities, not only route people to obvious institutions.

## Why Hiring Is the Core

> "Setting the bar high in our approach to hiring has been, and will continue to be, the single most important element of Amazon.com's success."
> — Jeff Bezos

> "The secret of my success is that we have gone to exceptional lengths to hire the best people in the world."
> — Steve Jobs

Hiring is the highest-leverage thing a founder ever does. Every other decision compounds through the people they bring on. The best founders treat hiring as their job, not as something they get to once the "real work" is done.

This shapes the product:

- **We are not a job board.** Volume is the enemy. We are a source of *extraordinarily high-quality leads* — fewer, better, deeply-knowable.
- **Founders should be able to dig in without interviewing.** Priya doesn't have time for a 30-minute call to disqualify someone. She needs to ask the wiki ("has this person ever shipped a regulated medical product?") and get a real answer, with citations. **Filtering is a first-class feature, not a settings page.**
- **The wiki evolves with use.** Every query a founder makes, every candidate they click on or skip, every conversation they have through the platform — all of it is signal. The agents fold that signal back into the wiki, so the next founder's first search is sharper than the last founder's tenth.
- **Both sides benefit from depth.** Candidates with rich, citable profiles get found by the founders most aligned with them. Founders with rich, citable company pages attract the candidates who care about exactly what they're building.

## Who It's For

Three user archetypes shape the product. **When forced to choose, we serve the highest-impact people first** — see [`personas.md`](./personas.md) for the priority hierarchy and named personas we use during prototyping.

### 1. The Seeker

> Job hunters and entrepreneurs looking for **meaningful, maximally impactful work**.

They're not browsing for "a job" — they're browsing for **a mission**. The product should feel less like LinkedIn and more like a museum of "things worth working on."

### 2. The Researcher

> Academics and labs looking for **executors who can publish their research to reality**.

Tech transfer fails most often at the market-problem match (per the Nucleus brief). They need visibility into operators who can take their breakthrough and turn it into a company.

### 3. The Helper

> Business service providers, advisors, and experts looking to **help others follow their dreams**.

Mentors, fractional execs, board members, attorneys, accountants — the people whose superpower is making other founders successful. Today they have no clean way to be discoverable.

## What It Is (and Isn't)

| It is | It isn't |
|---|---|
| A searchable wiki of rare Utah opportunities | A job board |
| An LLM-maintained wiki that gets richer over time | A static directory |
| A "raise your hand" surface for opting into opportunities | A login-gated app with profiles and DMs |
| Mobile-first | Desktop-only |
| Beautiful enough that an investor would screenshot it | Government-website-grey |

## Hard Constraints

- **No user auth, no real database** for v1, unless something is trivially easy (\<2 hours of work). Hand-raising can be as simple as a form that pings somewhere.
- **Mobile first.** Designed for thumbs first, scaled up to desktop.
- **The wiki is the data layer.** Markdown files, version-controlled, LLM-maintained — see [`wiki-architecture.md`](./wiki-architecture.md).

## How This Maps to the Two Hackathons

A single product, framed two ways:

- **For Nucleus ($5K)** — "We rebuilt your connections hub as a beautiful, public-facing showcase of Utah great work, with self-serve hand-raising. The matching is explainable because the wiki *is* the explanation."
- **For GOEO ($10K)** — "This is the Founder's Navigator and the Utah Startup Map, fused. Personalized because the wiki knows what each persona is looking for. Updatable without a developer because LLM agents maintain it."

The same wiki, the same UI, two pitches. See [`docs/README.md`](./README.md) for the full hackathon comparison and [`plan.md`](./plan.md) for the build sequence.
