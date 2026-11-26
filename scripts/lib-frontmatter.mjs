// Tiny front-matter reader used by the helper scripts (no dependencies).
// It only understands simple "key: value" lines, which is all this project uses.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!match) return { data, body: text };
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    // YAML allows a trailing "# comment" after an unquoted value.
    if (!/^["']/.test(value)) value = value.replace(/\s+#.*$/, '').trim();
    if (/^(".*"|'.*')$/.test(value)) value = value.slice(1, -1);
    data[m[1]] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

export function listArticles(articlesDir) {
  let files = [];
  try {
    files = readdirSync(articlesDir, { recursive: true }).filter((f) => String(f).endsWith('.md'));
  } catch {
    return [];
  }
  return files.map((file) => {
    const raw = readFileSync(join(articlesDir, String(file)), 'utf8');
    const { data, body } = readFrontmatter(raw);
    return { file: String(file), raw, data, body, draft: String(data.draft).toLowerCase() !== 'false' };
  });
}

// Final public path of an article, mirroring src/lib/posts.ts.
export function articlePath(data) {
  if (data.url) return '/' + data.url.replace(/^\/+|\/+$/g, '') + '/';
  return `/blog/${data.slug}/`;
}
