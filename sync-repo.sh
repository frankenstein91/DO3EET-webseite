#!/bin/bash
# Dieses Skript setzt alle lokalen Tracking-Branches hart auf den Stand des Remotes zurück.
# WARNUNG: Alle ungespeicherten lokalen Änderungen gehen verloren!

echo "Dies wird alle deine lokalen Branches hart auf den Stand von 'origin' zurücksetzen."
read -p "Bist du sicher? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Abgebrochen."
    exit 1
fi

echo "Hole aktuelle Daten vom Server..."
git fetch --all --prune

# Ermittle den aktuellen Branch, um später dorthin zurückzukehren
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Gehe alle lokalen Branches durch
for branch in $(git for-each-ref --format='%(refname:short)' refs/heads/); do
    # Prüfe, ob ein Upstream-Branch existiert
    upstream=$(git rev-parse --abbrev-ref "$branch@{upstream}" 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "Setze '$branch' auf '$upstream' zurück..."
        git checkout "$branch" --quiet
        git reset --hard "$upstream"
    else
        echo "Überspringe '$branch' (kein Upstream gefunden)."
    fi
done

# Zurück zum ursprünglichen Branch
git checkout "$current_branch" --quiet
echo "Fertig! Deine lokale Historie entspricht nun dem Server."
