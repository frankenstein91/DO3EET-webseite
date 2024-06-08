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
    "Verschlüsselung",
]
+++

Immer mehr Newsportale berichten von Plänen einer Arbeitsgruppe in der EU[^1], welche sich für eine stärkere Überwachung von Chats aufstellt. Dabei geht es oft auch um die Ende-zu-Ende-Verschlüsselung moderner Chatapplikationen. Dabei geht es den Mitgliedern darum, die Hersteller zu einer Access-by-Design-Lösung zu zwingen. Die Überwachungsorgane wollen den Blindflug durch starke Verschlüsselung vermeiden. Bei diesen Dingen ging es der Politik in der Vergangenheit meist nur um Chats, doch nun sollen alle digitalen Geräte (auch Autos und IoT-Geräte wie Bewegungsmelder) mit einem beim Hersteller hinterlegten Generalschlüssel hinterlegt werden.

Da sich in dem veröffentlichten Papier die Mitglieder der Expertengruppe auch eine Echtzeitzugriffslösung "wünschen", wird damit die bis jetzt fast vertrauenswürdige Kommunikation zur Postkarte. Mit jedem von Dritten hinterlegten Zusatzschlüssel, wird die Kommunikation für die Gesprächspartner zum Glashaus. Verdeutlicht durch dieses Linux-Kommando:

```bash
echo "Hallo Leser" | openssl enc -e -null -nosalt -nopad -base64 -pbkdf2 | tee -a Chat.log | openssl enc -d -null -nosalt -nopad -base64 -pbkdf2
```
1. `echo "Hallo Leser"`: Dieser Befehl erzeugt einfach die Text-Ausgabe "Hallo Leser".
2. `openssl enc -e -null -nosalt -nopad -base64 -pbkdf2`: Startet das Programm openssl mit dem Unterbefehl enc für die Verschlüsselung. Deaktiviert die Verwendung eines symmetrischen Schlüssel, Initialisierungsvektors und dem Padding.
3. `tee -a Chat.log`: Diese Pipe leitet die Ausgabe von openssl enc an zwei Stellen
4. `openssl enc -d -null -nosalt -nopad -base64 -pbkdf2`: Entschlüsslung beim Empfänger

Da der Besitzer des zweiten Schlüssel eine unbeteiligte Gruppe ist, nutze ich im Beispiel `-null`. `-null` deaktiviert die Verwendung eines Schlüssels. Das bedeutet, die Verschlüsselung ist **wirkungslos**, jeder kann die Nachricht entschlüsseln.

**Dieser Befehl dient eher als Beispiel für die Problemverdeutlichung und sollte nicht für tatsächliche Verschlüsselung verwendet werden. Achten Sie immer auf sichere Verschlüsselung!!!**

Egal ob es direkt auf den Endgeräten passiert oder wie in älteren Vorschlägen beim Anbieter, die vertrauliche legale Kommunikation wird durch diese Maßnahmen unmöglich. Dazu muss man sich nur an den Vorfall bei Microsoft im Jahr 2023 erinnern, wo der Anbieter den Cloud-Master-Key verloren hat.

```goat
              +---------------+               
+---------+   |               |  +------------+
|         |   | +----------+  |  |            |
|  Sender +---+-+ Anbieter +--+->+ Empfänger  |
|         |   |               |  |            |
+---------+   |               |  +------------+
              +---------------+               
                                    
                    VS.

              +---------------+               
+---------+   |               |  +------------+
|         |   | +----------+  |  |            |
|  Sender +---+-+ Anbieter +--+->+ Empfänger  |
|         |   |            |  |  |            |
+---------+   |            |  |  +------------+
              +------------+--+
                           |          
                           v                  
                  +---------------+           
                  |               |     
                  | Staat/Polizei |           
                  |               |           
                  +---------------+
                  |   und andere  |
                  +---------------+         

```


# Mögliche Gefahren
Dass die staatliche Gewalt in der Vergangenheit mit einem Überwachungsrausch schon die Grenzen überschritten hat, erkannte der CCC[^2] schon im Jahr 2011. Diese Bedenken sind aktueller denn je, da die Möglichkeiten zur Überwachung von Online-Kommunikation immer weiter zunehmen.

Sollte der Schlüssel in falsche Hände kommen, kann man die Folgen nicht mehr abschätzen. Regierungen könnten sensible Informationen wie politische Meinungen, private Gespräche oder Geschäftsgeheimnisse abfangen. Diese Informationen könnten dazu genutzt werden, Menschen zu erpressen, zu verfolgen oder zu diskriminieren.

[^1]: Europäische Union
[^2]: Chaos Computer Club