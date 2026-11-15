+++
title = 'Toyako: Between Volcanic Craters, Linux Terminals, and Free Wi-Fi'
date = 2025-12-21T16:15:00+09:00
draft = false
author = "Frank Tornack"
tags = [
    "Japan",
    "Linux",
    "Travel",
    "Hokkaido",
    "Tech",
    "Networking",
]
+++

Greetings from Hokkaido! I'm currently traveling around Japan with my Framework Laptop—more specifically at Lake Toya (Toyako). Japan is a tech-savvy country, yet as a Linux user (Arch with Cinnamon in my case), you frequently run into hurdles that iPhone or Android users never even notice.

One of the neatest features around here is OpenRoaming (along with its local partner network, cityroam). The promise is simple: configure it once, and automatically enjoy secure Wi-Fi at train stations, konbinis, and shopping malls everywhere.

The catch? There's no native Linux app. Providers want you to install a dedicated app or download a profile usually packaged exclusively for iOS (`.mobileconfig`) or Windows (`.exe`). Fortunately, I found a way to outsmart the system and extract the credentials straight into NetworkManager. Best of all: it's free.

Here's my field report and a quick guide so you can set it up yourself.

# Step 1: The Source
I found a site that generates free demo profiles for the Wireless Broadband Alliance (WBA): https://www.openroamingconnect.org/

Another source for OpenRoaming profile downloads is: https://nttbpor.air-compass.net/

# Step 2: Cracking the Black Box
So now I had this `.mobileconfig` file. Under the hood, that's basically just an XML file where Apple stores configuration profiles. Open it with `cat` or `vim`, though, and you'll mostly stare at binary gibberish—because it's usually digitally signed (`signed CMS/DER`).

Since we have proper tools on Linux, I stripped the signature with `openssl` to get at the readable XML inside:
```shell
openssl smime -inform DER -verify -in OpenRoaming.mobileconfig -noverify -out readable.xml
```

Suddenly, everything sat right there in plain text. And here came the plot twist: I initially expected to extract certificates (`EAP-TLS`), yet scanning the XML revealed a block for `EAP-TTLS` with `MSCHAPv2`.

The crucial lines looked like this (abbreviated):
```xml
<key>UserName</key>
<string>blablabla@idp.openroamingconnect.org</string>
<key>UserPassword</key>
<string>blablabla</string>
```
Bingo! Plain-text username and password, valid until 2027.

# Step 3: Feeding NetworkManager

With those credentials in hand, I could feed them directly into NetworkManager. Since I wasn't in the mood for a click-fest in the GUI—and wanted to be sure every EAP flag was spot-on—I did the whole thing straight from the terminal with `nmcli`. Because Japan often broadcasts `cityroam` (the local partner SSID) alongside `OpenRoaming`, I created profiles for the whole set right away.

Here is the command that worked immediately on my Framework (Qualcomm Wi-Fi 7 chipset):
```shell
# Profil für OpenRoaming
nmcli con add \
  type wifi \
  con-name "OpenRoaming" \
  ssid "OpenRoaming" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"

# Profilklon für cityroam (wichtig in Japan!)
nmcli con add \
  type wifi \
  con-name "cityroam" \
  ssid "cityroam" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"
nmcli con add \
  type wifi \
  con-name "Wi2eap" \
  ssid "Wi2eap" \
  wifi-sec.key-mgmt wpa-eap \
  802-1x.eap ttls \
  802-1x.phase2-auth mschapv2 \
  802-1x.identity "blabla@idp.openroamingconnect.org" \
  802-1x.anonymous-identity "anonymous@idp.openroamingconnect.org" \
  802-1x.password "blabla" \
  802-1x.domain-suffix-match "idp.openroamingconnect.org"
```

Note: On your first connection, NetworkManager might ask for a CA certificate. Since we didn't extract the root cert, you can safely skip that for vacation purposes (check "No CA certificate is required" in the GUI).

# Step 4: Status Quo – QRV in the Hotel

Right now I'm still sitting in my hotel room. A quick scan with `sudo iw dev wlp170s0 scan` unfortunately only turns up the hotel's own networks ("Noguchi"), locked down the old-fashioned way behind a standard WPA2 passphrase. Zero sign of the "Interworking" flag or Roaming Consortium codes advertising OpenRoaming anywhere on the spectrum in this building.

Still, the profiles are saved and prioritized in NetworkManager. My laptop is essentially "armed and ready."
# Outlook: The Planned Field Test

The plan for later is simple: step outside the hotel and take a stroll toward Toyako Onsen Bus Terminal or the nearest Seicomart—classic Japanese hotspots for `cityroam` and `Wi2`. The theory is solid: as soon as my Framework picks up a beacon carrying the right identifier, it should roam in automatically over an encrypted link without me lifting a finger.

Will my "XML hack" actually survive contact with the wild and send its first packet over OpenRoaming? I'll find out on my lakeside walk in just a moment.

# Verdict
The on-site scan confirmed it: the coverage maps weren't lying. Outside major hubs like Sapporo, OpenRoaming hasn't arrived yet. Instead of seamless, encrypted certificate/EAP roaming, I had to fall back on good old `laketoya_free_wifi`—unencrypted and complete with an annoying captive portal. Long live the VPN!
