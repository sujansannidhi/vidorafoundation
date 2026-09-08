import { defineConfig } from 'astro/config';

// Static output. Every route emits real HTML so crawlers and link unfurlers
// get content, not an empty shell. See plan section 6, "Prerendering".
export default defineConfig({
  // The domain the site is actually served from. The apex 308-redirects to
  // www, so www is the canonical host: every canonical tag, the sitemap and
  // the og:image URL are built from this one value, and pointing it at a host
  // that does not resolve deindexes the site.
  site: 'https://www.vidorafoundation.org',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
