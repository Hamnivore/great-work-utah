# raw/ — captured source documents

Documents as their publishers wrote them, with **none of our content in them**. No metadata
headers, no commentary, no schema, no editing. If you want to say something *about* a document,
that belongs on its `Type: source` page in `wiki/pages/`, never in here.

```
raw/<source-slug>/<YYYY-MM-DD>-<sha256-first-12>.txt    extracted document text
raw/<source-slug>/<YYYY-MM-DD>-<sha256-first-12>.json   url, fetched-at, status, content-type, hashes
```

`<source-slug>` is the `Type: source` page that cites the capture, which is also what its
`**Raw:**` attribute points at.

## Captures are immutable, and the layout enforces it

The filename contains the hash of the contents. An edited capture is therefore a *different
file* — there is no way to revise one in place and have it still be the thing the page cites.
So the rule is not a policy anyone has to remember:

- **Never edit a file in here.** Re-capture instead; the new document lands beside the old one.
- **Never delete or rename one.** A `**Raw:**` path is a citation, and citations do not move.
- Two captures of the same URL on different dates **are** the drift record. Keep both; the pair
  is more informative than either.

**When a source page is renamed, its capture directory stays put.** Splitting or re-scoping a page is
routine — a bundle of "historical sources" turns out to cite one vendor product page, a page promising
two documents is scoped down to the one it captured — and the new page keeps pointing `**Raw:**` at
the directory named for the old slug. That mismatch looks like untidiness and is the rule working: the
bytes were fetched once, at a known time, and renaming the directory would break the one guarantee
this store makes. Do not "fix" it, and do not re-capture merely to get a matching name — that would
manufacture a second copy of the same document with a later date and muddy the drift record. A
re-capture is for when the *document* may have changed.

Re-running the capture script on an unchanged page is a no-op, because the same text yields the
same hash and therefore the same filename.

## What gets captured, and what does not

Capture what nobody is obliged to keep — the Class B sources: `official-page`, `press-release`,
`news`, `reference`, `preprint`, `testimony`. Also capture primary-tier documents cited through a
**mirror** rather than the issuing body, which `wiki-lint` reports as `primary-behind-mirror`: an
SEC filing reached via a third-party EDGAR site is a permanent record behind an impermanent link.

Do not capture a primary-tier document that is already cited at its mandated home. EDGAR keeps
the 10-K, the IRS keeps the 990, a DOI resolves forever. A copy here would be a second, staler
copy of something that cannot be lost, and `raw/` would slowly turn into a bad mirror of the
federal government.

Text, not bytes. Text is what a claim rests on, it is greppable and diffable in review, and it is
roughly 20× smaller than the HTML it came from. The `.json` sidecar records the SHA-256 of the
original bytes, so an extraction can still be audited against a Wayback copy if anyone doubts it.

## Why this exists

A verbatim excerpt on a source page is only as good as our word, until there is something to check
it against. With the capture present, `wiki-lint`'s `verbatim-not-in-raw` makes every quote a
literal substring of the document — so a fabricated, mistyped, or silently "tidied" quote fails
the build even when the page reads perfectly. That is the difference between a wiki that says it
quotes its sources and one that can prove it.

## Usage

```bash
npm run sources:capture -- --stem myriad-genetics-official-website   # one page, dry run
npm run sources:capture -- --stem myriad-genetics-official-website --write
npm run sources:capture -- --all --limit 20 --write                  # work the backlog
node scripts/wiki-lint.mjs                                           # verifies quotes against captures
```

The backlog of pages still owing a capture is in `research/raw-data/capture-backlog.md`
(generated). The playbook is `research/raw-data/README.md`; the plan is
`research/design/raw-source-capture.md`.

`raw/` is a repo asset, not a published route: it is not copied into `dist/` and not listed in
`llms.txt`. Visiting agents get the excerpts; the captures are how we keep the excerpts honest.
