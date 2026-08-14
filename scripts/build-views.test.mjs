import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('./build-views.mjs', import.meta.url))

const page = ({ title, roles, needs, region = '', careers = '', website = '', reviewed = '', summary = 'A useful organization.' }) => `# ${title}

**Type:** venture
**Status:** active
**Confidence:** high
**Focus:** Useful work
**Domain:** computing
${region ? `**Region:** ${region}\n` : ''}${careers ? `**Careers:** ${careers}\n` : ''}${website ? `**Website:** ${website}\n` : ''}${roles ? `**Roles:** ${roles}\n` : ''}${reviewed ? `**Needs-reviewed:** ${reviewed}\n` : ''}
## Summary

${summary}

${needs ? `## What They Need Now\n\n${needs}\n` : ''}`

test('generates populated role views with useful lead context and navigation', () => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), 'great-work-role-views-'))
  const pages = path.join(wiki, 'pages')
  fs.mkdirSync(pages)
  fs.writeFileSync(path.join(pages, 'alpha.md'), page({
    title: 'Alpha',
    roles: 'software-engineering, data-science',
    needs: 'Backend programmers and data scientists to ship the platform; see the [official source](alpha-source.md).',
    region: 'Salt Lake County',
    careers: 'https://alpha.example/jobs',
    reviewed: '2000-01-01',
  }))
  fs.writeFileSync(path.join(pages, 'beta.md'), page({
    title: 'Beta',
    roles: 'software-engineering',
    needs: 'A product-minded engineer.',
    website: 'https://beta.example',
  }))
  fs.writeFileSync(path.join(pages, 'no-needs.md'), page({
    title: 'No Needs',
    roles: 'biology-life-sciences',
    needs: '',
  }))
  fs.writeFileSync(path.join(pages, 'unknown.md'), page({
    title: 'Unknown',
    roles: 'wizard',
    needs: 'A wizard.',
  }))

  try {
    execFileSync(process.execPath, [script], {
      env: { ...process.env, GREAT_WORK_WIKI: wiki },
      stdio: 'pipe',
    })

    const views = path.join(wiki, 'views')
    const directory = fs.readFileSync(path.join(views, 'by-role.md'), 'utf8')
    assert.match(directory, /Programmers \/ software engineers.*2 organizations/)
    assert.match(directory, /Data scientists.*1 organization/)
    assert.match(directory, /https:\/\/greatutah\.work\/views\/role-software-engineering\.md/)
    assert.equal(fs.existsSync(path.join(views, 'role-biology-life-sciences.md')), false)
    assert.equal(fs.existsSync(path.join(views, 'role-wizard.md')), false)

    const software = fs.readFileSync(path.join(views, 'role-software-engineering.md'), 'utf8')
    assert.match(software, /Alpha/)
    assert.match(software, /Salt Lake County/)
    assert.match(software, /Careers: https:\/\/alpha\.example\/jobs/)
    assert.match(software, /Backend programmers and data scientists/)
    assert.match(software, /reviewed 2000-01-01 — may be stale/)
    assert.match(software, /Website: https:\/\/beta\.example/)
    assert.match(software, /not yet reviewed/)
    assert.match(software, /https:\/\/greatutah\.work\/pages\/alpha\.md/)

    const needs = fs.readFileSync(path.join(views, 'needs.md'), 'utf8')
    const index = fs.readFileSync(path.join(views, 'index.md'), 'utf8')
    assert.match(needs, /\[kind of work\]\(by-role\.md\).*https:\/\/greatutah\.work\/views\/by-role\.md/)
    assert.match(needs, /\[official source\]\(\/pages\/alpha-source\.md\)/)
    assert.doesNotMatch(needs, /\[official source\]\(alpha-source\.md\)/)
    assert.match(index, /\[by kind of work\]\(by-role\.md\)/)
    assert.match(index, /router for 4 pages/)
    assert.match(index, /Start by goal/)
    assert.match(index, /api\/search\?q=enhanced\+geothermal/)
    assert.match(index, /api\/locations\?near=Salt\+Lake\+City&radius_miles=35/)
    assert.match(index, /Domain attribution currently covers 4\/4 pages \(100%\)/)
    assert.match(index, /By Utah location.*1\/4 pages carry Region metadata \(25% coverage\)/)
    assert.match(index, /Find Meaningful Work in Utah.*https:\/\/greatutah\.work\/pages\/find-meaningful-work\.md/)
    assert.match(index, /Browse the complete corpus by type/)
    assert.match(index, /metadata assertions, not yet sourced/)
    assert.match(index, /review-gated procedure in https:\/\/greatutah\.work\/llms\.txt/)
    assert.match(index, /Grow a Main Street or rural business without venture capital/)
    assert.match(index, /leads derived from page assessments, not confirmed openings/)
    for (const domain of ['energy', 'health-bio', 'aerospace-defense', 'computing', 'materials-mfg', 'space-science', 'capital-programs', 'culture-place']) {
      assert.match(index, new RegExp(`https://greatutah\\.work/views/domain-${domain}\\.md`))
    }
  } finally {
    fs.rmSync(wiki, { recursive: true, force: true })
  }
})

test('tier list pairs each name with its complete authored summary', () => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), 'great-work-tier-view-'))
  const pages = path.join(wiki, 'pages')
  fs.mkdirSync(pages)
  fs.writeFileSync(path.join(pages, 'alpha.md'), page({
    title: 'Alpha Inc.',
    summary: 'Alpha builds an unusually capable machine; the bet is replacing an entire dirty industry.',
  }).replace('**Confidence:** high', '**Confidence:** high\n**Tier:** A'))

  try {
    execFileSync(process.execPath, [script], {
      env: { ...process.env, GREAT_WORK_WIKI: wiki },
      stdio: 'pipe',
    })
    const tierList = fs.readFileSync(path.join(wiki, 'views', 'tier-list.md'), 'utf8')
    assert.match(tierList, /\[Alpha Inc\.\]\(\/pages\/alpha\.md\)/)
    assert.match(tierList, /\[How this is ranked\]\(\.\.\/meta\/tiers\.md\)/)
    assert.doesNotMatch(tierList, /conf:/)
    assert.doesNotMatch(tierList, /Read the ladder correctly/)
    assert.doesNotMatch(tierList, /Useful work/)
    assert.match(tierList, /Alpha builds an unusually capable machine; the bet is replacing an entire dirty industry\./)
  } finally {
    fs.rmSync(wiki, { recursive: true, force: true })
  }
})

test('tier list marks active pages inline and does not emit a second list', () => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), 'great-work-activity-view-'))
  const pages = path.join(wiki, 'pages')
  fs.mkdirSync(pages)
  const fact = (slug, title, activity) =>
    fs.writeFileSync(path.join(pages, slug), `# ${title}

**Type:** venture
**Status:** active
**Confidence:** high
**Tier:** A
**Activity:** ${activity}
**Activity-checked:** 2026-08-13
${activity === 'active' ? '**Activity-signal:** 2026-06-01 · https://example.com/filing\n' : ''}**Focus:** Useful work

## Summary

${title} does a thing.
`)
  fact('live.md', 'Live Co', 'active')
  fact('done.md', 'Done Co', 'concluded')

  try {
    execFileSync(process.execPath, [script], {
      env: { ...process.env, GREAT_WORK_WIKI: wiki },
      stdio: 'pipe',
    })
    const views = path.join(wiki, 'views')
    const tierList = fs.readFileSync(path.join(views, 'tier-list.md'), 'utf8')
    assert.match(tierList, /\*\*\[Live Co\]\(\/pages\/live\.md\)\*\* \(active\)/)
    assert.match(tierList, /\*\*\[Done Co\]\(\/pages\/done\.md\)\*\* ·/)
    assert.doesNotMatch(tierList, /\[Done Co\][^\n]*\(active\)/)
    assert.doesNotMatch(tierList, /the active list/)
    assert.equal(fs.existsSync(path.join(views, 'tier-list-active.md')), false)
    assert.match(fs.readFileSync(path.join(views, 'index.md'), 'utf8'), /marked \(active\)/)
    const ventures = fs.readFileSync(path.join(views, 'ventures.md'), 'utf8')
    assert.match(ventures, /\[Live Co\]\(\/pages\/live\.md\) \(active\)/)
    assert.match(ventures, /\[Done Co\]\(\/pages\/done\.md\) ·/)
    assert.doesNotMatch(ventures, /\[Done Co\][^\n]*\(active\)/)
    assert.doesNotMatch(ventures, / · (?:dormant|concluded|activity unknown)/)
  } finally {
    fs.rmSync(wiki, { recursive: true, force: true })
  }
})

// The founder ladder's whole justification is that it disagrees with the impact ladder, so the thing
// worth pinning is that the two views sort the same page differently and that `n/a` leaves the ranking
// rather than landing at the bottom of it.
test('founder-resource list ranks the resource shelf separately from impact, and sets n/a aside', () => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), 'great-work-founder-view-'))
  const pages = path.join(wiki, 'pages')
  fs.mkdirSync(pages)
  const resource = (slug, title, tier, founderTier, provides) =>
    fs.writeFileSync(path.join(pages, slug), `# ${title}

**Type:** resource
**Status:** active
**Confidence:** high
**Tier:** ${tier}
**Founder-tier:** ${founderTier}
**Focus:** Useful work

## Summary

${title} is a thing. A second sentence of judgment.

## What It Provides

${provides}
`)
  resource('grant.md', 'Grant Office', 'D', 'A', 'Two million dollars and a named deadline.')
  resource('chamber.md', 'County Chamber', 'D', 'F', 'A directory and a ribbon cutting.')
  resource('clinic.md', 'Free Clinic', 'C', 'n/a', 'Primary care for uninsured residents.')

  try {
    execFileSync(process.execPath, [script], {
      env: { ...process.env, GREAT_WORK_WIKI: wiki },
      stdio: 'pipe',
    })
    const founder = fs.readFileSync(path.join(wiki, 'views', 'founder-resource-tier-list.md'), 'utf8')
    assert.match(founder, /\[How this is ranked\]\(\.\.\/meta\/founder-tiers\.md\)/)
    // Same impact tier, opposite ends of this ladder — the disagreement is the point.
    assert.match(founder, /## A — best general first move \(1\)[\s\S]*Grant Office/)
    assert.match(founder, /## F — a listing \(1\)[\s\S]*County Chamber/)
    assert.match(founder, /Two million dollars and a named deadline\./)
    // n/a is set aside, not ranked, and is excluded from the ranked count in the lede.
    assert.match(founder, /Utah's 2 founder resources ranked/)
    assert.match(founder, /## Not founder resources \(1\)[\s\S]*Free Clinic/)
    assert.doesNotMatch(founder, /## n\/a/)

    // The experimental ladder remains available directly but is not promoted from primary navigation.
    const tierList = fs.readFileSync(path.join(wiki, 'views', 'tier-list.md'), 'utf8')
    assert.doesNotMatch(tierList, /founder-resource-tier-list\.md/)
    const resources = fs.readFileSync(path.join(wiki, 'views', 'resources.md'), 'utf8')
    assert.doesNotMatch(resources, /founder-resource-tier-list\.md/)
    assert.doesNotMatch(fs.readFileSync(path.join(wiki, 'views', 'index.md'), 'utf8'), /founder-resource-tier-list\.md/)
  } finally {
    fs.rmSync(wiki, { recursive: true, force: true })
  }
})
