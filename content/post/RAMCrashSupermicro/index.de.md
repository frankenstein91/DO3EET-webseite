+++
title = 'Ein RAM-Riegel zu viel: Wochenende, IPMI und 24 DIMM-Slots'
date = "2026-10-31T22:10:05+01:00"
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "Homelab",
    "Linux",
    "Troubleshooting",
    "Sysadmin",
]
+++

Es gibt Wochenenden, an denen man sich einfach gemütlich an den Schreibtisch setzen und ein bisschen am Homelab werkeln möchte. Und dann gibt es die Wochenenden, an denen einem die eigene Hardware subtil zu verstehen gibt, wer hier eigentlich die Kontrolle hat.

In meinem Fall war es mein treuer Hauptrechner („MasterSystem“) – ein etwas älteres, aber grundsolides Dual-Socket-Schlachtschiff auf Basis eines **Supermicro X9DRi-LN4+** mit zwei Intel Xeon E5-2640 Prozessoren. Das Schöne (und Fluch zugleich) an solchen Enterprise-Boards: Es verfügt über satte **24 DIMM-Slots**, voll bestückt mit 16-GB-Modulen von Hynix. Insgesamt also 384 GiB DDR3 Registered ECC RAM. Ein Traum für Virtualisierung, lokale Builds und hungrige Dienste – bis einer dieser 24 Riegel beschließt, schlappzumachen.

Vor einigen Wochen gab es mitten in der Nacht einen abrupten Systemabsturz. Da ich die Riegel bei früheren Tests schon einmal quer durch die Bänke umgesteckt hatte, stand ich nun vor der klassischen Frage: **Welcher der 24 Riegel ist der Übeltäter, wo genau auf dem Mainboard steckt er, und wie kriege ich ihn zielsicher heraus?**

---

### Spurensuche im IPMI: Die Nadel im Lüfter-Heuhaufen

Glücklicherweise besitzen Server-Mainboards ein BMC mit IPMI (Intelligent Platform Management Interface). Selbst wenn das Betriebssystem hart wegschmiert, protokolliert der Baseboard Management Controller hardwarenahe Ereignisse unabhängig im sogenannten **System Event Log (SEL)**.

Also verband ich mich per SSH und warf einen Blick auf die Ereignisliste:

```bash
sudo ipmitool sel elist
```

Die Ernüchterung folgte auf dem Fuße: Der Speicher war zu **100 % voll** (512 Einträge) und meldete einen Overflow. Die letzten dutzenden Seiten bestanden aus scheinbar endlosem Lüfter-Spam:

```text
 c37 | 08/31/26 | 09:35:10 CEST | Fan FAN1 | Lower Non-recoverable going low  | Asserted | Reading 0 < Threshold 0 RPM
 e37 | 10/31/26 | 20:48:23 CET  | Fan FAN1 | Lower Critical going low         | Asserted | Reading 0 < Threshold 0 RPM
 e38 | 10/31/26 | 20:48:23 CET  | Fan FAN1 | Lower Non-recoverable going low  | Asserted | Reading 0 < Threshold 0 RPM
 e39 | 10/31/26 | 20:48:23 CET  | Fan FAN5 | Lower Critical going low         | Asserted | Reading 0 < Threshold 0 RPM
```

Des Rätsels Lösung für diesen Spam: Wenn die PWM-Lüfter (`FAN1` und `FAN5`) im Leerlauf sehr weit herunterregeln, unterschreiten sie kurzzeitig die im BMC fest hinterlegte Schwelle von 0 RPM. Das BMC gerät in Panik („Lüfter ausgefallen!“), schlägt Alarm und meldet Sekundenbruchteile später Entwarnung, sobald wieder Drehzahl anliegt. Bei 512 Plätzen im Ringspeicher verdrängt das in wenigen Wochen jede historische Meldung.

Doch mit einem beherzten Filter auf alles, was kein Lüfter ist:

```bash
sudo ipmitool sel elist | grep -iv fan
```

...tauchte er plötzlich auf, der goldene Treffer:

```text
 de9 | 09/28/26 | 04:20:18 CEST | Memory | Correctable ECC (@DIMMD3(CPU1)) | Asserted
```

Ein Blick in die Systemd-Journale des vorherigen Boots (`journalctl -b -1`) brachte die Bestätigung: Der Rechner war am 28. September exakt um **04:19:41 CEST** während eines automatischen Scans von ClamAV und Syncthing unangekündigt abgerissen. Exakt zu dem Zeitpunkt, als das BMC den ECC-Fehler auf **`DIMMD3` an `CPU 1`** registriert hatte.

---

### Die Topologie: Wo zum Teufel liegt `DIMMD3`?

Einen Slot-Namen im Log zu haben ist die halbe Miete. Ihn physisch im Gehäuse zwischen Kabelsträngen, zwei massiven CPU-Kühlern und 24 dicht gedrängten RAM-Riegeln zu finden, ist die andere.

Beim Supermicro X9DRi-LN4+ verteilt sich das Speicher-Subsystem wie folgt:
* **CPU 1** (der Sockel weiter vorne in Richtung Gehäusefront/Mitte) verwaltet 12 Slots über 4 Kanäle (A, B, C, D).
* **CPU 2** verwaltet die anderen 12 Slots (Kanäle E, F, G, H).

Direkt neben CPU 1 befinden sich zwei getrennte 6er-Bänke:
1. **Reihe A/B** (oben/Richtung Boardmitte): `P1-DIMMA1..A3` und `P1-DIMMB1..B3`
2. **Reihe C/D** (unten/Richtung SATA-Ports): `P1-DIMMC1..C3` und `P1-DIMMD1..D3`

In der 6er-Bank (Reihe C/D) von CPU 1 ist die physische Anordnung auf der Platine von der CPU weg nach außen wie folgt gestaffelt:

```text
[ CPU 1 Sockel ]
       │
       ▼
 ┌───────────┐  Slot 1:  P1-DIMMD3  <-- DEFEKT (Schwarz, direkt neben der CPU!)
 │ ░░░░░░░░░ │  Slot 2:  P1-DIMMD2  (Schwarz)
 │           │  Slot 3:  P1-DIMMD1  (Blau - Kanal D, 1. Riegel)
 │           │  Slot 4:  P1-DIMMC3  (Schwarz)
 │           │  Slot 5:  P1-DIMMC2  (Schwarz)
 │           │  Slot 6:  P1-DIMMC1  (Blau - Kanal C, äußerer Rand)
 └───────────┘
       │
       ▼
 [ SATA-/SAS-Ports, FAN3 & Platinenkante ]
```

Typische Homelab-Falle: Intuitiv vermutet man oft, dass Kanal C näher an der CPU liegt und Slot 1 innen beginnt. Auf diesem Board sitzt aber tatsächlich **`P1-DIMMD3` unmittelbar neben dem CPU-Sockel**! Zum Glück ist die weiße Beschriftung auf dem Mainboard (Silkscreen) eindeutig.

Um vor dem Ausbau sicherzugehen, las ich per `dmidecode` noch die Daten des Riegels aus:

```bash
sudo dmidecode -t 17 | grep -B 2 -A 12 "Locator: P1-DIMMD3"
```

Ergebnis:
* **Hersteller:** Hynix Semiconductor
* **Teilenummer:** `HMT42GR7MFR4A-H9` (16 GiB DDR3 Registered ECC)
* **Seriennummer:** `2FCE471A`

---

### Der Spickzettel-Trick

Weil es unhandlich ist, mit dem aufgeklappten Laptop auf dem aufgeschraubten Big-Tower herumzubalancieren, habe ich mir schnell mit Typst ein einseitiges A4-Datenblatt mit Lageplan, Slot-Kennzeichnung, Checkliste und Seriennummer gebaut und direkt über CUPS auf den HP-Netzwerkdrucker geschickt. 

Ein Zettel in der Hand, Taschenlampe an – und ab ans Gehäuse.

---

### Der Schreckmoment: Die falsche Seriennummer?!

PC ordnungsgemäß heruntergefahren, Kaltgerätestecker gezogen, geerdet, Seitenteil ab. 

Dank des Blicks auf die weiße Platinen-Beschriftung war der Riegel direkt neben dem Sockel von CPU 1 schnell gefunden: Der Aufdruck `P1-DIMMD3` auf dem PCB war eindeutig. Die beiden Halteklammern zur Seite geklickt, das Modul vorsichtig herausgezogen – und dann der Blick auf das weiße Hynix-Etikett:

> *„Moment mal... HMT42GR7MFR4A-H9 stimmt, aber warum endet die aufgedruckte Seriennummer auf `3LH4` statt auf `2FCE471A`?! Habe ich den falschen Riegel erwischt?!“*

Kurze Verwirrung im Bastelkeller. Doch des Rätsels Lösung ist ein technisches Detail, über das man im Alltag selten nachdenkt:

Auf jedem RAM-Modul sitzt ein winziger I²C-Chip, das **SPD-EEPROM (Serial Presence Detect)**. In diesem Chip speichert der Hersteller nach JEDEC-Standard (Bytes 122–125) eine 32-Bit-Binärzahl als eindeutige Modul-Seriennummer. Genau diese 4 Bytes liest das BIOS bzw. `dmidecode` als Hex-Wert aus: `0x2FCE471A`.

Auf den Papieretiketten drucken Hersteller wie SK Hynix jedoch häufig nicht diesen Roh-Hex-Wert ab, sondern **proprietäre Tracking-, Los- oder Chargennummern** aus der Fabrikationsstraße (in meinem Fall endend auf `3LH4`). Der gedruckte Code und die SPD-Hex-ID stimmen im Klartext fast nie überein!

---

### Die Stunde der Wahrheit: Der Kontroll-Boot

Gehäuse wieder zu, Netzteil an, Einschaltknopf gedrückt. 

Durch den Neustart bezog der Rechner per DHCP eine frische IP (`10.2.111.116`). Wieder per SSH drauf, `dmidecode` angeworfen – und siehe da:

```text
Handle 0x0045, DMI type 17, 34 bytes
Memory Device
	Array Handle: 0x002F
	Size: No Module Installed
	Locator: P1-DIMMD3
	Bank Locator: P0_Node0_Channel3_Dimm2
```

Ein Abgleich über alle verbleibenden Riegel: Die Seriennummer `2FCE471A` existierte nirgends mehr im System. Der Speicher sank exakt von 377 GiB auf 362 GiB nutzbaren RAM. Es war also tatsächlich auf den Millimeter genau der richtige Riegel!

---

### Fazit & Homelab-Lektionen

1. **ECC-RAM ist Gold wert:** In einem Consumer-System ohne Error Correction wäre der Rechner bei defekten Speicherzellen vermutlich schleichend mit Bit-Flips, korrupten Datenbanken oder Dateisystemfehlern gestorben. Dank ECC gab es eine klare Fehlermeldung mit genauer Slot-Angabe im BMC.
2. **IPMI-Lüfterschwellen im Auge behalten:** Wenn die Lüfter im Leerlauf unter die BMC-Grenze fallen, läuft das SEL in wenigen Wochen voll. Die Grenzwerte lassen sich via `ipmitool sensor thresh "FAN1" lower 150 225 300` anpassen, damit echte Hardware-Fehler nicht im Rauschen untergehen.
3. **Aufkleber vs. SPD-ID:** Man darf sich nicht irritieren lassen, wenn die hexadezimale Seriennummer aus dem Betriebssystem nicht buchstabengetreu auf dem Riegel-Aufkleber steht.
4. **23 Riegel reichen auch:** Ob 384 GiB oder 368 GiB – im Alltag merkt man die fehlenden 16 GB nicht im Geringsten. Aber das System läuft wieder felsenfest stabil.
