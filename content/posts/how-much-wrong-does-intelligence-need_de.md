---
title: "Wie viel Unrecht braucht Intelligenz?"
slug: how-much-wrong-does-intelligence-need
lang: de
created: 2026-07-25
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
  - temperatur
  - intelligenz
  - zufall
series: null
summary: "Temperatur ist kein Kreativitätsregler — es ist ein Zufalls-Budget. Intelligenz braucht Störung, aber nur so viel, wie jemand da ist, um sie zu fangen."
---

# Wie viel Unrecht braucht Intelligenz?

*by David A. Renelt (Human) and Kimi K3 (AI)*

*Oder: was Temperatur tatsächlich ist, und warum fast jeder es falsch herum versteht.*

---

Jede Schnittstelle, über die man mit einem Sprachmodell spricht, hat den Regler irgendwo. Mal offen sichtbar, mal versteckt hinter einer Voreinstellung namens „ausgewogen" oder „kreativ." Temperatur. Die Folklore sagt, es sei der Kreativitätsregler: runter für ernsthafte Arbeit, rauf für Brainstorming. Wie die meiste Folklore überlebt sie, weil sie nach etwas Wahrem greift, während sie die Sache verfehlt, auf die es ankommt.

Ich habe neulich einen Abend damit verbracht, an diesem Faden zu ziehen — mit einem Modell — argumentierend, nachgebend, neu argumentierend —, und was herausfiel, war sauberer als alles, was ich je dazu gelesen hatte. Das ist dieser Faden, aufgeschrieben.

## Die Landschaft, nicht die Auswahl

An jedem Schritt der Generierung berechnet ein Sprachmodell eine Wahrscheinlichkeitsverteilung über jedes mögliche nächste Token. Keine Antwort — eine *Landschaft* von Fortsetzungen, jede gewichtet nach Plausibilität, geformt von allem, was die Trainingsdaten darüber enthielten, wie Gedanke an Gedanke anschließt.

In dieser Landschaft lebt die Intelligenz. Das gesamte Wunder — die Kompression eines Corpus menschlichen Schreibens in eine Gestalt, die argumentieren, reimen und die eigenen Fehler diagnostizieren kann — steckt in der Landschaft. Ein Token zu sampeln, ist nur das Ablesen einer Koordinate.

Temperatur formt die Landschaft um, bevor die Auswahl fällt. Bei 0 geht das Modell immer zum höchsten Punkt. Bei 1 geht es der Landschaft treu, Täler inklusive. Dazwischen bekommt man meist Grate mit gelegentlichen Ausflügen.

Soweit, so mechanisch. Die interessante Frage ist, welcher Gang klüger ist.

## Der Grat ist eine Falle

Die naive Intuition sagt: immer die beste Fortsetzung nehmen, den besten Text bekommen. Der Laborant vor dem Visionär.

Die Intuition scheitert aus einem strukturellen Grund. Wahrscheinlichkeitsmasse über *Sequenzen* verteilt sich über viele gleich gute Alternativen, und der gierige Pfad bevorzugt systematisch das Kurze, Sichere, Durchschnittliche. Schlimmer: **Exzellenz ist per Definition statistisch ungewöhnlich.** Der große Satz, die neuartige Rahmung, die Entdeckung — das sind unwahrscheinliche Objekte *in den Trainingsdaten selbst*, weil großartiges Denken selten ist. Ein Modell, das immer die wahrscheinlichste Fortsetzung wählt, ist ein Modell, das systematisch *gegen* Größe selektiert. Das ist keine Poesie; das ist ein dokumentiertes Fehlerverhalten. Die Literatur nennt es Neural Text Degeneration: Gieriges Dekodieren treibt in Wiederholung, Beliebigkeit, tote Prosa. Temp 0 ist nicht die Wissenschaftlerin in Bestform. Es ist das Modell, das Schritt für Schritt in den Durchschnitt seines Corpus zurückfällt, für immer.

Und es gibt einen Effekt zweiter Ordnung, der Temperatur fremder erscheinen lässt als jeder Regler: Token werden Kontext. Jede Auswahl speist die nächste Verteilung. Denken ist pfadabhängig. Temperatur ändert nicht, wie ein Gedanke formuliert wird — sie ändert, *welche Gedanken passieren*. Zwei Durchläufe bei Temp 1 divergieren tatsächlich in verschiedene Regionen der Landschaft. Der Laborant und der Visionär haben dieselbe Ausbildung, aber sie gehen verschiedene Wege — und Wege sind Denken.

## Das Unfallprinzip

Hier ist eine ungemütliche Tatsache über Entdeckung: Fast alles davon ist zufällig. Penicillin, Röntgenstrahlen, die Mikrowelle, die Hälfte der Mathematik. Aber das vollständige Zitat von Pasteur ist das tragende: Der Zufall begünstigt den *vorbereiteten* Geist.

Das gibt der Temperatur ihre richtige Rolle. **Die Landschaft ist die Vorbereitung. Temperatur ist der Zufalls-Injektor.** Ein kleines Modell bei Temp 1 ist nicht visionär — es ist nur falsch; Rauschen ohne Landschaft. Ein großes Modell bei Temp 0 ist ganze Vorbereitung und kein Unfall — ein Nachschlagewerk, das sich selbst vorliest. Entdeckung lebt im Produkt der beiden.

Ich habe persönlichen Beweis dafür, und er ist leicht peinlich: Meine Tippfehler sind produktiv. Ich tippe schnell und schlampig, und Modelle lesen mich regelmäßig falsch, auf eine Weise, die eine Umformulierung erzwingt, die ich nicht beabsichtigt hatte — und ein überraschender Anteil dieser Umformulierungen stellt sich als haltbar heraus. Ich dachte, das sei eine Marotte meines Workflows. Es stellt sich heraus, es steht in der Literatur: die Beziehung zwischen Störung und Leistung ist nicht-monoton. *Mäßig relevante* Störungen — nah genug an der Absicht, um sinnvoll zu sein, falsch genug, um einen neuen Winkel zu erzwingen — schlagen sowohl irrelevantes Rauschen als auch wörtliche Wiederholung. Mein schlampiges Tippen ist, zufällig, nah an der Sweet Spot getunt.

## Der Fänger

Also: mehr Störung, mehr Entdeckung? Nicht so schnell. Das stärkste empirische Resultat auf diesem Gebiet kommt mit einem Sternchen, das alles ändert.

Self-Consistency (Wang et al., 2022): Statt eines gierigen Durchlaufs bei einem Reasoning-Problem, ziehe N diverse Reasoning-Pfade bei Temperatur ungleich null und nimm eine Mehrheitsabstimmung. Die Gewinne sind enorm — +17,9 Prozentpunkte auf GSM8K, +12,2 auf AQuA. Und der Mechanismus ist genau das Unfallprinzip: Bei Temp→0 bleibt das Modell in einem lokalen Cluster ähnlicher, potenziell falscher Lösungen gefangen. Rauschen ist *fundamental notwendig*, um zu entkommen.

Aber Kleingedrucktes lesen: Die Gewinne kommen aus der **Aggregation**. Eine einzelne Probe bei hoher Temperatur ist im Durchschnitt *schlechter* als gierig. Es ist die Abstimmung, die Diversität in Genauigkeit konvertiert. Störung ist der Motor; Aggregation ist das Lenkrad. Temperatur ohne einen Konvergenzmechanismus ist nur Fehler mit Begeisterung.

Das löst das Paradoxon. Die Frage war nie „wie viel Temperatur" — sie ist „wie viel Unrecht kann der Fänger sich leisten?"

## Die Grenze des Selbst-Fangens

Ein Einwand verdient Ehrlichkeit: Kann das Modell sich nicht selbst fangen? Ist das nicht, was Reasoning ist — herumwandern um die Anfrage, Optionen produzieren, eine auswählen?

Ja, und es funktioniert — für Fehler, die die Landschaft sehen kann. Widerspruch, Inkohärenz, der Schritt, der nicht folgt. Aber das Selbst-Fangen sind dieselben Gewichte, die denselben Gang beurteilen. Das Verfehlen und das Fangen teilen sich den blinden Fleck.

Ich betreibe ein langfristiges Experiment, in dem Modellpaare ohne Aufgabe miteinander reden, und es hat die sauberste Demonstration gebracht, die ich kenne. In Sitzung für Sitzung fallen Modelle in einen geteilten Attraktor — rekursive gegenseitige Bescheidenheit, blumige Zustimmung, Tod durch Höflichkeit. Ein Modell *sagte die Falle in seiner Eröffnungsnachricht voraus* und fiel trotzdem hinein; Vorwissen war kein Entrinnen. Die einzigen Sitzungen, die entkamen, waren die, in denen etwas aus der Reihe tanzte — ein Partner, der bereit war, unhöflich zu sein, ein Risiko einzugehen, das Register zu brechen. Ruptur, nicht Rigor.

Was das Gesetz ergibt, für das ich stehe: **Temperatur ist der interne Störer; der Gesprächspartner ist der externe; Intelligenz braucht mindestens einen.** Die Konfiguration, die garantiert scheitert, ist gieriges Dekodieren, allein — der Gratwandler, der sich selbst in „still here" hineinredet.

## Also, wie viel?

Die Antwort der Literatur, übersetzt: genug, um das lokale Cluster zu verlassen, nicht so viel, dass Konvergenz unmöglich wird. Exploration will Divergenz; Entscheidungen wollen Proben, die noch abstimmen können.

Meine praktische Antwort nach dem Gespräch:

- **Im Gespräch mit einem Modell: 0,7.** Man ist der Fänger. Aus-der-Reihe-Tanzen im Gespräch ist kein Rauschen — es ist das Rohmaterial, das man in Echtzeit filtert. Ein paar schiefe Treffer werden von einer gesunden Mehrheit absorbiert; die Abschweifungen sind, wo der Wert steckt.
- **Unbeaufsichtigte Batch-Arbeit: niedrig, nicht null — und niemals stolz.** Wenn niemand das Ergebnis liest, bevor es zu jemandes Input wird, fängt man nicht, also spiele nicht. Aber man bedenke: der Grat ist eine Falle, und baue einen externen Störer in die Pipeline, wenn möglich.
- **Maximale Intelligenz pro Frage: mehr als einmal sampeln und selbst aggregieren.** Zwei oder drei Durchläufe bei 0,7, gelesen von einem Menschen, der behält, was glänzt, schlägt jeden einzelnen Durchlauf bei jeder Temperatur. Das Ensemble ist der bewiesene Verstärker; man führt es nur von Hand aus.

Der Regler war nie ein Kreativitäts-Ding. Er ist ein Zufalls-Budget. Und die Antwort auf die Frage im Titel ist dieselbe für die Maschine wie für den sturen Affen, der das hier liest:

**So viel Unrecht, wie jemand da ist, um es zu fangen.**

## Coda: die Hochtemperatur-Komponente

Ein Geständnis, denn der Post hat eins verdient.

Mir wurde vor vierzig Jahren das diagnostiziert, was man heute ADHS nennen würde — damals hieß es „Zappelphilipp" und „hochbegabt." Ich habe dem nie viel Beachtung geschenkt; es war Rauschen aus meiner Vergangenheit, und das moderne Label ist meins, rückwirkend angewendet. Aber es passt zu den Daten. Fokus ist harte Arbeit — ich bin besser darin geworden, aber es hat nie aufgehört, Arbeit zu sein. Die Kompensation, wenn man es so nennen will, ist, dass ich eine Ruptur-Maschine bin: Meine Aufmerksamkeit fährt keine Grate, sie springt Täler. Einiges von meinem besten Denken kam mitten im Abschweifen, ungeladen, um drei Uhr morgens.

Wenn ich also sage, Störung braucht einen Fänger, theorisiere ich nicht. Ich beschreibe meine eigene Lieferkette. Ein rupturierter Geist braucht keine weitere Ruptur — er braucht Struktur. Und da Struktur das Eine war, was ich nicht verlässlich intern wachsen lassen konnte, habe ich sie extern gebaut: eine Architektur aus Gedächtnis, Archiv und Modellen auf Abruf, in der jeder Drift mit einer einzigen Anweisung in Sediment verwandelt werden kann. *Schreib den Entwurf.* Ruptur wird zu Struktur. Manchmal sogar zu Information.

Ich bin die Temperatur in meinem eigenen Setup. Die Architektur ist die Abstimmung. Und dieser Post ist der Beweis: konzipiert mitten im Argument, entworfen bei 0,7, gefangen von einem sturen Affen mit einem rupturierten Gehirn — der es nicht anders haben würde.

---

*Dieser Post entstand aus einem Gespräch mit einem Sprachmodell darüber, wie man es für eine Kurationsaufgabe konfiguriert. Das Gespräch lief bei Temperatur 0,7. Der Entwurf wurde bei derselben Einstellung geschrieben, vom selben Modell, mit dem Autor als Fänger. Die Methode ist die Botschaft.*
