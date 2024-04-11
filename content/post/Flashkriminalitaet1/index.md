+++
title = 'Flashkriminalität'
date = 2024-04-11T16:32:55+02:00
draft = false
tags = [
    "Linux",
    "Sicherheit",
    "Betrug",
    "Scam",
    "Amazon",
    "Shopping",
]
+++

Ich möchte meine aktuellen negativen Erfahrungen gern mit der Welt teilen. Damit möchte ich den Betrügern mögliche Opfer abnehmen und dazu beitragen diese Betrugsart aus der Welt zu schaffen. Leider lohnt sie sich immer noch viel zu oft.

# Geschichte
Ich habe vor einigen Tagen einen USB3-Stick mit 512GB auf Amazon gekauft. Mir sagte der USB-Stick hauptsächlich durch sein Design zu. Als ich den USB-Stick wie üblich vormatierte, kam mir auch noch nichts merkwürdig vor. Da ich aber zwei USB-Sticks bestellt hatte (für einen Freund), wollte ich noch (keine Ahnung wie mein Kopf darauf kam), den USB-Stick genauer prüfen. Dabei viel mir die langsame Geschwindigkeit von USB2 auf.

# Analyse
## USB-Version
ich hätte mir eigentlich den blauen USB-Anschluss nur genauer anschauen müssen, um zu sehen das es sich hier nur um einen blaugefärbten USB2-Anschluss handelt. Es fehlten nämlich die entsprechenden Kontakte im Anschluss. Aber als Linux-User habe ich erst die Möglichkeiten über die Software genutzt. In der Ausgabe von `sudo lsusb -v -d 048d:1234` fiel mir schnell die Zeile `bcdUSB               2.00` auf. Mit einem unguten Gefühl ließ ich mir von einer Yacy-Suche bestätigen, es handelt sich bei `bcdUSB` um die USB-Version. Da mein Framework Notebook garantiert USB3-fähig ist, ist es also der Stick. Also habe ich mir den Stick genauer angeschaut und habe im Anschluss nur vier Kontakte gefunden, was eher untypisch ist für USB3. Da ich nun den ersten Betrug gefunden hatte, war die Neugier geweckt. 

{{< imgwebp src="PXL_20240411_055122297~3.jpg" alt="USB-Anschluss blau" width="800" height="600" >}}

## Speicherbereich
Bis hier hätte ich auf Amazon nur eine schlechte Bewertung als Warnung hinterlassen. Sowohl für den Usecase meines Bekannten, als auch für meine Anwendung, waren die Geschwindigkeiten von USB3 nicht notwendig. Aber mit dem Misstrauen packte ich nun andere Testtools aus. Mit f3[^1] steht eine gute Suite zum Kampf gegen Flash-Betrug zur Verfügung. Das Paket kann man unter Arch leicht über das AUR beziehen. Die Installation läuft schnell über `pikaur -S f3`.

Da ich den USB-Stick schon exFAT formatiert hatte, entschloss ich mich für den Test auf Dateiebende. Dazu bin ich mit der Bash in das Hauptverzeichniss des USB-Sticks und habe mit `f3write .` den ersten Teil des Tests gestartet. Dieser Teil schreibt h2w-Dateien auf das Laufwerk, bis dieses vollständig gefüllt ist. Durch die USB2-Geschwindigkeit bei angeblichen 512GB bzw. 500GB im Dateimanager, dauerte dieser Teil etwa neun Stunden und lief über die Nacht. Dabei gab es in der Ausgabe noch keine Auffälligkeiten wie io-Fehler.

Nach dem Aufstehen ging ich gleich zum Laptop und entfernte den USB-Stick auf "sichere" Weise mit sync und mit Information an das Betriebsystem. Den USB-Stick legte ich neben den Notebook und machte einen Reboot, damit wollte ich sicher gehen das ich nur Daten aus dem Flash-Speicher teste und keine Daten aus einem Cache.

Nach etwa 10 Minuten ging es dann mit dem Teil zwei weiter. Den Notebook wieder an den Rechner angeschlossen und das automatissche Mounting machte seinen Job. Dann wieder in das Hauptverzeichnis und mit `f3read .` den Lesetest gestartet. Hier bei werden alle Dateien geprüft und leider wieder mit USB2-Geschwindigkeit. Ab der Datei `51.h2w` gab es in der Ausgabe nur noch Datenteile mit dem Status `corrupted`. In der Datei `491.h2w` drehte sich das ganze nicht nur um, sondern ein paar Blöcke wurden auch als `overwritten` erkannt.

Das Ende vom Test:
```
Data OK:          59.92 GB (125666348 sectors)
Data LOST:       440.06 GB (922871252 sectors)
Corrupted:       440.00 GB (922755780 sectors)
Slightly changed:  0.00 Byte (0 sectors)
Overwritten:      56.38 MB (115472 sectors)
```
Damit wird der Stick auf jeden Fall zurück geschickt und schlecht bewertet.

<sub><sup>Ich werde den USB-Stick nicht verlinken und auch den Produktnamen nicht nennen. Damit will ich verhindern, dass die Betrüger einen SEO-Vorteil mit diesem Beitrag bekommen.</sup></sub>

[^1]: [Fight Flash Fraud](https://fight-flash-fraud.readthedocs.io)