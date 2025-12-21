+++
title = 'Toyako: Zwischen Vulkankratern, Linux-Terminals und freiem WLAN'
date = 2025-12-21T16:15:00+09:00
draft = false
author = "Frank Tornack"
tags = [
    "Japan",
    "Linux",
    "Reisen",
    "Hokkaido",
    "Tech",
    "OpenRoaming"
    ]
+++

Grüße aus Hokkaido! Ich bin gerade mit meinem Framework Laptop in Japan unterwegs – genauer gesagt am Toya-See (Toyako). Japan ist ein tech-affines Land, aber als Linux-User (in meinem Fall Arch mit Cinnamon) stößt man oft auf Hürden, die Nutzer von iPhones oder Android-Geräten gar nicht kennen.

Eines der besten Features hier ist OpenRoaming (bzw. das lokale Partnernetz Cityroam). Das verspricht: Einmal einrichten, überall an Bahnhöfen, in Konbinis und Shopping-Malls automatisch sicheres WLAN haben.

Das Problem? Es gibt keine native Linux-App. Die Anbieter wollen, dass man sich eine App installiert oder ein Profil lädt, das meist nur für iOS (.mobileconfig) oder Windows (.exe) angeboten wird. Aber ich habe einen Weg gefunden, das System auszutricksen und die Zugangsdaten für den NetworkManager zu extrahieren. Und das Beste: Es ist kostenlos.

Hier ist mein "Field Report" und die Anleitung, wie ihr das nachbauen könnt.

# Schritt 1: Die Quelle
Ich habe eine Seite gefunden, die kostenlose Demo-Profile für die Wireless Broadband Alliance (WBA) erstellt: https://www.openroamingconnect.org/

# Schritt 2: Die Blackbox knacken
Jetzt hatte ich diese .mobileconfig Datei. Das ist eigentlich eine XML-Datei, in der Apple Konfigurationen speichert. Aber wenn man sie mit cat oder vim öffnet, sieht man oft nur Datensalat. Der Grund: Die Datei ist meist binär signiert (signed CMS/DER).

Da wir unter Linux mächtige Tools haben, habe ich die Signatur mit openssl entfernt, um an den lesbaren XML-Inhalt zu kommen:
```shell
openssl smime -inform DER -verify -in OpenRoaming.mobileconfig -noverify -out readable.xml
```

Plötzlich lag der Inhalt im Klartext vor. Und hier kam die Überraschung: Ich dachte erst, ich müsste Zertifikate extrahieren (EAP-TLS), aber beim Durchsehen der XML fand ich einen Block für EAP-TTLS mit MSCHAPv2.

Die entscheidenden Zeilen sahen so aus (gekürzt):
```xml
<key>UserName</key>
<string>blablabla@idp.openroamingconnect.org</string>
<key>UserPassword</key>
<string>blablabla</string>
```
Bingo! Benutzername und Passwort im Klartext, gültig bis 2027.

# Schritt 3: Den NetworkManager füttern

Mit diesen Daten konnte ich meinen NetworkManager direkt füttern. Da ich keine Lust auf Klickorgien in der GUI hatte und sicherstellen wollte, dass alle EAP-Parameter stimmen, habe ich das direkt über das Terminal (nmcli) gemacht. Da in Japan neben der SSID OpenRoaming oft auch cityroam (das lokale Partner-Netzwerk) ausgestrahlt wird, habe ich gleich zwei Profile angelegt.

Hier ist der Befehl, der bei mir auf dem Framework (Wi-Fi 7 Chip von Qualcomm) sofort funktionierte:
```shell
# Profil für OpenRoaming
nmcli con add \
  type wifi \
  con-name "OpenRoaming" \
  ssid "OpenRoaming" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"

# Profilklon für cityroam (wichtig in Japan!)
nmcli con add \
  type wifi \
  con-name "cityroam" \
  ssid "cityroam" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"
nmcli con add \
  type wifi \
  con-name "Wi2eap" \
  ssid "Wi2eap" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"
```

Hinweis: Beim ersten Verbinden fragt der NetworkManager eventuell nach dem CA-Zertifikat. Da wir das Root-Zertifikat nicht extrahiert haben, kann man das für den Urlaubszweck ignorieren (Checkbox "Kein CA-Zertifikat erforderlich" in der GUI).

# Schritt 4: Status Quo – QRV im Hotel

Aktuell sitze ich noch im Hotelzimmer. Ein kurzer Scan mit `sudo iw dev wlp170s0 scan` zeigt hier leider nur die hoteleigenen Netze ("Noguchi"), die ganz klassisch isoliert und per WPA2-Passwort gesichert sind. Vom "Interworking"-Flag oder den Roaming-Consortium-Codes, die OpenRoaming ankündigen, ist hier im Gebäude auf dem Spektrum noch nichts zu sehen.

Aber: Die Profile sind im NetworkManager hinterlegt und priorisiert. Mein Laptop ist jetzt quasi "scharfgeschaltet".
# Ausblick: Der geplante Feldtest

Der Plan für nachher ist simpel: Ich werde das Hotel verlassen und Richtung Bus Terminal Toyako Onsen oder zum nächsten Seicomart spazieren. Das sind in Japan klassische Hotspots für cityroam und Wi2. Die Theorie steht: Sobald mein Framework-Laptop ein Beacon mit dem richtigen Identifier empfängt, sollte er sich ohne mein Zutun einbuchen und verschlüsselt verbinden.

Ob der "XML-Hack" auch in der freien Wildbahn funktioniert und ich mein erstes Datenpaket über OpenRoaming schicken kann? Das werde ich gleich beim Spaziergang am See herausfinden.

# Ende
Der Scan vor Ort hat gezeigt: Die Karten hatten recht. Abseits der großen Metropolen wie Sapporo ist OpenRoaming noch nicht angekommen. Statt der nahtlosen, verschlüsselten Einwahl via Zertifikat musste ich auf das klassische laketoya_free_wifi zurückgreifen – unverschlüsselt und mit nerviger Login-Seite. Ein Hoch auf das VPN!