/**
 * The updates timeline. Three entries: what has been delivered, what is
 * next, and what is later.
 *
 * `status` is the same vocabulary as pillars.ts on purpose. Delivered means
 * it happened and there is a report. Planned means it has not, and every
 * Planned entry is written in the conditional so that reading the page
 * quickly still leaves the right impression.
 */

/**
 * Three states, because two were not enough once a campaign was underway.
 * `raising` is the honest middle: money is being collected and nothing has
 * been handed to a student yet, which is neither Delivered nor Planned.
 */
export type UpdateStatus = 'delivered' | 'raising' | 'planned';

export interface Update {
  id: string;
  /** When, in the reader's terms. "June 2026", "Next", "Later". */
  when: string;
  status: UpdateStatus;
  heading: string;
  body: string;
  /** Where the evidence for a delivered entry, or the ask for a live one, lives. */
  href?: string;
  linkLabel?: string;
  /** True when `href` leaves the site, so the link can be marked up as such. */
  external?: boolean;
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
    id: 'learning-kits-second',
    when: 'Now',
    status: 'raising',
    heading: 'Second Learning Kits campaign',
    body: 'Collecting funds now. The kits will go to more schools in India. Nothing has been distributed under this campaign yet, so there are no figures to publish for it.',
    href: 'https://www.gofundme.com/f/vidora-learning-kits',
    linkLabel: 'Give on GoFundMe',
    external: true,
  },
  {
    /* Deliberately unspecified. The campaign has been decided on in outline
       and not in contents, and naming items nobody has chosen would be an
       invention dressed as a plan. */
    id: 'local-texas-campaign',
    when: 'Later',
    status: 'planned',
    heading: 'A local campaign in Texas',
    body: "The chapter model works close to home as well as abroad. A Texas chapter would supply schools in its own community with materials that make school more enjoyable. What those materials would be has not been specified yet, and nothing has been raised or delivered for it.",
  },
  {
    id: 'teaching-and-access',
    when: 'Later',
    status: 'planned',
    heading: 'Teaching and Access',
    body: 'Neither pillar is running. Nothing has been delivered under either, and no school has received hardware from Vidora Foundation.',
  },
];
