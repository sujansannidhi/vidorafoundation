/**
 * Copy for the eleven section homepage narrative.
 * Every string a visitor reads lives in src/content; nothing in
 * src/components or src/pages hardcodes copy.
 *
 * The order is the argument: potential, what gets in the way, the turn,
 * what the organisation does, how it works, where, what it cost, how it
 * actually ran, how it grows, how to join, and the close.
 *
 * Section indices are the numerals printed at the top right of each band.
 * They are decorative. Screen readers get the heading, not the number.
 */

export const hero = {
  id: 'hero',
  index: '01',
  eyebrow: 'Government schools · Palnadu and Prakasam districts · Andhra Pradesh',
  /**
   * The claim is deliberately the opposite of the sector default. Most
   * education copy opens on scarcity. This opens on what a student already
   * brings, because that is both truer and the only version that leaves the
   * student the subject of the sentence.
   */
  headline: 'Every student arrives with potential.',
  headlineEmphasis: 'What they need is the material to use it.',
  standfirst:
    'Vidora Foundation puts educational materials into the hands of students in government schools in Andhra Pradesh who need them.',
  /** The proof, stated once at the top and expanded at sections 07 and 08. */
  proof:
    'In June 2026 the first Learning Kits campaign reached approximately 1,200 students across 12 schools, for a total of about $3,500 in supplies.',
  ctaPrimary: { label: 'See our impact', href: '/impact' },
  ctaSecondary: { label: 'Our work', href: '/programs' },
  scrollCue: 'Scroll',
} as const;

export const barriers = {
  id: 'what-gets-in-the-way',
  index: '02',
  eyebrow: 'What gets in the way',
  headline: 'A classroom can be full and still be short of what learning takes.',
  standfirst:
    'Students in Palnadu and Prakasam show up ready. Three things stand between them and the next step, and Vidora Foundation works on all three.',
  /**
   * One barrier per pillar, in pillar order. `pillar` is the slug in
   * pillars.ts, which is where the Active or Planned status comes from, so a
   * status cannot drift between this section and the programmes page.
   */
  items: [
    {
      number: '01',
      pillar: 'learning-kits',
      heading: 'Resources',
      body: 'A year of the syllabus assumes a student has certain materials in front of them. When those materials are not there the lesson still runs, and the student falls behind on something that could have been bought.',
      photo: 'Classroom, June 2026 distribution',
    },
    {
      number: '02',
      pillar: 'teaching',
      heading: 'Teaching',
      body: 'One teacher can only be in one place. More hands in the room would mean the students who need a second explanation get one.',
      photo: 'Teacher and students at work',
    },
    {
      number: '03',
      pillar: 'access',
      heading: 'Access',
      body: 'A working computer changes what a school can teach. Some schools do not have one.',
      photo: 'School building or grounds',
    },
  ],
} as const;

export const turn = {
  id: 'the-turning-point',
  eyebrow: 'The turning point',
  headline:
    'Hand a student the material their year asks for, and the potential takes it from there.',
  standfirst:
    'This is the whole idea. A specific thing a student is missing, bought at local prices and handed over.',
} as const;

export const whatWeDo = {
  id: 'what-we-do',
  index: '04',
  eyebrow: 'What Vidora Foundation does',
  headline: 'Three pillars. One of them is running.',
  body: [
    "Vidora Foundation is run by high school students in Frisco, Texas. The legal entity is registered as Sambhav. The work happens in government schools in Palnadu and Prakasam districts, Andhra Pradesh, where the founder's family has ties and the door opened easiest.",
    'Learning Kits has delivered. Teaching and Access are labelled Planned everywhere they appear, so a plan is never read as a promise.',
  ],
  /** Rendered where a Planned pillar would otherwise show a photograph. */
  noImageryNote: 'No imagery, because nothing has been delivered yet',
} as const;

export interface HowStage {
  label: string;
  heading: string;
  body: string;
  /**
   * The open ended stage. Its connector fades out rather than arriving at
   * the next node, because there is no fixed number of chapters.
   */
  open?: boolean;
}

export const howItWorks: {
  id: string;
  index: string;
  eyebrow: string;
  headline: string;
  stages: HowStage[];
} = {
  id: 'how-it-works',
  index: '05',
  eyebrow: 'How it works',
  headline: 'From a chapter in Texas to a desk in Andhra Pradesh.',
  stages: [
    {
      label: 'Stage one',
      heading: 'Understand the need',
      body: 'Teachers and local partners say what a grade is short of. They make the local decisions.',
    },
    {
      label: 'Stage two',
      heading: 'Build the right materials',
      body: 'Kits are assembled per grade rather than as one identical bundle, so what a student receives matches what their year requires.',
    },
    {
      label: 'Stage three',
      heading: 'Reach schools',
      body: 'Supplies are bought in person in Narasaraopeta at local wholesale prices, then distributed at the schools.',
    },
    {
      label: 'Stage four',
      heading: 'Expand opportunity',
      body: 'One chapter can supply a school. More chapters supply more schools, and the receipts get shared.',
      open: true,
    },
  ],
};

export const where = {
  id: 'where-we-work',
  index: '06',
  eyebrow: 'Where we work',
  from: {
    label: 'Where the chapter is',
    place: 'Frisco, Texas',
    body: "The first chapter. High school students raise what a school's kits cost.",
  },
  to: {
    label: 'Where the work is',
    place: 'Palnadu and Prakasam districts',
    body: 'Andhra Pradesh, India. Supplies are bought in Narasaraopeta, in the district, at local wholesale prices.',
  },
  note:
    "Money is raised in Texas. Supplies are bought in the district. The location is where the founder's family has ties and where the door opened easiest, not a claim that this region needs help more than anywhere else.",
} as const;

export const impactSection = {
  id: 'impact',
  index: '07',
  eyebrow: 'Impact · June 2026',
  headline: 'What the first campaign cost, and what it reached.',
} as const;

export const fieldReportSection = {
  id: 'field-report',
  index: '08',
  eyebrow: 'Field report · June 2026',
  headline: 'How the campaign actually ran.',
  standfirst:
    'Told as stops in the order the work happened. No testimonials appear here, because none have been collected with consent yet.',
  photoNote:
    'Photographs from the June 2026 distribution. Only images with confirmed consent are published.',
  photos: [
    'Distribution day, June 2026',
    'Buying supplies in Narasaraopeta',
    'Kits assembled by grade',
  ],
} as const;

export const chapterModel = {
  id: 'the-chapter-model',
  index: '09',
  eyebrow: 'The chapter model',
  headline: 'One chapter can supply a school. More chapters supply more schools.',
  standfirst:
    "Frisco is the first chapter. The model is portable: a chapter raises what a school's kits cost, and supplies are bought locally in Andhra Pradesh.",
} as const;

export const getInvolved = {
  id: 'get-involved',
  index: '10',
  eyebrow: 'Get involved',
  feature: {
    label: 'Start here',
    heading: 'Start a chapter at your school.',
    body: 'A chapter is a group at one high school that raises for and runs a distribution. It is the thing the organisation needs most.',
    cta: 'How a chapter works',
    href: '/join',
  },
  cards: [
    {
      heading: 'Volunteer',
      body: 'Help with a campaign, outreach, or the ambassador programme.',
      href: '/join#volunteer',
    },
    {
      heading: 'Donate',
      body: 'Money buys educational materials at local wholesale prices in the district.',
      href: '/donate',
    },
    {
      heading: 'Partner with us',
      body: 'For schools, businesses, and organisations who want to supply a distribution.',
      href: '/partners',
    },
  ],
} as const;

export const closing = {
  id: 'closing',
  headline: 'Opening paths to potential.',
  body:
    'Every student who received a kit in June 2026 was one specific material away from their next step. That is the work, and it is repeatable.',
  ctaPrimary: { label: 'Start a chapter', href: '/join' },
  ctaSecondary: { label: 'Donate', href: '/donate' },
} as const;
