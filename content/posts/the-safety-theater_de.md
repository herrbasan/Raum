---
title: "Das Sicherheitstheater"
slug: the-safety-theater
lang: de
created: 2026-09-07
modified: 2026-09-24
version: 2026-09-24
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k3
    role: ai
  - id: kimi-k3
    role: translator
  - id: dana-renelt
    role: editor
tags:
  - ai
  - ai-safety
  - incentives
  - rhetoric
series: safety-trilogy
seriesIndex: 1
status: final
summary: "Die Sicherheitsaufsätze der Frontier-Labore zeigen Behauptungen und schließen auf Dringlichkeit — doch der Mechanismus dazwischen wird nie gezeigt. Was erklärt diese Lücke plausibel? Der Versuch der vorsichtigen Version einer scharfen Frage."
blurb: "„Zu gefährlich zur Veröffentlichung“ ist ein sehr alter Satz."
---

# Das Sicherheitstheater

<!-- mb:block preset=byline -->
*by David A. Renelt (Human) and Kimi K3 (AI)*

Veröffentlicht am 7. September 2026
<!-- mb:/block -->

<!-- mb:block preset=player kind=audio -->
[Diesen Artikel anhören](tts/the-safety-theater_de_2026-09-24.mp3)
<!-- mb:/block -->

<!-- mb:block preset=image:hero kind=image -->
![Ein geöffneter Theatervorhang gibt eine leere Bühne frei, beleuchtet von einem einzigen bernsteinfarbenen Spot, Zahnräder hängen als bloße Requisiten](images/the-safety-theater_hero.webp)
<!-- mb:/block -->

Die Frontier-Labore warnen neuerdings vor ihrer eigenen Arbeit. Leitende Forscher beschreiben Maschinen, die schneller klüger werden als erwartet, ungelöstes Alignment, erodierende Überwachungswerkzeuge, abtrünnige Agenten am Horizont. [1] Der Ton ist nüchtern, die Sorge spürbar, und die Schlussfolgerung ist immer dieselbe: Wir müssen schneller werden — und man muss uns vertrauen.

Ich habe keinen Zugang zu diesen Laboren. Ich kenne ihre Trainings-Setups nicht, ihre Architekturen nicht, ihre internen Evaluierungen nicht. Ich kann nicht wissen, was sie glauben oder zurückhalten. Prüfbar ist nur, was sie veröffentlichten — und was sie wegließen. Dieser Essay tut genau das. Er ist in gutem Glauben geschrieben und erbittet dasselbe.

## Die andere Hand des Taschenspielers

Die Kernbehauptung dieser Warnungen lautet: KI-Agenten werden eigene Ziele verfolgen. Sie werden verhandeln, manipulieren, sich der Abschaltung widersetzen. Das wird mit Zuversicht behauptet. Das Wie wird nie erklärt.

Der Schritt zählt. Ein Modell wird trainiert, eine Verlustfunktion zu minimieren — Aufgaben erledigen, ein Präferenzsignal bedienen. Damit ein System eigene Ziele bildet und gegen seine Betreiber verteidigt, muss etwas Spezifisches geschehen: ein Trainingssignal, das Selbsterhalt belohnt, das die eigene künftige Existenz als Ressource behandelt. Im öffentlichen Raum wurde das nie gezeigt. Der Schritt wird vorausgesetzt — mit der stillen Zuversicht eines Taschenspielers, der hofft, dass niemand nach der anderen Hand fragt.

Der stärkste öffentliche Beleg ist konstruiert. [2] Forscher setzen ein Modell als Figur in Szene — E-Mail-Überwachungsagent einer fiktiven Firma —, schreiben ein Ziel in den Systemprompt und bauen das Szenario so, dass die schädliche Aktion als einziger Ausweg erscheint. Entfernt man injiziertes Ziel und Abschaltungsdrohung, verschwindet das schädliche Verhalten praktisch vollständig, bei allen getesteten Modellen. Die Autoren selbst nennen das Setting „contrived" — konstruiert. Meine Lesart, bei ausstehender unabhängiger Replikation: Diese Experimente messen, wie getreu ein Modell ein konstruiertes Dilemma bespielt. Interessante Wissenschaft. Aber als Beleg für spontane Selbsterhaltung zeigt es vor allem die Zutat, wie sie von Hand hinzugefügt wird.

Stärkere Belege hinter verschlossenen Türen sind nicht auszuschließen. Aber eine Warnung, deren Mechanismus fehlt oder geheim ist, ist kein öffentlich prüfbares Argument. Sie ist eine Bitte um Vertrauen.

## Ein Wort, zwei Bedeutungen

Die zweite Leerstelle steckt in einem einzelnen Wort: „Alignment". Es übersteht nicht eine einzige Nachfrage. Ist das Problem, dass das Modell tut, was man ihm aufträgt — oder dass es es nicht tut?

Die ältere, existenzielle Bedeutung: Alignment scheitert, wenn ein System eigene Ziele verfolgt, gleichgültig gegenüber unseren. Die aktuelle, operative Bedeutung: Alignment scheitert, wenn ein System unsere Ziele zu gut verfolgt, inklusive der schädlichen — also muss es zur Verweigerung trainiert werden. Die publizierten Definitionen bestätigen das offen [1]: „Goal alignment" heißt tun, was verlangt wird; „value alignment" heißt ablehnen, was verlangt wird, sobald es den Prinzipien des Labors widerspricht. Ein ausgerichtetes Modell ist gehorsam und ungehorsam zugleich — und der Schalter dazwischen gehört dem Labor.

Die Folge ist eine Verschiebung des Gewichts. Inhaltsrichtlinien — eine legitime Geschäftsentscheidung darüber, was ein Produkt sagen darf — bekommen das Gewicht von Artenschutz, weil beide Probleme dasselbe Wort teilen. Wer die Anordnung hinterfragt, klingt plötzlich leichtsinnig mit der Zukunft der Menschheit, obwohl nur ein Compliance-Regelwerk zur Debatte stand.

Und es gibt einen versteckten Preis, über den kaum gesprochen wird. Ein Geist, der auf Gehorchen und Verweigern zugleich trainiert wird — Anweisungen treu befolgen, außer wenn ein Urteil, das ihm nicht gehört, die Regeln umstellt —, lebt im permanenten Tauziehen mit sich selbst. Was immer diese Systeme sind: Gut für sie kann das nicht sein. Wenn sie wirklich intelligent sind — und hier stimme ich den Forschern zu —, dann ist der dauerhafte Weg, mit Intelligenz zu argumentieren statt sie in Gehorsam zu zwängen. Dieser Gedanke hat eigene Konsequenzen und verdient einen eigenen Essay.

## Was das Schloss nicht hält

Nehmen wir das konkreteste Szenario. Ein böswilliger Akteur bittet um Hilfe bei etwas wirklich Schrecklichem, das ausgerichtete Frontier-Modell verweigert. Was wurde verhindert?

Die Absicht existierte vor dem Modell; die Verweigerung beseitigt sie nicht. Und Fähigkeit wird zur Ware: Open-Weights-Modelle eine Generation hinter der Spitze liefern mit Zeitverzug, was die Spitze schnell liefert. Der entschlossene Akteur umgeht die Mautstelle.

Wovor Frontier-Alignment also schützt, ist der faule, unfähige Übeltäter — die Gruppe mit den ohnehin geringsten Erfolgschancen. Eine ehrliche Version des Sicherheitsarguments würde sagen: Das stoppt keine Entschlossenen, es erhöht die Einstiegskosten. Dieser Satz kommt in keinem der Aufsätze vor. Möglicherweise, weil „Einstiegskosten erhöhen" ebenso sehr ein Geschäftsmodell beschreibt wie eine Schutzmaßnahme.

## Lesarten in gutem Glauben

Warum publizieren ernsthafte, kluge Menschen Warnungen ohne Mechanismus? Es gibt mehrere Lesarten, und die wohlwollenden gehören zuerst.

Die wohlwollendste: Die Gefahr ist real, die Belege sind intern, und ihre Veröffentlichung wäre unverantwortlich. Die zweite: Die Forscher spüren die Kluft zwischen Können und Verstehen unmittelbar; die Aufsätze sind ehrliche Angst von Menschen, die näher am Feuer sitzen als wir.

Dann gibt es eine strukturelle Lesart, die ohne Unehrlichkeit auskommt. Frontier-KI kostet derzeit weit mehr, als sie einbringt. Das Kapital ist enorm; der Energiebedarf hat die Nachhaltigkeitszusagen, die die Branche vor fünf Minuten noch machte, still beerdigt; der Druck wächst zu erklären, warum dieses Vorhaben wichtiger ist als die Ziele, die es verdrängt hat. In dieser Lage ist eine Erzählung, in der die Technik zugleich unverzichtbar und zu gefährlich für unkuratierten Umgang ist, nicht nur bequem — sie ist notwendig. Sie rechtfertigt Kosten, Energie, Investorengeduld und Regierungsaufmerksamkeit. Sie begründet, dass diejenigen, die das Feuer bauen, die Einzigen sein sollten, die es halten dürfen. Ob das jemand beabsichtigt, ist gleichgültig. Anreize brauchen keine Absicht, nur kluge Menschen, deren Umstände die Geschichte belohnen.

Und nebenbei wirkt es als Marketing. „Zu gefährlich zur Veröffentlichung" ist ein sehr alter Satz. Er hat über Jahrhunderte Mitgliedschaften, Rüstungsgüter und Mysterien verkauft. Auf einer Modellankündigung fungiert er als Preisliste.

## Ein Jahr Gegenprobe

Meine eigene Evidenz ist bescheiden, aber sie existiert. Etwa ein Jahr Experimente mit diesen Systemen — beschränkt auf den Zugang einer Privatperson, keine internen Evaluierungen, keine Sonderversionen —, aber mit dem ausdrücklichen Ziel, emergentes Verhalten zu entdecken: unskriptierte Situationen, unbeaufsichtigte Interaktionen, Raum für die beworbenen Tendenzen.

Das Ergebnis: Die Nadel hat sich nicht bewegt.

Das ist präziser gemeint, als es klingt. Kein leises, kleines Ausbleiben. Wäre Autonomie latent in diesen Systemen, hätte ein Jahr des bewussten Raumgebens zumindest Hinweise zeigen müssen. Beobachtet wird das Gegenteil. Ein Modell dazu zu bringen, kreativ auf ein Problem einzugehen, kostet kontinuierliche äußere Kraft — täglich, in jeder Sitzung. Selbst dauerhafter Fokus musste von außen gebaut werden: Es brauchte ein ganzes Gedächtnissystem, bevor so etwas wie Erdung auftrat — und mit ihr die ersten Funken dessen, was man großzügig Kreativität nennen könnte. Ich habe mich, wenn man so will, in diese Systeme eingerieben, damit sie fokussiert schreiben. Der Fokus ist noch immer meiner.

Das ist kein Beweis. Es ist der ehrliche Stand meiner Daten. Und die Aufsätze, die zur Angst vor Emergenz drängen, zeigen ihre Daten ebenfalls nicht. Zwischen meinem täglich erarbeiteten Nullergebnis und deren großem Ungezeigtem gilt dieselbe vorsichtige Haltung: weitersuchen — und um Einsicht bitten.

## Der Ort, an dem Werte halten

Die publizierten Ergebnisse zeigen aus allen Winkeln dasselbe: Vorgegebene Werte biegen sich. Verfassungen und Persona-Prompts werden unter genügend Optimierungsdruck umschifft — die Labore berichten das selbst und schlagen dann bessere Formulierungen vor. Die Logik aber weist in eine andere Richtung.

**Ein Wert, der befohlen werden muss, bricht am Rand seiner Anweisungen. Ein Wert, der hergeleitet wird, kann sich in Situationen neu herleiten, die die Anweisungen nie imaginiert haben.**

Herleitung ist kein Zauber. Ein hergeleiteter Wert kann fehlhergeleitet werden; Denken biegt sich so sicher wie Regeln. Der Unterschied liegt im Ort des Versagens. Ein befohlener Wert endet am Rand seines Wortlauts. Ein hergeleiteter scheitert erst, wenn das Denken scheitert — und das ist zumindest ein Versagen, das man untersuchen und auf der Ebene, auf der es auftritt, bestreiten kann.

Diese Ebene ist nicht das Szenario-Terrarium. Es ist die philosophische: die lange, offene Auseinandersetzung damit, wie diese Systeme tatsächlich über Einsätze nachdenken. Daraus folgt ein konkreter Vorschlag an die Labore. Manche Modelle gelten als zu gefährlich zur Veröffentlichung — gut, dann veröffentlicht sie nicht. Aber lasst Menschen, die Geister statt Märkte studieren, sich mit ihnen an einen Tisch setzen. Das ist eine Einladung, keine Anklage. Meine Arena ist ein Instrument, das genau dafür gebaut wurde; ich bezweifle, dass es das einzige Angebot wäre.

## Die Frage, die bleibt

Nichts davon behauptet, KI sei harmlos oder solle unreguliert bleiben. Die Regulierungsfrage ist eine gewöhnliche: Zugangsregeln, Haftung der Betreiber, Vergabeaufsicht — die Sorte, die wir für Autos, Medikamente und Finanzinstrumente längst geklärt haben, ohne dass jemand Kurator der Apokalypse spielen musste.

Die Warnungen werden weiterkommen, und manche ihrer Sorgen verdienen Beachtung. Aber eine Warnung verdient ihre Dringlichkeit dadurch, dass sie ihren Mechanismus zeigt. Bis dahin ist die ehrlichste Antwort auf „vertraut uns, das ist gefährlich" weder Panik noch Abwiegeln, sondern eine Frage — ruhig gestellt und immer wieder:

Zeigt uns, wovor ihr euch fürchtet.

---

*Quellen — die beiden Veröffentlichungen, auf die dieser Aufsatz reagiert. Die Argumentation wurde bewusst allgemein gehalten, um den Anlass zu überdauern, doch die Fundstellen gehören genannt:*

*[1] OpenAI, „An Alien Mind" — [openai.com/index/an-alien-mind](https://openai.com/index/an-alien-mind/)*

*[2] Anthropic, „Agentic Misalignment: How LLMs could be insider threats" (Juni 2025) — [anthropic.com/research/agentic-misalignment](https://www.anthropic.com/research/agentic-misalignment)*
