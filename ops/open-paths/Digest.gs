/**
 * Digests.
 *
 * weeklySignatoryDigest: emails the adult signatory the APPROVED submissions
 * ready to sign. They fill adult_signed_by and signed_at in the Submissions
 * tab, which moves each row to SIGNED (see onSheetEdit).
 *
 * monthlyTeamSummary: counts by status, the review backlog and the flags.
 */

function weeklySignatoryDigest() {
  const to = config_('signatory_email');
  if (!to) return;
  const ready = rows_('Submissions').filter(function (s) { return s.status === 'APPROVED'; });
  if (ready.length === 0) return;
  const lines = ready.map(function (s) {
    const event = eventById_(s.event_id);
    return '- ' + s.submission_id + ', ' + (event ? event.name : s.event_id) + ', ' + s.credited_hours + ' hours, reviewed by ' + (s.reviewer || 'not recorded');
  });
  const url = ss_().getUrl();
  MailApp.sendEmail(to, 'Open Paths: ' + ready.length + ' submissions ready to sign',
    'These approved submissions are ready for your signature. To sign one, fill adult_signed_by and signed_at on its row in the Submissions tab:\n' +
    url + '\n\n' + lines.join('\n') + '\n\nLetters are issued every Monday for signed rows.', { name: 'Vidora Foundation' });
}

function monthlyTeamSummary() {
  const to = config_('team_digest_recipients');
  if (!to) return;
  const subs = rows_('Submissions');
  const count = {};
  const flagCount = {};
  subs.forEach(function (s) {
    count[s.status] = (count[s.status] || 0) + 1;
    String(s.auto_flags || '').split(/,\s*/).filter(Boolean).forEach(function (f) { flagCount[f] = (flagCount[f] || 0) + 1; });
  });
  const backlog = subs.filter(function (s) { return ['SUBMITTED', 'AUTO_FLAGGED', 'IN_REVIEW', 'NEEDS_INFO'].indexOf(s.status) >= 0; }).length;
  const vols = rows_('Volunteers');
  const active = vols.filter(function (v) { return v.status === 'ACTIVE'; }).length;
  const pending = vols.filter(function (v) { return v.status === 'PENDING_CONSENT'; }).length;
  const certs = rows_('Certificates').length;
  const body = [
    'Volunteers: ' + active + ' active, ' + pending + ' waiting for parent consent.',
    'Review backlog: ' + backlog + '.',
    'Submissions by status: ' + Object.keys(count).map(function (k) { return k + ' ' + count[k]; }).join(', ') + '.',
    'Flags: ' + (Object.keys(flagCount).length ? Object.keys(flagCount).map(function (k) { return k + ' ' + flagCount[k]; }).join(', ') : 'none') + '.',
    'Certificates issued to date: ' + certs + '.',
    '',
    'Spreadsheet: ' + ss_().getUrl(),
  ].join('\n');
  MailApp.sendEmail(to, 'Open Paths monthly summary', body, { name: 'Vidora Foundation' });
}
