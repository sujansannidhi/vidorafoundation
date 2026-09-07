#!/usr/bin/env node
/**
 * Enforces the content and brand hard rules from the build plan (section 8)
 * and the vidora-brand skill, so they are structural rather than a matter of
 * care. Runs before `astro build` and on `npm run check`.
 *
 * Every rule below exists because breaking it creates legal or credibility
 * exposure, not because it is a style preference.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const fail = (rule, where, msg) => failures.push({ rule, where, msg });

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    if (e === 'node_modules' || e === '.git' || e === 'dist' || e === '.astro') continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const srcFiles = walk(join(ROOT, 'src'));
const text = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(ROOT, f);
const isType = (f, ...exts) => exts.includes(extname(f));

/* ------------------------------------------------------------------ *
 * Rule 1. Colour lives in tokens.css and nowhere else.
 * ------------------------------------------------------------------ */
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![0-9a-zA-Z_-])/g;
for (const f of srcFiles) {
  if (basename(f) === 'tokens.css') continue;
  if (!isType(f, '.css', '.astro', '.ts', '.js', '.svg')) continue;
  for (const line of text(f).split('\n').entries()) {
    const [i, l] = line;
    if (l.includes('allow-hex')) continue;
    const hits = l.match(HEX);
    if (hits) fail('R1 no hex outside tokens.css', `${rel(f)}:${i + 1}`, hits.join(' '));
  }
}

/* ------------------------------------------------------------------ *
 * Rule 2. The terracotta accent on a light surface is 3.55:1 and fails
 * WCAG AA. --copper-fill is decorative. It may never appear in a colour
 * property, and neither may its semantic alias --accent-fill: aliasing a
 * failing colour under a friendlier name is exactly how the rule gets
 * routed around, so both spellings are checked.
 * There is deliberately no token called plain `--copper` or `--accent`.
 * ------------------------------------------------------------------ */
const FILL_ALIASES = ['--copper-fill', '--accent-fill'];
for (const f of srcFiles) {
  if (!isType(f, '.css', '.astro')) continue;
  if (basename(f) === 'tokens.css') continue;
  text(f).split('\n').forEach((l, i) => {
    for (const alias of FILL_ALIASES) {
      if (new RegExp(`(?<!-)\\bcolor\\s*:\\s*[^;]*${alias}`).test(l)) {
        fail(`R2 ${alias} used as text colour`, `${rel(f)}:${i + 1}`, l.trim());
      }
    }
    if (/var\(\s*--(?:copper|accent)\s*[,)]/.test(l)) {
      fail('R2 bare accent token', `${rel(f)}:${i + 1}`,
        'Use --accent-fill (fills only), --copper-text-on-dark, or --copper-text-on-light.');
    }
  });
}

/* ------------------------------------------------------------------ *
 * Rule 2b. Gradients must not fade to the bare `transparent` keyword.
 * It resolves to transparent BLACK, so the fade passes through a muddy grey
 * band instead of dissolving cleanly. Fade to the same colour at zero alpha.
 * ------------------------------------------------------------------ */
for (const f of srcFiles) {
  if (!isType(f, '.css', '.astro')) continue;
  text(f).split('\n').forEach((l, i) => {
    if (/gradient\(/.test(l) && /\btransparent\b/.test(l) && !/color-mix/.test(l)) {
      fail('R2b gradient to transparent', `${rel(f)}:${i + 1}`,
        'fades through transparent black. Use a zero-alpha token such as --plum-deep-fade.');
    }
  });
}

/* ------------------------------------------------------------------ *
 * Rule 3. Contrast. Assert the audited pairs rather than trusting them.
 * ------------------------------------------------------------------ */
const tokensCss = text(join(ROOT, 'src/styles/tokens.css'));
const tok = (name) => {
  const m = tokensCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
  if (!m) { fail('R3 contrast', 'tokens.css', `token --${name} missing`); return '#000000'; }
  return m[1];
};
const lum = (hex) => {
  const n = hex.replace('#', '');
  const c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const contrastChecks = [
  ['plum on blush', 'plum', 'blush', 7],
  ['plum-deep on blush', 'plum-deep', 'blush', 7],
  ['plum on blush-warm', 'plum', 'blush-warm', 7],
  ['copper-text-on-dark on plum-deep', 'copper-text-on-dark', 'plum-deep', 4.5],
  ['copper-text-on-light on blush', 'copper-text-on-light', 'blush', 4.5],
];
for (const [name, fg, bg, min] of contrastChecks) {
  const r = ratio(tok(fg), tok(bg));
  if (r < min) fail('R3 contrast', name, `${r.toFixed(2)}:1 is below the ${min}:1 floor`);
}
// The trap, asserted from the other side: confirm copper-fill really is the
// failing combination we removed the name for. If this ever passes, the
// palette changed and rule 2's naming split needs revisiting.
const trap = ratio(tok('copper-fill'), tok('blush'));
if (trap >= 4.5) {
  fail('R3 contrast', 'copper-fill on blush',
    `now ${trap.toFixed(2)}:1. Palette changed; revisit the token split in rule 2.`);
}

/* ------------------------------------------------------------------ *
 * Rule 4. Banned copy. Brand skill, copy rules.
 * ------------------------------------------------------------------ */
const BANNED = ['delve', 'foster', 'leverage', 'empower', 'robust', 'transformative',
  'elevate', 'embark', 'harness', 'ever-evolving', 'ever evolving', 'tapestry', 'beacon',
  'third world', 'the less fortunate', 'give them a voice', 'save these children',
  'rescue these', 'underprivileged', 'needy'];
const copyFiles = srcFiles.filter((f) =>
  isType(f, '.astro', '.ts') && !f.includes(`${'src'}/scripts/`));
for (const f of copyFiles) {
  const body = text(f);
  body.split('\n').forEach((l, i) => {
    if (l.trimStart().startsWith('//') || l.trimStart().startsWith('*')) return;
    for (const w of BANNED) {
      if (new RegExp(`\\b${w.replace(/[-\s]/g, '[-\\s]')}\\b`, 'i').test(l)) {
        fail('R4 banned word', `${rel(f)}:${i + 1}`, `"${w}"`);
      }
    }
  });
}

/* ------------------------------------------------------------------ *
 * Rule 5. No em dashes.
 * ------------------------------------------------------------------ */
for (const f of copyFiles) {
  text(f).split('\n').forEach((l, i) => {
    if (l.includes('—')) fail('R5 em dash', `${rel(f)}:${i + 1}`, l.trim().slice(0, 80));
  });
}

/* ------------------------------------------------------------------ *
 * Rule 6. Tax-deductibility. 501(c)(3) status is pending.
 * The line is one shared component so it cannot drift between pages.
 * ------------------------------------------------------------------ */
const CANON = "Vidora Foundation's application for 501(c)(3) tax-exempt status is pending. Contributions made now are not tax-deductible.";
const siteTs = text(join(ROOT, 'src/content/site.ts'));
if (!siteTs.includes(CANON)) {
  fail('R6 501(c)(3)', 'src/content/site.ts', 'pendingStatusLine no longer matches the approved wording verbatim.');
}
for (const f of srcFiles) {
  if (!isType(f, '.astro', '.ts')) continue;
  const body = text(f);
  const b = basename(f);
  if (b === 'site.ts' || b === 'PendingStatus.astro' || b === 'check-content-rules.mjs') continue;
  if (/tax[\s-]?deduct/i.test(body)) {
    fail('R6 501(c)(3)', rel(f),
      'mentions tax deductibility outside the shared PendingStatus component.');
  }
  // A page that asks for money needs the pending line adjacent, not in a footer.
  // Scoped to rendered pages: a data endpoint that merely lists "/donate" as a
  // route string is not asking anyone for anything.
  if (f.includes(`${'src'}/pages/`) && extname(f) === '.astro'
      && /gofundme|\bdonate\b/i.test(body)
      && !/PendingStatus/.test(body) && !/href="\/donate"/.test(body)) {
    fail('R6 501(c)(3)', rel(f), 'asks for money without rendering PendingStatus.');
  }
}
// Claims the org cannot make at all.
for (const f of srcFiles) {
  if (!isType(f, '.astro', '.ts')) continue;
  if (basename(f) === 'check-content-rules.mjs') continue;
  const body = text(f);
  for (const phrase of ['501(c)(3) nonprofit', 'registered charity', 'write-off', 'write off your']) {
    if (body.toLowerCase().includes(phrase.toLowerCase())) {
      fail('R6 501(c)(3)', rel(f), `claims "${phrase}" while status is pending.`);
    }
  }
}

/* ------------------------------------------------------------------ *
 * Rule 7. Prospects are not partners, and two topics stay non-public.
 * ------------------------------------------------------------------ */
const PROSPECTS = ['TANTEX', 'India Philanthropy Alliance', 'Rural Development Trust',
  'Naandi', 'Goonj'];
const NONPUBLIC = ['household economics', 'matched savings'];
for (const f of srcFiles) {
  const body = text(f);
  for (const p of PROSPECTS) {
    if (body.includes(p)) fail('R7 prospect listed', rel(f), `"${p}" is a prospect, not a partner.`);
  }
  for (const p of NONPUBLIC) {
    if (body.toLowerCase().includes(p)) fail('R7 non-public topic', rel(f), `"${p}"`);
  }
}
// The FCRA position is under legal review: no claims about cross border
// movement of funds. The destination is deliberately NOT hard coded to India.
// The organisation is built around chapters that may serve schools anywhere,
// so a guard that only knew one country would silently go quiet the first
// time a chapter raised for a school somewhere else.
const FUND_VERB = '(?:wire|transfer|send|remit|move|convert)';
const CROSS_BORDER = new RegExp(
  `${FUND_VERB}(?:s|ed|ing)?\\s+(?:the\\s+)?(?:money|funds|donations)\\s+(?:to|into|overseas|abroad)`
  + `|${FUND_VERB}(?:s|ed|ing)?\\s+(?:the\\s+)?(?:money|funds|donations)\\s+\\w+\\s+(?:to|into)\\s+\\w`,
  'i',
);
for (const f of srcFiles) {
  if (basename(f) === 'check-content-rules.mjs') continue;
  if (CROSS_BORDER.test(text(f))) {
    fail('R7 cross-border funds', rel(f),
      'describes how funds move across a border. Under legal review.');
  }
}

/* ------------------------------------------------------------------ *
 * Rules 8 and 9. The impact figures, asserted against the real module.
 * ------------------------------------------------------------------ */
const impact = await import(new URL('../src/content/impact.ts', import.meta.url));
const figures = ['studentsWhoReceivedKits', 'schoolsReached', 'campaignCost'];
for (const key of figures) {
  const fig = impact[key];
  if (!fig) { fail('R8 impact figure', 'impact.ts', `${key} is missing`); continue; }
  if (!fig.source || !fig.source.trim()) {
    fail('R8 unsourced number', `impact.ts:${key}`, 'no number renders unless it is sourced.');
  }
  if (!fig.excludes || !fig.excludes.trim()) {
    fail('R8 impact figure', `impact.ts:${key}`, 'must state what it does NOT count.');
  }
}
// No array of figures exists to iterate or reduce, so nothing can sum them.
const impactSrc = text(join(ROOT, 'src/content/impact.ts'));
if (/ImpactFigureData\[\]/.test(impactSrc) || /^export const figures/m.test(impactSrc)) {
  fail('R9 figures summable', 'impact.ts',
    'exports a list of figures. Three separate named exports only, so no code path can sum them.');
}
for (const f of srcFiles) {
  const body = text(f);
  if (figures.some((k) => body.includes(k)) && /\.reduce\s*\(/.test(body)) {
    fail('R9 figures summable', rel(f), 'reduces over impact figures.');
  }
  if (/impacted\s+[\d,]+\s+(students|lives|people)/i.test(body)) {
    fail('R9 figures summable', rel(f), 'presents a combined impact total.');
  }
}

/* ------------------------------------------------------------------ *
 * Rule 10. Every pillar carries a status, and Planned cannot be present tense.
 * ------------------------------------------------------------------ */
const { pillars } = await import(new URL('../src/content/pillars.ts', import.meta.url));
for (const p of pillars) {
  if (p.status !== 'active' && p.status !== 'planned') {
    fail('R10 pillar status', p.slug, `status "${p.status}" is not active or planned`);
  }
  if (p.status === 'planned') {
    // Checked per field, not on the concatenation: one disclaimer buried in
    // the body must not license a present tense claim in the summary.
    const PRESENT_CLAIM =
      /\b(?:we|vidora(?: foundation)?|the (?:team|programme|program))\s+(?:\w+\s+){0,2}(?:place|places|provide|provides|deliver|delivers|run|runs|give|gives|supply|supplies|teach|teaches|offer|offers|bring|brings|train|trains)\b/i;
    const HEDGE = /\bwould\b|\bis not running\b|\bnothing has been delivered\b|\bnot\b/i;
    for (const [field, value] of [['summary', p.summary], ...p.body.map((b, i) => [`body[${i}]`, b])]) {
      if (PRESENT_CLAIM.test(value)) {
        fail('R10 planned pillar in present tense', `${p.slug}.${field}`,
          'a planned pillar must not be described as something the org does.');
      }
      if (!HEDGE.test(value)) {
        fail('R10 planned pillar in present tense', `${p.slug}.${field}`,
          'every sentence about a planned pillar must carry its own hedge.');
      }
    }
  }
}
if (pillars.filter((p) => p.status === 'active').length !== 1) {
  fail('R10 pillar status', 'pillars.ts', 'exactly one pillar is active (Learning Kits).');
}

/* ------------------------------------------------------------------ *
 * Rule 11. Never fabricate. Unknown content is a visible TODO, not a blank
 * and not a plausible guess.
 * ------------------------------------------------------------------ */
const { people } = await import(new URL('../src/content/people.ts', import.meta.url));
for (const person of people) {
  if (person.bio && person.bio.length === 0) {
    fail('R11 fabrication guard', person.name, 'bio is an empty array. Use null so a TodoNote renders.');
  }
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */
if (failures.length === 0) {
  console.log('content rules: all checks passed');
  process.exit(0);
}
console.error(`\ncontent rules: ${failures.length} violation(s)\n`);
for (const f of failures) {
  console.error(`  [${f.rule}]\n    ${f.where}\n    ${f.msg}\n`);
}
process.exit(1);
