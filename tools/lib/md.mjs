/* md.mjs — Markdown → HTML for the static build.
   Ported from modules/nui_wc2/NUI/nui.js markdownToHtml (zero deps) so baked
   pages render identically to the old client-side nui-markdown output.
   Differences from the NUI original:
   - fenced code emits <pre><code> (machine-readable, no web component)
   - frontmatter is always stripped (meta comes from the manifest/builders) */

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
   Two containers, both recognized at column 0 outside fenced code: `mb:block`
   (rendered per preset family) and `mb:columns`/`mb:col` (a grid of markdown
   cells). `mb:section`, `mb:var` and `mb:main` describe page surfaces — a
   slideshow, a deck, a printed sheet — and are dropped: this site has no
   surfaces for them. Spec: documentation/md-blocks/md-blocks-spec.md (v1.5),
   §4.3 for the columns contract.

   Nesting is one level by spec (a column holds markdown and blocks, never
   columns), so no depth stack is needed: a cell's text is handed back to
   markdownToHtml, which runs this same extraction over it. */

const MB_TOKEN = (i) => `\uE200${i}\uE201`;

const MB_BLOCK_OPEN = /^<!-- mb:block(?:\s([^>]*?))?\s*-->$/;
const MB_BLOCK_CLOSE = /^<!-- mb:\/block\s*-->$/;
const MB_COLS_OPEN = /^<!-- mb:columns(?:\s([^>]*?))?\s*-->$/;
const MB_COLS_CLOSE = /^<!-- mb:\/columns\s*-->$/;
const MB_COL_OPEN = /^<!-- mb:col(?:\s([^>]*?))?\s*-->$/;
const MB_COL_CLOSE = /^<!-- mb:\/col\s*-->$/;
// Close markers reaching here lost their opener, or were never inside one.
const MB_CONTAINER_DIRECTIVE = /^<!-- mb:\/?(?:block|columns|col)\b/;
const MB_DIRECTIVE = /^<!-- mb:/;

function parseMbAttrs(s) {
	const attrs = {};
	for (const m of String(s || '').matchAll(/([a-z][a-z0-9_-]*)=("[^"]*"|\S+)/g)) {
		attrs[m[1]] = m[2].startsWith('"') ? m[2].slice(1, -1) : m[2];
	}
	return attrs;
}

// "card:note" -> { family: "card", modifier: "note" }
const presetParts = (preset) => {
	const [family, modifier] = String(preset || '').split(':');
	return { family, modifier };
};

// A col marker ends at the next col or at the columns close; `mb:/col` is the
// same boundary written out explicitly. Before the first col, only blank lines
// and ordinary comments may appear (spec §4.3).
function splitCols(inner, openedAt) {
	const cols = [];
	let cur = null;
	for (const line of inner) {
		const open = MB_COL_OPEN.exec(line);
		if (open) { cur = { attrs: parseMbAttrs(open[1]), lines: [] }; cols.push(cur); continue; }
		if (MB_COL_CLOSE.test(line)) { cur = null; continue; }
		if (cur) { cur.lines.push(line); continue; }
		if (line.trim() && !line.trim().startsWith('<!--'))
			throw new Error(`md-blocks: <columns> on line ${openedAt} has "${line.trim()}" before its first <col>`);
	}
	if (cols.length < 2)
		throw new Error(`md-blocks: <columns> on line ${openedAt} declares ${cols.length} col(s); the minimum is 2`);
	return cols;
}

// Weights are authored data, preserved verbatim as an <n>fr track list. Absent
// weights mean equal columns, which is the renderer's default, not a value
// invented here.
function colTracks(attrs, count, openedAt) {
	if (attrs.weights === undefined) return null;
	let w;
	try { w = JSON.parse(attrs.weights); }
	catch { throw new Error(`md-blocks: <columns> on line ${openedAt} has weights=${attrs.weights}, which is not valid JSON`); }
	if (!Array.isArray(w) || w.length !== count)
		throw new Error(`md-blocks: <columns> on line ${openedAt} has weights=${attrs.weights} for ${count} cols — the lengths must match`);
	if (!w.every((n) => typeof n === 'number' && Number.isFinite(n) && n > 0))
		throw new Error(`md-blocks: <columns> on line ${openedAt} needs positive weights, got ${attrs.weights}`);
	return w.map((n) => `${n}fr`).join(' ');
}

function extractMb(md) {
	const lines = md.split('\n');
	const nodes = [];
	const out = [];
	let inFence = false;

	// Fence-aware gather to a close marker: a `---` or an mb: comment inside a
	// fenced run is content, not structure, and must not close a container.
	const gather = (from, closeRe, label, openedAt) => {
		const inner = [];
		let fence = false;
		for (let j = from; j < lines.length; j++) {
			const l = lines[j];
			if (/^[ \t]*```/.test(l)) { fence = !fence; inner.push(l); continue; }
			if (!fence && closeRe.test(l)) return { inner, next: j + 1 };
			inner.push(l);
		}
		throw new Error(`md-blocks: <${label}> on line ${openedAt} is never closed (expected <!-- mb:/${label} -->)`);
	};

	const push = (node) => { nodes.push(node); out.push(MB_TOKEN(nodes.length - 1)); };

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (/^[ \t]*```/.test(line)) { inFence = !inFence; out.push(line); continue; }
		if (inFence || !MB_DIRECTIVE.test(line)) { out.push(line); continue; }

		const blockOpen = MB_BLOCK_OPEN.exec(line);
		if (blockOpen) {
			const { inner, next } = gather(i + 1, MB_BLOCK_CLOSE, 'block', i + 1);
			push({ kind: 'block', attrs: parseMbAttrs(blockOpen[1]), inner: inner.join('\n').trim() });
			i = next - 1;
			continue;
		}

		const colsOpen = MB_COLS_OPEN.exec(line);
		if (colsOpen) {
			const attrs = parseMbAttrs(colsOpen[1]);
			const { inner, next } = gather(i + 1, MB_COLS_CLOSE, 'columns', i + 1);
			const cols = splitCols(inner, i + 1);
			push({ kind: 'columns', attrs, cols, tracks: colTracks(attrs, cols.length, i + 1) });
			i = next - 1;
			continue;
		}

		if (MB_CONTAINER_DIRECTIVE.test(line))
			throw new Error(`md-blocks: line ${i + 1} is "${line.trim()}" with no container open for it`);
		// mb:section / mb:var / mb:main — surfaces this site does not have.
	}
	return { md: out.join('\n'), nodes };
}

// A cell is a slice of the document, so it never carries document-level YAML:
// the frontmatter strip is done once, at the top.
const cell = (md, opts) => markdownToHtml(md, { ...opts, frontmatter: false });

function renderBlock(node, opts) {
	const inner = node.inner;
	const { family, modifier } = presetParts(node.attrs.preset);
	if (family === 'image') {
		const m = inner.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			const caption = m[3].trim();
			return `<figure class="mb-image${modifier ? ` mb-${escapeHtml(modifier)}` : ''}"><img src="${escapeHtml(m[2])}" alt="${escapeHtml(m[1])}">${caption ? `<figcaption>${cell(caption, opts)}</figcaption>` : ''}</figure>`;
		}
	}
	if (family === 'player') {
		const m = inner.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			return `<div class="essay-audio"><p class="kicker">${escapeHtml(m[1])}</p><nui-media-player pause-others><audio controls preload="metadata" src="${escapeHtml(m[2])}"></audio></nui-media-player></div>`;
		}
	}
	if (family === 'byline') return `<div class="essay-byline">${cell(inner, opts)}</div>`;
	const preset = node.attrs.preset || '';
	return `<div class="mb-block"${preset ? ` data-preset="${escapeHtml(preset)}"` : ''}>${cell(inner, opts)}</div>`;
}

// Emits nui_wc2's md-blocks columns markup (nui.js mbRenderColumns): the class
// names, data-cols and the inline grid-template-columns track list all match, so
// styles written against this stay valid if the build ever imports the real
// renderer instead of this port. Deviates from upstream in one place only:
// weights are validated and thrown on, where upstream degrades to equal columns
// — authored structure that cannot render is a build error here, not a warning.
function renderColumns(node, opts) {
	const style = node.tracks ? ` style="grid-template-columns:${node.tracks}"` : '';
	const cells = node.cols.map((c) => {
		const { family, modifier } = presetParts(c.attrs.preset);
		const cls = ['nui-blocks-col', family && `nui-preset-${family}`, modifier && `nui-variant-${modifier}`]
			.filter(Boolean).join(' ');
		const id = c.attrs.id ? ` id="${escapeHtml(c.attrs.id)}"` : '';
		return `<div class="${cls}"${id}>${cell(c.lines.join('\n').trim(), opts)}</div>`;
	}).join('\n');
	const id = node.attrs.id ? ` id="${escapeHtml(node.attrs.id)}"` : '';
	return `<div class="nui-blocks-columns"${id} data-cols="${node.cols.length}"${style}>${cells}</div>`;
}

const renderNode = (node, opts) => (node.kind === 'columns' ? renderColumns(node, opts) : renderBlock(node, opts));

export function markdownToHtml(md, opts = {}) {
	if (typeof md !== 'string' || !md.trim()) return '';

	if (opts.frontmatter !== false) {
		// Strip YAML frontmatter
		md = md.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/, '');
	}

	// md-blocks: lift block/columns regions out before escaping (the directive
	// comments would otherwise become visible text). Fence-aware: an mb: comment
	// inside a fenced run is content and stays literal, per spec.
	const extracted = extractMb(md.replace(/\r\n/g, '\n'));
	const mbNodes = extracted.nodes;
	let html = extracted.md.trim();
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
	html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
	html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

	html = codeBlocks.reduce((result, { token, lang, code }) =>
		result.replace(token, `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(code)}</code></pre>`),
		html);
	html = inlineCode.reduce((result, { token, code }) => result.replace(token, `<code>${code}</code>`), html);

	// md-blocks: substitute rendered regions last (they may contain any of the above)
	html = mbNodes.reduce((result, node, i) => result.replace(MB_TOKEN(i), renderNode(node, opts)), html);

	return html;
}
