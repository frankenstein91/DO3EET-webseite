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
Um das Image von auf die SD-Karte zu bringen, nutze ich die sehr einfache Software BalenaEtcher.