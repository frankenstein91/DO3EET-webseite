+++
title = 'GPG Policy'
draft = false
author = "Frank Tornack"
+++

## Identitätsprüfung und physische Anwesenheit
Um die Integrität des Web of Trust zu gewährleisten, signiere ich PGP-Schlüssel ausschließlich nach einer persönlichen Begegnung („Face-to-Face“). Eine Identitätsprüfung per Video-Ident, Telefon oder E-Mail findet nicht statt.

### Amtliche Ausweisdokumente
Die Verifizierung erfolgt durch die Vorlage eines gültigen, amtlichen Lichtbildausweises im Original. Ich akzeptiere hierfür:
*   Reisepass
*   Personalausweis

Nicht-amtliche Dokumente oder Ausweise ohne ausreichende staatliche Sicherheitsmerkmale werden **nicht** akzeptiert. Dazu gehören unter anderem:
*   Elektronische Gesundheitskarten (eGK)
*   Ergänzungsausweise (z. B. dgti)
*   Studentenausweise
*   Führerscheine (da diese in Deutschland nicht primär als Identitätsnachweis im Sinne des Personalausweisgesetzes dienen)

Ich behalte mir vor, die Signierung abzulehnen, wenn Zweifel an der Identität oder der Echtheit des Dokuments bestehen.

### Besonderheit bei Funkamateuren
Sollte der zu signierende Schlüssel einen Bezug zum Amateurfunk aufweisen (beispielsweise durch die Angabe eines Rufzeichens in der User-ID oder der E-Mail-Adresse), führe ich eine zusätzliche Validierung durch. In diesem Fall gleiche ich das angegebene Rufzeichen entweder mit den offiziellen Datenbanken der zuständigen nationalen Behörde (in Deutschland die Bundesnetzagentur) ab oder akzeptiere alternativ die Vorlage der physischen Zuteilungsurkunde in Verbindung mit einem amtlichen Lichtbildausweis. Eine Signierung erfolgt nur, wenn der Name auf dem amtlichen Lichtbildausweis zweifelsfrei mit dem Inhaber des Rufzeichens in der Zuteilungsdatenbank bzw. der Urkunde übereinstimmt. Dies dient der Absicherung, dass die im Schlüssel behauptete Funkidentität tatsächlich der physischen Person zugeordnet werden kann.

### Empfohlene Kennzeichnung für Funkamateure (Notations)
Da die Verschlüsselung von Inhalten im Amateurfunkdienst (gemäß AfuV) nicht gestattet ist, bevorzuge ich eine klare Trennung und Kennzeichnung der Funkidentität im PGP-Schlüssel. 

Ich empfehle daher, das Rufzeichen nicht nur optional im Namensteil der User-ID zu führen, sondern es explizit als **Notation** zu hinterlegen. Dies ermöglicht eine strukturierte und maschinenlesbare Zuordnung, wobei der Fokus auf der Signatur und Authentifizierung liegt (da Verschlüsselung über Funk unzulässig ist).

Ein Beispiel für die Umsetzung mit GnuPG (im `gpg --edit-key` Modus):
`gpg> notation`
`Geben Sie die "Notation" ein: callsign@do3eet.pages.dev=IHR_RUFZEICHEN`

Dies ergänzt den Schlüssel um einen Nachweis, der meiner eigenen Konfiguration entspricht:
`callsign@do3eet.pages.dev=DO3EET`

### Durchführung der Signierung
Um den Kontext unserer Begegnung (z. B. ein spezifisches Event oder ein Treffpunkt) dauerhaft im Web of Trust zu dokumentieren, signiere ich Schlüssel ausschließlich mit dem folgenden Befehl:

`gpg --cert-notation "event@do3eet.pages.dev=<Eventname oder Treffpunkt>" --sign-key <FREMDE_KEY_ID>`

### Kryptografische Mindestanforderungen (in Anlehnung an BSI TR-02102)
Um die langfristige Sicherheit und Integrität des Web of Trust (WoT) zu gewährleisten, signiere ich ausschließlich Schlüssel, die aktuellen kryptografischen Standards entsprechen. Schwache Signaturen innerhalb des Vertrauensnetzes schwächen nicht nur den einzelnen Nutzer, sondern das gesamte Ökosystem. Daher orientiere ich mich strikt an den Empfehlungen der Technischen Richtlinie des Bundesamtes für Sicherheit in der Informationstechnik (BSI TR-02102-1).

#### Akzeptierte Schlüsselparameter und Algorithmen
Ich unterstütze den Übergang zu modernen, effizienten und sicheren Verfahren. Folgende Parameter sind Voraussetzung für eine Signierung:

*   **Elliptische Kurven (ECC):** Dies ist mein bevorzugtes Verfahren. Ich akzeptiere Schlüssellängen von mindestens 250 Bit. Dazu gehören insbesondere:
    *   **EdDSA:** Ed25519 und Ed448 (modern, performant und sicher gegen viele Seitenkanalangriffe).
    *   **NIST-Kurven:** P-256, P-384, P-521.
    *   **Brainpool-Kurven:** brainpoolP256r1, brainpoolP384r1, brainpoolP512r1.
*   **RSA (Rivest-Shamir-Adleman):** Aufgrund der fortschreitenden Rechenleistung und neuer Angriffsvektoren akzeptiere ich RSA-Schlüssel erst ab einer Länge von **mindestens 3000 Bit**. In der Praxis sind dies üblicherweise:
    *   3072 Bit oder 4096 Bit.
*   **Hash-Algorithmen (für Zertifizierungssignaturen):** Die für die Signatur verwendeten Hash-Funktionen müssen kollisionsresistent nach aktuellem Stand der Technik sein. Akzeptiert werden:
    *   SHA-256, SHA-384, SHA-512 (SHA-2 Familie).
    *   SHA3-256, SHA3-512 (SHA-3 Familie).

#### Ablehnung veralteter und unsicherer Standards
Schlüssel, die auf veralteten oder mathematisch geschwächten Verfahren basieren, werde ich konsequent **nicht** signieren. Dies umfasst insbesondere:

*   **Veraltetes RSA:** RSA-Schlüssel mit Längen unter 3000 Bit (z. B. 1024 oder 2048 Bit) gelten heute als nicht mehr langfristig sicher.
*   **DSA (Digital Signature Algorithm):** Da der klassische DSA-Standard häufig mit zu kleinen Schlüssellängen oder unsicheren Parametern implementiert wurde, lehne ich diese ab.
*   **Unsichere Hash-Funktionen:** Jegliche Zertifizierungen, die auf **SHA-1, RIPEMD-160 oder MD5** basieren, werden abgelehnt. SHA-1 gilt spätestens seit den "SHAttered"-Angriffen als gebrochen für digitale Signaturen.

Mein eigener Primärschlüssel basiert auf modernen Elliptischen Kurven (Ed448/Ed25519) und spiegelt diesen hohen Sicherheitsanspruch wider. Ich empfehle jedem Nutzer, beim Erstellen neuer Schlüssel direkt auf ECC-Verfahren zu setzen, um eine optimale Balance zwischen Sicherheit und Performance zu erreichen.

### E-Mail-Verifizierung und Rückgabe der Signatur
Die Prüfung eines amtlichen Ausweises bestätigt lediglich die Identität der physischen Person, jedoch nicht die Kontrolle über die im Schlüssel angegebene E-Mail-Adresse. 

Daher lade ich von mir signierte Schlüssel niemals direkt auf einen öffentlichen Keyserver hoch. Stattdessen exportiere ich die erstellte Signatur, verschlüssele sie mit dem Public Key des Gegenübers und sende sie an die in der User-ID angegebene E-Mail-Adresse. 

Es liegt in der Verantwortung des Empfängers, die E-Mail zu entschlüsseln, die Signatur in den eigenen Schlüsselring zu importieren und das Update anschließend selbst auf den Keyservern zu veröffentlichen. So ist kryptografisch sichergestellt, dass die Person tatsächlichen Zugriff auf die E-Mail-Adresse besitzt.

### Haftungsausschluss und Vertraulichkeit (Rechtliches)
*   **Keine Haftung für Dritte:** Mit der Signierung eines Schlüssels bestätige ich lediglich die Identität des Inhabers zum Zeitpunkt unseres Treffens. Ich übernehme ausdrücklich keine Verantwortung für das spätere Verhalten der Personen, deren Schlüssel ich signiert habe, oder für die Qualität und Vertrauenswürdigkeit von Signaturen, die diese Personen ihrerseits leisten.
*   **Brief- und Postgeheimnis:** Ich behandle alle an mich gerichteten verschlüsselten Nachrichten mit der gebotenen Sorgfalt und Diskretion, analog zum Brief- und Postgeheimnis. Ich werde Dritten keinen Einblick in die Inhalte dieser Kommunikation gewähren, es sei denn, ich bin gesetzlich dazu verpflichtet. Dafür müssen mir die entsprechenden Gesetze von vertrauenswürdigen Quellen vorgelegt werden, damit ich diesen nachkomme.

#### Hintergrund: Das Brief- und Postgeheimnis
Das Brief- und Postgeheimnis schützt die Vertraulichkeit von Sendungen und Informationen vor unbefugter Kenntnisnahme. In meiner Policy übertrage ich diesen Grundsatz auf die digitale Kommunikation:
*   **Verschlüsselung als digitaler Umschlag:** Eine verschlüsselte Nachricht ist für mich wie ein versiegelter Brief. Das unbefugte Mitlesen oder die Weitergabe des Inhalts ohne ausdrückliche Zustimmung ist ein Eingriff in die Privatsphäre, den ich strikt ablehne.
*   **Recht auf vertrauliche Kommunikation:** Ich sehe die Verwendung von PGP nicht als Zeichen von Misstrauen, sondern als Wahrnehmung des Rechts auf eine geschützte Privatsphäre, die analog zur physischen Post auch digital unantastbar sein sollte.
