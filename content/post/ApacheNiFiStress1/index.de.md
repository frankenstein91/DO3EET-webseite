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

### Anpassungen an der `nifi.properties`
Zuerst müssen wir NiFi mitteilen, dass es hinter einem Proxy läuft. Dafür sind vor allem die `proxy`-Eigenschaften wichtig. Die relevanten Einträge in meiner `conf/nifi.properties` sehen so aus:

```toml
nifi.web.https.host=0.0.0.0
nifi.security.keystore=./conf/nifi-key.p12
nifi.security.keystoreType=PKCS12
nifi.security.keystorePasswd=nifi-key
nifi.security.keyPasswd=nifi-key
nifi.security.truststore=./conf/trust-nifi.p12
nifi.security.truststoreType=PKCS12
nifi.security.truststorePasswd=nifi-key

# Der Pfad, unter dem NiFi über den Proxy erreichbar sein wird
nifi.web.proxy.context.path=/nifi

# Der Hostname und Port, den die Benutzer im Browser eingeben
nifi.web.proxy.host=192.168.3.63:11311
```

### Die Apache VirtualHost-Konfiguration
Der Apache VirtualHost leitet die Anfragen an den **internen** NiFi-Server weiter und setzt die **notwendigen Header**, damit NiFi weiß, von welcher **externen** URL die Anfrage **ursprünglich** kam.

Meine Konfigurationsdatei für den VirtualHost sieht so aus:
```
<VirtualHost *:11311>
    ErrorLog "/var/log/httpd/11311-error_log"
    CustomLog "/var/log/httpd/11311-access_log" common
    ServerName 192.168.3.63

    # SSL für die Verbindung zum Backend (NiFi)
    SSLProxyEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off

    ProxyRequests off
    ProxyPreserveHost off

    # Die entscheidenden Proxy-Regeln
    ProxyPass /nifi https://10.0.2.15:8443
    ProxyPassReverse /nifi https://10.0.2.15:8443

    # Header anpassen, damit NiFi die ursprüngliche Anfrage kennt
    <Location "/nifi">
        RequestHeader set X-ProxyScheme "https"
        RequestHeader set X-ProxyHost "192.168.3.63"
        RequestHeader set Host "10.0.2.15"
        RequestHeader set X-ProxyPort "11311"
        RequestHeader set X-ProxyContextPath "/nifi"
    </Location>

    # SSL-Konfiguration für die Frontend-Verbindung (Browser)
    SSLEngine on
    SSLProtocol +TLSv1.2 +TLSv1.3
    SSLCipherSuite EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH
    SSLHonorCipherOrder on
    SSLCompression off
    SSLCertificateFile "/etc/httpd/conf/apache.pem"
    SSLCertificateKeyFile "/etc/httpd/conf/key.pem"
    
    TraceEnable off
</VirtualHost>
```

## Die Fehlerquelle: Ein einzelner Schrägstrich zu viel
Auf den ersten Blick sehen beide Konfigurationen korrekt aus. Man startet die Dienste neu und erwartet, dass alles funktioniert. Doch genau dann tritt der oben genannte **Unauthorized**-Fehler auf.

Die Ursache lagen bei mir in den `ProxyPass` und `ProxyPassReverse` Direktiven. Oftmals neigt man dazu, aus Gewohnheit oder durch Copy-Paste-Fehler einen Schrägstrich **/** am Ende des Pfades hinzuzufügen.
```
# FALSCH: Ein Slash am Ende zu viel!
ProxyPass /nifi/ https://10.0.2.15:8443/
ProxyPassReverse /nifi/ https://10.0.2.15:8443/
```
Dieser zusätzliche Schrägstrich führt dazu, dass mod_proxy die URLs **anders** zusammensetzt, als NiFi es erwartet. Dies **stört die interne Weiterleitung** und **die API-Aufrufe** zur Authentifizierung, was letztendlich zu dem Unauthorized-Fehler führt.

Wenn du Apache NiFi hinter einem Apache Reverse Proxy einrichtest und den Fehler
> Unable to load authentication configuration

erhältst, überprüfe als **Allererstes** deine `ProxyPass`- und `ProxyPassReverse`-Direktiven. Die Wahrscheinlichkeit ist **hoch**, dass ein **überflüssiger** Schrägstrich die **Ursache** für stundenlanges Kopfzerbrechen ist.
