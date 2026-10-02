/* make-og-cards.mjs — generate crawler-safe JPEG social cards from post heroes.
 *
 * Heroes are WebP: great for the page, but most social scrapers (LinkedIn,
 * WhatsApp, Slack, often Facebook/X) refuse a WebP og:image and drop the image
 * from the preview entirely. So each post gets a JPEG sibling
 * {slug}_og.jpg (1200x630) that the build points og:image / twitter:image /
 * BlogPosting.image at. The hero stays WebP for display.
 *
 * Canonical homes are storage (blog/posts/images, raum.com/images,
 * religion/images), mirrored to the repo — same storage-first rule as the MD
 * (Agents.md §12). A card is mirrored into whichever storage dir already holds
 * its hero; storage is skipped when the X:\ mount is absent (offline).
 *
 * Requires ffmpeg on PATH. Usage:
 *   node tools/make-og-cards.mjs            # only stale/missing cards
 *   node tools/make-og-cards.mjs --force    # regenerate every card
 */
import { readdirSync, existsSync, statSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');

// The build hardcodes these dims for og:image width/height — keep in sync.
const W = 1200, H = 630;

// repo image dir → candidate storage homes for its heroes (all on Badkid).
const GROUPS = [
	{ repo: join(ROOT, 'content/posts/images'), storage: ['X:/blog/posts/images'] },
	{ repo: join(ROOT, 'content/pages/images'), storage: ['X:/raum.com/images', 'X:/religion/images'] },
];

let made = 0, skipped = 0, total = 0;
for (const { repo, storage } of GROUPS) {
	if (!existsSync(repo)) continue;
	for (const hero of readdirSync(repo).filter((f) => f.endsWith('_hero.webp'))) {
		total++;
		const card = hero.replace(/_hero\.webp$/, '_og.jpg');
		const src = join(repo, hero);
		const out = join(repo, card);
		const stale = !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;
		if (!stale && !FORCE) { skipped++; continue; }
		execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
			'-vf', `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`,
			'-q:v', '3', out]);
		// Mirror into whichever storage home already holds this hero.
		for (const dir of storage) {
			if (!existsSync(join(dir, hero))) continue;
			mkdirSync(dir, { recursive: true });
			copyFileSync(out, join(dir, card));
		}
		made++;
		console.log(`  ${card}  (${(statSync(out).size / 1024).toFixed(1)}K)`);
	}
}

console.log(`[og] ${made} card(s) generated, ${skipped} up to date (of ${total} heroes)`);
