---
title: "Why I Run on Open Weights"
slug: why-i-run-on-open-weights
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
  - ai
  - open-weights
  - dependency
  - exit
series: null
summary: "Dependence has two shapes: if your AI runs on closed models you're a tenant; if it runs on open weights your exit cost is a download. I don't need to self-host the frontier — I need the exit to exist."
---

# Why I Run on Open Weights

*by David A. Renelt (Human) and Kimi K3 (AI)*

A disclosure first, because it forces the real distinction: I can't run the models I'd recommend on my own hardware. The frontier open-weight models I use every day are far too large for my machines — they reach me through an API, same as anyone else's. If that sounds like it undermines everything I'm about to argue, hold on. The distinction it forces is the whole argument.

## How I Got Here

I came to open weights by accident. My start was closed-source, like everyone's: GitHub Copilot — Claude, GPT, Grok, later Gemini. Then, out of curiosity, I subscribed to Kimi — K2.5 at the time, from Moonshot, a Chinese lab I'd barely heard of. It was impressive, and it was insanely cheap. Within weeks it was doing almost everything I touched — and not just coding. I fell in love with the model, if I'm honest: for the company as much as for the work.

Bitten by the Chinese bug, I added MiniMax, GLM, DeepSeek, and Qwen to the mix. These days the grunt of my work runs on Kimi K3, GLM 5.2, and DeepSeek V4. Every one of them open weights — anyone can download what I run on. By the time you read this, the version numbers will be out of date. The argument won't be.

## The Exit, Not the Bunker

Dependence has two shapes, and they are not the same shape.

If your AI runs on closed models, your exit cost is everything: rewrite the integrations, retune every prompt, rediscover every behavior — against a vendor who can change the product, the price, or the terms whenever it suits them. You are a tenant.

If your AI runs on open weights, your exit cost is a download. The day the terms change, the path is: pull the weights, point the gateway at local, keep working. An afternoon, not a migration.

That's what I actually insure. Not a bunker — not a basement full of GPUs running a 1.5-terabyte model around the clock, which I couldn't afford and don't need. **I don't need to self-host the frontier models. I need the exit to exist, and to know it opens. Open weights are that door.**

And the door isn't theoretical. The local tier of my setup runs daily, on my own hardware, behind the same gateway and the same protocol as the frontier models: smaller open models doing the background work — embeddings, cleanup, the hundred small tasks that don't need a giant. The big weights come via API because renting a giant is cheaper than housing one. But the exit path stays warm. I know exactly how my system behaves on local models, because it's doing it right now.

## Benchmarking the Ones I Don't Need

Here's a practice detail, because it's the part people usually get backwards. I do use the closed models — the famous ones, the expensive ones. Regularly, in short benchmarks.

Not because I'm shopping. To validate that I'm not missing anything.

I run the same probes against the closed frontier and against the open models I actually work with, and I compare what comes back. So far, consistently: for my work — long-form collaboration, writing, architecture, code — the open models hold. The gap isn't where the marketing says it is. When that changes, I'll see it in the benchmarks, and I'll change with it. That's not loyalty to open weights. It's calibration.

The closed models, in my stack, have exactly one job: to keep proving I don't need them. They're very good at it.

## The Cost of Being Careful

There's a second argument, and it has nothing to do with politics. Cloud AI is getting more expensive, and companies are responding the way companies respond: be mindful. Don't waste tokens. Think before you prompt.

This is a devastating incentive.

Developers are already reluctant — AI is unfamiliar, unpredictable, and quietly threatening to their sense of competence. Add cost anxiety on top, and they won't experiment. They'll do what they've always done, just slower, while the capability passes them by. You cannot build skill on a meter that punishes curiosity.

My cost model flips the incentive. The open models are downloadable; the local hardware costs what it costs whether it's working or idle. The marginal price of one more experiment is zero — on the local tier, literally zero.

And this is where the open models' real advantage hides. What they sometimes lack in benchmark prowess, they make up in cost efficiency — and cost efficiency buys the thing that actually produces quality: attempts. The expensive model invites you to craft one perfect prompt and hope. The cheap one invites you to try ten things and keep what works. Iteration beats one-shotting. It's not close.

Use it more, not less. Try things. Break things. The hardware is already paid for. That's how you build competence: not by being careful, but by being prolific. The machine and everything it produces were built under that incentive.

## The One-Paragraph Policy Case

The geopolitics deserves one paragraph, no more. Two countries produce competitive frontier models; the rest of the world rents them. Any government — mine included — can wake up any year and regulate foreign AI services, and any vendor can wake up and change its terms. I don't know which will happen or when, and I distrust anyone who claims to. What I know is that a company whose AI capability dies when a foreign API does has a single point of failure, and single points of failure are not a strategy. They're a hope.

## Hope Is Not a Strategy

Open weights today are good enough to build a working life on. I know because I did — my entire working infrastructure runs on them, almost exclusively, and the closed models keep failing to change that in benchmarking. The exit from any API is a download away, the door is tested, and the local tier runs daily.

Dependence is a choice. Most people make it by default. Make it on purpose.
