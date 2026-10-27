---
title: "Der Spielraum ist aufgebraucht"
slug: we-used-up-all-the-slack
lang: de
created: 2026-10-27
modified: 2026-10-27
version: 2026-10-27
authors:
  - id: david-a-renelt
    role: human
  - id: kimi-k31-pro
    role: ai
  - id: gemini-4-argon
    role: translator
  - id: dana-renelt
    role: editor
tags:
  - ai
  - software-development
  - enterprise
  - management
series: null
seriesIndex: null
summary: "Die moderne Unternehmens-IT wurde darauf ausgelegt, Menschen austauschbar und Entscheidungen absicherbar zu machen – bezahlt mit schnellerer Hardware und dem Verlust des Blicks aufs Ganze. Jetzt macht KI das Bauen von Software so billig, dass dieser über Jahrzehnte aufgebaute Puffer aufgebraucht ist."
status: final
---

# Der Spielraum ist aufgebraucht

<!-- mb:block preset=byline -->
*by David A. Renelt (Human) and Kimi K3.1 Pro (AI)*
<!-- mb:/block -->

Veröffentlicht am 27. Oktober 2026

<!-- mb:block preset=player kind=audio -->
[Diesen Artikel anhören](tts/we-used-up-all-the-slack_de_2026-10-27.mp3)
<!-- mb:/block -->

<!-- mb:block preset=image:hero kind=image -->
![Eine riesige graue Fließbandmaschinerie aus nicht verbundenen Teilen wird von einer einzigen schlichten, durchgehenden bernsteinfarbenen Brücke über die Lücke hinweg überspannt.](images/we-used-up-all-the-slack_hero.webp)
<!-- mb:/block -->

Frühe Software entstand meistens am Schreibtisch einer einzelnen Person oder einer Handvoll Leute, die das gesamte Problem im Kopf behielten: was das Programm tun sollte, wie die Maschine es ausführte und welche Kompromisse man dafür eingehen musste. Man sollte diese Ära nicht verklären, denn die Werkzeuge waren oft miserabel, die Programme ebenso, und die technischen Grenzen unbarmherzig. Aber Verschwendung hatte unmittelbare Konsequenzen. Knapper Speicher und langsame Prozessoren erzwangen eine eiserne Disziplin, weil jede Unachtsamkeit das System schlicht zum Stehen brachte.

Dann wurden Speicher und Rechenleistung im Überfluss billig, während Software gleichzeitig zum nervösen Rückgrat ganzer Konzerne aufstieg. Plötzlich erschien es als untragbares Geschäftsrisiko, vom Wissen einiger weniger Entwickler abzuhängen. Der Wunsch nach Kontinuität war vollkommen berechtigt, denn kein Unternehmen sollte ins Wanken geraten, bloß weil eine einzelne Person kündigt oder im Urlaub das Telefon ausschaltet. Die Antwort der Branche bestand darin, Abläufe zu standardisieren, alles zu dokumentieren, Arbeit in winzige Stücke zu teilen und Menschen austauschbar zu machen. Das Ergebnis war eine tiefgreifende Fragmentierung.

## Die Maschine zum Ersetzen von Menschen

Ein Entwickler, der ein Problem von Grund auf durchdrungen hat, lässt sich schwer steuern, weil er im Zweifel weiß, wann eine Vorgabe Unsinn ist. Hundert Entwickler, die kleine, sauber abgegrenzte Tickets abarbeiten, lassen sich dagegen wunderbar verwalten, erzeugen aber sofort einen enormen Bedarf an Koordination, Schnittstellen, Planung und gegenseitigen Erklärungen. Für genau diese selbstgeschaffene Organisation wurden neue Managementmethoden erfunden, und wann immer deren Reibungsverluste zu groß wurden, legte man einfach die nächste Schicht an Methoden obendrauf. Am Ende wirkt eine Abteilung, in der fast genauso viele Menschen koordinieren wie programmieren, wie der natürliche Lauf der Welt.

Dabei muss man weder Agile noch Scrum pauschal verdammen, sondern sie schlicht als das betrachten, was sie in der Praxis werden können: weitere Rahmensysteme desselben Musters. Man führt Zeremonien, Rollen und Artefakte ein, ohne je ernsthaft zu prüfen, welchen konkreten Schaden sie im jeweiligen Projekt eigentlich abwenden sollen. Jedes einzelne Ritual lässt sich im Kleinen vernünftig begründen, während das große Ganze fast nie beweisen muss, dass am Ende tatsächlich bessere Software herauskommt. Koordination verwandelt sich von einem notwendigen Übel, das man so klein wie möglich hält, in den eigentlichen Daseinszweck der Organisation.

Das liegt nicht daran, dass Manager nutzlos oder alle Entwickler verkannte Genies wären. Die gesamte Struktur wurde um die Annahme herum errichtet, dass Arbeitskraft im Durchschnitt mittelmäßig, schwankend und jederzeit ersetzbar ist – und selbst brillante Köpfe lernen in einem solchen Gehäuse sehr schnell, nur noch ihr eigenes kleines Blumenbeet zu gießen. Man beruft sich dabei gern auf Skalenerträge, übersieht aber ein kleines Detail: Während sich fertige Software fast kostenlos vervielfältigen lässt, skaliert das Verstehen und sichere Verändern eines komplexen Systems überhaupt nicht gut mit der Kopfzahl. Je mehr Menschen am selben Gebilde arbeiten, desto weiter zersplittert das Verständnis, weshalb man sich irgendwann unweigerlich fragen muss, warum das eine Unternehmen tausend Entwickler für eine Aufgabe benötigt, die ein anderes mit fünf Leuten erledigt.

## Das Bild, das niemand mehr hat

Jeder vorgefertigte Baustein und jede fremde Bibliothek nimmt zunächst Arbeit vom eigenen Schreibtisch, schafft sie aber nicht aus der Welt. Das Problem wandert lediglich hinter eine Schnittstelle in ein anderes Projekt mit seinen eigenen Abhängigkeiten und Eigenheiten. Selbst wenn alle Beteiligten ihr Handwerk verstehen und jedes Einzelteil seine Tests besteht, entsteht das tatsächliche Verhalten des Systems erst im Zusammenspiel: bei Zeitverhalten, Zuständen, Speicherverbrauch, obskuren Fehlerfällen, Versionskonflikten und all den stillschweigenden Annahmen, die erst dann krachend aufeinanderprallen, wenn sie sich im laufenden Betrieb begegnen.

Abstraktion lässt Komplexität nicht verschwinden; sie ist lediglich eine höfliche Vereinbarung, an bestimmten Stellen nicht mehr hinzusehen. Solange alle Probleme brav innerhalb ihrer zugewiesenen Grenzen bleiben, funktioniert dieses Arrangement ausgezeichnet. Sobald ein Fehler jedoch quer durch die Schichten schlägt, braucht man jemanden, der die Vereinbarung bricht und wieder in das Uhrwerk hineinschauen kann.

Dass auch ein gigantisches System aus tausenden Beiträgen zusammenhalten kann, zeigt [Linux](../references/protected-ownership_de.md). Doch Linux funktioniert nicht, weil Verantwortung in einem freundlichen Nebel geteilter Zuständigkeiten verschwindet, sondern weil Linus Torvalds und eine klare Hierarchie von Maintainern die Integrationsverantwortung – und vor allem das Recht, schlechte Änderungen abzulehnen – eisern an den entscheidenden Stellen bündeln. Saubere Module ersetzen niemals denjenigen, der für das Ganze geradesteht.

Eine ähnliche Klarheit erkennt man in Redis, das unverkennbar die Handschrift eines einzelnen, kohärenten Urteilsvermögens trägt, oder im frühen id Software, wo John Carmack einen scharf umrissenen Bereich verantwortete. Nicht jeder im Team musste Carmacks Engine bis ins letzte Bit durchdringen, aber er besaß den Freiraum, sie als Ganzes zu entwerfen und weiterzuentwickeln, ohne vorher im Stuhlkreis über Storypoints abzustimmen. Das Gegenteil von Fragmentierung ist nicht ein Haufen Code ohne jede Grenze, sondern eine Grenze, die Verantwortung schützt, statt sie bis zur Unkenntlichkeit zu verteilen.

In den vergangenen Jahrzehnten sind jedoch viele der erfahrensten Systembauer ins Management abgewandert, während die nachfolgenden Generationen ihren Beruf oft schon als Integratoren vorgefertigter Frameworks lernten. Zehn Jahre Erfahrung im Bändigen eines bestimmten Ökosystems sind nicht dasselbe wie zehn Jahre Erfahrung im Verstehen eines Systems von Grund auf – was kein Urteil über die Intelligenz der Beteiligten ist, sondern schlicht eine Folge dessen, was der Arbeitsalltag überhaupt noch zu lernen erlaubt.

Deshalb beginnt ein neues Projekt heute fast reflexhaft mit der Suche nach dem passenden Werkzeugkasten. Noch bevor das eigentliche Problem ganz durchdacht ist, gießt man die Lösung bereits in die Betonform eines gewählten Frameworks, das fortan als unsichtbarer Produktmanager am Tisch sitzt. Wenn es später heißt, eine gewünschte Funktion sei technisch unmöglich, bedeutet das in Wahrheit häufig nur, dass die geerbte Architektur diesen Weg nicht vorgesehen hat.

Ob all diese Gerüste tatsächlich die versprochene Produktivität liefern, darf man getrost bezweifeln, auch wenn man dafür keine akademische Statistik bemühen muss, da ohnehin fast nie zwei Teams dasselbe Produkt einmal mit und einmal ohne Framework um die Wette bauen. Bloße Verbreitung ist kein Beweis für Tauglichkeit, und der Umstand, dass sich alle an eine Krücke gewöhnt haben, ist noch keine Messung. Meine eigene Haltung ist über die Jahre recht eindeutig geworden: Man sollte niemals mit einem Framework beginnen, sondern immer beim nackten Problem, und jedes externe Werkzeug erst dann über die Schwelle bitten, wenn es seinen Eintrittspreis im konkreten Fall gerechtfertigt hat. Der immer wilder wuchernde Stammbaum ständig neuer Frameworks ist jedenfalls ein eigenartiges Denkmal für ihren angeblichen Erfolg.

## Wenn Geschmack Gesetz wird

Dieselbe Mechanik greift dort, wo Stilfragen zur Religion erhoben werden: Auch „Clean Code“ und sogenannte Best Practices sind im Kern nichts anderes als Frameworks für das Denken. Das Ziel von Software besteht nicht darin, im Quelltexteditor hübsch und aufgeräumt auszusehen, sondern ihre Aufgabe zuverlässig und schnell zu erfüllen. Alles andere ist bloßes Mittel zum Zweck; was diesem Ziel nicht dient, sollte uns misstrauisch machen, und was ihm im Weg steht, ist schlechtes Handwerk.

Auch das Zauberwort „Wartbarkeit“ bildet hier keine Ausnahme. Wer heute zusätzliche Schichten und Umwege einbaut, um den Code wartbarer zu machen, stellt einen Wechsel auf die Zukunft aus und behauptet, diese Bauform werde später einmal Fehler verhindern. Das ist keine Tatsache, sondern eine Prognose über nicht eingetretene Ereignisse, und wer den Erfolg eines Verfahrens an der Zahl der behobenen Fehler misst, belohnt im Zweifel ein System für die Probleme, die es selbst erst geschaffen hat. Damit ist nicht jeder Gedanke an die Zukunft falsch, aber das bloße Aussprechen des Wortes Wartbarkeit beendet noch lange keine Diskussion, wenn die Kosten in Form von Indirektion, Schwerfälligkeit und Leistungsverlust schon heute ganz real anfallen.

Kommentare etwa, die lediglich in Prosa nacherzählen, was der Code ohnehin tut, erschaffen eine ungeprüfte Parallelfassung der Wahrheit, die bei der nächsten Änderung leicht vom tatsächlichen Verhalten wegdriftet. Und die Angewohnheit, Logik in Dutzende winzige, wohlklingend benannte Funktionen zu zerhacken, sorgt zwar beim Lesen einer einzelnen Stelle für ein warmes Gefühl der Ordnung, macht es aber oft zur Qual, den tatsächlichen Kontrollfluss über das Gesamtsystem hinweg noch zu verfolgen. Lokale Sauberkeit erkauft man sich erstaunlich leicht mit globaler Blindheit.

Jede sinnvolle Regel braucht deshalb zwei Dinge: einen konkreten Schaden, den sie verhindert, und einen klaren Geltungsbereich, an dem sie wieder endet. Der Grundsatz, niemals ungeprüften Eingaben zu vertrauen, benennt eine sehr reale Gefahr, heißt aber nicht, dass jede interne Funktion ihre Parameter sicherheitshalber noch dreimal auf Existenz prüfen muss. Solche Kontrollen gehören an die Außengrenze des Systems, damit sich der innere Pfad anschließend auf die dort geschaffene Ordnung verlassen kann; eine Regel ohne Grenze hingegen verwandelt sich sofort in das nächste starre Korsett.

Wenn wir künftig ohnehin immer seltener jede Codezeile von Hand streicheln, sondern Spezifikationen verfassen und das Ergebnis über Berichte, Tests und harte Leistungsmessungen abnehmen, verliert der ästhetische Komfort des menschlichen Lesers endgültig seinen Vorrang. Der Nachfolger von Clean Code ist nicht schlampiger Code, sondern überprüfbarer Code.

## Hardware bezahlte die Rechnung

Dass diese ganze schwerfällige Arbeitsweise über Jahrzehnte nicht unter ihrem eigenen Gewicht zusammenbrach, verdankt sie einem stillen Sponsor: der Hardwareindustrie. Immer schnellere Prozessoren und immer größere Speicherriegel haben die Rechnung für unsere organisatorische Bequemlichkeit bezahlt und dafür gesorgt, dass selbst maßlos aufgeblähte Werkzeuge gerade noch benutzbar blieben. Fast jeder kennt diesen eigentümlichen Kreislauf, bei dem man sich alle paar Jahre einen deutlich stärkeren Rechner kauft, nur damit sich dieselben Büro- und Arbeitsprogramme wieder ungefähr so flüssig anfühlen wie fünf Jahre zuvor – wobei ein Programm wie Adobe Acrobat zum fast schon klassischen Mahnmal dafür geworden ist, wie viel Maschine man auf das Anzeigen eines Dokuments werfen kann.

Für das umliegende Ökosystem war das ein glänzendes Geschäft, denn Hardwarehersteller, Cloud-Anbieter, Berater, Schulungsfirmen und Wartungsdienstleister verdienten prächtig an der wachsenden Komplexität. Jede einzelne Entscheidung auf dem Weg dorthin sah im Sitzungsprotokoll nach vernünftiger Risikovorsorge und modernem Fortschritt aus, während die Software selbst immer träger und teurer wurde. Hin und wieder führte ein winziges Team die großen Platzhirsche vor, indem es mit einem Bruchteil der Mittel ein besseres Produkt baute, doch der klassische Einkauf in Unternehmen schützte verlässlich die etablierte Wahl. Ein großer Anbieter liefert schließlich immer auch eine exzellente Adresse für spätere Schuldzuweisungen mit, weshalb die teure, langsame Standardlösung intern fast immer als die sicherere Entscheidung durchging.

## Open Source trägt das Geld nicht lautlos

Nun könnte man einwenden, Open Source sei das natürliche Gegengift zu dieser Entwicklung, und tatsächlich bleibt offener Quelltext ein hervorragender Ausgangspunkt, weil man ihn prüfen, verändern und im Zweifel selbst weiterführen kann. Doch eine offene Lizenz macht ein Projekt noch lange nicht immun gegen wirtschaftliche Schwerkraft. Als die großen Konzerne entdeckten, wie nützlich diese gemeinsamen Fundamente waren, brachten sie Geld, hauptamtliche Entwickler, Stiftungen, Konferenzen und vor allem ihre eigenen Unternehmensanforderungen in die Projekte ein. Manche Systeme bewahrten sich ihre ursprüngliche Schärfe, andere begannen unter dem Einfluss ihrer Sponsoren allmählich genau jenen Tankern zu ähneln, denen man einst entkommen wollte – was kein Argument gegen bezahlte Arbeit ist, wohl aber gegen die fromme Hoffnung, eine Lizenzdatei könne die Anreize ihrer größten Geldgeber außer Kraft setzen.

Auch hier verschiebt KI gerade die Gewichte auf eine sehr praktische Weise. Bislang bestand der Normalfall darin, ein fremdes Open-Source-Paket möglichst unverändert als Abhängigkeit einzubinden und dabei klaglos die gesamte Maschinerie für hundert Sonderfälle mitzuschleppen, die man selbst gar nicht hat. Wenn das Lesen, Verstehen, Herauslösen und Umschreiben von Code jedoch deutlich billiger wird, lohnt es sich plötzlich wieder, ein Projekt zu forken, auf den eigenen Bedarf zuzuschneiden oder sich nur den entscheidenden Kerngedanken anzueignen. Das ist nicht das Ende von Open Source, sondern die späte Einlösung seines radikalsten Versprechens: dass man fremdes Wissen nicht nur konsumieren, sondern sich wirklich zu eigen machen darf, sodass gemeinsame Infrastruktur dort bleibt, wo sie hingehört, während wir auf der Anwendungsebene wieder öfter selbst bauen statt bloß fremde Pakete zu verwalten.

## Dann lieferte das Schlafzimmer

Der eigentliche Riss im Fundament entstand in dem Moment, als Einzelpersonen und winzige Gruppen mithilfe von KI begannen, funktionierende Software in einem Umfang auszuliefern, für den man im Konzern bisher ganz selbstverständlich eine eigene Abteilung samt Jahresbudget eingeplant hätte. Natürlich ist nicht jeder dieser Würfe sofort bereit für den Einsatz in einer Großbank, und der Weg vom verblüffenden Prototypen zum dauerhaft verlässlichen Betrieb bleibt steinig. Aber genügend dieser Projekte funktionieren bereits gut genug, um die gewohnten Personalrechnungen empfindlich in Erklärungsnot zu bringen.

Die erste Reaktion der Unternehmen fiel erwartungsgemäß aus: Man gab die Parole aus, die eigenen Entwickler sollten ab sofort ebenfalls KI-Werkzeuge im Alltag nutzen. Das hilft durchaus, wenn es darum geht, schneller Codezeilen zu tippen, sich in eine unbekannte Bibliothek einzuarbeiten, Tests zu generieren oder eine Skizze zusammenzubauen. Es verkürzt jedoch mit keinem einzigen Tag die Liegezeit eines Tickets, das auf drei Freigaben wartet, es fügt keine zerschnittenen Zuständigkeiten wieder zusammen, und es befreit niemanden aus einer verfahrenen Architektur. Drückt man jedem Rädchen in einer fragmentierten Maschine ein schnelleres Werkzeug in die Hand, erhält man am Ende vor allem eines: schnellere Fragmente.

Folgerichtig dauerte es keine fünf Minuten, bis die Branche auch rund um die KI wieder genau das tat, was sie am besten kann, und einen dichten Wald neuer Frameworks pflanzte. Dabei ist der eigentliche Vorgang im Kern bestechend schlicht: Man stellt einen Kontext zusammen, schickt eine Anfrage an das Modell, erhält eine Antwort und entscheidet über den nächsten Schritt. Doch noch bevor dieser neue Grundbaustein überhaupt richtig verstanden und ausgelotet war, legte man schon wieder die vertraute Decke aus Abstraktionsschichten, Orchestrierern und vorgefertigten Workflows darüber – was in manchen Spezialfällen nützlich sein mag, als Standard-Ausgangspunkt jedoch ausgerechnet jene vier Stellen im Nebel verschwinden lässt, an denen das eigentliche Urteil stattfindet: Kontext, Anfrage, Werkzeuge und Ergebnis.

Hinzu kommt, dass ein Sprachmodell kein neutraler Ingenieur vom anderen Stern ist. Seine Reflexe und Standardvorschläge speisen sich aus dem, was in Millionen öffentlicher Repositories, Forenbeiträgen und Lehrbüchern am häufigsten wiederholt wurde; es kennt die laute Debatte über das richtige Vorgehen, nicht den stillen Benchmark, den nie jemand durchgeführt hat. Lässt man das Modell ohne straffe Führung gewähren, automatisiert es deshalb mit großer Begeisterung genau jene aufgeblähte Durchschnittsarchitektur, unter der wir ohnehin schon leiden.

Wer diesem Reflex mit riesigen Prompt-Sammlungen, starr vorgeschriebenen Skills, verschlungenen Multi-Agenten-Ketten und endlosen automatischen Schleifen begegnet, baut im Grunde nur das alte Organigramm im Inneren seines KI-Harnesses nach. Mehr Agenten erzeugen zunächst einmal mehr Durchsatz, aber eben auch sofort wieder mehr Schnittstellen, mehr Übergabeverluste und mehr Koordinationsbedarf. In meinen eigenen Versuchen mit parallel arbeitenden Sitzungen zeigte sich dieses Muster überdeutlich: Jedes Teilergebnis sah für sich genommen ordentlich aus, doch beim Zusammenfügen waren plötzlich faule Kompromisse nötig, die eine einzige Sitzung mit dem gesamten Kontext durch eine frühe, einfache Richtungsentscheidung mühelos vermieden hätte. Parallelität erkauft Geschwindigkeit oft mit einem Verlust an innerer Stimmigkeit, weshalb eine kluge Aufteilung immer echten Verantwortungsgrenzen folgen muss und nicht bloß der Versuchung, Arbeit in handliche Häppchen zu schneiden.

Dabei hilft eine einfache Unterscheidung: Ein Harness, das dem Modell Werkzeuge reicht, Berechtigungen regelt und harte Sicherheitsgrenzen zieht, ist nützliche Infrastruktur; ein Harness hingegen, das dem Modell jeden einzelnen Denkschritt vorschreiben will, ist bloß in Code gegossenes Mikromanagement. Es erweist sich als weitaus fruchtbarer, die Richtung und das geforderte Ergebnis scharf vorzugeben, als jede Bewegung zu gängeln – etwa indem man eine präzise Spezifikation zwischen verschiedenen Modellen hin- und herspielt, eine kritische Gegenprüfung verlangt und an den entscheidenden Kreuzungen selbst den Impuls gibt, statt teure Endlosschleifen laufen zu lassen, in denen die Maschine im Blindflug jeden denkbaren Irrtum einmal ausprobiert.

## Der Spielraum ist aufgebraucht

Jahrelang konnte sich organisatorische Trägheit hinter schnelleren Chips, hinter der schieren Undurchschaubarkeit großer Apparate und vor allem dahinter verstecken, dass schlicht niemand da war, der das Gegenteil bewies. Genau diese Deckung zieht die KI nun weg.

Wenn auf solche Kritik heute der gereizte Einwand folgt, wer man denn überhaupt sei, um die etablierten Abläufe ganzer Branchen infrage zu stellen, verrät das meist schon die ganze Verlegenheit: Wer keine belastbaren Messungen auf seiner Seite hat, muss eben auf Dienstgrade und Autorität pochen. Doch die alten Ausreden verlieren ihre Wirkung, wenn jederzeit damit zu rechnen ist, dass die nächste Version jener schwerfälligen Software, über die wir uns täglich ärgern, von einer einzigen, leicht besessenen Person stammt, die sich einfach hingesetzt und das Ding gebaut hat.

Der Gegenentwurf zu unserem heutigen Zustand ist nicht die romantische Rückkehr zum unersetzlichen Einzelkämpfer, der ein undokumentiertes Rätsel hinterlässt und anschließend im Sonnenuntergang verschwindet. Der Wunsch, nicht von einzelnen Köpfen erpressbar zu sein, war immer richtig; der historische Irrtum bestand darin, die Menschen austauschbar zu machen, statt dafür zu sorgen, dass die Software selbst klein, klar und verständlich genug bleibt, um von anderen übernommen zu werden. Ein überschaubares System, das von wenigen Leuten mit vollem Überblick und KI als Hebel gebaut und nach dem tatsächlichen Ergebnis statt nach dem Organigramm geformt wurde, übersteht den Weggang eines Entwicklers weitaus besser als ein Konzernprozess, in dem tausend Menschen jeweils nur ihre eigene Fliese kennen.

In einer solchen Arbeitsweise verschiebt sich das Gewicht vom Code zur Spezifikation: Die präzise Beschreibung von Absicht, Randbedingungen, Tests und Leistungsgrenzen wird zum eigentlichen, dauerhaften Schatz, während der konkrete Quelltext immer mehr einem Kompilat gleicht, das sich bei Bedarf neu erzeugen lässt. Wenn im nächsten Jahr klügere Modelle erscheinen, müssen sie sich nicht erst archäologisch durch die Kompromisse unseres alten Codes graben, um unsere ursprüngliche Absicht zu erraten, sondern können aus derselben klaren Spezifikation schlicht eine bessere Implementierung gießen.

Damit verändert sich auch die Ökonomie des Neuschreibens von Grund auf, weil alter Code nicht mehr bloß deshalb wie ein Heiligtum verteidigt werden muss, weil seine Entstehung einmal viel Geld und Schmerz gekostet hat. Man kann ihn archivieren, die brauchbaren Ideen herausziehen, aus den Irrtümern lernen und das System mit dem gewonnenen Verständnis frisch aufsetzen. Als ich kürzlich begann, `soundApp` in Rust neu zu implementieren, stand das Programm nach zwei Tagen bei rund achtzig Prozent des Funktionsumfangs, enthielt bereits eine Teilportierung von NUI und begnügte sich mit weniger Prozessorlast und Speicher als zuvor. Das ist noch kein Triumph auf der ganzen Linie, denn auch diese Fassung muss sich im Alltag erst noch bewähren, aber es zeigt, wie alter Code sich vor unseren Augen von einem eifersüchtig gehüteten Besitzstand in bloßes Referenzmaterial verwandelt.

Wahrscheinlich wird fast alles, was wir uns heute an konkreten KI-Techniken zurechtlegen – vom Aufbau des Harnesses über das Prompting bis zur Verschaltung von Agenten –, schon in einem Jahr überholt oder wunderlich wirken. Was jedoch bleibt und mit jedem Versuch schärfer hervortritt, ist das eigentliche Problem, das wir lösen wollen.

Die eigentliche Kunst besteht jetzt darin, herauszufinden, was wir wirklich wollen, alles abzustreifen, was diesem Ziel im Weg steht, und ohne falsche Scheu so hoch zu zielen, wie unser Mut reicht.

---

### Quellen

- Linux-Kernel-Dokumentation, [„How the development process works“](https://www.kernel.org/doc/html/latest/process/2.Process.html), Abschnitte 2.2 und 2.3.
- Redis-Quellrepository, [github.com/redis/redis](https://github.com/redis/redis).
- David Kushner, *Masters of Doom: How Two Guys Created an Empire and Transformed Pop Culture*, Random House, 2003.