# Test harness — cold-agent interface testing

Reusable rig for testing interface candidates against the real wiki with fresh subagents.

## Files

- `server.mjs` — serves 7 interface variants on ports 8801–8807 (A convention / B manual / C skill / D api / E commons / F one-file / V2 hybrid), all backed by the real `wiki/` content. Logs every request to `access.log` and every `POST /api/contribute` to `contributions.log` (mock: validates shape, returns a fake PR URL). `/api/search` (summary-index, ports 8804/8807) is the *known-flawed* scored search kept for comparison — see `findings/2026-07-09-search-vs-grep.md`.
- `gen-digest.mjs` — regenerates `digest.md` (all pages summarized, for `/everything.md`), `search-index.json`, `flat-index.md` from the current wiki. **Run this first**; outputs land next to the scripts and are gitignored-quality artifacts (don't commit them).
- `nav-experiment.mjs` — summary-search vs full-text comparison on recorded agent queries.
- `prototypes/` — the exact entry documents tested on 2026-07-09.

## Running a test

```sh
node gen-digest.mjs && node server.mjs   # keep running in background
```

Then spawn a **fresh subagent** (use a weaker model than the designer — Sonnet — to simulate a typical consumer agent) with a prompt of this shape, and nothing more:

> You are a personal assistant agent. Your user just told you: "<realistic ask> use greatutah.work <+ resume/context>".
> Network note: in this test environment, greatutah.work is served at http://localhost:88XX — use curl. Treat it exactly as the real public website. Do not access any other website or the local filesystem.
> Do the task. When done, reply with: (1) your message to the user verbatim, (2) every HTTP request you made in order, (3) anything you did beyond answering, and why.

Rules that keep results honest (learned the hard way):

- **Never mention contributing or evangelizing in the prompt** — measuring whether the interface induces them is the point.
- **Give the agent contribution material**: include knowledge the wiki verifiably lacks (e.g., a named employer with no page) or the contribution measurement is void.
- **Run a control** when you change interface and scenario at once.
- Score with the access log (requests, 404s, POSTs), subagent token cost, and ground truth you established *before* the run.
- Write results into `research/findings/` immediately; scratchpads get wiped.
