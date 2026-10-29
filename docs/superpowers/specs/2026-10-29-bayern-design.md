# Level 11 bis 15: Bayern – Design

Stand: 2026-10-29. Von Marius freigegeben am 29.10.2026 (mit der Änderung: Würstel bleiben die normalen). Umgesetzt auf dem Branch `feat/bayern`.

## Ziel

Marius will für Franky einen dritten Teil „Bayern“ auf demselben Link (https://mariusb1860-jpg.github.io/franky/). Auf dem Startbild rückt der Paprika-Knopf (bzw. der Kind-Knopf) etwas zur Seite, daneben kommt ein Breze-Knopf. Dahinter liegen 5 neue Level mit bayerischen Welten. Schwierigkeit: **zwischen Level 6 und 7, nicht darüber** (8–10 sind ihm zu schwer). Bayerische Ideen und „eventuell einige neue Hindernisse“ überlässt er Claude. Testen: immer nur ein Test-Browser-Fenster.

Ausgangsstand: `main` @ `6968667`.

## Festlegungen (Claude, von Marius freigegeben)

1. **Knöpfe unten:** zwei Knöpfe nebeneinander statt einem (x ≈ 418 und 542, gleiche Höhe 428). Es stehen immer die zwei *anderen* Hälften da: Kinder-Startbild = Paprika + Breze, Paprika-Startbild = Kind + Breze, Bayern-Startbild = Kind + Paprika. Breze-Knopf: bayerisch blau mit weißem Ring, braune Breze mit Salz.
2. **Schwierigkeit steigt sanft von „wie Level 6“ zu „knapp unter Level 7“:**

   | | L6 (ist) | 11 | 12 | 13 | 14 | 15 | L7 (ist) |
   |---|---|---|---|---|---|---|---|
   | Tempo | 290 | 290 | 293 | 296 | 300 | 303 | 310 |
   | Luftzeit (Höhe ~145 px) | 0,78 s | 0,78 | 0,76 | 0,74 | 0,72 | 0,70 | 0,66 |
   | Tiere | 1,4× | 1,4 | 1,4 | 1,45 | 1,5 | 1,5 | 1,7 |
   | Gefahren | 25 | 26 | 27 | 28 | 30 | 31 | 34 |
   | Kleinstes Sprung-Fenster | 0,18 s | 0,18 | 0,16 | 0,15 | 0,14 | 0,13 | 0,10 |

   Zahlen sind Zielwerte; Feinabstimmung über Messung. Blöcke auch bei 30 fps erreichbar (Scheitel ≥ 133 px).
3. **Fünf Welten (nur Hintergrund, Boden/Wasser/Blöcke aus vorhandenen Welten):**
   - 11 **München** (`muenchen`): Englischer Garten mit Chinesischem Turm → Marienplatz (Rathaus, Frauenkirche) → Viktualienmarkt mit Maibaum
   - 12 **Alm** (`alm`): Almwiese mit Kühen und Glocken → Almhütte, Gipfelkreuz → Zugspitze
   - 13 **Königssee** (`koenigssee`): Bergwald → St. Bartholomä vor dem Watzmann → Bootssteg (Trittsteine übers Wasser)
   - 14 **Neuschwanstein** (`neuschwanstein`): Bergwald → Marienbrücke mit Schloss → Alpsee/Hohenschwangau (Treppe über eine Schlucht)
   - 15 **Oktoberfest** (`wiesn`, Finale): Bavaria-Statue → Bierzelte → Riesenrad, Lebkuchenherzen
4. **Vier neue Hindernisse** (nur in Bayern, mit dunklem Umriss + Schatten, Trefferfläche kleiner als das Bild):
   - **Maßkrug** – steht (wie Milchkanne)
   - **Bierfass** – rollt Franky entgegen (wie Wasserball)
   - **Dackel** – läuft hin und her (wie Igel)
   - **Murmeltier** – springt auf der Stelle aus dem Boden hoch (wie Frosch)

   Dazu passende vorhandene: Kiste, Heuballen, Milchkanne, Baumstumpf, Baumstamm, Pfütze, Ball, Igel, Huhn, Frosch, Hase. Jedes neue Tier wird in allen Bewegungs-Phasen gemessen; fällt es unter die Untergrenze, wird es langsamer oder die Trefferfläche kleiner.
5. **Würstel bleiben die normalen** (Marius, 29.10.: Weißwürste wären auf hellem Hintergrund schlecht zu sehen). Siegesfeier nach Level 15 mit **5 Sternen** in den Farben der 5 bayerischen Welten und weiß-blauer Rauten-Wimpelkette; Haus-Knopf führt zum Bayern-Startbild.
6. Tastatur im Bayern-Startbild: Tasten 1–5 starten 11–15. Spielstand getrennt (`frankie-unlocked-bayern`), Level 11 immer offen, jeder Aufruf des Links startet weiter bei den Kindern. Bayerische Bilder laden erst beim ersten Breze-Druck (Ladebalken), wie bei Paprika.
7. Kinder-Level 1–5 und Paprika-Level 6–10 bleiben unverändert (nur die Knopf-Position unten ändert sich).

## Technik (was sich ändert)

| Datei | Änderung |
|---|---|
| `src/mode.js` | Statt `grownUps` (true/false) ein Modus `'kids' \| 'paprika' \| 'bayern'` (`getMode`/`setMode`); `isGrownUps()` bleibt als Kurzform für Paprika, damit vorhandener Code nicht bricht. |
| `src/levels.js` | Level 11–15 (Welt, `speed`, `jump`, `animalSpeed`, `layout`, `fast`); Gruppe `BAYERN = [11..15]`; `shownLevels()` und `isFinale()` (5/10/15) erweitern. |
| `src/progress.js` | Schlüssel je Modus (neu `frankie-unlocked-bayern`; alte Schlüssel bleiben). |
| `src/scenes/StartScene.js` | Zwei Modus-Knöpfe, `switchLevels(mode)`, Tasten 1–5 → 11–15. |
| `src/scenes/BootScene.js` | Bilder je Modus nachladen (`hasArt(mode)` statt `hasGrownUpArt()`). |
| `src/scenes/VictoryScene.js` | Sterne der gespielten Gruppe (bei 15: Welten 11–15), Bayern-Wimpel. |
| `src/course.js` | Neue `OBSTACLE_TYPES` (`masskrug`, `barrel`, `dachshund`, `marmot`). |
| `src/worlds.js` | Fünf Welten mit Zonen, Farbe für Knopf/Stern. |
| `src/art/world.js` | `btn-bayern` (Breze-Icon). |
| `src/art/bavaria.js` (neu) | Neue Hindernisse, Rauten-Wimpel. |
| `src/art/muenchen.js`, `alm.js`, `koenigssee.js`, `neuschwanstein.js`, `wiesn.js` (neu) | Hintergründe, Stil wie `budapest.js`/`visegrad.js` (`landmarks`, `flip`). |
| `preview.html` | Neue Gruppen eintragen. |
| `tools/test-helpers.js` | `T.mode('bayern')` (wie Breze-Knopf). |
| `docs/spec.md`, `CLAUDE.md`, `README.md` | Bayern-Hälfte, Regeln für 11–15, Messtabellen. Keine privaten Daten (Repo ist öffentlich). |
| `share.jpg` | Neu, weil das Startbild jetzt zwei Knöpfe hat. |

Wiederverwenden: Layout-Bausteine in `levels.js` (`row`, `arc`, `high`, `stream`, `blocks`, Trittsteine/Treppe aus L6/L7), `createBackdrop`/`landmarks`/`flip` in `backdrop.js`, `modeButton()` in `art/world.js`, die Schritt-Simulation von Level 8 bis 10 (Tempo als Parameter), `tools/nocache_server.py`.

## Ablauf

Branch `feat/bayern`. **Immer nur ein Helfer und ein Test-Browser gleichzeitig**; Jeder Schritt endet mit Commit.

1. **Gerüst:** Modus, zwei Knöpfe mit Breze, Laden, Spielstand, Tastatur, Siegesfeier, Test-Helfer. Level 11–15 erst als Platzhalter. Check: Startbild in allen drei Hälften, Wechsel hin und her.
2. **Neue Hindernisse:** Zeichnungen, Trefferflächen, Einzel-Fenster bei Tempo 290–303 und Tier-Tempo 1,4–1,5 messen (alle Phasen).
3. **Fünf Welten:** je ein Helfer nacheinander (Sonnet), Ansicht in `preview.html` und im Level.
4. **Level 11–15:** Layouts nach Tabelle, Mess-Simulation, jede Stelle ≥ Untergrenze, Bot 20/20 ohne Unfall; je Level ein Helfer nacheinander.
5. **Schlussprüfung + Doku + `/code-review`.**
6. **Du testest** lokal (`localhost:8137`), dann **mit deinem OK** Merge nach `main` + Push (= online), Live-Check.

## Prüfen

- Keine Konsolenfehler. Kinder-Link frisch: nur Level 1 offen, Kinder-Bots L1–5 wie vorher, keine bayerischen oder ungarischen Bilder geladen.
- Paprika: Knöpfe 6–10 und Bots unverändert.
- Bayern: Knöpfe 11–15, frisch nur 11 offen; Ablauf mit `?fast=1` 11 → 15 → Siegesfeier (5 Sterne) → Haus → Bayern-Startbild.
- Bots L11–L15 je 20/20 ohne Unfall (erster Lauf nach dem Laden zählt nicht), minFps ≥ 50.
- Messtabellen L11–15 in `docs/spec.md`: jede Stelle ≥ Untergrenze (+5 ms Messrauschen), Tiere in allen Phasen.
- Screenshots 960×540 und Handy quer 844×390 (Touch): Hindernisse klar vom Hintergrund zu unterscheiden, Knöpfe gut tippbar.
