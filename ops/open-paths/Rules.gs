/**
 * Pure rules: hour credits, caps and auto-flags. No Google services are used
 * here, so the same code is exercised by Tests.gs in Apps Script and by
 * test/local.test.mjs in Node.
 */

const FLAGS = [
  'NOT_ACTIVE', 'DUPLICATE', 'OVER_EVENT_CAP', 'OVER_MONTH_CAP', 'OVER_YEAR_CAP',
  'PARTNER_MISSING', 'PARTNER_UNCONFIRMED', 'EVIDENCE_REUSED', 'QUANTITY_OUT_OF_RANGE',
];

/** Statuses that no longer count towards caps. */
const NOT_COUNTED = ['REJECTED', 'WITHDRAWN'];

/** The most a single drive could plausibly deliver; above this a reviewer looks. */
const QUANTITY_SANITY_MAX = 2000;

/**
 * Hours a submission earns under its event's credit rule.
 * fixed: the fixed hours. bands: the band the quantity falls in (0 below the
 * first band). tasks: the task's hours (0 for an unknown task).
 */
function creditFor_(event, quantity, taskId) {
  const c = event.credit;
  if (c.kind === 'fixed') return c.hours;
  if (c.kind === 'bands') {
    const q = Number(quantity);
    if (!(q >= 0)) return 0;
    for (let i = 0; i < c.bands.length; i++) {
      const b = c.bands[i];
      if (q >= b.min && (b.max === null || q <= b.max)) return b.hours;
    }
    return 0;
  }
  if (c.kind === 'tasks') {
    for (let i = 0; i < c.tasks.length; i++) if (c.tasks[i].id === taskId) return c.tasks[i].hours;
    return 0;
  }
  return 0;
}

/** The school year (August 1 to July 31) a date falls in, as the starting year. */
function schoolYearOf_(date) {
  const d = new Date(date);
  return d.getMonth() + 1 >= CAPS.schoolYearStartMonth ? d.getFullYear() : d.getFullYear() - 1;
}

function sameMonth_(a, b) {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth();
}

function splitLinks_(text) {
  return String(text || '')
    .split(/[\s,]+/)
    .map(function (s) { return s.trim().replace(/[).,;]+$/, ''); })
    .filter(function (s) { return /^https?:\/\//i.test(s); });
}

/**
 * Auto-flags for a new submission.
 *
 * ctx = {
 *   submission: { volunteer_id, event_id, task_id, partner_id, quantity, evidence_links, dates, submitted_at },
 *   volunteer:  { status } or null,
 *   partner:    { confirmed_at, volunteer_id } or null,
 *   earlier:    previous submissions for this volunteer (rows with event_id,
 *               submitted_at, credited_hours, status, dates),
 *   allEvidence: evidence links from every other submission, any volunteer,
 *   hours:      the credit this submission would earn,
 * }
 */
function computeFlags_(ctx) {
  const s = ctx.submission;
  const event = eventById_(s.event_id);
  const flags = [];
  const counted = (ctx.earlier || []).filter(function (r) { return NOT_COUNTED.indexOf(r.status) < 0; });
  const when = s.submitted_at ? new Date(s.submitted_at) : new Date();

  if (!ctx.volunteer || ctx.volunteer.status !== 'ACTIVE') flags.push('NOT_ACTIVE');

  if (counted.some(function (r) {
    return r.event_id === s.event_id && String(r.dates || '') === String(s.dates || '') && String(r.task_id || '') === String(s.task_id || '');
  })) flags.push('DUPLICATE');

  if (event) {
    const rule = event.capRule || {};
    const sameEvent = counted.filter(function (r) { return r.event_id === s.event_id; });
    let overEvent = false;
    if (rule.perMonth && sameEvent.filter(function (r) { return sameMonth_(r.submitted_at, when); }).length + 1 > rule.perMonth) overEvent = true;
    if (rule.perSchoolYear && sameEvent.filter(function (r) { return schoolYearOf_(r.submitted_at) === schoolYearOf_(when); }).length + 1 > rule.perSchoolYear) overEvent = true;
    if (rule.perDays && sameEvent.some(function (r) { return (when - new Date(r.submitted_at)) / 86400000 < rule.perDays; })) overEvent = true;
    if (rule.hoursPerMonth) {
      const used = sameEvent.filter(function (r) { return sameMonth_(r.submitted_at, when); })
        .reduce(function (sum, r) { return sum + Number(r.credited_hours || 0); }, 0);
      if (used + ctx.hours > rule.hoursPerMonth) overEvent = true;
    }
    if (overEvent) flags.push('OVER_EVENT_CAP');

    const monthUsed = counted.filter(function (r) { return sameMonth_(r.submitted_at, when); })
      .reduce(function (sum, r) { return sum + Number(r.credited_hours || 0); }, 0);
    if (monthUsed + ctx.hours > CAPS.hoursPerMonth) flags.push('OVER_MONTH_CAP');

    const yearUsed = counted.filter(function (r) { return schoolYearOf_(r.submitted_at) === schoolYearOf_(when); })
      .reduce(function (sum, r) { return sum + Number(r.credited_hours || 0); }, 0);
    if (yearUsed + ctx.hours > CAPS.hoursPerSchoolYear) flags.push('OVER_YEAR_CAP');

    if (event.partnerRequired) {
      if (!s.partner_id || !ctx.partner) flags.push('PARTNER_MISSING');
      else if (!ctx.partner.confirmed_at || (ctx.partner.volunteer_id && ctx.partner.volunteer_id !== s.volunteer_id)) flags.push('PARTNER_UNCONFIRMED');
    }

    if (event.credit.kind === 'bands') {
      const q = Number(s.quantity);
      if (!(q >= event.credit.bands[0].min) || q > QUANTITY_SANITY_MAX) flags.push('QUANTITY_OUT_OF_RANGE');
    }
    if (event.credit.kind === 'tasks' && creditFor_(event, s.quantity, s.task_id) === 0) flags.push('QUANTITY_OUT_OF_RANGE');
  }

  const mine = splitLinks_(s.evidence_links);
  const others = (ctx.allEvidence || []).map(function (l) { return String(l).toLowerCase(); });
  if (mine.some(function (l) { return others.indexOf(l.toLowerCase()) >= 0; })) flags.push('EVIDENCE_REUSED');

  return flags;
}

/** First name and last initial, never a full name or school. */
function publicName_(first, last) {
  const f = String(first || '').trim();
  const l = String(last || '').trim();
  return l ? f + ' ' + l.charAt(0).toUpperCase() + '.' : f;
}

/**
 * The /verify response for a certificate ID, per the contract in
 * src/content/volunteer.ts. `lookup` returns { certificate, volunteer } or null.
 */
function verifyResponse_(rawId, lookup) {
  const id = String(rawId || '').trim().toUpperCase();
  if (!CERTIFICATE_ID_PATTERN.test(id)) return { id: id, status: 'INVALID' };
  const found = lookup(id);
  if (!found) return { id: id, status: 'NOT_FOUND' };
  const c = found.certificate;
  let activities = [];
  try { activities = JSON.parse(c.activities || '[]'); } catch (e) { activities = []; }
  const issued = c.issued_at ? new Date(c.issued_at) : null;
  return {
    id: id,
    status: c.status === 'REVOKED' ? 'REVOKED' : 'VALID',
    volunteer: publicName_(found.volunteer && found.volunteer.first_name, found.volunteer && found.volunteer.last_name),
    hours: Number(c.hours),
    issuedOn: issued ? issued.toISOString().slice(0, 10) : '',
    activities: activities.map(function (a) { return { event: a.event, dates: a.dates, hours: Number(a.hours) }; }),
  };
}
