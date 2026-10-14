/**
 * The Partners page copy. Every string a visitor reads lives in src/content.
 *
 * An organisation appears in `partners` only once it has agreed to be listed.
 * Organisations that have been contacted but have not agreed are prospects,
 * not partners, and never appear here (check-content-rules.mjs, rule 7).
 */

export interface Partner {
  slug: string;
  name: string;
  /** The kind of partnership, in a few words. */
  kind: string;
  where: string;
  /** What the partner does, in one sentence agreed with the organisation. */
  body: string;
  logo: { src: string; fallback: string; width: number; height: number };
  link: { href: string; label: string };
}

export const partners: Partner[] = [
  {
    slug: 'sannidhis-bakery',
    name: 'Sannidhi’s Bakery',
    kind: 'In-kind partner',
    where: 'Frisco, Texas',
    body: 'Supports the Frisco chapter with donated goods and sponsorship.',
    logo: {
      src: '/partners/sannidhis-bakery.webp',
      fallback: '/partners/sannidhis-bakery.png',
      width: 640,
      height: 391,
    },
    link: {
      href: 'https://www.instagram.com/sannidhis_bakerytx/',
      label: '@sannidhis_bakerytx on Instagram',
    },
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

/** The choices in the enquiry form's "kind of partnership" field. */
export const partnershipKinds = [
  'Funding a school’s kits',
  'Donated goods or services',
  'Supplies at local prices',
  'Hosting a chapter at a school',
  'Introductions to schools',
  'Something else',
] as const;

/**
 * The enquiry form posts to FormSubmit, which emails each submission to the
 * address below. Nothing is stored on this site.
 *
 * FormSubmit asks the receiving address to confirm itself once: the first
 * submission sends an activation email to this address, and enquiries are
 * delivered only after its link is clicked.
 */
export const enquiryForm = {
  to: 'sujan@vidorafoundation.org',
  subject: 'Partnership enquiry from vidorafoundation.org',
  /** Where a visitor without JavaScript lands after sending. */
  next: 'https://www.vidorafoundation.org/partners/thanks',
} as const;
