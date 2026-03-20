+++
title = '🧩 OpenHAMClock AddOns: More Than Just a Clock'
date = 2026-03-20T22:50:00+01:00
draft = false
author = "Frank Tornack"
tags = [
    "Funk",
    "Hobby",
    "Software",
    "Open Source",
]
+++

In the world of amateur radio, information is everything. Users of **OpenHAMClock** already appreciate its clean display of time, weather, and propagation conditions. But as an IT professional, I couldn't help myself: I wanted more interactivity and automation.

Over the past few weeks, I’ve been working intensively on a series of **AddOns** and documentation to transform OpenHAMClock into a true command center for the ham shack.

<!--more-->

## My Contributions at a Glance

All my contributions are based on the concept of **Userscripts** (e.g., for Tampermonkey). This allows for integrating features directly into the web interface without having to modify the clock's core code.

### 1. APRS Auto-Position
For portable operators (SOTA/POTA) or mobile stations, this AddOn is a game-changer. It tracks a specific SSID via the `aprs.fi` API and automatically updates the clock’s position.
- **Smart Updates:** The position only refreshes if you’ve moved more than 50 meters.
- **Seamless Integration:** As soon as the location changes, the clock recalculates all paths and map views instantly.

### 2. APRS Newsfeed (Inbox)
Who wouldn't want to be notified about new APRS messages without constantly checking their handheld radio?
- Displays the 10 most recent messages directly in the UI.
- A subtle red badge signals new incoming messages.
- Supports English, German, and Japanese.

### 3. HFJ-350M Antenna Calculator: From Terminal to Web
The **Comet HFJ-350M** is a fantastic multi-band portable antenna, but matching the telescopic length using manual charts can be tedious in the field.

The inspiration for this AddOn came from my standalone Python tool [Comet-HFJ-350M-Toy-Box](https://github.com/frankenstein91/Comet-HFJ-350M-Toy-Box). Originally conceived as a CLI (Command Line Interface) utility, it already allowed me to quickly calculate the correct settings for any frequency right from the terminal. Since I use OpenHAMClock as my primary shack display, the next logical step was porting this logic into a graphical AddOn.

My web-based calculator now handles the heavy lifting:
- **Precision:** Calculates the exact length in millimeters for any frequency from 160m to 6m.
- **Visualization:** Displays the required coil combinations and jumper settings directly on the dashboard.
- **Fine-tuning:** Includes sensitivity data (kHz/cm) to help you hit the perfect SWR with minimal effort.

## Infrastructure for the Community
Beyond functional tools, it was important to me that other developers could easily implement their own ideas. That's why I authored two foundational guides:

- **AddOn Development Guide:** A standard for integrating community tools. I implemented an "AddOn Drawer" logic (🧩 icon) so that multiple AddOns can coexist cleanly without cluttering the native design.
- **Self-Hosting Guide:** A guide for those running OpenHAMClock (and the AddOns) on private hardware like a Raspberry Pi or in Docker. I place special emphasis on security best practices for handling API keys.

## Conclusion
Open Source thrives on participation. What started as a small Python experiment for the terminal has now become a permanent part of my shack dashboard. Through the AddOn interface, OpenHAMClock has become significantly more flexible. I’m excited to see what ideas the community implements next!

Feel free to check out the code on GitHub: [frankenstein91/openhamclock](https://github.com/frankenstein91/openhamclock/tree/main/AddOns)

73 de DO3EET
