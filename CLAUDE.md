# CLAUDE.md – Franky sammelt Würstel

Kleines 2D-Jump'n'Run für ein Kind (3–5 Jahre). Franky, eine Französische Bulldogge (rehbraun, siehe `docs/spec.md`), sammelt Würstel und frisst sie am Ende. Design und Level-Plan: `docs/spec.md`.

## Regeln für das Spiel

- Zielgruppe 3–5 Jahre: keine Texte, die man lesen muss. Symbole statt Wörter.
- **Level 1 ist fertig und wird nicht mehr verändert** (Layout, Tempo, Trefferflächen; Wunsch von Marius, 2026-10-08). Optik-Änderungen, die alle Level betreffen, nur nach Rückfrage.
- Hindernis berührt oder in eine Lücke gefallen = kurz benommen, dann startet dieses Level von vorn. Sonst keine Strafe.
- Schwierigkeit steigt von Level zu Level (Tempo, mehr/neue Hindernisse, Lücken, Blöcke), bleibt aber kindgerecht: Trefferflächen kleiner als die Bilder, hoher und langer Sprung. Nach jeder Änderung die Sprung-Zeitfenster messen (siehe unten).
- **Level 6 bis 10 sind für Erwachsene** und nur über den Paprika-Knopf unten auf dem Startbild erreichbar (seit 28.10.2026; vorher geheimer Link `?paprika`, den es nicht mehr gibt: Marius will nur noch einen Link). Auf dem Startbild der Erwachsenen führt der Kind-Knopf zurück zu 1–5. Welcher Teil gezeigt wird, steht nur im Speicher (`src/mode.js`): Jeder Aufruf des Links beginnt mit den Kinder-Leveln. Jedes ist schwerer als das vorige (Tempo, kürzere Luftzeit, mehr Gefahren, mehr enge Stellen). Die Trefferflächen sind dieselben wie in Level 1–5 (gemeinsame `OBSTACLE_TYPES`). Die 0,35-s-Regel ist dort ersetzt durch die Untergrenzen **0,18 s** (Level 6) und **0,10 s** (Level 7–10; gemessen ≥ 0,105 s wegen Messrauschen), in jeder Phase und bei jedem Ketten-Übergang. Blöcke müssen auch bei 30 fps erreichbar bleiben (Scheitel v²/2g − v/60 ≥ 133 px). Fortschritt der Erwachsenen-Level liegt getrennt (`frankie-unlocked-paprika`). Neue Bilder nur im Hintergrund; Hindernisse, Blöcke und Wasser bleiben die vorhandenen.
- **Level 11 bis 15 sind bayerische Level für Erwachsene** (seit 29.10.2026, Wunsch von Marius) hinter dem Breze-Knopf. Schwierigkeit **zwischen Level 6 und 7, nicht darüber** (Marius: 8–10 sind schon sehr schwer): Level 11 etwa wie Level 6, dann sanft steigend bis knapp unter Level 7. Untergrenzen der Sprung-Fenster: 0,18 / 0,16 / 0,15 / 0,14 / 0,13 s (Level 11 bis 15), gemessen jeweils 5 ms darüber. Hier gibt es vier eigene Hindernisse (`src/art/bavaria.js`): Maßkrug (steht), Bierfass (rollt entgegen), Dackel (läuft) und Murmeltier (hüpft). Hase, Krabbe und ab Level 14 das Huhn sind bei diesem Tempo zu knapp (gemessen) und kommen nicht vor. Fortschritt getrennt (`frankie-unlocked-bayern`). Die Würstel bleiben die normalen (Marius: Weißwürste wären auf hellem Grund schlecht zu sehen).
- Unten auf dem Startbild stehen immer zwei Knöpfe für die anderen beiden Teile, in der Reihenfolge Kind, Paprika, Breze (`src/mode.js`: `kids`, `paprika`, `bayern`).
- Jedes Level: gleiche Länge (`CONFIG.levelLength`), genau 20 Würstel, alle erreichbar.
- Lesbarkeit: Alles, was man berühren kann, hat einen kräftigen dunklen Umriss (`OUTLINE`) und einen Schatten; Hintergrund hat weiche Umrisse und liegt hinter dem Dunstschleier. Hintergrund-Deko darf nicht wie ein Hindernis aussehen.
- Ein-Knopf-Steuerung: Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
- Große Figuren und große Tippflächen (Tablet und Handy).
- Grafik und Sound nur per Code (`src/art/`, `src/audio/`). Keine Bild- oder Sounddateien. Detailreiches als SVG-Code, einfache Formen als Phaser-Graphics. Die Landschaft soll so detailreich sein wie Franky. Einzige Ausnahme: `share.jpg`, das Vorschaubild für Links in WhatsApp & Co. (Messenger zeigen kein SVG; das Spiel selbst benutzt es nicht).
- Grafik ansehen ohne zu spielen: `http://localhost:8137/preview.html` (`?zoom=3` für größer, `?set=beach` nur eine Gruppe: frankie, world, scenery, forest, beach, farm, winter, party, puszta, budapest, balaton, tokaj, visegrad, bavaria, muenchen, alm, koenigssee, neuschwanstein, wiesn).
- Bewegte Tiere und Bälle (laufen, rollen, hüpfen) brauchen in **jeder** Phase ihrer Bewegung ein Sprung-Fenster von mindestens 0,35 s. Am knappsten ist es, wenn das Tier von Franky weg läuft. Das gilt seit 08.10. auch für den Igel in Level 2: Auf Wunsch von Marius ist seine Trefferfläche kleiner (vorher im ungünstigsten Fall nur ca. 0,28 s).

## Aufbau

- `src/config.js`: allgemeine Werte (Sprung, Schwerkraft, Fellfarben).
- `src/levels.js`: alle Level (Welt, Tempo, Layout). Neues Level = neuer Eintrag mit Welt aus `src/worlds.js`. Optional pro Level: `jump` (`velocity`, `gravity`) und `animalSpeed` (Faktor für das Tempo laufender, rollender und hüpfender Tiere). `shownLevels()` sagt, welche Level das Startbild zeigt (1–5, nach dem Paprika-Knopf 6–10, nach dem Breze-Knopf 11–15; `src/mode.js`), `isFinale(n)`, nach welchem Level die Siegesfeier kommt (5, 10 bzw. 15), `starLevels(n)`, welche Sterne sie zeigt (nach 15 nur die fünf bayerischen).
- `src/worlds.js`: Welten mit Zonen und Deko, Lücken- und Block-Aussehen.
- `src/level.js` macht aus dem Layout konkrete Positionen, `src/course.js` baut daraus Boden, Lücken, Blöcke, Würstel und Hindernisse (inkl. Trefferflächen und Bewegung in `OBSTACLE_TYPES`: `patrol` = hin und her laufen, `roll` = Franky entgegenrollen, `hop` = hüpfen).
- `src/art/<welt>.js`: Zeichnungen pro Welt (`scenery.js` = Garten/Wiese/Dorf, `forest.js` = Wald, `beach.js` = Strand, `farm.js` = Bauernhof, `winter.js` = Winter, `party.js` = Siegesfeier, `puszta.js`, `budapest.js`, `balaton.js`, `tokaj.js` und `visegrad.js` = Level 6 bis 10, `bavaria.js` (bayerische Hindernisse, Wimpel), `muenchen.js`, `alm.js`, `koenigssee.js`, `neuschwanstein.js` und `wiesn.js` = Level 11 bis 15; beide Gruppen erst beim ersten Druck auf ihren Knopf geladen: `BootScene` startet dann noch einmal mit `{ artOnly: true }`, siehe `MODE_ART`). In `BootScene` vorladen und in `preview.html` eintragen.
- `tools/`: `test-helpers.js` (Test-Helfer `window.T`: Bot, Mess-Läufe, Sprungprofil, Startbild-Knöpfe) und `nocache_server.py` (Server ohne Browser-Cache).
- `src/scenes/`: Startbild, Level, Futterszene, Siegesfeier nach dem letzten Level (`VictoryScene`).
- `src/progress.js`: freigeschaltete Level (Browser-Speicher).

## Technik

- Phaser 3.90.0 liegt fest in `lib/phaser.min.js`. Kein Build, kein npm.
- ES-Module ohne Bundler. Die Seite braucht einen lokalen Server: `python -m http.server 8137` im Projektordner, dann `http://localhost:8137`.
- URL-Parameter: `?fast=1` kurze Level (Tests), `?debug=1` zeigt Physik-Rahmen, `?alle=1` öffnet alle gebauten Level. Level 6 bis 15 haben keine eigene Adresse; in Tests vorher `await T.mode('paprika')` bzw. `await T.mode('bayern')` (wie der Knopf; `T.grownUps()` = Paprika). Tasten: die Ziffer, auf die das Level endet (0 = Level 10, im Bayern-Startbild 1–5 = Level 11–15).
- `window.game` ist für automatische Browser-Tests freigegeben.
- Physik mit `fixedStep: false` (sonst Ruckeln auf 59-Hz-Bildschirmen).
- Code, Kommentare und Commits auf Englisch. Spieltexte (wenige) auf Deutsch.
- Das Spiel hieß bis 28.10.2026 „Frankie“. Sichtbar heißt es jetzt Franky (Titel, Hüttenschild, Seite, Link). Interne Namen bleiben `frankie` (Texturen `frankie-*`, `src/art/frankie.js`, Variablen, Kommentare) und vor allem die Speicher-Schlüssel `frankie-unlocked…`: Ändert man sie, ist der Spielstand weg.

## Online (GitHub Pages)

- Adresse: https://mariusb1860-jpg.github.io/franky/ (öffentliches Repo `mariusb1860-jpg/franky`, Pages aus `main`, Ordner `/`).
- Arbeitsweise: Feature-Branch → lokal in `main` mergen → pushen. Jeder Push auf `main` ist nach ca. 1 Minute online. Pushen nur nach OK von Marius.
- GitHub Pages lässt Browser Dateien bis zu 10 Minuten zwischenspeichern: Nach einem Update kann kurz noch der alte Stand kommen.
- `.nojekyll` nicht löschen: Damit liefert GitHub die Dateien unverändert aus.
- Link-Vorschau: Meta-Tags `og:*` in `index.html` mit absoluten Adressen. `share.jpg` (1200×630, JPEG unter 300 KB) ist ein Screenshot des Startbilds mit `?alle=1` (bei 960×540 aufgenommen, oben und unten je 18 px abgeschnitten, auf 1200×630 vergrößert); neu machen, wenn sich das Startbild deutlich ändert.
- Pfade immer relativ und mit exakter Groß-/Kleinschreibung: Der Server von GitHub unterscheidet sie, Windows nicht.

## Prüfen vor „fertig“

Mit Playwright (Browser-Tab vorher nach vorne holen, sonst drosselt Chrome die Bildrate):
1. Seite laden, keine Konsolenfehler.
2. Mit `?fast=1`: Level wählen → Level → Futterszene → „Nochmal“ und „Weiter“ funktionieren. Nach Level 5 (bei Paprika nach Level 10, bei der Breze nach Level 15) beginnt die Siegesfeier von selbst, ihr Haus-Knopf führt zur Level-Auswahl.
3. Sprung-Zeitfenster messen: Franky vor ein Hindernis/eine Lücke setzen, bei verschiedenen Abständen springen lassen, Erfolg zählen. Bei bewegten Hindernissen in Millisekunden messen (Sprung x ms nachdem das Hindernis näher als 400 px ist) und mehrere Bewegungs-Phasen prüfen (`patrol.seek(ms)` bzw. `hopStart` verschieben). Jedes Level muss mit einem Bot (springt vor hohen Würsteln, Hindernissen, Lücken und Blöcken) ohne Unfall durchlaufen und alle 20 Würstel sammeln.
4. Screenshots am PC (960×540) und als Handy quer (844×390, Touch) ansehen.
5. Zum Testen einen Server ohne Browser-Cache benutzen (oder den Cache abschalten): `python -m http.server` erlaubt dem Browser, alte Programmteile zu behalten. Dafür gibt es `tools/nocache_server.py`: `python -I tools/nocache_server.py . 8138`.
6. Test-Helfer laden: `await page.addScriptTag({ url: '/tools/test-helpers.js' })`, danach gibt es `window.T` (z. B. `T.bot(2, { d: { hedgehog: 130 } })`, `T.startButtons()`). Der erste Level-Start nach dem Laden hat einen Bildraten-Einbruch: den ersten Lauf nicht werten.
