+++
title = 'BTRFS best practice'
date = 2024-03-28T13:04:18+01:00
draft = false
tags = [
    "Linux",
    "Dateisystem",
    "BTRFS",
]
+++

BTRFS[^1] ist ein modernes Dateisystem, das für seine Vielseitigkeit, Fehlertoleranz und Leistung bekannt ist. Es wird stark weiterentwickelt. Mir bekannte Betriebsysteme mit BTRFS-Support sind GNU/Linux und ReactOS. Meine Begeisterung zielt aber eher auf Linux ab.

In diesem Guide werden wir einige Best Practices für die Verwendung von BTRFS vorstellen. Diese sind nur ein Vorschlag und wie üblich in der OpenSource-Welt nur meine Erfahrung und damit mein Hinweis. Wir besprechen Themen wie:
- Partitionierung vs partitionless
- Struktur von Subvolumes
- Komprimierung
- Fehlerbehebung, Wartung, Datensicherung und Wiederherstellung

# Linuxfilesystemhierarchygrundverständnis
Der Filesystem Hierarchy Standard beschreibt eine Verzeichnisstruktur für Linux-Dateisysteme. Er sorgt dafür, dass wichtige Dateien und Verzeichnisse an einem bestimmten Ort zu vermuten sind, was die Systemverwaltung und -nutzung vereinfacht. Die meisten Entwickler halten sich an diesen Vorschlag, um sich auch darauf verlassen zu können.

Das VFS[^2] ist als Baumstruktur aufgebaut und verwendet keine Laufwerksbuchstaben wie unter Windows üblich. Das Dateisystem beginnt mit dem Root-Verzeichnis (`/`), von dem aus alle anderen Verzeichnisse abzweigen.

- **Standardverzeichnisse:** Wichtige Verzeichnisse wie `/bin`, `/etc`, `/home`, `/usr` und `/var` haben jeweils einen bestimmten Zweck.
- **Konsistenz:** Die Verzeichnisstruktur ist auf allen Linux-Distributionen gleich, sofern sie den FHS einhalten.
- **Erweiterbarkeit:** Der FHS kann durch zusätzliche Verzeichnisse und Dateien erweitert werden.
- **Empfehlung:** Man muss sich nicht an die Hierarchy halten, muss dann aber mit Problemen rechnen.

## Wichtige Verzeichnisse im FHS

* `/bin`: Enthält ausführbare Dateien, die für alle Benutzer verfügbar sind.
* `/boot`: Enthält die Boot-Dateien des Systems und auf modernen Systemen auch EFI-Stubs. Meist nutzt man hier FAT32 als Dateisystem.
* `/dev`: Enthält Gerätetreiber und Gerätedateien.
* `/etc`: Enthält Konfigurationsdateien für das System und die Anwendungen.
* `/home`: Enthält die Home-Verzeichnisse der Benutzer.
* `/lib`: Enthält Bibliotheken, die von Anwendungen verwendet werden. Für Systeme die mehrere CPU-Architekturen unterstüzen, kann es hier mehrere Ordner geben bzw. lib32 und lib64
* `/media`: Enthält Einhängepunkte für externe Medien wie CDs und DVDs.
* `/mnt`: Enthält temporäre Einhängepunkte für Dateisysteme.
* `/opt`: Enthält optionale Softwarepakete.
* `/proc`: Enthält Informationen über laufende Prozesse.
* `/root`: Das Home-Verzeichnis des Root-Benutzers.
* `/run`: Enthält Dateien, die für den laufenden Systembetrieb benötigt werden und die sich dynamisch ändern können.
* `/sbin`: Enthält ausführbare Dateien für Systemadministratoren.
* `/sys`: Enthält Informationen über das System, z. B. Kernel-Module und Geräte.
* `/tmp`: Enthält temporäre Dateien.
* `/usr`: Enthält die meisten Programmdateien und Bibliotheken.
* `/var`: Enthält variable Daten, z. B. Protokolldateien und Datenbanken.

# Partitionierung vs partitionless
Als eine Besonderheit von BTRFS sehe ich den Betrieb von BTRFS im partitionless Modus. Hier wird das Blockdevice nicht wie üblich in Partitionen aufgeteilt, sondern das Dateisystem direkt auf dem Gerät abgelegt. Das heißt kein GPT oder MBR.
Damit nimmt man mögliche Kompatibilitätsprobleme mit einigen älteren Systemen und Software in Kauf. Gewinnt aber auch effiziente Speichernutzung und Flexibilität. Besonders in virtuellen Umgebungen, wo eine Festplatte einfach vergrößert werden kann, muss man so keine Partitionen schieben um einen Bereich zu vergrößern.

Anlegen eines BTRFS Laufwerks mit Partitionierung:
```bash
sfdisk --wipe=always /dev/sdx << EOF
type=83
write
EOF
mkfs.btrfs --csum xxhash /dev/sdx1
```
Und nun ohne Overhead:
```bash
mkfs.btrfs --csum xxhash /dev/sdx
```
Man kann sich also hier immer Zeilen sparen, wenn man die gesamte Disk nutzen möchte und keine kleine Partition zum Booten braucht.

# Subvolumelayout
Eine weitere Funktion die ich sehr viel auf meinen Systemnen nutze, sind die Subvolumes. Damit ist es möglich ein BTRFS in viele logische Einheiten zu teilen, die den Speicherplatz aber gemeinsam nutzen. Für den Nutzer und die Anwendungen erscheinen die Subvolumes wie normale Ordner bzw. Mountpoints (man kann einzelne Subvolumes an verschiedene Orte im VFS mounten).

Die wie bei der Linuxfilesystemhierarchy gibt es hier nur Vorschläge, wie man sein BTRFS aufbauen kann. Nach meinem Wissen haben sich hier zwei Hauptlager neben dem "Chaos" durchgesetzt. Da wäre auf der einen Seite die @-Benennungskonvention und auf der anderen Seite (meiner Seite) das __-Layout (zwei Unterstriche). Also hier nun wie ich mein BTRFS-Laufwerk aufteile und die Befehle, wie man an dieses Ziel kommt.

[^1] B-tree Filesystem
[^2] Virtual Filesystem Switch