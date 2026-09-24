// One-shot (2026-09-24): wire audio.de for the two freshly rendered DE posts.
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
const adds = {
  'what-are-you-implying': 'what-are-you-implying_de_2026-09-24.mp3',
  'what-are-we-even-talking-about': 'what-are-we-even-talking-about_de_2026-09-24.mp3',
};
for (const post of m.posts) {
  if (!(post.slug in adds)) continue;
  post.audio = post.audio || {};
  post.audio.de = adds[post.slug];
}
writeFileSync('content/index.json', JSON.stringify(m, null, 2) + '\n');
console.log('audio.de wired for:', Object.keys(adds).join(', '));
