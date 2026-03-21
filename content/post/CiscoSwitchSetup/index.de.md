+++
title = 'Cisco 3750G im Homelab: Ein steiniger Weg zu IOS 15.0'
date = 2026-03-21T14:00:00+01:00
draft = false
tags = ["Cisco", "Switch", "Networking", "Homelab", "IOS"]
categories = ["IT"]
+++

Gebrauchte Enterprise-Hardware ist der Klassiker für jedes Homelab. Kürzlich ist mir ein **Cisco WS-C3750G-24TS-S1U** zugelaufen. Ein solider 24-Port Gigabit-Switch mit SFP-Uplinks und – was besonders spannend ist – Layer-3-Fähigkeiten. Doch die Inbetriebnahme hielt ein paar typische Cisco-Hürden bereit, besonders beim Thema Firmware-Updates und Speicherplatz.

## Die Ausgangslage: IPBASE und fehlende Kryptografie

Nach dem ersten Booten über das Konsolenkabel zeigte ein `show version`:
`Cisco IOS Software, C3750 Software (C3750-IPBASE-M), Version 12.2(44)SE6`

Das Kürzel **IPBASE** ist hier das Problem. Es ist das Einstiegs-Feature-Set von Cisco. Schlimmer noch: Ohne das "K9" im Namen fehlen jegliche kryptografischen Funktionen. Das bedeutet: Kein SSH für die Konsole und kein HTTPS für das Webinterface. In einem modernen Netzwerk ist das ein absolutes No-Go. Ein Versuch, HTTPS zu aktivieren, endete prompt im Fehler:

```bash
3750g(config)#ip http secure-server
                        ^
% Invalid input detected at '^' marker.
```

## Der Update-Marathon

Mein Ziel war die Version **15.0(2)SE10**, die letzte verfügbare Version für diese Hardware-Reihe. Da der Sprung von 12.2 IPBASE direkt auf 15.0 oft problematisch ist und ich die K9-Features brauchte, habe ich einen Zwischenschritt eingelegt.

### Schritt 1: Das Fundament mit 12.2(55) IPSERVICESK9

Zuerst habe ich ein Image der 12.2er Schiene mit dem **IPSERVICESK9**-Set eingespielt. Dieses Set schaltet die Layer-3-Features (Routing) und eben SSH/HTTPS frei. Da das Image nur als `.bin`-Datei vorlag, reichte ein einfaches `copy` von meinem lokalen HTTP-Server:

```bash
3750g#copy http://192.168.254.11:8080/c3750-ipservicesk9-mz.122-55.SE12.bin flash:
```

### Schritt 2: Der Kampf um jeden Megabyte (Flash-Limit)

Der Cisco 3750G (non-E/X Modelle) hat ein hartes Limit von **32 MB Flash-Speicher**. Das ist für moderne IOS-Images extrem knapp. Die `.tar`-Datei für IOS 15.0, die neben dem Image auch die HTTP-Dateien für das Webinterface enthält, sprengt fast den Rahmen, wenn noch ein altes Image auf dem Flash liegt.

Bevor ich also das finale Update wagen konnte, musste ich das gerade erst installierte 12.2-Image wieder löschen, um Platz zu schaffen:

```bash
3750g#dir flash:
# ... zeigt ca. 21 MB frei an, zu wenig für das 15.0er TAR (ca. 22 MB) ...

3750g#delete flash:/c3750-ipservicesk9-mz.122-55.SE12.bin
```

### Schritt 3: Der Sprung auf IOS 15.0 mit `archive`

Mit freiem Speicherplatz konnte ich nun den `archive`-Befehl nutzen. Dieser ist dem einfachen `copy` vorzuziehen, da er die `.tar`-Datei entpackt, alle Support-Files installiert und die Boot-Variable (`boot system`) korrekt setzt:

```bash
3750g#archive download-sw /overwrite /reload http://192.168.254.11:8080/c3750-ipservicesk9-tar.150-2.SE10.tar
```

Nach einem automatischen Reload meldete sich der Switch mit dem neuen System:
`Cisco IOS Software, C3750 Software (C3750-IPSERVICESK9-M), Version 15.0(2)SE10`

## Aufräumen: Corporate-VLANs und Altlasten

Der Switch stammte aus einer größeren Firmenumgebung. Ein `show vlan brief` zeigte eine lange Liste von VLANs (z.B. `VLAN_10_PROD`, `GUEST_NET` etc.). Da diese Informationen in der Datei `vlan.dat` im Flash gespeichert werden, überleben sie ein normales `erase startup-config`.

Um wirklich bei Null anzufangen, habe ich die VLAN-Datenbank manuell gelöscht:

```bash
3750g#delete flash:vlan.dat
3750g#reload
```

## Management-Konfiguration für das Homelab

Nachdem der Switch nun "sauber" und aktuell war, folgten die Standard-Einstellungen:

1.  **Management-IP:** Zuweisung einer IP im Vlan1 für den Zugriff.
2.  **SNMP:** Einrichtung für das Monitoring (z.B. mit LibreNMS). Wichtig: Zugriff nur über eine ACL erlauben!
    ```bash
    3750g(config)#access-list 10 permit 192.168.254.0 0.0.0.255
    3750g(config)#snmp-server community geheim RW 10
    ```
3.  **EnergyWise:** Da der Switch im Leerlauf ca. 94 Watt zieht, habe ich EnergyWise konfiguriert, um ungenutzte Ports in einen tieferen Power-Level zu versetzen.

## Fazit

Der Cisco 3750G ist trotz seines Alters ein hervorragendes Gerät für das Homelab, wenn man günstig an Layer-3-Features kommen möchte. Man muss jedoch den Firmware-Pfad genau planen, da der begrenzte Flash-Speicher kaum Fehler verzeiht. Mit SSH und IOS 15 ist das Gerät nun bereit für moderne Netzwerktasks.
