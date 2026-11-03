/* md.mjs — Markdown → HTML for the static build.

   Structure (frontmatter, MD-Blocks containers, section breaks) is parsed by
   nui_wc2's shared parser — modules/nui_wc2/parser, spec v1.10 — so the build
   and the browser cannot drift apart on what a document *is*. What stays local
   is the HTML half: a markdown core written for baked pages rather than a DOM
   component, and this site's own preset markup.

   Two deliberate differences from the NUI renderer:
   - fenced code emits <pre><code> (machine-readable, no web component)
   - frontmatter never reaches the body (meta comes from the manifest/builders)

   The submodule is a build-time dependency, not just an asset source: without
   it this module cannot load. The dynamic import says that in one line instead
   of an ERR_MODULE_NOT_FOUND stack. */

const { parse } = await import('../../modules/nui_wc2/parser/md-blocks.mjs').catch(() => {
	throw new Error('md.mjs needs the nui_wc2 submodule: run `git submodule update --init`, then `tools/sync-submodules.ps1` to reach the branch tip.');
});

// List parser. Line-based; handles flat, loose (blank-line-separated) and
// nested lists. Lists never span an existing HTML block or a code token.
function parseLists(text) {
	const lines = text.split('\n');
	const out = [];
	let i = 0;

	const isListItem = (line) => {
		const m = line.match(/^([ \t]*)(-|\*|\d+\.)\s+(.*)$/);
		if (!m) return null;
		return { indent: m[1].replace(/\t/g, '    ').length, ordered: /^\d/.test(m[2]), content: m[3] };
	};

	while (i < lines.length) {
		const item = isListItem(lines[i]);
		if (!item) { out.push(lines[i]); i++; continue; }

		const rootTag = item.ordered ? 'ol' : 'ul';
		const stack = [];
		let html = '';

		const openList = (tag, indent) => {
			html += `<${tag}>`;
			stack.push({ tag, indent, liOpen: false });
		};
		const closeLi = () => {
			const top = stack[stack.length - 1];
			if (top && top.liOpen) { html += '</li>'; top.liOpen = false; }
		};
		const closeList = () => {
			closeLi();
			const top = stack.pop();
			html += `</${top.tag}>`;
		};

		while (i < lines.length) {
			const line = lines[i];
			const trimmed = line.trim();

			if (trimmed === '') {
				let j = i;
				while (j < lines.length && lines[j].trim() === '') j++;
				const next = j < lines.length ? isListItem(lines[j]) : null;
				if (next) { i = j; continue; }
				i = j;
				break;
			}

			const it = isListItem(line);
			if (!it) {
				const indent = line.match(/^[ \t]*/)[0].replace(/\t/g, '    ').length;
				if (stack.length && stack[stack.length - 1].liOpen && indent > stack[stack.length - 1].indent) {
					html += ' ' + trimmed;
					i++;
					continue;
				}
				break;
			}

			if (stack.length === 0) {
				openList(rootTag, it.indent);
			} else if (it.indent > stack[stack.length - 1].indent) {
				openList(it.ordered ? 'ol' : 'ul', it.indent);
			} else {
				while (stack.length > 1 && it.indent < stack[stack.length - 1].indent) closeList();
				if (it.indent < stack[0].indent) break;
				closeLi();
			}

			html += `<li>${it.content}`;
			stack[stack.length - 1].liOpen = true;
			i++;
		}

		while (stack.length) closeList();
		out.push(html + '\n');
	}

	return out.join('\n');
}

const escapeHtml = (s) => String(s)
	.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------------- md-blocks (post profile) ----------------
   Two containers reach the emitters below: `mb:block` (rendered per preset
   family) and `mb:columns`/`mb:col` (a grid of markdown cells).

   This profile has no surfaces. `mb:main`, `mb:section` and `mb:var` arrive in
   the parser tree and are dropped here on purpose — nothing on this site is a
   slide, a deck or a printed sheet, so a marker must not invent one. That is a
   stated choice, not a silent gap. */

const MB_TOKEN = (i) => `\uE200${i}\uE201`;
const MB_DIRECTIVE = /^<!-- mb:/;

// Weights are authored data (spec §4.3) and arrive as a parsed array. Nothing
// reaches here that is not a positive-number array with one entry per column:
// the parser reports those as errors and markdownToHtml throws on them.
const weightTracks = (weights) => (Array.isArray(weights) ? weights.map((n) => `${n}fr`).join(' ') : null);

/* Parser tree → the token stream the emitters consume.

   The stream is the source itself, line for line: the parser says which ranges
   are containers, and every other line is copied verbatim — blank lines, a
   root-level `---`, the authored form of a rule (`***` is not `---`), and the
   adjacency of a rule to the next paragraph. Joining node texts with invented
   separators instead would quietly rewrite the document, and the damage shows
   up far from here: a changed <hr> class, a paragraph that gained a <p>.

   Directive lines that carry nothing for this profile (`mb:main`, `mb:section`,
   `mb:var`) are dropped: nothing on this site is a slide, a deck or a printed
   sheet, so a marker must not invent one. That is a stated choice. */
function flattenDoc(doc, src) {
	const lines = src.split('\n');
	const nodes = [];
	const out = [];

	const push = (node) => {
		nodes.push(node);
		return MB_TOKEN(nodes.length - 1);
	};

	// Tokens are substituted in index order, so a nested node is pushed after the
	// container that owns it: its token then resolves before the container's HTML
	// is inserted.
	const token = (child) => {
		if (child.type === 'block') return push({ kind: 'block', attrs: child.attrs, markdown: child.markdown });
		const flat = { kind: 'columns', attrs: child.attrs, tracks: weightTracks(child.attrs.weights), cols: [] };
		const own = push(flat);
		flat.cols = child.cols.map((col) => ({ attrs: col.attrs, text: splice(col.children).trim() }));
		return own;
	};

	// A column body is a region of the same document, so it is spliced from the
	// same lines — containers inside it become tokens of the one global list.
	const splice = (children) => {
		if (!children.length) return '';
		const byLine = new Map(children.filter((child) => child.type !== 'markdown').map((child) => [child.line, child]));
		const last = children[children.length - 1].endLine;
		const kept = [];
		for (let n = children[0].line; n <= last; n++) {
			const child = byLine.get(n);
			if (child) { kept.push(token(child)); n = child.endLine; continue; }
			kept.push(lines[n - 1]);
		}
		return kept.join('\n');
	};

	const containers = new Map();
	for (const main of doc.mains) {
		for (const section of main.sections) {
			for (const child of section.children) {
				if (child.type !== 'markdown') containers.set(child.line, child);
			}
		}
	}

	const start = doc.frontmatter ? doc.frontmatter.endLine + 1 : 1;
	for (let n = start; n <= lines.length; n++) {
		const child = containers.get(n);
		if (child) { out.push(token(child)); n = child.endLine; continue; }
		if (MB_DIRECTIVE.test(lines[n - 1])) continue;
		out.push(lines[n - 1]);
	}

	return { md: out.join('\n'), nodes };
}

// "card:note" -> { family: "card", modifier: "note" }
const presetParts = (preset) => {
	const [family, modifier] = String(preset || '').split(':');
	return { family, modifier };
};

// A cell is a slice of the document. It is parsed on its own, so a container
// inside a column is found by the same parser as one at root — no depth stack,
// no second implementation.
const cell = (md) => markdownToHtml(md);

/* Media-block detection (spec §4.2): a block whose first node is a single image
   or a flat list of images is a media block, and everything after the media is
   the caption. The authored shape is preserved — a one-item list stays a list.
   Upstream's mbDetectMedia also covers image lists wrapped in links (a video
   poster per item) and flat lists of media links; this site has no such
   document yet, and a block that matches neither shape falls through to the
   generic renderer rather than being half-guessed at. */
const MEDIA_IMG = /^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+["'][^"']*["'])?\s*\)$/;
const MEDIA_ITEM = /^[-*+]\s+!\[([^\]]*)\]\(\s*(\S+?)(?:\s+["'][^"']*["'])?\s*\)$/;

function detectMedia(inner) {
	const lines = inner.split('\n');
	let start = 0;
	while (start < lines.length && !lines[start].trim()) start++;
	const head = (lines[start] || '').trim();
	if (MEDIA_IMG.test(head)) return { isList: false, media: lines.slice(start, start + 1), rest: lines.slice(start + 1) };
	if (MEDIA_ITEM.test(head)) {
		let j = start;
		while (j < lines.length && (!lines[j].trim() || MEDIA_ITEM.test(lines[j].trim()))) j++;
		if (j > start) return { isList: true, media: lines.slice(start, j), rest: lines.slice(j) };
	}
	return null;
}

// Gallery markup, byte-compatible with nui.js mbRenderBlock: the class list and
// its order are upstream's, so CSS written against it survives a later switch
// to the real renderer. A single image keeps the site's own figure.mb-image —
// that is the profile choice every existing hero already bakes, and changing it
// is a deliberate migration, not something a new container should do silently.
//
// The parser's own media verdict (block.mediaClass / mediaForm / kind) is not
// consulted here: this profile's markup is preset-driven, and switching the
// decision to the inferred class would change output for documents that render
// correctly today. The split below answers a different question — where the
// media ends and the caption starts.
function renderMedia(node) {
	const found = detectMedia(node.markdown);
	if (!found) return null;
	const { family, modifier } = presetParts(node.attrs.preset);
	const cls = ['nui-blocks-block', 'nui-blocks-media', 'nui-blocks-image'];
	if (found.isList || family === 'gallery') cls.push('nui-blocks-gallery');
	if (family) cls.push(`nui-preset-${escapeHtml(family)}`);
	if (modifier) cls.push(`nui-variant-${escapeHtml(modifier)}`);
	const mediaHtml = cell(found.media.join('\n'))
		.replace(/<img (?![^>]*\bloading=)/g, '<img loading="lazy" ');
	const caption = found.rest.join('\n').trim();
	const id = node.attrs.id ? ` id="${escapeHtml(node.attrs.id)}"` : '';
	return `<figure class="${cls.join(' ')}"${id}>${mediaHtml}${caption ? `<figcaption>${cell(caption)}</figcaption>` : ''}</figure>`;
}

function renderBlock(node) {
	const inner = node.markdown;
	const { family, modifier } = presetParts(node.attrs.preset);
	if (family === 'image') {
		const m = inner.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			const caption = m[3].trim();
			return `<figure class="mb-image${modifier ? ` mb-${escapeHtml(modifier)}` : ''}"><img src="${escapeHtml(m[2])}" alt="${escapeHtml(m[1])}">${caption ? `<figcaption>${cell(caption)}</figcaption>` : ''}</figure>`;
		}
	}
	if (family === 'player') {
		const m = inner.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			return `<div class="essay-audio"><p class="kicker">${escapeHtml(m[1])}</p><nui-media-player pause-others><audio controls preload="metadata" src="${escapeHtml(m[2])}"></audio></nui-media-player></div>`;
		}
	}
	if (family === 'byline') return `<div class="essay-byline">${cell(inner)}</div>`;
	const media = renderMedia(node);
	if (media) return media;
	const preset = node.attrs.preset || '';
	return `<div class="mb-block"${preset ? ` data-preset="${escapeHtml(preset)}"` : ''}>${cell(inner)}</div>`;
}

// Emits nui_wc2's md-blocks columns markup (nui.js mbRenderColumns): the class
// names, data-cols and the inline grid-template-columns track list all match, so
// styles written against this stay valid if the build ever imports the real
// renderer instead of this port. Weights are validated by the parser, which
// fails the build on an authored structure that cannot render.
function renderColumns(node) {
	const style = node.tracks ? ` style="grid-template-columns:${node.tracks}"` : '';
	const cells = node.cols.map((c) => {
		const { family, modifier } = presetParts(c.attrs.preset);
		const cls = ['nui-blocks-col', family && `nui-preset-${family}`, modifier && `nui-variant-${modifier}`]
			.filter(Boolean).join(' ');
		const id = c.attrs.id ? ` id="${escapeHtml(c.attrs.id)}"` : '';
		return `<div class="${cls}"${id}>${cell(c.text)}</div>`;
	}).join('\n');
	const id = node.attrs.id ? ` id="${escapeHtml(node.attrs.id)}"` : '';
	return `<div class="nui-blocks-columns"${id} data-cols="${node.cols.length}"${style}>${cells}</div>`;
}

const renderNode = (node) => (node.kind === 'columns' ? renderColumns(node) : renderBlock(node));

export function markdownToHtml(md) {
	if (typeof md !== 'string' || !md.trim()) return '';

	// Structure first. The parser never throws — it repairs what the author left
	// open and reports that it did — which is right for an editor and wrong for a
	// publisher: a build must not bake a guessed tree, so its errors throw here.
	const src = md.replace(/\r\n/g, '\n');
	const doc = parse(src);
	const errors = doc.diagnostics.filter((d) => d.severity === 'error');
	if (errors.length) {
		const detail = errors.map((d) => `line ${d.line}: ${d.code} — ${d.message}`).join('\n  ');
		throw new Error(`md-blocks: ${errors.length} error(s)\n  ${detail}`);
	}

	const { md: flat, nodes: mbNodes } = flattenDoc(doc, src);
	let html = flat.trim();
	const codeBlocks = [];
	html = html.replace(/^[ \t]*```(\w+)?\n([\s\S]*?)\n[ \t]*```/gm, (match, lang, code) => {
		const token = `\uE000${codeBlocks.length}\uE001`;
		codeBlocks.push({ token, lang, code });
		return token;
	});
	html = escapeHtml(html);

	const inlineCode = [];
	html = html.replace(/`([^`]+)`/g, (match, code) => {
		const token = `\uE100${inlineCode.length}\uE101`;
		inlineCode.push({ token, code });
		return token;
	});

	// Tables
	html = html.replace(/^[ \t]*\|(.+)\|\n[ \t]*\|([-:| ]+)\|\n((?:[ \t]*\|.+\|\n?)*)/gm, (match, header, sep, body) => {
		const headCells = header.trim().replace(/^\||\|$/g, '').split('|').map(c => `<th>${c.trim()}</th>`).join('');
		const bodyRows = body.trim().split('\n').filter(r => r.trim()).map(row => {
			const cells = row.trim().replace(/^\||\|$/g, '').split('|').map(c => `<td>${c.trim()}</td>`).join('');
			return `<tr>${cells}</tr>`;
		}).join('');
		return `<table class="nui-table"><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
	});

	// Headers
	html = html.replace(/^[ \t]*(#{1,6})\s+(.+)$/gm, (match, hashes, text) => `<h${hashes.length}>${text}</h${hashes.length}>`);

	// Blockquotes
	html = html.replace(/^[ \t]*(&gt;\s+.+(:?\n[ \t]*&gt;\s+.+)*)/gm, (match) => `<blockquote>${match.replace(/^[ \t]*&gt;\s+/gm, '')}</blockquote>`);

	// Lists
	html = parseLists(html);

	// Horizontal rules
	html = html.replace(/^[ \t]*(={3,})[ \t]*$/gm, '<hr class="equals">');
	html = html.replace(/^[ \t]*(-{3,})[ \t]*$/gm, '<hr class="dash">');
	html = html.replace(/^[ \t]*(\*{3,})[ \t]*$/gm, '<hr class="stars">');
	html = html.replace(/^[ \t]*(_{3,})[ \t]*$/gm, '<hr>');

	// Block separation
	// A newline inside a paragraph is a CommonMark SOFT break: it renders as
	// whitespace, not a <br>. Only two-or-more trailing spaces or a trailing
	// backslash force a break. Turning every source newline into <br> meant a
	// hard-wrapped paragraph published with a break at every line ending
	// (issue #1) — the corpus is written wrapped, so it hit every essay.
	const softBreaks = (s) => s
		.replace(/[ \t]{2,}\n/g, '<br>\n')
		.replace(/\\\n/g, '<br>\n')
		.replace(/\n/g, ' ');

	const blocks = html.split(/\n{2,}/);
	const htmlBlocks = blocks.map(block => {
		block = block.trim();
		if (!block) return '';
		if (/^\uE000\d+\uE001$/.test(block)) return block;
		if (/^\uE200\d+\uE201$/.test(block)) return block; // md-blocks token
		if (/^<(h\d|ul|ol|pre|blockquote|table|hr)/i.test(block)) return block;
		return `<p>${softBreaks(block)}</p>`;
	});
	html = htmlBlocks.join('\n');

	// Inline elements
	const safeUrl = (url) => {
		const trimmed = url.trim();
		const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):/i);
		return (scheme && !/^(https?|mailto)$/i.test(scheme[1])) ? null : trimmed;
	};
	html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (m, alt, src) => {
		const url = safeUrl(src);
		return url ? `<img src="${url}" alt="${alt}">` : alt;
	});
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, href) => {
		const url = safeUrl(href);
		return url ? `<a href="${url}">${text}</a>` : text;
	});
	html = html.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
	// `_` may not open or close emphasis intraword (CommonMark), so snake_case
	// names survive. This is not cosmetic: the inline image/link passes above
	// have already emitted real <img src>/<a href> tags, so a permissive `_`
	// rule reaches INSIDE the attribute and rewrites
	// src="images/nui_01_home.webp" to "nui<em>01</em>home.webp" — a silent
	// 404 and a collapsed box. `*` keeps its intraword behaviour.
	html = html.replace(/(\*)(.*?)\1/g, '<em>$2</em>');
	html = html.replace(/(?<![\w_])_(\S(?:[\s\S]*?\S)?)_(?![\w_])/g, '<em>$1</em>');
	html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

	html = codeBlocks.reduce((result, { token, lang, code }) =>
		result.replace(token, `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(code)}</code></pre>`),
		html);
	html = inlineCode.reduce((result, { token, code }) => result.replace(token, `<code>${code}</code>`), html);

	// md-blocks: substitute rendered regions last (they may contain any of the above)
	html = mbNodes.reduce((result, node, i) => result.replace(MB_TOKEN(i), renderNode(node)), html);

	return html;
}
