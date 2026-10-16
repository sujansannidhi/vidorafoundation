/**
 * Form submission handlers (installable triggers created by installTriggers),
 * reviewer edits in the Sheet, and the partner reminder job.
 *
 * Nothing personal is written to logs.
 */

/** Answers of a form response, keyed by question title. */
function answers_(e) {
  const out = {};
  e.response.getItemResponses().forEach(function (ir) {
    const v = ir.getResponse();
    out[ir.getItem().getTitle()] = Array.isArray(v) ? v.join(', ') : String(v == null ? '' : v).trim();
  });
  return out;
}

function send_(to, subjectKey, bodyKey, values, opts) {
  if (!to) return;
  const o = opts || {};
  const options = { name: 'Vidora Foundation', replyTo: config_('contact_email', 'sujan@vidorafoundation.org') };
  if (o.cc) options.cc = o.cc;
  if (o.attachments) options.attachments = o.attachments;
  MailApp.sendEmail(to, fill_(config_(subjectKey), values), fill_(config_(bodyKey), values), options);
}

function volunteerByIdOrEmail_(key) {
  const k = String(key || '').trim().toLowerCase();
  return find_('Volunteers', function (r) {
    return String(r.volunteer_id).toLowerCase() === k || String(r.email).toLowerCase() === k;
  });
}

/* ---------------- F1 Registration ---------------- */

function onRegister(e) {
  const a = answers_(e);
  const existing = volunteerByIdOrEmail_(a[Q.email]);
  if (existing && existing.status !== 'WITHDRAWN') return;
  const token = Utilities.getUuid().replace(/-/g, '');
  const expires = new Date(Date.now() + 14 * 86400000).toISOString();
  const id = nextId_('volunteer');
  append_('Volunteers', {
    volunteer_id: id,
    created_at: nowIso_(),
    first_name: a[Q.firstName], last_name: a[Q.lastName], email: a[Q.email], grade: a[Q.grade],
    school: a[Q.school], city: a[Q.city], state: a[Q.state],
    parent_name: a[Q.parentName], parent_email: a[Q.parentEmail],
    consent_token: token, consent_token_expires: expires,
    media_consent: a[Q.media] ? 'YES' : 'NO',
    referral_code: id, referred_by: a[Q.referral] || '',
    status: 'PENDING_CONSENT',
  });
  send_(a[Q.parentEmail], 'email_consent_subject', 'email_consent_body', {
    first_name: a[Q.firstName], parent_name: a[Q.parentName],
    consent_link: webAppUrl_() + '?action=consent&token=' + token,
  });
}

/** Called by the web app when a parent opens their consent link. */
function confirmConsent_(token) {
  const v = find_('Volunteers', function (r) { return r.consent_token && r.consent_token === token; });
  if (!v) return { ok: false, reason: 'This link is not valid, or has already been used.' };
  if (new Date(v.consent_token_expires) < new Date()) return { ok: false, reason: 'This link has expired. Ask your child to register again.' };
  const changes = { parent_consent_at: nowIso_(), status: 'ACTIVE', consent_token: '', consent_token_expires: '' };
  if (v.media_consent === 'YES') changes.media_parent_consent_at = nowIso_();
  update_('Volunteers', v._row, changes);
  send_(v.email, 'email_active_subject', 'email_active_body', {
    first_name: v.first_name, volunteer_id: v.volunteer_id, counselor_note: SITE_COPY.counselorNote,
  }, { cc: v.parent_email });
  return { ok: true, firstName: v.first_name };
}

/* ---------------- F2 Sign-up ---------------- */

function currentDrop_() {
  const id = config_('current_drop_id');
  const now = new Date();
  return find_('Drops', function (d) {
    if (id) return d.drop_id === id;
    return new Date(d.open_at) <= now && now <= new Date(d.close_at);
  });
}

function onSignup(e) {
  const a = answers_(e);
  const v = volunteerByIdOrEmail_(a[Q.volunteer]);
  const event = eventById_(a[Q.event]);
  const drop = currentDrop_();
  const reject = function (reason) {
    send_(v ? v.email : '', 'email_signup_rejected_subject', 'email_signup_rejected_body', { reason: reason });
  };
  if (!v) return;
  if (v.status !== 'ACTIVE') return reject('your account is not active yet. Your parent or guardian needs to confirm by email first.');
  if (!event) return reject('that event was not recognised.');
  if (!drop || new Date(drop.close_at) < new Date()) return reject('there is no open Drop right now. The next one opens on the 1st of next month.');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const fresh = find_('Drops', function (d) { return d.drop_id === drop.drop_id; });
    if (Number(fresh.slots_used) >= Number(fresh.slot_cap)) return reject('this month’s Drop is full. The next one opens on the 1st of next month.');
    const signupId = nextId_('signup');
    append_('Signups', {
      signup_id: signupId, volunteer_id: v.volunteer_id, event_id: event.id, drop_id: drop.drop_id,
      created_at: nowIso_(), co_volunteer_ids: a[Q.coVolunteers] || '', status: 'SIGNED_UP',
    });
    update_('Drops', fresh._row, { slots_used: Number(fresh.slots_used) + 1 });
    send_(v.email, 'email_signup_subject', 'email_signup_body', {
      first_name: v.first_name, event_name: event.name, signup_id: signupId, event_slug: event.slug,
      steps: event.steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n'),
      proof: event.proof.map(function (s) { return '- ' + s; }).join('\n'),
      counselor_note: SITE_COPY.counselorNote,
    });
    if (Number(fresh.slots_used) + 1 >= Number(fresh.slot_cap)) syncSignupForm();
  } finally {
    lock.releaseLock();
  }
}

/** Opens F2 when the current Drop has places, closes it when it is full or over. */
function syncSignupForm() {
  const form = FormApp.openById(prop_(PROP.formSignup));
  const d = currentDrop_();
  const open = !!d && new Date(d.close_at) >= new Date() && Number(d.slots_used) < Number(d.slot_cap);
  form.setAcceptingResponses(open);
  if (!open) form.setCustomClosedFormMessage('This month’s Drop is full or closed. The next one opens on the 1st of next month.');
}

/* ---------------- F3 Partner Confirmation ---------------- */

function onPartnerConfirm(e) {
  const a = answers_(e);
  const v = volunteerByIdOrEmail_(a[Q.volunteerNameOrId]);
  const partnerId = nextId_('partner');
  append_('Partners', {
    partner_id: partnerId, org_name: a[Q.orgName], org_type: a[Q.orgType], city: a[Q.city], state: a[Q.state],
    contact_name: a[Q.contactName], contact_title: a[Q.contactTitle], contact_email: a[Q.contactEmail],
    accepts: a[Q.accepts], volunteer_id: v ? v.volunteer_id : '', confirmed_at: nowIso_(),
  });
  const completion = FormApp.openById(prop_(PROP.formPartnerComplete)).getPublishedUrl();
  send_(a[Q.contactEmail], 'email_partner_subject', 'email_partner_body', {
    contact_name: a[Q.contactName], org_name: a[Q.orgName], partner_id: partnerId, completion_link: completion,
  });
  if (v) {
    MailApp.sendEmail(v.email, 'Your Partner Confirmation ID: ' + partnerId,
      'Hi ' + v.first_name + ',\n\n' + a[Q.orgName] + ' has confirmed. Your Partner Confirmation ID is ' + partnerId +
      '. Include it when you submit your proof.\n\nVidora Foundation', { name: 'Vidora Foundation' });
  }
}

/* ---------------- F4 Hours Submission ---------------- */

/**
 * The Submissions tab has no dates column (its columns are fixed for Phase 2),
 * so the dates of the work are stored at the start of the reflection as
 * "[dates] reflection". This reads them back for the duplicate check.
 */
function datesOf_(row) {
  const m = String(row.reflection || '').match(/^\[([^\]]*)\]/);
  return m ? m[1] : '';
}

function onSubmission(e) {
  const a = answers_(e);
  const v = volunteerByIdOrEmail_(a[Q.volunteerId]);
  const event = eventById_(a[Q.event]);
  if (!event) return;
  const task = a[Q.task] && a[Q.task] !== 'None' ? a[Q.task] : '';
  const quantity = a[Q.quantity] ? Number(String(a[Q.quantity]).replace(/[^\d.]/g, '')) : '';
  const hours = creditFor_(event, quantity, task);
  const partner = a[Q.partnerId] ? find_('Partners', function (p) { return p.partner_id === a[Q.partnerId].toUpperCase(); }) : null;
  const all = rows_('Submissions');
  const earlier = v ? all.filter(function (r) { return r.volunteer_id === v.volunteer_id; }) : [];
  const allEvidence = [];
  all.forEach(function (r) { splitLinks_(r.evidence_links).forEach(function (l) { allEvidence.push(l); }); });
  const submission = {
    volunteer_id: v ? v.volunteer_id : String(a[Q.volunteerId]), event_id: event.id, task_id: task,
    partner_id: partner ? partner.partner_id : (a[Q.partnerId] || ''), quantity: quantity,
    evidence_links: a[Q.evidence], dates: a[Q.dates], submitted_at: nowIso_(),
  };
  const flags = computeFlags_({
    submission: submission, volunteer: v, partner: partner, earlier: earlier.map(function (r) {
      return { event_id: r.event_id, task_id: r.task_id, submitted_at: r.submitted_at, credited_hours: r.credited_hours, status: r.status, dates: datesOf_(r) };
    }), allEvidence: allEvidence, hours: hours,
  });
  const id = nextId_('submission');
  append_('Submissions', {
    submission_id: id, volunteer_id: submission.volunteer_id, signup_id: a[Q.signupId], event_id: event.id,
    task_id: task, partner_id: submission.partner_id, quantity: quantity, evidence_links: a[Q.evidence],
    reflection: '[' + a[Q.dates] + '] ' + a[Q.reflection], post_url: a[Q.postUrl] || '',
    submitted_at: submission.submitted_at, auto_flags: flags.join(', '),
    status: flags.length ? 'AUTO_FLAGGED' : 'SUBMITTED', credited_hours: hours,
  });
  if (v) send_(v.email, 'email_received_subject', 'email_received_body', { first_name: v.first_name, submission_id: id, event_name: event.name });
}

/* ---------------- F5 Partner Completion ---------------- */

function onPartnerComplete(e) {
  const a = answers_(e);
  const p = find_('Partners', function (r) { return r.partner_id === String(a[Q.partnerId]).toUpperCase(); });
  if (!p) return;
  update_('Partners', p._row, { completed_at: nowIso_(), quantity_received: a[Q.received] });
  // A submission held for this partner can now be reviewed.
  rows_('Submissions').forEach(function (s) {
    if (s.partner_id === p.partner_id && s.status === 'AUTO_FLAGGED' && /PARTNER_UNCONFIRMED/.test(s.auto_flags)) {
      const rest = String(s.auto_flags).split(/,\s*/).filter(function (f) { return f && f !== 'PARTNER_UNCONFIRMED'; });
      update_('Submissions', s._row, { auto_flags: rest.join(', '), status: rest.length ? 'AUTO_FLAGGED' : 'SUBMITTED' });
    }
  });
}

/* ---------------- Reviewer edits ---------------- */

/**
 * Reviewers change `status` in the Submissions tab. Approvals, requests for
 * more information and rejections email the volunteer (parents copied on
 * approvals). When the signatory fills adult_signed_by and signed_at on an
 * APPROVED row, it moves to SIGNED.
 */
function onSheetEdit(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== 'Submissions' || e.range.getRow() < 2) return;
  const head = TABS.Submissions;
  const col = head[e.range.getColumn() - 1];
  const row = rows_('Submissions').filter(function (r) { return r._row === e.range.getRow(); })[0];
  if (!row) return;
  const v = find_('Volunteers', function (x) { return x.volunteer_id === row.volunteer_id; });
  const event = eventById_(row.event_id);
  const values = {
    first_name: v ? v.first_name : '', submission_id: row.submission_id, event_name: event ? event.name : row.event_id,
    hours: row.credited_hours, reason: row.reason_code || '', counselor_note: SITE_COPY.counselorNote,
  };
  if (col === 'status') {
    if (!row.reviewed_at) update_('Submissions', row._row, { reviewed_at: nowIso_() });
    if (!v) return;
    if (row.status === 'APPROVED') send_(v.email, 'email_approved_subject', 'email_approved_body', values, { cc: v.parent_email });
    if (row.status === 'NEEDS_INFO') send_(v.email, 'email_needs_info_subject', 'email_needs_info_body', values);
    if (row.status === 'REJECTED') send_(v.email, 'email_rejected_subject', 'email_rejected_body', values, { cc: v.parent_email });
  }
  if ((col === 'adult_signed_by' || col === 'signed_at') && row.status === 'APPROVED' && row.adult_signed_by && row.signed_at) {
    update_('Submissions', row._row, { status: 'SIGNED' });
  }
}

/* ---------------- Partner reminders ---------------- */

/**
 * Local events need the partner's completion. Seven days after a submission
 * with none, the partner gets one reminder; after fourteen the submission is
 * flagged PARTNER_UNCONFIRMED and held for a reviewer.
 */
function partnerReminders() {
  const now = Date.now();
  const p = props_();
  const completion = FormApp.openById(prop_(PROP.formPartnerComplete)).getPublishedUrl();
  rows_('Submissions').forEach(function (s) {
    const event = eventById_(s.event_id);
    if (!event || !event.partnerRequired || !s.partner_id) return;
    if (['SUBMITTED', 'AUTO_FLAGGED', 'IN_REVIEW'].indexOf(s.status) < 0) return;
    const partner = find_('Partners', function (r) { return r.partner_id === s.partner_id; });
    if (!partner || partner.completed_at) return;
    const age = (now - new Date(s.submitted_at).getTime()) / 86400000;
    const key = 'REMINDED_' + s.submission_id;
    if (age >= 7 && !p.getProperty(key)) {
      send_(partner.contact_email, 'email_partner_reminder_subject', 'email_partner_reminder_body', {
        contact_name: partner.contact_name, org_name: partner.org_name, partner_id: partner.partner_id, completion_link: completion,
      });
      p.setProperty(key, nowIso_());
    }
    if (age >= 14 && !/PARTNER_UNCONFIRMED/.test(s.auto_flags)) {
      const flags = String(s.auto_flags || '').split(/,\s*/).filter(Boolean).concat('PARTNER_UNCONFIRMED');
      update_('Submissions', s._row, { auto_flags: flags.join(', '), status: 'AUTO_FLAGGED' });
    }
  });
}
