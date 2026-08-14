#!/usr/bin/env node
// Mechanical pre-pass for the Activity facet (wiki/meta/activity.md).
//
// Activity asks whether the thing a page is about is still being done. That question is settled by
// research, not by a script — but two cheap signals narrow it enormously before a rater spends a
// token on it, so this collects both and gets out of the way:
//
//   1. Does the page's **Website:** still resolve, and does the page it serves talk about the
//      present? "Reachable" is weak evidence (parked domains and abandoned state-program pages
//      answer 200 forever), so we also record the latest 4-digit year the body mentions, which is
//      what actually separates a maintained site from a mothballed one.
//   2. What is the most recent date the page's own cited evidence carries — the newest `Published:`
//      across every `Type: source` page it cites. That is the corpus telling you when it last saw
//      the subject do anything. Deliberately *not* `Retrieved:`, which dates our own fetch: a 2026
//      re-fetch of a 2014 press release says nothing about whether anyone is still there, and
//      including it made this column read 2026 for most of the corpus after the last capture run.
//
// Neither is a verdict. A live site with a 2026 copyright line is not proof of activity, and a page
// whose newest source is 2019 may describe a company shipping today. The output is a starting point
// and a triage order for the raters, and it says so in the header it writes.
//
// Writes research/activity/website-probe.tsv (generated, not in Git). Re-runnable and idempotent.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(REPO_ROOT, "wiki", "pages");
const OUT_DIR = path.join(REPO_ROOT, "research", "activity");
const OUT_FILE = path.join(OUT_DIR, "website-probe.tsv");

const FACT_TYPES = new Set(["venture", "person", "helper", "resource", "work"]);
const CONCURRENCY = 16;
const TIMEOUT_MS = 15000;
const UA =
  "Mozilla/5.0 (compatible; greatutah.work activity probe; +https://greatutah.work/llms.txt)";

const args = new Set(process.argv.slice(2));
if (args.has("--help") || args.has("-h")) {
  console.log(`Usage: node scripts/probe-activity-signals.mjs [--no-fetch]

Writes research/activity/website-probe.tsv: one row per fact page with the liveness of its
**Website:**, the newest year that site's homepage mentions, and the newest date its cited
sources carry. Input to the Activity raters; never a verdict on its own.

  --no-fetch   skip the network entirely and emit only the evidence-date column
`);
  process.exit(0);
}
const noFetch = args.has("--no-fetch");

const meta = (raw, key) => {
  const m = raw.match(new RegExp(`^\\*\\*${key}:\\*\\*\\s*(.+)$`, "m"));
  return m ? m[1].trim() : "";
};

const section = (raw, heading) => {
  const m = raw.match(new RegExp(`^## ${heading}\\s*$([\\s\\S]*?)(?=^## |\\Z)`, "m"));
  return m ? m[1] : "";
};

// -- load the corpus --------------------------------------------------------
const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md")).sort();
const byFile = new Map();
for (const f of files) {
  const raw = fs.readFileSync(path.join(PAGES_DIR, f), "utf8");
  byFile.set(f, {
    file: f,
    slug: f.replace(/\.md$/, ""),
    type: meta(raw, "Type"),
    tier: meta(raw, "Tier"),
    website: meta(raw, "Website"),
    // The date the cited document itself carries. Only this one is evidence about the subject.
    published: meta(raw, "Published"),
    evidence: section(raw, "Evidence"),
  });
}

// Newest date reachable through a page's cited sources, one hop.
const evidenceDate = (page) => {
  const cited = [...page.evidence.matchAll(/\(([a-z0-9-]+\.md)\)/g)].map((m) => m[1]);
  let best = "";
  for (const c of cited) {
    const src = byFile.get(c);
    if (!src) continue;
    const d = src.published;
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d > best) best = d;
  }
  return best;
};

const targets = [...byFile.values()].filter((p) => FACT_TYPES.has(p.type));

// -- probe ------------------------------------------------------------------
const YEAR_RE = /\b(20[1-3]\d)\b/g;
const THIS_YEAR = new Date().getUTCFullYear();

async function probe(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctl.signal,
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });
    const finalUrl = res.url && res.url !== url ? res.url : "";
    let latestYear = "";
    const ctype = res.headers.get("content-type") || "";
    if (res.ok && ctype.includes("text/html")) {
      const body = (await res.text()).slice(0, 400_000);
      // Ignore years past this one: "© 2027" and event calendars would otherwise outrank real dates.
      const years = [...body.matchAll(YEAR_RE)]
        .map((m) => Number(m[1]))
        .filter((y) => y <= THIS_YEAR);
      if (years.length) latestYear = String(Math.max(...years));
    }
    return { status: String(res.status), finalUrl, latestYear };
  } catch (err) {
    const name = err?.name === "AbortError" ? "timeout" : (err?.cause?.code || err?.code || "error");
    return { status: name, finalUrl: "", latestYear: "" };
  } finally {
    clearTimeout(timer);
  }
}

const rows = [];
let done = 0;

async function worker(queue) {
  for (;;) {
    const page = queue.pop();
    if (!page) return;
    const url = page.website;
    const result =
      !noFetch && /^https?:\/\//.test(url)
        ? await probe(url)
        : { status: url ? "skipped" : "no-website", finalUrl: "", latestYear: "" };
    rows.push({ page, ...result });
    done += 1;
    if (done % 25 === 0) process.stderr.write(`  ${done}/${targets.length}\n`);
  }
}

const queue = [...targets].reverse();
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

// -- write ------------------------------------------------------------------
rows.sort((a, b) => a.page.slug.localeCompare(b.page.slug));
fs.mkdirSync(OUT_DIR, { recursive: true });

const header = [
  "# Activity probe — mechanical signals only, NOT verdicts.",
  `# Generated ${new Date().toISOString().slice(0, 10)} by scripts/probe-activity-signals.mjs. Regenerate freely; not in Git.`,
  "# A 200 proves the domain answers, not that anyone is home: parked domains and mothballed",
  "# program pages answer 200 forever. site-year is the newest year the homepage mentions, which is a",
  "# better maintenance tell. evidence-date is the newest date a cited source document itself carries",
  "# (Published, never Retrieved). Decide Activity from research; use these to know where to look first.",
  "#",
  "slug\ttype\ttier\thttp\tsite-year\tevidence-date\twebsite\tfinal-url",
].join("\n");

const body = rows
  .map(({ page, status, finalUrl, latestYear }) =>
    [
      page.slug,
      page.type,
      page.tier,
      status,
      latestYear,
      evidenceDate(page),
      page.website,
      finalUrl,
    ].join("\t"),
  )
  .join("\n");

fs.writeFileSync(OUT_FILE, `${header}\n${body}\n`);

// -- report -----------------------------------------------------------------
const count = (fn) => rows.filter(fn).length;
const stale = rows.filter((r) => r.latestYear && Number(r.latestYear) < THIS_YEAR - 1);
console.log(`\nWrote ${path.relative(REPO_ROOT, OUT_FILE)} — ${rows.length} fact pages.`);
console.log(`  reachable (2xx):        ${count((r) => /^2\d\d$/.test(r.status))}`);
console.log(`  4xx/5xx:                ${count((r) => /^[45]\d\d$/.test(r.status))}`);
console.log(`  unreachable/timeout:    ${count((r) => !/^\d\d\d$/.test(r.status) && r.status !== "no-website" && r.status !== "skipped")}`);
console.log(`  no **Website:** at all: ${count((r) => r.status === "no-website")}`);
console.log(`  live but newest year on the page is ${THIS_YEAR - 2} or older: ${stale.length}`);
