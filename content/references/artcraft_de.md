---
title: "Research Notes: ArtCraft"
slug: artcraft
lang: de
created: 2026-10-30
modified: 2026-10-30
version: 2026-10-30
type: reference
tags:
  - reference
  - ai
  - software-development
  - open-source
summary: "ArtCraft und PhotoCraft als Beleg dafür, dass kleine Teams mithilfe von KI erhebliche Teile einer Anwendungsoberfläche nachbauen können – mit klaren Grenzen bei Reife und Beweiskraft."
---

# Research Notes: ArtCraft

## Was das Projekt ist

ArtCraft ist eine Reihe quelloffener Kreativanwendungen des Storytold-/ArtCraft-Teams. Die Anwendungen bilden vertraute Arbeitsabläufe aus Kreativsoftware in Rust nach, darunter PhotoCraft für Bildbearbeitung, VectorCraft für Vektorillustration und FilmCraft für Videoschnitt.

Das PhotoCraft-Repository beschreibt die Anwendung als quelloffene Clean-Room-Neuimplementierung von Adobe Photoshop. Als Grundlage nennt es öffentliche Spezifikationen und beobachtetes Verhalten, nicht proprietären Adobe-Code, Shader oder Bestandteile der Originalanwendung. Die PSD-Unterstützung beruht auf Adobes öffentlicher Formatspezifikation.

Das Projekt belegt deshalb eine engere Aussage als „Adobes Quellcode wurde reverse-engineered“: Sichtbares Verhalten und dokumentierte Formate können genügend Informationen liefern, um einen erheblichen Teil einer Anwendung ohne Zugriff auf die ursprüngliche Implementierung nachzubauen.

## KI-Unterstützung und derzeitige Reife

Ars Technica beschreibt die Anwendungen als von einem kleinen Team mithilfe von KI gebaute quelloffene Nachbildungen. Der Artikel verwendet ArtCraft als Beleg dafür, dass Implementierungen leichter reproduzierbar werden – nicht als Beweis, dass KI selbstständig ein ausgereiftes Profiprodukt ersetzen kann.

Die PhotoCraft-Dokumentation bezeichnet das Projekt selbst als **frühe Alpha** und erklärt ausdrücklich, dass es Photoshop in der täglichen professionellen Arbeit noch nicht ersetzt. Sie unterscheidet außerdem zwischen einer verdrahteten Funktionsoberfläche und tatsächlicher Verhaltensgleichheit: Vorhandene Befehle und Menüeinträge beweisen noch keine verlässlichen professionellen Arbeitsabläufe.

Diese Grenzen gehören zum Befund. ArtCraft zeigt eine sinkende Implementierungsbarriere, aber weder den bereits vollzogenen Ersatz von Adobe noch eine kostenlos mitgelieferte Eignung für professionelle Arbeit.

## Was der Fall stützt

Der Fall stützt drei begrenzte Aussagen:

- Ein kleines Team kann mithilfe von KI einen überraschend großen Teil einer sichtbaren Anwendungsoberfläche nachbauen.
- Funktionslisten und Implementierungen werden als Wettbewerbsbarrieren schwächer.
- Verlässlichkeit, Interoperabilität, Passung zum Arbeitsablauf und dauerhafte Verantwortung bleiben eigenständige Leistungen jenseits der ersten Implementierung.

Der Fall belegt weder den genauen Anteil KI-erzeugten Codes noch jede Behauptung des Projekts unabhängig, und er liefert keine allgemeine Produktivitätsmessung für KI.

## Quellen

- [PhotoCraft-Quellrepository und Projektdokumentation](https://github.com/storytold/photocraft), insbesondere die Abschnitte „Under the hood“, „PSD without compromise“ und der Hinweis zum frühen Alpha-Status.
- Ars Technica, [*„Software is over“: Bold AI developer takes aim at Adobe with open source clones*](https://arstechnica.com/ai/2026/10/software-is-over-bold-ai-developer-takes-aim-at-adobe-with-open-source-clones/), Oktober 2026.
