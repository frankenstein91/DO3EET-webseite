+++
title = 'Code-Darstellung auf neuem Level: bat und delta im Terminal'
date = "2026-06-16T10:38:34+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Terminal",
    "Git",
    "Rust",
    "Software",
]
+++

Wer viel auf der Konsole arbeitet, kennt die Klassiker: `cat` zum schnellen Anschauen von Dateien und `git diff` zur Überprüfung von Code-Änderungen. Beide erfüllen ihren Zweck seit Jahrzehnten, sind aber optisch in der Zeit stehengeblieben. Gestern habe ich zwei moderne CLI-Tools entdeckt und direkt auf meinem System installiert, die diese Klassiker ablösen: **bat** und **delta**. 

Beide Tools sind in Rust geschrieben, extrem performant und heben die Darstellung von Code auf ein völlig neues Niveau. Hier ist meine Tool-Vorstellung und wie ich sie nahtlos in meine Zsh und Git-Konfiguration integriert habe.

<!--more-->

## 🦇 bat: Der cat-Klon auf Steroiden

`bat` versteht sich als moderner Ersatz für den Standardbefehl `cat`. Während `cat` Dateien einfach als rohen Text auf das Terminal wirft, glänzt `bat` mit einer Reihe von Komfort-Features:

- **Syntax-Highlighting:** Unterstützt eine riesige Anzahl von Programmier- und Konfigurationssprachen von Haus aus.
- **Git-Integration:** Zeigt im linken Rand (Gutter) direkt an, welche Zeilen gegenüber dem letzten Git-Commit hinzugefügt (`+`), verändert (`~`) oder gelöscht (`-`) wurden.
- **Zeilennummern:** Macht das Lesen und Kommunizieren über Codezeilen deutlich einfacher.
- **Automatische Paging-Steuerung:** Wenn eine Datei länger als der Bildschirm ist, leitet `bat` die Ausgabe automatisch an einen Pager (wie `less`) weiter, sodass man bequem scrollen und suchen kann.

Ein einfacher Aufruf genügt:
```bash
bat index.de.md
```

---

## 📐 delta: Perfekte Diffs für Git

Wer regelmäßig Code reviewt oder eigene Änderungen vergleicht, stolpert über `git diff`. Die Standardausgabe ist funktional, aber gerade bei komplexen Änderungen unübersichtlich. Hier kommt `delta` (auch bekannt als `git-delta`) ins Spiel.

`delta` fungiert als Pager für Git-Ausgaben. Es liest die Standard-Diffs ein und bereitet sie visuell auf:

- **Hervorhebung innerhalb der Zeilen (Word-level diffs):** Es hebt nicht nur die geänderten Zeilen hervor, sondern markiert die genauen Worte, die sich geändert haben, farblich intensiver.
- **Syntax-Highlighting in Diffs:** Auch im Diff wird der Code farbig passend zur Programmiersprache dargestellt.
- **Zeilennummern & Side-by-Side View:** Unterstützt das Anzeigen von Diffs in zwei Spalten (Nebeneinander) sowie saubere Zeilennummern-Spalten für Alt und Neu.

### Meine Git-Konfiguration

Ich habe `delta` direkt global in meiner `~/.gitconfig` verankert:

```ini
[core]
	pager = delta
[interactive]
	diffFilter = delta --color-only
[delta]
	navigate = true
	light = false
	line-numbers = true
[merge]
	conflictstyle = zdiff3
```

**Was bedeuten diese Einstellungen im Einzelnen?**

1. **`core.pager = delta`**: Leitet alle Git-Ausgaben (wie `git diff` oder `git log`) standardmäßig durch `delta`.
2. **`interactive.diffFilter = delta --color-only`**: Sorgt dafür, dass auch beim interaktiven Hinzufügen von Änderungen (`git add -p`) die schöne farbige Formatierung erhalten bleibt.
3. **`delta.navigate = true`**: Ermöglicht es, im Pager mit den Tasten `n` und `N` direkt von einem geänderten Code-Block (Hunk) zum nächsten zu springen.
4. **`delta.light = false`**: Passt das Farbschema an ein dunkles Terminal-Theme an.
5. **`delta.line-numbers = true`**: Aktiviert die klassischen Zeilennummern im Diff-Output, was die Orientierung ungemein erleichtert.
6. **`merge.conflictstyle = zdiff3`**: Dies ist eine modernere Variante der Git-Konfliktanzeige. Sie zeigt im Konfliktfall neben den eigenen und fremden Änderungen auch den gemeinsamen Ursprungszustand an. `delta` formatiert diese dreiteiligen Konflikte hervorragend und macht die Konfliktlösung deutlich stressfreier.

---

## 🐚 Zsh-Integration: Smartes Overriding für cat und diff

Aliase wie `alias cat="bat"` können in Shell-Pipelines zu Problemen führen, da Tools, die den Input von `cat` verarbeiten, oft nicht mit den Steuerzeichen für Farben und Zeilennummern umgehen können. Meine Lösung dafür ist das dynamische Laden von benutzerdefinierten Zsh-Funktionen (über `autoload` in der `~/.zshrc`).

### 1. Intelligentes `cat`
Meine Zsh-Funktion `cat` prüft über `[[ -t 1 ]]`, ob die Ausgabe direkt an ein Terminal (TTY) gerichtet ist. Nur dann wird `bat` geladen. In Pipelines (z. B. `cat datei.txt | grep ...`) fällt sie automatisch auf das klassische `cat` zurück:

```zsh
if [[ -t 1 ]] && command -v bat >/dev/null 2>&1; then
    bat "$@"
else
    command cat "$@"
fi
```

### 2. Side-by-Side `diff`
Ähnlich verhält es sich mit dem Befehl `diff`. Rufe ich ihn direkt im Terminal auf, nutzt die Funktion automatisch die geniale Side-by-Side-Ansicht von `delta`. Bei Skripten oder Pipes greift sie auf das normale GNU `diff` zurück:

```zsh
if [[ -t 1 ]] && command -v delta >/dev/null 2>&1; then
    delta --side-by-side "$@"
else
    command diff "$@"
fi
```

---

## 🌐 HTML-Diffs auf Knopfdruck: `htmldiff`

Als praktisches Addon nutze ich eine Zsh-Funktion namens `htmldiff`. Sie erzeugt aus zwei beliebigen Dateien einen farbigen, zweispaltigen HTML-Vergleich und speichert diesen als Datei (ideal, um Diffs per E-Mail zu teilen oder im Browser zu archivieren). 

Dazu kombiniert sie `delta` mit dem Tool `ansifilter`:

```zsh
# Zsh-Funktion: htmldiff
# Erstellt einen farbigen HTML-Diff von zwei Dateien mittels delta und ansifilter.
local fileA="$1"
local fileB="$2"

# ... (Prüfungen auf Existenz der Dateien und Tools) ...

local timestamp
zmodload zsh/datetime
strftime -s timestamp "%Y%m%d%H%M%S"

local nameA="${fileA:t}"
local nameB="${fileB:t}"
local outfile="${nameA}_${nameB}_diff_${timestamp}.html"

# Diff mit delta erstellen und über ansifilter als HTML speichern
delta -s --light --no-gitconfig --file-decoration-style blue --hunk-header-decoration-style blue "$fileA" "$fileB" | ansifilter --html --encoding=utf-8 > "$outfile"
```

Das `--light` Flag sorgt hierbei dafür, dass das HTML im Browser (der standardmäßig einen hellen Hintergrund hat) perfekt lesbar ist.

---

## Fazit: Lohnt sich der Wechsel?

Definitiv. Wer viel Zeit im Terminal verbringt, profitiert enorm von der besseren Lesbarkeit. Da sowohl `bat` als auch `delta` in Rust geschrieben sind, gibt es keine spürbare Verzögerung beim Aufruf – die Tools fühlen sich genauso schnell an wie ihre jahrzehntealten Vorgänger, bieten aber dank der Zsh-Wrapper den Komfort einer modernen IDE direkt auf der Kommandozeile, ohne alte Pipelines zu brechen.

Nutzt ihr auch bereits moderne Alternativen zu den klassischen Unix-Tools? Schreibt es mir gern in die Kommentare!

73 de DO3EET
