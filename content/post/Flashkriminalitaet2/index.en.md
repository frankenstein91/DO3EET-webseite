+++
title = 'Flash Fraud – The Saga Continues...'
date = 2024-05-04T22:00:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Linux",
    "Security",
    "Fraud",
    "Shopping",
]
+++

Even though I'm not active on [Mastodon](https://joinmastodon.org/) myself, [resident explainer Marcel Waldvogel](https://dnip.ch/) shared a link to my post [Flash Fraud]({{< ref "/post/Flashkriminalitaet1" >}}), so I'm jumping in here to address some of the questions raised under his thread.

<!--more-->
{{< loadtoot instance="waldvogel.family" id="112262847793273940" >}}

## USB 3 Pins
Remember that photo of the blue USB 2 plug? No? Okay, here it is one more time:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/Flashkriminalitaet2/PXL_20240411_055122297~3.jpg" alt="Blue USB connector" width="800" height="600" >}}

And here's a shot of a proper USB 3-to-USB-C cable from my collection showing what it's *supposed* to look like:

{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/Flashkriminalitaet2/USB3.jpg" alt="USB 3 connector" width="800" height="600" >}}

Deftly tucked deeper inside the connector (?), you can clearly see the five extra contacts. The USB 3.0 spec adds additional pins compared to USB 2.0 to boost performance and enable new features: an extra ground pin, a pair for power, and pairs for the SuperSpeed data lines. Since the original USB 2.0 pins remain part of the spec for backward compatibility, USB 3 ends up with those extra contacts.

## Fear of Malware
I prefer to call it healthy respect for malware. I formatted the USB drive with automount disabled, just like I do with every brand-new stick. For used drives coming from someone else when exchanging files, I use my old Raspberry Pi to inspect them first—or straight up as a proxy. Aside from the proxy approach, that admittedly won't protect me from firmware-level malware, though I'm hoping that's still pretty rare in the wild.
### What Is Malware?
Malware is an umbrella term for malicious software designed to infect computers or other devices. Its goal is to cause damage, steal data, or otherwise disrupt or hijack a system.

## Was I Still Reckless?
Yes, I was. I didn't format the stick on disposable hardware. Someone could have hit me with a fast BadUSB script—or a USB Killer.
### What Is BadUSB?
{{< imgwebp src="https://do3eet-media.dreamofjapan.de/posts/Flashkriminalitaet2/BadUSB-Stick.jpg" alt="BadUSB stick" width="800" height="600" >}}
In a BadUSB attack, the firmware of a flash drive, external hard drive, or other USB device is reprogrammed. The device typically masquerades as an HID device—such as a keyboard. That "keyboard" then rapidly fires up PowerShell and throws the doors wide open for an attacker.
### What Is a USB Killer?
While I do own a BadUSB stick, I don't have hardware like a USB Killer. These devices are built to permanently damage or fry a USB port—or even the entire host machine. Most of them work on a simple principle:
1. Capacitors charge up from the 5V USB power rail
2. Wait until enough energy is stored
3. A voltage converter kicks in, stepping the voltage up to 200V or higher
4. That high-voltage surge is dumped back into the USB host—down the data lines or the 5V rail

If the computer lacks proper surge protection, the system suffers an overvoltage failure.

## The Windows Problem
Every Windows user knows it, ReactOS users copy it, and Linux users laugh at it... the Blue Screen of Death. On its own, a BSOD usually causes nothing worse than a crash—though in a corporate environment, downtime can get expensive fast.

A few years ago, [Marius Tivadar](https://github.com/mtivadar) found a neat way to trigger a BSOD on Windows systems. The attack modifies the name of the root directory and its `INDEX_ALLOCATION` in three places.
Because AutoPlay is enabled by default, simply plugging in the USB stick crashes the machine. Even with AutoPlay turned off, accessing any file on the drive still triggers the crash—at which point the antivirus scanner happily lends a helping hand in taking the system down.
The PoC and a detailed write-up are available on GitHub at [windows10_ntfs_crash_dos](https://github.com/mtivadar/windows10_ntfs_crash_dos/tree/master).

## Amazon's Response
My review of the USB stick was rejected twice, citing an unspecified policy violation. We reported the product, and as of right now it's still on sale under the exact same link.
