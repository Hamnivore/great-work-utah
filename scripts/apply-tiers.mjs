#!/usr/bin/env node
// Applies the impact ladder to wiki pages from the rater TSVs in research/tier-list/results/.
//
// Tiers are assigned by subagents in batches but written by exactly one process, here. That split is
// deliberate: concurrent agents editing wiki/pages/ have destroyed sourced work in this corpus before
// (conventions.md, P5 precedent 10), and a rating is cheap to redo while a clobbered citation is not.
//
// Dry run by default. `--write` edits pages. Rubric: wiki/meta/tiers.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_DIR = path.join(REPO_ROOT, "wiki", "pages");
const RESULTS_DIR = path.join(REPO_ROOT, "research", "tier-list", "results");
const MANIFEST_DIR = path.join(REPO_ROOT, "research", "tier-list");

const TIER_RE = /^(S|A|B|C|D|F|unranked)(\*)?$/;
const TIER_TYPES = new Set(["venture", "person", "helper", "resource", "work"]);
const TIER_ORDER = ["S", "A", "B", "C", "D", "F", "unranked"];

const args = new Set(process.argv.slice(2));
const write = args.has("--write");

if (args.has("--help") || args.has("-h")) {
  console.log(`Usage: node scripts/apply-tiers.mjs [--write]

Merges research/tier-list/results/*.tsv and writes **Tier:** onto each wiki page.
Dry run by default; reports coverage, conflicts, and the tier histogram either way.
`);
  process.exit(0);
}

// -- load the rater output --------------------------------------------------
if (!fs.existsSync(RESULTS_DIR)) {
  console.error(`No results directory at ${path.relative(REPO_ROOT, RESULTS_DIR)}.`);
  process.exit(1);
}

const ratings = new Map(); // slug -> { tier, argument, batch }
const conflicts = [];
const malformed = [];

for (const file of fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".tsv")).sort()) {
  const batch = file.replace(/\.tsv$/, "");
  const text = fs.readFileSync(path.join(RESULTS_DIR, file), "utf8");
  for (const [i, line] of text.split("\n").entries()) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    if (parts.length < 2) {
      malformed.push(`${file}:${i + 1} — not tab-separated into at least slug and tier: ${line.slice(0, 80)}`);
      continue;
    }
    let [slug, tier, ...rest] = parts;
    slug = slug.trim();
    if (!slug.endsWith(".md")) slug += ".md";
    let argument = rest.join(" ").trim();
    tier = tier.trim();
    // Raters reliably put the tier first and then decorate it. Two deviations are common enough to
    // absorb rather than reject, because the judgment is intact and only the packaging is wrong:
    // bracketed [BOUNDARY:]/[FLAG:] notes landing in the tier column instead of the argument, and
    // markdown emphasis around the letter. Recover both; keep the note, since the flags find real
    // duplicates and dead programs.
    const annotations = [];
    tier = tier.replace(/\[(?:BOUNDARY|FLAG)\s*:[^\]]*\]/gi, (m) => {
      annotations.push(m);
      return "";
    }).trim();
    // Strip emphasis without eating a trailing hype-tier asterisk: `**A**` and `A*` both occur.
    tier = tier.replace(/^[`_]+|[`_]+$/g, "").trim();
    if (/^\*\*/.test(tier)) tier = tier.replace(/^\*\*+/, "").replace(/\*\*+$/, "").trim();
    if (annotations.length) argument = [argument, ...annotations].filter(Boolean).join(" ");
    if (!TIER_RE.test(tier)) {
      malformed.push(`${file}:${i + 1} — "${tier}" is not a tier (${TIER_ORDER.join(" ")}, optional trailing *): ${slug}`);
      continue;
    }
    if (tier === "S*") {
      malformed.push(`${file}:${i + 1} — S* is not allowed (ruling 9 caps the bump at A*): ${slug}`);
      continue;
    }
    const existing = ratings.get(slug);
    if (existing && existing.tier !== tier) {
      conflicts.push(`${slug}: ${existing.batch} says ${existing.tier}, ${batch} says ${tier}`);
      continue; // first rating wins; the conflict is reported for adjudication
    }
    if (!existing) ratings.set(slug, { tier, argument, batch });
  }
}

// -- hand adjudication overrides -------------------------------------------
// Read last and allowed to win. Batch ratings are one rater's judgment; adjudications are the
// maintainer's, and keeping them in a separate file rather than editing the batch TSVs preserves what
// the rater actually said — which is the record that shows whether the rubric or the rater was wrong.
const ADJUDICATIONS = path.join(MANIFEST_DIR, "adjudications.tsv");
const overrides = [];
if (fs.existsSync(ADJUDICATIONS)) {
  for (const [i, line] of fs.readFileSync(ADJUDICATIONS, "utf8").split("\n").entries()) {
    if (!line.trim() || line.startsWith("#")) continue;
    const [rawSlug, rawTier, ...rest] = line.split("\t");
    let slug = rawSlug.trim();
    if (!slug.endsWith(".md")) slug += ".md";
    const tier = (rawTier || "").trim();
    if (!TIER_RE.test(tier) || tier === "S*") {
      malformed.push(`adjudications.tsv:${i + 1} — "${tier}" is not an assignable tier: ${slug}`);
      continue;
    }
    const was = ratings.get(slug);
    ratings.set(slug, { tier, argument: rest.join(" ").trim(), batch: "adjudicated" });
    if (was && was.tier !== tier) overrides.push(`${slug}: ${was.tier} -> ${tier} (rated by ${was.batch})`);
  }
}

// -- check against the manifest of pages that owe a tier -------------------
const owed = new Set();
for (const type of ["venture", "resource", "work", "person", "helper"]) {
  const manifest = path.join(MANIFEST_DIR, `${type}.txt`);
  if (!fs.existsSync(manifest)) continue;
  for (const line of fs.readFileSync(manifest, "utf8").split("\n")) {
    if (line.trim()) owed.add(line.trim());
  }
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

  const typeMatch = /^\*\*Type:\*\*\s*(.+?)\s*$/m.exec(original);
  const type = typeMatch ? typeMatch[1].trim() : null;
  if (!type || !TIER_TYPES.has(type)) {
    failures.push(`${slug} — Type "${type}" does not take a tier`);
    continue;
  }

  const existingIdx = lines.findIndex((l) => /^\*\*Tier:\*\*/.test(l));
  const tierLine = `**Tier:** ${tier}`;

  if (existingIdx >= 0) {
    if (lines[existingIdx] === tierLine) {
      unchanged += 1;
      continue;
    }
    lines[existingIdx] = tierLine;
  } else {
    // Sits with the grading cluster: after Confidence, else Status, else Type.
    let anchor = lines.findIndex((l) => /^\*\*Confidence:\*\*/.test(l));
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
for (const { tier } of ratings.values()) {
  const base = tier.replace("*", "");
  histogram.set(base, (histogram.get(base) || 0) + 1);
}
const starred = [...ratings.values()].filter((r) => r.tier.endsWith("*")).length;

console.log(`${write ? "Applied" : "Dry run"} — ${ratings.size} ratings from ${fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".tsv")).length} batch file(s)`);
console.log("");
console.log("Tier histogram (asterisks folded into their base tier):");
const total = ratings.size || 1;
for (const tier of TIER_ORDER) {
  const n = histogram.get(tier) || 0;
  if (!n) continue;
  const pct = ((n / total) * 100).toFixed(1);
  console.log(`  ${tier.padEnd(9)} ${String(n).padStart(4)}  ${pct.padStart(5)}%  ${"#".repeat(Math.round(n / 3))}`);
}
console.log(`  hype bumps (*): ${starred}`);
console.log("");
console.log(`Pages ${write ? "written" : "that would change"}: ${updated}; already correct: ${unchanged}`);

if (overrides.length) {
  console.log("");
  console.log(`ADJUDICATED — ${overrides.length} tier(s) overridden by hand:`);
  for (const o of overrides) console.log(`  ${o}`);
}
if (missing.length) {
  console.log("");
  console.log(`UNRATED — ${missing.length} page(s) owe a tier and have no line in any TSV:`);
  for (const slug of missing.slice(0, 40)) console.log(`  ${slug}`);
  if (missing.length > 40) console.log(`  ...and ${missing.length - 40} more`);
}
if (unexpected.length) {
  console.log("");
  console.log(`UNEXPECTED — ${unexpected.length} rating(s) for pages not in the manifest:`);
  for (const slug of unexpected) console.log(`  ${slug}`);
}
if (conflicts.length) {
  console.log("");
  console.log(`CONFLICTS — ${conflicts.length} page(s) rated twice with different tiers (first won):`);
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
