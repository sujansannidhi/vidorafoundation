/**
 * selfTest(): run from the Apps Script editor after setupOpenPaths().
 *
 * Part one, pureTests_, checks ID formats, the credit for every event, every
 * cap and flag, and the verify responses, with fake data only. The same
 * function runs in Node (test/local.test.mjs).
 *
 * Part two runs against a throwaway copy of the spreadsheet: it writes a fake
 * volunteer and certificate and checks the verify lookup end to end, then
 * trashes the copy. No real student data is used or kept.
 */

function selfTest() {
  const results = [];
  const assert = function (cond, label) { results.push((cond ? 'PASS ' : 'FAIL ') + label); };
  pureTests_(assert);

  const original = prop_(PROP.spreadsheetId);
  if (original) {
    const copy = DriveApp.getFileById(original).makeCopy('Open Paths selfTest (delete me)');
    SPREADSHEET_OVERRIDE_ID = copy.getId();
    try {
      ['Volunteers', 'Certificates', 'Submissions'].forEach(function (t) {
        const sh = sheet_(t);
        if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
      });
      append_('Volunteers', { volunteer_id: 'VOL-999999', first_name: 'Test', last_name: 'Person', email: 'test@example.com', status: 'ACTIVE' });
      append_('Certificates', {
        certificate_id: 'OP-2611-0001-TEST', submission_ids: 'SUB-2611-0001', volunteer_id: 'VOL-999999', hours: 3,
        activities: JSON.stringify([{ event: 'Field Notes Article', dates: '2026-11-20', hours: 3 }]),
        issued_at: '2026-12-14T12:00:00Z', status: 'VALID',
      });
      const r = verifyResponse_('op-2611-0001-test', lookupCertificate_);
      assert(r.status === 'VALID' && r.volunteer === 'Test P.' && r.hours === 3 && r.issuedOn === '2026-12-14', 'sheet: verify finds a valid certificate, first name and last initial only');
      assert(!('school' in r) && JSON.stringify(r).indexOf('Person') < 0, 'sheet: verify never returns a full name or school');
      assert(verifyResponse_('OP-2611-0002-NONE', lookupCertificate_).status === 'NOT_FOUND', 'sheet: unknown certificate is NOT_FOUND');
      const html = verifyHtml_(r);
      assert(html.indexOf('Valid') >= 0 && html.indexOf('Test P.') >= 0, 'sheet: verify HTML page renders');
    } finally {
      SPREADSHEET_OVERRIDE_ID = null;
      copy.setTrashed(true);
    }
  } else {
    results.push('SKIP sheet tests: run setupOpenPaths() first');
  }

  Logger.log(results.join('\n'));
  const failed = results.filter(function (l) { return l.indexOf('FAIL') === 0; }).length;
  Logger.log(failed ? failed + ' FAILED' : 'All tests passed');
  return failed;
}

/** Tests that need no Google services. */
function pureTests_(assert) {
  // ---- ID formats
  assert(formatId_('volunteer', 123) === 'VOL-000123', 'id: volunteer');
  assert(formatId_('drop', 0, '2611') === 'DROP-2611', 'id: drop');
  assert(formatId_('signup', 1, '2611') === 'SGN-2611-0001', 'id: signup');
  assert(formatId_('partner', 42) === 'PTR-0042', 'id: partner');
  assert(formatId_('submission', 42, '2611') === 'SUB-2611-0042', 'id: submission');
  const cert = formatId_('certificate', 42, '2611', 'K7QD');
  assert(cert === 'OP-2611-0042-K7QD' && CERTIFICATE_ID_PATTERN.test(cert), 'id: certificate matches the site pattern');
  const suffix = randomSuffix_(4);
  assert(suffix.length === 4 && suffix.split('').every(function (c) { return CERTIFICATE_SUFFIX_ALPHABET.indexOf(c) >= 0; }), 'id: certificate suffix uses the alphabet');

  // ---- Credits for every event
  const ev = function (id) { return eventById_(id); };
  assert(creditFor_(ev('EVT-ARTICLE')) === 3, 'credit: article 3');
  assert(creditFor_(ev('EVT-STUDY')) === 2, 'credit: study guide 2');
  assert(creditFor_(ev('EVT-STORY')) === 1.5, 'credit: story time 1.5');
  assert(creditFor_(ev('EVT-BOOKS'), 24) === 0, 'credit: books below the first band');
  assert(creditFor_(ev('EVT-BOOKS'), 25) === 4 && creditFor_(ev('EVT-BOOKS'), 74) === 4, 'credit: books 25 to 74 = 4');
  assert(creditFor_(ev('EVT-BOOKS'), 75) === 6 && creditFor_(ev('EVT-BOOKS'), 149) === 6, 'credit: books 75 to 149 = 6');
  assert(creditFor_(ev('EVT-BOOKS'), 150) === 8 && creditFor_(ev('EVT-BOOKS'), 900) === 8, 'credit: books 150+ = 8');
  assert(creditFor_(ev('EVT-KITS'), 10) === 4 && creditFor_(ev('EVT-KITS'), 25) === 6 && creditFor_(ev('EVT-KITS'), 50) === 8, 'credit: kits bands');
  assert(creditFor_(ev('EVT-AMB'), '', 'present') === 1 && creditFor_(ev('EVT-AMB'), '', 'chapter') === 2, 'credit: ambassador tasks');
  assert(creditFor_(ev('EVT-AMB'), '', 'nope') === 0, 'credit: unknown task is 0');
  assert(EVENTS.every(function (e) {
    const c = e.credit;
    const max = c.kind === 'fixed' ? c.hours : c.kind === 'bands' ? c.bands[c.bands.length - 1].hours : Math.max.apply(null, c.tasks.map(function (t) { return t.hours; }));
    return max <= CAPS.maxHoursPerSubmission;
  }), 'credit: no submission earns more than 8 hours');

  // ---- Flags
  const nov = function (day) { return '2026-11-' + (day < 10 ? '0' + day : day) + 'T15:00:00Z'; };
  const base = function (over) {
    const sub = { volunteer_id: 'VOL-000001', event_id: 'EVT-ARTICLE', task_id: '', partner_id: '', quantity: '', evidence_links: 'https://docs.google.com/document/d/new', dates: '2026-11-20', submitted_at: nov(20) };
    Object.keys(over.submission || {}).forEach(function (k) { sub[k] = over.submission[k]; });
    return {
      submission: sub,
      volunteer: over.volunteer === undefined ? { status: 'ACTIVE' } : over.volunteer,
      partner: over.partner || null,
      earlier: over.earlier || [],
      allEvidence: over.allEvidence || [],
      hours: over.hours === undefined ? 3 : over.hours,
    };
  };
  const has = function (ctx, flag) { return computeFlags_(ctx).indexOf(flag) >= 0; };
  assert(computeFlags_(base({})).length === 0, 'flags: a clean article has none');
  assert(has(base({ volunteer: { status: 'PENDING_CONSENT' } }), 'NOT_ACTIVE'), 'flags: NOT_ACTIVE');
  assert(has(base({ volunteer: null }), 'NOT_ACTIVE'), 'flags: unknown volunteer is NOT_ACTIVE');
  assert(has(base({ earlier: [{ event_id: 'EVT-ARTICLE', task_id: '', dates: '2026-11-20', submitted_at: nov(21), credited_hours: 3, status: 'SUBMITTED' }] }), 'DUPLICATE'), 'flags: DUPLICATE');
  assert(has(base({ earlier: [{ event_id: 'EVT-ARTICLE', dates: '2026-11-02', submitted_at: nov(2), credited_hours: 3, status: 'APPROVED' }] }), 'OVER_EVENT_CAP'), 'flags: article over one a month');
  assert(!has(base({ earlier: [{ event_id: 'EVT-ARTICLE', dates: '2026-11-02', submitted_at: nov(2), credited_hours: 3, status: 'REJECTED' }] }), 'OVER_EVENT_CAP'), 'flags: rejected work does not count');
  assert(has(base({ submission: { submitted_at: '2027-03-10T15:00:00Z' }, earlier: [
    { event_id: 'EVT-ARTICLE', dates: 'a', submitted_at: '2026-09-10T15:00:00Z', credited_hours: 3, status: 'LETTER_ISSUED' },
    { event_id: 'EVT-ARTICLE', dates: 'b', submitted_at: '2026-10-10T15:00:00Z', credited_hours: 3, status: 'LETTER_ISSUED' },
    { event_id: 'EVT-ARTICLE', dates: 'c', submitted_at: '2026-12-10T15:00:00Z', credited_hours: 3, status: 'LETTER_ISSUED' },
  ] }), 'OVER_EVENT_CAP'), 'flags: article over three a school year');
  const drive = function (over) {
    return base({ submission: Object.assign({ event_id: 'EVT-BOOKS', partner_id: 'PTR-0001', quantity: 80 }, over.submission || {}), partner: over.partner === undefined ? { confirmed_at: nov(1), volunteer_id: 'VOL-000001' } : over.partner, earlier: over.earlier, hours: 6 });
  };
  assert(computeFlags_(drive({})).length === 0, 'flags: a clean book drive has none');
  assert(has(drive({ earlier: [{ event_id: 'EVT-BOOKS', dates: 'x', submitted_at: '2026-10-01T15:00:00Z', credited_hours: 4, status: 'APPROVED' }] }), 'OVER_EVENT_CAP'), 'flags: book drive within 60 days');
  assert(!has(drive({ earlier: [{ event_id: 'EVT-BOOKS', dates: 'x', submitted_at: '2026-09-01T15:00:00Z', credited_hours: 4, status: 'APPROVED' }] }), 'OVER_EVENT_CAP'), 'flags: book drive after 60 days is fine');
  assert(has(drive({ partner: null }), 'PARTNER_MISSING'), 'flags: PARTNER_MISSING');
  assert(has(drive({ partner: { confirmed_at: '', volunteer_id: 'VOL-000001' } }), 'PARTNER_UNCONFIRMED'), 'flags: PARTNER_UNCONFIRMED');
  assert(has(drive({ partner: { confirmed_at: nov(1), volunteer_id: 'VOL-000777' } }), 'PARTNER_UNCONFIRMED'), 'flags: partner confirmed for someone else');
  assert(has(drive({ submission: { quantity: 10 } }), 'QUANTITY_OUT_OF_RANGE'), 'flags: too few books');
  assert(has(drive({ submission: { quantity: 5000 } }), 'QUANTITY_OUT_OF_RANGE'), 'flags: implausibly many books');
  assert(has(base({ allEvidence: ['https://docs.google.com/document/d/NEW'] }), 'EVIDENCE_REUSED'), 'flags: EVIDENCE_REUSED');
  const monthFull = [
    { event_id: 'EVT-BOOKS', dates: 'm1', submitted_at: nov(3), credited_hours: 8, status: 'APPROVED' },
    { event_id: 'EVT-STORY', dates: 'm2', submitted_at: nov(5), credited_hours: 1.5, status: 'APPROVED' },
  ];
  assert(has(base({ earlier: monthFull }), 'OVER_MONTH_CAP'), 'flags: OVER_MONTH_CAP at 12 hours');
  const yearFull = [];
  for (let m = 0; m < 7; m++) yearFull.push({ event_id: 'EVT-KITS', dates: 'y' + m, submitted_at: new Date(Date.UTC(2026, 7 + m, 2, 15)).toISOString(), credited_hours: 8, status: 'LETTER_ISSUED' });
  for (let m = 0; m < 5; m++) yearFull.push({ event_id: 'EVT-STUDY', dates: 'z' + m, submitted_at: new Date(Date.UTC(2026, 7 + m, 4, 15)).toISOString(), credited_hours: 2, status: 'LETTER_ISSUED' });
  assert(has(base({ submission: { submitted_at: '2027-02-20T15:00:00Z' }, earlier: yearFull, hours: 3 }), 'OVER_YEAR_CAP'), 'flags: OVER_YEAR_CAP past 60 hours (66 earlier plus 3)');
  assert(!has(base({ submission: { submitted_at: '2027-08-20T15:00:00Z' }, earlier: yearFull, hours: 3 }), 'OVER_YEAR_CAP'), 'flags: a new school year starts on August 1');
  const amb = base({ submission: { event_id: 'EVT-AMB', task_id: 'chapter' }, hours: 2, earlier: [
    { event_id: 'EVT-AMB', task_id: 'present', dates: 'p', submitted_at: nov(2), credited_hours: 1, status: 'APPROVED' },
    { event_id: 'EVT-AMB', task_id: 'chapter', dates: 'q', submitted_at: nov(4), credited_hours: 2, status: 'APPROVED' },
    { event_id: 'EVT-AMB', task_id: 'partner', dates: 'r', submitted_at: nov(6), credited_hours: 1, status: 'APPROVED' },
    { event_id: 'EVT-AMB', task_id: 'referrals', dates: 's', submitted_at: nov(8), credited_hours: 1, status: 'APPROVED' },
  ] });
  assert(has(amb, 'OVER_EVENT_CAP'), 'flags: ambassador over six hours a month (5 earlier plus 2)');
  assert(has(base({ submission: { event_id: 'EVT-AMB', task_id: 'nope' }, hours: 0 }), 'QUANTITY_OUT_OF_RANGE'), 'flags: unknown ambassador task');

  // ---- Verify responses
  const fakeLookup = function (id) {
    if (id === 'OP-2611-0042-K7QD') return { certificate: { status: 'VALID', hours: 6, issued_at: '2026-12-14T12:00:00Z', activities: '[{"event":"Local Book Drive","dates":"2026-11-16 to 2026-11-29","hours":6}]' }, volunteer: { first_name: 'Maya', last_name: 'Rao' } };
    if (id === 'OP-2611-0043-ABCD') return { certificate: { status: 'REVOKED', hours: 3, issued_at: '2026-12-14T12:00:00Z', activities: '[]' }, volunteer: { first_name: 'Sam', last_name: 'Lee' } };
    return null;
  };
  const ok = verifyResponse_(' op-2611-0042-k7qd ', fakeLookup);
  assert(ok.status === 'VALID' && ok.id === 'OP-2611-0042-K7QD' && ok.volunteer === 'Maya R.' && ok.hours === 6 && ok.issuedOn === '2026-12-14' && ok.activities.length === 1, 'verify: VALID with the contract fields');
  assert(verifyResponse_('OP-2611-0043-ABCD', fakeLookup).status === 'REVOKED', 'verify: REVOKED');
  const nf = verifyResponse_('OP-2611-0099-ZZZZ', fakeLookup);
  assert(nf.status === 'NOT_FOUND' && Object.keys(nf).length === 2, 'verify: NOT_FOUND has only id and status');
  const inv = verifyResponse_('hello', fakeLookup);
  assert(inv.status === 'INVALID' && Object.keys(inv).length === 2, 'verify: INVALID has only id and status');
  assert(publicName_('Maya', 'rao') === 'Maya R.', 'verify: first name and last initial');
}
