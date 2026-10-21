/**
 * Site-wide constants. Every string a visitor reads lives in src/content.
 * Nothing in src/components or src/pages hardcodes copy.
 */
import type { Photo } from './photos.ts';

export const org = {
  /** Operating name. Use this everywhere public. */
  name: 'Vidora Foundation',
  basedIn: 'Frisco, Texas',
  /**
   * Where the FIRST campaign ran. Deliberately not an `operationsIn` field:
   * that shape asserted the organisation has one permanent operating
   * location, which is the opposite of a chapter model. A chapter serves the
   * school it raises for, wherever that school is.
   */
  firstCampaignIn: 'Palnadu and Prakasam districts, Andhra Pradesh, India',
  tagline: 'Grade-specific school supplies, put into the hands of students who need them.',
  /** The line under the mark. Shorter than the tagline and never a claim. */
  motto: 'Opening paths to potential.',
  /** One sentence, for the footer and share cards. */
  summary:
    'Educational materials for students who need them, delivered by student-run chapters.',
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
  { href: '/partners', label: 'Partners' },
  { href: '/updates', label: 'Updates' },
  { href: '/join', label: 'Get involved' },
  { href: '/volunteer', label: 'Volunteer' },
] as const;

/**
 * The one call to action in the header. Held separately from `nav` so it
 * cannot be reordered into the middle of the link row: a page has one
 * primary action, repeated, not three competing ones.
 */
/** Donations go straight to the GoFundMe; there is no donate page. */
export const donateUrl = 'https://www.gofundme.com/f/vidora-learning-kits';

export const navCta = { href: donateUrl, label: 'Donate' } as const;

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
      { href: '/privacy', label: 'Privacy' },
    ],
  },
  {
    heading: 'Get involved',
    links: [
      { href: '/join', label: 'Start a chapter' },
      { href: '/volunteer', label: 'Volunteer' },
      { href: '/verify', label: 'Verify an hours letter' },
      { href: donateUrl, label: 'Donate' },
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
    body: 'Every student is treated with respect, in person and in how we tell their story.',
  },
  {
    name: 'Proximity',
    body: 'We work where we have real ties, close to the schools we serve.',
  },
  {
    name: 'Deference',
    body: 'Teachers and local partners decide what each grade needs.',
  },
  {
    name: 'Stewardship',
    body: 'We buy supplies at local prices and keep every receipt.',
  },
  {
    name: 'Honesty',
    body: 'We say plainly what we have done and what is still to come.',
  },
] as const;

/**
 * Open register, plan section 9. Anything unresolved renders as a visible
 * TodoNote in the interface rather than a silent blank or a plausible guess.
 * Fill the value in and the note disappears on its own.
 */
export const todos = {
  contactEmail: 'sujan@vidorafoundation.org' as string | null,
  socialHandles: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vidora-foundation/' },
    { label: 'Instagram', href: 'https://www.instagram.com/vidorafoundation/' },
  ] as { label: string; href: string }[] | null,
  newsletterProvider: null as string | null,
  gofundmeUrl: 'https://www.gofundme.com/f/vidora-learning-kits' as string | null,
  chapterProcess: null as string | null,
  /**
   * The chapter application form. The query string Google appends to a share
   * link (`usp=sharing`, and an `ouid` that is the sharing account's own
   * identifier) is stripped: it adds nothing for the applicant and publishing
   * an account id on a public page is not something to do by accident.
   */
  chapterFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSdQ-hP2prU0-PJnpOM6ScwEyDNg0jcathuX7rJ5AbVELSfGtA/viewform' as string | null,
  kitContentsByGrade: null as string | null,
  /** Organisations that have agreed to be listed. Details in content/partners.ts. */
  partners: [{ name: 'Sannidhi\u2019s Bakery', href: 'https://www.instagram.com/sannidhis_bakerytx/' }] as { name: string; href?: string }[] | null,
  /**
   * Consent to publish the June 2026 distribution photographs is confirmed,
   * and the cleared frames are in content/photos.ts. What is still missing is
   * the one stop nobody photographed: the wholesale market the supplies were
   * bought at. The field report says so rather than showing another market.
   */
  wholesaleMarketPhoto: null as Photo | null,
  schoolNamesPublishable: null as boolean | null,
  enrolmentFigurePublishable: null as boolean | null,
} as const;
