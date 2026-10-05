/**
 * The Partners page copy. Every string a visitor reads lives in src/content.
 *
 * Two things this file is careful about, both of them plan section 8 rules:
 *
 *   1. No organisation is NAMED here. `name` is the kind of partner, not a
 *      company, and `status` is what is true today. The moment an
 *      organisation agrees in writing it goes into `todos.partners` in
 *      site.ts, which is the one place a real name may appear.
 *   2. `note` never carries a number that is not already sourced in
 *      impact.ts. Where a count belongs, the page reads the figure and this
 *      file holds only the words around it.
 */

export interface PartnerKind {
  /** Used as the anchor id and the React-free carousel key. */
  slug: string;
  /** The kind of partner. Never an organisation's name. */
  kind: string;
  /**
   * The headline on the card. Today every one of these is the same honest
   * statement, because no organisation has agreed to be listed. It is a
   * field rather than a constant so a single card can fill in on its own.
   */
  heading: string;
  /** What this partner actually does, year round. */
  body: string;
  /** Where the partnership stands. Rendered under a hairline. */
  note: string;
}

export const partnerKinds: PartnerKind[] = [
  {
    slug: 'schools',
    kind: 'Government schools',
    heading: 'Awaiting consent',
    body:
      'Schools across Palnadu and Prakasam that host distributions and tell us which grades to bring kits for.',
    note: 'Ongoing',
  },
  {
    slug: 'supply',
    kind: 'Supply partners',
    heading: 'Awaiting consent',
    body:
      'Wholesalers in Narasaraopeta who sell at local prices, so the buying happens in the district and nothing is shipped from the United States.',
    note: 'Ongoing, every campaign',
  },
  {
    slug: 'corporate',
    kind: 'Corporate partners',
    heading: 'Awaiting consent',
    body:
      "Companies that fund a school's kits outright, or match what a chapter raises. Receipts go back to the funder.",
    note: 'Open, enquiries welcome',
  },
  {
    slug: 'chapter',
    kind: 'Chapter hosts',
    heading: 'Awaiting consent',
    body:
      'High schools that host a chapter: a group of students who raise for and run a distribution.',
    note: 'Frisco, Texas, first chapter',
  },
  {
    slug: 'community',
    kind: 'Community organisations',
    heading: 'Awaiting consent',
    body:
      'Groups already working in the districts who introduce us to schools. An introduction is worth as much as a cheque.',
    note: 'Open, Palnadu and Prakasam',
  },
  {
    slug: 'inkind',
    kind: 'In-kind partners',
    heading: 'Awaiting consent',
    body:
      'Printing, transport, storage and design given at cost or free, so more of every dollar reaches materials.',
    note: 'Open, enquiries welcome',
  },
];

/**
 * What an enquiry gets, stated as commitments rather than benefits. Each
 * line is something a reader could hold the organisation to.
 */
export const enquiryPromises = [
  'We reply to every enquiry, including the ones we have to turn down.',
  'Your name goes on this page only if you ask for it.',
  'Receipts for anything you fund come back to you.',
] as const;

/**
 * What to put in the first email. The page asks for these in prose instead
 * of collecting them in a form: nothing on this site stores what a visitor
 * types, and a form that silently drops an enquiry is worse than no form.
 */
export const enquiryAsks = [
  'Your company or organisation, and who you are.',
  'Which of the six kinds above is closest to what you have in mind.',
  'A school, a district, or a grade, if you already have one in mind.',
] as const;
