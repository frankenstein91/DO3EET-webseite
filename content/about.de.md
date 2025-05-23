+++
title = 'About'
draft = false
aliases = ["about-me", "contact", "impressum"]
author = "Frank Tornack"
menu = 'main'
+++

Verantwortlich für den Inhalt dieser privaten Website mit Ausnahme der Kommentare:

    Frank Tornack
    Badstraße 7
    04668 Grimma

Sie erreichen mich am besten über meine E-Mail am rechten Seitenrand.

# Framework
Hugo ist ein statisches Webseiten-Framework, das auf Golang basiert. Eine statische Webseite ist eine Website, deren Seiten aus einer festen Anzahl vorgefertigter Dateien bestehen, die aus HTML, CSS und JavaScript bestehen. Eine statische Website hat keine serverseitige Verarbeitung im Backend und keine Datenbank.

# Quellcode
Der Quellcode dieser privaten Website liegt auf Github und kann dort eingesehen werden. Die Umsetzung der Website erfolgt mithilfe von Hugo, einem Open-Source-Statiksite-Generator. Hugo wandelt den auf Github hinterlegten Quellcode in statische HTML-, CSS- und JavaScript-Dateien um, die für die Anzeige im Webbrowser optimiert sind. Dieser Prozess ermöglicht eine effiziente und schnelle Bereitstellung der Inhalte, während gleichzeitig eine klare Trennung von Inhalt und Darstellung gewährleistet wird. In Hinblick auf den HTML-Quellcode möchten wir darauf hinweisen, dass der Inhaltsverantwortliche keinen direkten Einfluss auf den generierten HTML-Quellcode hat, da dieser durch den Hugo-Generator automatisch erstellt wird. Der Fokus des Inhaltsverantwortlichen liegt vorrangig auf der Erstellung und Pflege der inhaltlichen Komponenten der Website. Bei Fragen oder Anmerkungen bezüglich des HTML-Quellcodes empfehlen wir, sich direkt an den Entwickler oder Maintainer des Hugo-Themas zu wenden.

# HTTP Header
Zusammenfassend lässt sich sagen, dass diese Header zusammenarbeiten, um ein sichereres Browsing-Erlebnis zu schaffen, indem sie Clickjacking-Angriffe verhindern, die Zugriffsrechte für Geräte kontrollieren, vor XSS-Angriffen schützen und einschränken, von wo die Website Ressourcen laden kann.
## X-Frame-Options: DENY
Diese Kopfzeile teilt dem Browser mit, dass diese Website nicht innerhalb eines Frames auf einer anderen Website geladen werden soll. Dies hilft, Clickjacking-Angriffe zu verhindern, bei denen eine böswillige Website Sie dazu verleitet, auf etwas zu klicken, indem sie die legitime Website in ihren Frame einbettet. Sollten Sie meine Website trotzdem in einem Frame sehen, würde ich mich über eine Meldung freuen. Ausgenommen von dieser Meldebitte ist [Archive.org](https://web.archive.org/).

## Permissions-Policy: camera=(), microphone=(), geolocation=()
Dieser Header gibt die Berechtigungsrichtlinie des Browsers für den Zugriff auf bestimmte Funktionen auf Ihrem Gerät an. In diesem Fall wird der Zugriff auf die Kamera, das Mikrofon und die Geolokalisierung für diese Website verweigert. Damit stelle ich sicher keinen Zugriff auf diese Informationen zu haben.

## Referrer-Policy: strict-origin-when-cross-origin
Diese Kopfzeile steuert, wie die von Ihnen besuchte Website auf die Referrer-Informationen zugreifen kann. Die Referrer-Informationen teilen der Website mit, woher Sie kommen (die zuvor besuchte Website). Mit dieser Einstellung wird sichergestellt, dass die Referrer-Informationen nur dann an den Server zurückgesendet werden, wenn Sie die Website vom selben Ursprung aus besuchen. Dies trägt zum Schutz der Privatsphäre der Nutzer bei, indem die Menge der Informationen, die Websites über Ihren Browserverlauf verfolgen können, begrenzt wird. Die Origin, also die Domain bleibt sichtbar.

## X-XSS-Protection: 1; mode=block
Diese Kopfzeile bezieht sich auf Cross-Site-Scripting (XSS)-Angriffe, bei denen bösartige Skripte in eine Website eingeschleust werden. Mit dieser Einstellung wird der Browser angewiesen, den XSS-Schutz im „Block“-Modus zu aktivieren. Das bedeutet, dass der Browser **versuchen wird**, potenzielle XSS-Angriffe zu erkennen und zu blockieren.

## Content-Security-Policy
Dies ist der komplexeste Header und definiert eine Content Security Policy (CSP). Eine CSP schränkt ein, woher der Browser Ressourcen (wie Schriftarten, Stylesheets, Skripte) laden kann.

## X-Content-Type-Options: nosniff
Der HTTP-Header `X-Content-Type-Options: nosniff` ist eine Sicherheitsmaßnahme, die Webserver einsetzen können, um Browser anzuweisen, den deklarierten Content-Type einer Ressource nicht zu "erraten" oder zu ändern.

## Cross-Origin-Opener-Policy: same-origin
Der HTTP-Header `Cross-Origin-Opener-Policy: same-origin` ist eine Sicherheitsmaßnahme, die Webseitenbetreibern mehr Kontrolle darüber gibt, wie ihre Webseite mit anderen Webseiten interagiert, die sie möglicherweise geöffnet haben oder die sie geöffnet haben. Im Wesentlichen hilft dieser Header, eine Webseite von potenziell bösartigen externen Webseiten zu isolieren.

## Cross-Origin-Resource-Policy: same-origin
Der HTTP-Header `Cross-Origin-Resource-Policy: same-origin` ist eine Sicherheitsrichtlinie, die Webserver verwenden können, um zu kontrollieren, welche Ursprünge (Websites) ihre Ressourcen einbetten oder laden dürfen. Wenn dieser Header auf `same-origin` gesetzt ist, bedeutet das, dass die Ressource nur von Webseiten geladen werden darf, die exakt denselben Ursprung haben (gleiches Schema, gleicher Hostname und gleicher Port).

# Kommentarfunktion
Die Kommentarfunktion auf dieser privaten Website wird über Github bereitgestellt. Für die Verarbeitung von personenbezogenen Daten im Rahmen der Kommentarfunktion ist der Betreiber der Github-Plattform verantwortlich. Bitte beachten Sie die Datenschutzbestimmungen von Github unter:
- [Datenschutzrichtlinien Deutsch](https://docs.github.com/de/site-policy/privacy-policies)
- [Data protection policy English](https://docs.github.com/en/site-policy/privacy-policies)

# Chatfunktion
Die Chatfunktion dieser Website basiert auf der Matrix-Chat-Technologie und wird durch die Software Cactus.Chat bereitgestellt. Matrix ist ein offener Standard für dezentrale, sichere und interoperable Echtzeitkommunikation über das Internet. Cactus.Chat nutzt diese fortschrittliche Matrix-Infrastruktur, um eine sichere und benutzerfreundliche Chat-Umgebung zu schaffen. Matrix ermöglicht die Verschlüsselung von Ende zu Ende, was bedeutet, dass die Kommunikation zwischen den Nutzern vertraulich und geschützt ist. Darüber hinaus bietet die Matrix-Plattform die Möglichkeit, über verschiedene Chat-Clients zu interagieren, was eine flexible und vielseitige Nutzung ermöglicht. Wir legen großen Wert auf Datenschutz und Sicherheit und empfehlen den Nutzern, sich mit den Datenschutzrichtlinien von Matrix und Cactus.Chat vertraut zu machen, um ein umfassendes Verständnis darüber zu erhalten, wie ihre Daten geschützt werden.

Matrix ist ein dezentrales Kommunikationsprotokoll, bei dem die Nutzer ihre eigenen Server (Homeserver) wählen können. Jeder Homeserver-Betreiber kann seine eigenen Datenschutzrichtlinien und Sicherheitsmaßnahmen festlegen. Da es keine zentrale Instanz gibt, die die Datenschutzrichtlinien für alle Homeserver vorgibt, ist es schwierig, eine einheitliche Datenschutzinformation anzubieten. Jeder Nutzer, der sich mit deinem Matrix-Server verbindet, unterliegt den Datenschutzrichtlinien des spezifischen Homeservers, den er wählt. Es wird empfohlen, dass Nutzer, die die Datenschutzrichtlinien ihres Matrix-Heimservers kennenlernen möchten, sich direkt an den Betreiber des jeweiligen Homeservers wenden oder die entsprechenden Informationen auf der Website des Homeservers suchen.

# Youtube-Einbettung
Die auf dieser Website verwendeten eingebetteten YouTube-Videos unterliegen dem Urheberrecht von YouTube und den jeweiligen Rechteinhabern. Die Einbettung erfolgt im erlaubten Rahmen der YouTube-Nutzungsbedingungen.

Auf unserer Website verwende ich eingebettete YouTube-Videos, um Ihnen multimediale Inhalte bereitzustellen. Wenn Sie eine Seite mit einem eingebetteten YouTube-Video besuchen, wird eine Verbindung zu den Servern von YouTube hergestellt. Dabei wird YouTube darüber informiert, welche Seiten Sie besuchen.

Bitte beachten Sie, dass YouTube eigene Datenschutzrichtlinien hat, auf die ich keinen Einfluss haben. Wenn Sie ein YouTube-Video abspielen, können von YouTube Cookies auf Ihrem Endgerät gespeichert werden. Ich habe jedoch keinen Einfluss auf die Art und den Umfang der durch YouTube erhobenen Daten.

Um Ihre Privatsphäre zu schützen, habe ich die Einbettung von YouTube-Videos so konfiguriert, dass sie den erweiterten Datenschutzmodus von YouTube verwenden. Bitte beachten Sie, dass der erweiterte Datenschutzmodus von YouTube möglicherweise erst dann aktiviert wird, wenn Sie das Video abspielen. Die Datenübertragung an YouTube kann jedoch auch ohne aktive Video-Wiedergabe stattfinden.

# PeerTube-Einbettung
Auf dieser Website werden Videos von der Plattform PeerTube eingebettet. PeerTube ist eine dezentrale Videoplattform, die auf dem Peer-to-Peer-Prinzip basiert. Das bedeutet, dass die Videos nicht auf einem zentralen Server gespeichert werden, sondern auf einem Netzwerk von Computern, die von den Nutzern der Plattform betrieben werden. Diese Funktion ist nach besten Wissen und Gewissen abgeschaltet. Der PeerTube-Server-Betreiber sieht aber trotzdem Ihre IP und Browserdaten.
## Datenverarbeitung durch PeerTube
- Ihre IP-Adresse
- Ihr Browsertyp und Ihre Browsereinstellungen
- Das Betriebssystem Ihres Geräts
- Die Referrer-URL (die URL der Website, von der Sie auf das Video gekommen sind)
- Datum und Uhrzeit des Abrufs des Videos
- Die Dauer der Wiedergabe des Videos
- Ob Sie das Video vollständig angesehen haben

# Hosting
Cloudflare dient als Content Delivery Network (CDN), Hosting und bietet Sicherheits- und Performance-Verbesserungen für die Bereitstellung dieser Website. Beachten Sie, dass die Hosting-Infrastruktur von Cloudflare genutzt wird, um die Verfügbarkeit und Geschwindigkeit der Website zu optimieren. Cloudflare erhebt dabei möglicherweise anonymisierte statistische Daten über den Zugriff auf diese Website. Für weitere Informationen zu den Datenschutzpraktiken von Cloudflare verweise ich auf deren Datenschutzrichtlinien: 
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

# Datenschutz im Zusammenhang mit Cloudflare SSL-Zertifikaten
Die Verwendung von Cloudflare SSL-Zertifikaten dient dem Schutz der übermittelten Daten zwischen dem Nutzer und dieser Website. SSL (Secure Sockets Layer) gewährleistet eine verschlüsselte Kommunikation, die die Vertraulichkeit und Integrität der übertragenen Informationen sicherstellt. Cloudflare verpflichtet sich in der Regel dazu, die Privatsphäre der Nutzer zu respektieren und die geltenden Datenschutzbestimmungen einzuhalten. Bei der Nutzung von Cloudflare SSL-Zertifikaten können jedoch bestimmte anonymisierte Informationen über den Datenverkehr erfasst werden, um die Performance, Sicherheit und Analyse der Website zu verbessern. Es ist ratsam, die Datenschutzbestimmungen von Cloudflare zu konsultieren, um detaillierte Informationen darüber zu erhalten, welche Daten erfasst werden, wie sie verarbeitet werden und welche Schutzmaßnahmen getroffen sind.
- [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

# Haftungsausschluss
Die Inhalte dieser privaten Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Ich als Betreiber bin nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werde ich die betreffenden Inhalte umgehend entfernen.