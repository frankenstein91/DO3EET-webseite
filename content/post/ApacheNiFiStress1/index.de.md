+++
title = 'Apache NiFi hinter einem Reverse Proxy – Der „Unauthorized“-Fehler und seine simple Lösung'
date = 2025-09-24T18:04:08+02:00
author = "Frank Tornack"
tags = [
    "NiFi",
    "Linux",
]
+++

Jeder, der Apache NiFi in einer produktiven Umgebung betreibt, wird es früher oder später hinter einem Reverse Proxy wie Apache HTTPD absichern wollen. Die Gründe dafür sind vielfältig:
 - SSL-Terminierung
 - einheitliche URLs
 - das Verbergen der internen Serverstruktur

Die Konfiguration scheint auf den ersten Blick unkompliziert. Man passt die `nifi.properties` an und richtet einen **VirtualHost** im Apache ein. Doch dann die Überraschung:  
Beim Aufruf der NiFi-Oberfläche erscheint statt des Login-Fensters nur eine frustrierende Fehlermeldung:

> **Unauthorized**  
Unable to load authentication configuration. Please contact your system administrator.

Die Entwicklertools im Browser *(F12)* zeigen oft nur ungenaue Fehlermeldungen. Man sieht vielleicht einen **HTTP 404** `Not Found` für eine Ressource, gefolgt von einem **HTTP 400** `Bad Request`, die auf ein Problem hindeuten, aber nicht verraten, wo der eigentliche Fehler liegt. Man prüft Zertifikate, Firewalls und die NiFi-Konfiguration...  
doch oft liegt die Ursache an einer winzigen, leicht zu übersehenden Stelle in der Apache-Konfiguration.

## Die Konfiguration: So sollte es aussehen
Um **NiFi** korrekt über einen **Reverse Proxy** zu betreiben, sind an **zwei Stellen** Anpassungen nötig: 
 - `nifi.properties` 
 - Konfiguration des Apache-VirtualHost

