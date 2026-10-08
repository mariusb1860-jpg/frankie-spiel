# Frankie sammelt Würstel

Ein kleines Jump'n'Run für Kinder ab 3 Jahren. Frankie, die Englische Bulldogge, läuft durch den Garten, sammelt Würstel und frisst sie am Ende in ihrer Hütte auf.

- Steuerung: irgendwo tippen, Leertaste oder Pfeil hoch = springen.
- Wer an ein Hindernis stößt, fängt das Level von vorn an.
- Läuft im Browser auf Handy, Tablet und PC. Handy bitte quer halten.

## Lokal starten

```bash
python -m http.server 8137
```

Dann im Browser `http://localhost:8137` öffnen. (Ein Doppelklick auf `index.html` reicht nicht, weil der Browser die Programmteile dann nicht lädt.)

## Anpassen

Alle Stellschrauben stehen in `src/config.js`: Tempo, Sprunghöhe, Levellänge, Fellfarbe, Halsband und wo welche Würstel und Hindernisse liegen.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html`, `style.css` | Seite, Vollbild, Hinweis „Handy drehen“ |
| `lib/phaser.min.js` | Spiel-Bibliothek Phaser 3.90.0 |
| `src/config.js` | Alle Einstellungen und das Level-Layout |
| `src/level.js` | Macht aus dem Layout konkrete Würstel und Hindernisse |
| `src/art/` | Frankie und die Welt, mit Code gezeichnet (SVG und Phaser-Graphics) |
| `preview.html` | Zeigt alle Zeichnungen groß, zum Begutachten |
| `src/audio/sfx.js` | Töne, mit Code erzeugt |
| `src/scenes/` | Startbild, Level, Futterszene |

Design und Ideen für später: `docs/spec.md`.
