# Frankie sammelt Würstel

Ein kleines Jump'n'Run für Kinder ab 3 Jahren. Frankie, die Französische Bulldogge, läuft durch Garten, Wald, Strand, Bauernhof und Winter, sammelt Würstel und frisst sie am Ende vor ihrer Hütte auf. Nach dem fünften Level gibt es eine große Siegesfeier.

**Spielen:** https://mariusb1860-jpg.github.io/frankie-spiel/

- Steuerung: irgendwo tippen, Leertaste oder Pfeil hoch = springen.
- Wer an ein Hindernis stößt oder ins Wasser fällt, fängt das Level von vorn an.
- Im Startbild wählt man das Level; geschaffte Level schalten das nächste frei.
- Läuft im Browser auf Handy, Tablet und PC. Handy bitte quer halten.

## Lokal starten

```bash
python -m http.server 8137
```

Dann im Browser `http://localhost:8137` öffnen. (Ein Doppelklick auf `index.html` reicht nicht, weil der Browser die Programmteile dann nicht lädt.)
Alle Level zum Ausprobieren freischalten: `http://localhost:8137/?alle=1`.

## Anpassen

- `src/config.js`: Sprunghöhe, Levellänge, Fellfarbe, Halsband, Halstuch.
- `src/levels.js`: Tempo und Ablauf jedes Levels (wo welche Würstel, Hindernisse, Bäche und Blöcke liegen).
- `src/worlds.js`: welche Landschaft in welchem Level.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html`, `style.css` | Seite, Vollbild, Hinweis „Handy drehen“, Link-Vorschau für Messenger |
| `share.jpg` | Vorschaubild, wenn man den Link z. B. per WhatsApp schickt (Screenshot des Startbilds) |
| `.nojekyll` | Sorgt dafür, dass GitHub Pages alle Dateien unverändert ausliefert |
| `lib/phaser.min.js` | Spiel-Bibliothek Phaser 3.90.0 |
| `src/config.js` | Allgemeine Einstellungen |
| `src/levels.js` | Die Level |
| `src/worlds.js` | Die Welten (Garten, Wald, Strand, Bauernhof, Winter) |
| `src/level.js`, `src/course.js` | Machen aus dem Level-Ablauf Boden, Bäche, Blöcke, Würstel und Hindernisse |
| `src/backdrop.js` | Baut die Landschaft mit Dunstschleier und Parallax |
| `src/progress.js` | Merkt sich freigeschaltete Level |
| `src/art/` | Frankie, Würstel, Hindernisse und Landschaft, mit Code gezeichnet (SVG und Phaser-Graphics); `puszta.js`, `budapest.js`, `balaton.js`, `tokaj.js` und `visegrad.js` sind Zusatz-Welten, die nur in besonderen Fällen geladen werden |
| `tools/` | Hilfen zum Testen: Browser-Helfer `test-helpers.js` und Server ohne Cache `nocache_server.py` |
| `preview.html` | Zeigt alle Zeichnungen groß, zum Begutachten |
| `src/audio/sfx.js` | Töne, mit Code erzeugt |
| `src/scenes/` | Startbild mit Level-Auswahl, Level, Futterszene, Siegesfeier |

Design und Ideen für später: `docs/spec.md`.
