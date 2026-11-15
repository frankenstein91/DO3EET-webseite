+++
title = 'One RAM Stick Too Many: Weekends, IPMI, and 24 DIMM Slots'
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

There are weekends where you just want to kick back at your desk and tinker peacefully with your homelab. And then there are weekends where your own hardware subtly reminds you who's actually calling the shots around here.

In my case, the culprit was my trusty main workstation ("MasterSystem")—an aging but rock-solid dual-socket battleship built around a **Supermicro X9DRi-LN4+** with a pair of Intel Xeon E5-2640 CPUs. The blessing (and curse) of enterprise boards like this: it packs a whopping **24 DIMM slots**, completely populated with 16 GB Hynix sticks. That's 384 GiB of DDR3 Registered ECC RAM in total. Pure bliss for virtualization, local builds, and memory-hungry services—right up until one of those 24 sticks decides to call it quits.

A few weeks back, the machine suffered an abrupt crash in the middle of the night. Since I'd already shuffled the sticks across banks during earlier testing, I was staring down the classic sysadmin riddle: **Which of the 24 sticks is the troublemaker, where on earth is it sitting on the motherboard, and how do I yank the right one on the first try?**

---

### Detective Work in IPMI: Finding a Needle in a Fan-Spam Haystack

Thankfully, server boards come with a BMC and IPMI (Intelligent Platform Management Interface). Even when the OS faceplants hard, the Baseboard Management Controller keeps logging low-level hardware events independently into the **System Event Log (SEL)**.

So I SSH'd in and pulled up the event log:

```bash
sudo ipmitool sel elist
```

Reality hit fast: the log buffer was **100% full** (512 entries) and screaming overflow. The last few dozen pages were nothing but an endless wall of fan spam:

```text
 c37 | 08/31/26 | 09:35:10 CEST | Fan FAN1 | Lower Non-recoverable going low  | Asserted | Reading 0 < Threshold 0 RPM
 e37 | 10/31/26 | 20:48:23 CET  | Fan FAN1 | Lower Critical going low         | Asserted | Reading 0 < Threshold 0 RPM
 e38 | 10/31/26 | 20:48:23 CET  | Fan FAN1 | Lower Non-recoverable going low  | Asserted | Reading 0 < Threshold 0 RPM
 e39 | 10/31/26 | 20:48:23 CET  | Fan FAN5 | Lower Critical going low         | Asserted | Reading 0 < Threshold 0 RPM
```

The mystery behind the spam: when the PWM fans (`FAN1` and `FAN5`) spin way down at idle, they briefly dip below the BMC's hardcoded 0 RPM threshold. The BMC promptly panics ("Fan dead!!"), fires off an alert, and clears it a split second later once RPMs bounce back. With only 512 slots in the ring buffer, that nonsense wipes out every meaningful historical event in a matter of weeks.

Fortunately, one decisive filter for everything that isn't a fan:

```bash
sudo ipmitool sel elist | grep -iv fan
```

...and there it was, pure gold:

```text
 de9 | 09/28/26 | 04:20:18 CEST | Memory | Correctable ECC (@DIMMD3(CPU1)) | Asserted
```

Checking the systemd journal from the previous boot (`journalctl -b -1`) nailed the match: the machine had faceplanted without warning on September 28 at **04:19:41 CEST** mid-scan with ClamAV and Syncthing—right down to the exact moment the BMC logged the ECC error on **`DIMMD3` on `CPU 1`**.

---

### The Topology: Where the Heck Is `DIMMD3`?

Having a slot name in a log is only half the battle. Physically locating it inside a case crammed with cable harnesses, two chunky CPU coolers, and 24 tightly packed RAM sticks is the other half.

On the Supermicro X9DRi-LN4+, the memory subsystem is laid out like this:
* **CPU 1** (the socket closer to the front/center of the case) manages 12 slots across 4 channels (A, B, C, D).
* **CPU 2** manages the remaining 12 slots (channels E, F, G, H).

Right next to CPU 1 sit two separate 6-slot banks:
1. **Bank A/B** (top / toward the middle of the board): `P1-DIMMA1..A3` and `P1-DIMMB1..B3`
2. **Bank C/D** (bottom / toward the SATA ports): `P1-DIMMC1..C3` and `P1-DIMMD1..D3`

Inside CPU 1's C/D 6-slot bank, the physical layout moving outward away from the CPU is ordered as follows:

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

Classic homelab trap: intuitively you'd expect Channel C to sit closer to the CPU and Slot 1 to start on the inside. On this board, however, **`P1-DIMMD3` sits right up against the CPU socket**! Thankfully, the white silkscreen labeling on the motherboard leaves no room for guesswork.

Just to be doubly sure before pulling anything, I queried the stick's details via `dmidecode`:

```bash
sudo dmidecode -t 17 | grep -B 2 -A 12 "Locator: P1-DIMMD3"
```

Result:
* **Manufacturer:** Hynix Semiconductor
* **Part Number:** `HMT42GR7MFR4A-H9` (16 GiB DDR3 Registered ECC)
* **Serial Number:** `2FCE471A`

---

### The Cheat-Sheet Trick

Because balancing an open laptop on top of an open full-tower chassis is awkward at best, I whipped up a one-page A4 sheet in Typst with the slot map, labels, checklist, and serial number, and fired it straight over CUPS to my HP network printer.

Printed sheet in one hand, flashlight in the other—time to dive into the case.

---

### Moment of Panic: The Wrong Serial Number?!

PC cleanly shut down, power cord yanked, grounded myself, side panel off.

Thanks to the crisp white PCB silkscreen, finding the stick right beside CPU 1's socket took seconds: `P1-DIMMD3` was printed right there in plain sight. Popped open the retention clips, gently eased the module out—and glanced at the white Hynix sticker:

> *"Hold on... `HMT42GR7MFR4A-H9` matches, so why does the printed serial number end in `3LH4` instead of `2FCE471A`?! Did I just pull the wrong stick?!"*

Brief moment of confusion in the workshop. Turns out there's a neat technical reason for this that rarely crosses your mind day to day:

Every RAM module carries a tiny I²C chip called the **SPD EEPROM (Serial Presence Detect)**. Inside that chip, following the JEDEC standard (bytes 122–125), the manufacturer stores a 32-bit binary number as the module's unique serial ID. Those exact 4 bytes are what the BIOS and `dmidecode` read out in hex: `0x2FCE471A`.

On the paper sticker, however, manufacturers like SK Hynix often don't print that raw hex value at all—instead they print **proprietary factory tracking, lot, or batch codes** from the production line (ending in `3LH4` in my case). The printed label and the SPD hex ID almost never match character-for-character!

---

### The Moment of Truth: Verification Boot

Side panel back on, PSU flipped on, power button pressed.

After rebooting, the box grabbed a fresh DHCP lease (`10.2.111.116`). SSH'd back in, ran `dmidecode`—and sure enough:

```text
Handle 0x0045, DMI type 17, 34 bytes
Memory Device
	Array Handle: 0x002F
	Size: No Module Installed
	Locator: P1-DIMMD3
	Bank Locator: P0_Node0_Channel3_Dimm2
```

Cross-checked every remaining module: serial number `2FCE471A` was completely gone from the system. Usable memory dropped cleanly from 377 GiB to 362 GiB. Bullseye—right down to the exact millimeter!

---

### Takeaways & Homelab Lessons

1. **ECC RAM is worth its weight in gold:** On a consumer rig without error correction, bad memory cells would likely have caused silent bit flips, corrupted databases, or mangled filesystems over time. Thanks to ECC, the BMC handed me a crystal-clear alert pointing straight to the exact slot.
2. **Keep an eye on IPMI fan thresholds:** When fans spin below the BMC floor at idle, your SEL fills up in weeks. Tweaking the thresholds with `ipmitool sensor thresh "FAN1" lower 150 225 300` keeps real hardware faults from drowning in fan noise.
3. **Stickers vs. SPD IDs:** Don't panic if the hexadecimal serial reported by your OS doesn't match the paper sticker on the DIMM letter-for-letter.
4. **23 sticks are plenty:** Whether it's 384 GiB or 368 GiB, you don't notice the missing 16 GB in daily use one bit. More importantly, the machine is back to being rock-solid stable.
