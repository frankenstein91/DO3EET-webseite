+++
title = 'Rückblick: Chemnitzer Linux-Tage 2026'
date = 2026-03-31T21:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Open Source",
    "Chemnitz",
    "CLT",
    "Rückblick",
]
+++

Die Chemnitzer <span class="linux-egg">Linux</span>-Tage 2026 sind nun vorbei und es war wieder einmal ein fantastisches Wochenende voller Wissen, Austausch und Gemeinschaft.

In diesem Beitrag möchte ich meine Erlebnisse und Eindrücke Revue passieren lassen.

## Freitag, 27. März

Meine Reise zu den diesjährigen <span class="linux-egg">Linux</span>-Tagen begann am Freitagnachmittag. Pünktlich um 15:00 Uhr ging es in Grimma los. Die Fahrt führte mich über die Landstraßen via Colditz, Geithain und Narsdorf, bevor ich schließlich auf die A72 Richtung Chemnitz auffuhr.

Mein erster Weg in Chemnitz führte mich direkt zum Hörsaalgebäude der TU. Dort angekommen, holte ich mir als erstes meinen Event-Ausweis ab – das offizielle Startsignal für ein langes und ereignisreiches Wochenende als Helfer und Aussteller.

Anschließend ging es zum Check-in ins Hotel. Kaum auf dem Zimmer angekommen, wurde natürlich erst einmal das wichtigste Equipment aufgebaut: Mein D-Star Hotspot und mein Funkgerät. Damit war ich auch in Chemnitz sofort wieder "QRV" und bereit für den Austausch auf den Bändern.

Lange hielt es mich aber nicht auf dem Zimmer, denn ab 18:30 Uhr stand die traditionelle Vorveranstaltung im **Turmbrauhaus** an. Wie jedes Jahr war das Treffen in der oberen Etage extrem gut besucht. Bei gutem Essen (die Speisekarte bietet ja zum Glück alles von Fleisch bis vegan) gab es die ersten intensiven Gespräche mit anderen Teilnehmern, die ebenfalls schon am Freitag angereist waren. Es ist der perfekte Auftakt, um sich in entspannter Atmosphäre auf die kommenden zwei Tage einzustimmen.

Ein herzliches Dankeschön geht an dieser Stelle an Silke für den tollen Post zur Einstimmung:

{{< loadtoot instance="mastodon.social" id="116193523212185171" >}}

Ein weiteres interessantes Fundstück des Abends war ein Flyer für die **3. Open Source Hardware Konferenz (OSHap)**, die vom 23. bis 24. September 2026 in Halle (Saale) stattfinden wird. Unter dem Motto „Think open. Build open.“ wird dort aktuell zur Teilnahme aufgerufen (Call for Participation). Da das Thema Open Source Hardware perfekt zu meinen Interessen passt (man denke an den Sharp PC-E500S oder RISC-V), überlege ich ernsthaft, im September auch in Halle dabei zu sein. Weitere Infos dazu gibt es unter [www.oshop-network.de](https://www.oshop-network.de).

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/CLT2026/EinladungHalle.jpg/EinladungHalle.jpg" alt="Flyer der OSHap 2026 in Halle" width="600" >}}

## Samstag, 28. März

Der erste volle Messetag war für mich besonders arbeitsintensiv, aber auch extrem spannend. In diesem Jahr war ich als ehrenamtlicher Helfer im **VOC-Team** (Video Operation Center) aktiv.

Meine Aufgabe bestand darin, die Livestreams der Vorträge live zu schneiden. Dabei jongliert man zwischen den verschiedenen Kameraeinstellungen und den Folien der Referenten, um sicherzustellen, dass die Zuschauer online dem Geschehen und dem Inhalt des Vortrags optimal folgen können.

Mein erster Einsatz an diesem Tag startete um 11:00 Uhr im Raum V6. Auf dem Plan stand ein hochaktuelles Thema: **"Die Kryptokalypse: Post-Quanten-Kryptographie und Open Source"**. In dem 60-minütigen Vortrag von Stefan Schumacher ging es um die massiven Herausforderungen, die Quantencomputer für unsere heutige Verschlüsselung bedeuten.

Hier eine kurze Zusammenfassung der wichtigsten Punkte:

*   **Das Problem:** Quantencomputer bedrohen durch Algorithmen wie **Shor** (bricht RSA und ECC) und **Grover** (halbiert das Sicherheitsniveau symmetrischer Verfahren wie AES) die Grundlage unserer digitalen Sicherheit.
*   **Die Lösung (PQC):** Der NIST-Standardisierungsprozess hat bereits erste Gewinner hervorgebracht. Dazu gehören **ML-KEM (Kyber)** für den Schlüsselaustausch sowie **ML-DSA (Dilithium)** und **SLH-DSA (Sphincs+)** für digitale Signaturen.
*   **Open Source Vorreiter:** Projekte wie **Open Quantum Safe (OQS)** spielen eine zentrale Rolle bei der Implementierung. Mit dem `oqsprovider` für OpenSSL lassen sich bereits heute hybride Verfahren nutzen, die klassische Kryptographie mit neuen Post-Quanten-Verfahren kombinieren.
*   **Handlungsempfehlung:** Wir sollten schon heute auf **Krypto-Agilität** setzen, Hybridverfahren implementieren und ein "Krypto-Kataster" erstellen, um zu wissen, wo welche Verschlüsselung im Einsatz ist.

Es war technisch anspruchsvoll, aber gerade deshalb eine spannende Herausforderung für den ersten Live-Schnitt des Tages.

Am Nachmittag, um 14:00 Uhr, ging es im Raum V5 weiter mit einem praktischen Thema für Netzwerk-Enthusiasten: **"Containerlab – RZ-Netzwerke im Lab simulieren"**. Robert Sander (Heinlein Consulting) gab einen tiefen Einblick in das mittlerweile fünf Jahre alte Projekt, das ursprünglich von Nokia gestartet wurde.

Besonders faszinierend an Containerlab ist die Möglichkeit, selbst komplexe Rechenzentrums-Strukturen ressourcensparend in <span class="linux-egg">Linux</span>-Containern abzubilden. Da moderne Router-Hardware oft auf dem <span class="linux-egg">Linux</span>-Kernel basiert, stellen viele Hersteller ihre Firmware direkt als Container-Images bereit. Für alles, was nicht nativ auf <span class="linux-egg">Linux</span> läuft, können auch klassische VMs eingebunden werden. Für mich am Mischpult war es interessant zu sehen, wie schnell und effizient man heute ganze Topologien hoch- und herunterfahren kann, ohne einen Schrank voller Hardware zu benötigen.

Den Abschluss meines VOC-Dienstes an diesem Tag bildete um 15:00 Uhr (ebenfalls in Raum V5) der Vortrag **"bindzwirn: <span class="linux-egg">Linux</span> Port-Berechtigungen per eBPF"** von Pluto. 

Beim Self-Hosting, egal ob zuhause oder auf einem VPS, ist die Isolation von Diensten durch separate Unix-Accounts (z. B. in rootless Podman-Containern) Best Practice. Das Problem: <span class="linux-egg">Linux</span> kennt nativ keine Berechtigungen für IP-Ports. Pluto präsentierte mit [bindzwirn](https://codeberg.org/bindzwirn/bindzwirn) ein modernes Drop-in-Replacement für das in die Jahre gekommene `authbind`. Dank eBPF lässt sich der Zugriff auf bestimmte Ports gezielt auf bestimmte Accounts begrenzen, was Angriffe durch gekaperte Accounts effektiv unterbindet. Ein sehr spannendes Projekt, das zeigt, wie mächtig eBPF ist, um fehlende Kernel-Funktionalitäten elegant nachzurüsten. (Und ich habe mich währenddessen heimlich gefragt, ob Pluto eigentlich ein Fan von Neil deGrasse Tyson ist? 😉)

### Der gemütliche Ausklang: "Chemnitzer Catering-Tage"

Nach dem offiziellen Programm am Samstag gab es für alle Helfer, Vortragenden, Aussteller und Sponsoren noch eine leckere Abendveranstaltung. Wie jedes Jahr wurde hier gescherzt, dass die Veranstaltung eigentlich in "Chemnitzer Catering-Tage" umbenannt werden müsste – das Essen war einfach wieder hervorragend und bot den perfekten Rahmen für entspanntes Networking abseits des Messetrubels.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/CLT2026/CCT.jpg/CCT.jpg" alt="Plakat der Chemnitzer Catering-Tage" width="600" >}}

## Ein besonderes Highlight: Hardware-Rettung über Nacht

Zwischen den Messetagen gab es für mich noch ein ganz persönliches Erfolgserlebnis. Ich hatte meinen alten **Sharp PC-E500S Pocket Computer** dabei, dessen Display leider kaum noch Kontrast hatte und unschöne schwarze Balken zeigte – ein typisches Alterungsproblem der Kondensatoren.

Da ich mir die filigrane Reparatur selbst nicht zutraute, suchte ich Hilfe beim **Lötworkshop**. Ein unglaublich hilfsbereiter Teilnehmer (dessen Namen ich vor lauter Aufregung leider vergessen habe) bot mir an, sich das Gerät über Nacht anzuschauen. 

Und tatsächlich: Er hat die beiden defekten 3,3μF SMD-Elkos (16V und 25V) gegen robuste Tantal-Kondensatoren ausgetauscht. Am nächsten Tag strahlte mich ein glasklares Display an! Ich freue mich riesig, denn mein Plan ist es, auf diesem Klassiker später ein **Ham-Logbuch** für den Amateurfunk laufen zu lassen. Ein riesiges Dankeschön an den unbekannten Retter!

## Sonntag, 29. März

Am Sonntag wechselte ich die Perspektive: Weg vom Mischpult des VOC-Teams und rauf auf die Bühne. Um 11:00 Uhr stand im Raum K2 die von mir organisierte **Keysigning-Party** auf dem Programm.

Es ist immer wieder beeindruckend zu sehen, wie viele Menschen sich für das Thema digitale Souveränität und Verschlüsselung begeistern. Mein Ziel war es, das **Web of Trust** zu stärken. Der Ablauf ist dabei so analog wie effektiv:
1. **Abgleich der Hash-Summen:** Zuerst stellten wir sicher, dass alle Teilnehmer die gleiche, aktuelle Schlüsselliste vorliegen hatten.
2. **Identitätsprüfung:** In einer langen Reihe wurden Fingerprints verglichen und Identitäten mittels amtlicher Lichtbildausweise verifiziert. 
3. **Vertrauen schaffen:** Dieser persönliche Kontakt ist die Basis, um später am heimischen Rechner die Schlüssel der anderen Teilnehmer guten Gewissens digital zu unterschreiben.

Als Organisator war es meine Aufgabe, durch den Prozess zu führen, Fragen zu GnuPG zu beantworten und sicherzustellen, dass alles reibungslos abläuft. Trotz der technischen Natur des Thema stand der menschliche Austausch im Vordergrund.

### CTF-Challenge mit Handicap

Auch am Sonntag begleitete mich die **CTF-Challenge der secunet Security Networks AG**. Wie jedes Jahr war sie ein großes Highlight für mich, auch wenn die Herausforderung in diesem Jahr doppelt groß war: Ich hatte mit massiven Firmware-Problemen meines WLAN-Chips im Laptop zu kämpfen (die leider immer noch anhalten). Trotz dieses technischen Handicaps konnte ich einige Level erfolgreich lösen, auch wenn ich die Challenge dieses Mal nicht bis zum bitteren Ende abschließen konnte.

Hier ein kleiner Einblick in die technischen Nüsse, die es zu knacken galt:

*   **Einstieg & Hashing:** Nach den ersten einfachen Schritten galt es, Passwörter aus Dateien zu extrahieren oder mittels veralteter Hash-Algorithmen (wie MD5) aus bereitgestellten Binärdaten zu berechnen.
*   **Archiv-Gymnastik:** Ein Level forderte die Analyse eines Bzip2-Archivs, das nach der Dekomprimierung eine riesige, fast leere Datei enthielt. Die Lösung versteckte sich in einzelnen ASCII-Zeichen, die an weit verstreuten Offsets vergraben waren.
*   **Socket-Voodoo:** Besonders spannend war der Zugriff auf einen Wireguard-Unix-Socket (`/var/run/wireguard/wg0.sock`). Durch gezielte Kommandos via `socat` konnte hier der Private Key extrahiert werden, der den Zugang zum nächsten Level ermöglichte.
*   **Metadaten-Forensik:** In einem höheren Level mussten 64 Verzeichnisse auf ihre Zeitstempel (`Modify` vs. `Change` Zeit) untersucht werden. Nur durch den präzisen Abgleich der Metadaten ließen sich die richtigen Puzzleteile für das nächste Passwort zusammensetzen.
*   **SSH-Tricks:** Zuletzt ging es um die Manipulation von SSH-Umgebungsvariablen (`SendEnv`), um die Shell-Beschränkungen zu umgehen.

Der Sportsgeist zählt, und auch mit Handicap hat es wieder riesigen Spaß gemacht!

Nach der Party blieb ich noch bis zum offiziellen Ende der Veranstaltung. Pünktlich um 18:00 Uhr, als die Türen geschlossen wurden, trat ich dann mit vielen neuen Eindrücke im Gepäck den Heimweg an.


## Fazit

Es war schön, wieder in Chemnitz dabei gewesen zu sein! Neben all den Erlebnissen vor Ort gab es an diesem Wochenende auch eine größere technische Änderung an dieser Website: Alle Grafiken und Bilder sind von GitHub auf einen **Cloudflare R2 Speicher** umgezogen. Dieser Schritt war notwendig, da das Git-Repository durch die vielen Bilder schlicht zu groß wurde. Auch wenn sie dort nun ihr neues Zuhause haben, bin ich mir noch nicht ganz sicher, ob mit dem Caching und der S3-Anbindung alles schon so reibungslos funktioniert, wie ich mir das vorstelle. Da werde ich in den nächsten Tagen wohl noch ein wenig feintunen müssen.
