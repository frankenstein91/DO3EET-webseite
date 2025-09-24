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