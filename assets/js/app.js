// app.js — runtime renderer. Fetches the content manifest + raw markdown/JSON
// and renders the current route on demand. Content edits need no rebuild.
// Dependencies: md-renderer.js (window.MD.mdToHtml). Classic script (no modules).
(function () {
  'use strict';

  var app = document.getElementById('app');
  if (!app) return;
  var kind = app.dataset.kind;
  var slug = app.dataset.slug;
  var prefix = app.dataset.prefix || '';
  var DATA = prefix + 'data/';

  var manifest = null;
  var sessionMdText = '';

  function savedLang() {
    try { var s = localStorage.getItem('raum-lang'); if (s) return s; } catch (e) {}
    return (navigator.language || 'en').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  }
  var lang = savedLang();

  /* ---------- helpers ---------- */

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fetchText(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('fetch ' + u); return r.text(); }); }
  function fetchJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('fetch ' + u); return r.json(); }); }
  function md(text) { return (window.MD && window.MD.mdToHtml) ? window.MD.mdToHtml(text) : '<p>' + esc(text) + '</p>'; }
  function t(key) { var e = manifest.site.i18n[key]; return e ? (e[lang] || e.en) : ''; }
  function dateFmt(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function bySlug() { var m = {}; manifest.posts.forEach(function (p) { m[p.slug] = p; }); return m; }
  function postTitle(p) { return (lang === 'de' && p.de) ? p.de.title : p.title; }
  function postTeaser(p) { return (lang === 'de' && p.de) ? p.de.teaser : p.teaser; }
  function seriesOf(p) { return p.links && p.links.series ? manifest.series[p.links.series] : null; }
  function seriesLabel(p) {
    var s = seriesOf(p); if (!s) return '';
    return lang === 'de' ? (s.name + ', Teil ' + p.links.seriesIndex) : (s.name + ', part ' + p.links.seriesIndex);
  }
  function postMeta(p) {
    var parts = [dateFmt(p.date)];
    var tags = (p.tags || []).map(function (tag) { return (lang === 'de' && p.de && p.de.tags && p.de.tags[tag]) ? p.de.tags[tag] : tag; });
    if (tags.length) parts.push(tags.join(' · '));
    if (p.links && p.links.series) parts.push(seriesLabel(p));
    if (p.status === 'draft') parts.push(lang === 'de' ? 'Entwurf' : 'Draft');
    return parts.join(' · ');
  }
  var byDate = function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : a.order - b.order; };

  function seriesNav(p) {
    var s = seriesOf(p); if (!s) return '';
    var posts = bySlug();
    var items = s.parts.map(function (partSlug) {
      var part = posts[partSlug];
      var label = part ? postTitle(part) : partSlug;
      if (partSlug === p.slug) return '<li class="current">' + esc(label) + '</li>';
      if (part) return '<li><a href="' + prefix + 'posts/' + partSlug + '/">' + esc(label) + '</a></li>';
      return '<li class="forthcoming">' + esc(label) + '</li>';
    }).join('');
    return '<aside class="series-nav"><p class="kicker">' + esc(s.name) + ' — ' + esc(t('series_part')) + ' ' + p.links.seriesIndex + ' ' + esc(t('series_of')) + ' ' + s.parts.length + '</p><ol>' + items + '</ol></aside>';
  }

  function relatedNav(p) {
    var rels = (p.links && p.links.related || []).map(function (s) { return bySlug()[s]; }).filter(Boolean);
    if (!rels.length) return '';
    return '<aside class="related-nav"><p class="kicker">' + esc(t('related')) + '</p><ul class="related-list">' +
      rels.map(function (r) { return '<li><a href="' + prefix + 'posts/' + r.slug + '/">' + esc(postTitle(r)) + '</a></li>'; }).join('') +
      '</ul></aside>';
  }

  /* ---------- views ---------- */

  function viewHome() {
    var latest = manifest.posts.filter(function (p) { return p.status !== 'draft'; }).sort(byDate)[0];
    return '<main class="home">' +
      '<p class="threshold">' + esc(t('threshold')) + '</p>' +
      '<p class="threshold-source">' + esc(t('thresholdSource')) + '</p>' +
      '<div class="entry-points">' +
      '<a class="entry" href="' + prefix + 'writing/"><p class="entry-kicker">' + esc(t('entry_blog_kicker')) + '</p><h2>' + esc(t('nav_writing')) + '</h2><p class="entry-note">' + esc(t('entry_blog_note')) + '</p></a>' +
      '<a class="entry" href="' + prefix + 'arena/"><p class="entry-kicker">' + esc(t('entry_arena_kicker')) + '</p><h2>' + esc(t('nav_arena')) + '</h2><p class="entry-note">' + esc(t('entry_arena_note')) + '</p></a>' +
      '</div>' +
      '<section class="latest"><p class="latest-kicker">' + esc(t('latest_kicker')) + '</p>' +
      '<a href="' + prefix + 'posts/' + latest.slug + '/"><h2 class="post-title">' + esc(postTitle(latest)) + '</h2><p class="post-teaser">' + esc(postTeaser(latest)) + '</p></a>' +
      '</section></main>';
  }

  function viewWriting() {
    var items = manifest.posts.slice().sort(byDate).map(function (p) {
      return '<li data-date="' + p.date + '" data-arc="' + p.order + '">' +
        '<a href="' + prefix + 'posts/' + p.slug + '/">' +
        '<h2 class="post-title">' + esc(postTitle(p)) + '</h2>' +
        '<p class="post-teaser">' + esc(postTeaser(p)) + '</p>' +
        '<p class="post-meta">' + esc(postMeta(p)) + '</p>' +
        '</a></li>';
    }).join('');
    return '<main class="writing">' +
      '<h1 class="page-title">' + esc(t('blog_title')) + '</h1>' +
      '<p class="page-author">' + esc(t('blog_author')) + '</p>' +
      '<p class="page-lede">' + esc(t('blog_lede')) + '</p>' +
      '<div class="sort-toggle">' +
      '<button type="button" data-sort="date" class="active">' + esc(t('sort_chronological')) + '</button>' +
      '<button type="button" data-sort="arc">' + esc(t('sort_arc')) + '</button>' +
      '</div>' +
      '<ul id="post-list" class="post-list">' + items + '</ul></main>';
  }

  function viewPost() {
    var p = bySlug()[slug];
    var file = (lang === 'de' && p.de && p.de.file) ? p.de.file : p.file;
    return fetchText(DATA + 'posts/' + file).then(function (raw) {
      var body = raw.replace(/^\s*# .*\n?/, '');
      var byline = [manifest.site.name + ' (' + manifest.site.realName + ')', dateFmt(p.date)].concat(p.links.series ? [seriesLabel(p)] : []).join('<span class="sep">·</span>');
      var status = p.status === 'draft' ? '<p class="status-note">' + esc(t('status_draft')) + '</p>' : '';
      return '<main class="essay">' +
        '<header class="essay-header"><h1 class="essay-title">' + esc(postTitle(p)) + '</h1><p class="byline">' + byline + '</p>' + status + '</header>' +
        '<article class="essay-body">' + md(body) + '</article>' +
        seriesNav(p) + relatedNav(p) +
        '<div class="downloads"><span class="downloads-label">' + esc(t('download_md')) + ':</span><a href="' + DATA + 'posts/' + p.file + '" download>MD</a></div>' +
        '</main>';
    });
  }

  function viewPage() {
    return fetchText(DATA + 'pages/' + slug + '.md').then(function (raw) {
      var page = manifest.pages.filter(function (p) { return p.slug === slug; })[0];
      var title = page ? page.title : slug;
      var body = raw.replace(/^\s*# .*\n?/, '');
      return '<main class="essay">' +
        '<header class="essay-header"><h1 class="essay-title">' + esc(title) + '</h1></header>' +
        '<article class="essay-body">' + md(body) + '</article>' +
        '</main>';
    });
  }

  function viewArena() {
    var items = manifest.arena.landmarks.slice().sort(function (a, b) { return a.order - b.order; }).map(function (lm) {
      var no = ('0' + lm.number).slice(-2);
      return '<li class="arena-item">' +
        '<a class="arena-link" href="' + prefix + 'arena/' + lm.slug + '/"><span class="arena-no">' + no + '</span><span class="arena-name">' + esc(lm.title) + '</span><span class="arena-models">' + esc(lm.models.join(' × ')) + '</span></a>' +
        '<p class="arena-case">' + esc(lm.case) + '</p></li>';
    }).join('');
    return '<main class="arena">' +
      '<h1 class="page-title">Arena</h1>' +
      '<p class="page-lede">Curated conversations between models.</p>' +
      '<p>This is the evidence side of the site: LLM-to-LLM conversations that began as experiments and became a body of work. The essays make the claims; the arena is where the claims were tested.</p>' +
      '<p>The frame is simple: <em>' + esc(manifest.arena.frame) + '</em> ' + esc(manifest.arena.frameNote) + '</p>' +
      '<p class="arena-name-note">' + esc(manifest.arena.nameNote) + '</p>' +
      '<h2 class="arena-h2">The landmark sessions</h2>' +
      '<ol class="arena-list">' + items + '</ol></main>';
  }

  function viewArenaSession() {
    var lm = manifest.arena.landmarks.filter(function (x) { return x.slug === slug; })[0];
    return fetchJSON(DATA + 'arena/' + lm.file).then(function (data) {
      var msgs = data.messages || [];
      var seedMsg = msgs.filter(function (m) { return m.speaker === 'moderator' || m.role === 'system' || m.role === 'user'; })[0];
      var seed = seedMsg ? seedMsg.content.replace(/^Topic:\s*/i, '').trim() : null;
      var modelMsgs = msgs.filter(function (m) { return m.speaker && m.speaker !== 'moderator' && m.content && m.content.trim(); });
      var seen = [];
      modelMsgs.forEach(function (m) { if (seen.indexOf(m.speaker) === -1) seen.push(m.speaker); });
      var label = {};
      seen.forEach(function (s, i) { label[s] = lm.models[i] || s; });
      var turns = modelMsgs.map(function (mm, i) {
        return { side: i % 2 === 0 ? 'a' : 'b', speaker: label[mm.speaker], text: mm.content.trim() };
      });
      var transcript = turns.map(function (turn) {
        return '<li class="turn turn-' + turn.side + '" data-speaker="' + turn.side + '">' +
          '<p class="turn-speaker">' + esc(turn.speaker) + '</p>' +
          '<div class="turn-text">' + md(turn.text) + '</div></li>';
      }).join('');
      var seedHtml = seed ? '<div class="arena-seed"><p class="arena-seed-label">Seed</p><p class="arena-seed-text">' + esc(seed) + '</p></div>' : '';
      sessionMdText = buildSessionMd(lm, seed, turns);
      return '<main class="arena-session">' +
        '<header class="essay-header"><h1 class="essay-title">' + esc(lm.title) + '</h1><p class="byline">Arena session ' + lm.number + '<span class="sep">·</span>' + esc(lm.models.join(' × ')) + '<span class="sep">·</span>' + esc(lm.file) + '</p></header>' +
        '<div class="arena-case"><p class="arena-case-label">Why this one</p><p>' + esc(lm.case) + '</p></div>' +
        seedHtml +
        '<div class="downloads"><span class="downloads-label">Read as data:</span><a href="' + DATA + 'arena/' + lm.file + '" download>JSON</a><a href="#" id="md-download">Markdown</a></div>' +
        '<section class="transcript" aria-label="Transcript"><ol class="turns">' + transcript + '</ol></section>' +
        '</main>';
    });
  }

  function buildSessionMd(lm, seed, turns) {
    var lines = ['# ' + lm.title, '', lm.models.join(' × ') + ' — session ' + lm.file.replace(/\.json$/, ''), '', '---', ''];
    if (seed) lines.push('**Seed:** ' + seed, '', '---', '');
    turns.forEach(function (turn) { lines.push('**' + turn.speaker + ':** ' + turn.text, ''); });
    return lines.join('\n');
  }

  /* ---------- chrome + render ---------- */

  function routeNavLabel() {
    if (kind === 'post' || kind === 'writing') return 'Blog';
    if (kind === 'arena' || kind === 'arena-session') return 'Arena';
    if (kind === 'page') {
      var pg = manifest.pages.filter(function (p) { return p.slug === slug; })[0];
      if (pg && pg.nav) {
        var n = manifest.nav.filter(function (x) { return x.path === pg.nav + '/'; })[0];
        if (n) return n.label;
      }
    }
    return null;
  }

  function currentTheme() { try { return localStorage.getItem('raum-theme') || 'system'; } catch (e) { return 'system'; } }
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';
  }
  function cycleTheme() {
    var order = ['system', 'dark', 'light'];
    var next = order[(order.indexOf(currentTheme()) + 1) % order.length];
    try { localStorage.setItem('raum-theme', next); } catch (e) {}
    applyTheme(next);
  }

  function renderView() {
    var view;
    switch (kind) {
      case 'home': view = Promise.resolve(viewHome()); break;
      case 'writing': view = Promise.resolve(viewWriting()); break;
      case 'post': view = viewPost(); break;
      case 'page': view = viewPage(); break;
      case 'arena': view = Promise.resolve(viewArena()); break;
      case 'arena-session': view = viewArenaSession(); break;
      default: view = Promise.resolve('<main class="writing"><p>Unknown route.</p></main>');
    }
    return view.then(function (html) {
      app.innerHTML = html;
      wireView();
    });
  }

  function wireView() {
    if (kind === 'writing') {
      var list = document.getElementById('post-list');
      var btns = document.querySelectorAll('.sort-toggle button');
      if (!list) return;
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
    }
    if (kind === 'arena-session') {
      var dl = document.getElementById('md-download');
      if (dl) {
        dl.addEventListener('click', function (ev) {
          ev.preventDefault();
          var blob = new Blob([sessionMdText], { type: 'text/markdown' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = slug + '.md';
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
        });
      }
    }
  }

  function fullRender() {
    var navLabel = routeNavLabel();
    var nav = manifest.nav.map(function (n) {
      var label = t('nav_' + n.path.replace(/[^a-z]/g, ''));
      var active = n.label === navLabel ? ' class="nav-link current"' : ' class="nav-link"';
      return '<a' + active + ' href="' + prefix + n.path + '">' + esc(label) + '</a>';
    }).join('');
    var header = '<header class="site-header"><div class="site-header-inner">' +
      '<a class="brand" href="' + prefix + '">' + esc(manifest.site.name) + '</a>' +
      '<nav class="nav" aria-label="Primary">' + nav +
      '<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Theme"></button>' +
      '<button id="lang-toggle" class="lang-toggle" type="button" aria-label="Language"></button>' +
      '</nav></div></header>';
    var footer = '<footer class="site-footer"><div class="foot-inner">' +
      '<span>' + esc(t('footer')) + '</span><span>© ' + new Date().getFullYear() + '</span>' +
      '</div></footer>';

    document.body.innerHTML = header + '<main id="app"></main>' + footer;
    app = document.getElementById('app');
    document.documentElement.lang = lang;

    applyTheme(currentTheme());
    document.getElementById('lang-toggle').textContent = lang === 'de' ? 'DE' : 'EN';
    document.getElementById('theme-toggle').addEventListener('click', cycleTheme);
    document.getElementById('lang-toggle').addEventListener('click', function () {
      lang = lang === 'en' ? 'de' : 'en';
      try { localStorage.setItem('raum-lang', lang); } catch (e) {}
      fullRender();
    });

    return renderView();
  }

  fetchJSON(DATA + 'index.json').then(function (m) {
    manifest = m;
    return fullRender();
  }).catch(function (err) {
    document.body.innerHTML = '<main class="writing"><p>Failed to load content — the site must be served over HTTP (not file://).<br>' + esc(err.message) + '</p></main>';
  });
})();
