# Spezifikation: Frankie sammelt Würstel

Stand: 2026-10-08 (Version 2: Level-Auswahl, Level 2 „Wald“, bessere Lesbarkeit)

## Ziel

Ein einfaches 2D-Jump'n'Run als Geschenk für das Kind einer Arbeitskollegin. Held ist Frankie, eine Französische Bulldogge (anfangs für eine Englische gehalten; die Fotos vom 08.10. zeigen eine Französische). Sie sammelt Würstel und frisst sie am Ende.

## Rahmen

- Kind ist 3–5 Jahre alt: kann nicht lesen → keine Texte nötig, sehr einfache Steuerung.
- Geräte: Tablet/Handy (Touch) und PC (Tastatur).
- Verteilung: Link im Internet (GitHub Pages).
- Grafik und Sound komplett per Code, keine Dateien.

## Ablauf

Startbild mit Level-Auswahl → Level (ca. 1 Minute) → Futterszene → „Nochmal“ oder „Weiter“.

1. **Startbild:** Titel „Frankie“, Frankie hüpft fröhlich. Darunter 5 runde Level-Knöpfe in der Farbe ihrer Welt, mit großer Zahl. Noch nicht erreichte (oder noch nicht gebaute) Level sind grau mit Schloss. Der neueste offene Level-Knopf pulsiert. Das Gerät merkt sich, wie weit das Kind gekommen ist; `?alle=1` an der Adresse öffnet alle gebauten Level zum Testen.
2. **Level:**
   - Frankie läuft automatisch nach rechts. Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
   - Jedes Level hat 20 Würstel: am Boden (sammelt Frankie im Laufen), in der Luft (Sprung nötig), als Bogen (ein Sprung holt alle drei) und ab Level 2 auf schwebenden Blöcken.
   - Gesammelte Würstel fliegen in die Leiste oben (Symbole statt Zahl).
   - Hindernis berührt oder in eine Lücke gefallen: Frankie ist kurz benommen (Sternchen) bzw. es platscht, dann startet **dieses** Level von vorn. (Version 1: nur kurzes Stolpern. Geändert auf Wunsch von Marius am 08.10.)
   - Springen ist bewusst leicht: ca. 170 px hoch, ca. 1 Sekunde in der Luft, Trefferflächen der Hindernisse kleiner als die Bilder.
   - Vor dem Loslaufen wartet Frankie kurz (0,7 s).
3. **Ziel:** Hundehütte „FRANKIE“ mit Napf. Frankie bleibt stehen und freut sich. Das nächste Level ist damit freigeschaltet.
4. **Futterszene (am Ende der jeweiligen Welt):** Frankie macht zuerst einen Freudentanz, jedes Mal ein anderer als beim letzten Mal: drei Hüpfer mit Umschauen, Salto mit Herzchen, oder Wackeltanz mit Musiknoten. Dann fliegen die Würstel schnell hintereinander in den Napf, Frankie mampft durchgehend und wird dabei etwas runder (ganze Szene ca. 9 Sekunden bei 20 Würsteln). Wer nichts gesammelt hat, bekommt trotzdem ein Würstel. Danach zwei Knöpfe: Nochmal (orange) und Weiter (grün, nächstes Level); nach dem letzten gebauten Level statt Weiter ein Haus-Knopf zurück zur Level-Auswahl.

## Level

| Level | Welt | Tempo | Inhalt |
|---|---|---|---|
| 1 | Garten → Wiese → Dorf | 220 px/s | Pfützen, Bälle, Kisten. **Fertig, nicht mehr ändern** (Marius, 08.10.). |
| 2 | Wald: Waldrand → tiefer Wald → Lichtung | 232 px/s | Baumstümpfe, Holzstämme, eine Pfütze, 2 laufende Igel, 2 Bäche (Lücken), Blöcke in 1 und 2 Höhen, eine Block-Brücke über den zweiten Bach. |
| 3 | Strand (geplant) | schneller | Blöcke in zwei Höhen, 3 Wasserrinnen (eine nur über Blöcke), Sandburg, laufende Krabbe, entgegenrollender Wasserball, Seesterne. |
| 4 | Bauernhof (geplant) | noch schneller | 4 Gräben, Heuballen, laufendes Huhn, hüpfender Frosch, längere Block-Wege. |
| 5 | Winter (geplant) | am schnellsten | 5 Eislöcher, Schneemann, rollende Schneebälle, hüpfender Hase, Stellen nur über Blöcke. Danach kleine Siegesfeier. |

**Blöcke:** Von unten springt man durch, oben landet man (Einweg-Plattformen). Stufe 1 liegt 130 px über dem Boden (vom Boden erreichbar), Stufe 2 noch 105 px höher (nur von Stufe 1 erreichbar). Wer am Ende herunterläuft, landet wieder unten.

**Lücken:** Bach mit Wasser zwischen zwei Uferkanten; die dunklen Uferlinien liegen genau auf den echten Kanten. Hineinfallen = Platsch + Level von vorn.

## Lesbarkeit: Was ist Hindernis, was ist Hintergrund?

Wunsch von Marius (08.10.): Man soll sofort sehen, was man berühren kann.

- Alles im Spielbereich (Würstel, Hindernisse, Blöcke, Lücken) hat einen kräftigen dunklen Umriss. Was auf dem Boden steht, wirft einen weichen Schatten. Auch Frankie hat einen Schatten, der beim Springen kleiner und heller wird.
- Der ganze Hintergrund liegt hinter einem leichten Dunstschleier, der zum Boden hin stärker wird. Dadurch wirkt er weiter weg.
- Hintergrund-Pflanzen stehen hinter der Bodenkante (ihr Fuß ist verdeckt), Hindernisse stehen sichtbar auf dem Boden.
- Schmetterlinge sind kleiner und liegen hinter dem Dunst.
- Gilt für alle Level, auch Level 1 (dort ändert sich nur die Optik, nicht das Spiel).

## Kindgerecht

- Große Figuren und Tippflächen, kein Zeitdruck. Einzige Strafe: Neustart des Levels nach Hindernis oder Lücke.
- Sprung-Puffer: Ein Tippen kurz vor der Landung zählt trotzdem.
- Ton-aus-Knopf oben rechts (wird im Browser gemerkt).
- Handy hochkant: animierter Hinweis „Handy drehen“.
- Auf Handy/Tablet startet das Spiel im Vollbild (wo der Browser es erlaubt; iPhone-Safari kann das nicht).

## Frankie

Nach Fotos des echten Frankie (08.10.): rehbraune Französische Bulldogge. Körper von der Seite, Kopf leicht zum Betrachter gedreht (beide Augen sichtbar), Blick nach rechts. Große aufrechte Fledermausohren (innen dunkel), eckiger Kopf mit Stirnfalten und dunkleren Augenpartien, kurze schwarze Schnauze (Maske), große dunkelbraune Augen, kompakter muskulöser Körper mit hellerer Brust, Stummelschwanz. Dunkles Lederhalsband und hellblau kariertes Halstuch. Farben einstellbar in `src/config.js`.
Versionen: 1.0 grobe Formen, 1.1 als SVG neu (noch als Englische Bulldogge, weiß-braun), 1.2 nach Fotos.

Posen: Laufen (4 Bilder), Springen, Benommen, Glücklich, Fressen (2 Bilder).

## Sound

Per Web Audio erzeugt: Sprung („Boing“), Einsammeln (Glöckchen), Stolpern, Platschen, Schmatzen, Bellen, Plopp, Schlussmelodie.

## Technik-Notizen

- Physik mit variablem Zeitschritt (`fixedStep: false`): Marius' Bildschirm läuft mit 59 Hz; ein fester 60-Hz-Schritt ruckelte alle paar Sekunden.
- Der Boden ist zwischen den Lücken in dicke Blöcke geteilt, damit Frankie auch bei einem Hänger auf einem langsamen Tablet nicht durch den Boden fällt.

## Später

- Level 3–5 (siehe Tabelle), danach Siegesfeier nach Level 5.
- Name des Kindes im Startbild.
- Sammelalbum oder Sterne.
