// Usage (Windows, macOS, Linux):  npm run new -- "Your article title"
// Creates src/content/articles/<slug>.md from content-templates/article-template.md
// as a DRAFT. Change `draft: true` to `draft: false` when you are ready to publish.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('Usage: npm run new -- "Your article title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
if (!slug) {
  console.error('Could not make a URL slug from that title. Use letters or numbers.');
  process.exit(1);
}

const target = resolve(root, 'src', 'content', 'articles', `${slug}.md`);
if (existsSync(target)) {
  console.error(`Already exists: ${target}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const template = readFileSync(resolve(root, 'content-templates', 'article-template.md'), 'utf8');
const out = template
  .replaceAll('{{TITLE}}', title.replace(/"/g, '\\"'))
  .replaceAll('{{SLUG}}', slug)
  .replaceAll('{{DATE}}', today);
writeFileSync(target, out, 'utf8');
console.log(`Created draft: src/content/articles/${slug}.md`);
console.log('Next: write it, then set draft: false when it is ready to publish.');
