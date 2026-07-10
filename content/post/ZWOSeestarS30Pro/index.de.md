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
Obwohl das Teleskop noch auf dem Weg ist, habe ich heute schon die ersten Softwarepakete für die spätere Astrofotografie-Bildbearbeitung installiert. Über den AUR-Helper `pikaur`[^2] wurden `siril`[^3] (für Stacking und Bearbeitung), `graxpert-bin`[^4] (für die Gradientenentfernung) und `starnet2-bin`[^5] (für die Sternenentfernung - mittlerweile leider closed source) auf meinem System eingerichtet:

```bash
pikaur -S starnet2-bin graxpert-bin siril
```

Anschließend habe ich in den Einstellungen von Siril direkt die Pfade zu den beiden externen Programmen hinterlegt, damit Siril diese für die automatische Bearbeitung aufrufen kann:
*   StarNet2: `/usr/bin/starnet2`
*   GraXpert: `/usr/bin/graxpert-bin`

### 7. Juli 2026: Versand und FITS-Viewer-Integration
*   **Versand erfolgt**: Um 10:10 Uhr kam die Nachricht, dass das Paket in den Versand gegangen ist. Eine DHL-Sendungsnummer liegt zwar schon vor, das DHL-Tracking zeigt unter dieser Nummer allerdings derzeit noch keinerlei Informationen an.
*   **FITS-Viewer integriert**: Um nach der Lieferung des Teleskops direkt richtig loslegen zu können, habe ich bereits einen FITS-Viewer in meine Website eingebaut. Ein großes Dankeschön geht an Reddit-User `u/sjmoodyiii` ([Link zum Beitrag](https://www.reddit.com/r/seestar/comments/1cg0vbe/comment/l1sof20/)), der freundlicherweise Beispieldateien im Internet hostet und mir so das Testen ermöglicht hat.

### 9. Juli 2026: Lieferung & First Light
*   **Paket angekommen**: Das Paket von DHL kam heute an.
*   **Auspacken & Laden**: Ich habe das Teleskop direkt ausgepackt und – wie man es bei jedem elektronischen Gerät tun sollte – erst einmal zum Laden angeschlossen.
*   **App-Download**: Parallel dazu habe ich den Download der Seestar-App gestartet. Mit einer Größe von rund 1,3 GiB ist das kein Leichtgewicht – an einem DSL-7000-Anschluss dauert das eine Weile und ist insbesondere für zukünftige Reisen im Ausland eine wichtige Information, die man vorab einplanen sollte.
*   **First Light**: Glücklicherweise klärte sich der Himmel am späten Abend auf, sodass ich ab 23:10 Uhr direkt für die erste Beobachtungssession (NGC 7000) nach draußen gehen konnte.

## Abschied von alten Wegbegleitern

Mit dem Einzug des neuen Smart-Teleskops ist es auch an der Zeit, Platz zu schaffen. Ich plane, meine zwei alten Teleskope aus Kindertagen an die Kinder meiner Cousine abzugeben. So verstauben sie nicht länger ungenutzt im Schrank und können hoffentlich eine neue Generation für die Astronomie und den Blick in die Sterne begeistern.

## Erste Eindrücke nach der Lieferung

Nachdem der DHL-Bote das Paket heute übergeben hatte, ging es sofort ans Auspacken. Zwar liegt dem Seestar S30 Pro im Gegensatz zu manch anderen Modellen kein klassischer Hartschaum-Koffer (Hardcase) bei, aber die stattdessen mitgelieferte Tragetasche macht einen äußerst hochwertigen Eindruck. Besonders praktisch: Das gesamte Zubehör – darunter ein kompakter Sonnenfilter mit magnetischer Halterung (den ich allerdings noch nicht testen konnte) und ein kompaktes Stativ – war bereits ordentlich in der Tasche verstaut und einsatzbereit einsortiert.

Als erster Schritt wurde das Teleskop erst einmal zum Laden angeschlossen. Parallel dazu läuft bereits der Download der zugehörigen Seestar-App. Mit stattlichen 1,3 GiB ist die App ein echtes Schwergewicht. An meinem DSL-7000-Anschluss erfordert das etwas Geduld und ist auch ein wichtiger Aspekt, den man im Hinterkopf behalten sollte, wenn man das Teleskop im Ausland oder unterwegs über mobile Daten einrichten möchte.

Der nächste Schritt nach dem Laden ist das Verbinden des Teleskops mit dem Smartphone. Hierfür ist es notwendig, in der App einen entsprechenden Account anzulegen. Sobald die Verbindung steht, kann man das WLAN-Passwort des Seestar ändern (eine sehr empfehlenswerte Sicherheitsmaßnahme) und direkt die Firmware auf den aktuellen Stand bringen. Sobald das erledigt ist und das Wetter mitspielt, folgt das „First Light“.

## First Light: Die erste Nacht im Einsatz

Ich hatte unglaubliches Glück: Direkt am Abend nach der Lieferung zeigte sich der Himmel wolkenfrei und bot perfekte Bedingungen für das „First Light“. Um 23:10 Uhr ging es also mit dem frisch geladenen Seestar nach draußen.

### Stativ und Befestigung

Da ich noch keinen Stativkopf mit einem passenden 3/8-Zoll-Gewinde besitze, habe ich mein vorhandenes Rollei-Stativ direkt ohne Kopf genutzt und das Teleskop direkt auf die Stativschraube gedreht. Im Vergleich zu meiner Nikon D5660 ist das Seestar S30 Pro doch ein relativ großes und massives Gerät. Das Aufschrauben direkt auf das nackte Stativgewinde fühlte sich anfangs etwas ungewohnt und unsicher an – man hat das Gefühl, die Balance nicht optimal halten zu können, während man das schwere Teleskop dreht. Sobald das Gewinde jedoch vollständig eingedreht ist, sitzt das Teleskop absolut fest und sicher.

### App-Einstellungen und das erste Ziel: NGC 7000

Vor dem Start habe ich die Seestar-App auf Englisch umgestellt. Die deutsche Übersetzung der App wirkt an vielen Stellen etwas holprig und ungenau. Da mein Englisch gut genug ist, liest sich die englische Benutzeroberfläche für mich deutlich flüssiger und verständlicher.

Als erstes Beobachtungsziel des Abends habe ich mir **NGC 7000** ausgesucht, den bekannten Nordamerikanebel im Sternbild Schwan. Während das Teleskop das Ziel ansteuerte und im Hintergrund die Aufnahme vorbereitete, spielte die App ihre Stärken aus: Die integrierte KI-Funktion begann direkt damit, mir interessante Fakten und Hintergrundinformationen über den Nebel zu erzählen. Diese akustische/textuelle Begleitung verkürzt die Wartezeit beim Alignment und der Kalibrierung ungemein und macht das Beobachtungserlebnis noch interaktiver.

Hier ist zum Vergleich das von der Seestar-App automatisch bearbeitete und gestreckte JPEG-Bild, wie es direkt auf dem Smartphone gespeichert wird:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/NGC7000.jpg" alt="NGC 7000 (Seestar JPEG)" width="360" height="640" >}}

Und hier ist das fertige Summenbild (Rohstack) als FITS-Datei direkt aus dem Teleskop, das sich über den interaktiven FITS-Viewer betrachten und anpassen lässt:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Stacked_227_NGC%207000_10.0s_LP_20260710-001530_2.fit" localsrc="Seestar_Fit_20260710_013425/Stacked_227_NGC 7000_10.0s_LP_20260710-001530_2.fit" >}}

### Zweites Ziel: Sadr und die Suchtgefahr

Eigentlich hatte ich mir vorgenommen, in dieser ersten Nacht nur ein einziges Testbild aufzunehmen, um das Zusammenspiel von Stativ, Teleskop und App zu erproben. Doch das Beobachten und die Einfachheit des Systems haben so viel Spaß gemacht, dass ich einfach nicht aufhören konnte. Spontan entschied ich mich daher, noch eine weitere Aufnahme zu starten.

Mein zweites Ziel war **Sadr** (Gamma Cygni), der helle Stern im Zentrum des Sternbilds Schwan, welcher von weitläufigen Emissionsnebeln (IC 1318) umgeben ist. Auch dieses Mal klappte das Anfahren und Zentrieren absolut problemlos.

Hier ist das verarbeitete JPEG-Bild der Sadr-Region aus der App:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Sadr.jpg" alt="Sadr Region (Seestar JPEG)" width="360" height="640" >}}

Und hier ist das Summenbild (Rohstack) als FITS-Datei zum Vergleich:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Stacked_181_Sadr_10.0s_LP_20260710-010138_6.fit" localsrc="Seestar_Fit_20260710_013425/Stacked_181_Sadr_10.0s_LP_20260710-010138_6.fit" >}}

### Zum Abschluss: Ein Weitwinkel-Mosaik von Vega

Ganz am Ende der Nacht, als ich schon fast am Abbauen war, packte mich noch einmal die Neugier: Ich wollte unbedingt den neuen Mosaik-Modus des Seestar S30 Pro ausprobieren. 

Dafür wählte ich einen der hellsten Sterne am Sommerhimmel als Ziel: **Vega** (Wega) im Sternbild Leier. Das Besondere an diesem Bild ist, dass es nicht mit der Hauptkamera, sondern mit der integrierten **Weitwinkelkamera** (Sony IMX586 mit einer Brennweite von 5,96 mm) aufgenommen wurde. 

Das Teleskop belichtete insgesamt 54 Frames zu je 10 Sekunden (insgesamt 9 Minuten Belichtungszeit). Die resultierende FITS-Datei hat eine Auflösung von **4175 x 3777 Pixeln**. Da der Sensor der Weitwinkelkamera nativ ein anderes Seitenverhältnis besitzt, zeigt dieses fast quadratische Format deutlich, dass die Software hier erfolgreich mehrere Einzelbilder zu einem Mosaik zusammengesetzt (gestitcht) hat, während das Teleskop den Bereich um Vega abrasterte.

Hier ist das gestitchte Weitwinkel-JPEG-Bild von Vega aus der App:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/Vega.jpg" alt="Vega Mosaik (Seestar JPEG)" width="500" height="452" >}}

Und hier ist die zusammengesetzte FITS-Aufnahme zum interaktiven Vergleich:

{{< fitsviewer src="https://do3eet-media.dreamofjapan.de/posts/ZWOSeestarS30Pro/20260710-012011_4.fit" localsrc="Seestar_Fit_20260710_013425/20260710-012011_4.fit" layout="bottom" >}}

### Abbau und nächtliche Feuchtigkeit

Gegen 01:30 Uhr war es dann Zeit für den Abbau. Ähnlich wie beim Aufbau war das Abschrauben des Teleskops direkt vom Stativgewinde wieder eine etwas nervenaufreibende Angelegenheit. Durch die Größe des Seestar S30 Pro hat man auch hier großen Respekt davor, das Gerät versehentlich fallen zu lassen, während man es vom nackten 3/8-Zoll-Gewinde dreht. Ein passender Stativkopf wird definitiv meine nächste Anschaffung sein, um diesen Prozess sicherer zu machen.

Zudem fiel mir beim Einpacken auf, dass das Material der mitgelieferten Tragetasche die abendliche Luftfeuchtigkeit sehr stark anzieht. Die Tasche war außen spürbar nass. Man sollte also darauf achten, das Teleskop und Zubehör zu Hause noch einmal kurz lüften zu lassen, damit keine Feuchtigkeit in der Tasche eingeschlossen wird.

### Akkulaufzeit, Reichweite und Komfort

Im praktischen Betrieb haben mich zwei Punkte besonders positiv überrascht: die Akkulaufzeit und die Reichweite des direkten WLAN-Hotspots:

* **Akkukapazität**: Nach der rund 2 Stunden und 20 Minuten dauernden Session (von 23:10 bis ca. 01:30 Uhr), bei der das Teleskop fast durchgehend kalibriert, angefahren und gestackt hat, sank der Akkustand von 100 % auf lediglich 77 %. Das deutet darauf hin, dass die Akkulaufzeit im realen Betrieb unter diesen Bedingungen sogar noch über den im Vorfeld recherchierten YouTube-Werten liegen könnte.
* **WLAN-Reichweite**: Die Steuerung lief komplett über das vom Seestar selbst aufgebaute direkte WLAN-Netz (ohne Einbindung ins Heimnetzwerk). Dabei konnte ich das Teleskop bequem direkt aus dem Bett heraus steuern – das Signal reichte stabil durch eine Hauswand über eine Distanz von rund 50 Metern bis in die dunkle, ländliche Ecke des Grundstücks, auf dem ich das Gerät positioniert hatte.

Auf eventuellen Taubeschlag an der Frontlinse habe ich in dieser ersten Nacht noch nicht explizit geachtet – bei der hohen Luftfeuchtigkeit und Nässe der Tragetasche wird dies in Zukunft aber sicher ein wichtiger Punkt sein, den ich im Auge behalten muss.

### Wissenschaftlicher Exkurs: Warum leuchten diese Nebel rot?

Sowohl der Nordamerikanebel (NGC 7000) als auch die Region um Sadr (IC 1318) gehören zur Klasse der **Emissionsnebel**. Das charakteristische rote Leuchten dieser Regionen hat einen faszinierenden physikalischen Grund:

* **Wasserstoff (H-alpha)**: Diese Nebel bestehen zu einem Großteil aus interstellarem Gas, hauptsächlich atomarem Wasserstoff. Nahegelegene, extrem heiße Sterne strahlen große Mengen an energiereichem ultraviolettem (UV) Licht aus.
* **Ionisation & Rekombination**: Diese UV-Strahlung ionisiert die Wasserstoffatome, indem sie die Elektronen von den Protonen trennt. Wenn sich die Elektronen wieder mit den Protonen verbinden (Rekombination) und auf niedrigere Energieniveaus zurückfallen, senden sie Licht aus.
* **Die 656,28-nm-Linie**: Der Übergang des Elektrons vom dritten auf das zweite Energieniveau (die sogenannte **H-alpha-Linie**) strahlt Licht mit einer Wellenlänge von exakt 656,28 Nanometern aus. Dies liegt im tiefroten Bereich des für uns sichtbaren Spektrums.

Weil Wasserstoff das mit Abstand häufigste Element im Universum ist, leuchten fast alle klassischen Sternentstehungsgebiete und Emissionsnebel auf Astrofotografien in diesem wunderschönen Rot.

### Rohdaten vs. JPEG: Warum sind die Farben im FITS-Viewer blasser?

Wer das fertige JPEG auf dem Smartphone mit der FITS-Datei im interaktiven FITS-Viewer vergleicht, wird feststellen, dass das Rot im Viewer deutlich schwächer und blasser wirkt. Das ist kein Fehler, sondern hat technische Gründe:

* **Kein Farbsättigungs-Boost**: Die Seestar-App wendet auf die JPEGs eine aggressive Bildverarbeitung an. Dazu gehört ein starker Sättigungs-Boost, um die schwachen Farben der Nebel für das menschliche Auge auf dem Display "knallig" zu machen. Der FITS-Viewer streckt zwar die Helligkeitswerte, verändert aber nicht die Farbsättigung.
* **Wissenschaftlicher Weißabgleich**: Der FITS-Viewer (implementiert in `fitsviewer.js`) gleicht die Kanäle (RGB) automatisch an, um den Himmelshintergrund zu neutralisieren. Die Handy-App nutzt hingegen sensor-spezifische Farbmatrizen, um das H-alpha-Rot gezielt hervorzuheben.
* **FITS als Ausgangsmaterial**: FITS-Dateien sind rohe Messdaten für die Weiterverarbeitung in Programmen wie Siril oder PixInsight. Da mein Rechner nach dem letzten Arch-Update gerade Probleme mit Siril hat (`siril: error while loading shared libraries: libopencv_calib3d.so.413: cannot open shared object file: No such file or directory`), konnte ich den manuellen Stacking- und Bearbeitungsprozess auf dem Notebook noch nicht durchführen – die FITS-Aufnahmen hier basieren daher auf den vom Teleskop automatisch erstellten Summenbildern. Erst durch die manuelle Bildbearbeitung (Strecken, Hintergrund-Abzug und Sättigung) holt man das volle, leuchtende Rot kontrolliert aus den Daten heraus.

## Diskutiert mit!

Jetzt seid ihr gefragt: Welche Himmelskörper soll ich als Nächstes mit dem Seestar S30 Pro ins Visier nehmen? Und was bevorzugt ihr beim Betrachten – die interaktiven, wissenschaftlichen FITS-Rohdaten direkt im Browser oder die fertig aufbereiteten, farbintensiven JPEGs? Schreibt es mir gerne unten in die Kommentare!





[^1]: [YouTube: ZWO Seestar S30 Pro Review / Test in Tokyo](https://youtu.be/WHwij7kp5Ao?si=akDDS5MTtnikQk3b)
[^2]: [GitHub: actionless/pikaur](https://github.com/actionless/pikaur)
[^3]: [Siril](https://siril.org/)
[^4]: [GraXpert](https://graxpert.com/)
[^5]: [StarNet](https://starnetastro.com/cli-tools/starnet/) (nicht mehr Open Source)
