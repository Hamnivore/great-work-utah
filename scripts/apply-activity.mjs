#!/usr/bin/env node
// Applies the Activity facet to wiki pages from the rater TSVs in research/activity/results/.
//
// Same split as the two tier ladders: rated by many agents in batches, written by exactly one
// process, here. Concurrent agents editing wiki/pages/ have destroyed sourced work in this corpus
// before (conventions.md, P5 precedent 10), and a rating is cheap to redo while a clobbered citation
// is not.
//
// What makes this one different from apply-tiers.mjs: the raters record *evidence* — a dated public
// artifact — and the label is derived here from that date. So moving the thresholds in
// wiki/meta/activity.md is a re-run of this script, not a re-run of 485 pages of research. Where the
// derived label and the rater's label disagree, the disagreement is reported and the rules in
// `reconcile` decide, because a rater who found a dissolution filing knows something the calendar
// does not.
//
// Dry run by default. `--write` edits pages. Rubric: wiki/meta/activity.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(REPO_ROOT, "wiki", "pages");
const RESULTS_DIR = path.join(REPO_ROOT, "research", "activity", "results");
const BATCH_DIR = path.join(REPO_ROOT, "research", "activity", "batches");

const VALUES = new Set(["active", "dormant", "concluded", "unknown"]);
const ACTIVITY_TYPES = new Set(["venture", "person", "helper", "resource", "work"]);
// Thresholds from wiki/meta/activity.md. Months, from the check date.
const ACTIVE_MONTHS = 18;
const DORMANT_MONTHS = 48;

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const force = args.has("--force");

if (args.has("--help") || args.has("-h")) {
  console.log(`Usage: node scripts/apply-activity.mjs [--write] [--force]

Merges research/activity/results/*.tsv and writes **Activity:**, **Activity-checked:**, and
**Activity-signal:** onto each wiki page. Dry run by default; reports coverage, conflicts, the
value histogram, and every case where the recorded evidence disagrees with the rater's label.

  --write   edit the pages
  --force   write even though integrity checks failed (never in a normal run)
`);
  process.exit(0);
}

const TODAY = new Date().toISOString().slice(0, 10);

// -- helpers ----------------------------------------------------------------

// Raters may record a partial date when that is all the artifact carries: 2026, 2026-04, 2026-04-17.
// Normalize to a comparable full date by taking the *end* of the stated period, which is the reading
// most favorable to the subject — if a page says "2024" we assume December, not January, so a
// borderline call errs toward "maybe still alive" rather than toward a premature obituary.
const normalizeDate = (raw) => {
  const s = (raw || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split("-").map(Number);
    return `${s}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, "0")}`;
  }
  if (/^\d{4}$/.test(s)) return `${s}-12-31`;
  return "";
};

const monthsSince = (date, from = TODAY) => {
  const a = new Date(`${date}T00:00:00Z`);
  const b = new Date(`${from}T00:00:00Z`);
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
};

const isTerminal = (kind) => /^terminal:/.test(kind || "");

// The whole point of recording dates instead of labels: this function is the rubric, and it is the
// only thing that has to change when the thresholds move.
const derive = ({ date, kind }) => {
  if (isTerminal(kind)) return "concluded";
  if (!date) return "unknown";
  const age = monthsSince(date);
  if (age < 0) return "active"; // a future-dated cohort or event is a signal about now
  if (age <= ACTIVE_MONTHS) return "active";
  if (age <= DORMANT_MONTHS) return "dormant";
  return "dormant";
};

// A rater who found a dissolution filing outranks the calendar; a rater who wrote `active` with no
// artifact does not outrank anything. Everything else defers to the evidence.
const reconcile = (rec) => {
  const derived = derive(rec);
  if (rec.value === derived) return { value: derived, note: "" };
  if (rec.value === "concluded" && isTerminal(rec.kind)) return { value: "concluded", note: "" };
  if (rec.value === "unknown" && !rec.date) return { value: "unknown", note: "" };
  if (rec.value === "active" && derived !== "active")
    return { value: derived, note: `rater said active but the newest artifact is ${rec.date || "absent"}` };
  return { value: derived, note: `rater said ${rec.value}, evidence derives ${derived}` };
};

// -- load the rater output --------------------------------------------------
if (!fs.existsSync(RESULTS_DIR)) {
  console.error(`No results directory at ${path.relative(REPO_ROOT, RESULTS_DIR)}.`);
  process.exit(1);
}

const records = new Map(); // slug -> record
const conflicts = [];
const malformed = [];
const rubricGaps = [];

for (const file of fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".tsv")).sort()) {
  const batch = file.replace(/\.tsv$/, "");
  const text = fs.readFileSync(path.join(RESULTS_DIR, file), "utf8");
  for (const [i, line] of text.split("\n").entries()) {
    if (!line.trim() || line.startsWith("#")) continue;
    const at = `${file}:${i + 1}`;
    const parts = line.split("\t").map((s) => s.trim());
    if (parts.length < 2) {
      malformed.push(`${at} — not tab-separated into at least slug and value: ${line.slice(0, 80)}`);
      continue;
    }
    let [slug, value, date = "", kind = "", url = "", ...rest] = parts;
    slug = slug.replace(/\.md$/, "");
    value = value.toLowerCase().replace(/[`*_]/g, "").trim();
    const note = rest.join(" ").trim();
    if (!VALUES.has(value)) {
      malformed.push(`${at} — "${value}" is not an Activity value (${[...VALUES].join(" ")}): ${slug}`);
      continue;
    }
    const normalized = normalizeDate(date);
    if (date && !normalized) {
      malformed.push(`${at} — "${date}" is not a parseable signal date: ${slug}`);
      continue;
    }
    if (note.includes("RUBRIC-GAP:")) rubricGaps.push(`${slug} (${batch}) — ${note}`);
    const rec = { slug, value, date: normalized, rawDate: date, kind, url, note, batch, at };
    const prior = records.get(slug);
    if (prior && (prior.value !== rec.value || prior.date !== rec.date)) {
      conflicts.push(`${slug} — ${prior.batch} said ${prior.value}/${prior.rawDate || "—"}, ${batch} said ${rec.value}/${rec.rawDate || "—"}`);
      continue; // first writer wins; a conflict is a thing to look at, not to silently resolve
    }
    if (!prior) records.set(slug, rec);
  }
}

// -- integrity checks (the ones the README documents) ------------------------
const violations = [];
for (const rec of records.values()) {
  if (rec.value === "active" && !/^https?:\/\//.test(rec.url))
    violations.push(`${rec.at} ${rec.slug} — active with no signal URL`);
  if (rec.value === "active" && !rec.date)
    violations.push(`${rec.at} ${rec.slug} — active with no signal date`);
  if (rec.value === "concluded" && !isTerminal(rec.kind))
    violations.push(`${rec.at} ${rec.slug} — concluded without a terminal: signal-kind (got "${rec.kind}")`);
}

// -- reconcile and stage the edits ------------------------------------------
const pageFiles = new Set(fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".md")));
const meta = (raw, key) => {
  const m = raw.match(new RegExp(`^\\*\\*${key}:\\*\\*\\s*(.+)$`, "m"));
  return m ? m[1].trim() : "";
};

const edits = [];
const unmatched = [];
const wrongType = [];
const overrides = [];
const histogram = {};

for (const rec of [...records.values()].sort((a, b) => a.slug.localeCompare(b.slug))) {
  const file = `${rec.slug}.md`;
  if (!pageFiles.has(file)) {
    unmatched.push(rec.slug);
    continue;
  }
  const raw = fs.readFileSync(path.join(PAGES_DIR, file), "utf8");
  const type = meta(raw, "Type");
  if (!ACTIVITY_TYPES.has(type)) {
    wrongType.push(`${rec.slug} (Type: ${type || "missing"})`);
    continue;
  }
  const { value, note } = reconcile(rec);
  if (note) overrides.push(`${rec.slug} — ${note}`);
  histogram[value] = (histogram[value] || 0) + 1;
  edits.push({ file, raw, rec, value });
}

// -- write ------------------------------------------------------------------
// The three keys go directly after **Tier:** (or **Founder-tier:** where a page has one), which keeps
// the trust markers together at the top of the header block and keeps the diff stable across re-runs.
const upsert = (raw, key, value) => {
  const re = new RegExp(`^\\*\\*${key}:\\*\\*.*$`, "m");
  return re.test(raw) ? raw.replace(re, `**${key}:** ${value}`) : null;
};

const insertAfter = (raw, line) => {
  const anchors = [/^\*\*Founder-tier:\*\*.*$/m, /^\*\*Tier:\*\*.*$/m, /^\*\*Confidence:\*\*.*$/m];
  for (const a of anchors) {
    const m = raw.match(a);
    if (m) return raw.replace(a, `${m[0]}\n${line}`);
  }
  return null;
};

let written = 0;
const failed = [];

const blocked = violations.length > 0 || malformed.length > 0;

if (write && blocked && !force) {
  console.error("\nRefusing to write: integrity checks failed. Fix the TSVs or pass --force.\n");
}

for (const { file, raw, rec, value } of edits) {
  const signal = rec.url ? `${rec.rawDate || rec.date} · ${rec.url}` : "";
  let next = raw;
  for (const [key, val] of [
    ["Activity", value],
    ["Activity-checked", TODAY],
    ["Activity-signal", signal],
  ]) {
    if (!val) {
      // No signal recorded (unknown, and some dormant): remove any stale line rather than write empty.
      next = next.replace(new RegExp(`^\\*\\*${key}:\\*\\*.*\\n`, "m"), "");
      continue;
    }
    const replaced = upsert(next, key, val);
    if (replaced !== null) {
      next = replaced;
      continue;
    }
    const inserted = insertAfter(next, `**${key}:** ${val}`);
    if (inserted === null) {
      failed.push(`${file} — no **Tier:**/**Confidence:** header to anchor ${key} to`);
      next = null;
      break;
    }
    next = inserted;
  }
  if (next === null) continue;
  if (next === raw) continue;
  if (write && (!blocked || force)) {
    fs.writeFileSync(path.join(PAGES_DIR, file), next);
    written += 1;
  } else {
    written += 1;
  }
}

// -- report -----------------------------------------------------------------
const allBatchSlugs = new Set();
if (fs.existsSync(BATCH_DIR)) {
  for (const f of fs.readdirSync(BATCH_DIR).filter((f) => f.endsWith(".txt"))) {
    for (const l of fs.readFileSync(path.join(BATCH_DIR, f), "utf8").split("\n")) {
      if (l.trim()) allBatchSlugs.add(l.trim());
    }
  }
}
const missing = [...allBatchSlugs].filter((s) => !records.has(s));

const list = (label, items, limit = 12) => {
  if (!items.length) return;
  console.log(`\n${label} (${items.length}):`);
  for (const i of items.slice(0, limit)) console.log(`  ${i}`);
  if (items.length > limit) console.log(`  … and ${items.length - limit} more`);
};

console.log(`${write && (!blocked || force) ? "Applied" : "Dry run —"} Activity from ${path.relative(REPO_ROOT, RESULTS_DIR)}`);
console.log(`\n  rated pages:      ${records.size}`);
console.log(`  pages ${write && (!blocked || force) ? "written" : "that would change"}: ${written}`);
if (allBatchSlugs.size) console.log(`  batch coverage:   ${allBatchSlugs.size - missing.length}/${allBatchSlugs.size}`);
console.log(`\n  histogram:        ${Object.entries(histogram).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join("  ") || "—"}`);

list("Integrity violations — these block a write", violations);
list("Malformed lines", malformed);
list("Conflicting ratings (first batch wins; look at these)", conflicts);
list("Evidence overrode the rater's label", overrides);
list("Rated slugs with no such page", unmatched);
list("Rated pages whose Type takes no Activity", wrongType);
list("Could not place the header", failed);
list("Rubric gaps reported by raters", rubricGaps);
list("Still unrated", missing, 20);

if (!write) console.log(`\nDry run. Re-run with --write to edit ${written} pages.`);
if (blocked && !force) process.exitCode = 1;
