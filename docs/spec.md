# Spezifikation: Frankie sammelt Würstel (Version 1)

Stand: 2026-10-08

## Ziel

Ein einfaches 2D-Jump'n'Run als Geschenk für das Kind einer Arbeitskollegin. Held ist Frankie, eine kleine Englische Bulldogge. Sie sammelt Würstel und frisst sie am Ende.

## Rahmen

- Kind ist 3–5 Jahre alt: kann nicht lesen → keine Texte nötig, kein Game Over, sehr einfache Steuerung.
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
   - Hindernisse (Pfütze, Ball, Kiste): Frankie stolpert kurz. Nichts geht verloren.
   - Hintergrund mit Parallax: Himmel, Sonne, Wolken, Hügel, Büsche, Wiese.
3. **Ziel:** Hundehütte „FRANKIE“ mit Napf. Frankie bleibt stehen und freut sich.
4. **Futterszene:** Alle gesammelten Würstel fliegen nacheinander in den Napf. Frankie frisst jede einzeln (Schmatzen, Herzchen) und wird dabei ein bisschen runder. Am Ende Melodie, Bellen, Freudensprung mit Rolle und großer „Nochmal“-Knopf. Wer nichts gesammelt hat, bekommt trotzdem ein Würstel.

## Kindgerecht

- Große Figuren und Tippflächen, kein Zeitdruck, keine Strafe.
- Sprung-Puffer: Ein Tippen kurz vor der Landung zählt trotzdem.
- Ton-aus-Knopf oben rechts (wird im Browser gemerkt).
- Handy hochkant: animierter Hinweis „Handy drehen“.
- Auf Handy/Tablet startet das Spiel im Vollbild (wo der Browser es erlaubt; iPhone-Safari kann das nicht).

## Frankie

Seitenansicht nach rechts: kompakter Körper, großer runder Kopf, kurze flache Schnauze mit Hängebacken, Unterbiss mit zwei Zähnchen, Knickohr, kurze Beine, Stummelschwanz, rotes Halsband mit Marke. Fellfarbe weiß-creme mit braunen Flecken (einstellbar in `src/config.js`).

Posen: Laufen (4 Bilder), Springen, Stolpern, Glücklich, Fressen (2 Bilder).

## Sound

Per Web Audio erzeugt: Sprung („Boing“), Einsammeln (Glöckchen), Stolpern, Platschen, Schmatzen, Bellen, Plopp, Schlussmelodie.

## Später (nicht in Version 1)

- Weitere Welten: Park, Strand, Schnee.
- Name des Kindes im Startbild.
- Sammelalbum oder Sterne.
- Frankies echte Fellfarbe (bei der Kollegin erfragen).
