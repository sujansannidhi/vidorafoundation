/**
 * The Mission page's account of the gap: what basic materials do for a
 * student, what happens without them, and what the evidence does and does
 * not show.
 *
 * Every figure and quotation here was checked against the source listed in
 * `sources`, and each finding names its source by number. Two rules held
 * throughout. Quotations are verbatim from a primary or reputable transcript,
 * so popular but unverifiable wordings (including the common version of
 * Mandela's line about education) are left out. And findings are stated no
 * more strongly than the studies state them: where the evidence is mixed,
 * the copy says so.
 */

export interface Source {
  id: number;
  /** Author(s), title, publisher or journal, year. */
  citation: string;
  url: string;
}

export const sources: Source[] = [
  {
    id: 1,
    citation:
      'ASER Centre, Annual Status of Education Report (Rural) 2024, Andhra Pradesh state tables, January 2025.',
    url: 'https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24.pdf',
  },
  {
    id: 2,
    citation:
      'National Statistical Office, Key Indicators of Household Social Consumption on Education in India, NSS 75th Round (2017–18), November 2019.',
    url: 'https://mospi.gov.in/sites/default/files/publication_reports/KI_Education_75th_Final.pdf',
  },
  {
    id: 3,
    citation:
      'James, K. H. and Engelhardt, L., "The effects of handwriting experience on functional brain development in pre-literate children," Trends in Neuroscience and Education 1(1), 2012.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4274624',
  },
  {
    id: 4,
    citation:
      'Van der Weel, F. R. and Van der Meer, A. L. H., "Handwriting but not typewriting leads to widespread brain connectivity," Frontiers in Psychology 14, 2024.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10853352/',
  },
  {
    id: 5,
    citation:
      'Mueller, P. A. and Oppenheimer, D. M., "The Pen Is Mightier Than the Keyboard," Psychological Science 25(6), 2014; and Urry, H. L. et al., "Don’t Ditch the Laptop Just Yet," Psychological Science 32(3), 2021.',
    url: 'https://www.psychologicalscience.org/news/releases/no-benefit-handwriting-notes.html',
  },
  {
    id: 6,
    citation:
      'Glewwe, P., Kremer, M. and Moulin, S., "Many Children Left Behind? Textbooks and Test Scores in Kenya," American Economic Journal: Applied Economics 1(1), 2009.',
    url: 'https://www.nber.org/papers/w13300',
  },
  {
    id: 7,
    citation:
      'Global Education Evidence Advisory Panel (World Bank, FCDO, UNICEF, USAID), Cost-Effective Approaches to Improve Global Learning, 2023.',
    url: 'https://thedocs.worldbank.org/en/doc/231d98251cf326922518be0cbe306fdc-0200022023/related/GEEAP-Report-Smart-Buys-2023-final.pdf',
  },
  {
    id: 8,
    citation: 'Malala Yousafzai, address to the United Nations Youth Assembly, New York, 12 July 2013.',
    url: 'https://www.rev.com/transcripts/malala-yousafzai-speech-at-united-nations-youth-assembly-2013-transcript',
  },
  {
    id: 9,
    citation: 'Kailash Satyarthi, Nobel Lecture, "Let Us March!", Oslo, 10 December 2014.',
    url: 'https://www.nobelprize.org/prizes/peace/2014/satyarthi/lecture/',
  },
];

/** Figures shown large, each with what it counts and where it comes from. */
export const gapFigures = [
  {
    value: '15.7%',
    label: 'of Std III children in rural Andhra Pradesh can read a Std II text',
    source: 1,
  },
  {
    value: '37.7%',
    label: 'of Std V children in rural Andhra Pradesh can read a Std II text',
    source: 1,
  },
  {
    value: '10%',
    label: 'of rural students in India received free or subsidised stationery, against 54% for textbooks (2017–18)',
    source: 2,
  },
] as const;

export interface Finding {
  heading: string;
  paragraphs: string[];
  /** Source numbers, rendered as a reference after the last paragraph. */
  sources: number[];
}

export const findings: Finding[] = [
  {
    heading: 'Most students are behind the year they are in',
    paragraphs: [
      'In rural Andhra Pradesh in 2024, fewer than one in six children in Std III could read a passage written for Std II. By Std V, still fewer than two in five could. About a third of Std V children could do a division sum.',
      'A child who is a year or two behind needs material pitched at where they are and where their class is going: a notebook ruled for their grade, a geometry box when the syllabus reaches angles, an atlas when it reaches maps.',
    ],
    sources: [1],
  },
  {
    heading: 'Stationery is the part families are left to buy',
    paragraphs: [
      'When the National Statistical Office last surveyed what households spend on schooling, in 2017–18, just over half of rural students received free or subsidised textbooks, but only one in ten received free or subsidised stationery. In rural Andhra Pradesh the figures were 49.6% and 8.5%. Books, stationery and uniform made up about a quarter of what rural households spent on each student.',
      'Andhra Pradesh has since begun supplying textbooks, generic notebooks, a bag and a uniform through the state scheme, so these figures describe the years before it. What the scheme still leaves out is what Learning Kits supplies: compass boxes, atlases, slates, and notebooks matched to a grade.',
    ],
    sources: [2],
  },
  {
    heading: 'Writing by hand is part of how children learn',
    paragraphs: [
      'In a study of five year olds who could not yet read, the brain network used for reading responded to letters only after the children had practised writing those letters by hand. Typing and tracing them did not produce the same response.',
      'A 2024 study recording brain activity found that handwriting engaged far wider networks than typing, in regions tied to memory and to the senses. It studied university students and measured brain activity rather than marks, and other researchers have questioned its methods. Research on handwritten against typed notes is mixed: an influential 2014 study favoured handwriting, and a 2021 replication found no difference in test scores. The careful claim is the one the evidence supports: writing by hand engages a child differently, and early on it seems to help letters stick.',
    ],
    sources: [3, 4, 5],
  },
  {
    heading: 'Materials only help when they fit the child and get used',
    paragraphs: [
      'When textbooks were given to schools in rural Kenya, average test scores did not rise. Only students who were already strong benefited, partly because the books were written above most pupils’ level.',
      'A 2023 review by the World Bank, UNICEF and others lists extra inputs on their own as a poor use of money, and in the same breath says that good materials pitched at the right level, used alongside good teaching, can make a big difference. That is why every Learning Kit is matched to a grade, and why teachers decide what that grade needs.',
    ],
    sources: [6, 7],
  },
];

/** Verbatim, from the transcripts listed in `sources`. */
export const voices = [
  {
    quote: 'One child, one teacher, one book, and one pen can change the world.',
    who: 'Malala Yousafzai',
    where: 'United Nations Youth Assembly, 2013',
    source: 8,
  },
  {
    quote:
      'Is the world so poor that it cannot give me a toy and a book, instead of forcing me to take a gun or a tool?',
    who: 'A child’s question, as told by Kailash Satyarthi',
    where: 'Nobel Lecture, 2014',
    source: 9,
  },
] as const;
