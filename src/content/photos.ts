/**
 * The photographs from the June 2026 Learning Kits distribution that are
 * cleared to publish, with the alt text written from what is actually in
 * each frame.
 *
 * The files in public/photos are web-ready copies. The originals are held
 * outside the repository and are not modified; scripts/optimize-photos.mjs
 * names the source each one was cut from.
 *
 * Alt text rule followed here: describe what a sighted reader would see, and
 * nothing a photograph cannot tell you. None of these name a child, a school
 * that has not agreed to be named, or a number that is not in the frame.
 */
export interface Photo {
  /** Fallback for clients without WebP. */
  src: string;
  alt: string;
  /** Intrinsic size of the crop, so the browser reserves the right box. */
  width: number;
  height: number;
  /** WebP candidates. Absent on photographs that have no derivatives. */
  srcset?: string;
}

const webp = (name: string, widths: number[]) =>
  widths.map((w) => `/photos/${name}-${w}.webp ${w}w`).join(', ');

export const classroomDistribution: Photo = {
  src: '/photos/classroom-distribution.jpg',
  srcset: webp('classroom-distribution', [480, 800, 1200, 1536]),
  width: 1536,
  height: 1152,
  alt: 'A classroom of primary school students sitting close together on the floor, each with a new set of notebooks and stationery in their lap.',
};

export const learningKitHandover: Photo = {
  src: '/photos/learning-kit-handover.jpg',
  srcset: webp('learning-kit-handover', [480, 800, 1200, 1600]),
  width: 2640,
  height: 1980,
  alt: 'A volunteer handing a bundle of notebooks and a pencil case to a smiling girl in school uniform, with a teacher and other students looking on.',
};

export const teamAtTheSupplyTable: Photo = {
  src: '/photos/team-at-the-supply-table.jpg',
  srcset: webp('team-at-the-supply-table', [480, 800, 1200, 1600]),
  width: 2755,
  height: 2066,
  alt: 'Four high school volunteers standing behind a table of opened cartons, sorting slate pencils, folders and notebooks while students wait at the other side.',
};

export const studentsWithKits: Photo = {
  src: '/photos/students-with-kits.jpg',
  srcset: webp('students-with-kits', [480, 800, 1200, 1600]),
  width: 2640,
  height: 1980,
  alt: 'Students in a school veranda, each holding a tray of notebooks, pens and a geometry box, standing with their teachers and the volunteers who brought them.',
};

export const distributionDay: Photo = {
  src: '/photos/distribution-day.jpg',
  srcset: webp('distribution-day', [480, 800, 1200, 1600]),
  width: 1980,
  height: 2640,
  alt: 'A girl in school uniform taking a Learning Kit from a volunteer with both hands. A multiplication table book, a geometry box and pens are visible on top of the pile.',
};

export const kitSupplies: Photo = {
  src: '/photos/kit-supplies.jpg',
  srcset: webp('kit-supplies', [480, 800, 1200, 1600]),
  width: 5712,
  height: 4284,
  alt: 'Learning Kits wrapped in plastic on a table: notebooks with illustrated covers, each bundled with a boxed geometry set.',
};

/** Cut wide for the homepage hero, which opens it to the full viewport. */
export const heroStudentsWithKits: Photo = {
  src: '/photos/hero-students-with-kits.jpg',
  srcset: webp('hero-students-with-kits', [800, 1200, 1600, 2400]),
  width: 3168,
  height: 1980,
  alt: studentsWithKits.alt,
};

/** Distribution photographs: the homepage hero carousel and photo strip. */
export const galleryPhotos: Photo[] = [
  { src: '/photos/dist-1.jpg', srcset: webp('dist-1', [800]), width: 1322, height: 910, alt: 'Students sitting on a classroom floor with their new notebooks and supplies.' },
  { src: '/photos/dist-2.jpg', srcset: webp('dist-2', [800, 1600]), width: 1600, height: 891, alt: 'Students in a classroom waving and holding up their new notebooks.' },
  { src: '/photos/dist-3.jpg', srcset: webp('dist-3', [800, 1600]), width: 1600, height: 916, alt: 'Students holding their Learning Kits in a school veranda, with volunteers and teachers behind them.' },
  { src: '/photos/dist-4.jpg', srcset: webp('dist-4', [800, 1600]), width: 1600, height: 839, alt: 'Students in school uniform sitting together on the floor, clapping.' },
  { src: '/photos/dist-5.jpg', srcset: webp('dist-5', [800, 1600]), width: 1600, height: 864, alt: 'Students in a line receiving notebooks from volunteers.' },
  { src: '/photos/dist-6.jpg', srcset: webp('dist-6', [800, 1600]), width: 1600, height: 888, alt: 'Young students sitting on the ground outside, each with a new kit.' },
  { src: '/photos/dist-7.jpg', srcset: webp('dist-7', [800, 1600]), width: 1600, height: 898, alt: 'Students sitting on a school floor, looking through their new notebooks.' },
  { src: '/photos/dist-8.jpg', srcset: webp('dist-8', [800, 1600]), width: 1600, height: 928, alt: 'A student volunteer talking with two teachers.' },
  { src: '/photos/dist-9.jpg', srcset: webp('dist-9', [800, 1600]), width: 1600, height: 1024, alt: 'A student volunteer handing a kit across a table to a young boy while teachers look on.' },
  { src: '/photos/dist-10.jpg', srcset: webp('dist-10', [800, 1600]), width: 1600, height: 1034, alt: 'Students holding their kits outside their primary school, with volunteers and teachers behind them.' },
  { src: '/photos/dist-11.jpg', srcset: webp('dist-11', [800, 1600]), width: 1600, height: 1212, alt: 'A wider view of students holding their kits outside their primary school.' },
];

/** The hero carousel, in order. */
export const heroSlides: Photo[] = [3, 2, 9, 10, 5, 6].map((n) => galleryPhotos[n - 1]);
