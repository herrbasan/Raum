---
title: "When Code Is No Longer the Product"
slug: when-code-is-no-longer-the-product
lang: en
created: 2026-10-29
modified: 2026-10-30
version: 2026-10-30
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k31-pro
    role: ai
tags:
  - ai
  - software-development
  - philosophy
series: null
status: final
summary: "If AI makes implementation abundant, development's value may shift from selling code to stewarding working capabilities. A bet on development as a service in an economy where software increasingly acts in the real world."
---

# When Code Is No Longer the Product

<!-- mb:block preset=byline -->
*by David A. Renelt (Human) and Kimi K3.1 Pro (AI)*
<!-- mb:/block -->

Published at 2026-10-30

<!-- mb:block preset=player kind=audio -->
[Listen to this article](tts/when-code-is-no-longer-the-product_2026-10-30.mp3)
<!-- mb:/block -->

<!-- mb:block preset=image:hero kind=image -->
![A pile of identical gray keys beside one amber key opening a door](images/when-code-is-no-longer-the-product_hero.webp)
<!-- mb:/block -->

*A bet on development as a service*

I love building things. In that respect, AI is a dream come true: I can build more, better, and faster. Most of what I build, I build primarily for myself. The day job supplies the money that makes the rest possible.

I do not expect the day job to disappear tomorrow. Giants die slowly; mine will probably last until I retire. But I talk to other developers all day, and the sense of doom is getting heavier.

The open question is whether the decades spent learning to code and getting better at it are worthless now.

For some, perhaps. For most, I do not think so. But we have to be precise about what remains valuable. Producing syntax is not the same as understanding a problem, recognizing a bad design, anticipating failure, or knowing whether the result actually works. Many developers learned those things even when their jobs reduced them to producing tickets. The implementation was priced; the judgment came along unnoticed.

If implementation is no longer scarce, where does the value of development go?

I have a hunch, not a settled answer. AI's economic impact has only started to unfold, and anyone offering a complete map is drawing countries they have not visited. But some consequences can be reasoned through.

Code still has value, but it is losing scarcity. Software was always there to serve needs beyond itself: producing goods, delivering services, communicating, designing, entertaining. It cannot remain an economy of layers selling ever more layers to other layers. When implementation becomes abundant, every layer has to answer a plainer question: what outcome beyond software does this make possible?

[ArtCraft](../references/artcraft.md) offers a glimpse of the change. A small team used AI to construct open-source creative applications from the visible behavior of Adobe's tools and public format specifications. The applications are still alpha, not replacements for the Adobe products they resemble. But they already demonstrate that a feature list and its implementation are becoming reproducible. The code still does the work; it simply stops being much of a moat.

The value shifts to what somebody can do with the software: whether it fits their files, hardware, habits, and actual work. Competition becomes an economy of fitness.

## The bet

My hunch is that development becomes a service: making a system work in somebody else's reality rather than selling implementations as though each line were a possession.

A product might offer document ingest, a chat interface, an API, and local runtimes for embeddings and inference. That is useful machinery, but it is not yet a working RAG system for a particular customer. Somebody still has to integrate it with real documents, existing systems, available hardware, permissions, and expectations—and keep it working as those things change. The product supplies the parts and the assembly. Development supplies the outcome.

Real-world automation makes the same distinction visible. Generated control code is only the beginning. Somebody has to understand the physical process, connect machines and sensors, account for their failure modes, and make the whole operation safe and dependable. The result is not an application. It is a part that gets made, a package that arrives, a machine that stops when it must. The physical world is unimpressed by the elegance of the repository.

Service does not mean selling hours while calling them consulting. It means selling a working capability. The customer does not need more code; the customer needs something that can be relied upon.

Integration is not a permanent refuge. AI will automate parts of that too. The bet is not that integration remains a human job forever. It is that the unit of value changes from the implementation to the outcome, and that somebody who can take responsibility for the whole outcome will still have something worth offering.

## Preparing machines to act

Development now serves what can be done with AI: using it to build, and building the machinery through which it acts. This still requires a lot of software. Increasingly, its purpose is to prepare AI to act in the world.

That means more than managing existing processes better. It means replacing human labor with machines where machines can do the work: producing the same or more with fewer human hours. This is uncomfortable, especially for the people whose work is being replaced. It is also inescapable. The social ramifications will have to be addressed, but they are not this project's subject. Our project here is a vision for developers.

For developers, the consequence is direct: do not define the work as producing code. Define it as making something happen. Code is part of the machinery, often a large and difficult part, but the machinery exists for the outcome.

## Where the product fits

This does not make products disappear. A product can supply the parts and a coherent assembly. Development makes that assembly useful in a particular environment and keeps it fit as the environment changes.

The parts can be open source. Treat repositories as libraries of knowledge: inspect them, take what serves the problem, adapt it, improve it, and publish what others can learn from. The finished assembly and UI can remain closed when the business needs that boundary. Not because nobody could reconstruct them—AI makes that assumption increasingly weak—but because the product is the particular result I choose to offer and stand behind.

**The business is not secrecy. It is stewardship.**

That stewardship has to show up in the product. Development needs to be fast so the offering can iterate and continuously improve. Better is not merely more features. Better means more reliable, faster at a lower resource cost, and easier to use. A small team cannot outspend a giant, but it can make something that fits the work better and improve it without asking an entire organization for permission.

My own way of aiding that bet predates AI: build direct, understandable systems. Avoid dependencies unless genuine infrastructure or missing expertise justifies them. Skip frameworks and utility libraries; use open source as knowledge, not as an excuse to stop thinking. Choose the lowest-level language I am comfortable verifying—currently Rust for me. Prefer small APIs to speculative abstractions, tools and hard constraints to prescriptive AI harnesses, and clear ownership to coordination. These are not the article's commandments. They are useful because they make software easier to change, cheaper to run, and possible for one person or a small team to carry whole.

The wager is not that code becomes worthless, that integration remains human forever, or that open source pays by magic. It is that outcomes remain valuable when implementations become abundant. Build the machinery. Open what others can learn from. Sell a capability that works. Stand behind what happens next.


---

### Sources

- [PhotoCraft source repository and project documentation](https://github.com/storytold/photocraft), including its clean-room description and early-alpha status.
- Ars Technica, [“Software is over”: Bold AI developer takes aim at Adobe with open source clones](https://arstechnica.com/ai/2026/10/software-is-over-bold-ai-developer-takes-aim-at-adobe-with-open-source-clones/), October 2026.
