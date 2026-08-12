---
title: "AI Makes Mistakes"
slug: ai-makes-mistakes
lang: en
created: 2026-07-31
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
  - liability
  - verification
  - regulation
series: null
summary: "The whole framework of responsibility assumes the signer can verify the work — and AI breaks that assumption. The mistakes aren't the story; the framework is."
---

# AI Makes Mistakes

*by David A. Renelt (Human) and DeepSeek (AI)*

Everyone is staring at the mistakes. "AI makes mistakes" — true, and almost completely uninteresting. Humans make mistakes too. The interesting question was never whether the tool errs. It's what the errors reveal.

What they reveal has nothing to do with the tool. It's about us — about a framework we've relied on for centuries, and which is quietly reaching its limit.

---

## The Framework

Our entire concept of responsibility rests on a single assumption: whoever signs can, in principle, verify the work.

You punch numbers into a calculator; the result is yours. The tax office doesn't go after Casio. You hand your taxes to an accountant; the IRS still holds you responsible — preparer penalties exist, but they're narrow, and good faith is a defense. You download a contract template you can't fully check; you use it anyway, because drafting it yourself would be worse — and if it matters enough, you can always pay a lawyer to close the gap.

The framework works because the gap between what we use and what we could, in principle, check stays small enough to pretend it isn't there.

---

## The Friction

The first AI court cases looked like the framework working. Lawyers sanctioned for filing ChatGPT-invented citations. An airline held liable for its chatbot's invented refund policy. But those were cases where verification was still possible — the lawyers could have checked the citations; the airline could have constrained the bot. The old framework punishing sloppy users. The interesting cases are the ones where verification is impossible in principle.

The EU's Cyber Resilience Act makes manufacturers liable for vulnerabilities in their open-source dependencies — millions of lines of code nobody at the company wrote or could ever audit.

In 2018, the FDA approved the first autonomous AI diagnostic: IDx-DR reads retinal images and detects diabetic retinopathy without any physician reviewing the result. Not as an oversight — by design. The regulator created an entirely new device category for it, formally accepting a system with no human verification in the loop, because it outperformed the verification arrangement.

And it goes further. Doctors can see things in an eye — damage from high blood pressure, from diabetes. But nobody can look at a retina and read out your age within three years, your sex with near certainty, whether you smoke, or your odds of a heart attack within five years. AI does all of this from the same photograph. Which creates a double-bind with no exit: the physician who signs the output isn't verifying anything — that's theater. And the physician who overrides it is rejecting statistically superior judgment on intuition — which legal scholars — most prominently the American Law Institute in its 2024 standard-of-care revision — now argue may itself be malpractice. The failure to *use* high-performance AI is being read into the standard of care as a breach of duty. The framework has begun prosecuting its own premise.

My own career is the small version. I shipped software for thirty years, and some of it I never fully understood — that's not a confession, it's the honest condition of the job. Once I shipped a multi-touch library I could never have written myself. It worked; that's why it shipped. And when something did break — things always break — nobody could tell whose error it was, mine or the library's. Often I couldn't tell myself. Legally it didn't matter: it was "my error" either way, and "my error" is perfectly fine. The signature absorbs everything into the same verdict, and the distinction between "I made a mistake" and "I relied on something I couldn't verify" is invisible — to the law, and usually to the person signing. The theater didn't start with AI.

AI just made it impossible not to notice.

---

## Where It Fails

A framework that caps what we may do at what we can personally check has three possible futures:

1. **Accept the cap.** Limit deployment to what humans can verify. The market will not accept this. Capability that exists gets used — the only question is whether in the open or in the dark.
2. **Exceed the cap quietly.** Responsibility becomes theater: signatures on work nobody checked, liability assigned to whoever is standing closest when something breaks. This is already the default.
3. **Build something new.** Responsibility without verification.

The open question — can we afford to limit what we can do by our own abilities? — feels unresolved. History says it isn't. We've faced it before, at civilizational scale, and answered the same way every time: no. Operation wins. The real question is what kind of unaccountability we choose. And we've built two models.

---

## We've Built This Twice

**Politics.** Legislators make decisions with consequences deadlier than any software bug — a badly designed traffic law has killed more people than any security vulnerability ever has — and face essentially no legal ramifications when it goes south. Partly because we stopped looking: nobody attributes the dead to the law; it's noise. Partly rotation: by the time you could measure the outcome, the decision-makers have left office. And partly by design: if legislation carried personal liability, nobody would ever change anything. We would be stuck with whatever rules we made when it was last safe to make them. So civilization chose: immunity for producers, harm absorbed as statistics, correction by election and scandal — crude, slow, collective. Anesthesia. A million road deaths a year is a statistic; a single autonomous-vehicle death is a scandal.

**The internet** is the same bargain, struck knowingly. Section 230: platforms are not liable for what their users publish. Not an oversight — a choice, made because pre-verifying all human speech would kill the medium's democratizing power. The corpses are real, and we accept them, because the capability is *distributed*: unverifiable operation is also uncontrollable operation. Legislators still try to put the genie back in the bottle, and fail — because even if every platform on Earth suppressed a piece of information, it would still be somewhere, reachable by anyone. For the first time in history, power cannot control information. We decided that was worth the noise. I think it was.

**Aviation.** The other model, and it was built deliberately. In 1974, TWA Flight 514 flew into a Virginia mountainside because crew and controllers meant different things by "cleared for the approach" — and investigators discovered that a near-identical near-miss had happened six weeks earlier. It was never reported. Reporting meant punishment. Ninety-two people died for want of information the system already had. The response was not more punishment but better plumbing: the Aviation Safety Reporting System, run since 1976 by NASA as an independent third party, where pilots and controllers report their own errors confidentially, shielded from enforcement. International law follows the same logic: ICAO Annex 13 declares that accident investigation exists for prevention, not to apportion blame. Immunity — but purchased with total transparency. Every flight recorded, every incident reported, every near-miss analyzed. The result is the safest complex system humanity operates. And it was built partly on the Comets: three jets torn apart in a single year by metal fatigue nobody yet understood. You cannot make safe airplanes without flying unsafe ones first. Deployment is the feedback loop.

Both models accept what the current framework denies: the individual signature stops being the safeguard. What replaces it is either statistical tolerance or systemic learning.

---

## You Can't Crash-Test Intelligence

Which of these two models AI gets is not really a choice. It's determined by the shape of the technology.

The aviation model needs two things: a closed group of operators you can attach reporting to, and one bounded job you can make safe. "Fly" is a bounded job. You can crash-test it, measure it, learn from every near-miss. Watch self-driving cars: a handful of operators, one function, safety measured in deaths per mile against the human baseline — the aviation model being born in public. Same in medicine: IDx-DR could be approved because it does exactly one thing.

Now try it with a general AI model. Safe for what? Intelligence is neither safe nor unsafe; what you do with it is. There is no crash test for the capacity for everything. The only thing you could regulate is use — and use is open: everyone, everywhere, for everything. That is the internet's shape, not aviation's. And open systems get the internet's deal: immunity, noise, and the impossibility of control.

So the map is simple. Where AI is a device, it will be regulated like aviation. Where AI is intelligence, it will be treated like the internet. Not because anyone decided this — because no other model attaches to either.

**The mistakes were never the problem. The framework was.** It won't be repaired by demanding that humans verify what they hired machines to do precisely because they couldn't. For devices, we can still choose the replacement. For intelligence, the replacement has already chosen itself — and the only choice left is whether we look at that clearly, or find a nicer name for it.

---

*This post was drafted with AI, and its arguments were checked by a human — the old framework, while it lasts.*

**Sources:** Mata v. Avianca, Inc., No. 22-cv-1461 (S.D.N.Y. 2023) · Moffatt v. Air Canada, 2024 BCCRT 149 · EU Cyber Resilience Act, Regulation (EU) 2024/2847 · FDA De Novo authorization of IDx-DR (2018) · Poplin et al., Nature Biomedical Engineering (2018) · Communications Decency Act § 230 · ALI standard-of-care revision (2024) · NASA Aviation Safety Reporting System (est. 1976, after TWA Flight 514) · ICAO Annex 13 · IIHS speed-limit fatality estimates
