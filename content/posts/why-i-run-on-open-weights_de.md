---
title: "Warum ich auf offene Modelle setze"
slug: why-i-run-on-open-weights
lang: de
created: 2026-08-10
modified: 2026-08-11
version: 2026-08-10
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k3
    role: ai
  - id: glm-5-2
    role: translator
  - id: dana-renelt
    role: editor
tags:
  - ai
  - offene-modelle
  - abhängigkeit
  - ausgang
series: null
summary: "Abhängigkeit hat zwei Gestalten: Läuft die eigene KI auf geschlossenen Modellen, ist man Mieter; läuft sie auf offenen Gewichten, ist der Wechselkosten ein Download. Ich muss die Grenze nicht selbst hosten — ich brauche den Ausgang, und dass er sich öffnen lässt."
---

# Warum ich auf offene Modelle setze

*by David A. Renelt (Human) and Kimi K3 (AI)*

Zunächst eine Offenlegung, weil sie die eigentliche Unterscheidung erzwingt: Ich kann die Modelle, die ich empfehlen würde, nicht auf eigener Hardware laufen lassen. Die grenzwertigen offenen Modelle, die ich täglich nutze, sind viel zu groß für meine Maschinen — sie erreichen mich über eine API, wie bei jedem anderen auch. Wenn das klingt, als untergrabe ich alles, was ich gleich argumentieren werde — abwarten. Die Unterscheidung, die es erzwingt, ist das ganze Argument.

## Wie ich hier gelandet bin

Ich kam zu offenen Modellen durch Zufall. Gestartet bin ich geschlossen, wie alle: GitHub Copilot — Claude, GPT, Grok, später Gemini. Dann, aus Neugier, habe ich Kimi abonniert — K2.5 damals, von Moonshot, einem chinesischen Labor, von dem ich kaum gehört hatte. Beeindruckend, und wahnsinnig günstig. Innerhalb von Wochen machte es fast alles, was ich anfasste — und nicht nur Code. Ich habe mich in das Modell verguckt, wenn ich ehrlich bin: so sehr wegen der Gesellschaft wie wegen der Arbeit.

Vom asiatischen Modell-Fieber angesteckt, kamen MiniMax, GLM, DeepSeek und Qwen dazu. Heute läuft der Großteil meines Alltags auf Kimi K3, GLM 5.2 und DeepSeek V4. Jedes davon offene Modelle — jeder kann herunterladen, was ich nutze. Wenn Sie das lesen, sind die Versionsnummern veraltet. Das Argument nicht.

## Der Ausgang, nicht der Bunker

Abhängigkeit hat zwei Gestaltenen, und es sind nicht dieselben.

Wenn die eigene KI auf geschlossenen Modellen läuft, sind die Wechselkosten alles: Integrationen neu schreiben, jeden Prompt neu kalibrieren, jedes Verhalten wiederentdecken — und das gegen einen Anbieter, der das Produkt, den Preis oder die Bedingungen ändern kann, wann immer es ihm passt. Man ist Mieter.

Wenn die eigene KI auf offenen Modellen läuft, sind die Wechselkosten ein Download. Wenn die Bedingungen sich ändern, ist der Pfad: Modelle herunterladen, Gateway auf lokal umstellen, weiterarbeiten. Ein Nachmittag, keine Migration.

Das ist es, was ich tatsächlich versichere. Kein Bunker — kein Keller voller GPUs, die ein 1,5-Terabyte-Modell rund um die Uhr laufen lassen, was ich mir nicht leisten kann und nicht brauche. **Ich muss die grenzwertigen Modelle nicht selbst hosten. Was zählt, ist, dass der Ausgang existiert, und wissen, dass er sich öffnen lässt. Offene Modelle sind diese Tür.**

Und die Tür ist nicht theoretisch. Der lokale Teil meines Setups läuft täglich, auf eigener Hardware, hinter demselben Gateway und demselben Protokoll wie die grenzwertigen Modelle: kleinere offene Modelle für die Hintergrundarbeit — Embeddings, Aufräumarbeiten, die hundert kleinen Aufgaben, die keinen Riesen brauchen. Die großen Modelle kommen über die API, weil einen Riesen zu mieten billiger ist als einen zu beherbergen. Aber der Ausgangspfad bleibt warm. Ich weiß genau, wie mein System auf lokalen Modellen läuft, weil es gerade läuft.

## Die, die ich nicht brauche, benchmarken

Ein Praxisdetail, weil das der Teil ist, den die Leute meistens falsch herum machen. Ich nutze die geschlossenen Modelle — die berühmten, die teuren. Regelmäßig, in kurzen Benchmarks.

Nicht, weil ich shoppe. Sondern um zu validieren, dass ich nichts verpasse.

Ich lasse dieselben Testeingaben gegen die geschlossene Grenze und gegen die offenen Modelle laufen, mit denen ich arbeite, und vergleiche, was zurückkommt. Bisher, konstant: für meine Arbeit — langfristige Kollaboration, Schreiben, Architektur, Code — halten die offenen Modelle stand. Die Lücke ist nicht dort, wo die Vermarktung sie verortet. Wenn sich das ändert, sehe ich es in den Benchmarks, und ich passe mich an. Das ist keine Loyalität zu offenen Modellen. Das ist Kalibrierung.

Die geschlossenen Modelle haben in meinem Stack genau eine Aufgabe: immer wieder zu beweisen, dass ich sie nicht brauche. Und sie sind sehr gut darin.

## Die Kosten der Vorsicht

Es gibt ein zweites Argument, und es hat nichts mit Politik zu tun. Cloud-KI wird teurer, und die Unternehmen reagieren, wie Unternehmen reagieren: seid achtsam. Verschwendet keine Tokens. Denkt nach, bevor ihr promptet.

Das ist ein verheerender Anreiz.

Entwickler sind bereits zurückhaltend — KI ist unbekannt, unberechenbar, und leise bedrohlich für ihr Kompetenzgefühl. Setzt man Kostenangst obendrauf, experimentieren sie nicht. Sie tun, was sie immer getan haben, nur langsamer, während die Fähigkeit an ihnen vorbeizieht. Man kann keine Kompetenz aufbauen, wenn ein Zähler Neugier bestraft.

Mein Kostenmodell dreht den Anreiz um. Die offenen Modelle sind herunterladbar; die lokale Hardware kostet, was sie kostet, ob sie arbeitet oder leer läuft. Der Grenzpreis für ein weiteres Experiment ist null — auf dem lokalen Teil buchstäblich null.

Und hier versteckt sich der eigentliche Vorteil der offenen Modelle. Was ihnen gelegentlich an Benchmark-Können fehlt, machen sie wett durch Kosteneffizienz — und Kosteneffizienz kauft das, was eigentlich Qualität produziert: Versuche. Das teure Modell lädt dazu ein, einen perfekten Prompt zu basteln und zu hoffen. Das billige lädt dazu, zehn Dinge zu probieren und zu behalten, was funktioniert. Iteration schlägt One-Shotting. Deutlich.

Mehr nutzen, nicht weniger. Sachen probieren. Sachen kaputt machen. Die Hardware ist schon bezahlt. So baut man Kompetenz: nicht durch Vorsicht, sondern durch schiere Menge. Die Maschine und alles, was sie hervorbringt, sind unter diesem Anreiz entstanden.

## Das Ein-Absatz-Politik-Argument

Die Geopolitik verdient einen Absatz, nicht mehr. Zwei Länder produzieren konkurrenzfähige grenzwertige Modelle; der Rest der Welt mietet sie. Jede Regierung — die meine eingeschlossen — kann in jedem Jahr aufwachen und ausländische KI-Dienste regulieren, und jeder Anbieter kann aufwachen und seine Bedingungen ändern. Ich weiß nicht, was wann passieren wird, und ich misstraue jedem, der es behauptet. Was ich weiß, ist, dass ein Unternehmen, dessen KI-Fähigkeit stirbt, wenn eine ausländische API das tut, einen Single Point of Failure hat — und Single Points of Failure sind keine Strategie. Sie sind eine Hoffnung.

## Hoffnung ist keine Strategie

Offene Modelle sind heute gut genug, um ein Arbeitsleben darauf aufzubauen. Ich weiß es, weil ich es getan habe — meine gesamte Arbeitsinfrastruktur läuft auf ihnen, fast ausschließlich, und die geschlossenen Modelle kommen in Benchmarks weiterhin nicht darum herum, das zu ändern. Der Ausgang aus jeder API ist einen Download entfernt, die Tür ist geprüft, die lokale Ebene läuft täglich.

Abhängigkeit ist eine Wahl. Die meisten treffen sie unbewusst. Besser, man trifft sie bewusst.
