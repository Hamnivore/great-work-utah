const REPO = "Hamnivore/great-work-utah";
const BRANCH = "main";
const API_BASE = "https://api.github.com";

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

/** Read any file in the repo by its repo-root-relative path, e.g. "wiki/ventures/foo.md" */
export async function ghReadFile(repoPath: string): Promise<string> {
  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return `Error ${res.status}: ${res.statusText} (${repoPath})`;
  const data = (await res.json()) as { type: string; content: string };
  if (data.type !== "file") return `Error: ${repoPath} is not a file`;
  return Buffer.from(data.content, "base64").toString("utf8");
}

/** Create or update a file. repoPath is repo-root-relative. Returns a status string. */
export async function ghWriteFile(
  repoPath: string,
  content: string,
  commitMessage: string,
): Promise<string> {
  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}`;

  // Need existing SHA to update; absence means create
  let sha: string | undefined;
  const check = await fetch(`${url}?ref=${BRANCH}`, { headers: headers() });
  if (check.ok) {
    const existing = (await check.json()) as { sha: string };
    sha = existing.sha;
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
  const url = `${API_BASE}/repos/${REPO}/contents/${repoPath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return `Error ${res.status}: ${res.statusText}`;
  const data = (await res.json()) as Array<{ type: string; name: string; path: string }>;
  if (!Array.isArray(data)) return `Error: ${repoPath} is not a directory`;
  return data
    .map((f) => `${f.type === "dir" ? "📁" : "📄"} ${f.name}  (${f.path})`)
    .join("\n");
}
