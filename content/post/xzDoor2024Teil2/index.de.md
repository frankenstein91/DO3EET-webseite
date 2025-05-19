+++
title = 'CVE-2024-3094 xz/sshd Backdoor Fortsetzung'
date = 2024-04-08T08:45:40+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Sicherheit",
]
+++

Vor ein paar Tagen habe ich ein kleines Testskript veröffentlicht, ohne auf die Ausgabe einzugehen. Diesen Fauxpas möchte ich nungern nachholen. Wir nutzen dafür das Skript aus dem Betrag [Teil 1]({{< ref "/post/xzdoor2024teil1" >}}).

Mein kleines Werk sucht im ersten Teil alle ausführbaren Dateien (Owner hat das Recht zum ausführen) mit dem Namen `xz`. Ich habe mich dazu entschlossen, die suche nicht auf den `$PATH` zu beschränken, da ich zum Beispiel eine xz-Binärdatei in einem Flatpak gefunden habe. In der Schleife überprüfe ich die Versionsnummern der Binärdatei und der liblzma auf drei Zustände.
1. ist es eine direkt betroffene Versionsnummer... in diesem Fall besteht vielleicht dringender Handlungsbedarf.
2. Mein Skript prüft ob es eine Version ist, an der die verdächtige Person Jia Tan mitgearbeitet hat. Bis jetzt gibt es zwar keine Beweise für weitere Backdoors, aber ich finde es doch suspekt.
3. Auch Hans Jansen ist suspekt... daher warne ich auch ab dem Zeitpunkt seines ersten Beitrages.

Danach suche ich das System nach SSH-Servern mit dem Namen `sshd` ab. Jeder dieser ausführbaren Server wird auf zwei Zustände geprüft, welche laut aktuellen Erkentnissen notwendig sind um die Backdoor nutzbar zu machen.
1. ist `sshd` mit der `liblzma` verlinkt. Anders kommt die Backdoor nach aktuellen Wissenstand nicht in die Serveranwendung.
2. Der Entwickler hat den Pfad beschränkt, daher muss für eine Backdoorausführung der SSH-Server unter `/usr/sbin` liegen.

In vielen Artikeln über die Backdoor gab es Hinweise die Backdoor würde bei gesetzter `LD_BIND_NOT=1` nicht funktionieren. Daher habe ich mich dazu entschlossen, dies auf den Systemen zu prüfen. `LD_BIND_NOT=1` unter Linux deaktiviert das dynamische Binden von Symbolen bei der Ausführung von Programmen. Stattdessen werden alle Symbole sofort beim Laden des Programms aufgelöst. Dies kann für Debugging-Zwecke verwendet werden, sollte jedoch mit Vorsicht eingesetzt werden, da es die Leistung beeinträchtigen und unerwartetes Verhalten verursachen kann. Die Backdoor hat aber "Angst" vor allem was nach Debugging aussieht.

Aus dem selben Grund erfolgt auch eine Prüfung der Umgebung auf `LD_DEBUG` und `LD_PROFILE`.

Warum die Hintertür bei gesetzter TERM-Environmentvariable nicht gestartet wird, habe ich noch nicht verstanden... aber es scheint eine Tatsache zu sein. Weiterhin wird die Sicherheitslücke nur ausnutzbar, wenn eine LANG-Environmentvariable gesetzt ist. Eine entsprechende Prüfung habe ich also auch eingebaut.

Da unser Akteur Jia Tan auch am Kernel gearbeitet hat und nach meinem Wissen hier auch an xz und LZMA, habe ich eine Warnung vor Linux-Kernels mit entsprechendem Support hinterlegt. Ob es hier eine Lücke gibt, weiß ich nicht... aber auch hier: suspiciosus.

Daher würde ich sagen: **Die Ausgabe meines Skriptes sollte jeder selbst bewerten**, es bietet aber eine gute Übersicht. Die Sicherheit der Systeme ist aber auch von anderen Fakturen abhänig (Firewall, Jumpserver, usw.). 

Die [Information des BSI](https://www.bsi.bund.de/SharedDocs/Cybersicherheitswarnungen/DE/2024/2024-223608-1032.html) gibt einen sehr guten Überblick über den Vorfall, andere Tools und Lösungen. Für ArchLinux nutzer gibt es eine fast-Entwarnung in den  [ArchLinux News](https://archlinux.org/news/the-xz-package-has-been-backdoored/).

Falls es noch Fragen gibt und offene Punkte... etwas weiter unten ist Platz dafür ;) 