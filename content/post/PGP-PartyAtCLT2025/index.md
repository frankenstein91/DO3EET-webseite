+++
title = 'PGP-Party@CLT2025'
date = 2025-03-08T20:19:42+01:00
draft = false
author = "Frank Tornack & Martin Schulz"
tags = [
    "Linux",
    "PGP",
    "Open Source",
    "Chemnitz",
    "Kryptographie",
    ]
+++

Dieses Jahr bietet sich zusätzlich zu einem Stand auf den [Chemnitzer Linuxtagen](https://chemnitzer.linux-tage.de/), auch die Herausforderung die [Keysigning-Party](https://chemnitzer.linux-tage.de/2025/de/addons/pgp) zu übernehmen. Diese war zwischenzeitlich abgesagt, was wir (Martin und ich) sehr schade fanden und die Organisation übernommen haben.
Auch wenn im Amateurfunkverkehr die Verschlüsslung nicht erlaubt ist, so ist es im Internet eine wichtige Möglichkeit zum Datenschutz. Und unter uns Amateurfunkern ist zumindest die digitale Signatur erlaubt.

## Was ist dieses PGP/GPG?

Wenn von **PGP** (Pretty Good Privacy) die Rede ist, meint man oft fälschlicherweise den OpenPGP-Standard. PGP selbst wurde aber ursprünglich von Phil Zimmermann entwickelt und ist eine proprietäre Software zur Verschlüsselung und digitalen Signatur von Daten.

Um eine offene und standardisierte Lösung zu schaffen, wurde später der **OpenPGP**-Standard eingeführt. Dieser definiert ein einheitliches Format für die Verschlüsselung und Signierung von Daten, welche von verschiedenen Programmen genutzt werden kann.

Eine der bekanntesten Implementierungen dieses Standards ist **GPG** (GNU Privacy Guard). GPG ist quelloffen und besonders in der Linux-Welt weit verbreitet. Aufgrund dieser Popularität wird der Begriff "GPG" oft als ein Synonym für das gesamte OpenPGP-Kryptosystem verwendet, obwohl es sich dabei eigentlich nur um eine spezifische Implementierung handelt.

## Was ist ein PGP-Key?

Ein PGP-Key ist ein Kryptografieschlüssel, der zum Verschlüsseln, Entschlüsseln und Signieren von Daten verwendet wird. Der Schlüssel kann aus mehreren Unterschlüsseln aufgebaut sein, die wiederum verschiedene Kryptografiealgorithmen nutzen können.

### der Nutzen von Signaturen

PGP-Signaturen dienen dazu, die Vertraulichkeit und Integrität von Daten zu gewährleisten, insbesondere bei der elektronischen Kommunikation.

### der Nutzen von Verschlüsslung

Mit einer Verschlüsslung ist es möglich, E-Mails, Dateien und andere Informationen so zu verändern, dass nur der beabsichtige Empfänger diese auch lesen kann.

### der Nachteil von Verschlüsslung

Im aktuellen digitalen Nachrichtenverkehr (E-Mail), ist Verschlüsslung noch nicht bei jedem Nutzer angekommen. Daher macht eine gut verschlüsselte Mail immer noch Angreifer neugierig.

## Was ist eine PGP-Party?

Eine Keysigning-Party ist eine Veranstaltung, bei der sich Nutzer von Verschlüsselungssoftware wie GPG (GNU Privacy Guard) treffen, um ihre öffentlichen Schlüssel auszutauschen und zu signieren. Sie dienen dazu, das Vertrauen in die Echtheit von öffentlichen Schlüsseln zu stärken. Durch das gegenseitige Signieren bestätigen die Teilnehmer, dass sie die jeweilige Person persönlich kennen und deren Schlüssel als gültig ansehen.

## Wie erstelle ich einen Schlüssel?

Persönlich bin ich ein größer Fan der Elliptic Curve Cryptography. Damit erreicht man mit deutlich kürzeren Schlüsseln ein vergleichbares Sicherheitsniveau wie RSA. Dies führt zu geringerem Speicherbedarf und schnelleren Berechnungen. Zudem wird die ECC als möglicher Schutz gegenüber Quantencomputern gehandelt. Daher schreibe ich diese kurze Anleitung entsprechend.

Den Key-Generator startet man für dieses Beispiel mit dem Befehl `gpg --expert --full-generate-key`. Die Option `--expert` ermöglicht den Zugriff auf erweiterte Konfigurationsmöglichkeiten. Die `--full-generate-key` Option initiiert den Prozess der vollständigen Schlüsselerzeugung. Im Unterschied zu `gpg --gen-key` werden dabei die erweiterten Optionen des Expertenmodus berücksichtigt.

Nach dem Start bietet sich folgende Auswahl:
```
gpg (GnuPG) 2.4.7; Copyright (C) 2024 g10 Code GmbH
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Bitte wählen Sie, welche Art von Schlüssel Sie möchten:
   (1) RSA und RSA
   (2) DSA und Elgamal
   (3) DSA (nur signieren)
   (4) RSA (nur signieren)
   (7) DSA (Nutzung selber einstellbar)
   (8) RSA (Nutzung selber einstellbar)
   (9) ECC (signieren, verschlüsseln) *standard*
  (10) ECC (nur signieren)
  (11) ECC (Nutzung selber einstellbar)
  (13) Vorhandener Schlüssel
  (14) Vorhandener Schlüssel auf der Karte
Ihre Auswahl?
```
Für uns passend ist die Option **9**. Auch hier bietet sich wieder eine Auswahl:
```
Bitte wählen Sie, welche elliptische Kurve Sie möchten:
   (1) Curve 25519 *standard*
   (2) Curve 448
   (3) NIST P-256
   (4) NIST P-384
   (5) NIST P-521
   (6) Brainpool P-256
   (7) Brainpool P-384
   (8) Brainpool P-512
   (9) secp256k1
Ihre Auswahl?
```
Persönlich empfehle ich hier die Auswahl **1** oder **2**. Trotzdem gehe ich kurz auf die Optionen ein...

**Curve 25519** wurde von Daniel J. Bernstein entwickelt und ist unter der Verwendung der Montgomery-Kurvenform für Geschwindigkeit und Sicherheit optimiert. Das Sicherheitsniveau wird oft als hoch eingeschätzt. 

**Curve 448** von Mike Hamburg bietet ein sehr hohes Sicherheitsniveau in sicherheitskritischen Anwendungsfällen unter verwendung der selben Kurvenform.

Die drei **NIST** Kurven sind vom National Institute of Standards and Technology der USA entwickelt. Sie verwenden die Weierstrass-Kurvenform. Diese Kurven sind umstritten. Hauptkritikpunkt ist die mangelnde Transparenz bei der Auswahl der Parameter für diese Kurven. Es gibt Bedenken, dass die Entscheidungen hinter verschlossenen Türen getroffen wurden, was zu Spekulationen über mögliche Hintertüren oder Schwachstellen führt. Die Befürchtung einer "kleptographischen[^1] Hintertür" ist hierbei ein oft genannter Punkt.

Die drei **Brainpool**-Kurven sind eine in Europa beliebte Alternative zu den NIST-Kurven und basieren auf der selben Kurvenform. Auch diesen wird von vielen Fachleuten ein hohes Sicherheitsniveau bescheinigt.

**secp256k1** ist meist durch die Verwendung bei Kryptowährungen bekannt. Diese Kurve ist besonders für ressourcenbeschränkte Geräte geeignet.

Im Anschluss wird GPG nach der verlängerbaren Laufzeit fragen.
```
Bitte wählen Sie, wie lange der Schlüssel gültig bleiben soll.
         0 = Schlüssel verfällt nie
      <n>  = Schlüssel verfällt nach n Tagen
      <n>w = Schlüssel verfällt nach n Wochen
      <n>m = Schlüssel verfällt nach n Monaten
      <n>y = Schlüssel verfällt nach n Jahren
Wie lange bleibt der Schlüssel gültig?
```
Hier sollte man sich nicht für eine Laufzeit bis in die ∞ entscheiden. Nach dieser Entscheidung werden noch der Name, die E-Mail und ein möglicher Kommentar abgefragt. Sobald diese Informationen zur eigenen Zufriedenheit befüllt sind, wird noch das Passwort zum Schlüsselschutz vergeben.

Wer möchte kann diesem Key auch noch einen Authentication-Subkey hinzufügen und diesen damit auch für SSH-Anmeldungen nutzen. Hier suche ich übrigens eine Möglichkeit allen Schlüssel die Anmeldung zu erlauben, welche von einem bestimmten Schlüssel signiert sind. Wer dafür eine Lösung kennt, unten gibt es einen Bereich für Kommentare.

Hier ein kleines Quiz... Auflösung am Yacy-Stand auf den CLT2025 (es gibt keinen Gewinn):  
`{{< randomfromlist >}}
Ejf Mjovy Ubhf jo Difnojua xfsefo vot xjfefs wjfm Xjttfo wfsnjuufmo
Fkg Nkpwz Vcig kp Ejgopkvb ygtfgp wpu ykgfgt xkgn Ykuugp xgtokvvgnp
Glh Olqxa Wdjh lq Fkhpqlwc zhughq xqv zlhghu ylho Zlvvhq yhuplwwhoq
Hmi Pmryb Xeki mr Gliqrmxd aivhir yrw amihiv zmip Amwwir zivqmxxipr
Inj Qnszc Yflj ns Hmjrsnye bjwijs zsx bnjijw anjq Bnxxjs ajwrnyyjqs
Jok Rotad Zgmk ot Inkstozf ckxjkt aty cokjkx bokr Coyykt bkxsozzkrt
Kpl Spube Ahnl pu Joltupag dlyklu buz dplkly cpls Dpzzlu clytpaalsu
Lqm Tqvcf Biom qv Kpmuvqbh emzlmv cva eqmlmz dqmt Eqaamv dmzuqbbmtv
Mrn Urwdg Cjpn rw Lqnvwrci fnamnw dwb frnmna ernu Frbbnw enavrccnuw
Nso Vsxeh Dkqo sx Mrowxsdj gobnox exc gsonob fsov Gsccox fobwsddovx
Otp Wtyfi Elrp ty Nspxytek hpcopy fyd htpopc gtpw Htddpy gpcxteepwy
Puq Xuzgj Fmsq uz Otqyzufl iqdpqz gze iuqpqd huqx Iueeqz hqdyuffqxz
Qvr Yvahk Gntr va Purzavgm jreqra haf jvrqre ivry Jvffra irezvggrya
Rws Zwbil Hous wb Qvsabwhn ksfrsb ibg kwsrsf jwsz Kwggsb jsfawhhszb
Sxt Axcjm Ipvt xc Rwtbcxio ltgstc jch lxtstg kxta Lxhhtc ktgbxiitac
Tyu Bydkn Jqwu yd Sxucdyjp muhtud kdi myutuh lyub Myiiud luhcyjjubd
Uzv Czelo Krxv ze Tyvdezkq nviuve lej nzvuvi mzvc Nzjjve mvidzkkvce
Vaw Dafmp Lsyw af Uzwefalr owjvwf mfk oawvwj nawd Oakkwf nwjeallwdf
Wbx Ebgnq Mtzx bg Vaxfgbms pxkwxg ngl pbxwxk obxe Pbllxg oxkfbmmxeg
Xcy Fchor Nuay ch Wbyghcnt qylxyh ohm qcyxyl pcyf Qcmmyh pylgcnnyfh
Ydz Gdips Ovbz di Xczhidou rzmyzi pin rdzyzm qdzg Rdnnzi qzmhdoozgi
Zea Hejqt Pwca ej Ydaijepv sanzaj qjo seazan reah Seooaj ranieppahj
Afb Ifkru Qxdb fk Zebjkfqw tboabk rkp tfbabo sfbi Tfppbk sbojfqqbik
Bgc Jglsv Ryec gl Afcklgrx ucpbcl slq ugcbcp tgcj Ugqqcl tcpkgrrcjl
Chd Khmtw Szfd hm Bgdlmhsy vdqcdm tmr vhdcdq uhdk Vhrrdm udqlhssdkm
{{< /randomfromlist >}}`

[^1]: Der Begriff Kleptographie ist ein Bindewort der griechischen Wörter "klepto" und "graphie" und beschreibt das heimliche Stehlen von Informationen aus manipulierten kryptografische Methoden.