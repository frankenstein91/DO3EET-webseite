+++
title = 'Flashkriminalität - es geht weiter...'
date = 2024-05-04T22:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Sicherheit",
    "Betrug",
    "Scam",
    "Amazon",
    "Shopping",
]
+++

Da ich selbst nicht auf [Mastodon](https://joinmastodon.org/) aktiv bin, aber vom [Erklärbär Marcel Waldvogel](https://dnip.ch/) verlinkt wurde, gehe ich hier etwas auf die Fragen zu meinem Artikel [Flashkriminalität]({{< ref "/post/Flashkriminalitaet1" >}}) unter seiner Verlinkung ein.

<!--more-->
{{< loadtoot instance="waldvogel.family" id="112262847793273940" >}}

## USB3-Pins
Wir erinnern uns an das Bild des blauen USB2-Anschluss? Nein, okay dann hier nochmal:

{{< imgwebp src="PXL_20240411_055122297~3.jpg" alt="USB-Anschluss blau" width="800" height="600" >}}

Und hier nun von einem guten USB-3 auf USB-C Kabel aus meiner Sammlung ein Bild wie es aussehen müsste:

{{< imgwebp src="USB3.jpg" alt="USB3-Anschluss" width="800" height="600" >}}

Sehr deutlich sieht man in der Tiefe (?) des Anschlusses die 5 weiteren Kontakte. Die USB 3.0-Spezifikation fügt zusätzliche Kontakte im Vergleich zu USB 2.0 hinzu, um die Leistung zu verbessern und neue Funktionen zu ermöglichen. Das sind ein zusätzlicher Erdungskontakt, ein paar für die Stromversorgung und ein paar für die SuperSpeed-Datenleitung. Die alten Kontakte bleiben in der Spezifikation für USB3 aber bestehen, daher zusätzliche Pins/Kontakte.

## Angst vor Malware
Ich nenne es lieber Respekt vor Malware. Ich habe den USB-Stick ohne aktiven Automounter formatiert, wie ich es mit jedem neuen Stick mache. Für gebrauchte Sticks beim Datenaustausch aus fremder Hand nutze ich meinen altern Raspberry Pi für eine Prüfung oder gleich als Proxy. Bis auf die Proxy-Variante schützt mich dies leider nicht vor Schadsoftware die auf Firmware-Ebene arbeitet, ich hoffe aber das diese noch sehr selten ist.
### Was ist Malware
Malware ist ein Oberbegriff für Schadprogramme, die Computer oder andere Geräte infizieren können. Ziel der Malware ist es, Schaden anzurichten, Daten zu stehlen oder Geräte anderweitig zu stören bzw. zu missbrauchen.

## war ich trotzdem leichtsinnig?
Ja, war ich. Ich habe den USB-Stick nicht über Wegwerfhardware formatiert. Mich hätte man mit einem schnellen BadUSB-Skript angreifen können oder mit einem USB Killer.
### Was ist BadUSB?
{{< imgwebp src="BadUSB-Stick.jpg" alt="BadUSB-Stick" width="800" height="600" >}}
Bei einem Angriff mit BadUSB-Hardware wird die Firmware eines USB-Sticks, einer externen Festplatte oder eines anderen USB-Geräts umprogrammiert. Diese Geräte geben sich dann meist als HID-Gerät aus, zum Beispiel einer Tastatur. Diese "Tastatur" öffnet dann ganz schnell eine PowerSell und öffnet für die Angreifer die Türen.
### Was ist ein USB Killer?
Wenn ich auch einen BadUSB-Stick besitze, Hardware wie USB Killer habe ich nicht. Bei diesen Geräten handelt es sich um Hardware die den USB-Anschluss oder gar das ganze System dauerhaft beschädigen oder zerstören. Die meisten Geräte arbeiten nach einem einfachen Prinzip:
1. Kondensatoren werden über die 5V der USB-Versorgung geladen
2. warten bis genug Leistung gespeichert ist
3. Spannungswandler wird zugeschaltet und die Spannung auf 200V und höher erhöht
4. diese hohe Spannung wird Richtung USB-Host geleitet... über die Datenleitungen oder über die 5V-Leitung

Besitzt der Rechner keine Schutzfunktion, kommt es zu einer Überspannung im System.

## Windows-Problem
Jeder Windows-Benutzer kennt Ihn, ReactOS-Nutzer kopieren Ihn und Linux-User lachen über ihn... der Bluescreen of Death. Der Bluescreen kann erstmal bis auf den Systemausfall keinen Schaden anrichten. Im Umfeld von Firmen kann aber auch ein Ausfall teuer werden.

[Marius Tivadar](https://github.com/mtivadar) hat vor einigen Jahren eine spannende Möglichkeit gefunden Windows-Systeme zum Bluescreen zu führen. Der Angriff besteht darin, den Namen des Stammverzeichnisses sowie dessen INDEX_ALLOCATION an drei Stellen zu ändern.
Die automatische Wiedergabe ist standardmäßig aktiviert und führt beim Einstecken des USB-Sticks zum Absturz. Selbst wenn die automatische Wiedergabe deaktiviert ist, stürzt das System beim Zugriff auf eine Datei auf dem Stick ab, hier hilft der Virenscanner zum Absturz.
Den PoC und eine ausführliche Anleitung gibt es auf GitHub [windows10_ntfs_crash_dos](https://github.com/mtivadar/windows10_ntfs_crash_dos/tree/master).

## Reaktion von Amazon
Meine Bewertung zum USB-Stick wurde zweimal mit einem Hinweis auf einen ungenannten Regelverstoß nicht veröffentlicht. Das Produkt haben wir gemeldet und es ist zum aktuellen Zeitpunt immer noch im Verkauf unter dem selben Link. 