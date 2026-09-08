/**
 * Sitemap, generated from the route list at build time. No dependency needed:
 * this is a static site with eleven known routes, and a hand-rolled endpoint is
 * less to keep in sync than an integration.
 */
import type { APIRoute } from 'astro';

const ROUTES = [
  '/', '/mission', '/programs', '/impact',
  '/campaigns/learning-kits-june-2026',
  '/people', '/partners', '/join', '/donate', '/updates', '/contact',
];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://vidorafoundation.com')).origin;
  // Trailing slash, to match the canonical tag Astro emits for each route.
  // Both forms serve 200, so a sitemap listing the other one hands Google two
  // URLs for one page and lets the sitemap disagree with the canonical.
  const urls = ROUTES.map((r) => {
    const path = r.endsWith('/') ? r : `${r}/`;
    return `  <url><loc>${base}${path}</loc></url>`;
  }).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
