/* Validate JSON-LD blocks + head metadata in built pages. Dev tool, not shipped. */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const files = [];
(function walk(d) {
	for (const e of readdirSync(d)) {
		const abs = join(d, e);
		if (statSync(abs).isDirectory()) walk(abs);
		else if (e === 'index.html') files.push(abs);
	}
})(DIST);

let pages = 0, withLd = 0, withOg = 0, fail = 0;
const typeCounts = {};
for (const f of files) {
	const html = readFileSync(f, 'utf8');
	pages++;
	if (html.includes('property="og:title"')) withOg++;
	const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
	if (!m) { console.log(`NO JSON-LD: ${f}`); fail++; continue; }
	try {
		const g = JSON.parse(m[1]);
		withLd++;
		for (const n of g['@graph']) typeCounts[n['@type']] = (typeCounts[n['@type']] || 0) + 1;
	} catch (e) {
		console.log(`PARSE FAIL: ${f}: ${e.message}`);
		fail++;
	}
}
console.log(`\n${pages} pages, ${withLd} with valid JSON-LD, ${withOg} with OG tags, ${fail} failures`);
console.log('node type counts:', JSON.stringify(typeCounts, null, 1));
