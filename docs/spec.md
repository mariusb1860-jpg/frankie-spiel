# Spezifikation: Frankie sammelt Würstel

Stand: 2026-10-13 (Version 4: Level 6 und 7 für Erwachsene, nur über den geheimen Link; Level 1–5 und Siegesfeier unverändert)

## Ziel

Ein einfaches 2D-Jump'n'Run als Geschenk für das Kind einer Arbeitskollegin. Held ist Frankie, eine Französische Bulldogge (anfangs für eine Englische gehalten; die Fotos vom 08.10. zeigen eine Französische). Sie sammelt Würstel und frisst sie am Ende.

## Rahmen

- Kind ist 3–5 Jahre alt: kann nicht lesen → keine Texte nötig, sehr einfache Steuerung.
- Geräte: Tablet/Handy (Touch) und PC (Tastatur).
- Verteilung: Link im Internet (GitHub Pages): https://mariusb1860-jpg.github.io/frankie-spiel/. Schickt man den Link per WhatsApp, erscheint ein Vorschaubild.
- Grafik und Sound komplett per Code, keine Dateien (einzige Ausnahme: das Vorschaubild `share.jpg` für Messenger).

## Ablauf

Startbild mit Level-Auswahl → Level (ca. 1 Minute) → Futterszene → „Nochmal“ oder „Weiter“.

1. **Startbild:** Titel „Frankie“, Frankie hüpft fröhlich. Darunter 5 runde Level-Knöpfe in der Farbe ihrer Welt, mit großer Zahl. Noch nicht erreichte (oder noch nicht gebaute) Level sind grau mit Schloss. Der neueste offene Level-Knopf pulsiert. Das Gerät merkt sich, wie weit das Kind gekommen ist; `?alle=1` an der Adresse öffnet alle gebauten Level zum Testen. Der geheime Link `?paprika` (nur für Erwachsene) zeigt statt dessen nur die Knöpfe 6 und 7: Level 6 ist dann immer offen, Level 7 öffnet sich nach Level 6. Der normale Link zeigt weiter nur 1–5, auch auf Geräten mit altem Fortschritt.
2. **Level:**
   - Frankie läuft automatisch nach rechts. Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
   - Jedes Level hat 20 Würstel: am Boden (sammelt Frankie im Laufen), in der Luft (Sprung nötig), als Bogen (ein Sprung holt alle drei) und ab Level 2 auf schwebenden Blöcken.
   - Gesammelte Würstel fliegen in die Leiste oben (Symbole statt Zahl).
   - Hindernis berührt oder in eine Lücke gefallen: Frankie ist kurz benommen (Sternchen) bzw. es platscht, dann startet **dieses** Level von vorn. (Version 1: nur kurzes Stolpern. Geändert auf Wunsch von Marius am 08.10.)
   - Springen ist bewusst leicht: ca. 170 px hoch, ca. 1 Sekunde in der Luft, Trefferflächen der Hindernisse kleiner als die Bilder.
   - Nach einem Unfall wartet Frankie kurz (0,7 s), bevor er wieder losläuft. Beim Start aus der Level-Auswahl, mit „Nochmal“ und mit „Weiter“ läuft er sofort los (so abgenommen, siehe „Bekannte kleine Fehler“).
3. **Ziel:** Hundehütte „FRANKIE“ mit Napf. Frankie bleibt stehen und freut sich. Das nächste Level ist damit freigeschaltet.
4. **Futterszene (am Ende der jeweiligen Welt):** Frankie macht zuerst einen Freudentanz, jedes Mal ein anderer als beim letzten Mal: drei Hüpfer mit Umschauen, Salto mit Herzchen, oder Wackeltanz mit Musiknoten. Dann fliegen die Würstel schnell hintereinander in den Napf, Frankie mampft durchgehend und wird dabei etwas runder (ganze Szene ca. 9 Sekunden bei 20 Würsteln). Wer nichts gesammelt hat, bekommt trotzdem ein Würstel. Danach zwei Knöpfe: Nochmal (orange) und Weiter (grün, nächstes Level). Nach Level 5 (mit `?paprika` nach Level 7) gibt es keine Knöpfe: die Siegesfeier beginnt von selbst.
5. **Siegesfeier (nach Level 5, mit `?paprika` nach Level 7):** im Garten von Frankie, mit Wimpelkette. Fanfare, fünf Sterne in den Farben der fünf Welten fliegen nacheinander ein, ein goldener Pokal (Pfotenabdruck, Würstel auf dem Schild) erscheint mit Strahlen. Dann Konfetti, aufsteigende Luftballons und Feuerwerk; Frankie springt dreimal (mit Salto), wackelt zu Musik und hüpft danach fröhlich weiter. Nach ca. 8 Sekunden erscheint der Haus-Knopf zurück zur Level-Auswahl. Nach Level 7 sind es sieben Sterne, und der Haus-Knopf führt zum Startbild mit 6 und 7.

Beim Laden zeigt ein Balken den Fortschritt (die vielen Zeichnungen brauchen auf langsamen Handys ein paar Sekunden).

## Level

| Level | Welt | Tempo | Inhalt |
|---|---|---|---|
| 1 | Garten → Wiese → Dorf | 220 px/s | Pfützen, Bälle, Kisten. **Fertig, nicht mehr ändern** (Marius, 08.10.). |
| 2 | Wald: Waldrand → tiefer Wald → Lichtung | 232 px/s | Baumstümpfe, Holzstämme, eine Pfütze, 2 laufende Igel, 2 Bäche (Lücken), Blöcke in 1 und 2 Höhen, eine Block-Brücke über den zweiten Bach. |
| 3 | Strand (wie auf den Fotos von Frankie an der Nordsee): Dünen mit Strandkörben → offener Strand mit Booten auf dem Meer → kleiner Hafen mit Leuchtturm | 244 px/s | 3 Sandburgen, 3 Krabben (laufen seitwärts), 2 Wasserbälle (rollen Frankie entgegen), 3 Wasserrinnen, die breiteste (400 px) nur über den Holzsteg zu schaffen, Blöcke in 2 Höhen. Seesterne und Muscheln nur als Deko (orange Seesterne wie Frankies Spielzeug). |
| 4 | Bauernhof: Felder (Traktor, Vogelscheuche, Kornfeld) → Hof (Scheune, Silo, Fachwerkhaus, Hühnerstall, Kühe und Schafe in der Ferne) → Weide (Pferdestall, Koppelzaun) | 256 px/s | 3 Heuballen, 1 Milchkanne, 2 Hühner (laufen etwas schneller), 2 hüpfende Frösche, 4 Gräben mit Matschwasser, 2 lange Kisten-Wege (einer mit zweiter Etage). |
| 5 | Winter: verschneiter Wald (Holzhütte) → zugefrorener See → Dorf im Schnee (Weihnachtsbaum, Laternen); fallender Schnee, blassblauer Winterhimmel | 268 px/s | 3 Schneemänner, 2 rollende Schneebälle, 3 Hasen (hüpfen ein Stück auf Frankie zu und zurück), 5 Eislöcher, zwei davon (420 px) nur über Eisblock-Brücken, Blöcke in 2 Höhen. Danach Siegesfeier. |
| 6 | Puszta (nur über `?paprika`): ungarische Steppe mit Paprika-Feldern, Gehöften und Ziehbrunnen; Boden, Gräben und Kisten wie auf dem Bauernhof | 290 px/s | 25 Gefahren: Heuballen, Milchkanne, Kisten, Baumstumpf, Baumstamm, Pfütze, Igel, Hühner, Frösche, Hasen (Tiere 1,4-fach), Gräben bis 220 px, Kisten-Trittsteine über einen breiten Graben, Treppe in 2 Etagen, Ketten. Für Erwachsene. |
| 7 | Budapest (nur über `?paprika`): Donau mit Parlament, Kettenbrücke und Burg, gelbe Straßenbahn, am Ende der Markt mit Paprika; Boden und Bach wie im Wald, Stege wie am Strand | 310 px/s | 34 Gefahren: Kisten, Wasserbälle (rollen entgegen), Pfützen, Baumstämme, 8 Igel (1,7-fach), Bäche bis 225 px, einzelne Stege als Trittsteine, Treppe in 2 Etagen, lange Ketten. Das schwerste Level. Danach Siegesfeier mit 7 Sternen. |

Jedes Level ist 13 200 px lang und hat genau 20 Würstel. Durch das höhere Tempo dauert ein Level etwas kürzer (Bot-Durchlauf 08.10.: Level 1 59 s, 2 56 s, 3 53 s, 4 51 s, 5 49 s). Gefahren pro Level (Hindernisse und Lücken): 6, 9, 11, 12, 13, 25, 34. Bot-Durchlauf Level 6: 45 s, Level 7: 42 s (Messungen unten).

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

## Sprung-Zeitfenster Level 6 (gemessen am 12./13.10.)

Level 6 (Puszta, nur mit dem geheimen Link) ist für Erwachsene: Tempo 290, Sprung 147 px hoch und 0,78 s lang, Tiere **1,4-fach**. Zuerst waren sie 1,5-fach, da lag das Huhn in seiner schlechtesten Stellung bei 0,17–0,19 s, also unter der Grenze. Mit 1,4 ist jedes Fenster mindestens 0,185 s lang. Untergrenze für jedes Fenster: **0,18 s** (die Kinderregel 0,35 s gilt nur für Level 1–5). Messung wie oben: Zeit-Sweep, Ränder auf 5 ms genau. Bei Ketten stehen die früheren Taps auf ihrem Bot-Abstand.

„Phase“ heißt: wo das Tier gerade ist, je nachdem, wo es in seinem Hin-und-Her oder Hüpf-Takt steht (zum Beispiel das Huhn gerade links, rechts oder auf dem Weg dazwischen). Es steht je nach Phase anders, deshalb ist jede Zeile über viele Phasen gemessen: kleinster und größter Wert.

| Stelle | Zeitfenster |
|---|---|
| Heuballen / Milchkanne / Kiste / Baumstumpf / Baumstamm / Pfütze | 0,30 / 0,33 / 0,32 / 0,33 / 0,30 / 0,28 s |
| Gräben 190 / 200 / 210 / 220 px | 0,50 / 0,46 / 0,40 / 0,37 s |
| Trittsteine: Stein 1 (vom Boden) | ≥ 0,59 s |
| Trittsteine: Stein 1 → 2 / 2 → 3 / 3 → 4 | 0,21 / 0,24 / ≥ 0,69 s (Stein 4 liegt am Grabenende, zu spätes Tippen landet schon auf dem Boden) |
| Treppe: Etage 1 / Etage 2 | ≥ 0,69 / ≥ 0,94 s |
| Igel am ersten Platz (8 Phasen) / am zweiten (4 Phasen) | 0,255–0,48 / 0,26–0,43 s |
| Huhn am ersten Platz (21 Phasen) / am zweiten (17 Phasen) | 0,185–0,445 / 0,195–0,445 s |
| Frosch (5 Phasen) | 0,305–0,35 s |
| Hase (13 Phasen) | 0,225–0,425 s |
| Kette 1 Heuballen → Milchkanne | 0,34 s |
| Kette 2 Graben → Kiste | 0,32 s |
| Kette 3 Frosch → Huhn (4 Phasen) | 0,315–0,56 s |
| Kette 4 Huhn → Stein 1 (6 Phasen) | 0,345–0,68 s |
| Kette 6 Baumstamm → Hase (10 Phasen) | 0,225–0,51 s |
| Kette 7 Graben → Pfütze | 0,29 s |
| Kette 8 Huhn → Heuballen (4 Phasen) / → Etage 1 / → Etage 2 | 0,21–0,295 / 0,695 / 0,945 s |
| Kette 9 Igel → Milchkanne (5 Phasen) / → Kiste (2 Phasen) | 0,325–0,41 / 0,325 s |
| Kette 10 Graben → Frosch (3 Phasen) / → Hase (3 Phasen) / → Baumstamm | 0,28–0,345 / 0,275–0,475 / 0,29 s |

Bot-Abstände D6 (px): obstacle 122, haybale 119, milkcan 122, crate 122, stump 122, log 127, puddle 120, gap −4, tier1 100, tier2 85, hop 155, high 122, hedgehog 105, chicken 80, frog 125, rabbit 100.

Bot-Ergebnis (Tiere 1,4-fach): 20/20 Würstel, kein Unfall, 3 Läufe nacheinander (45 s, ab dem 2. Lauf 60 fps). Der erste Lauf nach dem Laden der Seite hat einen einmaligen Bildraten-Einbruch (34 fps), blieb diesmal aber ohne Unfall.

Knappste Stelle: das Huhn mit 0,185 s. Das sind nur 5 ms über der Grenze von 0,18 s, also innerhalb der Messgenauigkeit (etwa ±0,01 s). Es ist dann gerade vom Spieler weggelaufen und wird schneller. Das Fenster hängt nur vom Tier-Tempo ab, nicht vom Abstand zu anderen Gefahren (Huhn 30 px weiter weg brachte bei 1,5-fach nichts). Stellen ≤ 0,25 s: über 10, das Level ist nicht zu leicht.

## Sprung-Zeitfenster Level 7 (gemessen am 13.10.)

Level 7 (Budapest, nur mit dem geheimen Link) ist das schwerste Level für Erwachsene: Tempo 310, Sprung 143 px hoch und etwa 0,66 s lang, Tiere **1,7-fach**. Untergrenze für jedes Fenster: **0,10 s**. Messung wie bei Level 6: Zeit-Sweep, Ränder auf 5 ms genau (Fest-Gefahren in px, Sekunden = px / 310). Bei Ketten stehen die früheren Taps auf ihrem Bot-Abstand, bei einem früheren Igel auch in dessen schlechtester Stellung. Ein Wert mit „≥“ ist eine Untergrenze: der Rand des Messbereichs war noch erfolgreich. Das Messrauschen liegt bei etwa ±0,015 s (gleiche Stelle, zwei Messungen: 0,095 und 0,145 s, weil eine grobe 50-ms-Suche einen Treffer übersehen hat).

**Hühner und Hasen sind durch Igel ersetzt.** Mit dem Huhn war das Fenster in der ungünstigsten Stellung nur **0,025 s** bei 2-fach, 0,075 s bei 1,7-fach und etwa 0,10 s bei 1,5-fach (es läuft dann gerade mit Höchstgeschwindigkeit weg). Der Hase hat in einer Hüpf-Stellung nur 0,045 s (1,8-fach) bzw. 0,08 s (1,7-fach). Die Trefferflächen bleiben fest, und das Tempo darf nicht unter 1,7 fallen. Darum stehen an den fünf Stellen, wo vorher Huhn oder Hase waren (x 2750, 5780, 7520, 11220, 11800), jetzt Igel. Gefahren bleiben 34, Würstel 20.

**Tier-Tempo 1,7.** Der Igel in seiner schlechtesten Stellung (er läuft gerade mit Höchstgeschwindigkeit weg) lässt bei 2,0 nur 0,095 s, bei 1,9 0,100 s und bei 1,8 an einer Stelle (Igel x 7520) 0,095 s (eine einzelne grobe Messung, die Nachbar-Stellungen lagen bei 0,12–0,165 s). Das ist jeweils unter 0,105 s (Grenze 0,10 s plus 5 ms Messrauschen). 1,8 wurde also nach einer einzelnen groben Messung verworfen und könnte bei einer feinen Nachmessung durchaus bestehen. Bei 1,7 ist das kleinste Fenster 0,117 s. Rollende Wasserbälle sind bei 1,7 unkritisch (Fenster 0,345–0,36 s). Beide Bälle treffen Frankie auf festem Boden (Treffpunkt x 3850 bzw. 8700; der erste liegt 120 px hinter dem Bach, `stopped` bleibt `false`, bis Frankie bei 3850 bzw. 8700 ist).

| Stelle | Zeitfenster |
|---|---|
| Kiste / Ball / Pfütze / Baumstamm | 0,23 / 0,26 / 0,19 / 0,21 s |
| Gräben 200 / 210 / 215 / 220 / 225 px | 0,36 / 0,32 / 0,31 / 0,30 / 0,28 s |
| Trittsteine: Stein 1 (vom Boden) | 0,31 s |
| Trittsteine: Stein 1 → 2 / 2 → 3 / 3 → 4 | 0,225 / 0,245 / 0,16 s |
| Trittsteine: Stein 4 → Boden | ≥ 0,515 s |
| Treppe: Etage 1 / Etage 2 (in der Kette) | ≥ 0,485 / ≥ 0,46 s |
| Treppe einzeln (Bot-Abstand): tier1 / tier2 / hop | tier1 −2…178 px, tier2 30…210 px, hop (Stein 1 → 2) 170…230 px, das sind ≥ 0,58 / 0,58 / 0,19 s |
| Wasserball 1 (x 4100) / Wasserball 2 (x 8950) | 0,36 / 0,345 s |
| Igel allein, x 2200 (9 Stellungen) | 0,145–0,355 s |
| Igel allein, x 7520 (16 Stellungen über den ganzen Zyklus) | 0,13–0,38 s |
| Igel x 11220 (15 Stellungen, in Kette 11) | 0,125–0,48 s |
| Kette 1 Kiste → Ball / → Baumstamm | 0,245 / 0,21 s |
| Kette 2 Graben → Igel x 2200 (3 Stellungen) | 0,145–0,175 s |
| Kette 3 Ball → Igel x 2750 (3 Stellungen) / → Baumstamm (2) / → Pfütze (2) | 0,13–0,16 / 0,195–0,225 / 0,19–0,195 s |
| Kette 4 Graben → Wasserball / → Kiste | 0,36 / 0,23 s |
| Kette 5 Kiste → Stein 1, Steine 2, 3, 4, Boden | siehe Trittsteine |
| Kette 6 Kiste → Igel x 5780 (3 Stellungen) / → Ball (2) | 0,13–0,16 / 0,26–0,275 s |
| Kette 7 Graben → Baumstamm | 0,345 s |
| Kette 8 Igel x 7250 (3 Stellungen) / → Igel x 7520 (3 Stellungen) | 0,14–0,145 / 0,14–0,18 s |
| Kette 9 Graben → Pfütze / → Baumstamm | 0,345 / 0,205 s |
| Kette 10 Wasserball → Ball / → Baumstamm | 0,285 / 0,21 s |
| Kette 10 Baumstamm → Etage 1 / → Etage 2 | ≥ 0,485 / ≥ 0,46 s |
| Kette 11 Igel x 10620 (3 Stellungen) / → Graben (2) | 0,125–0,16 / 0,32–0,325 s |
| Kette 11 Graben → Igel x 11220 / → Kiste (2 Stellungen) | 0,125–0,48 / 0,23–0,31 s |
| Kette 11 Kiste → Igel x 11800 (6 Stellungen) / → Kiste (2) / → Graben (2) | 0,117–0,19 / 0,24–0,295 / 0,25–0,255 s |

Bot-Abstände D7 (px): obstacle 112, high 112, crate 112, ball 108, puddle 112, log 116, gap −20, tier1 130, tier2 120, hop 200, beachball 160, hedgehog 80. Der Igel-Abstand ist klein, weil das Fenster in der schlechtesten Stellung nur etwa 70–90 px breit liegt (bei 1,7-fach gemessen; mit 95 schlug der Bot manchmal an einem Igel fehl).

Bot-Ergebnis (Tiere 1,7-fach, Igel 80): 20/20 Würstel, kein Unfall, vier Läufe nacheinander (Aufwärm-Lauf mit 11 fps-Einbruch, danach 58, 54 und 53 fps, je 42 s). Der erste Lauf nach dem Laden der Seite hat einen einmaligen Bildraten-Einbruch. Läuft nebenher ein Mess-Skript (Ball-Treffpunkt, alle 12 ms), sinkt die Bildrate auf 43–49 fps und der Bot scheitert gelegentlich an einem Igel (2 von 3 Läufen). Das ist ein Problem des Bots bei niedriger Bildrate, nicht des Levels.

Knappste Stelle: der Igel bei x 11800 mit 0,117 s. Das sind 17 ms über der Grenze von 0,10 s, innerhalb des Messrauschens. Stellen ≤ 0,15 s: **8**, nämlich die schlechteste Stellung jedes der 8 Igel (x 2200 / 2750 / 5780 / 7250 / 7520 / 10620 / 11220 / 11800: 0,145 / 0,13 / 0,13 / 0,14 / 0,13 / 0,125 / 0,125 / 0,117 s). Alle anderen Stellen liegen bei ≥ 0,16 s (knappste feste Stelle: Stein 3 → 4 mit 0,16 s). Das Level ist damit nicht zu leicht.

## Level 6 und 7 für Erwachsene

Wunsch von Marius (12.10.): zwei Zusatz-Level für die Kollegin, ungarisch, „richtig schwer“ und „extrem“. Sie sind nur über den geheimen Link `?paprika` erreichbar (nicht in `README.md`). Das Kinder-Spiel ist unverändert; alt gegen neu verglichen am 13.10. (Startbild in 4 Fällen gleich, Bot Level 1–5 mit den alten Zeiten).

- **Sprung pro Level** (`jump` in `src/levels.js`): Level 6 `velocity` -788, `gravity` 2020: ca. 147 px hoch, ca. 0,78 s in der Luft. Level 7 `velocity` -913, `gravity` 2766: ca. 143 px hoch, ca. 0,66 s. Zum Vergleich Level 1–5: echt ca. 164 px bei 60 fps (Theorie 169 px), ca. 1,04 s. Die Werte weichen von der ersten Rechnung ab, weil Arcade-Physik halbimplizit rechnet: echter Scheitel = v²/2g − v·dt/2. Gemessen wurde am echten Sprung (`T.jumpProfile`). Ohne `jump` gilt der Standard aus `src/config.js`.
- **Tier-Tempo** (`animalSpeed`): Level 6 **1,4-fach**, Level 7 **1,7-fach** (geplant 1,5 und 2). Bei mehr lag das Fenster in der schlechtesten Stellung unter der Grenze (siehe die Messtabellen). In Level 7 laufen nur Igel; Hühner und Hasen sind ersetzt.
- **Untergrenzen** für das Sprung-Fenster: Level 6 **0,18 s**, Level 7 **0,10 s** (statt 0,35 s). Sie gelten für jede Gefahr, bei Tieren in jeder Phase und für jeden Ketten-Übergang. Unverändert: Trefferflächen, `jumpBufferMs` 180, `coyoteMs` 120.
- **Bilder nur mit `?paprika`:** `src/art/puszta.js` (Level 6: Puszta) und `src/art/budapest.js` (Level 7: Budapest an der Donau) werden nur dann in `BootScene` geladen. Der normale Link lädt keine ungarischen Bilder (beide Module werden importiert, bauen aber keine Texturen). Dort entstehen nur die Knöpfe `btn-level-puszta` und `btn-level-budapest`, sonst keine neuen Bilder (geprüft: Textur-Schlüssel alt gegen neu, Unterschied genau diese zwei). Hindernisse, Blöcke, Lücken und Boden sind die vorhandenen Bilder (Level 6: Bauernhof, Level 7: Wald-Boden und Bach, Stege vom Strand); neu ist nur der Hintergrund. Budapest nutzt die Zonen-Eigenschaft `landmarks` in `src/backdrop.js` (jedes Wahrzeichen nur einmal pro Zone).
- **Feinabstimmung** nur über Zahlen in `src/levels.js`: `speed`, `jump`, `animalSpeed`, Abstände. Danach die betroffenen Stellen neu messen, den Bot laufen lassen und die Messtabellen oben aktualisieren.

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
- Ein Würstel, das in der Luft eingesammelt wird, zählt für die 120 ms Coyote-Zeit als Boden. Ein Tippen genau dann kann einen neuen Sprung starten (alle Level). **Bleibt so.**
- Der allererste Level-Start nach dem Laden der Seite hat einmalig einen Einbruch der Bildrate. In Level 6 und 7 kann das einen Durchlauf kosten; der nächste Versuch klappt.
- Unter etwa 22 Bildern pro Sekunde sind die Blöcke in Level 7 nicht mehr erreichbar (der Sprung wird bei niedriger Bildrate niedriger). Level 7 braucht also ein halbwegs schnelles Gerät.
- Der Fortschritt des geheimen Links `?paprika` wird getrennt gespeichert (Schlüssel `frankie-unlocked-paprika`), damit er auf einem gemeinsamen Gerät nie Kinder-Level öffnet.
- Level 7 hat sehr enge Fenster (ab 0,117 s). Auf langsamen Geräten werden sie noch enger: am besten am PC oder auf einem schnellen Handy spielen.

## Später

- Name des Kindes im Startbild.
- Sammelalbum oder Sterne (z. B. Pokal im Startbild, wenn alle 5 Level geschafft sind).
