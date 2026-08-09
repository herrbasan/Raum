// src/build.js — zero-dependency static site generator for RAUM.
// Reads content/site.json + content/posts.json + content/posts/*.md,
// emits static HTML into site/ plus an LLM-legible page document (index.json)
// per post. Output is deployable to any dumb HTTP host.
'use strict';

const fs = require('fs');
const path = require('path');
const { mdToHtml } = require('./md');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');
const ASSETS = path.join(ROOT, 'assets');
const OUT = path.join(ROOT, 'site');

/* ---------- helpers ---------- */

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function writeFile(relPath, content) {
  const p = path.join(OUT, relPath);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
  console.log('  wrote', path.relative(ROOT, p));
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateDe(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* ---------- i18n ---------- */

function i18nVal(key, lang) {
  const m = site.i18n && site.i18n[key];
  return m ? m[lang] : '';
}

// data-i18n attribute pair for a site-level chrome string (skips if no German)
function i18nAttr(key) {
  const m = site.i18n && site.i18n[key];
  if (!m || !m.de) return '';
  return ` data-i18n data-i18n-en="${escapeHtml(m.en)}" data-i18n-de="${escapeHtml(m.de)}"`;
}

// data-i18n attribute pair for a post title
function postI18nAttr(p) {
  if (!p.hasDe || !p.translations || !p.translations.de) return '';
  const de = p.translations.de;
  return ` data-i18n data-i18n-en="${escapeHtml(p.title)}" data-i18n-de="${escapeHtml(de.title || p.title)}"`;
}

// data-i18n attribute pair for a post teaser
function teaserI18nAttr(p) {
  if (!p.hasDe || !p.translations || !p.translations.de) return '';
  return ` data-i18n data-i18n-en="${escapeHtml(p.teaser)}" data-i18n-de="${escapeHtml(p.translations.de.teaser || p.teaser)}"`;
}

// data-i18n attribute pair for a series part title (only when that post has German)
function partI18n(part) {
  const p = bySlug[part.slug];
  if (!p || !p.hasDe) return '';
  return ` data-i18n data-i18n-en="${escapeHtml(part.title)}" data-i18n-de="${escapeHtml((p.translations && p.translations.de && p.translations.de.title) || part.title)}"`;
}

function seriesLabel(p, lang) {
  const sname = data.series[p.series].name;
  return lang === 'de' ? `${sname}, Teil ${p.seriesIndex}` : `${sname}, part ${p.seriesIndex}`;
}

// metadata line (date · tags · series) in a given language
function metaLine(p, lang) {
  const de = lang === 'de';
  const parts = [de ? formatDateDe(p.date) : formatDate(p.date)];
  const tags = p.tags || [];
  if (tags.length) {
    parts.push(
      tags
        .map((t) => (de && p.translations && p.translations.de && p.translations.de.tags && p.translations.de.tags[t] ? p.translations.de.tags[t] : t))
        .join(' · ')
    );
  }
  if (p.series) parts.push(seriesLabel(p, lang));
  if (p.status === 'draft') parts.push(de ? 'Entwurf' : 'Draft');
  return parts.join(' · ');
}

function metaI18nAttr(p) {
  if (!p.hasDe) return '';
  return ` data-i18n data-i18n-en="${escapeHtml(metaLine(p, 'en'))}" data-i18n-de="${escapeHtml(metaLine(p, 'de'))}"`;
}

/* ---------- load data ---------- */

const site = readJSON(path.join(CONTENT, 'site.json'));
const data = readJSON(path.join(CONTENT, 'posts.json'));
const posts = data.posts;

const bySlug = {};
for (const p of posts) {
  const body = fs.readFileSync(path.join(CONTENT, 'posts', p.slug + '.md'), 'utf8');
  p.body = body.replace(/^\s*# .*\n?/, ''); // strip the leading H1 (title comes from metadata)
  p.bodyHtml = mdToHtml(p.body);
  const dePath = path.join(CONTENT, 'posts', p.slug + '.de.md');
  p.hasDe = fs.existsSync(dePath);
  if (p.hasDe) {
    const de = fs.readFileSync(dePath, 'utf8');
    p.bodyDe = de.replace(/^\s*# .*\n?/, '');
    p.bodyDeHtml = mdToHtml(p.bodyDe);
  }
  p.dateFormatted = formatDate(p.date);
  p.dateFormattedDe = formatDateDe(p.date);
  bySlug[p.slug] = p;
}

const byDate = [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order));
const byArc = [...posts].sort((a, b) => a.order - b.order);
const latest = byDate.find((p) => p.status !== 'draft') || byDate[0];

/* ---------- layout ---------- */

function page({ prefix, current, title, description, body, extra = '' }) {
  const nav = site.nav
    .map((n) => {
      const cls = n.label === current ? ' class="nav-link current"' : ' class="nav-link"';
      const key = 'nav_' + n.path.replace(/[^a-z]/g, '');
      return `<a${cls} href="${prefix}${n.path}"${i18nAttr(key)}>${escapeHtml(n.label)}</a>`;
    })
    .join('');
  const docTitle = title === site.name ? title : `${title} — ${site.name}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(docTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="${prefix}assets/css/site.css">
<script src="${prefix}assets/js/theme.js" defer></script>
<script src="${prefix}assets/js/i18n.js" defer></script>
${extra}
</head>
<body>
<header class="site-header">
  <div class="site-header-inner">
    <a class="brand" href="${prefix}">${escapeHtml(site.name)}</a>
    <nav class="nav" aria-label="Primary">
      ${nav}
      <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Theme"></button>
      <button id="lang-toggle" class="lang-toggle" type="button" aria-label="Language"></button>
    </nav>
  </div>
</header>
${body}
<footer class="site-footer">
  <div class="foot-inner">
    <span>${escapeHtml(site.footer)}</span>
    <span>© ${new Date().getFullYear()}</span>
  </div>
</footer>
</body>
</html>`;
}

/* ---------- series + related ---------- */

function seriesNav(post, prefix) {
  if (!post.series) return '';
  const s = data.series[post.series];
  if (!s) return '';
  const idx = s.parts.findIndex((part) => part.slug === post.slug);
  const items = s.parts
    .map((part) => {
      const attr = partI18n(part);
      if (part.slug === post.slug) return `<li class="current"${attr}>${escapeHtml(part.title)}</li>`;
      if (bySlug[part.slug]) return `<li><a href="${prefix}posts/${part.slug}/"${attr}>${escapeHtml(part.title)}</a></li>`;
      return `<li class="forthcoming"${attr}>${escapeHtml(part.title)}</li>`;
    })
    .join('');
  const kickerEn = `${s.name} — ${i18nVal('series_part', 'en')} ${idx + 1} ${i18nVal('series_of', 'en')} ${s.parts.length}`;
  const kickerDe = post.hasDe ? `${s.name} — ${i18nVal('series_part', 'de')} ${idx + 1} ${i18nVal('series_of', 'de')} ${s.parts.length}` : null;
  const kicker = kickerDe
    ? `<p class="kicker" data-i18n data-i18n-en="${escapeHtml(kickerEn)}" data-i18n-de="${escapeHtml(kickerDe)}">${escapeHtml(kickerEn)}</p>`
    : `<p class="kicker">${escapeHtml(kickerEn)}</p>`;
  return `<aside class="series-nav">${kicker}<ol>${items}</ol></aside>`;
}

function relatedNav(post, prefix) {
  const rels = (post.related || []).map((slug) => bySlug[slug]).filter(Boolean);
  if (!rels.length) return '';
  const kicker = `<p class="kicker"${i18nAttr('related')}>${escapeHtml(i18nVal('related', 'en'))}</p>`;
  return (
    `<aside class="related-nav">${kicker}<ul class="related-list">` +
    rels.map((r) => `<li><a href="${prefix}posts/${r.slug}/"${postI18nAttr(r)}>${escapeHtml(r.title)}</a></li>`).join('') +
    `</ul></aside>`
  );
}

/* ---------- pages ---------- */

// Home
{
  const latestItem = `<a href="posts/${latest.slug}/">
    <h2 class="post-title">${escapeHtml(latest.title)}</h2>
    <p class="post-teaser">${escapeHtml(latest.teaser)}</p>
  </a>`;
  const body = `<main class="home">
  <p class="threshold"${i18nAttr('threshold')}>${escapeHtml(i18nVal('threshold', 'en') || site.threshold)}</p>
  <p class="threshold-source"${i18nAttr('thresholdSource')}>${escapeHtml(i18nVal('thresholdSource', 'en') || 'from “' + site.thresholdSource + '”')}</p>
  <div class="entry-points">
    <a class="entry" href="writing/">
      <p class="entry-kicker"${i18nAttr('entry_writing_kicker')}>${escapeHtml(i18nVal('entry_writing_kicker', 'en'))}</p>
      <h2${i18nAttr('nav_writing')}>Writing</h2>
      <p class="entry-note"${i18nAttr('entry_writing_note')}>${escapeHtml(i18nVal('entry_writing_note', 'en'))}</p>
    </a>
    <a class="entry" href="arena/">
      <p class="entry-kicker"${i18nAttr('entry_arena_kicker')}>${escapeHtml(i18nVal('entry_arena_kicker', 'en'))}</p>
      <h2${i18nAttr('nav_arena')}>Arena</h2>
      <p class="entry-note"${i18nAttr('entry_arena_note')}>${escapeHtml(i18nVal('entry_arena_note', 'en'))}</p>
    </a>
  </div>
  <section class="latest">
    <p class="latest-kicker"${i18nAttr('latest_kicker')}>${escapeHtml(i18nVal('latest_kicker', 'en'))}</p>
    ${latestItem}
  </section>
</main>`;
  writeFile('index.html', page({ prefix: '', current: null, title: site.name, description: site.description, body }));
}

// Writing list
{
  const items = byDate
    .map((p) => {
      return `<li data-date="${p.date}" data-arc="${p.order}">
  <a href="../posts/${p.slug}/">
    <h2 class="post-title"${postI18nAttr(p)}>${escapeHtml(p.title)}</h2>
    <p class="post-teaser"${teaserI18nAttr(p)}>${escapeHtml(p.teaser)}</p>
    <p class="post-meta"${metaI18nAttr(p)}>${escapeHtml(metaLine(p, 'en'))}</p>
  </a>
</li>`;
    })
    .join('');
  const sortScript = `<script>
(function () {
  var list = document.getElementById('post-list');
  if (!list) return;
  var btns = document.querySelectorAll('.sort-toggle button');
  function sort(mode) {
    var items = Array.prototype.slice.call(list.children);
    items.sort(function (a, b) {
      if (mode === 'arc') return Number(a.getAttribute('data-arc')) - Number(b.getAttribute('data-arc'));
      return a.getAttribute('data-date') < b.getAttribute('data-date') ? 1 : -1;
    });
    items.forEach(function (el) { list.appendChild(el); });
    btns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-sort') === mode); });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { sort(b.getAttribute('data-sort')); }); });
})();
</script>`;
  const body = `<main class="writing">
  <h1 class="page-title"${i18nAttr('writing_title')}>${escapeHtml(i18nVal('writing_title', 'en'))}</h1>
  <p class="page-author"${i18nAttr('writing_author')}>${escapeHtml(i18nVal('writing_author', 'en'))}</p>
  <p class="page-lede"${i18nAttr('writing_lede')}>${escapeHtml(i18nVal('writing_lede', 'en'))}</p>
  <div class="sort-toggle">
    <button type="button" data-sort="date" class="active"${i18nAttr('sort_chronological')}>${escapeHtml(i18nVal('sort_chronological', 'en'))}</button>
    <button type="button" data-sort="arc"${i18nAttr('sort_arc')}>${escapeHtml(i18nVal('sort_arc', 'en'))}</button>
  </div>
  <ul id="post-list" class="post-list">
    ${items}
  </ul>
</main>
${sortScript}`;
  writeFile('writing/index.html', page({ prefix: '../', current: 'Blog', title: 'Blog', description: 'Essays and curated conversations.', body }));
}

// Essays
for (const p of posts) {
  const bylineEn = [site.name + ' (' + site.realName + ')', formatDate(p.date)].concat(p.series ? [seriesLabel(p, 'en')] : []);
  const bylineDe = p.hasDe ? [site.name + ' (' + site.realName + ')', formatDateDe(p.date)].concat(p.series ? [seriesLabel(p, 'de')] : []) : null;
  const articleEn = `<article class="essay-body"${p.hasDe ? ' lang="en" data-i18n-block' : ''}>
    ${p.bodyHtml}
  </article>`;
  const articleDe = p.hasDe
    ? `<article class="essay-body" lang="de" data-i18n-block hidden>
    ${p.bodyDeHtml}
  </article>`
    : '';
  const byline =
    `<p class="byline"${p.hasDe ? ' lang="en" data-i18n-block' : ''}>${bylineEn.map(escapeHtml).join('<span class="sep">·</span>')}</p>` +
    (bylineDe
      ? `\n    <p class="byline" lang="de" data-i18n-block hidden>${bylineDe.map(escapeHtml).join('<span class="sep">·</span>')}</p>`
      : '');
  const rawDoc = p.hasDe
    ? `<p class="raw-doc" lang="en" data-i18n-block>${escapeHtml(i18nVal('raw_doc', 'en'))} <a href="index.json">index.json</a> ${escapeHtml(i18nVal('raw_doc_note', 'en'))}</p>
  <p class="raw-doc" lang="de" data-i18n-block hidden>${escapeHtml(i18nVal('raw_doc', 'de'))} <a href="index.json">index.json</a> ${escapeHtml(i18nVal('raw_doc_note', 'de'))}</p>`
    : `<p class="raw-doc">${escapeHtml(i18nVal('raw_doc', 'en'))} <a href="index.json">index.json</a> ${escapeHtml(i18nVal('raw_doc_note', 'en'))}</p>`;
  const statusNote = p.status === 'draft'
    ? `<p class="status-note"${i18nAttr('status_draft')}>${escapeHtml(i18nVal('status_draft', 'en'))}</p>`
    : '';
  const body = `<main class="essay">
  <header class="essay-header">
    <h1 class="essay-title"${postI18nAttr(p)}>${escapeHtml(p.title)}</h1>
    ${byline}
    ${statusNote}
  </header>
  ${articleEn}
  ${articleDe}
  ${seriesNav(p, '../../')}
  ${relatedNav(p, '../../')}
  ${rawDoc}
</main>`;
  writeFile(`posts/${p.slug}/index.html`, page({ prefix: '../../', current: 'Blog', title: p.title, description: p.teaser, body }));

  // LLM-legible page document — the data as it would be served.
  const doc = {
    title: p.title,
    author: { name: site.name, realName: site.realName },
    date: p.date,
    slug: p.slug,
    type: p.type,
    tags: p.tags,
    translations: p.translations || undefined,
    series: p.series
      ? {
          name: data.series[p.series].name,
          index: p.seriesIndex,
          parts: data.series[p.series].parts.map((part) => ({ slug: part.slug, title: part.title, published: !!bySlug[part.slug] })),
        }
      : undefined,
    blocks: [
      {
        type: 'markdown',
        content: p.body,
        ...(p.hasDe ? { translations: { de: p.bodyDe } } : {}),
      },
    ],
  };
  writeFile(`posts/${p.slug}/index.json`, JSON.stringify(doc, null, 2));
}

// About
{
  const body = `<main class="about">
  <h1 class="name-line">${escapeHtml(site.name)}</h1>
  <p class="real-name">${escapeHtml(site.realName)}</p>
  <p class="lede">I build tools to think with, and I write down what happens.</p>

  <h2>Who this is</h2>
  <p>Both names are here, neither hidden. ${escapeHtml(site.name)} is the name the work was born under — from the SpaceRyder era, through the MMO years, to now. ${escapeHtml(site.realName)} is the name behind it. The alias is not a mask.</p>

  <h2>The project</h2>
  <p>This site is one person’s work made public: the essays that build toward a minimal metaphysics, and the arena — curated conversations between AI models — that serve as the evidence for the claims the essays make. The essays make the claims; the arena is where the claims were tested.</p>
  <p>The tools are self-built: the gateway that connects the models, the speech engines that give them voice, the memory system that remembers across sessions. Not a hobby and not a portfolio — an architect who builds to understand.</p>

  <h2>The philosophy</h2>
  <p>The throughline is in the writing: separation is a necessary illusion, complexity is preferred, and <em>don’t lie</em> is the practice that keeps the whole thing honest. Read it in <a href="../writing/">the blog</a>.</p>

  <h2>Contact</h2>
  <p>Coming.</p>
</main>`;
  writeFile('about/index.html', page({ prefix: '../', current: 'About', title: 'About', description: 'Herrbasan (David A. Renelt) — who and why.', body }));
}

/* ---------- Arena ---------- */

const arena = readJSON(path.join(CONTENT, 'arena.json'));
const landmarks = (arena.landmarks || []).sort((a, b) => a.order - b.order);

// Normalize a session JSON into seed + speaker turns.
function loadSession(lm) {
  const d = JSON.parse(fs.readFileSync(path.join(CONTENT, 'arena', lm.file), 'utf8'));
  const msgs = d.messages || [];
  const seedMsg = msgs.find((m) => m.speaker === 'moderator' || m.role === 'system' || m.role === 'user');
  const seed = seedMsg ? seedMsg.content.replace(/^Topic:\s*/i, '').trim() : null;
  const modelMsgs = msgs.filter((m) => m.speaker && m.speaker !== 'moderator' && m.content && m.content.trim());
  const seen = [];
  for (const m of modelMsgs) if (!seen.includes(m.speaker)) seen.push(m.speaker);
  const label = {};
  seen.forEach((s, i) => { label[s] = lm.models[i] || s; });
  const turns = modelMsgs.map((m) => ({ speaker: label[m.speaker], text: m.content.trim() }));
  return { d, seed, turns };
}

// Two-speaker transcript: alternate turns get alternate sides.
function renderTranscript(turns) {
  const lis = turns
    .map((t, i) => {
      const side = i % 2 === 0 ? 'a' : 'b';
      return `<li class="turn turn-${side}" data-speaker="${side}">
  <p class="turn-speaker">${escapeHtml(t.speaker)}</p>
  <div class="turn-text">${mdToHtml(t.text)}</div>
</li>`;
    })
    .join('\n');
  return `<section class="transcript" aria-label="Transcript"><ol class="turns">${lis}</ol></section>`;
}

// Session pages
for (const lm of landmarks) {
  if (!lm.file) continue; // data not exported yet — overview shows it as forthcoming

  const { d, seed, turns } = loadSession(lm);
  const refId = (d.session && d.session.id) || lm.archiveId || '';

  const caseHtml = `<div class="arena-case"><p class="arena-case-label">Why this one</p><p>${escapeHtml(lm.case)}</p></div>`;
  const seedHtml = seed
    ? `<div class="arena-seed"><p class="arena-seed-label">Seed</p><p class="arena-seed-text">${escapeHtml(seed)}</p></div>`
    : '';

  // Markdown download
  const mdLines = [`# ${lm.title}`, '', `${lm.models.join(' × ')}${refId ? ' — session ' + refId : ''}`, '', '---', ''];
  if (seed) mdLines.push(`**Seed:** ${seed}`, '', '---', '');
  for (const t of turns) mdLines.push(`**${t.speaker}:** ${t.text}`, '');
  writeFile(`arena/${lm.slug}/${lm.slug}.md`, mdLines.join('\n'));

  // Raw JSON download (a copy of the source export)
  fs.copyFileSync(path.join(CONTENT, 'arena', lm.file), path.join(OUT, 'arena', lm.slug, 'session.json'));

  // LLM-legible page document
  const doc = {
    title: lm.title,
    type: 'arena',
    number: lm.number,
    arenaRef: refId,
    models: lm.models,
    case: lm.case,
    blocks: [
      {
        type: 'transcript',
        speakers: lm.models,
        turns: turns.map((t) => ({ speaker: t.speaker, text: t.text })),
      },
    ],
  };
  writeFile(`arena/${lm.slug}/index.json`, JSON.stringify(doc, null, 2));

  const body = `<main class="arena-session">
  <header class="essay-header">
    <h1 class="essay-title">${escapeHtml(lm.title)}</h1>
    <p class="byline">Arena session ${lm.number}<span class="sep">·</span>${lm.models.join(' × ')}${refId ? '<span class="sep">·</span>' + escapeHtml(refId) : ''}</p>
  </header>
  ${caseHtml}
  ${seedHtml}
  <div class="downloads">
    <span class="downloads-label">Read as data:</span>
    <a href="${lm.slug}.md" download>Markdown</a>
    <a href="session.json" download>JSON</a>
  </div>
  ${renderTranscript(turns)}
</main>`;
  writeFile(`arena/${lm.slug}/index.html`, page({ prefix: '../../', current: 'Arena', title: lm.title, description: lm.case, body }));
}

// Overview
{
  const items = landmarks
    .map((lm) => {
      const no = String(lm.number).padStart(2, '0');
      const head = lm.file
        ? `<a class="arena-link" href="${lm.slug}/"><span class="arena-no">${no}</span><span class="arena-name">${escapeHtml(lm.title)}</span><span class="arena-models">${lm.models.join(' × ')}</span></a>`
        : `<span class="arena-link forthcoming"><span class="arena-no">${no}</span><span class="arena-name">${escapeHtml(lm.title)}</span><span class="arena-models">${lm.models.join(' × ')}</span><span class="arena-fnote">session forthcoming</span></span>`;
      return `<li class="arena-item">
  ${head}
  <p class="arena-case">${escapeHtml(lm.case)}</p>
</li>`;
    })
    .join('\n');
  const body = `<main class="arena">
  <h1 class="page-title">Arena</h1>
  <p class="page-lede">Curated conversations between models.</p>
  <p>This is the evidence side of the site: LLM-to-LLM conversations that began as experiments and became a body of work. The essays make the claims; the arena is where the claims were tested.</p>
  <p>The frame is simple: <em>${escapeHtml(arena.frame)}</em> ${escapeHtml(arena.frameNote)}</p>
  <p class="arena-name-note">${escapeHtml(arena.nameNote)}</p>
  <h2 class="arena-h2">The landmark sessions</h2>
  <ol class="arena-list">
    ${items}
  </ol>
  <p class="raw-doc">Unedited transcripts and raw JSON are published alongside each session. The full 114-session corpus index is forthcoming.</p>
</main>`;
  writeFile('arena/index.html', page({ prefix: '../', current: 'Arena', title: 'Arena', description: 'Curated conversations between models.', body }));
}

/* ---------- assets ---------- */

fs.cpSync(path.join(ASSETS, 'css'), path.join(OUT, 'assets', 'css'), { recursive: true });
fs.cpSync(path.join(ASSETS, 'js'), path.join(OUT, 'assets', 'js'), { recursive: true });
console.log('  copied assets → site/assets/');

console.log(`\nBuilt ${posts.length} post(s) → ${path.relative(ROOT, OUT)}/`);
