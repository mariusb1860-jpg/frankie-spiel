# Level 6 + 7 für Erwachsene (Ungarn) – Design

Stand: 2026-10-12. Spezifikation von Marius freigegeben, umgesetzt auf dem Branch `feat/level-6-7` (noch nicht in `main`).

## Ziel

Eine erwachsene Arbeitskollegin von Marius fand das Spiel lustig und wünscht sich zwei Level mehr. Level 6 und 7 sollen **extrem schwer** sein: Auch Erwachsene sollen viele Versuche brauchen. Sie bleiben aber schaffbar. Der Hintergrund greift Ungarn auf: Paprika, Gulasch, die Flagge in Rot-Weiß-Grün.

Erfolg heißt:
- Die Kollegin bekommt einen eigenen Link und findet dort nur Level 6 und 7.
- Beide Level sind nachweislich schaffbar: Der Bot sammelt 20/20 ohne Unfall.
- Marius findet sie beim eigenen Test „richtig schwer“.
- Für das Kind ändert sich nichts.

## Grundsatz: wenig Neues (Wunsch von Marius)

Wörtlich sinngemäß: „Genau dasselbe Prinzip, mit den vorhandenen Ressourcen, außer den Welten im Hintergrund.“

**Bleibt, wie es ist:**
- Startbild mit runden Level-Knöpfen.
- Steuerung: ein Knopf, Tippen = Springen.
- Alle Hindernis-Arten, Blöcke, Wasserlöcher und Würstel. Sie werden in Level 6/7 nur häufiger eingesetzt und bewegen sich schneller.
- Futterszene mit „Nochmal“ und „Weiter“, Siegesfeier und Unfall-Neustart.
- Level 1–5: Layout, Tempo, Trefferflächen und Ablauf bleiben unverändert. Level 1 bleibt sowieso unangetastet.

**Neu:**
- Zwei Hintergrund-Welten (Zeichnungen per Code, wie bisher).
- Zwei Level-Einträge.
- Drei kleine Stellschrauben im Code: Sprung pro Level, Tier-Tempo pro Level und der geheime Link.

**Nicht neu:** keine neuen Hindernis-Arten, kein neues Startbild, keine zusätzlichen Knöpfe, keine Texte, kein Versuchs-Zähler, keine neuen Töne.

## Geheimer Link

- **Normaler Link** (`https://mariusb1860-jpg.github.io/frankie-spiel/`): genau wie bisher. Das Startbild zeigt Knöpfe 1–5, nach Level 5 kommt die Siegesfeier. Level 6/7 tauchen nirgends auf.
- **Geheimer Link** (`https://mariusb1860-jpg.github.io/frankie-spiel/?paprika`):
  - Das Startbild ist dasselbe, zeigt aber nur zwei Knöpfe: **6** und **7**. Sie stehen mittig im bisherigen Knopf-Bereich.
  - Level 6 ist immer offen. Level 7 öffnet sich, sobald Level 6 einmal geschafft ist (eigener Speicherschlüssel `frankie-unlocked-paprika`, damit Fortschritt der Erwachsenen auf einem gemeinsamen Gerät nie Kinder-Level öffnet; der normale Link nutzt weiter `frankie-unlocked`).
  - Nach Level 6: Futterszene mit „Nochmal“ und „Weiter“ (Weiter = Level 7).
  - Nach Level 7: Futterszene, dann die bekannte Siegesfeier. Der Haus-Knopf führt zurück zum Startbild mit 6 und 7, weil der Link-Zusatz in der Adresse bleibt.
  - Die Leertaste startet das neueste offene Level, die Tasten 6 und 7 das jeweilige Level.
- Das Wort „geheim“ ist nicht wörtlich zu nehmen: Das Repo ist öffentlich. Wer den Link nicht kennt, sieht die Level aber nicht.
- Testzusätze: `?paprika&alle=1` öffnet Level 7 sofort, `?paprika&fast=1` gibt kurze Test-Level.

**Siegesfeier-Sterne:** Heute fliegt für jeden Eintrag in `LEVELS` ein Stern ein. Mit 7 Leveln wären das auch beim Kind 7 Sterne. Neu richtet sich das nach dem gerade geschafften Level: Nach Level 5 kommen 5 Sterne (wie bisher), nach Level 7 kommen 7 Sterne. Die zwei neuen sind rot und grün. 7 Sterne mit 100 px Abstand reichen von x = 180 bis 780 und passen ins Bild.

## Schwierigkeit

### Stellschrauben (alle pro Level in `src/levels.js`)

| | Level 5 (heute) | Level 6 Start | Level 7 Start |
|---|---|---|---|
| Tempo (`speed`) | 268 px/s | 290 px/s | 310 px/s |
| Sprunghöhe | ca. 170 px | ca. 145 px | ca. 140 px |
| Zeit in der Luft | ca. 1,04 s | ca. 0,78 s | ca. 0,66 s |
| Sprung in Werten | v −650, g 1250 | v ≈ −744, g ≈ 1906 | v ≈ −848, g ≈ 2571 |
| Tiere (`animalSpeed`) | 1 | 1,5 | 2 |
| Gefahren pro Level | 13 | ca. 25 | ca. 35 |
| kürzestes Sprung-Fenster (Ziel) | ≥ 0,35 s | ca. 0,20 s | ca. 0,12 s |

- **Sprung:** Höhe und Zeit in der Luft legen Abwurfgeschwindigkeit und Schwerkraft fest (v = 4·h/T, g = 8·h/T²). Die Sprunghöhe bleibt knapp über der unteren Block-Etage (130 px). So erreicht Frankie die Blöcke gerade noch. Level 1–5 nutzen weiter `CONFIG.jumpVelocity` und `CONFIG.gravity`.
- **Tiere:** `animalSpeed` multipliziert das Lauftempo (`patrolSpeed`) und das Rolltempo (`roll`). Bei Hüpfern teilt es Sprung- und Pausendauer (`hop.ms`, `hop.pause`). Die Strecken bleiben gleich.
- **Unverändert:** Trefferflächen, Sprung-Puffer (180 ms) und Kanten-Puffer (120 ms). Falls es nach dem Test zu leicht ist, sind die Puffer die nächste Schraube, aber nur nach Rückfrage.

**Faustrechnung** (vereinfachtes Modell, ca. 10 % zu optimistisch gegenüber der Messung von Level 5). Sprung-Fenster für einzelne Hindernisse: Level 6 ca. 0,30 s, Level 7 ca. 0,21 s. Die kürzesten Fenster entstehen erst durch breite Lücken und Ketten (siehe unten). Wasserloch 210 / 230 px: Level 6 ca. 0,31 / 0,24 s, Level 7 ca. 0,22 / 0,15 s. Ein Igel, der mit doppeltem Tempo von Frankie wegläuft: Level 7 ca. 0,20 s.

### Untergrenzen (Fairness, gemessen)

Die Kinderregel „jede Gefahr ≥ 0,35 s“ gilt weiter nur für Level 1–5. Für 6/7 gelten eigene Untergrenzen. Sie gelten für jede Gefahr, bei Tieren in jeder Bewegungs-Phase, und für jeden Ketten-Übergang:
- Level 6: **≥ 0,18 s**
- Level 7: **≥ 0,10 s**

Kein Hindernis darf nur mit Glück oder Bild-genau zu schaffen sein. Jedes Level muss der Bot ohne Unfall mit allen 20 Würsteln schaffen.

### Muster aus vorhandenen Teilen

Die Schwierigkeit kommt aus der Dichte und aus Ketten, nicht aus neuen Teilen:
- **Doppel / Dreier:** zwei bis drei Hindernisse im Abstand von gut einer Sprungweite. Landen und sofort wieder springen.
- **Lücke + Hindernis:** Direkt hinter einem Wasserloch steht ein Hindernis. Der Landeplatz ist klein.
- **Breite Lücken:** Wasserlöcher von 200–230 px, knapp unter der Sprungweite.
- **Trittsteine:** Über einem nicht springbaren Wasser (≥ 400 px) liegen einzelne Blöcke aus 1–2 Kacheln in Etage 1, mit Abstand dazwischen. Man hüpft von Block zu Block.
- **Treppe:** Etage 1 → Etage 2 über Wasser.
- **Tier unter Blöcken:** Ein laufendes Tier patrouilliert unter einer Blockreihe. Oben bleiben oder genau timen.
- **Würstel als Köder:** Würstel über Lücken, auf Trittsteinen oder zwischen zwei Hindernissen. Alle 20 bleiben erreichbar (Bot-Beweis), aber nicht alle gleich sicher.

Rahmen wie bei allen Leveln: 13 200 px lang, genau 20 Würstel, Hundehütte am Ende.

## Welten (neu: nur der Hintergrund)

Boden, Wasser und Blöcke stammen aus vorhandenen Welten. Die Uferbilder passen dann zum Boden:

| | Level 6 „Puszta“ (`puszta`) | Level 7 „Budapest“ (`budapest`) |
|---|---|---|
| Knopf-Farbe | Flaggen-Rot `0xce2939` | Flaggen-Grün `0x477050` |
| Boden (vorhanden) | `ground-farm` | `ground-forest` |
| Wasser (vorhanden) | `gap-farm` (Graben) | `gap-forest` (Bach, hier: Donau-Ufer) |
| Blöcke (vorhanden) | `block-crate` (als Paprikakisten) | `block-pier` (als Donau-Anleger) |
| Hindernisse (vorhanden) | Heuballen, Milchkanne, Kiste, Baumstumpf, Holzstamm, Pfütze, Huhn, Frosch, Igel, Hase | Kiste, Ball, Wasserball, Holzstamm, Pfütze, Igel, Huhn, Hase |
| Himmel | normaler Himmel | normaler Himmel |

Die Knöpfe behalten weiße Ziffer und weißen Ring. Rot, Weiß und Grün ergeben zusammen die Flagge.

### Level 6 – Puszta und Paprika (neue Zeichnungen)

Drei Zonen, wie bei den anderen Welten:
1. **Paprikafelder:** Paprikapflanzen mit roten Schoten (vorne). Weißes Bauernhaus mit Schilfdach und roten Paprikaketten (Mitte). Ungarn-Fahne am Mast. Pappeln (hinten).
2. **Puszta:** Ziehbrunnen (Gémeskút) (Mitte). Graue Steppenrinder mit langen Hörnern und Racka-Schafe mit Schraubenhörnern (hinten). Ein Csikós (Pferdehirte) auf dem Pferd (hinten). Gulaschkessel über dem Feuer am Dreibein, mit gezeichnetem Dampf (Mitte). Heuschober (Mitte). Steppengras (vorne).
3. **Gulasch-Fest im Dorf:** Bauernhäuser mit Paprikaketten, ein großer Gulaschkessel, Fahnen. Zaun mit Wimpeln in Rot-Weiß-Grün (Streifen).

Dazu kommen neue Hügel-Kacheln: flacher Puszta-Horizont, fern und nah. Vor den Paprikafeldern läuft eine Reihe Paprikapflanzen als Streifen. Vorhandene Deko darf mitbenutzt werden (z. B. Sonnenblume, Grasbüschel, Busch).

### Level 7 – Budapest an der Donau (neue Zeichnungen)

1. **Donauufer (Pest):** Parlament mit Kuppel (hinten, groß). Gelbe Straßenbahn (Mitte). Laternen und Blumenkübel (vorne). Geländer der Uferpromenade (Streifen).
2. **Kettenbrücke:** Kettenbrücke mit Löwen (Mitte). Burgpalast und Fischerbastei (hinten). Ausflugsschiff auf der Donau (hinten).
3. **Markt:** Große Markthalle mit bunt gemustertem Dach (Mitte). Marktstände mit Paprikaketten und Paprikakisten auf der Theke, ein Gulasch-Stand mit dampfendem Kessel, Fahnen (Mitte). Vorne nur Blumenkübel und Laternen: Kisten vorne sähen aus wie das Kisten-Hindernis (Lesbarkeits-Regel).

Dazu neue Kacheln: fern die Budaer Berge und davor die Donau (wie das Meer in Level 3), nah die Wiese der Uferpromenade. Wahrzeichen stehen als Einzel-Bilder in der hinteren Ebene am anderen Ufer, nicht in den Kacheln, damit sie sich nicht wiederholen.

Für alle Zeichnungen gelten die Lesbarkeits-Regeln: Hintergrund mit weichen Umrissen hinter dem Dunstschleier. Nichts darf wie ein Hindernis aussehen.

Keine Animationen nötig. Die Zeichnungen sind statisch. Kessel-Dampf, Fahnen und Bahn sind gezeichnet.

## Technik

| Datei | Änderung |
|---|---|
| `src/config.js` | `PAPRIKA = params.has('paprika')` |
| `src/levels.js` | Level 6 und 7 (Welt, `speed`, `jump: { velocity, gravity }`, `animalSpeed`, Layout, `fast`-Layout). Statt `PLANNED_LEVELS`: zwei Level-Gruppen (Kinder 1–5, Paprika 6–7) mit Hilfsfunktionen: welche Knöpfe sichtbar sind, welches Level das letzte der Gruppe ist. |
| `src/level.js` | `jump` und `animalSpeed` an das gebaute Level durchreichen. |
| `src/course.js` | `animalSpeed` beim Laufen, Rollen und Hüpfen anwenden (Standard 1, Level 1–5 rechnen also exakt wie bisher). |
| `src/scenes/GameScene.js` | Sprung-Werte aus dem Level, sonst aus `CONFIG`. Die Schwerkraft wird pro Level gesetzt. |
| `src/scenes/StartScene.js` | Knöpfe der sichtbaren Gruppe. Positionen nach Reihenfolge, nicht nach Level-Nummer. Das erste Level der Paprika-Gruppe ist immer offen. |
| `src/scenes/EatScene.js` | Die Siegesfeier kommt nach dem letzten Level der Gruppe (5 oder 7), nicht nach `>= 5`. Das geschaffte Level geht an die Siegesfeier. |
| `src/scenes/VictoryScene.js` | Sterne für die Level 1 bis zum geschafften Level. |
| `src/worlds.js` | Welten `puszta` und `budapest`. |
| `src/art/puszta.js`, `src/art/budapest.js` (neu) | Die neuen Zeichnungen und Kacheln, eine Datei pro Welt wie bei den anderen Welten. `pusztaSvgs()`/`preloadPuszta()` und `budapestSvgs()`/`preloadBudapest()`. Die Ungarn-Fahne liegt in `puszta.js`, Budapest benutzt sie mit. |
| `src/scenes/BootScene.js` | `preloadPuszta()` und `preloadBudapest()` nur bei `PAPRIKA`. Der normale Link lädt keine ungarischen Bilder. |
| `src/backdrop.js` | Neue Deko-Bilder, die gespiegelt werden dürfen, in `FLIPPABLE` (ändert die anderen Welten nicht). |
| `preview.html` | Gruppen `puszta` und `budapest` ergänzen (immer anzeigbar). |
| `tools/` (neu) | Test-Helfer für den Browser und ein Test-Server ohne Cache, damit Messungen und spätere Feinabstimmung wiederholbar sind. Gehört nicht zum Spiel. |
| `docs/spec.md`, `CLAUDE.md` | Level 6/7, geheimer Link, eigene Fairness-Regeln für 6/7. |
| `README.md` | Neue Dateien. Den geheimen Link nicht hineinschreiben, die Seite ist öffentlich. |

`share.jpg` und die Link-Vorschau bleiben, wie sie sind.

## Prüfen

1. **Nichts kaputt für das Kind:**
   - Normaler Link: keine Konsolenfehler.
   - Das Startbild ist gleich aufgebaut wie vor dem Umbau: gleiche Knöpfe an gleichen Stellen, gleicher Puls, gleiche Bilder. Geprüft im Browser gegen den alten Stand von `main`. Ein Pixelvergleich geht nicht, weil das Startbild animiert ist.
   - Die Bots für Level 1–5 schaffen weiter 20/20 ohne Unfall, die Zeiten bleiben ungefähr gleich (59/56/53/51/49 s).
   - Nach Level 5 kommt die Siegesfeier mit 5 Sternen.
   - Die ungarischen Bilder werden im normalen Link nicht geladen.
2. **Geheimer Link:**
   - Das Startbild zeigt nur 6 und 7, und 7 ist anfangs zu.
   - Ablauf mit `?paprika&fast=1`: Level 6 → Futterszene → „Weiter“ → Level 7 → Futterszene → Siegesfeier mit 7 Sternen → Haus → Startbild mit 6 und 7 (jetzt offen).
3. **Schaffbar:** Der Bot schafft Level 6 und 7 je 20/20 ohne Unfall.
4. **Fairness:** Bei jeder Gefahr und jedem Ketten-Übergang wird das Sprung-Fenster gemessen, bei Tieren in mehreren Phasen. Untergrenzen: Level 6 ≥ 0,18 s, Level 7 ≥ 0,10 s. Ergebnis-Tabelle in `docs/spec.md`.
5. **Optik:**
   - Screenshots jeder Zone bei 960×540 und als Handy quer (844×390).
   - Prüfen: Hintergrund klar vom Spielbereich getrennt? Passen die Ufer zum Boden?
   - Bildrate in Level 7 bei 60 fps.
6. **Marius testet selbst**, zuerst am PC: Claude startet den lokalen Server, Marius öffnet `http://localhost:8137/?paprika`. Danach Feinabstimmung nur über die Zahlen in `src/levels.js`. Das Handy kann erst nach dem Online-Gang testen.

## Ablauf und Veröffentlichung

- Branch `feat/level-6-7` (angelegt). Kleine Commits, Conventional Commits auf Englisch.
- Online (Merge in `main` + Push) erst nach Marius' OK, weil das Repo öffentlich ist.
- Danach bekommt Marius den geheimen Link zum Weiterschicken.

## Nicht Teil davon

- Neue Hindernis-Arten, neue Bewegungsarten, Doppelsprung, Halten-für-höher.
- Versuchs-Zähler, Texte, ungarische Wörter, neue Musik oder Töne.
- Andere Würstel (z. B. rote Paprikawurst), anderes Halstuch für Frankie.
- Eigene ungarische Siegesfeier, Änderungen an Level 1–5 oder am Vorschaubild.

## Offene Punkte

- Die Startwerte der Schwierigkeit sind geschätzt. Ob Level 7 für Erwachsene „extrem“ ist, zeigt erst Marius' eigener Test.
- Ob `gap-farm` und `gap-forest` mit den neuen Hügeln farblich gut aussehen, zeigt erst der Screenshot. Falls nicht, darf der Boden der neuen Welten eine eigene Kachel in passender Farbe bekommen. Das bleibt Hintergrund und damit im Rahmen.
