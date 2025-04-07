+++
title = 'Zeitmanipulation'
date = 2025-04-07T13:58:56+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Hardware",
    "GPS",
    "NTP",
    "Zeit",
    ]
+++

Ich glaube jeder Mensch beschäftigt sich mindestens einmal in seinem Leben mit der Zeit. Dabei geht die Faszination nicht nur von Chronométrophilia aus, sondern einfach auch vom normalen Zeit geprägtem Leben. Der eine wartet auf die Liebe seines Lebens am Bahnhof, der andere nur auf den Feierabend. Für beide tickt die Uhr.  
Mich begeistert die Zeit besonders seit einem Artikel auf [sumikai.com](https://sumikai.com/nachrichten-aus-japan/studie-zeigt-dass-zeit-auf-dem-tokyo-skytree-tower-etwas-schneller-vergeht-271550/).  
Die Relativitätstheorie, insbesondere die Allgemeine Relativitätstheorie von Albert Einstein, sagt uns, dass die Zeit nicht für jeden gleich schnell vergeht. Sie hängt davon ab, wie stark das Gravitationsfeld ist und wie schnell sich jemand bewegt. Im Artikel wird dies mit dem Skytree in Tokyo wissenschaftlich nachgewiesen.

Auch im Urlaub ist die Zeit für mich relevant. Auf der einen Seite, um den Zug nicht zu verpassen, doch auch als elementarer Bestandteil von GPS zur Navigation in großen Städten. 

Und die NTP-Zeit ist für mich im beruflichen Leben für die Server administration von Bedeutung. Hier ist es immer wieder eine Anforderung, dass die Server mit einem zentralen Zeitserver in Sync sind und damit die Zeiten gleich sind.

# Warum ist NTP so wichtig?
Nun, Server erledigen unzählige Aufgaben, protokollieren jeden Schritt in Logdateien, speichern Daten in Datenbanken und kommunizieren miteinander. Wenn die Zeit auf diesen Systemen nicht übereinstimmt, entsteht ein heilloses Durcheinander. Zeitstempel in Logdateien werden inkonsistent, was die Fehlersuche zu einem Ratespiel macht. Stell dir vor, ein Fehler tritt auf, und du versuchst anhand der Logs herauszufinden, was passiert ist. Unterschiedliche Zeitangaben machen es unmöglich, die Ereigniskette nachzuvollziehen.  
Auch für die reibungslose Funktion deiner Anwendungen ist eine genaue Zeit entscheidend. Viele Prozesse, wie die Replikation von Datenbanken oder die Synchronisation von Dateien, verlassen sich auf eine konsistente Zeitbasis. Zeitabweichungen können hier zu Datenverlust oder Fehlfunktionen führen. Im Bereich der Sicherheit ist eine genaue Zeit sogar noch kritischer. Die Analyse von Sicherheitsvorfällen, die Gültigkeit von Zertifikaten und die Synchronisation von Sicherheitstoken – all das hängt von präzisen Zeitangaben ab.

# Warum ist die genaue Zeit bei GPS wichtig?
Wir nutzen GPS (Global Positioning System) heute fast täglich – sei es im Auto, auf dem Smartphone oder in der Smartwatch. Im Kern basiert GPS auf einem einfachen physikalischen Prinzip: `Entfernung = Geschwindigkeit × Zeit`. Das GPS-System besteht aus einem Netzwerk von Satelliten, die die Erde umkreisen. Jeder dieser Satelliten sendet kontinuierlich Signale aus. Diese Signale enthalten Informationen über die Position des Satelliten und, ganz entscheidend, die **exakte** Uhrzeit, zu der das Signal gesendet wurde.  
Dein GPS-Empfänger ließt diese Signale von mehreren Satelliten gleichzeitig. Er vergleicht die im Signal kodierte Sendezeit mit der Zeit, zu der er das Signal empfängt. Aus dieser Differenz kann er berechnen, wie lange das Signal unterwegs war. Da wir über Lichtgeschwindigkeit reden, sind diese Zeitunterschiede sehr klein.

Die genaue Positionierung durch GPS ist also untrennbar mit einer extrem genauen Zeitmessung verbunden. Es ist die Fähigkeit, Zeitintervalle im Nanosekundenbereich zu messen und zu verarbeiten, die es uns ermöglicht, unseren Standort so präzise zu bestimmen.

# Welche Angriffe gibt es?
## GPS
Gerade weil die präzise Zeit für GPS so fundamental ist, stellt sie auch ein attraktives Ziel für Angreifer dar. Die Störung oder Manipulation dieser Zeitsignale kann erhebliche Auswirkungen haben.

Jamming... Die einfachste und wahrscheinlich häufigste Form der Störung. Ein Angreifer verwendet einen Sender, um auf den GPS-Frequenzen starkes Rauschen oder Störsignale zu senden. Der Empfänger verliert den Satellitenkontakt und kann keine Position oder genaue Zeit mehr bestimmen. Es handelt sich um einen "Denial of Service"-Angriff. 

Richtig fies ist aber das GPS-Spoofing... Dies ist eine wesentlich raffiniertere Angriffsmethode auf das GPS-Signal. Statt die Signale nur zu blockieren, sendet der Angreifer gefälschte GPS-Signale. Diese Signale imitieren echte Satellitensignale, enthalten aber falsche Informationen – insbesondere eine falsche Zeit und/oder falsche Satellitenpositionen. Der Empfänger berechnet eine falsche Position und/oder eine falsche Uhrzeit, ohne es zu merken. Das System glaubt, es sei woanders oder es sei eine andere Zeit. Dies kann dazu führen, dass Schiffe bzw. Flugzeuge vom Kurs abkommen, Drohnen in falsche Gebiete explodieren oder zeitkritische Systeme gestört werden.

