---
title: "Research Notes: Protected Ownership in Software"
slug: protected-ownership
lang: en
created: 2026-10-27
modified: 2026-10-27
version: 2026-10-27
type: reference
tags:
  - reference
  - software-development
  - open-source
summary: "Linux, Redis, and id Software as examples of a distinction between large contribution networks and clear authority over a coherent part of a system."
---

# Research Notes: Protected Ownership in Software

## Linux: integration through maintainers

The Linux kernel's own development documentation describes a hierarchy of maintainers. Subsystem maintainers select and integrate patches for their areas; top-level maintainers ask Linus Torvalds to pull their selected work into the mainline repository. Torvalds is the single person who can merge patches into that mainline repository, while the chain of trusted maintainers makes the scale manageable.

This supports a specific distinction: modular contribution does not eliminate integration authority. The kernel is not presented here as proof that one person reviews every line or holds the whole implementation in memory. It shows a system in which responsibility for accepting work remains explicit.

## Redis and id Software: coherent domains

Redis was created by Salvatore Sanfilippo, known as antirez. Its repository history documents the project's origin and evolution. The article uses Redis as an example of a tool whose initial shape bears the judgment of a coherent mind, not as a claim that one person wrote every subsequent line.

John Carmack's engine work at id Software provides a related example from a small team with distinct domains. The point is not that every team member shared Carmack's technical picture. It is that ownership of the engine gave him room to advance it without turning each technical decision into a committee exercise. The historical account of id Software's people and roles is documented in David Kushner's *Masters of Doom*.

## What these cases do not support

They do not establish that all breakthrough software comes from individuals, that large teams cannot produce excellent software, or that every project should adopt a single ruler. They also do not prove that the article's hypothetical story-point negotiation describes id Software's actual internal process; that sentence is a contrast, not a reported event.

The cases support the narrower mechanism called **protected ownership**: clear boundaries within which a person or small group can understand, decide, and remain responsible for a meaningful whole.

## Sources

- The Linux kernel development community, [“How the development process works”](https://www.kernel.org/doc/html/latest/process/2.Process.html), especially sections 2.2 and 2.3.
- [Redis source repository](https://github.com/redis/redis), project history and current development.
- David Kushner, *Masters of Doom: How Two Guys Created an Empire and Transformed Pop Culture*, 2003.
