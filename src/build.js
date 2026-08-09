// src/build.js — manifest + shell emitter for the runtime-rendered site.
// Content is served raw (markdown/JSON); the browser fetches and renders it
// on demand. The build has three jobs: copy the content manifest + raw files
// into site/data/, emit thin shells per route, copy assets.
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const ASSETS = path.join(ROOT, 'assets');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'site');

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function writeFile(rel, content) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log('  wrote', path.relative(ROOT, p));
}

const m = readJSON(path.join(CONTENT, 'index.json'));
const site = m.site;

/* ---------- clean output ---------- */

fs.rmSync(OUT, { recursive: true, force: true });

/* ---------- 1. copy raw content → site/data/ ---------- */

fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });
fs.copyFileSync(path.join(CONTENT, 'index.json'), path.join(OUT, 'data', 'index.json'));
for (const name of ['posts', 'pages', 'arena']) {
  const src = path.join(CONTENT, name);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(OUT, 'data', name), { recursive: true });
  for (const f of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, f), path.join(OUT, 'data', name, f));
  }
}
console.log('  copied content → site/data/');

/* ---------- 2. shells ---------- */

function shell({ prefix, title, description, kind, slug }) {
  const docTitle = title === site.name ? title : `${title} — ${site.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(docTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<script>try{document.documentElement.dataset.theme=localStorage.getItem('raum-theme')||'system'}catch(e){document.documentElement.dataset.theme='system'}</script>
<link rel="stylesheet" href="${prefix}assets/css/site.css">
<script src="${prefix}assets/js/md-renderer.js" defer></script>
<script src="${prefix}assets/js/app.js" defer></script>
</head>
<body>
<main id="app" data-kind="${kind}" data-slug="${slug || ''}" data-prefix="${prefix}"></main>
</body>
</html>`;
}

const T = (k) => (site.i18n[k] ? site.i18n[k].en : '');

writeFile('index.html', shell({ prefix: '', title: site.name, description: site.description, kind: 'home', slug: '' }));
writeFile('writing/index.html', shell({ prefix: '../', title: T('blog_title'), description: 'Essays and curated conversations.', kind: 'writing', slug: '' }));

for (const p of m.posts) {
  writeFile(`posts/${p.slug}/index.html`, shell({ prefix: '../../', title: p.title, description: p.teaser, kind: 'post', slug: p.slug }));
}
for (const pg of m.pages) {
  writeFile(`${pg.slug}/index.html`, shell({ prefix: '../', title: pg.title, description: pg.title, kind: 'page', slug: pg.slug }));
}

writeFile('arena/index.html', shell({ prefix: '../', title: 'Arena', description: 'Curated conversations between models.', kind: 'arena', slug: '' }));
for (const lm of m.arena.landmarks) {
  writeFile(`arena/${lm.slug}/index.html`, shell({ prefix: '../../', title: lm.title, description: lm.case, kind: 'arena-session', slug: lm.slug }));
}

/* ---------- 3. assets ---------- */

fs.cpSync(path.join(ASSETS, 'css'), path.join(OUT, 'assets', 'css'), { recursive: true });
fs.cpSync(path.join(ASSETS, 'js'), path.join(OUT, 'assets', 'js'), { recursive: true });
// vendored markdown engine as a browser script (dual-export, see src/md.js)
fs.copyFileSync(path.join(SRC, 'md.js'), path.join(OUT, 'assets', 'js', 'md-renderer.js'));
console.log('  copied assets → site/assets/');

console.log(`\nShells: ${m.posts.length} posts, ${m.pages.length} pages, ${m.arena.landmarks.length} arena sessions. Content renders at runtime.`);
