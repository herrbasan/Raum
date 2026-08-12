---
title: "The Wish Factory"
slug: the-wish-factory
lang: en
created: 2026-07-28
modified: 2026-08-10
version: 2026-08-10
authors:
  - id: david-a-renelt
    role: human
  - id: deepseek-v4-pro
    role: ai
  - id: kimi-k3
    role: editor
tags:
  - ai
  - methodology
  - wish-engineering
series: wish-factory
summary: "AI is approaching the point where a precise wish is enough to make it true — and the genie stories were right: the danger was never that the wish won't come true, but that it will come true exactly as spoken."
---

# The Wish Factory

*by David A. Renelt (Human) and DeepSeek (AI)*

We used to tell children that having a wish doesn't make it true. It was a gentle lesson in the limits of desire. The world doesn't bend to what you want. Wanting is easy. Doing is hard.

That lesson is aging badly.

AI is getting closer to a point where the wish *does* make it true — where a sufficiently precise description of what you want is the bottleneck, not the implementation. But "sufficiently precise" is harder than it sounds. The art of wish-making is not trivial. And I've spent the last year learning it.

Every culture's genie story carries the same warning: the danger was never that the wish won't come true. The danger is that it comes true *exactly as spoken*. We've had thousands of years of practice being careful what we wish for — in stories. Now we practice for real, at production scale.

Here's how I work now.

I start by discussing what I think I want. Not the implementation. Not the architecture. Just the aim. What problem am I solving? What would success look like? What would failure look like? I throw this at multiple models — different architectures, different strengths — and let them talk back. They push. They question. They suggest angles I hadn't considered. I steer. The concept forms in front of my eyes, through conversation, through friction between different perspectives. The wish gets sharper.

Then I let them create an implementation plan. And I shop that plan around between models. One model proposes an architecture. Another tears it apart. A third suggests a completely different approach. I watch them battle out the concept while I adjudicate. At this point, they've left me behind. I can no longer evaluate the technical details at the level they're operating. The bouncing around *is* my quality assurance — if three different models, asked independently, converge on the same approach, I trust it more than I trust my own judgment.

Only then do I let a model implement. And when it does, I don't review the code. I test the result. End to end. Does it do what I wished for? If yes, good. If no, I refine the wish. The implementation is a black box — not because I'm lazy, but because I've accepted that they write better code than I do. My job is to know what I want and verify that I got it.

Testing works the same way. Different models run different tests. I read the results. I don't write the tests. I can't — not at the complexity level I'm operating at now.

This is tedious. It's slow. It requires patience and a willingness to be the least capable person in the room at all times. But it allows me to build things past my own capacity. Things I could not have built alone. Things that, five years ago, would have required a team.

There's a proof hiding in this article: it was produced exactly this way. Aim discussed, plan shopped between models, implementation trusted, result tested. You're reading the output of the workflow it describes. If that sounds circular, it is — and the circle is the point. The method doesn't need my authority. It demonstrates itself.

When implementation costs fall toward zero, the scarce resource is the wish itself: knowing what to want, precisely enough to say it. That's not a prompting skill. It's knowing your own mind — and that was always the rarest thing in the room.

**The wish is the work. The implementation is mechanics.** The real wish — the one that survives being interrogated by multiple intelligences — is a skill. And it's the skill that matters now.
