// One-shot: verify manifest de.title matches canonical YAML/H1 title for every post.
import { readFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
const drift = [];
for (const p of m.posts) {
  if (!p.de) continue;
  const md = readFileSync(`content/posts/${p.de.file}`, 'utf8');
  const fmTitle = md.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (fmTitle && fmTitle !== p.de.title) drift.push({ slug: p.slug, manifest: p.de.title, canonical: fmTitle });
}
console.log(drift.length ? JSON.stringify(drift, null, 1) : 'all DE titles in sync');
