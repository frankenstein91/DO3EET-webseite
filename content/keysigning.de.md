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
