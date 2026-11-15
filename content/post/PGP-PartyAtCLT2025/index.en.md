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
    "Encryption",
]
+++

This year, on top of running a booth at [Chemnitzer Linux-Tage](https://chemnitzer.linux-tage.de/), we also took on the challenge of hosting the [Keysigning Party](https://chemnitzer.linux-tage.de/2025/de/addons/pgp). It had temporarily been canceled, which Martin and I thought was a real shame—so we stepped up and took over organizing it.
Even though encryption isn't allowed in amateur radio transmissions, online it remains one of the best tools we have for protecting privacy. And hey, among us ham operators, digital signatures at least are totally fair game.

## What Is This PGP/GPG Thing Anyway?

When people talk about **PGP** (Pretty Good Privacy), they often mean the **OpenPGP** standard without realizing the difference. PGP itself was originally created by Phil Zimmermann and is proprietary software for encrypting and digitally signing data.

To establish an open, vendor-neutral standard, **OpenPGP** was introduced later on. It defines a unified format for encrypting and signing data that any compliant program can implement.

One of the best-known implementations of that standard is **GPG** (GNU Privacy Guard). GPG is open source and ubiquitous in the Linux world. Because it's so widespread, people routinely use "GPG" as shorthand for the entire OpenPGP ecosystem, even though it's technically just one specific implementation.

## What Is a PGP Key?

A PGP key is a cryptographic key used to encrypt, decrypt, and sign data. A single key can actually consist of multiple subkeys, each potentially using different cryptographic algorithms.

### Why Signatures Matter

PGP signatures verify authenticity and data integrity—especially handy when communicating electronically.

### Why Encryption Matters

Encryption scrambles emails, files, and other data so that only the intended recipient can read them.

### The Catch with Encryption

In everyday digital messaging (especially email), encryption still hasn't gone mainstream. As a result, a properly encrypted email can ironically still attract extra curiosity from snoops.

## What Is a PGP Party?

A Keysigning Party is an event where users of encryption tools like GPG (GNU Privacy Guard) meet up in person to exchange and sign each other's public keys. The goal is to build real-world trust in the authenticity of those keys. By signing one another's keys, attendees vouch that they've actually met the person behind the key and verified that it belongs to them.

## How Do I Create a Key?

Personally, I'm a big fan of Elliptic Curve Cryptography (ECC). It delivers security levels comparable to RSA using drastically shorter keys—which means lower memory overhead and faster math. On top of that, ECC is often discussed in the context of post-quantum resilience. So I'll walk you through a quick setup using ECC.

Fire up the key generator with `gpg --expert --full-generate-key`. Passing `--expert` unlocks advanced configuration options, while `--full-generate-key` walks you through the full key creation flow (unlike plain `gpg --gen-key`, which skips the expert options).

Once started, you'll get a menu like this:
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
Option **9** (`ECC (sign, encrypt)`) is what we want. Next up, another choice:
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
I personally recommend **1** or **2** here—though let's briefly look at what each curve brings to the table...

**Curve 25519**, designed by Daniel J. Bernstein, uses the Montgomery curve form and is tuned for both speed and security. Its security margin is widely considered very strong.

**Curve 448**, by Mike Hamburg, uses the same curve form and aims for an extra-high security margin in critical applications.

The three **NIST** curves were published by the U.S. National Institute of Standards and Technology and use the Weierstrass form. They've long been controversial, mainly due to a lack of transparency around how their parameters were chosen—fueling speculation about closed-door decisions and potential backdoors or weaknesses. You'll frequently hear fears of a "kleptographic[^1] backdoor" raised here.

The three **Brainpool** curves are a popular European alternative to the NIST curves, using the same curve form, and are likewise regarded by many experts as offering solid security.

**secp256k1** is best known from cryptocurrencies and is particularly well suited for resource-constrained hardware.

Next, GPG asks how long the key should remain valid (you can always extend it later):
```
Bitte wählen Sie, wie lange der Schlüssel gültig bleiben soll.
         0 = Schlüssel verfällt nie
      <n>  = Schlüssel verfällt nach n Tagen
      <n>w = Schlüssel verfällt nach n Wochen
      <n>m = Schlüssel verfällt nach n Monaten
      <n>y = Schlüssel verfällt nach n Jahren
Wie lange bleibt der Schlüssel gültig?
```
Do yourself a favor and don't pick `0` (valid until the heat death of the universe). After setting an expiration date, GPG prompts for your name, email address, and an optional comment. Once you're happy with those details, you'll set a passphrase to protect the key.

If you want, you can also add an Authentication subkey to the same key and use it for SSH logins. Incidentally, I'm still looking for a clean way to authorize SSH logins for *any* key signed by a specific trusted key—if you know how to pull that off, drop a note in the comments below!

And here's a quick puzzle... Solution available at the YaCy booth at CLT2025 (no prize, just bragging rights):  
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

[^1]: The term *kleptography* is a portmanteau of the Greek words *klepto* ("steal") and *graphia* ("writing"), referring to covertly leaking or stealing secret information through compromised cryptographic implementations.
