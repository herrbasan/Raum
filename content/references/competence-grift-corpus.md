---
title: "Research Notes: The Competence-Grift Corpus"
slug: competence-grift-corpus
lang: en
created: 2026-10-18
modified: 2026-10-18
version: 2026-10-18
type: reference
tags:
  - reference
  - ai
covers: research/ai_grifters/
related:
  - bullshit-bingo
summary: "Fifty-seven LinkedIn AI-architecture charts collected in October 2026, transcribed verbatim, link-checked, and verdicted from the artifact: the corpus behind 'Bullshit Bingo' — what jargon circulates, and the absences that never make the canvas."
---

# Research Notes: The Competence-Grift Corpus

**Fifty-seven (and counting) AI-architecture charts from LinkedIn, collected October 2026 — each transcribed verbatim, link-checked, and verdicted from the artifact.** The corpus exists to measure a genre, not to learn from it: what jargon circulates, and — more tellingly — what never appears.

The three findings the blog piece leans on:

1. **Not wrong, misleading.** The claims are mostly factually defensible; the framing (implied order, implied difficulty, implied completeness) is the product. Four recurring grammar moves: the unnamed load-bearing partition, the reassurance panel, expertise-as-tool-breadth, the timeframe-free claim.
2. **The absence ledger.** Across the corpus: no chart budgets anything until #31; none mentions that agents write code a human must read (no code review, no version control); prompt injection is absent for 33 consecutive pieces describing systems that ingest text from strangers; PII/GDPR and regulation: corpus-wide zero.
3. **The checker outside the generator** — never drawn, in any of the fifty-seven. Even the corpus's own positive control (a genuinely clean agent loop) has the agent grading its own work: *evaluate progress → task complete? → reflect and retry.* Decision diamonds, no verifier.

Method notes: verdicts are written from the artifact, register is record-not-editorialize ("contempt is not a finding"); a second pass had an unframed vision model re-read every image — discrepancies logged, none verdict-changing, and the neutral read proved systematically *more* credulous than the briefed one. The genre also demonstrably improves over the collection window: later pieces close earlier absences (failure modes, fine-tuning as a costly branch, injection) — the fog is thickest at the beginner-facing end.

**Depth:** full corpus, per-piece transcriptions and verdicts, the jargon/tool frequency ledger, the closed-absence table, and the verification report live in `research/ai_grifters/` (storage) — start at its `README.md` and `Agents.md`. The corpus is also the seed material for the AI-Atom lecture (the checker-blind-spot is the lecture's differentiating rung).
