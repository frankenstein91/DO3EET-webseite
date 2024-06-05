+++
title = 'Warum Chatten in der EU bald wie Verschlüssung mit NULL Cipher sein könnte'
date = 2024-06-05T12:37:54+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Datenschutz",
    "Tracking",
    "Chat",
    "WhatsApp",
    "Telegram",
    "Threema",
    "Signal",
    "Verschlüsslung",
]
+++

Immer mehr Newsportale berichten von Plänen einer Arbeitsgruppe in der EU, welche sich für eine stärkere Überwachung von Chats aufstellt. Dabei geht es oft auch um die Ende-zu-Ende-Verschlüsslung moderner Chatapplikationen. Dabei geht es den Mitgliedern die Herrsteller zu einer Access-by-Design-Lösung zu zwingen. Die Überwachungsorgane wollen den Bildflug durch starke Verschlüsslung vermeiden. Bei diesen Dingen ging es der Politik in der Vergangenheit meist nur um Chats, doch nun sollen alle digitalen Geräte (auch Autos und IoT-Geräte wie Bewegungsmelder) mit einem beim Hersteller hinterlegten Generalschlüssel hinterlegt werden.

Da sich in dem veröffentlichten Papier die Mitglieder der Expertengruppe auch eine Echtzeitzugriffslösung "wünschen", wird damit die bis jetzt fast vertrauenswürdige Kommunikation zur Postkarte. Mit jedem von Dritten hinterlegten Zusatzschlüssel, wird die Kommunikation für die Gesprächspartner zum Glashaus. Verdeutlicht durch dieses Linux-Kommando:

```bash
echo "Hallo Leser" | openssl enc -e -null -nosalt -nopad -base64 -pbkdf2 | tee -a Chat.log | openssl enc -d -null -nosalt -nopad -base64 -pbkdf2
```

Egal ob es direkt auf den Endgeräten passiert oder wie in älteren Vorschlagen beim Anbieter, die vertrauliche legale Kommunikation wird durch diese Maßnahmen unmöglich. Dazu muss man sich nur an den Vorfall bei Microssoft im Jahr 2023 erinnern, wo der Anbieter den Cloud-Master-Key verloren hat. 