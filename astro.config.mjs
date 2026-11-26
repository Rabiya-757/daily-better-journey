// @ts-check
import { defineConfig } from 'astro/config';
import { siteUrl } from './site.config.mjs';

// Static output: `npm run build` writes plain HTML/CSS to ./dist.
// The production URL comes from ONE place: the SITE_URL environment variable
// (or the fallback inside site.config.mjs). Canonicals, sitemap.xml, robots.txt,
// social tags and structured data all read it.
export default defineConfig({
  site: siteUrl,
  output: 'static',
  // Every internal link and canonical in this project ends with "/".
  // Astro writes /blog/index.html, which Cloudflare Pages serves at /blog/.
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: { syntaxHighlight: false },
});
