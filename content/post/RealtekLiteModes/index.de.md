+++
title = 'Realtek Lite Modes'
date = 2025-02-15T18:23:43+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Netzwerk",
    "Realtek",
]
+++

ich habe mir für eine Netzwerkkarte mit einem RTL8157-Chip gekauft. Dabei sind mir die proprietären Lite-Modes der Netzwerkkarte aufgefallen. Als ich mich über diese belesen wollte, bin ich nur auf sehr wenig Informationen gestoßen und versuche nun hier meine Erkenntnisse an einem Punkt zu sammeln. Ich hoffe der Beitrag kann durch die Kommentarfunktion "leben" und sich erweitern.

# Was sind die Realtek Lite Modes?
Die Lite Modes des Realtek Netzwerk-Chips sind spezielle Betriebsmodi, die im Vergleich zu den Standard-Modi eine reduzierte Datenrate ermöglichen.
Dabei benutzt der Modi laut der Dokumentation nur zwei Adernpaare, in dem Fall die AB-Paare. Eine Ausnahme bildet hier GIGA Lite, mit nur zwei Adern.
Da der Chip die automatische Erkennung und Korrektur von Fehlern in der Adernpaarzuordnung unterstützt, denke ich es müssen nur vier beliebige Adern funktionieren. 

|  Modusname  | Datenrate | Benötigte Adern |
|:-----------:|:---------:|:---------------:|
| 5G Base-T   | 5 Gbps    | 8               |
| 5G Lite     | 2.5 Gbps  | 4               |
| 2.5G Base-T | 2.5 Gbps  | 8               |
| 2.5G Lite   | 1 Gbps    | 4               |
| 1000 Base-T | 1 Gbps    | 8               |
| GIGA Lite   | 500 Mbps  | 2               |
| 100BASE-TX  | 100 Mbps  | 4               |
| 10BASE-T    | 10 Mbps   | 4               |

# Für was kann man diese Modes nutzen?
Die Lite Modes bieten eine kostengünstige Möglichkeit, die Geschwindigkeit älterer Netzwerke zu erhöhen, ohne die gesamte Infrastruktur (Kabel) aufrüsten zu müssen. Auch kann man sicherlich mit den Lite Modes und etwas Bastelarbeit ein 8-adriges Kabel für zwei Verbindungen nutzen.