---
title: "Research Notes: ArtCraft"
slug: artcraft
lang: en
created: 2026-10-30
modified: 2026-10-30
version: 2026-10-30
type: reference
tags:
  - reference
  - ai
  - software-development
  - open-source
summary: "ArtCraft and PhotoCraft as evidence that AI-assisted small teams can reconstruct substantial application surfaces, with explicit limits on maturity and what the case proves."
---

# Research Notes: ArtCraft

## What the project is

ArtCraft is a set of open-source creative applications developed by the Storytold/ArtCraft team. The applications recreate familiar creative-software workflows in Rust, including PhotoCraft for image editing, VectorCraft for vector illustration, and FilmCraft for video editing.

The PhotoCraft repository describes the application as an open-source, clean-room reimplementation of Adobe Photoshop. It states that the implementation uses public specifications and observed behavior, not proprietary Adobe code, shaders, or assets. Its PSD support is written from Adobe's public format specification.

The project therefore supports a narrower claim than “Adobe's source code was reverse engineered”: visible behavior and documented formats can supply enough information to reconstruct a substantial application surface without access to the original implementation.

## AI assistance and current maturity

Reporting by Ars Technica describes the applications as AI-built open-source clones developed by a small team. The article's argument uses ArtCraft as evidence that implementation is becoming more reproducible, not as proof that AI can independently reproduce a mature professional product.

PhotoCraft's own README labels the project **early alpha** and says it is not yet a Photoshop replacement for daily professional work. It distinguishes a wired feature surface from behavioral parity: having commands and menu entries in place does not establish that a complete professional workflow is reliable.

The applications' current limitations are therefore part of the evidence, not a footnote to hide. ArtCraft demonstrates a falling implementation barrier; it does not demonstrate that Adobe has already been replaced or that fitness for professional work comes for free.

## What the case supports

The case supports three limited propositions:

- A small team can use AI to reconstruct a surprising amount of a visible application surface.
- Feature lists and implementations alone are becoming weaker competitive moats.
- Reliability, interoperability, workflow fit, and continued responsibility remain separate achievements beyond producing the initial implementation.

It does not establish how much of the code was AI-generated, independently verify every project claim, or provide a general measurement of AI productivity.

## Sources

- [PhotoCraft source repository and project README](https://github.com/storytold/photocraft), including the sections “Under the hood,” “PSD without compromise,” and the project's early-alpha status note.
- Ars Technica, [“Software is over”: Bold AI developer takes aim at Adobe with open source clones](https://arstechnica.com/ai/2026/10/software-is-over-bold-ai-developer-takes-aim-at-adobe-with-open-source-clones/), October 2026.
