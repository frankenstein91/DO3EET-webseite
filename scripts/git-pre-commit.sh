#!/bin/bash

# --- Git Hook: Verhindere Bild-Dateien in Commits ---
# Da Bilder auf Cloudflare R2 ausgelagert werden sollen (siehe R2_MIGRATION_GUIDE.md),
# blockiert dieser Hook alle gängigen Binär-Bildformate im Staging Area.

IMAGE_EXTENSIONS="jpg|jpeg|png|webp|gif|bmp|tiff"

# Hole Liste der neu hinzugefügten Dateien (Filter A = Added)
# Wir prüfen nur neu hinzugefügte Dateien, damit alte Bilder im Repo (falls vorhanden) 
# nicht blockieren, wenn man sie nur ändert.
STAGED_IMAGES=$(git diff --cached --name-only --diff-filter=A | grep -Ei "\.($IMAGE_EXTENSIONS)$")

# Ignoriere Favicon (oft im Repo gewünscht)
STAGED_IMAGES=$(echo "$STAGED_IMAGES" | grep -v "favicon.ico")

if [ -n "$STAGED_IMAGES" ]; then
    echo -e "\033[0;31m[ERROR]\033[0m Du versuchst, Bilddateien zu committen:"
    echo "$STAGED_IMAGES" | sed 's/^/  - /'
    echo ""
    echo "Bilder sollen auf Cloudflare R2 ausgelagert werden!"
    echo "1. Lade das Bild auf R2 hoch."
    echo "2. Nutze den Shortcode {{< imgwebp src=\"https://...\" ... >}} im Blogpost."
    echo "3. Entferne das lokale Bild aus dem Staging (git reset <datei>)."
    echo "4. Lösche die lokale Bilddatei oder verschiebe sie aus dem Projekt-Ordner."
    echo ""
    echo "Falls du es wirklich DRINGEND im Repo brauchst: 'git commit --no-verify'"
    exit 1
fi

exit 0
