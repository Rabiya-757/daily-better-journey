# Custom domain, DNS, and the pages.dev redirect

Two paths. Pick the one that matches reality today.

- **Path A: you still control dailybetterjourney.com** (continue below).
- **Path B: the domain is gone.** Launch on `pages.dev` now, buy another domain later, and follow the "Switching later" checklist at the bottom. Nothing in the code is tied to that name; only `SITE_URL` changes.

> Needs your real domain: everything in this file.

## How Cloudflare connects domains (from Cloudflare's docs)

- A **subdomain** such as `www.dailybetterjourney.com` can point at your Pages project with a **CNAME** record, even if DNS is hosted elsewhere.
- A **root (apex) domain** such as `dailybetterjourney.com` can only be attached if the domain is a **zone on the same Cloudflare account**, which means moving its **nameservers** to Cloudflare.

So you have two options:

**Option 1: move DNS to Cloudflare (recommended; apex + www both work).** Follow the steps below, carefully, if the domain already has email.

**Option 2: keep DNS where it is.** Add `www` as a CNAME to `YOUR-PROJECT.pages.dev` after adding `www.dailybetterjourney.com` as a custom domain in your Pages project, and ask your registrar to forward the bare domain to `https://www.dailybetterjourney.com`. Registrar forwarding features vary, so check your registrar's help. In this case set `SITE_URL=https://www.dailybetterjourney.com`. No nameserver change means no email risk.

## Option 1 in detail: nameservers to Cloudflare without breaking email or verification

Changing nameservers moves **all** DNS to Cloudflare. Any record that doesn't get copied stops working. Do this in order:

1. **Record everything at your current DNS host first.** Screenshot or export every record: `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `SRV`, `CAA`. If your host offers a zone-file export, download it.
2. **Add the domain to Cloudflare** (Add a site, Free plan). Cloudflare scans and imports many records, but the scan is not guaranteed complete.
3. **Compare line by line** and add anything missing. Pay special attention to:
   - `MX` records (incoming email)
   - `TXT` for **SPF** (starts `v=spf1`), **DKIM** (names like `selector._domainkey`), **DMARC** (`_dmarc`)
   - `TXT` records used for **verification** (Google, Microsoft 365, Search Console, other services)
   - `CNAME` records used by email or other services (e.g. `autodiscover`, mail tracking). Set these to **DNS only** (grey cloud), not proxied. Mail records must not be proxied.
4. **DNSSEC:** if it's enabled at your registrar, turn it off *before* changing nameservers, and re-enable it afterwards using Cloudflare's DS record (otherwise the domain can stop resolving).
5. **Change the nameservers** at your registrar to the two Cloudflare gives you. Propagation can take from minutes to a day or more.
6. **Test email**: send to and from your domain addresses, and confirm any third-party verifications still pass. Do not cancel your old DNS host until this works.
7. **Add the custom domain to Pages:** your Pages project, **Custom domains**, **Set up a custom domain**, enter `dailybetterjourney.com`, confirm the DNS record Cloudflare proposes. Repeat for `www.dailybetterjourney.com`. Wait for the certificate (usually minutes).
8. **Redirect www to the bare domain (or reverse)** so there is one canonical host. Cloudflare documents this with Bulk Redirects ("Redirecting www to domain apex"). Choose one host and keep it in `SITE_URL`.

## Switch every canonical and sitemap URL

1. In Cloudflare, **Settings**, **Variables and Secrets**, set `SITE_URL` to `https://dailybetterjourney.com` (or your `www` version if that's the one you chose). **No trailing slash.**
2. **Retry deployment** or push any commit.
3. Verify on the new domain:
   - View source: `<link rel="canonical">` shows the new domain.
   - `https://dailybetterjourney.com/sitemap.xml` and `/robots.txt` show the new domain.

That is the only setting. Canonicals, sitemap, robots.txt, Open Graph URLs and JSON-LD all read `SITE_URL`.

## Redirect the public pages.dev host (so only one host is indexable)

Do this **after** the custom domain works and you've confirmed the site loads there. Cloudflare's documented method uses account-level Bulk Redirects:

1. Dashboard, **Workers & Pages**, your project, **Custom domains**: confirm your custom domain is listed.
2. Open **Bulk Redirects** and create a **list** with one entry:

   | Source URL | Target URL | Status | Options to enable |
   |-----------|------------|--------|-------------------|
   | `YOUR-PROJECT.pages.dev` | `https://dailybetterjourney.com` | `301` | Preserve query string, Subpath matching, Preserve path suffix, Include subdomains |

   (The target must include `https://`.)
3. Create a **Bulk Redirect rule** that uses that list.
4. Test: `curl.exe -I https://YOUR-PROJECT.pages.dev/blog/` should answer `301` with a `location:` header on your custom domain.

Until the redirect is live, both hosts serve the site, but every page's canonical already names the custom domain. After the redirect, `pages.dev` serves no indexable copies. Check Cloudflare's current limits for Bulk Redirects on the Free plan before relying on them.

## After the domain is live

- Search Console: add the new domain as a property and submit `https://dailybetterjourney.com/sitemap.xml`. Keep the old `pages.dev` property for a while to watch it drop out.
- AdSense: add the custom domain as your site. `public/ads.txt` (if you've created it) is deployed with the site at the new domain's root.
- Review the privacy policy: its site URL updates automatically from `SITE_URL`.

## Switching later (Path B checklist)

- [ ] Launch on `pages.dev` with `SITE_URL=https://YOUR-PROJECT.pages.dev`
- [ ] Buy/regain a domain; attach it as above
- [ ] Change `SITE_URL`, redeploy
- [ ] Set up the `pages.dev` to custom-domain Bulk Redirect
- [ ] Add the new Search Console property; submit the new sitemap
- [ ] Update the AdSense site and re-verify
- [ ] If your site name changes with the domain, edit `siteName` and the text in `site.config.mjs`
