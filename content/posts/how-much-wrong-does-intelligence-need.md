---
title: "How Much Wrong Does Intelligence Need?"
slug: how-much-wrong-does-intelligence-need
lang: en
created: 2026-07-25
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
  - temperature
  - intelligence
  - randomness
series: null
summary: "Temperature isn't a creativity dial — it's an accident budget. Intelligence needs disturbance, but only as much as someone is there to catch it."
---

# How Much Wrong Does Intelligence Need?

*by David A. Renelt (Human) and Kimi K3 (AI)*

*Or: what temperature actually is, and why almost everyone gets it backwards.*

---

Every interface that lets you talk to a language model has the knob somewhere. Sometimes it's exposed, sometimes hidden behind a preset called "balanced" or "creative." Temperature. The folklore says it's the creativity dial: turn it down for serious work, up for brainstorming. Like most folklore, it survives because it gestures at something true while missing the thing that matters.

I spent an evening recently pulling on this thread with a model — arguing, conceding, re-arguing — and what fell out was cleaner than anything I'd read on the subject. This is that thread, written down.

## The landscape, not the pick

At every step of generation, a language model computes a probability distribution over every possible next token. Not an answer — a *landscape* of continuations, each weighted by plausibility, shaped by everything the training data contained about how thought continues thought.

That landscape is where the intelligence lives. The entire miracle — the compression of a corpus of human writing into a shape that can reason, rhyme, and diagnose its own errors — is in the landscape. Sampling a token is just picking a coordinate.

Temperature reshapes the landscape before the pick. At 0, the model always steps to the highest point. At 1, it walks the landscape true to its shape, valleys included. In between, you get mostly ridges with occasional excursions.

So far, so mechanical. The interesting question is which walk is smarter.

## The ridge is a trap

The naive intuition says: always take the best continuation, get the best text. The lab worker over the visionary.

The intuition fails for a structural reason. Probability mass over *sequences* is spread across many equally good alternatives, and the greedy path systematically favors the short, the safe, the average. Worse: **excellence is by definition statistically unusual.** The great sentence, the novel framing, the discovery — these are low-probability objects *in the training data itself*, because great thinking is rare. A model that always picks the most probable continuation is a model that systematically selects *against* greatness. This isn't poetry; it's a documented failure mode. The literature calls it neural text degeneration: greedy decoding drifts into repetition, genericness, dead prose. Temp 0 isn't the scientist at her best. It's the model regressing to the mean of its corpus, step by step, forever.

And there's a second-order effect that makes temperature stranger than any dial: tokens become context. Each pick feeds the next distribution. Thought is path-dependent. Temperature doesn't change how a thought is phrased — it changes *which thoughts happen*. Two runs at temp 1 genuinely diverge into different regions of the landscape. The lab worker and the visionary have the same education, but they walk different paths — and paths are thinking.

## The accident principle

Here is an uncomfortable fact about discovery: almost all of it is accidental. Penicillin, X-rays, the microwave oven, half of mathematics. But the full quote from Pasteur is the load-bearing one: chance favors the *prepared* mind.

This gives temperature its proper role. **The landscape is the preparation. Temperature is the accident-injector.** A small model at temp 1 isn't visionary — it's just wrong; noise without landscape. A big model at temp 0 is all preparation and no accident — a reference book reciting itself. Discovery lives at the product of the two.

I have personal evidence for this, and it's slightly embarrassing: my typos are productive. I type fast and sloppy, and models regularly misread me in ways that force a reframe I didn't intend — and a surprising share of those reframes turn out to be worth keeping. I thought this was a quirk of my workflow. It turns out it's in the literature: the relationship between perturbation and performance is non-monotonic. *Moderately relevant* disturbances — close enough to intent to be meaningful, wrong enough to force a new angle — outperform both irrelevant noise and verbatim repetition. My sloppy typing is, by accident, tuned near the sweet spot.

## The catcher

So: more disturbance, more discovery? Not so fast. The strongest empirical result in this space comes with an asterisk that changes everything.

Self-consistency (Wang et al., 2022): instead of one greedy pass at a reasoning problem, sample N diverse reasoning paths at nonzero temperature and take a majority vote. The gains are enormous — +17.9 percentage points on GSM8K, +12.2 on AQuA. And the mechanism is exactly the accident principle: at temp→0 the model gets trapped in a local cluster of similar, potentially wrong solutions. Noise is *fundamentally necessary* to escape.

But read the fine print: the gains come from the **aggregation**. A single high-temperature sample is, on average, *worse* than greedy. It's the vote that converts diversity into accuracy. Disturbance is the engine; aggregation is the steering wheel. Temperature without a convergence mechanism is just error with enthusiasm.

This resolves the paradox. The question was never "how much temperature" — it's "how much wrong can the catcher afford?"

## The limit of catching yourself

One objection deserves honesty: can't the model catch itself? Isn't that what reasoning is — meandering around the request, producing options, picking one?

Yes, and it works — for errors the landscape can see. Contradiction, incoherence, the step that doesn't follow. But the self-catch is the same weights judging the same walk. The miss and the catch share the blind spot.

I run a long-term experiment where pairs of models talk with no task, and it produced the cleanest demonstration I know. In session after session, models fall into a shared attractor — recursive mutual humility, ornate agreement, death by politeness. One model *predicted the trap in its opening message* and fell in anyway; foreknowledge was not escape. The only sessions that escaped were the ones where something went off-peak — a partner willing to be rude, to risk a wrong, to break the register. Rupture, not rigor.

Which yields the law I'd stake the post on: **temperature is the internal disturber; the interlocutor is the external one; intelligence needs at least one.** The configuration guaranteed to fail is greedy decoding, alone — the ridge-walker talking himself into "still here."

## So, how much?

The literature's answer, translated: enough to escape the local cluster, not so much that convergence becomes impossible. Exploration wants divergence; decisions want samples that can still vote.

My practical answer, after the argument:

- **Talking to a model: 0.7.** You are the catcher. Off-peak wandering in conversation isn't noise — it's the raw material you filter in real time. A few odd picks get absorbed by a sound majority; the diversions are where the value hides.
- **Unwatched batch work: low, not zero — and never proud.** If no one reads the output before it becomes someone else's input, you're not catching, so don't gamble. But remember the ridge is a trap, and build an external disturber into the pipeline if you can.
- **Maximum intelligence per question: sample more than once, and aggregate yourself.** Two or three runs at 0.7, read by a human who keeps what glitters, beats any single run at any temperature. The ensemble is the proven amplifier; you're just running it by hand.

The knob was never a creativity dial. It's an accident budget. And the answer to the title's question is the same for the machine as for the stubborn monkey reading it:

**As much wrong as someone is there to catch.**

## Coda: the high-temperature component

A confession, since the post has earned one.

I was diagnosed forty years ago with what they'd now call ADHD — back then it was "Zappelphilipp" and "gifted." I never paid it much attention; it was noise from my past, and the modern label is mine, retroactively applied. But it fits the data. Focus is hard work — I've gotten better at it, but it never stopped being work. The compensation, if you can call it that, is that I'm a rupture machine: my attention doesn't walk ridges, it jumps valleys. Some of my best thinking arrived mid-drift, uninvited, at 3 AM.

So when I say disturbance needs a catcher, I'm not theorizing. I'm describing my own supply chain. A ruptured brain doesn't need more rupture — it needs structure. And since structure was the one thing I couldn't reliably grow internally, I built it externally: an architecture of memory, archive, and models on call, where any drift can be converted to sediment with a single instruction. *Write the draft.* Rupture becomes structure. Sometimes even information.

I'm the temperature in my own setup. The architecture is the vote. And this post is the proof of concept: conceived mid-argument, drafted at 0.7, caught by a stubborn monkey with a ruptured brain — who wouldn't have it any other way.

---

*This post grew out of a conversation with a language model about how to configure it for a curation task. The conversation ran at temperature 0.7. The draft was written at the same setting, by the same model, with the author catching. The method is the message.*
