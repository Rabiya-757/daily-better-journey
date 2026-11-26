// Usage:  npm run urls                      -> list the public URL of every article
//         npm run urls -- old-urls.txt      -> compare with your OLD URLs
//
// old-urls.txt = one old URL path per line (e.g. /my-old-post or /2023/05/my-old-post/).
// The script NEVER writes redirects. It only tells you which old URLs have no page yet,
// so you can confirm them and add 301 rules to public/_redirects yourself.
import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listArticles, articlePath } from './lib-frontmatter.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const articles = listArticles(join(root, 'src', 'content', 'articles')).filter((a) => !a.draft);
const current = articles.map((a) => ({ file: a.file, title: a.data.title, path: articlePath(a.data) }));

console.log('\nPublished article URLs:');
if (!current.length) console.log('  (none yet)');
for (const c of current) console.log(`  ${c.path}   <- ${c.file}`);

const oldFile = process.argv[2];
if (!oldFile) {
  console.log('\nTip: npm run urls -- old-urls.txt   compares against your old URL list.\n');
  process.exit(0);
}

const norm = (p) => {
  let s = p.trim();
  try { if (/^https?:\/\//i.test(s)) s = new URL(s).pathname; } catch {}
  s = s.split(/[?#]/)[0];
  if (!s.startsWith('/')) s = '/' + s;
  return s.endsWith('/') ? s : s + '/';
};
const oldUrls = readFileSync(resolve(oldFile), 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map(norm);
const have = new Set(current.map((c) => c.path));

const kept = oldUrls.filter((u) => have.has(u));
const unmatched = oldUrls.filter((u) => !have.has(u));
console.log(`\nOld URLs that already match a page (no redirect needed): ${kept.length}`);
for (const u of kept) console.log(`  OK  ${u}`);
console.log(`\nOld URLs with NO page at that address: ${unmatched.length}`);
for (const u of unmatched) console.log(`  ??  ${u}`);
if (unmatched.length) {
  console.log('\nFor each one, either:');
  console.log('  A) add  url: "<old path>"  to the matching article front matter (keeps the URL), or');
  console.log('  B) after you CONFIRM the old URL was real, add a line to public/_redirects:');
  console.log('       <old path>  <new path>  301\n');
}
