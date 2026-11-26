import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

// Addresses that belong to the site itself. An article cannot use these.
const RESERVED = new Set(['', 'blog', 'about', 'contact', 'privacy', '404', 'sitemap.xml', 'robots.txt', 'ads.txt', 'favicon.svg', '_astro', 'images']);

/** Public path of an article, always starting and ending with "/". */
export function postPath(post: Article): string {
  const custom = post.data.url;
  if (custom) return '/' + custom.replace(/^\/+|\/+$/g, '') + '/';
  return `/blog/${post.data.slug}/`;
}

/** Path without leading/trailing slashes, for Astro's [...path] route. */
export function postRouteParam(post: Article): string {
  return postPath(post).replace(/^\/|\/$/g, '');
}

function assertValid(posts: Article[]) {
  const seenPaths = new Map<string, string>();
  const seenSlugs = new Map<string, string>();
  for (const post of posts) {
    const param = postRouteParam(post);
    const first = param.split('/')[0];
    if (RESERVED.has(param) || (post.data.url && RESERVED.has(first) && first !== 'blog')) {
      throw new Error(`Article "${post.id}" uses a reserved address (/${param}/). Choose a different slug or url.`);
    }
    if (seenPaths.has(param)) {
      throw new Error(`Two articles share the address /${param}/ ("${seenPaths.get(param)}" and "${post.id}"). Change one slug or url.`);
    }
    if (seenSlugs.has(post.data.slug)) {
      throw new Error(`Two articles share the slug "${post.data.slug}" ("${seenSlugs.get(post.data.slug)}" and "${post.id}").`);
    }
    seenPaths.set(param, post.id);
    seenSlugs.set(post.data.slug, post.id);
  }
}

/** Published articles, newest first. Drafts are excluded in every production build. */
export async function getPublishedPosts(): Promise<Article[]> {
  // Drafts can only be previewed in `npm run dev` when PUBLIC_PREVIEW_DRAFTS=true.
  const previewDrafts = import.meta.env.DEV && import.meta.env.PUBLIC_PREVIEW_DRAFTS === 'true';
  const posts = await getCollection('articles', ({ data }) => previewDrafts || data.draft === false);
  assertValid(posts);
  return posts.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export function readingMinutes(post: Article): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Related articles: ones you list in `related:` come first, then articles that share
 * the category or tags. matched=false means we only had "latest articles" to show.
 */
export function relatedPosts(current: Article, all: Article[], limit = 3): { posts: Article[]; matched: boolean } {
  const others = all.filter((p) => p.data.slug !== current.data.slug);
  const bySlug = new Map(others.map((p) => [p.data.slug, p]));
  const picked: Article[] = [];
  for (const slug of current.data.related) {
    const p = bySlug.get(slug);
    if (p && !picked.includes(p)) picked.push(p);
  }
  const scored = others
    .filter((p) => !picked.includes(p))
    .map((p) => ({
      p,
      score: (p.data.category === current.data.category ? 2 : 0) + p.data.tags.filter((t) => current.data.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.publishDate.valueOf() - a.p.data.publishDate.valueOf());
  const matched = [...picked, ...scored.map((x) => x.p)].slice(0, limit);
  if (matched.length) return { posts: matched, matched: true };
  return { posts: others.slice(0, limit), matched: false };
}
