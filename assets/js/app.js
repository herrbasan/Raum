/* app.js — RAUM SPA
   Router + feature/type registration from NUI (modules/nui_wc2).
   Styling: site.css only (NUI styles deliberately not imported).
   Content is fetched on demand from content/ (manifest + raw md/json). */

import { nui } from '../../modules/nui_wc2/NUI/nui.js';

/* ---------------- state ---------------- */

const state = {
	lang: (() => {
		try {
			return localStorage.getItem('raum-lang') ||
				(navigator.language && navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en');
		} catch { return 'en'; }
	})(),
	sort: (() => {
		try { return localStorage.getItem('raum-sort') || 'chronological'; }
		catch { return 'chronological'; }
	})(),
	manifest: null,
	current: null,
};

let router = null;

/* ---------------- small utils ---------------- */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
	(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function t(key) {
	const map = state.manifest?.site?.i18n?.[key];
	if (!map) return key;
	return map[state.lang] || map.en || key;
}

function setTitle(s) {
	document.title = s ? `${s} — Herrbasan` : 'Herrbasan — It\'s not nothing';
}

// Stale-render guard: only the newest renderInto for a wrapper may write.
// Builders return { html, markdown?: [mdStrings] }; [data-md-slot] placeholders
// in html are replaced with hydrated <nui-markdown> elements.
async function renderInto(wrapper, build) {
	const my = (wrapper.__rv || 0) + 1;
	wrapper.__rv = my;
	const { html, markdown } = await build();
	if (my !== wrapper.__rv) return;
	wrapper.innerHTML = html;
	hydrateMarkdown(wrapper, markdown || []);
}

/* ---------------- markdown + link rewriting ---------------- */

// Markdown is rendered by the nui-markdown component (fenced code maps to its
// nui-code syntax highlighting). Each placeholder becomes a <nui-markdown>
// carrying the raw text in a <script type="text/markdown"> block — textContent
// keeps code samples safe (no HTML escaping at injection time).
function hydrateMarkdown(root, texts) {
	if (!texts?.length) return;
	const nodes = [...root.querySelectorAll('[data-md-slot]')];
	nodes.forEach((node, i) => {
		const md = document.createElement('nui-markdown');
		for (const attr of [...node.attributes]) {
			if (attr.name !== 'data-md-slot') md.setAttribute(attr.name, attr.value);
		}
		const script = document.createElement('script');
		script.type = 'text/markdown';
		script.textContent = texts[i] ?? '';
		md.appendChild(script);
		node.replaceWith(md); // connects → nui-markdown renders synchronously
		rewriteLinks(md);
		decoratePostulates(md);
	});
}

function rewriteLinks(root) {
	root.querySelectorAll('a[href]').forEach((a) => {
		const href = a.getAttribute('href') || '';
		const post = href.match(/^\.\.\/posts\/([a-z0-9-]+)\/?$/);
		if (post) { a.setAttribute('href', `#post=${post[1]}`); return; }
		const view = href.match(/^\.\.\/(writing|arena|religion|about)\/?$/);
		if (view) { a.setAttribute('href', `#feature=${view[1]}`); return; }
		if (href === '../' || href === './') { a.setAttribute('href', '#feature=home'); return; }
		if (/^https?:/.test(href)) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
	});
}

// Postulate decoration — post-processes nui-markdown output:
// 1) blockquotes opening with "**A.**" (a postulate definition) become pillar
//    blocks with a letter badge (restores the A/B/C pillar styling).
// 2) bare bold letters in prose ("**A**") become highlighted postulate refs.
function decoratePostulates(root) {
	const LETTERS = new Set(['A', 'B', 'C']);
	root.querySelectorAll('blockquote').forEach((bq) => {
		// nui-markdown emits <blockquote><strong>A.</strong> …</blockquote>
		// (the strong is a direct child, not wrapped in a <p>).
		const strong = bq.firstElementChild;
		if (!strong || strong.tagName !== 'STRONG') return;
		const m = strong.textContent.trim().match(/^([ABC])\.$/);
		if (!m) return;
		const letter = m[1];
		bq.classList.add('pillar');
		bq.dataset.letter = letter;
		const badge = document.createElement('span');
		badge.className = 'pillar-letter';
		badge.textContent = letter;
		strong.replaceWith(badge);
		const p = document.createElement('p');
		while (bq.firstChild) p.appendChild(bq.firstChild);
		bq.appendChild(p);
	});
	root.querySelectorAll('strong').forEach((s) => {
		if (LETTERS.has(s.textContent.trim())) s.classList.add('postulate');
	});
}

/* ---------------- chrome (persistent header/footer) ---------------- */

function themeLabel() {
	const m = document.documentElement.dataset.theme || 'system';
	return m === 'system' ? 'Auto' : m[0].toUpperCase() + m.slice(1);
}

function cycleTheme() {
	const order = ['system', 'dark', 'light'];
	const cur = document.documentElement.dataset.theme || 'system';
	const next = order[(order.indexOf(cur) + 1) % order.length];
	document.documentElement.dataset.theme = next;
	try { localStorage.setItem('raum-theme', next); } catch {}
	const btn = document.getElementById('theme-toggle');
	if (btn) btn.textContent = themeLabel();
}

function toggleLang() {
	state.lang = state.lang === 'de' ? 'en' : 'de';
	document.documentElement.lang = state.lang;
	try { localStorage.setItem('raum-lang', state.lang); } catch {}
	renderChrome();
	const cur = state.current;
	if (cur) router?.cache.get(`${cur.type}:${cur.id}`)?.show?.();
}

function renderChrome() {
	const { site } = state.manifest;
	const navItems = state.manifest.nav.map((n) => {
		const id = n.path.replace('/', '');
		return `<a class="nav-link" data-route="${id}" href="#feature=${id}">${esc(t('nav_' + id))}</a>`;
	}).join('');
	const header = document.getElementById('site-header');
	header.innerHTML = `
		<div class="site-header-inner">
			<a class="brand" href="#feature=home">${esc(site.name)}</a>
			<nav class="nav" aria-label="Main">
				${navItems}
				<button class="lang-toggle" type="button" id="lang-toggle">${state.lang === 'de' ? 'EN' : 'DE'}</button>
				<button class="theme-toggle" type="button" id="theme-toggle">${themeLabel()}</button>
			</nav>
		</div>`;
	document.getElementById('site-footer').innerHTML =
		`<div class="foot-inner"><span>${esc(t('footer'))}</span></div>`;
	document.getElementById('theme-toggle').addEventListener('click', cycleTheme);
	document.getElementById('lang-toggle').addEventListener('click', toggleLang);
}

function updateNavActive() {
	const cur = state.current;
	document.querySelectorAll('.nav-link').forEach((a) => {
		a.classList.toggle('current', !!cur && cur.type === 'feature' && a.dataset.route === cur.id);
	});
}

/* ---------------- home ---------------- */

function buildHome() {
	const { site } = state.manifest;
	setTitle();
	const posts = [...state.manifest.posts];
	const latest = posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
	const de = state.lang === 'de' && latest.de;
	const entry = (kicker, title, note, href) => `
		<a class="entry" href="${href}">
			<p class="entry-kicker">${esc(t(kicker))}</p>
			<h2>${esc(t(title))}</h2>
			<p class="entry-note">${esc(t(note))}</p>
		</a>`;
	return { html: `
		<div class="home">
			<p class="threshold">${esc(site.threshold)}</p>
			<p class="threshold-source">${esc(t('thresholdSource'))}</p>
			<div class="entry-points">
				${entry('entry_blog_kicker', 'nav_writing', 'entry_blog_note', '#feature=writing')}
				${entry('entry_arena_kicker', 'nav_arena', 'entry_arena_note', '#feature=arena')}
			</div>
			<div class="latest">
				<p class="latest-kicker">${esc(t('latest_kicker'))}</p>
				<a href="#post=${esc(latest.slug)}">
					<h2 class="post-title">${esc(de?.title || latest.title)}</h2>
					<p class="post-teaser">${esc(de?.teaser || latest.teaser)}</p>
				</a>
			</div>
		</div>` };
}

/* ---------------- writing ---------------- */

function buildWriting() {
	setTitle(t('blog_title'));
	const posts = [...state.manifest.posts];
	if (state.sort === 'arc') posts.sort((a, b) => (a.order || 0) - (b.order || 0));
	else posts.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
	const items = posts.map((p) => {
		const de = state.lang === 'de' && p.de;
		const tags = (p.tags || []).map((tg) => de?.tags?.[tg] || tg);
		return `
			<li>
				<a href="#post=${esc(p.slug)}">
					<h2 class="post-title">${esc(de?.title || p.title)}</h2>
					<p class="post-teaser">${esc(de?.teaser || p.teaser)}</p>
					<p class="post-meta"><time>${esc(p.date)}</time>${tags.length ? ` · <span class="post-tags">${tags.map(esc).join(' · ')}</span>` : ''}${p.status === 'draft' ? ` · <span class="post-tags">${esc(t('status_draft'))}</span>` : ''}</p>
				</a>
			</li>`;
	}).join('');
	const sortBtn = (key) =>
		`<button type="button" data-sort="${key}" class="${state.sort === key ? 'active' : ''}">${esc(t('sort_' + key))}</button>`;
	return { html: `
		<div class="writing">
			<h1 class="page-title">${esc(t('blog_title'))}</h1>
			<p class="page-author">${esc(t('blog_author'))}</p>
			<p class="page-lede">${esc(t('blog_lede'))}</p>
			<div class="sort-toggle">${sortBtn('chronological')}${sortBtn('arc')}</div>
			<ul class="post-list">${items}</ul>
		</div>` };
}

/* ---------------- arena overview ---------------- */

function buildArena() {
	const { arena } = state.manifest;
	setTitle('Arena');
	const items = arena.landmarks.slice().sort((a, b) => a.order - b.order).map((l) => `
		<li class="arena-item">
			<a class="arena-link" href="#session=${esc(l.slug)}">
				<span class="arena-no">${String(l.number).padStart(2, '0')}</span>
				<span class="arena-name">${esc(l.title)}</span>
				<span class="arena-models">${esc((l.models || []).join(' × '))}</span>
			</a>
			<p class="arena-case">${esc(l.case)}</p>
		</li>`).join('');
	return { html: `
		<div class="arena">
			<h1 class="page-title">Arena</h1>
			<p class="page-lede">${esc(arena.frame)}</p>
			<p class="arena-name-note">${esc(arena.nameNote)}</p>
			<div class="arena-case">
				<p class="arena-case-label">The frame</p>
				<p>${esc(arena.frameNote)}</p>
			</div>
			<h2 class="arena-h2">Landmark sessions</h2>
			<ul class="arena-list">${items}</ul>
		</div>` };
}

/* ---------------- pages (religion, about) ---------------- */

function splitPage(mdText) {
	const lines = mdText.replace(/\r\n/g, '\n').split('\n');
	let title = '';
	let subtitle = '';
	let i = 0;
	while (i < lines.length && !lines[i].trim()) i++;
	const m = lines[i]?.match(/^#\s+(.+)$/);
	if (m) { title = m[1].trim(); i++; }
	while (i < lines.length && !lines[i].trim()) i++;
	const s = lines[i]?.match(/^\*(.+)\*\s*$/);
	if (s) { subtitle = s[1].trim(); i++; }
	return { title, subtitle, body: lines.slice(i).join('\n').trim() };
}

async function buildPage(slug, docTitle) {
	const mdText = await fetch(`content/pages/${slug}.md`).then((r) => {
		if (!r.ok) throw new Error(`page ${slug}: ${r.status}`);
		return r.text();
	});
	const { title, subtitle, body } = splitPage(mdText);
	setTitle(docTitle || title);
	return {
		html: `
			<div class="about">
				<h1 class="name-line">${esc(title)}</h1>
				${subtitle ? `<p class="real-name">${esc(subtitle)}</p>` : ''}
				<div data-md-slot class="essay-body"></div>
			</div>`,
		markdown: [body],
	};
}

/* ---------------- post ---------------- */

function buildSeriesNav(post) {
	const links = post.links || {};
	if (!links.series) return '';
	const series = state.manifest.series?.[links.series];
	if (!series) return '';
	const parts = series.parts.map((pslug) => {
		const p = state.manifest.posts.find((x) => x.slug === pslug);
		const title = p ? (state.lang === 'de' && p.de ? p.de.title : p.title) : null;
		if (pslug === post.slug) return `<li class="current">${esc(title || pslug)}</li>`;
		if (p) return `<li><a href="#post=${esc(pslug)}">${esc(title)}</a></li>`;
		return `<li class="forthcoming">${esc(title || pslug)}</li>`;
	}).join('');
	const kicker = `${esc(series.name)} — ${esc(t('series_part'))} ${links.seriesIndex} ${esc(t('series_of'))} ${series.parts.length}`;
	return `
		<nav class="series-nav">
			<p class="kicker">${kicker}</p>
			<ol>${parts}</ol>
		</nav>`;
}

function buildRelatedNav(post) {
	const rel = (post.links?.related || []).filter(Boolean);
	if (!rel.length) return '';
	const items = rel.map((slug) => {
		const p = state.manifest.posts.find((x) => x.slug === slug);
		if (!p) return '';
		const title = state.lang === 'de' && p.de ? p.de.title : p.title;
		return `<li><a href="#post=${esc(slug)}">${esc(title)}</a></li>`;
	}).join('');
	return `
		<nav class="related-nav">
			<p class="kicker">${esc(t('related'))}</p>
			<ul class="related-list">${items}</ul>
		</nav>`;
}

async function buildPost(slug) {
	const post = state.manifest.posts.find((p) => p.slug === slug);
	if (!post) return { html: `<div class="essay"><h1 class="essay-title">Not found</h1></div>` };
	const de = state.lang === 'de' && post.de;
	const file = de?.file || post.file;
	const mdText = await fetch(`content/posts/${file}`).then((r) => {
		if (!r.ok) throw new Error(`post ${slug}: ${r.status}`);
		return r.text();
	});
	setTitle(de?.title || post.title);
	const tags = (post.tags || []).map((tg) => de?.tags?.[tg] || tg);
	const statusNote = post.status === 'draft'
		? `<p class="status-note">${esc(t('status_draft'))}</p>`
		: '';
	return {
		html: `
			<div class="essay">
				<div class="essay-header">
					<h1 class="essay-title">${esc(de?.title || post.title)}</h1>
					<p class="byline">${esc(t('blog_author'))}<span class="sep">·</span><time>${esc(post.date)}</time>${tags.length ? `<span class="sep">·</span><span class="post-tags">${tags.map(esc).join(' · ')}</span>` : ''}</p>
					${statusNote}
				</div>
				<div data-md-slot class="essay-body"></div>
				${buildSeriesNav(post)}
				${buildRelatedNav(post)}
				<p class="raw-doc"><a href="content/posts/${esc(file)}" download>${esc(t('download_md'))}</a></p>
			</div>`,
		markdown: [mdText],
	};
}

/* ---------------- arena session ---------------- */

async function loadSession(slug) {
	const landmark = state.manifest.arena.landmarks.find((l) => l.slug === slug);
	if (!landmark) return null;
	const data = await fetch(`content/arena/${landmark.file}`).then((r) => {
		if (!r.ok) throw new Error(`session ${slug}: ${r.status}`);
		return r.json();
	});
	return { landmark, data };
}

function extractSeed(data) {
	const m = (data.messages || []).find((x) => x.speaker === 'moderator');
	if (!m || !m.content) return '';
	return m.content.replace(/^Topic:\s*/i, '').trim();
}

function extractTurns(data) {
	const map = new Map();
	const turns = [];
	for (const m of data.messages || []) {
		if (!m || m.speaker === 'moderator') continue;
		if (!map.has(m.speaker)) map.set(m.speaker, String.fromCharCode(65 + map.size));
		turns.push({ letter: map.get(m.speaker), content: m.content || '' });
	}
	return turns;
}

function downloadText(name, text) {
	const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function buildSessionMarkdown(slug) {
	const loaded = await loadSession(slug);
	if (!loaded) return;
	const { landmark, data } = loaded;
	const seed = extractSeed(data);
	const turns = extractTurns(data);
	let md = `# ${landmark.title}\n\n`;
	md += `_${(landmark.models || []).join(' × ')}_\n\n`;
	md += `> ${landmark.case}\n\n`;
	if (seed) md += `**Seed:** ${seed}\n\n`;
	md += `---\n\n`;
	turns.forEach((tr) => { md += `## ${tr.letter}\n\n${tr.content.trim()}\n\n`; });
	downloadText(`arena-${landmark.slug}.md`, md);
}

async function buildSession(slug) {
	const loaded = await loadSession(slug);
	if (!loaded) return { html: `<div class="arena-session"><h1 class="essay-title">Not found</h1></div>` };
	const { landmark, data } = loaded;
	setTitle(landmark.title);
	const seed = extractSeed(data);
	const turns = extractTurns(data);
	const turnHtml = turns.map((tr) => `
		<li class="turn turn-${tr.letter}">
			<p class="turn-speaker">${esc(tr.letter)}</p>
			<div data-md-slot class="turn-text"></div>
		</li>`).join('');
	return {
		html: `
			<div class="arena-session">
				<div class="arena-case">
					<p class="arena-case-label">The case</p>
					<p>${esc(landmark.case)}</p>
				</div>
				<h1 class="essay-title">${esc(landmark.title)}</h1>
				<p class="byline">${esc((landmark.models || []).join(' × '))}</p>
				${seed ? `
				<div class="arena-seed">
					<p class="arena-seed-label">Seed</p>
					<p class="arena-seed-text">${esc(seed)}</p>
				</div>` : ''}
				<div class="downloads">
					<span class="downloads-label">${esc(t('download_md'))} / ${esc(t('download_json'))}</span>
					<a href="#" data-dl-md>${esc(t('download_md'))}</a>
					<a href="content/arena/${esc(landmark.file)}" download>${esc(t('download_json'))}</a>
				</div>
				<div class="transcript">
					<ul class="turns">${turnHtml}</ul>
				</div>
			</div>`,
		markdown: turns.map((tr) => tr.content),
	};
}

/* ---------------- feature / type registration ---------------- */

// NOTE: each init renders immediately AND sets element.show. The router normally
// triggers the first render inside a double requestAnimationFrame, which is paused
// in hidden/background tabs — leaving the view empty until the tab is focused.
// Rendering in init (synchronous during navigation) removes that dependency.
// The router's later show() call re-renders the same content (idempotent, guarded).

nui.registerFeature('home', (element) => {
	element.show = () => renderInto(element, buildHome);
	renderInto(element, buildHome);
});

nui.registerFeature('writing', (element) => {
	element.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-sort]');
		if (!btn) return;
		state.sort = btn.dataset.sort;
		try { localStorage.setItem('raum-sort', state.sort); } catch {}
		renderInto(element, buildWriting);
	});
	element.show = () => renderInto(element, buildWriting);
	renderInto(element, buildWriting);
});

nui.registerFeature('arena', (element) => {
	element.show = () => renderInto(element, buildArena);
	renderInto(element, buildArena);
});

nui.registerFeature('religion', (element) => {
	element.show = () => renderInto(element, () => buildPage('religion'));
	renderInto(element, () => buildPage('religion'));
});

nui.registerFeature('about', (element) => {
	element.show = () => renderInto(element, () => buildPage('about', t('nav_about')));
	renderInto(element, () => buildPage('about', t('nav_about')));
});

nui.registerType('post', (slug, params, wrapper) => {
	wrapper.show = () => renderInto(wrapper, () => buildPost(slug));
	renderInto(wrapper, () => buildPost(slug));
});

nui.registerType('session', (slug, params, wrapper) => {
	wrapper.addEventListener('click', (e) => {
		const dl = e.target.closest('[data-dl-md]');
		if (dl) { e.preventDefault(); buildSessionMarkdown(slug); }
	});
	wrapper.show = () => renderInto(wrapper, () => buildSession(slug));
	renderInto(wrapper, () => buildSession(slug));
});

/* ---------------- boot ---------------- */

async function init() {
	state.manifest = await fetch('content/index.json').then((r) => {
		if (!r.ok) throw new Error(`manifest: ${r.status}`);
		return r.json();
	});
	renderChrome();

	const appEl = document.getElementById('app');
	router = nui.createRouter(appEl, { basePath: 'content' });

	appEl.addEventListener('nui-route-change', (e) => {
		state.current = e.detail || null;
		updateNavActive();
		window.scrollTo(0, 0);
	});

	router.start();
	if (!location.hash || !location.hash.includes('=')) {
		location.hash = '#feature=home';
	}
}

init();
