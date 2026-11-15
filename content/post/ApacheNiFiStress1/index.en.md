+++
title = 'Apache NiFi Behind a Reverse Proxy – The "Unauthorized" Error and Its Simple Fix'
date = 2025-09-24T18:04:08+02:00
author = "Frank Tornack"
tags = [
    "Software",
    "Linux",
]
+++

Anyone running Apache NiFi in a production environment will sooner or later want to put it behind a reverse proxy like Apache HTTPD. There are plenty of good reasons for doing so:
 - SSL termination
 - Clean, unified URLs
 - Hiding the internal server topology

At first glance, the configuration looks straightforward. You tweak `nifi.properties` and set up a **VirtualHost** in Apache. Then comes the surprise:  
When you open the NiFi web UI, instead of the login screen you're greeted by a frustrating error message:

> **Unauthorized**  
> Unable to load authentication configuration. Please contact your system administrator.

The browser developer tools *(F12)* often only give vague clues. You might spot an **HTTP 404** `Not Found` for some resource, followed by an **HTTP 400** `Bad Request`, hinting that something's off without actually telling you where the real bug is hiding. You check certificates, firewalls, and the NiFi configuration...  
yet more often than not, the culprit is a tiny, easily overlooked detail in the Apache config.

## The Configuration: How It Should Look
To run **NiFi** properly behind a **reverse proxy**, you need to make changes in **two places**:
 - `nifi.properties`
 - The Apache VirtualHost configuration

### Tweaking `nifi.properties`
First, we need to let NiFi know it's sitting behind a proxy. The `proxy` properties are the key part here. The relevant entries in my `conf/nifi.properties` look like this:

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

### The Apache VirtualHost Configuration
The Apache VirtualHost forwards requests to the **internal** NiFi server and sets the **required headers** so NiFi knows which **external** URL the request **originally** came from.

My VirtualHost configuration file looks like this:
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

## The Root Cause: One Trailing Slash Too Many
At first glance, both configs look completely fine. You restart the services expecting everything to just work—and that's right when the **Unauthorized** error above strikes.

In my case, the culprit was hiding in the `ProxyPass` and `ProxyPassReverse` directives. Out of sheer habit—or a copy-paste slip—it's way too easy to tack a trailing slash **/** onto the end of the path.
```
# FALSCH: Ein Slash am Ende zu viel!
ProxyPass /nifi/ https://10.0.2.15:8443/
ProxyPassReverse /nifi/ https://10.0.2.15:8443/
```
That extra trailing slash causes `mod_proxy` to assemble the URLs **differently** than NiFi expects. This **breaks internal routing** and **the authentication API calls**, ultimately triggering the `Unauthorized` error.

So if you're setting up Apache NiFi behind an Apache reverse proxy and run into
> Unable to load authentication configuration

check your `ProxyPass` and `ProxyPassReverse` directives **first**. Chances are **high** that one **redundant** slash is what's behind hours of head-scratching.
