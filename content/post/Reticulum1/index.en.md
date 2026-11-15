+++
title = 'NomadNet, LXMF, and Reticulum'
date = 2024-06-10T09:40:00+02:00
draft = false
author = "Frank Tornack"
tags = [
    "Privacy",
    "Chat",
    "Encryption",
]
+++

Right off the bat, I have to point out that this type of communication is **not permitted** on German amateur radio bands. That said, it's an encrypted way to exchange messages that I'm going to introduce anyway, given the current situation in Germany (the weather) and Europe (politics). Even without ham bands, the protocol can still be used over Wi-Fi, Bluetooth, Ethernet, and LoRa at reduced power levels. At its core, it's a low-bandwidth peer-to-peer communication tool.

# Stack Overview
```goat
+----------+                              
| NomadNet +---------+                   
+----------+         |                   
                     v                   
                 +------+   +-----------+
                 | LXMF +-->| Reticulum |
                 +------+   +-----------+
                     ^                   
+----------+         |                   
| Sideband +---------+                   
+----------+                              
```

## What is Reticulum?
Reticulum is a networking stack built for local and wide-area networks using readily available hardware. It works reliably even under very high latency and extremely low bandwidth. The stack lets you build wide-area networks with off-the-shelf tools while providing end-to-end encryption, initiator anonymity, self-configuring multi-hop transport, efficient addressing, unforgeable delivery confirmations, and more.

## What is LXMF?
The Lightweight Extensible Message Format is a simple, flexible message format and delivery protocol that supports a wide range of implementations while consuming as little bandwidth as possible. Built on top of Reticulum, it offers zero-conf message routing, E2E encryption with forward secrecy, and can ride over any medium supported by Reticulum.

## What is NomadNet?
Nomad Network lets you build private, resilient communication that remains completely under the control and ownership of its participants. No sign-ups, no terms of service, no handing over data, no permissions, and no gatekeepers. Everything runs on LXMF and Reticulum, which together handle mesh networking and peer-to-peer message routing. This foundation also makes it possible to use the software across all sorts of communication media—from paper all the way up to fiber optics.

## What is Sideband?
Sideband is a GUI[^1] application offering the same features as NomadNet. It runs on Android, Linux, macOS, and Windows.

# Use Case
Recent heavy rainfall and flooding have once again highlighted how important infrastructure-independent communication is. For hardware and software to actually be useful in a disaster or civil emergency[^2], it needs to be easy to obtain, vendor-independent, cross-platform, simple to operate, low on requirements, and flexible. LoRa can bridge long distances, and meshing amplifies that advantage even further.

# Usage
## Installation
Starting from a fresh Arch Linux installation with `pikaur` installed, all you need is:
```bash
pikaur -S nomadnet
```
This installs the tool along with all required dependencies on your system.

## LoRa Hardware
The tools needed to flash the firmware onto your LoRa hardware are already included:
```bash
rnodeconf /dev/ttyACM0 --autoinstall
```
You just have to answer a few prompts and the rest runs automatically.

## LoRa Config
To get a solid starting configuration, run `rnstatus` once to generate the config file at `~/.reticulum/config`. With this default setup, it already works over local networks—meaning within your local subnet.

For Germany, append the following lines to the end of the config to operate over the LoRa mesh:
```ini
[[RNode LoRa Interface]]
  type = RNodeInterface
  # Enable interface if you want use it!
  interface_enabled = True
  # Serial port for the device
  port = /dev/ttyACM0
  frequency = 867200000
  bandwidth = 125000
  spreadingfactor = 9
  codingrate = 7
  txpower = 7
  mode=roaming
```
If you want to share a single LoRa antenna across multiple computers, you can set `enable_transport = Yes` at the top of the config and skip this interface block on the other machines. Messages will automatically bridge across the mesh from LAN to LoRa.
Once that's done, the software works over both the local network and LoRa. Launch it from the CLI with `nomadnet`.

## Using It
You can navigate the software with your keyboard, though mouse support is built in too. There's also a built-in help file right inside the tool, which I find super handy. Since it's a straightforward chat app, you should be able to figure it out without much hand-holding... though if questions come up, a follow-up post isn't out of the question.

[Development chat](https://matrix.to/#/#reticulum:matrix.org)

[^1]: Graphical User Interface
[^2]: Civil emergency / disaster situation (German: *Katastrophenfall*)
