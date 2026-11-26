// Runs before every `npm run build`. Prints warnings, and FAILS the build for
// problems that would publish wrong or fake information.
//
//  - Always fails for: dummy/invalid AdSense IDs, bad ads.txt lines.
//  - Fails on Cloudflare Pages (CF_PAGES=1) if SITE_URL is missing/localhost.
//  - Fails for incomplete details only when STRICT_LAUNCH=true.
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.mjs';
import { listArticles } from './lib-frontmatter.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.env.STRICT_LAUNCH === 'true';
const onCloudflare = process.env.CF_PAGES === '1';
const errors = [];
const warnings = [];
const soft = (msg) => (strict ? errors : warnings).push(msg);

// 1. Production URL
try {
  const u = new URL(config.siteUrl);
  const local = ['localhost', '127.0.0.1', '::1'].includes(u.hostname);
  if (local || u.protocol !== 'https:') {
    (onCloudflare ? errors : warnings).push(
      `SITE_URL is "${config.siteUrl}". Set SITE_URL to your https production URL (pages.dev or custom domain) so canonicals and the sitemap are correct.`,
    );
  }
} catch {
  errors.push(`SITE_URL "${config.siteUrl}" is not a valid URL.`);
}

// 2. AdSense configuration (never allow dummy IDs)
const ad = config.adsense;
const idOk = /^ca-pub-\d{10,20}$/.test(ad.publisherId) && !/^ca-pub-0+$/.test(ad.publisherId);
if ((ad.verificationMeta || ad.loadAdScript) && !idOk) {
  errors.push('adsense.publisherId must be your real "ca-pub-..." ID from AdSense before enabling verificationMeta or loadAdScript.');
}
if (ad.loadAdScript && !config.privacy.consentConfirmed) {
  soft('adsense.loadAdScript is true but privacy.consentConfirmed is false. Set up consent messaging first (docs/ADSENSE-CHECKLIST.md).');
}
if (ad.loadAdScript && !config.privacy.effectiveDate) {
  soft('Update the privacy policy date (privacy.effectiveDate) when you enable ads.');
}

// 3. ads.txt must contain only real entries
const adsTxt = join(root, 'public', 'ads.txt');
if (existsSync(adsTxt)) {
  const lines = readFileSync(adsTxt, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  for (const line of lines) {
    if (!/^[^,\s]+,\s*[^,\s]+,\s*(DIRECT|RESELLER)(,\s*[^,\s]+)?$/i.test(line)) {
      errors.push(`public/ads.txt has a line that is not a valid ads.txt entry: "${line}"`);
    }
    if (/pub-0+\b|pub-x+/i.test(line)) errors.push('public/ads.txt contains a dummy publisher ID. Paste the exact line from AdSense.');
  }
  if (!idOk) warnings.push('public/ads.txt exists but adsense.publisherId is empty. Make sure the ads.txt line is the exact one Google gave you.');
}

// 4. Details needed for About / Contact / Privacy pages
const missing = [];
if (!config.author.name) missing.push('author.name');
if (!config.author.bio.some(Boolean)) missing.push('author.bio');
if (!config.contactEmail) missing.push('contactEmail');
if (!(config.privacy.operatorName || config.author.name)) missing.push('privacy.operatorName');
if (!config.privacy.effectiveDate) missing.push('privacy.effectiveDate');
if (config.privacy.usesAnalytics && !config.privacy.analyticsName) missing.push('privacy.analyticsName');
if (missing.length) {
  soft(`site.config.mjs is missing: ${missing.join(', ')}. The About/Contact/Privacy pages stay noindex and out of the sitemap until these are filled in.`);
}

// 5. Articles
const articles = listArticles(join(root, 'src', 'content', 'articles'));
const published = articles.filter((a) => !a.draft);
if (published.length === 0) soft('There are no published articles yet (draft: false). Do not apply for AdSense with an empty site.');
for (const a of published) {
  if (/\bTODO\b|REPLACE_ME/.test(a.raw)) soft(`Published article "${a.file}" still contains TODO / REPLACE_ME text.`);
  if (!a.data.author && !config.author.name) warnings.push(`Article "${a.file}" has no author and site.config author.name is empty; BlogPosting data will omit the author.`);
}

// Report
const tag = strict ? 'STRICT' : 'normal';
console.log(`\nLaunch check (${tag} mode): ${published.length} published / ${articles.length} total articles`);
for (const w of warnings) console.log(`  warning: ${w}`);
for (const e of errors) console.error(`  ERROR:   ${e}`);
if (errors.length) {
  console.error('\nBuild stopped. Fix the errors above (or unset STRICT_LAUNCH while you are still writing).\n');
  process.exit(1);
}
console.log(warnings.length ? '' : '  all checks passed\n');
