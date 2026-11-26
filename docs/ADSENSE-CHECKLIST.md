# Google Search Console and AdSense checklist

> Nothing here guarantees approval. Google decides, using its own policies. Apply only when the site is genuinely finished.

## What I verified from Google's pages (checked 24 Nov 2026)

| Topic | What Google's pages say | Source |
|-------|-------------------------|--------|
| Basic eligibility | You can sign up if you have **your own content that meets the AdSense policies** and you're **18 or over**. You must be able to **access the HTML source code** of the site you submit. | support.google.com/adsense/answer/9724 |
| Content quality | Content must be high quality, original and attract an audience. | same page (UK edition) |
| Minimum number of articles | **Not stated** in the eligibility text I read. Blogs that say "15 to 20 articles" are third-party opinions, not Google rules. | (absence confirmed on the page above; re-check it yourself) |
| Traffic threshold / domain age | **Not stated** in the same text. Some countries may have extra requirements; the AdSense sign-up flow shows yours. | same page |
| What can be added as a site | Google lists: **domains** (e.g. `website.com`), **subdomains on platforms that are on the Public Suffix List** (e.g. `site.appspot.com`), and sites managed by AdSense platform partners. | support.google.com/adsense/answer/12170421 |
| `pages.dev` eligibility | **I could not confirm** that `*.pages.dev` qualifies, because I could not verify its Public Suffix List status here. Don't assume. Test by adding it under AdSense, **Sites**. For a clean path, **use your own domain**. | (unverified) |
| Ownership verification | Google verifies ownership via your **ad code**, your **ads.txt file**, or a **meta tag**. After that it reviews the site for policy compliance. | support.google.com/adsense/answer/12131223 |
| Crawling | The site must be crawlable. A `robots.txt` that blocks all agents or Google's crawlers makes review fail. (This site's robots.txt allows everything.) | support.google.com/admanager/answer/10111490 |
| Consent in the EEA/UK | Google requires a **Google-certified consent management platform (CMP)** using the IAB TCF when serving ads to users in the EEA or UK. AdSense's **Privacy & messaging** section offers consent messages. | support.google.com/adsense/announcements/9189068 |
| `ads.txt` | One line: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`, where the `pub-` number is **your** publisher ID. Upload it to the site root. | support.google.com/adsense/answer/12169212 |

Always trust the live Google page over this table if they differ.

## Part 1: before you apply

### Public access and navigation
- [ ] The site loads over `https://` on the address you will submit, with no password, login or country block
- [ ] `robots.txt` allows crawling and `sitemap.xml` opens
- [ ] Every menu and footer link works on desktop and mobile: Home, Blog, About, Contact, Privacy Policy
- [ ] No page says "not available yet", "coming soon", "lorem ipsum" or contains `TODO`
- [ ] No page is empty or only a list of links with no real text

### Original, published content
- [ ] Every article is **your own writing** from your own experience, not copied, spun, or pasted unedited from an AI tool
- [ ] You can name the source of every statistic, quote or image, and you have the right to use each image
- [ ] Articles have clear titles, useful descriptions, dates, and a named author you can stand behind
- [ ] The About page honestly says who writes the site (real details only) and Contact has a working email
- [ ] The Privacy Policy matches what the site actually does (see Part 3)
- [ ] Decide your own bar for "enough content". Google gives no number, so a safe approach is that every page a reviewer can reach is complete, useful and clearly yours, and the blog has several substantial articles rather than a few thin ones

### Ownership
- [ ] You own the repository and the Cloudflare project (access to HTML source: yes)
- [ ] Prefer your own domain for AdSense (see the `pages.dev` row above)
- [ ] Search Console property verified (Part 2)

### Policies
- [ ] Read the AdSense Program policies and Google Publisher Policies: https://support.google.com/publisherpolicies/answer/48182
- [ ] No prohibited content, no copied material, no misleading claims

## Part 2: Google Search Console

1. Go to https://search.google.com/search-console and **Add property**.
2. **Custom domain with DNS access:** choose **Domain**, add the TXT record Google gives you at your DNS host (Cloudflare DNS if you moved nameservers).
3. **pages.dev (or no DNS access):** choose **URL prefix** and the **HTML tag** method. Copy only the `content` value into `searchConsoleVerification` in `site.config.mjs`, deploy, then click **Verify**.
4. **Sitemaps**: submit `https://YOUR-HOST/sitemap.xml` (only once you have at least one published article; before that the sitemap is empty).
5. **URL inspection**: paste your home page and one article URL, check that they are indexable, then **Request indexing**.
6. Watch **Pages** (indexing report) for "Excluded" reasons and **Sitemaps** for errors.

## Part 3: privacy policy and consent before you enable ads

The privacy page is generated from your configuration:

- Edit `site.config.mjs`: `contactEmail`, `privacy.operatorName`, `privacy.effectiveDate`.
- **Read the generated page at `/privacy/` and confirm every sentence is true for your site.** It was drafted from what the code does today (no accounts, forms, own cookies, or analytics; hosted on Cloudflare). If you disagree with any sentence, edit `src/pages/privacy.astro`. I am not a lawyer; if you need legal certainty, have the policy reviewed for the places your readers live.
- **Whenever you change the site** (add analytics, a newsletter form, comments, ads), update the config **and** the policy text, and change `privacy.effectiveDate` to the day it takes effect.
  - Analytics: set `privacy.usesAnalytics: true` and `privacy.analyticsName` (this includes Cloudflare Web Analytics if you switch it on in the dashboard).
  - Ads: turning on `adsense.loadAdScript` adds the advertising section to the policy automatically.

**Consent for ads.** Before serving ads:

1. In AdSense, open **Privacy & messaging** and create a consent message for the regions that need one (EEA, UK and others as Google recommends). Use a Google-certified CMP: Google's own is available there, or use another certified CMP.
2. Make sure visitors can reopen and change their choice later (a requirement of Google's consent program).
3. Publish the message, then set `privacy.consentConfirmed: true` and update `privacy.effectiveDate`.

This project deliberately does **not** include a home-made consent banner: for EEA/UK ads, Google requires a certified CMP.

## Part 4: switching AdSense on (in this order)

**[needs your AdSense account]**

1. Sign up at https://www.google.com/adsense with your own Google account. When Google shows your **publisher ID** (`ca-pub-...`), put it in `adsense.publisherId`.
2. **Verify ownership.** Use whichever method AdSense offers:
   - **Meta tag (recommended here):** set `adsense.verificationMeta: true`. The layout then adds `<meta name="google-adsense-account" content="ca-pub-...">` to every page. It does **not** show ads. Deploy, then click Verify in AdSense.
   - **Ads.txt:** see step 3.
   - **Ad code snippet:** Google may show a `<script async src="https://pagead2.googlesyndication.com/...">` snippet. This site loads that script only on **article pages** (so ads never appear on thin pages like 404, Contact or Privacy) and only when `loadAdScript` is true. If you insist on the snippet method for the home page, use the meta tag instead; it's equivalent for ownership.
3. **ads.txt:** when AdSense gives you the entry, create `public/ads.txt` with **exactly** the line Google provides, nothing else added, e.g. in this format (**never copy this example; your number differs**):
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
   Deploy and check `https://YOUR-HOST/ads.txt`. The build rejects a malformed or dummy (`pub-0000...`) line. AdSense, **Sites** shows when ads.txt was last crawled.
4. Complete Part 3 (consent, privacy policy).
5. After Google approves the site (or tells you to place the ad code), set `adsense.loadAdScript: true`, redeploy.
6. Never click your own ads, ask others to, or place misleading labels around ads. Auto ads and manual units are chosen inside your AdSense account.

## Part 5: where to check review status

- **AdSense**: **Sites** page shows each site's status and any "needs attention" reason. Also watch the email on your Google account.
- **Search Console**: **Pages** (indexing), **Sitemaps** and **URL inspection** show whether Google can reach and index the site.
- If AdSense reports a policy problem, fix the pages it names, then request a review inside AdSense. Don't resubmit repeatedly without changes.
