#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WIKI_ROOT = path.join(REPO_ROOT, "wiki");
const REQUIRED_HEADERS = ["Status", "Confidence", "Updated"];
const SOFT_LINE_CAP = 400;
const HARD_LINE_CAP = 800;
const PUBLIC_CONTENT_DIRS = ["answers", "guides", "helpers", "matches", "people", "resources", "sources", "ventures", "work"];
const CONTENT_FILE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const DISCOURAGED_SUFFIX_RE = /-(?:profile|page|new|copy|final|v\d+|[2-9])\.md$/;
const MARKDOWN_LINK_RE = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const LEGACY_PROVENANCE_RE = /\blegacy[_ -]?wiki\b|\blegacy provenance\b|\binternal seed\b/i;

const args = new Set(process.argv.slice(2));
const json = args.has("--json");
const fix = args.has("--fix");
const help = args.has("--help") || args.has("-h");

if (help) {
  console.log(`Usage: node scripts/wiki-lint.mjs [--json] [--fix]

Checks public wiki markdown pages for required Great Work conventions.

Options:
  --json   Print machine-readable JSON.
  --fix    Apply conservative formatting fixes only: CRLF normalization and final newline.
`);
  process.exit(0);
}

const findings = [];
const fixedFiles = [];

function addFinding(severity, code, filePath, message, line = null) {
  findings.push({
    severity,
    code,
    path: path.relative(REPO_ROOT, filePath),
    line,
    message,
  });
}

function splitLines(content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1).split("\n") : normalized.split("\n");
}

function parseBoldPrefixHeaders(lines, h1Index) {
  const headers = new Map();
  if (h1Index === -1) return headers;

  for (let index = h1Index + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("## ")) break;

    const match = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
    if (match) {
      headers.set(match[1].trim(), {
        value: match[2].trim(),
        line: index + 1,
      });
    }
  }

  return headers;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listPublicMarkdownFiles() {
  const files = [];

  for (const dir of PUBLIC_CONTENT_DIRS) {
    const dirPath = path.join(WIKI_ROOT, dir);
    if (!(await pathExists(dirPath))) continue;
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(path.join(dirPath, entry.name));
      }
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function localMarkdownTarget(rawTarget) {
  if (!rawTarget || rawTarget.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) return null;

  const withoutAnchor = rawTarget.split("#")[0];
  const withoutQuery = withoutAnchor.split("?")[0];
  if (!withoutQuery.endsWith(".md")) return null;

  try {
    return decodeURIComponent(withoutQuery);
  } catch {
    return withoutQuery;
  }
}

async function checkLinks(filePath, content) {
  const lines = splitLines(content);
  const lineStarts = [];
  let offset = 0;
  for (const line of lines) {
    lineStarts.push(offset);
    offset += line.length + 1;
  }

  for (const match of content.matchAll(MARKDOWN_LINK_RE)) {
    const target = localMarkdownTarget(match[1]);
    if (!target) continue;

    const resolved = path.resolve(path.dirname(filePath), target);
    const relativeResolved = path.relative(REPO_ROOT, resolved);
    const line = lineStarts.findLastIndex((start) => start <= match.index) + 1;

    if (relativeResolved.startsWith("..") || path.isAbsolute(relativeResolved)) {
      addFinding("error", "link-outside-repo", filePath, `Relative markdown link points outside the repo: ${match[1]}`, line);
      continue;
    }

    if (!(await pathExists(resolved))) {
      addFinding("error", "broken-md-link", filePath, `Broken relative markdown link: ${match[1]}`, line);
    }
  }
}

async function maybeFixFormatting(filePath, content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const fixed = normalized.endsWith("\n") ? normalized : `${normalized}\n`;
  if (fixed !== content) {
    await fs.writeFile(filePath, fixed, "utf8");
    fixedFiles.push(path.relative(REPO_ROOT, filePath));
  }
  return fixed;
}

async function lintFile(filePath) {
  let content = await fs.readFile(filePath, "utf8");
  if (fix) content = await maybeFixFormatting(filePath, content);

  const lines = splitLines(content);
  const filename = path.basename(filePath);
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  const headers = parseBoldPrefixHeaders(lines, h1Index);

  if (!CONTENT_FILE_RE.test(filename)) {
    addFinding("error", "bad-filename", filePath, "Filename must be lowercase kebab-case ending in .md.");
  } else if (DISCOURAGED_SUFFIX_RE.test(filename)) {
    addFinding("warning", "discouraged-filename-suffix", filePath, "Filename uses a discouraged suffix like -profile, -page, -new, or a version/copy marker.");
  }

  if (h1Index === -1) {
    addFinding("error", "missing-h1", filePath, "Missing first-level markdown heading.");
  }

  for (const header of REQUIRED_HEADERS) {
    if (!headers.has(header)) {
      addFinding("error", "missing-required-header", filePath, `Missing required bold-prefix header: **${header}:**`);
    }
  }

  if (LEGACY_PROVENANCE_RE.test(content)) {
    const line = lines.findIndex((candidate) => LEGACY_PROVENANCE_RE.test(candidate));
    addFinding("error", "legacy-provenance", filePath, "Public page mentions legacy/internal provenance.", line + 1);
  }

  if (lines.length > HARD_LINE_CAP) {
    addFinding("error", "hard-line-cap", filePath, `Page has ${lines.length} lines; hard cap is ${HARD_LINE_CAP}.`);
  } else if (lines.length > SOFT_LINE_CAP) {
    addFinding("warning", "soft-line-cap", filePath, `Page has ${lines.length} lines; soft cap is ${SOFT_LINE_CAP}.`);
  }

  await checkLinks(filePath, content);
}

const files = await listPublicMarkdownFiles();
for (const file of files) {
  await lintFile(file);
}

findings.sort((a, b) => {
  const pathCompare = a.path.localeCompare(b.path);
  if (pathCompare !== 0) return pathCompare;
  return (a.line ?? 0) - (b.line ?? 0);
});

const errors = findings.filter((finding) => finding.severity === "error").length;
const warnings = findings.filter((finding) => finding.severity === "warning").length;

if (json) {
  console.log(
    JSON.stringify(
      {
        ok: errors === 0,
        checkedFiles: files.length,
        errors,
        warnings,
        fixedFiles,
        findings,
      },
      null,
      2
    )
  );
} else {
  console.log(`wiki-lint: checked ${files.length} files, ${errors} errors, ${warnings} warnings`);
  if (fixedFiles.length > 0) {
    console.log(`fixed formatting in ${fixedFiles.length} file${fixedFiles.length === 1 ? "" : "s"}:`);
    for (const file of fixedFiles) console.log(`  ${file}`);
  }
  for (const finding of findings) {
    const location = finding.line ? `${finding.path}:${finding.line}` : finding.path;
    console.log(`${finding.severity.toUpperCase()} ${finding.code} ${location} - ${finding.message}`);
  }
}

process.exit(errors > 0 ? 1 : 0);
