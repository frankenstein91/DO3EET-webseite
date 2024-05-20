+++
title = 'Datenbackup in die Cloud'
date = 2024-05-17T18:40:35+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Dateisystem",
    "Backup",
    "Cloud",
]
+++

Für mein Beispiel nutze ich eine neue frische ArchLinux VM. Mein Ziel ist es eine gute Startanleitung für ein sicheres Backup in die Cloud anzubieten. Natürlich nur nach bestem Wissen und Gewissen und ohne Garantie auf Richtigkeit. 

# Zugriff auf das AUR
Auch wenn der Zugriff auf das AUR[^1] auch ohne zusätliche Programme möglich ist, machen es Hilfsprogramme doch sehr leicht. Ich nutze gern [pikaur](https://github.com/actionless/pikaur), welches in Python geschrieben ist. Die Installation ist sehr leicht und geht mit wenigen Zeilen auf der Komandozeile.
```bash
sudo pacman -Sy --needed base-devel git pyalpm
git clone https://github.com/actionless/pikaur.git
cd pikaur
python3 ./pikaur.py -Sy pikaur
```
Der letzte Schritt installiert pikaur in das System. Dabei wird man gefragt ob man die Package Build Date bearbeiten/einsehen möchte... Das kann man in diesem fall mit "Nein" beantworten. Bei der Frage ob man die Installation fortsetzen möchte, ist "Ja" natürlich die richtige Antwort.
Danach kann man noch ein CleanUp mit diesen zwei Zeilen machen:
```bash
cd ..
rm -rf pikaur
```

# Google Drive Zugriff
Für de Zugriff auf die Cloud-Umgebung habe ich mich für das Projekt [rclone](https://rclone.org/) entschieden. Eigentlich wollte ich [google-drive-ocamlfuse](https://astrada.github.io/google-drive-ocamlfuse/) nutzen, bin aber bei der Installation immer wieder gescheitert.
Bei der Installation kommt pikaur gleich das erste Mal richtig zum Einsatz... 
```bash
pikaur -Sy rclone
```





[^1]: Arch User Repository
