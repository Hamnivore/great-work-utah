import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('./build-views.mjs', import.meta.url))

const page = ({ title, roles, needs, region = '', careers = '', website = '', reviewed = '' }) => `# ${title}

**Type:** venture
**Status:** active
**Confidence:** high
**Focus:** Useful work
**Domain:** computing
${region ? `**Region:** ${region}\n` : ''}${careers ? `**Careers:** ${careers}\n` : ''}${website ? `**Website:** ${website}\n` : ''}${roles ? `**Roles:** ${roles}\n` : ''}${reviewed ? `**Needs-reviewed:** ${reviewed}\n` : ''}
## Summary

A useful organization.

${needs ? `## What They Need Now\n\n${needs}\n` : ''}`

test('generates populated role views with useful lead context and navigation', () => {
  const wiki = fs.mkdtempSync(path.join(os.tmpdir(), 'great-work-role-views-'))
  const pages = path.join(wiki, 'pages')
  fs.mkdirSync(pages)
  fs.writeFileSync(path.join(pages, 'alpha.md'), page({
    title: 'Alpha',
    roles: 'software-engineering, data-science',
    needs: 'Backend programmers and data scientists to ship the platform.',
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
