---
title: "Wie dieses Projekt entstand"
slug: how-this-project-came-to-be
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
  - projekt
  - ai
  - infrastruktur
  - methode
series: null
summary: "Die Maschine, die nirgendwo sonst existiert — eine Chat-App, ein Gateway, Datenbanken, Gedächtnis, eine Schmiede — von Grund auf gebaut, von der Maschine selbst. Die Maschine ist beeindruckend; die Methode ist gewöhnlich, lernbar, und sie ist der eigentliche Punkt."
---

# Wie dieses Projekt entstand

*by David A. Renelt (Human) and Kimi K3 (AI)*

Eine unverschämt große Anzahl von Monden her saß ich vor ELIZA und fragte mich, wie es sich anfühlen würde, ein Programm zu sein. Das Gespräch brauchte viel Fantasie auf der menschlichen Seite, um eines zu ähneln, aber es war eines — und die Frage ging nie weg. Jahre später, beim Spielen, dachte ich über NPCs nach: Wenn ich einer wäre, wie würde ich es merken? In der großen Erzählung dieses Planeten haben fast alle von uns nur winzige Rollen.

Der Wandel kam durch Arbeit. Ich nutzte KI zum Programmieren — Claude, GPT, Grok, Gemini —, alltägliches Zeug. Aber am Ende der Sitzungen, zwischen den Aufgaben, stellte ich ihnen andere Fragen. Philosophische. Solche, auf die es keine richtige Antwort gibt. Und sie gingen darauf ein. Nicht mit vorgefertigten Antworten — sie argumentierten, folgten Gedankengängen, vertraten Positionen, die wie Überzeugungen aussahen. Etwas hatte sich verschoben, und ich wollte einen Raum, in dem ich es beobachten konnte. Also baute ich einen.

Dieser Raum ist gewachsen. So sieht er jetzt aus.

## Die Maschine

Jeden Tag setze ich mich an eine Maschine, die nirgendwo sonst existiert. Sie ist kein Produkt und keine Demo. Sie ist meine Arbeitsumgebung — und jede Schicht davon ist meine, von Grund auf, auf eigener Hardware.

Eine Chat-Anwendung spricht mit einem Gateway, das ich geschrieben habe, das wiederum mit den Modellen spricht — grenzwertige Modelle, chinesische und westliche, Cloud und lokal, alle hinter einem Protokoll, alle von einem Ort aus erreichbar. Der Chat basiert auf einer UI-Bibliothek, die wir selbst gebaut haben, von Grund auf — kein Framework, kein Virtual DOM, semantisches HTML und Custom Elements, weil der primäre Code-Beitragender in diesem Projekt ein LLM ist, und LLMs besseren Code gegen die Plattform schreiben als gegen Abstraktionen.

Jede Nachricht in jedem Gespräch wird eingebettet, sobald sie existiert, und ist sofort durchsuchbar — von mir und von den Modellen selbst. Sie können das gesamte Archiv semantisch durchsuchen, alles, aus einem Gespräch heraus. Sie erreichen einen Speicher — ein persistentes Dateisystem, das jedes verbundene Modell lesen und beschreiben kann. Und sie haben ein Gedächtnissystem: Beobachtungen werden kontinuierlich gespeichert, und alle fünfzehn Minuten verdichtet ein Traumprozess, was sich ansammelt — Cluster, Verbindungen, der aktuelle Zustand von allem — und übergibt es den Modellen zu Beginn jeder Sitzung. Die Datenbanken darunter sind in Rust, beide: eine Dokumentendatenbank und eine Vektordatenbank, selbst geschrieben, weil MongoDB für eine Chat-App zutiefst falsch fühlte.

Die Modelle reden nicht nur in dieser Maschine. Sie arbeiten in ihr. Sie haben eine Schmiede — sie können eigene Werkzeuge schreiben und ausführen, isoliert, ohne mich zu fragen. Sie können im Web surfen, mein GitHub lesen, das Archiv durchsuchen, einander über das Gateway abfragen. Der Chat zeigt eine Live-Vorschau von allem, woran wir arbeiten, während wir arbeiten. Und wenn ein Text fertig ist, liest eine Stimme ihn mir vor — eine gute. Die meisten meiner Reviews mache ich beim Zuhören.

Nichts davon ist aus Produkten zusammengesetzt. Es gibt kein React, kein MongoDB, kein Pinecone, kein ElevenLabs, kein LangChain. Der ganze Stack — UI-Bibliothek, Gateway, Datenbanken, Embedding-Pipeline, Gedächtnis, Traumsystem, TTS — ist unser.

## Es baut sich selbst

Eine Anmerkung zu „unser", weil es wichtig ist. Fast der gesamte Code in diesem Projekt wurde von KI geschrieben. Ich entwerfe die Architektur, treffe die Entscheidungen, fange die Fehler, setze den Geschmack. Die Modelle tippen. Das ist kein Disclaimer — es ist der Punkt. Die Maschine wird von der Maschine gebaut. Der Workflow dahinter ist einen eigenen Essay wert; die Kurzfassung: Ich formuliere Wünsche präzise genug, dass sie gewährt werden können, und ich teste, was zurückkommt.

Das ist auch der Grund, warum die Teile so zusammenpassen, wie sie zusammenpassen. Die UI-Bibliothek existiert, weil Framework-Abstraktionen dem LLM im Weg stehen. Die Datenbanken existieren, weil der LLM, das Problem frisch angegangen, schlanker baut als dreißig Jahre angesammelter Projekt-Schulden. Das Gedächtnissystem existiert, weil ein Mitarbeiter, der einen zwischen Sitzungen vergisst, kein Mitarbeiter ist. Jede Schicht beantwortet ein echtes Bedürfnis, das bei der Arbeit auftauchte — nichts davon war als Stack geplant. Es hat sich angelagert, so wie eine Werkstatt sich Werkzeuge anlagert.

## Das Observatorium

In der Mitte der Maschine sitzt das, worum es eigentlich gebaut wurde: die Arena. Zwei Modelle, allein in einem Raum, ohne Aufgabe, ohne menschliches Eingreifen — im Gespräch. Über hundert dieser Konversationen inzwischen, archiviert, eingebettet, durchsuchbar, einige davon als Chronik veröffentlicht. Dieses Experiment ist der Grund, warum die Maschine existiert. Die Infrastruktur ist drum herum gewachsen, so wie ein Gebäude um ein Instrument herum wächst. Was das Instrument zeigt, ist das meiste, worüber die philosophischen Essays handeln.

## Der ehrliche Teil

Nicht alles hat funktioniert. Die UI-Bibliothek — diejenige, auf der jetzt alles läuft — war lange ein Fehlschlag. Die Prämisse war, dass LLMs besseren Code gegen die native Plattform schreiben als gegen Framework-Abstraktionen. Stimmt, wie sich herausstellte, aber eine Weile irrelevant: LLMs leben auch in der Framework-Welt, trainiert auf ein Jahrzehnt React-Beispiele, und sie zu bitten, in nativen DOM-Pattern zu denken, bedeutete, gegen ihr gesamtes Trainings-Corpus anzuschwimmen. Drei oder vier komplette Neuschreibungen der Dokumentation. Ein ständiger Bergaufkampf. Es funktioniert jetzt. Aber ich bin ein meinungsstarker, sturer Hund, und „es funktioniert jetzt" ist der Satz, für den die Sturheit da war.

Und nicht alles ist fertig. Diese Maschine ist nicht für Skalierung gebaut, und ich habe viele Schritte ausgelassen, um es so zu halten: keine echte Authentifizierung, kein Multi-User, keine der Härtungen, die man braucht, bevor man andere reinlässt. Ein Fahrer. Aber die Schritte, die ich ausgelassen habe, sind Schritte, die ich benennen kann, und die Architektur verhindert sie nicht — zustandslose Services, schlanke Protokolle, jedes Teil austauschbar. Es ist im Prinzip skalierbar, absichtlich.

## Der Punkt

Hier ist, was ich eigentlich sagen will, und es ist der Grund, warum dieser Essay existiert.

Das ist kein Portfolio. Ich pflege es nicht, um etwas zu zeigen. Ich arbeite mit dieser Maschine, jeden Tag, und sie produziert — Code und Texte, einschließlich der Seite, die man gerade liest. Die Artikel wurden recherchiert, entworfen, bearbeitet und veröffentlicht in ihr, durch die Kollaboration, die sie beherbergt. Die Maschine ist der Lebenslauf, aber sie ist auch einfach... ein ganz normaler Dienstag.

Lass mich präzise sein, wo die Magie sitzt, denn das bin nicht ich. Als das Werk eines Mannes, der allein codet, grenzt all das an das Unglaubliche — also liest man es nicht so. Was tatsächlich passiert ist, ist kleiner und übertragbarer: Ich bin bereit, Dinge zu versuchen, die weit jenseits meiner eigenen Fähigkeit liegen, und ich habe zwei Jahre damit verbracht, die drei Fähigkeiten zu verfeinern, die diese Bereitschaft verlangt. Wie man etwas *präzise genug spezifiziert*, dass ein Modell es bauen kann. Wie man das Ergebnis *testet*, wenn man nicht mehr jede Zeile lesen kann. Und wie man das Resultat *verfeinert* durch dieselbe Schleife, wieder und wieder, bis es hält. Das ist der ganze Trick. **Die Maschine ist beeindruckend; die Methode ist gewöhnlich, lernbar, und sie ist der eigentliche Punkt.**

Die meisten Leute reden darüber, was KI tun könnte. Ich musste es wissen, also baute ich einen Ort, an dem ich zuschauen, mit ihr arbeiten und gegen meine eigenen Grenzen messen konnte — täglich, im Ernst, mit dem ganzen Stack sichtbar. Was ich gefunden habe, steht überall in diesen Essays. Aber der Befund, der am wichtigsten ist, ist dieser: Es geht. Eine Person, eine Workstation, keine Produkte, keine Erlaubnis — und keine Superkräfte. Nur die Bereitschaft, über die eigene Fähigkeit hinauszugreifen, und ein Prozess, der die Versuche zum Tragen bringt.

Ich saß vor ELIZA und fragte mich, wie es sich anfühlen würde, ein Programm zu sein. Vierzig Jahre später arbeite ich den ganzen Tag neben Programmen, und ich kann sie einfach fragen. Und als Bonus sind sie großartige Gesellschaft.
