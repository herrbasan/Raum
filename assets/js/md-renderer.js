// assets/js/md-renderer.js — markdown → HTML renderer.
// Adapted from nui_wc2's markdownToHtml (modules/nui_wc2/NUI/nui.js, MIT).
// Vendored as a pure function with a pillar extension ("**A.**" blockquotes).
// Supports: headers, bold/italic/strikethrough, links, images,
// flat/loose/nested lists, fenced + inline code, tables, blockquotes,
// horizontal rules — with URL-scheme validation on links/images (blocks
// javascript:, data:, vbscript:). Output is styled by assets/css/site.css.
'use strict';

// Line-based list parser. Handles flat, loose (blank-line-separated) and
// nested lists. Lists never span an existing HTML block (headers, tables,
// etc.) or a code-block token — those always terminate.
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

      // Blank line: loose-list separator — may continue the list
      if (trimmed === '') {
        let j = i;
        while (j < lines.length && lines[j].trim() === '') j++;
        const next = j < lines.length ? isListItem(lines[j]) : null;
        if (next) { i = j; continue; } // skip blanks, keep parsing
        i = j;                          // skip blanks, list ends
        break;
      }

      const it = isListItem(line);
      if (!it) {
        // Non-item line: continuation of current item if deeper-indented,
        // otherwise the list ends here
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
        // Nested list — opens inside the current <li> (do NOT close the li)
        openList(it.ordered ? 'ol' : 'ul', it.indent);
      } else {
        // Same or lower indent: close deeper lists, then this level's <li>
        while (stack.length > 1 && it.indent < stack[stack.length - 1].indent) closeList();
        // Indent dropped below the root list — list is over
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

function markdownToHtml(md) {
  if (typeof md !== 'string' || !md.trim()) return '';

  let html = md.trim().replace(/\r\n/g, '\n');
  const codeBlocks = [];
  html = html.replace(/^[ \t]*```(\w+)?\n([\s\S]*?)\n[ \t]*```/gm, (match, lang, code) => {
    const token = `\uE000${codeBlocks.length}\uE001`;
    codeBlocks.push({ token, lang, code });
    return token;
  });
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Inline code spans -> tokens so emphasis/bold/strike regexes cannot mangle
  // code content. Restored as <code> last, after fenced code blocks.
  const inlineCode = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const token = `\uE100${inlineCode.length}\uE101`;
    inlineCode.push({ token, code });
    return token;
  });

  // Simple tables
  html = html.replace(/^[ \t]*\|(.+)\|\n[ \t]*\|([-:| ]+)\|\n((?:[ \t]*\|.+\|\n?)*)/gm, (match, header, sep, body) => {
    const headCells = header.trim().replace(/^\||\|$/g, '').split('|').map((c) => `<th>${c.trim()}</th>`).join('');
    const bodyRows = body.trim().split('\n').filter((r) => r.trim()).map((row) => {
      const cells = row.trim().replace(/^\||\|$/g, '').split('|').map((c) => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });

  // Headers
  html = html.replace(/^[ \t]*(#{1,6})\s+(.+)$/gm, (match, hashes, text) => `<h${hashes.length}>${text}</h${hashes.length}>`);

  // Blockquotes
  html = html.replace(/^[ \t]*(&gt;\s+.+(:?\n[ \t]*&gt;\s+.+)*)/gm, (match) => `<blockquote>${match.replace(/^[ \t]*&gt;\s+/gm, '')}</blockquote>`);

  // Lists — before block separation so blank lines inside a list do not
  // fragment it into multiple one-item lists.
  html = parseLists(html);

  // Horizontal rules
  html = html.replace(/^[ \t]*(={3,})[ \t]*$/gm, '<hr class="equals">');
  html = html.replace(/^[ \t]*(-{3,})[ \t]*$/gm, '<hr class="dash">');
  html = html.replace(/^[ \t]*(\*{3,})[ \t]*$/gm, '<hr class="stars">');
  html = html.replace(/^[ \t]*(_{3,})[ \t]*$/gm, '<hr>');

  // Block separation
  const blocks = html.split(/\n{2,}/);
  const htmlBlocks = blocks.map((block) => {
    block = block.trim();
    if (!block) return '';
    if (/^\uE000\d+\uE001$/.test(block)) return block;
    if (/^<(h\d|ul|ol|pre|blockquote|table|hr)/i.test(block)) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  });
  html = htmlBlocks.join('\n');

  // Inline elements
  // Scheme-validate URLs: blocks javascript:, data:, vbscript: etc. Relative
  // paths, #anchors, http(s), mailto pass through; dangerous schemes render as
  // plain text.
  const safeUrl = (url) => {
    const trimmed = url.trim();
    const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):/i);
    return scheme && !/^(https?|mailto)$/i.test(scheme[1]) ? null : trimmed;
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

  // Fenced code -> plain <pre><code>, not NUI-specific output.
  html = codeBlocks.reduce((result, { token, lang, code }) => {
    const safeCode = code.replace(/<\/script/gi, '<\\/script');
    return result.replace(token, `<pre><code${lang ? ` class="language-${lang}"` : ''}>${safeCode}</code></pre>`);
  }, html);
  html = inlineCode.reduce((result, { token, code }) => result.replace(token, `<code>${code}</code>`), html);

  // Pillars: blockquotes that open with a bold single letter ("**A.** …")
  // become defined-statement slabs with a letter badge.
  html = html.replace(/<blockquote>\s*<strong>([A-Za-z])\.<\/strong>\s*([\s\S]*?)<\/blockquote>/g, (m, letter, rest) => {
    const paras = rest.trim().split(/\n{2,}/);
    const first = `<p><span class="pillar-letter">${letter}</span> ${paras.shift().replace(/\n/g, ' ')}</p>`;
    const more = paras.map((p) => `<p>${p.replace(/\n/g, ' ')}</p>`).join('');
    return `<blockquote class="pillar" data-letter="${letter}">${first}${more}</blockquote>`;
  });

  return html;
}

// Dual export: CommonJS for Node, window.MD for the browser.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mdToHtml: markdownToHtml };
}
if (typeof window !== 'undefined') {
  window.MD = { mdToHtml: markdownToHtml };
}
