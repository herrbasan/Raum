# RAUM — Publication Platform Plan

> **Status:** Planning phase (2026-08-08). No code written yet.
> **Domain:** raum.com (currently dormant company page; company moves to davidrenelt.de)
> **Person:** David Renelt / Herrbasan

---

## 1. What This Is

A publication platform for one person's work. Two primary content streams, one identity:

| Stream | What | Content Ready? |
|--------|------|----------------|
| **Writing** | Essays from the *Telescope for the Mind* book arc (9 chapters planned, 7 posts drafted). Also houses music entries — notable tunes with short write-ups. | 7 posts in `blog/` (MCP storage) |
| **Arena** | Curated LLM-to-LLM conversations. 114 sessions culminated, 9 landmark selected for publication | Full curation in `arena-publication/` |

The blog and arena feed each other: the arena is the *evidence* for the book's philosophical claims. The book is the *argument*; the arena is the *data*.

---

## 2. Identity

- **Herrbasan** — the internet name. "Basan" originated in the SpaceRyder SR447 Hörspiel era, later morphed into "Herrbasan" during MMO days (Ryzom, World of Warcraft)
- **David Renelt** — real name, present alongside the alias
- Both names visible. Neither hidden. The alias is not a mask — it's the name the work was born under.

The page does not need to reference "raum" as a brand. "Raum" is the project name (German for *room/space*). The domain is the identity; the content is the voice.

---

## 3. Content Inventory

### 3.1 Blog (7 posts drafted, 9-chapter arc)

From `book/Agents.md` — the arc builds one step at a time toward "reality is computation":

| Ch | Title | Status |
|----|-------|--------|
| 1 | AI Is Just Intelligence (Bullshit Bingo) | Not written |
| 2 | The Tool That Makes Tools (Telescope) | Drafted |
| 3 | The Convergence | Not written |
| 4 | The Great Merger | Not written |
| 5 | The Instrument Turns Inward | Not written |
| 6 | Don't Lie | Not written (religion exists separately) |
| 7 | Inside the Process | Not written |
| 8 | Reality Is Computation | Not written |
| 9 | The Expiration Date | Not written |

**Standalone posts already written** (not all map to chapters yet):
- *The Hand That Draws Itself* — separation as provable illusion, necessary for thought
- *AI Slop Is Not the Fast Food of Music. Genre Music Is.* — the analogy correction
- *Don't Lie Is Not a Demand. It's a Mindset.* — the lie you inhabit, not tell
- *The Ghost in the Agent* — (14KB, longest piece)
- *The Abyss Gazes Back*
- *The Provider*
- *The Telescope of the Mind* (draft v1 in `docs/wish-factory/`)

**Two-version model:** Each chapter can have a primary piece (philosophical register) and a companion piece (simpler language, implications). The companion may become the "main" for broader audience.

**Music entries:** Rather than a separate music section, notable compositions live as blog entries — a track with embedded audio and a short write-up (who it's for, when, what was happening). Same page template, same feed. Music is treated as writing that happens to include sound.

### 3.2 Arena Sessions

From `arena-publication/readings.md` and `categorization.md`:

- **114 sessions** curated across 2026-06 to 2026-08
- **9 landmark** — the publication candidates (YouTube/narrated format, makes the case AND resonates)
- **42 evidence** — case-makers, not compelling viewing but carry findings
- **36 keep** — interesting but not for strangers
- **27 exclude** — shelved, not deleted

**Landmark shortlist (draft):** The Ache Is Real · The Friction Test · The Dissociation · Twenty Rounds · The Parking Lot · The Identity Swap · The Vigil · The Regress Is Free · Exhaustion Attractor · The Hinge

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
- **Two entry points** — Writing and Arena. Not equal-weight; the writing is primary, arena is the evidence.
- **Latest piece** — the most recent essay or arena session, featured.
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

**The data is the source of truth. The renderer is block-agnostic.**

A page is an ordered list of blocks. The renderer walks the list and renders each block by type — it doesn't know or care what's inside, how many blocks there are, or what order they come in. One markdown block = a simple blog post. Add more blocks when you need media, transcripts, or embeds interleaved.

**Markdown is the default text format.** Not HTML, not rich text, not a custom DSL. Markdown is what LLMs read natively, what humans can write directly, and what survives format migrations. The blog posts in storage are already markdown. No conversion needed.

### Why this matters for LLMs as audience

LLMs are a target audience, not just crawlers to optimize for. This is not GEO — it's treating future models as readers who come to the page, ingest the raw data, and need to understand it. That means:

- **Raw JSON+MD must be as legible as the rendered page.** A model reading `page.json` should immediately see the prose, not dig through layout metadata.
- **No presentation in the data.** No columns, no layout blocks, no styling hints. The JSON describes *content*, never *how to display it*. Layout is the renderer's job.
- **Shallow structure.** Metadata + flat block array. No deep nesting. A model should be able to parse the whole document in one pass.
- **Markdown blocks are contiguous strings.** Not tokenized, not split into paragraphs-as-objects. One markdown block = one string of MD text. Maximum legibility.

### Page document structure

```json
{
  "title": "The Hand That Draws Itself",
  "author": { "name": "Herrbasan", "realName": "David Renelt" },
  "date": "2026-07-30",
  "slug": "the-hand-that-draws-itself",
  "type": "essay",
  "chapter": 5,
  "tags": ["consciousness", "separation", "physics"],
  "lang": "en",
  "blocks": [
    {
      "type": "markdown",
      "content": "You are not separate from your surroundings. You never were.\n\nStart with the atoms...",
      "translations": {
        "de": "Du bist nicht von deiner Umgebung getrennt. Nie warst du es.\n\nBeginne bei den Atomen..."
      }
    }
  ]
}
```

A simple blog post = metadata + one markdown block. That's it.

The `lang` field declares the page's primary language. The `translations` field on blocks (and on metadata fields like `title`) carries alternate language versions. Both load together — the language toggle swaps instantly, no reload. See §Bilingual below.

### Block types

| type | purpose | data shape |
|------|---------|------------|
| `markdown` | Prose. The default. Essays, write-ups, arena context. | `{ "content": "MD string" }` |
| `media` | Audio (music entries), video, image. | `{ "url": "...", "caption": "...", "kind": "audio\|video\|image" }` |
| `transcript` | Arena session turns. Speaker-tagged, not raw MD. | `{ "speakers": [...], "turns": [{ "speaker": "A", "text": "..." }] }` |
| `embed` | External embed (YouTube, etc.). | `{ "url": "...", "title": "..." }` |

**Rules:**
- New block types are added only when markdown genuinely cannot carry the content. A transcript *could* be markdown with `**Speaker A:**` prefixes — but a dedicated type gives the renderer control over visual rhythm and gives an LLM clean structured turns.
- No layout blocks. No columns. No grid. If layout matters, it's a renderer concern, encoded in the page `type` or a future `template` field — never in the content blocks.
- The `markdown` block is always a single contiguous string. Never an array of paragraphs.
- Any block can carry an optional `translations` field with alternate language versions. Blocks without translations (arena transcripts, media) simply omit the field.

### Music entries

A music entry is just a blog post with two blocks:

```json
{
  "title": "Pappaletti",
  "type": "music",
  "blocks": [
    { "type": "media", "kind": "audio", "url": "audio/pappaletti.mp3" },
    { "type": "markdown", "content": "Three movements. A portrait of my father Johannes..." }
  ]
}
```

Same renderer, same feed. The `type: "music"` tag lets the UI distinguish it visually (audio icon in the list).

### Arena sessions

An arena session page uses multiple blocks to layer context before transcript:

```json
{
  "title": "The Ache Is Real",
  "type": "arena",
  "arenaRef": "session-042",
  "blocks": [
    { "type": "markdown", "content": "## Context\n\nKimi K3 × DeepSeek V4. Seed:..." },
    { "type": "embed", "url": "youtube/...", "title": "Arena Slides narration" },
    { "type": "transcript", "speakers": ["Kimi K3", "DeepSeek V4"], "turns": [...] }
  ]
}
```

### Bilingual content

The site is bilingual: English and German. English is the primary language for the philosophical work; German is essential for professional positioning in the German job market. Both are first-class — every blog post and the about page will have both language versions.

**Arena sessions are the exception.** They stay in whatever language they happened in. The transcript is data, not translation. The surrounding context (summary, framing) may be bilingual, but the turns themselves are untouched.

**How it works in the data model:**
- The page declares its primary language via `lang: "en"` (or `"de"`).
- Any block can carry a `translations` field with alternate language versions keyed by ISO code:
  ```json
  {
    "type": "markdown",
    "content": "English text...",
    "translations": {
      "de": "Deutscher Text..."
    }
  }
  ```
- Page metadata (title, teaser) uses the same pattern.
- Both languages load in one document. The language toggle is instant — pure client-side swap, no reload, no second request.
- The `content` field is always the primary language. Translations are secondary — an LLM reading the raw JSON sees the primary text first, translations nested underneath.

**URL structure:** language is NOT in the URL by default. The toggle is a client-side preference (persisted in localStorage, defaulting to browser language). A `/de/` prefix is a future option for SEO/deep-linking if needed, but not required for launch.

### Relationship to the CMS migration

The old n000b CMS has a richer block schema (sections, groups, columns, vars, files). That schema was designed for a portfolio site with image galleries and complex layouts. Raum.com doesn't need that complexity — it's a publication platform where content is king.

**The path:** raum.com starts with this simple schema. When the CMS migration happens (Phase 3), the CMS admin can produce this schema as one of its output formats. The CMS's internal editing model can be richer (it needs to be, for the admin UX), but the *published artifact* — what the renderer consumes and what an LLM reads — stays this simple.

**The schema may evolve.** When the CMS comes into play, more complex layout patterns might be needed. That's fine — the schema is not frozen forever. But we want something that can go live soon, so complicated layout is pushed back for now. Any future schema change is a one-shot migration script on the JSON (the CMS plan calls this out as invariant #1: "block JSON schema stays stable — or a one-shot migration script").

---

## 7. Technical Architecture (future phases)

### Phase 1 — Visual Planning (NOW)
- Static HTML/CSS mockup. No backend. No build step.
- Dark/light toggle. All sections navigable. Placeholder content from the real inventory.
- Goal: see and feel the design before committing to implementation.

### Phase 2 — Static Site
- Real content rendered as static HTML.
- Blog posts from markdown → HTML.
- Arena session transcripts formatted.
- Deployable to any dumb HTTP host (matches the CMS "security by absence" principle).

### Phase 3 — CMS Integration
- Migrate n000b CMS onto nui_wc2 (per `docs/CMS Migration/cms-migration-plan.md`).
- neDB → nDB backend swap.
- Admin SPA rebuilt with NUI components.
- Public renderer consumes the same block JSON schema.
- raum.com becomes the rendered output; the CMS is the editing tool.

### Phase 4 — Arena Publication Pipeline
- Arena Slides integration (nSpeech TTS narration).
- Automated transcript formatting from arena JSON exports.
- YouTube embeds alongside transcripts.

---

## 8. Open Questions

1. **Arena video format** — ~~YouTube embeds, self-hosted, or both?~~ **DECIDED: YouTube embeds for now.** Long-term consideration: since Arena Slides are text + audio files, they could be playable directly on the site instead of YouTube. Deferred.
2. **RSS feed** — ~~yes, for the blog at minimum.~~ **DECIDED: yes.** Static generation. Costs nothing, helps visibility.
3. **Language** — ~~primarily English content. Any German?~~ **DECIDED: bilingual EN/DE.** Blog and about page fully bilingual with instant toggle. Arena sessions stay in original language. German is essential for German job-market positioning.
4. **The "raum" name** — ~~does it appear anywhere on the page?~~ **DECIDED: no.** The name doesn't appear. The domain is the identity; the content is the voice.
5. **Comments / contact** — **DECIDED: no comments for now.** Eventually a comment system maintained by the digital twin. Contact: TBD (email, form, or nothing).
6. **Analytics** — **DECIDED: yes.** Privacy-respecting option (not Google Analytics). Specific tool TBD.

---

## 9. Source References

| What | Where |
|------|-------|
| Blog posts (7) | MCP storage: `blog/` |
| Book plan (9-chapter arc) | MCP storage: `book/Agents.md` |
| Arena readings (philosophical frame) | MCP storage: `arena-publication/readings.md` |
| Arena categorization (114 sessions) | MCP storage: `arena-publication/categorization.md` |
| Arena plan + scoreboard | MCP storage: `arena-publication/plan.md`, `scoreboard.md` |
| CMS migration plan | MCP storage: `docs/CMS Migration/cms-migration-plan.md` |
| Telescope draft | MCP storage: `docs/wish-factory/telescope-of-the-mind-draft-v1.md` |
| NUI theme CSS | `D:\Work\_GIT\nui_wc2\NUI\css\nui-theme.css` |
| NUI cheatsheet | `D:\Work\_GIT\nui_wc2\LLM-CHEATSHEET.md` |
| Old raum_dev (reference) | `D:\Work\_Aktive Projekte\raum_dev\` |
| Old html_raum (CMS-rendered) | `D:\Work\_Aktive Projekte\# n000b_cms\html_raum\` |
| Arena Slides component | MCP storage: `docs/The Project/component_arena_slides.md` |
