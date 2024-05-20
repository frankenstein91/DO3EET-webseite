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
Für die Einrichtung der Verbindung zur Google Cloud braucht das System einen Browser. Es ist im Grunde egal welchen Browser man nutzt, ich habe für mein Beispiel Google Chrome mit `pikaur -Sy google-chrome` installiert. 

Nun kann man seine Verbindung zu Google mit ` rclone config` einrichten. Dieses Tool ist ein geführter Setup und eine genauere Erklärung ist nicht notwendig. Ich empfehle für die sichere Konfiguration den Scope `3` bei Google Drive zu nutzen, damit sieht rclone nur die eigenen Dateien und Ordner. Einen Ordner für das Backup würde ich gleich nach der Einrichtung der Verbindung mit `rclone mkdir GoogleDrive1:/Backup1` anlegen.

Auf dem lokalen System braucht es noch einen Ordner zum Mounten und den Ordner für die Config-Dateien
```bash
mkdir -p ~/.config/systemd/user/
mkdir .backups
cd .backups/
mkdir googlemount
mkdir -p .cache-dir/googlemount
```
Optional, aber sehr hilfreich ist der Befehl `loginctl enable-linger`. Mit dieser kleinen Änderung am User kann sich systemd auch ohne Nutzeranmeldung als der Nutzer ausgeben und Dinge im Hintergrund ausführen.

Danach hüpfen wir in den Texteditor und legen uns eine Datei für systemd an. Diese Datei wird Google Drive in unser Filesystem einbinden.
`code .config/systemd/user/home-funker-.backups-googlemount.mount`... den Dateinamen kann man sich leicht mit `systemd-escape -p --suffix=mount "/home/funker/.backups/googlemount"` erstellen.
```
[Unit]
Description=Mount for /home/funker/.backups/googlemount
[Mount]
Type=rclone
What=GoogleDrive1:Backup1
Where=/home/funker/.backups/googlemount
Options=rw,_netdev,args2env,vfs-cache-mode=writes,config=/home/funker/.config/rclone/rclone.conf,cache-dir=/home/funker/.backups/.cache-dir/googlemount
```


[^1]: Arch User Repository
