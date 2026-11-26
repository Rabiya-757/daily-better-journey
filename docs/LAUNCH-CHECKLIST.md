# Publish your first article, then launch

Legend: **[domain]** needs your real domain, **[email]** needs your real contact email, **[adsense]** needs your AdSense account. Unmarked steps need nothing but your computer and accounts.

## A. Publish your first article

1. Pick one of the outlines in `content-templates/outlines/`, or your own topic. Write from something you really did.
2. In PowerShell, inside the project folder:
   ```powershell
   npm run new -- "Your article title"
   ```
3. Open `src/content/articles/your-article-title.md` in any editor (VS Code recommended).
4. Edit the front matter: `description` (120 to 160 characters), `category`, `publishDate`, and remove the `TODO` text everywhere. Keep `draft: true` while writing.
5. Preview: `npm run dev`, then set `PUBLIC_PREVIEW_DRAFTS=true` in `.env` if you want to see the draft in the browser.
6. When it's ready, change `draft: true` to `draft: false`.
7. Check the real build: `npm run build` then `npm run preview`. Open the article, view source, confirm title, description, canonical and BlogPosting data.
8. Publish:
   ```powershell
   git add .
   git commit -m "Publish: Your article title"
   git push
   ```
9. Cloudflare rebuilds in a minute or two. Open the live article address and `/sitemap.xml` to confirm it's listed.
10. Later edits: change the text, set `updatedDate` to the edit date, push again.

## B. Launch checklist

### Setup
- [ ] Node installed, `npm install` run, `package-lock.json` committed
- [ ] `npm run build` and `npm run preview` work locally
- [ ] Code pushed to **your** GitHub repository
- [ ] Cloudflare Pages project created (build `npm run build`, output `dist`), `SITE_URL` set, first deploy works on `pages.dev`

### Your details
- [ ] **[email]** `contactEmail` set; mailto link on Contact opens your mail app and the address receives mail
- [ ] `author.name` and `author.bio` set (true statements only)
- [ ] Optional: `editorialNote` (how you write and correct articles)
- [ ] `privacy.operatorName` (or author name) and `privacy.effectiveDate` set
- [ ] You read `/privacy/` and every sentence is true for your site
- [ ] Footer name and About page read the way you want

### Content
- [ ] Several complete, original articles published (see the AdSense checklist for guidance, no official minimum)
- [ ] Each article has a real description, category, date and internal links to related articles
- [ ] No `TODO`, no example text, no placeholder images; the example draft is deleted or still `draft: true`
- [ ] Old articles imported and old URLs checked (`npm run urls -- old-urls.txt`); redirects added only for confirmed URLs

### Safety switch
- [ ] `STRICT_LAUNCH=true` on the Cloudflare **production** environment and the build passes

### Domain and URLs **[domain]**
- [ ] Domain attached (apex and www) and one host chosen as canonical
- [ ] Email and verification DNS records preserved if nameservers moved (see DOMAIN-AND-DNS.md)
- [ ] `SITE_URL` changed to `https://dailybetterjourney.com` and redeployed
- [ ] Canonical, sitemap and robots.txt show the custom domain
- [ ] `pages.dev` Bulk Redirect (301) created and tested

### Search
- [ ] Search Console property verified **[domain]** for Domain property (or URL-prefix tag for pages.dev)
- [ ] `sitemap.xml` submitted; home and one article inspected and indexing requested

### AdSense **[adsense]**
- [ ] Read the AdSense Checklist (Parts 1, 3 and 4)
- [ ] Site added in AdSense; ownership verified (meta tag or ads.txt)
- [ ] `public/ads.txt` contains Google's exact line **[adsense]**
- [ ] Consent messaging configured; `privacy.consentConfirmed: true`; privacy date updated
- [ ] `adsense.loadAdScript` stays `false` until approved or instructed by Google
- [ ] Check **Sites** in AdSense for the review status; fix anything it names
