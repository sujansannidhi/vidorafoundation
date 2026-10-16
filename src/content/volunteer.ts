/**
 * Open Paths: Vidora Foundation's volunteer program for US high school
 * students. Every string a visitor reads about the program lives here, along
 * with the stable IDs, statuses and contracts that the Google backend
 * (Phase 1) and a database (Phase 2) share with the site.
 *
 * Do not rename an event ID, a status or an ID format: the Sheet, issued
 * hours letters and /verify all depend on them.
 *
 * check-content-rules.mjs, Rule 12, validates the events, credits and caps
 * below, and keeps PVSA wording confined to this file.
 */

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type EventMode = 'virtual' | 'local' | 'either';

export interface CreditBand {
  min: number;
  /** null on the last band: "or more". */
  max: number | null;
  hours: number;
}

export interface CreditTask {
  id: string;
  label: string;
  hours: number;
  proof: string;
}

export type Credit =
  | { kind: 'fixed'; hours: number; per: string }
  | { kind: 'bands'; unit: string; bands: CreditBand[] }
  | { kind: 'tasks'; tasks: CreditTask[] };

export interface CapRule {
  perMonth?: number;
  perDays?: number;
  perSchoolYear?: number;
  hoursPerMonth?: number;
}

export interface OpenPathsEvent {
  /** EVT-*, matches the Sheet's Events tab. */
  id: string;
  /** /volunteer/events/<slug> */
  slug: string;
  name: string;
  mode: EventMode;
  /** One sentence, for cards. */
  summary: string;
  eligibility?: string;
  steps: string[];
  whereItGoes: string;
  partnerRequired: boolean;
  proof: string[];
  credit: Credit;
  creditNote?: string;
  /** Human sentence. */
  cap: string;
  /** Machine-readable, used by the rules check and the backend. */
  capRule: CapRule;
  safety: string[];
  exampleCaption: string;
  /** Optional line that connects the event to existing work. */
  context?: { text: string; href: string; linkLabel: string };
  /** True when the page links to /donate and must show the pending status. */
  linksToDonate?: boolean;
  /** True when the page links to the Study Library. */
  linksToStudyLibrary?: boolean;
}

/* ------------------------------------------------------------------ *
 * Program
 * ------------------------------------------------------------------ */

export const modeLabels: Record<EventMode, string> = {
  virtual: 'Online',
  local: 'In your town',
  either: 'Online or in your town',
};

export const openPaths = {
  name: 'Open Paths',
  hashtag: '#OpenPathsVidora',
  who: 'High school students in grades 9 to 12, including homeschool students, living in the United States.',
  consent:
    'Every volunteer registers with a parent or guardian, who confirms by email before the account is active.',
  caps: { hoursPerMonth: 12, hoursPerSchoolYear: 60, schoolYear: 'August 1 to July 31' },
  howItWorks: [
    "Register once, with a parent or guardian's consent.",
    "Pick an event from this month's Drop.",
    'Do the work, in your own town or online.',
    'Submit your proof. Once it is approved, a signed hours letter is emailed to you and your parent or guardian.',
  ],
  drops:
    'Events open in monthly Drops with a fixed number of places, so every submission is reviewed on time. When a Drop is full it closes, and the next one opens on the 1st of the following month.',
  // TODO(mani): confirm first Drop. Plan proposes { name: 'November Drop', opens: '2026-11-16', closes: '2026-11-30', places: 75 }.
  currentDrop: null as { name: string; opens: string; closes: string; places: number } | null,
  counselorNote:
    'Check with your counselor before you start. Schools, districts, honor societies and scholarship programs each decide which hours they accept. Some do not count donated items, some need an adult who is not a family member to sign, and some need approval before you begin. Show them the event page first.',
  chapterFunnel:
    'Three or more volunteers at the same school is the start of a chapter. Volunteers who have completed two events are invited to apply.',
  timeline: [
    "Submit by the last day of the Drop's month.",
    'You get a decision within 10 days of the month ending.',
    'If a reviewer asks for more information, you have one chance to reply, within 7 days.',
    'Hours letters are emailed by the 15th of the following month.',
  ],
  originality:
    'Your work has to be your own. Writing and study resources made with AI tools are not accepted; spelling and grammar checkers are fine. Reviewers check version history.',
  fraud:
    'A falsified submission is rejected with a warning. A second leads to suspension, and any certificates it touched are revoked, which the verify page will show.',
  socialOptional:
    'Posting about your event is optional and never affects your hours. If you post, tag @vidorafoundation and use #OpenPathsVidora.',
  coreTeam: {
    name: 'Content Crew',
    body: "Two to four students who run Vidora's Instagram and TikTok and choose which volunteer posts to share. It needs account access, so it is by application through the contact page, not a Drop event.",
    href: '/contact',
    linkLabel: 'Apply through the contact page',
  },
};

/**
 * Google Forms built in Prompt 2. Each is null until the backend exists.
 * Strip `usp` and `ouid` from any share URL before pasting it here.
 */
export const forms = {
  // TODO(mani): F1 Volunteer Registration form URL.
  register: null as string | null,
  // TODO(mani): F2 Event Sign-up form URL.
  signup: null as string | null,
  // TODO(mani): F2's `entry.NNNN` key for the event field, used to prefill it.
  signupEventField: null as string | null,
  // TODO(mani): F3 Partner Confirmation form URL.
  partnerConfirm: null as string | null,
  // TODO(mani): F4 Hours Submission form URL.
  submit: null as string | null,
  // TODO(mani): F5 Partner Completion form URL.
  partnerComplete: null as string | null,
};

// TODO(mani): Apps Script web app URL that answers /verify.
export const verifyEndpoint = null as string | null;

// TODO(mani): shared Google Drive folder for the Study Library.
export const studyLibraryUrl = null as string | null;

// TODO(mani): adult officer who signs letters; never a parent of the volunteer.
export const signatory = null as { name: string; title: string } | null;

/** No deductibility wording here. That stays in site.ts. */
export const letterStatusLine =
  "Vidora Foundation's application for 501(c)(3) tax-exempt status is pending.";

// TODO(mani): recheck before each Drop.
export const pvsa = {
  text: "The President's Volunteer Service Award has been paused by AmeriCorps since May 27, 2025, and is not taking award orders. Vidora is not a PVSA certifying organization, and Open Paths tiers are Vidora's own recognition.",
  source: 'https://presidentialserviceawards.gov/',
  checkedOn: '2026-10-15',
};

/**
 * What a visitor sees where a form or service is not live yet. Plain public
 * wording: the gap is stated, nothing is invented, and the open register in
 * the README tracks each one.
 */
export const comingSoon = {
  register: 'Registration opens with the first Drop.',
  signup: 'Sign-up for this event opens with the first Drop.',
  partnerConfirm: 'The Partner Confirmation form opens with the first Drop.',
  partnerComplete: 'The Partner Completion form opens with the first Drop.',
  submit: 'Submissions open with the first Drop.',
  drop: 'Dates and places for the first Drop will be posted here.',
  verify: 'Online certificate lookup opens when the first letters are issued. Until then, email us with the Certificate ID and we will confirm it within 7 days.',
  studyLibrary: 'The Study Library opens with the first approved resources.',
  signatory: 'The adult who signs letters will be named here before the first letters are issued.',
};

export const tiers = [
  {
    name: 'Bronze',
    hours: 10,
    line: '10 verified hours across at least two event types. Digital badge and tier certificate.',
  },
  {
    name: 'Silver',
    hours: 25,
    line: "25 verified hours, including at least one local event (book drive, supply drive or story time). Badge and certificate, and an invitation to be featured on Vidora's Instagram, with consent.",
  },
  {
    name: 'Gold',
    hours: 50,
    line: "50 verified hours, including either a chapter application through Outreach Ambassador or three local events. Badge, certificate, a signed letter from Vidora's leadership describing your work, and first invitation to the Content Crew or chapter leadership.",
  },
];

/** What every hours letter includes. */
export const letterContents = [
  'Vidora letterhead.',
  'A Certificate ID and the verify address.',
  "The volunteer's full name, grade and school.",
  'Total hours and the date range.',
  'Each activity, with its dates and a one-line description.',
  "A statement that hours use Vidora's published credits and reflect organizing and service time, not the value of donated items.",
  'A statement that the service was outside the school day.',
  letterStatusLine,
  'A statement that Vidora is not a PVSA certifying organization.',
  'The signature, name, title, email and phone of the adult signatory.',
];

/** Bracketed placeholders stay literal so nobody mistakes this for a real letter. */
export const sampleLetter = [
  'Verified Volunteer Service Letter. Certificate ID OP-2611-0042-K7QD. Verify at vidorafoundation.org/verify.',
  '[Date signed]',
  'This letter confirms that [Volunteer full name], a [grade] grade student at [School, City, State], completed [X] hours of unpaid volunteer service with Vidora Foundation’s Open Paths program between [start date] and [end date].',
  'Activities: [Event name, date or dates, one-line description, for example "Planned, collected, sorted and delivered 143 books to a recipient-confirmed school library"].',
  "Hours are credited using Vidora's published hour credits for each activity, based on evidence Vidora reviewed. They reflect the volunteer's organizing and service time only, not the value of any donated items. All service took place outside the school day.",
  `${letterStatusLine} Vidora is not a President's Volunteer Service Award certifying organization.`,
  '[Signature], [Adult signatory name], [Title], Vidora Foundation, [email], [phone]',
];

/* ------------------------------------------------------------------ *
 * The six launch events, in site order
 * ------------------------------------------------------------------ */

const DRIVE_SAFETY = [
  "Bins only in public places, with the site's permission.",
  'No door-to-door collecting.',
  'A parent or guardian handles any driving.',
  'Check every book for condition and age range.',
];

export const events: OpenPathsEvent[] = [
  {
    id: 'EVT-ARTICLE',
    slug: 'field-notes-article',
    name: 'Field Notes Article',
    mode: 'virtual',
    summary:
      'Write an original 600 to 900 word article about how students in your town get what they need to learn, or go without it.',
    steps: [
      "Choose one: a local story about how a library, school or tutoring program serves students where you live, or an explainer that connects Vidora's June 2026 Learning Kits campaign to an education question in your town.",
      'For a local story, interview at least one adult educator or librarian who agrees to be named and quoted, in a public place or by school email or phone.',
      'Write it in a Google Doc from the first draft, so the version history shows your work.',
      'Share the Doc with comment access and submit it with a three-sentence reflection.',
    ],
    whereItGoes:
      'To Vidora. With your permission, selected articles are published on the Updates page under your first name and city. You can also offer it to your school newspaper.',
    partnerRequired: false,
    proof: [
      'Google Doc link with comment access and version history intact.',
      'The name and role of anyone you quote.',
      'A three-sentence reflection.',
    ],
    credit: { kind: 'fixed', hours: 3, per: 'approved article' },
    cap: 'One article a month and three a school year.',
    capRule: { perMonth: 1, perSchoolYear: 3 },
    safety: [
      'Interview adults only.',
      'Do not name or photograph anyone under 18.',
      'AI-written drafts are not accepted; spelling and grammar checkers are fine.',
    ],
    exampleCaption:
      "I interviewed my school librarian about why free books matter, and wrote it up for @vidorafoundation's Field Notes. #OpenPathsVidora",
  },
  {
    id: 'EVT-BOOKS',
    slug: 'book-drive',
    name: 'Local Book Drive',
    mode: 'local',
    summary:
      'Run a one to three week book drive and deliver the books to a school, shelter or library in your community that agreed to take them.',
    steps: [
      'Find your recipient first. In order of preference: a Title I school library or classroom, a family shelter, a Little Free Library steward, then a public library. Many public libraries sell donated books to raise money rather than shelving them, so ask.',
      'Send the recipient the Partner Confirmation form. An adult there confirms what they accept: ages, condition and how many.',
      'Get permission to put a collection bin at your school, a library lobby, a place of worship or a community center.',
      'Collect for one to three weeks, then sort out anything the recipient said it cannot use.',
      'Deliver the books and ask the recipient to confirm with the Partner Completion form.',
    ],
    whereItGoes: 'The recipient you confirmed, in your own community.',
    partnerRequired: true,
    proof: [
      'Your Partner Confirmation ID.',
      "Two to four photos showing the bin or flyer, the sorted books and the delivery, with no children's faces.",
      'Confirmation from the recipient, through the Partner Completion form or their own receipt.',
    ],
    credit: {
      kind: 'bands',
      unit: 'books delivered',
      bands: [
        { min: 25, max: 74, hours: 4 },
        { min: 75, max: 149, hours: 6 },
        { min: 150, max: null, hours: 8 },
      ],
    },
    creditNote: 'Hours credit your planning, collecting, sorting and delivering, not the books themselves.',
    cap: 'One drive every 60 days. Up to three students can run a drive together, and each submits separately.',
    capRule: { perDays: 60 },
    safety: DRIVE_SAFETY,
    exampleCaption:
      "143 books delivered to a school library near us. Ran this drive with two friends through @vidorafoundation's Open Paths. #OpenPathsVidora",
  },
  {
    id: 'EVT-KITS',
    slug: 'learning-kit-supply-drive',
    name: 'Learning Kit Supply Drive',
    mode: 'local',
    summary:
      'Collect and assemble school supply kits for a school, after-school program or shelter in your community, built to the list the recipient gives you.',
    steps: [
      'Confirm a recipient first with the Partner Confirmation form. At a school, ask the counselor or family engagement staff rather than an individual teacher.',
      'Ask the recipient what each kit should hold. If they have no list, use the standard kit: one notebook, one pack of pencils, one pack of crayons or coloured pencils, one eraser, a glue stick or a ruler, and a pouch or zip bag.',
      'Collect the supplies, assemble the kits and deliver them.',
      'Ask the recipient to confirm with the Partner Completion form.',
    ],
    whereItGoes: 'The recipient you confirmed, in your own community.',
    partnerRequired: true,
    proof: [
      'Your Partner Confirmation ID.',
      "Photos of the assembled kits with the count visible, and of the delivery, with no children's faces.",
      'Confirmation from the recipient.',
    ],
    credit: {
      kind: 'bands',
      unit: 'kits delivered',
      bands: [
        { min: 10, max: 24, hours: 4 },
        { min: 25, max: 49, hours: 6 },
        { min: 50, max: null, hours: 8 },
      ],
    },
    creditNote: 'Hours credit your organizing and assembly, not the supplies themselves.',
    cap: 'One drive every 60 days.',
    capRule: { perDays: 60 },
    safety: [
      'The same rules as a book drive: bins only in public places with permission, no door-to-door collecting, and a parent or guardian handles any driving.',
      "Do not collect cash. If someone wants to give money, point them to Vidora's Donate page.",
    ],
    context: {
      text: "This is the local, US version of the idea behind Vidora's Learning Kits.",
      href: '/programs',
      linkLabel: 'About Learning Kits',
    },
    linksToDonate: true,
    exampleCaption:
      "Same idea as @vidorafoundation's Learning Kits, for students in my city. 32 kits delivered today. #OpenPathsVidora",
  },
  {
    id: 'EVT-STUDY',
    slug: 'study-guide-studio',
    name: 'Study Guide Studio',
    mode: 'virtual',
    summary:
      'Make a free study resource for one grade and topic: a study guide, a flashcard set or a one-page infographic.',
    steps: [
      'Choose a grade and topic, and name the standard or textbook chapter it covers.',
      'Make one of: a two to four page study guide, a set of at least 30 flashcards with an answer key, or a one-page infographic.',
      'Build it in Google Docs, Slides or Quizlet so the version history shows your work.',
      'Submit the link with a note on who it is for.',
    ],
    whereItGoes:
      "Vidora's Study Library, free for anyone to use. You can also offer it to a teacher, tutoring center or library near you.",
    partnerRequired: false,
    proof: [
      'The link, with version history.',
      'A note on the grade and topic.',
      'Reviewers check three items for accuracy.',
    ],
    linksToStudyLibrary: true,
    credit: { kind: 'fixed', hours: 2, per: 'approved resource' },
    cap: 'Two a month.',
    capRule: { perMonth: 2 },
    safety: ['Original work only.', 'No copied textbook pages.', 'AI-generated content is not accepted.'],
    exampleCaption:
      "Made a free Algebra 1 factoring guide for @vidorafoundation's Study Library. #OpenPathsVidora",
  },
  {
    id: 'EVT-STORY',
    slug: 'library-story-time',
    name: 'Library Story Time',
    mode: 'local',
    summary:
      'Read aloud or run a literacy activity at a library or school session that staff schedule and supervise.',
    steps: [
      'Ask a children’s librarian or school library staff member whether you can read at an existing session.',
      'Send them the Partner Confirmation form. They agree to supervise and to confirm you attended.',
      'Prepare, then read or run the activity with staff in the room the whole time.',
      'Ask the staff member to confirm with the Partner Completion form, and submit a three-sentence reflection.',
    ],
    whereItGoes: "The library or school's existing children's or literacy program.",
    partnerRequired: true,
    proof: [
      'Your Partner Confirmation ID.',
      "The staff member's Partner Completion confirmation.",
      'A three-sentence reflection.',
    ],
    credit: { kind: 'fixed', hours: 1.5, per: 'supervised session' },
    creditNote: 'One hour on site and half an hour of preparation.',
    cap: 'Four sessions a month.',
    capRule: { perMonth: 4 },
    safety: [
      'Staff are present the whole time.',
      'No photos of children.',
      'Do not exchange contact details with children or families.',
      'Recorded read-aloud videos are not part of Open Paths.',
    ],
    exampleCaption: 'Read at the Saturday story time at my public library today. #OpenPathsVidora',
  },
  {
    id: 'EVT-AMB',
    slug: 'outreach-ambassador',
    name: 'Outreach Ambassador',
    mode: 'either',
    eligibility: 'Open once you have completed one other Open Paths event.',
    summary: 'Bring Open Paths and Vidora chapters to more schools, libraries and students.',
    steps: [],
    whereItGoes: 'New partners, new volunteers and new chapters.',
    partnerRequired: false,
    proof: [],
    credit: {
      kind: 'tasks',
      tasks: [
        {
          id: 'present',
          label: "Present Vidora to a school club or class, with the teacher's permission.",
          hours: 1,
          proof: 'The teacher confirms through the Partner Completion form.',
        },
        {
          id: 'partner',
          label: 'Recruit a new library, school or shelter that completes a Partner Confirmation.',
          hours: 1,
          proof: 'The new Partner Confirmation ID.',
        },
        {
          id: 'referrals',
          label: 'Refer three volunteers, using your volunteer ID as a referral code, who each complete an event.',
          hours: 1,
          proof: 'Tracked automatically.',
        },
        {
          id: 'chapter',
          label: 'Submit a complete application to start a Vidora chapter at your school.',
          hours: 2,
          proof: 'The chapter application.',
        },
      ],
    },
    cap: 'Up to six hours a month.',
    capRule: { hoursPerMonth: 6 },
    safety: [
      'Present only with a teacher in the room.',
      'Contact organisations through their public or work email, not personal accounts.',
    ],
    exampleCaption: "Presented @vidorafoundation to our school's service club today. #OpenPathsVidora",
  },
];

/* The Ambassador's steps and proof are its tasks; derived, not retyped. */
for (const event of events) {
  if (event.credit.kind === 'tasks') {
    if (event.steps.length === 0) event.steps = event.credit.tasks.map((t) => t.label);
    if (event.proof.length === 0) event.proof = event.credit.tasks.map((t) => `${t.label.replace(/\.$/, '')}: ${t.proof}`);
  }
}

/* ------------------------------------------------------------------ *
 * Rendering helpers for credits (copy, not markup)
 * ------------------------------------------------------------------ */

const hoursWord = (n: number): string => (n === 1 ? 'hour' : 'hours');

/** Short credit label for cards: "3 hours", "4 to 8 hours", "1 to 2 hours a task". */
export function creditShort(credit: Credit): string {
  if (credit.kind === 'fixed') return `${credit.hours} ${hoursWord(credit.hours)}`;
  if (credit.kind === 'bands') {
    const hs = credit.bands.map((b) => b.hours);
    return `${Math.min(...hs)} to ${Math.max(...hs)} hours`;
  }
  const hs = credit.tasks.map((t) => t.hours);
  return `${Math.min(...hs)} to ${Math.max(...hs)} hours a task`;
}

/** Unit column for the hours table. */
export function creditUnit(credit: Credit): string {
  if (credit.kind === 'fixed') return `Per ${credit.per}`;
  if (credit.kind === 'bands') return `By ${credit.unit}`;
  return 'Per task';
}

export function bandRange(band: CreditBand): string {
  return band.max === null ? `${band.min} or more` : `${band.min} to ${band.max}`;
}

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export interface FaqItem {
  q: string;
  a: string[];
  link?: { href: string; label: string };
}

export const faq: { id: string; heading: string; items: FaqItem[] }[] = [
  {
    id: 'students',
    heading: 'Students',
    items: [
      { q: 'Will my hours count at my school?', a: [openPaths.counselorNote] },
      {
        q: 'Can I run an event with friends?',
        a: [
          'Drives can be run by up to three students. Each of you submits separately, with the same Partner Confirmation ID, and describes your own part. Other events are individual.',
        ],
      },
      {
        q: 'How many hours can I earn?',
        a: [
          `Each event has a fixed, published credit. Across all events you can earn up to ${openPaths.caps.hoursPerMonth} hours a month and ${openPaths.caps.hoursPerSchoolYear} hours a school year, which runs ${openPaths.caps.schoolYear}.`,
        ],
        link: { href: '/volunteer/hours', label: 'How hours work' },
      },
      { q: 'What if my submission needs more information?', a: openPaths.timeline },
      { q: 'Can I use AI?', a: [openPaths.originality] },
      {
        q: "I'm in middle school, or I live outside the US.",
        a: ['Open Paths is not open to you yet. It is for high school students in grades 9 to 12 living in the United States.'],
      },
      { q: 'Do I have to post on social media?', a: [openPaths.socialOptional] },
    ],
  },
  {
    id: 'parents',
    heading: 'Parents and guardians',
    items: [
      {
        q: 'What do you collect about my child?',
        a: [
          "Your child's name, email, grade, school, city and state, and your name and email. We never ask for a date of birth, home address or phone number, and photos of your child's face are never required.",
        ],
      },
      {
        q: 'Who reviews submissions?',
        a: ["Student reviewers on Vidora's team, working from a checklist. An adult signs every letter."],
      },
      {
        q: 'Will Vidora post about my child?',
        a: [
          'Only with separate consent from your child and from you. Volunteers are credited by first name and city, or by handle, never by full name with school, and a post is removed within 48 hours if you ask.',
        ],
      },
      {
        q: 'Will anyone contact my child directly?',
        a: [
          'Vidora writes by email and copies you on approvals. Vidora never messages volunteers first on social media.',
        ],
      },
      {
        q: 'Is Vidora at local events?',
        a: [
          "No. Local events are organized by your child under the host site's rules. Bins go only in public places with permission, there is no door-to-door collecting, a parent or guardian handles any driving, and staff supervise every story time.",
          'Your child agrees to these rules in a participation agreement when they register.',
        ],
      },
      {
        q: 'How do we withdraw?',
        a: [
          'Email us. Your data is deleted on request, except the records of certificates already issued, which are kept so those letters can still be verified.',
        ],
      },
    ],
  },
  {
    id: 'schools',
    heading: 'Schools and counselors',
    items: [
      {
        q: 'Who signs the letters?',
        a: ['An adult officer of Vidora, never a parent of the volunteer.'],
      },
      {
        q: 'How do I check a letter?',
        a: [
          'Enter the Certificate ID on the verify page, or email us with it. We reply within 7 days.',
        ],
        link: { href: '/verify', label: 'Verify an hours letter' },
      },
      { q: "What is Vidora's status?", a: [letterStatusLine] },
      {
        q: 'How are hours calculated?',
        a: [
          "From fixed credits published for each event, based on evidence Vidora reviews. Hours reflect the student's organizing and service time, never the value of donated items.",
        ],
        link: { href: '/volunteer/hours', label: 'The hour credit table' },
      },
      { q: 'Does any of this happen during school?', a: ['No. All Open Paths service takes place outside the school day.'] },
      { q: 'What about the PVSA?', a: [pvsa.text] },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * For libraries, schools and other recipients
 * ------------------------------------------------------------------ */

export const partnersCopy = {
  title: 'For libraries and schools',
  standfirst:
    'Open Paths volunteers run book drives, build supply kits and read at story times for recipients in their own community that agree in advance.',
  whoFor:
    'School and public libraries, schools, family shelters, Little Free Library stewards and after-school programs.',
  whatVolunteersDo: [
    'Collect books you said you can use, and deliver them sorted.',
    'Assemble school supply kits to your list.',
    'Read or run a literacy activity at a session your staff supervise.',
  ],
  whatWeAsk: [
    'Confirm in advance what you can accept. It takes about two minutes.',
    'Confirm completion afterwards.',
    'You can say no to anything.',
  ],
  whatToExpect: [
    "Volunteers follow your site's rules.",
    'No cash is collected.',
    'Nothing arrives that you did not agree to.',
  ],
  listingNote:
    'Hosting an Open Paths volunteer does not put your organisation on our Partners page. That page lists only organisations that have agreed to be listed.',
};

export const partnerRequestEmail = {
  subject: 'Student [book drive / supply drive / story time] for [Organisation]',
  body: "Hi [Name], I'm [first name], a [grade] grade student at [school]. Through Vidora Foundation's Open Paths program, I would like to [run a book drive for / collect school supply kits for / read at a story time for] [Organisation] from [dates]. Could you confirm what you can accept, or whether a session would work, using this two-minute form: [Partner Confirmation link]? When it is done you will get one more short form to confirm it happened. Thank you, [first name]",
};

/* ------------------------------------------------------------------ *
 * Page copy for the volunteer section
 * ------------------------------------------------------------------ */

export const hub = {
  eyebrow: 'Open Paths',
  title: 'Volunteer where you live.',
  standfirst:
    'Open Paths is Vidora’s volunteer program for US high school students. Run a book drive, build supply kits, write for Field Notes or read at your library, then submit proof online for an hours letter signed by an adult at Vidora.',
  description: 'Open Paths: volunteer events for US high school students, with hours letters signed by an adult at Vidora.',
  followLabel: 'Follow Vidora on Instagram for each new Drop',
};

export const registerPage = {
  title: 'Register for Open Paths',
  description: 'What you need to register for Open Paths, what is collected, and how parent consent works.',
  needs: ["A parent or guardian's email.", 'The name of your school.', 'About five minutes.'],
  consentSteps: [
    'You fill in the registration form, including your parent or guardian’s name and email.',
    'Your parent or guardian gets an email with a one-time link.',
    'When they confirm, your account is active and you can sign up for events.',
  ],
  agreement: [
    "Events are organized by you, under the host site's rules.",
    'Vidora does not supervise on site.',
    'The safety rules for each event apply.',
    'Consent to photos or posts about you is separate and optional.',
  ],
  // TODO(mani): full participation agreement text after legal review.
};

export const submitPage = {
  title: 'Submit your proof',
  description: 'How to submit proof for an Open Paths event, and when you will hear back.',
  fileRules:
    'Share links with comment access. File uploads in Google Forms need a Google sign-in, which many school accounts block, so links work better.',
  partnerReminder:
    "Local events need the recipient's Partner Completion confirmation before they can be approved.",
};

export const hoursPage = {
  title: 'How hours work',
  description: 'The hour credit for every Open Paths event, the caps, the review timeline and what every letter includes.',
};

export const faqPage = {
  title: 'Open Paths questions',
  description: 'Answers for students, parents and guardians, and school counselors about Open Paths.',
};

export const verifyPage = {
  title: 'Verify an hours letter',
  description: 'Check an Open Paths hours letter by its Certificate ID.',
  intro:
    'Enter the Certificate ID printed on the letter. The result shows the volunteer’s first name and last initial, the hours, the activities, the issue date and whether the certificate is valid.',
  label: 'Certificate ID',
  button: 'Check',
  checking: 'Checking…',
  valid: 'Valid',
  revoked: 'Revoked',
  revokedNote: 'This certificate has been revoked and should not be relied on.',
  notFound: 'No certificate matches that ID. Check it against the letter, or email us and we will look it up.',
  invalid: 'That does not look like a Certificate ID. It has the form OP-2611-0042-K7QD.',
  networkError: 'The lookup service could not be reached. Try again in a minute, or email us with the ID.',
  hoursWord: 'hours',
  issued: 'issued',
};

export const privacyPage = {
  title: 'Privacy',
  eyebrow: 'Vidora Foundation',
  programHeading: 'Open Paths volunteer program',
  enquiryHeading: 'Partnership enquiries',
  description: 'How Vidora Foundation handles information for the Open Paths volunteer program.',
  sections: [
    {
      heading: 'What we collect',
      body: [
        "For each volunteer: name, email, grade, school, city and state, and a parent or guardian's name and email. For recipients: the organisation's name and address, and a staff contact's name, title and work email.",
        'We never ask for a date of birth, a home address or a phone number from a volunteer, and photos of a volunteer’s face are never required.',
      ],
    },
    {
      heading: 'Why',
      body: ['To run events, review submissions and issue hours letters.'],
    },
    {
      heading: 'Who sees it',
      body: [
        'Named Vidora reviewers, in a private spreadsheet. Evidence and letters are kept in a private folder.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'Evidence is kept for 24 months after a letter is issued. Certificate records are kept so letters can still be verified. Everything else is deleted on request.',
      ],
    },
    {
      heading: 'Photos and posts',
      body: [
        'Featuring a volunteer needs two separate opt-ins, one from the volunteer and one from a parent or guardian. Anything posted is removed within 48 hours on request.',
      ],
    },
    {
      heading: 'Withdrawing',
      body: ['Email us and we will remove your information, apart from records of certificates already issued.'],
    },
  ],
  // TODO(mani): full site privacy policy, after legal review.
  fullPolicy: 'A full privacy policy for the whole site will be published here.',
};

export const joinOpenPaths = {
  eyebrow: 'Open Paths',
  heading: 'Volunteer from anywhere in the US',
  body: 'Six events you can run in your own town or online, each with a fixed number of hours and a letter signed by an adult at Vidora. Not ready to start a chapter? Start here.',
  labels: ['Write', 'Collect', 'Read'],
  cta: 'See Open Paths',
  href: '/volunteer',
};

/** Headings, labels and short connective copy used across the pages. */
export const ui = {
  dropHeading: "This month's Drop",
  places: 'places',
  to: 'to',
  eventsHeading: 'Events',
  howHeading: 'How it works',
  whoHeading: 'Who can join',
  beforeYouStart: 'Before you start',
  register: 'Register',
  registerInfo: 'What you need to register',
  hoursHeading: 'Hours and recognition',
  howHoursWork: 'How hours work',
  furtherHeading: 'Going further',
  startChapter: 'Start a chapter',
  faq: 'FAQ',
  forPartners: 'For libraries and schools',
  verify: 'Verify an hours letter',
  privacy: 'Privacy',
  allEvents: 'All Open Paths events',
  eligibility: 'Eligibility',
  whatYouDo: 'What you do',
  whereItGoes: 'Where it goes',
  proof: 'Proof you submit',
  hours: 'Hours',
  limits: 'Limits',
  safety: 'Safety rules',
  exampleCaption: 'Example caption',
  recipientFirst: 'Line up your recipient first',
  recipientIntro: 'Send something like this to an adult at your recipient, then share the Partner Confirmation form with them.',
  emailTemplate: 'Email template',
  subject: 'Subject',
  signUp: 'Sign up for this event',
  partnerConfirmLink: 'Partner Confirmation form',
  partnerCompleteLink: 'Partner Completion form',
  quantity: 'Quantity',
  task: 'Task',
  proofCol: 'Proof',
  event: 'Event',
  unit: 'Credit',
  cap: 'Limit',
  needHeading: 'What you need',
  collectHeading: 'What is collected, and why',
  consentHeading: 'How parent consent works',
  agreementHeading: 'The participation agreement',
  agreementNote: 'You agree to the full participation agreement when you register.',
  privacyLink: 'How we handle your information',
  timelineHeading: 'Deadlines and review',
  checklistsHeading: 'What to submit for each event',
  filesHeading: 'Sharing your work',
  originalHeading: 'Your own work',
  submitButton: 'Submit your proof',
  capsHeading: 'Limits for every volunteer',
  creditTableHeading: 'Hour credit for every event',
  tiersHeading: 'Recognition',
  letterHeading: 'What every letter includes',
  sampleHeading: 'Sample letter',
  sampleLabel: 'Sample, not a real letter',
  schoolRulesHeading: 'Your school decides',
  pvsaHeading: 'The President\u2019s Volunteer Service Award',
  fraudHeading: 'Honesty',
  whoForHeading: 'Who this is for',
  whatVolunteersDoHeading: 'What volunteers do',
  whatWeAskHeading: 'What we ask of you',
  whatToExpectHeading: 'What you can expect',
  partnerFormsHeading: 'The two forms',
  partnerEmailHeading: 'What volunteers will send you',
  verifyEmailLead: 'Questions about a letter?',
  emailUs: 'Email us',
  donate: 'Donate',
  studyLibrary: 'Open the Study Library',
};

/** The global caps as one sentence. */
export function capsSentence(): string {
  const c = openPaths.caps;
  return `Up to ${c.hoursPerMonth} hours a month and ${c.hoursPerSchoolYear} hours a school year, which runs ${c.schoolYear}.`;
}

/* ------------------------------------------------------------------ *
 * Stable vocabulary shared with the backend
 * ------------------------------------------------------------------ */

export const VOLUNTEER_STATUS = ['PENDING_CONSENT', 'ACTIVE', 'SUSPENDED', 'WITHDRAWN'] as const;
export const SUBMISSION_STATUS = [
  'SUBMITTED', 'AUTO_FLAGGED', 'IN_REVIEW', 'NEEDS_INFO', 'APPROVED',
  'SIGNED', 'LETTER_ISSUED', 'REJECTED', 'WITHDRAWN',
] as const;
export const CERTIFICATE_STATUS = ['VALID', 'REVOKED'] as const;

/** Example IDs, one per kind, documenting the formats. */
export const ID_FORMATS = {
  volunteer: 'VOL-000123',
  drop: 'DROP-2611',
  signup: 'SGN-2611-0001',
  partner: 'PTR-0042',
  submission: 'SUB-2611-0042',
  certificate: 'OP-2611-0042-K7QD',
} as const;
/** Characters used in the four-character certificate suffix. */
export const CERTIFICATE_SUFFIX_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CERTIFICATE_ID_PATTERN = /^OP-\d{4}-\d{4}-[A-Z0-9]{4}$/;
/** The same pattern for an HTML `pattern` attribute, which is anchored implicitly. */
export const CERTIFICATE_ID_HTML_PATTERN = 'OP-\\d{4}-\\d{4}-[A-Za-z0-9]{4}';

/* ------------------------------------------------------------------ *
 * Verify contract (section 3.5)
 *
 * JavaScript: GET `${verifyEndpoint}?id=<ID>&format=json` with plain
 * fetch(url), no custom headers. No JavaScript: the form submits
 * GET `${verifyEndpoint}?id=<ID>` and the endpoint returns its own HTML.
 * ------------------------------------------------------------------ */

export type VerifyStatus = 'VALID' | 'REVOKED' | 'NOT_FOUND' | 'INVALID';

export interface VerifyActivity {
  event: string;
  dates: string;
  hours: number;
}

export type VerifyResponse =
  | {
      id: string;
      status: 'VALID' | 'REVOKED';
      /** First name and last initial only, never a full name or school. */
      volunteer: string;
      hours: number;
      issuedOn: string;
      activities: VerifyActivity[];
    }
  | { id: string; status: 'NOT_FOUND' | 'INVALID' };
