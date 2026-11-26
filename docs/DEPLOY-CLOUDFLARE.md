# Deploy to Cloudflare Pages (Free) from your own GitHub repository

Cloudflare's current Astro guide uses exactly these settings: **Production branch** `main`, **Build command** `npm run build`, **Build output directory** `dist`. (Cloudflare's dashboard labels change over time. If you can't find the "Pages" option, open Cloudflare's current docs at https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/ and follow the Git-integration steps there.)

You need: a free Cloudflare account, a GitHub account, and this project pushed to a GitHub repository (see README step 3). **Commit `package-lock.json`** (created by your first `npm install`).

## 1. Create the project

1. Cloudflare dashboard, **Workers & Pages**, **Create application**, **Pages** tab, **Import an existing Git repository**.
2. Authorize GitHub, choose your repository, **Begin setup**.
3. Enter:

   | Setting | Value |
   |---------|-------|
   | Project name | e.g. `dailybetterjourney` (this becomes `dailybetterjourney.pages.dev` if the name is free) |
   | Production branch | `main` |
   | Framework preset | `Astro` (or `None`; the two values below are what matter) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. Before saving, open **Environment variables** and add:

   | Name | Value | Why |
   |------|-------|-----|
   | `SITE_URL` | the exact URL Cloudflare will give you, e.g. `https://dailybetterjourney.pages.dev` | Used for every canonical, the sitemap, robots.txt, social tags |
   | `NODE_VERSION` | `22` | Makes the Node version explicit |

   Don't know the final `pages.dev` name yet? Name the project first, then add `SITE_URL` afterwards under **Settings**, **Variables and Secrets** (called **Environment variables** in some dashboard versions), and **Retry deployment**. The build refuses to run on Cloudflare without a real `SITE_URL`, so you can't accidentally publish localhost canonicals.

5. **Save and Deploy.** Cloudflare installs dependencies and builds. Each later `git push` to `main` redeploys automatically.

## 2. Test on pages.dev

Open `https://YOUR-PROJECT.pages.dev` and check:

- [ ] Home, Blog, an article, About, Contact, Privacy and a made-up address (should show the 404 page)
- [ ] Mobile menu opens/closes (use your browser's responsive mode or your phone)
- [ ] `/sitemap.xml` lists only published pages and uses your `pages.dev` address
- [ ] `/robots.txt` shows `Allow: /` and the correct `Sitemap:` line
- [ ] View source of an article: one `<link rel="canonical">` pointing to that article's own `pages.dev` URL, `BlogPosting` JSON-LD with the real title/date/author
- [ ] A draft's address (e.g. `/blog/example-unpublished-article/`) shows 404

Windows quick check:

```powershell
curl.exe -I https://YOUR-PROJECT.pages.dev/
curl.exe https://YOUR-PROJECT.pages.dev/robots.txt
```

## 3. Going public safely

When your details are filled in and you have real articles, add **`STRICT_LAUNCH` = `true`** to the **Production** environment variables and redeploy. If anything is incomplete the build fails instead of publishing it.

## Preview deployments

Branches other than `main` get their own preview URLs. They use the same `SITE_URL`, so their canonicals point at production. To keep previews private, use Cloudflare Access on previews (see Cloudflare's "Customize preview deployments access").

## Switching to your own domain later

See [DOMAIN-AND-DNS.md](DOMAIN-AND-DNS.md). The only value you change in this project is `SITE_URL`.
