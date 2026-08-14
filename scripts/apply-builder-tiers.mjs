#!/usr/bin/env node
// Applies the builder-character ladder from research/builder-tier-list/results/*.tsv.
// Raters write scratch judgments; this one process edits wiki pages centrally.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = path.join(ROOT, "wiki", "pages");
const RESULTS = path.join(ROOT, "research", "builder-tier-list", "results");
const ADJUDICATIONS = path.join(ROOT, "research", "builder-tier-list", "adjudications.tsv");
const TYPES = new Set(["venture", "person", "helper", "resource", "work"]);
const ORDER = ["S", "A", "B", "C", "D", "F", "unranked"];
const TIER_RE = /^(S|A|B|C|D|F|unranked)$/;
const args = new Set(process.argv.slice(2));
const write = args.has("--write");

if (args.has("--help") || args.has("-h")) {
  console.log("Usage: node scripts/apply-builder-tiers.mjs [--write]\n\nDry run by default. Rubric: wiki/meta/builder-tiers.md.");
  process.exit(0);
}
if (!fs.existsSync(RESULTS)) {
  console.error(`No results directory at ${path.relative(ROOT, RESULTS)}.`);
  process.exit(1);
}

const ratings = new Map();
const malformed = [];
const conflicts = [];
const overrides = [];
const readTsv = (file, label, adjudicated = false) => {
  for (const [i, line] of fs.readFileSync(file, "utf8").split("\n").entries()) {
    if (!line.trim() || line.startsWith("#")) continue;
    const [rawSlug, rawTier, ...rest] = line.split("\t");
    let slug = (rawSlug || "").trim();
    if (!slug.endsWith(".md")) slug += ".md";
    const tier = (rawTier || "").trim().replace(/^[`_*]+|[`_*]+$/g, "");
    if (!TIER_RE.test(tier)) {
      malformed.push(`${label}:${i + 1} — invalid tier "${tier}" for ${slug}`);
      continue;
    }
    const next = { tier, argument: rest.join(" ").trim(), batch: adjudicated ? "adjudicated" : label.replace(/\.tsv$/, "") };
    const prior = ratings.get(slug);
    if (prior && !adjudicated && prior.tier !== tier) {
      conflicts.push(`${slug}: ${prior.batch} says ${prior.tier}, ${next.batch} says ${tier}`);
      continue;
    }
    if (prior && adjudicated && prior.tier !== tier) overrides.push(`${slug}: ${prior.tier} -> ${tier}`);
    ratings.set(slug, next);
  }
};

for (const file of fs.readdirSync(RESULTS).filter((f) => f.endsWith(".tsv")).sort()) {
  readTsv(path.join(RESULTS, file), file);
}
if (fs.existsSync(ADJUDICATIONS)) readTsv(ADJUDICATIONS, "adjudications.tsv", true);

const owed = new Set();
for (const file of fs.readdirSync(PAGES).filter((f) => f.endsWith(".md")).sort()) {
  const raw = fs.readFileSync(path.join(PAGES, file), "utf8");
  const type = (/^\*\*Type:\*\*\s*(.+?)\s*$/m.exec(raw) || [])[1]?.trim();
  if (TYPES.has(type)) owed.add(file);
}
const missing = [...owed].filter((slug) => !ratings.has(slug)).sort();
const unexpected = [...ratings.keys()].filter((slug) => !owed.has(slug)).sort();
const failures = [];
let updated = 0;
let unchanged = 0;

for (const [slug, { tier }] of [...ratings].sort()) {
  const filePath = path.join(PAGES, slug);
  if (!fs.existsSync(filePath)) { failures.push(`${slug} — no such page`); continue; }
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split("\n");
  const type = (/^\*\*Type:\*\*\s*(.+?)\s*$/m.exec(original) || [])[1]?.trim();
  if (!TYPES.has(type)) { failures.push(`${slug} — Type "${type}" does not take Builder-tier`); continue; }
  const existing = lines.findIndex((line) => /^\*\*Builder-tier:\*\*/.test(line));
  const tierLine = `**Builder-tier:** ${tier}`;
  if (existing >= 0 && lines[existing] === tierLine) { unchanged += 1; continue; }
  if (existing >= 0) lines[existing] = tierLine;
  else {
    let anchor = lines.findIndex((line) => /^\*\*Tier:\*\*/.test(line));
    if (anchor < 0) anchor = lines.findIndex((line) => /^\*\*Confidence:\*\*/.test(line));
    if (anchor < 0) anchor = lines.findIndex((line) => /^\*\*Type:\*\*/.test(line));
    if (anchor < 0) { failures.push(`${slug} — no metadata anchor`); continue; }
    lines.splice(anchor + 1, 0, tierLine);
  }
  if (write) fs.writeFileSync(filePath, lines.join("\n"));
  updated += 1;
}

const histogram = new Map();
for (const { tier } of ratings.values()) histogram.set(tier, (histogram.get(tier) || 0) + 1);
console.log(`${write ? "Applied" : "Dry run"} — ${ratings.size} ratings from ${fs.readdirSync(RESULTS).filter((f) => f.endsWith(".tsv")).length} batch file(s)`);
console.log("\nBuilder-tier histogram:");
for (const tier of ORDER) {
  const n = histogram.get(tier) || 0;
  if (n) console.log(`  ${tier.padEnd(9)} ${String(n).padStart(4)}  ${((n / Math.max(ratings.size, 1)) * 100).toFixed(1).padStart(5)}%`);
}
console.log(`\nPages ${write ? "written" : "that would change"}: ${updated}; already correct: ${unchanged}`);
if (overrides.length) console.log(`\nADJUDICATED — ${overrides.length}\n  ${overrides.join("\n  ")}`);
if (missing.length) console.log(`\nUNRATED — ${missing.length}\n  ${missing.join("\n  ")}`);
if (unexpected.length) console.log(`\nUNEXPECTED — ${unexpected.length}\n  ${unexpected.join("\n  ")}`);
if (conflicts.length) console.log(`\nCONFLICTS — ${conflicts.length}\n  ${conflicts.join("\n  ")}`);
if (malformed.length) console.log(`\nMALFORMED — ${malformed.length}\n  ${malformed.join("\n  ")}`);
if (failures.length) console.log(`\nFAILED — ${failures.length}\n  ${failures.join("\n  ")}`);
if (!write) console.log("\nDry run. Re-run with --write to edit pages.");
process.exit(malformed.length || failures.length ? 1 : 0);
