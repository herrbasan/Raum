// One-shot (2026-09-24): German audio refresh pending nSpeech language-tag work.
// Removes `audio.de` from every post in content/index.json; drops the whole
// `audio` object when no language remains. DE player embeds were already
// stripped from the canonical MDs and mirrored into content/posts/.
// Run once from repo root: node tools/strip-de-audio.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const MANIFEST = 'content/index.json';
const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));

let touched = 0, droppedDe = 0, droppedObject = 0;
for (const post of m.posts) {
  if (!post.audio) continue;
  touched++;
  if ('de' in post.audio) { delete post.audio.de; droppedDe++; }
  if (Object.keys(post.audio).length === 0) { delete post.audio; droppedObject++; }
}

writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');
console.log(`posts with audio: ${touched}, audio.de removed: ${droppedDe}, audio object dropped: ${droppedObject}`);
