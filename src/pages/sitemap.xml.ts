import type { APIRoute } from 'astro';
import { absoluteUrl, ready } from '../lib/site';
import { getPublishedPosts, postPath } from '../lib/posts';
import { isoDate } from '../lib/site';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

// Lists only indexable pages: published articles, home/blog (once there is at least one
// article), and About/Contact/Privacy once their details are filled in. Drafts and 404 are never listed.
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const entries: { loc: string; lastmod?: string }[] = [];

  if (posts.length > 0) {
    const newest = isoDate(posts.map((p) => p.data.updatedDate ?? p.data.publishDate).sort((a, b) => b.valueOf() - a.valueOf())[0]);
    entries.push({ loc: absoluteUrl('/'), lastmod: newest });
    entries.push({ loc: absoluteUrl('/blog/'), lastmod: newest });
  }
  if (ready.about) entries.push({ loc: absoluteUrl('/about/') });
  if (ready.contact) entries.push({ loc: absoluteUrl('/contact/') });
  if (ready.privacy) entries.push({ loc: absoluteUrl('/privacy/') });
  for (const post of posts) {
    entries.push({ loc: absoluteUrl(postPath(post)), lastmod: isoDate(post.data.updatedDate ?? post.data.publishDate) });
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => `  <url>\n    <loc>${escapeXml(e.loc)}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`)
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
