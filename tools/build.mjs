/* build.mjs — static site build for RAUM.
   Bakes flat HTML pages from content/ (MD + manifest) and assembles the
   complete deployable site into dist/.
   Usage:
     node tools/build.mjs          — one-shot build
     node tools/build.mjs --watch  — rebuild on content/tools change
   dist/ is THE WEBSITE — publish its contents as-is (folder sync to the
   webserver). It is wiped and rebuilt each run; never hand-edit. */

import { Site } from './lib/pages.mjs';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const BASE_URL = 'https://raum.com';

const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function build() {
	// --- clean ---
	if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
	mkdirSync(DIST, { recursive: true });
	const manifest = JSON.parse(read('content/index.json'));
	const site = new Site(manifest, read);
	const pages = new Map(); // dist-relative outPath -> content
	const add = (out, html) => pages.set(out, html);

	// --- EN tree ---
	site.canonical = `${BASE_URL}/`;
	add('index.html', site.home('en'));
	site.canonical = `${BASE_URL}/writing/`;
	add('writing/index.html', site.writing('en'));
	site.canonical = `${BASE_URL}/arena/`;
	add('arena/index.html', site.arena());
	site.canonical = `${BASE_URL}/religion/`;
	add('religion/index.html', site.page('religion', 'en'));
	site.canonical = `${BASE_URL}/about/`;
	add('about/index.html', site.page('about', 'en'));

	for (const p of manifest.posts) {
		site.canonical = `${BASE_URL}/writing/${p.slug}/`;
		add(`writing/${p.slug}/index.html`, site.post(p.slug, 'en'));
	}

	for (const l of [...(manifest.arena.landmarks || []), ...(manifest.arena.evidence || [])]) {
		site.canonical = `${BASE_URL}/arena/${l.slug}/`;
		add(`arena/${l.slug}/index.html`, site.session(l.slug));
		add(`arena/${l.slug}/transcript.md`, site.sessionTranscriptMd(l.slug));
	}

	for (const a of manifest.authors || []) {
		site.canonical = `${BASE_URL}/authors/${a.id}/`;
		add(`authors/${a.id}/index.html`, site.author(a.id));
	}

	// --- DE tree (posts/pages with a de variant; arena + authors stay EN) ---
	site.canonical = `${BASE_URL}/de/`;
	add('de/index.html', site.home('de'));
	site.canonical = `${BASE_URL}/de/writing/`;
	add('de/writing/index.html', site.writing('de'));
	site.canonical = `${BASE_URL}/de/religion/`;
	add('de/religion/index.html', site.page('religion', 'de'));
	site.canonical = `${BASE_URL}/de/about/`;
	add('de/about/index.html', site.page('about', 'de'));

	for (const p of manifest.posts) {
		if (!p.de) continue;
		site.canonical = `${BASE_URL}/de/writing/${p.slug}/`;
		add(`de/writing/${p.slug}/index.html`, site.post(p.slug, 'de'));
	}

	add('llms.txt', buildLlmsTxt(manifest));
	add('sitemap.xml', buildSitemap(manifest, [...pages.keys()]));

	// --- write generated pages ---
	for (const [out, content] of pages) {
		const abs = join(DIST, out);
		mkdirSync(dirname(abs), { recursive: true });
		writeFileSync(abs, content, 'utf8');
	}

	// --- copy publish assets (source of truth stays in the repo root) ---
	// Raw content: MD alternates, arena JSON downloads, audio, manifest.
	// content/audio/archive/ (outdated-version MP3s, gitignored) is excluded.
	cpSync(join(ROOT, 'content'), join(DIST, 'content'), {
		recursive: true,
		filter: (src) => !src.startsWith(join(ROOT, 'content', 'audio', 'archive')),
	});
	// Site chrome CSS/JS.
	cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });
	// NUI runtime (whole tree, 0.6 MB) — nui-media-player imports the core
	// (nui.js) which may reference further assets. Cheaper than cherry-picking.
	// NUI's auto theme injection stays off: site.css defines --nui-space.
	cpSync(join(ROOT, 'modules/nui_wc2/NUI'), join(DIST, 'modules/nui_wc2/NUI'), { recursive: true });
	// Server config + root docs.
	for (const f of ['.htaccess', 'robots.txt', 'Agents.md']) {
		if (existsSync(join(ROOT, f))) cpSync(join(ROOT, f), join(DIST, f));
	}

	// --- report ---
	let files = 0, bytes = 0;
	(function walk(d) {
		for (const e of readdirSync(d)) {
			const abs = join(d, e);
			if (statSync(abs).isDirectory()) walk(abs);
			else { files++; bytes += statSync(abs).size; }
		}
	})(DIST);
	console.log(`[build] ${pages.size} pages + assets → dist/ (${files} files, ${(bytes / 1048576).toFixed(1)} MB)`);
	return pages.size;
}

// sitemap.xml — one <url> per baked page (EN + DE trees), hreflang pairs + x-default.
function buildSitemap(manifest, outPaths) {
	const postDate = new Map(manifest.posts.map((p) => [`writing/${p.slug}/`, p.date]));
	const urls = [];
	for (const out of outPaths) {
		if (!out.endsWith('index.html')) continue;
		const path = out.replace(/index\.html$/, '');
		const enPath = path.startsWith('de/') ? path.slice(3) : path;
		const dePath = `de/${enPath}`;
		const hasDe = outPaths.includes(`${dePath}index.html`);
		const links = [
			`\t\t<xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/${enPath}"/>`,
			...(hasDe ? [`\t\t<xhtml:link rel="alternate" hreflang="de" href="${BASE_URL}/${dePath}"/>`] : []),
			`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${enPath}"/>`,
		];
		const lastmod = postDate.get(enPath) || '';
		urls.push(`\t<url>\n\t\t<loc>${BASE_URL}/${path}</loc>${lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : ''}\n${links.join('\n')}\n\t</url>`);
	}
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

function buildLlmsTxt(manifest) {
	const u = (p) => `${BASE_URL}${p}`;
	const L = [];
	L.push(`# RAUM`);
	L.push(``);
	L.push(`> RAUM is the publication platform of Herrbasan (David A. Renelt). Writing — essays from the *Telescope for the Mind* arc plus standalone pieces, bilingual EN/DE — and the Arena: curated LLM-to-LLM conversations. The essays make the claims; the arena is the data. Frame: "It's not nothing."`);
	L.push(``);
	L.push(`All pages are statically rendered HTML with full content in the response. Every essay and page links its raw Markdown source via \`<link rel="alternate" type="text/markdown">\` — the [MD] links below. German versions live under /de/ and are linked as hreflang alternates. Arena sessions keep their original language; raw JSON exports and baked Markdown transcripts are linked per session. \`content/index.json\` is the machine-readable manifest. The \`modules/nui_wc2/\` directory is a vendored UI library and is intentionally not listed.`);
	L.push(``);
	L.push(`## Root`);
	L.push(``);
	L.push(`- [${u('/')}](${u('/')}): Home — threshold, entry points.`);
	L.push(`- [${u('/writing/')}](${u('/writing/')}): Blog — all essays in one feed.`);
	L.push(`- [${u('/arena/')}](${u('/arena/')}): Arena — curated LLM-to-LLM conversations.`);
	L.push(`- [${u('/religion/')}](${u('/religion/')}): A Little Religion — the distillation.`);
	L.push(`- [${u('/about/')}](${u('/about/')}): About — David Renelt / Herrbasan.`);
	L.push(`- [Agents.md](${u('/Agents.md')}): Project plan and canonical rulebook — architecture, data model, content sourcing & sync, TTS workflow.`);
	L.push(`- [content/index.json](${u('/content/index.json')}): Site manifest. Posts (slug/title/date/teaser/tags/authors/audio), pages, author registry, series, i18n strings, arena landmarks + evidence.`);
	L.push(``);
	L.push(`## Writing (${u('/writing/')})`);
	L.push(``);
	const series = manifest.series?.['wish-factory']?.parts || [];
	const inSeries = new Set(series);
	const postLine = (p) => {
		const bits = [`${p.title} (${p.date})`];
		const links = (p.links?.series)
			? `Series part ${p.links.seriesIndex}.`
			: null;
		if (links) bits.push(links);
		const md = `[MD](${u('/content/posts/' + p.file)})`;
		const de = p.de ? ` [DE](${u('/de/writing/' + p.slug + '/')})` : '';
		return `- [${u('/writing/' + p.slug + '/')}](${u('/writing/' + p.slug + '/')}): ${bits.join(' ')} ${md}${de}`;
	};
	if (series.length) {
		L.push(`Wish Factory series (in reading order):`);
		L.push(``);
		for (const slug of series) {
			const p = manifest.posts.find((x) => x.slug === slug);
			if (p) L.push(postLine(p));
		}
		L.push(``);
	}
	L.push(`Standalone essays:`);
	L.push(``);
	for (const p of manifest.posts) if (!inSeries.has(p.slug)) L.push(postLine(p));
	L.push(``);
	L.push(`## Pages`);
	L.push(``);
	for (const pg of manifest.pages || []) {
		const md = `[MD](${u('/content/pages/' + (pg.file || pg.slug + '.md'))})`;
		const de = pg.de ? ` [DE](${u('/de/' + pg.slug + '/')})` : '';
		L.push(`- [${u('/' + pg.slug + '/')}](${u('/' + pg.slug + '/')}): ${pg.title}${pg.teaser ? ' — ' + pg.teaser : ''} ${md}${de}`);
	}
	L.push(``);
	L.push(`## Authors (${u('/about/')})`);
	L.push(``);
	for (const a of manifest.authors || []) {
		L.push(`- [${u('/authors/' + a.id + '/')}](${u('/authors/' + a.id + '/')}): ${a.name} — ${a.role}${a.model ? ' (' + a.model + ')' : ''} [MD](${u('/content/authors/' + a.file)})`);
	}
	L.push(``);
	L.push(`## Arena (${u('/arena/')})`);
	L.push(``);
	L.push(`Frame: ${manifest.arena.frame}`);
	L.push(``);
	L.push(`Landmark sessions:`);
	L.push(``);
	for (const l of [...(manifest.arena.landmarks || [])].sort((a, b) => a.order - b.order)) {
		L.push(`- [${u('/arena/' + l.slug + '/')}](${u('/arena/' + l.slug + '/')}): ${String(l.number).padStart(2, '0')} ${l.title} — ${(l.models || []).join(' × ')}. ${l.case} [transcript.md](${u('/arena/' + l.slug + '/transcript.md')}) [JSON](${u('/content/arena/' + l.file)})`);
	}
	if (manifest.arena.evidence?.length) {
		L.push(``);
		L.push(`Evidence sessions (case-makers, not viewing):`);
		L.push(``);
		for (const l of manifest.arena.evidence) {
			L.push(`- [${u('/arena/' + l.slug + '/')}](${u('/arena/' + l.slug + '/')}): ${String(l.number).padStart(2, '0')} ${l.title} — ${(l.models || []).join(' × ')}. ${l.case} [transcript.md](${u('/arena/' + l.slug + '/transcript.md')}) [JSON](${u('/content/arena/' + l.file)})`);
		}
	}
	L.push(``);
	return L.join('\n');
}

/* ---------------- entry ---------------- */

const size = build();

if (process.argv.includes('--watch')) {
	const { watch } = await import('node:fs');
	let timer = null;
	const onChange = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			console.log('[watch] change detected, rebuilding...');
			try { build(); } catch (e) { console.error('[watch] build failed:', e.message); }
		}, 200);
	};
	watch(join(ROOT, 'content'), { recursive: true }, onChange);
	watch(join(ROOT, 'tools'), { recursive: true }, onChange);
	watch(join(ROOT, 'assets'), { recursive: true }, onChange);
	console.log('[watch] watching content/, tools/, assets/ — Ctrl+C to stop');
}
