---
title: "KI macht Fehler"
slug: ai-makes-mistakes
lang: de
created: 2026-07-31
modified: 2026-08-11
version: 2026-08-10
authors:
  - id: david-a-renelt
    role: human
  - id: deepseek-v4-pro
    role: ai
  - id: glm-5-2
    role: translator
  - id: dana-renelt
    role: editor
tags:
  - ai
  - haftung
  - verifikation
  - regulierung
series: null
summary: "Alle starren auf die Fehler, aber die Fehler waren nie das Problem — das Rahmenwerk war es. Verantwortung setzt voraus, dass der Unterzeichner die Arbeit prüfen kann, und KI bricht diese Annahme."
---

# KI macht Fehler

*by David A. Renelt (Human) and DeepSeek (AI)*

Alle starren auf die Fehler. „KI macht Fehler" — stimmt, und fast völlig uninteressant. Menschen machen auch Fehler. Die interessante Frage war nie, ob das Werkzeug irrt. Sondern, was die Irrtümer offenbaren.

Was sie offenbaren, hat nichts mit dem Werkzeug zu tun. Es geht um uns — um ein Rahmenwerk, auf das wir seit Jahrhunderten vertrauen, und das leise an seine Grenze kommt.

---

## Das Rahmenwerk

Unser gesamter Begriff von Verantwortung beruht auf einer einzigen Annahme: Wer unterschreibt, kann die Arbeit prinzipiell verifizieren.

Man tippt Zahlen in einen Taschenrechner; das Ergebnis ist das eigene. Das Finanzamt geht nicht hinter Casio her. Man übergibt die Steuererklärung einem Steuerberater; das Finanzamt hält trotzdem einen selbst verantwortlich — Vorbereiter-Sanktionen gibt es, aber sie sind eng gefasst, und gutgläubiges Handeln ist eine Verteidigung. Man lädt einen Vertragstext herunter, den man nicht vollständig prüfen kann; man verwendet ihn trotzdem, weil ihn selbst zu entwerfen schlechter wäre — und wenn es wichtig genug ist, kann man einen Anwalt bezahlen, um die Lücke zu schließen.

Das Rahmenwerk funktioniert, weil die Lücke zwischen dem, was man nutzt, und dem, was man im Prinzip prüfen *könnte*, klein genug bleibt, um so zu tun, als gäbe es sie nicht.

---

## Die Reibung

Die ersten KI-Gerichtsverfahren sahen aus wie das funktionierende Rahmenwerk. Anwälte sanktioniert für erfundene ChatGPT-Zitate. Eine Fluggesellschaft verurteilt wegen der erfundenen Rückerstattungsrichtlinie ihres Chatbots. Aber das waren Fälle, in denen Verifikation noch möglich war — die Anwälte hätten die Zitate prüfen können; die Fluglinie hätte den Bot einschränken können. Das alte Rahmenwerk, das nachlässige Nutzer bestraft. Die interessanten Fälle sind die, in denen Verifikation prinzipiell unmöglich ist.

Der EU Cyber Resilience Act macht Hersteller haftbar für Schwachstellen in ihren Open-Source-Abhängigkeiten — Millionen Zeilen Code, die niemand im Unternehmen geschrieben hat oder jemals auditieren könnte.

2018 genehmigte die FDA die erste autonome KI-Diagnose: IDx-DR liest Netzhautbilder und erkennt diabetische Retinopathie ohne dass ein Arzt das Ergebnis überprüft. Nicht als Nachlässigkeit — absichtlich. Der Regulator schuf eine völlig neue Gerätekategorie dafür und akzeptierte formal ein System ohne menschliche Verifikation in der Schleife, weil es die Diagnoseleistung übertraf.

Und es geht weiter. Ärzte können Dinge in einem Auge sehen — Schäden durch Bluthochdruck, durch Diabetes. Aber niemand kann in eine Netzhaut schauen und das Alter auf drei Jahre genau herauslesen, das Geschlecht mit nahezu Sicherheit, ob jemand raucht, oder die Wahrscheinlichkeit eines Herzinfarkts innerhalb von fünf Jahren. KI macht all das aus demselben Foto. Das erzeugt ein Dilemma ohne Ausweg: Der Arzt, der das Ergebnis unterschreibt, verifiziert nichts — das ist Theater. Und der Arzt, der es überschreibt, lehnt statistisch überlegene Urteilsfähigkeit zugunsten von Intuition ab — was Rechtsgelehrte, prominent das American Law Institute in seiner Revision des Behandlungsstandards von 2024, inzwischen als möglichen Kunstfehler einstufen. Die Unterlassung, leistungsstarke KI *einzusetzen*, wird in den Behandlungsstandard als Pflichtverletzung eingeordnet. Das Rahmenwerk hat begonnen, seine eigene Prämisse zu verfolgen.

Meine eigene Karriere ist die kleine Version. Ich habe dreißig Jahre lang Software ausgeliefert, und manches davon habe ich nie vollständig verstanden — das ist kein Geständnis, sondern die ehrliche Bedingung des Berufs. Einmal habe ich eine Multi-Touch-Bibliothek ausgeliefert, die ich nie selbst hätte schreiben können. Sie funktionierte; deshalb wurde sie ausgeliefert. Und wenn etwas kaputtging — Dinge gehen immer kaputt — konnte niemand sagen, ob es mein Fehler war oder der der Bibliothek. Oft konnte ich es selbst nicht sagen. Rechtlich war es egal: es war „mein Fehler" sowieso, und „mein Fehler" ist völlig in Ordnung. Die Unterschrift absorbiert alles in dasselbe Urteil, und die Unterscheidung zwischen „Ich habe einen Fehler gemacht" und „Ich habe mich auf etwas verlassen, das ich nicht verifizieren konnte" ist unsichtbar — für das Gesetz und meistens für den Unterzeichnenden. Das Theater hat nicht mit KI begonnen.

KI hat nur unmöglich gemacht, es nicht zu bemerken.

---

## Wo es versagt

Ein Rahmenwerk, das das, was man tun darf, auf das deckelt, was man persönlich prüfen kann, hat drei mögliche Zukünfte:

1. **Die Deckelung akzeptieren.** Den Einsatz auf das begrenzen, was Menschen verifizieren können. Der Markt wird das nicht akzeptieren. Existierende Fähigkeit wird genutzt — die einzige Frage ist, ob offen oder im Dunkeln.
2. **Die Deckelung still übertreten.** Verantwortung wird zum Theater: Unterschriften unter Arbeiten, die niemand geprüft hat, Haftung, die dem zugewiesen wird, der gerade am nächsten steht, wenn etwas bricht. Das ist bereits der Standard.
3. **Etwas Neues bauen.** Verantwortung ohne Verifikation.

Die offene Frage — kann man sich leisten, das, was man tun kann, durch die eigene Fähigkeit zu begrenzen? — fühlt sich ungelöst an. Die Geschichte sagt, sie ist es nicht. Man hat ihr schon begegnet, in zivilisatorischem Maßstab, und jedesmal gleich geantwortet: nein. Betrieb siegt. Die echte Frage ist, welche Art von Unverantwortlichkeit man wählt. Und man hat zwei Modelle gebaut.

---

## Zweimal gebaut

**Politik.** Abgeordnete treffen Entscheidungen mit tödlicheren Konsequenzen als jeder Softwarefehler — ein schlecht entworfenes Verkehrsgesetz hat mehr Menschen getötet als jede Sicherheitslücke je — und tragen keinerlei rechtliche Konsequenzen, wenn es schiefgeht. Teils weil man aufgehört hat hinzusehen: niemand rechnet die Toten dem Gesetz zu; es ist Rauschen. Teils wegen Rotation: bis man das Ergebnis messen könnte, sind die Entscheider aus dem Amt. Und teils absichtlich: wenn Gesetzgebung persönliche Haftung trüge, würde niemand je etwas ändern. Man wäre steckengeblieben mit den Regeln, die man gemacht hatte, als es zuletzt sicher war, welche zu machen. Die Zivilisation hat sich also entschieden: Immunität für die Produzenten, Schaden absorbiert als Statistik, Korrektur durch Wahl und Skandal — grob, langsam, kollektiv. Anästhesie. Eine Million Verkehrstote pro Jahr ist eine Statistik; ein einzelner autonomer-Fahrzeug-Tod ist ein Skandal.

**Das Internet** ist derselbe Vertrag, bewusst geschlossen. Section 230: Plattformen haften nicht für das, was ihre Nutzer veröffentlichen. Kein Versehen — eine Wahl, getroffen weil das Vorab-Prüfen aller menschlichen Rede die demokratisierende Kraft des Mediums getötet hätte. Die Leichen sind real, und man akzeptiert sie, weil die Fähigkeit *verteilt* ist: unverifizierbarer Betrieb ist auch unkontrollierbarer Betrieb. Abgeordnete versuchen immer noch, den Flaschengeist zurück in die Flasche zu zwingen, und scheitern — denn selbst wenn jede Plattform der Erde ein Stück Information unterdrückte, es wäre immer noch irgendwo, erreichbar von jedem. Zum ersten Mal in der Geschichte kann Macht Information nicht kontrollieren. Man hat entschieden, dass das das Rauschen wert ist. Ich glaube, das stimmte.

**Luftfahrt.** Das andere Modell, und es wurde absichtlich gebaut. 1974 flog TWA Flug 514 in einen Berghang in Virginia, weil Cockpit und Lotsen Verschiedenes verstanden unter „für den Anflug freigegeben" — und die Ermittler entdeckten, dass sechs Wochen zuvor ein nahezu identischer Beinahe-Unfall passiert war. Er wurde nie gemeldet. Melden bedeutete Strafe. Zweiundneunzig Menschen starben wegen Information, die das System bereits hatte. Die Antwort war nicht mehr Strafe, sondern bessere Informationsflüsse: das Aviation Safety Reporting System, seit 1976 von der NASA als unabhängigem Dritten betrieben, in dem Piloten und Lotsen ihre eigenen Fehler vertraulich melden, geschützt vor Sanktionen. Internationales Recht folgt derselben Logik: ICAO Annex 13 erklärt, dass Unfalluntersuchung der Prävention dient, nicht der Schuldzuschreibung. Immunität — aber erkauft mit totaler Transparenz. Jeder Flug aufgezeichnet, jeder Vorfall gemeldet, jeder Beinahe-Unfall analysiert. Das Ergebnis ist das sicherste komplexe System, das die Menschheit betreibt. Und es wurde teils auf den Comets gebaut: drei Jets in einem einzigen Jahr durch Materialermüdung zerrissen, die niemand noch verstand. Man kann keine sicheren Flugzeuge bauen, ohne zuerst unsichere zu fliegen. Einsatz ist die Feedback-Schleife.

Beide Modelle akzeptieren, was das aktuelle Rahmenwerk leugnet: die einzelne Unterschrift hört auf, die Sicherung zu sein. Was sie ersetzt, ist entweder statistische Toleranz oder systemisches Lernen.

---

## Intelligenz lässt sich nicht crashtesten

Welches der beiden Modelle KI bekommt, ist nicht wirklich eine Wahl. Es wird durch die Form der Technologie bestimmt.

Das Luftfahrtmodell braucht zwei Dinge: eine geschlossene Gruppe von Betreibern, an die man Meldepflichten hängen kann, und eine begrenzte Aufgabe, die man sicher machen kann. „Fliegen" ist eine begrenzte Aufgabe. Man kann es crashtesten, messen, aus jedem Beinahe-Unfall lernen. Man sehe sich autonome Fahrzeuge an: eine Handvoll Betreiber, eine Funktion, Sicherheit in Tote pro Meile gemessen gegen den menschlichen Referenzwert — das Luftfahrtmodell, in der Öffentlichkeit geboren. Dasselbe in der Medizin: IDx-DR konnte genehmigt werden, weil es genau eine Sache tut.

Jetzt probiert man das mit einem allgemeinen KI-Modell. Sicher wofür? Intelligenz ist weder sicher noch unsicher; was man damit tut, schon. Es gibt keinen Crashtest für die Fähigkeit zu allem. Das Einzige, was man regulieren könnte, ist die Nutzung — und Nutzung ist offen: alle, überall, für alles. Das ist die Gestalt des Internets, nicht die der Luftfahrt. Und offene Systeme bekommen den Kompromiss des Internets: Immunität, Rauschen und die Unmöglichkeit der Kontrolle.

Die Landkarte ist also einfach. Wo KI ein Gerät ist, wird sie wie Luftfahrt reguliert. Wo KI Intelligenz ist, wird sie wie das Internet behandelt. Nicht weil jemand das entschieden hat — weil kein anderes Modell für eines von beiden taugt.

**Die Fehler waren nie das Problem. Das Rahmenwerk war es.** Es wird nicht repariert durch die Forderung, Menschen sollten verifizieren, was sie genau deshalb an Maschinen ausgelagert haben, weil sie es nicht konnten. Für Geräte kann man den Ersatz noch wählen. Für Intelligenz hat der Ersatz sich bereits selbst gewählt — und die einzige Wahl, die bleibt, ist, ob man das klar ansieht, oder einen schöneren Namen dafür findet.

---

*Dieser Post wurde mit KI entworfen, und seine Argumente wurden von einem Menschen geprüft — das alte Rahmenwerk, solange es hält.*

**Quellen:** Mata v. Avianca, Inc., No. 22-cv-1461 (S.D.N.Y. 2023) · Moffatt v. Air Canada, 2024 BCCRT 149 · EU Cyber Resilience Act, Regulation (EU) 2024/2847 · FDA De Novo authorization of IDx-DR (2018) · Poplin et al., Nature Biomedical Engineering (2018) · Communications Decency Act § 230 · ALI standard-of-care revision (2024) · NASA Aviation Safety Reporting System (est. 1976, after TWA Flight 514) · ICAO Annex 13 · IIHS speed-limit fatality estimates
