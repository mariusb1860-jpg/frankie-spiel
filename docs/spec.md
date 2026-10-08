# Spezifikation: Frankie sammelt Würstel

Stand: 2026-10-08 (Version 3: alle 5 Level und Siegesfeier)

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
   - Nach einem Unfall wartet Frankie kurz (0,7 s), bevor er wieder losläuft. Beim Start aus der Level-Auswahl, mit „Nochmal“ und mit „Weiter“ läuft er sofort los (so abgenommen, siehe „Bekannte kleine Fehler“).
3. **Ziel:** Hundehütte „FRANKIE“ mit Napf. Frankie bleibt stehen und freut sich. Das nächste Level ist damit freigeschaltet.
4. **Futterszene (am Ende der jeweiligen Welt):** Frankie macht zuerst einen Freudentanz, jedes Mal ein anderer als beim letzten Mal: drei Hüpfer mit Umschauen, Salto mit Herzchen, oder Wackeltanz mit Musiknoten. Dann fliegen die Würstel schnell hintereinander in den Napf, Frankie mampft durchgehend und wird dabei etwas runder (ganze Szene ca. 9 Sekunden bei 20 Würsteln). Wer nichts gesammelt hat, bekommt trotzdem ein Würstel. Danach zwei Knöpfe: Nochmal (orange) und Weiter (grün, nächstes Level). Nach Level 5 gibt es keine Knöpfe: die Siegesfeier beginnt von selbst.
5. **Siegesfeier (nach Level 5):** im Garten von Frankie, mit Wimpelkette. Fanfare, fünf Sterne in den Farben der fünf Welten fliegen nacheinander ein, ein goldener Pokal (Pfotenabdruck, Würstel auf dem Schild) erscheint mit Strahlen. Dann Konfetti, aufsteigende Luftballons und Feuerwerk; Frankie springt dreimal (mit Salto), wackelt zu Musik und hüpft danach fröhlich weiter. Nach ca. 8 Sekunden erscheint der Haus-Knopf zurück zur Level-Auswahl.

Beim Laden zeigt ein Balken den Fortschritt (die vielen Zeichnungen brauchen auf langsamen Handys ein paar Sekunden).

## Level

| Level | Welt | Tempo | Inhalt |
|---|---|---|---|
| 1 | Garten → Wiese → Dorf | 220 px/s | Pfützen, Bälle, Kisten. **Fertig, nicht mehr ändern** (Marius, 08.10.). |
| 2 | Wald: Waldrand → tiefer Wald → Lichtung | 232 px/s | Baumstümpfe, Holzstämme, eine Pfütze, 2 laufende Igel, 2 Bäche (Lücken), Blöcke in 1 und 2 Höhen, eine Block-Brücke über den zweiten Bach. |
| 3 | Strand (wie auf den Fotos von Frankie an der Nordsee): Dünen mit Strandkörben → offener Strand mit Booten auf dem Meer → kleiner Hafen mit Leuchtturm | 244 px/s | 3 Sandburgen, 3 Krabben (laufen seitwärts), 2 Wasserbälle (rollen Frankie entgegen), 3 Wasserrinnen, die breiteste (400 px) nur über den Holzsteg zu schaffen, Blöcke in 2 Höhen. Seesterne und Muscheln nur als Deko (orange Seesterne wie Frankies Spielzeug). |
| 4 | Bauernhof: Felder (Traktor, Vogelscheuche, Kornfeld) → Hof (Scheune, Silo, Fachwerkhaus, Hühnerstall, Kühe und Schafe in der Ferne) → Weide (Pferdestall, Koppelzaun) | 256 px/s | 3 Heuballen, 1 Milchkanne, 2 Hühner (laufen etwas schneller), 2 hüpfende Frösche, 4 Gräben mit Matschwasser, 2 lange Kisten-Wege (einer mit zweiter Etage). |
| 5 | Winter: verschneiter Wald (Holzhütte) → zugefrorener See → Dorf im Schnee (Weihnachtsbaum, Laternen); fallender Schnee, blassblauer Winterhimmel | 268 px/s | 3 Schneemänner, 2 rollende Schneebälle, 3 Hasen (hüpfen ein Stück auf Frankie zu und zurück), 5 Eislöcher, zwei davon (420 px) nur über Eisblock-Brücken, Blöcke in 2 Höhen. Danach Siegesfeier. |

Jedes Level ist 13 200 px lang und hat genau 20 Würstel. Durch das höhere Tempo dauert ein Level etwas kürzer (Bot-Durchlauf 08.10.: Level 1 59 s, 2 56 s, 3 53 s, 4 51 s, 5 49 s). Gefahren pro Level (Hindernisse und Lücken): 6, 9, 11, 12, 13.

**Blöcke:** Von unten springt man durch, oben landet man (Einweg-Plattformen). Stufe 1 liegt 130 px über dem Boden (vom Boden erreichbar), Stufe 2 noch 105 px höher (nur von Stufe 1 erreichbar). Wer am Ende herunterläuft, landet wieder unten. Aussehen pro Welt: Holz mit Moos (Wald), Steg-Bretter (Strand), Obstkisten (Bauernhof), Eisblöcke (Winter).

**Lücken:** Wasser zwischen zwei Uferkanten (Bach, Meerwasser-Rinne, Graben mit Matschwasser, Eisloch); die dunklen Uferlinien liegen genau auf den echten Kanten. Hineinfallen = Platsch + Level von vorn. Lücken bis 170 px kann man überspringen; Lücken ab 400 px nur über die Blöcke darüber (direkt springen klappt nie, gemessen).

**Bewegte Hindernisse:**
- Laufen (Igel, Krabbe, Huhn): hin und her um ihren Platz. Igel und Krabbe 40 px/s, Huhn 45 px/s.
- Rollen (Wasserball 90 px/s, Schneeball 100 px/s): rollen los, sobald sie ins Bild kommen, und drehen sich dabei. Rollt einer in eine Lücke, versinkt er.
- Hüpfen (Frosch: auf der Stelle, 45 px hoch; Hase: 3 Hüpfer à 40 px nach links und zurück, 38 px hoch). Der Takt ist fest; nach einem Unfall-Neustart hüpfen sie wieder gleich (beim Start aus dem Menü ist die Phase je nach Wartezeit anders, siehe „Bekannte kleine Fehler“). Jede Phase ist gemessen sicher.
- Angestoßen: Bälle fliegen weg, Tiere bleiben stehen und hüpfen erschrocken.

## Sprung-Zeitfenster (gemessen am 08.10.)

Wie lange man zum Springen Zeit hat, damit Frankie sicher darüber kommt. Ziel: mindestens 0,35 s für jedes Hindernis, bei bewegten Hindernissen in **jeder** Phase ihrer Bewegung.

| Level | Hindernis | Zeitfenster |
|---|---|---|
| 2 | Igel (9 Phasen; am knappsten, wenn er von Frankie weg läuft) | 0,36–0,56 s (vorher im ungünstigsten Fall 0,28 s) |
| 3 | Sandburg | 0,43 s |
| 3 | Krabbe (ungünstigste Phase: läuft von Frankie weg) | 0,36–0,40 s, sonst ≥ 0,5 s |
| 3 | Wasserball (rollt entgegen) | 0,60 s |
| 3 | Wasserrinnen 140 / 160 px | ≥ 0,74 / ≥ 0,66 s |
| 3 | Rinne 400 px über den Steg | ≥ 1,5 s (direkt: 0 von 10 Versuchen) |
| 4 | Heuballen / Milchkanne | 0,45 / 0,50 s |
| 4 | Huhn (ungünstigste Phase) | 0,40 s |
| 4 | Frosch (5 Hüpf-Phasen) | 0,45–0,51 s |
| 4 | Gräben 150 / 160 / 170 px | ≥ 0,70 s |
| 5 | Schneemann | 0,48 s |
| 5 | Schneeball (rollt entgegen) | 0,63 s |
| 5 | Hase (12 Phasen des Hüpf-Takts) | 0,40–0,60 s |
| 5 | Eislöcher 150 / 160 / 170 px | ≥ 0,75 s |
| 5 | Eislöcher 420 px über die Eisbrücke | ≥ 1,3 s (direkt: 0 von 9) |

Level 2 war schon abgenommen. Geändert wurde danach nur die Trefferfläche des Igels (Wunsch von Marius, 08.10.): 20×14 statt 30×18 Bild-Pixel, mittig, unten gleich. Er sieht gleich aus und läuft gleich schnell.

Würstel auf zwei Block-Etagen (Bonus): alle Würstel einer Gruppe in einem Durchlauf bekommt man bei einem Zeitfenster von 0,57 s (Level 3), ≥ 0,62 s (Level 4) und ≥ 0,52 s (Level 5).

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

Per Web Audio erzeugt: Sprung („Boing“), Einsammeln (Glöckchen), Stolpern, Platschen, Schmatzen, Bellen, Plopp, Schlussmelodie, Fanfare und Feuerwerk (Siegesfeier).

## Technik-Notizen

- Physik mit variablem Zeitschritt (`fixedStep: false`): Marius' Bildschirm läuft mit 59 Hz; ein fester 60-Hz-Schritt ruckelte alle paar Sekunden.
- Der Boden ist zwischen den Lücken in dicke Blöcke geteilt, damit Frankie auch bei einem Hänger auf einem langsamen Tablet nicht durch den Boden fällt.

## Bekannte kleine Fehler

- Die kurze Pause vor dem Loslaufen (0,7 s, siehe Ablauf) gibt es nur nach einem Unfall-Neustart. Beim Start aus der Level-Auswahl, mit „Nochmal“ und mit „Weiter“ läuft Frankie sofort los (gemessen 08.10.). Grund: die Spiel-Uhr der Level-Szene läuft nur, solange die Szene läuft; beim Neueintritt ist sie noch auf dem Stand vom letzten Mal (Phaser 3.90 setzt `time.now` erst im ersten Update). Betrifft alle Level, auch Level 1. **Bleibt bewusst so** (Marius, 08.10.): So hat er Level 1 getestet und abgenommen. Falls die Pause später doch bei jedem Start kommen soll: in `GameScene.create()` `this.game.loop.time` statt `this.time.now` nehmen und alle Level neu prüfen.

## Später

- Name des Kindes im Startbild.
- Sammelalbum oder Sterne (z. B. Pokal im Startbild, wenn alle 5 Level geschafft sind).
