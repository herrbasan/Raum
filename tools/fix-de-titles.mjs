// One-shot: sync manifest de.title to canonical YAML title for every drifted post.
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
let fixed = 0;
for (const p of m.posts) {
  if (!p.de) continue;
  const md = readFileSync(`content/posts/${p.de.file}`, 'utf8');
  const t = md.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  if (t && t !== p.de.title) { console.log(`${p.slug}: "${p.de.title}" -> "${t}"`); p.de.title = t; fixed++; }
}
writeFileSync('content/index.json', JSON.stringify(m, null, 2) + '\n');
console.log(`fixed: ${fixed}`);
