#!/bin/bash

# --- Script to install git hooks ---
# This script copies/links the project's git hooks from the repository 
# into the local .git/hooks directory.

HOOK_SOURCE="scripts/git-pre-commit.sh"
HOOK_TARGET=".git/hooks/pre-commit"

if [ ! -d ".git" ]; then
    echo "[ERROR] Dieses Script muss im Wurzelverzeichnis des Repositories ausgeführt werden."
    exit 1
fi

echo "[INFO] Installiere Git Hooks..."

# Falls schon ein Hook existiert, sichern wir ihn (optional)
if [ -L "$HOOK_TARGET" ] || [ -f "$HOOK_TARGET" ]; then
    echo "[INFO] Vorheriger Hook wird gesichert..."
    mv "$HOOK_TARGET" "${HOOK_TARGET}.bak"
fi

# Erstelle einen symbolischen Link (besser als Kopieren, da Updates sofort aktiv sind)
ln -s "../../$HOOK_SOURCE" "$HOOK_TARGET"

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Git Hook (pre-commit) wurde erfolgreich installiert!"
    echo "         Er verhindert jetzt, dass du versehentlich Bilder ins Repo pushst."
else
    echo "[ERROR] Fehler beim Erstellen des Links."
    exit 1
fi

chmod +x .git/hooks/pre-commit
exit 0
