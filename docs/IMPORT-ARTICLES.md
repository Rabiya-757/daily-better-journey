# Import your own existing articles (and keep their URLs)

Only import articles **you wrote and have the right to publish**. Don't import text you didn't write or that is copied from elsewhere: it hurts the site and AdSense review.

## 1. Collect your old URLs first

Before touching any article, write down the old address of each one (the part after the domain):

- from your old site's sitemap or post list
- from Google Search Console, **Performance**, **Pages** (if the old site was verified)
- from your analytics, or the links you've shared

Save them in a plain text file, one per line, e.g. `old-urls.txt`:

```
/my-first-post
/2023/05/how-i-plan-my-week/
```

## 2. Create each article file

For each article, one Markdown file in `src/content/articles/`, e.g. `how-i-plan-my-week.md`:

```markdown
---
title: "How I plan my week"
description: "A summary of 120 to 160 characters describing what the article delivers."
slug: how-i-plan-my-week
publishDate: 2023-05-14
updatedDate: 2025-02-01
category: Productivity
author: Your Name
tags: []
related: []
draft: false
---

Your article text in Markdown...
```

Notes:

- `draft` is **required** on purpose. `false` publishes the article, `true` hides it.
- Use the **original publish date** so dates are honest. Add `updatedDate` only if you really edited it.
- `description` must be 40 to 200 characters; aim for 120 to 160.
- The easiest start: `npm run new -- "Title"` and then paste your text over the body.

### Converting from HTML

Copy the text into Markdown by hand, or (optional, free) use Pandoc: `pandoc -f html -t gfm article.html -o article.md`. Then clean up headings, links and images. Always read the result.

### Images

Copy images to `public/images/` and reference them like `![What the image shows](/images/photo.jpg)`. Write real alt text. Compress large images first.

## 3. Preserve the old URL

By default an article lives at `/blog/<slug>/`. To keep an old address, add `url:` to its front matter:

```yaml
url: "/2023/05/how-i-plan-my-week/"
```

The article is then served at exactly that path (internal links and canonicals always use the trailing-slash form; after deploying, open both forms on pages.dev and confirm the one without the slash lands on the right page). Rules:

- must start with `/`, letters/numbers and `- _ ~ . /` only
- can't end in `.html` (use a redirect instead)
- can't reuse addresses the site owns: `/blog/`, `/about/`, `/contact/`, `/privacy/`, `/404`, `/images/`, `/sitemap.xml`, `/robots.txt`, `/ads.txt`
- two articles can't share an address (the build tells you which)

## 4. Check what matches

```powershell
npm run urls -- old-urls.txt
```

This prints:

- the public URL of every published article
- which old URLs **already match** a page (nothing more to do)
- which old URLs have **no page** at that address

It never writes redirects.

## 5. Redirects: only after you confirm the old URL

For each old URL with no page, either:

- **A (best):** set `url:` on the matching article so the old URL keeps working, or
- **B:** after confirming the old URL really existed (open it on the old site, or find it in Search Console or your sitemap), add one line to `public/_redirects`:

```
/old-post-name  /blog/how-i-plan-my-week/  301
```

Format: `old-path  new-path  status`. Rules of thumb: one line per URL, send people to the single best matching article, and don't redirect unrelated old URLs to the home page (a missing page should stay a 404). `public/_redirects` ships with **no active rules**; add them only for URLs you've confirmed. Redirects only work when the old URL is requested on this site's host, so they matter after your domain points to Cloudflare. See Cloudflare's Pages redirects documentation for syntax and limits.

## 6. Final checks

- [ ] `npm run build` passes
- [ ] Every article opens at its expected address in `npm run preview`
- [ ] Internal links between articles use the final addresses
- [ ] No `TODO` text left in published articles (the build warns)
