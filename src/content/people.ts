/**
 * Open register item 1. Three of four bios are unwritten.
 * Brand skill hard rule 3: never fabricate. A person without a bio renders
 * a visible placeholder state, not an omission and not an invented bio.
 *
 * Note on schools: the team are high school students. The previous site named
 * their school. That is a deliberate omission here, not an oversight.
 * Plan section 7a, "Naming schools of minors". Add it back only on purpose.
 */

export interface Person {
  name: string;
  /** Null means unconfirmed. Renders a TodoNote. */
  role: string | null;
  /** Paragraph one is where the person comes from. Paragraph two is what they
   *  do at Vidora. Not aspirations, not "passionate about". What they do. */
  bio: string[] | null;
  photo: { src: string; alt: string } | null;
  /** Organisation address. Null until the person has one to publish. */
  email: string | null;
  linkedin: string | null;
  /** True while the copy is assembled from source fragments and awaits sign off. */
  needsReview?: boolean;
}

export const people: Person[] = [
  {
    name: 'Sujan Sannidhi',
    role: 'Founder',
    bio: [
      'Sujan founded Vidora Foundation as a high school student in Frisco, Texas. The first campaign ran in Palnadu and Prakasam districts in Andhra Pradesh, where his family has ties and where the door opened easiest. That is the reason it started there. It is not a claim that the region needs help more than anywhere else.',
      'He chairs the team’s meetings and led the June 2026 Learning Kits campaign, including buying supplies in person at wholesale prices in Narasaraopeta. The Andhra Pradesh state scheme already provides uniforms, textbooks, and bags. What it leaves out is a compass box, an atlas, a slate, and a notebook that matches a student’s grade. Those are the small, fixable barriers that stop students from showing up ready to learn.',
    ],
    photo: null,
    email: 'sujan@vidorafoundation.org',
    linkedin: null,
    needsReview: true,
  },
  /* Title and address are known; the bios are not, so they stay null and each
     renders its own TodoNote. A title is not a bio, and filling the gap with
     something plausible is exactly what the note exists to prevent. */
  {
    name: 'Praneel Rondla',
    role: 'Executive',
    /* Written by Praneel, and put into the third person to match the rest of
       the page. Every fact and claim is his; only the voice was changed. */
    bio: [
      'Praneel is a junior at Independence High School. His work at Vidora centres on equipping young people with the tools and knowledge they need to succeed, driven by an interest in academic empowerment and leadership.',
      'Outside Vidora he is involved in business, research and public policy, from developing financial literacy curricula for young learners to working as a research assistant analysing emerging technology in secondary education. At Vidora he aims to combine his background in strategy, community outreach and instruction to build lasting educational opportunities for students.',
    ],
    photo: null,
    email: 'praneel@vidorafoundation.org',
    linkedin: null,
    needsReview: true,
  },
  {
    name: 'Neha Manikandan',
    role: 'Executive',
    /*
     * Supplied by the team. One clause was reconciled with the rest of the
     * site: the original said she met students who go to school "without
     * basic learning tools", and the mission page, the homepage and the June
     * field report all say the opposite in as many words, that students
     * arrive with most of what they need and are missing something narrow.
     * Her point is unchanged. The deficit framing is not one the site can
     * carry on one page and contradict on three others.
     */
    bio: [
      'Neha joined Vidora Foundation when Sujan brought her onto the team to help the organisation grow. Meeting students who were short of the materials their lessons assumed they already had showed her how much difference the right supplies make to a school day.',
      'Seeing that first hand made her want to start helping. She now works with the team to plan upcoming projects, and to make sure students have the practical supplies they need to walk into class ready to learn.',
    ],
    photo: null,
    email: 'neha@vidorafoundation.org',
    linkedin: null,
    needsReview: true,
  },
];

export const foundingNote =
  'Vidora Foundation is run by high school students. The legal entity is registered as Sambhav; Vidora Foundation is the operating name.';
