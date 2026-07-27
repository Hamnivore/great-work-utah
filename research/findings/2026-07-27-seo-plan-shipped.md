# 2026-07-27 — SEO plan implementation (in-repo)

Shipped the repo-side items in [`../design/seo-plan.md`](../design/seo-plan.md). This note is the
handoff for the two items that cannot be done from git, and the measurement schedule the design
doc already committed to.

## Shipped

| Item | Change |
|---|---|
| P0.1 | `Link: <…>; rel="canonical"` on `/pages|views|meta/*.md` via `vercel.json` `routes`; sitemap emits HTML twins only |
| P0.2 | Corpus doors + `og:*` in `index.html` `#root` fallback |
| P1.1 | `<lastmod>` from `**Updated:**` (views → build date) |
| P1.2 | `CollectionPage` / `WebPage` / `Article` + `BreadcrumbList` on `/p/*` |
| P1.3 | `public/og.png` referenced site-wide |
| P1.4 | **Option A:** `noindex, follow` on `Type: source` HTML twins; omitted from sitemap |

Markdown paths and `/llms.txt` are unchanged for agents.

## Maintainer — remaining

1. **P0.3 — done 2026-07-27.** `www` → apex is permanent (308).
2. **P2.1 — still open.** Verify `greatutah.work` in Google Search Console and Bing
   Webmaster Tools. Drop any `google*.html` / Bing XML verification file into `public/` so it
   survives redeploys. Submit `https://greatutah.work/sitemap.xml` in both.
3. **Baseline the same week.** Record total indexed pages and Coverage reasons in a new findings
   file. Without this number the ~2026-09-21 falsifier cannot be evaluated.

## After deploy — quick smoke

```
curl -sI https://greatutah.work/pages/fervo-energy.md | grep -i '^link:'
curl -s https://greatutah.work/ | grep -o 'href="/[^"]*"'
curl -s https://greatutah.work/sitemap.xml | grep -c '<loc>'
curl -s https://greatutah.work/p/fervo-energy-official-website | grep -o 'name="robots" content="[^"]*"'
curl -sI https://greatutah.work/og.png | head -n 5
```

Expect: a `Link` canonical to `/p/fervo-energy`; homepage corpus doors; ~430 sitemap URLs (not
~1,280); `noindex, follow` on the source page; `og.png` 200.
