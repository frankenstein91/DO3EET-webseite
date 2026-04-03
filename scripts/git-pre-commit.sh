#!/bin/bash

# --- Git Hook: DO3EET-webseite Pre-Commit Helper ---

# 1. VERHINDERE BILD-DATEIEN (R2-Check)
IMAGE_EXTENSIONS="jpg|jpeg|png|webp|gif|bmp|tiff"
STAGED_IMAGES=$(git diff --cached --name-only --diff-filter=A | grep -Ei "\.($IMAGE_EXTENSIONS)$")
STAGED_IMAGES=$(echo "$STAGED_IMAGES" | grep -v "favicon.ico")

if [ -n "$STAGED_IMAGES" ]; then
    echo -e "\033[0;31m[ERROR]\033[0m Du versuchst, Bilddateien zu committen:"
    echo "$STAGED_IMAGES" | sed 's/^/  - /'
    echo ""
    echo "Bilder sollen auf Cloudflare R2 ausgelagert werden!"
    echo "1. Lade das Bild auf R2 hoch."
    echo "2. Nutze den Shortcode {{< imgwebp src=\"https://...\" ... >}} im Blogpost."
    echo "3. Entferne das lokale Bild aus dem Staging (git reset <datei>)."
    echo ""
    echo "Falls du es wirklich DRINGEND im Repo brauchst: 'git commit --no-verify'"
    exit 1
fi

# 2. AUTOMATISCHES DATUM FÜR NEUE POSTS (mit date.lock Override)
# Wir suchen nach neuen Markdown-Dateien in content/post/
NEW_POSTS=$(git diff --cached --name-only --diff-filter=A | grep -E "^content/post/.*\.md$")

if [ -n "$NEW_POSTS" ]; then
    # Aktuelles Datum im Hugo-Format: 2024-04-03T14:30:00+02:00
    CURRENT_DATE=$(date +"%Y-%m-%dT%H:%M:%S%:z")
    
    echo -e "\033[0;32m[INFO]\033[0m Neue Posts erkannt..."
    
    for FILE in $NEW_POSTS; do
        # Prüfe, ob eine 'date.lock' Datei im selben Verzeichnis liegt
        DIR=$(dirname "$FILE")
        if [ -f "$DIR/date.lock" ]; then
            echo "  - [LOCK] Datum beibehalten (date.lock gefunden) in: $FILE"
            continue
        fi

        # Prüfe ob 'date =' (TOML) oder 'date:' (YAML) vorhanden ist
        if grep -q "date =" "$FILE" || grep -q "date:" "$FILE"; then
            # Ersetze das Datum (unterstützt TOML und YAML Formate)
            # Nutzt '|' als Trenner für sed, da im Datum ':' vorkommt
            sed -i "s|^\(date[[:space:]]*[:=][[:space:]]*\).*|\1\"$CURRENT_DATE\"|" "$FILE"
            # Da wir die Datei im Hook geändert haben, müssen wir sie neu 'adden'
            git add "$FILE"
            echo "  - [OK] Datum aktualisiert in: $FILE"
        fi
    done
fi

exit 0
