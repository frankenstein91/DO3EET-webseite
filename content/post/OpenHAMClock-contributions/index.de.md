+++
title = '🧩 OpenHAMClock AddOns: Mehr als nur eine Uhr'
date = 2026-03-20T21:00:00+01:00
draft = true
author = "Frank Tornack"
tags = [
    "Funk",
    "Hobby",
    "Software",
    "Open Source",
]
+++

In der Welt des Amateurfunks ist Information alles. Wer **OpenHAMClock** nutzt, schätzt bereits die übersichtliche Darstellung von Zeit, Wetter und Ausbreitungsbedingungen. Doch als Informatiker konnte ich es nicht lassen: Ich wollte mehr Interaktivität und Automatisierung. 

In den letzten Wochen habe ich intensiv an einer Reihe von **AddOns** und Dokumentationen gearbeitet, um die OpenHAMClock zu einer echten Schaltzentrale für den Shack zu erweitern.

<!--more-->

## Meine Beiträge im Überblick

Alle meine Beiträge basieren auf dem Konzept von **Userscripts** (z.B. für Tampermonkey). Das ermöglicht es, Funktionen direkt in die Weboberfläche zu integrieren, ohne den Kern-Code der Uhr verändern zu müssen.

### 1. APRS Auto-Position
Für portable Operator (SOTA/POTA) oder Mobil-Stationen ist dieses AddOn ein Game-Changer. Es verfolgt eine bestimmte SSID über die `aprs.fi` API und aktualisiert die Position der Uhr automatisch.
- **Intelligentes Update:** Die Position wird nur aktualisiert, wenn man sich mehr als 50 Meter bewegt hat.
- **Nahtlose Integration:** Sobald sich der Standort ändert, berechnet die Uhr alle Pfade und Kartenansichten neu.

### 2. APRS Newsfeed (Posteingang)
Wer möchte nicht über neue APRS-Nachrichten informiert werden, ohne ständig auf das Handfunkgerät schauen zu müssen?
- Zeigt die 10 neuesten Nachrichten direkt im UI an.
- Ein dezenter roter Badge signalisiert neue Eingänge.
- Unterstützt Deutsch, Englisch und Japanisch.

### 3. HFJ-350M Antennen-Rechner
Die **Comet HFJ-350M** ist eine beliebte portable Mehrband-Antenne, aber das Abgleichen der Teleskop-Länge kann nervig sein. Mein Rechner nimmt die Arbeit ab:
- Berechnet die exakte Länge in Millimetern für jede Frequenz von 160m bis 6m.
- Zeigt die benötigten Spulen-Kombinationen grafisch an.
- Inklusive Informationen zur Empfindlichkeit (kHz/cm), um das SWR perfekt zu treffen.

## Die Infrastruktur für die Community
Neben den funktionalen Tools war es mir wichtig, dass auch andere Entwickler leicht eigene Ideen umsetzen können. Daher habe ich zwei grundlegende Guides verfasst:

- **AddOn Development Guide:** Ein Standard für die Integration eigener Tools. Ich habe eine "AddOn Drawer" Logik (🧩-Icon) implementiert, damit verschiedene AddOns sauber nebeneinander existieren können, ohne das Design zu stören.
- **Self-Hosting Guide:** Eine Anleitung für alle, die ihre OpenHAMClock (und die AddOns) auf eigener Hardware wie einem Raspberry Pi oder in Docker betreiben wollen. Hier gehe ich besonders auf Sicherheitsaspekte bei API-Keys ein.

## Fazit
Open Source lebt vom Mitmachen. Durch die AddOn-Schnittstelle ist die OpenHAMClock nun deutlich flexibler geworden. Ich bin gespannt, welche Ideen die Community als nächstes umsetzt!

Schaut euch den Code gern auf GitHub an: [frankenstein91/openhamclock](https://github.com/frankenstein91/openhamclock/tree/main/AddOns)

73 de DO3EET
