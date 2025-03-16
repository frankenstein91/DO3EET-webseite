+++
title = 'RISC-V Learning to Run'
date = 2025-03-13T16:26:01+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Hardware",
    "RISC-V",
    ]
+++

Ich freue mich riesig, euch heute auf eine spannende Reise mitzunehmen. Vor kurzem habe ich mir das brandneue Milk-V Jupiter Board zugelegt, und ich kann es kaum erwarten, die ersten Schritte der Installation mit euch zu teilen. In diesem Blogbeitrag werde ich euch durch den gesamten Prozess führen, von der Vorbereitung der Hardware bis zur erfolgreichen Inbetriebnahme des Boards... so wie ich Ihn gerade erlebe. Ich hoffe, meine Erfahrungen werden euch hilfreich sein und mir eine gute Erinnerung, falls ich da nochmal durch muss.

# Vorbereitung der SSD

Wie einigen vielleicht bekannt ist, habe ich eine Kwumsy K3 Tastatur mit SSD. Diese habe ich bis jetzt genutzt, um Linux-ISO-Dateien für mögliche Installationen zu lagern. Doch dieser SSD kommt nun eine neue Aufgabe zu. Aber dafür mache lösche ich erstmal alle Daten von dieser NVME-SSD über das USB-C Interface der Tastatur mit gparted.

Danach die SSD in den Anschluss im Motherboard eingebaut. Dabei hatte ich das erste Problem, die Schraube passte nicht in die Mutter... nachden ich die Schraube einmal von der anderen Seite durch das Board geschraubt hatte, löste sich das Problem sschnell.

{{< imgwebp src="PXL_20250313_173415561.jpg" alt="Milk-V Jupiter mit SSD und Lüfter" width="1024" height="1024" >}}

# Vorbereitung erster Boot

Für den ersten Boot möchte ich Fedora 41 auf einer SD-Karte nutzen, weil es laut der Anleitung über eine leichteren Wege ist. Dafür nutze ich das Image von [Fedoravforce](https://images.fedoravforce.org/Jupiter). Das Passwort für den `root`-Account ist `riscv`.  
Um das Image von auf die SD-Karte zu bringen, nutze ich die sehr einfache Software [BalenaEtcher](https://github.com/balena-io/etcher). Nachdem Flashing wandert die SD-Karte vom Laptop in das neue Board.

# erster Boot

Da ich noch kein Gehäuse und ATX-Netzteil beim ersten Boot hatte, nutze ich ein USB-C Laptop-Ladegerät. Der Monitor ist über HDMI angeschlossen und Tastatur/Maus über die USB2-Anschlüsse. Die SSD hat weiter keine Daten. Anders als "normale" PCs bootet das System beim Verbinden der Stromversorgung sofort. 

Der erste Versuch mit einer 512GB Karte schulg leider fehl. Der zweite Versuch mit Fedora leider auch:
```
try sd...
bm:3
sys: 0x200
```

# Ubuntu Boot

Also geht es weiter mit den Images von Ubuntu... [GitHub](https://github.com/milkv-jupiter/jupiter-ubuntu-build/issues). Auch hier nutze ich wieder [BalenaEtcher](https://github.com/balena-io/etcher).

Auch hier ein Loop mit der Meldung...
```
try sd...
bm:3
sys: 0x200
```

# Verdacht USB-C PD

Nun vermute ich die Probleme beim USB-C PD.

Nach dem Test mit einem ATX-Netzteil einen Tag später, konnte ich diesen Verdacht bestätigen. Mit diesem Netzteil booted das System.

# Der erste Fehler

Auch ich scheine einen Fehler mit der WiFi-Hardware zu haben, wie auch der Youtuber geerlingguy auf seinem GitHub berichtet. Der Funkchip scheint durch das System nicht gefunden zu werden.
Am Freitag (14. März) schrieb auch ich eine Mail zu diesem Thema an den Support.

# am nächsten Tag

Der Fehler mit dem WiFi ist ein Problem für später, es scheint doch kein Hardware-Problem zu sein.
Mit der Linux-Variante Irradium konnte ich das System nun vollständig zum laufen bekommen. Das Image dafür bekommt man über [dl.irradium.org/irradium/images/](https://dl.irradium.org/irradium/images/milk_v_jupiter/).

Das Betriebsystem habe ich nun auf einer SD-Karte und möchte die SSD später als Datenlaufwerk nutzen.

# Update des Irradium

das Update läuft nach meinem Wissen mit diesen beiden Befehlen, da es aber für mich ein neues System ist... muss ich noch lernen.

```shell
ports -u
prt-get sysup
```

# nach einer Nacht Updates abwarten

Für mein Projekt brauche ich auf dem System noch Java und Apache ant.
Dafür habe ich erst alle `prtdir` in der `/etc/prt-get.conf` aktiviert. Und dann noch eine eine Runde `ports -u`. 

Meine Wunschpakete habe ich mit `PIP_ROOT_USER_ACTION=ignore prt-get depinst ntp git btrfs-progs htop screen openjdk21-jdk` installiert. Und anschließend hieß es wieder lange warten.

Danach habe ich ant aus den Quellcodepaket installieren müssen:  
Den Anfang macht ein neues Anmelden über SSH um die ENV neu zu laden...
```shell
export ANT_HOME=/usr/local/ant
export PATH=${PATH}:${ANT_HOME}/bin
mkdir /usr/local/ant
mkdir antsrc
curl "https://dlcdn.apache.org//ant/source/apache-ant-1.10.15-src.tar.xz" --output apache-ant-1.10.15-src.tar.xz
unxz apache-ant-1.10.15-src.tar.xz
cd antsrc/
tar xvf ../apache-ant-1.10.15-src.tar
sh build.sh -Ddist.dir=/usr/local/ant dist
ant -diagnostics
```

# Build and use Yacy

Nun da alles für den Yacy-Server vorbereitet ist, geht es damit auch schon weiter.
Die Daten sollen auf einer NVME-SSD mit BTRFS liegen, daher nutze ich den Befehl `mkfs.btrfs -f /dev/nvme0n1` um die einzige NVME mit BTRFS zu überschreiben. Und dann wird das ganze noch ins VFS eingebunden.

```shell
mkdir /yacyDisk
mount /dev/nvme0n1 /yacyDisk/
```

Im Anschluss folgt Download, Build und Start von Yacy, was durch Java echt easy war.
```shell
git clone --depth 1 https://github.com/yacy/yacy_search_server.git
cd yacy_search_server
ant clean all
./startYACY.sh
```

Und damit bleibt nur noch ein Punkt übrig, System runterfahren und RTC-Batterie einbauen.