// One-shot (2026-10-27): add We Used Up All the Slack and its new author records.
// Entry built from YAML frontmatter per publish pipeline (Agents.md §12).
import { readFileSync, writeFileSync } from 'node:fs';

const m = JSON.parse(readFileSync('content/index.json', 'utf8'));

if (m.posts.some((p) => p.slug === 'we-used-up-all-the-slack')) {
  console.log('post already present — nothing to do');
  process.exit(0);
}

const NEW_AUTHORS = [
  {
    id: 'kimi-k31-pro',
    name: 'Kimi K3.1 Pro',
    role: 'llm',
    model: 'kimi-k31-chat',
    file: 'kimi-k31-pro.md',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    role: 'llm',
    model: 'gemini-argon-chat',
    file: 'gemini-4-argon.md',
  },
];

for (const a of NEW_AUTHORS) {
  if (!m.authors.some((x) => x.id === a.id)) m.authors.push(a);
}

m.posts.push({
  slug: 'we-used-up-all-the-slack',
  title: 'We Used Up All the Slack',
  date: '2026-10-27',
  teaser: 'Enterprise software development learned to survive its own inefficiency because faster hardware kept absorbing the cost. AI makes that inefficiency visible — but merely giving AI to the same structures will not fix it.',
  tags: ['ai', 'software-development', 'enterprise', 'management'],
  order: 30,
  file: 'we-used-up-all-the-slack.md',
  authors: [
    { id: 'david-a-renelt', role: 'human' },
    { id: 'kimi-k31-pro', role: 'ai' },
  ],
  de: {
    title: 'Der Spielraum ist aufgebraucht',
    teaser: 'Die moderne Unternehmens-IT wurde darauf ausgelegt, Menschen austauschbar und Entscheidungen absicherbar zu machen – bezahlt mit schnellerer Hardware und dem Verlust des Blicks aufs Ganze. Jetzt macht KI das Bauen von Software so billig, dass dieser über Jahrzehnte aufgebaute Puffer aufgebraucht ist.',
    file: 'we-used-up-all-the-slack_de.md',
    tags: {
      ai: 'ki',
      'software-development': 'softwareentwicklung',
      enterprise: 'unternehmen',
      management: 'management',
    },
    authors: [
      { id: 'david-a-renelt', role: 'human' },
      { id: 'kimi-k31-pro', role: 'ai' },
      { id: 'gemini-4-argon', role: 'translator' },
      { id: 'dana-renelt', role: 'editor' },
    ],
  },
  audio: {
    en: 'we-used-up-all-the-slack_2026-10-27.mp3',
    de: 'we-used-up-all-the-slack_de_2026-10-27.mp3',
  },
});

writeFileSync('content/index.json', JSON.stringify(m, null, 2) + '\n');
console.log(`added we-used-up-all-the-slack, order 30, posts: ${m.posts.length}, authors: ${m.authors.length}`);
