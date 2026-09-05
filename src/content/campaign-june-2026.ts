/**
 * Stage 5 and /campaigns/learning-kits-june-2026.
 *
 * Plan section 4.5: no testimonials exist and photo consent is unresolved,
 * so this stage carries the field report instead. Built so that when
 * consented photos and real quotes exist they swap in as a CONTENT change,
 * not a rebuild: each stop already has optional `photo` and `quote` slots.
 *
 * The last stop is what makes the rest credible. A campaign write up with
 * no friction in it reads like marketing.
 */

export interface FieldReportStop {
  id: string;
  /** Short label rendered beside the road. */
  marker: string;
  heading: string;
  body: string[];
  /** Swap in when consent is confirmed. Open register item 5. */
  photo?: { src: string; alt: string; caption: string };
  /** Swap in when a real, consented quote exists. Never invent one. */
  quote?: { text: string; attribution: string };
  /** Set instead of `body` when the content is not yet known. Renders a
   *  visible TodoNote so the gap is legible in the interface. */
  todo?: string;
}

export const campaign = {
  slug: 'learning-kits-june-2026',
  title: 'Learning Kits, June 2026',
  dateline: 'Palnadu and Prakasam districts, Andhra Pradesh',
  standfirst:
    'The first Learning Kits campaign, written up in the order the work happened.',
} as const;

export const stops: FieldReportStop[] = [
  {
    id: 'what-the-state-provided',
    marker: '01',
    heading: 'What the state provided',
    body: [
      'Andhra Pradesh runs the Sarvepalli Radhakrishnan Vidyarthi Mitra scheme. It supplies government school students with uniforms, shoes, socks, a belt, a school bag, textbooks, and generic notebooks.',
      'Students arrive at school with most of what they need. Starting anywhere else would misdescribe the situation.',
    ],
  },
  {
    id: 'what-was-missing',
    marker: '02',
    heading: 'What was missing',
    body: [
      'The scheme does not cover compass boxes, atlases, slates, or notebooks matched to a student’s grade. A general issue notebook is not the same as the one a specific year of the syllabus needs.',
      'That is a narrow, nameable gap, which is why it is fixable at this budget.',
    ],
  },
  {
    id: 'specifying-by-grade',
    marker: '03',
    heading: 'How kits were specified by grade',
    body: [
      'Kits were assembled per grade rather than as one identical bundle, so that what a student received matched what their year actually required.',
    ],
  },
  {
    id: 'where-supplies-were-bought',
    marker: '04',
    heading: 'Where supplies were bought',
    body: [
      'In person, in Narasaraopeta, at local wholesale prices. Nothing was shipped from the United States.',
      'Buying locally keeps the money in the district and means the cost per kit reflects what things cost there, not what they cost in Texas.',
    ],
  },
  {
    id: 'what-it-cost',
    marker: '05',
    heading: 'What it cost',
    body: [
      'The campaign cost approximately $3,500 in total. That figure is the supplies at wholesale. It does not include travel.',
    ],
  },
  {
    id: 'what-was-delivered',
    marker: '06',
    heading: 'What was delivered',
    body: [
      'Approximately 1,200 students received kits, across 12 schools.',
      'Those are two separate counts of two different things. Neither is a measure of the other and they are not added together.',
    ],
  },
  {
    id: 'what-we-would-do-differently',
    marker: '07',
    heading: 'What we would do differently',
    // TODO(mani): open register. This stop is the one that makes the rest of
    // the report credible, and it is the one thing not in the content
    // inventory. It needs a real answer from someone who was there.
    // Do not fill it with a plausible sounding process improvement.
    body: [],
    todo: 'What went wrong or ran tight in June 2026, in one or two sentences from someone who was there. A campaign write up with no friction in it reads like marketing, so this stop stays visibly empty until it is answered rather than being filled in.',
  },
];
