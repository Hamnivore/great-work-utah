#!/usr/bin/env node
// Applies the founder-resource ladder to wiki pages from the rater TSVs in
// research/founder-tier-list/results/.
//
// Same split as scripts/apply-tiers.mjs and for the same reason: ratings are produced in batches but
// written by exactly one process, here. Concurrent agents editing wiki/pages/ have destroyed sourced
// work in this corpus before (conventions.md, P5 precedent 10), and a rating is cheap to redo while a
// clobbered citation is not.
//
// Unlike the impact ladder, the set of pages that owe a letter is derivable — it is every page whose
// Type is resource or helper — so this script reads the corpus instead of a checked-in manifest.
//
// Dry run by default. `--write` edits pages. Rubric: wiki/meta/founder-tiers.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(REPO_ROOT, "wiki", "pages");
const RESULTS_DIR = path.join(REPO_ROOT, "research", "founder-tier-list", "results");
const ADJUDICATIONS = path.join(REPO_ROOT, "research", "founder-tier-list", "adjudications.tsv");

// `n/a` has no analogue on the impact ladder. It marks a page that serves a different audience
// entirely — a hospital, a school, a crisis line — and is the difference between "a weak founder
// resource" and "not a founder resource." Without it the list would rank a children's hospital.
const TIER_RE = /^(S|A|B|C|D|F|unranked|n\/a)$/;
const TIER_TYPES = new Set(["resource", "helper"]);
const TIER_ORDER = ["S", "A", "B", "C", "D", "F", "unranked", "n/a"];

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

if (args.has("--help") || args.has("-h")) {
  console.log(`Usage: node scripts/apply-founder-tiers.mjs [--write]

Merges research/founder-tier-list/results/*.tsv and writes **Founder-tier:** onto each resource and
helper page. Dry run by default; reports coverage, conflicts, and the histogram either way.
`);
  process.exit(0);
}

if (!fs.existsSync(RESULTS_DIR)) {
  console.error(`No results directory at ${path.relative(REPO_ROOT, RESULTS_DIR)}.`);
  process.exit(1);
}

// -- load the rater output --------------------------------------------------
const ratings = new Map(); // slug -> { tier, argument, batch }
const conflicts = [];
const malformed = [];

const readTsv = (file, label, onRow) => {
  for (const [i, line] of fs.readFileSync(file, "utf8").split("\n").entries()) {
    if (!line.trim() || line.startsWith("#")) continue;
    const parts = line.split("\t");
    if (parts.length < 2) {
      malformed.push(`${label}:${i + 1} — not tab-separated into at least slug and tier: ${line.slice(0, 80)}`);
      continue;
    }
    let [slug, tier, ...rest] = parts;
    slug = slug.trim();
    if (!slug.endsWith(".md")) slug += ".md";
    // Strip markdown emphasis and stray backticks; raters decorate the letter often enough that
    // rejecting the row would throw away intact judgment over packaging.
    tier = tier.trim().replace(/^[`_*]+|[`_*]+$/g, "").trim();
    if (!TIER_RE.test(tier)) {
      malformed.push(`${label}:${i + 1} — "${tier}" is not a founder tier (${TIER_ORDER.join(" ")}): ${slug}`);
      continue;
    }
    onRow(slug, tier, rest.join(" ").trim());
  }
};

for (const file of fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".tsv")).sort()) {
  const batch = file.replace(/\.tsv$/, "");
  readTsv(path.join(RESULTS_DIR, file), file, (slug, tier, argument) => {
    const existing = ratings.get(slug);
    if (existing && existing.tier !== tier) {
      conflicts.push(`${slug}: ${existing.batch} says ${existing.tier}, ${batch} says ${tier}`);
      return; // first rating wins; the conflict is reported for adjudication
    }
    if (!existing) ratings.set(slug, { tier, argument, batch });
  });
}

// -- hand adjudication overrides -------------------------------------------
// Read last and allowed to win, kept separate from the batch TSVs so the record of what the rater
// actually said survives — that is what shows whether the rubric or the rater was wrong.
const overrides = [];
if (fs.existsSync(ADJUDICATIONS)) {
  readTsv(ADJUDICATIONS, "adjudications.tsv", (slug, tier, argument) => {
    const was = ratings.get(slug);
    ratings.set(slug, { tier, argument, batch: "adjudicated" });
    if (was && was.tier !== tier) overrides.push(`${slug}: ${was.tier} -> ${tier} (rated by ${was.batch})`);
  });
}

// -- check against the pages that owe a letter -----------------------------
const owed = new Set();
for (const f of fs.readdirSync(PAGES_DIR).sort()) {
  if (!f.endsWith(".md")) continue;
  const type = (/^\*\*Type:\*\*\s*(.+?)\s*$/m.exec(fs.readFileSync(path.join(PAGES_DIR, f), "utf8")) || [])[1];
  if (type && TIER_TYPES.has(type.trim())) owed.add(f);
}

const missing = [...owed].filter((slug) => !ratings.has(slug)).sort();
const unexpected = [...ratings.keys()].filter((slug) => !owed.has(slug)).sort();

// -- apply -----------------------------------------------------------------
let updated = 0;
let unchanged = 0;
const failures = [];

for (const [slug, { tier }] of [...ratings].sort()) {
  const filePath = path.join(PAGES_DIR, slug);
  if (!fs.existsSync(filePath)) {
    failures.push(`${slug} — no such page`);
    continue;
  }
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split("\n");

  const type = (/^\*\*Type:\*\*\s*(.+?)\s*$/m.exec(original) || [])[1]?.trim() || null;
  if (!type || !TIER_TYPES.has(type)) {
    failures.push(`${slug} — Type "${type}" does not take a founder tier`);
    continue;
  }

  const existingIdx = lines.findIndex((l) => /^\*\*Founder-tier:\*\*/.test(l));
  const tierLine = `**Founder-tier:** ${tier}`;

  if (existingIdx >= 0) {
    if (lines[existingIdx] === tierLine) {
      unchanged += 1;
      continue;
    }
    lines[existingIdx] = tierLine;
  } else {
    // Sits directly under the impact tier it is the counterpart to, so the two ladders read as a
    // pair; falls back through the grading cluster when a page has no **Tier:** yet.
    let anchor = lines.findIndex((l) => /^\*\*Tier:\*\*/.test(l));
    if (anchor < 0) anchor = lines.findIndex((l) => /^\*\*Confidence:\*\*/.test(l));
    if (anchor < 0) anchor = lines.findIndex((l) => /^\*\*Status:\*\*/.test(l));
    if (anchor < 0) anchor = lines.findIndex((l) => /^\*\*Type:\*\*/.test(l));
    if (anchor < 0) {
      failures.push(`${slug} — no metadata block to insert into`);
      continue;
    }
    lines.splice(anchor + 1, 0, tierLine);
  }

  if (write) fs.writeFileSync(filePath, lines.join("\n"));
  updated += 1;
}

// -- report ----------------------------------------------------------------
const histogram = new Map();
for (const { tier } of ratings.values()) histogram.set(tier, (histogram.get(tier) || 0) + 1);

const batches = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".tsv")).length;
console.log(`${write ? "Applied" : "Dry run"} — ${ratings.size} ratings from ${batches} batch file(s)`);
console.log("");
console.log("Founder-tier histogram:");
const total = ratings.size || 1;
for (const tier of TIER_ORDER) {
  const n = histogram.get(tier) || 0;
  if (!n) continue;
  console.log(`  ${tier.padEnd(9)} ${String(n).padStart(4)}  ${((n / total) * 100).toFixed(1).padStart(5)}%  ${"#".repeat(Math.round(n / 3))}`);
}
console.log("");
console.log(`Pages ${write ? "written" : "that would change"}: ${updated}; already correct: ${unchanged}`);

if (overrides.length) {
  console.log("");
  console.log(`ADJUDICATED — ${overrides.length} letter(s) overridden by hand:`);
  for (const o of overrides) console.log(`  ${o}`);
}
if (missing.length) {
  console.log("");
  console.log(`UNRATED — ${missing.length} resource/helper page(s) with no line in any TSV:`);
  for (const slug of missing.slice(0, 40)) console.log(`  ${slug}`);
  if (missing.length > 40) console.log(`  ...and ${missing.length - 40} more`);
}
if (unexpected.length) {
  console.log("");
  console.log(`UNEXPECTED — ${unexpected.length} rating(s) for pages that do not owe a founder tier:`);
  for (const slug of unexpected) console.log(`  ${slug}`);
}
if (conflicts.length) {
  console.log("");
  console.log(`CONFLICTS — ${conflicts.length} page(s) rated twice with different letters (first won):`);
  for (const c of conflicts) console.log(`  ${c}`);
}
if (malformed.length) {
  console.log("");
  console.log(`MALFORMED — ${malformed.length} line(s) skipped:`);
  for (const m of malformed.slice(0, 30)) console.log(`  ${m}`);
  if (malformed.length > 30) console.log(`  ...and ${malformed.length - 30} more`);
}
if (failures.length) {
  console.log("");
  console.log(`FAILED — ${failures.length}:`);
  for (const f of failures) console.log(`  ${f}`);
}
if (!write) {
  console.log("");
  console.log("Dry run. Re-run with --write to edit pages.");
}

process.exit(malformed.length || failures.length ? 1 : 0);
