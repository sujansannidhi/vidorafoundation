/**
 * Hours letters. issueLetters() runs weekly (and from the Open Paths menu).
 *
 * It takes SIGNED submissions in batches of 25 to stay under Apps Script's
 * six-minute limit, groups them by volunteer, fills the Docs template, saves
 * a PDF in the restricted folder, emails it to the volunteer and their parent
 * or guardian, writes the Certificates row, and marks the submissions
 * LETTER_ISSUED. Wording follows letterContents and sampleLetter in
 * src/content/volunteer.ts. No QR codes and no third-party services.
 */

const LETTER_BATCH = 25;

function issueLetters() {
  const signed = rows_('Submissions').filter(function (s) { return s.status === 'SIGNED'; }).slice(0, LETTER_BATCH);
  if (signed.length === 0) return;
  const byVolunteer = {};
  signed.forEach(function (s) { (byVolunteer[s.volunteer_id] = byVolunteer[s.volunteer_id] || []).push(s); });
  Object.keys(byVolunteer).forEach(function (volunteerId) {
    const v = find_('Volunteers', function (r) { return r.volunteer_id === volunteerId; });
    if (v) issueLetterFor_(v, byVolunteer[volunteerId]);
  });
}

function issueLetterFor_(v, subs) {
  const id = nextId_('certificate');
  const verifyLink = 'vidorafoundation.org/verify?id=' + id;
  const activities = subs.map(function (s) {
    const event = eventById_(s.event_id);
    return { event: event ? event.name : s.event_id, dates: datesOf_(s), hours: Number(s.credited_hours) };
  });
  const hours = activities.reduce(function (sum, a) { return sum + a.hours; }, 0);
  const dates = subs.map(function (s) { return new Date(s.submitted_at); }).sort(function (a, b) { return a - b; });
  const tz = Session.getScriptTimeZone();
  const fmt = function (d) { return Utilities.formatDate(d, tz, 'MMMM d, yyyy'); };
  const signedAt = subs.map(function (s) { return s.signed_at ? new Date(s.signed_at) : null; }).filter(Boolean).sort(function (a, b) { return b - a; })[0] || new Date();

  const values = {
    certificate_id: id,
    verify_link: verifyLink,
    date_signed: fmt(signedAt),
    full_name: v.first_name + ' ' + v.last_name,
    grade: ordinal_(v.grade),
    school: v.school, city: v.city, state: v.state,
    hours: hours,
    start_date: fmt(dates[0]),
    end_date: fmt(dates[dates.length - 1]),
    activities: activities.map(function (a) {
      return a.event + ', ' + (a.dates || 'see submission') + ', ' + a.hours + ' hours';
    }).join('\n'),
    status_line: SITE_COPY.letterStatusLine,
    pvsa_line: SITE_COPY.pvsaShort,
    signatory_name: config_('signatory_name'),
    signatory_title: config_('signatory_title'),
    signatory_email: config_('signatory_email'),
    signatory_phone: config_('signatory_phone'),
  };

  const folder = DriveApp.getFolderById(prop_(PROP.folderId));
  const copy = DriveApp.getFileById(prop_(PROP.templateId)).makeCopy(id + ' ' + v.last_name, folder);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  Object.keys(values).forEach(function (k) { body.replaceText('\\{\\{' + k + '\\}\\}', String(values[k])); });
  doc.saveAndClose();
  const pdf = folder.createFile(copy.getAs(MimeType.PDF).setName(id + '.pdf'));
  copy.setTrashed(true);

  append_('Certificates', {
    certificate_id: id,
    submission_ids: subs.map(function (s) { return s.submission_id; }).join(', '),
    volunteer_id: v.volunteer_id,
    hours: hours,
    activities: JSON.stringify(activities),
    pdf_file_id: pdf.getId(),
    issued_at: nowIso_(),
    status: 'VALID',
  });
  subs.forEach(function (s) { update_('Submissions', s._row, { status: 'LETTER_ISSUED' }); });

  send_(v.email, 'email_letter_subject', 'email_letter_body', {
    first_name: v.first_name, hours: hours, certificate_id: id,
    verify_link: 'https://www.' + verifyLink, counselor_note: SITE_COPY.counselorNote,
  }, { cc: v.parent_email, attachments: [pdf.getAs(MimeType.PDF)] });
}

function ordinal_(n) {
  const x = Number(n);
  const s = { 1: 'st', 2: 'nd', 3: 'rd' }[x % 100 >= 11 && x % 100 <= 13 ? 0 : x % 10] || 'th';
  return x + s;
}

/** Revokes a certificate. /verify then shows it as revoked. */
function revokeCertificate(certificateId) {
  const c = find_('Certificates', function (r) { return r.certificate_id === certificateId; });
  if (!c) throw new Error('No such certificate.');
  update_('Certificates', c._row, { status: 'REVOKED' });
}
