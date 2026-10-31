+++
title = 'MSI MS-7673 BIOS-Update auf v6.20 mit FreeDOS: Fallstricke und Lösung'
date = "2026-10-31T20:08:58+01:00"
draft = false
author = "Frank Tornack"
tags = [
    "Hardware",
    "BIOS",
    "Linux",
    "FreeDOS",
    "Troubleshooting",
]
+++

Manchmal holt einen die Computer-Archäologie schneller ein, als einem lieb ist. In meinem Fall ging es um den Rechner meiner Mutter („MuttiLinux“) – ein grundsolides System mit einem **MSI PH67A-C43 (B3)** (intern MS-7673) und einem Intel Core i5-2500K („Sandy Bridge“). Das System lief seit Jahren stabil unter Linux, war aber firmware-seitig auf dem Stand von 2012 eingefroren: BIOS-Version **2.70**.

Da neuere Linux-Kernel und moderne Grafikkarten mit zeitgemäßer UEFI-Unterstützung und aktueller Firmware deutlich runder laufen, stand der Entschluss fest: Das finale BIOS-Update auf Version **6.20** muss auf das Board. Doch dieser Versionssprung ist kein gewöhnliches Update – und der Weg dorthin bescherte mir einen handfesten 30-Minuten-Schreckmoment.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_v270_before.jpg" alt="MSI BIOS vor dem Update auf Version 2.7" width="1600" height="1200" >}}

---

# Der MSI-Support und die verhängnisvolle Frage

Auf der Support-Webseite von MSI findet man für die 6er-Serie (P67/H67/Z68) beim Sprung von Version 2.x auf 6.x keine gewöhnliche `.rom`- oder `.bin`-Datei für das boardeigene M-Flash, sondern lediglich eine ausführbare Windows-Datei: `E7673v62.exe`. Der Grund dafür: Mit Version 6.x wechselte MSI von Intel Management Engine 7 (ME7, 1.5/5 MB) auf Intel Management Engine 8 (ME8, 8 MB), um auch Ivy-Bridge-Prozessoren zu unterstützen. Dieser Wechsel erfordert eine Neupartitionierung des SPI-Flash-Bausteins in zwei Etappen.

Da ich als Linux-Nutzer ungern ein Windows installiere, nur um ein BIOS zu flashen, wandte ich mich vorab an den MSI-Support mit der Bitte um ein reines Image:

> **MSI Tech Support:**  
> *„Leider können wir keine reine Bin-Datei zur Verfügung stellen, weil dann nicht gewährleistet werden kann, dass die ME-Version auch aktualisiert wird. Sie können einen DOS-fähigen Bootstick erstellen und dann die EXE-Datei darüber ausführen.“*

Das klang machbar. Da eine MS-DOS-Lizenz im Jahr 2026 nicht mehr an jeder Ecke liegt, stellte ich die entscheidende Nachfrage:

> **Meine Frage an den Support:**  
> *„Guten Abend, ist das Tool FreeDOS-kompatibel? Vielen Dank für das Feedback.“*

Die Antwort ließ nicht lange auf sich warten – kurz, trocken und voller Selbstbewusstsein:

> **MSI Tech Support:**  
> *„Ja ist es.“*

Mit diesem scheinbaren Freifahrtschein machte ich mich ans Werk.

---

# Vorbereitung des USB-Sticks

Ich schnappte mir ein altes USB-Schätzchen (128 MB reichen für DOS völlig) und das aktuelle **FreeDOS 1.4 Lite USB-Image** (`FD14LITE.img`). Das Image wurde per `dd` auf den Stick geschrieben. 

Da der MSI-Flasher während der Ausführung temporäre Dateien entpacken muss, habe ich auf der 32-MB-Partition etwas Hausputz gehalten:
* Der Ordner `PACKAGES/` (FreeDOS-Paketquellen) und `SETUP.BAT` flogen runter, um über 20 MB freien Speicher zu schaffen.
* Die `E7673v62.exe` kam direkt ins Hauptverzeichnis.
* Die automatische CD-ROM-Treibersuche in `FDAUTO.BAT` wurde auskommentiert, damit der Stick ohne Verzögerung direkt in den DOS-Prompt `C:\>` startet.

---

# Der erste Versuch & Der 30-Minuten-Herzkasper

Stick am rückseitigen USB-2.0-Port des MSI-Boards eingesteckt, über `F11` gebootet – FreeDOS meldete sich in Sekundenbruchteilen mit `C:\>`.

Voller Zuversicht startete ich das Update-Programm:
```text
C:\>E7673V62
```

Schon beim Start des Wrappers zuckte ich kurz zusammen:
```text
remove temporary files..CHDIR failed for '..'.
. ok
-- MSI BIOS UPDATE -- Ver: 1.10
Checking model name... ok
Checking PCB version... ok
Checking BIOS version... ok
model name : MS-7673
current version : 2.70
new version : 6.20
Extracting files..CHDIR failed for '..'.
..
.. ok
CHDIR failed for 'XDXWRXGM'
Do you want to update your BIOS ?
Press (Y) to continue updating BIOS.
Press (N) to cancel.
```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_FreeDOS_freeze.jpg" alt="FreeDOS Fehler CHDIR failed und Stillstand bei start to update new BIOS" width="1600" height="1200" >}}

Ein paar unschöne `CHDIR failed`-Meldungen, aber das Tool meldete überall brav `ok`, hatte Modell und Board-Versionen korrekt identifiziert und fragte nach meiner Bestätigung.

Also drückte ich **`Y`**. Der Bildschirm quittierte:

```text
Please don't remove USB drive or shutdown system during BIOS update process
start to update new BIOS....
```

Und dann: **Nichts mehr.**

Kein blinkender Cursor. Keine Festplatten-Aktivitäts-LED. Keine Textausgabe.

Eine Minute verging. Dann fünf. Nach fünfzehn Minuten wurde mir langsam warm. Nach **dreißig Minuten** absolutem Stillstand war klar: Das System hängt unwiderruflich fest. 

Jeder, der schon einmal ein BIOS geflasht hat, kennt dieses eisige Gefühl im Magen: *„Wenn ich die Kiste jetzt ausschalte, habe ich hier einen 15 Kilo schweren Briefbeschwerer stehen.“*

---

# Ursachenforschung: Warum das „Ja ist es“ eine Falle war

Bevor ich panisch den Netzstecker zog, ging es an die Analyse: Was genau war an dieser Stelle passiert?

### 1. Das Flash-Tool hatte noch gar nicht geschrieben
Ein Blick in den Code von AMI `AFUDOS` (dem eigentlichen Flashtool, das von MSIs EXE im Hintergrund aufgerufen wird) beruhigte die Nerven ungemein: AFUDOS löscht und beschreibt den Chip erst, nachdem es auf dem Bildschirm folgende Zeilen ausgibt:
```text
Reading flash .........
Erasing flash .........
Writing flash .........
```
Da der Bildschirm exakt bei `start to update new BIOS....` stehen geblieben war, war das Tool **vor** der ersten Schreiboperation eingefroren. Der bestehende BIOS-Baustein war noch völlig intakt!

### 2. Der Speicherkonflikt: `HIMEMX` vs. `AFUDOS`
Warum aber der Freeze?
FreeDOS lädt in seiner Standard-Konfiguration (`FDCONFIG.SYS`) den XMS-Speichermanager `HIMEMX.EXE` sowie in `FDAUTO.BAT` den Disk-Cache-Treiber `UHDD.SYS` und verschiebt DOS per `DOS=HIGH,UMB` in den oberen Speicherbereich.

AMI AFUDOS hingegen benötigt für den Flash-Vorgang direkten, ungestörten Hardware-Zugriff auf die CPU-Register und den System Management Mode (SMI). Sobald AFUDOS in Protected- bzw. Unreal-Mode umschalten wollte, kollidierte es mit dem A20-Gate-Handler von `HIMEMX`. Die Folge: Ein sofortiger, lautloser CPU-Deadlock.

Dazu kam, dass der MSI-Wrapper versuchte, über `system("cd XDXWRXGM")` in Sub-Shells Verzeichnisse zu wechseln – was in FreeDOS' Shell `FreeCOM` fehlschlug und die verwirrenden `CHDIR failed`-Fehler erzeugte.

---

# Die Lösung: Clean Real-Mode DOS

Nachdem der PC ausgeschaltet und mit dem alten BIOS 2.70 unversehrt wieder hochgefahren war, passte ich den USB-Stick für einen echten **Clean-Boot** an:

### 1. Radikales Abspecken von `FDCONFIG.SYS`
Alle Speichertreiber wurden restlos gestrichen. DOS läuft jetzt im unverfälschten Real-Mode unterhalb von 640 KB:
```ini
!COUNTRY=001,858:\FREEDOS\BIN\COUNTRY.SYS
!LASTDRIVE=Z
!BUFFERS=20
!FILES=40

DOS=LOW
SHELL=\FREEDOS\BIN\COMMAND.COM \FREEDOS\BIN /E:2048 /P=\FDAUTO.BAT
```

### 2. Bereinigen von `FDAUTO.BAT`
Kein `UHDD.SYS`, kein Caching, keine Hintergrunddienste – nur der Pfad und ein Willkommenshinweis:
```batch
@echo off
SET DOSDIR=\FREEDOS
SET PATH=%dosdir%\BIN;.
SET DIRCMD=/P /OGN /Y

echo.
echo ====================================================
echo  MSI MS-7673 BIOS-Update (Clean Real-Mode DOS)
echo.
echo  Befehl zum Starten des Updates:
echo      FLASH
echo ====================================================
echo.
```

### 3. Den Wrapper umgehen: Direktes Flashen
Anstatt mich auf die fehleranfälligen `cd`-Befehle der MSI-EXE zu verlassen, extrahierte ich die Kernbestandteile direkt aus dem Paket:
* **`AFUDOS.EXE`** (das AMI-Flashwerkzeug v2.38)
* **`E7673IMS.620`** (das vollständige 8-MB-BIOS-Image)

Beide Dateien landeten direkt im Hauptverzeichnis des Sticks. Dazu erstellte ich eine kleine `FLASH.BAT`, die AFUDOS mit den exakten MSI-Parametern füttert:
```batch
@echo off
echo Startet BIOS-Update fuer MSI MS-7673 (v6.20)...
echo.
AFUDOS.EXE E7673IMS.620 /p /b /n /k /x
```
*(Bedeutung der Parameter: `/p` = Program Main BIOS, `/b` = Boot Block, `/n` = NVRAM, `/k` = Non-Critical Blocks, `/x` = Check ROM ID übergehen).*

---

# Zweiter Versuch: Flash wie aus dem Bilderbuch

Stick wieder an den PC, gebootet – und die neue Begrüßung erschien sofort.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_CleanDOS_boot.jpg" alt="Clean FreeDOS Boot und Start des Flash-Vorgangs" width="1600" height="1200" >}}

Ein beherztes `FLASH` eingetippt, `Enter` gedrückt – und siehe da: Diesmal meldete sich das AMI-Tool sofort und legte ohne jede Verzögerung los!

```text
Reading file .......... done
FFS checksums ......... ok
Erasing flash ......... done
Writing flash ......... done
Verifying flash ....... done
Erasing NVRAM ......... done
Writing NVRAM ......... done
Verifying NVRAM ....... done
```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_AFUDOS_flashing.jpg" alt="AFUDOS APTIO flasht erfolgreich Erasing Writing Verifying" width="1600" height="1200" >}}

Nach rund 90 Sekunden war der erste Teil erledigt. Jetzt galt die eiserne Regel: **USB-Stick stecken lassen!**

Der PC startete neu. Auf dem Bildschirm erschien der markante rot-schwarze MSI-Screen:
```text
Updating BIOS ME 8.
Warning!! Please don't remove USB drive or shutdown system during BIOS update process.
Updating BIOS ME ........... 100%
```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_Intel_ME8_update.jpg" alt="MSI ME 8 Firmware Update Bildschirm auf 100%" width="1600" height="1200" >}}

Die Intel-ME-8-Firmware wurde direkt aus dem SPI-Baustein finalisiert. Nach einem erneuten automatischen Neustart ging es mit `Entf` ins UEFI-Setup:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_v620_after.jpg" alt="MSI Click BIOS nach dem Update auf Version 6.20" width="1600" height="1200" >}}

**BIOS Version: E7673IMS V6.2** – Ziel erreicht!

---

# Linux-Nachbereitung: Ein alter Workaround fliegt raus

Nach dem erfolgreichen Update stand noch die Rückkehr zu Linux an. Auf dem System gab es eine historische Altlast in `/etc/default/grub`:
```text
GRUB_CMDLINE_LINUX_DEFAULT="reboot=pci"
```
Unter den alten BIOS-Versionen (2.x) der Sandy-Bridge-Ära blieb der Rechner beim Herunterfahren oder Neustarten über ACPI oft hängen. Der Parameter `reboot=pci` erzwang damals den Hardware-Reset über den PCI-Bus.

Mit dem neuen BIOS 6.20 und aktivem UEFI-Boot ist dieser Workaround überflüssig geworden: Linux nutzt nun sauber die nativen EFI-Runtime-Services. Parameter aus der GRUB-Konfiguration entfernt, `sudo update-grub` ausgeführt – und MuttiLinux startet, rebootet und fährt herunter wie am ersten Tag.

---

# Fazit & Learnings für Nachahmer

1. **Glaube keinem unbegründeten „Ja ist es“:** FreeDOS ist großartig, aber hardwarenahe Flash-Tools aus der Ära 2011–2013 erwarten ein extrem primitives DOS-Umfeld.
2. **`HIMEMX` ist der Feind von AFUDOS:** Wenn ein DOS-BIOS-Update sofort einfriert, liegt es fast immer an aktiven XMS-/EMS-Treibern. Immer mit `DOS=LOW` und ohne Treiber booten.
3. **Niemals voreilig den Stecker ziehen:** Vor dem Ausschalten analysieren, ob überhaupt schon Schreibzugriffe stattgefunden haben.
4. **Stick nach dem Flash gesteckt lassen:** Der Wechsel von ME7 auf ME8 vollzieht sich in zwei Phasen. Wer den Stick nach dem ersten Reboot abzieht, riskiert eine unvollständige ME-Firmware.

Am Ende läuft MuttiLinux nun mit frischer Firmware, sauberem UEFI und ohne alte Kernel-Workarounds. Ein bisschen Nervenkitzel gehört beim BIOS-Flashen wohl einfach dazu.
