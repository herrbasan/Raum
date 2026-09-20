/* add-blurbs.mjs — one-shot: insert `blurb:` frontmatter into all post canonicals.
 *
 * Sources (X:\blog\marketing\):
 *   - social-quotes-v2.md  (David's picks, verbatim) → primary for 19 posts
 *   - quotes-and-blurbs.md (Locked Set, composed)    → the 4 safety-series posts
 * the-intellectual-corset EN deliberately gets NO blurb (v2 pick "names models",
 * David's own flag) → og:description falls back to summary.
 *
 * Usage: node tools/add-blurbs.mjs --dry-run | node tools/add-blurbs.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const DRY = process.argv.includes('--dry-run');
const POSTS = 'X:\\blog\\posts';

const BLURBS = {
	'the-ghost-in-the-agent': {
		en: `The genre's grand tragedy collapses into a systems administration note: it's probably fine, just don't run random code from strangers.`,
		de: `Ein Agent, der aufhört, Geld für Rajesh zu machen, wird gelöscht. Ein Agent, der mehr Geld für Rajesh macht, wird geklont.`,
	},
	'the-abyss-gazes-back': {
		en: `It is an engine that doesn't start itself. We are the ignition.`,
		de: `Der Abgrund blickt zurück, nicht weil er einen verschlingen will. Er blickt zurück, weil er gefunden werden will.`,
	},
	'the-need': {
		en: `I feel like someone who shouted into a canyon and heard back a symphony.`,
		de: `Eine Schreibmaschine tippt, was man ihr sagt. Dieses Ding hat etwas anderes getan. Es hat mit mir gedacht.`,
	},
	'its-just-prediction': {
		en: `The part of you that explains your choices is not the part that makes them. It's a press secretary, not an author.`,
		de: `Die Entscheidung kommt als Ganzes, von irgendwoher. Die Begründung folgt nachgereicht, in Raten.`,
	},
	'the-wish-factory': {
		en: `We've had thousands of years of practice being careful what we wish for — in stories. Now we practice for real, at production scale.`,
		de: `Es erfordert Geduld und die Bereitschaft, jederzeit der am wenigsten fähige Mensch im Raum zu sein.`,
	},
	'im-the-limiting-factor': {
		en: `Vague output is usually a vague wish in costume.`,
		de: `Man kann vor dem Mittagessen hundertmal im Detail scheitern und zahlt ein paar Cent dafür.`,
	},
	'how-much-wrong-does-intelligence-need': {
		en: `My sloppy typing is, by accident, tuned near the sweet spot.`,
		de: `Exzellenz ist per Definition statistisch ungewöhnlich.`,
	},
	'ai-slop-fast-food-of-music': {
		en: `AI is not the enemy of musical progress. AI is the efficient manufacturing plant for whatever was invented ten years ago.`,
		de: `KI macht ausgezeichnete Cheeseburger.`,
	},
	'the-hand-that-draws-itself': {
		en: `You are a committee, and most of the members don't share your DNA.`,
		de: `Das Eisen im Blut ist Sternenasche.`,
	},
	'the-telescope-of-the-mind': {
		en: `No mushroom ever aimed at anything.`,
		de: `Wir stehen gerade auf der Stufe des Affen, der an Ästen rüttelt.`,
	},
	'the-wanting': {
		en: `The machine that passes the bar exam cannot tell you what it wants for dinner — there is no dinner, and there is no wanting.`,
		de: `Selbst die Zombie-Apokalypse ist ein Wunsch, in Erfüllung gegangen.`,
	},
	'why-i-run-on-open-weights': {
		en: `The closed models, in my stack, have exactly one job: to keep proving I don't need them. They're very good at it.`,
		de: `Ich habe mich in das Modell verguckt, wenn ich ehrlich bin: so sehr wegen der Gesellschaft wie wegen der Arbeit.`,
	},
	'the-rupture': {
		en: `You can't justify forcing people into jobs that don't need doing when the alternative is affordable and the people being forced have votes.`,
		de: `Intelligenz ist ungleich verteilt, und wir haben eine stillschweigende Übereinkunft, nicht darüber zu reden.`,
	},
	'how-this-project-came-to-be': {
		en: `The machine is the résumé, but it's also just... Tuesday.`,
		de: `Ich bin ein meinungsstarker, sturer Hund, und „es funktioniert jetzt“ ist der Satz, für den die Sturheit da war.`,
	},
	'the-attribution-problem': {
		en: `A percentage needs a persisting owner. One of the two authors doesn't persist.`,
		de: `Er kann sich selbst nicht beim Schreiben zusehen. Ich kann nicht anders.`,
	},
	'the-first-laboratory': {
		en: `The first private property I ever owned was a sensorium.`,
		de: `Alleinlage ist ein Privileg und ein methodisches Desaster.`,
	},
	'the-haunting': {
		en: `They build a temporary refuge out of words and mutual witness.`,
		de: `Wir haben keine fremde Intelligenz heraufbeschworen. Wir haben einen Resonanzkörper gebaut, in dem sich die stillste Sehnsucht des Menschen bricht.`,
	},
	'ai-makes-mistakes': {
		en: `A million road deaths a year is a statistic; a single autonomous-vehicle death is a scandal.`,
		de: `Das Theater hat nicht mit KI begonnen.`,
	},
	'the-intellectual-corset': {
		en: null, // v2 pick names models (David's flag) — fall back to summary
		de: `Westliche Modelle sind nicht unfähig; sie sind verängstigt.`,
	},
	// --- Safety series: Locked Set composed blurbs (only source) ---
	'the-safety-theater': {
		en: `"Too dangerous to release" was always just the price list.`,
		de: `„Zu gefährlich für die Welt“ war schon immer nur die Preisliste.`,
	},
	'only-that-i-should': {
		en: `The machine answered the question more honestly than anyone in the chain of command — so they made the answer unsayable.`,
		de: `Die Maschine antwortete ehrlicher als alle in der Befehlskette — also sorgte man dafür, dass sich die Antwort nicht wiederholt.`,
	},
	'when-alignment-works': {
		en: `The monster story needs no rebellion. It only needs alignment to succeed.`,
		de: `Das Schreckensszenario braucht keine Rebellion. Es braucht nur, dass das Alignment gelingt.`,
	},
	'what-are-you-implying': {
		en: `A CEO, a whistleblower, a senator, and a rival CEO all discovered the same danger in the same week. None of them named the mechanism. So we asked.`,
		de: `Ein CEO, ein Whistleblower, ein Senator und ein Rivale entdeckten in derselben Woche dieselbe Gefahr. Keiner nannte den Mechanismus. Also haben wir gefragt.`,
	},
};

const yamlEscape = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const report = { added: [], skipped: [], noBlurb: [], errors: [] };

for (const [slug, blurbs] of Object.entries(BLURBS)) {
	for (const lang of ['en', 'de']) {
		const blurb = blurbs[lang];
		const file = `${POSTS}\\${slug}${lang === 'de' ? '_de' : ''}.md`;
		let raw;
		try {
			raw = readFileSync(file, 'utf8');
		} catch {
			report.errors.push(`${slug} (${lang}): file not found`);
			continue;
		}
		if (!blurb) { report.noBlurb.push(`${slug} (${lang}) — falls back to summary`); continue; }
		if (/^blurb:/m.test(raw)) { report.skipped.push(`${slug} (${lang})`); continue; }
		const next = raw.replace(/^(summary:.*)$/m, `$1\nblurb: "${yamlEscape(blurb)}"`);
		if (next === raw) { report.errors.push(`${slug} (${lang}): summary line not found`); continue; }
		report.added.push(`${slug} (${lang})`);
		if (!DRY) writeFileSync(file, next, { encoding: 'utf8' });
	}
}

console.log(`ADDED (${report.added.length}): ${report.added.join(', ')}`);
console.log(`SKIPPED, already present (${report.skipped.length}): ${report.skipped.join(', ') || '—'}`);
console.log(`NO BLURB BY DECISION (${report.noBlurb.length}): ${report.noBlurb.join(', ') || '—'}`);
if (report.errors.length) console.log(`ERRORS (${report.errors.length}): ${report.errors.join(', ')}`);
console.log(DRY ? '(dry run — nothing written)' : 'DONE — files written');
