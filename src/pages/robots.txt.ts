/**
 * robots.txt, generated rather than kept as a static file in public/. The
 * sitemap line has to name an absolute URL, and a hand-maintained copy had
 * already drifted onto a domain the site is not served from. Deriving it from
 * `site` means the two cannot disagree again.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://www.vidorafoundation.org')).origin;
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
