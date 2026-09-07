/* pages.mjs — page builders for the static build.
   Ported from assets/js/app.js (SPA builders). One code path: these run at
   build time and emit complete HTML documents. URL map (EN):
     /  /writing/  /writing/{slug}/  /arena/  /arena/{slug}/  /religion/  /about/  /authors/{id}/
   DE mirrors everything except arena/authors under /de/.
   Every content page carries <link rel="alternate" type="text/markdown"> to its raw MD. */

import { markdownToHtml } from './md.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
	(c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const escStrong = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

// Minimal frontmatter scrape for the process footer (authors/dates).
function scrapeMeta(md) {
	const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return { authors: [], created: '', modified: '' };
	const fm = m[1];
	const get = (k) => {
		const mm = fm.match(new RegExp('^' + k + ':\\s*"?(.*?)"?\\s*$', 'm'));
		return mm ? mm[1].trim() : '';
	};
	const ids = [...fm.matchAll(/^\s+-\s+id:\s*(\S+)/gm)].map((x) => x[1]);
	const roles = [...fm.matchAll(/^\s+role:\s*(\S+)/gm)].map((x) => x[1]);
	return { authors: ids.map((id, i) => ({ id, role: roles[i] || '' })), created: get('created'), modified: get('modified') };
}

export class Site {
	constructor(manifest, read) {
		this.manifest = manifest;
		this.read = read; // (path) => string, repo-root relative
		this.baseUrl = 'https://raum.com'; // build.mjs may override
	}

	/* ---------------- i18n + URL helpers ---------------- */

	t(lang, key) {
		const map = this.manifest.site?.i18n?.[key];
		if (!map) return key;
		return map[lang] || map.en || key;
	}

	// Language-prefixed absolute path. DE lives under /de/.
	url(lang, path) {
		return (lang === 'de' ? '/de' : '') + path;
	}

	postHref(slug, lang) {
		const p = this.manifest.posts.find((x) => x.slug === slug);
		if (lang === 'de' && p?.de) return `/de/writing/${slug}/`;
		return `/writing/${slug}/`;
	}

	homeHref(lang) { return this.url(lang, '/'); }

	/* ---------------- markdown pipeline ---------------- */

	// Full body pipeline: render → postulate decoration → link rewriting.
	renderMd(md, lang) {
		let html = markdownToHtml(md);
		// Pillar blockquotes: "**A.** …" opener → pillar block with letter badge
		html = html.replace(/<blockquote><strong>([ABC])\.<\/strong>\s*([\s\S]*?)<\/blockquote>/g,
			(m, letter, rest) =>
				`<blockquote class="pillar" data-letter="${letter}"><span class="pillar-letter">${letter}</span><p>${rest.trim()}</p></blockquote>`);
		// Bare postulate refs: <strong>A</strong> → highlighted
		html = html.replace(/<strong>([ABC])<\/strong>/g, '<strong class="postulate">$1</strong>');
		// Post-internal links → real URLs in the current language
		html = html.replace(/href="\.\.\/posts\/([a-z0-9-]+)\/?"/g,
			(m, slug) => `href="${esc(this.postHref(slug, lang))}"`);
		html = html.replace(/href="\.\.\/(writing|arena|religion|about)\/?"/g,
			(m, id) => `href="${esc(this.url(lang, '/' + id + '/'))}"`);
		html = html.replace(/href="(\.\.\/|\.\/)"/g, (m) => `href="${esc(this.homeHref(lang))}"`);
		// External links open in a new tab
		html = html.replace(/<a href="(https?:[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener">');
		return html;
	}

	// Strip duplicate H1 + italic byline from a post body (header renders them).
	stripPostHeader(md) {
		return md
			.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
			.replace(/^\s*#\s+[^\n]*\n?/, '')
			.replace(/^\s*\*(?:by|von)\s+[^\n]*\*?\s*\n?/, '')
			.replace(/^\s*\n/, '');
	}

	// Page (religion/about) title/subtitle extraction.
	splitPage(mdText) {
		const lines = mdText.replace(/\r\n/g, '\n').split('\n');
		let title = '', subtitle = '', i = 0;
		if (lines[i] && lines[i].trim() === '---') {
			for (i++; i < lines.length && lines[i].trim() !== '---'; i++) {}
			i++;
		}
		while (i < lines.length && !lines[i].trim()) i++;
		const m = lines[i]?.match(/^#\s+(.+)$/);
		if (m) { title = m[1].trim(); i++; }
		while (i < lines.length && !lines[i].trim()) i++;
		const s = lines[i]?.match(/^\*(.+)\*\s*$/);
		if (s) { subtitle = s[1].trim(); i++; }
		return { title, subtitle, body: lines.slice(i).join('\n').trim() };
	}

	/* ---------------- document shell ---------------- */

	doc({ lang, title, description, alternates = [], audio = false, ogType = 'website', times = null, graph = [], body }) {
		const links = alternates.map((a) => `<link rel="alternate"${a.type ? ` type="${a.type}"` : ''}${a.hreflang ? ` hreflang="${a.hreflang}"` : ''} href="${esc(a.href)}">`).join('\n\t\t');
		const pageTitle = title ? `${esc(title)} — RAUM` : `RAUM — It's not nothing`;
		const playerAssets = audio ? `
<link rel="stylesheet" href="/modules/nui_wc2/NUI/css/modules/nui-media-player.css">
<script type="module" src="/modules/nui_wc2/NUI/lib/modules/nui-media-player.js"></script>` : '';
		const enAlt = alternates.find((a) => a.hreflang === 'en');
		const xDefault = enAlt ? `<link rel="alternate" hreflang="x-default" href="${esc(enAlt.href)}">` : '';
		const og = this.ogTags({ lang, title: title || `RAUM — It's not nothing`, description, ogType, times });
		const ld = graph.length
			? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>\n`
			: '';
		return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${pageTitle}</title>
${description ? `<meta name="description" content="${esc(description)}">\n` : ''}<link rel="canonical" href="${esc(this.canonical || '')}">
${links ? links + '\n' : ''}${xDefault ? xDefault + '\n' : ''}${og}
${ld}<link rel="llms" href="/llms.txt" type="text/plain">${playerAssets}
<script>try{document.documentElement.dataset.theme=localStorage.getItem('raum-theme')||'system'}catch(e){}</script>
<link rel="stylesheet" href="/assets/css/site.css">
<script src="/assets/js/chrome.js" defer></script>
</head>
<body>
${this.chrome(lang, alternates)}
<main id="app">
${body}
</main>
${this.footer(lang)}
</body>
</html>`;
	}

	ogTags({ lang, title, description, ogType, times }) {
		const m = [
			`<meta property="og:site_name" content="RAUM">`,
			`<meta property="og:title" content="${esc(title)}">`,
			description ? `<meta property="og:description" content="${esc(description)}">` : '',
			`<meta property="og:url" content="${esc(this.canonical || '')}">`,
			`<meta property="og:type" content="${ogType}">`,
			`<meta property="og:locale" content="${lang === 'de' ? 'de_DE' : 'en_US'}">`,
			`<meta property="og:locale:alternate" content="${lang === 'de' ? 'en_US' : 'de_DE'}">`,
			`<meta name="twitter:card" content="summary">`,
		];
		if (times?.published) m.push(`<meta property="article:published_time" content="${esc(times.published)}">`);
		if (times?.modified) m.push(`<meta property="article:modified_time" content="${esc(times.modified)}">`);
		return m.filter(Boolean).join('\n');
	}

	/* ---------------- structured data (JSON-LD @graph) ---------------- */

	// Site-wide entities, identical @id on every page (define once, reference everywhere).
	siteNodes() {
		const b = this.baseUrl;
		return [
			{ '@type': 'WebSite', '@id': `${b}/#website`, url: `${b}/`, name: this.manifest.site.name,
				description: this.manifest.site.description, inLanguage: ['en', 'de'],
				publisher: { '@id': `${b}/authors/david-a-renelt/#person` } },
			{ '@type': 'Person', '@id': `${b}/authors/david-a-renelt/#person`, name: 'David A. Renelt',
				alternateName: 'Herrbasan', url: `${b}/authors/david-a-renelt/` },
		];
	}

	publisherRef() {
		return { '@id': `${this.baseUrl}/authors/david-a-renelt/#person` };
	}

	// Inline Person (name + url + stable @id) for author chains — matches the visible process footer.
	personNode(id) {
		const a = this.manifest.authors?.find((x) => x.id === id);
		return { '@type': 'Person', '@id': `${this.baseUrl}/authors/${id}/#person`, name: a?.name || id, url: `${this.baseUrl}/authors/${id}/` };
	}

	breadcrumbList(items) {
		return { '@type': 'BreadcrumbList', '@id': `${this.canonical}#breadcrumb`,
			itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, ...(it.url ? { item: it.url } : {}) })) };
	}

	homeCrumb(lang) { return { name: this.manifest.site.name, url: `${this.baseUrl}${this.homeHref(lang)}` }; }

	chrome(lang, alternates) {
		const navItems = this.manifest.nav.map((n) => {
			const id = n.path.replace('/', '');
			// Arena keeps its original language — no DE tree
			const target = id === 'arena' ? '/arena/' : this.url(lang, '/' + id + '/');
			return `<a class="nav-link" href="${esc(target)}">${esc(this.t(lang, 'nav_' + id))}</a>`;
		}).join('\n				');
		// Language toggle: link to the alternate page (fallback: other-language home)
		const deAlt = alternates.find((a) => a.hreflang === 'de');
		const enAlt = alternates.find((a) => a.hreflang === 'en');
		const langTarget = lang === 'en'
			? (deAlt ? deAlt.href : '/de/')
			: (enAlt ? enAlt.href : '/');
		const langLabel = lang === 'de' ? 'EN' : 'DE';
		return `<header class="site-header" id="site-header">
	<div class="site-header-inner">
		<div class="brand-wrap">
			<a class="brand" href="${esc(this.homeHref(lang))}">${esc(this.manifest.site.name)}</a>
			<span class="brand-sub">有趣的发现：并非虚无。</span>
		</div>
		<button class="menu-toggle" type="button" id="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="${esc(this.t(lang, 'menu_label'))}">
			<span></span><span></span><span></span>
		</button>
		<nav class="nav" id="site-nav" aria-label="Main">
			${navItems}
			<div class="nav-controls">
				<a class="lang-toggle" href="${esc(langTarget)}">${langLabel}</a>
				<button class="theme-toggle" type="button" id="theme-toggle">Auto</button>
			</div>
		</nav>
	</div>
</header>`;
	}

	footer(lang) {
		return `<footer class="site-footer" id="site-footer">
	<div class="foot-inner"><span>${esc(this.t(lang, 'footer'))}</span></div>
</footer>`;
	}

	/* ---------------- shared blocks ---------------- */

	authorName(id) {
		return this.manifest.authors?.find((a) => a.id === id)?.name || id;
	}

	processFooter(lang, meta) {
		if (!meta?.authors?.length) return '';
		const chain = meta.authors.map((a) => `
			<li><a href="/authors/${esc(a.id)}/">${esc(this.authorName(a.id))}</a><span class="role">${esc(this.t(lang, 'role_' + a.role) || a.role)}</span></li>`).join('');
		const dates = [];
		if (meta.created) dates.push(`${esc(this.t(lang, 'meta_created'))} ${esc(meta.created)}`);
		if (meta.modified) dates.push(`${esc(this.t(lang, 'meta_updated'))} ${esc(meta.modified)}`);
		return `
		<footer class="meta-footer">
			<p class="kicker">${esc(this.t(lang, 'meta_how'))}</p>
			<ul class="meta-chain">${chain}</ul>
			${dates.length ? `<p class="meta-dates">${dates.join(' · ')}</p>` : ''}
		</footer>`;
	}

	audioBlock(lang, audio, de) {
		if (!audio) return '';
		const file = de ? (audio.de || audio.en) : (audio.en || audio.de);
		if (!file) return '';
		return `
		<div class="essay-audio">
			<p class="kicker">${esc(this.t(lang, 'listen'))}</p>
			<nui-media-player pause-others>
				<audio controls preload="metadata" src="/content/audio/${esc(file)}"></audio>
			</nui-media-player>
		</div>`;
	}

	/* ---------------- pages ---------------- */

	home(lang) {
		const { site } = this.manifest;
		const posts = this.manifest.posts;
		const latest = posts.find((p) => p.featured) ||
			[...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
		const de = lang === 'de' && latest.de;
		const entry = (kicker, title, note, href) => `
		<a class="entry" href="${esc(href)}">
			<p class="entry-kicker">${esc(this.t(lang, kicker))}</p>
			<h2>${esc(this.t(lang, title))}</h2>
			<p class="entry-note">${esc(this.t(lang, note))}</p>
		</a>`;
		const body = `
	<div class="home">
		<p class="threshold">${esc(site.threshold)}</p>
		<p class="threshold-source">${esc(this.t(lang, 'thresholdSource'))}</p>
		<div class="page-intro">
			<p>${escStrong(this.t(lang, 'intro_2'))}</p>
			<p>${escStrong(this.t(lang, 'intro_3'))}</p>
			<p>${escStrong(this.t(lang, 'intro_4'))}</p>
		</div>
		<div class="entry-points">
			${entry('entry_blog_kicker', 'nav_writing', 'entry_blog_note', this.url(lang, '/writing/'))}
			${entry('entry_arena_kicker', 'nav_arena', 'entry_arena_note', '/arena/')}
			${entry('entry_religion_kicker', 'nav_religion', 'entry_religion_note', this.url(lang, '/religion/'))}
		</div>
		${lang === 'de' ? `
		<div class="lang-note">
			<p class="lang-note-kicker">${esc(this.t(lang, 'lang_note_kicker'))}</p>
			<p class="lang-note-text">${esc(this.t(lang, 'lang_note'))}</p>
		</div>` : ''}
		<div class="latest">
			<p class="latest-kicker">${esc(this.t(lang, 'latest_kicker'))}</p>
			<a href="${esc(this.postHref(latest.slug, lang))}">
				<h2 class="post-title">${esc(de?.title || latest.title)}</h2>
				<p class="post-teaser">${esc(de?.teaser || latest.teaser)}</p>
			</a>
		</div>
	</div>`;
		return this.doc({
			lang, title: '', description: site.description,
			alternates: [{ hreflang: 'en', href: '/' }, { hreflang: 'de', href: '/de/' }],
			graph: [...this.siteNodes(), {
				'@type': 'WebPage', '@id': `${this.canonical}#webpage`, url: this.canonical,
				name: `${site.name} — ${this.t(lang, 'threshold')}`, description: site.description,
				inLanguage: lang, isPartOf: { '@id': `${this.baseUrl}/#website` },
			}],
			body,
		});
	}

	writing(lang) {
		const posts = [...this.manifest.posts]
			.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
		const items = posts.map((p) => {
			const de = lang === 'de' && p.de;
			const tags = (p.tags || []).map((tg) => de?.tags?.[tg] || tg);
			return `
		<li>
			<a href="${esc(this.postHref(p.slug, lang))}">
				<h2 class="post-title">${esc(de?.title || p.title)}</h2>
				<p class="post-teaser">${esc(de?.teaser || p.teaser)}</p>
				<p class="post-meta"><time>${esc(p.date)}</time>${tags.length ? ` · <span class="post-tags">${tags.map(esc).join(' · ')}</span>` : ''}${p.status === 'draft' ? ` · <span class="post-tags">${esc(this.t(lang, 'status_draft'))}</span>` : ''}</p>
			</a>
		</li>`;
		}).join('');
		const body = `
	<div class="writing">
		<h1 class="page-title">${esc(this.t(lang, 'blog_title'))}</h1>
		<p class="page-author">${esc(this.t(lang, 'blog_author'))}</p>
		<p class="page-lede">${esc(this.t(lang, 'blog_lede'))}</p>
		<ul class="post-list">${items}</ul>
	</div>`;
		return this.doc({
			lang, title: this.t(lang, 'blog_title'), description: this.t(lang, 'blog_lede'),
			alternates: [{ hreflang: 'en', href: '/writing/' }, { hreflang: 'de', href: '/de/writing/' }],
			graph: [...this.siteNodes(),
				{ '@type': 'Blog', '@id': `${this.canonical}#blog`, url: this.canonical,
					name: this.t(lang, 'blog_title'), description: this.t(lang, 'blog_lede'),
					inLanguage: lang, isPartOf: { '@id': `${this.baseUrl}/#website` }, publisher: this.publisherRef() },
				this.breadcrumbList([this.homeCrumb(lang), { name: this.t(lang, 'blog_title') }]),
			],
			body,
		});
	}

	arena() {
		const { arena } = this.manifest;
		const row = (l) => `
		<li class="arena-item">
			<a class="arena-link" href="/arena/${esc(l.slug)}/">
				<span class="arena-no">${String(l.number).padStart(2, '0')}</span>
				<span class="arena-name">${esc(l.title)}</span>
				<span class="arena-models">${esc((l.models || []).join(' × '))}</span>
			</a>
			<p class="arena-case">${esc(l.case)}</p>
		</li>`;
		const items = arena.landmarks.slice().sort((a, b) => a.order - b.order).map(row).join('');
		const evidence = (arena.evidence || []).map(row).join('');
		const body = `
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
		${evidence ? `<h2 class="arena-h2">Evidence</h2><ul class="arena-list">${evidence}</ul>` : ''}
	</div>`;
		return this.doc({
			lang: 'en', title: 'Arena', description: arena.frame, alternates: [],
			graph: [...this.siteNodes(),
				{ '@type': 'CollectionPage', '@id': `${this.canonical}#webpage`, url: this.canonical,
					name: 'Arena', description: `${arena.frame} ${arena.frameNote}`,
					inLanguage: 'en', isPartOf: { '@id': `${this.baseUrl}/#website` } },
				this.breadcrumbList([this.homeCrumb('en'), { name: 'Arena' }]),
			],
			body,
		});
	}

	page(slug, lang) {
		const page = this.manifest.pages?.find((p) => p.slug === slug);
		if (!page) throw new Error(`page not in manifest: ${slug}`);
		const de = lang === 'de' && page.de;
		const file = de?.file || `${slug}.md`;
		const mdText = this.read(`content/pages/${file}`);
		const meta = scrapeMeta(mdText);
		const { title, subtitle, body: pageBody } = this.splitPage(mdText);
		const authorList = slug === 'about'
			? `
			<section class="about-authors">
				<h2>${esc(this.t(lang, 'meta_authors'))}</h2>
				<ul class="author-list">${(this.manifest.authors || []).map((a) => `
					<li><a href="/authors/${esc(a.id)}/">${esc(a.name)}</a><span class="role">${esc(this.t(lang, 'role_' + a.role) || a.role)}</span></li>`).join('')}
				</ul>
			</section>`
			: '';
		const isAbout = slug === 'about';
		const faq = isAbout ? (this.manifest.site.faq || []) : [];
		const faqBlock = faq.length ? `
			<section class="faq">
				<h2>${esc(this.t(lang, 'faq_title'))}</h2>
				${faq.map((f) => `
				<div class="faq-item">
					<h3 class="faq-q">${esc(f.q[lang] || f.q.en)}</h3>
					<p class="faq-a">${esc(f.a[lang] || f.a.en)}</p>
				</div>`).join('')}
			</section>` : '';
		const body = `
	<div class="about">
		<h1 class="name-line">${esc(title)}</h1>
		${subtitle ? `<p class="real-name">${esc(subtitle)}</p>` : ''}
		${this.audioBlock(lang, page.audio, de)}
		<div class="essay-body">${this.renderMd(pageBody, lang)}</div>
		${this.processFooter(lang, meta)}
		${authorList}
		${faqBlock}
	</div>`;
		const hasAudio = !!(de ? (page.audio?.de || page.audio?.en) : (page.audio?.en || page.audio?.de));
		const graph = [...this.siteNodes()];
		if (isAbout) {
			graph.push({ '@type': 'AboutPage', '@id': `${this.canonical}#webpage`, url: this.canonical,
				name: title, description: page.teaser || this.manifest.site.description,
				inLanguage: lang, isPartOf: { '@id': `${this.baseUrl}/#website` },
				mainEntity: this.publisherRef() });
			if (faq.length) graph.push({ '@type': 'FAQPage', '@id': `${this.canonical}#faq`, inLanguage: lang,
				mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q[lang] || f.q.en,
					acceptedAnswer: { '@type': 'Answer', text: f.a[lang] || f.a.en } })) });
		} else {
			graph.push({ '@type': 'Article', '@id': `${this.canonical}#article`,
				headline: title, description: page.teaser || this.manifest.site.description,
				author: [...new Map((meta.authors || []).map((a) => [a.id, this.personNode(a.id)])).values()],
				publisher: this.publisherRef(),
				...(meta.created ? { datePublished: meta.created } : {}),
				...(meta.modified ? { dateModified: meta.modified } : {}),
				inLanguage: lang, isPartOf: { '@id': `${this.baseUrl}/#website` },
				mainEntityOfPage: { '@type': 'WebPage', '@id': this.canonical } });
		}
		graph.push(this.breadcrumbList([this.homeCrumb(lang), { name: title || this.t(lang, 'nav_' + slug) }]));
		return this.doc({
			lang,
			title: title || this.t(lang, 'nav_' + slug),
			description: page.teaser || this.manifest.site.description,
			audio: hasAudio,
			ogType: isAbout ? 'website' : 'article',
			times: isAbout ? null : { published: meta.created, modified: meta.modified },
			alternates: [
				{ type: 'text/markdown', href: `/content/pages/${file}` },
				...(page.de ? [
					{ hreflang: 'en', href: `/${slug}/` },
					{ hreflang: 'de', href: `/de/${slug}/` },
				] : []),
			],
			graph,
			body,
		});
	}

	post(slug, lang) {
		const post = this.manifest.posts.find((p) => p.slug === slug);
		if (!post) throw new Error(`post not in manifest: ${slug}`);
		const de = lang === 'de' && post.de;
		const file = de?.file || post.file;
		const mdText = this.read(`content/posts/${file}`);
		const meta = scrapeMeta(mdText);
		const tags = (post.tags || []).map((tg) => de?.tags?.[tg] || tg);
		const statusNote = post.status === 'draft'
			? `\n			<p class="status-note">${esc(this.t(lang, 'status_draft'))}</p>`
			: '';
		const body = `
	<div class="essay">
		<div class="essay-header">
			<h1 class="essay-title">${esc(de?.title || post.title)}</h1>
			<p class="byline">${esc(this.t(lang, 'blog_author'))}<span class="sep">·</span><time>${esc(post.date)}</time>${tags.length ? `<span class="sep">·</span><span class="post-tags">${tags.map(esc).join(' · ')}</span>` : ''}</p>${statusNote}
		</div>
		${this.audioBlock(lang, post.audio, de)}
		<div class="essay-body">${this.renderMd(this.stripPostHeader(mdText), lang)}</div>
		${this.seriesNav(post, lang)}
		${this.relatedNav(post, lang)}
		${this.processFooter(lang, meta)}
		<p class="raw-doc"><a href="/content/posts/${esc(file)}" download>↓ ${esc(this.t(lang, 'download_md'))}</a></p>
	</div>`;
		const hasAudio = !!(de ? (post.audio?.de || post.audio?.en) : (post.audio?.en || post.audio?.de));
		const audioFile = de ? (post.audio?.de || post.audio?.en) : (post.audio?.en || post.audio?.de);
		const wordCount = this.stripPostHeader(mdText).split(/\s+/).filter(Boolean).length;
		const graph = [...this.siteNodes(),
			{ '@type': 'BlogPosting', '@id': `${this.canonical}#article`,
				headline: de?.title || post.title,
				description: de?.teaser || post.teaser,
				datePublished: post.date,
				...(meta.modified ? { dateModified: meta.modified } : {}),
				author: [...new Map((meta.authors || []).map((a) => [a.id, this.personNode(a.id)])).values()],
				publisher: this.publisherRef(),
				mainEntityOfPage: { '@type': 'WebPage', '@id': this.canonical },
				inLanguage: lang,
				...(tags.length ? { keywords: tags.join(', ') } : {}),
				isPartOf: { '@id': `${this.baseUrl}${this.url(lang, '/writing/')}#blog` },
				wordCount,
				...(audioFile ? { audio: { '@type': 'AudioObject', name: `${de?.title || post.title} (audio)`,
					contentUrl: `${this.baseUrl}/content/audio/${audioFile}`, encodingFormat: 'audio/mpeg', inLanguage: lang } } : {}),
			},
			this.breadcrumbList([
				this.homeCrumb(lang),
				{ name: this.t(lang, 'blog_title'), url: `${this.baseUrl}${this.url(lang, '/writing/')}` },
				{ name: de?.title || post.title },
			]),
		];
		return this.doc({
			lang,
			title: de?.title || post.title,
			description: de?.teaser || post.teaser,
			audio: hasAudio,
			ogType: 'article',
			times: { published: post.date, modified: meta.modified },
			alternates: [
				{ type: 'text/markdown', href: `/content/posts/${file}` },
				{ hreflang: 'en', href: `/writing/${slug}/` },
				...(post.de ? [{ hreflang: 'de', href: `/de/writing/${slug}/` }] : []),
			],
			graph,
			body,
		});
	}

	seriesNav(post, lang) {
		const links = post.links || {};
		if (!links.series) return '';
		const series = this.manifest.series?.[links.series];
		if (!series) return '';
		const parts = series.parts.map((pslug) => {
			const p = this.manifest.posts.find((x) => x.slug === pslug);
			const title = p ? (lang === 'de' && p.de ? p.de.title : p.title) : null;
			if (pslug === post.slug) return `<li class="current">${esc(title || pslug)}</li>`;
			if (p) return `<li><a href="${esc(this.postHref(pslug, lang))}">${esc(title)}</a></li>`;
			return `<li class="forthcoming">${esc(title || pslug)}</li>`;
		}).join('');
		return `
		<nav class="series-nav">
			<p class="kicker">${esc(series.name)} — ${esc(this.t(lang, 'series_part'))} ${links.seriesIndex} ${esc(this.t(lang, 'series_of'))} ${series.parts.length}</p>
			<ol>${parts}</ol>
		</nav>`;
	}

	relatedNav(post, lang) {
		const rel = (post.links?.related || []).filter(Boolean);
		if (!rel.length) return '';
		const items = rel.map((slug) => {
			const p = this.manifest.posts.find((x) => x.slug === slug);
			if (!p) return '';
			const title = lang === 'de' && p.de ? p.de.title : p.title;
			return `<li><a href="${esc(this.postHref(slug, lang))}">${esc(title)}</a></li>`;
		}).join('');
		return `
		<nav class="related-nav">
			<p class="kicker">${esc(this.t(lang, 'related'))}</p>
			<ul class="related-list">${items}</ul>
		</nav>`;
	}

	/* ---------------- arena session ---------------- */

	loadSession(slug) {
		const all = [
			...(this.manifest.arena.landmarks || []),
			...(this.manifest.arena.evidence || []),
		];
		const landmark = all.find((l) => l.slug === slug);
		if (!landmark) throw new Error(`session not in manifest: ${slug}`);
		const data = JSON.parse(this.read(`content/arena/${landmark.file}`));
		return { landmark, data };
	}

	extractSeed(data) {
		const m = (data.messages || []).find((x) => x.speaker === 'moderator');
		if (!m || !m.content) return '';
		return m.content.replace(/^Topic:\s*/i, '').trim();
	}

	extractTurns(data, models = []) {
		const map = new Map();
		const turns = [];
		for (const m of data.messages || []) {
			if (!m || m.speaker === 'moderator') continue;
			if (!map.has(m.speaker)) {
				const i = map.size;
				map.set(m.speaker, { name: models[i] || m.speaker, letter: String.fromCharCode(65 + i) });
			}
			const t = map.get(m.speaker);
			turns.push({ name: t.name, letter: t.letter, content: m.content || '' });
		}
		return turns;
	}

	session(slug) {
		const { landmark, data } = this.loadSession(slug);
		const seed = this.extractSeed(data);
		const turns = this.extractTurns(data, landmark.models);
		const turnHtml = turns.map((tr) => `
			<li class="turn turn-${tr.letter}">
				<p class="turn-speaker">${esc(tr.name)}</p>
				<div class="turn-text">${this.renderMd(tr.content.trim(), 'en')}</div>
			</li>`).join('');
		const body = `
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
			<span class="downloads-label">${esc(this.t('en', 'download_md'))} / ${esc(this.t('en', 'download_json'))}</span>
			<a href="/arena/${esc(slug)}/transcript.md" download>↓ ${esc(this.t('en', 'download_md'))}</a>
			<a href="/content/arena/${esc(landmark.file)}" download>↓ ${esc(this.t('en', 'download_json'))}</a>
		</div>
		<div class="transcript">
			<ul class="turns">${turnHtml}</ul>
		</div>
	</div>`;
		return this.doc({
			lang: 'en', title: landmark.title, description: landmark.case, alternates: [],
			ogType: 'article',
			graph: [...this.siteNodes(),
				{ '@type': 'Article', '@id': `${this.canonical}#article`,
					headline: landmark.title, description: landmark.case, inLanguage: 'en',
					author: (landmark.models || []).map((m) => ({ '@type': 'Person', name: m })),
					publisher: this.publisherRef(),
					isPartOf: { '@id': `${this.baseUrl}/arena/#webpage` },
					mainEntityOfPage: { '@type': 'WebPage', '@id': this.canonical } },
				this.breadcrumbList([
					this.homeCrumb('en'),
					{ name: 'Arena', url: `${this.baseUrl}/arena/` },
					{ name: landmark.title },
				]),
			],
			body,
		});
	}

	// Baked transcript markdown (what the old client-side MD download produced).
	sessionTranscriptMd(slug) {
		const { landmark, data } = this.loadSession(slug);
		const seed = this.extractSeed(data);
		const turns = this.extractTurns(data, landmark.models);
		let md = `# ${landmark.title}\n\n`;
		md += `_${(landmark.models || []).join(' × ')}_\n\n`;
		md += `> ${landmark.case}\n\n`;
		if (seed) md += `**Seed:** ${seed}\n\n`;
		md += `---\n\n`;
		turns.forEach((tr) => { md += `## ${tr.name}\n\n${tr.content.trim()}\n\n`; });
		return md;
	}

	/* ---------------- author ---------------- */

	author(id) {
		const author = this.manifest.authors?.find((a) => a.id === id);
		if (!author) throw new Error(`author not in manifest: ${id}`);
		const mdText = this.read(`content/authors/${author.file}`);
		const meta = scrapeMeta(mdText);
		// Bio: folded YAML scalar, else body text
		const bioBlock = mdText.match(/(?:^|\n)bio:\s*[>|]?\s*\r?\n((?:[ \t]+.*\r?\n?)+)/);
		const bio = bioBlock
			? bioBlock[1].split(/\r?\n/).map((l) => l.replace(/^[ \t]+/, '')).join(' ').trim()
			: mdText.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
		const roleLine = `<p class="author-role">${esc(this.t('en', 'role_' + author.role) || author.role)}${author.model ? ` · ${esc(author.model)}` : ''}</p>`;
		const entries = [];
		for (const p of this.manifest.posts) {
			for (const a of p.authors || []) if (a.id === id) entries.push({ slug: p.slug, title: p.title, role: a.role });
			for (const a of p.de?.authors || []) if (a.id === id) entries.push({ slug: p.slug, title: p.de.title, role: a.role });
		}
		const postsHtml = entries.length ? `
			<nav class="author-posts">
				<p class="kicker">${esc(this.t('en', 'author_posts'))}</p>
				<ul class="author-post-list">
					${entries.map((e) => `<li><a href="/writing/${esc(e.slug)}/">${esc(e.title)}</a><span class="role">${esc(this.t('en', 'role_' + e.role) || e.role)}</span></li>`).join('')}
				</ul>
			</nav>` : '';
		const body = `
	<div class="author">
		${roleLine}
		<h1 class="essay-title">${esc(author.name)}</h1>
		<div class="essay-body">${this.renderMd(bio, 'en')}</div>
		${postsHtml}
	</div>`;
		const bioPlain = bio.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
		return this.doc({
			lang: 'en', title: author.name, description: `${author.name} — ${author.role}`,
			alternates: [{ type: 'text/markdown', href: `/content/authors/${author.file}` }],
			graph: [...this.siteNodes(),
				{ '@type': 'ProfilePage', '@id': `${this.canonical}#webpage`, url: this.canonical,
					name: author.name, inLanguage: 'en', isPartOf: { '@id': `${this.baseUrl}/#website` },
					mainEntity: { '@type': 'Person', '@id': `${this.baseUrl}/authors/${id}/#person`,
						name: author.name, url: `${this.baseUrl}/authors/${id}/`,
						...(bioPlain ? { description: bioPlain.length > 300 ? bioPlain.slice(0, 297) + '…' : bioPlain } : {}) } },
				this.breadcrumbList([this.homeCrumb('en'), { name: author.name }]),
			],
			body,
		});
	}
}
