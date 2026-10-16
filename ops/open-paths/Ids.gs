/**
 * ID generation, in the formats defined in src/content/volunteer.ts:
 *
 *   volunteer    VOL-000123
 *   drop         DROP-2611            (year and month)
 *   sign-up      SGN-2611-0001        (sequence per month)
 *   partner      PTR-0042
 *   submission   SUB-2611-0042        (sequence per month)
 *   certificate  OP-2611-0042-K7QD    (month of issue, sequence, four characters)
 *
 * Counters live in Script Properties and are advanced under LockService, so
 * simultaneous form submissions never receive the same ID.
 */

function pad_(n, width) {
  let s = String(n);
  while (s.length < width) s = '0' + s;
  return s;
}

/** YYMM for a date, in the script's time zone. */
function yymm_(date) {
  return Utilities.formatDate(date || new Date(), Session.getScriptTimeZone(), 'yyMM');
}

function randomSuffix_(length) {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CERTIFICATE_SUFFIX_ALPHABET.charAt(Math.floor(Math.random() * CERTIFICATE_SUFFIX_ALPHABET.length));
  }
  return out;
}

/** Pure formatting, used by nextId_ and by the tests. */
function formatId_(kind, seq, month, suffix) {
  switch (kind) {
    case 'volunteer': return 'VOL-' + pad_(seq, 6);
    case 'drop': return 'DROP-' + month;
    case 'signup': return 'SGN-' + month + '-' + pad_(seq, 4);
    case 'partner': return 'PTR-' + pad_(seq, 4);
    case 'submission': return 'SUB-' + month + '-' + pad_(seq, 4);
    case 'certificate': return 'OP-' + month + '-' + pad_(seq, 4) + '-' + suffix;
    default: throw new Error('Unknown ID kind: ' + kind);
  }
}

/** The next ID of a kind. Monthly kinds restart their sequence each month. */
function nextId_(kind, date) {
  const month = yymm_(date);
  if (kind === 'drop') return formatId_('drop', 0, month);
  const monthly = kind === 'signup' || kind === 'submission' || kind === 'certificate';
  const key = 'SEQ_' + kind.toUpperCase() + (monthly ? '_' + month : '');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const p = props_();
    const next = Number(p.getProperty(key) || '0') + 1;
    p.setProperty(key, String(next));
    return formatId_(kind, next, month, kind === 'certificate' ? randomSuffix_(4) : undefined);
  } finally {
    lock.releaseLock();
  }
}
