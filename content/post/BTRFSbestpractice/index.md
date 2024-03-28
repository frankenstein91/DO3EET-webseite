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

```bash
mkfs.btrfs --csum xxhash /dev/sdx
mkdir /run/btrfs-sdx
mount /dev/sdx /run/btrfs-sdx -o compress-force=zstd:5,autodefrag,subvolid=5
mkdir /run/btrfs-sdx/__current /run/btrfs-sdx/__snapshot /run/btrfs-sdx/__documentation
```
In diesen Zeilen beginnen wir mit dem Formatting der gesamten Disk und mounten diese danach, die Optionen sorgen für eine Komprimierung aller Blöcke und einer automatischen Performance verbesserungen durch Defragmentierung. Zum Schluss lege ich auf diesem Speicher drei Ordner an.
- **__current**: hier werden später alle Subvolumes abgelegt
- **__snapshot**: ein Ort für alle read only Snapshots
- **__documentation**: ein Ort für die Dokumentation über die Einrichtung und Änderungen. Somit kann man seine Arbeit gut nachvollziehen.

```bash
btrfs subvolume create /run/btrfs-sdx/__documentation/btrfs
date +"%Y-%m-%d %T" > /run/btrfs-sdx/__documentation/btrfs/creation.txt
```
Nachdem ich die Grundstrucktur aufgebaut habe, fange ich gleich mit der Dokumentation an. Das Erstellungsdatum schreibe ich per Befehl in die Datei, den Rest würde ich mit `nano` oder `vi` in der Datei beschreiben. Dazu zählt zum Beispiel, welche Subvolumes ich unter `__documentation` für welchen Zweck anlegen werde.
Nachdem ich die Dokumentation geschrieben und umgesetzt habe, mache ich immer einen Snapshot von diesem Subvolume. 
```bash
btrfs subvolume snapshot -r /run/btrfs-sdx/__documentation/btrfs /run/btrfs-sdx/__snapshot/doc_btrfs_$(date +"%Y-%m-%d")
```
Am Ende kann ein solches Layout zum Beispiel so aussehen:
```
.
├── __current
│   ├── home
│   ├── rootfilesystem
│   └── var
├── __documentation
│   └── btrfs
└── __snapshot
    └── doc_btrfs_2024-03-28
```
Da Snapshots aber kein Backup ersetzen... auf zum nächsten Punkt...

# FWDW
Da BTRFS in den Metadaten auch Prüfsummen hält, kann man Hardwarefehler schnell, leicht und trotzdem zu spät (außer man nutzt die RAID-Funktionen von BTRFS) finden. In meinen Beispielen habe ich die Checksum übrigens von 32 bit CRC32C auf 64 bit xxhash geändert. Damit reduziert sich die Wahrscheinlichkeit von Hashkollisionen sehr.

Unser Filesystem der Wahl liefert für das Monitoring der Fehler entsprechende Counter mit `btrfs device stats /run/btrfs-sdx/`. Diese sollten wie in meinem Beispiel alle 0 sein, sonst gibt es Probleme.
```
[/dev/sdx].write_io_errs    0
[/dev/sdx].read_io_errs     0
[/dev/sdx].flush_io_errs    0
[/dev/sdx].corruption_errs  0
[/dev/sdx].generation_errs  0
```
Auch der Befehl `btrfs scrub start /run/btrfs-sdx/` und `btrfs scrub status /run/btrfs-sdx/`helfen das Dateisystem in einem guten Zustand zu halten. Dieser Befehl startet einen Durchlauf über alle Daten und Metadaten und gleicht die Prüfsummen ab. Der Prozess läuft im Hingergrund, daher kann man sich mit Status die aktuellen Informationen abholen. Wenn der Scrub noch läuft, sieht es so aus...
```
Scrub started:    Thu Mar 28 16:05:02 2024
Status:           running
Duration:         0:00:15
Time left:        0:00:49
ETA:              Thu Mar 28 16:06:08 2024
Total to scrub:   139.03GiB
Bytes scrubbed:   32.08GiB  (23.08%)
Rate:             2.14GiB/s
Error summary:    no errors found
```
und wenn das ganze beendet ist, sieht es hoffentlich so aus und ist damit fehlerfrei...
```
Scrub started:    Thu Mar 28 16:05:02 2024
Status:           finished
Duration:         0:00:59
Total to scrub:   139.03GiB
Rate:             2.36GiB/s
Error summary:    no errors found
```

## RAID
BTRFS teilt die Daten in 3 Container
1. Data
2. Metadata
3. Systemdata

Für diese Kategorien kann man jeweils Ablagekonfigurationen hinterlegen. Default sind single für Data und Metadata/Systemdata im Dup-Modus.

| **RAID Level** | **Beschreibung** |
|:---:|:---:|
| Single | Inhalte werden ohne Kopie abgelegt |
| DUP | Inhalte werden mit einer weiteren Kopie auf das Laufwerk geschrieben |
| RAID1 | Ihalte werden doppelt auf unterschiedliche Laufwerke abgelegt |
| RAID1C3 | Ihalte werden 3-fach auf unterschiedliche Laufwerke abgelegt |
| RAID1C4 | Ihalte werden 4-fach auf unterschiedliche Laufwerke abgelegt |
| RAID0 | Inhalte werden auf zwei unterschiedliche Laufwerke verteilt um die Geschwindikeit zu erhöhen |
| RAID10 | Kombination aus RAID1 und RAID0 |

Alle RAID*-Level außer RAID0 brauchen einen Verbund von BTRFS-Geräten. Dafür bietet das System `btrfs device add` als Befehl.



[^1] B-tree Filesystem
[^2] Virtual Filesystem Switch