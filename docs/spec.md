# Spezifikation: Frankie sammelt Würstel (Version 1)

Stand: 2026-10-08 (Version 1.2 nach zweitem Feedback von Marius)

## Ziel

Ein einfaches 2D-Jump'n'Run als Geschenk für das Kind einer Arbeitskollegin. Held ist Frankie, eine Französische Bulldogge (anfangs für eine Englische gehalten; die Fotos vom 08.10. zeigen eine Französische). Sie sammelt Würstel und frisst sie am Ende.

## Rahmen

- Kind ist 3–5 Jahre alt: kann nicht lesen → keine Texte nötig, sehr einfache Steuerung.
- Geräte: Tablet/Handy (Touch) und PC (Tastatur).
- Verteilung: Link im Internet (GitHub Pages).
- Grafik und Sound komplett per Code, keine Dateien.

## Ablauf

Startbild → ein Level (ca. 60 Sekunden) → Futterszene → „Nochmal“.

1. **Startbild:** Frankie hüpft fröhlich, großer grüner Play-Knopf, Titel „Frankie“.
2. **Level (Garten):**
   - Frankie läuft automatisch nach rechts. Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
   - 20 Würstel: am Boden (sammelt Frankie im Laufen), in der Luft (Sprung nötig) und als Bogen (ein Sprung holt alle drei).
   - Gesammelte Würstel fliegen in die Leiste oben (Symbole statt Zahl).
   - Hindernisse (Pfütze, Ball, Kiste): Wer dagegen läuft, ist kurz benommen (Sternchen), dann startet das Level von vorn. (Version 1: nur kurzes Stolpern. Geändert auf Wunsch von Marius am 08.10.)
   - Springen ist bewusst leicht: ca. 170 px hoch, ca. 1 Sekunde in der Luft, Trefferflächen der Hindernisse kleiner als die Bilder. Zeitfenster für einen erfolgreichen Sprung über die Kiste: ca. 0,45 Sekunden.
   - Vor dem Loslaufen wartet Frankie kurz (0,7 s).
   - Hintergrund mit Parallax (ferne Ebenen bewegen sich langsamer). Die Landschaft wechselt unterwegs: Garten (Zaun, Tulpen, Sonnenblumen, Apfelbäume, Gartenhaus) → Wiese (Eichen, Birken, Teich, Windmühle, Pilze, Schmetterlinge) → Dorf (Häuser, Kirche, Laternen, Hecke). Darüber realistische Sonne mit Glühen und sich langsam drehenden Strahlen, schattierte Wolken, Vögel.
3. **Ziel:** Hundehütte „FRANKIE“ mit Napf. Frankie bleibt stehen und freut sich.
4. **Futterszene (im Dorf):** Frankie macht zuerst einen Freudentanz, jedes Mal ein anderer als beim letzten Mal: drei Hüpfer mit Umschauen, Salto mit Herzchen, oder Wackeltanz mit Musiknoten. Dann fliegen die Würstel schnell hintereinander in den Napf, Frankie mampft durchgehend und wird dabei etwas runder. Fressen dauert ca. 6–7 Sekunden (die ganze Szene bis „Nochmal“ ca. 9 Sekunden bei 20 Würsteln). Wer nichts gesammelt hat, bekommt trotzdem ein Würstel.

## Kindgerecht

- Große Figuren und Tippflächen, kein Zeitdruck. Einzige Strafe: Neustart nach einem Hindernis.
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

## Später (nicht in Version 1)

- **Nächster großer Schritt:** 5 Level mit steigender Schwierigkeit. Level 1 bleibt so, wie es ist (Schwierigkeit passt laut Marius).
- Echte Fotos von Frankie kommen noch; danach Zeichnung genauer anpassen.

- Weitere Welten: Park, Strand, Schnee.
- Name des Kindes im Startbild.
- Sammelalbum oder Sterne.
- Frankies echte Fellfarbe (bei der Kollegin erfragen).
