/**
 * Plan section 8, rule 3: every pillar carries a status field, and a
 * Planned pillar cannot render in present tense.
 *
 * The `status` field is required by the type, so a pillar cannot be added
 * without deciding. `presentTense` is only allowed to be non null when
 * status is 'active'; the check script enforces that.
 *
 * A fourth pillar under internal consideration does not appear here at all.
 * Brand skill: it should not appear publicly.
 */

export type PillarStatus = 'active' | 'planned';

export interface Pillar {
  slug: string;
  name: string;
  status: PillarStatus;
  /** One line. Planned pillars are described in the conditional, never the present. */
  summary: string;
  body: string[];
}

export const pillars: Pillar[] = [
  {
    slug: 'learning-kits',
    name: 'Learning Kits',
    status: 'active',
    summary:
      'Grade specific supplies for government school students in Palnadu and Prakasam districts.',
    body: [
      'The Andhra Pradesh state scheme, Sarvepalli Radhakrishnan Vidyarthi Mitra, already supplies uniforms, shoes, socks, a belt, a school bag, textbooks, and generic notebooks. Learning Kits fill what the scheme does not cover: compass boxes, atlases, slates, and notebooks matched to a student’s grade.',
      'Supplies are bought in person at local wholesale prices in Narasaraopeta. They are not shipped from the United States.',
    ],
  },
  {
    slug: 'teaching',
    name: 'Teaching',
    status: 'planned',
    summary:
      'A teaching programme would place volunteers alongside classroom teachers. It is not running.',
    body: [
      'Nothing has been delivered under this pillar. It is listed because it is where the organisation intends to go next, not because it is available.',
    ],
  },
  {
    slug: 'access',
    name: 'Access',
    status: 'planned',
    summary:
      'An access programme would put working computers in schools that do not have them. It is not running.',
    body: [
      'Nothing has been delivered under this pillar. No school has received hardware from Vidora Foundation.',
    ],
  },
];

export const activePillar = pillars.find((p) => p.status === 'active')!;
