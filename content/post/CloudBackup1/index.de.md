+++
title = 'Datenbackup in die Cloud'
date = 2024-05-20T16:40:35+02:00
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
<!--more-->
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
`code /home/funker/.config/systemd/user/home-funker-.backups-googlemount.mount`... den Dateinamen kann man sich leicht mit `systemd-escape -p --suffix=mount "/home/funker/.backups/googlemount"` erstellen.
```
[Unit]
Description=Mount for /home/funker/.backups/googlemount
[Mount]
Type=rclone
What=GoogleDrive1:Backup1
Where=/home/funker/.backups/googlemount
Options=rw,_netdev,args2env,vfs-cache-mode=writes,config=/home/funker/.config/rclone/rclone.conf,cache-dir=/home/funker/.backups/.cache-dir/googlemount
```

# Dateien verschlüsseln auf Google
Sensible Daten sollten auf einer Cloud nicht unverschlüsselt abgelgt werden, auch wenn es sich um eine vertrauenswürdige Cloud handelt. Dafür bieten sich Systeme wie gocryptfs, cryfs und Tomb an. Unter ArchLinux ist gocryptfs leicht mit `gocryptfs` instaliert.
Die Arbeit geht weiter im Ordner `/home/funker/.backups`. Hier legen wir uns noch einen `.config` Ordner an.
Da wir das Mounting automatesieren wollen, erzeugen wir uns gleich ein Passwortfile und erzeugen den Verschlüsslungscontainer.
```bash
pikaur -Sy pwgen
pwgen -ys 256 1 > .config/fs1.passwd
systemctl --user start home-funker-.backups-googlemount.mount
gocryptfs -init -config /home/funker/.backups/.config/fs1.conf -passfile /home/funker/.backups/.config/fs1.passwd /home/funker/.backups/googlemount
```
Der Masterkey und die Config Datei sollten auf einen externen Speichermedium gespeichert werden (als Backup) und sicher aufbewahrt werden.
```bash
mkdir /home/funker/.backups/googledecry
code /home/funker/.config/systemd/user/home-funker-.backups-googledecry.mount
```
```
[Unit]
Description=Mount for /home/funker/.backups/googledecry
Requires=home-funker-.backups-googlemount.mount
[Mount]
Type=fuse./usr/bin/gocryptfs
What=/home/funker/.backups/googlemount
Where=/home/funker/.backups/googledecry
Options=passfile=/home/funker/.backups/.config/fs1.passwd,config=/home/funker/.backups/.config/fs1.conf
```

Ab hier kann man sein Backup für den ersten Test mit `systemctl --user start home-funker-.backups-googledecry.mount` anbinden und mit `systemctl --user stop home-funker-.backups-googledecry.mount` wieder trennen.

# Fazit bis hier
Mit diesen Zeilen hat man ein verschlüsseltes Backup auf dem Cloud-Provider Google. Solange der Account nicht gehackt, gelöscht oder beschädigt wird, ist nur die Gefahr das Google Drive auf dem [Google Friedhof](https://gcemetery.co/) landet oder Google den Betrieb ganz einstellt. Beide Probleme sind zwar extremst unwahrscheinlich, aber ich hätte es auch nicht bei Google Cloud Print vermutet.

# zweite Cloud als Spiegel
Um auch diese Gefahr zu bannen, lohnt es sich eine zweite Cloud anzubinden. Es würde sich auch eine NAS oder ähnliches lohnen. Im Beispiel machen wir mit einem S3-Speicher weiter. Dafür starte ich mir fix einen MinIO-Server in Docker:
```bash
docker run -p 9000:9000 -p 9001:9001 --name minio -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=toortoor123" quay.io/minio/minio server /data --console-address ":9001"
```
Der Docker-Container ist nur für den Test und nicht für den späteren Betrieb.

Das Setup findet man wieder im `rclone config` unter dem Punkt 4 und dann 18. Wieder ganz normal die Fragen beantworten.
Dann legt man sich einen Bucket im S3 mit `rclone mkdir MinIO1:/backup1` an.

Und nun kommen wieder ein paar Zeilen für die Bash:
```bash
mkdir /home/funker/.backups/s3mount/
mkdir /home/funker/.backups/s3decry/
mkdir /home/funker/OnlineBackup
mkdir /home/funker/.backups/.cache-dir/s3mount/
pwgen -ys 256 1 > /home/funker/.backups/.config/fs2.passwd
code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/.backups/s3mount/")
```
Im Texteditor geht es dann weiter mit:
```
[Unit]
Description=Mount for /home/funker/.backups/s3mount
[Mount]
Type=rclone
What=MinIO1:backup1
Where=/home/funker/.backups/s3mount
Options=rw,_netdev,args2env,vfs-cache-mode=writes,config=/home/funker/.config/rclone/rclone.conf,cache-dir=/home/funker/.backups/.cache-dir/s3mount
```
Damit sollte der Zugriff auf den S3-Bucket kein Problem mehr sein und wir können hier auch mit Sicherheit weiter machen.

# Dateien verschlüsseln auf der zweiten Seite
Auch hier müssen wir ein Container für die Verschlüsslung einrichten.
```bash
systemctl --user start home-funker-.backups-s3mount.mount
gocryptfs -init -config /home/funker/.backups/.config/fs2.conf -passfile /home/funker/.backups/.config/fs2.passwd /home/funker/.backups/s3mount
code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/.backups/s3decry/")
```
Auch in diesem Texteditor muss etwas geschrieben werden:
```
[Unit]
Description=Mount for /home/funker/.backups/googledecry
Requires=home-funker-.backups-s3mount.mount
[Mount]
Type=fuse./usr/bin/gocryptfs
What=/home/funker/.backups/s3mount
Where=/home/funker/.backups/s3decry
Options=passfile=/home/funker/.backups/.config/fs2.passwd,config=/home/funker/.backups/.config/fs2.conf
```

# Weiteres Zwischenfazit
Mit dieser Umsetzung hat man zwei verschlüsselte Orte für sein Backup. Die Verschlüsslung erfolgt mit unterschiedlichen Passwörtern zu unterschiedlichen Anbietern. Im aktuellen Status, muss man sich aber noch selbst darum kümmern die Daten gleich zu halten.

# Spiegel mit union
Für diesen Schritt erweitern wir die `/home/funker/.config/rclone/rclone.conf` von Hand:
```
[spiegel]
type = union
upstreams = /home/funker/.backups/s3decry:writeback /home/funker/.backups/googledecry
action_policy = all
create_policy = all
search_policy = ff
```

Auch dafür baut man sich am besten wieder ein Systemd-File:

`code /home/funker/.config/systemd/user/$(systemd-escape -p --suffix=mount "/home/funker/OnlineBackup")`
```
[Unit]
Description=Mount for /home/funker/OnlineBackup
Requires=home-funker-.backups-s3decry.mount
Requires=home-funker-.backups-googledecry.mount
[Mount]
Type=rclone
What=spiegel:
Where=/home/funker/OnlineBackup
Options=rw,_netdev,args2env,config=/home/funker/.config/rclone/rclone.conf
```
Den Spiegel kann man jetzt mit `systemctl --user start home-funker-OnlineBackup.mount` nutzen und mit `systemctl --user stop home-funker-OnlineBackup.mount` wieder trennen. Beim Trennen bleiben die autoamtisch gestarteten Mountpunte aktiv, was zwar nicht optimal ist... aber villeicht beim Debug hilft.

# Backup Path

```goat
                   .--------------.
                   | Backupfolder |
                   '------+-------'
                          |
         .----------------+----------------.
         |                                 |
.--------+---------.            .----------+-----------.
| S3 entschlüsselt |            | Google entschlüsselt |
'--------+---------'            '----------+-----------'
         |                                 |
.--------+---------.            .----------+-----------.
| S3 verschlüsselt |            | Google verschlüsselt |
'--------+---------'            '----------+-----------'
         |                                 |
.--------+---------.            .----------+-----------.
| S3 Cloudspeicher |            | Google Cloudspeicher |
'------------------'            '----------------------'
```

# Schluss
Wie immer sind Fragen gern gesehen...

[^1]: Arch User Repository
