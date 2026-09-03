+++
title = "Antwort an hoergen: rsync über SSH im Härtetest – Benchmarks, Mythen und Best Practices 2026"
date = "2026-09-03T15:53:30+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "rsync",
    "SSH",
    "Linux",
    "Benchmark",
    "Performance",
    "Backup",
    "Sysadmin",
    "OpenSSH"
]
description = "Ein technischer Deep-Dive und Benchmark-Härtetest moderner rsync- und SSH-Pipelines: Warum historische Tuning-Mythen wie arcfour oder generelle Kompressions-Verbote auf modernen Multi-Core-CPUs mit AES-NI nicht mehr gelten."
summary = "Ein technischer Deep-Dive und Benchmark-Härtetest moderner rsync- und SSH-Pipelines: Warum historische Tuning-Mythen wie arcfour oder generelle Kompressions-Verbote auf modernen Multi-Core-CPUs mit AES-NI nicht mehr gelten."
+++

> **Hinweis:**  
> Dieser Beitrag ist eine konstruktive, technische Erwiderung auf den lesenswerten Artikel [„rsync über SSH – Hochperformante Backups und Synchronisation“](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/) von **hoergen** vom 1. September 2026, auf den ich über [planet.ubuntuusers.de](https://planet.ubuntuusers.de/) aufmerksam geworden bin.  
> Ich schätze praxisnahe Artikel aus der Linux-Community sehr – genau solche Beiträge bringen mich dazu, das eigene Setup zu hinterfragen, nachzumessen und dazuzulernen. Da einige der dort empfohlenen Parameter (insbesondere `arcfour`, `--no-compress` und GNU `parallel`) aus moderner Hardware- und Kernel-Sicht teils unerwartete Performance-Fallen bergen, habe ich ein wissenschaftliches Labor aufgesetzt, um die Thesen unter kontrollierten Bedingungen auf Herz und Nieren zu prüfen.

---

## Warum ich 2026 neu über rsync und SSH nachdenke

Vor 15 bis 20 Jahren war die Welt der Systemadministration eine andere: {{< fire >}}Single-Core-Prozessoren liefen heiß, sobald Daten komprimiert oder verschlüsselt wurden.{{< /fire >}} Der Arbeitsspeicher war knapp, Netzwerkkarten schaufelten 100 Mbit/s durch ungeschirmte Cat.5-Kabel, und Krypto-Beschleuniger gab es fast nur auf sündhaft teuren PCI-Karten für Bankenrechenzentren.

Aus jener Ära stammen viele Faustregeln, die bis heute durch Blogbeiträge und Foren geistern:
1. *„Nimm arcfour / RC4 für SSH – das ist zwar unsicher, aber viel schneller!“*
2. *„Bei schnellen Netzwerken niemals komprimieren – die CPU bremst nur den Durchsatz!“*
3. *„Parallelisiere alles mit GNU parallel, um mehr Durchsatz zu erzwingen!“*

Heute, im Jahr 2026, sieht die moderne Hardware-Landschaft grundlegend anders aus: Prozessoren verfügen über hochgradig spezialisierte Silizium-Befehlssätze wie **Intel AES-NI**, **AVX2/AVX-512 Vektoreinheiten**, riesige L3-Caches und extrem schnellen DDR5-Speicher. Gleichzeitig wurden moderne, extrem ressourcenschonende Algorithmen wie **`lz4`**, **`zstd`** und **`xxh3`** tief in rsync integriert.

Um herauszufinden, was moderne Backup-Pipelines heute wirklich beschleunigt und was sie ausbremst, habe ich ein kompromissloses Testlabor gebaut.

---

## Das Versuchs-Setup: Ein wissenschaftliches Null-I/O-Labor

Um Messfehler durch schwankende NVMe-Schreibcaches, Flash-Controller-Drosselung oder Dateisystem-Fragmentierung zu 100% auszuschließen, wurde der gesamte Versuchsaufbau in einer **reinen RAM-Disk (`tmpfs`)** realisiert. 

```goat
.-----------------------------------------------------------------------.
|                         HOST SYSTEM (RAM-DISK)                        |
|               Intel Core i7-1370P (14 Cores / 20 Threads)             |
|                                                                       |
|   .-------------------------.           .-------------------------.   |
|   |     lab-ssh-client      |           |     lab-ssh-server      |   |
|   |   CPUs: 8, 9, 10, 11    |           |   CPUs: 4, 5, 6, 7      |   |
|   |   (P-Cores 4 & 5)       |           |   (P-Cores 2 & 3)       |   |
|   |                         |           |                         |   |
|   |  Quelle: /daten/ (tmpfs)|           |  Ziel: /backup/ (tmpfs) |   |
|   '------------+------------'           '------------^------------'   |
|                |                                     |                |
|                '------> Docker Bridge (MTU 65535) ---'                |
|                         Durchsatz: 75,5 Gbit/s                        |
'-----------------------------------------------------------------------'
```

### Die Eckdaten des Versuchsaufbaus:
* **Prozessor:** 13th Gen Intel Core i7-1370P (14 Kerne, 20 Threads, bis zu 5,2 GHz Turbo).
* **Core-Pinning (Zero Thread-Contention):**  
  * `lab-ssh-client` läuft isoliert auf Performance-Kernen **8, 9, 10, 11** (P-Cores 4 & 5).
  * `lab-ssh-server` läuft isoliert auf Performance-Kernen **4, 5, 6, 7** (P-Cores 2 & 3).
  * Host-Prozesse, Desktop und I/O laufen separat auf den E-Cores (CPUs 12–19).
  * Dadurch wird jeglicher CPU-Wettlauf zwischen Sender und Empfänger physikalisch eliminiert.
* **Virtuelles Netzwerk:** Docker Bridge mit Jumbo-Frames (**MTU 65535**).  
  * Gemessene Basisbandbreite mit `iperf3`: **75,5 Gbit/s** (87,9 Gigabyte in 10 Sekunden bei nur 3 Retransmissions).
* **Telemetrie:**  
  * Zeitmessung: Nanosekunden-Präzision über Pythons `time.perf_counter()`.
  * CPU-Accounting: Direkte Auswertung des Linux-Kernels über `/sys/fs/cgroup/cpu.stat` (cgroups v2).
  * Statistische Absicherung: **1 Vorlauf (Warmup) + 5 validierte Messläufe** je Messpunkt mit Mittelwert ($\mu$) und Standardabweichung ($\sigma$). Vor jedem Lauf wurde das Zielverzeichnis vollständig geleert.

---

## Der `arcfour`-Irrtum: Warum alte Mythen langsamer sind

Im Abschnitt [Performance-Tuning](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/#performance-tuning) schreibt hoergen:

> *„Schnellere Verbindung: [-e "ssh -c arcfour"](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/#performance-tuning:~:text=ssh%20%2Dc%20arcfour) (weniger sicher, aber schneller)“*

### Das Problem in modernem Linux:
Wer diesen Befehl heute auf einem aktuellen Linux-System ausführt, erlebt eine böse Überraschung:
```text
Unknown cipher type 'arcfour'
```
OpenSSH hat den RC4-Streamcipher `arcfour` bereits mit Version 7.6 **vollständig aus dem Code entfernt**, da die Verschlüsselung kryptografisch gebrochen ist und von Geheimdiensten in Echtzeit mitgelesen werden kann.

### Der Härtetest: Was passiert, wenn ich `arcfour` reaktiviere?
Um hoergens These nicht nur theoretisch abzuhandeln, habe ich in einem Docker-Container ein älteres OpenSSH 7.4 (Debian Stretch) aufgesetzt, in dem `arcfour` noch einkompiliert ist. Anschließend habe ich `arcfour` direkt gegen moderne Ciphers auf identischer Hardware mit 1 GB Binärdaten antreten lassen:

| Verschlüsselungs-Algorithmus | Dauer ($\mu \pm \sigma$) | Effektiver Durchsatz | Client-CPU | Bewertung / Hardware-Effekt |
| :--- | :---: | :---: | :---: | :--- |
| **`aes256-gcm@openssh.com`** | **2,03s $\pm$ 0,02s** | **504,9 MB/s** | **29,8%** | 🏆 **Sieger** (Intel AES-NI Hardwarebeschleunigung) |
| **`aes128-gcm@openssh.com`** | **2,03s $\pm$ 0,02s** | **503,8 MB/s** | **29,6%** | 🏆 **Sieger** (Intel AES-NI Hardwarebeschleunigung) |
| **`chacha20-poly1305@openssh.com`** | 3,04s $\pm$ 0,09s | 337,0 MB/s | 36,3% | Software-Streamcipher ohne Hardware-Krypto |
| **`arcfour256` (RC4 256-Bit)** | 3,14s $\pm$ 0,03s | 326,6 MB/s | 37,3% | Software-Streamcipher (+55% längere Laufzeit) |
| **`arcfour` (RC4 128-Bit)** | **3,19s $\pm$ 0,03s** | **320,6 MB/s** | **37,3%** | 🐌 **57% LANGSAMER & +26% MEHR CPU als AES!** |

### Warum ist `arcfour` heute so langsam?
1. **Keine Hardware-Instruktionen:**  
   `arcfour` (RC4) existiert im modernen x86_64-Befehlssatz schlichtweg nicht. Jedes Byte muss mühsam als Softwarelogik über die allgemeinen Rechenregister der CPU geschleift werden.
2. **Intel AES-NI rechnet direkt in Silizium:**  
   Moderne Prozessoren besitzen spezialisierte Hardware-Pipelines (`aesenc`, `vaes`), die AES-GCM völlig autark und parallel zu anderen Operationen verarbeiten.
3. **Fazit:** Die Empfehlung `arcfour` ist nicht nur hochgradig unsicher, sondern auf jedem Prozessor der letzten 15 Jahre **über 50% langsamer als sicheres AES-GCM**!

---

## Mythos Kompression: `--no-compress` bei schnellen Netzen

Im Artikel heißt es bei den Parametern:
> *„Keine Komprimierung --no-compress (bei schnellen Netzwerken)“*

Die Überlegung dahinter scheint intuitiv: Wenn das Netzwerk schnell genug ist, kostet das Komprimieren nur unnötig CPU-Zeit. **Stimmt das auf modernen Multicore-Prozessoren noch?**

Ich habe drei Datensätze (je 1 GB) auf drei Netzwerkstufen (75,5 Gbit/s RAM-Netz, 1 Gbit/s LAN und 100 Mbit/s WAN) mit unterschiedlichen Kompressionsverfahren verglichen:

### Testfall: 1 GB Text & Server-Logs auf 75,5 Gbit/s Netzwerk
| Kompressions-Verfahren | Dauer | Durchsatz | Wire-Daten im Netz | Client-CPU |
| :--- | :---: | :---: | :---: | :---: |
| **`--no-compress` (Keine Kompression)** | 1,40s | 734,5 MB/s | 1024,3 MB | 25,5% |
| **`rsync zlib (-z)` (Klassiker)** | 0,75s | 1368,3 MB/s | 0,1 MB | 13,3% |
| **`rsync zstd` (Moderner Standard)** | 0,71s | 1441,1 MB/s | 0,1 MB | 12,8% |
| **`rsync lz4` (High-Speed)** | **0,56s** | **1827,0 MB/s** | 19,1 MB | 15,7% |

**Befund:** Selbst bei unfassbaren **75,5 Gbit/s** (wo das Netzwerk praktisch unendlich schnell ist) ist `lz4` **2,4-mal so schnell wie `--no-compress`**!  
Warum? Weil moderne P-Cores Daten mit über 2,5 GB/s schrumpfen – und es für den Linux-Kernel schlicht schneller ist, 19 MB über den Socket zu jagen als 1024 MB rohe Daten durch die Pipe zu drücken!

### Testfall: Reales 930-MB-Projektverzeichnis im 1 Gbit/s LAN
| Kompressions-Verfahren | Dauer | Effektiver Durchsatz | Client-CPU |
| :--- | :---: | :---: | :---: |
| **`--no-compress`** | 7,82s | 118,7 MB/s | 5,8% |
| **`rsync zlib (-z)`** | 4,55s | 204,0 MB/s | 7,9% |
| **`rsync zstd`** | 4,54s | 204,8 MB/s | 8,0% |
| **`rsync lz4`** | **4,47s** | **207,8 MB/s** | 7,6% |

**Befund:** Im typischen Gigabit-Netzwerk halbiert `lz4` die Backup-Dauer von fast 8 Sekunden auf **4,47 Sekunden**!

### Wann hat der Blogger recht?
Ausschließlich bei **reinen, bereits komprimierten Mediendateien** (JPEG-Bilder, MP4-Videos, TGZ-Archive). Dort spart Kompression 0% Bandbreite, kostet aber ca. 5% CPU-Prüfaufwand. Hier ist `--no-compress` die richtige Wahl.

---

## Die verborgene Falle: Warum SSH-Kompression (`-o Compression=yes`) katastrophal ist

In seinem High-Performance-Skript setzt hoergen explizit die Option `-o Compression=no`. **Hier hat der Autor zu 100% recht – und das aus einem dramatischen Grund!**

Viele Admins denken: *„Wenn Kompression gut ist, schalte ich sie doch einfach in SSH mit `ssh -C` oder `-o Compression=yes` ein!“*

Ich habe genau das gemessen – mit schockierendem Ergebnis:

| Testfall (75,5 Gbit/s Netz) | Modus | Dauer | Durchsatz | Auswirkung |
| :--- | :--- | :---: | :---: | :--- |
| **1 GB Binärdaten** | **rsync `--no-compress` (SSH `Compression=no`)** | **1,31s** | **781,7 MB/s** | **Normalzustand** |
| 1 GB Binärdaten | **SSH `Compression=yes` allein** | **24,66s** | **41,5 MB/s** | 🐌 **19-facher Einbruch!** |
| **Gemischtes Projekt** | **rsync `lz4` (SSH `Compression=no`)** | **0,91s** | **1023,5 MB/s** | **Normalzustand** |
| Gemischtes Projekt | **SSH `Compression=yes` allein** | **13,92s** | **66,8 MB/s** | 🐌 **15-mal langsamer!** |

### Warum bricht SSH-Kompression so brutal ein?
OpenSSH führt seinen Kompressionsfilter `zlib@openssh.com` strikt **synchron im Single-Thread Event-Loop des Sockets** aus. Wenn inkompressible Daten eintreffen, rechnet dieser eine Thread auf 100% Anschlag, blockiert die Socket-Puffer und deckelt den Durchsatz bei mickrigen **40 bis 60 MB/s** – egal wie schnell dein Netzwerk ist!

**Goldene Regel:** SSH-Kompression muss zwingend deaktiviert bleiben (`-o Compression=no`). Komprimiert wird ausschließlich auf Anwendungs-Ebene in `rsync` via `--compress-choice=lz4`!

---

## Tiefere Forschung: CPU-Cache-Splitting & die GNU Parallel-Falle

Inspiriert von den Cache-Daten meines Prozessors (`lscpu`: L1d = 48 KiB, L2 = 1,25 MiB, L3 = 24 MiB) habe ich untersucht:  
*Macht es einen Unterschied, wenn 1 GB Daten vor dem Transfer so gesplittet werden, dass sie exakt in die CPU-Caches passen?*

Zudem empfiehlt hoergen im Artikel:
> `find /daten -type f | parallel -j 8 rsync ...`

Ich habe 1 GB Daten in Cache-Größen zerlegt und sowohl **sequentiell** als auch mit **GNU Parallel** übertragen:

| Cache-Stufe & Aufteilung | Modus | Dauer | Durchsatz | Client-CPU | Befund |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **L3-Cache (64x 16 MiB)** | **Sequentiell (`rsync -a`)** | **1,24s** | **824,5 MB/s** | 26,0% | 🏆 **Allzeit-Rekord! (+23 MB/s schneller als 1 GB ungesplittet)** |
| **Baseline (1x 1024 MiB)** | Sequentiell (`rsync -a`) | 1,28s | 801,3 MB/s | 24,4% | Ungesplittete Referenz |
| **L1d-Cache (21.846x 48 KiB)** | Sequentiell (`rsync -a`) | 1,28s | 803,5 MB/s | **31,8%** | ⚠️ **Syscall-Overhead:** 21.846 Inodes treiben CPU um +30% nach oben |
| **L3-Cache (64x 16 MiB)** | **Parallel (`parallel -j 4`)** | **5,51s** | **185,8 MB/s** | 20,1% | 4,4-mal langsamer durch 64 SSH-Handshakes |
| **L2-Cache (820x 1,25 MiB)** | **Parallel (`parallel -j 4`)** | **41,75s** | **24,5 MB/s** | **13,7%** | <span class="squashed-snail" title="So schnell wie eine zertretene Schnecke">🐌</span> **32-mal LANGSAMER durch 820 SSH-Handshakes!** |

### Warum 16 MiB (L3-Cache) siegt:
16 MiB liegen während des Verschlüsselns vollständig im ultraschnellen **24 MB L3-Cache** des i7-1370P, ohne dass der Speichercontroller Cachelines in den DRAM verwerfen muss. Gleichzeitig sind 64 Dateien so wenige, dass kaum Metadaten-Overhead anfällt.

### Der Super-GAU von GNU Parallel bei vielen Dateien:
Der Befehl `find | parallel rsync` startet für **jede einzelne Datei einen nagelneuen SSH-Prozess**!  
Bei 820 Dateien verbringt das System über **40 Sekunden** nur damit, 820 Mal TCP-Handshakes, Diffie-Hellman-Schlüsseltausch und Public-Key-Signaturen abzuarbeiten.  
Ein normales sequentielles `rsync -a` streamt alle Dateien über **eine einzige persistente SSH-Verbindung** und ist **32-mal schneller**!

---

## Das Pseudoterminal (`-T`): Versteckter Hebel für Stabilität & Speed

Ein oft übersehener Schalter in SSH ist **`-T`** (*Disable pseudo-terminal allocation*).  
Was passiert, wenn man versehentlich ein Terminal erzwingt (`-t -t`) oder `-T` weglässt?

* **Mit erzwungenem PTY (`-t -t`):** Der rsync-Transfer **stürzt sofort mit Exit-Code 2 ab**!  
  *Warum?* Der Linux-Kernel interpretiert binäre Steuerbytes im rsync-Datenstrom (`0x03` = Ctrl+C, `0x04` = EOF, `0x11` = XOFF) als Terminalsignale und zerreißt die Übertragung.
* **Mit explizitem `-T`:** Die Latenz sinkt messbar, da keine `pty-req`-Pakete und Terminalgrößen ausgehandelt werden müssen. Auf meinem 930-MB-Projekt stieg der Durchsatz von 916 MB/s auf **1052 MB/s**!

---

## Der direkte Showdown: Blog-Befehl vs. Mein Ultimate Modern rsync

Ich habe den finalen Befehl aus hoergens Artikel gegen meine optimierte Fassung antreten lassen:

```bash
# Hoergens Befehl aus dem Artikel:
find /daten -type f | parallel -j 8 rsync -avzP --delete -e "ssh -p 2222 -c aes128-gcm@openssh.com -o Compression=no" {} benutzer@server:/backup/{} --no-compress --bwlimit=10000
```
*(Hinweis: Der Befehl enthält zudem widersprüchliche Flags wie `-z` und `--no-compress` gleichzeitig sowie eine künstliche Drossel von `--bwlimit=10000` = 10 MB/s).*

### Das Messergebnis auf meinem realistischen 930-MB-Projektverzeichnis:

| Ansatz | Dauer | Durchsatz | Differenz |
| :--- | :---: | :---: | :--- |
| **Befehl aus Original-Artikel** | 23,47s | 39,6 MB/s | Basis |
| **Standard rsync (`rsync -a`)** | 2,01s | 461,6 MB/s | 11,7-mal schneller |
| **Mein Ultimate Modern rsync** | **1,03s** | **905,7 MB/s** | <span class="shaking-rocket" title="Maximale Beschleunigung: 22,8-mal schneller!">🚀</span> **22,8-MAL SCHNELLER!** |

---

## Exkurs: rsync über reinen OpenSSL-Tunnel (socat & stunnel)

Eine immer wieder diskutierte Überlegung lautet: *„Kann man rsync nicht über einen reinen OpenSSL- oder TLS-Tunnel betreiben, um den angeblichen Overhead von SSH komplett zu umgehen oder den rsync-Daemon abzusichern?“*

> **Klares Fazit vorab: Für die normale Nutzung lohnt sich das absolut nicht!**  
> Ein externer OpenSSL-Tunnel verkompliziert die Infrastruktur spürbar und halbiert in der Praxis sogar die Übertragungsrate gegenüber modernem SSH.

Da `rsync` keine native OpenSSL-Unterstützung eingebaut hat, behilft man sich mit externen Tunnel-Tools wie **`socat`** (für Ad-hoc-Verbindungen) oder **`stunnel`** (für dauerhafte Hintergrund-Dienste). Das Prinzip ist immer identisch: Auf dem Server läuft ein unverschlüsselter `rsync`-Daemon (`rsync --daemon`) auf `localhost`. Das Tunnel-Tool verschlüsselt den Port nach außen via TLS, und der Client entschlüsselt ihn lokal wieder.

### Die beiden Varianten in der Praxis

#### Variante 1: Der Ad-hoc-Weg mit `socat`
1. **Selbstsigniertes Zertifikat auf dem Server erstellen:**
   ```bash
   openssl req -new -x509 -days 365 -nodes -out server.crt -keyout server.key -subj "/CN=backup-server"
   cat server.key server.crt > server.pem
   chmod 600 server.pem
   ```
2. **Tunnel auf dem Server starten** (lauscht auf TLS-Port 8443 und leitet an lokalen `rsyncd` Port 873 weiter):
   ```bash
   socat OPENSSL-LISTEN:8443,reuseaddr,pf=ip4,fork,cert=server.pem,verify=0 TCP4:127.0.0.1:873 &
   ```
3. **Tunnel auf dem Client öffnen & rsync starten:**
   ```bash
   socat TCP4-LISTEN:8730,reuseaddr,pf=ip4,fork OPENSSL:SERVER_IP:8443,verify=0 &
   rsync -a /lokale/daten/ rsync://localhost:8730/backup/
   ```

#### Variante 2: Der permanente Dienst mit `stunnel`
Auf dem Server nimmt `stunnel` verschlüsselte TLS-Verbindungen auf Port 8731 entgegen und gibt sie an `127.0.0.1:873` weiter. Auf dem Client läuft `stunnel` mit `client = yes` und stellt unter `127.0.0.1:8731` einen lokalen Endpunkt bereit. `rsync` synchronisiert dann transparent via `rsync://localhost:8731/backup/`.

### Die harten Messwerte aus dem Labor (RAM-Disk, 75,5 Gbit/s)

Ich habe beide Tunnel-Varianten in meiner Docker-RAM-Disk gegen unverschlüsseltes `rsyncd` und unser optimiertes SSH antreten lassen:

| Übertragungs-Methode | 1 GB Binärdaten | Reales 930 MB Projekt | 1 GB Logs mit `lz4` | Bewertung |
| :--- | :---: | :---: | :---: | :--- |
| **Unverschlüsselt (`rsyncd` TCP)** | **1,24s** (826 MB/s) | **0,94s** (989 MB/s) | **0,52s** (1969 MB/s) | Physikalisches Limit ohne Verschlüsselung |
| **Modern SSH (`aes128-gcm`)** | **1,33s** (770 MB/s) | **1,02s** (912 MB/s) | **0,55s** (1862 MB/s) | 🏆 **Testsieger (nur 7% Krypto-Overhead)** |
| **OpenSSL via `socat`** | 2,57s (398 MB/s) | 2,01s (463 MB/s) | 0,81s (1264 MB/s) | 🐌 **48% langsamer als SSH** |
| **OpenSSL via `stunnel`** | 2,62s (391 MB/s) | 2,08s (447 MB/s) | 0,84s (1219 MB/s) | 🐌 **49% langsamer als SSH** |

### Warum verliert OpenSSL so deutlich gegen OpenSSH?

Obwohl OpenSSL die gleiche AES-NI Hardwarebeschleunigung der CPU anspricht wie OpenSSH, bricht der Durchsatz um die Hälfte ein. Der Grund ist rein architektonisch:

```goat
.-----------------------------------------------------------------.
|   OpenSSL-Tunnel Architektur: 4x TCP-Sockets & Puffer-Kopien    |
|                                                                 |
|   [ CLIENT ]                                                    |
|   .---------------------------------------------------------.   |
|   | rsync (Client-Prozess)                                  |   |
|   '----------------------------+----------------------------'   |
|                                | TCP Loopback (127.0.0.1:8730)  |
|                                v                                |
|   .---------------------------------------------------------.   |
|   | socat / stunnel (Verschlüsselung via OpenSSL / TLS 1.3) |   |
|   '----------------------------+----------------------------'   |
|                                |                                |
|                                | Virtuelles Netzwerk (Port 8443)|
|                                v                                |
|   [ SERVER ]                                                    |
|   .---------------------------------------------------------.   |
|   | socat / stunnel (Entschlüsselung via OpenSSL)           |   |
|   '----------------------------+----------------------------'   |
|                                | TCP Loopback (127.0.0.1:873)   |
|                                v                                |
|   .---------------------------------------------------------.   |
|   | rsync-Daemon (rsync --daemon)                           |   |
|   '---------------------------------------------------------'   |
'-----------------------------------------------------------------'
```

1. **Kernel-Pipes vs. 4-facher Socket-Overhead:**  
   OpenSSH wird von `rsync` direkt als Kindprozess gestartet. Die Daten fließen über eine anonyme Kernel-Pipe direkt in den SSH-Prozess und sofort auf die Netzwerkkarte.  
   Bei `socat` oder `stunnel` muss jedes Byte hingegen durch **vier separate TCP-Sockets und User-Space-Puffer** geschleust werden (siehe Architektur-Diagramm oben).
2. **Syscall-Gewitter:**  
   Jeder zusätzliche Socket-Hop erzwingt zusätzliche `poll()`-, `read()`- und `write()`-Syscalls. Selbst mit getunten TCP-Puffern (`so-rcvbuf=1MB`) limitiert der Userspace-Event-Loop den Durchsatz bei rund 400 MB/s.
3. **SSH-Overhead ist heute vernachlässigbar:**  
   Mit `aes128-gcm` liegt der Krypto-Overhead von SSH gegenüber komplett unverschlüsseltem `rsyncd` bei winzigen **7%**. Ein externer Tunnel spart also nichts ein, sondern verdoppelt die CPU-Laufzeit.

### Wann lohnt sich ein OpenSSL-Tunnel trotzdem?

Ein OpenSSL-Tunnel ist kein Performance-Tuning, sondern ein **administratives Spezialwerkzeug** für ganz bestimmte Randfälle:
* **Kein Shell-Zugang erlaubt:** Wenn auf einer strikten Backup-Appliance oder in unprivilegierten Containern aus Sicherheitsgründen kein SSH-Dienst und keine Shell laufen darf.
* **Firewall-Restriktionen:** Wenn Port 22 blockiert ist und der Backup-Traffic zwingend als HTTPS getarnt über Port 443 laufen muss.
* **Bestehende rsync-Daemon-Infrastruktur:** Wenn man eine bestehende, gewachsene `rsyncd`-Farm nach außen hin absichern will, ohne SSH-Schlüssel für alle Clients verwalten zu müssen.

---

## Interaktiver rsync & SSH Befehls-Generator

Damit du nicht mühsam alle Parameter manuell zusammenkopieren musst, habe ich einen interaktiven Generator im Terminal-Stil gebaut. Wähle einfach dein Szenario oder passe die Pfade an:

{{< rsync_generator >}}

---

## Zusammenfassung: Die goldenen Regeln für 2026

Wenn du rsync und SSH heute auf maximale Geschwindigkeit trimmen willst, beachte folgende Kernpunkte:

1. **Finger weg von `arcfour`:** Es ist unsicher, in OpenSSH gelöscht und dank Intel AES-NI **57% langsamer als `-c aes128-gcm@openssh.com`**.
2. **Kompression gehört in rsync, nicht in SSH:** Nutze `--compress-choice=lz4 -z` für Gigabit-LANs (halbiert die Übertragungszeit!) und `zstd` für langsame WAN-Strecken. Schalte SSH-Kompression rigoros aus (`-o Compression=no`).
3. **Keine SSH-Handshake-Stürme mit GNU Parallel:** Nutze Standard-`rsync -a`, um alle Dateien durch einen persistenten Tunnel zu jagen, statt pro Datei einen SSH-Handshake auszulösen.
4. **Moderne Flags nutzen:** `--checksum-choice=xxh3` (30 GB/s Vektor-Hash), `--inplace` (kein temporäres Datei-Rename), `--whole-file` (kein Delta-Rechnen bei schnellen Netzen) und `ssh -T` (kein PTY-Overhead).

---

### Quellen & Lizenzhinweise
* Referenz-Artikel: [„rsync über SSH - Hochperformante Backups und Synchronisation“](https://hyperblog.de/hoergen/posts/2026/2026-09-01-rsync-ssh/) von **hoergen** (Veröffentlicht am 01.09.2026, entdeckt via [planet.ubuntuusers.de](https://planet.ubuntuusers.de/), abgerufen am 03.09.2026 um 09:06 Uhr).
* Lizenz des referenzierten Inhalts: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
* Alle in diesem Artikel präsentierten Benchmark-Messungen und Skripte wurden im Labor von mir auf meinem Framework-Notebook (Intel Core i7-1370P) in 100% RAM-Disk-Umgebung durchgeführt.
* *Transparenz-Hinweis:* Beim Erstellen dieses Artikels sind fast keine Emojis zu Schaden gekommen. Dieser Artikel kann also nicht als digital-vegan oder digital-vegetarisch betrachtet werden.
* *Arbeitsschutz-Hinweis:* Mehrere Docker-Container mussten während der Benchmark-Messungen unter nicht-humanen Bedingungen arbeiten. 🐳👮👷
