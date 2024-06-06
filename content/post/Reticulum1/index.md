+++
title = 'NomadNet, LXMF und Reticulum'
date = 2024-06-06T11:08:39+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Datenschutz",
    "Chat",
    "Verschlüsslung",
]
+++

Gleich zu Beginn dieses Artikels muss ich leider darauf Hinweisen, dass dieser Kommunikation für den deutschen Amateurfunk **nicht zulässig** ist. Es handelt sich hier um eine verschlüsselte Möglichkeit zum Nachrichtenaustausch, die ich durch die aktuelle Situation in Deutschland (Wetter) und Europa (Politik) trotzdem vorstellen werde. Trotzdem kann das Protokoll über WiFi, Bluetooth, Ethernet und LoRa mit den reduzierten Leistungen genutzt werden. Es handelt sich dabei um ein Mittel zur P2P-Kommunikation mit geringer Bandbreite.

# Stackvorstellung
```goat
+----------+                              
| NomadNet +---------+                   
+----------+         |                   
                     v                   
                 +------+   +-----------+
                 | LXMF +-->| Reticulum |
                 +------+   +-----------+
                     ^                   
+----------+         |                   
| Sideband +---------+                   
+----------+                              
```

## Was ist Reticulum?
Reticulum ist ein Netzwerkstack für die Nutzung auf Lokal- und Weitverkehrsnetzen mit leicht verfügbarer Hardware. Dabei kann dieser bei sehr hohen Latenzzeiten und extrem geringer Bandbreite eingesetzt werden. Der Stack ermöglicht den Aufbau von Weitverkehrsnetzen mit handelsüblichen Tools mit Ende-zu-Ende-Verschlüsselung, Anonymität des Initiators, selbstkonfigurierenden Multi-Hop-Transport, effiziente Adressierung, fälschungssichere Zustellungsbestätigungen usw..

## Was ist LXMF?
Das Lightweight Extensible Message Format ist ein einfaches und flexibles Nachrichtenformat inkl. Übermittlungsprotokoll, das eine Vielzahl von Implementierungen ermöglicht und dabei so wenig Bandbreite wie möglich benötigt. Es baut auf Reticulum auf und bietet Zero-Conf Message Routing, E2E-Verschlüsselung mit Forward Secrecy und kann über jedes von Reticulum unterstützte Medium transportiert werden.

## Was ist NomadNet
Nomad Network ermöglicht den Aufbau privater und robuster Kommunikation, die vollständig unter eigener Kontrolle und im Besitz der Teilnehmer stattfindet. Keine Anmeldungen, keine Vereinbarungen, keine Übergabe von Daten, keine Genehmigungen und Gatekeeper. Das Ganze basiert auf LXMF und Reticulum, die zusammen die Mesh-Funktionalität und das Peer-to-Peer-Nachrichten-Routing bereitstellen. Diese Grundlage ermöglicht es auch, das Programm über eine Vielzahl von Kommunikationsmedien zu nutzen, vom Papier bis zur Glasfaser.

## Was ist Sideband?
Sideband ist eine Applikation mit GUI[^1], welche die selben Funktionen wie NomandNet bietet. Dabei läuft Sideband auf Android, Linux, macOS und Windows.

# Anwendungsfall
Die aktuelle Situation mit starken Regenfällen und Überflutungen zeigt erneut die Bedeutung von infrastrukturunabhäniger Kommunikation. Für eine Nutzung von Hard- und Software im K-Fall[^2], muss diese leicht beschaffbar, herstellerunabhängig und übergreifend funktionieren, leicht bedienbar und wenige Anforderungen haben und dabei flexibel bleiben. Durch LoRa könnten große Entfernungen überbrückt werden und das Meshing verstärkt diesen Vorteil weiter.

# Nutzung
## Installation
Ausgehend von einer neuen ArchLinux installation mit installiertem pikaur, ist der folgende Schritt notwendig:
```bash
pikaur -S nomadnet
```
Damit wird das Tool mit allen nötigen Abhänigkeiten auf dem System installiert.

## LoRa Hardware
Um die Frimware auf der LoRa Hardware zu installieren, sind die nötigen tools schon installiert.
```bash
rnodeconf /dev/ttyACM0 --autoinstall
```
Dabei muss man nur wenige Fragen beantworten und der Rest läuft automatisch.

## Konfig für LoRa
Um eine gute Ausgangsdatei zu bekommen, startet man einmal `rnstatus` und es wird die Konfig unter `~/.reticulum/config` erzeugt. Mit dieser Einstellungsdatei kann man schon über die lokalen Netzwerke , heißt Subnetz beschränkt.

Für Deutschland fügen wir an das Ende der Konfig folgende Zeilen hinzu, um über das LoRa Mesh arbeiten zu können:
```ini
[[RNode LoRa Interface]]
  type = RNodeInterface
  # Enable interface if you want use it!
  interface_enabled = True
  # Serial port for the device
  port = /dev/ttyACM0
  frequency = 867200000
  bandwidth = 125000
  spreadingfactor = 9
  codingrate = 7
  txpower = 7
  mode=roaming
```
Wer eine LoRa-Antenne für viele Rechner nutzen will, kann `enable_transport = Yes` am Anfang der Config setzen und braucht diesen Config-Block nicht auf den anderen Systemen. Die Nachrichten werden über das Mesh vom LAN auf LoRa übertragen.
Danach ist die Software im lokalen Netzwerk und über Lora nutzbar. Der Start erfolgt mit `nomadnet` auf der CLI.

[^1]: Graphical User Interface
[^2]: Katastrophenfall
