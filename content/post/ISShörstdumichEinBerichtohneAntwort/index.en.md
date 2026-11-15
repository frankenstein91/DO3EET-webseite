+++
title = 'ISS, Do You Copy? A Report Without a Reply'
date = 2025-08-18T18:13:30+02:00
author = "Frank Tornack"
tags = [
    "ISS",
    "Space",
    "Ham Radio",
    "Linux",
    "Hobby",
]
+++

Some projects start with a simple idea and snowball into a fascinating technical journey. My attempt to make ham radio contact with a Japanese astronaut aboard the International Space Station (ISS) right before leaving for my vacation in Japan was one of those projects—complete with highs, lows, a steep learning curve, and an ending I didn't quite see coming.

## The Mission: A Shout-Out to Orbit

It all started with a plan to send a ham radio greeting to JAXA astronaut Takuya Onishi (KF5LKS) up on the ISS. When I found out his tour of duty was wrapping up and Kimiya Yui (KG5BPH) would be taking over, I adjusted my target. The mission stayed the same: a digital handshake across 400 km of space, transmitted straight from Grimma.

My rig for the job: my trusty Kenwood TH-D75E handheld transceiver and my Framework Laptop running Arch Linux. A combo that promises plenty of flexibility and punch.

## First Hurdles: When the Software Refuses to Cooperate

Prep started on the laptop. Installing the necessary software (`ax25-tools`) via `pikaur` went smoothly. But the very first dry run served up a classic Linux curveball: the command to initiate a connection that I knew from online guides simply didn't exist on my system. Neither `axcall` nor `ax25_call` could be found. After some digging, I tracked down the actual command: `call`. A tiny detail, yet absolutely crucial.

My first live attempts during gorgeous passes above 80 degrees max elevation were equal parts thrilling and humbling. Using `listen`, I could watch 145.825 MHz live. What I saw was a digital free-for-all—a classic "pile-up." Stations all across Europe were shooting their shot at the exact same time. Seeing my own transmit frames show up in the log (`fm DO3EET-9 to RS0ISS-11 ctl SABM+`) was already a huge win—it proved my entire TX/RX chain was working! Still, no reply came back from the ISS. I just couldn't cut through the digital crowd.

## Automation: A Script for the Bismarck Tower

One of my favorite spots for portable ops like this is the Bismarck Tower. Great view, unobstructed line of sight to the sky—and next to zero shade. Trying to type multiple commands across several terminal windows on a laptop screen under blazing sunlight is practically impossible. The fix: automation!

What began as a simple thought turned into a mini-odyssey of shell scripting:

1. **The Basic Version:** A simple script running the commands for me. Catch: I had to type my `sudo` password multiple times. Completely useless for fast field ops.
2. **The `screen` Solution:** For a better overview, I rewrote the script to launch `screen` with two windows: one for listening (`listen`) and one for transmitting (`call`). Much better, though copy-pasting the long message still felt clunky outdoors.
3. **The Deluxe Version:** Next up was a vertical split in `screen`. Now I could watch the live packet traffic and my input prompt **at the exact same time**.
4. **Full Auto with `expect`:** The final annoyance—manually pasting the message—got solved with `expect`, a tool for automating interactive prompts. The end result was a fully automated "dashboard" script. All I had to do was launch it with `sudo`, and it handled the rest on its own.

```python
#!/binbin/bash

# ===================================================================
#      ISS PACKET RADIO DASHBOARD
# ===================================================================
# Dieses Skript baut eine geteilte screen-Ansicht auf:
# - Links: Live-Funkverkehr (listen)
# - Rechts: Vollautomatischer Sendeversuch (expect)
# ===================================================================

# --- Konfiguration ---
PORT="1"
TTY_DEVICE="/dev/ttyACM0"
TARGET_CALL="RS0ISS-11"
RECIPIENT_CALL="KG5BPH"
DEIN_CALL="DO3EET"
AUTO_SENDER_SCRIPT="iss_auto_sender.exp"
SCREEN_CONFIG="iss.screenrc"

# --- Skript-Vorbereitung ---
clear
echo "======================================================"
echo "              ISS Packet Radio Dashboard              "
echo "======================================================"
echo

# 1. Sudo-Check
if [ "$EUID" -ne 0 ]; then
  echo "FEHLER: Bitte starte dieses Skript mit 'sudo'."
  exit 1
fi

# 2. Schnittstelle aktivieren
echo ">>> Aktiviere AX.25-Schnittstelle..."
kissattach "$TTY_DEVICE" "$PORT"
sleep 1
# KORREKTUR: 'ifconfig' durch 'ip link show' ersetzt
if ! ip link show "ax$PORT" | grep -q "<UP"; then
    echo "FEHLER: Schnittstelle ax$PORT konnte nicht aktiviert werden."
    exit 1
fi
echo "Erfolg! Schnittstelle ax$PORT ist aktiv."
echo

# 3. Temporäres 'expect'-Skript für den Versand erstellen
cat > "$AUTO_SENDER_SCRIPT" <<-EOF
#!/usr/bin/expect -f
set timeout 360
spawn call $PORT $TARGET_CALL
expect "connected" {
    send_user "\n\nERFOLG: Verbindung zur ISS hergestellt! Sende Nachricht...\n"
} timeout {
    send_user "\n\nFEHLER: Zeitlimit überschritten. Keine Verbindung.\n"
    exit 1
}
sleep 1
send "S $RECIPIENT_CALL\r"
sleep 2
send "Welcome to the ISS!\r"
sleep 2
send "Hello Kimiya-san, welcome to the ISS! Greetings from Grimma, Germany. Hope you have a great mission. 73 de $DEIN_CALL.\r"
sleep 2
send "/EX\r"
sleep 3
send_user "\nNachricht gesendet. Trenne die Verbindung...\n"
send "B\r"
expect eof
EOF
chmod +x "$AUTO_SENDER_SCRIPT"

# 4. Temporäre Konfigurationsdatei für screen erstellen
cat > "$SCREEN_CONFIG" <<-EOF
# Starte 'listen' in der ersten Region (links)
screen -t "LISTEN" 0 listen -ac "$PORT"

# Erzeuge einen vertikalen Split
split -v

# Wechsle den Fokus in die neue, rechte Hälfte
focus

# Starte das Automatik-Skript in der zweiten Region
screen -t "AUTO-CALL" 1 ./"$AUTO_SENDER_SCRIPT"

# Setze den Fokus für den Start zurück nach oben/links
focus up
EOF

# 5. Dashboard starten
echo ">>> Starte 'screen'-Dashboard..."
echo "Steuerung: [Strg]+[A], dann [D] zum Verlassen."
echo
read -p "DRÜCKE [ENTER], um das Dashboard zu starten..."

screen -c "./$SCREEN_CONFIG"

# 6. Aufräumen, nachdem screen beendet wurde
rm "./$AUTO_SENDER_SCRIPT"
rm "./$SCREEN_CONFIG"
echo "Dashboard beendet und temporäre Dateien gelöscht."

```

## The Final Attempts: A Perfect System Meets Reality

Armed with this final, rock-solid script, I went into the last few passes. The dashboard worked like a charm. I could watch packets pouring in from stations all over Europe on the left, while on the right my script patiently waited for an opening to fire off a connect attempt.

Unfortunately, the outcome stayed the same. Despite textbook passes and a technically flawless setup, the traffic jam at the ISS mailbox was simply too dense.

## Conclusion: Failing Successfully

So, right before heading off to Japan, here's my verdict: the mission to make contact has **failed—for now**. But the project itself was a **complete success**. Not only did I learn a ton about the quirks of the Packet Radio protocol, I also built and field-tested a fully automated satellite communication setup from scratch.

The hunt isn't over; it's just on pause. Once I'm back from Japan, I'll pick an "inconvenient" pass—maybe late on a Tuesday night when the bands are quieter. And then, with my ready-to-roll script in my pocket, I'll try again.
