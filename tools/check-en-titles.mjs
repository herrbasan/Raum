// One-shot: verify manifest EN titles match canonical YAML titles.
import { readFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
const drift = [];
for (const p of m.posts) {
  const md = readFileSync(`content/posts/${p.file}`, 'utf8');
  const t = md.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (t && t !== p.title) drift.push({ slug: p.slug, manifest: p.title, canonical: t });
}
console.log(drift.length ? JSON.stringify(drift, null, 1) : 'all EN titles in sync');
