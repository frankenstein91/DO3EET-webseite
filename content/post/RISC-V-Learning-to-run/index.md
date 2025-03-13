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