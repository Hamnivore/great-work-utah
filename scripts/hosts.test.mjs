// Tests for host classification, which decides two things the corpus depends on: whether a
// source page owes a captured copy of its document, and whether a page claiming to quote an
// organization is actually quoting somebody else.
//
// Both lists have already failed in production, in the same way — by being too small and
// silently so. The linter's copy of the mandated list was missing supremecourt.gov, so the
// Supreme Court's own website counted as a host nobody must preserve. These tests exist to
// make the boundaries explicit rather than incidental.
import test from 'node:test'
import assert from 'node:assert/strict'
import { isMandatedHost, isReferenceHost } from './lib/hosts.mjs'

test('issuing bodies and archives of record are mandated', () => {
  for (const url of [
    'https://www.sec.gov/Archives/edgar/data/352789/0000352789-95-000002.txt',
    'https://www.supremecourt.gov/opinions/boundvolumes/569bv.pdf',
    'https://www.uspto.gov/patents',
    'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/2918699',
    'https://doi.org/10.1103/PhysRevLett.100.101101',
    'https://www.federalregister.gov/documents/2024/01/01/example',
    'https://pubs.usgs.gov/of/2008/1155/',
    'https://npgallery.nps.gov/GetAsset/example',
    'https://le.utah.gov/xcode/Title63N/Chapter1.html',
    'https://data.sba.gov/dataset/example',
    'https://www.sbir.gov/awards/214122',
  ]) {
    assert.equal(isMandatedHost(url), true, url)
  }
})

test('state hosts are listed by record-keeping body, not by domain', () => {
  // The Legislature keeps the statutes, so le.utah.gov is mandated. utah.gov as a whole is
  // not: it carries agency marketing pages, and exempting those from capture would let a
  // .gov domain launder self-description as a permanent public record.
  assert.equal(isMandatedHost('https://le.utah.gov/~2024/bills/static/SB0001.html'), true)
  assert.equal(isMandatedHost('https://business.utah.gov/'), false)
  assert.equal(isMandatedHost('https://utah.gov/'), false)
})

test('convenience mirrors are not mandated, however reliable', () => {
  // The whole point of the two-class rule: these hosts are accurate and useful, and none of
  // them is obliged to keep a given URL alive. Each of the first three was found in the
  // corpus standing in for a permanent record.
  for (const url of [
    'http://edgar.secdatabase.com/1197/35278995000002/filing-main.htm',
    'https://supreme.justia.com/cases/federal/us/569/576/',
    'https://projects.propublica.org/nonprofits/api/v2/organizations/870530362.json',
    'https://www.law.cornell.edu/supremecourt/text/12-398',
    'https://example.com/press/announcement',
  ]) {
    assert.equal(isMandatedHost(url), false, url)
  }
})

test('a lookalike domain does not inherit the mandate', () => {
  // Suffix matching is anchored, so "sec.gov" must not match a host that merely ends in
  // those characters. This is the check that stops a hostile or careless URL from buying
  // an exemption from capture.
  assert.equal(isMandatedHost('https://notsec.gov/filing'), false)
  assert.equal(isMandatedHost('https://sec.gov.evil.example/filing'), false)
  assert.equal(isMandatedHost('https://irs.gov.co/filing'), false)
  // Subdomains of a mandated host do inherit it.
  assert.equal(isMandatedHost('https://www.sec.gov/x'), true)
  assert.equal(isMandatedHost('https://efts.sec.gov/LATEST/search-index'), true)
})

test('encyclopedias and directories never speak for the subject', () => {
  for (const url of [
    'https://en.wikipedia.org/wiki/Utah_Data_Center',
    'https://www.crunchbase.com/organization/example',
    'https://www.linkedin.com/company/example',
    'https://www.dnb.com/business-directory/example.html',
  ]) {
    assert.equal(isReferenceHost(url), true, url)
  }
})

test("an organization's own site is not a reference host", () => {
  for (const url of ['https://fervoenergy.com/', 'https://www.nsa.gov/', 'https://struvia.co/']) {
    assert.equal(isReferenceHost(url), false, url)
  }
})

test('garbage in does not throw, and does not earn an exemption', () => {
  // Called on whatever a page happens to carry in **URL:**, including nothing.
  for (const value of ['', 'not a url', null, undefined, 'mailto:someone@example.com']) {
    assert.equal(isMandatedHost(value), false, String(value))
    assert.equal(isReferenceHost(value), false, String(value))
  }
})
