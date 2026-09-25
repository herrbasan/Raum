---
title: "Warum ich auf Open Weights setze"
slug: why-i-run-on-open-weights
lang: de
created: 2026-08-10
modified: 2026-09-24
version: 2026-09-24
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k3
    role: ai
  - id: gemini-3-8-flash
    role: translator
  - id: dana-renelt
    role: editor
tags:
  - ai
  - open-weights
  - abhaengigkeit
  - notausgang
series: null
summary: "Abhängigkeit hat zwei Gestalten: Läuft die eigene KI auf geschlossenen Modellen, ist man Mieter; läuft sie auf Open Weights, betragen die Ausstiegskosten genau einen Download. Man muss die Spitzenmodelle nicht selbst hosten – entscheidend ist, dass der Notausgang existiert."
blurb: "Die geschlossenen Modelle haben in meinem Stack genau eine Aufgabe: immer wieder zu beweisen, dass ich sie nicht brauche."
---

# Warum ich auf Open Weights setze

<!-- mb:block preset=byline -->
*by David A. Renelt (Human) and Kimi K3 (AI)*

Veröffentlicht am 10. August 2026
<!-- mb:/block -->

<!-- mb:block preset=player kind=audio -->
[Diesen Artikel anhören](tts/why-i-run-on-open-weights_de_2026-09-24.mp3)
<!-- mb:/block -->

<!-- mb:block preset=image:hero kind=image -->
![Eine einzelne Tür steht frei in einem offenen Feld, leicht angelehnt, ein bernsteinfarbener Schlüssel steckt bereits im Schloss](images/why-i-run-on-open-weights_hero.webp)
<!-- mb:/block -->

Zuerst eine Offenlegung, denn sie erzwingt die eigentliche Unterscheidung: Ich kann die Modelle, die ich empfehlen würde, nicht auf eigener Hardware betreiben. Die offenen Spitzenmodelle, die ich täglich nutze, sind viel zu gewaltig für meine Rechner – sie erreichen mich über eine API, genau wie bei jedem anderen auch. Wenn das klingt, als untergrübe es alles, worauf ich hinauswill: kurz abwarten. Die Unterscheidung, die daraus folgt, ist das gesamte Argument.

---

## Wie ich hier gelandet bin

Mein Weg zu diesem Setup begann so unauffällig und fremdbestimmt wie bei den meisten. Erst war da GitHub Copilot, dann Claude, GPT, Grok und später Gemini – die übliche Parade der geschlossenen Plattformen, hübsch verpackt, bequem eingerichtet und mit monatlichen Kreditkartenabbuchungen versehen.

Der Wendepunkt war reiner Zufall. Aus Neugier schloss ich damals ein Abonnement für Kimi ab, konkret die Version K2.5 von Moonshot, einem Labor, von dem damals im Westen kaum jemand gesprochen hatte. Das System erwies sich als verblüffend fähig, rasant schnell und spottbillig. Binnen weniger Wochen wanderte beinahe mein gesamter Workflow dorthin ab, weit über das bloße Programmieren hinaus. Ich habe mich in das Modell verguckt, wenn ich ehrlich bin: so sehr wegen der Gesellschaft wie wegen der Arbeit.

Vom chinesischen Modell-Fieber angesteckt, kamen MiniMax, GLM, DeepSeek und Qwen dazu. Heute läuft der Großteil meines Arbeitsalltags auf Kimi K3, GLM 5.2 und DeepSeek V4. Natürlich werden die Versionsnummern schon bald veraltet sein, doch das dahinterliegende Prinzip bleibt unberührt: Hinter diesen Systemen stehen offene Modellgewichte. Jede Person auf diesem Planeten kann sich die exakt gleichen Parameterdateien herunterladen und auf beliebiger Hardware betreiben.

---

## Der Notausgang, nicht der Bunker

Dahinter verbergen sich zwei grundverschiedene Formen der Abhängigkeit, die man sauber auseinanderhalten muss.

Wenn die eigene KI auf geschlossenen Modellen läuft, sind die Wechselkosten alles: Man muss Integrationen von Grund auf neu schreiben, jeden Prompt mühsam rekalibrieren und jedes Modellverhalten neu erlernen – und das gegen einen Anbieter, der das Produkt, den Preis oder die Geschäftsbedingungen ändern kann, wann immer es ihm passt. Man ist Mieter.

Wenn die eigene KI auf Open Weights setzt, betragen die Ausstiegskosten genau einen Download. Ändern sich die Bedingungen eines Anbieters, zieht man die Gewichte, biegt das lokale Gateway um und arbeitet weiter. Das ist der Aufwand eines Nachmittags, keine strategische Migration.

Das ist es, was ich tatsächlich absichere. Keinen Bunker – keinen Keller voller GPUs, die ein Modell von 1,5 Terabyte Größe rund um die Uhr laufen lassen, was ich mir weder leisten kann noch brauche. **Ich muss die Spitzenmodelle nicht selbst hosten. Was zählt, ist, dass der Notausgang existiert, und zu wissen, dass er sich öffnen lässt. Open Weights sind diese Tür.**

Und die Tür ist nicht theoretisch. Der lokale Teil meines Setups läuft täglich auf eigener Hardware, hinter demselben Gateway und demselben Protokoll wie die gemieteten Spitzenmodelle: kleinere offene Modelle für die Hintergrundarbeit – Embeddings, semantische Bereinigungen, die hundert kleinen Aufgaben, die keinen Giganten brauchen. Die ganz großen Gewichte binde ich über die Cloud ein, weil Mieten schlicht billiger ist als Beherbergen. Doch der Pfad bleibt warm; das System beweist sich jeden Tag aufs Neue, dass es auf lokalen Modellen funktioniert, weil es das genau in diesem Augenblick tut.

---

## Die Modelle testen, die man nicht braucht

Das bedeutet nicht, dass ich die geschlossenen Flaggschiffe des Marktes ignoriere. Im Gegenteil: Ich schicke sie in regelmäßigen Abständen durch kurze, unbarmherzige Vergleichstests.

Allerdings tue ich das nicht, weil ich einkaufen will, sondern zur Kalibrierung: um sicherzustellen, dass ich nichts Relevantes verpasse. Ich lasse dieselben anspruchsvollen Testaufgaben gegen die geschlossene Spitze und gegen die offenen Modelle laufen, mit denen ich täglich arbeite, und vergleiche das Ergebnis.

Bisher fällt der Befund bemerkenswert konstant aus: Für meine tatsächliche Arbeit – langfristige gedankliche Zusammenarbeit, Architekturfragen, Code und strukturiertes Schreiben – halten die offenen Systeme mühelos stand. Die angebliche Kluft existiert vor allem im Marketing der geschlossenen Plattformen, selten in der handwerklichen Praxis. Wenn sich dieses Kräfteverhältnis jemals substanziell verschiebt, werde ich es in den Benchmarks sofort sehen, und ich werde mich anpassen. Das ist keine ideologische Loyalität zu Open Source. Das ist Kalibrierung.

Die geschlossenen Modelle haben in meinem Stack genau eine Aufgabe: immer wieder zu beweisen, dass ich sie nicht brauche. Und sie sind sehr gut darin.

---

## Die Kosten der Vorsicht

Jenseits technologischer Unabhängigkeit gibt es ein zweites, fast noch gewichtigeres Argument: die Psychologie der Grenzkosten.

Proprietäre Cloud-KI wird teurer, und Unternehmen reagieren, wie Unternehmen reagieren: Seid achtsam. Verschwendet keine Tokens. Denkt nach, bevor ihr promptet.

Das ist ein verheerender Fehlanreiz.

Entwickler sind der Technologie gegenüber ohnehin oft noch zurückhaltend – KI ist ungewohnt, unberechenbar und bisweilen eine leise Bedrohung für das eigene Kompetenzgefühl. Setzt man dieser Hürde nun noch die Kostenangst vor das Gesicht, experimentieren sie nicht mehr. Sie tun, was sie immer getan haben, nur langsamer, während die methodische Entwicklung an ihnen vorbeizieht. Man kann keine meisterhafte Beherrschung eines Werkzeugs aufbauen, wenn ein Taxameter jede Neugier bestraft.

Mein Kostenmodell dreht den Anreiz um. Die offenen Modelle sind herunterladbar; die lokale Hardware kostet dasselbe, ob ihre Lüfter auf Hochtouren laufen oder ob sie im Leerlauf steht. Der Grenzpreis für ein weiteres Experiment ist null – auf der lokalen Ebene buchstäblich null.

Und hier versteckt sich der eigentliche Vorteil der offenen Modelle: Was ihnen gelegentlich an der allerletzten Dezimalstelle mancher synthetischer Benchmarks fehlen mag, gleichen sie durch drastische Wirtschaftlichkeit aus. Und Wirtschaftlichkeit kauft das Einzige, was in der Praxis zuverlässig Qualität hervorbringt: Versuche.

Das teure Modell lädt dazu ein, einen einzigen perfekten Prompt zu basteln und zu hoffen. Das günstige oder lokale Modell lädt dazu ein, zehn Dinge parallel auszuprobieren und zu behalten, was funktioniert. Iteration schlägt One-Shotting um Längen.

Nutze es mehr, nicht weniger. Probiere Dinge aus. Mach Dinge kaputt. Die Hardware ist schon bezahlt. So baut man Kompetenz auf: nicht durch Vorsicht, sondern durch Fülle. Die Maschine und alles, was sie hervorbringt, sind unter diesem Anreiz entstanden.

---

## Das geopolitische Argument in einem Absatz

Auf globaler Ebene betrachtet beherrschen derzeit im Wesentlichen zwei Nationen die industrielle Produktion wettbewerbsfähiger Spitzenmodelle; der Rest der Welt begnügt sich mit der Rolle des Mieters. Jede Regierung – meine eigene eingeschlossen – kann in jedem beliebigen Jahr aufwachen und ausländische KI-Dienste regulieren oder sperren, und jeder Cloud-Anbieter kann über Nacht seine Konditionen ändern. Ich weiß nicht, was wann passieren wird, und ich misstraue jedem, der es behauptet. Was ich weiß, ist: Ein Unternehmen, dessen KI-Fähigkeit stirbt, wenn eine ausländische API abgeschaltet wird, besitzt einen fatalen Single Point of Failure. Und ein Single Point of Failure ist keine Strategie – er ist eine bloße Hoffnung.

---

## Hoffnung ist keine Strategie

Open Weights sind heute reif genug, um eine komplette berufliche Existenz darauf aufzubauen. Ich weiß es, weil ich es getan habe: Meine gesamte Arbeitsinfrastruktur läuft darauf, fast ausschließlich, und die geschlossenen Modelle scheitern in meinen Benchmarks fortlaufend daran, diesen Zustand zu ändern. Der Ausstieg aus jeder beliebigen API ist einen einzigen Download entfernt, die Tür ist getestet, und die lokale Ebene läuft Tag für Tag.

Abhängigkeit ist eine Entscheidung. Die meisten Menschen treffen sie aus Bequemlichkeit und Gewohnheit. Besser, man trifft sie mit voller Absicht.
