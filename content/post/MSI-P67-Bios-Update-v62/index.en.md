+++
title = 'MSI MS-7673 BIOS Update to v6.20 with FreeDOS: Pitfalls and Solutions'
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

Sometimes computer archaeology catches up with you faster than you'd like. In my case, it was my mother's computer ("MuttiLinux")—a rock-solid machine powered by an **MSI PH67A-C43 (B3)** motherboard (internal model MS-7673) and an Intel Core i5-2500K ("Sandy Bridge"). The system had been running Linux smoothly for years, but on the firmware side, it was effectively frozen in time: BIOS version **2.70** from 2012.

Because newer Linux kernels and modern graphics cards run significantly better with proper UEFI support and up-to-date firmware, the decision was made: the final BIOS update to version **6.20** had to be installed. However, this version leap is anything but a routine update—and getting there gave me a genuine 30-minute heart-stopping moment.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_v270_before.jpg" alt="MSI BIOS prior to update running version 2.7" width="1600" height="1200" >}}

---

# MSI Support and the Fateful Question

When looking up BIOS updates for MSI's 6-series boards (P67/H67/Z68), jumping from version 2.x to 6.x doesn't offer a standard `.rom` or `.bin` file for the built-in M-Flash utility. Instead, MSI only provides a Windows executable: `E7673v62.exe`. The technical reason behind this: starting with version 6.x, MSI upgraded from Intel Management Engine 7 (ME7, 1.5/5 MB) to Intel Management Engine 8 (ME8, 8 MB) to support 22nm Ivy Bridge processors. This transition requires repartitioning the SPI flash chip in two separate stages.

As a Linux user, I prefer not having to install Windows just to flash a motherboard BIOS. So, I contacted MSI Tech Support beforehand asking for a raw image file:

> **MSI Tech Support:**  
> *"Unfortunately, we cannot provide a pure bin file, because we cannot ensure that the ME version will be updated properly. You can create a DOS-bootable USB drive and run the EXE file from there."*

Fair enough—that sounded completely reasonable. Since an MS-DOS license isn't something most people have lying around in 2026, I followed up with the crucial question:

> **My question to support:**  
> *"Good evening, is this tool FreeDOS compatible? Thank you for your feedback."*

The reply arrived promptly—short, dry, and oozing confidence:

> **MSI Tech Support:**  
> *"Yes, it is."*

Armed with this apparent green light, I got to work.

---

# Preparing the USB Drive

I grabbed a trusty old USB stick (128 MB is more than enough for DOS) and downloaded the official **FreeDOS 1.4 Lite USB image** (`FD14LITE.img`). The image was written to the drive using `dd`.

Because MSI's flasher needs to unpack temporary files during execution, I did some quick spring cleaning on the 32 MB FAT partition:
* Removed the `PACKAGES/` folder (FreeDOS package repository) and `SETUP.BAT` to free up over 20 MB of disk space.
* Copied `E7673v62.exe` directly into the root directory.
* Commented out the CD-ROM driver search in `FDAUTO.BAT` so the stick boots directly into the `C:\>` DOS prompt without delay.

---

# The First Attempt & The 30-Minute Panic

I plugged the stick into a rear USB 2.0 port on the MSI motherboard, pressed `F11` at boot, and FreeDOS appeared on screen in a fraction of a second at `C:\>`.

Confidently, I launched the update utility:
```text
C:\>E7673V62
```

Right away, the wrapper started throwing unexpected output:
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

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_FreeDOS_freeze.jpg" alt="FreeDOS error CHDIR failed and freeze at start to update new BIOS" width="1600" height="1200" >}}

A few unsightly `CHDIR failed` lines appeared, but the tool reported `ok` on everything else, correctly identified the motherboard model and current firmware, and asked for confirmation.

I pressed **`Y`**. The screen acknowledged:

```text
Please don't remove USB drive or shutdown system during BIOS update process
start to update new BIOS....
```

And then: **absolute silence.**

No blinking cursor. No hard drive activity LED. No further console output.

One minute passed. Then five. At fifteen minutes, a bead of cold sweat started forming. After **thirty minutes** of dead silence, it was unmistakable: the system was completely frozen.

Anyone who has ever flashed a BIOS knows that sinking feeling in the pit of your stomach: *"If I turn this machine off right now, I might be left with a 15 kg paperweight."*

---

# Root Cause Analysis: Why "Yes, it is" Was a Trap

Before frantically pulling the power cord, it was time to analyze what had actually happened.

### 1. The Flash Tool Hadn't Even Started Writing
Looking into how AMI `AFUDOS` (the actual flashing tool executed in the background by MSI's EXE) operates brought immediate relief: AFUDOS only begins erasing and programming the chip after displaying the following lines on screen:
```text
Reading flash .........
Erasing flash .........
Writing flash .........
```
Because the display had frozen right at `start to update new BIOS....`, the utility had crashed **before** initiating any write operations. The existing BIOS chip was completely untouched!

### 2. The Memory Conflict: `HIMEMX` vs. `AFUDOS`
So why did it freeze?
In its default configuration (`FDCONFIG.SYS`), FreeDOS loads the XMS memory manager `HIMEMX.EXE`, while `FDAUTO.BAT` loads the `UHDD.SYS` disk caching driver and moves DOS into high memory using `DOS=HIGH,UMB`.

AMI AFUDOS, however, requires direct, unfiltered hardware access to CPU registers and System Management Mode (SMI). As soon as AFUDOS attempted to switch into protected or unreal mode, it collided with HIMEMX's A20 gate handler. The result: an instant, silent CPU deadlock.

On top of that, MSI's wrapper was attempting to change directories via `system("cd XDXWRXGM")` inside child shells—which fails under FreeDOS's `FreeCOM` shell and produced the confusing `CHDIR failed` messages.

---

# The Solution: Clean Real-Mode DOS

After powering the PC off and confirming that it rebooted unharmed into BIOS 2.70, I reconfigured the USB drive for a true **clean boot**:

### 1. Stripping Down `FDCONFIG.SYS`
Every single memory driver was eliminated. DOS now runs strictly in unadulterated Real Mode below 640 KB:
```ini
!COUNTRY=001,858:\FREEDOS\BIN\COUNTRY.SYS
!LASTDRIVE=Z
!BUFFERS=20
!FILES=40

DOS=LOW
SHELL=\FREEDOS\BIN\COMMAND.COM \FREEDOS\BIN /E:2048 /P=\FDAUTO.BAT
```

### 2. Cleaning Up `FDAUTO.BAT`
No `UHDD.SYS`, no disk caching, no resident services—just the search path and a welcoming banner:
```batch
@echo off
SET DOSDIR=\FREEDOS
SET PATH=%dosdir%\BIN;.
SET DIRCMD=/P /OGN /Y

echo.
echo ====================================================
echo  MSI MS-7673 BIOS Update (Clean Real-Mode DOS)
echo.
echo  Command to start the update:
echo      FLASH
echo ====================================================
echo.
```

### 3. Bypassing the Wrapper: Direct Flashing
Instead of relying on the fragile `cd` routines of MSI's wrapper EXE, I extracted the core components directly from the package:
* **`AFUDOS.EXE`** (AMI Flash Utility v2.38)
* **`E7673IMS.620`** (the complete 8 MB BIOS image)

Both files were placed directly in the root directory of the USB drive. I then created a small `FLASH.BAT` script that invokes AFUDOS with MSI's exact parameters:
```batch
@echo off
echo Starting BIOS update for MSI MS-7673 (v6.20)...
echo.
AFUDOS.EXE E7673IMS.620 /p /b /n /k /x
```
*(Parameter breakdown: `/p` = Program Main BIOS, `/b` = Program Boot Block, `/n` = Program NVRAM, `/k` = Program Non-Critical Blocks, `/x` = Bypass ROM ID check).*

---

# Second Attempt: A Textbook Flash

USB drive plugged back in, machine booted—and the new clean prompt greeted me immediately.

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_CleanDOS_boot.jpg" alt="Clean FreeDOS boot and starting the BIOS flash process" width="1600" height="1200" >}}

I typed `FLASH` and pressed `Enter`. Sure enough, this time the AMI utility initialized instantly and began working without any hesitation!

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

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_AFUDOS_flashing.jpg" alt="AFUDOS APTIO successfully erasing writing and verifying flash" width="1600" height="1200" >}}

After about 90 seconds, the first stage was complete. Now came the golden rule: **Leave the USB stick plugged in!**

The system rebooted automatically, greeted by MSI's distinctive red-and-black screen:
```text
Updating BIOS ME 8.
Warning!! Please don't remove USB drive or shutdown system during BIOS update process.
Updating BIOS ME ........... 100%
```

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_Intel_ME8_update.jpg" alt="MSI ME 8 firmware update screen reaching 100 percent" width="1600" height="1200" >}}

The Intel ME 8 firmware was finalized directly from the SPI chip. Following another automatic restart, pressing `Del` brought up the UEFI setup:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/MSI-P67-Bios-Update-v62/MSI_BIOS_v620_after.jpg" alt="MSI Click BIOS after successful update to version 6.20" width="1600" height="1200" >}}

**BIOS Version: E7673IMS V6.2**—mission accomplished!

---

# Linux Post-Mortem: Retiring an Old Workaround

With the firmware update out of the way, it was time to boot back into Linux. There was an old relic lingering in `/etc/default/grub`:
```text
GRUB_CMDLINE_LINUX_DEFAULT="reboot=pci"
```
Under the legacy 2.x BIOS versions of the Sandy Bridge era, the machine frequently hung during shutdown or ACPI resets. The `reboot=pci` parameter had been used to force a hardware reboot via the PCI bus.

With BIOS 6.20 and native UEFI boot enabled, this workaround has become obsolete: Linux now talks cleanly to the native EFI runtime services. I removed the parameter from the GRUB configuration, ran `sudo update-grub`, and MuttiLinux now boots, reboots, and powers off smoothly like a brand-new machine.

---

# Key Takeaways & Lessons Learned

1. **Don't blindly trust a casual "Yes, it is":** FreeDOS is fantastic, but low-level flashing tools from the 2011–2013 era expect an extremely primitive DOS environment.
2. **`HIMEMX` is AFUDOS's arch-nemesis:** When a DOS BIOS update freezes instantly upon execution, active XMS/EMS memory managers are almost always to blame. Always boot with `DOS=LOW` and no memory drivers.
3. **Never pull the plug in a panic:** Take a moment to analyze whether any write operations have actually occurred before reaching for the power switch.
4. **Keep the USB drive inserted:** The ME7 to ME8 upgrade is a two-phase process. Removing the drive after the first reboot risks corrupting the Intel ME firmware.

In the end, MuttiLinux is now enjoying fresh firmware, clean UEFI support, and no more dated kernel workarounds. A little adrenaline just comes with the territory when flashing a BIOS!
