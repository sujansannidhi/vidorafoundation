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
    linkedin: null,
    needsReview: true,
  },
  { name: 'Praneel Rondla', role: null, bio: null, photo: null, linkedin: null },
  { name: 'Neha Manikandan', role: null, bio: null, photo: null, linkedin: null },
  { name: 'Mani', role: null, bio: null, photo: null, linkedin: null },
];

export const foundingNote =
  'Vidora Foundation is run by high school students. The legal entity is registered as Sambhav; Vidora Foundation is the operating name.';
