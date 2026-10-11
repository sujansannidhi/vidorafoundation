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

/**
 * The frames the homepage hero flicks through as its window opens, in order.
 * Each is on screen for a fraction of a second and is decorative there (the
 * hero's last photograph, which stays, carries the description), so these
 * carry no alt text of their own.
 */
export const heroFrames: Pick<Photo, 'src' | 'srcset'>[] = [
  { src: '/photos/shuffle-1.jpg', srcset: webp('shuffle-1', [800, 1600]) },
  { src: '/photos/shuffle-2.jpg', srcset: webp('shuffle-2', [800, 1600]) },
  { src: '/photos/shuffle-3.jpg', srcset: webp('shuffle-3', [800, 1600]) },
  { src: '/photos/shuffle-4.jpg', srcset: webp('shuffle-4', [800, 1536]) },
  { src: '/photos/shuffle-5.jpg', srcset: webp('shuffle-5', [800, 1600]) },
  { src: '/photos/shuffle-6.jpg', srcset: webp('shuffle-6', [800, 1600]) },
  { src: '/photos/shuffle-7.jpg', srcset: webp('shuffle-7', [800, 1536]) },
  { src: '/photos/shuffle-8.jpg', srcset: webp('shuffle-8', [800, 1600]) },
  { src: '/photos/shuffle-9.jpg', srcset: webp('shuffle-9', [800, 1536]) },
];
