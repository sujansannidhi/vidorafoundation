/**
 * Copy for the homepage.
 * Every string a visitor reads lives in src/content; nothing in
 * src/components or src/pages hardcodes copy.
 *
 * The order: the name, what the organisation works on, the turn, the film,
 * how it works, what it cost, how it grows, how to join, and the close.
 */

export const hero = {
  id: 'hero',
  /**
   * The name is the headline. It is split across the opening screen, the
   * first half top left and the second bottom right, and the screen reader
   * gets it as one heading.
   */
  wordLeft: 'Vidora',
  wordRight: 'Foundation',
  /** Short enough to sit under the name without competing with it. */
  intro:
    'High school students raise the money. The supplies are bought near the school, matched to each grade, and handed over in person.',
  where: 'Frisco, Texas · Andhra Pradesh, India',
  pill: { label: 'Start a chapter', href: '/join' },
  scrollCue: 'Scroll',
  /** Read once the photograph has opened to the full screen. */
  statement:
    'Vidora Foundation is run by high school students. Teachers tell us what a grade is missing. We buy it near the school and hand it to the students in person.',
  /** Used for the page description as well as on screen. */
  standfirst:
    'Vidora Foundation puts educational materials into the hands of students who need them, through chapters that raise for and run their own distributions.',
  proof:
    'In June 2026 the first Learning Kits campaign reached approximately 1,200 students across 12 government schools in Andhra Pradesh, for a total of about $3,500 in supplies.',
  photoCaption: 'June 2026. A government school in Narasaraopeta, Andhra Pradesh.',
  ctaPrimary: { label: 'See our impact', href: '/impact' },
  ctaSecondary: { label: 'Our work', href: '/programs' },
} as const;

export const work = {
  id: 'what-we-work-on',
  eyebrow: 'What we work on',
  headline: 'Three things a classroom needs. One of them is running today.',
  /**
   * One column per pillar, in pillar order. `pillar` is the slug in
   * pillars.ts, which is where the Active or Planned status comes from, so a
   * status cannot drift between this section and the programmes page.
   */
  items: [
    {
      pillar: 'learning-kits',
      heading: 'Resources',
      body: 'The state already provides uniforms, textbooks, bags and generic notebooks. It does not provide compass boxes, atlases, slates, or notebooks matched to a grade.',
      detail: 'Learning Kits fill that gap. Each kit is put together for one grade and bought at local prices near the school receiving it.',
      link: { label: 'How a kit is built', href: '/programs#learning-kits' },
    },
    {
      pillar: 'teaching',
      heading: 'Teaching',
      body: 'One teacher can only be in one place. More hands in the room would mean the students who need a second explanation get one.',
      detail: 'A teaching programme would place volunteers alongside classroom teachers. It is not running yet.',
    },
    {
      pillar: 'access',
      heading: 'Access',
      body: 'A working computer changes what a school can teach. Some schools do not have one.',
      detail: 'An access programme would put working computers in those schools. No school has received hardware yet.',
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
  eyebrow: string;
  headline: string;
  stages: HowStage[];
} = {
  id: 'how-it-works',
  eyebrow: 'How it works',
  headline: 'A chapter raises it. A student opens it.',
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
      heading: 'Reach the school',
      body: 'Supplies are bought in person near the school they are going to, at local prices, then handed over there. Nothing is shipped in from somewhere more expensive.',
    },
    {
      label: 'Stage four',
      heading: 'Expand opportunity',
      body: 'One chapter can supply a school, whether that school is in its own community or on the other side of the world. More chapters supply more schools, and the receipts get shared.',
      open: true,
    },
  ],
};

export const impactSection = {
  id: 'impact',
  eyebrow: 'Impact · June 2026',
  headline: 'What the first campaign cost, and what it reached.',
} as const;

/**
 * The film replaced the three pillars section, straight after the turning
 * point, and is the most prominent thing on the page after the hero.
 *
 * The clip is the promotional video cut short of its original end card. That
 * card carried an earlier name for the organisation, its mark, and a domain
 * this site does not use. The registered name is Vidora Foundation, so the
 * card is simply out of date.
 */
export const film = {
  id: 'the-day-itself',
  eyebrow: 'The day itself',
  headline: 'Nineteen seconds from the June 2026 distribution.',
  standfirst:
    'Filmed across the government schools that received the first Learning Kits, in Palnadu and Prakasam districts, Andhra Pradesh.',
  playLabel: 'Play the June 2026 distribution film, nineteen seconds',
  soundOn: 'Play with sound',
  soundOff: 'Mute',
  posterAlt:
    'Primary school students standing at their desks, holding up new notebooks and waving towards the camera.',
  caption: 'June 2026. Palnadu and Prakasam districts, Andhra Pradesh.',
  src: '/media/june-2026-distribution.mp4',
} as const;

export const chapterModel = {
  id: 'the-chapter-model',
  eyebrow: 'The chapter model',
  headline: 'One chapter can supply a school. More chapters supply more schools.',
  standfirst:
    "Frisco is the first chapter. The model is portable: a chapter raises what a school's kits cost, and the supplies are bought local to that school. Some chapters will serve schools in their own community, some will partner with schools abroad.",
} as const;

export const getInvolved = {
  id: 'get-involved',
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
      body: 'Money buys educational materials at local prices, near the school receiving them.',
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
