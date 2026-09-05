/**
 * Copy for the seven stage scroll journey on /.
 * Plan section 3. Every stage's text is here so the journey can be re-worded
 * without touching a component.
 *
 * The stage order is the arc: beginning, the gap, what Vidora does,
 * what it cost and reached, the campaign, the road branches, join.
 */

export const stage1 = {
  id: 'beginning',
  eyebrow: 'Government schools, Palnadu and Prakasam districts, Andhra Pradesh',
  /**
   * Open register item 13.
   *
   * The brief's placeholder, "Opportunity shouldn't depend on where you start",
   * could sit on any education nonprofit's homepage in the world.
   *
   * This says the opposite of what most nonprofits say. The sector's default
   * claim is that the problem is vast and systemic. Vidora's actual thesis is
   * that the specific thing standing between a student and their next step is
   * usually narrow enough to name and cheap enough to buy. That is a claim
   * only an organisation working at this range can make, and the June 2026
   * campaign is the evidence for it.
   */
  headline: 'The gap between a student and their next opportunity',
  headlineEmphasis: 'is small, specific, and fixable.',
  standfirst:
    'Vidora Foundation works in government schools in Andhra Pradesh, finding the narrow things a student is missing and closing them. Learning Kits is running now. Teaching and computer access are what comes next.',
  /** The proof, stated once at the top and expanded at stages 2 and 4. */
  proof:
    'In June 2026 the gap was a compass box, an atlas, and a notebook that matched her grade.',
  ctaPrimary: { label: 'Get involved', href: '/join' },
  ctaSecondary: {
    label: 'See the June 2026 campaign',
    href: '/campaigns/learning-kits-june-2026',
  },
  /** Rendered in the margin as the reader enters. */
  scopeHeading: 'Three ways the organisation closes that gap',
} as const;

export const stage2 = {
  id: 'the-gap',
  eyebrow: 'The gap',
  headline: 'The state already gives her a uniform, shoes, and textbooks.',
  schemeNote:
    'The Sarvepalli Radhakrishnan Vidyarthi Mitra scheme supplies uniforms, shoes, socks, a belt, a school bag, textbooks, and generic notebooks to government school students in Andhra Pradesh.',
  headlineSecond:
    'It does not give her a compass box, an atlas, or a notebook that matches her grade.',
  /** Drawn in copper line, accumulating along the road. What she already has. */
  provided: [
    { id: 'uniform', label: 'Uniform' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'socks', label: 'Socks' },
    { id: 'belt', label: 'Belt' },
    { id: 'bag', label: 'School bag' },
    { id: 'textbooks', label: 'Textbooks' },
    { id: 'notebooks', label: 'Generic notebooks' },
  ],
  /** Rendered as empty outlines. Absence, not floating deficit words. */
  missing: [
    { id: 'compass-box', label: 'Compass box' },
    { id: 'atlas', label: 'Atlas' },
    { id: 'grade-notebook', label: 'Notebook matched to her grade' },
  ],
  /** The three that carry the meaning on mobile, per plan section 6. */
  mobileKeep: ['bag', 'textbooks', 'notebooks'],
} as const;

export const stage3 = {
  id: 'what-we-do',
  eyebrow: 'What Vidora does',
  headline: 'Three pillars. One of them is running.',
  standfirst:
    'Learning Kits is active and has delivered. Teaching and Access are where the organisation is going, and they are labelled Planned everywhere they appear so that nobody reads a plan as a promise.',
} as const;

export const stage4 = {
  id: 'what-it-cost',
  eyebrow: 'June 2026',
  headline: 'What it cost and what it reached.',
} as const;

export const stage5 = {
  id: 'the-campaign',
  eyebrow: 'Field report',
  headline: 'How the June 2026 campaign actually ran.',
  standfirst:
    'Told as stops along the road, in the order the work happened, ending with what we would do differently.',
} as const;

export const stage6 = {
  id: 'the-branch',
  eyebrow: 'The chapter model',
  headline: 'One chapter can supply a school. More chapters supply more schools.',
  standfirst:
    'Frisco is the first chapter. The model is portable: a chapter raises what a school’s kits cost, and supplies are bought locally in Andhra Pradesh.',
  /** Each branch is a CHAPTER, not a student. Plan section 4.6. */
  branches: [
    { id: 'frisco', label: 'Frisco', status: 'active' as const },
    { id: 'texas-2', label: 'Next Texas chapter', status: 'planned' as const },
    { id: 'texas-3', label: 'Next Texas chapter', status: 'planned' as const },
    { id: 'texas-4', label: 'Next Texas chapter', status: 'planned' as const },
  ],
  /** Mobile reduces to two paths. Plan section 6. */
  mobileBranchCount: 2,
} as const;

export const stage7 = {
  id: 'join',
  eyebrow: 'Get involved',
  headline: 'Three ways in.',
  /** Ordered by what the organisation actually needs. Plan section 4.9. */
  ways: [
    {
      id: 'chapter',
      label: 'Start a chapter',
      body: 'A chapter is a group at one high school that raises for and runs a distribution.',
      href: '/join',
      primary: true,
    },
    {
      id: 'volunteer',
      label: 'Volunteer',
      body: 'Help with a campaign, outreach, or the ambassador programme.',
      href: '/join#volunteer',
      primary: false,
    },
    {
      id: 'donate',
      label: 'Donate',
      body: 'Money buys compass boxes, atlases, slates, and grade matched notebooks at local wholesale prices.',
      href: '/donate',
      primary: false,
    },
  ],
} as const;
