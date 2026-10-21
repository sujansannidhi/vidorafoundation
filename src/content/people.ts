/**
 * Open register item 1. Three of four bios are unwritten.
 * Brand skill hard rule 3: never fabricate. A person without a bio renders
 * a visible placeholder state, not an omission and not an invented bio.
 *
 * Note on schools: the team are high school students. The previous site named
 * their school. That is a deliberate omission here, not an oversight.
 * Plan section 7a, "Naming schools of minors". Add it back only on purpose.
 */
import type { Photo } from './photos.ts';

export interface Person {
  name: string;
  /** Null means unconfirmed. Renders a TodoNote. */
  role: string | null;
  /** Paragraph one is where the person comes from. Paragraph two is what they
   *  do at Vidora. Not aspirations, not "passionate about". What they do. */
  bio: string[] | null;
  photo: Photo | null;
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
     * Sujan's own words, unedited but for one substitution: he named the
     * organisation by an earlier name, replaced here with the operating
     * name the rest of the site uses.
     */
    bio: [
      "I'm a junior at Independence High School. Education has always been one of the most important parts of my life. Growing up in the United Kingdom and later moving to the United States, I experienced two very different education systems. That change was hard, but not impossible, because of the people around me and the resources I had to overcome any obstacles that came my way.",
      "This isn't the same for everyone, and I want to fight to change that. Not every student has that privilege. Vidora Foundation is my attempt to remove the small, fixable barriers that stop students from showing up ready to learn: a notebook, a pencil, a geometry set.",
    ],
    photo: {
      src: '/people/sujan-sannidhi.jpg',
      alt: 'Sujan Sannidhi',
      width: 720,
      height: 960,
    },
    email: 'sujan@vidorafoundation.org',
    linkedin: null,
  },
];

export const foundingNote =
  'Vidora Foundation is run by high school students, organised into chapters that raise for the schools they serve.';
