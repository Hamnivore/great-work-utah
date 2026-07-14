#!/usr/bin/env node
/**
 * Probe whether a careers URL returns agent-readable job content over plain HTTP.
 * Exit 0 + prints READABLE if the body (or JSON job board) names roles without JS.
 * Usage: node scripts/check-careers-readable.mjs <url>
 */
import https from 'node:https';
import http from 'node:http';

const url = process.argv[2];
if (!url) {
  console.error('usage: node scripts/check-careers-readable.mjs <url>');
  process.exit(2);
}

function fetchText(target, redirects = 0) {
  return new Promise((resolve) => {
    const lib = target.startsWith('https') ? https : http;
    const req = lib.get(
      target,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; greatutah.work-agent-check/1.0)',
          Accept: 'text/html,application/json,*/*',
        },
        timeout: 20000,
        // some university / DoD hosts need system CA
        ...(target.startsWith('https')
          ? { rejectUnauthorized: true }
          : {}),
      },
      (res) => {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location &&
          redirects < 6
        ) {
          let loc = res.headers.location;
          if (loc.startsWith('/')) {
            const u = new URL(target);
            loc = u.origin + loc;
          } else if (!/^https?:/i.test(loc)) {
            loc = new URL(loc, target).href;
          }
          res.resume();
          return resolve(fetchText(loc, redirects + 1));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString('utf8'),
            finalUrl: target,
            contentType: res.headers['content-type'] || '',
          }),
        );
      },
    );
    req.on('error', (e) => resolve({ status: 0, error: e.message, finalUrl: target }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout', finalUrl: target });
    });
  });
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const ROLE =
  /\b(engineer|scientist|manager|analyst|designer|developer|specialist|technician|operator|director|intern|researcher|nurse|physician|accountant|recruiter|coordinator|associate|architect|mechanic|welder|pilot|attorney|counsel|professor|postdoc|faculty)\b/i;
const CAREER_CTX =
  /\b(job|jobs|career|careers|position|positions|opening|openings|hiring|apply|application|role|roles|opportunity|opportunities|requisition)\b/i;

const ATS_HINT =
  /greenhouse|lever\.co|ashbyhq|workable|applicantpro|teamtailor|paylocity|bamboohr|myworkdayjobs|icims|jobvite|smartrecruiters|recruitee|rippling|job-boards\.greenhouse/i;

const r = await fetchText(url);
if (r.error || !r.status || r.status >= 400) {
  console.log(
    JSON.stringify({
      verdict: 'FAIL',
      status: r.status || 0,
      error: r.error || `HTTP ${r.status}`,
      finalUrl: r.finalUrl || url,
    }),
  );
  process.exit(1);
}

const text = stripHtml(r.body);
const jsonJobs =
  /"title"\s*:\s*"[^"]{3,80}"/.test(r.body) ||
  /"name"\s*:\s*"[^"]{3,80}"/.test(r.body);
const roleHits = (text.match(new RegExp(ROLE.source, 'gi')) || []).length;
const hasCtx = CAREER_CTX.test(text) || CAREER_CTX.test(r.body);
const ats = ATS_HINT.test(r.finalUrl) || ATS_HINT.test(r.body);
const spaShell =
  (text.length < 400 &&
    /__NEXT_DATA__|window\.__|ag-grid|react-root|id="root"|id="app"|enable JavaScript|needs? JavaScript/i.test(
      r.body + ' ' + text,
    )) ||
  /You need to enable JavaScript/i.test(text);

let verdict = 'WEAK';
if (spaShell && !jsonJobs) verdict = 'WEAK_SPA';
else if (
  (roleHits >= 2 && hasCtx) ||
  (jsonJobs && hasCtx) ||
  // ATS hosts alone are not enough — require real role signal in the body
  (ats && roleHits >= 2 && hasCtx)
)
  verdict = 'READABLE';
else if (hasCtx && text.length > 800) verdict = 'PARTIAL';

console.log(
  JSON.stringify({
    verdict,
    status: r.status,
    finalUrl: r.finalUrl,
    textLen: text.length,
    roleHits,
    ats: !!ats,
    sample: text.slice(0, 280),
  }),
);
process.exit(verdict === 'READABLE' || verdict === 'PARTIAL' ? 0 : 1);
