import { defineConfig } from 'astro/config';

// Static output. Every route emits real HTML so crawlers and link unfurlers
// get content, not an empty shell. See plan section 6, "Prerendering".
export default defineConfig({
  site: 'https://vidorafoundation.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
