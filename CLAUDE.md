# CLAUDE.md – Frankie sammelt Würstel

Kleines 2D-Jump'n'Run für ein Kind (3–5 Jahre). Frankie, eine Französische Bulldogge (rehbraun, siehe `docs/spec.md`), sammelt Würstel und frisst sie am Ende. Design und Level-Plan: `docs/spec.md`.

## Regeln für das Spiel

- Zielgruppe 3–5 Jahre: keine Texte, die man lesen muss. Symbole statt Wörter.
- **Level 1 ist fertig und wird nicht mehr verändert** (Layout, Tempo, Trefferflächen; Wunsch von Marius, 2026-10-08). Optik-Änderungen, die alle Level betreffen, nur nach Rückfrage.
- Hindernis berührt oder in eine Lücke gefallen = kurz benommen, dann startet dieses Level von vorn. Sonst keine Strafe.
- Schwierigkeit steigt von Level zu Level (Tempo, mehr/neue Hindernisse, Lücken, Blöcke), bleibt aber kindgerecht: Trefferflächen kleiner als die Bilder, hoher und langer Sprung. Nach jeder Änderung die Sprung-Zeitfenster messen (siehe unten).
- Jedes Level: gleiche Länge (`CONFIG.levelLength`), genau 20 Würstel, alle erreichbar.
- Lesbarkeit: Alles, was man berühren kann, hat einen kräftigen dunklen Umriss (`OUTLINE`) und einen Schatten; Hintergrund hat weiche Umrisse und liegt hinter dem Dunstschleier. Hintergrund-Deko darf nicht wie ein Hindernis aussehen.
- Ein-Knopf-Steuerung: Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
- Große Figuren und große Tippflächen (Tablet und Handy).
- Grafik und Sound nur per Code (`src/art/`, `src/audio/`). Keine Bild- oder Sounddateien. Detailreiches als SVG-Code, einfache Formen als Phaser-Graphics. Die Landschaft soll so detailreich sein wie Frankie.
- Grafik ansehen ohne zu spielen: `http://localhost:8137/preview.html` (`?zoom=3` für größer, `?set=beach` nur eine Gruppe: frankie, world, scenery, forest, beach, farm, winter, party).
- Bewegte Tiere und Bälle (laufen, rollen, hüpfen) brauchen in **jeder** Phase ihrer Bewegung ein Sprung-Fenster von mindestens 0,35 s. Am knappsten ist es, wenn das Tier von Frankie weg läuft.

## Aufbau

- `src/config.js`: allgemeine Werte (Sprung, Schwerkraft, Fellfarben).
- `src/levels.js`: alle Level (Welt, Tempo, Layout). Neues Level = neuer Eintrag mit Welt aus `src/worlds.js`.
- `src/worlds.js`: Welten mit Zonen und Deko, Lücken- und Block-Aussehen.
- `src/level.js` macht aus dem Layout konkrete Positionen, `src/course.js` baut daraus Boden, Lücken, Blöcke, Würstel und Hindernisse (inkl. Trefferflächen und Bewegung in `OBSTACLE_TYPES`: `patrol` = hin und her laufen, `roll` = Frankie entgegenrollen, `hop` = hüpfen).
- `src/art/<welt>.js`: Zeichnungen pro Welt (`scenery.js` = Garten/Wiese/Dorf, `forest.js` = Wald, `beach.js` = Strand, `farm.js` = Bauernhof, `winter.js` = Winter, `party.js` = Siegesfeier). In `BootScene` vorladen und in `preview.html` eintragen.
- `src/scenes/`: Startbild, Level, Futterszene, Siegesfeier nach dem letzten Level (`VictoryScene`).
- `src/progress.js`: freigeschaltete Level (Browser-Speicher).

## Technik

- Phaser 3.90.0 liegt fest in `lib/phaser.min.js`. Kein Build, kein npm.
- ES-Module ohne Bundler. Die Seite braucht einen lokalen Server: `python -m http.server 8137` im Projektordner, dann `http://localhost:8137`.
- URL-Parameter: `?fast=1` kurze Level (Tests), `?debug=1` zeigt Physik-Rahmen, `?alle=1` öffnet alle gebauten Level.
- `window.game` ist für automatische Browser-Tests freigegeben.
- Physik mit `fixedStep: false` (sonst Ruckeln auf 59-Hz-Bildschirmen).
- Code, Kommentare und Commits auf Englisch. Spieltexte (wenige) auf Deutsch.

## Prüfen vor „fertig“

Mit Playwright (Browser-Tab vorher nach vorne holen, sonst drosselt Chrome die Bildrate):
1. Seite laden, keine Konsolenfehler.
2. Mit `?fast=1`: Level wählen → Level → Futterszene → „Nochmal“ und „Weiter“ funktionieren.
3. Sprung-Zeitfenster messen: Frankie vor ein Hindernis/eine Lücke setzen, bei verschiedenen Abständen springen lassen, Erfolg zählen. Bei bewegten Hindernissen in Millisekunden messen (Sprung x ms nachdem das Hindernis näher als 400 px ist) und mehrere Bewegungs-Phasen prüfen (`patrol.seek(ms)` bzw. `hopStart` verschieben). Jedes Level muss mit einem Bot (springt vor hohen Würsteln, Hindernissen, Lücken und Blöcken) ohne Unfall durchlaufen und alle 20 Würstel sammeln.
4. Screenshots am PC (960×540) und als Handy quer (844×390, Touch) ansehen.
5. Zum Testen einen Server ohne Browser-Cache benutzen (oder den Cache abschalten): `python -m http.server` erlaubt dem Browser, alte Programmteile zu behalten.
