# Daily Better Journey

A fast, static blog about practical productivity, focus, motivation and consistent habits.
Built with **Astro (static output)**, **Markdown content collections** and **plain CSS**.
No backend, no database, no paid CMS, no paid APIs, no Supabase or Vercel. You own all of it.

Hosting target: **Cloudflare Pages (free)**. Source: **your own GitHub repository** (this folder is the repository root).

---

## Read this first: what was and wasn't verified

The project was written and checked in an environment with **no internet access**, so:

| Item | Status |
|------|--------|
| All source files written (pages, layout, components, CSS, content schema, scripts, docs) | Done |
| `site.config.mjs` and all `scripts/*.mjs` syntax-checked and **executed** (launch check, `new` article, URL comparison, dummy-AdSense-ID rejection) | Verified |
| Default share image generated and visually checked | Verified |
| `npm install` / `npm ci` | **Not run.** No network, so **`package-lock.json` is not included.** You create it in step 2 below and commit it. |
| `npm run build` (the Astro build itself) | **Not run.** Astro could not be installed here. The code follows Astro 5 conventions and was reviewed by hand, but it has not been compiled. If the first build prints an error, see *Troubleshooting* at the bottom. |

Please do steps 1 to 4 below on your computer before deploying.

---

## 1. Install the tools (Windows)

Open **PowerShell** and run:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

Close and reopen PowerShell, then check:

```powershell
node -v    # should be v20.3 or newer (v22 recommended)
npm -v
git --version
```

(No `winget`? Install Node.js LTS from https://nodejs.org and Git from https://git-scm.com instead.)

## 2. Install and preview locally

```powershell
cd C:\path\to\daily-better-journey
npm install            # creates package-lock.json: commit it
npm run dev            # live preview at http://localhost:4321
```

Stop the preview with `Ctrl + C`. To test the real production build:

```powershell
npm run build          # runs the launch check, then builds into .\dist
npm run preview        # serves .\dist at http://localhost:4321
```

After the first successful `npm install`, future clean installs use `npm ci` (this is what Cloudflare does when a lockfile exists).

Optional local settings: `Copy-Item .env.example .env` then edit `.env` (it is git-ignored).

## 3. Put it in your own GitHub repository

Create an **empty** repository on github.com (no README, no .gitignore), then:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/daily-better-journey.git
git push -u origin main
```

## 4. Enter your real details (nothing is invented for you)

Everything personal lives in **one file: `site.config.mjs`**. Leave a field empty until you have the real value.

| What | Where | Effect while empty |
|------|-------|--------------------|
| Production URL | `SITE_URL` environment variable (Cloudflare setting or `.env`), or fallback in `site.config.mjs` | Canonicals/sitemap point to localhost; **Cloudflare builds refuse to run** without a real URL |
| Your name and bio | `author.name`, `author.bio` (one string per paragraph) | About page stays `noindex` and out of the sitemap |
| Your contact email | `contactEmail` | Contact page stays `noindex`; Contact is an email link (`mailto:`) |
| Privacy policy facts | `privacy.operatorName` (or your author name), `privacy.effectiveDate` like `"2026-12-01"` | Privacy page stays `noindex` |
| AdSense | `adsense.publisherId`, `verificationMeta`, `loadAdScript` | Off by default; no ad code is output |
| Search Console tag (optional) | `searchConsoleVerification` | Nothing output |

Pages with missing details show only "This page isn't available yet." to visitors. While running `npm run dev` you also see a note naming the missing fields. When you are ready to go public, set `STRICT_LAUNCH=true` on Cloudflare's **production** environment: the build then **fails** if anything above is still empty or if a published article still contains `TODO`. That is your protection against publishing a half-finished site.

## 5. Write and publish articles

```powershell
npm run new -- "Your article title"
```

This creates `src/content/articles/your-article-title.md` as a **draft** from `content-templates/article-template.md`. Edit the front matter and text, preview with `npm run dev`, then set `draft: false` and push to GitHub. Cloudflare rebuilds and publishes automatically.

Front matter fields (all editable in the Markdown file): `title`, `description`, `slug`, `publishDate`, `updatedDate`, `category`, `author`, `draft`, plus optional `url`, `tags`, `related`, `image`, `imageAlt`. See `src/content/articles/example-unpublished-article.md` for an annotated example (it is a draft, so it is never public).

- **Drafts** (`draft: true`) are excluded from every route, the blog list and `sitemap.xml`. To preview drafts locally only, set `PUBLIC_PREVIEW_DRAFTS=true` in `.env` and run `npm run dev`; production builds ignore that setting.
- **Related articles** are added automatically at the bottom of each post: articles you list in `related:` first, then ones sharing the category or tags. Add links inside the text too, e.g. `[weekly review](/blog/twenty-minute-weekly-review/)`.
- **Images:** put files in `public/images/` and use `![Describe the image](/images/photo.jpg)`. Compress them first.
- **Your own articles:** see [docs/IMPORT-ARTICLES.md](docs/IMPORT-ARTICLES.md), including keeping old URLs.
- **Ideas:** five outlines you can write from your own experience are in `content-templates/outlines/`.

## 6. Deploy, domain, AdSense

Follow the guides in this order:

1. [docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md): deploy to Cloudflare Pages Free (build command `npm run build`, output directory `dist`) and test on `pages.dev`.
2. [docs/DOMAIN-AND-DNS.md](docs/DOMAIN-AND-DNS.md): connect `dailybetterjourney.com`, protect email/verification DNS records, switch all URLs, redirect `pages.dev`.
3. [docs/ADSENSE-CHECKLIST.md](docs/ADSENSE-CHECKLIST.md): Search Console and AdSense checklist, `ads.txt`, consent, privacy policy updates.
4. [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md): first article and full launch checklist, with the steps that need your real domain, email or AdSense account marked.

## Project map

```
site.config.mjs            <- the ONE file with your details and the AdSense switches
astro.config.mjs           reads the production URL from site.config.mjs
src/content.config.ts      article schema (front matter fields)
src/content/articles/      your articles (Markdown); one unpublished example is included
src/layouts/BaseLayout.astro   shared layout: SEO tags, canonicals, social tags, JSON-LD, AdSense tags
src/pages/                 index, blog, [...path] (articles), about, contact, privacy, 404,
                           sitemap.xml.ts, robots.txt.ts
src/components/            header (mobile menu), footer, article list, related articles
src/styles/global.css      all styling (plain CSS, no web fonts)
public/                    favicon.svg, og-default.png, _redirects (empty), _headers, images/
scripts/                   check-launch.mjs, new-article.mjs, list-urls.mjs
content-templates/         article template and five outlines (never published)
docs/                      step-by-step guides
```

## What the site generates

- `sitemap.xml` (published articles, plus home/blog once at least one article exists, plus About/Contact/Privacy once complete; never drafts or 404)
- `robots.txt` (allows crawling; points to the sitemap)
- Per page: unique `<title>` and meta description, self-referencing canonical on indexable pages, Open Graph and Twitter tags
- Per article: `BlogPosting` structured data built only from that article's real front matter and your configured author. If no author is set, the author field is omitted rather than invented.
- Pages without enough details (or an empty blog) are `noindex`, have no canonical and are not in the sitemap.

## Troubleshooting

- **`npm run build` fails with a schema message:** it names the article file and field (e.g. `description` too short, `draft` missing). Fix the front matter.
- **Build stops with "Launch check" errors:** read the listed items. Unset `STRICT_LAUNCH` while you are still writing, or fill in the missing details.
- **Cloudflare build fails with "SITE_URL":** add the `SITE_URL` variable (see docs/DEPLOY-CLOUDFLARE.md) and redeploy.
- **Node version errors on Cloudflare:** add an environment variable `NODE_VERSION` = `22` (the repo also contains `.nvmrc`).
- **An Astro error you can't resolve on the first build:** this project was not compiled during creation. Copy the full error message and ask for it to be fixed; the code is small and every file is in this repository.
- **Upgrading Astro:** `package.json` allows Astro 5.x (`^5.8.0`). Upgrade to a newer major version deliberately and follow Astro's upgrade guide; don't mix it into content work.
