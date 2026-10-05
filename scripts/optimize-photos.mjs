/**
 * Builds the web-ready photographs in public/photos from the original
 * June 2026 distribution files.
 *
 * The originals live outside the repository and are never written to. Each
 * entry below names one source file, the aspect ratio of the slot it fills,
 * and the point in the frame that must survive the crop (a face, a pair of
 * hands, the kit itself). The crop is taken around that point rather than
 * from the centre, so nothing important is cut off.
 *
 *   VIDORA_MEDIA=/path/to/folder node scripts/optimize-photos.mjs
 *
 * Outputs are committed, so a checkout without the originals still builds.
 * Re-run this only when a photograph is added, replaced or re-cropped.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MEDIA =
  process.env.VIDORA_MEDIA ||
  // The shoot folder as it is actually named on disk, which predates the
  // Vidora name. Override with VIDORA_MEDIA rather than renaming it here.
  path.join(process.env.HOME, 'Documents', 'sambhav_media');

const OUT = path.join(process.cwd(), 'public', 'photos');

/** Widths emitted per photograph, capped at the width the crop can supply. */
const WIDTHS = [480, 800, 1200, 1600];
/** The single width used for the .jpg that older clients fall back to. */
const FALLBACK_WIDTH = 1200;

const PHOTOS = [
  {
    name: 'classroom-distribution',
    from: 'School 6 - Narasaraopet/d59eb0a9-b4b8-4740-ae4d-cd4065d9f377.jpg',
    ratio: [4, 3],
    // Keep the seated students; the ceiling and the back wall can go.
    focus: { x: 0.5, y: 0.58 },
  },
  {
    name: 'learning-kit-handover',
    from: 'School 2 - Narasaraopet/IMG_0461.JPG',
    ratio: [4, 3],
    // The student receiving her kit sits right of centre in the 16:9 frame.
    focus: { x: 0.58, y: 0.5 },
  },
  {
    name: 'team-at-the-supply-table',
    from: 'School 4 - Narasaraopet/6973417a-1f73-4a3a-a6db-765f2dc401bf.jpg',
    ratio: [4, 3],
    // Hold the four volunteers and the open boxes in front of them.
    focus: { x: 0.42, y: 0.5 },
  },
  {
    name: 'students-with-kits',
    from: 'School 2 - Narasaraopet/IMG_0465.JPG',
    ratio: [4, 3],
    focus: { x: 0.5, y: 0.5 },
  },
  {
    name: 'distribution-day',
    from: 'School 2 - Narasaraopet/IMG_0456.JPG',
    ratio: [3, 4],
    // Both faces and the kit between them sit below the middle of the frame.
    focus: { x: 0.5, y: 0.54 },
  },
];

/**
 * The largest box of the requested ratio that fits inside the source,
 * slid so that `focus` is as close to its centre as the edges allow.
 */
function cropBox(width, height, [rw, rh], focus) {
  const targetRatio = rw / rh;
  let cw = width;
  let ch = Math.round(width / targetRatio);
  if (ch > height) {
    ch = height;
    cw = Math.round(height * targetRatio);
  }
  const clamp = (value, max) => Math.max(0, Math.min(Math.round(value), max));
  return {
    left: clamp(focus.x * width - cw / 2, width - cw),
    top: clamp(focus.y * height - ch / 2, height - ch),
    width: cw,
    height: ch,
  };
}

async function build(photo) {
  const source = path.join(MEDIA, photo.from);
  if (!existsSync(source)) {
    throw new Error(`missing source: ${source}`);
  }

  const image = sharp(source).rotate();
  const { width, height } = await image.metadata();
  const box = cropBox(width, height, photo.ratio, photo.focus);

  // No slot on the site is rendered wider than about 800 CSS px, so 1600
  // already covers a 2x display. Anything beyond that is weight nobody sees.
  // A crop that cannot reach 1600 still contributes its own full width, so a
  // dense phone screen is not left on the next size down.
  const ceiling = Math.min(box.width, Math.max(...WIDTHS));
  const widths = WIDTHS.filter((w) => w <= box.width);
  if (!widths.includes(ceiling)) widths.push(ceiling);
  widths.sort((a, b) => a - b);

  const cropped = () => sharp(source).rotate().extract(box);
  const results = [];

  for (const w of widths) {
    const file = `${photo.name}-${w}.webp`;
    const info = await cropped()
      .resize({ width: w })
      .webp({ quality: 78, effort: 6 })
      .toFile(path.join(OUT, file));
    results.push({ file, width: w, bytes: info.size });
  }

  const fallbackWidth = Math.min(FALLBACK_WIDTH, box.width);
  const fallback = await cropped()
    .resize({ width: fallbackWidth })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, `${photo.name}.jpg`));

  return {
    name: photo.name,
    source: photo.from,
    intrinsic: { width: box.width, height: box.height },
    widths,
    fallback: { width: fallbackWidth, bytes: fallback.size },
    webp: results,
  };
}

await mkdir(OUT, { recursive: true });

const built = [];
for (const photo of PHOTOS) {
  const result = await build(photo);
  built.push(result);
  const total =
    result.webp.reduce((sum, r) => sum + r.bytes, 0) + result.fallback.bytes;
  console.log(
    `${result.name.padEnd(26)} ${String(result.intrinsic.width).padStart(5)}x${String(
      result.intrinsic.height,
    ).padEnd(5)}  ${result.widths.join(', ')}  ${(total / 1024).toFixed(0)} kB`,
  );
}

// A record of what each file was cut from, kept beside the script rather than
// in public/, which is served. src/content/photos.ts stays hand-authored,
// because the alt text is editorial and has to be looked at, not generated.
await writeFile(
  path.join(process.cwd(), 'scripts', 'photo-manifest.json'),
  JSON.stringify(built, null, 2) + '\n',
);
console.log(`\n${built.length} photographs written to public/photos`);
