// Snapshot every generated file in dist/ as path+hash, so a later rebuild can be
// diffed to prove that a change touched only what it was supposed to touch.
//   node tools/dist-hashes.mjs --out before.json
//   node tools/dist-hashes.mjs --out after.json
//   node tools/dist-hashes.mjs --diff before.json after.json
//
// The snapshot is written by this script, never by a shell redirect: PowerShell
// `>` is Out-File, which writes UTF-16 in 5.1, and a UTF-16 snapshot read back
// as utf8 turns every path into a non-match — the diff then reports the entire
// site as added. It also self-tests, because that failure mode is silent.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const walk = (d, out = []) => {
	for (const e of readdirSync(d).sort()) {
		const p = join(d, e);
		if (statSync(p).isDirectory()) walk(p, out);
		else out.push(p);
	}
	return out;
};

const files = walk(DIST);
const lines = files.map((p) => {
	const h = createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);
	return `${h}  ${relative(DIST, p).replace(/\\/g, '/')}`;
});

const args = process.argv.slice(2);
const parse = (f) => new Map(readFileSync(f, 'utf8').trim().split('\n')
	.filter(Boolean).map((l) => [l.slice(18), l.slice(0, 16)]));

if (args[0] === '--diff') {
	const a = parse(args[1]);
	const b = parse(args[2]);
	const added = [...b.keys()].filter((k) => !a.has(k));
	const removed = [...a.keys()].filter((k) => !b.has(k));
	const changed = [...b.keys()].filter((k) => a.has(k) && a.get(k) !== b.get(k));
	console.log(`before ${a.size} files, after ${b.size} files`);
	console.log(`ADDED   (${added.length}):`); added.forEach((k) => console.log('  + ' + k));
	console.log(`REMOVED (${removed.length}):`); removed.forEach((k) => console.log('  - ' + k));
	console.log(`CHANGED (${changed.length}):`); changed.forEach((k) => console.log('  ~ ' + k));
} else if (args[0] === '--out') {
	writeFileSync(args[1], lines.join('\n') + '\n', 'utf8');
	console.log(`wrote ${files.length} entries to ${args[1]}`);
} else {
	process.stdout.write(lines.join('\n') + '\n');
}
