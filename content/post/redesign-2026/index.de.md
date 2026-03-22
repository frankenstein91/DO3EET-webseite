+++
title = 'System-Log: Redesign erfolgreich auf die Produktivumgebung ausgerollt'
date = 2026-03-20T22:45:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Website",
    "Linux",
    "Design",
    "Hobby",
]
+++

```bash
[frank@do3eet-terminal ~]$ git checkout redesign
[frank@do3eet-terminal ~]$ git merge master
[frank@do3eet-terminal ~]$ deploy --force-coolness
```

Falls ihr euch beim Laden der Seite kurz gefragt habt, ob ihr versehentlich per SSH auf einem Mainframe aus den 90ern gelandet seid: **Keine Sorge, das ist volle Absicht!**

Ich habe die letzten Tage damit verbracht, meiner digitalen Heimat einen komplett neuen Anstrich zu verpassen. Weg von "Standard-Webseite", hin zu einem Design, das meine Leidenschaften widerspiegelt: Linux, Technik und ein ordentlicher Schuss Science-Fiction.

## Was ist neu im Terminal?

### 1. Die Matrix hat dich (und deinen Browser)
Das neue Design setzt voll auf **Matrix-Grün auf Tokyo-Night-Blau**. Es gibt jetzt subtile Scanlines, einen blinkenden Cursor und ein Layout, das sich wie ein Verzeichnisbaum (`tree`) anfühlt. 

Besonderes technisches Schmankerl: Schaut mal oben in den Header des Terminal-Fensters. Dort wird euch ein dynamischer Prompt angezeigt, der erkennt, welchen Browser ihr nutzt (z.B. `[Firefox@do3eet.pages.dev /var/www]#`). Ein kleines clientseitiges JavaScript macht es möglich – natürlich völlig lokal und ohne Datenspeicherung.

### 2. Die große Inventur (Tag-Cleanup)
Ich muss gestehen: Meine Schlagworte (Tags) waren über die Zeit etwas... unordentlich. Ich habe aufgeräumt! 
- Viele kleinteilige Tags wurden konsolidiert (z.B. alles rund um Messenger, Netzwerk oder Kulinarik).
- Die neue Kategorie **"Hobby"** ist jetzt prall gefüllt mit meinen Bastelprojekten – vom USB-C-Löten am Weihnachtsstern bis zum QMK-Firmware-Abenteuer meiner Tastatur.

### 3. Digitale Schätze und Easter-Eggs
Ich konnte es nicht lassen, ein paar kleine Überraschungen einzubauen:
- **Achievement Unlocked:** Wer die Seite länger als 5 Minuten offen lässt (vielleicht beim gemütlichen Lesen eines Japan-Berichts?), erhält eine kleine Hommage an alte Röhrenmonitore. Nein, euer Bildschirm geht nicht kaputt, es ist nur ein "simulierter Burn-In".
- **The Ark of Truth:** Stargate-Fans sollten mal ganz nach unten scrollen... aber Vorsicht, *Origin* ist die Quelle der Wahrheit.

## Warum das Ganze?
Als Informatiker und Funkamateur verbringe ich viel Zeit in Terminals. Warum also sollte mein Blog anders aussehen? Die neue Optik ist schneller, fokussierter und bietet trotzdem genug Platz für meine Reisebilder aus Hokkaido oder Tokyo.

Wie gefällt euch der neue Look? Schreibt mir einen Kommentar (oder funkt mich an) – ich bin gespannt auf euer Feedback!

```bash
[frank@do3eet-terminal ~]$ exit
logout
Connection to do3eet.pages.dev closed.
```
