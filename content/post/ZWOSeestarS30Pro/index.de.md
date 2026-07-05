+++
title = 'Neuer Zuwachs: ZWO Seestar S30 Pro bestellt'
date = "2026-07-05T20:42:27+02:00"
draft = false
author = "Frank Tornack"
tags = [
    "Astronomie",
    "Smart-Teleskop",
    "Seestar S30 Pro",
    "ZWO",
    "Bresser"
]
+++

Am 4. Juli 2026 habe ich mir ein neues Smart-Teleskop bestellt: das **ZWO Seestar S30 Pro** über Bresser.

## Wie dieser Beitrag entsteht

Ich schreibe diesen Beitrag über mehrere Tage hinweg tagebuchartig mit und werde ihn erst veröffentlichen, wenn das Teleskop geliefert wurde und ich die ersten Bilder aufgenommen habe. Dieser Artikel dokumentiert somit die gesamte Geschichte von der Bestellung bis zum "First Light".

## Chronologie

### Juni 2026: Der Kaufimpuls auf der HAM Radio
Der Impuls für den Kauf entstand auf der diesjährigen [HAM Radio Friedrichshafen](https://www.hamradio-friedrichshafen.de/). Neben der klassischen Amateurfunk-Messe gab es dort auch eine parallel stattfindende Astromesse, auf der ich das Smart-Teleskop zum ersten Mal live sehen und bewundern konnte.

### 4. Juli 2026: Die Bestellung
Das Smart-Teleskop wurde über Bresser bestellt – der Endpreis lag dank eines 15 % Messe-Gutscheins bei 643,55 € inklusive DHL-Versand. Eigentlich wollte ich den Kauf über meine Crypto.com Kreditkarte abwickeln, um zusätzlich noch die 2 % Cashback mitzunehmen. Da jedoch Wochenende war, war eine rechtzeitige Überweisung zur Aufladung der Karte nicht möglich. Weil ich dort nicht genug flüssiges Guthaben hatte, musste ich letztendlich auf eine ganz normale Kreditkarte zurückgreifen.

#### Warum das Seestar S30 Pro?
Der erste und für mich entscheidende Punkt war, dass das Seestar S30 Pro nativ mit **FITS-Dateien** arbeitet – im Gegensatz zu den proprietären **NEF-Dateien** (Nikon Electronic Format) meiner Nikon D5660. 

Hier sind die wichtigsten Unterschiede und Vorteile von FITS im astrofotografischen Alltag:

*   **Astronomischer Standard & Metadaten**: FITS (*Flexible Image Transport System*) ist der absolute Standard in der wissenschaftlichen Astronomie. Der größte Vorteil gegenüber dem NEF-Format ist der standardisierte Header. Eine FITS-Datei speichert nicht nur die reinen Bilddaten des Sensors, sondern bettet umfangreiche astronomische Metadaten direkt ein. Dazu gehören Belichtungszeit, Gain, Sensortemperatur sowie die exakten Koordinaten (Rektaszension/Deklination) des anvisierten Objekts, Filterinformationen und vieles mehr. Stacking-Software wie Siril kann diese Daten direkt auslesen, Bilder automatisch sortieren und kalibrieren. Bei NEF-Dateien fehlen diese astronomischen Header-Daten völlig, was die manuelle Zuordnung und Weiterverarbeitung deutlich erschwert.
*   **Datenformat & Farbtiefe**: Während NEF-Dateien meist in 12- oder 14-Bit-Farbtiefe vorliegen und oft verlustbehaftet komprimiert werden, speichern FITS-Dateien die Sensordaten typischerweise unkomprimiert in 16-Bit (oder sogar 32-Bit Fließkomma). Das bietet einen viel größeren Dynamikumfang und bewahrt feinste Helligkeitsunterschiede in den Nebeln und Sternhaufen vor dem Abschneiden.
*   **Kompatibilität & Verarbeitung**: Um NEF-Dateien in Astro-Software wie Siril, GraXpert oder PixInsight zu nutzen, müssen sie oft erst über Bibliotheken wie LibRaw konvertiert oder aufwendig demosaict (in RGB umgewandelt) werden. FITS-Dateien werden von jeder spezialisierten Astro-Software nativ und ohne Konvertierungsverluste verarbeitet. Das spart Zeit und schont die Bildqualität bei der Kalibrierung mit Darks und Flats.
*   **Sensorausstattung (Sony IMX585 & IMX586)**: Das S30 Pro verfügt über ein Dual-Kamera-System mit zwei hochwertigen Sony-Sensoren. Für die Hauptkamera (Tele) wird der **Sony IMX585** verwendet (1/1.2" Format, 8,3 Megapixel bei 4K-Auflösung), der in der Astrofotografie-Community für seine extreme Lichtempfindlichkeit und sein geringes Rauschen (ohne Verstärkerglühen / Amp-Glow) geschätzt wird. Das ist ein riesiges Upgrade im Vergleich zum Standard Seestar S30, das nur den kleineren IMX662 mit 2,1 Megapixeln nutzt. Die Weitwinkel-Kamera setzt auf den **Sony IMX586** (ebenfalls 8,3 Megapixel bei 4K) für beeindruckende Übersichtsaufnahmen und Milchstraßen-Panoramen.
*   **Akkulaufzeit**: Ein weiterer wichtiger Faktor für mich ist die Akkulaufzeit von 6 bis 7 Stunden, was auch von einem YouTuber[^1] bestätigt wird. Besonders beeindruckt hat mich dabei, dass das Teleskop für ihn sogar mitten im dicht bebauten Tokio problemlos funktionierte.
*   **Stativ-Kompatibilität & Gewicht**: Das geringe Gewicht des Teleskops ist für mich ein entscheidender Pluspunkt. Da ich plane, das Gerät 2027 mit auf meine Reise nach Wakkanai (Japan) zu nehmen, spielt die Mobilität eine große Rolle. Zudem finde ich es klasse, dass ich das Seestar einfach auf mein vorhandenes Rollei-Stativ schrauben kann, was den Transport und Aufbau unterwegs noch unkomplizierter macht.
*   **Sonnenbeobachtung & Sonnenfilter**: Ein weiteres Highlight, auf das ich mich freue, ist die totale Sonnenfinsternis am 2. August 2027 auf der tunesischen Insel Djerba. Der Sonnenfilter des Seestar wird hier sicher gute Dienste leisten, um ein spektakuläres Video dieses seltenen Himmelsereignisses aufzunehmen.
*   **Mosaik-Modus (Milchstraßen-Stitching)**: Ein cooles Software-Feature ist der Mosaik-Modus, mit dem sich größere Himmelsareale automatisch abrasten und als Mosaik zusammenfügen (stichen) lassen. Das ist besonders für große Nebelkomplexe oder Milchstraßen-Panoramen extrem praktisch, da der Sensor ansonsten ein relativ begrenztes Sichtfeld (FOV) hat.

### 5. Juli 2026: Software-Vorbereitungen
Obwohl das Teleskop noch auf dem Weg ist, habe ich heute schon die ersten Softwarepakete für die spätere Astrofotografie-Bildbearbeitung installiert. Über den AUR-Helper `pikaur` wurden `siril` (für Stacking und Bearbeitung), `graxpert-bin` (für die Gradientenentfernung) und `starnet2-bin` (für die Sternenentfernung) auf meinem System eingerichtet:

```bash
pikaur -S starnet2-bin graxpert-bin siril
```

## Abschied von alten Wegbegleitern

Mit dem Einzug des neuen Smart-Teleskops ist es auch an der Zeit, Platz zu schaffen. Ich plane, meine zwei alten Teleskope aus Kindertagen an die Kinder meiner Cousine abzugeben. So verstauben sie nicht länger ungenutzt im Schrank und können hoffentlich eine neue Generation für die Astronomie und den Blick in die Sterne begeistern.

## Erste Eindrücke nach der Lieferung

*Hier kommt später der Bericht rein, wenn das Paket ankommt und ausgepackt wird.*

[^1]: [YouTube: ZWO Seestar S30 Pro Review / Test in Tokyo](https://youtu.be/WHwij7kp5Ao?si=akDDS5MTtnikQk3b)
