# Spezifikation: Franky sammelt Würstel

Stand: 2026-10-28 (Version 6: nur noch ein Link; Level 6 bis 10 für Erwachsene über den Paprika-Knopf auf dem Startbild, zurück über den Kind-Knopf; Level 1–5 und Siegesfeier für das Kind unverändert)

## Ziel

Ein einfaches 2D-Jump'n'Run als Geschenk für das Kind einer Arbeitskollegin. Held ist Franky, eine Französische Bulldogge (anfangs für eine Englische gehalten; die Fotos vom 08.10. zeigen eine Französische). Sie sammelt Würstel und frisst sie am Ende.

## Rahmen

- Kind ist 3–5 Jahre alt: kann nicht lesen → keine Texte nötig, sehr einfache Steuerung.
- Geräte: Tablet/Handy (Touch) und PC (Tastatur).
- Verteilung: Link im Internet (GitHub Pages): https://mariusb1860-jpg.github.io/franky/. Schickt man den Link per WhatsApp, erscheint ein Vorschaubild. Bis 28.10.2026 hieß das Spiel „Frankie“ und lag unter …/frankie-spiel/; diese Adresse gibt es seitdem nicht mehr (auf Wunsch von Marius ohne Weiterleitung). Der Spielstand bleibt, weil die Domain gleich ist.
- Grafik und Sound komplett per Code, keine Dateien (einzige Ausnahme: das Vorschaubild `share.jpg` für Messenger).

## Ablauf

Startbild mit Level-Auswahl → Level (ca. 1 Minute) → Futterszene → „Nochmal“ oder „Weiter“.

1. **Startbild:** Titel „Franky“, Franky hüpft fröhlich. Darunter 5 runde Level-Knöpfe in der Farbe ihrer Welt, mit großer Zahl. Noch nicht erreichte (oder noch nicht gebaute) Level sind grau mit Schloss. Der neueste offene Level-Knopf pulsiert. Das Gerät merkt sich, wie weit das Kind gekommen ist; `?alle=1` an der Adresse öffnet alle gebauten Level zum Testen. Unten in der Mitte sitzt ein runder Paprika-Knopf (pulsiert nicht). Er zeigt statt dessen die Knöpfe 6 bis 10 (nur für Erwachsene) an den Plätzen der Kinder-Knöpfe: Level 6 ist dann immer offen, jedes weitere öffnet sich, sobald das vorige geschafft ist. Beim ersten Mal lädt kurz der Ladebalken (ungarische Welten). Auf diesem Startbild sitzt an derselben Stelle ein Kind-Knopf, der zurück zu 1–5 führt. Tastatur: Ziffern 6 bis 9, die Taste 0 startet Level 10. Der Link öffnet immer die Kinder-Hälfte, auch auf Geräten mit altem Fortschritt. Seit 28.10.2026 gibt es nur noch diesen einen Link: Der frühere geheime Link `?paprika` zeigt jetzt ganz normal das Kinder-Startbild.
2. **Level:**
   - Franky läuft automatisch nach rechts. Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
   - Jedes Level hat 20 Würstel: am Boden (sammelt Franky im Laufen), in der Luft (Sprung nötig), als Bogen (ein Sprung holt alle drei) und ab Level 2 auf schwebenden Blöcken.
   - Gesammelte Würstel fliegen in die Leiste oben (Symbole statt Zahl).
   - Hindernis berührt oder in eine Lücke gefallen: Franky ist kurz benommen (Sternchen) bzw. es platscht, dann startet **dieses** Level von vorn. (Version 1: nur kurzes Stolpern. Geändert auf Wunsch von Marius am 08.10.)
   - Springen ist bewusst leicht: ca. 170 px hoch, ca. 1 Sekunde in der Luft, Trefferflächen der Hindernisse kleiner als die Bilder.
   - Nach einem Unfall wartet Franky kurz (0,7 s), bevor er wieder losläuft. Beim Start aus der Level-Auswahl, mit „Nochmal“ und mit „Weiter“ läuft er sofort los (so abgenommen, siehe „Bekannte kleine Fehler“).
3. **Ziel:** Hundehütte „FRANKY“ mit Napf. Franky bleibt stehen und freut sich. Das nächste Level ist damit freigeschaltet.
4. **Futterszene (am Ende der jeweiligen Welt):** Franky macht zuerst einen Freudentanz, jedes Mal ein anderer als beim letzten Mal: drei Hüpfer mit Umschauen, Salto mit Herzchen, oder Wackeltanz mit Musiknoten. Dann fliegen die Würstel schnell hintereinander in den Napf, Franky mampft durchgehend und wird dabei etwas runder (ganze Szene ca. 9 Sekunden bei 20 Würsteln). Wer nichts gesammelt hat, bekommt trotzdem ein Würstel. Danach zwei Knöpfe: Nochmal (orange) und Weiter (grün, nächstes Level). Nach Level 5 (in der Erwachsenen-Hälfte nach Level 10) gibt es keine Knöpfe: die Siegesfeier beginnt von selbst.
5. **Siegesfeier (nach Level 5, in der Erwachsenen-Hälfte nach Level 10):** im Garten von Franky, mit Wimpelkette. Fanfare, fünf Sterne in den Farben der fünf Welten fliegen nacheinander ein, ein goldener Pokal (Pfotenabdruck, Würstel auf dem Schild) erscheint mit Strahlen. Dann Konfetti, aufsteigende Luftballons und Feuerwerk; Franky springt dreimal (mit Salto), wackelt zu Musik und hüpft danach fröhlich weiter. Nach ca. 8 Sekunden erscheint der Haus-Knopf zurück zur Level-Auswahl. Nach Level 10 sind es zehn Sterne in den Farben der zehn Welten (ab 9 Sternen rücken sie enger zusammen, bei 10 Sternen 84 statt 100 px Abstand), und der Haus-Knopf führt zum Startbild mit 6 bis 10.

Beim Laden zeigt ein Balken den Fortschritt (die vielen Zeichnungen brauchen auf langsamen Handys ein paar Sekunden).

## Level

| Level | Welt | Tempo | Inhalt |
|---|---|---|---|
| 1 | Garten → Wiese → Dorf | 220 px/s | Pfützen, Bälle, Kisten. **Fertig, nicht mehr ändern** (Marius, 08.10.). |
| 2 | Wald: Waldrand → tiefer Wald → Lichtung | 232 px/s | Baumstümpfe, Holzstämme, eine Pfütze, 2 laufende Igel, 2 Bäche (Lücken), Blöcke in 1 und 2 Höhen, eine Block-Brücke über den zweiten Bach. |
| 3 | Strand (wie auf den Fotos von Franky an der Nordsee): Dünen mit Strandkörben → offener Strand mit Booten auf dem Meer → kleiner Hafen mit Leuchtturm | 244 px/s | 3 Sandburgen, 3 Krabben (laufen seitwärts), 2 Wasserbälle (rollen Franky entgegen), 3 Wasserrinnen, die breiteste (400 px) nur über den Holzsteg zu schaffen, Blöcke in 2 Höhen. Seesterne und Muscheln nur als Deko (orange Seesterne wie Frankys Spielzeug). |
| 4 | Bauernhof: Felder (Traktor, Vogelscheuche, Kornfeld) → Hof (Scheune, Silo, Fachwerkhaus, Hühnerstall, Kühe und Schafe in der Ferne) → Weide (Pferdestall, Koppelzaun) | 256 px/s | 3 Heuballen, 1 Milchkanne, 2 Hühner (laufen etwas schneller), 2 hüpfende Frösche, 4 Gräben mit Matschwasser, 2 lange Kisten-Wege (einer mit zweiter Etage). |
| 5 | Winter: verschneiter Wald (Holzhütte) → zugefrorener See → Dorf im Schnee (Weihnachtsbaum, Laternen); fallender Schnee, blassblauer Winterhimmel | 268 px/s | 3 Schneemänner, 2 rollende Schneebälle, 3 Hasen (hüpfen ein Stück auf Franky zu und zurück), 5 Eislöcher, zwei davon (420 px) nur über Eisblock-Brücken, Blöcke in 2 Höhen. Danach Siegesfeier. |
| 6 | Puszta (nur über den Paprika-Knopf): ungarische Steppe mit Paprika-Feldern, Gehöften und Ziehbrunnen; Boden, Gräben und Kisten wie auf dem Bauernhof | 290 px/s | 25 Gefahren: Heuballen, Milchkanne, Kisten, Baumstumpf, Baumstamm, Pfütze, Igel, Hühner, Frösche, Hasen (Tiere 1,4-fach), Gräben bis 220 px, Kisten-Trittsteine über einen breiten Graben, Treppe in 2 Etagen, Ketten. Für Erwachsene. |
| 7 | Budapest (nur über den Paprika-Knopf): Donau mit Parlament, Kettenbrücke und Burg, gelbe Straßenbahn, am Ende der Markt mit Paprika; Boden und Bach wie im Wald, Stege wie am Strand | 310 px/s | 34 Gefahren: Kisten, Wasserbälle (rollen entgegen), Pfützen, Baumstämme, 8 Igel (1,7-fach), Bäche bis 225 px, einzelne Stege als Trittsteine, Treppe in 2 Etagen, lange Ketten. |
| 8 | Plattensee (nur über den Paprika-Knopf): Strandbad mit Badehäuschen und Wasserrutsche → Halbinsel Tihany mit Abtei und Lavendel → Tafelberg Badacsony mit Segelhafen; Boden, Rinnen und Stege wie am Strand | 320 px/s | 40 Gefahren: Sandburgen, Kisten, Pfützen, Bälle, Wasserbälle, 6 Igel (1,7-fach; Krabben ersetzt), Gräben bis 274 px, Hindernis-Paare mit nur 176 px Abstand, ein Wasserball direkt hinter einem Graben, Steg-Trittsteine und eine Treppe mit Sandburg auf der Landung. |
| 9 | Tokaj (nur über den Paprika-Knopf): Weinberg am Hang mit Presshaus → Kellergasse → Weinlesefest; Boden und Gräben wie auf dem Bauernhof, Blöcke aus Holz | 330 px/s | 42 Gefahren: Kisten, Baumstümpfe, Baumstämme, Milchkannen, Heuballen, Pfützen, Bälle, 7 Igel, ein Frosch, 7 Gräben von 264 px, eine lange Terrasse in 2 Etagen über einem 716-px-Graben, eine Treppe in eine Kette, ein Igel unter einer Blockreihe, zwei Gräben mit kurzer Insel. |
| 10 | Visegrád (nur über den Paprika-Knopf): Donauknie bei Sonnenuntergang → Burgberg mit Hochburg und Salomonturm → Ritterfest; Boden und Bach wie im Wald, Blöcke aus Holz | 340 px/s | 46 Gefahren: Kisten, Heuballen, Baumstümpfe, Baumstämme, Milchkannen, Pfützen, Bälle, 2 Wasserbälle, 6 Igel (zwei direkt hintereinander), ein Frosch, 9 Gräben von 268 px, drei Inseln (Graben, Kiste, Graben), Gräben direkt hinter Pfützen, vier Paare mit 184 px Abstand, eine Vierer-Kette mit 198 px, eine Treppe über einen 404-px-Graben. Das schwerste Level. Danach Siegesfeier mit 10 Sternen. |

Jedes Level ist 13 200 px lang und hat genau 20 Würstel. Durch das höhere Tempo dauert ein Level etwas kürzer (Bot-Durchlauf 08.10.: Level 1 59 s, 2 56 s, 3 53 s, 4 51 s, 5 49 s). Gefahren pro Level (Hindernisse und Lücken): 6, 9, 11, 12, 13, 25, 34, 40, 42, 46. Bot-Durchlauf Level 6: 45 s, Level 7: 42 s, Level 8: 41 s, Level 9: 40 s, Level 10: 39 s (Messungen unten).

**Blöcke:** Von unten springt man durch, oben landet man (Einweg-Plattformen). Stufe 1 liegt 130 px über dem Boden (vom Boden erreichbar), Stufe 2 noch 105 px höher (nur von Stufe 1 erreichbar). Wer am Ende herunterläuft, landet wieder unten. Aussehen pro Welt: Holz mit Moos (Wald), Steg-Bretter (Strand), Obstkisten (Bauernhof), Eisblöcke (Winter).

**Lücken:** Wasser zwischen zwei Uferkanten (Bach, Meerwasser-Rinne, Graben mit Matschwasser, Eisloch); die dunklen Uferlinien liegen genau auf den echten Kanten. Hineinfallen = Platsch + Level von vorn. Lücken bis 170 px kann man überspringen; Lücken ab 400 px nur über die Blöcke darüber (direkt springen klappt nie, gemessen).

**Bewegte Hindernisse:**
- Laufen (Igel, Krabbe, Huhn): hin und her um ihren Platz. Igel und Krabbe 40 px/s, Huhn 45 px/s.
- Rollen (Wasserball 90 px/s, Schneeball 100 px/s): rollen los, sobald sie ins Bild kommen, und drehen sich dabei. Rollt einer in eine Lücke, versinkt er.
- Hüpfen (Frosch: auf der Stelle, 45 px hoch; Hase: 3 Hüpfer à 40 px nach links und zurück, 38 px hoch). Der Takt ist fest; nach einem Unfall-Neustart hüpfen sie wieder gleich (beim Start aus dem Menü ist die Phase je nach Wartezeit anders, siehe „Bekannte kleine Fehler“). Jede Phase ist gemessen sicher.
- Angestoßen: Bälle fliegen weg, Tiere bleiben stehen und hüpfen erschrocken.

## Sprung-Zeitfenster (gemessen am 08.10.)

Wie lange man zum Springen Zeit hat, damit Franky sicher darüber kommt. Ziel: mindestens 0,35 s für jedes Hindernis, bei bewegten Hindernissen in **jeder** Phase ihrer Bewegung.

| Level | Hindernis | Zeitfenster |
|---|---|---|
| 2 | Igel (9 Phasen; am knappsten, wenn er von Franky weg läuft) | 0,36–0,56 s (vorher im ungünstigsten Fall 0,28 s) |
| 3 | Sandburg | 0,43 s |
| 3 | Krabbe (ungünstigste Phase: läuft von Franky weg) | 0,36–0,40 s, sonst ≥ 0,5 s |
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

Level 6 (Puszta, nur über den Paprika-Knopf) ist für Erwachsene: Tempo 290, Sprung 147 px hoch und 0,78 s lang, Tiere **1,4-fach**. Zuerst waren sie 1,5-fach, da lag das Huhn in seiner schlechtesten Stellung bei 0,17–0,19 s, also unter der Grenze. Mit 1,4 ist jedes Fenster mindestens 0,185 s lang. Untergrenze für jedes Fenster: **0,18 s** (die Kinderregel 0,35 s gilt nur für Level 1–5). Messung wie oben: Zeit-Sweep, Ränder auf 5 ms genau. Bei Ketten stehen die früheren Taps auf ihrem Bot-Abstand.

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

Level 7 (Budapest, nur über den Paprika-Knopf) ist für Erwachsene: Tempo 310, Sprung 143 px hoch und etwa 0,66 s lang, Tiere **1,7-fach**. Untergrenze für jedes Fenster: **0,10 s**. Messung wie bei Level 6: Zeit-Sweep, Ränder auf 5 ms genau (Fest-Gefahren in px, Sekunden = px / 310). Bei Ketten stehen die früheren Taps auf ihrem Bot-Abstand, bei einem früheren Igel auch in dessen schlechtester Stellung. Ein Wert mit „≥“ ist eine Untergrenze: der Rand des Messbereichs war noch erfolgreich. Das Messrauschen liegt bei etwa ±0,015 s (gleiche Stelle, zwei Messungen: 0,095 und 0,145 s, weil eine grobe 50-ms-Suche einen Treffer übersehen hat).

**Hühner und Hasen sind durch Igel ersetzt.** Mit dem Huhn war das Fenster in der ungünstigsten Stellung nur **0,025 s** bei 2-fach, 0,075 s bei 1,7-fach und etwa 0,10 s bei 1,5-fach (es läuft dann gerade mit Höchstgeschwindigkeit weg). Der Hase hat in einer Hüpf-Stellung nur 0,045 s (1,8-fach) bzw. 0,08 s (1,7-fach). Die Trefferflächen bleiben fest, und das Tempo darf nicht unter 1,7 fallen. Darum stehen an den fünf Stellen, wo vorher Huhn oder Hase waren (x 2750, 5780, 7520, 11220, 11800), jetzt Igel. Gefahren bleiben 34, Würstel 20.

**Tier-Tempo 1,7.** Der Igel in seiner schlechtesten Stellung (er läuft gerade mit Höchstgeschwindigkeit weg) lässt bei 2,0 nur 0,095 s, bei 1,9 0,100 s und bei 1,8 an einer Stelle (Igel x 7520) 0,095 s (eine einzelne grobe Messung, die Nachbar-Stellungen lagen bei 0,12–0,165 s). Das ist jeweils unter 0,105 s (Grenze 0,10 s plus 5 ms Messrauschen). 1,8 wurde also nach einer einzelnen groben Messung verworfen und könnte bei einer feinen Nachmessung durchaus bestehen. Bei 1,7 ist das kleinste Fenster 0,117 s. Rollende Wasserbälle sind bei 1,7 unkritisch (Fenster 0,345–0,36 s). Beide Bälle treffen Franky auf festem Boden (Treffpunkt x 3850 bzw. 8700; der erste liegt 120 px hinter dem Bach, `stopped` bleibt `false`, bis Franky bei 3850 bzw. 8700 ist).

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

## Sprung-Zeitfenster Level 8 (gemessen am 22.10.)

Level 8 (Balaton, nur über den Paprika-Knopf) ist das drittschwerste Level für Erwachsene: Tempo 320, Sprung 143 px hoch und 0,633 s lang (`T.jumpProfile`), Tiere **1,7-fach**, 40 Gefahren, 20 Würstel. Untergrenze für jedes Fenster: **0,10 s**. Gemessen wurde in einer Schritt-Simulation des echten Spiels (Bildabstand fest 1/60 s, Tweens und Physik des Spiels, Tap-Zeit in 2-ms-Schritten gesweept, Ränder fein bestimmt) und an vier Stellen im Echtzeit-Lauf mit `T.windowSeq` nachgeprüft (siehe unten). Jede Zeile zeigt die **strengste** Fassung: die früheren Taps stehen auf ihrem Bot-Abstand, und die Gefahr direkt dahinter wird ebenfalls auf ihrem Bot-Abstand gesprungen (das Fenster eines Paar-Anfangs ist also schon durch den Nachfolger verkürzt). Tiere sind über 16 Stellungen des Laufzyklus gemessen (kleinster und größter Wert). Ein Wert mit „≥“ ist eine Untergrenze (der Rand des Messbereichs ±0,26 s war noch erfolgreich).

**Krabben sind durch Igel ersetzt.** Die Krabbe (breite Trefferfläche 30 px) lässt bei 1,7-fach in der ungünstigsten Stellung (sie läuft gerade mit Höchstgeschwindigkeit weg) nur **0,063 s**, in drei weiteren Stellungen 0,069–0,156 s: unter der Untergrenze bzw. kaum darüber. Der Igel hat in jeder Stellung mindestens 0,153 s. Darum laufen in Level 8 nur Igel; Sandburg, Wasserball, Kiste, Ball und Pfütze bleiben. Der Baumstamm kommt nicht vor (die Gefahren-Mischung ist ohne ihn dicht genug).

| Stelle | Zeitfenster |
|---|---|
| Einzeln (nichts davor/dahinter): Sandburg / Kiste / Pfütze / Ball / Wasserball | 0,200 / 0,231 / 0,204 / 0,257 / 0,237 s |
| Gräben einzeln 272 / 274 px | 0,128 / 0,122 s |
| Igel einzeln (16 Stellungen) | 0,153–0,369 s |
| Paar Sandburg → Kiste, 176 px Abstand (x 920 / 2581 / 3906 / 9240 / 10888): Sandburg mit Kiste dahinter | 0,132 s (je Stelle) |
| Paar Sandburg → Pfütze (x 4902 → 5078): Sandburg / Pfütze | 0,119 / 0,177 s |
| Paar Sandburg → Kiste: Kiste (zweite Gefahr, Sprung gleich nach der Landung) | 0,191 s |
| Pfütze x 1341 → Ball x 1519 (mit Würstel darüber): Pfütze / Ball | 0,263 / 0,204 s |
| Pfütze x 9661 → Ball x 9839: Pfütze / Ball | 0,263 / 0,204 s |
| Pfütze x 3002 (vor dem Graben) | 0,309 s |
| Pfütze x 8103 → Sandburg x 8281 → Graben: Pfütze / Sandburg | 0,230 / 0,171 s |
| Kiste x 5780 | 0,231 s |
| Ball x 6330 → Kiste x 6506: Ball / Kiste | 0,239 / 0,177 s |
| Ball x 12434 → Kiste x 12610 (Ende): Ball / Kiste | 0,192 / 0,177 s |
| Graben 272 px (x 1694 / 5273) | 0,128 / 0,128 s |
| Graben 274 px (x 3172, mit dem Wasserball dahinter / 8476 / 10034) | 0,122 / 0,122 / 0,122 s |
| Wasserball x 3879 (trifft Franky 190 px hinter dem Graben, auf festem Boden) | 0,333 s |
| Igel x 2251 (nach Graben, 16 Stellungen) | 0,153–0,369 s |
| Igel x 4572 / 6030 (nach Pause bzw. Kiste) | 0,153–0,369 / 0,153–0,396 s |
| Igel x 7803 (nach Stegen, Sandburg am Ufer) | 0,153–0,404 s |
| Igel x 10558 / 12149 | 0,153–0,369 / 0,153–0,369 s |
| Trittsteine: Stein 1 (vom Boden) / 1 → 2 / 2 → 3 / 3 → 4 | 0,447 / 0,516 / 0,198 / 0,164 s |
| Wasser 640 px unter den Stegen (Abstand der Stein-Taps) | ≥ 0,516 s |
| Sandburg auf der Landung nach dem letzten Stein (x 7541, Sprung vom Steg) | 0,374 s |
| Treppe: Etage 1 / Etage 2 | 0,270 / 0,387–0,407 s |
| Wasser 420 px unter der Treppe | ≥ 0,516 s |
| Sandburg auf der Landung nach der Treppe (x 11859) | 0,204 s |

Bot-Abstände D8 (px): obstacle 110, high 112, crate 109, ball 108, puddle 109, sandcastle 112, gap −47, tier1 130, tier2 120, hop 200, beachball 140, hedgehog 78. Alle Abstände liegen in den gemessenen Fenstern aller Stellungen (Igel: Fenster in jeder Stellung enthält 78). Der Graben-Abstand −47 passt für alle Breiten 272–274 px (Fenster −66…−25 px).

Bot-Ergebnis (Tiere 1,7-fach): 20/20 Würstel, kein Unfall. Aufwärm-Lauf 41,8 s (minFps 47), danach zwei Läufe nacheinander mit 41,4 s und 41,5 s (minFps 60). Zusätzlich 36 Bot-Läufe in der Simulation mit Anlauf-Verzögerungen von 0 bis 3,5 s in 0,1-s-Schritten (alle Igel-Stellungen): kein Unfall. Kurz-Layout (`?paprika&fast=1`, 3600 px, 8 Gefahren): Aufwärm-Lauf 10,9 s, danach 11,4 s, beide ohne Unfall. Sprungprofil: Scheitel 143 px, 0,633 s in der Luft (bei 30 Bildern pro Sekunde 135 px).

Echtzeit-Nachprüfung mit `T.windowSeq` (ein Browser, 60 fps): Graben x 8476 mit Vorgängern: 0,120 s (Simulation 0,122); Sandburg x 920 mit Kiste dahinter: 0,130 s (0,132); Sandburg x 4902 mit Pfütze dahinter: 0,110 s (0,119); Igel x 4572 allein (Stellung 500 ms): 0,19 / 0,20 s und einmal 0,11 s (ein einzelner Fehlschlag mitten im Fenster, das übliche Messrauschen), mit der Sandburg dahinter 0,08–0,16 s in fünf Stellungen, ebenfalls mit einzelnen Fehlschlägen innerhalb des Fensters (die Ausdehnung von erstem bis letztem Treffer liegt bei 0,15–0,33 s). Die Simulation ist deterministisch und liegt bei den festen Stellen 1–10 ms über dem Echtzeit-Wert. Nachmessung am 23.10. (ruhiger PC, ein Browser): Igel x 4572 mit Sandburg x 4902 und Pfütze x 5078 dahinter in 16 Stellungen der Simulation 0,150–0,369 s (Sandburg und Pfütze verkürzen das Fenster nicht), in Echtzeit in 8 Stellungen (Schritt 20 ms) 0,14–0,32 s ohne Fehlschläge innerhalb der Fenster. Die 0,08 s vom 22.10. waren Messrauschen des ausgelasteten Rechners; die Stelle bleibt unverändert (Marius, 23.10.: „kann ruhig bisschen schwieriger sein“, aber nicht unmöglich).

Knappste Stelle: die Sandburg bei x 4902 mit der Pfütze 176 px dahinter, 0,119 s (Echtzeit 0,110 s). Das sind 14 ms (Simulation) bzw. 5 ms (Echtzeit) über der Grenze von 0,10 s. Stellen ≤ 0,15 s: **11**, nämlich die sechs Sandburg-Paare (0,132 ×5 und 0,119 s) und die fünf Gräben von 272–274 px (0,122–0,128 s). Die Igel liegen in ihrer schlechtesten Stellung knapp darüber bei 0,153 s. Level 7 hatte 8 Stellen ≤ 0,15 s mit der knappsten bei 0,117 s und 34 Gefahren; Level 8 hat 40 Gefahren, höheres Tempo, kürzere Luftzeit und breitere Gräben (bis 274 statt 225 px).

## Sprung-Zeitfenster Level 9 (gemessen am 22.10.)

Level 9 (Tokaj, nur über den Paprika-Knopf) ist das zweitschwerste Level für Erwachsene: Tempo 330, Sprung 143 px hoch und 0,617 s lang (`T.jumpProfile`; Scheitel bei 30 Bildern pro Sekunde 134 px), Tiere **1,7-fach**, 42 Gefahren, 20 Würstel. Untergrenze für jedes Fenster: **0,10 s**. Gemessen wurde in einer Schritt-Simulation des echten Spiels (Bildabstand fest 1/60 s, Tweens und Physik des Spiels, Tap-Zeit in 2- bis 3-ms-Schritten gesweept) und an drei Stellen im Echtzeit-Lauf mit `T.windowSeq` nachgeprüft (siehe unten). Jede Zeile zeigt die **strengste** Fassung: die früheren Taps stehen auf ihrem Bot-Abstand, und die Gefahr direkt dahinter wird ebenfalls auf ihrem Bot-Abstand gesprungen (das Fenster einer Gefahr vor einer dicht folgenden ist also schon durch den Nachfolger verkürzt). Igel sind über 16 Stellungen des Laufzyklus gemessen, der Frosch ebenfalls über 16 Stellungen seines Hüpf-Takts (kleinster und größter Wert). Ein Wert mit „≥“ ist eine Untergrenze (der Rand des Messbereichs ±0,26 s war noch erfolgreich).

**Hühner, Hasen und Krabben kommen nicht vor.** Huhn und Hase lassen bei 1,7-fach in der ungünstigsten Stellung unter 0,10 s (Level 7), die Krabbe nur 0,063 s (Level 8). Es laufen nur Igel (Mindestfenster 0,138 s in jeder Stellung), der Frosch hüpft auf der Stelle. Der Igel braucht mindestens 285 px bis zur nächsten Gefahr, sonst verkürzt der Nachfolger sein Fenster stark; das ist an allen 7 Igeln eingehalten.

| Stelle | Zeitfenster |
|---|---|
| Einzeln (nichts davor/dahinter): Kiste / Baumstumpf / Baumstamm / Heuballen / Pfütze / Milchkanne / Ball | 0,207 / 0,222 / 0,183 / 0,195 / 0,198 / 0,243 / 0,249 s |
| Igel einzeln (16 Stellungen) | 0,135–0,342 s |
| Frosch einzeln (16 Stellungen) | 0,183–0,252 s |
| Kiste x 783 → Heuballen x 965 (Paar, 182 px Abstand): Kiste / Heuballen | 0,134 / 0,179 s |
| Milchkanne x 1187 → Ball x 1409 → Baumstumpf x 1631 | 0,261 / 0,306 / 0,312 s |
| Graben 264 px x 1746 (nach dem Baumstumpf; dahinter der Baumstamm 75 px hinter dem Ufer) | 0,138 s |
| Baumstamm x 2085 (direkt hinter dem Graben) | 0,213 s |
| Igel x 2375 (16 Stellungen, nach dem Baumstamm) | 0,138–0,342 s |
| Ball x 2665 → Graben x 2780 (264 px) → Pfütze x 3114 | 0,305 / 0,141 (mit Nachfolger 0,138) / 0,210 s |
| Igel x 3404 (16 Stellungen) | 0,138–0,342 s |
| Baumstumpf x 3694 → Graben x 3809 (264 px) → Frosch x 4153 | 0,285 / 0,138 / 0,207 s |
| Frosch x 4153 (16 Stellungen, direkt hinter dem Graben) | 0,207–0,275 s |
| Igel x 4443 (16 Stellungen, nach dem Frosch) | 0,138–0,342 s |
| Treppe (x 4963): Etage 1 / Etage 2 | 0,372 / 0,482–0,494 s |
| Wasser 404 px unter der Treppe (Abstand der Taps) | ≥ 0,516 s |
| Kiste x 5647 auf der Landung nach der Treppe (Sprung von Etage 2) | 0,209 s |
| Kiste x 5647 → Baumstumpf x 5869 → Heuballen x 6051 | 0,209 / 0,234–0,309 / 0,188 s |
| Igel x 6341 (16 Stellungen, nach dem Heuballen) | 0,138–0,342 s |
| Milchkanne x 6631 → Graben x 6746 (264 px) → Kiste x 7080 | 0,305 / 0,138 / 0,222 s |
| Igel x 7370 (16 Stellungen) | 0,138–0,342 s |
| Baumstumpf x 7660 → Graben x 7775 (264 px) → Milchkanne x 8114 | 0,285 / 0,138 / 0,255 s |
| Igel x 8404 (16 Stellungen) | 0,138–0,342 s |
| Pfütze x 8694 → Baumstamm x 8880 → Kiste x 9102 | 0,209–0,273 / 0,186 / 0,266 s |
| Terrasse (x 9462): Etage 1 / Etage 2 | 0,396 / 0,477 s |
| Terrasse: Absprung von Etage 2 auf den dritten Block (Sprung nach unten) | ≥ 0,516 s |
| Wasser 716 px unter der Terrasse | ≥ 0,474 s |
| Kiste x 10478 auf der Landung nach der Terrasse | 0,324 s |
| Milchkanne x 10700 (Etage 1 der Blöcke dahinter, 212 px weiter) | 0,149 s |
| Etage 1 der Blöcke x 10912 (unter ihnen geht der Igel) | 0,324 s |
| Igel x 11000 unter den Blöcken, Weg am Boden (16 Stellungen) | 0,138–0,342 s |
| Ball x 11290 vor dem Doppelgraben | 0,269–0,419 s |
| Doppelgraben 264 + 264 px (x 11425 / 11839, 150 px Insel dazwischen) | 0,138 / 0,138 s |
| Kiste x 12173 hinter dem zweiten Graben | 0,222 s |
| Milchkanne x 12395 → Baumstamm x 12591 (Ende) | 0,231–0,296 / 0,186 s |

Bot-Abstände D9 (px): crate 107, stump 110, log 110, milkcan 100, haybale 108, puddle 110, ball 108, gap −39, hedgehog 78, frog 110, tier1 130, tier2 120, high 114. Alle Abstände liegen in den gemessenen Fenstern aller Stellungen (Igel: das Fenster in jeder der 16 Stellungen enthält 78; Graben: Fenster −61…−17 px).

Bot-Ergebnis (Tiere 1,7-fach): 20/20 Würstel, kein Unfall. Aufwärm-Lauf 40,3 s (minFps 47, der erste Lauf nach dem Laden hat den bekannten Einbruch), danach zwei Läufe nacheinander mit 40,3 s (minFps 57) und 40,3 s (minFps 60). Zusätzlich 9 Bot-Läufe in der Simulation mit Anlauf-Verzögerungen von 0 bis 3,3 s (alle Igel-Stellungen): kein Unfall. Kurz-Layout (`?paprika&fast=1`, 3600 px, 9 Gefahren): Aufwärm-Lauf 10,8 s (minFps 44), danach 11,1 s und 11,2 s (minFps 60), alle ohne Unfall. Sprungprofil: Scheitel 143 px, 0,617 s in der Luft.

Echtzeit-Nachprüfung mit `T.windowSeq` (ein Browser, 53–60 fps, Schritt 10 ms): Kiste x 783 mit dem Heuballen dahinter 0,120 s (Simulation 0,134); Graben x 1746 mit den Vorgängern 0,140 s (0,138); Igel x 2375 in der ungünstigsten Stellung 0,140 s (0,138), in einer Stellung mit weitem Fenster 0,23 s mit einem einzelnen Fehlschlag mittendrin (das übliche Messrauschen). Die Echtzeit-Werte liegen 0 bis 14 ms von der Simulation entfernt.

Knappste Stelle: die Kiste bei x 783 mit dem Heuballen 182 px dahinter, 0,134 s in der Simulation, 0,120 s in Echtzeit. Das sind 15 ms über der Grenze von 0,10 s. Stellen ≤ 0,15 s: **16**, nämlich die 7 Igel in ihrer schlechtesten Stellung (0,138 s; x 2375 / 3404 / 4443 / 6341 / 7370 / 8404 / 11000), die 7 Gräben von 264 px (0,138–0,141 s; x 1746 / 2780 / 3809 / 6746 / 7775 / 11425 / 11839), die Kiste x 783 (0,134 s) und die Milchkanne x 10700 (0,149 s). Alle anderen Stellen liegen bei ≥ 0,183 s. Level 8 hatte 11 Stellen ≤ 0,15 s bei 40 Gefahren, Level 7 hatte 8 bei 34; Level 9 hat 42 Gefahren, höheres Tempo, kürzere Luftzeit und breitere Gräben (264 px, Fenster der Gräben 0,138 s).

## Sprung-Zeitfenster Level 10 (gemessen am 23.10.)

Level 10 (Visegrád, nur über den Paprika-Knopf) ist das Finale und das schwerste Level des Spiels: Tempo 340, Sprung 142 px hoch und 0,600 s lang (`T.jumpProfile`; Scheitel bei 30 Bildern pro Sekunde rechnerisch 134 px), Tiere **1,7-fach**, 46 Gefahren, 20 Würstel. Untergrenze für jedes Fenster: **0,10 s**. Gemessen wie bei Level 9: Schritt-Simulation des echten Spiels (Bildabstand fest 1/60 s, Tap-Zeit in 3-ms-Schritten gesweept), dazu Echtzeit-Nachprüfung mit `T.windowSeq` (siehe unten). Jede Zeile zeigt die **strengste** Fassung: die früheren Taps stehen auf ihrem Bot-Abstand, die Gefahr direkt dahinter wird ebenfalls auf ihrem Bot-Abstand gesprungen; bei Ketten mit weniger als 204 px Abstand (die Sprungweite) laufen alle Glieder der Kette mit. Igel und Frosch sind über 16 Stellungen gemessen (kleinster und größter Wert); beim zweiten Igel der Doppel-Igel-Stelle läuft die ganze Kette dahinter mit.

**Hühner, Hasen und Krabben kommen nicht vor** (unter 0,10 s bei diesem Tempo, siehe Level 7 und 8). Es laufen nur Igel, der Frosch hüpft auf der Stelle, Wasserbälle rollen. Jeder Igel hat mindestens 285 px bis zur nächsten Gefahr.

**Gräben:** Der Sprung reicht ~204 px. Ein Graben von 268 px lässt 0,123–0,126 s, 290 px nur noch 0,042 s, 300 px 0,014 s, ab 310 px ist er unmöglich (gemessen am einzelnen Graben). Alle neun Gräben haben darum 268 px. **Ketten:** Stehen Hindernisse enger als 204 px, muss jeder Sprung sofort bei der Landung kommen (Sprungpuffer 180 ms), und jedes Glied verliert (204 − Abstand) px Absprungweite. Darum ist die Vierer-Kette 198 px eng (bei 190 px müsste der erste Sprung 120–141 px vor der Kiste kommen, rechnerisch nur ~0,06 s; in der Messung scheiterte die Kette dann je nach Igel-Stellung davor) und beginnt mit Anlauf am Boden; nach den 184-px-Paaren ist die Kette unterbrochen (≥ 212 px).

| Stelle | Zeitfenster |
|---|---|
| Einzeln (nichts davor/dahinter): Kiste / Baumstumpf / Baumstamm / Heuballen / Pfütze / Milchkanne / Ball / Graben 268 px | 0,198 / 0,231 / 0,180 / 0,186 / 0,177 / 0,234 / 0,240 / 0,123 s |
| Igel einzeln (16 Stellungen) | 0,138–0,330 s |
| Frosch einzeln (16 Stellungen) | 0,192–0,243 s |
| Kiste x 800 → Heuballen x 984 (Paar, 184 px Abstand, Anlauf am Boden): Kiste / Heuballen | 0,129 / 0,219 s |
| Pfütze x 1208 → Graben 268 px x 1314 (106 px nach der Pfütze) → Baumstamm x 1654 | 0,273 / 0,126 / 0,195 s |
| Igel x 1944 (16 Stellungen) | 0,135–0,327 s |
| Baumstumpf x 2234 → Pfütze x 2430 → Graben x 2536 | 0,237 / 0,219 / 0,123 s |
| Insel 1: Graben x 2536 → Kiste x 2876 (72 px hinter dem Ufer) → Graben x 2982 (106 px nach der Kiste) | 0,123 / 0,216 / 0,123 s |
| Ball x 3322 hinter dem zweiten Graben | 0,237 s |
| Igel x 3612 (16 Stellungen) | 0,135–0,327 s |
| Wasserball x 4172 (rollt entgegen, Pause davor) | 0,396 s |
| Kiste x 4352 → Heuballen x 4536 (Paar, 184 px): Kiste / Heuballen | 0,129 / 0,219 s |
| Baumstumpf x 4748 → Pfütze x 4944 → Graben x 5050 | 0,216 / 0,213 / 0,126 s |
| Insel 2: Graben x 5050 → Kiste x 5390 → Graben x 5496 | 0,126 / 0,216 / 0,126 s |
| Frosch x 5944 (16 Stellungen, 180 px hinter dem Ufer) | 0,192–0,243 s |
| Igel x 6234 (16 Stellungen) | 0,135–0,327 s |
| Treppe (x 6544): Etage 1 / Etage 2 | 0,402 / 0,501–0,513 s |
| Wasser 404 px unter der Treppe | 0,516 s |
| Kiste x 7218 auf der Landung → Heuballen x 7402 (Paar, 184 px) → Milchkanne x 7602 | 0,129 / 0,219 / 0,231 s |
| Pfütze x 7822 → Graben x 7928 → Baumstamm x 8268 | 0,249 / 0,126 / 0,195 s |
| Igel x 8558 (16 Stellungen) | 0,135–0,327 s |
| Igel x 8898 (340 px hinter dem ersten, 16 Stellungen, mit der ganzen Kette dahinter) | 0,135–0,345 s |
| Vierer-Kette 198 px (Anlauf am Boden): Kiste x 9238 → Heuballen x 9436 → Baumstumpf x 9634 → Pfütze x 9832 | 0,132 / 0,222 / 0,219 / 0,219 s |
| Insel 3: Graben x 9938 (106 px nach der Pfütze) → Kiste x 10278 → Graben x 10384 | 0,123 / 0,216 / 0,123 s |
| Baumstamm x 10724 hinter dem Graben | 0,195 s |
| Igel x 11014 (16 Stellungen) | 0,135–0,327 s |
| Wasserball x 11574 | 0,396 s |
| Kiste x 11754 → Heuballen x 11938 (Paar, 184 px) → Pfütze x 12150 | 0,129 / 0,219 / 0,237 s |
| Graben x 12256 (106 px nach der Pfütze, letzte Gefahr) | 0,123 s |

Bot-Abstände D10 (px): crate 120, stump 110, log 110, milkcan 100, haybale 114, puddle 110, ball 108, beachball 140, gap −45, hedgehog 78, frog 110, tier1 130, tier2 120, high 114. Kiste und Heuballen springt der Bot früher als in Level 9 (120 statt 107, 114 statt 108), weil die Vierer-Kette einen frühen ersten Sprung braucht (Fenster der Kiste 96…141 px); alle Abstände liegen in den gemessenen Fenstern aller Stellen.

Bot-Ergebnis (Tiere 1,7-fach): 20/20 Würstel, kein Unfall. Aufwärm-Lauf 38,6 s (minFps 38, der bekannte Einbruch nach dem Laden), danach zwei Läufe nacheinander mit je 39,1 s (minFps 60). Zusätzlich 5 Bot-Läufe in der Simulation mit Anlauf-Verzögerungen von 0 bis 2,5 s (andere Igel-Stellungen): kein Unfall (36,4–39,7 s). Kurz-Layout (`?paprika&fast=1`, 3600 px, 10 Gefahren): 5 Läufe in der Simulation ohne Unfall (8,1–11,4 s); in Echtzeit (Ablauf 6 → 10 mit „Weiter“) 10,6 s, minFps 60, 8/8 Würstel. Sprungprofil: Scheitel 142 px, 0,600 s in der Luft.

Echtzeit-Nachprüfung mit `T.windowSeq` (ein Browser, 60 fps, Schritt 5 ms, beim Igel 10 ms): Kiste x 800 mit dem Heuballen dahinter 0,130 s (Simulation 0,129); Graben x 2536 mit der Pfütze davor und der Kiste dahinter 0,115 s (0,123); Kopf der Vierer-Kette x 9238 mit allen drei Gliedern dahinter 0,130 s (0,132; mit 196 statt 198 px Abstand waren es 0,110 s, darum 198); Igel x 1944 mit dem Baumstumpf dahinter in 8 Stellungen 0,12–0,31 s (Simulation 0,135–0,327), schlechteste Stellung 0,120 s; in drei Stellungen reichte das Fenster bis an den Rand des Messbereichs, dort sind die Werte Untergrenzen. Die Echtzeit-Werte liegen 0 bis 15 ms unter der Simulation.

Knappste Stelle: die Gräben von 268 px mit 0,123 s in der Simulation (x 2536 / 2982 / 9938 / 10384 / 12256), in Echtzeit 0,115 s. Das sind 23 ms (Simulation) bzw. 15 ms (Echtzeit) über der Grenze von 0,10 s. Stellen ≤ 0,15 s: **20**, nämlich die 9 Gräben von 268 px (0,123–0,126 s; x 1314 / 2536 / 2982 / 5050 / 5496 / 7928 / 9938 / 10384 / 12256), die 6 Igel in ihrer schlechtesten Stellung (0,135 s; x 1944 / 3612 / 6234 / 8558 / 8898 / 11014), die 4 Paare mit 184 px Abstand (0,129 s; Kisten x 800 / 4352 / 7218 / 11754) und der Kopf der Vierer-Kette (Kiste x 9238, 0,132 s). Alle anderen Stellen liegen bei ≥ 0,192 s. Level 9 hatte 16 Stellen ≤ 0,15 s bei 42 Gefahren; Level 10 hat 46 Gefahren, höheres Tempo, kürzere Luftzeit, breitere Gräben (268 statt 264 px, Fenster 0,123 statt 0,138 s) und 20 knappe Stellen.

## Level 6 bis 10 für Erwachsene

Wunsch von Marius (12.10.): zwei Zusatz-Level für die Kollegin, ungarisch, „richtig schwer“ und „extrem“. Am 22.10. kamen Level 8 bis 10 dazu: „immer schwerer und schwerer, steigend von Level 7“, nur neue Hintergründe, keine neuen Hindernisse (Design: `docs/superpowers/specs/2026-10-22-level-8-10-design.md`). Sie waren bis 27.10. nur über den geheimen Link `?paprika` erreichbar, seit 28.10. über den Paprika-Knopf auf dem Startbild (Wunsch von Marius: nur noch ein Link). Wo in den Messungen `?paprika` steht, heißt das heute: vorher `T.grownUps()`. Das Kinder-Spiel ist unverändert; alt gegen neu verglichen am 13.10. (Startbild in 4 Fällen gleich, Bot Level 1–5 mit den alten Zeiten).

- **Sprung pro Level** (`jump` in `src/levels.js`): Level 6 `velocity` -788, `gravity` 2020: ca. 147 px hoch, ca. 0,78 s in der Luft. Level 7 `velocity` -913, `gravity` 2766: ca. 143 px hoch, ca. 0,66 s. Zum Vergleich Level 1–5: echt ca. 164 px bei 60 fps (Theorie 169 px), ca. 1,04 s. Die Werte weichen von der ersten Rechnung ab, weil Arcade-Physik halbimplizit rechnet: echter Scheitel = v²/2g − v·dt/2. Level 8 -942 / 2943 (143 px, 0,63 s), Level 9 -972 / 3136 (143 px, 0,62 s), Level 10 -1005 / 3349 (142 px, 0,60 s). Gemessen wurde am echten Sprung (`T.jumpProfile`). Ohne `jump` gilt der Standard aus `src/config.js`. Ab Level 8 bleibt die Höhe bei etwa 143 px, die Luftzeit wird kürzer: Bei 30 Bildern pro Sekunde liegt der Scheitel noch bei 134–135 px, also über Block-Etage 1 (130 px).
- **Tier-Tempo** (`animalSpeed`): Level 6 **1,4-fach**, Level 7 **1,7-fach** (geplant 1,5 und 2). Bei mehr lag das Fenster in der schlechtesten Stellung unter der Grenze (siehe die Messtabellen). Level 8 bis 10 ebenfalls 1,7-fach. In Level 7 bis 10 laufen nur Igel (Hühner, Hasen und in Level 8 die Krabben sind ersetzt), dazu hüpfen in Level 9 und 10 Frösche auf der Stelle.
- **Untergrenzen** für das Sprung-Fenster: Level 6 **0,18 s**, Level 7 bis 10 **0,10 s** (statt 0,35 s; gemessen muss jedes Fenster ≥ 0,105 s sein, wegen des Messrauschens). Sie gelten für jede Gefahr, bei Tieren in jeder Phase und für jeden Ketten-Übergang. Unverändert: Trefferflächen, `jumpBufferMs` 180, `coyoteMs` 120.
- **Bilder erst nach dem Paprika-Knopf:** `src/art/puszta.js` (Level 6: Puszta) und `src/art/budapest.js` (Level 7: Budapest an der Donau) werden erst beim ersten Druck auf den Paprika-Knopf in `BootScene` geladen (bis 27.10.: nur mit `?paprika`). Das Kinder-Startbild lädt keine ungarischen Bilder (beide Module werden importiert, bauen aber keine Texturen). Dort entstehen nur die Knöpfe `btn-level-puszta` und `btn-level-budapest`, sonst keine neuen Bilder (geprüft am 13.10.: Textur-Schlüssel alt gegen neu, Unterschied genau diese zwei). Seit Level 8–10 kommen die Knöpfe `btn-level-balaton`, `btn-level-tokaj` und `btn-level-visegrad` dazu, ebenfalls ohne weitere Bilder (geprüft am 23.10.: außer den Knöpfen keine ungarische Textur auf dem Kinder-Link). Hindernisse, Blöcke, Lücken und Boden sind die vorhandenen Bilder (Level 6: Bauernhof, Level 7: Wald-Boden und Bach, Stege vom Strand); neu ist nur der Hintergrund. Budapest nutzt die Zonen-Eigenschaft `landmarks` in `src/backdrop.js` (jedes Wahrzeichen nur einmal pro Zone). Ebenso erst nach dem Paprika-Knopf: `src/art/balaton.js` (Level 8), `tokaj.js` (Level 9) und `visegrad.js` (Level 10). Neue Welt-Eigenschaft `flip`: weitere Deko-Bilder, die zufällig gespiegelt werden dürfen.
- **Feinabstimmung** nur über Zahlen in `src/levels.js`: `speed`, `jump`, `animalSpeed`, Abstände. Danach die betroffenen Stellen neu messen, den Bot laufen lassen und die Messtabellen oben aktualisieren.

## Lesbarkeit: Was ist Hindernis, was ist Hintergrund?

Wunsch von Marius (08.10.): Man soll sofort sehen, was man berühren kann.

- Alles im Spielbereich (Würstel, Hindernisse, Blöcke, Lücken) hat einen kräftigen dunklen Umriss. Was auf dem Boden steht, wirft einen weichen Schatten. Auch Franky hat einen Schatten, der beim Springen kleiner und heller wird.
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

## Franky

Nach Fotos des echten Franky (08.10.): rehbraune Französische Bulldogge. Körper von der Seite, Kopf leicht zum Betrachter gedreht (beide Augen sichtbar), Blick nach rechts. Große aufrechte Fledermausohren (innen dunkel), eckiger Kopf mit Stirnfalten und dunkleren Augenpartien, kurze schwarze Schnauze (Maske), große dunkelbraune Augen, kompakter muskulöser Körper mit hellerer Brust, Stummelschwanz. Dunkles Lederhalsband und hellblau kariertes Halstuch. Farben einstellbar in `src/config.js`.
Versionen: 1.0 grobe Formen, 1.1 als SVG neu (noch als Englische Bulldogge, weiß-braun), 1.2 nach Fotos.

Posen: Laufen (4 Bilder), Springen, Benommen, Glücklich, Fressen (2 Bilder).

## Sound

Per Web Audio erzeugt: Sprung („Boing“), Einsammeln (Glöckchen), Stolpern, Platschen, Schmatzen, Bellen, Plopp, Schlussmelodie, Fanfare und Feuerwerk (Siegesfeier).

## Technik-Notizen

- Physik mit variablem Zeitschritt (`fixedStep: false`): Marius' Bildschirm läuft mit 59 Hz; ein fester 60-Hz-Schritt ruckelte alle paar Sekunden.
- Der Boden ist zwischen den Lücken in dicke Blöcke geteilt, damit Franky auch bei einem Hänger auf einem langsamen Tablet nicht durch den Boden fällt.

## Bekannte kleine Fehler

- Die kurze Pause vor dem Loslaufen (0,7 s, siehe Ablauf) gibt es nur nach einem Unfall-Neustart. Beim Start aus der Level-Auswahl, mit „Nochmal“ und mit „Weiter“ läuft Franky sofort los (gemessen 08.10.). Grund: die Spiel-Uhr der Level-Szene läuft nur, solange die Szene läuft; beim Neueintritt ist sie noch auf dem Stand vom letzten Mal (Phaser 3.90 setzt `time.now` erst im ersten Update). Betrifft alle Level, auch Level 1. **Bleibt bewusst so** (Marius, 08.10.): So hat er Level 1 getestet und abgenommen. Falls die Pause später doch bei jedem Start kommen soll: in `GameScene.create()` `this.game.loop.time` statt `this.time.now` nehmen und alle Level neu prüfen.
- Ein Würstel, das in der Luft eingesammelt wird, zählt für die 120 ms Coyote-Zeit als Boden. Ein Tippen genau dann kann einen neuen Sprung starten (alle Level). **Bleibt so.**
- Der allererste Level-Start nach dem Laden der Seite hat einmalig einen Einbruch der Bildrate. In Level 6 und 7 kann das einen Durchlauf kosten; der nächste Versuch klappt.
- Unter etwa 22 Bildern pro Sekunde sind die Blöcke in Level 7 nicht mehr erreichbar (der Sprung wird bei niedriger Bildrate niedriger). Level 7 braucht also ein halbwegs schnelles Gerät.
- Der Fortschritt der Erwachsenen-Level wird getrennt gespeichert (Schlüssel `frankie-unlocked-paprika`, Name aus der Zeit des geheimen Links), damit er auf einem gemeinsamen Gerät nie Kinder-Level öffnet.
- Level 7 bis 10 haben sehr enge Fenster (ab etwa 0,11 s). Auf langsamen Geräten werden sie noch enger: am besten am PC oder auf einem schnellen Handy spielen.
- In Level 8 bis 10 sind die Blöcke bei 30 Bildern pro Sekunde gerade noch erreichbar (Scheitel 134–135 px, Etage 1 bei 130 px); bei weniger Bildern wird es knapp.

## Später

- Name des Kindes im Startbild.
- Sammelalbum oder Sterne (z. B. Pokal im Startbild, wenn alle 5 Level geschafft sind).
