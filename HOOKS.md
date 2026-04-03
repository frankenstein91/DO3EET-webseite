# Git Hooks für dieses Projekt

Um das Repository klein zu halten und versehentliches Pushen von großen Bilddateien zu verhindern, nutzen wir einen **Git Hook**. Dieser verhindert, dass gängige Bildformate (jpg, png, webp, etc.) committet werden können.

## Was der Hook bewirkt
Wenn du versuchst, ein Bild zu committen, das **nicht** auf Cloudflare R2 ausgelagert wurde, bricht der `git commit` Vorgang mit einer Fehlermeldung ab. Du erhältst dann Anweisungen, wie du das Bild stattdessen einbinden solltest.

## Installation
Da Git-Hooks standardmäßig nicht versioniert werden (sie liegen im `.git` Ordner), musst du den Hook auf deiner Maschine einmalig aktivieren:

1. Öffne ein Terminal im Projekt-Wurzelverzeichnis.
2. Führe das Installations-Skript aus:
   ```bash
   ./scripts/install-hooks.sh
   ```

## Wie du Bilder stattdessen hinzufügst
1. Lade dein Bild auf Cloudflare R2 hoch (siehe [R2_MIGRATION_GUIDE.md](R2_MIGRATION_GUIDE.md)).
2. Nutze im Blogpost den `imgwebp` Shortcode mit der externen URL:
   ```markdown
   {{< imgwebp src="https://media.deine-domain.de/bild.jpg" ... >}}
   ```
3. Lösche das lokale Bild aus dem Projektverzeichnis.

## Ausnahmen (Notfall)
Falls du doch einmal ein Bild (z.B. ein Logo) zwingend ins Repo pushen musst, kannst du den Hook beim Commit umgehen:
```bash
git commit --no-verify -m "Zwingendes Bild hinzugefügt"
```
