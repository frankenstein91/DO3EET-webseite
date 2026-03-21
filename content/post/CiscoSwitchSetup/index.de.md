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

## Pro-Tips für das Homelab

Beim Einrichten eines Cisco-Switches für das eigene Lab gibt es drei oft übersehene Punkte, die über Frust oder Erfolg (und Sicherheit) entscheiden.

### 1. Drittanbieter-SFPs freischalten

Cisco ist bekannt dafür, nur hauseigene SFP-Module zu akzeptieren. Steckt man ein günstiges Modul eines Drittanbieters (z. B. von FS.com) ein, wird der Port oft mit einer Fehlermeldung ("err-disable") abgeschaltet. Mit zwei magischen Befehlen lässt sich diese Sperre aufheben:

```bash
3750g(config)#service unsupported-transceiver
3750g(config)#no errdisable detect cause gbic-invalid
```
*Hinweis: Cisco gibt hierbei eine Warnung aus, dass kein Support für fremde Hardware übernommen wird – im Homelab ist das jedoch meist zweitrangig.*

### 2. Sicherheitslücke schließen: Smart Install deaktivieren

Ältere IOS-Versionen haben oft das "Smart Install"-Feature aktiviert. Dieses ist über die Jahre durch kritische Sicherheitslücken (z. B. CVE-2018-0171) aufgefallen, über die Angreifer volle Kontrolle über den Switch erlangen können. Da man dieses Feature im Homelab ohnehin nicht benötigt, sollte man es zwingend abschalten:

```bash
3750g(config)#no vstack
```

### 3. IPv6-Unterstützung aktivieren (SDM-Templates)

Ein oft übersehener Aspekt bei älteren Catalyst-Modellen ist das **SDM (Switch Database Management)**. Da der Hardware-Speicher (TCAM) begrenzt ist, muss man dem Switch sagen, wofür er ihn priorisiert nutzen soll. In der Standardeinstellung beherrscht der 3750G oft kein IPv6.

Um den Switch fit für die Zukunft (und das moderne Internet) zu machen, muss das SDM-Template umgestellt werden:

```bash
3750g(config)#sdm prefer dual-ipv4-and-ipv6 default
```
**Wichtig:** Diese Änderung wird erst nach einem Neustart (`reload`) wirksam! Nach dem Reboot kann man den Erfolg mit `show sdm prefer` und der Aktivierung von IPv6 auf einem Interface prüfen:

```bash
3750g#show sdm prefer
 The current template is "desktop IPv4 and IPv6 default" template.

3750g(config)#interface vlan 1
3750g(config-if)#ipv6 enable

3750g#show ipv6 interface brief
Vlan1                      [up/up]
    FE80::213:7FFF:FE59:E240  <-- Link-Local Adresse ist da!
```

### 4. Boot-Vorgang beschleunigen (Stack-Priority)

Da der 3750G ein Stack-Switch ist, wartet er beim Booten standardmäßig eine gewisse Zeit auf die "Stack Master Election" (`Waiting for Stack Master Election...`). Da im Homelab meist nur ein Switch läuft, kann man diesen Prozess beschleunigen, indem man die Priorität auf den Maximalwert setzt:

```bash
3750g(config)#switch 1 priority 15
Changing the Switch Priority of Switch Number 1 to 15
Do you want to continue?[confirm]
New Priority has been set successfully
```

### 5. SSH und die Sache mit den Schlüsseln

Damit SSH funktioniert, benötigt der Switch einen RSA-Schlüssel. Normalerweise erzeugt man diesen manuell mit `crypto key generate rsa`. In meiner Konfiguration war jedoch bereits ein selbstsignierter Trustpoint vorhanden:

```text
crypto pki trustpoint TP-self-signed-<ID>
 enrollment selfsigned
 rsakeypair TP-self-signed-<ID>
```

Wenn SSH bei euch nicht direkt startet, obwohl `transport input ssh` gesetzt ist, hilft meist dieser Befehl (nachdem ein Hostname und ein Domain-Name gesetzt wurden):

```bash
3750g(config)#crypto key generate rsa
```
Empfehlenswert ist hier eine Schlüssellänge von mindestens **2048 Bit**, um moderne SSH-Clients (wie aktuelle OpenSSH-Versionen) glücklich zu machen.

## Hardware-Check: Ist das Gerät fit?

Nach der ganzen Software-Arbeit wollte ich wissen, wie es um die physische Gesundheit des gebrauchten Switches steht. Ein Blick in den `show tech-support` (oder gezielte `show`-Befehle) lieferte beruhigende Werte:

*   **Temperatur:** Mit **34°C** (`System Temperature State: GREEN`) bleibt das Gerät im Leerlauf angenehm kühl.
*   **Lüfter:** Ein kurzes `FAN is OK` im Log bestätigt, dass die Kühlung ordnungsgemäß funktioniert – bei gebrauchten Enterprise-Geräten oft ein kritischer Punkt (Stichwort: Lagerschaden).
*   **Herzstück:** Im Inneren werkelt ein **PowerPC 405** Prozessor. Für heutige Verhältnisse fast schon antik, aber für Layer-3-Switching in Hardware immer noch absolut ausreichend.
*   **Selbsttest:** Alle `POST` (Power-On Self-Test) Routinen, inklusive des PortASIC-Speichers, meldeten ein sauberes `Passed`.

## Die finale running-config

Hier ist ein Auszug der aktuellen Konfiguration (Passwörter und Secrets wurden maskiert). Diese zeigt alle besprochenen Einstellungen im Zusammenspiel:

```text
Current configuration : 5956 bytes
!
version 15.0
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
service unsupported-transceiver
!
hostname 3750g
!
enable secret 5 <ENCRYPTED>
enable password <PASSWORD>
!
username root privilege 15 secret 5 <ENCRYPTED>
vtp domain clean-lab
vtp mode transparent
sdm prefer dual-ipv4-and-ipv6 default
ip domain-name do3eet-clab.internal
!
ip dhcp excluded-address 192.168.254.1 192.168.254.10
!
ip dhcp pool MGMT_POOL
 network 192.168.254.0 255.255.255.0
 default-router 192.168.254.1 
 dns-server 8.8.8.8 1.1.1.1 
energywise domain MyLab security shared-secret 0 <PASSWORD>
!
crypto pki trustpoint TP-self-signed-<ID>
 enrollment selfsigned
 subject-name cn=IOS-Self-Signed-Certificate-<ID>
 revocation-check none
 rsakeypair TP-self-signed-<ID>
!
!
crypto pki certificate chain TP-self-signed-<ID>
 certificate self-signed 01
  <CERTIFICATE_DATA_MASKED>
quit
!
interface GigabitEthernet1/0/1
 description MANAGEMENT_PORT
 switchport mode access
 spanning-tree portfast
!
interface GigabitEthernet1/0/2
 description DISABLED_FOR_SECURITY
 shutdown
 energywise level 0
!
! ... Interfaces 3 bis 27 analog konfiguriert ...
!
interface GigabitEthernet1/0/28
 description DISABLED_FOR_SECURITY
 shutdown
 energywise level 0
!
interface Vlan1
 ip address 192.168.254.1 255.255.255.0
 no ip route-cache
!
ip http server
ip http authentication local
ip http secure-server
!
access-list 10 permit 192.168.254.0 0.0.0.255
!
snmp-server community <SECRET>
snmp-server location 3750g
snmp-server contact DO3EET
!
line con 0
line vty 0 15
 login local
 transport input ssh
!
end
```

## Fazit

Der Cisco 3750G ist trotz seines Alters ein hervorragendes Gerät für das Homelab, wenn man günstig an Layer-3-Features kommen möchte. Man muss jedoch den Firmware-Pfad genau planen, da der begrenzte Flash-Speicher kaum Fehler verzeiht. Mit SSH und IOS 15 ist das Gerät nun bereit für moderne Netzwerktasks.

