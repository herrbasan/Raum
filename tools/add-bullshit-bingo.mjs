// One-shot (2026-10-18): add bullshit-bingo to the manifest, plus the two new
// author records its frontmatter names (glm-5-3, gemini-argon).
// Entry built from YAML frontmatter per publish pipeline (Agents.md §12).
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));

if (m.posts.some((p) => p.slug === 'bullshit-bingo')) {
  console.log('post already present — nothing to do');
  process.exit(0);
}

const NEW_AUTHORS = [
  {
    id: 'glm-5-3',
    name: 'GLM 5.3',
    role: 'llm',
    model: 'glm5-chat',
    file: 'glm-5-3.md',
  },
  {
    id: 'gemini-argon',
    name: 'Gemini Argon',
    role: 'llm',
    model: 'gemini-argon-chat',
    file: 'gemini-argon.md',
  },
];

for (const a of NEW_AUTHORS) {
  if (!m.authors.some((x) => x.id === a.id)) m.authors.push(a);
}

m.posts.push({
  slug: 'bullshit-bingo',
  title: 'Bullshit Bingo',
  date: '2026-10-18',
  teaser:
    "Fifty-seven AI-architecture charts, collected and machine-read: factually defensible — and they don't help with anything, because the mechanism they diagram fits in a sentence and the work that matters cannot be drawn. Frankfurt's indifference covers the facts inside the boxes; the grift is the authority posture — 'I know something' — sold with thin substance. The same limit, one scale up, is the framework. What helps is planning the specific integration. Knowable, plannable.",
  tags: ['ai', 'critique', 'industry', 'gatekeeping'],
  order: 29,
  file: 'bullshit-bingo.md',
  authors: [
    { id: 'david-a-renelt', role: 'human' },
    { id: 'deepseek-v4-pro', role: 'ai' },
    { id: 'glm-5-3', role: 'editor' },
    { id: 'gemini-argon', role: 'editor' },
  ],
  de: {
    title: 'Bullshit Bingo',
    teaser:
      'Siebenundfünfzig KI-Architektur-Charts, gesammelt und maschinell gelesen: sachlich verteidigungsfähig — und sie helfen bei nichts, denn der Mechanismus, den sie diagrammieren, passt in einen Satz und die Arbeit, die zählt, lässt sich nicht zeichnen. Frankfurt deckt die Fakten; der Grift deckt die Autorität — das „Ich weiß etwas“ bei dünner Substanz. Was hilft, ist das Planen der konkreten Integration. Wissbar, planbar.',
    file: 'bullshit-bingo_de.md',
    tags: {
      ai: 'ki',
      critique: 'kritik',
      industry: 'industrie',
      gatekeeping: 'gatekeeping',
    },
    authors: [
      { id: 'david-a-renelt', role: 'human' },
      { id: 'deepseek-v4-pro', role: 'ai' },
      { id: 'gemini-3-8-flash', role: 'translator' },
      { id: 'dana-renelt', role: 'editor' },
    ],
  },
  audio: {
    en: 'bullshit-bingo_2026-10-18.mp3',
    de: 'bullshit-bingo_de_2026-10-18.mp3',
  },
});

writeFileSync('content/index.json', JSON.stringify(m, null, 2) + '\n');
console.log(`added bullshit-bingo, order 29, posts: ${m.posts.length}, authors: ${m.authors.length}`);
