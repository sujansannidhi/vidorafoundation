/**
 * Site-wide constants. Every string a visitor reads lives in src/content.
 * Nothing in src/components or src/pages hardcodes copy.
 */

export const org = {
  /** Operating name. Use this everywhere public. */
  name: 'Vidora Foundation',
  /** Registered legal entity. Only appears where the legal name is required. */
  legalEntity: 'Sambhav',
  basedIn: 'Frisco, Texas',
  /**
   * Where the FIRST campaign ran. Deliberately not an `operationsIn` field:
   * that shape asserted the organisation has one permanent operating
   * location, which is the opposite of a chapter model. A chapter serves the
   * school it raises for, wherever that school is.
   */
  firstCampaignIn: 'Palnadu and Prakasam districts, Andhra Pradesh, India',
  tagline: 'Grade specific school supplies, put into the hands of students who need them.',
  /** The line under the mark. Shorter than the tagline and never a claim. */
  motto: 'Opening paths to potential.',
  /** One sentence, for the footer and share cards. */
  summary:
    'Educational materials for students who need them, delivered by student run chapters.',
} as const;

/**
 * The 501(c)(3) line. One string, one component (PendingStatus.astro).
 * Plan section 8, rule 4: it cannot drift between pages.
 * Wording is fixed by the brand skill, Tier 3. Do not paraphrase.
 */
export const pendingStatusLine =
  "Vidora Foundation's application for 501(c)(3) tax-exempt status is pending. Contributions made now are not tax-deductible.";

export const nav = [
  { href: '/mission', label: 'Mission' },
  { href: '/programs', label: 'Programs' },
  { href: '/impact', label: 'Impact' },
  { href: '/people', label: 'People' },
  { href: '/updates', label: 'Updates' },
  { href: '/join', label: 'Get involved' },
] as const;

/**
 * The one call to action in the header. Held separately from `nav` so it
 * cannot be reordered into the middle of the link row: a page has one
 * primary action, repeated, not three competing ones.
 */
export const navCta = { href: '/donate', label: 'Donate' } as const;

export const footerNav = [
  {
    heading: 'The work',
    links: [
      { href: '/mission', label: 'Mission' },
      { href: '/programs', label: 'Programs' },
      { href: '/impact', label: 'Impact' },
      { href: '/campaigns/learning-kits-june-2026', label: 'June 2026 campaign' },
    ],
  },
  {
    heading: 'The organisation',
    links: [
      { href: '/people', label: 'People' },
      { href: '/partners', label: 'Partners' },
      { href: '/updates', label: 'Updates' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Get involved',
    links: [
      { href: '/join', label: 'Start a chapter' },
      { href: '/join#volunteer', label: 'Volunteer' },
      { href: '/donate', label: 'Donate' },
    ],
  },
] as const;

/**
 * What the organisation values. Five, each one line, each of them a rule
 * that can actually be broken. A value nobody could violate is decoration.
 */
export const values = [
  {
    name: 'Dignity',
    body: 'Students are the subject of their own sentences, in the copy and in the photographs.',
  },
  {
    name: 'Proximity',
    body: 'Work where there is a real connection, and say what that connection is.',
  },
  {
    name: 'Deference',
    body: 'Local partners and teachers make the local decisions about what a grade needs.',
  },
  {
    name: 'Stewardship',
    body: 'Receipts get shared. Every published number says what it counts and what it leaves out.',
  },
  {
    name: 'Honesty',
    body: 'A planned programme is labelled Planned. An unanswered question stays visibly open.',
  },
] as const;

/**
 * Open register, plan section 9. Anything unresolved renders as a visible
 * TodoNote in the interface rather than a silent blank or a plausible guess.
 * Fill the value in and the note disappears on its own.
 */
export const todos = {
  contactEmail: null as string | null,
  socialHandles: null as { label: string; href: string }[] | null,
  newsletterProvider: null as string | null,
  gofundmeUrl: null as string | null,
  chapterProcess: null as string | null,
  kitContentsByGrade: null as string | null,
  partners: null as { name: string; href?: string }[] | null,
  junePhotos: null as { src: string; alt: string; caption: string }[] | null,
  schoolNamesPublishable: null as boolean | null,
  enrolmentFigurePublishable: null as boolean | null,
} as const;
