#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const WIKI_ROOT = path.join(REPO_ROOT, "wiki");
const PUBLIC_CONTENT_DIRS = ["answers", "guides", "helpers", "matches", "people", "resources", "ventures", "work"];
const SOURCE_RECORD_DIRS = ["sources"];
const MARKDOWN_LINK_RE = /(?<!!)\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const SOURCE_TOKEN_RE = /\[source:([a-z0-9]+(?:-[a-z0-9]+)*)\]/g;
const DIRECTORY_SOURCE_PATHS = new Set(["sources/startup-utah-resource-list.md"]);

const args = process.argv.slice(2);
const json = args.includes("--json");
const strict = args.includes("--strict");
const help = args.includes("--help") || args.includes("-h");
const listArg = args.find((arg) => arg.startsWith("--list="));
const listMode = listArg?.split("=")[1] ?? null;

const LIST_MODES = new Set(["missing-direct", "missing-relates", "source-tokens", "uncited-sources"]);

if (help) {
  console.log(`Usage: node scripts/wiki-source-coverage.mjs [--json] [--strict] [--list=<mode>]

Audits public wiki pages for source coverage and graph-ready citation edges.

Options:
  --json                 Print machine-readable JSON.
  --strict               Exit nonzero when warnings are present.
  --list=missing-direct  List non-source pages with no markdown link to wiki/sources.
  --list=missing-relates List non-source pages with no **Relates:** cites edge.
  --list=source-tokens   List legacy [source:slug] inline tokens.
  --list=uncited-sources List source records with no inbound markdown citation.
`);
  process.exit(0);
}

if (listMode && !LIST_MODES.has(listMode)) {
  console.error(`Unknown --list mode: ${listMode}`);
  process.exit(2);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isCandidateMarkdownFile(entry) {
  if (!entry.isFile()) return false;
  if (entry.name.endsWith(".md")) return true;
  return !entry.name.includes(".");
}

async function listMarkdownFiles(dirNames) {
  const files = [];

  for (const dirName of dirNames) {
    const dirPath = path.join(WIKI_ROOT, dirName);
    if (!(await pathExists(dirPath))) continue;

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (isCandidateMarkdownFile(entry)) files.push(path.join(dirPath, entry.name));
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function repoRelative(filePath) {
  return path.relative(REPO_ROOT, filePath);
}

function wikiRelative(filePath) {
  return path.relative(WIKI_ROOT, filePath);
}

function normalizeMarkdownTarget(rawTarget) {
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

function headerValue(headers, name) {
  return headers.find((header) => header.name === name)?.value ?? "";
}

function parseHeaderLines(lines) {
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  const headers = [];
  if (h1Index === -1) return headers;

  for (let index = h1Index + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("## ")) break;

    const match = line.match(/^\*\*([^:]+):\*\*\s*(.*)$/);
    if (match) {
      headers.push({
        name: match[1].trim(),
        value: match[2].trim(),
        line: index + 1,
      });
    }
  }

  return headers;
}

function lineStartsFor(content) {
  const starts = [];
  let offset = 0;
  for (const line of content.split("\n")) {
    starts.push(offset);
    offset += line.length + 1;
  }
  return starts;
}

function lineForOffset(lineStarts, offset) {
  return lineStarts.findLastIndex((start) => start <= offset) + 1;
}

function sectionForLine(lines, lineNumber) {
  let current = null;
  for (let index = 0; index < Math.min(lines.length, lineNumber); index += 1) {
    if (lines[index].startsWith("## ")) current = lines[index].slice(3).trim();
  }
  return current;
}

function parseMarkdownLinks(filePath, content) {
  const links = [];
  const lines = content.split("\n");
  const lineStarts = lineStartsFor(content);

  for (const match of content.matchAll(MARKDOWN_LINK_RE)) {
    const target = normalizeMarkdownTarget(match[1]);
    if (!target) continue;

    const resolved = path.resolve(path.dirname(filePath), target);
    const relativeToWiki = path.relative(WIKI_ROOT, resolved);
    if (relativeToWiki.startsWith("..") || path.isAbsolute(relativeToWiki)) continue;

    const line = lineForOffset(lineStarts, match.index);
    links.push({
      raw: match[1],
      target: relativeToWiki,
      line,
      section: sectionForLine(lines, line),
    });
  }

  return links;
}

function parseExternalEvidenceLinks(content) {
  const lines = content.split("\n");
  const lineStarts = lineStartsFor(content);
  const links = [];

  for (const match of content.matchAll(MARKDOWN_LINK_RE)) {
    const raw = match[1];
    if (!/^https?:\/\//i.test(raw)) continue;
    const line = lineForOffset(lineStarts, match.index);
    const section = sectionForLine(lines, line);
    if (section !== "Evidence" && section !== "Sources") continue;
    links.push({ raw, line, section });
  }

  return links;
}

function parseRelatesCites(headers, filePath) {
  const cites = [];

  for (const header of headers) {
    if (header.name !== "Relates") continue;
    const match = header.value.match(/^cites\s+\[[^\]]+\]\(([^)]+)\)$/);
    if (!match) continue;

    const target = normalizeMarkdownTarget(match[1]);
    if (!target) continue;

    const resolved = path.resolve(path.dirname(filePath), target);
    const relativeToWiki = path.relative(WIKI_ROOT, resolved);
    if (relativeToWiki.startsWith("..") || path.isAbsolute(relativeToWiki)) continue;
    cites.push(relativeToWiki);
  }

  return cites;
}

function parseSourceTokens(content) {
  const lineStarts = lineStartsFor(content);
  return [...content.matchAll(SOURCE_TOKEN_RE)].map((match) => ({
    target: `sources/${match[1]}.md`,
    line: lineForOffset(lineStarts, match.index),
  }));
}

function coverageLevel(page) {
  if (page.directSourceLinks.length > 0 && page.directSourceLinks.every((sourcePath) => DIRECTORY_SOURCE_PATHS.has(sourcePath))) {
    return "directory-only";
  }
  if (page.directSourceLinks.length > 0 && page.relatesCites.length > 0) return "graph-ready";
  if (page.directSourceLinks.length > 0) return "linked-source";
  if (page.sourceTokens.length > 0) return "token-only";
  if (page.factLayerLinks.length > 0) return "fact-layer-only";
  return "uncited";
}

async function parsePage(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const lines = content.split("\n");
  const headers = parseHeaderLines(lines);
  const links = parseMarkdownLinks(filePath, content);
  const externalEvidenceLinks = parseExternalEvidenceLinks(content);
  const relatesCites = parseRelatesCites(headers, filePath);
  const sourceTokens = parseSourceTokens(content);
  const directSourceLinks = links.filter((link) => link.target.startsWith("sources/")).map((link) => link.target);
  const factLayerLinks = links
    .filter((link) => /^(helpers|people|resources|ventures|work)\//.test(link.target))
    .map((link) => link.target);
  const evidenceLinks = links.filter((link) => link.section === "Evidence" || link.section === "Sources");

  return {
    path: repoRelative(filePath),
    wikiPath: wikiRelative(filePath),
    type: path.basename(path.dirname(filePath)),
    directSourceLinks: [...new Set(directSourceLinks)].sort(),
    relatesCites: [...new Set(relatesCites)].sort(),
    sourceTokens: [...new Map(sourceTokens.map((token) => [token.target, token])).values()].sort((a, b) =>
      a.target.localeCompare(b.target)
    ),
    factLayerLinks: [...new Set(factLayerLinks)].sort(),
    evidenceLinks,
    externalEvidenceLinks,
    headers,
  };
}

function countBy(items, fn) {
  return items.reduce((counts, item) => {
    const key = fn(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function summarizeByType(pages) {
  const summary = {};
  for (const page of pages) {
    summary[page.type] ??= {
      pages: 0,
      graphReady: 0,
      linkedSource: 0,
      directoryOnly: 0,
      tokenOnly: 0,
      factLayerOnly: 0,
      uncited: 0,
      missingDirectSourceLinks: 0,
      missingRelatesCites: 0,
    };

    const bucket = summary[page.type];
    bucket.pages += 1;
    if (page.coverageLevel === "graph-ready") bucket.graphReady += 1;
    if (page.coverageLevel === "linked-source") bucket.linkedSource += 1;
    if (page.coverageLevel === "directory-only") bucket.directoryOnly += 1;
    if (page.coverageLevel === "token-only") bucket.tokenOnly += 1;
    if (page.coverageLevel === "fact-layer-only") bucket.factLayerOnly += 1;
    if (page.coverageLevel === "uncited") bucket.uncited += 1;
    if (page.directSourceLinks.length === 0) bucket.missingDirectSourceLinks += 1;
    if (page.relatesCites.length === 0) bucket.missingRelatesCites += 1;
  }
  return summary;
}

function formatPercent(value, total) {
  if (total === 0) return "0.0%";
  return `${((value / total) * 100).toFixed(1)}%`;
}

function printList(title, items, formatItem) {
  console.log(title);
  if (items.length === 0) {
    console.log("  none");
    return;
  }
  for (const item of items) console.log(`  ${formatItem(item)}`);
}

function sourceLinkLine(page, sourcePath) {
  return page.evidenceLinks.find((link) => link.target === sourcePath)?.line ?? null;
}

function addFinding(findings, severity, code, filePath, message, extra = {}) {
  findings.push({
    severity,
    code,
    path: filePath,
    line: extra.line ?? null,
    message,
    ...Object.fromEntries(Object.entries(extra).filter(([key]) => key !== "line")),
  });
}

async function main() {
  const contentFiles = await listMarkdownFiles(PUBLIC_CONTENT_DIRS);
  const sourceFiles = await listMarkdownFiles(SOURCE_RECORD_DIRS);
  const pages = [];

  for (const filePath of contentFiles) {
    const page = await parsePage(filePath);
    page.coverageLevel = coverageLevel(page);
    pages.push(page);
  }

  const sourcePages = [];
  for (const filePath of sourceFiles) {
    sourcePages.push(await parsePage(filePath));
  }

  const sourceSet = new Set(sourcePages.map((page) => page.wikiPath));
  const inboundSourceLinks = new Map();
  for (const sourcePath of sourceSet) inboundSourceLinks.set(sourcePath, []);

  for (const page of pages) {
    for (const sourcePath of page.directSourceLinks) {
      if (!inboundSourceLinks.has(sourcePath)) inboundSourceLinks.set(sourcePath, []);
      inboundSourceLinks.get(sourcePath).push(page.wikiPath);
    }
  }

  const missingDirectSourceLinks = pages.filter((page) => page.directSourceLinks.length === 0);
  const missingRelatesCites = pages.filter((page) => page.relatesCites.length === 0);
  const sourceTokenPages = pages.filter((page) => page.sourceTokens.length > 0);
  const uncitedSources = sourcePages.filter((page) => (inboundSourceLinks.get(page.wikiPath) ?? []).length === 0);
  const brokenSourceTokens = pages.flatMap((page) =>
    page.sourceTokens
      .map((token) => token.target)
      .filter((sourcePath) => !sourceSet.has(sourcePath))
      .map((sourcePath) => ({ page: page.wikiPath, sourcePath }))
  );
  const sourceLinksToMissingRecords = pages.flatMap((page) =>
    page.directSourceLinks
      .filter((sourcePath) => !sourceSet.has(sourcePath))
      .map((sourcePath) => ({ page: page.wikiPath, sourcePath }))
  );
  const findings = [];

  for (const page of pages) {
    if (page.coverageLevel === "uncited") {
      addFinding(findings, "warning", "missing-source-coverage", page.path, "No source record link, inline source token, or fact-layer evidence link found.");
    } else if (page.coverageLevel === "directory-only") {
      addFinding(
        findings,
        "warning",
        "directory-only-source-coverage",
        page.path,
        "Only broad directory/import source coverage found.",
        {
          line: sourceLinkLine(page, "sources/startup-utah-resource-list.md"),
          sources: page.directSourceLinks.map((sourcePath) => `wiki/${sourcePath}`),
        }
      );
    }

    for (const link of page.evidenceLinks) {
      if (!link.target.startsWith("sources/") && link.section === "Evidence") {
        addFinding(findings, "warning", "non-source-link-in-evidence", page.path, "Evidence section links to a non-source wiki page.", {
          line: link.line,
          target: `wiki/${link.target}`,
        });
      }
    }
  }

  for (const finding of brokenSourceTokens) {
    addFinding(findings, "error", "broken-source-token", `wiki/${finding.page}`, "Inline source token does not resolve to a source record.", {
      target: `wiki/${finding.sourcePath}`,
    });
  }

  for (const finding of sourceLinksToMissingRecords) {
    addFinding(findings, "error", "broken-source-link", `wiki/${finding.page}`, "Markdown source link does not resolve to a source record.", {
      target: `wiki/${finding.sourcePath}`,
    });
  }

  for (const page of uncitedSources) {
    addFinding(findings, "warning", "unreferenced-source", page.path, "Source record has no inbound markdown citation from a public non-source page.");
  }

  for (const page of sourcePages) {
    if (!headerValue(page.headers, "URL")) {
      addFinding(findings, "warning", "source-without-url", page.path, "Source record is missing a URL header.");
    }
    if (!headerValue(page.headers, "Accessed")) {
      addFinding(findings, "warning", "source-missing-accessed", page.path, "Source record is missing an Accessed header.");
    }
  }

  findings.sort((a, b) => {
    const pathCompare = a.path.localeCompare(b.path);
    if (pathCompare !== 0) return pathCompare;
    const lineCompare = (a.line ?? 0) - (b.line ?? 0);
    if (lineCompare !== 0) return lineCompare;
    return a.code.localeCompare(b.code);
  });

  const errors = findings.filter((finding) => finding.severity === "error").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;
  const ok = errors === 0 && (!strict || warnings === 0);
  const coveredFiles = pages.filter((page) => page.coverageLevel === "graph-ready" || page.coverageLevel === "linked-source").length;
  const directoryOnlyFiles = pages.filter((page) => page.coverageLevel === "directory-only").length;
  const uncoveredFiles = pages.filter((page) => page.coverageLevel === "uncited").length;

  const result = {
    ok,
    checkedFiles: pages.length,
    coveredFiles,
    directoryOnlyFiles,
    uncoveredFiles,
    sourceFiles: sourcePages.length,
    errors,
    warnings,
    summary: {
      coverageLevels: countBy(pages, (page) => page.coverageLevel),
      byType: summarizeByType(pages),
      directSourceCoverage: {
        withDirectSourceLinks: pages.length - missingDirectSourceLinks.length,
        withoutDirectSourceLinks: missingDirectSourceLinks.length,
      },
      relatesCitesCoverage: {
        withRelatesCites: pages.length - missingRelatesCites.length,
        withoutRelatesCites: missingRelatesCites.length,
      },
      sourceRecordUsage: {
        citedSourceRecords: sourcePages.length - uncitedSources.length,
        uncitedSourceRecords: uncitedSources.length,
      },
      legacySourceTokens: sourceTokenPages.length,
    },
    pages: pages.map(({ headers, ...page }) => page),
    sourceRecords: sourcePages.map((page) => ({
      path: page.path,
      wikiPath: page.wikiPath,
      citedBy: (inboundSourceLinks.get(page.wikiPath) ?? []).sort(),
    })),
    findings: {
      missingDirectSourceLinks: missingDirectSourceLinks.map((page) => page.path),
      missingRelatesCites: missingRelatesCites.map((page) => page.path),
      sourceTokenPages: sourceTokenPages.map((page) => ({ path: page.path, sourceTokens: page.sourceTokens })),
      uncitedSources: uncitedSources.map((page) => page.path),
      brokenSourceTokens,
      sourceLinksToMissingRecords,
    },
    lintFindings: findings,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(ok ? 0 : 1);
  }

  if (listMode === "missing-direct") {
    printList("Pages without direct wiki/sources markdown links:", missingDirectSourceLinks, (page) => page.path);
  } else if (listMode === "missing-relates") {
    printList("Pages without graph-ready **Relates:** cites edges:", missingRelatesCites, (page) => page.path);
  } else if (listMode === "source-tokens") {
    printList(
      "Pages with legacy [source:slug] tokens:",
      sourceTokenPages,
      (page) => `${page.path} (${page.sourceTokens.map((token) => token.target).join(", ")})`
    );
  } else if (listMode === "uncited-sources") {
    printList("Source records with no inbound markdown citation:", uncitedSources, (page) => page.path);
  } else {
    const withDirect = pages.length - missingDirectSourceLinks.length;
    const withRelates = pages.length - missingRelatesCites.length;
    const citedSources = sourcePages.length - uncitedSources.length;

    console.log(`wiki-source-coverage: checked ${pages.length} public pages and ${sourcePages.length} source records`);
    console.log(`${errors} errors, ${warnings} warnings${strict ? " (strict mode)" : ""}`);
    console.log(`direct source links: ${withDirect}/${pages.length} (${formatPercent(withDirect, pages.length)})`);
    console.log(`Relates cites edges: ${withRelates}/${pages.length} (${formatPercent(withRelates, pages.length)})`);
    console.log(`source records cited: ${citedSources}/${sourcePages.length} (${formatPercent(citedSources, sourcePages.length)})`);
    console.log(`legacy [source:slug] token pages: ${sourceTokenPages.length}`);
    console.log("");
    console.log("coverage levels:");
    for (const [level, count] of Object.entries(result.summary.coverageLevels).sort()) {
      console.log(`  ${level}: ${count}`);
    }
    console.log("");
    console.log("by type:");
    for (const [type, summary] of Object.entries(result.summary.byType).sort()) {
      console.log(
        `  ${type}: ${summary.pages} pages, ${summary.graphReady} graph-ready, ${summary.linkedSource} linked-source, ${summary.directoryOnly} directory-only, ${summary.tokenOnly} token-only, ${summary.factLayerOnly} fact-layer-only, ${summary.uncited} uncited`
      );
    }

    if (errors > 0) {
      console.log("");
      printList(
        "Broken source token references:",
        brokenSourceTokens,
        (finding) => `${finding.page} -> ${finding.sourcePath}`
      );
      printList(
        "Markdown source links to missing records:",
        sourceLinksToMissingRecords,
        (finding) => `${finding.page} -> ${finding.sourcePath}`
      );
    }

    console.log("");
    console.log("Use --list=missing-direct, --list=missing-relates, --list=source-tokens, or --list=uncited-sources for page-level output.");
  }

  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
