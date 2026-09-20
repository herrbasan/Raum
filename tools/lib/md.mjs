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

/* ---------------- md-blocks (partial profile) ----------------
   Recognizes <!-- mb:block ... --> ... <!-- mb:/block --> regions at column 0
   outside fenced code and renders them per preset family. Other mb: directive
   lines (section/columns/var/main) are dropped — this site uses none. Spec:
   documentation/md-blocks/md-blocks-spec.md (v1.5). Blocks never nest, so the
   recursive render of the inner markdown needs no cycle guard. */

const MB_TOKEN = (i) => `\uE200${i}\uE201`;

function parseMbAttrs(s) {
	const attrs = {};
	for (const m of s.matchAll(/([a-z][a-z0-9_-]*)=("[^"]*"|\S+)/g)) {
		attrs[m[1]] = m[2].startsWith('"') ? m[2].slice(1, -1) : m[2];
	}
	return attrs;
}

function extractBlocks(md) {
	const lines = md.split('\n');
	const blocks = [];
	const out = [];
	let inFence = false;
	let cur = null;
	for (const line of lines) {
		if (cur) {
			if (/^<!-- mb:\/block\s*-->$/.test(line)) {
				blocks.push({ attrs: cur.attrs, inner: cur.lines.join('\n').trim() });
				out.push(MB_TOKEN(blocks.length - 1));
				cur = null;
			} else {
				cur.lines.push(line);
			}
			continue;
		}
		if (/^[ \t]*```/.test(line)) { inFence = !inFence; out.push(line); continue; }
		if (!inFence && line.startsWith('<!-- mb:')) {
			const open = line.match(/^<!-- mb:block(\s[^>]*)?-->$/);
			if (open) cur = { attrs: parseMbAttrs(open[1] || ''), lines: [] };
			// any other mb: directive line is dropped
			continue;
		}
		out.push(line);
	}
	if (cur) throw new Error('md-blocks: unclosed block (missing <!-- mb:/block -->)');
	return { md: out.join('\n'), blocks };
}

function renderBlock(attrs, inner) {
	const preset = attrs.preset || '';
	const [family, modifier] = preset.split(':');
	if (family === 'image') {
		const m = inner.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			const caption = m[3].trim();
			return `<figure class="mb-image${modifier ? ` mb-${escapeHtml(modifier)}` : ''}"><img src="${escapeHtml(m[2])}" alt="${escapeHtml(m[1])}">${caption ? `<figcaption>${markdownToHtml(caption)}</figcaption>` : ''}</figure>`;
		}
	}
	if (family === 'player') {
		const m = inner.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*([\s\S]*)$/);
		if (m) {
			return `<div class="essay-audio"><p class="kicker">${escapeHtml(m[1])}</p><nui-media-player pause-others><audio controls preload="metadata" src="${escapeHtml(m[2])}"></audio></nui-media-player></div>`;
		}
	}
	if (family === 'byline') return `<div class="essay-byline">${markdownToHtml(inner)}</div>`;
	return `<div class="mb-block"${preset ? ` data-preset="${escapeHtml(preset)}"` : ''}>${markdownToHtml(inner)}</div>`;
}

export function markdownToHtml(md) {
	if (typeof md !== 'string' || !md.trim()) return '';

	// Strip YAML frontmatter
	md = md.replace(/^---[ \t]*\n[\s\S]*?\n---[ \t]*(?:\n|$)/, '');

	// md-blocks: extract block regions before escaping (directives would
	// otherwise become visible text). Fence-aware: mb: comments inside
	// fenced code stay literal, per spec.
	const extracted = extractBlocks(md.replace(/\r\n/g, '\n'));
	const mbBlocks = extracted.blocks;
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
	const blocks = html.split(/\n{2,}/);
	const htmlBlocks = blocks.map(block => {
		block = block.trim();
		if (!block) return '';
		if (/^\uE000\d+\uE001$/.test(block)) return block;
		if (/^\uE200\d+\uE201$/.test(block)) return block; // md-blocks token
		if (/^<(h\d|ul|ol|pre|blockquote|table|hr)/i.test(block)) return block;
		return `<p>${block.replace(/\n/g, '<br>')}</p>`;
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

	// md-blocks: substitute rendered blocks last (they may contain any of the above)
	html = mbBlocks.reduce((result, b, i) => result.replace(MB_TOKEN(i), renderBlock(b.attrs, b.inner)), html);

	return html;
}
