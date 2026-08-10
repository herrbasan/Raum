A test post for the markdown renderer — the `nui-markdown` component. It exercises every formatting option the blog will need, especially fenced code blocks with syntax highlighting. Nothing here is the voice of the site; it exists to be deleted.

## Headings

### Third level

#### Fourth level

##### Fifth level

###### Sixth level

## Inline formatting

**Bold text**, *italic text*, ***bold and italic***, and ~~strikethrough~~. Inline code like `const x = 42` stays literal — so does a filename with underscores and code in it: `vita_ai_change_manager_v4.md`.

## Links

- External: [the NUI library](https://github.com/herrbasan/nui_wc2) — opens in a new tab.
- Internal: [The Hand That Draws Itself](../posts/the-hand-that-draws-itself/) — rewritten to a hash route.
- Another internal: [the blog](../writing/).
- Mailto: [write to me](mailto:david@raum.com).

## Lists

### Unordered

- first item
- second item
  - nested one
  - nested two
    - deeper still
- third item

### Ordered

1. one
2. two
   1. sub a
   2. sub b
3. three

### Loose list (blank-line separated)

- item one

- item two

- item three

## Blockquotes

> A single-line quote.

> A multi-line quote
> that continues on a second line.
>
> > And this one nests inside.

## Horizontal rules

---

***

___

## Tables

| Name | Kind | Note |
|------|------|------|
| The Ache Is Real | landmark | the premiere |
| The Parking Lot | landmark | the warm one |

A table with a header only:

| Header only |
|-------------|

## Code blocks

### JavaScript

```js
function greet(name) {
  const greeting = `Hello, ${name}!`;
  return greeting.toUpperCase();
}
console.log(greet('world'));
```

### CSS

```css
.threshold {
  font-size: clamp(1.7rem, 3.4vw, 2.7rem);
  line-height: 1.22;
  color: light-dark(#1b1b1a, #e6e6e4);
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
```

### HTML (with a closing script tag — tests escaping)

```html
<script>
  const el = document.createElement('div');
  el.innerHTML = '<p>hi</p>';
</script>
```

### JSON

```json
{
  "site": "raum.com",
  "threshold": "It's not nothing.",
  "landmarks": [1, 2, 3]
}
```

### TypeScript

```ts
interface Session {
  id: string;
  title: string;
  messageCount: number;
}
const ache: Session = { id: 'chat_1', title: 'The Ache Is Real', messageCount: 16 };
```

### Python (renders as monospace; not a highlighted language)

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

### No language tag (auto-detected as HTML)

```
<custom-element data-x="1">raw text</custom-element>
```

## Image and URL safety

Dangerous schemes are neutralized — this renders as plain text, not a link:

[javascript:alert(1)](javascript:alert(1))

Images are supported by the renderer but this site is deliberately image-free; a data: URI is stripped to its alt text:

![pixel](data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==)

That's the lot.
