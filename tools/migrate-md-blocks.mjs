/* migrate-md-blocks.mjs — one-shot corpus migration to the md-blocks canonical shape.
 *
 * Per docs/md-blocks-canonical-ssr-plan.md:
 *   - wraps the italic byline line into `mb:block preset=byline` + spoken date line
 *   - inserts `mb:block preset=player kind=audio` when the audio file exists in tts/
 *   - stamps kind=image on existing image:hero blocks (editor-output parity, spec §6.2)
 *   - seeds tts/ledger.json (generatedAt from filename date; speakHash set on next generation)
 * Idempotent. Leaves frontmatter untouched. Writes LF, UTF-8 no BOM.
 *
 * Usage:
 *   node tools/migrate-md-blocks.mjs --dry-run   (report only)
 *   node tools/migrate-md-blocks.mjs             (write)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DRY = process.argv.includes('--dry-run');

const CORPORA = [
	{ dir: 'X:\\blog\\posts', tts: 'X:\\blog\\posts\\tts' },
	{ dir: 'X:\\religion', tts: 'X:\\religion\\tts' },
];

// Files excluded from migration (active WIP, mid-authoring).
const EXCLUDE = new Set(['never-silent-only-unsampled.md']);

// Audio filename prefix: religion.md's slug is a-little-religion but its audio is religion_*.
const audioPrefixFor = (slug) => (slug === 'a-little-religion' ? 'religion' : slug);

const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

const fmVal = (yaml, key) => {
	const m = yaml.match(new RegExp(`^${key}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm'));
	return m ? m[1] : null;
};

function dateLine(iso, lang) {
	const [y, m, d] = iso.split('-').map(Number);
	if (lang === 'de') return `Veröffentlicht am ${d}. ${MONTHS_DE[m - 1]} ${y}`;
	return `Published ${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

const report = { migrated: [], skipped: [], noAudio: [], errors: [] };
const ledger = {};

for (const { dir, tts } of CORPORA) {
	const audioFiles = new Set(readdirSync(tts).filter((f) => f.endsWith('.mp3')));
	for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
		if (EXCLUDE.has(file)) { report.skipped.push(`${file} (excluded WIP)`); continue; }
		const path = join(dir, file);
		let raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
		const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
		if (!fmMatch) { report.errors.push(`${file}: no frontmatter`); continue; }
		const yaml = fmMatch[1];
		const slug = fmVal(yaml, 'slug');
		const lang = fmVal(yaml, 'lang') || 'en';
		const version = fmVal(yaml, 'version');
		const created = fmVal(yaml, 'created');
		if (!slug || !version || !created) { report.errors.push(`${file}: missing slug/version/created`); continue; }

		const leadWs = raw.slice(fmMatch[0].length).match(/^\n*/)[0];
		let body = raw.slice(fmMatch[0].length + leadWs.length);
		const actions = [];

		// --- 1. byline block ---
		let hasBylineBlock = body.includes('mb:block preset=byline');
		if (!hasBylineBlock) {
			const m = body.match(/^(#\s+[^\n]*\n)(\n*)(\*(?:by|von)\s[^\n]*)\n?/);
			if (m) {
				body = `${m[1]}\n<!-- mb:block preset=byline -->\n${m[3].trim()}\n\n${dateLine(created, lang)}\n<!-- mb:/block -->\n` + body.slice(m[0].length);
				hasBylineBlock = true;
				actions.push('byline wrapped');
			} else {
				actions.push('no byline line');
			}
		}

		// --- 2. player block ---
		const audioName = `${audioPrefixFor(slug)}${lang === 'de' ? '_de' : ''}_${version}.mp3`;
		if (!body.includes('preset=player')) {
			if (audioFiles.has(audioName)) {
				const linkText = lang === 'de' ? 'Diesen Artikel anhören' : 'Listen to this article';
				const playerBlock = `<!-- mb:block preset=player kind=audio -->\n[${linkText}](tts/${audioName})\n<!-- mb:/block -->\n`;
				const next = hasBylineBlock
					? body.replace('<!-- mb:/block -->\n', `<!-- mb:/block -->\n\n${playerBlock}`)
					: body.replace(/^(#\s+[^\n]*\n)/, `$1\n${playerBlock}`);
				if (next !== body) { body = next; actions.push(`player → ${audioName}`); }
				else report.errors.push(`${file}: player insert failed`);
			} else {
				report.noAudio.push(`${file} (${audioName})`);
			}
		}

		// --- 3. stamp kind=image on hero blocks ---
		const heroStamped = body.replace(/<!-- mb:block preset=image:hero(?! kind=)([^>]*)-->/g,
			'<!-- mb:block preset=image:hero kind=image$1-->');
		if (heroStamped !== body) { body = heroStamped; actions.push('hero kind stamped'); }

		if (!actions.length) { report.skipped.push(file); continue; }
		report.migrated.push(`${file}: ${actions.join(', ')}`);
		ledger[`${dir}\\${file}`] = audioFiles.has(audioName)
			? { file: audioName, generatedAt: audioName.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || null, speakHash: null, note: 'baseline: pre-md-blocks; speakHash set on next generation' }
			: null;

		if (!DRY) writeFileSync(path, fmMatch[0] + leadWs + body, { encoding: 'utf8' });
	}
}

// --- ledger seed ---
for (const { tts } of CORPORA) {
	const entries = {};
	for (const [k, v] of Object.entries(ledger)) {
		if (!v || !k.startsWith(tts.replace('\\tts', ''))) continue;
		entries[v.file] = { generatedAt: v.generatedAt, speakHash: v.speakHash, note: v.note };
	}
	const ledgerPath = join(tts, 'ledger.json');
	const content = JSON.stringify({ seeded: '2026-09-20', entries }, null, 2) + '\n';
	if (DRY) {
		console.log(`ledger ${ledgerPath}: ${Object.keys(entries).length} entries`);
	} else {
		writeFileSync(ledgerPath, content, { encoding: 'utf8' });
	}
}

console.log(`\nMIGRATED (${report.migrated.length}):`);
for (const m of report.migrated) console.log('  ' + m);
console.log(`\nSKIPPED, already migrated (${report.skipped.length}):`);
for (const s of report.skipped) console.log('  ' + s);
console.log(`\nNO AUDIO FILE (${report.noAudio.length}):`);
for (const n of report.noAudio) console.log('  ' + n);
if (report.errors.length) {
	console.log(`\nERRORS (${report.errors.length}):`);
	for (const e of report.errors) console.log('  ' + e);
}
console.log(DRY ? '\n(dry run — nothing written)' : '\nDONE — files written');
