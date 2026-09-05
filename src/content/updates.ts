/**
 * The updates timeline. Three entries: what has been delivered, what is
 * next, and what is later.
 *
 * `status` is the same vocabulary as pillars.ts on purpose. Delivered means
 * it happened and there is a report. Planned means it has not, and every
 * Planned entry is written in the conditional so that reading the page
 * quickly still leaves the right impression.
 */

export type UpdateStatus = 'delivered' | 'planned';

export interface Update {
  id: string;
  /** When, in the reader's terms. "June 2026", "Next", "Later". */
  when: string;
  status: UpdateStatus;
  heading: string;
  body: string;
  /** Where the evidence for a delivered entry lives. */
  href?: string;
  linkLabel?: string;
}

export const updates: Update[] = [
  {
    id: 'learning-kits-june-2026',
    when: 'June 2026',
    status: 'delivered',
    heading: 'Learning Kits campaign, Palnadu and Prakasam',
    body: 'Approximately 1,200 students received kits, across 12 schools. The campaign cost approximately $3,500 in supplies at local wholesale prices.',
    href: '/campaigns/learning-kits-june-2026',
    linkLabel: 'Read the field report',
  },
  {
    id: 'more-chapters',
    when: 'Next',
    status: 'planned',
    heading: 'More chapters in Texas',
    body: "Frisco is the first chapter. The model is portable: a chapter would raise what a school's kits cost, and supplies would be bought locally in Andhra Pradesh. No second chapter has started.",
  },
  {
    id: 'teaching-and-access',
    when: 'Later',
    status: 'planned',
    heading: 'Teaching and Access',
    body: 'Neither pillar is running. Nothing has been delivered under either, and no school has received hardware from Vidora Foundation.',
  },
];
