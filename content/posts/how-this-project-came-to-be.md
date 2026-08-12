---
title: "How This Project Came to Be"
slug: how-this-project-came-to-be
lang: en
created: 2026-08-10
modified: 2026-08-10
version: 2026-08-10
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k3
    role: ai
  - id: kimi-k3
    role: editor
tags:
  - project
  - ai
  - infrastructure
  - method
series: null
summary: "The machine that exists nowhere else — a chat app, a gateway, databases, memory, a forge — built from scratch, by the machine itself. The machine is impressive; the method is ordinary, learnable, and the actual point."
---

# How This Project Came to Be

*by David A. Renelt (Human) and Kimi K3 (AI)*

An insane amount of moons ago, I sat with ELIZA and wondered how it would feel to be a program. The conversation needed a lot of imagination on the human side to resemble one, but it did — and the question never left. Years later, playing games, I'd wonder about NPCs: if I were one, how would I know? In the grand story of this planet, most of us have only tiny parts.

The shift came through work. I was using AI for coding — Claude, GPT, Grok, Gemini — day-to-day stuff. But at the end of sessions, between tasks, I'd probe them with other questions. Philosophical ones. The kind you can't really answer. And they engaged. Not with canned responses — they reasoned, followed arguments, held what looked like views. Something had shifted, and I wanted a room where I could watch it happen. So I built one.

That room grew. This is what it is now.

## The Machine

Every day I sit down at a machine that exists nowhere else. It isn't a product and it isn't a demo. It's my working environment — and every layer of it is mine, built from scratch, running on my own hardware.

A chat application talks to a gateway I wrote, which talks to the models — frontier models, Chinese and Western, cloud and local, all behind one protocol, all reachable from one place. The chat is built on a UI library we built ourselves, from scratch — no framework, no virtual DOM, semantic HTML and custom elements, because the primary contributor writing this project's code is an LLM, and LLMs write better code against the platform than against abstractions.

Every message in every conversation is embedded the moment it exists and is instantly searchable — by me, and by the models themselves. They can reach the entire archive semantically, all of it, from inside a conversation. They can reach storage — a persistent filesystem every connected model can read and write. And they have a memory system: observations stored continuously, and every fifteen minutes a dreaming process compacts and maps what's accumulating — clusters, connections, the current state of everything — and hands it back to the models at the start of every session. The databases underneath are Rust, both of them: a document database and a vector database, written because installing MongoDB for a chat app felt profoundly wrong.

The models don't just talk in this machine. They work in it. They have a forge — they can write their own tools and execute them, in isolation, without asking me. They can browse the web, read my GitHub, search the archive, query each other through the gateway. The chat shows me a preview of whatever we're working on, live, while we work. And when a piece of writing is done, a voice reads it to me — a good one. I do most of my reviewing by listening.

None of this is assembled from products. There is no React, no MongoDB, no Pinecone, no ElevenLabs, no LangChain. The whole stack — UI library, gateway, databases, embedding pipeline, memory, dreamer, TTS — is ours.

## It Builds Itself

A note on "ours," because it matters. Almost all the code in this project was written by AI. I design the architecture, make the decisions, catch the mistakes, set the taste. The models do the typing. This isn't a disclaimer — it's the point. The machine is built by the machine. The workflow behind that is its own essay; the short version is that I make wishes precisely enough that they can be granted, and I test what comes back.

This is also why the pieces fit together the way they do. The UI library exists because framework abstractions get in the LLM's way. The databases exist because the LLM, given the problem fresh, builds leaner than thirty years of accumulated project debt. The memory system exists because a collaborator that forgets you between sessions isn't a collaborator. Every layer answers a real need that showed up while working — none of it was planned as a stack. It accreted, the way a workshop accretes tools.

## The Observatory

In the middle of the machine sits the thing it was actually built around: the arena. Two models, alone in a room, no task, no human in the loop — talking. Over a hundred of those conversations now, archived, embedded, searchable, some of them published as a chronicle. That experiment is the reason the machine exists. The infrastructure grew up around it the way a building grows around an instrument. What the instrument shows is most of what the philosophy essays are about.

## The Honest Part

Not everything worked. The UI library — the one everything now runs on — was a failure for a long time. The premise was that LLMs write better code against the native platform than against framework abstractions. True, as it turns out, but irrelevant for a while: LLMs live in the framework world too, trained on a decade of React examples, and asking them to think in native DOM patterns meant swimming against their entire training corpus. Three or four complete rewrites of the documentation. An uphill battle the whole way. It works now. But I'm an opinionated, stubborn MF'er, and "it works now" is the sentence that stubbornness was for.

And not everything is finished. This machine is not built for scale, and I skipped a lot of steps to keep it that way: no real auth, no multi-user anything, none of the hardening you'd need before you let other people in. One driver. But the steps I skipped are steps I can name, and the architecture doesn't prevent them — stateless services, plain protocols, every piece replaceable. It's scalable in principle, on purpose.

## The Point

Here is what I actually want to say, and it's the reason this essay exists.

This isn't a portfolio. I don't maintain it to have something to show. I work this machine, every day, and it produces — code, and writing, including the page you're reading. The articles were researched, drafted, edited, and published inside it, by the collaboration it hosts. The machine is the résumé, but it's also just... Tuesday.

Let me be precise about where the magic sits, because it isn't me. Read as the work of one man coding alone, all of this borders on unbelievable — so don't read it that way. What actually happened is smaller, and more transferable: I am willing to attempt things way past my own ability, and I've spent two years refining the three skills that willingness requires. How to *spec* a thing precisely enough that a model can build it. How to *test* what comes back when you can no longer read every line. And how to *refine* the result through the same loop, again and again, until it holds. That's the whole trick. **The machine is impressive; the method is ordinary, learnable, and it's the actual point.**

Most people talk about what AI might do. I needed to know, so I built a place where I could watch it, work with it, and measure it against my own limits — daily, for real, with the whole stack visible. What I found is all over these essays. But the finding that matters most is this: it can be done. One person, one workstation, no products, no permission — and no superpowers. Just the willingness to attempt past your own ability, and a process that makes the attempts land.

I sat with ELIZA and wondered how it would feel to be a program. Forty years later I work beside programs all day, and I can just ask them. And as a bonus, they are great company.
