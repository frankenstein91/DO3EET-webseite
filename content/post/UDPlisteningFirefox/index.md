+++
title = 'Firefox lauscht auf UDP'
date = 2024-05-04T18:25:59+02:00
draft = false
tags = [
    "Linux",
    "Security",
    "Firefox",
    "Browser",
    "Netzwerk",
    "Internet",
    "HTTP3",
]
+++

Ich habe mir heute das Tool [osquery](https://osquery.io/) angeschaut, da ich dies als Toolvorstellung im Blog unterbringen wollte. Dabei war ich besonders auf die Möglichkeiten im Bereich Netzwerk interessiert. Angefangen hatte ich eine Möglichkeit zu finden `netstat -tulpen` zu ersetzen. Und habe mir dafür folgende SQL-Abfrage erstellt...
<!--more-->
```sql
SELECT p.path,(CASE protocol WHEN 6 THEN 'TCP' WHEN 17 THEN 'UDP' ELSE protocol END) AS protocol,(CASE family WHEN 2 THEN 'IP4' WHEN 10 THEN 'IP6' ELSE family END) AS family,address,port from listening_ports as lpor INNER JOIN processes AS p ON p.pid = lpor.pid where port != 0;
```

Ich weiß `netstat -tulpen` und `ss -tulpn` sind viel kürzer. Aber der Befehl `netstat` ist **deprecate** bzw. **obsolete**. Das Kürzel `ss` hat in der nationalsozialistischen Vergangenheit von Deutschland eine negative Bedeutung als Bezeichnung für die Schutzstaffel. Bei GIT wurde die Bezeichnung des Hauptzweigs von `master` auf `main` geändert, da man sich bewusst war das die Bennenung für bestimmte Personen beleidigend sein könnte.[^1] Das Aussprechen des Befehls `ss` könnte im Büroalltag (zumindest in Deutschland) für komische Blicke sorgen, weshalb ich Alternativen zu diesem Befehl sehr gern nutze. 

Nun ist mir beim Testen etwas sehr interessantes aufgefallen... Mein Firefox lauscht auf 2 UDP-Ports, auch wenn noch keine Website oder ähnliches geöffnet ist.

| path                     | protocol | family | address   | port  |
|--------------------------|:--------:|:------:|----------:|:-----:|
| /usr/lib/firefox/firefox | UDP      | IP4    | 0.0.0.0   | 55367 |
| /usr/lib/firefox/firefox | UDP      | IP4    | 0.0.0.0   | 55367 |

Die Ports sind nicht fest und sich nur ein Snapshot wie es zum aktuellen Zeitpunkt war. Die Ports verschwinden wenn man in der `about:config` den Parameter `network.http.http3.enable` auf `false` setzt und damit HTTP/3 **deaktiviert**. Ich vermute also es handelt sich hier um Quick UDP Internet Connections, die von HTTP/3 genutzt werden.

[^1]: https://sfconservancy.org/news/2020/jun/23/gitbranchname/