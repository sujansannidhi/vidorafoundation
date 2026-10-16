/**
 * Storage helpers: the spreadsheet, its tabs, rows as objects, Script
 * Properties and the editable Config tab.
 *
 * Column names are exact and become database columns in Phase 2. Do not
 * rename them.
 */

const TABS = {
  Volunteers: ['volunteer_id', 'created_at', 'first_name', 'last_name', 'email', 'grade', 'school', 'city', 'state',
    'parent_name', 'parent_email', 'consent_token', 'consent_token_expires', 'parent_consent_at', 'media_consent',
    'media_parent_consent_at', 'referral_code', 'referred_by', 'status', 'chapter_id'],
  Events: ['event_id', 'name', 'slug', 'mode', 'credit_rule', 'cap_rule', 'active'],
  Drops: ['drop_id', 'month', 'open_at', 'close_at', 'slot_cap', 'slots_used'],
  Signups: ['signup_id', 'volunteer_id', 'event_id', 'drop_id', 'created_at', 'co_volunteer_ids', 'status'],
  Partners: ['partner_id', 'org_name', 'org_type', 'city', 'state', 'contact_name', 'contact_title', 'contact_email',
    'accepts', 'volunteer_id', 'confirmed_at', 'completed_at', 'quantity_received', 'verified_by_reviewer'],
  Submissions: ['submission_id', 'volunteer_id', 'signup_id', 'event_id', 'task_id', 'partner_id', 'quantity',
    'evidence_links', 'reflection', 'post_url', 'submitted_at', 'auto_flags', 'status', 'credited_hours', 'reviewer',
    'reason_code', 'reviewed_at', 'adult_signed_by', 'signed_at'],
  Certificates: ['certificate_id', 'submission_ids', 'volunteer_id', 'hours', 'activities', 'pdf_file_id', 'issued_at',
    'status'],
  Config: ['key', 'value'],
};

/** Script Property keys. IDs live here, never in code. */
const PROP = {
  spreadsheetId: 'SPREADSHEET_ID',
  folderId: 'FOLDER_ID',
  templateId: 'LETTER_TEMPLATE_ID',
  formRegister: 'FORM_F1_ID',
  formSignup: 'FORM_F2_ID',
  formPartnerConfirm: 'FORM_F3_ID',
  formSubmit: 'FORM_F4_ID',
  formPartnerComplete: 'FORM_F5_ID',
  signupEventEntry: 'FORM_F2_EVENT_ENTRY',
  webAppUrl: 'WEB_APP_URL',
};

/** Set by selfTest() so tests run against a throwaway copy. */
let SPREADSHEET_OVERRIDE_ID = null;

function props_() {
  return PropertiesService.getScriptProperties();
}

function prop_(key) {
  return props_().getProperty(key);
}

function ss_() {
  const id = SPREADSHEET_OVERRIDE_ID || prop_(PROP.spreadsheetId);
  if (!id) throw new Error('Run setupOpenPaths() first: no spreadsheet is configured.');
  return SpreadsheetApp.openById(id);
}

function sheet_(name) {
  const sh = ss_().getSheetByName(name);
  if (!sh) throw new Error('Missing tab: ' + name);
  return sh;
}

/** All rows of a tab as objects keyed by header, each with its 1-based row number. */
function rows_(name) {
  const sh = sheet_(name);
  const values = sh.getDataRange().getValues();
  const head = values.shift() || [];
  return values.map(function (r, i) {
    const o = { _row: i + 2 };
    head.forEach(function (h, j) { o[h] = r[j]; });
    return o;
  });
}

function append_(name, obj) {
  const head = TABS[name];
  sheet_(name).appendRow(head.map(function (h) { return obj[h] === undefined ? '' : obj[h]; }));
  return obj;
}

function update_(name, rowNumber, changes) {
  const sh = sheet_(name);
  const head = TABS[name];
  Object.keys(changes).forEach(function (k) {
    const col = head.indexOf(k);
    if (col < 0) throw new Error('Unknown column ' + k + ' in ' + name);
    sh.getRange(rowNumber, col + 1).setValue(changes[k]);
  });
}

function find_(name, predicate) {
  const all = rows_(name);
  for (let i = 0; i < all.length; i++) if (predicate(all[i])) return all[i];
  return null;
}

/** Config values, editable by non-developers in the Config tab. */
function config_(key, fallback) {
  const row = find_('Config', function (r) { return r.key === key; });
  return row && row.value !== '' ? String(row.value) : (fallback === undefined ? '' : fallback);
}

/** Replace {{name}} placeholders. */
function fill_(template, values) {
  return String(template).replace(/\{\{(\w+)\}\}/g, function (_, k) {
    return values[k] === undefined || values[k] === null ? '' : String(values[k]);
  });
}

function eventById_(id) {
  for (let i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i];
  return null;
}

function nowIso_() {
  return new Date().toISOString();
}

function webAppUrl_() {
  return prop_(PROP.webAppUrl) || ScriptApp.getService().getUrl();
}
