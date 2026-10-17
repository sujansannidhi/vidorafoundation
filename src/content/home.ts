/**
 * Copy for the homepage. Short on purpose: one heading and at most two
 * sentences per section, then a photo or a button. Every string a visitor
 * reads lives in src/content.
 */

export const hero = {
  title: 'Vidora Foundation',
  line: 'High school students getting school supplies into the hands of students who need them.',
  /** Used for the page description. */
  standfirst:
    'Vidora Foundation is a student-run nonprofit that puts grade-matched school supplies into the hands of students who need them.',
  primary: { label: 'Get involved', href: '/volunteer' },
  secondary: { label: 'Donate', href: '/donate' },
  photoAlt:
    'Students in a school veranda in Andhra Pradesh, each holding their new Learning Kit, with teachers and volunteers behind them.',
} as const;

export const about = {
  eyebrow: 'Who we are',
  title: 'Run by students, for students.',
  body: 'Teachers tell us what each grade is missing. Our chapters raise the money, buy the supplies near the school and hand them over in person.',
  cta: { label: 'Our mission', href: '/mission' },
} as const;

export const programs = {
  eyebrow: 'What we do',
  title: 'Three ways we help students.',
  items: [
    {
      tag: 'Running now',
      title: 'Learning Kits',
      body: 'Grade-matched supplies for government school students, bought near each school.',
      href: '/programs',
      linkLabel: 'See the program',
    },
    {
      tag: 'For US high schoolers',
      title: 'Open Paths',
      body: 'Run a book drive, build supply kits or read at your library, and earn a signed hours letter.',
      href: '/volunteer',
      linkLabel: 'Start volunteering',
    },
    {
      tag: 'At your school',
      title: 'Start a chapter',
      body: 'Bring a few friends together, raise for a school, and run your own distribution.',
      href: '/join',
      linkLabel: 'How chapters work',
    },
  ],
} as const;

export const impact = {
  eyebrow: 'Our first campaign',
  title: 'June 2026, Andhra Pradesh.',
  cta: { label: 'Read the field report', href: '/campaigns/learning-kits-june-2026' },
} as const;

export const gallery = {
  eyebrow: 'On the ground',
  title: 'Distribution day.',
  caption: 'June 2026, government schools in Palnadu and Prakasam districts, Andhra Pradesh.',
} as const;

export const partnersBlock = {
  eyebrow: 'Our partners',
  title: 'Supported by our community.',
  cta: { label: 'Become a partner', href: '/partners' },
} as const;

export const film = {
  eyebrow: 'Watch',
  title: 'Nineteen seconds from June 2026.',
  src: '/media/june-2026-distribution.mp4',
  poster: '/media/distribution-film-poster.jpg',
  label: 'The June 2026 distribution film, nineteen seconds',
} as const;

export const join = {
  title: 'Help a student start the year ready.',
  body: 'Volunteer where you live, start a chapter at your school, or give.',
  actions: [
    { label: 'Volunteer', href: '/volunteer', style: 'accent' },
    { label: 'Start a chapter', href: '/join', style: 'primary' },
    { label: 'Donate', href: '/donate', style: 'secondary' },
  ],
} as const;
