/**
 * The web app. Deploy it as "Execute as: me" and "Who has access: Anyone",
 * then run setWebAppUrl() so emails link to it.
 *
 *   ?action=consent&token=...      a parent confirms registration
 *   ?id=<CERTIFICATE_ID>&format=json   verify, JSON (used by /verify with JavaScript)
 *   ?id=<CERTIFICATE_ID>               verify, a plain HTML page (JavaScript off)
 *
 * The verify contract is defined in src/content/volunteer.ts. Only the
 * volunteer's first name and last initial are ever returned.
 */

function doGet(e) {
  const q = (e && e.parameter) || {};
  if (q.action === 'consent') return consentPage_(q.token);
  const result = verifyResponse_(q.id, lookupCertificate_);
  if (q.format === 'json') {
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutput(verifyHtml_(result)).setTitle('Verify an hours letter').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function lookupCertificate_(id) {
  const c = find_('Certificates', function (r) { return String(r.certificate_id).toUpperCase() === id; });
  if (!c) return null;
  const v = find_('Volunteers', function (r) { return r.volunteer_id === c.volunteer_id; });
  return { certificate: c, volunteer: v ? { first_name: v.first_name, last_name: v.last_name } : null };
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

const PAGE_STYLE = '<style>body{font-family:Georgia,serif;max-width:40rem;margin:3rem auto;padding:0 1.25rem;line-height:1.6;color:#102a43;background:#faf7f2}h1{font-weight:400}p.s{font-size:1.4rem;font-weight:700}small{color:#486581}</style>';

function verifyHtml_(r) {
  const contact = esc_(config_('contact_email', 'sujan@vidorafoundation.org'));
  let body;
  if (r.status === 'INVALID') {
    body = '<p>That does not look like a Certificate ID. It has the form OP-2611-0042-K7QD.</p>';
  } else if (r.status === 'NOT_FOUND') {
    body = '<p>No certificate matches ' + esc_(r.id) + '. Check it against the letter, or email ' + contact + '.</p>';
  } else {
    body = '<p class="s">' + (r.status === 'VALID' ? 'Valid' : 'Revoked') + '</p>' +
      (r.status === 'REVOKED' ? '<p>This certificate has been revoked and should not be relied on.</p>' : '') +
      '<p>' + esc_(r.volunteer) + ', ' + esc_(r.hours) + ' hours, issued ' + esc_(r.issuedOn) + '. Certificate ' + esc_(r.id) + '.</p>' +
      '<ul>' + r.activities.map(function (a) { return '<li>' + esc_(a.event) + ', ' + esc_(a.dates) + ', ' + esc_(a.hours) + ' hours</li>'; }).join('') + '</ul>';
  }
  return PAGE_STYLE + '<h1>Verify an hours letter</h1>' + body +
    '<p><small>Vidora Foundation, Open Paths. Questions: ' + contact + '</small></p>';
}

function consentPage_(token) {
  const result = token ? confirmConsent_(String(token)) : { ok: false, reason: 'This link is missing its code.' };
  const body = result.ok
    ? '<p>Thank you. ' + esc_(result.firstName) + '’s Open Paths account is now active, and they have been emailed their volunteer ID.</p>'
    : '<p>' + esc_(result.reason) + '</p>';
  return HtmlService.createHtmlOutput(PAGE_STYLE + '<h1>Open Paths registration</h1>' + body)
    .setTitle('Open Paths registration').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
