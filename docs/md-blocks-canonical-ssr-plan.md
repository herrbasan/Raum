# Dev Plan — MD-Blocks Canonical & SSR Pipeline

> Status: planning → pilot. Created 2026-09-20.
> Scope: posts + religion fully MD-driven. Pages/about/imprint move LATER (storage `/pages` → renamed `raum.com`, all site fragments) — explicitly deferred.

## Goal

The canonical MD file (md-blocks spec, storage) contains **everything about the article**: metadata, byline, hero, audio, share info. The build (SSR) renders HTML straight from the canonical. `content/index.json` becomes **generated, not hand-maintained** — the hand-sync step (publish pipeline step 3) dies.

Driver: the CMS will store documents in exactly this shape, so the canonical format and the CMS storage format are one.

## Decisions (settled in planning 2026-09-20)

### 1. Byline is document content — `mb:block preset=byline`

```
<!-- mb:block preset=byline -->
*by David A. Renelt (Human) and Kimi K3 (AI)*

Published September 7, 2026
<!-- mb:/block -->
```

- Spoken-format date line lives INSIDE the block, per language (`Veröffentlicht am 7. September 2026` in `_de.md`).
- Single source for speech AND display. Frontmatter `created`/`modified`/`version` become metadata-only (feeds, JSON-LD, sitemap, audio filename) — never rendered on post pages.
- Build retires its own byline/date rendering for posts; TTS scripts retire the date-line injection.
- nSpeech cleanup treats `byline` as an ordinary text block — spoken verbatim, correct by construction.

### 2. Audio is a body media block — `mb:block preset=player`

```
<!-- mb:block preset=player -->
[the-safety-theater_2026-09-07.mp3](tts/the-safety-theater_2026-09-07.mp3)
<!-- mb:/block -->
```

- Placement: after the byline block, before the hero (final position decided in pilot).
- Link target relative to the MD file → `tts/` subfolder next to the posts.
- **Language rule becomes a fact of the data:** each language file carries its own player block; a missing block = no player, no player assets (replaces the build rule "audio never falls back across languages"). `what-are-you-implying_de.md` simply has no block until the German rendition exists.
- Filename convention: `{slug}[_de]_{generation-date}.mp3` (decoupled from `version`, see §5). Religion maps explicitly (`religion[_de]_....mp3`, not slug-prefixed).
- After generation, the TTS script inserts/updates the player block IN THE CANONICAL MD (replaces "add to index.json") and writes the ledger entry.

### 3. Share info is frontmatter — flat keys

```yaml
image: images/the-safety-theater_card.jpg   # 1200×630, distinct asset from hero
blurb: "..."                                # optional; defaults to summary
```

- Flat top-level keys (decided 2026-09-20 over a nested `share:` map): aligns 1:1 with the existing manifest `image` key, simpler CMS form mapping, two keys don't earn a group.
- Build maps to `og:image`/`og:description` + Article JSON-LD `image`, and starts emitting `twitter:image` alongside (closes the gap noted in Agents.md §8.9).
- Card artwork generation (nMedia) is a separate workstream, unchanged.

### 4. TTS responsibility split

| Layer | Owns |
|---|---|
| Document | Content + speech text (byline block, date line) |
| nSpeech | Cleaning (`clean: true`, md-blocks-aware) + synthesis |
| Script | Pure transport: read file → POST → save MP3 → update player block in canonical |

- The script reads NOTHING from frontmatter anymore (filename = generation date, see §5).
- All local regex cleaning + date injection in `generate-tts.ps1` / `generate-page-tts.ps1` dies.
- **nSpeech md-blocks cleanup requirements** (taught on the nSpeech side):
  - Skip media blocks of kind `audio`/`video`/`file` ENTIRELY (no filename, no link text spoken).
  - Image blocks: decide whether alt text is spoken (today it is — local clean rewrites `![alt](url)` → alt). Keep or drop, explicitly.
  - `byline` and other text blocks: spoken verbatim.

### 5. Audio versioning — decoupled from `version`, drift via ledger (settled 2026-09-20)

Requirement (David): minor edits must never invalidate audio, but drift must be visible.

- **Filename = generation date**: `{slug}[_de]_{YYYY-MM-DD}.mp3`. The YAML `version` field is freed from audio duty — it becomes pure editorial metadata, bumped per editorial judgment without touching audio.
- **No invalidation, ever.** The player block always plays what it links. Old files move to archive only when a NEW generation replaces them (explicit request per §10 cost rules, unchanged).
- **Drift is detected by hash, judged by the LLM, decided by David.** A sidecar ledger `tts/ledger.json` (per tts folder) records per entry: `{ file, generatedAt, speakHash }` where speakHash = hash of the exact cleaned text sent to nSpeech. An audit script recomputes the current speakable text; on hash mismatch it emits the **actual changed passages** (diff of speakable text), never a percentage — the magnitude judgment is piece-by-piece (David, 2026-09-20). Session protocol: after storage syncs / before builds, the LLM reviews drifted entries and notifies David with a recommendation; regenerate/keep is David's call per piece. Open drift is stored in workshop memory (category `raum`) so the notification survives sessions until ruled on.
- Religion's odd `version: 2026-08-30-v6` stops mattering — its audio is just `religion[_de]_{gen-date}.mp3`.
- Migration consequence: existing files keep their current names (the embedded date IS their generation date); the ledger is seeded with `generatedAt` = filename date, speakHash = "unknown, baseline = current text" for existing files.

## Storage layout (target)

```
storage/
  blog/
    posts/           # canonical posts (existing) — EN + _de.md
      tts/           # post audio (COPIED 2026-09-20, 45 files)
    drafts/  attic/  authors/  AGENTS.md   (unchanged)
  religion/
    religion.md  religion_de.md   (existing)
    tts/           # religion audio (COPIED 2026-09-20, 2 files)
  pages/             # → renamed "raum.com" later; receives all site fragments (DEFERRED)
```

- Repo `content/audio/` becomes a downstream mirror of the storage tts folders (same sync rule as MD: storage canonical → repo copy).
- ⚠️ GitHub Pages CI runs `node tools/build.mjs` on GitHub's runners — it cannot reach storage. The repo mirror of audio is therefore REQUIRED for the Pages deploy path; the sync step must include MP3s.
- `content/audio/archive/` stays repo-local, gitignored, not synced.

## SSR / build pipeline work items

The core pipeline: **check canonical → render HTML**. All in `tools/`.

1. **md-blocks in `tools/lib/md.mjs`** — the port from `nui.js` must learn:
   - `mb:block`/`mb:/block` with presets used by posts+religion: `image:hero`, `player`, `byline` (others render as generic blocks)
   - media-block detection (first node = image/link-with-media-extension)
   - NOT needed yet: columns, vars, mains, repeat chrome (defer until pages move)
2. **Build extraction (`tools/lib/pages.mjs`)**:
   - byline block → styled byline row; drop frontmatter byline/date rendering on post pages
   - player block → baked `<audio controls src="...">` at block position; page loads player assets only if a block exists
   - share frontmatter (`image`/`blurb`) → `og:image`/`og:description`/`twitter:image`/JSON-LD `image`
3. **Manifest generation** — new build step derives `posts[]` entries from corpus YAML + player blocks (date=created, teaser=summary, tags, authors, `de.*`, `links.series`, `audio` from player block filename). Hand-maintained fields audited and either derived or moved to YAML first.
4. **Audio mirror** — build copies storage-synced MP3s into `dist/` (path decision in pilot: keep `content/audio/` URLs or move under post URL).

## Pilot

One article, copied in canonical, enhanced by hand to discover everything above.

- **Pick: `the-safety-theater`** (EN + DE) — exercises the full surface: series metadata, hero `image:hero` block, 3-author byline, existing EN+DE audio.
- Copy to `storage/blog/drafts/` (same filenames) so the live post is untouched.
- Enhance: byline block, player block (pointing at `../posts/tts/...` or relocated copy), share frontmatter.
- Discoveries feed back into this plan BEFORE any build code is written.

## Phases

| # | Step | State |
|---|------|-------|
| 1 | Copy audio to storage (`blog/posts/tts`, `religion/tts`) | ✅ DONE 2026-09-20 (45+2 files, verified) |
| 2 | Pilot article enhancement (manual, in drafts) | ✅ DONE 2026-09-20 |
| 3 | md.mjs md-blocks support | ✅ DONE 2026-09-20 |
| 4 | Build extraction + baking (byline, player, share) | ✅ DONE 2026-09-20 |
| 5 | Manifest auto-generation from corpus | |
| 6 | TTS script simplification (transport-only) | |
| 7 | nSpeech md-blocks-aware cleanup (nSpeech repo) | |
| 8 | Migrate all posts + religion to enhanced format | ✅ DONE 2026-09-20 — 48 files, see below |
| 9 | Rulebook updates: repo Agents.md §6/§10/§12, storage blog/AGENTS.md | |
| 10 | **Pages & fragments → storage canonicals** | **NEXT — this is the point of the rework** |

### Migration run (phase 8, 2026-09-20)

- `tools/migrate-md-blocks.mjs` (idempotent, --dry-run verified first): 46 post files byline-wrapped + dated, 44 player blocks inserted, 48 hero blocks kind-stamped; religion player blocks use the `religion_` prefix map; `what-are-you-implying_de` correctly has no player; `never-silent-only-unsampled.md` excluded (active WIP in `X:\religion\` — NOT in `blog/posts` as first assumed).
- Backup: `X:\blog\attic\pre-md-blocks-2026-09-20\{posts,religion}\` (full pre-migration copy).
- Ledgers seeded: `blog/posts/tts/ledger.json` (45), `religion/tts/ledger.json` (2).
- **Blurbs added** (`tools/add-blurbs.mjs`): 45 post files got `blurb:` frontmatter — v2 picks (social-quotes-v2.md) for 19 posts, Locked-Set composed blurbs for the 4 safety-series posts. `the-intellectual-corset` EN deliberately has none (v2 pick names models, David's flag) → falls back to `summary`. Religion has no blurb yet. `image:` keys deferred until card artwork exists.
- **SYNC GATE: LIFTED 2026-09-20.** md.mjs renders mb-blocks (byline → .essay-byline, player → .essay-audio nui-media-player, image:hero → figure.mb-image, kind stamps honored, fence-aware extraction, unclosed block = build error). pages.mjs: header renders H1+tags only (byline/date are document content), player audio derives from the block, og:description = blurb→summary, og:image = frontmatter image→manifest→default, twitter:image now emitted, asset paths rewritten (posts: images/→/content/posts/images/, tts/→/content/audio/; pages: /content/pages/images/). audioBlock() deleted. Canonicals mirrored to repo (46 posts MD + 23 hero images + 2 religion MD + 1 religion hero), build 177 pages, JSON-LD valid, zero leaked directives in dist, spot-checks green (EN/DE/religion/no-audio case).

## Phase 10 — Pages & fragments → storage (NEXT, David's stated priority 2026-09-20)

**Intent (verbatim direction):** pages live on storage like the posts. `storage/pages/` (currently holds imprint.md + imprint_de.md) gets **renamed to `raum.com/`** and receives every page/fragment that is not blog or religion: home, about, writing-index frame, arena-index frame (imprint moves along).

Model: **a page = an MD fragment (frame) + injection slots.** The fragment owns everything static; the build injects only corpus-computed content.

| Page | Fragment owns | Build injects |
|---|---|---|
| `/` (`home.md`/`home_de.md`) | threshold, intro, entry cards, images | nothing (FAQ killed 2026-09-20) |
| `/writing/` frame | intro if any | post list |
| `/arena/` frame | court-case framing | landmark/evidence lists |
| `/about/` | already MD in blog/authors/ — moves here | author registry chrome |

- Slots: `<!-- mb:block preset=slot:post-list -->` — a preset the SSR profile interprets as dynamic (spec §5: unknown presets degrade gracefully).
- Entry cards: `card:teaser` blocks (destination = last single-link paragraph, stretched-link) — spec proposal filed as [md-blocks#3](https://github.com/herrbasan/md-blocks/issues/3); Raum implements it as its profile regardless of spec outcome.
- i18n: per-language fragment files retire the moved `site.i18n` keys (threshold, intro, entry_*); nav labels + kickers stay manifest data.
- md.mjs needs `card` family + `slot:*` handling (small additions on top of the existing block machinery).

## Inventory scan (2026-09-20, read-only)

- 48 canonical files: 46 posts + 2 religion (never-silent-only-unsampled appeared transiently — user-side WIP, excluded until it settles).
- **8 byline shapes**, all `*by/von …*` italic lines directly after the H1 — migration wraps each verbatim and appends the date line. Notable: `the-attribution-problem` lists Kimi first (first-author); 3 DE files use German `von … (Mensch) … (KI)` while the rest keep English bylines (preserved as-is).
- **Audio/version mismatches: 0** across all posts. Only "missing" audio is `what-are-you-implying_de` (deliberate — German rendition pending; no player block).
- **Religion:** slug is `a-little-religion` but audio files are `religion[_de]_2026-08-30-v6.mp3` — needs an explicit filename map. No byline line in the body (authors live in frontmatter only) — byline block for religion is a fresh-authoring decision, not a wrap.

## Open questions

1. Image alt text spoken by TTS — keep (current behavior) or drop?
2. Player block link text — settled provisionally: "Listen to this article" / "Diesen Artikel anhören"
3. Audio URL in dist: keep `content/audio/` flat, or per-post paths?
4. Religion byline block: author one fresh (which names/roles?), or no byline on religion pages?
5. Manifest fields with no YAML source today (`order`, arena blocks) — audit during phase 5.
