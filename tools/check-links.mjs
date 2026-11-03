// Every local href/src in dist/ must resolve to a file that exists.
//   node tools/check-links.mjs
//
// Why this exists: six relative links to .md files sat live for weeks, 404ing,
// because nothing looked. The authoring forms are rewritten by renderMd
// (../posts/{slug}/, ../references/{slug}.md, ../{id}/), and a form it does not
// recognise passes through as a literal relative href - which resolves against
// the page's own directory and dies silently. This is the pass that says so.
//
// Zero deps, reads only dist/, writes nothing. Exit 1 on any unresolved target.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';

const walk = (dir, out = []) => {
	for (const entry of readdirSync(dir).sort()) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) walk(path, out);
		else if (path.endsWith('.html')) out.push(path);
	}
	return out;
};

const exists = (candidates) => candidates.some((c) => {
	try { return statSync(join(DIST, c)).isFile(); } catch { return false; }
});

// A URL path is relative to the page that carries it, not to the site root.
// `..` must be able to empty the stack - a slice like [0..count-2] does not do
// that in every language, and the resulting double segment hides the finding.
const resolve = (pagePath, url) => {
	const clean = url.split(/[?#]/)[0];
	if (!clean) return null;
	if (clean.startsWith('/')) return clean.replace(/^\/+/, '');
	const parts = pagePath.split('/').slice(0, -1);
	for (const segment of clean.split('/')) {
		if (segment === '..') parts.pop();
		else if (segment && segment !== '.') parts.push(segment);
	}
	return parts.join('/');
};

const candidatesFor = (target) => {
	const out = [target || 'index.html'];
	if (!target) return out;
	if (target.endsWith('/')) out.push(target + 'index.html');
	else if (!/\.[a-z0-9]+$/i.test(target)) out.push(target + '/index.html');
	return out;
};

const pages = walk(DIST);
const missing = new Map();

for (const page of pages) {
	const pagePath = relative(DIST, page).split(sep).join('/');
	const html = readFileSync(page, 'utf8');
	const urls = [
		...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
		...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((part) => part.trim().split(/\s+/)[0])),
	];
	for (const url of urls) {
		if (!url || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(url)) continue;
		const target = resolve(pagePath, url);
		if (target === null) continue;
		let decoded;
		try { decoded = decodeURIComponent(target); } catch { decoded = target; }
		if (exists(candidatesFor(decoded))) continue;
		if (!missing.has(decoded)) missing.set(decoded, []);
		const from = missing.get(decoded);
		if (from.length < 3) from.push(pagePath);
	}
}

if (missing.size === 0) {
	console.log(`links: ${pages.length} pages, every local href/src resolves`);
	process.exit(0);
}

console.error(`links: ${missing.size} unresolved target(s) across ${pages.length} pages`);
for (const [target, from] of [...missing].sort()) {
	console.error(`  ${target}`);
	for (const page of from) console.error(`      <- ${page}`);
}
process.exit(1);
