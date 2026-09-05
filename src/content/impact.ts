/**
 * Plan section 8, rule 1: the three impact figures are three separate
 * variables and no code path sums them.
 *
 * That is enforced structurally, not by discipline:
 *   - there is no array of figures to iterate or reduce
 *   - each figure is its own named export
 *   - ImpactFigure.astro accepts exactly one figure, never a list
 *
 * Brand skill, hard rule 2: these numbers must never be added together,
 * conflated, or presented as one number. "1,200 students" and "12 schools"
 * are different units. Enrolment at partner schools is a different figure
 * again and is NOT published here (open register, item 10).
 */

export interface ImpactFigureData {
  /** Rendered exactly as written. Digits never animate. */
  value: string;
  /** What the number counts. */
  label: string;
  /** When and where it comes from. */
  sublabel: string;
  /**
   * Required. check-content-rules.mjs fails the build if this is empty.
   * Plan section 8, rule 8: no number renders unless it is sourced.
   */
  source: string;
  /** What this figure does NOT count. Rendered in the methodology note. */
  excludes: string;
}

export const studentsWhoReceivedKits: ImpactFigureData = {
  value: '1,200',
  label: 'students',
  sublabel: 'received kits',
  source: 'June 2026 Learning Kits campaign, approximate count at distribution.',
  excludes:
    'This counts students who physically received a kit. It is not total enrolment at the schools we visited.',
};

export const schoolsReached: ImpactFigureData = {
  value: '12',
  label: 'schools',
  sublabel: 'reached',
  source: 'June 2026 Learning Kits campaign.',
  excludes: 'This counts schools where kits were distributed, not schools contacted.',
};

export const campaignCost: ImpactFigureData = {
  value: '$3,500',
  label: 'total campaign cost',
  /* Empty on purpose: the source line below already dates this figure, and
     the caption reads as one phrase (`label` + `sublabel`) wherever it is
     rendered. "total campaign cost June 2026" is not that phrase. */
  sublabel: '',
  source: 'June 2026 Learning Kits campaign, approximate total.',
  excludes:
    'This is what the supplies cost at local wholesale prices in Narasaraopeta. It does not include travel.',
};

/**
 * The methodology note that sits under the figures.
 * Plan section 3, stage 4: one line on what each number counts and what it does not.
 */
export const methodologyNote =
  'Each number counts one thing. Students who received kits is a headcount at distribution. Schools reached is a count of schools. Total cost is what the supplies cost at local wholesale prices. The three are not added together and none of them is a measure of the others.';
