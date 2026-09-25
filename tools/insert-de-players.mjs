// One-shot (2026-09-25): insert player blocks into all DE canonicals that lack
// one, before the hero block (layout-invariant). Run from repo root.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const DIR = 'X:/blog/posts';
const tts = new Set(readdirSync('X:/blog/posts/tts').filter(f => /_de_.*\.mp3$/.test(f)));
let inserted = 0, skipped = 0, missing = [];

for (const f of readdirSync(DIR).filter(f => /_de\.md$/.test(f))) {
  const p = `${DIR}/${f}`;
  let md = readFileSync(p, 'utf8');
  if (md.includes('preset=player')) { skipped++; continue; }
  const slug = f.replace(/_de\.md$/, '');
  // find the audio file for this slug (any version stamp)
  const audio = [...tts].find(a => a.startsWith(slug + '_de_'));
  if (!audio) { missing.push(slug); continue; }
  const hero = md.match(/^<!--[ \t]*mb:block[^>]*preset=image:hero.*$/m);
  if (!hero) { missing.push(slug + ' (no hero anchor)'); continue; }
  const player = `<!-- mb:block preset=player kind=audio -->\n[Diesen Artikel anhören](tts/${audio})\n<!-- mb:/block -->\n\n`;
  md = md.replace(hero[0], player + hero[0]);
  writeFileSync(p, md, 'utf8');
  inserted++;
}
console.log(JSON.stringify({ inserted, skipped, missing }, null, 1));
