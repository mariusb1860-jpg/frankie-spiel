# CLAUDE.md – Frankie sammelt Würstel

Kleines 2D-Jump'n'Run für ein Kind (3–5 Jahre). Frankie, eine Englische Bulldogge, sammelt Würstel und frisst sie am Ende. Design: `docs/spec.md`.

## Regeln für das Spiel

- Zielgruppe 3–5 Jahre: keine Texte, die man lesen muss. Symbole statt Wörter.
- Kein Game Over, keine Strafe. Hindernisse lassen Frankie nur kurz stolpern.
- Ein-Knopf-Steuerung: Tippen irgendwo / Leertaste / Pfeil hoch = Springen.
- Große Figuren und große Tippflächen (Tablet und Handy).
- Grafik und Sound nur per Code (`src/art/`, `src/audio/`). Keine Bild- oder Sounddateien.
- Zahlenwerte (Tempo, Sprung, Levellänge, Fellfarbe, Level-Layout) nur in `src/config.js` ändern.

## Technik

- Phaser 3.90.0 liegt fest in `lib/phaser.min.js`. Kein Build, kein npm.
- ES-Module ohne Bundler. Die Seite braucht einen lokalen Server: `python -m http.server 8137` im Projektordner, dann `http://localhost:8137`.
- URL-Parameter: `?fast=1` kurzes Level (Tests), `?debug=1` zeigt Physik-Rahmen.
- `window.game` ist für automatische Browser-Tests freigegeben.
- Code, Kommentare und Commits auf Englisch. Spieltexte (wenige) auf Deutsch.

## Prüfen vor „fertig“

Mit Playwright (Browser-Tab vorher nach vorne holen, sonst drosselt Chrome die Bildrate):
1. Seite laden, keine Konsolenfehler.
2. Mit `?fast=1`: Play → Level → Futterszene → „Nochmal“ führt wieder ins Level.
3. Screenshots am PC (960×540) und als Handy quer (844×390, Touch) ansehen.
