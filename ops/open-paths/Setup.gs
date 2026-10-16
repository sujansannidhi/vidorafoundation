/**
 * One-time setup. Run setupOpenPaths() once from the Apps Script editor,
 * signed in as sujan@vidorafoundation.org. It creates:
 *
 *   - the Open Paths spreadsheet, its tabs and headers, and a reviewer view
 *   - a restricted Drive folder for evidence and letters
 *   - the Google Docs letter template
 *   - Forms F1 to F5
 *
 * and stores every ID in Script Properties (never in code). It then logs the
 * public form URLs and F2's event entry key, which go into
 * src/content/volunteer.ts. Running it twice does nothing the second time.
 */

const FORM_TITLES = {
  F1: 'Open Paths: Volunteer Registration',
  F2: 'Open Paths: Event Sign-up',
  F3: 'Open Paths: Partner Confirmation',
  F4: 'Open Paths: Hours Submission',
  F5: 'Open Paths: Partner Completion',
};

/** Question titles. Handlers read answers by these titles, so keep them in sync. */
const Q = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Your email',
  grade: 'Grade',
  school: 'School',
  city: 'City',
  state: 'State',
  parentName: 'Parent or guardian name',
  parentEmail: 'Parent or guardian email',
  heardFrom: 'How did you hear about Open Paths?',
  referral: 'Referral code (optional)',
  rules: 'Program rules',
  agreement: 'Participation agreement',
  media: 'Photos and posts (optional)',
  volunteer: 'Volunteer ID or email',
  event: 'Event',
  plannedDates: 'Planned dates',
  coVolunteers: 'Co-volunteer IDs (drives only)',
  orgName: 'Organisation',
  orgType: 'Type of organisation',
  orgAddress: 'Organisation address',
  contactName: 'Your name',
  contactTitle: 'Your title',
  contactEmail: 'Your work email',
  accepts: 'What you can accept, or the session the volunteer may join',
  volunteerNameOrId: 'Volunteer name or ID',
  agreeComplete: 'Confirming completion',
  volunteerId: 'Volunteer ID',
  signupId: 'Sign-up ID',
  task: 'Outreach Ambassador task (if relevant)',
  dates: 'Dates of the work',
  quantity: 'Quantity (books, kits or sessions)',
  partnerId: 'Partner ID',
  evidence: 'Evidence links',
  reflection: 'Reflection (three sentences)',
  postUrl: 'Post link (optional)',
  ownWork: 'Your own work',
  date: 'Date',
  received: 'Quantity received, or session confirmed',
  notes: 'Notes',
};

const DEFAULT_CONFIG = [
  ['current_drop_id', ''],
  ['signatory_name', ''],
  ['signatory_title', ''],
  ['signatory_email', ''],
  ['signatory_phone', ''],
  ['team_digest_recipients', 'sujan@vidorafoundation.org'],
  ['contact_email', 'sujan@vidorafoundation.org'],
  ['email_consent_subject', 'Please confirm {{first_name}}\'s Open Paths registration'],
  ['email_consent_body', 'Hello {{parent_name}},\n\n{{first_name}} has registered for Open Paths, Vidora Foundation\'s volunteer program for high school students. Their account becomes active only after you confirm.\n\nConfirm here (the link works once and expires in 14 days):\n{{consent_link}}\n\nIf you did not expect this email, you can ignore it and nothing will happen.\n\nVidora Foundation'],
  ['email_active_subject', 'Your Open Paths account is active'],
  ['email_active_body', 'Hi {{first_name}},\n\nYour parent or guardian has confirmed, and your Open Paths account is active. Your volunteer ID is {{volunteer_id}}.\n\nPick an event from this month\'s Drop at https://www.vidorafoundation.org/volunteer\n\n{{counselor_note}}\n\nVidora Foundation'],
  ['email_signup_subject', 'You are signed up: {{event_name}}'],
  ['email_signup_body', 'Hi {{first_name}},\n\nYou are signed up for {{event_name}}. Your sign-up ID is {{signup_id}}.\n\nWhat you do:\n{{steps}}\n\nProof you submit:\n{{proof}}\n\nFull details: https://www.vidorafoundation.org/volunteer/events/{{event_slug}}/\n\n{{counselor_note}}\n\nVidora Foundation'],
  ['email_signup_rejected_subject', 'Open Paths sign-up not completed'],
  ['email_signup_rejected_body', 'Hi,\n\nWe could not complete this sign-up: {{reason}}\n\nIf you think this is a mistake, reply to this email.\n\nVidora Foundation'],
  ['email_partner_subject', 'Thank you for confirming: Partner ID {{partner_id}}'],
  ['email_partner_body', 'Hello {{contact_name}},\n\nThank you for agreeing to host an Open Paths volunteer at {{org_name}}. Your Partner ID is {{partner_id}}.\n\nWhen the work is done, please confirm it here: {{completion_link}}\n\nVolunteers follow your site\'s rules, collect no cash, and bring nothing you did not agree to.\n\nVidora Foundation'],
  ['email_partner_reminder_subject', 'Please confirm a volunteer\'s work: Partner ID {{partner_id}}'],
  ['email_partner_reminder_body', 'Hello {{contact_name}},\n\nA student volunteer has submitted their work for {{org_name}}. Could you confirm it took place? It takes about two minutes: {{completion_link}}\n\nThank you,\nVidora Foundation'],
  ['email_received_subject', 'We received your submission {{submission_id}}'],
  ['email_received_body', 'Hi {{first_name}},\n\nWe received your submission {{submission_id}} for {{event_name}}. You will hear from us within 10 days of the month ending.\n\nVidora Foundation'],
  ['email_approved_subject', 'Approved: {{event_name}}'],
  ['email_approved_body', 'Hi {{first_name}},\n\nYour submission {{submission_id}} for {{event_name}} is approved for {{hours}} hours. It goes to an adult at Vidora to sign, and your letter is emailed by the 15th of next month.\n\n{{counselor_note}}\n\nVidora Foundation'],
  ['email_needs_info_subject', 'More information needed: {{submission_id}}'],
  ['email_needs_info_body', 'Hi {{first_name}},\n\nA reviewer needs a little more for submission {{submission_id}} ({{event_name}}): {{reason}}\n\nYou have one chance to reply, within 7 days. Reply to this email with what is asked for.\n\nVidora Foundation'],
  ['email_rejected_subject', 'Decision on submission {{submission_id}}'],
  ['email_rejected_body', 'Hi {{first_name}},\n\nSubmission {{submission_id}} for {{event_name}} was not approved: {{reason}}\n\nIf you have questions, reply to this email.\n\nVidora Foundation'],
  ['email_letter_subject', 'Your Open Paths hours letter {{certificate_id}}'],
  ['email_letter_body', 'Hi {{first_name}},\n\nYour signed hours letter is attached: {{hours}} hours, certificate {{certificate_id}}. Anyone can check it at {{verify_link}}\n\n{{counselor_note}}\n\nVidora Foundation'],
];

function setupOpenPaths() {
  const p = props_();
  if (p.getProperty(PROP.spreadsheetId)) {
    Logger.log('Already set up. Spreadsheet: ' + SpreadsheetApp.openById(p.getProperty(PROP.spreadsheetId)).getUrl());
    logFormLinks();
    return;
  }

  const folder = DriveApp.createFolder('Open Paths (restricted)');
  folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  p.setProperty(PROP.folderId, folder.getId());

  const ss = SpreadsheetApp.create('Open Paths');
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  p.setProperty(PROP.spreadsheetId, ss.getId());
  Object.keys(TABS).forEach(function (name, i) {
    const sh = i === 0 ? ss.getSheets()[0].setName(name) : ss.insertSheet(name);
    sh.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  sheet_('Events').getRange(2, 1, EVENTS.length, 7).setValues(EVENTS.map(function (e) {
    return [e.id, e.name, e.slug, e.mode, JSON.stringify(e.credit), JSON.stringify(e.capRule), true];
  }));
  sheet_('Config').getRange(2, 1, DEFAULT_CONFIG.length, 2).setValues(DEFAULT_CONFIG);

  // Reviewers work from this view, which leaves out parent names and emails.
  const view = ss.insertSheet('Reviewer view');
  view.getRange('A1').setFormula('=QUERY(Volunteers!A:J, "select A, C, D, F, G, H, I where A is not null", 1)');
  view.getRange('H1').setFormula('=QUERY(Volunteers!S:T, "select S, T", 1)');

  p.setProperty(PROP.templateId, createLetterTemplate_(folder));

  createForms_(folder);
  installTriggers();
  logFormLinks();
  Logger.log('Spreadsheet: ' + ss.getUrl());
  Logger.log('Next: Deploy > New deployment > Web app, then run setWebAppUrl() with its URL.');
}

/** After deploying the web app, store its URL so emails link to it. */
function setWebAppUrl(url) {
  const value = url || ScriptApp.getService().getUrl();
  props_().setProperty(PROP.webAppUrl, value);
  Logger.log('Web app URL stored: ' + value);
}

function createLetterTemplate_(folder) {
  const doc = DocumentApp.create('Open Paths letter template');
  const body = doc.getBody();
  body.appendParagraph('Vidora Foundation').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Verified Volunteer Service Letter. Certificate ID {{certificate_id}}. Verify at {{verify_link}}');
  body.appendParagraph('{{date_signed}}');
  body.appendParagraph('This letter confirms that {{full_name}}, a {{grade}} grade student at {{school}}, {{city}}, {{state}}, completed {{hours}} hours of unpaid volunteer service with Vidora Foundation’s Open Paths program between {{start_date}} and {{end_date}}.');
  body.appendParagraph('Activities:');
  body.appendParagraph('{{activities}}');
  body.appendParagraph('Hours are credited using Vidora’s published hour credits for each activity, based on evidence Vidora reviewed. They reflect the volunteer’s organizing and service time only, not the value of any donated items. All service took place outside the school day.');
  body.appendParagraph('{{status_line}} {{pvsa_line}}');
  body.appendParagraph('{{signatory_name}}, {{signatory_title}}, Vidora Foundation, {{signatory_email}}, {{signatory_phone}}');
  doc.saveAndClose();
  DriveApp.getFileById(doc.getId()).moveTo(folder);
  return doc.getId();
}

function createForms_(folder) {
  const p = props_();
  const make = function (key, title, description) {
    const form = FormApp.create(title).setDescription(description).setCollectEmail(false)
      .setLimitOneResponsePerUser(false).setAllowResponseEdits(false);
    DriveApp.getFileById(form.getId()).moveTo(folder);
    p.setProperty(key, form.getId());
    return form;
  };
  const text = function (form, title, required, help) {
    const it = form.addTextItem().setTitle(title).setRequired(required);
    if (help) it.setHelpText(help);
    return it;
  };
  const para = function (form, title, required, help) {
    const it = form.addParagraphTextItem().setTitle(title).setRequired(required);
    if (help) it.setHelpText(help);
    return it;
  };
  const emailItem = function (form, title) {
    return text(form, title, true).setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  };
  const tick = function (form, title, label, required) {
    return form.addCheckboxItem().setTitle(title).setChoiceValues([label]).setRequired(required);
  };

  // F1 Volunteer Registration
  const f1 = make(PROP.formRegister, FORM_TITLES.F1,
    'For high school students in grades 9 to 12, including homeschool students, living in the United States. Your parent or guardian confirms by email before your account is active. We never ask for a date of birth, home address or phone number.');
  text(f1, Q.firstName, true); text(f1, Q.lastName, true); emailItem(f1, Q.email);
  f1.addMultipleChoiceItem().setTitle(Q.grade).setChoiceValues(['9', '10', '11', '12']).setRequired(true);
  text(f1, Q.school, true); text(f1, Q.city, true); text(f1, Q.state, true);
  text(f1, Q.parentName, true); emailItem(f1, Q.parentEmail);
  text(f1, Q.heardFrom, false); text(f1, Q.referral, false);
  tick(f1, Q.rules, 'I have read the Open Paths rules, including the safety rules for each event.', true);
  tick(f1, Q.agreement, 'I agree to the participation agreement: I organize my events under the host site’s rules, and Vidora does not supervise on site.', true);
  tick(f1, Q.media, 'Vidora may feature my volunteer work, credited by first name and city. My parent or guardian is asked separately.', false);

  // F2 Event Sign-up. Choice values are event IDs so the website can prefill them.
  const f2 = make(PROP.formSignup, FORM_TITLES.F2, 'Sign up for one event in this month’s Drop. Your account must be active.');
  text(f2, Q.volunteer, true);
  const eventItem = f2.addListItem().setTitle(Q.event).setRequired(true)
    .setChoiceValues(EVENTS.map(function (e) { return e.id; }))
    .setHelpText(EVENTS.map(function (e) { return e.id + ': ' + e.name; }).join('\n'));
  text(f2, Q.plannedDates, true); text(f2, Q.coVolunteers, false, 'Book and supply drives only: up to two other volunteer IDs.');
  // The prefill key for the event field, read from a prefilled URL.
  const prefilled = f2.createResponse().withItemResponse(eventItem.createResponse(EVENTS[0].id)).toPrefilledUrl();
  const m = prefilled.match(/(entry\.\d+)=/);
  if (m) p.setProperty(PROP.signupEventEntry, m[1]);

  // F3 Partner Confirmation, filled by an adult at the recipient.
  const f3 = make(PROP.formPartnerConfirm, FORM_TITLES.F3,
    'For staff at the school, library, shelter or program a student volunteer will serve. It takes about two minutes. You can say no to anything.');
  text(f3, Q.orgName, true);
  f3.addMultipleChoiceItem().setTitle(Q.orgType).setChoiceValues(['School library or classroom', 'Public library', 'Family shelter', 'Little Free Library steward', 'After-school program', 'Other']).setRequired(true);
  text(f3, Q.orgAddress, true, 'The organisation’s address, not a home address.');
  text(f3, Q.city, true); text(f3, Q.state, true);
  text(f3, Q.contactName, true); text(f3, Q.contactTitle, true); emailItem(f3, Q.contactEmail);
  para(f3, Q.accepts, true, 'Ages, condition and how many, or the session details.');
  text(f3, Q.volunteerNameOrId, true);
  tick(f3, Q.agreeComplete, 'I will confirm completion when the work is done.', true);

  // F4 Hours Submission
  const f4 = make(PROP.formSubmit, FORM_TITLES.F4, 'Submit proof for one event. Share links with comment access.');
  text(f4, Q.volunteerId, true); text(f4, Q.signupId, true);
  f4.addListItem().setTitle(Q.event).setChoiceValues(EVENTS.map(function (e) { return e.id; })).setRequired(true);
  const ambassador = eventById_('EVT-AMB');
  f4.addListItem().setTitle(Q.task).setChoiceValues(['None'].concat(ambassador ? ambassador.credit.tasks.map(function (t) { return t.id; }) : [])).setRequired(false);
  text(f4, Q.dates, true); text(f4, Q.quantity, false); text(f4, Q.partnerId, false);
  para(f4, Q.evidence, true, 'One link per line, with comment access.');
  para(f4, Q.reflection, true); text(f4, Q.postUrl, false);
  tick(f4, Q.ownWork, 'This is my own work. I did not use AI tools to write it.', true);

  // F5 Partner Completion
  const f5 = make(PROP.formPartnerComplete, FORM_TITLES.F5, 'For the adult who confirmed the volunteer’s work in advance.');
  text(f5, Q.partnerId, true); text(f5, Q.volunteerId, true); text(f5, Q.date, true);
  text(f5, Q.received, true); para(f5, Q.notes, false);
}

/** Logs every form's public URL and F2's event key for volunteer.ts. */
function logFormLinks() {
  const p = props_();
  const url = function (key) {
    const id = p.getProperty(key);
    return id ? FormApp.openById(id).getPublishedUrl().replace(/[?&](usp|ouid)=[^&]*/g, '') : '(not created)';
  };
  Logger.log('forms.register        ' + url(PROP.formRegister));
  Logger.log('forms.signup          ' + url(PROP.formSignup));
  Logger.log('forms.signupEventField ' + (p.getProperty(PROP.signupEventEntry) || '(not found)'));
  Logger.log('forms.partnerConfirm  ' + url(PROP.formPartnerConfirm));
  Logger.log('forms.submit          ' + url(PROP.formSubmit));
  Logger.log('forms.partnerComplete ' + url(PROP.formPartnerComplete));
  Logger.log('verifyEndpoint        ' + (p.getProperty(PROP.webAppUrl) || '(deploy the web app, then run setWebAppUrl())'));
}

/** Installs every trigger. Safe to rerun: existing project triggers are replaced. */
function installTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  const p = props_();
  const onForm = function (key, handler) {
    ScriptApp.newTrigger(handler).forForm(FormApp.openById(p.getProperty(key))).onFormSubmit().create();
  };
  onForm(PROP.formRegister, 'onRegister');
  onForm(PROP.formSignup, 'onSignup');
  onForm(PROP.formPartnerConfirm, 'onPartnerConfirm');
  onForm(PROP.formSubmit, 'onSubmission');
  onForm(PROP.formPartnerComplete, 'onPartnerComplete');
  const ss = SpreadsheetApp.openById(p.getProperty(PROP.spreadsheetId));
  ScriptApp.newTrigger('onSheetOpen').forSpreadsheet(ss).onOpen().create();
  ScriptApp.newTrigger('onSheetEdit').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('partnerReminders').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('issueLetters').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
  ScriptApp.newTrigger('weeklySignatoryDigest').timeBased().onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(7).create();
  ScriptApp.newTrigger('monthlyTeamSummary').timeBased().onMonthDay(1).atHour(7).create();
  Logger.log('Triggers installed.');
}

/** Spreadsheet menu, so letters can also be issued by hand. */
function onSheetOpen() {
  SpreadsheetApp.getUi().createMenu('Open Paths')
    .addItem('Issue letters now', 'issueLetters')
    .addItem('Send signatory digest now', 'weeklySignatoryDigest')
    .addItem('Open or close the sign-up form for the current Drop', 'syncSignupForm')
    .addToUi();
}
