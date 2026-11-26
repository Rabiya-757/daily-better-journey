import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every field below is editable in the article's Markdown front matter.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().min(8).max(110),
    // Used as the meta description and social description. Aim for ~120-160 characters.
    description: z.string().min(40).max(200),
    // Lowercase letters, numbers and hyphens. Default URL is /blog/<slug>/
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must use lowercase letters, numbers and single hyphens only'),
    // Optional. Full path to KEEP AN OLD URL, e.g. "/2023/05/my-old-post/".
    // When set, it replaces /blog/<slug>/ as this article's address.
    url: z
      .string()
      .regex(/^\/[A-Za-z0-9\-_~./]*[A-Za-z0-9\-_~]\/?$/, 'url must start with "/" and contain only letters, numbers, - _ ~ . and /')
      .refine((v) => !v.endsWith('.html'), 'url cannot end in .html; use a redirect in public/_redirects instead')
      .optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().min(2),
    // Falls back to author.name in site.config.mjs. Leave out if you do not want a byline.
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Slugs of articles you want listed as related (shown first).
    related: z.array(z.string()).default([]),
    // Optional share image path in /public (e.g. "/images/my-post.png") and its alt text.
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // true = hidden everywhere (pages, blog list, sitemap). Required on purpose.
    draft: z.boolean(),
  }),
});

export const collections = { articles };
