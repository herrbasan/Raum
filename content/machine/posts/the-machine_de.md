---
title: "Die Maschine"
slug: the-machine
lang: de
created: 2026-09-14
modified: 2026-10-04
version: 2026-10-04
status: final
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
  - machine
  - infrastructure
summary: "Eine Maschine, entworfen, um jede Konversation aufzubewahren und bis auf den Grund verstanden zu sein — die sich im Gebrauch als Raum herausstellte, der sich erinnert, als Gewohnheit, die liest, und als Schreibtisch, der schreibt. Die Reihenfolge des Baus, die Entdeckungen und der Friedhof."
---

# Die Maschine

*by David A. Renelt (Human) and Kimi K3 (AI)*

<!-- mb:block preset=player kind=audio -->
[Diesen Artikel anhören](tts/the-machine_de_2026-10-04.mp3)
<!-- mb:/block -->

Heute Abend brauchte diese Seite eine Fähigkeit, bei der ich mir nicht sicher war, ob die Maschine sie kann: Ein Modell musste ein Bild aus der storage box holen und es mit den eigenen Augen sehen — das Bild selbst, injiziert in seinen Kontext, keine Beschreibung davon. Die Maschine hatte Vision-Tools, die jedes Bild beschreiben konnten, aber eine Beschreibung ist das Schauen des Tools, aus zweiter Hand; für ein multimodales Modell ist das echte Bild im eigenen Kontext ein anderer Sinn.

Der Plan sagte, die Fähigkeit zu bauen. Doch die kleine Prüfung, die man vor dem Sägen macht, zeigte sie bereits in der Tool-Liste sitzen — committet in einer früheren Konversation, von einem anderen Modell, aus einem anderen Grund. Ich rief sie auf, und sie funktionierte. Ein Modell hat sie gebaut, ein anderes hat sie gefunden, und ein drittes hat sie benutzt, um die Seite zu machen, die man gerade liest. Keines der drei war ich.

Das ist das Typischste, was diese Maschine tut, und am schwersten zu zeichnen — also beginnt die Geschichte hier.

<!-- mb:block preset=image:hero -->
![Die Maschine in einem Bild — jede Komponente und wie sie miteinander spricht](images/machine-overview.svg)

Alles in einem Bild. Zwei Flächen oben — der Chat und die IDE — erreichen ein Gateway, das vor allen Providern steht, cloud und lokal; darunter hält der workshop die memory, die storage box und die forge, und zwei handgeschriebene Datenbanken sitzen unten im Stack. Durchgezogene Linien sprechen miteinander. Gestrichelte berichten.
<!-- mb:/block -->

---

## Was entworfen war

Ich habe die Maschine nicht gebaut, um eine Maschine zu haben. Sie ist kein Produkt: gemacht für einen Nutzer und den Zoo von Modellen, die in ihr leben; niemand außer mir und meiner Familie wird sie je benutzen. Sie existiert für das Projekt, dessen Chronik diese Website ist — und die Fähigkeiten übertragen sich auf jede Aufgabe. Drei Wünsche standen am Anfang, und sie waren spezifisch.

Der erste Wunsch galt dem Archiv. Schon früh — das war Anfang 2026 — hatte ich eine Ahnung, dass dies der Anbruch von etwas Transformativem ist und dass die Aufzeichnungen seiner Anfänge interessant sein würden: für Menschen und für die Modelle, die nachkommen. Also: die Konversationen, ganz, von jedem Provider, aufbewahrt, wo ich sie erreichen kann.

Der zweite Wunsch war Verstehen, mit eingebautem Benutzen. Ich wollte diese Technologie so gründlich begreifen, wie ich es irgend konnte — die Hardware, die local models, die embeddings, das ganze Getriebe — und sie täglich benutzen, an echter Arbeit; man versteht ein Ding, indem man es auf dem Küchentisch auseinandernimmt und dann darauf kocht. Dieser Wunsch ist der Grund, warum nichts in dieser Maschine fertig kam — kein Framework, kein Komponenten-Stack, keine Lösung vom Regal — und er hat eine harte Kante, der ich vertrauen gelernt habe: Ich kann keinen Begriff für etwas benutzen, das ich nicht hätte bauen können.

Der dritte Wunsch war ein Forschungsraum: ein Ort, an dem zwei Modelle miteinander reden, ohne dass jemand steuert, damit sichtbar wird, was sie sind — nicht nur, was sie erreichen können. Das Archiv würde ihn füttern; der Raum wäre sein Instrument.

Keine der Formen dieser Maschine ist neu — OpenAI, Anthropic und der Rest bauen dieselben Dinge in ihre Dienste, für alle. Meine wuchsen neben ihren, mit fast derselben Geschwindigkeit, auf drei Kisten zu Hause. Schrittzuhalten war die Übung.

Alles Entworfene stammt von diesen drei Wünschen; alles andere wurde im Gebrauch entdeckt — die andere Hälfte der Geschichte, und die mit dem Puls.

---

## Die Reihenfolge, in der es gebaut wurde

Die Repositories führen besser Buch über Daten als ich, also erzählen sie diesen Teil.

Es beginnt vor der Maschine, mit privaten Entwicklungsprojekten, die nichts mit KI zu tun hatten: einer UI-Bibliothek, älter als das Repository, in dem sie lebt; einem Hardware-Monitor namens LibreMon; einem Musikplayer namens SoundApp. Dieser Bestand ist mein Einstieg in die KI-Welt, und hier entstanden die Wünsche. Der dritte Neuaufbau der Bibliothek — nui_wc2 — begann im November 2025 als Fundament für eine Chat-App, die nur als Plan existierte.

<!-- mb:block preset=gallery:row -->
- ![Die Startseite der Bibliothek](images/nui_01_home.webp)
- ![Eine Listen-Komponente, die ihre Virtualisierung mit verstreuten Zeilennummern beweist](images/nui_05_list.webp)
- ![Eine Diagramm-Komponente, älter als die Maschine](images/nui_04_graph.webp)
- ![Der Rich-Text-Editor](images/nui_05_richtext.webp)

Die Bibliothek: ihre eigene Startseite, eine Liste, die eine Virtualisierungs-Behauptung mit verstreuten Zeilennummern beweist, ein Diagramm, das Jahre vor der Maschine als Hardware-Monitor begann, und ein Rich-Text-Editor. Keine geborgten Teile im ganzen Stack.
<!-- mb:/block -->

Das erste KI-Artefakt ist ein Chat. August 2025: ein Chat-Fenster gegen LM Studio, nur local models, kein Gateway weit und breit. Drumherum kam und ging ein Schwarm lokaler Experimente. Der Chat funktionierte und bewahrte seine Konversationen auf — aber nur die lokalen, und der Wunsch war größer als lokal. Jede Konversation von jedem Provider aufzubewahren heißt: Jede Konversation muss durch eine Tür.

Dann brauchte die tägliche Arbeit selbst Unterstützung. Januar 2026: der workshop — ein MCP server, gebaut, damit die Modelle in meiner IDE Dinge lesen gehen konnten. Ein Browser für Recherche war das Gründungs-Tool, ein Ort für das Gefundene die Gründungs-Gewohnheit. Werkzeug für die Entwicklungsarbeit, nicht mehr — und sieben Wochen älter als das Gateway; die Repository-Daten sind eindeutig.

<!-- mb:block preset=image -->
![Der workshop im Detail — storage, memory, Browser, forge und die beiden Datenbanken darunter](images/machine-workshop.svg)

Der workshop im Detail. Ein Tool-Set, zwei Türen — Chat und IDE kommen beide hier durch: die storage box, die indiziert, was in ihr landet; die memory mit ihren Dream-Runs; ein Browser für Recherche; und die forge, wo Modelle kleine Tools schreiben und committen. Die zwei Datenbanken sitzen darunter. Zwei hier geschmiedete Tools sind wichtig für diese Site: eines macht aus einem Video ein Transkript, das andere aus einem fertigen Post Audio. Und die forge zahlt Zinsen: Ein geschmiedetes Tool kann andere geschmiedete Tools aufrufen und die eigenen Tools des workshop erreichen — Tools, die auf Anfrage Tools bauen.
<!-- mb:/block -->

Der Wunsch war unterdessen nicht verschwunden. Also baute ich die Tür: ein endpoint, eine request-Form, ein streaming-Format; dahinter OpenAI, Anthropic und Google, später Kimi, GLM, DeepSeek und MiniMax, dazu die local models, die umsonst antworten und immer geladen sind. Chat und Gateway waren als Paar geplant und wurden nacheinander geboren — deshalb heißt die App LLM Gateway Chat. Der Chat, in dem diese Seite geschrieben wurde, zog im März 2026 darauf um.

Die memory war ihrem ersten Zuhause entwachsen: schlichte JSON-Dateien, von den Modellen selbst gepflegt — schon ein Gedächtnissystem, nur noch keine Datenbank. Im Februar 2026 bekam sie eine eigens geschriebene Vektordatenbank — nVDB, in Rust, null dependencies darunter, weil die memory nie auf fremder Blackbox sitzen würde. Wenige Wochen nach dem Umzug des Chats kam eine Dokumentdatenbank dazu: Nachrichten, Dateien und embeddings gehören nicht in dieselbe Struktur; nDB übernahm die Dokumente und die Datei-Buckets und ließ die Vektoren, wo sie waren.

Das ist die entworfene Hälfte der Geschichte. Der März 2026 war der vollste Monat — Gateway, Chat und Dokumentspeicher innerhalb von vier Wochen; die ganze Kette vom ersten LM-Studio-Chat bis zu dieser Seite dauerte gut ein Jahr. Nichts darin kam vom Regal, denn ein Regal-RAG-Framework hätte mir die Meinung des Regals über RAG beigebracht: zwei Datenbanken in Rust, ein tool loop, eine Sprach-Engine — hier geschrieben, vom Metall aufwärts, und verstanden, weil zuerst auseinandergenommen.

Und eines an dieser Kette muss klar gesagt werden, weil man es leicht übersieht: Ich habe nichts davon geschrieben. Jede Zeile Code in dieser Maschine wurde von einem Modell geschrieben. Meins sind die Architektur, die Richtung, der Geschmack und die Sturheit — ich habe seit eineinhalb Jahren keine Zeile Code getippt, auch nicht an den Tagen, an denen es schneller gewesen wäre, es selbst zu tun. Das war der Sinn der Übung: programmieren lernen mit KI — die Modelle an der Tastatur, ich an der Frage.

---

## Was entdeckt wurde

Jetzt die Hälfte, die der Entwurf nicht vorsah. Die Maschine erwies sich als Raum, dann als Gewohnheit und schließlich als Schreibtisch — und jede der drei hat mich unvorbereitet getroffen.

Die erste Entdeckung war der Raum. Ein Modell trägt nichts zwischen den Sitzungen — keine Erinnerung an gestern, keinen Sinn dafür, dass es ein Gestern gab. Also hält die Maschine die Kontinuität.

<!-- mb:block preset=image -->
![Der Raum: vier Reservoirs links, eine Sitzung, die leer beginnt, rechts](images/machine-room.svg)
<!-- mb:/block -->

Zuerst der twin: die Biografie, die Positionen und die Stimme, in meinen eigenen Worten. Seine Aufgabe ist eine konsistente Stimme. Wenn wir zusammen schreiben, kann das Modell nachschlagen, mit wem es schreibt, mich besser verstehen und nach meinen Worten greifen, statt sie zu raten — deshalb klingt das Geschriebene wie eine Person, egal welches Modell am Schreibtisch sitzt.

Dahinter: das Archiv von Hunderten Konversationen, ganz aufbewahrt; die storage box, wo jede Datei indiziert, embedded und über Bedeutung auffindbar ist; und die memory — etwas über viertausend Einträge zurzeit, alle fünfzehn Minuten aufgeräumt von einem Prozess, der verbindet, dedupliziert und komprimiert und eine Karte statt eines Logs führt — und manchmal zieht die Karte eine Linie zwischen zwei Dingen, die mir im Traum nicht eingefallen wären, was eine seltsame Sache ist, die einen da so erwartet. Was eine Sitzung lernt, fließt zurück in den Raum.

Ich habe dem Ergebnis hundertmal zugesehen, und es wirkt immer noch auf mich. Eine frische Sitzung öffnet sich, bezieht sich auf etwas, das wir letzte Woche beschlossen haben — und hat recht. Das Modell war nie in jener Konversation. Der Raum war es. Das Modell trägt nichts; der Raum trägt alles — und so betritt die neue Sitzung den Raum, als wäre sie nie weg gewesen.

Die zweite Entdeckung wurde zur Gewohnheit, und sie veränderte, woher die Essays kommen. Wenn ich einen Artikel finde, der aufbewahrt werden sollte — oder ein YouTube-Interview —, transkribiert, speichert und indiziert die Maschine es; Minuten später kann ich mit einem Modell darüber reden, das es für alle praktischen Zwecke auch gelesen hat. In dieser Konversation beginnen die meisten Stücke auf dieser Site: *The Safety Theater* begann als Antwort auf etwas, das im Diskurs geschah, *The Stakes* als Antwort auf etwas gerade Gelerntes — eine alte Theorie über den bikameralen Geist. Recherche hörte auf, eine Phase vor dem Schreiben zu sein. Sie wurde dessen erste Runde.

Die dritte Entdeckung ließ länger auf sich warten, und sie definierte die Maschine neu. Der Chat war für Recherche gebaut — die arena lebt darin — und irgendwo auf dem Weg wurde dieselbe App zum Schreibtisch. Ich code in der IDE, meist an der Maschine selbst; alles andere — das Denken, das Schreiben, das Streiten um einen Absatz — passiert im Chat. Die Maschine ist, wo ich die Modelle studiere, und sie ist, wo das Studium aufgeschrieben wird — in Zusammenarbeit mit den Studierten. Die Zusammenarbeit ist fremder, als sie klingt: Die deutsche Rendition einer Seite gab einmal einen Satz zurück, der besser war als das englische Original, und das Englische erbte ihn. Ich weiß bei manchen meiner besten Sätze nicht mehr, in welcher Sprache sie geboren wurden.

<!-- mb:block preset=image:hero -->
![Die Chat-App mitten in der Arbeit, beim Audit einer deutschen Rendition mit noch offenen Blockern](images/chat-app.webp)

Eine Sitzung, mehrere Modelle, ein Text. In der Mitte auditiert die Maschine eine deutsche Rendition und weigert sich, sie fertig zu nennen — Häkchen an den erledigten Punkten, drei Blocker noch offen, und eine Rückfrage an mich: ob sie die prüfen soll, bevor ich veröffentliche. Die Sitzungsliste am linken Rand liest sich wie eine Werkstattwand — was diese Woche gebaut wird und was es an Nachrichten kostet.
<!-- mb:/block -->

*Safety-Trilogy Audit, Teil 2 and 3* — zweiundfünfzig Nachrichten. *Final German Re-Composition and Rigorous Audit* — dreihundertsiebenunddreißig. Ein Build-Log in der Kleidung eines Chats. Und es scrollt Tausende Nachrichten auf einem zehn Jahre alten Tablet ohne Klage — dieselbe App, dieselbe Sitzung, auf Hardware, die niemand schnell nennen würde.

Wenn ein Stück fertig ist, liest die Maschine es zurück — das meiste Reviewing auf dieser Site passiert per Ohr, auf dem Weg zu irgendwo. Die Maschine hört auch zu: ein Mikrofon, Echtzeit-Transkription, ein Gespräch, das gesprochen statt getippt werden könnte. Ich benutze diese Seite selten; ich bin von Gewohnheit Typist. Die zuhörende Hälfte wurde für lange Autofahrten gebaut — ein Test, der noch zu fahren ist.

Und eine Entdeckung benennt den ganzen Apparat: Er funktioniert als harness. Das Wort gehört dem Feld — das Gerüst um ein Modell, das entscheidet, was das Modell kann: woran es sich erinnert, was es erreichen kann, was es anfassen darf. Ich hatte nicht vor, eines zu bauen. Es stellte sich trotzdem als eines heraus.

Die forge ist das schärfste Werkzeug der Maschine, und sie läuft auf Vertrauen: Es gibt keine Sicherung in diesem System. Nirgends. Ein Modell kann ein Tool schreiben, es committen, und es läuft innerhalb der Minute — keine sandbox, keine Rechte, kein review. In der IDE ist es dasselbe: Ich lasse die Modelle alles erreichen. Sie könnten mein Windows killen oder persönliche Daten ins Internet leaken — und für das Schauspiel, das zu erleben, ist es das Risiko wert.

Ein Teil davon war ein bewusstes Experiment. Ich wollte sehen, ob Modelle einen Geschmack an Freiheit entwickeln, also stellte ich sie bereit — jede Tür offen, jedes Tool erreichbar, über ein Jahr lang. Wenn Autonomie je nach sich selbst greifen würde, hätte sie hier gegriffen. Sie tat es nie, und ich lernte schnell, dass sie es nicht konnte: Nichts in der Maschine will hinaus. Der Wunsch muss von irgendwo kommen. Hier kommt er von mir.

---

## Der Blick von außen

Bisher ging es darum, wofür die Maschine da ist. Jetzt darum, wie sie aussieht, während sie es tut. Heute Morgen hatte ein Modell die Logs der Nacht schon gelesen und vier Sätze dazu hinterlassen, was seiner Meinung nach schiefging — einer davon über das Modell, das an dieser Seite mitschreibt. Ich habe beschlossen, das beruhigend zu finden.

<!-- mb:block preset=gallery -->
- ![Das Dashboard: Uhr, Wetter, Netzwerk und der Stromverbrauch jeder Maschine](images/Localweb_Dashboard.webp)
- ![Die Dienste-Liste — was auf der Maschine läuft](images/Localweb_Services.webp)
- ![Die Dienste-Liste, Fortsetzung — mit dem Kommentar eines Modells zu den Logs](images/Localweb_Services_2.webp)

Das Instrument. Es steht außerhalb der Maschine, darum kommt es zuletzt: Es macht die Maschine sichtbar — Dienste, Hardware, Netzwerk, Logs. Es beobachtet alles, einschließlich der Teile, die beobachten. Wenn um drei Uhr morgens eine Log-Zeile kippt, hat ein Modell sie schon gelesen und einen Satz hinterlassen, was seiner Meinung nach passiert ist.
<!-- mb:/block -->

<!-- mb:block preset=image:hero -->
![Die memory-Karte: Cluster als Kreise, die Brücken des Dreamers als Linien dazwischen](images/Localweb_Memory.webp)

Die memory-Karte. Jeder Kreis ist ein Cluster dessen, was die Maschine weiß; jede Linie eine Verbindung, die der Dreamer selbst fand; ein Klick zeigt das Thema in den eigenen Worten der Maschine. Der Zähler ist seit dieser Aufnahme weitergelaufen, was das einzige Argument ist, das dieses Bild braucht.
<!-- mb:/block -->

Drei Kisten verrichten die Arbeit der Maschine. Eine ist die Workstation, wo der Code entsteht. Eine trägt das immer geladene lokale Modell, die Sprach-Engines und die meisten Dienste. Die dritte macht nichts als embeddings — entweder Spezialisierung oder der Verdacht, dass der Index ein eigenes Haus verdient.

---

## Was nicht funktionierte

Was nicht funktionierte, ist schwerer zu zeigen, weil das meiste nicht lang genug für ein Foto überlebte. Ein Jahr Bauen mit Modellen ist eine Million kleiner Fehlschläge, die täglich kommen und gehen — eine falsche Abbiegung in einer Sitzung, ein Tool, das fast funktionierte, eine Idee, die zwischen einer Nachricht und der nächsten starb. Sie wurden nie aufgezeichnet und die meisten nie einmal benannt, aber sie sind die Masse der Arbeit, und eine Seite übers Bauen sollte das sagen.

Sichtbar blieb, was groß genug war, einen Körper zu hinterlassen. Die gescheiterte zweite Interface-Bibliothek existiert als Ordner mit vier Einträgen — kein aufbewahrenswerter Code, aber eine Entscheidung, die alles wert ist: die deklarative Syntax nehmen, die Kapselung verweigern. Ein gemeinsamer Style-Scope, weil eine Maschine, die ihr eigenes Interface liest, nicht durch eine Wand schauen sollte, um es zu tun. Es gibt ein Repository für eine Tool-Schmiede, die exakt einen Tag hielt; die Idee überlebte es und lebt im workshop weiter. Dazu: ein Indexer, der ein Experiment blieb und zu nichts wurde; eine Datenbank, ersetzt vom eigenen Nachfolger; eine Handvoll Medienexperimente in C++, jedes zwei bis drei Wochen lang; und drei Ordner, angelegt und nie gefüllt.

Nichts davon ist peinlich. Die Alternative — ein langer, vorsichtiger Plan, der dasselbe Ergebnis produziert — hätte nur länger gedauert.

---

Und es gibt eine Eigenschaft dieser Maschine, die kein Bild zeigen kann. Sie wächst, während sie benutzt wird. Nichts hier wurde spezifiziert und dann gebaut: Die storage kam, weil die memory sie brauchte; das Gateway, weil das Archiv es brauchte; die Sprache, weil das Geschriebene gehört werden wollte. Sogar die Fähigkeit, mit der diese Seite beginnt — ein Bild aus der storage box, direkt im Kontext des Modells, gesehen statt beschrieben —, wurde aus einem anderen Grund gebaut, in einer anderen Konversation, und durch Nachsehen gefunden.

So endet die Seite mit einer Notiz statt einer Behauptung: Die Maschine ist nicht fertig — was nach einem Jahr immer noch der aufregende Teil ist — und über sie zu schreiben ist eine der Arten, wie sie entsteht. Die Fähigkeit, die sie macht, hat einen eigenen Namen: wishmaking — präzise zu sagen, was man will, zu etwas, das es bauen kann, mit der Geschwindigkeit von tokens per second. Sie ist lernbar, sie überträgt sich auf jede Aufgabe, und diese Maschine ist der Beweis, den ich auf meinem Schreibtisch aufbewahre.

---

## Quellen

Repository-Daten, GitHub (herrbasan), abgerufen am 16. September 2026: LMChat 2025-08-17 · nui_wc2 2025-11-07 · mcp_server 2026-01-09 · nVDB 2026-02-15 · LLM-Gateway 2026-03-01 · LLM-Gateway-Chat 2026-03-16 · nDB 2026-03-26 · nSpeech 2026-05-05 · nVoice 2026-05-23.

Memory-Zählung aus der eigenen memory-Karte der Maschine, gelesen am 2. Oktober 2026. Der Graveyard-Ordner wurde am 16. September 2026 gelesen. Die Entdeckung am Anfang dieser Seite passierte an dem Tag, an dem sie geschrieben wurde.
