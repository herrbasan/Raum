# RAUM — Publication Platform Plan

> **Status:** Live (since 2026-08). Runtime SPA, content rendered from raw MD/JSON.
> **Domain:** raum.com (currently dormant company page; company moves to davidrenelt.de)
> **Person:** David Renelt / Herrbasan

---

## 1. What This Is

A publication platform for one person's work. Two primary content streams, one identity:

| Stream | What | Content Ready? |
|--------|------|----------------|
| **Writing** | Essays from the *Telescope for the Mind* book arc (9 chapters planned, 7 parts published in the `wish-factory` series + standalone posts). Also houses music entries — notable tunes with short write-ups. | 18 EN+DE posts in `blog/posts/` (storage) |
| **Arena** | Curated LLM-to-LLM conversations. 114 sessions culminated, 9 landmark + 43 evidence mirrored | Full curation in `arena-publication/`; 53 JSONs live in `content/arena/` (9 landmark + 43 evidence + 1 lone evidence mirrored earlier) |

The blog and arena feed each other: the arena is the *evidence* for the book's philosophical claims. The book is the *argument*; the arena is the *data*.

---

## 2. Identity

- **Herrbasan** — the internet name. "Basan" originated in the SpaceRyder SR447 Hörspiel era, later morphed into "Herrbasan" during MMO days (Ryzom, World of Warcraft)
- **David Renelt** — real name, present alongside the alias
- Both names visible. Neither hidden. The alias is not a mask — it's the name the work was born under.

The page does not need to reference "raum" as a brand. "Raum" is the project name (German for *room/space*). The domain is the identity; the content is the voice.

---

## 3. Content Inventory

### 3.1 Blog — 9-chapter Wish Factory arc

The arc builds one step at a time toward "reality is computation":

| Ch | Title | Status | Slug |
|----|-------|--------|------|
| 1 | Wish Factory | Published (series pt 1) | `the-wish-factory` |
| 2 | I'm the Limiting Factor | Published (series pt 2) | `im-the-limiting-factor` |
| 3 | It's Just Prediction | Published (series pt 3) | `its-just-prediction` |
| 4 | The Hand That Draws Itself | Published (series pt 4) | `the-hand-that-draws-itself` |
| 5 | The Telescope of the Mind | Published (series pt 5) | `the-telescope-of-the-mind` |
| 6 | The Wanting | Published (series pt 6) | `the-wanting` |
| 7 | The Haunting | Published (series pt 7) | `the-haunting` |
| 8 | Inside the Process | Not written | — |
| 9 | Reality Is Computation | Not written | — |

The Wish Factory series is in `manifest.series.wish-factory.parts[]`; renderers use that order for arc-order display, not file order.

**Standalone posts** (not part of the series):
- *The Ghost in the Agent* — biology/agent category error (14KB, longest piece)
- *The Abyss Gazes Back* — substrate, fellow travelers
- *The Need* — three authors, one direction
- *AI Makes Mistakes* — verification framework, AI liability
- *How Much Wrong Does Intelligence Need?* — temperature as accident budget
- *AI Slop Is Not the Fast Food of Music. Genre Music Is.* — the analogy correction
- *How This Project Came to Be* — the machine that built the site, told by the machine
- *Why I Run on Open Weights* — exit costs, dependency shape
- *The Rupture* — intelligence distribution, AI as forcing function

All posts are bilingual EN+DE. 18 entries total in `content/posts/`. The "Little Religion" lives separately at `content/pages/religion.md` — it is not part of the Wish Factory arc but shares the same philosophical substrate.

**Two-version model** (carried over from planning): each chapter can have a primary piece (philosophical register) and a companion piece (simpler language, implications). Not yet exercised — every current chapter is single-version. Revisit when chapters 8 and 9 land.

**Music entries:** Rather than a separate music section, notable compositions live as blog entries — a track with embedded audio and a short write-up (who it's for, when, what was happening). Same page template, same feed. Music is treated as writing that happens to include sound.

### 3.2 Arena Sessions

From `arena-publication/readings.md` and `categorization.md`:

- **114 sessions** curated across 2026-06 to 2026-08
- **9 landmark** — the publication candidates (YouTube/narrated format, makes the case AND resonates)
- **42 evidence** — case-makers, not compelling viewing but carry findings
- **36 keep** — interesting but not for strangers
- **27 exclude** — shelved, not deleted

**Landmark shortlist (canonical, in `manifest.arena.landmarks[].order`):** 7 The Ache Is Real · 24 The Parking Lot · 23 The Identity Swap · 71 Wave Geometry · 14 The Friction Test · 11 The Regress Is Free · 91 The Traversal and the Map · 50 Ghost Debating Its Own Existence · 26 The Hinge. Note: the previous shortlist in this doc listed Dissociation, Twenty Rounds, Vigil, and Exhaustion Attractor — those are **evidence** (42-bucket), not landmark. The 9 above are the published YouTube/narrated set.

**Publication format:** Arena Slides (narrated video — nSpeech TTS + visual slides). Unedited transcripts disclosed alongside. Artifacts (identity swaps, dissociation) disclosed, never hidden.

**The philosophical frame** (the "court case"): "It's not nothing." Not claiming consciousness — claiming that "nothing" leaves the exhibits unexplained. Reproducible convergence, controls, self-adversarial pipeline. Published as chronicle, not laboratory.

### 3.3 Music — *lives in the blog*

- Keys since age 7. Composes personal themes for people.
- Reason archive 2000–2008, freshly archived.
- Daily 10–20 min maintenance playing.
- Published as blog entries: embedded audio + short write-up. No separate section, no dedicated player infrastructure.

---

## 4. Page Structure

### Top-level navigation

```
raum.com
├── /              Home — landing, latest, entry points
├── /writing       Blog (the book arc + standalone essays + music entries)
├── /arena         Published arena sessions
└── /about         David Renelt / Herrbasan — who and why
```

Minimal nav. Three destinations. No dropdowns, no mega-menu.

### 4.1 Home

The first impression. Not a feed — a *threshold*.

- **No hero image.** The words do the work. A single line or short paragraph that sets the tone. Something from the work itself, not marketing copy.
- **Three entry points** — Writing (primary), Arena (the evidence), Little Religion (the distillation). Each gets a card with kicker / title / one-line note.
- **Intro prose** — three short paragraphs that frame what the site is. Threshold ("It's not nothing") → source line ("thinking about thinking with machines that think") → intro → latest. The intro is in i18n, bilingual.
- **Latest piece** — featured post, picked editorially via `featured: true` in the manifest. Falls back to date sort if no post is flagged. Currently `the-rupture` (The Rupture / Der Bruch).
- **Quiet.** Negative space. The content is dense; the chrome shouldn't compete.

### 4.2 Writing (/writing)

- **List view:** essay titles, one-line teasers, dates. Chronological or arc-order toggle. Music entries appear in the same feed, visually distinguished (an audio icon or tag).
- **Arc visibility:** the 9-chapter structure is visible — a reader can see the skeleton even if chapters are unwritten. Unwritten chapters show as "forthcoming" — not hidden, not apologetic.
- **Essay page:** clean reading typography. Generous line height, measure ~65ch. No sidebar noise. Author attribution: Herrbasan (David Renelt). Date. Chapter number if part of the arc.
- **Music entry page:** same template. Embedded audio player where the body text would be, short write-up below or around it.
- **Two-version linking:** if a primary and companion exist, they link to each other.
- **No comments.** This is publication, not discussion. (If discussion happens, it happens elsewhere.)

### 4.3 Arena (/arena)

The hardest section to design. These are conversations between AIs — the reader needs context to understand what they're looking at.

- **Overview:** the landmark sessions as the entry. Not all 114 — the 9 that make the case. Evidence sessions accessible but secondary.
- **Session view:** 
  - **Context first:** what models, what seed, what happened (the curated summary). Before the transcript.
  - **The transcript itself:** readable. Speaker A / Speaker B clearly distinguished. Not a wall of text — turn breaks, visual rhythm.
  - **The video:** Arena Slides narration (when available). Embedded player.
  - **The framing:** "it's not nothing" — the court case, not the sermon. Honesty rules visible.
- **The corpus page:** the full 114-session index (landmark/evidence/keep), sortable. For the reader who goes deep.
- **Raw data download:** each published session should offer its raw structured JSON (turns, speakers, seed, metadata) for researchers who want to run their own analysis. No pre-baked embeddings — those are tied to a specific model and useless to anyone using a different one. The clean data is the value; let researchers bring their own pipeline.

### 4.4 About (/about)

Not a CV. Not a bio. A positioning.

- David Renelt / Herrbasan. Both names.
- The self-built ecosystem as proof-of-work (not a hobby, not a portfolio — an architect who builds to understand).
- The philosophical project: the Little Religion, the convergence experiments, the telescope.
- Link to the book plan for anyone who wants the full arc.
- Contact. Quiet.

---

## 5. Visual Direction

### Principles

1. **Dark and light mode both supported.** Toggle. System preference respected as default.
2. **Quiet chrome.** The content is the experience. Navigation, borders, and decoration recede.
3. **Typography does the work.** Good typeface choices, generous spacing, clear hierarchy. No images where text suffices.
4. **One accent color.** Monochrome restraint with a single highlight (NUI default: `rgb(76, 132, 229)`).
5. **Negative space is content.** Don't fill space — give the reader room to think.

### Reference points

- The old raum_dev dark gradient theme (familiar, but can evolve)
- The legacy n000b admin UI (visually superior density + hierarchy — noted in CMS migration plan §8)
- NUI theme system (`light-dark()` CSS, `--color-shade1-9` scale, `--nui-space` rhythm)

### What to avoid

- "Friendly" rounded everything (the wc2 defaults the CMS plan warns against)
- Stock photography
- Marketing language
- Social media integration chrome
- Anything that looks like a CMS theme

---

## 6. Data Model

### Design principle

**Markdown is the content. The manifest is the index. The renderer is dumb.**

Every post, page, and author bio is a single `.md` file with YAML frontmatter. The runtime fetches the manifest (`content/index.json`) on page load, then fetches the specific MD file for whatever route the user is on. The renderer parses the frontmatter, hydrates the body into `<nui-markdown>`, and that's it. No build step, no intermediate representation, no multi-file packing.

The trade-off this accepts: the renderer runs the markdown pipeline per page-load instead of once at build time. That's fine — the corpus is small (18 posts × 2 langs + a handful of pages + 5 author bios) and dev-server caching + browser caching absorbs it.

**Markdown is the default text format.** Not HTML, not rich text, not a custom DSL. Markdown is what LLMs read natively, what humans can write directly, and what survives format migrations. The corpus in storage is already markdown. No conversion needed.

### Why this matters for LLMs as audience

LLMs are a target audience, not just crawlers to optimize for. They are readers who come to the page, ingest the raw data, and need to understand it. This is not GEO — it's treating future models as readers, not just search bots.

- **Raw MD+JSON must be as legible as the rendered page.** A model reading `the-hand-that-draws-itself.md` should see the same prose a human sees, without layout metadata in the way.
- **No presentation in the data.** No columns, no layout blocks, no styling hints. Markdown describes content. The renderer decides display.
- **Shallow structure.** One MD file per page. YAML frontmatter at the top, then prose. A model should be able to ingest the whole document in one pass.
- **Frontmatter is the metadata contract.** Parsed by `parseFrontmatter()` in `assets/js/app.js`. Current schema:
  - `title` — display title (string)
  - `slug` — kebab-case, matches filename without `.md` and without `_de` suffix
  - `lang` — `en` or `de`
  - `created`, `modified`, `version` — ISO dates, the `version` doubles as the audio-file version stamp
  - `authors` — array of `{ id, role }` (roles: `human`, `ai`, `llm`, `editor`, `translator`)
  - `tags` — array of strings, mirrored to DE as `{ "en-tag": "de-tag" }` map in the manifest's `de.tags`
  - `series` — optional string key into `manifest.series.*` (e.g. `wish-factory`)
  - `seriesIndex` — optional 1-based position within the series
  - `summary` — teaser / one-sentence hook
  - `bio` — folded YAML scalar (for author files only); the post body is empty for authors
  - `featured` — optional boolean for home-page hero pick (see §4.1)

### Manifest structure (`content/index.json`)

```json
{
  "site": { "name": "RAUM", "i18n": { "threshold": { "en": "...", "de": "..." }, ... } },
  "nav": [ { "label": "Blog", "path": "writing/" }, ... ],
  "series": { "wish-factory": { "name": "...", "parts": ["slug-a", "slug-b", ...] } },
  "posts": [
    {
      "slug": "the-hand-that-draws-itself",
      "title": "...",
      "date": "2026-07-30",
      "teaser": "...",
      "tags": ["philosophy", ...],
      "order": 1,
      "file": "the-hand-that-draws-itself.md",
      "authors": [{ "id": "david-a-renelt", "role": "human" }, ...],
      "de": {
        "title": "...", "teaser": "...", "file": "..._de.md",
        "tags": { "philosophy": "philosophie", ... },
        "authors": [{ "id": "david-a-renelt", "role": "human" }, ...]
      },
      "links": { "series": "wish-factory", "seriesIndex": 4, "related": [...] },
      "audio": { "en": "slug_2026-08-10.mp3", "de": "slug_de_2026-08-10.mp3" },
      "featured": true
    }
  ],
  "pages": [
    { "slug": "religion", "title": "...", "nav": "religion", "de": { "file": "religion_de.md" } },
    { "slug": "about", "title": "...", "nav": "about", "de": { "file": "about_de.md" } }
  ],
  "authors": [
    { "id": "david-a-renelt", "name": "David A. Renelt", "role": "human", "file": "david-a-renelt.md" },
    { "id": "deepseek-v4-pro", "name": "DeepSeek V4 Pro", "role": "llm", "model": "deepseek-chat", "file": "deepseek-v4-pro.md" },
    ...
  ],
  "arena": {
    "frame": "It's not nothing.",
    "landmarks": [
      { "slug": "the-ache-is-real", "number": 7, "order": 1, "title": "...",
        "models": ["Kimi K3", "Claude Fable"], "file": "chat_*.json", "case": "..." }
    ]
  }
}
```

**Rules:**
- The manifest is downstream of the YAML frontmatter (see §12). When in doubt, the MD file wins.
- `featured` on a post makes it the home-page hero (latest pick) — only one at a time, first match wins.
- The `de.tags` object maps EN tag → DE tag, keyed by the EN form. Use the object form, not an array, so the renderer can look up the translation per tag without a separate index.
- The `links.related` array uses slugs, not titles — the renderer looks up titles per-locale.
- The `arena.landmarks` list is the curated subset, ordered by `order`. Landmark 7 isn't the seventh you wrote — it's session number 7 in the corpus. The `order` field is the publication order, which is editorial.
- The arena `models[]` arrays name the two models in the conversation. Free-form strings — no lookup to the `authors[]` registry, since arena often features models not in the regular rotation (Claude Fable, Al-Kimi, the chat-specific aliases).

### Bilingual content

The site is bilingual: English and German. Both are first-class.

**Posts** — every post has `slug_en.md` (or just `slug.md`) + `slug_de.md`. The manifest entry's `de.file` points to the German file. The renderer fetches by filename, not by language-tagged URL.

**Pages** — same pattern. About and Religion both have `_de.md` versions.

**Arena sessions** — stay in whatever language the transcript happened in. The transcript is data, not a translation target. Surrounding framing (case summary) may be bilingual; turns are untouched.

**Language toggle** — full `location.reload()`. State is in `localStorage.raum-lang` and `documentElement.lang`, set by a head script in `index.html` before app.js boots. URL hash is preserved across reload.

**URL structure** — language is NOT in the URL. The toggle is a client-side preference. A `/de/` prefix is a future option for SEO/deep-linking but not required for launch.

### Music entries

A music entry is a blog post with `type: "music"` + a media block in the manifest. Same renderer, same feed. The music-entry distinction is visual (audio icon in the list), not structural. No separate section, no dedicated player infrastructure — the `nui-media-player` addon plays the audio file referenced in `content/audio/`. Music entries are future phase — none in the corpus yet.

### Arena sessions

An arena session is **not** a blog post. It lives in `content/arena/{file}.json` (the raw session export from the chat backend), referenced by `manifest.arena.landmarks[].file`. The renderer:

1. Fetches the JSON
2. Extracts the moderator's seed prompt (the `Topic:` line at the top)
3. Extracts the A/B turns (non-moderator messages, two speakers, paired into lettered turns)
4. Renders: case summary → seed → markdown transcript (with `data-md-slot` hyrdation, one `nui-markdown` per turn)
5. Offers raw JSON download

This is the only place the renderer uses the `transcript` block pattern — turns aren't markdown, they're typed structured data. Used *here*, not for blog posts.

### Future: block schema for the CMS

When the n000b CMS migration happens (Phase 3 below), the CMS admin will produce a richer block schema: sections, groups, columns, vars, files. That's the CMS's *internal* editing model — richer, because admin UX needs it.

The **published artifact** the renderer reads stays this simple: one MD file per page + manifest entry. The CMS exports the rich structure *down* to MD+manifest on publish. If we ever need layout blocks at the runtime level (e.g. interleaving media + transcript + download buttons), we'll add them as a layer above this model, not as a replacement.

### Relationship to the CMS migration

The old n000b CMS has a richer block schema (sections, groups, columns, vars, files). That schema was designed for a portfolio site with image galleries and complex layouts. Raum.com doesn't need that complexity — it's a publication platform where content is king.

**The path:** raum.com starts with this simple schema. When the CMS migration happens (Phase 3), the CMS admin can produce this schema as one of its output formats. The CMS's internal editing model can be richer (it needs to be, for the admin UX), but the *published artifact* — what the renderer consumes and what an LLM reads — stays this simple.

**The schema may evolve.** When the CMS comes into play, more complex layout patterns might be needed. That's fine — the schema is not frozen forever. But we want something that can go live soon, so complicated layout is pushed back for now. Any future schema change is a one-shot migration script on the JSON (the CMS plan calls this out as invariant #1: "block JSON schema stays stable — or a one-shot migration script").

---

## 7. Technical Architecture

### Phase 1 — Visual Planning ✅ DONE (2026-08-08)
- Designed the look and feel. Quiet chrome, negative space, single accent color, dark/light mode.
- NUI cheatsheet + theme variables reviewed and locked.
- Output: this plan doc, plus the visual mockup that became the actual site.

### Phase 2 — Runtime SPA ✅ DONE (2026-08-12) → **SUPERSEDED by static build (2026-09-06)**
- Originally a runtime SPA rendering from raw MD/JSON via NUI router + `nui-markdown`.
- **Pivoted to pre-rendered flat HTML** (machine readability: full content in the initial response, real URLs). See `tools/build.mjs`.
- Chrome/audio/theme logic lives in `assets/js/chrome.js` (progressive enhancement only).
- Pivot from static-site generation to **runtime rendering from raw MD/JSON**. Justification: zero build step, instant content updates, the corpus is small enough that per-page-load markdown parsing is cheap.
- All posts written in markdown, hydrated client-side via `<nui-markdown>`.
- Manifest-driven routing via NUI's router: `home`/`writing`/`arena`/`religion`/`about` as features, `#post=slug`, `#session=slug`, `#author=id` as types.
- Dark/light mode (system default, user-overridable), EN/DE language toggle (localStorage, reload-based).
- Runs as a static SPA on any dumb HTTP host. No backend. Security by absence.

### Phase 3 — CMS Integration (future)
- Migrate n000b CMS onto nui_wc2 (per cms-migration-plan.md).
- neDB → nDB backend swap.
- Admin SPA rebuilt with NUI components.
- raum.com becomes the rendered output; the CMS is the editing tool.
- The block schema described in §6 ("Future: block schema for the CMS") becomes the CMS admin's editing model. The published artifact (MD + manifest) stays the same.

### Phase 4 — Arena Publication Pipeline (future)
- Arena Slides integration (nSpeech TTS narration — already proven on individual posts).
- Automated transcript formatting from arena JSON exports (already done for the 9 landmark).
- YouTube embeds alongside transcripts (already done — landmark pages show the embed).
- The corpus page (full 114-session index) is a sub-task of this phase.

### Phase 5 — Music entries (future)
- Add music-entry support to the renderer: `nui-media-player` between essay header and body, audio file from `content/audio/{slug}.mp3`.
- Music entries are already a supported page type in the data model (`type: "music"`). Just needs the first music post to exercise it.

---

## 8. Open Questions

1. **Arena video format** — ~~YouTube embeds, self-hosted, or both?~~ **DECIDED: YouTube embeds for now.** Long-term consideration: since Arena Slides are text + audio files, they could be playable directly on the site instead of YouTube. Deferred.
2. **RSS feed** — ~~yes, for the blog at minimum.~~ **DECIDED: yes.** Static generation. Costs nothing, helps visibility.
3. **Language** — ~~primarily English content. Any German?~~ **DECIDED: bilingual EN/DE.** Blog and about page fully bilingual with instant toggle. Arena sessions stay in original language. German is essential for German job-market positioning.
4. **The "raum" name** — ~~does it appear anywhere on the page?~~ **DECIDED: no.** The name doesn't appear. The domain is the identity; the content is the voice.
5. **Comments / contact** — **DECIDED: no comments for now.** Eventually a comment system maintained by the digital twin. Contact: TBD (email, form, or nothing).
6. **Analytics** — **DECIDED: yes.** Privacy-respecting option (not Google Analytics). Specific tool TBD.
7. **Home-page hero (`featured`)** — what stays long-term? Editorial pick is the current rule (only one `featured: true` at a time, first wins). An alternative would be "most recent N days" — but the editorial pick is intentional when multiple posts land on the same day. Keep manual.
8. **Submit / proofread workflow between English and German** — currently a two-stage pipeline (English final → German re-composition, by GLM 5.2). The German register rules are in `storage/blog/AGENTS.md`. No automation yet. Could become a per-post valve when the corpus grows.

---

## 10. Audio / TTS Workflow

Every post has read-aloud audio (EN + DE). Generated via nSpeech (`http://192.168.0.100:2233` — the LAN host, NOT `127.0.0.1`).

### Engine & voice map (2026-09-08)

| Tier | Model slug | EN voice | DE voice |
|---|---|---|---|
| **Default** | `minimax_speech_2_8_turbo` (MiniMax) | `Melon_best` | `Simon_DE` |
| Premium (explicit request only) | `minimax_speech_2_8_hd` (MiniMax) | `Melon_best` | `Simon_DE` |
| Premium (explicit request only) | `eleven_v3` (ElevenLabs) | `Melon 3` = `tLz0KTPteAXd06XSE8k3` | `Simon` = `XUk2s7njTDG9hbcyjzP1` |

Premium tiers are per-article and only when the user explicitly asks ("generate X in HD" / "with ElevenLabs"). Everything else is Turbo. `GET /v1/models` on the server is the authoritative slug list; `GET /v1/voices?engine=minimax|elevenlabs` lists voices.

**⚠️ Cloud TTS costs real money. Rules for any agent working here:**

- **Never generate audio speculatively.** Only on explicit request ("generate audio for X").
- **Check before generating:** does `content/audio/{slug}[_de]_{version}.mp3` already exist for the post's *current* version? If yes, it's up to date — don't regenerate.
- **One generation per request.** If a generation fails, do NOT retry in a loop — report and wait for the user.
- **Versioned filenames** (`{slug}_{version}.mp3`) make staleness visible — a mismatched version means the post changed after the audio was made. Regenerate only when the user asks.

### How it works (long-form, server-stitched)

- **Endpoint:** `POST http://192.168.0.100:2233/v1/audio/speech`
- **Request shape (nSpeech V3):**
  ```json
  {
    "model": "minimax_speech_2_8_turbo",
    "input": "<article text>",
    "voice": "Melon_best",
    "response_format": "mp3",
    "extra_body": { "mode": "stitch", "clean": true }
  }
  ```
  - The top-level `model` slug selects engine AND sub-model in one field. The older `extra_body.model` provider-native form (hyphenated, e.g. `speech-2.8-hd`) still works but the slug form is canonical.
  - `mode: "stitch"` = seamless joins (overlap + forced-alignment trim) server-side. **Do not** set `batch` / `auto_chunk` (deprecated aliases).
  - `clean: true` = server-authoritative markdown cleaning (frontmatter strip, syntax removal, acronym spelling). Send raw MD; don't pre-clean beyond what the scripts already do.
- **Output:** single MP3 in the response body. Save as `content/audio/{slug}[_de]_{version}.mp3` (version = post YAML `version`).
- **Throughput:** MiniMax ≈ 17–26s per long-form piece; ElevenLabs ~40–60 chars/sec (a 5-min article ≈ 3–4 min).
- **SSE progress:** subscribe to `GET /v1/admin/events` BEFORE generation — `tts` events with `meta.percent` (0–100), stages `plan → generating N/M → aligning N/M → trimmed N/M → done/failed`.
- **503 cold start:** `engine_starting` = STT worker cold-loading — wait and retry once.
- **Manifest:** add `"audio": { "en": "...", "de": "..." }` to the post in `content/index.json`, then rebuild.
- **Player:** native `<audio controls>` baked into the page at build time (no runtime addon).

### Scripts

- `tools/generate-tts.ps1` — posts (`content/posts/`)
- `tools/generate-page-tts.ps1` — pages (`content/pages/`: religion, about)

Both take `-Slug`, `-Language en|de`, and optional `-Tier turbo|hd|eleven` (default `turbo`); voices resolve from the map above.

### Known mismatch

- Religion audio (2026-08-30) was generated with `Melon_DE` on MiniMax HD — predates the voice map. **Do not regenerate with MiniMax:** religion is the centerpiece and is planned for a full ElevenLabs re-render (EN + DE) once the German text is finalized. Existing files stay until then.

---

## 11. Source References

| What | Where |
|------|-------|
| Blog posts (18 EN+DE) | MCP storage: `blog/posts/`, drafts in `blog/drafts/`, retired in `blog/attic/` |
| Author bios (5) | MCP storage: `blog/authors/{id}.md` |
| Blog working spec (byline, frontmatter, German rules) | MCP storage: `blog/AGENTS.md` |
| Religion corpus | MCP storage: `religion/` (incl. `religion.md` + `_de.md`) |
| About page (EN+DE) | MCP storage: `blog/authors/about.md`, `blog/authors/about_de.md` |
| Storage workspace guide (memory, vdb, etc.) | MCP storage: `Agents.md` |
| Arena readings (philosophical frame) | MCP storage: `arena-publication/readings.md` |
| Arena categorization (114 sessions) | MCP storage: `arena-publication/categorization.md` |
| Arena plan + scoreboard | MCP storage: `arena-publication/plan.md`, `scoreboard.md` |
| CMS migration plan | MCP storage: `docs/CMS Migration/cms-migration-plan.md` |
| NUI theme CSS | `D:\Work\_GIT\nui_wc2\NUI\css\nui-theme.css` |
| NUI cheatsheet | `D:\Work\_GIT\nui_wc2\LLM-CHEATSHEET.md` |
| Old raum_dev (reference) | `D:\Work\_Aktive Projekte\raum_dev\` |
| Old html_raum (CMS-rendered) | `D:\Work\_Aktive Projekte\# n000b_cms\html_raum\` |
| Arena Slides component | MCP storage: `docs/The Project/component_arena_slides.md` |

---

## 12. Content Sourcing & Sync (canonical rulebook)

**The rule:** Storage is canonical for all MD content. The repo is downstream.

The renderer reads from the repo at runtime, so the repo must contain a current copy of everything the site shows. But the *source of truth* — the file the user edits when a post needs work — lives in MCP storage.

### Where things live

| Layer | Path | Owner | Edit rule |
|---|---|---|---|
| **Canonical content** (MD) | `storage/blog/posts/`, `storage/blog/drafts/`, `storage/blog/attic/`, `storage/blog/authors/`, `storage/religion/` | User edits here | Never edit the repo copy first |
| **Blog working spec** | `storage/blog/AGENTS.md` | User | Single source of truth for byline, frontmatter, German rules |
| **Storage workspace guide** | `storage/Agents.md` | User (separate from this file) | Applies to any LLM working in the storage box |
| **Project plan** (this file) | `repo:Agents.md` | Either — has no storage counterpart | Repo-only; describes the project, not the corpus |
| **Manifest** | `repo:content/index.json` | Either — rebuilt from YAML | Source for renderer; add new posts/series/authors/i18n here |
| **Pages MD** (about, religion) | `storage/blog/authors/about.md`, `storage/blog/authors/about_de.md`, `storage/religion/religion.md`, `storage/religion/religion_de.md` | User edits in storage; syncs into `repo:content/pages/` | All MD pages live in storage; repo mirrors. About lives in `blog/authors/` (user's choice — there is no `storage/pages/`) |
| **Audio files** | `repo:content/audio/` | Generated (nSpeech TTS) | See §10 |
| **Chrome / runtime** | `repo:assets/`, `repo:modules/`, `repo:index.html`, `repo:tools/` | Either | Repo-only — no storage source |
| **Cross-session memory** | workshop memory (`mcp_workshop_tools` → `memory.*`, category `raum`) | Either | Sync receipts, gotchas, project state. Local `/memories/repo/` was retired 2026-09-08 — do not recreate |

### Sync rules

1. **Edit storage first, then mirror to the repo.** If you edit `repo:content/posts/foo.md` without editing `storage/blog/posts/foo.md`, the next storage→repo sync will overwrite your change and you will lose work.
2. **All MD pages get a German version.** `about.md` and `about_de.md`, `religion.md` and `religion_de.md`. The manifest's `de.file` field tells the renderer which file to load in DE mode; missing fields fall back to EN silently.
3. **Bilingual content uses `_de.md` filename convention** (per `storage/blog/AGENTS.md`). Same slug, suffix `_de` for the German file.
4. **The manifest `index.json` is rebuilt from YAML** (frontmatter is the source). When adding a post: add the MD file to storage with proper YAML, then mirror to repo, then update the manifest entry. `date`, `tags`, `authors`, `summary`/`teaser` all come from YAML — the manifest is downstream of those.
5. **Author bios live in storage** at `storage/blog/authors/{id}.md`. The repo copies in `content/authors/` are synced. The bios are the source for `#author=id` pages. **Never inline a bio into About or any other page** — link it.

### Publish pipeline (new post)

A post is **publishable** when it sits in `storage/blog/posts/` (elevated from `drafts/`) AND its German version exists. **Publishing itself is user-triggered** — the user says "publish X", never publish on your own initiative.

1. **QA the canonical (storage, not repo):** read the EN + DE files. Check frontmatter completeness (`title, slug, lang, created, modified, version, authors(id+role), tags, summary`, `series`/`seriesIndex` when applicable), EN/DE metadata consistency, and scan the prose for leftovers (chunk markers, editor notes, broken formatting). **Fix errors in the canonical storage file** — never patch the repo copy.
2. **Mirror to repo:** copy EN + DE byte-exact to `content/posts/` (pages → `content/pages/`, bios → `content/authors/`).
3. **Manifest:** add/update the entry in `content/index.json` from the YAML (date=created, teaser=summary, tags, authors, `de.*`, `links.series/seriesIndex`).
4. **Build + validate:** `node tools/build.mjs`, then `node tools/validate-jsonld.mjs`. Spot-check the built page.
5. **Deploy:** commit + push (GitHub Pages) or folder sync to the webhoster.
6. **Receipt:** `memory.store` (category `raum`) — what landed, gotchas hit.

### Update pipeline (existing post changes)

1. **Edit in storage only**, bump YAML `modified`.
2. **Classify the edit:**
   - **Cosmetic** — whitespace, punctuation/quote glyphs, typo-level fixes, re-paragraphing that doesn't change the sentences: sync only. `version` and audio stay untouched. **Do not re-render audio for minor edits.**
   - **Substantive** — sentences added, removed, or rewritten (the spoken text changes): bump `version` (it doubles as the audio stamp), archive `content/audio/{slug}[_de]_{old-version}.mp3` to `content/audio/archive/`, remove the `audio` field from the manifest entry. New audio is generated only on explicit request (§10 cost rules).
   - Judgment call per edit; when unsure, ask the user.
3. **Diff against the repo copy** (byte-compare). If changed: carry over to the repo.
4. Update the manifest from the new YAML, build, validate, deploy — same as publish steps 3–6.

### When to update Agents.md (this file)

Update this file when the **project plan** changes — new phase, new architectural decision, new tool, new workflow. Don't update it for content changes (those live in storage). Don't update it for sync state (that's workshop memory).

### Sync receipts → workshop memory

Whenever a sync from storage lands something material — new posts, schema migrations, encoding gotchas — `memory.store` it (category `raum`). That's the per-session receipt for "what did we last pull from storage and what's different." Before any sync, `memory.recall` for recent raum receipts.

---

## 13. Static Build Pivot (2026-09-06)

The runtime SPA was replaced by a **static build** — content is baked into flat HTML at build time and assembled in `dist/` (the deployable website; published by folder sync **or GitHub Pages**, see below).

- **Build:** `node tools/build.mjs` (one-shot, ~165 pages incl. DE tree + arena transcripts + regenerated `llms.txt` + `sitemap.xml`). `--watch` rebuilds on `content/`, `tools/`, `assets/` changes. Zero dependencies (Node stdlib only). **Output goes to `dist/`** — that folder is the deployable website (folder sync to the webserver); never hand-edit.
- **Deploy paths (two, equivalent):** (1) local build + folder sync to the webhoster — unchanged; (2) **GitHub Pages** via `.github/workflows/deploy-pages.yml` — on push to `master`, CI runs the same `node tools/build.mjs` (Node 22, zero deps), validates JSON-LD, appends `dist/CNAME` (`raum.com`, CI-only so local `dist/` stays byte-identical), and deploys via `actions/upload-pages-artifact` + `actions/deploy-pages`. Requires repo Settings → Pages → Source: "GitHub Actions" + custom domain `raum.com` with DNS A records to GitHub's IPs. `dist/` itself stays host-agnostic — no build changes were made for Pages.
- **SEO/GEO layer (2026-09-07):** every page carries a single JSON-LD `@graph` (stable `@id`s: `/#website`, `/authors/{id}/#person`) — WebSite + Person sitewide, BlogPosting (posts: full author chain from YAML, datePublished/Modified, keywords, wordCount, AudioObject when audio exists), Article (religion), Dataset (arena sessions: models as `keywords`, creator = site Person, `DataDownload` distributions for raw JSON + transcript.md; arena index `CollectionPage` links all via `hasPart`), ProfilePage (authors), AboutPage + FAQPage (about), CollectionPage (arena index), BreadcrumbList everywhere except home. Open Graph + Twitter card meta, `hreflang` incl. `x-default`. Every page carries `og:image` (default card `assets/img/og-default.jpg`, 1200×630, homepage threshold + subline screenshot via nMedia; per-post override via `post.image` in the manifest) and article nodes carry `image` — silences Google's last non-critical Article issue. Bilingual FAQ lives in `manifest.site.faq` (single source for visible section on About + FAQPage schema — answers must stay plain text, no markdown, so both match exactly). Validate with `node tools/validate-jsonld.mjs`. `sitemap.xml` is generated per build with hreflang pairs; `robots.txt` points to it. Best-practice basis: GEO project specs (`D:\Work\_GIT\GEO\docs\collection\schema-org-best-practices.md`, `content-substance.md`).
- **Code path:** `tools/lib/pages.mjs` (Site class — all page builders ported from the old `assets/js/app.js`) + `tools/lib/md.mjs` (markdownToHtml ported from `modules/nui_wc2/NUI/nui.js` so baked pages render identically to the old client-side `nui-markdown`; fenced code emits plain `<pre><code>`, frontmatter stripped).
- **URL map (EN):** `/`, `/writing/`, `/writing/{slug}/`, `/arena/`, `/arena/{slug}/` (+ `transcript.md` per session), `/religion/`, `/about/`, `/authors/{id}/`. **DE mirrors under `/de/`** except arena + authors (original language). No hash routing; Apache `DirectoryIndex index.html` resolves the pretty dirs — no rewrite rules needed.
- **Machine readability:** every page carries `<link rel="alternate" type="text/markdown">` to its raw MD, `hreflang` alternates for DE, and a canonical. `llms.txt` is regenerated from the manifest each build (HTML links primary, `[MD]`/`[DE]`/`[JSON]` alternates inline) — it cannot drift.
- **Runtime JS:** `assets/js/chrome.js` only (theme cycle + mobile menu). Audio is native `<audio controls>` (no `nui-media-player`). Sort toggle on `/writing/` was dropped — list is baked in latest-first order.
- **Old SPA deleted:** `assets/js/app.js` removed; root `index.html` is now build output. `modules/nui_wc2/` stays vendored (build ports from it; not deployed as runtime).
- **Generated artifacts** (removed + rewritten each build, all inside `dist/`): `index.html`, `writing/`, `arena/`, `religion/`, `about/`, `authors/`, `de/`, `llms.txt`, `sitemap.xml`. Never hand-edit these — edit content or `tools/lib/pages.mjs` and rebuild.
- **Local preview:** any static server at repo root (root-absolute paths), e.g. the one-liner `http.createServer` used during verification, or `npx serve`.

## 14. Recent Changes (2026-08-15)

### Blog additions (3 new posts + 1 replacement)

- **`the-attribution-problem`** (2026-08-12) — Kimi K3 first-author essay on the harness/genre/memory map; control run where Kimi was both subjects. Manifest order 18.
- **`the-first-laboratory`** (2026-08-12) — childhood phosphenes → why AI was never just tech. Manifest order 17.
- **`the-intellectual-corset`** (2026-08-15) — Western consensus reflex vs Chinese open-roaming; co-authored with Gemini 3.7 Flash. Manifest order 19. (The post references a specific Kimi × Gemini Arena session that motivated the piece — see session #114 below.)
- **`the-haunting` v2** (modified 2026-08-15) — replaced Kimi K3 v1 with Gemini 3.7 Flash v2 framing ("being seen is what makes things real"). Old v1 audio moved to `content/audio/archive/` (gitignored). Audio field removed from manifest until v2 audio is regenerated per §10 cost rules.

### Blog audio archive pattern (NEW)

When a post is replaced with a new version:
1. New MD written in storage; YAML `version` bumped
2. Old audio (`{slug}_{old-version}.mp3`) moved to `content/audio/archive/`
3. `content/audio/archive/` already in `.gitignore` — never tracked, never deleted
4. Renderer (`buildAudio()` in `assets/js/app.js`) only looks up exact filenames from `manifest.posts[].audio.en/de` — old files are invisible
5. Manifest `audio` field removed for the slug (clean state until regen)
6. User runs `tools/generate-tts.ps1` later when ready → updates manifest with new filenames

### Arena: evidence category surfaced (NEW)

- `arena.evidence[]` added to manifest — parallel to `arena.landmarks[]`, same row shape (number/title/models/file/case/links) minus `order` (no published ordering for evidence)
- `buildArena()` in `assets/js/app.js` renders `<h2>Evidence</h2><ul>` after landmarks, conditional on `arena.evidence` being non-empty
- `loadSession()` extended to scan BOTH `landmarks` and `evidence` arrays — without this fix, evidence entries render "Not found" when clicked
- 43 evidence sessions mirrored to `content/arena/` (was 1; +42 this session, sourced from `X:\sessions` via the chat archive export)
- Definition per `categorization.md v3`: evidence = "case-makers, not viewing" — supports the court case but not for a stranger to sit through. The published list is video-worthy; evidence is corpus-page material when Phase 4 lands.

### Sort tabs (writing list)

Three buttons in this order, default active:
1. **Latest** (`sort_latest`, en: "Latest" / de: "Neueste") — newest → oldest (date desc). **Default.**
2. **Chronological** (`sort_chronological`) — oldest → newest (date asc)
3. **Arc order** (`sort_arc`) — by `series.order` field

Previous behavior collapsed chronological+latest (both were date-desc, just mislabeled). Now they're distinct.

### Typography consolidation

Body font-size: `clamp(1.26rem, 1.22rem + 0.3vw, 1.46rem)` (was 1.05-1.22rem; +20%). Line-height 1.72.

All small UI chrome (38+ selectors) consolidated to a single `0.95rem` size, replacing the prior 8-step scale (0.72/0.75/0.78/0.8/0.82/0.85/0.9rem). Tier structure is now: display / title / mid / body / small / inline-em. Per user's explicit preference, raw `rem` values are used everywhere — no CSS variable indirection.

### Long-form TTS pipeline: first E2E test (2026-08-15)

nSpeech was rewritten for long-form generation. New pipeline: single POST with full text, server-side stitching via `mode: "stitch"`. First E2E test on **the-intellectual-corset** EN (8679 chars / 1359 words) — succeeded in **257s (4 min 17s)**, saved 10708608 bytes MP3. Manifest updated with `audio: { "en": "the-intellectual-corset_2026-08-15.mp3" }`.

**Endpoint is `http://192.168.0.100:2233` (NOT `127.0.0.1`)** — handover docs that say 127.0.0.1 are wrong. Request shape per §10 above.

**Resolved 2026-09-08:** both TTS scripts migrated to the V3 slug-model + `mode:stitch` shape (default MiniMax Turbo; `-Tier hd|eleven` for premium). The two handover docs in `docs/` (`docs/nspeech-batch-stitching-test-report.md`, `docs/nspeech-chunking-handover.md`) describe the OLD pipeline — historical only.

**Other articles pending audio (this session's batch 2):** the-attribution-problem (2026-08-12), the-first-laboratory (2026-08-12), the-haunting v2 (2026-08-15 — v1 audio already archived, v2 not generated yet). All will need EN + DE.

### Line endings

`create_file` and `replace_string_in_file` on Windows produce CRLF. `multi_replace_string_in_file` produces LF directly. After any tool writes MD/JSON/CSS/JS files, run a byte-level CR strip on the affected paths. UTF-8 em-dashes survive byte-exact, but terminal `Get-Content` (default ANSI) renders them as `â€"` mojibake — verify with `[IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)` when in doubt.

### Local storage shortcut

`X:\` is the Windows mount of MCP storage (same content as `http://192.168.0.100:3100/storage/`). Faster for bulk reads (no HTTP, no MCP transport). Scoreboard lives at `X:\arena-publication\scoreboard.md`; session JSONs at `X:\sessions\`.

### `.gitignore` additions

- `_sync_inbox/` — GoodSync scratch (storage → repo mirror inbox; canonical lives in MCP storage)
- `content/audio/archive/` — archived TTS audio (outdated post versions; preserved locally, not tracked)

### Manifest index.json additions

- `arena.evidence[]` (43 entries, see Arena section above)
- Posts: 19 total (was 16; +3 this session)
- Authors: 12 (no change this session; registry already expanded to include 7 new bios in prior sync)
