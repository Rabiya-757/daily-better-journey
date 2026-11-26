---
# This is an UNPUBLISHED EXAMPLE. `draft: true` keeps it off every public page,
# the blog list and sitemap.xml. Copy its front matter for real articles, or run:
#   npm run new -- "Your real article title"
# You can delete this file whenever you like.

title: "Example article: how front matter controls your page"
description: "An example draft showing every front matter field, so you can copy the format when you write your own articles."
slug: example-unpublished-article
publishDate: 2026-01-01
updatedDate: 2026-01-02
category: Example
author: Your Name
tags:
  - example
related: []
draft: true
---

This file is a working example of an article. It stays hidden because `draft` is `true`.

## What each field does

- `title`: the page heading and the title shown in search results.
- `description`: the summary used for search snippets and social previews. About 120 to 160 characters works well.
- `slug`: the last part of the address. This article would live at `/blog/example-unpublished-article/`.
- `url` (optional, not used here): a full path such as `/2023/05/my-old-post/`. Use it to keep an old address exactly.
- `publishDate` and `updatedDate`: shown on the page and in the structured data. Only set `updatedDate` when you really changed the article.
- `category`: shown above the title and used to suggest related articles.
- `author` (optional): falls back to the name in `site.config.mjs`.
- `tags` and `related`: help choose related articles. `related` takes slugs of other articles.
- `image` and `imageAlt` (optional): a share image from the `public` folder, for example `/images/my-post.png`.
- `draft`: `true` hides the article, `false` publishes it.

## Writing and linking

Write in plain Markdown. Link to your other articles with normal links, for example `[my guide to weekly reviews](/blog/weekly-review/)`. Use the path that appears in the **Published article URLs** list from `npm run urls`.

### Formatting you can use

1. Numbered lists
2. Bulleted lists
3. **Bold**, *italic*, and `inline code`

> Quotes appear with a coloured rule on the left.

Images go in `public/images/` and are added like this: `![Describe the image for people who cannot see it](/images/example.jpg)`.
