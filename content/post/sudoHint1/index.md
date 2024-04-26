+++
title = 'Linux sudo Tipp für Umsteiger'
date = 2024-04-26T21:52:52+02:00
draft = false
tags = [
    "Linux",
    "Security",
]
+++

Wer von Windows auf Linux umsteigt, wird schnell auf den Befehl `sudo` stoßen. Dieser Befehl steht für "superuser do"... Übersetzt "Admin mach".
Häufig muss man bei der Nutzung des Befehls sein Passwort eingeben. Bei der Eingabe wird einem gleich auffallen, dass man kein Eingabefeedback in Form von Sternen wie bei Windows bekommt.

Wer das gern ändern möchte, kann mit `sudo visudo` die Config-Datei öffnen. Man sollte diese nie direkt mit dem Editor bearbeiten. Die Verwendung von `visudo` bietet im Vergleich zur direkten Bearbeitung der sudoers-Datei mit einem Editor höhere Sicherheit und mehr Komfort. In dieser Datei muss man die Zeile `Defaults pwfeedback` ergänzen. Um in vi einen Text eingeben zu können, muss man mit `i` in den Input-Modus. Nach dem Ändern der Datei drückt man die **ESC** Taste und gibt dem Editor den Befehl `:wq` zum Speichern und Beenden.