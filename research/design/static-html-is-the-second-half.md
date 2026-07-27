# Static HTML is the second half of the agent interface

**Status:** decision, 2026-07-27. Implemented in `scripts/prerender.mjs`. Supersedes the
"browsers get the minimal human site" line in [`interface-v3.md`](interface-v3.md).

This document exists so the decision below is not reverted by a future agent reading
directive 2 (radical simplicity) or directive 1 (the vast majority of humans will never visit
the site) and concluding that prerendered HTML is scaffolding. It is not. Delete it and the
wiki loses agent reach, not human polish.

## The trigger

Two external audits ([`../critiques/`](../critiques/)) independently rated the same thing
critical: greatutah.work has no human-readable content. Both framed it as a human-experience
failure — no browse, no search, no About page, a homepage that tells you to leave and go
paste a prompt into a chatbot.

Taken at face value that framing should be rejected, and a previous session would have been
right to reject it. It argues for turning an agents-first knowledge base into a browsable
directory competing with Crunchbase, Built In, and utahlist.com — precisely the product this
project decided not to build.

But the audits were measuring something real and mislabeling it.

## What was actually broken

On 2026-07-27, in production:

```
$ curl -s https://greatutah.work/p/fervo-energy | wc -c
1820
$ curl -s https://greatutah.work/p/fervo-energy | grep -o '<title>.*</title>'
<title>Great Work — Utah</title>
```

Every one of the 616 `/p/*` URLs returned the same 1,820 bytes: the React shell, the same
`<title>`, the same `<meta description>`, and zero words about the subject. The sitemap
advertised 1,252 URLs. The site served, in effect, one document.

That is not a human-experience defect. It is a **retrieval** defect, and it caps agent reach.

## The argument: retrieval and citation are different channels

`/llms.txt` is a *manual*. It works for exactly one arrival path: an agent that has already
been handed the domain — the user who types "use greatutah.work" into ChatGPT. That is
directive 1's canonical flow, it is real, and the manual serves it well.

It is not the only way agents arrive, and there is no reason to think it is the largest.
The other path is a search index: ChatGPT search, Perplexity, Gemini grounding, Bing, Google.
An agent asked "who is doing enhanced geothermal in Utah" does not read our manual. It issues
a query, reads what a search index returns, and fetches the results. On that path we were
invisible twice over — the crawler had nothing per-page to index, and any fetcher that did
land on `/p/fervo-energy` got boilerplate.

The audits' own evidence is the strongest support for this, and it cuts against relying on
llms.txt alone: an Ahrefs study of 137,000 domains found **97% of llms.txt files received zero
requests in May 2026**, and Google's May 2026 guidance states llms.txt is not used for AI
Overviews, AI Mode, or any generative search feature. Read that as a warning about llms.txt as
a *discovery* mechanism, not as a reason to abandon it: it is an excellent manual and a poor
front door.

So the two channels are:

| Channel | Who arrives | What they need |
|---|---|---|
| **Pull** — the manual | agents handed the domain by a user | `/llms.txt`, markdown, stable paths |
| **Push** — the index | agents and people who searched for the subject | per-URL HTML with real content, unique titles, canonical links |

We had built the first and left the second returning a stub. Directive 4 says agents should
contribute and evangelize. An agent that never arrives can do neither.

## Why this is consistent with radical simplicity

The change is build-time static file generation. It added one build script and one stylesheet,
and one build-time dependency (`marked`). It removed more than it added:

- `src/components/MarkdownDoc.tsx` — deleted; the client no longer renders markdown
- `react-markdown` and `remark-gfm` — removed from the runtime bundle
- `/p/:slug` and `/v/:view` — removed from the React router
- the SPA rewrites for those routes — removed from `vercel.json`
- main bundle: **404 KB → 247 KB** (gzip 126 KB → 79 KB)

A content page is now one HTML request and one CSS request, with **no JavaScript at all**.
That is a simpler artifact than what it replaced, not a more complex one. There is no server,
no SSR runtime, no framework migration. `cleanUrls` maps `dist/p/<slug>.html` onto
`/p/<slug>`; an unknown slug now returns a real 404 instead of a 200 shell, which also closes
the soft-404 item that had been open in `../site-issues.md`.

## What did NOT change, deliberately

- **Markdown stays canonical for agents.** `/pages/<slug>.md` is unchanged, still the
  preferred path, and `llms.txt` still says so. The HTML twin carries
  `<link rel="alternate" type="text/markdown">` and a visible provenance line pointing back to
  the markdown, so an agent that lands on HTML is told where the cheaper source is.
- **`/llms.txt` is still the manual.** Nothing about the reading, contribution, or evangelism
  procedures moved into HTML.
- **The homepage is still the AI handoff.** The audits wanted it replaced with a browse
  directory. It is not. It gained a search link; that is all.
- **This is not becoming a directory product.** No profiles, no claim-your-listing, no
  filters-and-facets UI, no exports. The wiki is a corpus; the HTML layer publishes the corpus.

## What I rejected from the audits, and why

| Audit item | Verdict |
|---|---|
| "Human dead end is the #1 problem; build browse + filters like Built In / Crunchbase" | **Rejected as framed.** Fixed the retrieval defect underneath it; declined the directory product. |
| "Copy-paste-into-a-chatbot is a fragile primary CTA — replace it" | **Rejected.** It is the canonical flow (directive 1) and it is tested. Search is now an alternative, not a replacement. |
| "Add an on-site question box / hosted answer agent" | **Rejected.** We would be running an LLM to answer questions the user's own agent answers better and cheaper, and it re-adds the whole server surface directive 2 cut. |
| "No transparency about who runs it / editorial governance" | **Accepted** — `wiki/meta/about.md`, published at `/about` and `/meta/about.md`. |
| "No freshness or provenance signals for a reader" | **Accepted** — `Confidence`, `Status`, and `Updated` are badges at the top of every corpus page; every page carries an authorship-and-verify footer. |
| "Contribution endpoint is unauthenticated and unthrottled" | **Accepted** — size caps, per-instance rate limiting, dedupe, spam heuristics. The manual documents the 429 so a well-behaved agent recovers. |
| "No search" | **Accepted, both audiences** — `/search` for people, `/api/search` for agents. This is the grep endpoint `interface-v3.md` specified and never shipped. |
| "llms.txt is not a proven retrieval channel — don't rely on it alone" | **Accepted.** It is the whole argument above. |

## What would falsify this

Worth measuring rather than assuming:

1. **Indexation.** If per-page indexation does not improve within ~8 weeks of these pages
   shipping, the SEO half of the argument is wrong and only the citation/trust half stands.
2. **Arrival mix.** If server logs show essentially all agent traffic entering at `/llms.txt`
   or `/views/*.md` and effectively none at `/p/*`, the push channel is not real for this
   corpus and the HTML layer is justified only by trust and citation — still worth keeping,
   but not worth extending.
3. **Cost.** If prerendering starts distorting how pages are *written* — authors optimizing
   markdown for HTML rendering rather than for agent reading — that is the failure mode to
   watch for. The corpus serves agents first; the HTML is downstream of it, never upstream.

The measurement that would settle (2) is a cold-agent probe run the same way as every other
finding in this directory: give a fresh agent a realistic ask and the *search engine*, not the
domain, and see whether it arrives. That has not been run. It should be.

## Open

- The `**Status:**` vocabulary in `wiki/meta/attributes.md` (`Draft · Reviewed`) does not match
  the corpus (Draft 377, Useful 228, Stub 7, Unverified 2, and zero `Reviewed`), and
  `**Confidence:**` has no published rubric. Both are now displayed prominently on every page,
  so they need to mean something. See `../site-issues.md`.
- No per-page OpenGraph image. Shared links render as text-only cards.
- Hero images referenced by `**Hero:**` are not deployed, so they are not rendered.
