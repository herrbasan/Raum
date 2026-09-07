/* Post-deploy check: fetch live raum.com pages and validate served metadata.
   Usage: node tools/validate-live.mjs */
const BASE = 'https://raum.com';

const pages = [
	['home EN', '/'],
	['home DE', '/de/'],
	['post EN', '/writing/the-rupture/'],
	['post DE', '/de/writing/the-rupture/'],
	['arena session', '/arena/the-ache-is-real/'],
	['author', '/authors/kimi-k3/'],
	['about', '/about/'],
	['religion', '/religion/'],
	['writing', '/writing/'],
	['arena index', '/arena/'],
];

let fail = 0;
const ok = (cond, label, detail = '') => {
	console.log(`${cond ? '  OK ' : 'FAIL'} ${label}${detail ? ' — ' + detail : ''}`);
	if (!cond) fail++;
};

for (const [name, path] of pages) {
	const res = await fetch(BASE + path);
	const html = await res.text();
	console.log(`\n[${name}] ${path} → ${res.status}, ${(html.length / 1024).toFixed(1)} KB`);
	ok(res.status === 200, 'status 200');
	const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
	if (!m) { ok(false, 'JSON-LD present'); continue; }
	try {
		const g = JSON.parse(m[1]);
		const types = g['@graph'].map((n) => n['@type']).flat().join(',');
		ok(true, 'JSON-LD parses', types);
		const website = g['@graph'].find((n) => n['@type'] === 'WebSite');
		ok(!!website?.about?.length, 'WebSite about-entities', (website?.about || []).map((a) => a.name).join(', '));
	} catch (e) { ok(false, 'JSON-LD parses', e.message); }
	const desc = html.match(/<meta name="description" content="([^"]*)"/);
	ok(!!desc, 'meta description', desc ? desc[1].slice(0, 70) + '…' : 'missing');
	const canon = html.match(/<link rel="canonical" href="([^"]*)"/);
	ok(canon?.[1] === BASE + path, 'canonical', canon?.[1]);
}

// sitemap + robots
const sm = await fetch(BASE + '/sitemap.xml');
const smText = await sm.text();
console.log(`\n[sitemap] → ${sm.status}, ${(smText.match(/<url>/g) || []).length} urls`);
ok(sm.status === 200 && smText.includes('<urlset'), 'sitemap valid');
const rb = await fetch(BASE + '/robots.txt');
const rbText = await rb.text();
ok(rb.status === 200 && rbText.includes('Sitemap: https://raum.com/sitemap.xml'), 'robots.txt has Sitemap line');
const llms = await fetch(BASE + '/llms.txt');
ok(llms.status === 200, 'llms.txt served', `${((await llms.text()).length / 1024).toFixed(1)} KB`);

console.log(`\n${fail === 0 ? 'ALL CHECKS PASSED' : fail + ' FAILURES'}`);
process.exit(fail ? 1 : 0);
