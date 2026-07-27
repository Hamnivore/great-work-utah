# SEO plan

**Status:** implemented in-repo 2026-07-27 (P0.1, P0.2, P1.1–P1.4). Maintainer still
owns P0.3 (www → apex 308) and P2 (Search Console / Bing verification + baselines).
Audited against production after the static-HTML merge (`3bf7d32`).

## Why we care, and the limit on how much

Read [`static-html-is-the-second-half.md`](static-html-is-the-second-half.md) first. SEO here is
not a traffic goal. It is the **push channel of the agent interface**: agents that arrive through
a search index rather than through `/llms.txt` can only reach the corpus if a search index has it.
Indexation is the falsifier recorded in that document — if per-page indexation does not improve by
~2026-09-21, the retrieval half of the argument is wrong.

That sets a hard boundary on this work. **Nothing in this plan may degrade the markdown interface
or the manual to win a ranking signal.** If a fix trades agent legibility for crawler preference,
it is out of scope, and P1.4 below is the one item where that tension is real.

Prerendering already delivered the expensive part: 638 documents with unique titles, descriptions,
canonical links, OpenGraph, and JSON-LD. What follows is the cleanup that shipping exposed.

---

## P0 — actively harmful, fix first

### P0.1 · 656 duplicate URLs, submitted to Google, with no canonical between them — done

**Evidence.** The sitemap contained both twins of every document:

```
616  /p/<slug>          616  /pages/<slug>.md
 18  /v/<view>           18  /views/<view>.md
  4  /<meta-doc>          4  /meta/<doc>.md
```

The HTML twin self-canonicalises. The markdown twin carried **no canonical signal at all**.

**Fix shipped.**

1. `vercel.json` `routes` add an HTTP `Link` canonical on markdown paths, pointing each file at
   its HTML twin (`/pages/x.md` → `/p/x`, `/views/x.md` → `/v/x`, `/meta/x.md` → `/x`). Implemented
   via `routes` (not the high-level `headers` array) because path-capture interpolation in header
   *values* is documented for `routes` (`$1`) and not for `headers`. Agents keep fetching markdown
   exactly as before.
2. `scripts/prerender.mjs` emits only the HTML twin in the sitemap — markdown URLs dropped.

**Verify after deploy.** `curl -sI https://greatutah.work/pages/fervo-energy.md` shows the `Link`
header; sitemap URL count is ~430 (HTML corpus minus noindex sources, plus a handful of site
routes); Search Console "Duplicate without user-selected canonical" stays at zero.

---

### P0.2 · The homepage links to nothing on the site — done

**Fix shipped.** `index.html` `#root` fallback now includes corpus doors (`/v/index`, `/v/needs`,
`/v/ventures`, `/v/guides`, `/search`, `/about`) and a full `og:*` / `twitter:*` set including
`og:image`. JS hydration still replaces the block for humans.

**Verify after deploy.** `curl -s https://greatutah.work/ | grep -o 'href="/[^"]*"'` lists the
corpus doors.

---

### P0.3 · `www` → apex is a temporary redirect — done 2026-07-27

Maintainer set the Domains-panel redirect to permanent. Verify: the curl below returns `308`.

```
$ curl -so /dev/null -w '%{http_code}' https://www.greatutah.work/p/fervo-energy
```

---

## P1 — signal quality

### P1.1 · No `lastmod` in the sitemap — done

`scripts/prerender.mjs` writes `<lastmod>` from each page's `**Updated:**` when it is an ISO date.
Views use the build date. Missing/invalid dates omit `lastmod` rather than inventing one.

### P1.2 · Views are typed as `Article` — done

Views emit `CollectionPage`; meta docs emit `WebPage`; `/p/*` keep `Article`. `/p/*` also emit
`BreadcrumbList` (`Home → type view → page`).

### P1.3 · No `og:image` anywhere — done

One static branded card at `public/og.png` (1200×630), referenced from every prerendered page and
the homepage. Per-page cards deferred; `**Hero:**` images stay out of scope (rights unresolved).

### P1.4 · 210 thin, near-duplicate `source` pages — done (Option A)

**Decision recorded 2026-07-27: Option A.** Source pages are almost never the answer to a human
search query; they are the citation layer. `noindex, follow` on the HTML twin removes them from
the index without touching `/pages/*.md` or citation links. Option C (merge into parents) rejected
— destroys a deliberate schema decision and 210 stable URLs.

**Fix shipped.** Prerender emits `<meta name="robots" content="noindex, follow">` when
`**Type:** source`, and omits those URLs from the sitemap. Markdown twins stay fetchable and
uncensored.

---

## P2 — measurement, without which none of this is checkable

### P2.1 · No webmaster tooling is verified — needs maintainer

1. Verify `greatutah.work` in **Google Search Console** and **Bing Webmaster Tools**.
2. Submit `https://greatutah.work/sitemap.xml` in both.
3. Record a baseline the same week: total indexed pages, and Coverage-report reasons.

Verification via a `google*.html` / Bing XML file in `public/` is the least invasive method and
survives redeploys. Drop the file(s) in the repo when the consoles issue them.

### P2.2 · Baseline and the 8-week check

| Date | Measure | Meaning |
|---|---|---|
| at verification | indexed page count, pre-fix | baseline |
| +4 weeks | indexed `/p/*` count | is P0 working |
| **~2026-09-21** | indexed `/p/*` count and impressions | **the falsifier** — if flat, the retrieval argument is wrong and only the citation/trust half stands |

Record the result in `research/findings/` either way. A negative result is the more valuable one
and must not be quietly dropped.

### P2.3 · The measurement that actually matters is not a search ranking

Indexation is a proxy. The real question is whether agents arrive. When server logs are available,
measure the **arrival mix**: requests entering at `/p/*` versus `/llms.txt` versus `/views/*.md`.
If nothing enters at `/p/*`, the push channel is not real for this corpus regardless of what
Search Console says — and the HTML layer is then justified by citation and trust alone, which is
still worth keeping but not worth extending.

Complement it with the cold-agent probe that has not yet been run: give a fresh agent a realistic
ask and a **search engine**, not the domain, and see whether it arrives. That is the honest test,
and it is the method this project uses for everything else
(`research/README.md`, method).

---

## Explicit non-goals

- **Keyword optimisation of page prose.** Pages are written for agents and for accuracy. If
  prerendering ever starts changing how markdown is authored, that is the failure mode named in
  the design doc.
- **Chasing AI Overviews / AI Mode placement.** Google states `llms.txt` plays no part in these,
  and we have no lever on them beyond being crawlable and correct — which is this plan.
- **A blog, a link-building programme, or content volume for its own sake.** Coverage grows from
  the charter, not from a traffic target.
- **Removing `/llms.txt` or the markdown paths** for any ranking reason whatsoever.

## Sequence

P0.1 / P0.2 / P1 shipped together. **Maintainer next:** P0.3 Domains panel + P2.1 console
verification in the same sitting — P2.1 gates every later judgement against the ~2026-09-21
falsifier.
