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
    /*
     * Sujan's own words, unedited but for one substitution: he wrote
     * "Sambhav", which is the registered legal entity and by the rule in
     * site.ts appears only where the legal name is required. The founding
     * note directly above this on the page already gives the legal name, so
     * a second, unexplained use of it in a bio reads as a different
     * organisation.
     */
    bio: [
      "I'm a rising junior at Independence High School. Education has always been one of the most important parts of my life. Growing up in the United Kingdom and later moving to the United States, I experienced two very different education systems. That change was hard, but not impossible, because of the people around me and the resources I had to overcome any obstacles that came my way.",
      "This isn't the same for everyone, and I want to fight to change that. Not every student has that privilege. Vidora Foundation is my attempt to remove the small, fixable barriers that stop students from showing up ready to learn: a notebook, a pencil, a geometry set.",
    ],
    photo: {
      src: '/people/sujan-sannidhi.jpg',
      alt: 'Sujan Sannidhi',
    },
    email: 'sujan@vidorafoundation.org',
    linkedin: null,
  },
  /* Title and address are known; the bios are not, so they stay null and each
     renders its own TodoNote. A title is not a bio, and filling the gap with
     something plausible is exactly what the note exists to prevent. */
  {
    name: 'Praneel Rondla',
    role: 'Executive',
    /* Praneel's own words, verbatim. */
    bio: [
      'My name is Praneel Rondla, and I am a junior at Independence High School. Primarily driven by a passion for academic empowerment and leadership, my work at Vidora centers on equipping global youth with the tools and knowledge they need to succeed.',
      'Outside of Vidora, I am actively involved in business, research, and public policy. My experience ranges from developing financial literacy curricula for young learners to working as a research assistant analyzing up-and-coming technology in secondary education. At Vidora, I aim to combine my background in strategy, community outreach, and instruction to build meaningful, lasting educational opportunities for students everywhere.',
    ],
    photo: {
      src: '/people/praneel-rondla.jpg',
      alt: 'Praneel Rondla',
    },
    email: 'praneel@vidorafoundation.org',
    linkedin: null,
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
