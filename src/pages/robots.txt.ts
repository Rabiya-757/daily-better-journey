import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site';

// Everything public may be crawled. Do NOT block the whole site: AdSense and
// Search Console both need to crawl it.
export const GET: APIRoute = () => {
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
