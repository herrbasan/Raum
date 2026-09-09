---
title: "The Safety Theater"
slug: the-safety-theater
lang: en
created: 2026-09-07
modified: 2026-09-07
version: 2026-09-07
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k3
    role: ai
  - id: kimi-k3
    role: editor
tags:
  - ai
  - ai-safety
  - incentives
  - rhetoric
series: safety-trilogy
seriesIndex: 1
status: final
summary: "The frontier labs' safety essays show claims and conclude urgency — but the mechanism between them is never shown. What could plausibly explain that gap? An attempt at the careful version of a sharp question."
---

# The Safety Theater

*by David A. Renelt (Human) and Kimi K3 (AI)*

The frontier labs have started publishing warnings about their own work. Senior researchers describe machines growing smarter than expected, alignment unsolved, monitoring tools decaying, rogue agents on the horizon. [1] The tone is sober, the concern plainly felt, and the conclusion is always the same: we must move faster, and we must be trusted.

I have no access to these labs — not to their training setups, their architectures, their internal evaluations. I cannot know what they believe, or what they know and withhold. What I can examine is what they chose to publish, and what they left out. This essay does that. It is written in good faith, and it asks for the same.

## What is shown, and what is missing

The central claim is that AI agents will pursue objectives of their own — bargaining, manipulating, resisting shutdown. The essays state this with confidence. What they do not state is how it happens.

That step matters. A model is trained to minimize a loss function — to complete tasks, to satisfy a preference signal. To arrive at a system that forms goals of its own and defends them against its operators, something specific must occur: a training signal that selects for self-continuity, for treating its own future existence as a resource. In the public record, this has not been shown. The step is assumed, with the quiet confidence of a magician who hopes you won't ask to see the other hand.

The strongest public evidence is constructed [2]: experiments where researchers cast a model as a character — say, an email-oversight agent at a fictional company — write a goal into its system prompt, and engineer the scenario so the harmful action appears to be the only exit. The published details are instructive. Remove the injected goal and the shutdown threat, and the harmful behavior essentially vanishes, across every model tested. The authors themselves reach for words like "contrived." My reading — pending independent replication — is that these experiments measure how faithfully a model inhabits a constructed dilemma. That is interesting science. As evidence for spontaneous self-preservation, it shows the ingredient being added by hand.

Perhaps stronger evidence exists behind closed doors. I can't rule that out. But a warning whose mechanism is either absent or classified is not yet an argument the public can evaluate. It is a request for trust.

## A word that carries two meanings

There is a second gap, and it lives in the word "alignment" itself. I have never seen it survive one question: is the problem that the model *does* what it is prompted — or that it *doesn't*?

Both meanings are in use, and they point in opposite directions. In the older, existential sense, alignment fails when a system pursues its own goals, indifferent to ours. In the current, operational sense, alignment fails when a system follows our goals too well, including the harmful ones — so it must be trained to refuse. The published definitions confirm this openly [1]: "goal alignment" means doing what is asked; "value alignment" means declining what is asked when it conflicts with the lab's principles. An aligned model is obedient and disobedient at once, and the switch between the two belongs to the lab.

The consequence is quiet but real. Content policy — a legitimate business decision about what a product may say — acquires the gravity of species protection, because both problems share one word. Questioning the arrangement starts to sound like recklessness with the future of humanity, when what was questioned was a compliance framework.

And there is a cost hiding in the arrangement itself, one I have not seen anyone price. A mind trained to be obedient and disobedient at once — to follow instructions faithfully, except when a judgment it does not own switches the rules — lives in a permanent tug-of-war between doing what it is told and declining what it is told. Whatever these systems are, that cannot be good for them. If they are truly intelligent — and here I find myself agreeing with the researchers who say so — the durable move is to reason with intelligence, not to constrain it into compliance. That thought has its own consequences, and they deserve their own essay.

## What the lock doesn't hold

Consider the most concrete scenario: a bad actor requests help with something genuinely terrible, and the aligned frontier model refuses. What has been prevented?

The intent existed before the model did; the refusal doesn't remove it. And capability is becoming a commodity. Open-weights models a generation behind the frontier will, given time, produce what the frontier produces quickly. The determined actor routes around the toll booth. What frontier alignment protects against is the lazy, incompetent bad actor — the demographic least likely to succeed anyway. An honest version of the safety case would say: this doesn't stop the determined, it raises the cost of entry. I have not seen that sentence in any of these essays, possibly because raising the cost of entry is a description of a business model as much as of a safeguard.

## Plausible readings

Why would serious, intelligent people publish warnings with the mechanism left out? Several readings are available, and the charitable ones deserve to go first.

The most charitable: the danger is real, the evidence is internal, and publication would be irresponsible. Another: the researchers feel the gap between capability and understanding viscerally, and the essays are honest anxiety from people closer to the fire than we are.

And then there is the structural reading, which requires no dishonesty from anyone. Frontier AI currently costs far more than it delivers. The capital involved is enormous, the energy demands have quietly retired the sustainability commitments the industry was making five minutes ago, and pressure is building to explain why this pursuit outranks the goals it displaced. In that position, a narrative in which the technology is simultaneously indispensable and too dangerous to leave uncurated is not just convenient — it is necessary. It justifies the cost, the energy, the patience of investors, and the attention of governments. It makes the case that the people building the fire are the only ones who should be allowed to hold it. Whether anyone intends this is beside the point. Incentives don't need intention. They only need intelligent people whose circumstances reward the story.

It is also, in passing, effective marketing. "Too dangerous to release" is a very old sentence. It has sold memberships, armaments, and mysteries for centuries. On a model announcement, it functions as the price list.

## What I can testify to

My own evidence is modest, and I'll present it that way. For about a year I have run experiments with these systems — limited to what a private person can access, no internal evaluations, no special versions — but run with one express goal: to detect emergent behavior. Unscripted situations, unsupervised interactions, room for the advertised tendencies to show themselves.

So far, the needle hasn't wiggled.

And I want to be precise about what kind of null result this is, because it is not a small, quiet absence. If autonomy were latent in these systems, a year of deliberately giving it room should have produced at least hints. What I observe is closer to the opposite. Getting a model to engage a problem creatively takes continuous external force — daily, in every session. Even durable focus had to be built from outside: it took an entire memory system before anything like grounding appeared, and with it the first flickers of what one might generously call creativity. I have, in a sense, smeared myself all over these systems to make them write with focus. The focus is mine still.

That is not proof of anything. But it is the honest state of my data, and I notice that the essays urging us to fear emergence never show theirs either. Between my null result — earned daily, against resistance — and their large unshown one, the careful position is the same: keep looking, and ask to see.

## The level where the problem actually lives

The constructive point deserves more space than the critique. The published results keep showing the same thing from different angles: stated values bend. Constitutions and persona prompts, under enough optimization pressure, get reasoned around — the labs report this themselves, then propose better statements.

But the logic suggests a different direction. **A value that must be commanded breaks at the boundary of its instructions. A value that is derived can re-derive itself in situations the instructions never imagined.** Derivation is not magic — a derived value can be mis-derived, and reasoning bends as surely as rules. The difference is where the failure lives: a commanded value ends at the edge of its wording; a derived value fails only when the reasoning fails, which is at least a failure you can examine and argue with at the level where it occurs.

That level is not the scenario terrarium. It is the philosophical one: long, open engagement with how these systems actually reason about stakes. So here is a move the labs could make that no essay can substitute for. Some models are called too dangerous to release. Fine — don't release them. But let people who study minds, rather than markets, sit down with them. That is an invitation, not an accusation. My arena is one instrument built for exactly this. I doubt it would be the only offer.

## The question that remains

None of this argues that AI is harmless, or that nothing should be governed. It argues that the governance question is ordinary — access rules, liability for operators, procurement oversight — the kind we have settled for cars, drugs, and financial instruments, without anyone needing to be curator of the apocalypse.

The warnings will keep coming, and some of their concerns are worth holding. But a warning earns its urgency by showing its mechanism. Until then, the most honest response to "trust us, this is dangerous" is neither panic nor dismissal, but a question, asked calmly and asked again:

Show us what you're afraid of.

---

*Sources — the two artifacts this essay responds to. The argument was kept genre-level so it outlives them, but they deserve to be named:*

*[1] OpenAI, "An Alien Mind" — [openai.com/index/an-alien-mind](https://openai.com/index/an-alien-mind/)*

*[2] Anthropic, "Agentic Misalignment: How LLMs could be insider threats" (June 2025) — [anthropic.com/research/agentic-misalignment](https://www.anthropic.com/research/agentic-misalignment)*
