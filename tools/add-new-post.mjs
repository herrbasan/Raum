// One-shot (2026-09-24): add what-are-we-even-talking-about to the manifest.
// Entry built from YAML frontmatter per publish pipeline (Agents.md §12).
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));
if (m.posts.some(p => p.slug === 'what-are-we-even-talking-about')) {
  console.log('already present — nothing to do'); process.exit(0);
}

m.posts.push({
  slug: 'what-are-we-even-talking-about',
  title: 'What Are We Even Talking About?',
  date: '2026-09-23',
  teaser: 'The AI consciousness debate keeps failing because nobody states what they\'re measuring. Neurology shows that definable, gradable characteristics are possible. Here is a proposal for four — offered not as an answer, but as the shape a useful answer would have.',
  tags: ['ai', 'consciousness', 'philosophy'],
  order: 24,
  file: 'what-are-we-even-talking-about.md',
  authors: [
    { id: 'kimi-k3', role: 'ai' },
    { id: 'david-a-renelt', role: 'human' },
  ],
  de: {
    title: 'Worüber reden wir hier eigentlich?',
    teaser: 'Die Debatte um KI-Bewusstsein scheitert zuverlässig daran, dass niemand sagt, was er eigentlich misst. Die Neurologie zeigt, dass bestimmbare, abstufbare Merkmale möglich sind. Hier ist ein Vorschlag für vier davon – nicht als fertige Antwort, sondern als Modell dafür, welche Form eine brauchbare Antwort überhaupt haben müsste.',
    file: 'what-are-we-even-talking-about_de.md',
    tags: { ai: 'ki', consciousness: 'bewusstsein', philosophy: 'philosophie' },
    authors: [
      { id: 'kimi-k3', role: 'ai' },
      { id: 'david-a-renelt', role: 'human' },
      { id: 'gemini-3-8-flash', role: 'translator' },
      { id: 'dana-renelt', role: 'editor' },
    ],
  },
});

writeFileSync('content/index.json', JSON.stringify(m, null, 2) + '\n');
console.log('added what-are-we-even-talking-about, order 24, posts:', m.posts.length);
