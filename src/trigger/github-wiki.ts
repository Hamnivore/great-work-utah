const REPO = "Hamnivore/great-work-utah";
const BRANCH = "main";
const API_BASE = "https://api.github.com";

type WriteFileOptions = {
  overwrite?: boolean;
};

const WRITABLE_WIKI_DIRS = new Set([
  "answers",
  "guides",
  "helpers",
  "matches",
  "people",
  "resources",
  "sources",
  "ventures",
  "work",
]);
const READABLE_WIKI_DIRS = new Set([...WRITABLE_WIKI_DIRS, "indexes"]);

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN env var not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function validateWritableWikiPath(repoPath: string): string | null {
  if (repoPath.startsWith("/") || repoPath.includes("\\")) {
    return "path must be repo-relative and use forward slashes";
  }

  const parts = repoPath.split("/");
  if (parts.length !== 3 || parts[0] !== "wiki") {
    return "path must look like wiki/<category>/<slug>.md";
  }

  const [, category, filename] = parts;
  if (!WRITABLE_WIKI_DIRS.has(category)) {
    return `category must be one of: ${Array.from(WRITABLE_WIKI_DIRS).sort().join(", ")}`;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) {
    return "filename must be a lowercase slug ending in .md";
  }

  return null;
}

function validateReadableWikiPath(repoPath: string): string | null {
  if (repoPath.startsWith("/") || repoPath.includes("\\")) {
    return "path must be repo-relative and use forward slashes";
  }

  if (repoPath === "wiki/index.md") return null;

  const parts = repoPath.split("/");
  if (parts.length < 2 || parts.length > 3 || parts[0] !== "wiki") {
    return "path must look like wiki/<category> or wiki/<category>/<slug>.md";
  }

  const [, category, filename] = parts;
  if (!READABLE_WIKI_DIRS.has(category)) {
    return `category must be one of: ${Array.from(READABLE_WIKI_DIRS).sort().join(", ")}`;
  }

  if (filename && !/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) {
    return "filename must be a lowercase slug ending in .md";
  }

  return null;
}

/** Read any file in the repo by its repo-root-relative path, e.g. "wiki/ventures/foo.md" */
export async function ghReadFile(repoPath: string): Promise<string> {
  const pathError = validateReadableWikiPath(repoPath);
  if (pathError) return `Error: ${pathError} (${repoPath})`;

  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return `Error ${res.status}: ${res.statusText} (${repoPath})`;
  const data = (await res.json()) as { type: string; content: string };
  if (data.type !== "file") return `Error: ${repoPath} is not a file`;
  return Buffer.from(data.content, "base64").toString("utf8");
}

/** Create a file, or update it only when overwrite is explicitly enabled. */
export async function ghWriteFile(
  repoPath: string,
  content: string,
  commitMessage: string,
  options: WriteFileOptions = {},
): Promise<string> {
  const pathError = validateWritableWikiPath(repoPath);
  if (pathError) return `Write blocked: ${pathError} (${repoPath})`;

  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}`;

  // Need existing SHA to update; absence means create
  let sha: string | undefined;
  const check = await fetch(`${url}?ref=${BRANCH}`, { headers: headers() });
  if (check.ok) {
    const existing = (await check.json()) as { sha: string };
    sha = existing.sha;
  }

  if (sha && !options.overwrite) {
    return `Write blocked: ${repoPath} already exists. Read and merge the existing page before updating it.`;
  }

  const body: Record<string, string> = {
    message: commitMessage,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = (await res.json()) as { message?: string };
    return `Error ${res.status}: ${err.message ?? JSON.stringify(err)}`;
  }
  return sha ? `Updated ${repoPath}` : `Created ${repoPath}`;
}

/** List files/dirs in a repo directory. Returns a human-readable string. */
export async function ghListDir(repoPath: string): Promise<string> {
  const pathError = validateReadableWikiPath(repoPath);
  if (pathError) return `Error: ${pathError} (${repoPath})`;

  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return `Error ${res.status}: ${res.statusText}`;
  const data = (await res.json()) as Array<{ type: string; name: string; path: string }>;
  if (!Array.isArray(data)) return `Error: ${repoPath} is not a directory`;
  return data
    .map((f) => `${f.type === "dir" ? "📁" : "📄"} ${f.name}  (${f.path})`)
    .join("\n");
}
